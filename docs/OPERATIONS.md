# Vận hành và bàn giao

## Ca trực

1. Đăng nhập admin, bật âm thanh, kiểm tra Internet và cảnh báo worker.
2. Có đơn: mở chi tiết, gọi số khách, xác nhận món/giờ và tổng tiền. Ngoài vùng tự tính: nhập phí giao, đọc tổng khách và ghi nhận đồng ý.
3. Chỉ bấm nhận sau cuộc gọi. Nếu khách không nghe, ghi kết quả; đơn vẫn chờ. Nếu hết món, báo quản lý và từ chối có lý do hoặc gọi thống nhất yêu cầu mới, không tự thay món.
4. Phân biệt ngày đặt/ngày lấy; không chuẩn bị đơn hẹn ngày mai ngay hôm nay.
5. Cập nhật tiến độ; chỉ đánh dấu thu tiền khi đã nhận tiền mặt hoặc quầy đã quẹt thẻ thành công.
6. Khi quá tải/hết nguyên liệu, quản lý tạm dừng nhận đơn hoặc tắt món. Cuối ca kiểm tra đơn đã nhận chưa hoàn tất.

## Sự cố

- **Email lỗi:** vẫn nhận đơn trên dashboard. Xem số lỗi và log SMTP, không gửi lại đơn khách. Quản trị có thể reset một Outbox FAILED sau khi sửa SMTP bằng công cụ database có kiểm soát; không reset NEW khi đơn đã kết thúc.
- **Worker lỗi:** kiểm tra tiến trình và database, khởi động lại worker. Các hạn được kiểm tra lại, không khôi phục đơn đã hết hạn thành chờ.
- **Mất Internet:** bật mạng dự phòng; không bấm xác nhận nếu chưa thấy kết quả thành công. Khi kết nối lại, kiểm tra trạng thái trước gọi/nhận tiếp.
- **Khách không đến/không liên lạc được:** nhân viên ghi chú; quản lý quyết định xử lý theo chính sách đã duyệt.
- **Rò rỉ tài khoản:** OWNER vô hiệu hóa tài khoản để thu hồi mọi session, điều tra lịch sử và cấp lại tài khoản qua kênh an toàn.

## Backup và restore

Production: bật backup tự động hàng ngày tại dịch vụ database và thiết lập cảnh báo backup thất bại. Lưu bản sao mã hóa với quyền riêng; ghi rõ thời hạn giữ. Đây là việc cấu hình trên tài khoản hosting, không được coi là đã bật chỉ vì có mã nguồn.

Phiên bản mới chạy `db:migrate` rồi `db:init` để tạo cấu hình mặc định an toàn. Production không chạy demo seed hoặc demo-access; tạo tài khoản thực và import menu được duyệt. Khi đổi APP_ENV để mở bán, build/deploy lại để metadata robots phù hợp.

Với Docker local, chạy `scripts/backup.ps1` tạo file dump dưới `backups/` (đã gitignore). `scripts/restore-check.ps1 -BackupFile <đường dẫn>` chỉ restore vào database `vietfood_restore_check` và so sánh số đơn đã ghi trong metadata lúc backup. Không ghi đè database đang chạy.

Sau khi restore, kiểm tra đơn gần nhất, giá, trạng thái và lịch sử; vô hiệu hóa gửi email trên môi trường restore để tránh phát lại thông báo. Restore production cần người phụ trách xác định khoảng mất dữ liệu và đối chiếu đơn phát sinh trong thời gian sự cố.

## Dữ liệu và thời hạn lưu

Chủ nhà hàng duyệt `retentionDays` cùng nhu cầu chứng từ. Công cụ `npm run data:purge` mặc định dry-run; thêm `-- --apply` để xóa dữ liệu đơn đã kết thúc quá hạn, bao gồm sự kiện và outbox. Không dùng trước khi xác nhận căn cứ/thời hạn lưu và lưu trữ chứng từ riêng. Lên lịch chạy hàng ngày trong môi trường production sau duyệt. Backup cũng phải có thời hạn lưu tương ứng; không bảo đảm yêu cầu xóa nếu giữ backup vô thời hạn.

## Cập nhật

Trên Windows, dừng web và worker trước `prisma generate`/build vì tiến trình đang chạy giữ Prisma DLL. Database có thể tiếp tục chạy. Build xong khởi động lại web và worker.

Thử trên staging → chạy unit/integration/E2E và build → backup → migrate deploy → release web/worker → kiểm tra health/đơn thử. Không sửa migration đã áp dụng. Thay đổi giá/menu cần nội dung được nhà hàng duyệt; nhập menu mới đặt lại cờ contentApproved.

## Việc chưa thể xác nhận bằng máy phát triển

Tuyến email thật, cấu hình DNS/tên miền, quyền tài khoản hosting, thiết bị vật lý, nội dung nhà hàng và các chính sách pháp lý cần chủ dự án/nhà hàng cung cấp và nghiệm thu. Kiểm thử browser giả lập không thay thế nghiệm thu Safari iPhone hoặc thiết bị quầy thật.
