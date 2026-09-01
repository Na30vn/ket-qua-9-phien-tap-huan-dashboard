# Dashboard kết quả 09 phiên tập huấn

Dashboard trình chiếu độc lập kết quả của từng tab `Phiên 1` đến `Phiên 9` trong Google Sheet `KET_QUA_9_PHIEN_TAP_HUAN`.

## Đặc điểm

- Mỗi phiên có một màn hình tổng hợp riêng.
- Phiên 1, 4: tỷ lệ đúng theo câu, phân bố số câu đúng và phân bố đáp án động.
- Phiên 9: tỷ lệ đúng hai câu và phân bố đáp án động, không thêm biểu đồ điểm không cần thiết.
- Phiên 2: tỷ lệ đặt đúng vị trí từng bước và Top 5 trình tự sai phổ biến.
- Phiên 6: biểu đồ Đúng/Sai 100%, đáp án tham chiếu và phần giải thích theo câu.
- Phiên 3, 5, 7, 8: gợi ý tham chiếu, tìm kiếm và danh sách phản hồi ẩn danh.
- Mỗi phiên chỉ dùng 2–4 KPI có ý nghĩa trực tiếp khi trình chiếu.
- Không công khai họ tên hoặc email; đơn vị chỉ được trả về dưới dạng số lượng bài tổng hợp.
- Tự làm mới dữ liệu sau mỗi 10 giây; API dùng bộ nhớ đệm 5 giây để cân bằng độ trễ và hạn mức Google.
- Có chế độ toàn màn hình và bản in.
- Hiển thị logo Kiểm toán nhà nước trên phần đầu dashboard.
- Có nút **Xuất báo cáo Excel** để tải toàn bộ tệp kết quả gồm các tab Phiên 1–9. Google vẫn kiểm tra quyền truy cập Sheet, vì vậy chỉ tài khoản được cấp quyền mới tải được dữ liệu chi tiết.

## Kết nối dữ liệu Google Sheet

1. Mở tệp Google Sheet `KET_QUA_9_PHIEN_TAP_HUAN`.
2. Chọn **Tiện ích mở rộng → Apps Script**.
3. Sao chép nội dung `apps-script/Code.gs` vào dự án Apps Script.
4. Trong **Cài đặt dự án → Thuộc tính tập lệnh**, tạo thuộc tính `SPREADSHEET_ID` và nhập ID của tệp Google Sheet. ID này không được lưu trong GitHub.
5. Chọn **Triển khai → Lần triển khai mới → Ứng dụng web**.
6. Chọn **Thực thi với tư cách: Tôi** và chỉ đặt phạm vi truy cập phù hợp với đối tượng cần xem dashboard.
7. Sao chép URL `/exec` và điền vào `apiUrl` trong `config.js`.

Web App chỉ trả dữ liệu tổng hợp và câu trả lời đã ẩn email/số điện thoại; không trả họ tên hoặc email từ Sheet. Tên đơn vị chỉ xuất hiện trong bảng đếm số bài theo đơn vị, không gắn với cá nhân.

Danh mục dropdown trên 9 Form được đồng bộ bởi hàm `dongBoDropdownDonViCho9Phien()` trong `apps-script/AddParticipantFields.gs`. Danh mục nguồn gồm các đơn vị thực tế có cán bộ trong danh sách; dashboard chỉ hiển thị đơn vị có ít nhất một bài ở phiên đang xem.

Sau khi cấu hình bài kiểm tra, cả 9 Form đều dùng chế độ **công bố điểm sau khi đánh giá thủ công** và tắt hiển thị câu sai, đáp án đúng, giá trị điểm cho người trả lời. Thiết lập này không ảnh hưởng dữ liệu được ghi vào Sheet hoặc phép tính trên dashboard.

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

Tham số `demo=1` buộc dashboard dùng `data/fake.json` thay vì API thật. Dữ liệu giả có đủ cả 9 phiên, mỗi phiên mô phỏng 274 học viên thuộc 81 đơn vị thực tế và đủ số liệu để kiểm tra KPI, biểu đồ, bộ chọn câu hỏi, bảng trình tự và danh sách phản hồi. Đóng cửa sổ lệnh để dừng máy chủ local.

Nếu muốn cập nhật file giả theo cấu trúc API mới nhất, lưu JSON API vào một file rồi chạy:

```text
node scripts/generate-fake-data.js <api-schema.json> data/fake.json
```

## GitHub Pages

Workflow trong `.github/workflows/pages.yml` tự triển khai khi nhánh `main` được đẩy lên GitHub. Trong repository, chọn **Settings → Pages → Source: GitHub Actions** nếu Pages chưa được bật.
