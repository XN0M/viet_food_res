# KẾ HOẠCH WEBSITE RIÊNG CHO DOLNÝ ŠTÁL — BẢN ĐẦU

Ngày: 12/10/2026. Trạng thái: kế hoạch để xem xét; chưa viết code, mua dịch vụ hoặc triển khai website.

Tài liệu này là nguồn phạm vi mới nhất, thay thế các phương án chưa chốt trong hai tài liệu khảo sát trước. Quy tắc đã xác nhận được tách khỏi đề xuất triển khai và thông tin còn chờ nhà hàng cung cấp.

## 1. Mục tiêu và quyền quản lý

Xây website độc lập cho VietFood Dolný Štál: khách xem menu riêng, đặt đến lấy hoặc yêu cầu giao; nhà hàng nhận email, nhân viên gọi khách và xử lý đơn trong admin.

- Người dùng mua tên miền, quản lý hosting, mã nguồn và dữ liệu.
- Nhà hàng cung cấp và duyệt menu, giá, thông tin liên hệ và nội dung Slovak.
- Nhà hàng có quyền truy cập dữ liệu đơn theo vai trò; quyền xuất dữ liệu, trách nhiệm sao lưu và bàn giao cần ghi trong thỏa thuận vận hành.
- Website có trang admin; quản lý có quyền cấu hình vận hành, nhân viên xử lý đơn.
- Không phụ thuộc nghiệp vụ nhiều chi nhánh; không chuyển lịch sử đơn/khách cũ.

## 2. Quy tắc đã chốt

| Nội dung | Quy tắc |
|---|---|
| Phạm vi | Một nhà hàng tại Dolný Štál |
| Nhận món | Đến lấy hoặc nhà hàng tự giao |
| Thanh toán đến lấy | Tiền mặt hoặc quẹt thẻ tại quầy |
| Thanh toán giao | Tiền mặt cho người giao; không thẻ tại cửa, không thanh toán online |
| Đo khoảng cách | Bán kính đường thẳng từ vị trí quán |
| Phí giao | ≤ 5 km miễn phí; > 5 đến ≤ 8 km: 3 EUR; > 8 km vẫn nhận giao, phí chưa chốt |
| Đơn tối thiểu | Không có |
| Bao bì | Có khả năng thu phí; mức và cách tính chưa chốt, không được mặc định miễn phí |
| Ngày phục vụ | Thứ Hai đến thứ Bảy; nghỉ Chủ nhật |
| Giờ lấy | 08:00–18:00; 18:00 là giờ lấy cuối cùng |
| Đặt trước đến lấy | Tối thiểu 30 phút; tối đa 2 ngày |
| Đơn giao | Chỉ giao sớm nhất có thể; không chọn lịch giao trong bản đầu |
| Xác nhận | Nhân viên gọi khách rồi xác nhận trong admin |
| Kênh gửi | Email đơn mới và cảnh báo cho nhà hàng/quản lý; không email/SMS cho khách |
| Hủy bởi khách | Được hủy khi đơn đang chờ xác nhận |
| Nhắc | Phút 5 nhắc quầy và báo quản lý; phút 30 nhắc cuối |
| Hết hạn | Phút 35 nếu vẫn chưa xác nhận; đơn đến lấy hết hạn sớm hơn nếu tới giờ lấy |
| Thiết bị | Admin responsive dùng điện thoại/tablet; chưa tích hợp máy tính tiền |
| Menu | Có menu riêng, giữ nhận diện hiện tại và có quyền sử dụng |
| Sửa nội dung | Quản trị menu đầy đủ để tương lai; bản đầu quản lý được đánh dấu hết món và tạm dừng nhận đơn |

Các quy tắc về thời gian chạy theo Europe/Bratislava. Ngày nghỉ và giờ phục vụ phải xuất hiện rõ trên web.

## 3. Các khoản chưa chốt và cách đưa vào kế hoạch

### 3.1. Phí giao ngoài 8 km

Không loại khách ngoài 8 km khỏi phạm vi, không coi phí chưa biết là 0 EUR.

Thiết kế dữ liệu có ba trạng thái phí: đã xác định, cần báo giá, không áp dụng. Trong lúc phát triển dùng dữ liệu thử có nhãn rõ; trước mở bán phải chọn một trong hai cách:

