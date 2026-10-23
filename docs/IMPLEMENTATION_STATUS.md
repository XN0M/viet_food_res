# Bàn giao bản đầu — 12/10/2026

## Đã thực hiện

- Website Slovak với nhận diện nâu đỏ/vàng, menu, tìm kiếm, lựa chọn món và giỏ lưu trong trình duyệt.
- Checkout đến lấy/giao, lịch Slovakia, phí/báo phí, tổng tiền server và chữ ký báo giá chống nhận giá đã thay đổi.
- Theo dõi bằng token riêng, hủy khi chờ, trạng thái riêng với thu tiền.
- Admin responsive, ba vai trò, gọi/ghi cuộc gọi, xác nhận, từ chối, tiến độ, thu tiền, hủy bởi quản lý, lọc ngày lấy.
- Quản lý hết món, tạm dừng, giờ/ngày, phí bao bì, thông tin nhà hàng và nội dung được duyệt.
- PostgreSQL/Prisma với migration; worker 15 giây, outbox SMTP, nhắc 5/30 phút, hết hạn 35 phút hoặc giờ lấy, chống chạy lặp.
- Công cụ nhập menu, tạo tài khoản, đổi mật khẩu, thời hạn lưu (dry-run mặc định), backup/restore và tài liệu vận hành.
- Docker Compose và cấu hình Render Frankfurt; chưa tạo dịch vụ trả phí hoặc deploy công khai.

## Bằng chứng kiểm thử

| Kiểm tra | Kết quả |
|---|---|
| TypeScript | Qua |
| Production build | Qua, Next.js 16.4.0 |
| Unit nghiệp vụ và tách menu chi nhánh | 16/16 qua |
| PostgreSQL integration | 13/13 qua trên vietfood_test |
| Playwright | 12/12 qua, desktop và mobile Chromium |
| Restore dữ liệu | Đối chiếu đủ dữ liệu trên 10 bảng, 6 đơn tại thời điểm snapshot |
| npm audit sau cập nhật | 0 lỗ hổng được báo |
| SMTP local | Thư được nhận trong hộp thử; kiểm tra retry, lease recovery và bỏ lời nhắc hết ý nghĩa |

`npm test` chủ động bỏ qua integration nếu chưa RUN_DB_TESTS=1; kết quả integration đến từ `npm run test:db`, không phải suy ra từ các test bị skip. Sau nhập menu, Playwright đã chạy lại 12/12 với dữ liệu mới. Kho ảnh đã kiểm checksum khi nhập 258 bản ghi MenuImage.

## Giới hạn thực tế

- Docker engine không khởi động được trong phiên này; database chạy PostgreSQL nhúng local và SMTP sink local. Compose/Dockerfile được cung cấp nhưng chưa xác minh bằng một lần Docker build/run.
- Browser mobile Chromium là giả lập kích thước/touch, chưa thay nghiệm thu Safari iPhone hoặc tablet vật lý.
- Đã nhập menu và ảnh công khai chi nhánh theo [MENU_IMPORT.md](MENU_IMPORT.md); dữ liệu giá, dị ứng, định lượng và ảnh vẫn chờ duyệt. Chưa có logo file thật, phí bao bì, liên hệ SMTP production, tọa độ xác nhận và chính sách được duyệt. Hero vẫn dùng SVG minh họa.
- Chưa kiểm thử dịch vụ geocoding thật có key, tuyến email Internet hoặc DNS. Không có email/SMS gửi khách.
- Backup production, tài khoản hosting, tên miền, cảnh báo ngoài hệ thống và lịch purge cần cấu hình khi triển khai thật.

## Dùng thử

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin
- Tài khoản thử ngẫu nhiên: `.local/demo-access.json` (không commit, không dùng live).
- Hộp email local: http://127.0.0.1:8028
- Screenshot desktop/mobile nằm trong `.local/previews/`.

Mọi đơn đang có là đơn thử. Bản này chưa mở bán; `APP_ENV=demo` và cờ contentApproved chưa bật. Khi chuyển live, backend yêu cầu dữ liệu nhà hàng đầy đủ và không cho tài khoản @vietfood.test đăng nhập.

## Tệp hướng dẫn

`README.md`: cài/chạy, cấu hình, import, test và deploy. `docs/OPERATIONS.md`: trực đơn, sự cố, backup, dữ liệu và bàn giao. Khi build trên Windows phải dừng web/worker đang dùng Prisma trước để giải phóng DLL.
