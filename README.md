# Dashboard kết quả 09 phiên tập huấn

Hệ thống nhận dữ liệu từ 09 Google Form, tổng hợp theo từng tab `Phiên 1`–`Phiên 9` trong Google Sheet `KET_QUA_9_PHIEN_TAP_HUAN`, xử lý và ẩn danh bằng Google Apps Script, sau đó trình chiếu trên dashboard GitHub Pages.

Dashboard: <https://na30vn.github.io/ket-qua-9-phien-tap-huan-dashboard/>

## Danh mục 09 phiên

| Phiên | Nội dung chính thức | Dạng bài |
| --- | --- | --- |
| Phiên 1 | Phân cấp nguồn thu, nhiệm vụ chi ngân sách xã | Trắc nghiệm 6 câu |
| Phiên 2 | Quy trình quản lý ngân sách cấp xã | Sắp xếp thứ tự |
| Phiên 3 | Công khai ngân sách cấp xã | Tình huống tự luận |
| Phiên 4 | Điều hành ngân sách xã và quyết toán ngân sách xã | Trắc nghiệm 9 câu |
| Phiên 5 | Xét duyệt quyết toán ngân sách cấp xã | Tình huống tự luận |
| Phiên 6 | Tiêu chuẩn định mức máy móc thiết bị | Đúng/Sai và giải thích |
| Phiên 7 | Hồ sơ mua sắm không quá 50 triệu đồng | Phân tích hồ sơ |
| Phiên 8 | Hồ sơ mua sắm chỉ định thầu rút gọn | Phân tích hồ sơ |
| Phiên 9 | Quản lý, sử dụng tài sản công | Trắc nghiệm 2 câu |

Tên tab Google Sheet vẫn giữ cố định là `Phiên 1`–`Phiên 9`. Đây là khóa kỹ thuật để Apps Script đọc đúng dữ liệu; chỉ phần tên nội dung hiển thị được thay đổi.

## Luồng xử lý

```text
Học viên gửi Google Form
          ↓
Google Sheet ghi dữ liệu vào tab Phiên tương ứng
          ↓
Google Apps Script đọc, chuẩn hóa, tính toán và ẩn danh
          ↓
API trả dữ liệu tổng hợp theo trạng thái phiên
          ↓
Dashboard GitHub Pages tự lấy dữ liệu và vẽ giao diện
```

- Dashboard tự gọi API mỗi 10 giây.
- API dùng bộ nhớ đệm tối đa 5 giây để giảm tải cho Google Sheet.
- Kết quả mới thường xuất hiện sau khoảng 5–15 giây, không cần tải lại trang.
- Nút **Cập nhật** buộc dashboard lấy lại dữ liệu ngay khi cần đối soát.
- Mọi phép tính điểm và tỷ lệ đúng được thực hiện trong Apps Script theo cấu hình đáp án, không phụ thuộc việc Google Form có hiển thị kết quả cho học viên hay không.

## Hai trạng thái của mỗi phiên

### Đang nhận bài

- Dashboard tiếp tục nhận dữ liệu mới.
- Không trả đáp án chuẩn, điểm, tỷ lệ đúng hoặc gợi ý tham chiếu ra giao diện công khai.
- Trắc nghiệm hiển thị số lượt và tỷ lệ chọn từng phương án.
- Bài sắp xếp và tự luận chỉ hiển thị tối đa 10 phản hồi đầu tiên theo thiết kế trình chiếu.

### Đã chốt

- Quản trị viên chốt phiên tại trang **Điều khiển phiên**.
- Hệ thống lưu thời điểm chốt và số bài chính thức trong tab ẩn `_DASHBOARD_CONTROL`.
- Dashboard hiển thị phân tích đúng/sai, đáp án hoặc gợi ý tham chiếu phù hợp với từng dạng bài.
- Bài gửi sau thời điểm chốt được đếm riêng và không làm thay đổi kết quả đã chốt.
- Người trình chiếu có thể chuyển giữa **Kết quả tổng hợp** và **Màn hình lúc nhận bài**. Chế độ xem lại sử dụng đúng dữ liệu tại thời điểm chốt, không công bố đáp án và không mở lại phiên.
- Có thể mở lại phiên nếu giảng viên cần tiếp tục nhận bài.
- Mỗi dashboard có mã QR riêng của phiên; bấm vào mã nhỏ để phóng lớn ở giữa màn hình phục vụ trình chiếu.
- Nút `+` cố định ở góc dưới bên phải mở bảng điều khiển nhanh. Việc chốt/mở lại vẫn chạy trong trang Apps Script có xác thực quản trị và luôn yêu cầu xác nhận, không đưa quyền quản trị vào mã nguồn giao diện công khai.

