# Chuẩn bị demo công khai trên GitHub và Render

Dự án chỉ triển khai khi chủ tài khoản xác nhận chi phí trong màn hình Render. `render.yaml` tạo một web service, một worker và một PostgreSQL ở Frankfurt. Theo [bảng giá Render](https://render.com/pricing) và [mã gói](https://render.com/docs/compute-plans) được xem ngày 23/10/2026, hai dịch vụ 512 MB khoảng 7 USD/tháng mỗi dịch vụ và PostgreSQL 256 MB khoảng 6 USD/tháng: tổng cơ bản khoảng **20 USD/tháng**, chưa tính băng thông, dung lượng tăng thêm hoặc gói workspace nếu có. Giá cuối cùng xem trong Render Dashboard trước khi tạo. Tên miền riêng chưa cần: web sẽ có URL HTTPS `onrender.com`.

## Trước khi kết nối

1. Tạo repository **private** trên GitHub và đẩy nhánh `main`. `.gitignore` loại `.env`, `.local`, backup, kết quả test và output tạm. Không đăng mật khẩu, token hoặc dữ liệu đơn lên GitHub.
2. Trong Render, chọn **New → Blueprint**, kết nối repository và xem kỹ giá của ba tài nguyên trước khi xác nhận tạo. `render.yaml` giữ `APP_ENV=demo`.
3. Điền biến bí mật trong Render Dashboard: `APP_URL` là URL HTTPS của web service; `ADMIN_EMAIL` và `ADMIN_PASSWORD` là tài khoản owner demo riêng; SMTP là hộp gửi thử do bạn kiểm soát. `SESSION_SECRET` được Render tạo tự động. Không gửi các giá trị này qua chat hoặc lưu vào Git.
4. Sau khi biết URL `onrender.com`, cập nhật `APP_URL` **cả web và worker**, rồi redeploy. API so sánh Origin với `APP_URL`, nên đặt sai URL sẽ làm checkout hoặc thao tác admin bị từ chối.
5. Pre-deploy sẽ chạy migration, khởi tạo cài đặt, rồi chỉ nhập menu/ảnh Dolný Štál khi database trống. Tài khoản owner chỉ được tạo nếu chưa có người dùng và đã đặt `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Sau lần đầu, xóa hai biến mật khẩu tạo tài khoản khỏi Render và đổi mật khẩu trong admin.

Blueprint đặt `TRUST_PROXY=render` để giới hạn lượt gọi theo IP khách qua header `CF-Connecting-IP` do lớp Cloudflare của Render ghi. Nếu chuyển sang nhà cung cấp khác, đổi cấu hình và kiểm tra lại nguồn IP tin cậy trước khi mở truy cập công khai.

## Kiểm tra sau triển khai

- Mở `/`, `/menu`, `/informacie` bằng trình duyệt ẩn danh và điện thoại. Xác nhận logo, font, ảnh, giá EUR và nhãn demo.
- Kiểm tra `/api/health` trả `database: true`, `worker: true`. Nếu worker chưa chạy, chờ rồi thử lại; không dùng HTTP 200 một mình để kết luận worker khỏe.
- Dùng **tên, số điện thoại và địa chỉ giả** để thử một đơn đến lấy và một đơn giao trong giờ nhận đơn Slovakia. Kiểm tra đơn trong admin, email trong hộp thử, gọi/xác nhận, theo dõi và hủy đơn chờ.
- Xác nhận người xem không có tài khoản admin. Không chia sẻ tài khoản owner demo qua link công khai.
- Thiết lập backup cho PostgreSQL và cảnh báo health trước khi lưu đơn có dữ liệu thật. Không dùng database free hết hạn cho dữ liệu cần giữ lâu.

## Tên miền riêng về sau

Thêm tên miền vào web service ở Render, làm theo chỉ dẫn DNS của Render và kiểm tra HTTPS. Đổi `APP_URL` ở web và worker sang URL chính thức sau khi DNS hoạt động. Thử lại đăng nhập admin, checkout và link theo dõi vì các luồng này phụ thuộc URL gốc.

## Lưu ý

`APP_ENV=demo` vẫn lưu các đơn thử vào database. Giao diện ghi rõ đây là demo nhưng người xem vẫn có thể nhập dữ liệu thật, vì vậy hãy chỉ mời nhóm thử nghiệm và hướng dẫn dùng dữ liệu giả. Nội dung menu, dị ứng, phí bao bì và văn bản pháp lý chưa được nhà hàng phê duyệt cho mở bán.
