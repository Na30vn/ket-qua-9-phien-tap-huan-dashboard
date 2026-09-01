# Dashboard kết quả 09 phiên tập huấn

Dashboard trình chiếu độc lập kết quả của từng tab `Phiên 1` đến `Phiên 9` trong Google Sheet `KET_QUA_9_PHIEN_TAP_HUAN`.

## Đặc điểm

- Mỗi phiên có một màn hình tổng hợp riêng.
- Mỗi phiên có hai trạng thái: **Đang nhận bài** và **Đã chốt**. Khi chốt, số liệu được cố định theo thời gian gửi; bài đến muộn được đếm riêng.
- Phiên 1, 4: lúc nhận bài hiển thị đồng thời các phương án của mọi câu nhưng không lộ đáp án; sau khi chốt có tỷ lệ đúng theo câu, phân bố số câu đúng và phân bố đáp án động.
- Phiên 9: tỷ lệ đúng hai câu và phân bố đáp án động, không thêm biểu đồ điểm không cần thiết.
- Phiên 2: lúc nhận bài hiển thị 10 trình tự đầu tiên; sau khi chốt có tỷ lệ đặt đúng vị trí từng bước và Top 5 trình tự sai phổ biến.
- Phiên 6: lúc nhận bài hiển thị hai cột Đúng/Sai và 2–3 giải thích; sau khi chốt bổ sung đáp án, số đúng, sai, bỏ trống và tỷ lệ đúng.
- Phiên 3, 5, 7, 8: lúc nhận bài hiển thị 10 phản hồi đầu tiên; sau khi chốt có gợi ý tham chiếu, tìm kiếm và tối đa 40 phản hồi ẩn danh.
- Mỗi phiên chỉ dùng 2–4 KPI có ý nghĩa trực tiếp khi trình chiếu.
- Không công khai họ tên hoặc email; đơn vị chỉ được trả về dưới dạng số lượng bài tổng hợp.
- Tự làm mới dữ liệu sau mỗi 10 giây; API dùng bộ nhớ đệm 5 giây để cân bằng độ trễ và hạn mức Google.
- Có chế độ toàn màn hình và bản in.
- Hiển thị logo Kiểm toán nhà nước trên phần đầu dashboard.
- Trang quản trị có nút xuất từng phiên hoặc toàn bộ 09 phiên. File Excel chỉ chứa cột đang dùng và định dạng bảng đen–trắng; chỉ tài khoản quản trị được phép tạo báo cáo.

## Kết nối dữ liệu Google Sheet

1. Mở tệp Google Sheet `KET_QUA_9_PHIEN_TAP_HUAN`.
2. Chọn **Tiện ích mở rộng → Apps Script**.
3. Sao chép `apps-script/Code.gs`, `apps-script/Reporting.gs` và `apps-script/Admin.html` vào dự án Apps Script.
4. Trong **Cài đặt dự án → Thuộc tính tập lệnh**, tạo thuộc tính `SPREADSHEET_ID` và nhập ID của tệp Google Sheet. ID này không được lưu trong GitHub.
5. Chọn **Triển khai → Lần triển khai mới → Ứng dụng web**.
6. Chọn **Thực thi với tư cách: Tôi** và chỉ đặt phạm vi truy cập phù hợp với đối tượng cần xem dashboard.
7. Tạo một deployment công khai chỉ đọc cho dashboard và điền URL `/exec` vào `apiUrl`.
8. Chạy `setupDashboardControl()` một lần trong trình soạn thảo để tạo bảng điều khiển và ghi email quản trị.
9. Tạo deployment quản trị, thực thi với tư cách người truy cập và yêu cầu đăng nhập Google; điền URL này vào `adminUrl` trong `config.js`.