1. Nhà hàng cung cấp bảng phí ngoài 8 km: hệ thống tính và hiển thị tổng trước khi gửi đơn.
2. **Phương án đề xuất, chưa được người dùng duyệt:** khách ngoài 8 km gửi yêu cầu chờ báo phí; trang ghi rõ tạm tính chưa gồm phí giao. Nhân viên gọi báo phí và tổng tiền, ghi phí cùng sự đồng ý của khách vào admin rồi mới nhận đơn. Nếu khách không đồng ý, từ chối/hủy yêu cầu. Cần duyệt nội dung và cách giao kết phù hợp trước sử dụng.

Không tự triển khai phương án 2 như quyết định đã có. Việc chốt lựa chọn này là điều kiện hoàn thiện checkout và nghiệm thu phí, không ngăn làm thiết kế, menu và quản lý đơn trước.

Cần nhà hàng bổ sung phạm vi xa nhất/nơi thực sự giao được. Bán kính là tiêu chí tính phí, không bảo đảm đường đi thực tế phù hợp. Nếu có khu vực không giao được, phải cấu hình hoặc thông báo rõ.

### 3.2. Phí bao bì

Cần xác nhận mức phí và tính theo món, hộp hay đơn; có áp dụng cả đến lấy và giao không. Backend và đơn hàng có trường phí riêng. Không đưa con số 0,50 EUR từ website khảo sát thành mức của Dolný Štál. Chưa cho mở bán với phí bắt buộc bị giấu hoặc chưa xác định.

### 3.3. Chi tiết vận hành còn cần duyệt trong giai đoạn thiết kế

- Đề xuất hiểu tối đa 2 ngày là hôm nay, ngày mai và ngày kia theo lịch địa phương, loại Chủ nhật; cần xác nhận trước nghiệm thu lịch.
- Đề xuất bước chọn giờ 15 phút; khung giờ đầu tiên không sớm hơn hiện tại +30 phút. Bước giờ là đề xuất giao diện, không phải yêu cầu đã chốt.
- Cần giờ chốt đơn giao riêng: 18:00 được xác nhận là giờ lấy cuối, chưa đủ để suy ra giờ nhận đơn giao cuối hay giờ giao cuối. Không tự dùng 17:30 làm giờ chốt giao.
- Cần duyệt việc cho gửi đơn hẹn ngày sau khi quán đã đóng. Đề xuất bản đầu chỉ nhận yêu cầu khi có nhân viên trực; lịch vẫn cho chọn ngày lấy hợp lệ trong 2 ngày. Nếu nhận yêu cầu ngoài giờ, phải điều chỉnh cách tính nhắc/hết hạn hoặc bảo đảm có người trực, không âm thầm bỏ bộ đếm 35 phút.
- Địa chỉ, tọa độ gốc, số điện thoại và email dùng thật cần nhà hàng xác nhận; không mặc định số chung trên web cũ.

## 4. Phạm vi chức năng

### 4.1. Website khách hàng

1. Trang chủ: nhận diện VietFood, Dolný Štál, giờ, liên hệ, hai cách nhận món.
2. Menu: nhóm món, tìm kiếm, giá, mô tả, ảnh, dị ứng và các lựa chọn thực tế từ menu được duyệt.
3. Giỏ: thêm/sửa/xóa, số lượng, lựa chọn, ghi chú, tạm tính, phí bao bì/giao và tổng theo trạng thái phí.
4. Checkout không yêu cầu tài khoản: họ tên, điện thoại bắt buộc; loại nhận; giờ lấy hoặc địa chỉ giao; cách thanh toán phù hợp. Chưa cần email khách.
5. Trang kết quả và theo dõi: mã đơn, tóm tắt, trạng thái, thời gian dự kiến sau khi xác nhận, số liên hệ, nút hủy khi còn chờ.
6. Trang thông tin nhà hàng, giao/đến lấy, điều khoản, bảo mật và nội dung chính sách phù hợp.

Sau khi gửi đơn, thông báo: “Hệ thống đã nhận yêu cầu. Nhà hàng sẽ gọi xác nhận. Vui lòng chưa đến lấy trước khi được xác nhận.” Nội dung cuối bằng Slovak do nhà hàng duyệt.

Trang theo dõi cập nhật khi khách mở trang; không hứa thông báo chủ động khi khách đã đóng web. Link theo dõi là token khó đoán, không dùng mã đơn tăng dần để truy cập dữ liệu.

### 4.2. Admin nhà hàng

