# PHÂN TÍCH VÀ KẾ HOẠCH BÀN GIAO WEBSITE ĐẶT MÓN TẠI SLOVAKIA

> Phạm vi mới nhất ngày 12/10/2026 nằm trong [PLAN_WEBSITE_DOLNY_STAL.md](./PLAN_WEBSITE_DOLNY_STAL.md): một chi nhánh, email nội bộ và nhân viên gọi khách, không gửi SMS/email cho khách. Tài liệu bên dưới giữ làm khảo sát ban đầu; ưu tiên kế hoạch mới khi có khác biệt.

**Đối tượng tham chiếu:** VietFood Reštaurácia — website vietfood.sk  
**Ngày khảo sát:** 11/10/2026, theo múi giờ Asia/Bangkok  
**Mục đích:** Tài liệu đầu vào để trao đổi với chủ nhà hàng, xác định phạm vi phát triển, dự toán và nghiệm thu.  
**Định dạng:** Markdown; có thể tiếp tục chỉnh sửa hoặc chuyển sang Word.

> **Cập nhật phạm vi ngày 11/10/2026:** Người dùng đã xác nhận chỉ làm riêng Dolný Štál, menu riêng, nhà hàng tự giao, không thanh toán online và không chuyển dữ liệu đơn/khách cũ. Xem [bản bổ sung về phạm vi và thông tin còn thiếu](./BO_SUNG_PHAM_VI_DOLNY_STAL.md) trước khi sử dụng các đề xuất bên dưới. Các phần nhiều chi nhánh, cổng thanh toán, mốc nhắc 2 phút và lộ trình cũ chỉ còn là tham khảo ban đầu; mốc mới là nhắc/báo quản lý sau 5 phút, hết hạn khoảng 30 phút nếu chưa xác nhận. Chưa lập hoặc phê duyệt kế hoạch triển khai theo phạm vi mới.

> Kết luận chính: Không cần một loại website đặc biệt để khách ở Slovakia truy cập. Cần tên miền và HTTPS công khai, hạ tầng gần khách hàng, giao diện bản địa hóa, quy trình nhận đơn có người chịu trách nhiệm và các dịch vụ email/SMS được cấu hình đúng. Với website đang khảo sát, ưu tiên là hoàn thiện nghiệp vụ và độ tin cậy trước khi làm thêm hiệu ứng hoặc chức năng tiếp thị.

## 1. Phạm vi và cách đọc tài liệu

Tài liệu phân biệt ba nhóm thông tin:

- **Quan sát thực tế:** Nội dung và hành vi nhìn thấy trên website công khai trong phiên khảo sát.
- **Đề xuất triển khai:** Thiết kế và tiêu chí do người viết đề xuất, chưa phải chức năng hiện có hoặc cam kết của nhà cung cấp.
- **Cần xác nhận:** Dữ liệu kinh doanh, cấu hình nội bộ và phạm vi pháp lý chưa đủ bằng chứng để kết luận.

Đã khảo sát liên kết Google, trang chủ, menu chính, giỏ hàng và checkout. Đã thêm một món vào giỏ của phiên trình duyệt để xem tổng tiền. Không điền thông tin cá nhân, không bấm gửi đơn, không thanh toán và không gửi email/SMS thật. Chưa truy cập quản trị, mã nguồn, cơ sở dữ liệu hay tài khoản dịch vụ. Vì vậy, không thể xác nhận backend hiện tại gửi thông báo thế nào, lưu đơn ra sao, có bảo mật tốt hay đã đáp ứng đầy đủ pháp luật hay chưa.

Các nội dung pháp lý dưới đây là yêu cầu rà soát để triển khai. Trước khi mở bán, chủ nhà hàng cần xác nhận nội dung tiếng Slovak với người phụ trách pháp lý và kế toán địa phương; tài liệu này không phải chứng nhận tuân thủ.

## 2. Kết quả phân tích website được cung cấp

### 2.1. Xác định đúng website

