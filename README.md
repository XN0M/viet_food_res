# VietFood Dolný Štál

Thiết kế khách hàng hiện tại theo [`gemini_design.tsx`](gemini_design.tsx); xem [báo cáo tích hợp và ảnh nghiệm thu](docs/GEMINI_INTEGRATION.md).

Hướng dẫn chuẩn bị bản demo GitHub/Render: [DEPLOY_DEMO.md](docs/DEPLOY_DEMO.md).

Website đặt món riêng một chi nhánh. Next.js/TypeScript, PostgreSQL/Prisma, Tailwind, worker Node.js và SMTP. Nội dung khách/admin bằng tiếng Slovak.

## Trạng thái bàn giao

- Mã nguồn bản đầu, môi trường local, migration, seed minh họa, kiểm thử và cấu hình triển khai.
- **Chưa mở bán:** đã nhập menu và ảnh công khai của Dolný Štál vào database local. Giá, định lượng, dị ứng và độ phù hợp ảnh vẫn chờ nhà hàng duyệt. Xem [báo cáo nhập menu](docs/MENU_IMPORT.md). Seed cũ chỉ dành cho thử nghiệm, không dùng để thay bộ dữ liệu này.
- `APP_ENV=demo` hiển thị nhãn thử. Đặt `APP_ENV=live` chỉ sau khi hoàn tất checklist. Chế độ live chặn đơn khi chưa xác nhận bao bì, tọa độ, liên hệ và nội dung.
- Không gửi email/SMS khách. SMTP local là hộp thư thử, không phát tin ra ngoài.

## Chạy trên máy với Docker

Yêu cầu Node.js 22.12+ và Docker Desktop đang chạy Linux containers.

```powershell
Copy-Item .env.example .env
npm.cmd ci
npm.cmd run db:generate
docker compose up -d db mail
npm.cmd run db:migrate
npm.cmd run db:init
npm.cmd run db:seed
```

Thay `SESSION_SECRET` trong `.env` bằng bí mật ngẫu nhiên ít nhất 32 ký tự. Tạo tài khoản owner qua biến môi trường `ADMIN_EMAIL`, `ADMIN_PASSWORD` (ít nhất 12 ký tự), rồi chạy `npm run user:create`. Không đưa mật khẩu vào Git hoặc tài liệu công khai. Xóa biến tạo tài khoản sau khi dùng.

Chạy hai terminal:

```powershell
npm.cmd run dev
npm.cmd run worker
```

- Web: http://localhost:3000
- Admin: http://localhost:3000/admin
- Mailpit: http://localhost:8028
- Chỉ mở local đúng hostname của `APP_URL`, vì API kiểm tra Origin để chống CSRF.
- Có thể chạy web/worker bằng Docker: `docker compose --profile app up -d --build` sau migration/seed. Không chạy đồng thời hai web cùng cổng.

## PostgreSQL dự phòng cho phát triển

Khi Docker không dùng được, `scripts/local-db.mjs` chạy PostgreSQL nhúng trong `.local/`, chỉ nghe loopback. `scripts/dev-mail.mjs` chạy hộp SMTP thử trong bộ nhớ, không chuyển tiếp Internet. Hai công cụ này **không dùng production**. Nội dung thư chỉ xem ở endpoint loopback của công cụ thử.

## Dữ liệu thật

`npm run menu:import -- duong-dan/menu.json` nhận mảng các món với `id`, `name`, `description`, `category`, `priceCents`, `portion`, `allergens`, `image` (đường dẫn local), `sort`, `options`.

```json
[{"id":"pho-bo","name":"Phở Bò","description":"Nội dung Slovak đã duyệt","category":"Polievky","priceCents":850,"portion":"900 ml","allergens":["Ryby"],"image":"/food-bowl.svg","sort":0,"options":[]}]
```

