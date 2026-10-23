# DOLNÝ ŠTÁL — PHẠM VI ĐÃ RÕ VÀ THÔNG TIN CẦN BỔ SUNG

> Cập nhật 12/10/2026: các câu trả lời tiếp theo đã được tổng hợp trong [kế hoạch mới](./PLAN_WEBSITE_DOLNY_STAL.md). Dùng kế hoạch này làm nguồn phạm vi hiện hành; các câu hỏi và lựa chọn SMS/nhiều chi nhánh trong bản dưới là lịch sử trao đổi.

**Cập nhật:** 11/10/2026  
**Nguồn:** Các câu trả lời mới của người dùng và tài liệu khảo sát website trước đó.  
**Trạng thái:** Phân tích yêu cầu để người dùng xem xét; chưa lập kế hoạch triển khai, chưa chọn công nghệ, chưa viết code.

## 1. Đã xác định được phạm vi chưa?

**Đã đủ để xác định phạm vi sản phẩm ở mức nghiệp vụ:** một website riêng cho VietFood tại Dolný Štál, dùng menu và thông tin của chi nhánh này, nhận đơn đến lấy hoặc nhà hàng tự giao, quản lý đơn và phản hồi khách, thanh toán trực tiếp.

**Chưa đủ để chốt phạm vi triển khai và dự toán:** còn thiếu cách tách quyền kiểm soát khỏi website dùng chung, cách gửi SMS, quy tắc giao hàng, nhận đơn tại quầy và mức kết nối với máy tính tiền. Những lựa chọn này có thể thay đổi đáng kể công việc cần làm.

Không cần trả lời lại toàn bộ bộ câu hỏi cũ. Thông tin đã xác nhận được giữ nguyên dưới đây. Các mục đề xuất chưa được xem là quyết định của chủ nhà hàng.

## 2. Thông tin đã được xác nhận và tác động

| Nội dung | Trạng thái mới | Tác động đến phạm vi |
|---|---|---|
| Địa điểm | Chỉ Dolný Štál | Bỏ chọn chi nhánh, định tuyến giữa chi nhánh và quản trị chuỗi |
| Mục tiêu | Hiện dùng chung với người khác, muốn kiểm soát thông tin | Cần làm rõ quyền sở hữu và mức độc lập về tài khoản, dữ liệu, tên miền |
| Menu | Menu riêng của chi nhánh | Chỉ nhập dữ liệu Dolný Štál; không lấy toàn bộ menu web chung làm chuẩn |
| Nhận món | Khách đến lấy hoặc nhà hàng tự giao | Hai luồng checkout và trạng thái giao/đến lấy riêng |
| Thanh toán tại quán | Tiền mặt hoặc quẹt thẻ tại quầy | Website ghi cách trả, không thu tiền online |
| Thẻ khi giao | Máy thẻ chỉ ở quầy | Không hiển thị lựa chọn quẹt thẻ với tài xế |
| Tiền mặt khi giao | Chưa nói rõ việc tài xế thu hộ tại cửa | Cần xác nhận, không tự coi là đã chốt |
| Máy tính tiền | Đã có ở quầy | Chưa biết có cần tích hợp tự động hay nhân viên nhập lại |
| Email/điện thoại | Đã có cho chi nhánh | Không cần tạo địa chỉ liên hệ mới một cách mặc định; cần biết tài khoản và quyền sử dụng |
| Không phản hồi | Sau 5 phút nhắc và báo quản lý | Dùng làm yêu cầu nghiệp vụ, còn cần xác định kênh nhắc |
| Hết hạn | Khoảng 30 phút chưa xác nhận | Chốt số phút chính xác và cách xử lý khách; chỉ áp dụng đơn chưa được nhận |
| Thông báo khách | Email hoặc SMS, có nhắc đến số quản lý | Cần tách số nhận thông báo và số đứng tên gửi SMS |
| Sản lượng | Chưa có thống kê | Có thể dùng ước lượng; chưa phải lý do ngừng phân tích |
| Ngôn ngữ | Nhân viên hiểu Slovak gần bản địa | Có nguồn lực duyệt nội dung; đề xuất giao diện khách và quản trị bằng Slovak |
| Dữ liệu cũ | Chưa cần chuyển đơn và khách | Bỏ migration lịch sử; vẫn cần nhập menu, ảnh và thông tin chi nhánh |
| Kênh bên ngoài | Chưa rõ câu hỏi 12 | Giải thích riêng tại mục 8; chưa mặc định cần tích hợp API |