- Đăng nhập; danh sách đơn mới và bộ lọc theo trạng thái/ngày lấy.
- Chi tiết đơn, điện thoại bấm để gọi, địa chỉ và liên kết mở bản đồ khi giao.
- Ghi nhận lần gọi và kết quả “chưa liên lạc được”; thao tác này không tự xác nhận đơn.
- Xác nhận sau cuộc gọi, từ chối có lý do, cập nhật giờ dự kiến và tiến độ.
- Đánh dấu đã thanh toán riêng với trạng thái hoàn tất; không tự coi đơn được nhận là đã thu tiền.
- Chuông khi có đơn/cảnh báo trong phiên hoạt động; hiển thị mất kết nối và hướng dẫn bật âm thanh trên thiết bị thực tế.
- Quản lý được đánh dấu hết món, bán lại và tạm dừng/mở nhận đơn; nhân viên thông báo quản lý khi hết nguyên liệu.
- Nhắc 5/30 phút, hết hạn và lịch sử thao tác; trạng thái email lỗi để quầy biết kiểm tra.
- Không xây kho nguyên liệu hoặc tự trừ công thức trong bản đầu.

### 4.3. Quyền đề xuất

| Vai trò | Quyền |
|---|---|
| Người quản trị kỹ thuật | Cấu hình hệ thống/dịch vụ, tài khoản, backup và quyền truy cập |
| Quản lý nhà hàng | Tất cả nghiệp vụ đơn, hết món, tạm dừng, cấu hình vận hành được duyệt |
| Nhân viên trực | Xem/gọi/xác nhận/từ chối/cập nhật đơn; không sửa giá hay cấu hình |

Dùng tài khoản cá nhân theo vai trò, tránh dùng chung mật khẩu để còn biết ai xử lý đơn. Chi tiết quyền hủy sau xác nhận và ghi nhận thu tiền sẽ được duyệt cùng quản lý.

### 4.4. Chưa làm ở bản đầu

Thanh toán online; email/SMS/push cho khách; tích hợp POS/eKasa hay máy in; nhiều chi nhánh; nhập dữ liệu khách/đơn cũ; app tài xế; định vị tài xế; tích điểm; mã giảm giá; đồng bộ Bistro; quản trị menu đầy đủ. Nhập menu ban đầu và sửa nội dung theo quy trình kỹ thuật vẫn nằm trong phạm vi.

## 5. Trạng thái và các tình huống quan trọng

Luồng đến lấy: chờ xác nhận → đã xác nhận → đang chuẩn bị → sẵn sàng lấy → hoàn tất.

Luồng giao: chờ xác nhận → đã xác nhận → đang chuẩn bị → đang giao → hoàn tất.

Từ chờ có thể chuyển hủy bởi khách, từ chối hoặc hết hạn. Sau xác nhận, khách liên hệ nhà hàng để yêu cầu thay đổi; không có nút tự hủy. Nếu quản lý phải hủy đơn đã nhận, cần lý do và gọi khách; đây là ngoại lệ có lưu lịch sử.

Mốc hết hạn dự kiến của đơn đến lấy = thời điểm sớm hơn giữa lúc tạo +35 phút và giờ lấy. Đơn giao chưa xác nhận hết hạn sau 35 phút. Đơn đã xác nhận không chịu bộ đếm này. Những nhắc lịch tới sau khi đơn đã kết thúc bị bỏ qua.

Nếu khách hủy đúng lúc nhân viên nhận hoặc tác vụ hết hạn chạy, hệ thống chỉ cho một chuyển trạng thái hợp lệ thắng. Khi nhân viên đang gọi, giao diện cần báo nếu khách đã hủy, để tránh nhận làm món từ dữ liệu cũ.

Đơn hẹn ngày khác được xác nhận trong cùng thời hạn sau khi tạo, không chờ tới ngày nhận mới gọi. Admin phải phân biệt ngày đặt và ngày lấy, tránh bếp làm món ngay sau khi nhận một đơn hẹn ngày mai.

## 6. Kiến trúc dự kiến và hosting

Đề xuất kiến trúc nguyên khối có module: website khách, admin, backend kiểm tra nghiệp vụ, database quan hệ và worker/tác vụ định kỳ. Chưa chốt framework hoặc nhà cung cấp trước khi duyệt yêu cầu và kiểm tra khả năng vận hành.

```text
Khách → Website → Backend → Database đơn hàng
                               ↓
                        Hàng đợi thông báo → Email nhà hàng
Nhân viên → Admin → Gọi khách → Cập nhật trạng thái
Worker theo thời gian → Nhắc 5/30 phút, hết hạn → Admin + email quản lý
```

