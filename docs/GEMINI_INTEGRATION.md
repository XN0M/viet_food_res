# Tích hợp giao diện Gemini — VietFood Dolný Štál

Ngày kiểm tra: 23/10/2026. Phạm vi: website local, `APP_ENV=demo`.

## Kết quả

- `gemini_design.tsx` là bản tham chiếu gốc, không chạy như ứng dụng đặt món. Giao diện khách hiện dùng nền kem, cam đất, header trong mờ, hero ảnh món lớn, thẻ menu bo tròn, dải hướng dẫn nền tối và giỏ hàng dạng ngăn kéo.
- Trang chủ có sáu món theo ID đã chọn từ API. Menu đầy đủ ở `/menu`, bảy nhóm, danh mục con, tìm kiếm toàn menu không dấu, URL trạng thái và tối đa 12 món mỗi trang. Món không có ảnh hiển thị thẻ chữ.
- Giá, ảnh, tình trạng bán, lựa chọn và dị ứng lấy từ menu chi nhánh. Form đặt món mô phỏng, đánh giá, điểm số, calories và các tuyên bố về nguyên liệu trong Gemini không dùng làm dữ liệu thật.
- Giỏ dùng định dạng `vf_cart`; checkout vẫn báo giá qua server, giữ hai cách nhận món và xác nhận qua điện thoại. Trang theo dõi và admin giữ nghiệp vụ hiện có.
- Hai font Cormorant Garamond và Plus Jakarta Sans được lưu ở `public/fonts/` kèm giấy phép OFL, không tải từ Google Fonts khi khách mở trang.

## Kiểm tra

- TypeScript: đạt. Build Next.js: đạt sau khi chạy lại lệnh theo cảnh báo bảo mật của Next.
- Vitest: 20/20 đạt. Kiểm thử PostgreSQL và SMTP local: 13/13 đạt.
- Playwright sau đổi giao diện: 16/16 bài trang chủ, menu, responsive và hydration; 2/2 bài giỏ/checkout; 2/2 bài admin theo quyền. Các bài tạo đơn E2E tự bỏ qua khi website đang ngoài giờ nhận đơn tại Slovakia. Bộ kiểm thử đơn đã được chạy trước lần đổi giao diện; nghiệp vụ/API không thay đổi trong lần này.
- Đã xem ảnh desktop và mobile ở chiều rộng 360, 390, 768, 1280 và 1440 px, không tràn ngang. Ảnh nghiệm thu nằm trong `.local/previews/`: `redesign-home-*`, `redesign-menu-*`, `redesign-detail-*`, `gemini-cart-*`, `gemini-checkout-*`.

## Cần hoàn thiện trước mở bán

- Nhà hàng duyệt nội dung menu, dị ứng, mức phí bao bì và thông tin liên hệ/chính sách. Danh sách nội dung cần duyệt ở `docs/MENU_CONTENT_REVIEW.csv`.
- Bản này vẫn là demo local. Chưa kiểm thử cuộc gọi, giao hàng, thanh toán hoặc thiết bị Safari thật.
- Trước khi chuẩn bị demo công khai, Next.js đã được nâng lên 16.4.2; `npm audit --omit=dev` không còn báo lỗ hổng và build đã chạy lại thành công.
