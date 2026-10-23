# VietFood — bản thiết kế tích hợp ngày 22/10/2026

Website local: http://localhost:3000/ · Menu: http://localhost:3000/menu

## Thiết kế đã áp dụng

- Trang chủ nền trắng ngà, tiêu đề Georgia, nội dung Arial; màu nâu đỏ dùng cho nút và lựa chọn. Không tải font bên ngoài.
- Hero chuyển ảnh Mori Set/Phở theo thao tác, giữ ảnh trước đến khi ảnh mới tải xong. Dải 6 món trượt ngang bằng tay; giới thiệu và thông tin ghé quán nằm phía dưới.
- Menu riêng gom 27 danh mục nguồn thành 7 nhóm; mặc định Phở & rezance. Tìm kiếm toàn menu không phân biệt dấu, tối đa 12 món/trang. URL giữ group/category/q/page; liên kết cũ /#menu dẫn sang /menu.
- Dòng món có ảnh thu nhỏ nếu có; ảnh hỏng hoặc thiếu không dùng placeholder món ăn. Mọi món đang bật vẫn truy cập được.
- Chi tiết và giỏ hàng mở thành bảng bên phải trên desktop, từ dưới trên điện thoại. Giỏ hàng có cột riêng ở trang menu từ 1.200 px. Chỉ hiện một bảng tương tác tại một thời điểm.
- Giỏ dùng chung giữa các trang khách, giữ định dạng vf_cart. Checkout hiển thị tên lựa chọn và giá dòng; liên kết sửa giỏ trở về đúng trạng thái menu.
- Hiệu ứng ngắn, hỗ trợ giảm chuyển động; vùng chạm chính tối thiểu 44 px. CSS mới giới hạn trong giao diện khách; admin giữ giao diện vận hành.

## Dữ liệu và nội dung cần bổ sung

Dữ liệu nhập có 174 món đang bật, 163 món có ảnh riêng và 11 món thiếu ảnh; 80 món chưa có mô tả. Danh sách chi tiết ở `MENU_CONTENT_REVIEW.csv`; tạo lại bằng `node scripts/report-menu-content.mjs`.

Tên, giá, khẩu phần, dị ứng và tùy chọn lấy từ GET /api/menu; không ghi đè database bằng nội dung biên tập của concept. Hai ảnh sushi dùng bản ảnh khác đã lưu của cùng món, cùng chi nhánh. Không thêm nhãn “bán chạy” hoặc thông tin ăn chay chưa được xác nhận.

Khẩu phần Bento đang có khác biệt giữa dữ liệu nguồn và bản concept trước. Bản tích hợp hiển thị đúng dữ liệu API hiện có; cần chủ quán duyệt lại trước mở bán. Các thông tin dị ứng chưa xác nhận tiếp tục hiển thị nguyên ghi chú nguồn; không biến dữ liệu trống thành tuyên bố an toàn dị ứng.

Chưa có ảnh không gian thật trong bộ ảnh; phần giới thiệu dùng ảnh món. Không tạo ảnh quán giả.

## Vận hành bản thử

Chạy database bằng `npm run local:db`, hộp thư thử bằng `npm run local:mail`, ứng dụng bằng `npm run dev`; worker đơn hàng dùng `npm run worker` khi thử chu trình nhắc/hết hạn. Không chạy hai tiến trình cùng loại trên cùng cổng.

Giữ APP_ENV=demo và quy trình duyệt nội dung hiện có. Chưa dùng tên miền thật, chưa gửi email cho nhà hàng thật và chưa mở bán. Bộ lọc/menu mới không thay đổi giá phía server, lịch lấy món, phí giao hay quy trình xác nhận đơn.

## Kiểm tra

`npm run test`, `npm run test:db`, `npm run typecheck`, `npm run build`, `npm run test:e2e`.

Kiểm tra trình duyệt bao gồm desktop và cấu hình điện thoại, 5 chiều rộng 360/390/768/1280/1440, ảnh hỏng, lỗi menu và thử lại, món hết, tìm kiếm không dấu, phân trang, tùy chọn món, giữ giỏ sau tải lại, quay về menu từ checkout, Escape và trả focus. Kiểm tra nghiệp vụ vẫn dùng database test riêng; đơn browser thử chỉ chạy trong database demo local.

Ảnh đầu ra ở `.local/previews/redesign-*`. Đây là kiểm tra bằng trình duyệt giả lập kích thước, chưa thay thế nghiệm thu Safari iPhone và tablet vật lý. Bản concept độc lập ở cổng 3001 vẫn là tài liệu tham khảo; giao diện tích hợp mới ở cổng 3000.

Kết quả nghiệm thu tự động ngày 22/10/2026: 20 kiểm tra đơn vị, 13 kiểm tra PostgreSQL và 20 kiểm tra trình duyệt đều qua; production build và kiểm tra TypeScript thành công. Bộ browser đã thử cả đơn giao báo phí qua điện thoại và đơn đến lấy được hủy khi chờ, trong môi trường demo local.