## Cách hiển thị theo từng dạng bài

- **Phiên 1, 4 và 9:** lúc nhận bài hiển thị phân bố A/B/C/D theo từng câu; khi mở rộng, câu hỏi và phương án được hiển thị đầy đủ. Sau khi chốt có số đúng, tỷ lệ đúng và phân bố kết quả cần thiết.
- **Phiên 2:** hiển thị đầy đủ đề bài và 13 hoạt động gốc; 10 bài gửi đầu tiên được tách thành các ô **Vị trí / Bước** rõ ràng. Sau khi chốt có trình tự tham chiếu, tỷ lệ đặt đúng theo từng vị trí và các trình tự sai phổ biến.
- **Phiên 6:** lúc nhận bài hiển thị lựa chọn Đúng/Sai và tối đa 10 giải thích cho mỗi câu, cân bằng tối đa 5 giải thích của nhóm chọn Đúng và 5 của nhóm chọn Sai; từng giải thích ghi rõ lựa chọn đi kèm. Sau khi chốt, lựa chọn đúng được đánh dấu xanh ngay trên 7 thẻ tổng hợp; bảng kết quả lặp lại đã được bỏ.
- **Phiên 3, 5, 7 và 8:** đề bài, dữ kiện và câu hỏi được hiển thị đầy đủ ở cả hai trạng thái. Lúc nhận bài hiển thị tối đa 10 phản hồi bằng thẻ nội dung mở, chữ lớn; sau khi chốt có gợi ý tham chiếu, tìm kiếm và tối đa 40 phản hồi đã ẩn thông tin cá nhân.
- Bảng số bài theo đơn vị chỉ hiển thị những đơn vị có ít nhất một người tham gia phiên đang xem.

## Quyền riêng tư và cấu hình Google Form

Cả 09 Form được cấu hình:

- Không thu thập email.
- Không giới hạn một lần trả lời, do đó không yêu cầu đăng nhập Google.
- Cho phép bất kỳ ai có đường liên kết truy cập.
- Không cho người học xem câu trả lời sai, đáp án đúng hoặc giá trị điểm.
- Trường **Họ và tên** và **Đơn vị công tác** được dùng để quản lý danh sách tại Sheet và báo cáo; API công khai không trả họ tên hoặc email.

Google Forms có thể vẫn hiện nút **Xem câu trả lời chính xác** sau khi nộp. Với ba quyền xem kết quả đều tắt, nút này chỉ cho người học xem lại lựa chọn của mình, không cho biết đúng/sai, đáp án chuẩn hoặc điểm số.

## Trang quản trị và báo cáo

Trang quản trị yêu cầu đăng nhập Google. Tài khoản được chốt phiên phải có tên trong thuộc tính `ADMIN_EMAILS` và có quyền chỉnh sửa tệp Google Sheet kết quả; các tài khoản Google khác không thể đọc dữ liệu quản trị, chốt phiên hoặc xuất báo cáo. Chỉ cần chia sẻ quyền chỉnh sửa dự án Apps Script khi người đó còn phụ trách mã nguồn hoặc triển khai. Thuộc tính `ADMIN_EMAILS` hỗ trợ nhiều tài khoản, phân tách bằng dấu phẩy. Các phiên được lọc theo lịch giảng dạy:

- Chiều 4/9: Phiên 1–3.
- Sáng 5/9: Phiên 4–5.
- Chiều 5/9: Phiên 6–8.
- Sáng 6/9: Phiên 9.

Chức năng quản trị gồm:

- Cập nhật số bài hiện tại.
- Chốt hoặc mở lại từng phiên.
- Xuất báo cáo Excel cho từng phiên.
- Xuất một file Excel gồm đủ 09 phiên.

Báo cáo dùng bảng đen–trắng, giữ các cột đang sử dụng và loại bỏ email hoặc cột phản hồi cũ. Phần tên nội dung phiên trong báo cáo lấy trực tiếp từ `SESSION_CONFIG`, nên thay đổi tên tại cấu hình sẽ được dùng thống nhất.