Lựa chọn món: `options: [{id, name, required, choices: [{id, name, priceCents}]}]`; mỗi nhóm chọn một lựa chọn. Giá lưu cent nguyên. Import lưu trữ món cũ không có trong file và đặt lại cờ duyệt nội dung. `active=false` ẩn khỏi menu; `available=false` chỉ đánh dấu hết món. Đây là công cụ nội bộ, không mở API sửa toàn bộ menu cho nhân viên.

Bộ menu hiện tại: `npm run menu:import -- data/menu/dolny-stal.json`, rồi `npm run menu:images:import`. Xem [MENU_IMPORT.md](docs/MENU_IMPORT.md) và [review.csv](data/menu/review.csv). Ảnh nằm trong `public/menu/dolny-stal`, database lưu đường dẫn và metadata thay vì BLOB.

## Quy tắc

- Nhận đơn thứ Hai–thứ Bảy 08:00 đến trước 18:00 theo Europe/Bratislava.
- Đến lấy cách ít nhất 30 phút, bước 15 phút, hôm nay đến ngày kia, loại Chủ nhật; lấy cuối 18:00.
- Giao ngay; ≤5 km miễn phí, >5–≤8 km 3 EUR, >8 km hoặc địa chỉ không xác minh được chờ gọi báo phí.
- Geocoding OpenCage tùy chọn qua `OPENCAGE_API_KEY`. Thiếu key/lỗi/địa chỉ mơ hồ không bị coi là giao miễn phí. Giữ nguyên địa chỉ khách để quầy kiểm tra.
- API tạo đơn tính lại tiền và kiểm tra chữ ký báo giá; không tin tổng tiền từ client. Nếu phí/menu đổi, khách phải xem lại.
- Nhắc phút 5 và 30, hết hạn phút 35 hoặc giờ lấy nếu sớm hơn. Worker chạy mỗi 15 giây; API cũng áp dụng hạn tại thao tác.
- Gọi không được chưa phải xác nhận. Đơn giao chờ phí phải có số phí và sự đồng ý với tổng tiền. Đã xác nhận thì không tự hết hạn.
- Khách được hủy khi còn chờ. Nhận/hủy/hết hạn dùng row lock; một kết quả thắng.
- Admin polling 5 giây; khách 10 giây. Chuông cần bật bằng thao tác trên thiết bị; không bảo đảm âm thanh khi browser bị hệ điều hành cho ngủ.

## Tài khoản và bảo mật

OWNER quản lý tài khoản/cấu hình; MANAGER quản lý vận hành; STAFF xử lý đơn. Session hash lưu database, cookie HttpOnly/SameSite Strict, HTTPS bật Secure. Đăng nhập tối đa 10 lần/10 phút theo địa chỉ nguồn. Khi qua reverse proxy, chỉ bật `TRUST_PROXY=true` nếu proxy ghi đè X-Forwarded-For từ khách.

Không ghi dữ liệu cá nhân/token vào log ứng dụng. Trang theo dõi không trả lại điện thoại hay địa chỉ. Link chứa token có quyền xem/hủy khi chờ, cần giữ riêng. Không gắn analytics vào trang này. Nếu thay `SESSION_SECRET`, không retry yêu cầu cũ bằng khóa idempotency đã sử dụng.

SMTP có retry tối đa 5 lần và hiện FAILED trong admin. Message-ID ổn định để hỗ trợ chống trùng; SMTP không bảo đảm exactly-once khi server đã nhận thư nhưng kết nối đứt trước phản hồi. Database luôn giữ đúng một đơn và một sự kiện cho mỗi mốc. Không hứa email đồng nghĩa người nhận đã đọc.

## Kiểm thử

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Test PostgreSQL chỉ chạy khi `RUN_DB_TESTS=1` và `DATABASE_URL` trỏ tới database **vietfood_test**. Test có xóa dữ liệu của database thử này; tuyệt đối không trỏ vào dữ liệu thật. `scripts/test-db.mjs` tự tạo database riêng rồi gọi Vitest integration. E2E chạy trình duyệt bằng Playwright; Chromium phải được cài bằng `npx playwright install chromium`.

