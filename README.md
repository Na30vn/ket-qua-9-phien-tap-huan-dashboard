# Dashboard kết quả 09 phiên tập huấn

Dashboard trình chiếu độc lập kết quả của từng tab `Phiên 1` đến `Phiên 9` trong Google Sheet `KET_QUA_9_PHIEN_TAP_HUAN`.

## Đặc điểm

- Mỗi phiên có một màn hình tổng hợp riêng.
- Hỗ trợ trắc nghiệm, sắp xếp thứ tự, tự luận, Đúng/Sai kèm giải thích.
- Không công khai Họ tên, đơn vị hoặc email.
- Tự làm mới dữ liệu sau mỗi 10 giây; API dùng bộ nhớ đệm 5 giây để cân bằng độ trễ và hạn mức Google.
- Có chế độ toàn màn hình và bản in.

## Kết nối dữ liệu Google Sheet

1. Mở tệp Google Sheet `KET_QUA_9_PHIEN_TAP_HUAN`.
2. Chọn **Tiện ích mở rộng → Apps Script**.
3. Sao chép nội dung `apps-script/Code.gs` vào dự án Apps Script.
4. Trong **Cài đặt dự án → Thuộc tính tập lệnh**, tạo thuộc tính `SPREADSHEET_ID` và nhập ID của tệp Google Sheet. ID này không được lưu trong GitHub.
5. Chọn **Triển khai → Lần triển khai mới → Ứng dụng web**.
6. Chọn **Thực thi với tư cách: Tôi** và chỉ đặt phạm vi truy cập phù hợp với đối tượng cần xem dashboard.
7. Sao chép URL `/exec` và điền vào `apiUrl` trong `config.js`.

Web App chỉ trả dữ liệu tổng hợp và câu trả lời đã ẩn email/số điện thoại; không trả Họ tên, đơn vị hoặc email từ Sheet.

## Chạy kiểm tra trên máy

Mở thư mục bằng một máy chủ web tĩnh, sau đó truy cập `index.html`. Khi chưa điền `apiUrl`, trang dùng `data/demo.json` để kiểm tra giao diện.

Kiểm tra bộ tổng hợp dữ liệu bằng lệnh `node tests/aggregate.test.js`.

## GitHub Pages

Workflow trong `.github/workflows/pages.yml` tự triển khai khi nhánh `main` được đẩy lên GitHub. Trong repository, chọn **Settings → Pages → Source: GitHub Actions** nếu Pages chưa được bật.