## 3. Khung chức năng có thể xác định ngay

### 3.1. Phía khách

- Trang chủ của riêng Dolný Štál: tên, địa chỉ, giờ, liên hệ và nút đặt món.
- Menu riêng: nhóm món, giá, mô tả, ảnh, dị ứng, lựa chọn thêm, món hết hàng.
- Giỏ hàng: sửa số lượng, món thêm, phí bao bì và phí giao nếu áp dụng.
- Checkout với hai lựa chọn rõ: đến lấy hoặc giao tận nơi; không cần chọn chi nhánh.
- Thông tin người nhận; địa chỉ bắt buộc khi giao; phương thức trả phù hợp loại đơn.
- Mã đơn và trạng thái chờ xác nhận/đã nhận/từ chối/hết hạn/đang làm/sẵn sàng/đang giao/hoàn tất theo từng luồng.
- Thông báo cho khách qua kênh đã chốt, trang xem trạng thái và liên hệ nhà hàng.
- Trang liên hệ, điều kiện giao/đến lấy, chính sách và thông tin doanh nghiệp phù hợp chi nhánh.

### 3.2. Phía nhân viên và quản lý

- Xem đơn mới, nhận hoặc từ chối, nhập thời gian dự kiến, cập nhật trạng thái.
- Nhắc sau 5 phút và báo quản lý nếu chưa có quyết định nhận/từ chối.
- Hết hạn đơn chưa xác nhận theo ngưỡng khoảng 30 phút đã nêu.
- Sửa menu, giá, giờ, tình trạng hết món và tạm dừng nhận đơn.
- Xem lịch sử đơn mới phát sinh trên hệ thống, tình trạng thông báo và người xử lý.
- Phân quyền quản lý/nhân viên trong một chi nhánh; không cần phân quyền chuỗi.

Đây là khung phạm vi để duyệt, không khẳng định web cũ đã có mọi chức năng quản trị trên. Khảo sát trước chỉ xác minh giao diện công khai.

### 3.3. Những phần đã loại khỏi phạm vi và phần chưa quyết định

**Đã loại theo câu trả lời:** nhiều chi nhánh, thanh toán online, quẹt thẻ tại nhà khách, chuyển lịch sử đơn/khách cũ.

**Chưa tự đưa vào bản đầu:** kết nối POS/eKasa, in bếp tự động, đồng bộ Bistro, tài khoản khách, tích điểm, mã giảm giá, blog, ứng dụng tài xế, bản đồ theo dõi trực tiếp, đa ngôn ngữ. Các phần này chỉ thêm khi người dùng xác nhận cần.

“Giữ tính năng chính của web cũ” nên được hiểu bằng danh sách chức năng đã duyệt, không phải sao chép mọi trang hay toàn bộ kiến trúc cũ. Cần xác nhận có giữ menu ngày, sushi, đồ uống và tùy chọn món nào thực sự được bán ở Dolný Štál.

## 4. Thiếu sót quan trọng nhất: độc lập đến mức nào?

“Kiểm soát lại thông tin” có thể có ba mức khác nhau:

| Mức | Ý nghĩa | Giới hạn |
|---|---|---|
| Chỉ tự sửa nội dung | Có tài khoản sửa trang/menu Dolný Štál trên web chung | Chủ hệ thống chung vẫn kiểm soát hosting và dữ liệu |
| Có khu vực riêng trên web chung | Trang/subdomain riêng, quyền và dữ liệu tách một phần | Có thể vẫn phụ thuộc người giữ tên miền hoặc hạ tầng |
| Website độc lập | Tài khoản quản trị, dữ liệu, hosting và tên miền do chi nhánh kiểm soát | Cần tên miền/quyền sử dụng thương hiệu và cách đưa khách tới website mới |

**Đề xuất để xem xét:** Nếu mục tiêu là tự chủ lâu dài, nên chọn website có dữ liệu và tài khoản dịch vụ do chủ chi nhánh kiểm soát. Tuy nhiên chưa mặc định phải mua tên miền mới: trước hết xác định ai sở hữu tên miền hiện tại và có thể cấp quyền gì.

Cần cung cấp trước khi lập kế hoạch:

