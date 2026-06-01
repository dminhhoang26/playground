Script dưới đây tạo một mirror clone, dùng git-filter-repo nếu có, nếu không sẽ thử dùng BFG.
Sau khi rewrite history, script dọn rác và force push tất cả branch và tag lên remote.
Script yêu cầu bạn xác nhận đã rotate secret bằng biến môi trường
`SECRET_ROTATED=yes`

Hướng dẫn chạy nhanh
Revoke/rotate secret trên dịch vụ tương ứng.

Lưu script vào file, ví dụ remove-secret.sh, rồi chmod +x remove-secret.sh.

Thiết lập biến và chạy:

```bash
export SECRET_ROTATED=yes
./remove-secret.sh
```