## Cấu trúc mã nguồn

| Thành phần | Vai trò |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Giao diện dashboard công khai |
| `config.js` | URL API, URL quản trị và chu kỳ tự cập nhật |
| `apps-script/Code.gs` | Danh mục phiên, đọc Sheet, chuẩn hóa, tính toán, ẩn danh và API |
| `apps-script/Reporting.gs` | Chốt/mở phiên và xuất báo cáo Excel |
| `apps-script/Admin.html` | Giao diện điều khiển phiên |
| `apps-script/AddParticipantFields.gs` | Đồng bộ trường người tham gia và dropdown đơn vị cho 09 Form |
| `scripts/sync-prompts.js` | Đồng bộ đề bài từ cấu hình Apps Script sang dữ liệu demo và dữ liệu giả |
| `data/demo.json` | Dữ liệu rỗng dự phòng khi chưa cấu hình API |
| `data/fake.json` | Dữ liệu giả để kiểm tra giao diện local |
| `RUNBOOK_TRIEN_KHAI.md` | Hướng dẫn vận hành trong ngày triển khai |

## Cập nhật tên hoặc cấu trúc phiên

Khi thay đổi tên một phiên, phải đồng bộ tối thiểu các vị trí sau:

1. Tiêu đề Google Form.
2. Thuộc tính `description` trong `SESSION_CONFIG` tại `apps-script/Code.gs`.
3. `data/demo.json` và `data/fake.json`.
4. Bảng **Danh mục 09 phiên** trong README này.
5. Triển khai phiên bản Apps Script mới để API, trang quản trị và báo cáo nhận cấu hình mới.
6. Đẩy nhánh `main` lên GitHub để GitHub Pages cập nhật giao diện và tài liệu.

Không đổi tên tab `Phiên 1`–`Phiên 9`, không đổi câu hỏi hoặc thứ tự cột trong lúc đang thu bài. Nếu thay đổi cấu trúc Form, phải kiểm tra lại header Sheet, cấu hình chỉ số câu hỏi và kết quả API trước khi triển khai.

## Nhật ký cập nhật

- **03/09/2026:** thêm QR riêng cho Phiên 1–9, hỗ trợ phóng lớn giữa màn hình; chuyển điều khiển phiên sang nút `+` kín đáo và bổ sung giao diện quản trị gọn cho đúng phiên đang xem.
- **03/09/2026:** ẩn email đăng nhập và bỏ liên kết sang trang quản trị đầy đủ khỏi điều khiển nhanh; trang quản trị riêng vẫn giữ nguyên để cán bộ kỹ thuật hỗ trợ.
- **02/09/2026:** bổ sung đề bài đầy đủ cho Phiên 2, 3, 5, 7 và 8; thiết kế lại trình tự 10 bài đầu thành các ô vị trí/bước; chuyển phản hồi tự luận sang thẻ nội dung mở, chữ lớn để trình chiếu rõ hơn.
- **02/09/2026:** làm rõ nút xem/thu gọn đề bài cho toàn bộ phiên tình huống; đổi 10 bài đầu của Phiên 2 sang dãy số ngang nổi bật; thêm phiên bản tài nguyên để tránh trình duyệt dùng lại CSS cũ.
- **02/09/2026:** giữ nguyên trạng thái mở/thu gọn câu hỏi, phần giải thích và vị trí cuộn khi dữ liệu tự cập nhật sau mỗi 10 giây.
- **02/09/2026:** Phiên 6 hiển thị tối đa 5 giải thích của nhóm chọn Đúng và 5 của nhóm chọn Sai cho mỗi câu, kèm nhãn lựa chọn của từng phản hồi ở cả hai trạng thái.
- **02/09/2026:** bỏ bảng tổng hợp lặp lại của Phiên 6 sau chốt, đánh dấu xanh đáp án đúng trên từng thẻ; chuẩn hóa nhãn Phiên 3, 5, 7 và 8 thành “TÌNH HUỐNG”.

## Kết nối Google Sheet và Apps Script