1. Muốn độc lập hoàn toàn hay tiếp tục dùng một phần hệ thống chung?
2. Ai đang giữ tên miền, hosting và tài khoản quản trị? Chi nhánh có quyền nào?
3. Có được dùng lại tên VietFood, logo, ảnh món và nội dung hiện có không?
4. Có thể nhận mã nguồn hoặc bản xuất menu của riêng chi nhánh không? Không có mã cũ vẫn có thể xây mới; ảnh hưởng đến quyết định tận dụng hay thay thế.
5. Khi website mới chạy, phần Dolný Štál trên web cũ sẽ dẫn sang trang mới, ngừng nhận đơn, hay tiếp tục nhận song song? Ai có quyền sửa?

Không nên đổi cấu hình toàn bộ website chung hoặc chuyển hướng tên miền chung vì có thể ảnh hưởng những chi nhánh khác. Nếu chưa sửa được web cũ, cần xác định người chịu trách nhiệm theo dõi cả hai nguồn đơn trong thời gian tồn tại song song.

## 5. Những quyết định nghiệp vụ còn thiếu trước khi lập kế hoạch

| Mã | Cần làm rõ | Vì sao ảnh hưởng phạm vi | Đề xuất/định dạng trả lời |
|---|---|---|---|
| Q1 | Mức độc lập, tên miền và quyền dùng lại tài sản | Quyết định sửa hệ thống chung hay website riêng | Chọn một trong ba mức ở mục 4; nêu người giữ quyền |
| Q2 | Gửi SMS tự động hay quản lý tự nhắn? Có bắt buộc hiện đúng số SIM của quản lý? | Hai cách vận hành và tích hợp khác nhau | Chọn theo mục 6 |
| Q3 | Giao tới những xã/khu vực nào, phí, tối thiểu, bao bì? Tài xế có thu tiền mặt không? | Quyết định checkout, kiểm tra địa chỉ và tổng tiền | Danh sách khu vực + phí; chưa biết mức tiền có thể ghi “chốt sau” |
| Q4 | “Đặt trước” là đặt ngay rồi đến lấy hay chọn ngày/giờ tương lai? | Đặt lịch cần lịch phục vụ, thời gian chuẩn bị và giới hạn suất | Chọn ngay / hẹn giờ trong ngày / nhiều ngày |
| Q5 | Ai nhận đơn bằng thiết bị nào, cần kết nối máy tính tiền không? | Dashboard độc lập khác với tích hợp POS/in bếp | Máy quầy/tablet/điện thoại; nhập POS tay hay tự động |
| Q6 | Phản hồi là xem đơn hay bấm nhận/từ chối? Hết hạn chính xác lúc nào? | Tránh tự hủy nhầm đơn đã nhận hoặc khách tưởng đang nấu | Đề xuất lấy quyết định nhận/từ chối làm phản hồi; ngưỡng 30 phút cần duyệt |
| Q7 | Khách phải cung cấp điện thoại, email hay cả hai? Ai chọn kênh? | Quyết định form và hệ thống gửi | Đề xuất điện thoại để giao/liên hệ; email tùy chính sách kênh được duyệt |
| Q8 | Ai sửa menu/giá, xác nhận thanh toán, hủy đơn? | Quyết định vai trò và quyền | Nhân viên nhận đơn; quản lý cấu hình/giá — đề xuất |
| Q9 | Ngân sách xây dựng, chi phí tháng và thời điểm mong muốn | Quyết định mức tự động hóa, hạ tầng, dịch vụ SMS | Có thể nêu khoảng, chưa cần số chính xác |

Không cần trả lời các lựa chọn kỹ thuật như framework hay database. Đó là phần người triển khai đề xuất sau khi có định hướng trên.

### 5.1. Thanh toán: điểm chưa rõ cần tránh suy diễn

| Loại đơn | Tiền mặt | Thẻ |
|---|---|---|
| Đến lấy | Đã xác nhận tại quán | Đã xác nhận tại quầy |
| Nhà hàng giao | Cần xác nhận tài xế thu tại cửa | Không có máy thẻ đi giao theo thông tin hiện tại |

Nếu tài xế không thu tiền mặt và không có thanh toán online, phải xác định cách trả tiền cho đơn giao trước khi đưa luồng này vào vận hành. Không tự thêm chuyển khoản hoặc cổng thanh toán để lấp chỗ trống.