Web App chỉ trả dữ liệu tổng hợp và câu trả lời đã ẩn email/số điện thoại; không trả họ tên hoặc email từ Sheet. Khi phiên đang mở, API cũng không trả đáp án chuẩn, điểm hay gợi ý tham chiếu. Tên đơn vị chỉ xuất hiện trong bảng đếm số bài theo đơn vị, không gắn với cá nhân.

Danh mục dropdown trên 9 Form được đồng bộ bởi hàm `dongBoDropdownDonViCho9Phien()` trong `apps-script/AddParticipantFields.gs`. Danh mục nguồn gồm các đơn vị thực tế có cán bộ trong danh sách; dashboard chỉ hiển thị đơn vị có ít nhất một bài ở phiên đang xem.

Sau khi cấu hình, cả 9 Form đều **không thu thập email**, không giới hạn một lần trả lời và cho phép bất kỳ ai có đường liên kết truy cập mà không cần đăng nhập. Ba quyền xem câu sai, đáp án đúng và giá trị điểm đều bị tắt, nên học viên không thấy kết quả sau khi nộp. Khi tắt thu email, Google Forms có thể tự chuyển thời điểm công bố về ngay sau khi nộp; việc này không làm lộ kết quả vì ba quyền xem vẫn đang tắt.

Trong các tab kết quả, cột đang sử dụng được sắp theo thứ tự: thời gian, họ tên, đơn vị công tác, nội dung trả lời và điểm. Các cột phản hồi cũ như `Đơn vị Anh/Chị đang công tác`, `Email Address` và cột thừa được đưa ra cuối rồi ẩn. Google Sheets không cho xóa vật lý các cột đã từng gắn với Form, kể cả khi câu hỏi hoặc chế độ thu email đã tắt.

## Thêm thông tin người làm vào Form 4–9

1. Tạo một tệp `.gs` trong Apps Script và sao chép nội dung `apps-script/AddParticipantFields.gs`.
2. Chọn hàm `themThongTinNguoiLamChoPhien4Den9` rồi bấm **Chạy**.
3. Cấp quyền chỉnh sửa Google Forms khi được hỏi.

Hàm có thể chạy lại an toàn: chỉ tạo trường còn thiếu, đưa **Họ và tên** và **Đơn vị công tác** lên đầu Form, đặt bắt buộc và 0 điểm. Dashboard tìm cột theo tên câu hỏi nên không phụ thuộc vị trí hai cột mới trong Sheet.

## Chạy kiểm tra trên máy

Mở thư mục bằng một máy chủ web tĩnh, sau đó truy cập `index.html`. Khi chưa điền `apiUrl`, trang dùng `data/demo.json` để kiểm tra giao diện.

Kiểm tra bộ tổng hợp dữ liệu bằng lệnh `node tests/aggregate.test.js`.

## Chạy bản dữ liệu giả trên máy

Nhấp đúp `CHAY_DEMO_LOCAL.cmd`. Trình duyệt sẽ mở:

```text
http://127.0.0.1:8765/?phien=1&demo=1
```

Tham số `demo=1` buộc dashboard dùng `data/fake.json` thay vì API thật. Dữ liệu giả có đủ cả 9 phiên, mỗi phiên mô phỏng 274 học viên thuộc 81 đơn vị thực tế và đủ số liệu để kiểm tra KPI, biểu đồ, bộ chọn câu hỏi, bảng trình tự và danh sách phản hồi. Thêm `trangthai=live` hoặc `trangthai=closed` để xem hai màn hình vận hành. Đóng cửa sổ lệnh để dừng máy chủ local.

Nếu muốn cập nhật file giả theo cấu trúc API mới nhất, lưu JSON API vào một file rồi chạy:

```text
node scripts/generate-fake-data.js <api-schema.json> data/fake.json
```

## GitHub Pages

Workflow trong `.github/workflows/pages.yml` tự triển khai khi nhánh `main` được đẩy lên GitHub. Trong repository, chọn **Settings → Pages → Source: GitHub Actions** nếu Pages chưa được bật.
