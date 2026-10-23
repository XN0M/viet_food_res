# Demo giao diện tĩnh — không cần backend

Thư mục [`preview/`](../preview/) là bản chụp từ **giao diện Gemini hiện tại**, gồm trang chủ, trang thông tin và 18 trang menu. Cả 174 món đang bật đều có mặt. Ảnh, font và CSS nằm trong thư mục này; khách xem không gọi API, không gửi đơn, không đăng nhập admin. Banner trên mỗi trang nói rõ đây chỉ là bản xem thiết kế.

Đây là phương án để gửi link xem trước giao diện mà chưa cần trả phí cho web service, worker và PostgreSQL. Đẩy mã lên GitHub **chưa tự tạo website**; cần thêm một dịch vụ hosting tĩnh.

## Đưa lên Render Static Site

1. Đẩy repository lên GitHub. Repository có thể để **private** và kết nối tài khoản GitHub với Render.
2. Trong Render chọn **New → Static Site**, chọn repository và nhánh `main`. Không chọn Blueprint trong bước này vì `render.yaml` dành cho hệ thống đặt món đầy đủ có tài nguyên trả phí.
3. Đặt **Build Command** là `echo "Static preview ready"`, **Publish Directory** là `preview`. Thêm biến môi trường `SKIP_INSTALL_DEPS=true` để không cài package khi chỉ phát tệp tĩnh.
4. Tạo Static Site, lấy URL HTTPS `*.onrender.com` và gửi cho người cần xem. Chưa cần mua tên miền. Kiểm tra trang chủ, Menu và Thông tin trên điện thoại.

Theo [tài liệu Render Static Sites](https://render.com/docs/static-sites), hosting tĩnh được triển khai miễn phí, có URL `onrender.com`; mức sử dụng băng thông và phút build vẫn chịu giới hạn của workspace. Nội dung trang được công khai qua link dù repository private.

## Cập nhật bản xem trước

Khi giao diện hoặc dữ liệu menu thay đổi, chạy website local với database demo, rồi chạy:

```powershell
npm run preview:export
python -m http.server 4173 --bind 127.0.0.1 --directory preview
```

Trong terminal khác, kiểm tra `http://127.0.0.1:4173` và chạy `npm run preview:verify`; sau đó commit thư mục `preview/` và push. Render cập nhật Static Site khi có commit mới. `preview:verify` kiểm tra đủ món, ảnh/CSS, lỗi trình duyệt và bố cục ở desktop/mobile.

Đây là bản chụp dữ liệu tại thời điểm xuất, không đồng bộ với database về sau. Giá, tình trạng món và nội dung pháp lý vẫn cần nhà hàng duyệt trước khi mở đặt món thật.
