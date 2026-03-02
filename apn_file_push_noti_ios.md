# As of Xcode 11.4, you can test push notifications on the iOS Simulator by simulating the arrival of a remote notification locally. There are three primary ways to achieve this: 
1. Drag and Drop an .apns File 
The simplest method is to create a file with a .apns extension and drag it directly into the running simulator window. 

File Structure: The JSON payload must include the Simulator Target Bundle key to identify your app.
```json
{
  "Simulator Target Bundle": "com.yourcompany.yourapp",
  "aps": {
    "alert": {
      "title": "Test Title",
      "body": "This is a test notification"
    },
    "sound": "default",
    "badge": 1
  }
}
```
 
2. Use the Command Line (simctl) 
You can trigger a notification using the xcrun simctl push command from your Mac terminal. 

With a Payload File:
`xcrun simctl push booted com.yourcompany.yourapp payload.json`
Without a File (Inline JSON):
`echo '{"aps":{"alert":"Hello!"}}' | xcrun simctl push booted com.yourcompany.yourapp -`
Note: Using booted targets the currently active simulator. 

3. Third-Party Tools
Several tools provide a graphical interface to make this process easier without manual JSON editing or terminal commands: 
- RocketSim: Adds a side panel to your simulator to trigger saved payloads with one click.
- ControlRoom: A Mac app by Paul Hudson that allows you to control many simulator features, including push. 

Important Prerequisites
- Permissions: Ensure your app has requested and been granted notification permissions.
- Background State: Most notifications are best tested while the app is in the background or the device is on the lock screen.
- Remote Notifications (Xcode 14+): If you are on a Mac with Apple Silicon (or T2 chip) running macOS 13+ and the simulator is on iOS 16+, you can actually receive real remote notifications via the Apple Push Notification Service (APNs) sandbox environment. 


# Để tạo file .apns mô phỏng cấu trúc của OneSignal (bao gồm cả dữ liệu tùy chỉnh - additional data), bạn cần sử dụng các key đặc thù như custom, i, và a mà SDK OneSignal yêu cầu để nhận diện payload. 

Dưới đây là mẫu file .apns chuẩn OneSignal để bạn copy và sử dụng:
Mẫu File `onesignal_test.apns`
```json
{
  "Simulator Target Bundle": "com.yourcompany.yourapp",
  "aps": {
    "alert": {
      "title": "Thông báo từ OneSignal",
      "body": "Nội dung kiểm tra có chứa dữ liệu bổ sung."
    },
    "sound": "default",
    "badge": 1,
    "mutable-content": 1
  },
  "custom": {
    "i": "550e8400-e29b-41d4-a716-446655440000",
    "a": {
      "key1": "value1",
      "my_custom_id": 12345,
      "discount_code": "PROMO2024"
    },
    "u": "myapp://deep-link-url"
  }
}
```

Giải thích các thành phần:
- `Simulator Target Bundle`: Phải khớp chính xác với Bundle Identifier trong Xcode của bạn để simulator biết gửi thông báo vào app nào.
- `aps`: Chứa các thông tin hiển thị tiêu chuẩn của Apple.
  - `mutable-content`: Đặt thành 1 nếu bạn muốn kích hoạt Notification Service Extension (dùng để hiển thị hình ảnh hoặc theo dõi lượt nhận từ OneSignal).
- `custom`: Đây là phần OneSignal dùng để đóng gói dữ liệu riêng:
  - `i` (notificationId): Một chuỗi UUID bất kỳ. OneSignal cần cái này để xác định duy nhất mỗi thông báo.
  - `a` (additionalData): Nơi chứa các cặp Key-Value mà bạn thiết lập trong phần "Additional Data" trên Dashboard của OneSignal.
  - `u` (url): Dùng cho tính năng Launch URL (Deep linking). 

Cách sử dụng:
Lưu nội dung trên thành file có đuôi `.apns` (ví dụ: `test.apns`).
Mở iOS Simulator và đảm bảo app của bạn đã được cài đặt và cấp quyền thông báo.
Kéo và thả trực tiếp file `.apns` vào cửa sổ Simulator. 
