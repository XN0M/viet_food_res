# Demo giao diện tĩnh — không cần backend

Thư mục [`preview/`](../preview/) là bản chụp từ **giao diện Gemini hiện tại**, gồm trang chủ, trang thông tin và 18 trang menu. Cả 174 món đang bật đều có mặt. Ảnh, font và CSS nằm trong thư mục này; khách xem không gọi API, không gửi đơn, không đăng nhập admin. Banner trên mỗi trang nói rõ đây chỉ là bản xem thiết kế.

Đây là phương án để gửi link xem trước giao diện mà chưa cần trả phí cho web service, worker và PostgreSQL. Đẩy mã lên GitHub **chưa tự tạo website**; cần thêm một dịch vụ hosting tĩnh.

## Đưa lên Render Static Site

1. Đẩy repository lên GitHub. Repository có thể để **private** và kết nối tài khoản GitHub với Render.
2. Trong Render chọn **New → Static Site**, chọn repository và nhánh `main`. Không chọn Blueprint trong bước này vì `render.yaml` dành cho hệ thống đặt món đầy đủ có tài nguyên trả phí.
3. Đặt **Build Command** là `echo "Static preview ready"`, **Publish Directory** là `preview`. Thêm biến môi trường `SKIP_INSTALL_DEPS=true` để không cài package khi chỉ phát tệp tĩnh.
4. Tạo Static Site, lấy URL HTTPS `*.onrender.com` và gửi cho người cần xem. Chưa cần mua tên miền. Kiểm tra trang chủ, Menu và Thông tin trên điện thoại.

Theo [tài liệu Render Static Sites](https://render.com/docs/static-sites), hosting tĩnh được triển khai miễn phí, có URL `onrender.com`; mức sử dụng băng thông và phút build vẫn chịu giới hạn của workspace. Nội dung trang được công khai qua link dù repository private.

## Đưa lên Cloudflare Pages

Cloudflare Pages cũng phù hợp khi chỉ cần chủ quán xem giao diện. Trong Cloudflare Dashboard chọn **Workers & Pages → Create application → Pages → Import an existing Git repository**, kết nối GitHub và chọn repository. Chọn nhánh production `main`, **Framework preset: None**, **Build command: `exit 0`**, **Build output directory: `preview`**; giữ Root directory là thư mục gốc repository. Không chọn preset Next.js và không chạy `npm run build`, vì bản xem trước đã được xuất sẵn và ứng dụng Next.js đầy đủ cần backend/database.

Sau khi deploy, mở URL `*.pages.dev`, kiểm tra `/`, `/menu.html`, `/informacie.html`, ảnh và điều hướng trên điện thoại. Khi push commit mới chứa thay đổi trong `preview/`, Cloudflare tự triển khai lại. Không cần domain riêng, database, worker, SMTP hay biến môi trường bí mật cho bản này. [Hướng dẫn Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/) và [cấu hình build tĩnh](https://developers.cloudflare.com/pages/configuration/build-configuration/) của Cloudflare mô tả các trường trên.

Thư mục `preview/` có dưới 300 tệp, khoảng 10 MB; tại thời điểm kiểm tra nằm dưới [giới hạn Pages Free](https://developers.cloudflare.com/pages/platform/limits/) về số tệp và kích thước từng tệp. File `_headers` thêm `X-Robots-Tag: noindex` và các header bảo mật cho Pages. **Noindex không phải mật khẩu**: URL production `pages.dev` vẫn công khai cho bất kỳ ai có link. Nếu chỉ người được mời mới được xem, cấu hình [Cloudflare Access cho cả production domain](https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain) trước khi chia sẻ; tính năng bảo vệ preview deployment mặc định không bảo vệ production URL.

## Cập nhật bản xem trước

Khi giao diện hoặc dữ liệu menu thay đổi, chạy website local với database demo, rồi chạy:

```powershell
npm run preview:export
python -m http.server 4173 --bind 127.0.0.1 --directory preview
```

Trong terminal khác, kiểm tra `http://127.0.0.1:4173` và chạy `npm run preview:verify`; sau đó commit thư mục `preview/` và push. Render cập nhật Static Site khi có commit mới. `preview:verify` kiểm tra đủ món, ảnh/CSS, lỗi trình duyệt và bố cục ở desktop/mobile.

Đây là bản chụp dữ liệu tại thời điểm xuất, không đồng bộ với database về sau. Giá, tình trạng món và nội dung pháp lý vẫn cần nhà hàng duyệt trước khi mở đặt món thật. Trước khi gửi chủ quán, nhắc rõ giỏ hàng, checkout, trạng thái đơn, email và admin chưa hoạt động trên link tĩnh.