- Ghi đơn và yêu cầu gửi email trong cùng giao dịch; gửi nền, có retry và chống gửi trùng.
- Database là nơi lưu chuẩn, email chỉ là kênh báo. Lỗi email không làm mất đơn.
- Tác vụ thời gian chạy trên server, không phụ thuộc tablet mở trang. Khi chạy lại sau sự cố, kiểm tra trạng thái hiện tại, không gửi dồn những lời nhắc đã hết ý nghĩa.
- Tính giá, phí, lịch, quyền và chống trùng đơn phía server; không tin tổng tiền từ trình duyệt.
- Cache menu phải cập nhật khi hết món; checkout kiểm tra lại món còn bán, quán có đang tạm dừng và giá hiện hành.
- Các nhóm dữ liệu: món/lựa chọn/dị ứng, cấu hình lịch/phí, đơn và bản chụp món/giá, lịch sử trạng thái, nhân viên/quyền, hàng đợi và kết quả email.

Tiêu chí lựa chọn hosting: vùng EU, chạy được backend và worker/lịch nền, database bền vững, backup/restore, HTTPS, log/giám sát và tài khoản do người dùng quản lý. So sánh VPS với dịch vụ ứng dụng được quản lý ở bước chốt kỹ thuật; giá và điều kiện nhà cung cấp phải kiểm tra tại thời điểm chọn. Chưa có ngân sách trần không có nghĩa được phép mua dịch vụ không giới hạn; đặt cảnh báo chi phí và duyệt trước khi đăng ký trả phí.

Email nhà hàng cần dịch vụ gửi giao dịch và cấu hình xác thực người gửi. Địa chỉ gửi có thể khác hộp thư nhận; kiểm tra bằng hộp thư thật của chi nhánh. Không cần SMS gateway trong bản này.

## 7. Các giai đoạn thực hiện

| Giai đoạn | Việc thực hiện | Đầu ra/điều kiện hoàn tất |
|---|---|---|
| 1. Chốt đặc tả và dữ liệu | Nhận menu, dị ứng, liên hệ; duyệt mục 3; xác định người duyệt Slovak, lịch và phí | Bộ yêu cầu và dữ liệu chuẩn; không còn quy tắc phí/thời gian bị hiểu ngầm |
| 2. Thiết kế UX/UI | Mobile khách, checkout hai luồng, theo dõi/hủy; admin tablet; dùng màu nhận diện có sẵn | Mẫu màn hình, câu chữ Slovak và các trạng thái được duyệt |
| 3. Chốt kỹ thuật và nền tảng | Chọn stack/hosting/email, cấu trúc dữ liệu, staging, quyền, lịch nền và backup | Môi trường thử có cấu hình mẫu, tài khoản và quy trình triển khai |
| 4. Luồng khách | Menu/giỏ, lịch lấy, địa chỉ/bán kính, phí, lưu đơn chống trùng, theo dõi và hủy | Đặt đơn thử đúng phí/lịch/trạng thái, không gửi tới quầy thật |
| 5. Admin và email | Nhận/gọi/xác nhận, hết món/tạm dừng, tiến độ, email, nhắc/hết hạn, quyền | Luồng đơn đầy đủ; hoạt động khi đóng trình duyệt |
| 6. Kiểm thử và nội dung | Ca lỗi, thiết bị thật, bản địa hóa, chính sách, kiểm thử quyền và khôi phục | Biên bản UAT và danh sách lỗi đã xử lý |
| 7. Bàn giao và mở bán | Tên miền/HTTPS, cấu hình thật, đào tạo, đơn thử phối hợp, giám sát và phương án quay lại | Chủ nhà hàng tự xử lý được đơn; có đầu mối sự cố và hồ sơ bàn giao |

Thứ tự phụ thuộc: dữ liệu và quyết định ảnh hưởng checkout cần chốt trước hoàn thiện giai đoạn 4; thiết kế có thể tiến hành với dữ liệu mẫu. Không gán ngày hoàn thành/báo giá trước khi biết quy mô menu và công nghệ. Sau khi duyệt kế hoạch, chia thành đầu việc và ước lượng thực tế.

## 8. Các màn hình cần thiết kế

Khách: trang chủ; menu; chi tiết/lựa chọn món; giỏ; checkout đến lấy; checkout giao; kết quả chờ xác nhận; theo dõi đơn; xác nhận hủy; đơn hết hạn/từ chối; thông tin/chính sách.

Admin: đăng nhập; bảng đơn; chi tiết và lịch sử; đơn hẹn ngày sau; món đang bán/hết; tạm dừng nhận; cấu hình vận hành tối thiểu; tài khoản/quyền cho người có thẩm quyền; tình trạng gửi email.

