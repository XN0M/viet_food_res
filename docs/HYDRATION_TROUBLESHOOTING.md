# Cảnh báo hydration do HTML bị can thiệp

Ảnh lỗi được báo sau khi mở trang menu chứa các thuộc tính `bis_skin_checked`, `bis_register` và `__processed_*` phía HTML trình duyệt; phía React không khai báo các thuộc tính này.

## Kết quả đối chiếu

- Không tìm thấy các thuộc tính trên trong mã ứng dụng hoặc HTML trả về từ `/menu?group=hlavne`.
- Kiểm tra Chromium sạch ở desktop và cấu hình điện thoại đi qua trang chủ, checkout, thông tin, admin và menu đều không có lỗi hydration hoặc lỗi JavaScript chưa xử lý.
- Bài kiểm tra ở `e2e/hydration.spec.ts`; chạy lại bằng `npm run test:e2e -- e2e/hydration.spec.ts`.
- Ảnh đối chiếu ở `.local/previews/hydration-clean-chromium.png` và `hydration-clean-mobile.png`.

Các kết quả cho thấy DOM bị can thiệp ở môi trường trình duyệt báo lỗi, phù hợp với việc tiện ích hoặc phần mềm thêm thuộc tính trước khi React khởi động. Chưa xác định tên thành phần chèn thuộc tính chỉ từ ảnh lỗi.

## Cách kiểm tra trên máy đang gặp lỗi

1. Mở cùng địa chỉ bằng một cửa sổ riêng tư không cho tiện ích hoạt động hoặc một hồ sơ trình duyệt sạch.
2. Tải lại trang và kiểm tra cảnh báo còn xuất hiện không. Đóng bảng lỗi cũ và tải lại để tránh nhầm lỗi đã lưu với lỗi mới.
3. Nếu cửa sổ sạch không lỗi, kiểm tra những tiện ích có quyền sửa nội dung website trong hồ sơ đang gặp lỗi. Nếu vẫn lỗi ở mọi hồ sơ, tiếp tục xác định nguồn chèn DOM ở môi trường máy; không tự tắt toàn bộ công cụ bảo vệ máy.

Không thêm `suppressHydrationWarning` trên diện rộng, tắt SSR hoặc xóa thuộc tính DOM bằng script để che cảnh báo. Các biện pháp đó không xử lý nguồn can thiệp và có thể làm mất dấu lỗi thật.

Tham khảo: https://nextjs.org/docs/messages/react-hydration-error — Next.js liệt kê tiện ích trình duyệt sửa HTML là một nguyên nhân của hydration mismatch.