Kiểm thử integration cần hộp SMTP local đang chạy. Bộ E2E kiểm tra an toàn localhost/demo trước khi chạy; các ca gửi đơn có thể bỏ qua nếu ngoài giờ phục vụ. Khởi tạo tài khoản thử với `tsx scripts/demo-access.ts`; mật khẩu ngẫu nhiên nằm trong `.local/demo-access.json` đã gitignore. Tài khoản có đuôi `@vietfood.test` bị chặn trong chế độ live. Đường dẫn đổi mật khẩu: `/admin/heslo`.

Với PostgreSQL nhúng, `node scripts/verify-restore.mjs` chụp và restore đủ 10 bảng vào database mới, so sánh toàn bộ dòng dữ liệu và giữ kết quả dưới `backups/`. Snapshot demo có dữ liệu nhạy cảm/hashes nên không commit hoặc chia sẻ; production dùng backup mã hóa của dịch vụ.

## Triển khai

`render.yaml` mô tả web, worker và PostgreSQL cùng Frankfurt. Dockerfile sử dụng lockfile, chạy app bằng user không phải root. Chưa đăng ký/mua hoặc deploy tài khoản Render. Thiết lập `APP_URL`, `SESSION_SECRET`, SMTP và dữ liệu qua môi trường bảo mật. Chọn gói có backup đúng yêu cầu trước tạo dịch vụ. Kiểm tra `/api/health` bằng giám sát ngoài; worker quá 90 giây không heartbeat là bất thường.

Không copy `.env` local vào image. Chạy `prisma migrate deploy` trước release. Backup và thử restore trước migration ảnh hưởng dữ liệu. Rollback code không được tự rollback hoặc xóa đơn mới.

### Checklist mở bán

- [ ] Nhập menu đúng, dị ứng/giá/ảnh được nhà hàng duyệt.
- [ ] Chốt phí bao bì và kiểu tính; không dùng giá trị demo làm chính sách thật.
- [ ] Điền tọa độ quán, số điện thoại, email nhà hàng/quản lý đúng chi nhánh.
- [ ] Duyệt dữ liệu pháp nhân, điều khoản, privacy, thời hạn lưu và quy trình chứng từ tại quầy.
- [ ] Test SMTP tới hộp thư thật, DNS SPF/DKIM/DMARC và người trực nhận.
- [ ] Duyệt cách báo giá ngoài 8 km; quầy gọi và ghi nhận tổng khách đồng ý.
- [ ] Xác nhận thiết bị tablet, bật chuông và mạng dự phòng.
- [ ] Backup mỗi ngày, kiểm thử restore và giám sát worker/API.
- [ ] Kiểm thử với nhân viên trên iPhone/Android/tablet thật và đơn thử đã phối hợp.
- [ ] Đặt APP_ENV=live, duyệt nội dung trong admin, kiểm tra chặn gửi nếu thiếu cấu hình.

## Bảo trì

Giao diện khách mới (22/10/2026): trang chủ tại `/`, menu gọn tại `/menu`. Chi tiết thiết kế, cách chạy bản thử và kiểm tra xem [docs/REDESIGN_IMPLEMENTATION.md](docs/REDESIGN_IMPLEMENTATION.md); nội dung món còn thiếu ở [docs/MENU_CONTENT_REVIEW.csv](docs/MENU_CONTENT_REVIEW.csv).

Các lệnh và tài liệu vận hành nằm trong `docs/OPERATIONS.md`. Không công khai endpoint debug hoặc hộp thư thử. Người quản trị kỹ thuật quản lý cập nhật, backup, quyền tài khoản và chi phí. Nhà hàng quản lý dữ liệu nội dung, gọi khách và thu tiền.
