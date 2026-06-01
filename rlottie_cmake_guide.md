Dưới đây là hướng dẫn chi tiết cách build `rlottie` và tạo binding Python để tích hợp với **Mouse Pet** sử dụng hoạt ảnh từ Lottie:

---

## 🛠️ 1. Build `rlottie` từ source

`rlottie` là một thư viện nhẹ, hiệu suất cao để hiển thị các hoạt ảnh Lottie (JSON vector animation). Để tích hợp được vào Python, bạn cần build thư viện này dưới dạng shared object (`.so` hoặc `.dll`).

### Bước 1. Clone `rlottie`

```bash
git clone https://github.com/Samsung/rlottie.git
cd rlottie
```

### Bước 2. Tạo thư mục build và compile

```bash
mkdir build
cd build
cmake ..
make -j$(nproc)
```

Sau khi build thành công, bạn sẽ có:

* `build/src/librlottie.so` (Linux)
* `build/src/Debug/rlottie.dll` (Windows, nếu build bằng MSVC)
* `build/src/librlottie.dylib` (macOS)

---

## 🧩 2. Tạo binding Python với `ctypes` (hoặc `cffi`/`pybind11`)

Ở đây ta sẽ dùng `ctypes` cho đơn giản, nhưng bạn có thể chuyển sang `pybind11` nếu muốn binding mạnh hơn.

### Bước 1. Giao diện C đơn giản để gọi từ Python

Trong thư mục `rlottie/src`, tạo file mới `rlottie_capi.h`:

```c
#ifdef __cplusplus
extern "C" {
#endif

void* rlottie_from_file(const char* filename, int width, int height);
bool rlottie_render_frame(void* player, size_t frame_num, uint32_t* buffer);
size_t rlottie_total_frames(void* player);
void rlottie_destroy(void* player);

#ifdef __cplusplus
}
#endif
```

Sau đó thêm file tương ứng `rlottie_capi.cpp`:

```cpp
#include "rlottie_capi.h"
#include "lottieplayer.h"

void* rlottie_from_file(const char* filename, int width, int height) {
    auto player = new LOTLayer();
    player->loadFromFile(filename, width, height);
    return static_cast<void*>(player);
}

bool rlottie_render_frame(void* player, size_t frame_num, uint32_t* buffer) {
    auto p = static_cast<LOTLayer*>(player);
    if (!p) return false;
    return p->render(frame_num, buffer);
}

size_t rlottie_total_frames(void* player) {
    auto p = static_cast<LOTLayer*>(player);
    return p ? p->totalFrames() : 0;
}

void rlottie_destroy(void* player) {
    delete static_cast<LOTLayer*>(player);
}
```

Thêm những file này vào CMakeLists.txt:

```cmake
add_library(rlottie_capi SHARED rlottie_capi.cpp)
target_link_libraries(rlottie_capi rlottie)
```

Build lại:

```bash
cd build
cmake ..
make -j$(nproc)
```

---

## 🐍 3. Gọi từ Python bằng `ctypes`

Ví dụ đơn giản sử dụng binding:

```python
import ctypes
import numpy as np

lib = ctypes.CDLL('./build/src/librlottie_capi.so')

# prototype
lib.rlottie_from_file.restype = ctypes.c_void_p
lib.rlottie_render_frame.argtypes = [ctypes.c_void_p, ctypes.c_size_t, ctypes.POINTER(ctypes.c_uint32)]
lib.rlottie_total_frames.argtypes = [ctypes.c_void_p]
lib.rlottie_total_frames.restype = ctypes.c_size_t
lib.rlottie_destroy.argtypes = [ctypes.c_void_p]

# load animation
player = lib.rlottie_from_file(b"example.json", 128, 128)
frame_count = lib.rlottie_total_frames(player)

for frame in range(frame_count):
    buffer = (ctypes.c_uint32 * (128 * 128))()
    lib.rlottie_render_frame(player, frame, buffer)

    image = np.ctypeslib.as_array(buffer).reshape((128, 128))
    # sử dụng image như một frame RGBA32

lib.rlottie_destroy(player)
```

---

## ✅ Gợi ý tích hợp

* Đưa đoạn render frame vào `QImage.fromData()` hoặc `QPixmap.fromImage()` trong PyQt/PySide để gắn lên màn hình.
* Kết hợp với `QTimer` để điều khiển animation.
* Có thể cache frame để tăng hiệu suất với các hoạt ảnh ngắn lặp lại.

---

Nếu bạn muốn binding mạnh hơn (e.g. object-oriented, truyền thông tin vector hoặc gradient), hãy dùng `pybind11`.