Liên kết [Google do người dùng cung cấp](https://share.google/YH05H9ydKDT3BYvae) mở hồ sơ **VietFood Reštaurácia tại Dolný Štál**. Hồ sơ hiển thị địa chỉ **Pri jazere 1, 930 10 Dolný Štál, Slovakia**, số điện thoại **+421 940 904 899** và website [vietfood.sk](https://vietfood.sk/).

Website giới thiệu **5 chi nhánh**, gồm Trnava, Dolný Štál, Streženice-Púchov, Dunajská Streda và Gabčíkovo. Do đó, cần chốt rõ dự án phục vụ riêng Dolný Štál hay cả hệ thống; đây là quyết định ảnh hưởng trực tiếp đến cơ sở dữ liệu, phân quyền, định tuyến đơn và chi phí.

### 2.2. Những nền tảng đã có

| Hạng mục | Quan sát | Giá trị có thể giữ lại |
|---|---|---|
| Nhận diện | Logo VietFood, nền nâu đỏ, màu vàng, ảnh món Việt | Có nền tảng thương hiệu để phát triển tiếp |
| Trang chủ | Giới thiệu, nhóm menu nhanh, món bán chạy, danh sách chi nhánh | Hỗ trợ tìm món và tìm địa điểm |
| Menu | Menu ngày, món chính, sushi, đồ uống; món có giá và một số mô tả/định lượng | Không cần xây lại toàn bộ nội dung từ đầu |
| Giỏ hàng | Thêm món, thay đổi số lượng, tạm tính và phí bao bì | Có luồng mua hàng cơ bản |
| Checkout | Họ tên, điện thoại, email, chọn chi nhánh, địa chỉ và ghi chú | Có sẵn điểm thu thập đơn |
| Thanh toán | Trong phiên kiểm tra chỉ thấy tiền mặt khi giao | Có thể dùng làm phạm vi ban đầu nếu phù hợp vận hành |

Nguồn quan sát: [Trang chủ](https://vietfood.sk/), [Menu chính](https://vietfood.sk/hlavne-menu), [Checkout](https://vietfood.sk/checkout). Dữ liệu có thể thay đổi theo thời điểm, chi nhánh và phiên truy cập.

### 2.3. Các vấn đề cần xử lý

| Mức ưu tiên | Phát hiện cụ thể | Ảnh hưởng | Hướng xử lý |
|---|---|---|---|
| P0 — trước mở bán | Footer có các liên kết giao hàng/thanh toán, điều khoản, bảo mật và FAQ trỏ về `#` | Khách không truy cập được thông tin chính sách qua những liên kết này | Tạo trang thật, nội dung theo đơn vị bán hàng, liên kết tại checkout |
| P0 | Sau khi chọn Dolný Štál, menu chính hiển thị Pobočka 3; checkout chọn Pobočka 2 | Nguy cơ khách xem nhầm menu/giá hoặc đơn đến nhầm chi nhánh | Kiểm tra nguồn branch_id, lưu phiên, cache và xác thực phía server; chưa kết luận nguyên nhân |
| P0 | Checkout hiển thị chọn chi nhánh dưới nhãn “Pick up at the restaurant”, đồng thời địa chỉ giao hàng là tùy chọn | Không rõ khách đang đặt đến lấy hay giao tận nơi | Hai lựa chọn loại đơn rõ ràng; địa chỉ bắt buộc khi giao |
| P0 | Món “P6. TOFU POKE” mô tả có “krevety” — tôm | Nội dung thành phần có thể gây hiểu nhầm | Bếp xác nhận công thức và dị ứng từng món, không sửa bằng phỏng đoán |
| P1 — quan trọng | Checkout có “Billing details”, “Your order”, “Cash on delivery”, “Place order” | Trải nghiệm không thống nhất với menu Slovak | Bản địa hóa toàn bộ checkout, lỗi, trạng thái và thông báo |
| P1 | Footer có số +421 948 558 558, email Deliviet.tt@gmail.com, giờ 09:00–21:00; hồ sơ Dolný Štál dùng số khác | Có thể là thông tin toàn hệ thống, nhưng khách dễ liên hệ nhầm | Hiển thị liên hệ và giờ của chi nhánh đang chọn; chủ nhà hàng xác nhận dữ liệu |
| P1 | Giỏ thử: món 3,50 EUR + bao bì 0,50 EUR = 4,00 EUR; chưa thấy phí giao trong đơn chưa có địa chỉ | Khách cần biết tổng phí trước cam kết | Nêu nguyên tắc phí bao bì, tính phí giao sau khi kiểm tra địa chỉ, công khai trước gửi đơn |
| P1 | Menu có ký hiệu dạng 1*, 4*, 5* ở một số nhóm; chưa xác minh được bảng giải thích đầy đủ tại từng món | Khó hiểu chất gây dị ứng và khác biệt giữa lựa chọn món | Hiển thị tên chất gây dị ứng theo từng món/biến thể, có bảng giải thích |
| P2 — cải thiện | Giá hiển thị nhiều dạng như €7.00 và 3.5€ | Thiếu nhất quán bản địa | Chuẩn định dạng sk-SK, ví dụ 7,00 € |
| P2 | Liên kết mạng xã hội trên trang chủ trỏ `#`; đường dẫn “O nás” ở header/footer khác nhau | Điều hướng chưa hoàn chỉnh | Kiểm tra toàn bộ liên kết, sửa hoặc bỏ mục chưa có nội dung |

P0 là mức ưu tiên dự án, không phải kết luận website vi phạm pháp luật. Sự không khớp chi nhánh mới được ghi nhận trong một phiên; cần tái hiện trên phiên sạch và nhiều thiết bị.

### 2.4. Những điều chưa thể kết luận

Chưa đo tốc độ từ Slovakia; chưa kiểm tra email vào inbox, SMS đến máy thật, chống đơn trùng, khôi phục backup, phân quyền nhân viên, thanh toán online, xác thực webhook, cookie/tracker trước đồng ý hoặc xử lý đơn ngoài giờ. Không suy ra “không có” các khả năng này chỉ vì giao diện chưa thể hiện.

Không khẳng định công nghệ hiện tại từ giao diện checkout. Cần kiểm tra mã nguồn, hosting và plugin trước khi quyết định sửa hệ thống cũ hay viết mới.

## 3. Ngoài code cần chuẩn bị những gì?

### 3.1. Tên miền, DNS và quyền sở hữu

- Giữ tên miền hiện có nếu chủ nhà hàng sở hữu hợp pháp và còn quyền quản lý; không cần mua tên miền mới chỉ vì triển khai ở nước ngoài.
- Chủ nhà hàng đứng tên tài khoản tên miền, hosting và dịch vụ chính. Developer được cấp quyền làm việc phù hợp.
- Bật gia hạn tự động, MFA, email khôi phục thuộc doanh nghiệp; ghi rõ ai trả phí.
- Cấu hình DNS cho web và email, HTTPS tự gia hạn; thống nhất www/non-www và chuyển hướng URL cũ khi thay hệ thống.
- Có production để bán hàng và staging để thử; staging không được gửi đơn đến bếp thật hoặc bị lập chỉ mục như website chính.

### 3.2. Hạ tầng gần khách hàng

Đề xuất đặt ứng dụng và cơ sở dữ liệu cùng vùng EU, chẳng hạn Frankfurt hoặc một vùng châu Âu phù hợp. Không bắt buộc đặt máy chủ trong Slovakia. CDN giúp ảnh và nội dung tĩnh tải nhanh; API đặt món vẫn cần backend ổn định.

Cấu hình khởi điểm nên gồm ứng dụng, database được quản lý, lưu ảnh, hàng đợi gửi thông báo, giám sát và backup. Không cần chia nhiều microservice cho một nhà hàng. Khi chọn gói phải xem khả năng khôi phục, giới hạn tài nguyên, hỗ trợ và chi phí vận hành, không chỉ giá VPS.

EU hosting là lựa chọn giảm độ trễ và thuận tiện quản trị dữ liệu, không tự động tạo ra tuân thủ GDPR. Phải xem cả nhà cung cấp email, SMS, log, backup và quyền truy cập từ ngoài EEA.

### 3.3. Bản địa hóa cho Slovakia

| Thành phần | Thiết lập đề xuất |
|---|---|
| Ngôn ngữ khách hàng | Slovak mặc định; English tùy nhu cầu; Hungarian chỉ bổ sung khi nhà hàng xác nhận tệp khách |
| Ngôn ngữ nội bộ | Có thể thêm tiếng Việt cho quản trị; không trộn tiếng Việt vào luồng khách Slovak |
| Tiền tệ | EUR, lưu số tiền theo cent hoặc decimal chính xác |
| Múi giờ | Europe/Bratislava; lưu timestamp UTC, xử lý giờ mùa hè tự động |
| Điện thoại | Chuẩn hóa E.164, mặc định +421 nhưng không cấm khách có số nước ngoài hợp lệ |
| Địa chỉ | Tên người nhận, đường, số nhà, thành phố/xã, PSČ, căn hộ/tầng/chuông cửa tùy chọn |
| Lịch bán | Theo từng chi nhánh: giờ mở cửa, giờ nhận đơn cuối, nghỉ lễ và tạm dừng |
| Nội dung | Người dùng tiếng Slovak rà soát tên món, thông báo lỗi, chính sách và mẫu tin |

“Website truy cập được từ nhiều nước” khác với “giao đồ ăn sang nhiều nước”. Website có thể truy cập toàn cầu, nhưng vùng giao chỉ nên nằm trong khu vực nhà hàng thực sự phục vụ. Muốn mở ở nước khác phải cấu hình thêm chi nhánh, ngôn ngữ, thuế, thanh toán và chính sách địa phương.

### 3.4. Thiết bị và nhân sự ở nhà hàng

- Máy tính bảng hoặc máy tính quầy chạy màn hình nhận đơn, có chuông và nút xác nhận rõ.
- Internet ổn định, nguồn điện và phương án mạng di động dự phòng.
- Mỗi ca có người chịu trách nhiệm nhận đơn; có người thay thế khi bận.
- Chủ nhà hàng chốt ai giao, khu vực giao, thời gian chuẩn bị, giới hạn công suất và cách xử lý không liên lạc được khách.
- Thực hiện đơn thử có chủ nhà hàng phối hợp trước bàn giao, gồm email thật, SMS thật và quy trình giao/đến lấy.

## 4. Luồng đặt món và phản hồi nên hoạt động thế nào?

### 4.1. Luồng chuẩn

1. Khách chọn chi nhánh hoặc nhập khu vực để hệ thống đề xuất chi nhánh phục vụ.
2. Chọn **giao tận nơi** hoặc **đến lấy**; thấy giờ phục vụ, giới hạn giao, đơn tối thiểu và phương thức thanh toán từ sớm.
3. Xem menu của đúng chi nhánh; chọn món, biến thể, món thêm và số lượng.
4. Nhập liên hệ; nếu giao thì nhập địa chỉ và ghi chú cho tài xế.
5. Server kiểm tra chi nhánh, tồn món, giờ nhận đơn, vùng giao, tính lại toàn bộ tiền và hiển thị tổng cuối cùng.
6. Khách xác nhận đặt đơn; hệ thống lưu đơn và sự kiện cần gửi thông báo cùng một giao dịch dữ liệu.
7. Hiện mã đơn và trạng thái **đã nhận yêu cầu, đang chờ nhà hàng xác nhận**.
8. Bếp/quầy nhận chuông, email và/hoặc SMS; nhân viên chấp nhận hoặc từ chối trên trang quản trị.
9. Khách nhận thông báo nhà hàng chấp nhận kèm thời gian dự kiến, hoặc từ chối kèm lý do và thông tin hoàn tiền nếu có.
10. Cập nhật đang chuẩn bị → sẵn sàng lấy/đang giao → hoàn tất.

### 4.2. Tách ba loại trạng thái

| Nhóm | Trạng thái minh họa | Ý nghĩa |
|---|---|---|
| Đơn hàng | Chờ xác nhận, đã nhận, đang làm, sẵn sàng, đang giao, hoàn tất, từ chối, hủy | Nhà hàng đang xử lý ra sao |
| Thanh toán | Chưa trả, đang xử lý, đã trả, lỗi, đang hoàn, đã hoàn | Dòng tiền; độc lập với tình trạng món |
| Thông báo | Chờ gửi, đã gửi nhà cung cấp, đã phát nếu có xác nhận, lỗi | Tình trạng email/SMS; không chứng minh nhân viên đã đọc |

Không dùng “email gửi thành công” để tự chuyển đơn sang “nhà hàng đã chấp nhận”. Không dùng trang quay về sau thanh toán làm bằng chứng duy nhất rằng tiền đã được thu.

### 4.3. Quy tắc ngoại lệ phải chốt

| Tình huống | Hành vi đề xuất |
|---|---|
| Khách bấm đặt nhiều lần hoặc mạng chập chờn | Khóa chống trùng cho yêu cầu; retry trả lại cùng mã đơn |
| Hết món sau khi khách thêm giỏ | Server báo món hết, cho sửa giỏ trước khi tạo đơn/thu tiền |
| Địa chỉ ngoài vùng | Chặn giao, gợi ý đến lấy; không tự ghi phí 0 |
| Đổi chi nhánh | Kiểm tra lại món, giá, phí; thông báo thay đổi trước khi tiếp tục |
| Quầy không phản hồi | Ví dụ sau 2 phút nhắc lại, 5 phút cảnh báo quản lý; ngưỡng do nhà hàng duyệt |
| Quá thời gian chờ tối đa | Áp dụng chính sách hết hạn/từ chối; xử lý tiền riêng và báo khách |
| Email/SMS lỗi | Đơn vẫn tồn tại; retry có giới hạn, hiện lỗi ở quản trị, chuyển kênh dự phòng |
| Quầy mất mạng | Cảnh báo mất kết nối, tự đồng bộ khi có mạng; có thể tạm ngừng nhận đơn mới theo quy trình |
| Trả tiền nhưng nhà hàng từ chối | Void hoặc refund theo cổng và phương thức đã chọn; theo dõi đến khi hoàn tất |

## 5. Email và số điện thoại: cấu hình cụ thể

### 5.1. Email giao dịch

Sử dụng dịch vụ email giao dịch qua API/SMTP, không phụ thuộc hàm gửi mail mặc định của hosting. Địa chỉ gửi nên thuộc tên miền nhà hàng, ví dụ `orders@tenmien-nhahang.sk`; đây là địa chỉ minh họa, không phải tài khoản đã tạo.

Cần xác thực tên miền bằng SPF, DKIM và DMARC; triển khai DMARC theo giai đoạn sau khi kiểm kê nguồn gửi để tránh chặn nhầm thư hợp lệ. Cấu hình Reply-To đúng chi nhánh, xử lý bounce và complaint, theo dõi lỗi gửi. Thử inbox trên những hộp thư nhà hàng và khách thực tế sử dụng.

Email cho quầy gồm mã đơn, chi nhánh, hình thức nhận, giờ, món/biến thể/số lượng, phí, thanh toán và liên hệ cần thiết. Email cho khách gồm bản tóm tắt đơn, trạng thái, thông tin liên hệ, chính sách có liên quan hoặc bản xác nhận có thể lưu giữ. Không gửi thông tin khách cho mọi chi nhánh.

### 5.2. SMS tới điện thoại

SMS cần nhà cung cấp có tuyến gửi đến Slovakia; nhập số điện thoại vào form không khiến website tự gửi được tin. Có thể đánh giá Twilio hoặc nhà cung cấp địa phương dựa trên khả năng phát tin, giá, Sender ID, dữ liệu và hỗ trợ. [Hướng dẫn SMS Slovakia của Twilio](https://www.twilio.com/en-us/guidelines/sk/sms) và [bảng giá Slovakia](https://www.twilio.com/en-us/sms/pricing/sk) là nguồn kiểm tra ban đầu, không thay thế kiểm thử tuyến thực tế.

- Dùng SMS ngắn: mã đơn, trạng thái, thời gian dự kiến và link cần thiết.
- SMS quầy nên dẫn vào trang yêu cầu đăng nhập, không chứa toàn bộ địa chỉ và dữ liệu khách.
- Theo dõi kết quả phát tin khi nhà cung cấp hỗ trợ; trạng thái phát không có nghĩa người nhận đã đọc.
- Tính chi phí theo **segment**, vì ký tự Unicode/Slovak có thể làm tin bị chia thành nhiều phần.
- Không mặc định khách có thể trả lời Sender ID dạng chữ. Nếu muốn nhận phản hồi bằng SMS, phải xác minh dịch vụ hai chiều và số nhận phù hợp.
- Không bấm link trong SMS để chấp nhận đơn bằng một yêu cầu GET: phần mềm xem trước link có thể vô tình kích hoạt. Chấp nhận cần đăng nhập và thao tác xác nhận có bảo vệ.

### 5.3. Phương án phù hợp cho bản đầu

**Quầy:** dashboard có chuông + email tóm tắt; SMS làm cảnh báo dự phòng hoặc thông báo đơn mới nếu nhà hàng yêu cầu.  
**Khách:** trang theo dõi + email; SMS ưu tiên lúc nhà hàng chấp nhận/từ chối hoặc thay đổi đáng kể.  
**Nguồn dữ liệu chuẩn:** database đơn hàng, không phải hộp thư.

Nếu yêu cầu ban đầu là “gửi về điện thoại”, cần phân biệt SMS, cuộc gọi tự động, thông báo ứng dụng và WhatsApp. Bản này lấy SMS làm giả định; các kênh còn lại là phạm vi bổ sung.

## 6. Địa chỉ, vùng giao và thời gian

Địa chỉ nên có trường cấu trúc và vẫn cho nhập tay khi dịch vụ bản đồ lỗi. Gợi ý địa chỉ giúp nhập nhanh nhưng không chứng minh tài xế giao được. Có thể thêm ghim vị trí tùy chọn; không bắt khách cấp GPS để đặt món.

Đối với ít chi nhánh, bắt đầu bằng danh sách xã/khu vực/PSČ đã duyệt hoặc polygon vùng giao. Nếu tính phí theo khoảng cách, xác định rõ dùng đường đi hay đường thẳng. Không chỉ kiểm tra chuỗi địa chỉ chứa tên thành phố.

Mỗi vùng có phí giao, đơn tối thiểu, thời gian dự kiến và chi nhánh phục vụ. Nếu các vùng chồng lấn, có quy tắc chọn chi nhánh; không tự đổi nhà hàng sau khi khách chốt đơn. Backend là nơi quyết định cuối cùng về vùng và phí.

Khung giờ đặt trước cần tính cả thời gian chuẩn bị, năng lực bếp và chuyến giao. Đồng hồ server không được dùng giờ Việt Nam để quyết định nhà hàng Slovakia đang mở. Hiển thị ETA dưới dạng khoảng ước tính, không hứa chính xác đến phút nếu chưa có dữ liệu vận hành.

## 7. Các yêu cầu pháp lý và chính sách cần đưa vào bàn giao

### 7.1. Danh tính bên bán và giao kết đơn

Hiển thị đơn vị vận hành, địa chỉ, liên hệ, thông tin đăng ký và mã doanh nghiệp/thuế tương ứng với thực tế. Làm rõ chi nhánh nào và pháp nhân nào bán hàng. Công khai tổng giá, phí, hạn chế giao và phương thức thanh toán; nút cuối phải diễn đạt rõ nghĩa vụ thanh toán. Quy định rõ thời điểm nhà hàng chấp nhận đơn và cung cấp xác nhận có thể lưu giữ. Đối chiếu luật Slovakia [108/2024, phiên bản hiệu lực 27/09/2026](https://www.slov-lex.sk/ezbierky-fe/pravne-predpisy/SK/ZZ/2024/108/20260927.html).

### 7.2. Thông tin món ăn và dị ứng

Đối với thực phẩm không đóng gói bán từ xa, thông tin dị ứng phải có trước khi khách kết thúc mua và tại thời điểm giao theo quy định liên quan. Chủ nhà hàng chịu trách nhiệm xác thực dữ liệu nguyên liệu; hệ thống cần quản lý theo món và lựa chọn thêm. Không dùng một ghi chú chung để thay toàn bộ thông tin cụ thể. Xem [European Commission — Distance Selling](https://food.ec.europa.eu/food-safety/labelling-and-nutrition/food-information-consumers-legislation/distance-selling_en).

Không tự gắn nhãn “không gluten”, “vegan” hoặc “không có chất gây dị ứng” chỉ từ tên món. Cần có quy trình bếp xác nhận và thông tin phù hợp về nguy cơ nhiễm chéo. Nếu khách ghi tình trạng dị ứng cá nhân, hạn chế dữ liệu thu thập và rà soát cách xử lý dữ liệu sức khỏe.

### 7.3. Hủy, khiếu nại và hoàn tiền

Đồ ăn dễ hỏng có thể thuộc ngoại lệ của quyền rút khỏi hợp đồng 14 ngày; không áp dụng máy móc chính sách đổi trả hàng hóa thông thường. Điều này không xóa quyền khiếu nại khi giao sai, thiếu hoặc có vấn đề chất lượng. Chính sách cần nói rõ xử lý trước/sau khi bếp chấp nhận, thời gian phản hồi và cách hoàn tiền. Xem [Your Europe — bán hàng từ xa](https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/ecommerce-distance-selling/index_en.htm).

Rà soát cơ chế ADR phù hợp tại Slovakia. Không sao chép mẫu cũ còn yêu cầu dẫn tới nền tảng EU ODR đã chấm dứt từ 20/07/2025. Xem [Quy định EU 2024/3228](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R3228).

### 7.4. GDPR và dữ liệu cá nhân

Lập bản đồ dữ liệu: thu gì, để làm gì, căn cứ xử lý, ai truy cập, gửi cho ai, lưu bao lâu và cách thực hiện quyền của khách. Nhà hàng thường là bên kiểm soát dữ liệu; vai trò developer và nhà cung cấp phải được xác định bằng hợp đồng thực tế. Xem [Your Europe — GDPR](https://europa.eu/youreurope/business/governance-and-sustainability/digital-and-data-compliance/data-protection-gdpr/index_en.htm).

Dữ liệu cần để thực hiện đơn hàng thường được xử lý theo căn cứ hợp đồng, không cần biến mọi hoạt động thành checkbox đồng ý GDPR. Marketing cần tách biệt và rà soát quy định áp dụng. Xem [European Commission — căn cứ xử lý](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data_en).

Yêu cầu triển khai đề xuất: phân quyền theo chi nhánh, log không chứa toàn bộ thông tin cá nhân, hạn lưu có cấu hình, DPA với bên xử lý, quy trình sự cố và xóa/ẩn danh dữ liệu khi phù hợp. Nếu developer ở Việt Nam truy cập dữ liệu thật từ xa, phải đánh giá luồng chuyển dữ liệu và biện pháp áp dụng; EU hosting không giải quyết riêng vấn đề này. Ưu tiên dữ liệu giả trên staging.

### 7.5. Cookie và tiếp thị

Kiểm kê cookie và công cụ bên thứ ba. Cookie giỏ hàng/phiên thực sự cần thiết có thể thuộc ngoại lệ đồng ý; analytics hoặc quảng cáo cần đồng ý phải được chặn trước khi người dùng chọn. Có lựa chọn từ chối và rút lại dễ sử dụng. Không bật sẵn checkbox quảng cáo. Xem [Your Europe — online privacy](https://europa.eu/youreurope/business/growing/digitalising/online-privacy/index_en.htm).

Nếu không có công nghệ cần đồng ý, không tạo banner rườm rà chỉ để trang trông “có GDPR”; vẫn cần thông tin minh bạch phù hợp.

### 7.6. Khả năng tiếp cận

Dịch vụ thương mại điện tử thuộc nhóm cần xem xét theo European Accessibility Act; có ngoại lệ cho một số doanh nghiệp siêu nhỏ cung cấp dịch vụ. Phải kiểm tra quy mô và quy định triển khai Slovakia trước kết luận áp dụng hay miễn. Xem [Your Europe — accessibility](https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/accessibility/index_en.htm).

Dù kết quả pháp lý thế nào, đề xuất WCAG 2.2 AA làm mục tiêu kỹ thuật: dùng bàn phím, nhãn trường rõ, tương phản tốt, focus nhìn thấy, thông báo lỗi đọc được. Đây là mục tiêu nghiệm thu đề xuất, không phải khẳng định đạt chuẩn này là tự động đáp ứng mọi nghĩa vụ pháp lý.

### 7.7. Thuế, chứng từ và điều kiện kinh doanh thực phẩm

Không gán một thuế suất cho mọi món và cách phục vụ. Slovakia phân biệt các nhóm hàng và dịch vụ ăn uống; quy định có thay đổi năm 2026. Nhờ kế toán chốt nhóm thuế cho món, đồ uống, bao bì, giao hàng và trường hợp nhà hàng có/không đăng ký VAT. Xem [Finančná správa — thuế suất](https://www.financnasprava.sk/sk/podnikatelia/dane/dan-z-pridanej-hodnoty/sadzby-dane).

Xác định quy trình eKasa/chứng từ theo cách thực nhận tiền, hệ thống POS và quy định hiện hành. Email xác nhận đơn không tự thay hóa đơn hay chứng từ tài chính. Xem [Finančná správa — eKasa](https://www.financnasprava.sk/sk/podnikatelia/dane/ekasa).

Chủ nhà hàng cần xác nhận giấy phép/đăng ký cơ sở, vệ sinh, HACCP, đóng gói và vận chuyển thực phẩm với cơ quan địa phương phù hợp. Những điều kiện này không được giải quyết chỉ bằng việc thêm trang chính sách. Nếu bán rượu hoặc sản phẩm hạn chế độ tuổi, phải rà soát riêng trước đưa vào phạm vi.

### 7.8. Bộ tài liệu cần có trên web

| Tài liệu | Nội dung chính | Người duyệt |
|---|---|---|
| Điều khoản đặt món | Bên bán, thời điểm chấp nhận, thanh toán, giới hạn trách nhiệm hợp pháp | Chủ nhà hàng + pháp lý |
| Giao hàng và thanh toán | Vùng, phí, thời gian, đến lấy, phương thức trả tiền | Vận hành + kế toán |
| Khiếu nại/hủy/hoàn tiền | Kênh liên hệ, cách xử lý và quyền áp dụng | Pháp lý + vận hành |
| Thông báo bảo mật | Mục đích, căn cứ, bên nhận, lưu giữ, quyền khách | Người phụ trách dữ liệu |
| Cookie | Danh mục công nghệ và cơ chế lựa chọn nếu cần | Developer + người phụ trách dữ liệu |
| Thông tin dị ứng | Theo từng món/biến thể, dữ liệu do bếp duyệt | Quản lý bếp |
| Thông tin doanh nghiệp | Pháp nhân, địa chỉ, mã đăng ký/thuế và liên hệ phù hợp | Chủ nhà hàng |

## 8. Các chức năng lớn để xây dựng bộ khung

### 8.1. Phía khách hàng

| Module | Bản đầu cần có | Có thể làm sau |
|---|---|---|
| Chi nhánh | Chọn/đổi, địa chỉ, liên hệ, giờ, vùng giao | Tự đề xuất theo vị trí |
| Menu | Nhóm món, tìm kiếm, giá, ảnh, định lượng, dị ứng, hết món | Gợi ý cá nhân hóa |
| Tùy chọn | Biến thể, món thêm, giới hạn lựa chọn và phụ phí | Combo phức tạp |
| Giỏ hàng | Số lượng, sửa/xóa, phí minh bạch, kiểm tra lại giá | Lưu giỏ nhiều thiết bị |
| Checkout | Mua không đăng ký, loại nhận, liên hệ, địa chỉ, tổng tiền, chính sách | Tài khoản và sổ địa chỉ |
| Theo dõi | Mã đơn, trạng thái, ETA, liên hệ hỗ trợ | Bản đồ tài xế trực tiếp |
| Thanh toán | Phương thức nhà hàng vận hành được, trạng thái rõ | Thêm ví/cổng khác |

### 8.2. Phía nhà hàng

Dashboard đơn mới theo thời gian thực hoặc polling đáng tin cậy; chuông; chấp nhận/từ chối; điều chỉnh ETA; chuyển trạng thái; đánh dấu hết món; tạm ngừng nhận; quản lý lịch và vùng giao; lịch sử đơn; tra cứu lỗi thông báo; báo cáo và xuất dữ liệu cần thiết cho kế toán.

Vai trò tối thiểu: chủ hệ thống, quản lý chi nhánh và nhân viên nhận đơn. Nhân viên chi nhánh A không xem dữ liệu khách chi nhánh B nếu không có nhiệm vụ. Ghi log ai đổi trạng thái, giá và cấu hình quan trọng. Quyền hoàn tiền nên hạn chế riêng.

### 8.3. Nhóm dữ liệu tối thiểu

| Nhóm | Dữ liệu chính |
|---|---|
| Branch | Mã chi nhánh, tên, pháp nhân, liên hệ, giờ, kênh nhận đơn |
| MenuItem/Variant | Tên, mô tả, giá, dị ứng, định lượng, lựa chọn, trạng thái |
| BranchMenu | Món và giá/tình trạng được bán ở từng chi nhánh |
| DeliveryZone | Khu vực, phí, đơn tối thiểu, chi nhánh |
| Order/OrderItem | Mã, chi nhánh, khách, loại nhận, địa chỉ, ảnh chụp dữ liệu món/giá lúc đặt |
| Payment | Mã giao dịch, số tiền, trạng thái, hoàn tiền |
| Notification | Kênh, sự kiện, số lần thử, kết quả, mã nhà cung cấp |
| Staff/Audit | Người dùng, vai trò, thao tác và thời điểm |
| PolicyVersion | Phiên bản điều khoản/thông báo áp dụng khi đặt |

Lưu bản chụp tên món, giá và lựa chọn vào đơn để việc sửa menu hôm sau không thay lịch sử. Link theo dõi đơn dùng token khó đoán và hạn chế dữ liệu hiển thị; không cho xem đơn người khác bằng cách tăng số thứ tự.

## 9. Kiến trúc và lựa chọn công nghệ

```text
Khách hàng → Website → API kiểm tra đơn → Database
                                      └→ Outbox/hàng đợi → Email / SMS
Nhân viên → Dashboard → Chấp nhận / từ chối / cập nhật đơn
Cổng thanh toán → Webhook đã xác thực → Trạng thái thanh toán
Giám sát → Cảnh báo đơn bị treo, lỗi gửi, sự cố hệ thống
```

Ghi đơn và outbox cùng giao dịch; worker gửi thông báo sau đó, có retry và chống gửi trùng. Khi một dịch vụ thông báo lỗi, không làm mất đơn đã lưu. Không cache nội dung checkout, dữ liệu riêng tư hoặc API ghi đơn như trang tĩnh; cache menu phải tách theo chi nhánh và ngôn ngữ.

| Phương án | Hợp khi | Điểm cần cân nhắc |
|---|---|---|
| Sửa nền tảng hiện tại | Mã nguồn có chất lượng, quyền truy cập đủ, nghiệp vụ còn mở rộng được | Audit trước; tránh chồng plugin vá lỗi |
| Nền tảng thương mại có sẵn | Quy trình đơn giản, muốn vận hành nhanh | Phí định kỳ, giới hạn chi nhánh/tích hợp, xuất dữ liệu |
| Ứng dụng riêng | Quy tắc chi nhánh, giao hàng và quy trình bếp đặc thù | Tốn công xây dựng và bảo trì hơn |

Khuyến nghị hiện tại: **audit hệ thống cũ trước, chưa vội viết lại**. Nếu viết riêng, dùng kiến trúc nguyên khối có module rõ, database quan hệ và worker nền; lựa chọn framework theo năng lực đội bảo trì. Chỉ chốt công nghệ sau khi biết hosting, mã nguồn, plugin và các tích hợp đang dùng.

Nếu thêm thẻ online, dùng checkout hoặc thành phần thanh toán do nhà cung cấp lưu trữ, hỗ trợ luồng xác thực phù hợp; không tự lưu số thẻ/CVV. Stripe liệt kê Slovakia trong phạm vi hỗ trợ, nhưng tài khoản còn phụ thuộc pháp nhân, KYC, ngành nghề và phương thức cụ thể. Xem [Stripe — Global availability](https://stripe.com/global). Chốt thu tiền trước hay ủy quyền rồi thu sau khi bếp nhận dựa trên khả năng cổng và vận hành.

## 10. Đề xuất giao diện phù hợp VietFood

### 10.1. Hướng phong cách

Giữ nhận diện món Việt hiện có: nâu đỏ, vàng ấm, ảnh món thật. Phần đặt món nên dùng nền sáng, chữ đậm rõ và ít trang trí để khách chọn nhanh. Trang chủ có thể giữ ảnh phở lớn nhưng menu và checkout phải đưa nhiệm vụ đặt món lên trước.

Bảng màu gợi ý: nâu đỏ `#351713`, vàng nhấn `#F4B41B`, nền kem `#FFF9F2`, chữ `#24201D`. Kiểm tra tương phản thực tế; không dùng vàng nhạt làm chữ nhỏ trên nền trắng. Dùng font sans-serif hỗ trợ đầy đủ dấu Slovak và tiếng Việt, có thể tự host để giảm phụ thuộc bên thứ ba.

Không suy diễn người Slovakia thích một phong cách duy nhất. Lựa chọn trên xuất phát từ thương hiệu hiện tại và nhu cầu đặt đồ ăn nhanh; cần chủ nhà hàng duyệt bằng mẫu thiết kế.

### 10.2. Bố cục đề xuất

**Trang chủ:** Logo + chi nhánh → trạng thái mở cửa → nút đặt món nổi bật → chọn giao/đến lấy → menu nhanh → món nổi bật → địa chỉ/liên hệ → chính sách.

**Menu điện thoại:** Thanh chi nhánh và hình thức nhận ở đầu; danh mục dễ chuyển; thẻ món có tên, giá, mô tả ngắn, dị ứng và nút thêm. Thanh giỏ hàng dưới cùng hiển thị số món và tổng tạm tính, không che nút khác.

**Menu máy tính:** Danh mục bên trái, món ở giữa, giỏ bên phải. Không buộc khách kéo qua hơn 200 món để tìm nhóm cần mua.

**Checkout:** Một luồng ngắn: hình thức nhận → thông tin liên hệ/địa chỉ → tóm tắt và thanh toán. Nếu đến lấy, ẩn địa chỉ giao. Nếu giao, hiện phí và thời gian sau khi xác định vùng. Giữ dữ liệu khách đã nhập khi báo lỗi.

**Dashboard quầy:** Chữ lớn, đơn mới dễ thấy, nút nhận/từ chối rõ, phân biệt trạng thái bằng cả chữ và màu, có thời gian chờ. Một nút tạm ngừng nhận đơn khi quá tải.

### 10.3. Những chỉnh sửa cụ thể nên làm trước

1. Hiển thị chi nhánh đang chọn nhất quán trên menu, giỏ, checkout và email.
2. Dịch toàn bộ nhãn tiếng Anh trong checkout sang Slovak, có người bản địa duyệt.
3. Thay liên kết `#` bằng trang thật; sửa liên hệ theo chi nhánh.
4. Thêm tìm kiếm/danh mục cố định; tránh ảnh dung lượng lớn cho mọi món cùng lúc.
5. Làm rõ dị ứng, phụ phí bao bì, phí giao và tổng thanh toán.
6. Thay các nút nổi có thể chồng lấn bằng thanh điều khiển gọn, kiểm tra trên màn hình nhỏ.

## 11. Độ mượt, bảo mật và khả năng phục hồi

Các con số dưới đây là **mục tiêu nghiệm thu đề xuất**, chưa phải kết quả đo website hiện tại:

| Tiêu chí | Mục tiêu và cách kiểm tra |
|---|---|
| Tải trang khách | Mục tiêu LCP ≤ 2,5 giây, INP ≤ 200 ms, CLS ≤ 0,1 ở phân vị 75 khi đủ dữ liệu thực; trước ra mắt dùng đo lab và máy thật |
| API tạo đơn | Mục tiêu p95 dưới 2 giây trong tải đã thống nhất, không tính thời gian bên ngoài xác thực thanh toán |
| Chịu tải ban đầu | Kịch bản giả định 100 người xem menu đồng thời, 10 lần gửi đơn/phút; điều chỉnh theo sản lượng nhà hàng |
| Không trùng đơn | Bấm lặp, retry mạng, webhook lặp vẫn chỉ tạo một kết quả nghiệp vụ |
| Thông báo quầy | Mục tiêu hiện đơn mới trong 10 giây khi hệ thống bình thường; email/SMS phụ thuộc nhà cung cấp |
| Sao lưu | Backup tự động, mã hóa, quyền riêng; đề xuất PITR để mục tiêu mất dữ liệu tối đa 15 phút nếu gói hỗ trợ |
| Phục hồi | Đề xuất RTO ≤ 2 giờ; phải diễn tập và thỏa thuận người xử lý |
| Theo dõi vận hành | Uptime, lỗi API, tuổi đơn chờ, hàng đợi lỗi, hết quota SMS/email, thanh toán lệch trạng thái |

Tối ưu ảnh WebP/AVIF, kích thước đúng, lazy load phần dưới, hạn chế script bên thứ ba. Đo từ vùng châu Âu và kiểm thử với điện thoại/mạng tại Slovakia; đo từ Việt Nam không đại diện toàn bộ khách hàng bên đó.

Bảo mật tối thiểu: HTTPS, MFA cho quản trị, phân quyền server, chống truy cập đơn người khác, chống CSRF khi phù hợp, rate limit, kiểm tra đầu vào, tính giá server, bí mật đặt ngoài frontend, xác thực webhook và chống replay, cập nhật phụ thuộc, nhật ký không lộ thông tin khách. Không bắt mọi khách làm CAPTCHA hoặc OTP nếu chưa có nhu cầu; có thể kích hoạt theo nguy cơ lạm dụng.

## 12. Checklist nghiệm thu trước bàn giao

| Nhóm | Kịch bản phải kiểm tra | Bằng chứng cần giữ |
|---|---|---|
| Chi nhánh | Chọn Dolný Štál → menu → giỏ → checkout → thông báo cùng chi nhánh; đổi chi nhánh không giữ nhầm giá | Video/ảnh và đơn thử |
| Món ăn | Món hết, biến thể bắt buộc, ghi chú, phụ phí, dữ liệu dị ứng do bếp duyệt | Danh sách ca kiểm tra và bản menu duyệt |
| Địa chỉ | Đúng vùng, ngoài vùng, sai PSČ, thiếu số nhà, địa chỉ nhập tay, API bản đồ lỗi | Kết quả tính vùng/phí |
| Thời gian | Ngoài giờ, ngày nghỉ, gần giờ đóng, đặt trước và đổi giờ mùa hè | Ca kiểm tra với thời gian giả lập |
| Thông báo | Email vào hộp thư thật, SMS đến số Slovak thử, hết quota, bounce, retry | Mã log nhà cung cấp và người nhận xác nhận |
| Nhận đơn | Quầy nhận/từ chối, không phản hồi, mất mạng, hai nhân viên thao tác cùng lúc | Lịch sử trạng thái |
| Thanh toán | Nếu có: thành công, lỗi, quay lại trình duyệt, webhook lặp, hoàn tiền | Giao dịch sandbox và đối soát |
| Dữ liệu | Nhân viên không xem đơn khác chi nhánh; link theo dõi không lộ đơn khác | Kết quả kiểm tra quyền |
| Chính sách | Link thật, nội dung đúng đơn vị bán, cookie theo lựa chọn | Bản nội dung đã duyệt và kiểm tra tracker |
| Thiết bị | Safari iPhone, Chrome Android, desktop; bàn phím, phóng to, mạng yếu | Biên bản UAT |
| Khôi phục | Restore database/ảnh, kiểm tra đơn mẫu và đăng nhập | Biên bản diễn tập |

Điều kiện mở bán đề xuất: không còn lỗi P0, chủ nhà hàng duyệt nội dung và quy tắc, nhân viên hoàn thành đơn thử, tài khoản dịch vụ đủ điều kiện gửi thật, có người trực xử lý sự cố và phương án quay lại bản cũ.

## 13. Lộ trình thực hiện và bàn giao

### Giai đoạn 1 — Chốt nghiệp vụ và audit

Thu thập quyền truy cập kỹ thuật, xác nhận một hay năm chi nhánh, kiểm tra công nghệ cũ, menu, luồng email/SMS, tài khoản, chính sách và dữ liệu cần di chuyển. Đầu ra: phạm vi ký duyệt, danh sách lỗi, sơ đồ đơn hàng và phương án sửa hay xây mới.

### Giai đoạn 2 — Thiết kế và dựng luồng cốt lõi

Thiết kế mobile trước, thống nhất giao/đến lấy, chi nhánh, menu và checkout. Phát triển lưu đơn, dashboard, trạng thái, email/SMS, phân quyền, vùng giao và cấu hình giờ. Nếu có thanh toán online, coi đây là một module có kiểm thử riêng.

### Giai đoạn 3 — Bản địa hóa, tuân thủ và kiểm thử

Nhập dữ liệu đã duyệt, hoàn thiện trang chính sách, dịch thông báo, kiểm thử các ngoại lệ, tải và phục hồi. Chạy UAT cùng nhân viên tại Slovakia.

### Giai đoạn 4 — Chuyển đổi và vận hành

Backup hệ thống cũ, hạ TTL khi cần, chốt thời điểm chuyển, tránh hai hệ thống nhận trùng đơn, đối soát các đơn đang mở. Có kế hoạch rollback không làm mất đơn mới. Theo dõi sát trong các ca bán đầu; chủ nhà hàng tự thao tác trước khi ký bàn giao.

Ước lượng sơ bộ cho việc lập kế hoạch, không phải báo giá: cải tạo nền tảng tốt có thể khoảng 3–6 tuần; xây riêng nhiều chi nhánh và thanh toán có thể 6–10 tuần hoặc hơn. Phụ thuộc chất lượng mã cũ, số người làm, dữ liệu, tích hợp POS, phê duyệt chính sách và thời gian KYC. Không cam kết lịch trước audit.

### Hồ sơ bàn giao

- Mã nguồn/repository, hướng dẫn build và deploy, cấu hình mẫu không chứa bí mật.
- Tài khoản doanh nghiệp, chủ sở hữu, quyền developer, lịch gia hạn và cách thu hồi quyền.
- Danh mục hosting, database, tên miền, email, SMS, thanh toán, backup và bên trả phí.
- Hướng dẫn nhận/từ chối đơn, hết món, đóng cửa, xử lý lỗi thông báo và hoàn tiền.
- Hướng dẫn backup/restore, theo dõi lỗi, rollback và liên hệ hỗ trợ.
- Bản menu/thuế/chính sách đã duyệt, kết quả UAT, lỗi tồn còn chấp nhận và kế hoạch sửa.
- Phạm vi bảo hành, bảo trì, giờ hỗ trợ theo Slovakia, mức phản hồi và phí phát sinh.
- Khóa bí mật bàn giao qua kênh an toàn; không dán vào tài liệu chung. Rà soát/đổi khóa sau chuyển giao khi cần.

## 14. Chi phí cần dự trù

Tách phí xây dựng một lần và phí vận hành liên tục. Chưa có sản lượng đơn, ngân sách và bảng giá nhà cung cấp đã chọn nên chưa thể đưa tổng chi phí đáng tin cậy.

| Khoản | Cách dự toán |
|---|---|
| Tên miền | Phí đăng ký/gia hạn theo năm |
| Hosting/database/backup | Gói cố định + lưu trữ, băng thông, phục hồi và hỗ trợ |
| Email | Số thông báo mỗi đơn × số đơn + thông báo hệ thống |
| SMS | Số người nhận × sự kiện × segment × đơn giá tuyến Slovakia |
| Thanh toán | Phần trăm giao dịch + phí cố định + các loại phí theo hợp đồng |
| Bản đồ | Lượt gợi ý, geocode và tính tuyến; đặt giới hạn chi tiêu |
| Bảo trì | Cập nhật, theo dõi, trực sự cố và kiểm thử hồi quy |
| Nội dung/pháp lý | Dịch Slovak, xác minh menu, ảnh món, pháp lý và kế toán |
| Thiết bị | Máy quầy/tablet, mạng dự phòng, máy in nếu cần |

Ví dụ chỉ để hình dung sản lượng: 1.000 đơn/tháng, mỗi đơn một SMS tới quầy và một tới khách = 2.000 lượt SMS; nếu mỗi tin chiếm hai segment thì tính 4.000 segment. Chưa cộng retry hoặc tin thay đổi trạng thái. Không dùng con số minh họa này như báo giá.

## 15. Những câu hỏi cần chốt với chủ nhà hàng

1. Chỉ phục vụ Dolný Štál hay cả năm chi nhánh? Các chi nhánh chung hay khác pháp nhân?
2. Ai đang quản lý tên miền, hosting, mã nguồn và website hiện tại? Có quyền xuất dữ liệu không?
3. Mỗi chi nhánh dùng menu, giá, dị ứng, giờ và tài khoản nhận tiền nào?
4. Nhà hàng tự giao hay thuê đối tác? Danh sách vùng giao, phí, đơn tối thiểu và thời gian thực tế?
5. Nhận tiền mặt, thẻ tại quầy/tài xế hay thẻ online? POS/eKasa hiện đang dùng sản phẩm gì?
6. Email và số điện thoại nào nhận đơn ở từng chi nhánh? Ai trực và ai dự phòng?
7. Sau bao lâu không phản hồi thì nhắc, báo quản lý và hết hạn đơn?
8. Cần khách nhận thông báo ở những mốc nào? “Điện thoại” là SMS hay kênh khác?
9. Số đơn mỗi ngày, giờ cao điểm, ngân sách vận hành và nhu cầu hỗ trợ ngoài giờ?
10. Ai duyệt tiếng Slovak, chính sách, dữ liệu món/thuế và thời hạn lưu dữ liệu?
11. Có cần chuyển đơn/lịch sử khách cũ không? Có quyền và căn cứ để chuyển không?
12. Các trang/kênh Bistro, Google và mạng xã hội phải dẫn về hệ thống mới thế nào?

## 16. Đề xuất phạm vi chốt để bắt đầu

**Nếu làm riêng Dolný Štál:** Ưu tiên một chi nhánh, giao/đến lấy, menu đúng, vùng/phí giao, dashboard, xác nhận đơn, email và SMS dự phòng, chính sách và bản địa hóa. Dữ liệu nên có mã chi nhánh để mở rộng nhưng không cần xây quản trị chuỗi phức tạp ngay.

**Nếu thay website cả chuỗi:** Định tuyến chi nhánh, menu/giá riêng, liên hệ riêng và phân quyền phải nằm trong bản đầu. Không trì hoãn những phần này vì chúng quyết định đơn đến đúng nơi.

**Thứ tự xử lý website hiện tại:** (1) chi nhánh và dữ liệu món; (2) chính sách và checkout; (3) lưu/nhận/xác nhận đơn; (4) email/SMS và ngoại lệ; (5) kiểm thử tại Slovakia; (6) tối ưu giao diện và mở rộng.

Chưa nên ưu tiên app điện thoại riêng, tích điểm, AI gợi ý món hoặc theo dõi tài xế trực tiếp trước khi luồng đặt → nhận → xác nhận → giao hoạt động đáng tin cậy.

## 17. Nguồn tham khảo và giới hạn

Các nguồn chính thức đã được tra cứu khi lập tài liệu ngày 11/10/2026; đường dẫn được đặt sát phần liên quan. Nguồn quan sát website là phiên trình duyệt công khai, không phải kiểm toán backend. Các mục kỹ thuật, ngân sách, thời gian và thiết kế là đề xuất của người viết, không phải trích dẫn từ nhà hàng hay nhà cung cấp.

- Website tham chiếu: [vietfood.sk](https://vietfood.sk/), [menu](https://vietfood.sk/hlavne-menu), [checkout](https://vietfood.sk/checkout).
- Hồ sơ gốc: [liên kết Google được cung cấp](https://share.google/YH05H9ydKDT3BYvae).
- Pháp lý: Slov-Lex, European Commission, Your Europe, EUR-Lex và Finančná správa, theo các liên kết ở mục 7.
- Tích hợp: tài liệu chính thức Twilio và Stripe ở mục 5 và 9; cần xác minh lại điều kiện, phí và khả năng tích hợp tại thời điểm ký hợp đồng.

**Trạng thái tài liệu:** Hoàn thành phân tích sơ bộ và khung triển khai. Chưa triển khai website, chưa tạo tài khoản trả phí, chưa gửi đơn hoặc thông báo thật. Những phần cần truy cập nội bộ và chủ nhà hàng xác nhận đã được liệt kê để tiếp tục phân tích.
