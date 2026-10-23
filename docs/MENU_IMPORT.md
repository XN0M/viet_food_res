# Nhập menu và ảnh Dolný Štál — 12/10/2026

## Kết quả

- **179 mục** đã nhập vào MenuItem: **174 mục hiển thị bản thử**, 5 mục đồ uống có cồn lưu riêng, chưa bật bán.
- **258 tệp ảnh**, 7,35 MiB sau tối ưu WebP. Đã ghi đủ **258 bản ghi MenuImage** vào PostgreSQL, gồm nguồn, mã chi nhánh, checksum, kích thước, mục liên quan và cờ chờ duyệt.
- **168 mục đã ghép ảnh**: 120 từ website cũ, 48 bổ sung từ Wolt bằng tên món chuẩn hóa và chỉ khi khớp duy nhất. 11 mục thiếu ảnh phù hợp dùng placeholder trung tính.
- Ảnh dư/ảnh thứ hai và ảnh món chỉ có trên Wolt giữ trong kho ảnh; không tự tạo món bán hay thay giá website bằng giá Wolt.
- Menu mẫu được sao lưu trong `.local/menu-backups` rồi chuyển sang lưu trữ. Đơn cũ giữ bản chụp tên/giá tại thời điểm đặt; không xóa đơn.

## Phạm vi và nguồn

Chi nhánh **Pri jazere 1, 930 10 Dolný Štál**, mã **br_64a07613**.

Nguồn: [menu chính](https://vietfood.sk/hlavne-menu), [sushi](https://vietfood.sk/sushi-menu), [đồ uống](https://vietfood.sk/napoje-menu), [Wolt Dolný Štál](https://wolt.com/en/svk/dunajska-streda/restaurant/viet-food-dolny-stal).

Trang menu chính cũ có nhãn Trnava do cache kể cả khi truyền cookie Dolný Štál. Công cụ dùng cấu hình mcnBranch và logic branch.js công khai: ẩn nhóm không bán, bỏ giá riêng bằng 0, dùng giá riêng br_64a07613 khi có; nếu thiếu, lấy giá gốc + điều chỉnh chi nhánh/nhóm. Không lấy giá render của Trnava. Giữ số cent chính xác, không làm tròn một chữ số như giao diện cũ.

Menu ngày thay đổi theo ngày; snapshot giữ riêng, chưa bật như menu cố định. Món trẻ em và BamBo set bị nguồn đánh dấu không bán tại chi nhánh đã loại khỏi menu.

## Cần chủ quán duyệt trước mở bán

- **110 mục có giá khác Wolt**, xem ghi chú từng món trong [review.csv](../data/menu/review.csv). Giá website đã nhập là dữ liệu nguồn, chưa phải giá được duyệt cho website riêng.
- Đối chiếu mô tả, định lượng và lựa chọn. Nguồn lựa chọn chỉ có tên, không có bảng phụ thu riêng; hiện giữ 0 theo nguồn và chờ duyệt.
- Không tự diễn giải mã dị ứng. Giữ mã nguyên văn, ghi rõ chờ xác nhận; không tuyên bố món không có dị ứng khi nguồn thiếu.
- Một số món dùng chung ảnh ngay trên nguồn. Dữ liệu giữ quan hệ nguồn, cần duyệt độ phù hợp từng ảnh.
- `contentApproved=false`, `APP_ENV=demo`. Nhập ảnh chưa đồng nghĩa mở bán.

## Mục chưa có ảnh phù hợp

| ID | Món |
|---|---|
| vf-4351 | 23. Rybacia |
| vf-4364 | Padthai s Kuracím mäsom |
| vf-4365 | Padthai s Hovädzím mäsom |
| vf-4366 | Padthai s Krevetami |
| vf-4367 | Padthai s Tofu |
| vf-198 | Kani Maki (Kráb) 8ks |
| vf-232 | Unagi Nigiri (Úhor) |
| vf-233 | Kani Nigiri (Kráb) |
| vf-234 | Tamago Nigiri (Vajcia) |
| vf-235 | Mango Nigiri (Mango) |
| vf-242 | Unagi Sashimi (Úhor) |

## Tệp và tái nhập

- [dolny-stal.json](../data/menu/dolny-stal.json): dữ liệu nhập menu, đường dẫn ảnh local.
- [source-manifest.json](../data/menu/source-manifest.json): mã món nguồn, quy tắc chi nhánh, ảnh nguồn, chênh lệch và món bị loại.
- [image-assets.json](../data/menu/image-assets.json): danh sách ảnh và checksum.
- [review.csv](../data/menu/review.csv): bảng đối chiếu UTF-8, mở bằng Excel.
- `public/menu/dolny-stal/`: ảnh phục vụ từ hosting của dự án, không hotlink.

Sau `db:migrate`, chạy `npm run menu:import -- data/menu/dolny-stal.json`, rồi `npm run menu:images:import`. Công cụ dùng upsert, không tạo trùng ID. Import menu đặt lại cờ duyệt và sao lưu menu trước khi thay. Không tự động crawl/đồng bộ khi nhà hàng thay nguồn.

Đã kiểm tra: 16 unit (6 mới về tách chi nhánh), 13 PostgreSQL integration, 12 Playwright desktop/mobile; build production thành công. Giới hạn nghiệm thu thiết bị và email thật vẫn áp dụng như báo cáo triển khai.