Giữ nâu đỏ/vàng VietFood; phần nhập đơn nền sáng dễ đọc, nút lớn. Không có chọn chi nhánh. Giá EUR, nội dung Slovak thống nhất; không sao chép nhãn checkout tiếng Anh từ web cũ.

## 9. Checklist nghiệm thu nghiệp vụ

| Nhóm | Ca kiểm thử bắt buộc |
|---|---|
| Bán kính | Đúng 5 km miễn phí; trên 5 đến đúng 8 km 3 EUR; trên 8 theo phương án được duyệt, không tự miễn phí/chặn |
| Địa chỉ | Địa chỉ không tìm thấy, nhiều kết quả, thiếu số nhà, điểm sai; không tính phí dựa trên tọa độ không xác định |
| Bao bì | Đúng mức/cách tính được duyệt, xuất hiện trước khi gửi và trong email/đơn |
| Lịch lấy | Chủ nhật bị loại; đặt trước ít nhất 30 phút; tối đa 2 ngày theo cách hiểu đã duyệt; không quá 18:00; kiểm tra chuyển ngày/múi giờ |
| Lịch giao | Không có chọn lịch tương lai; áp dụng giờ nhận giao đã duyệt |
| Nhắc/hết hạn | Phút 5, 30, 35; hết hạn ở giờ lấy nếu tới sớm hơn; không hủy đơn đã xác nhận; không phụ thuộc trình duyệt |
| Gọi và hủy | Đã gọi không được vẫn là chờ; khách hủy/nhân viên nhận/hết hạn đồng thời chỉ có một kết quả |
| Đơn hẹn | Hiển thị rõ ngày lấy; không tự đưa bếp làm ngay khi xác nhận |
| Thanh toán | Giao chỉ tiền mặt; đến lấy có tiền mặt/thẻ quầy; trạng thái thu tiền riêng |
| Món/đóng nhận | Hết món hoặc tạm dừng giữa lúc khách đang đặt được kiểm tra lại trên server |
| Email | Đơn đến đúng hộp thư; nhắc đúng người; lỗi gửi có retry và hiển thị; không email cho khách |
| Bảo mật | Nhân viên không sửa cấu hình quản lý; không truy cập đơn khác bằng đoán mã; chống tạo trùng/lạm dụng |
| Thiết bị | Điện thoại/tablet thật, âm thanh, mạng yếu, reconnect; khách đóng/mở lại trang theo dõi |
| Vận hành | Backup khôi phục được, bí mật không có trong mã frontend, có người xử lý sự cố |

Đo tốc độ bằng điều kiện gần khách hàng Slovakia; mục tiêu hiệu năng cụ thể được chốt cùng hạ tầng và dữ liệu menu. Chưa coi các số tải giả định trong khảo sát cũ là lưu lượng thực.

## 10. Nội dung và hồ sơ cần có trước mở bán

- Menu riêng đầy đủ, giá, biến thể, ảnh được phép dùng, thông tin dị ứng được bếp duyệt.
- Tên/pháp nhân bán hàng, địa chỉ và liên hệ chính xác; người duyệt nội dung Slovak.
- Phí bao bì; cách tính/báo phí ngoài 8 km; giờ chốt giao và quy tắc nhận đơn ngoài giờ đã duyệt.
- Chính sách đặt/hủy, giao hàng, dữ liệu và cookie phù hợp triển khai thực; rà soát yêu cầu địa phương theo tài liệu khảo sát, kiểm tra lại trước mở bán.
- Email nhận đơn, email quản lý, tài khoản gửi email, tên miền và người giữ quyền; cung cấp bí mật qua kênh an toàn.
- Thiết bị quầy và người trực; cách nhập máy tính tiền, thu tiền, chứng từ và xử lý khách không đến/không liên lạc được.
- Quy trình mất mạng/email lỗi, backup, khôi phục, hỗ trợ và phí duy trì; hướng dẫn admin và tài khoản bàn giao.

Không gửi đơn thử vào vận hành thật nếu chưa phối hợp nhà hàng. Phần Google/web cũ do bên quản lý liên quan xử lý; không nằm trong hạng mục đồng bộ của dự án này.

## 11. Quyết định tiếp theo

Đã đủ để bắt đầu xem xét kế hoạch và chuẩn bị thiết kế. Chưa bắt đầu code theo tài liệu này. Bước tiếp theo sau khi người dùng duyệt là chốt các quyết định ở mục 3 và nhận menu mẫu để thiết kế chính xác. Phí chưa rõ được theo dõi như đầu việc bắt buộc trước mở bán, không được điền đại hoặc mặc định miễn phí.