Máy tính tiền có sẵn không đồng nghĩa có API kết nối. Nếu cần tích hợp, phải biết hãng, model, phần mềm và nhà cung cấp hỗ trợ. Nếu chấp nhận nhập tay, có thể phân tích website độc lập mà chưa cần thông số tích hợp; vẫn cần quy trình đối chiếu mã đơn, tiền và chứng từ với người phụ trách tại quầy.

### 5.2. Nhắc 5 phút và hết hạn khoảng 30 phút

Giữ nguyên ý định của người dùng; đề xuất diễn giải để duyệt:

- Mốc bắt đầu là lúc hệ thống lưu thành công đơn, không phải lúc khách mở giỏ hay lúc SMS được phát.
- Sau 5 phút còn chờ quyết định: nhắc quầy và báo quản lý. Cần chọn chuông, email, SMS hay kết hợp; nhắc một lần hay lặp lại chưa được chốt.
- Khoảng 30 phút vẫn chờ: chuyển “hết hạn”, báo khách, không đưa vào bếp. Cần chốt đúng 30 phút hay giá trị khác.
- Đơn đã được nhận trước đó không bị hủy chỉ vì quá 30 phút; thời gian làm/giao món là vấn đề khác.
- “Đã mở xem đơn” không nên đồng nghĩa “đã nhận làm món”. Đây là đề xuất cần duyệt.
- Nếu nhận và hết hạn xảy ra cùng thời điểm, hệ thống chỉ được ghi nhận một kết quả cuối cùng; không vừa báo nhận vừa báo hết hạn.
- Đơn hẹn giờ cũng cần xác nhận sớm sau khi tạo, nếu đó là chính sách nhà hàng chọn; không mặc định chờ tới giờ hẹn mới tính 30 phút.

30 phút là thời gian chờ xác nhận khá dài với nhu cầu ăn ngay. Không tự thay ngưỡng của chủ nhà hàng, nhưng giao diện cần nói rõ đang chờ và khuyến nghị khách chờ xác nhận trước khi đến lấy. Cần quyết định cách khách hủy khi đang chờ, cách xử lý đổi ý sau khi bếp nhận, khách không đến và giao không liên lạc được.

## 6. Làm rõ “SMS bằng số điện thoại của chính quản lý”

Có ba việc khác nhau:

1. **Quản lý nhận cảnh báo:** hệ thống gửi đến số quản lý. Số này là người nhận.
2. **Khách liên hệ nhà hàng:** hiển thị số quản lý/chi nhánh trong web và nội dung tin nhắn.
3. **SMS tự động xuất hiện là gửi từ đúng số quản lý:** cần nhà cung cấp/nhà mạng hỗ trợ; không thể bảo đảm chỉ bằng việc nhập số điện thoại vào cấu hình.

| Cách làm | Trải nghiệm | Điểm cần chốt |
|---|---|---|
| Quản lý tự nhắn từ điện thoại | Dùng đúng số SIM đang có | Thủ công; website không tự biết đã gửi/khách đã phản hồi; không bảo đảm tin hết hạn được gửi nếu quản lý vắng |
| Website gửi tự động qua dịch vụ SMS | Gửi theo trạng thái ngay cả khi quản lý chưa mở điện thoại | Có phí; số/tên người gửi phụ thuộc dịch vụ và tuyến Slovakia |
| Tích hợp dùng số/SIM hiện tại | Có thể phù hợp nếu dịch vụ cụ thể hỗ trợ | Cần xác minh với nhà cung cấp; không coi là khả năng mặc định hoặc cam kết trước |

