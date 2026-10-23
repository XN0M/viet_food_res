# Báo cáo thử đặt món và chức năng — 22/10/2026

## Kết quả

Các lượt kiểm tra cuối đều thành công: **28 lượt trình duyệt**, **20 kiểm tra đơn vị**, **13 kiểm tra PostgreSQL**, cùng `npm run typecheck`. Không phát hiện lỗi chức năng của ứng dụng trong các tình huống đã kiểm tra.

28 lượt trình duyệt gồm 22 lượt từ bộ hiện có và 6 lượt bổ sung cho tăng/giảm giỏ hàng, email và hoàn tất đơn. Chạy trên Chromium desktop và cấu hình điện thoại iPhone 13 bằng Chromium; chưa phải thử trên Safari iPhone hoặc tablet vật lý.

## Môi trường và dữ liệu thử

- Ứng dụng local cổng 3000; APP_ENV=demo, database và worker báo hoạt động.
- Tại thời điểm thử, web đang trong giờ nhận đơn; có 174 món đang bán và khung giờ đến lấy hợp lệ.
- SMTP chỉ gửi vào hộp thư thử local cổng 1028/8028; không gửi email cho nhà hàng thật.
- Dùng khách `Test browser`, `Test pickup`, `Test lifecycle` và số điện thoại giả. Thao tác gọi điện được mô phỏng bằng việc ghi nhận kết quả cuộc gọi trong admin, không thực hiện cuộc gọi thật.
- Kiểm tra database dùng riêng `vietfood_test`; không xóa đơn ở database demo hoặc dữ liệu khách khác.

## Các chức năng đã thử

| Tình huống | Kết quả xác minh |
| --- | --- |
| Trang chủ và ảnh nổi bật | Hiển thị 6 món, ảnh tải được, chuyển Sushi/Phở hoạt động |
| Tìm kiếm và phân nhóm | Tìm không dấu trên toàn menu, 7 nhóm, tối đa 12 món/trang, lưu trạng thái URL |
| Món không ảnh và ảnh lỗi | Món vẫn tìm được, vẫn mở chi tiết được |
| Menu lỗi và món hết | Có thử lại; món hết không thêm được |
| Tùy chọn món | Chọn phụ liệu, giỏ và checkout giữ tên lựa chọn |
| Giỏ nhiều dòng | Thêm cùng món gộp số lượng, món khác giữ dòng riêng |
| Số lượng và xóa | Tăng/giảm cập nhật tổng; xóa riêng từng món; xóa hết trở về giỏ trống |
| Tải lại và quay lại | Giỏ giữ sau tải lại; từ checkout quay về đúng tìm kiếm/nhóm menu |
| Đơn đến lấy | Chọn khung giờ, nhập khách, xem giá, gửi yêu cầu, xuất hiện trang theo dõi |
| Hủy khi chờ | Khách hủy thành công và thấy trạng thái đã hủy |
| Đơn giao hàng | Nhập địa chỉ, tiền mặt, gửi yêu cầu chờ chốt phí; nhân viên nhập phí và giờ dự kiến |
| Email nội bộ | Worker gửi email chứa đúng số đơn và tên khách thử vào hộp thư local |
| Ghi cuộc gọi | Ghi chưa liên lạc được vẫn giữ đơn đang chờ |
| Điều kiện xác nhận | Chặn xác nhận nếu chưa ghi nhận đã liên hệ khách; yêu cầu đồng ý phí khi cần báo giá |
| Hủy sau xác nhận | Request hợp lệ của khách bị từ chối 409; request thiếu Origin bị từ chối 403 |
| Chu trình đến lấy | Chờ → xác nhận → chuẩn bị → sẵn sàng lấy → hoàn tất |
| Chu trình giao hàng | Chờ → xác nhận → chuẩn bị → đang giao → hoàn tất |
| Thu tiền | Nhân viên đánh dấu đã thu; trang khách hiển thị đã thanh toán, trạng thái hoàn tất |
| Phân quyền | Nhân viên không dùng được cấu hình quản lý; khách chưa đăng nhập không đọc được đơn admin |
| Hydration | Không phát hiện mismatch trong trình duyệt sạch trên các trang khách/admin đã thử |
| Responsive và thao tác | Thử chiều rộng 360/390/768/1280/1440, giảm chuyển động, Escape, trả focus; không tràn ngang toàn trang |

## Kiểm tra nghiệp vụ phía server

13 kiểm tra PostgreSQL xác minh gửi lại không tạo trùng, bản chụp món không thay đổi theo menu, chống nhận đơn sai giá/hết món/tạm dừng, yêu cầu đồng ý phí, khách hủy đồng thời với nhân viên nhận, hết hạn, nhắc 5/30 phút, token riêng, quyền quản lý, bảo vệ khi mở bán và email có thử lại.

Phí giao 0 €/3 €/chờ báo phí được kiểm tra với tọa độ mô phỏng trong database test. Bài thử trình duyệt giao hàng thực hiện nhánh chờ báo phí và nhập phí thỏa thuận 4 € cho dữ liệu thử. Đây không phải việc chốt chính sách giao hàng hoặc tọa độ nhà hàng thật.

## Lệnh và bằng chứng

```text
npm run test
npm run test:db
npm run test:e2e
npm run test:e2e -- e2e/operations.spec.ts
npm run typecheck
```

Lần chạy toàn bộ trước khi bổ sung operations có 22 lượt qua. Bộ operations mới nhất có 6 lượt qua, không bỏ qua tình huống do ngoài giờ. Trong quá trình bổ sung, đã sửa hai giả định của bài kiểm tra: nối lại dòng MIME quoted-printable khi đọc email và gửi Origin hợp lệ khi kiểm tra quy tắc hủy đơn. Không thay đổi ứng dụng để bỏ bảo vệ Origin hoặc che cảnh báo.

Ảnh đối chiếu:

- `.local/previews/test-cart-chromium.png`, `test-cart-mobile.png`
- `.local/previews/test-completed-pickup-chromium.png`, `test-completed-pickup-mobile.png`
- `.local/previews/test-completed-delivery-chromium.png`, `test-completed-delivery-mobile.png`
- `.local/previews/hydration-clean-chromium.png`, `hydration-clean-mobile.png`

Các đơn thử được lưu và mang tên Test để đối chiếu trong admin. Một số đơn tạo ở lần phát triển bài kiểm tra trước đó còn chờ/đã xác nhận; chúng không phải đơn thật. Các lần thử cuối cùng cho cả đến lấy và giao hàng đã hoàn tất và được đánh dấu thu tiền.

## Giới hạn

Chưa kiểm tra email production, cuộc gọi thật, thanh toán thật, định vị địa chỉ thật, Safari iPhone hoặc tablet vật lý. Cảnh báo có thuộc tính `bis_skin_checked` trong hồ sơ trình duyệt người dùng chưa tái hiện trong môi trường sạch; xem `HYDRATION_TROUBLESHOOTING.md`. Website tiếp tục ở demo local, chưa mở bán.