1. Mở Google Sheet `KET_QUA_9_PHIEN_TAP_HUAN`.
2. Chọn **Tiện ích mở rộng → Apps Script**.
3. Đồng bộ `apps-script/Code.gs`, `apps-script/Reporting.gs` và `apps-script/Admin.html` vào dự án.
4. Trong **Cài đặt dự án → Thuộc tính tập lệnh**, đặt `SPREADSHEET_ID` bằng ID của Sheet. Không lưu ID riêng tư này trên GitHub.
5. Chạy `setupDashboardControl()` một lần để tạo bảng điều khiển và ghi tài khoản quản trị. Khi có nhiều quản trị viên, giữ nguyên các tài khoản hiện có trong `ADMIN_EMAILS` và nối thêm tài khoản mới bằng dấu phẩy.
6. Tạo deployment công khai chỉ đọc cho dashboard và điền URL `/exec` vào `apiUrl` trong `config.js`.
7. Tạo deployment quản trị, yêu cầu đăng nhập và điền URL `/exec` vào `adminUrl`.

Web App công khai chỉ trả dữ liệu tổng hợp và nội dung đã được lọc thông tin cá nhân. Tên đơn vị chỉ xuất hiện trong thống kê số bài theo đơn vị, không gắn với cá nhân.

## Chạy và kiểm tra trên máy

Nhấp đúp `CHAY_DEMO_LOCAL.cmd`, sau đó mở:

```text
http://127.0.0.1:8765/?phien=1&demo=1
```

- `demo=1`: dùng `data/fake.json` thay cho API thật.
- `trangthai=live`: xem giao diện đang nhận bài.
- `trangthai=closed`: xem giao diện sau khi chốt.

Dữ liệu giả mô phỏng 274 học viên và đủ 09 loại phiên để kiểm tra KPI, biểu đồ, câu hỏi, trình tự và phản hồi.

Chạy kiểm tra logic:

```text
node tests/aggregate.test.js
node tests/fake-data.test.js
```

## Triển khai GitHub Pages

Workflow `.github/workflows/pages.yml` tự triển khai khi có thay đổi được đẩy lên nhánh `main`. Nếu repository chưa bật Pages, chọn **Settings → Pages → Source: GitHub Actions**.

## Nhật ký cập nhật

### 02/09/2026

- Chuẩn hóa tên chính thức của cả 09 phiên theo yêu cầu giảng viên.
- Đồng bộ tên mới lên đủ 09 Google Form, API công khai và trang quản trị; bổ sung tài khoản quản trị thứ hai mà không mở rộng quyền truy cập chung của dự án.
- Khôi phục tệp hàm quản trị `Reporting.gs`, triển khai lại trang quản lý phiên và thêm thông báo rõ ràng nếu Apps Script không phản hồi trong 20 giây.
- Bổ sung chế độ xem lại giao diện lúc nhận bài sau khi chốt cho cả bốn dạng: trắc nghiệm, sắp xếp trình tự, Đúng/Sai và bài tập tình huống.
- Bổ sung tài liệu tổng thể về kiến trúc, luồng xử lý, trạng thái phiên, quyền riêng tư, báo cáo và quy trình đồng bộ thay đổi.

### 01/09/2026

- Bổ sung bộ lọc trang quản trị theo ngày và buổi học.
- Sửa phần câu hỏi dài: khi mở rộng sẽ hiển thị đầy đủ câu hỏi và các phương án.
- Hoàn thiện màu sắc, độ tương phản và cách nhấn mạnh số lượt, tỷ lệ trên dashboard.

README này là tài liệu chính của hệ thống. Mỗi thay đổi ảnh hưởng đến dữ liệu, giao diện, Form, API, báo cáo hoặc cách vận hành phải cập nhật đồng thời vào phần tương ứng và thêm một dòng trong **Nhật ký cập nhật**.

- **02/09/2026:** Tăng độ nổi bật của hàng đáp án đúng trên Phiên 6 và bỏ nhãn chữ “ĐÁP ÁN ĐÚNG” lặp lại bên trong hàng lựa chọn.
- **02/09/2026:** Đồng bộ trạng thái chốt/mở lại trong lần cập nhật 10 giây và ngay khi người dùng quay lại tab dashboard. Không cần tải lại trang; trạng thái thu gọn/mở rộng vẫn được giữ nguyên.
- **02/09/2026:** Bổ sung **Xã Trà Đốc** và **Xã Thăng Điền** vào danh mục dropdown **Đơn vị công tác** dùng chung cho 09 Form.