Ví dụ giới hạn thực tế: tài liệu Twilio cho Slovakia hiện ghi không hỗ trợ SMS hai chiều và có điều kiện riêng về Sender ID. Điều này chỉ mô tả Twilio, không đại diện mọi nhà cung cấp. Nguồn kiểm tra 11/10/2026: [Twilio — Slovakia SMS Guidelines](https://www.twilio.com/en-us/guidelines/sk/sms).

**Đề xuất để xem xét:** hệ thống tự gửi email/SMS, còn số quản lý dùng làm số liên hệ và nhận cảnh báo; chưa cam kết SMS tự động hiện đúng số SIM. Nếu bắt buộc đúng số SIM, cần ghi đây là yêu cầu bắt buộc để khảo sát giải pháp trước khi lập kế hoạch.

Với email cũng cần phân biệt hộp thư nhận đơn, địa chỉ gửi tự động và Reply-To cho khách trả lời. Email đã có chưa cho biết có quyền cấu hình gửi tự động hay quyền quản lý tên miền. Chỉ cần cung cấp loại hộp thư và người quản lý ở giai đoạn này, không cần gửi mật khẩu/API key.

## 7. Dữ liệu cần chuẩn bị — không phải tất cả đều chặn việc lập kế hoạch

| Nhóm dữ liệu | Cần cung cấp | Khi nào cần |
|---|---|---|
| Danh tính chi nhánh | Tên hiển thị, địa chỉ, người/pháp nhân bán hàng, thông tin đăng ký phù hợp | Biết người chịu trách nhiệm trước plan; đầy đủ trước nội dung chính sách và mở bán |
| Liên hệ | Email, số công khai, số cảnh báo, người dự phòng | Vai trò kênh trước plan; địa chỉ/số thật khi cấu hình |
| Menu riêng | Tên, nhóm, mô tả, giá, định lượng, lựa chọn/phụ phí, dị ứng, ảnh được phép dùng | Mẫu đại diện trước plan; toàn bộ trước nhập nội dung/nghiệm thu |
| Giờ | Giờ quán, giờ nhận đơn giao/đến lấy, nghỉ, thời gian làm món, giờ chốt đơn | Quy tắc trước plan; lịch đầy đủ trước vận hành |
| Giao hàng | Khu vực, phí, tối thiểu, đóng gói, người thu tiền, giới hạn đơn/chuyến | Cách tính trước plan; số liệu chính xác trước xây quy tắc và mở bán |
| Nhận đơn | Thiết bị, người trực, người quản lý, quyền thao tác, quy trình khi mất mạng | Trước plan |
| Máy tính tiền | Có cần tích hợp không; nếu có thì hãng/model/phần mềm và tài liệu | Quyết định tích hợp trước plan; thông số nếu có tích hợp |
| Nhận diện | Có giữ logo/màu hiện tại không; ảnh quán, ảnh món, quyền sử dụng | Định hướng trước thiết kế; tài sản hoàn chỉnh có thể bổ sung sau |
| Kênh tìm khách | Quyền quản lý Google, Facebook/Instagram, Bistro và phần chi nhánh trên web cũ | Trước chốt cách công bố website |
| Chính sách | Người duyệt tiếng Slovak, quy tắc khiếu nại/hủy, dữ liệu doanh nghiệp và lưu giữ | Xác định đầu mối trước plan; nội dung duyệt trước mở bán |
| Vận hành | Ngân sách tháng, người trả phí, người giữ tài khoản và đầu mối hỗ trợ | Trước chọn dịch vụ |

Chưa cần có thống kê chính xác số đơn. Có thể ước lượng: một ca thường bao nhiêu đơn qua điện thoại/trực tiếp, giờ bận nhất và bếp xử lý được bao nhiêu đơn cùng lúc. Nếu chưa biết, để công suất có thể cấu hình và đo sau khi chạy; không biến số tải minh họa ở tài liệu cũ thành số liệu thật.

Nhân viên hiểu Slovak tốt giúp giải quyết việc dịch và kiểm tra trải nghiệm; vẫn nên chỉ định một người duyệt cuối để tránh mỗi người sửa tên món/giá theo một cách. Khả năng ngôn ngữ không tự thay vai trò kế toán hoặc người duyệt chính sách.

## 8. Giải thích câu hỏi 12 về Google, mạng xã hội và Bistro

Câu hỏi này có nghĩa: **khách đang tìm đến nhà hàng từ đâu, và khi có website riêng thì các nơi đó sẽ dẫn khách đi đâu?** Không phải mặc định yêu cầu xây tích hợp phức tạp.

| Kênh | Việc cần xác định | Có cần đồng bộ đơn không? |
|---|---|---|
| Hồ sơ Google Dolný Štál | Ai quản lý, có thể cập nhật link website/đặt món của đúng chi nhánh không? | Chỉ đổi link không cần đồng bộ đơn |
| Facebook/Instagram | Trang nào của riêng chi nhánh, ai có thể đổi link hoặc thông tin liên hệ? | Chỉ dẫn khách tới web không cần tích hợp API |
| Bistro | Có đang dùng không, có giữ nhận đơn ở đây không? | Nếu giữ riêng thì nhân viên theo dõi riêng; đồng bộ là yêu cầu bổ sung |
| Web dùng chung | Phần Dolný Štál dẫn sang web mới hay vẫn nhận đơn? Ai sửa được? | Nếu cả hai nhận, cần quy trình theo dõi hai nguồn và công suất |
| QR/menu in | Có link cũ trên thực đơn, tờ rơi hoặc QR không? | Chỉ cần cập nhật vật liệu/link khi ra mắt |

Một câu trả lời đủ để định hướng có thể là: “Giữ các kênh hiện có, đưa khách từ Google và mạng xã hội sang website riêng nếu có quyền sửa; Bistro vẫn xử lý riêng, chưa đồng bộ. Phần Dolný Štál trên web cũ sẽ thống nhất lại với người quản lý.” Đây là mẫu để người dùng xem xét, chưa phải quyết định đã được đưa ra.

## 9. Định hướng giao diện còn cần duyệt

Đề xuất giữ nhận diện VietFood đã có nếu được phép, nhưng mọi tên, địa chỉ, giờ, menu và liên hệ đều thuộc Dolný Štál. Bỏ hộp chọn chi nhánh và danh sách năm địa điểm. Nổi bật hai nút “Đến lấy” và “Giao tận nơi”, ưu tiên dùng điện thoại, menu dễ tìm và tổng phí rõ.

Cần xác nhận ba điểm: giữ thương hiệu/màu hiện tại hay muốn khác; khách và quản trị chỉ dùng Slovak hay cần ngôn ngữ khác; có giữ các trang giới thiệu/blog như web cũ hay chỉ giới thiệu, menu, liên hệ và chính sách. Không cần chọn font/mã màu ngay để trả lời các câu hỏi nghiệp vụ.

## 10. Mẫu trả lời ngắn cho vòng xem xét tiếp theo

Không cần điền lại những thông tin đã chốt. Có thể trả lời “chưa biết” và chỉ định người sẽ xác minh.

1. **Quyền kiểm soát:** muốn độc lập ở mức nào; ai giữ tên miền/web cũ; có quyền dùng logo/ảnh không?
2. **SMS:** quản lý tự gửi hay website tự gửi; có bắt buộc khách thấy đúng số SIM quản lý không; khách cần trả lời SMS không?
3. **Giao hàng:** những khu vực dự kiến; cách tính phí/đơn tối thiểu/bao bì; tài xế có nhận tiền mặt tại cửa không?
4. **Thời điểm nhận món:** chỉ đặt ngay hay chọn lịch; giờ nhận đơn và thời gian chuẩn bị dự kiến?
5. **Quầy:** xem đơn bằng máy nào; nhập đơn vào máy tính tiền bằng tay được không hay bắt buộc tự động?
6. **Quy tắc đơn:** xác nhận đúng ngưỡng hết hạn; kênh nhắc quản lý; cách hủy/đổi và xử lý không đến lấy?
7. **Thông tin khách:** bắt buộc những trường nào; email/SMS do khách chọn hay nhà hàng quy định?
8. **Menu/giao diện:** có menu Dolný Štál bản chuẩn chưa; nhóm món cần giữ; giữ thương hiệu và chỉ dùng Slovak được không?
9. **Kênh cũ:** ai sửa được Google/mạng xã hội; có giữ Bistro và nhận đơn web cũ song song không?
10. **Giới hạn dự án:** khoảng ngân sách, thời điểm mong muốn, người duyệt cuối và người trả phí dịch vụ?

## 11. Điều kiện để chuyển sang lập kế hoạch

Có thể lập kế hoạch sau khi người dùng xem xét và yêu cầu tiếp tục, với các quyết định ảnh hưởng kiến trúc đã rõ: mức độc lập, cách nhận/gửi thông báo, phương thức trả cho đơn giao, quy tắc giao cơ bản, đặt ngay/hẹn giờ và tích hợp máy tính tiền hay nhập tay. Những số liệu chi tiết còn thiếu có thể được ghi thành đầu việc thu thập với người chịu trách nhiệm, không nhất thiết chờ đủ mọi ảnh và mọi dòng menu.

**Kết quả vòng này:** đã khoanh vùng sản phẩm một chi nhánh và các khoảng trống cần xem xét. Chưa có kế hoạch triển khai được chốt; các đề xuất trong tài liệu này chỉ trở thành yêu cầu khi người dùng duyệt. Tài liệu khảo sát cũ được giữ để tham khảo bằng chứng, nhưng phạm vi mới ở đây được ưu tiên khi có khác biệt.
