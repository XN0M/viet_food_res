# Định hướng giao diện VietFood Dolný Štál

**Đề xuất: Contemporary Vietnamese — Editorial Dining.**

Thiết kế tạo cảm giác nhà hàng chỉn chu, thanh lịch và gần gũi. Sự sang trọng đến từ ảnh đẹp, khoảng trống, tỷ lệ chữ và bố cục. Nền chủ đạo là trắng ngà; nâu đỏ/vàng chỉ giữ vai trò nhận diện và điểm nhấn.

Bản xem trước: **http://localhost:3001/**. Đây là concept để duyệt phong cách, dùng ảnh món đã nhập của Dolný Štál. Giá/mô tả vẫn thuộc bản thử, không phải dữ liệu đã được duyệt để mở bán.

## 1. Nguồn tham khảo và cách vận dụng

Nguồn kiểm tra ngày 12/10/2026. Các nhận xét dưới đây là lựa chọn thiết kế rút ra từ cấu trúc/nội dung website; không phải tuyên bố về hiệu quả chuyển đổi của những nhà hàng này.

| Nguồn | Điểm tham khảo | Vận dụng cho VietFood |
|---|---|---|
| [Nobu Tokyo](https://www.noburestaurants.com/tokyo/home) | Điều hướng trực tiếp đến menu, đặt chỗ và mang về; có phần giới thiệu món với ảnh riêng | Nút chọn món dễ thấy, ảnh món đặt ở vị trí chính, mô tả ngắn; thay trọng tâm đặt bàn bằng đặt món |
| [Dishoom Covent Garden](https://www.dishoom.com/covent-garden/) | Nội dung kể chuyện về địa điểm, nhóm Food & Drink, món nổi bật, gallery và thông tin ghé quán | Xen ảnh với đoạn giới thiệu ngắn; thể hiện chất Việt và địa điểm Dolný Štál, không tự bịa lịch sử nhà hàng |
| [Hakkasan](https://hakkasangroup.com/venues/hakkasan/) | Giới thiệu ẩm thực đi cùng ảnh món, phòng ăn và lounge | Trong bản hoàn chỉnh, phối ảnh món với ảnh không gian thật, ảnh phục vụ và bếp để tạo bầu không khí |

Chỉ tham khảo nguyên tắc bố cục. Không sao chép ảnh, logo, văn bản hoặc nhận diện của nhà hàng khác. Một số media đầu trang của website tham khảo tải không đầy đủ trong trình duyệt phiên kiểm tra; không coi đó là bằng chứng về màu sắc hoặc animation hoàn chỉnh của họ.

## 2. Ba hướng có thể chọn

| Hướng | Cảm giác | Ưu điểm | Phù hợp |
|---|---|---|---|
| **Editorial Dining — đề xuất** | Trắng ngà, chữ serif, ảnh món lớn, bố cục thoáng | Sang trọng mà vẫn dễ đọc và đặt món; dùng được bộ ảnh hiện có | VietFood hiện tại |
| Immersive Dining | Ảnh/video thực tế gần toàn màn hình, ít chữ | Tạo cảm xúc mạnh ngay khi mở trang | Khi có ảnh không gian và video món chất lượng tốt |
| Modern Bistro | Nền trắng, chữ sans, menu gọn, ảnh vừa | Xem nhiều món nhanh, thao tác đơn giản | Khi ưu tiên tốc độ đặt lại và khách quen |

Concept đang dựng theo hướng thứ nhất; có thể chuyển ảnh hero Sushi/Phở để so sánh trọng tâm ẩm thực.

## 3. Quy tắc hình ảnh và màu sắc

- Khoảng 80–90% bề mặt giao diện dùng trắng/trắng ngà. Đây là tỷ lệ thiết kế đề xuất, không phải tỷ lệ đo từ các website tham khảo.
- Nền chính `#FBFAF7`, chữ `#282521`, đường phân cách `#DEDAD2`.
- Nâu đỏ `#682E27` dùng ở nút chính, một vài từ nhấn và trạng thái chọn. Vàng trầm `#9D8056` dùng ở nhãn nhỏ, số thứ tự và chi tiết nhận diện.
- Không dùng gradient màu hay mảng nâu/vàng lớn làm nền trang. Ảnh món và ảnh không gian tạo chiều sâu cho bố cục.
- Chọn một ảnh chủ đạo, tránh carousel tự chạy. Hero có thể đổi ảnh theo thao tác, không lấy sự chú ý khỏi nút đặt món.
- Ảnh trong menu giữ trọn món; ảnh biên tập có thể crop khoảng trống nhưng không cắt mất phần quan trọng của món.
- Bộ ảnh hiện tại có chất lượng và nền chưa đồng nhất. Concept ưu tiên ảnh rõ hơn khi có cùng món trên nguồn chi nhánh; cần tuyển lại 6–8 ảnh tốt trước khi áp dụng bản chính thức.

## 4. Chữ và bố cục

- Tiêu đề serif, nét vừa, có chữ nghiêng ở điểm nhấn; nội dung và giá dùng sans để dễ đọc.
- Concept dùng Georgia/Arial để chạy ổn định offline. Bản hoàn thiện có thể chọn Cormorant Garamond + một sans phù hợp sau khi thử đủ dấu tiếng Slovak và Vietnamese.
- Cỡ tiêu đề khoảng 60–80 px desktop, 42–58 px mobile. Nội dung cơ bản bản hoàn thiện cần 14–16 px; nhãn nhỏ chỉ chứa thông tin phụ.
- Giảm khung, nền và bóng của thẻ món. Tách món bằng khoảng cách; giá và tên món đọc được trước khi mở chi tiết.
- Header gọn: Menu, Giới thiệu, Địa chỉ; luôn có đường dẫn đặt món rõ ràng.
- Đường phân cách mảnh tạo trật tự; góc ảnh và nút gần vuông để tránh cảm giác ứng dụng giao đồ ăn đại trà.

## 5. Cấu trúc trang chủ

1. **Hero:** một ảnh thật, tiêu đề ngắn và nút khám phá menu. Trên mobile, lời dẫn ngắn rồi ảnh.
2. **Thông tin phục vụ:** đến lấy, giao hàng, gọi xác nhận — trình bày thành hàng gọn, không thành ba thẻ màu.
3. **Menu chọn lọc:** 6 món để thể hiện phong cách, chuyển nhóm Phở/Sushi/Bento; dẫn đến menu đầy đủ có tìm kiếm.
4. **Đoạn giới thiệu:** ảnh phối với chữ để tạo nhịp. Sau này có thể thay ảnh món bằng ảnh không gian thật.
5. **Địa chỉ và thời gian:** nội dung rõ, nút đặt món; thời gian hiển thị phải lấy từ cấu hình đã duyệt khi tích hợp.
6. **Footer:** nền sáng, nhận diện, liên hệ và chính sách.

Không đưa toàn bộ 174 món lên phần giới thiệu cùng lúc. Trang menu đầy đủ vẫn cần tìm kiếm, danh mục, lọc món hết và giỏ hàng dễ truy cập.

## 6. Hiệu ứng

Cập nhật 13/10/2026: bản concept đã có nội dung xuất hiện khi cuộn (di chuyển 18 px, khoảng 620 ms), món hiện lần lượt lệch 75 ms, chuyển ảnh hero bằng fade sau khi ảnh mới tải xong, mở chi tiết nhẹ 250 ms và hover mũi tên/đường gạch chân. Có nút **Pohyb: zapnutý/vypnutý** bật/tắt chuyển động và **Prehrať efekt** để xem lại hiệu ứng đang trong vùng nhìn. Cài đặt giảm chuyển động của thiết bị được ưu tiên; nội dung luôn hiển thị kể cả khi không hỗ trợ animation/IntersectionObserver. Chưa thêm hiệu ứng vào website đặt món chính.

- Hover ảnh phóng nhẹ khoảng 3%, chuyển trạng thái 200–500 ms.
- Cuộn mượt khi chuyển đến khu vực trên trang; hỗ trợ reduced motion.
- Bản hoàn thiện có thể thêm hiệu ứng xuất hiện nhẹ khi cuộn. Không dùng parallax mạnh, video tự phát có tiếng hoặc lớp chuyển cảnh gây chậm thao tác.
- Trên điện thoại, ưu tiên vùng chạm ít nhất 44 px, chữ và giá rõ ràng. Giỏ hàng tích hợp sau sẽ có nút cố định dưới cùng khi có món.

## 7. Ảnh nên chụp bổ sung

| Ảnh | Mục đích | Gợi ý chụp |
|---|---|---|
| Bàn ăn với 2–3 món đặc trưng | Hero giàu cảm xúc hơn ảnh tách nền | Góc 45°, ánh sáng tự nhiên, nền đá hoặc gỗ nhẹ; bản ngang ≥2000 px |
| Không gian chi nhánh | Tạo tin cậy, liên kết món với nơi phục vụ | Một ảnh rộng và một góc bàn đẹp; không dùng ảnh nhà hàng khác |
| Tay đầu bếp hoàn thiện món | Làm nội dung giới thiệu sinh động | Cận cảnh thao tác thật, sạch và đủ sáng |
| Phở / sushi / bento riêng | Đồng nhất menu | Cùng ánh sáng, nền và khoảng cách máy |

Không có ảnh không gian thật trong bộ dữ liệu hiện tại. Concept dùng ảnh món thật để định hình bố cục; không dựng ảnh AI rồi ghi là ảnh quán.

## 8. Phạm vi bản xem trước và áp dụng tiếp

Bản xem trước chạy độc lập tại localhost:3001. Có đổi ảnh hero, lọc nhóm món, xem chi tiết và dẫn sang website đặt món hiện có. Không gửi đơn và không sửa database. Nội dung giới thiệu là bản nháp biên tập cần chủ quán duyệt.

Sau khi chốt phong cách: áp dụng hệ màu/chữ/bố cục cho trang khách, menu đầy đủ, giỏ, checkout và tracking; giữ chức năng hiện có. Admin ưu tiên bảng thông tin rõ và thao tác nhanh, không cần dùng toàn bộ phong cách biên tập của trang khách.

Khởi động lại concept: `node scripts/design-preview-server.mjs`. Chuẩn bị lại 6 món mẫu từ dữ liệu đã nhập: `node scripts/prepare-design-preview.mjs`. Mã concept ở `public/design-preview/`.

Kiểm tra thực hiện: trang HTTP 200, đổi ảnh Sushi/Phở, lọc Bento, mở chi tiết và đóng bằng Escape; kiểm tra chiều rộng desktop và mobile 390 px không bị tràn ngang. Screenshot lưu trong `.local/previews/concept-desktop.png`, `concept-desktop-hero.png`, `concept-mobile.png`. Bản kiểm tra mobile dùng viewport trình duyệt, không thay nghiệm thu trên điện thoại vật lý.
