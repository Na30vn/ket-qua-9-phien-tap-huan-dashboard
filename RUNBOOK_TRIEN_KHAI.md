# Phương án vận hành hôm triển khai

## Cơ chế cập nhật

`Google Form → tab Phiên 1–9 → Apps Script ẩn danh → dashboard GitHub Pages`

- Dashboard tự gọi API mỗi 10 giây.
- API giữ bộ nhớ đệm tối đa 5 giây.
- Kết quả thường xuất hiện sau khoảng 5–15 giây, không cần chạy script hoặc tải lại trang thủ công.
- Nút **Cập nhật** dùng để lấy lại dữ liệu ngay khi người trình chiếu cần kiểm tra.
- Trạng thái chốt được lưu trong tab ẩn `_DASHBOARD_CONTROL`, không phụ thuộc trình duyệt đang mở.

## Trước buổi học

1. Gửi thử một bài vào từng Form.
2. Mở từng nút Phiên 1–9 trên dashboard và đối chiếu số lượt làm.
3. Xóa các bài thử nếu không muốn tính vào kết quả chính thức.
4. Mở sẵn dashboard trên máy trình chiếu, bật toàn màn hình và tắt chế độ ngủ của máy.
5. Chỉ dùng một màn hình dashboard trình chiếu; học viên chỉ mở Google Form.
6. Đăng nhập trang **Điều khiển phiên** bằng tài khoản quản trị và mở sẵn ở một tab riêng.

## Trong buổi học

1. Chọn đúng phiên đang học trên thanh Phiên 1–9.
2. Sau khi học viên gửi bài, chờ tối đa khoảng 15 giây.
3. Nếu số liệu chưa đổi, bấm **Cập nhật** một lần.
4. Khi giảng viên xác nhận kết thúc, vào **Điều khiển phiên**, bấm **Chốt phiên** và xác nhận đúng số bài đang hiển thị.
5. Sau khi chốt, dashboard giữ nguyên số liệu chính thức; bài gửi muộn chỉ hiện ở dòng cảnh báo và không được cộng vào kết quả.
6. Nếu chốt nhầm, bấm **Mở lại**, kiểm tra số bài rồi chốt lại.
7. Không sửa tên tab `Phiên 1` đến `Phiên 9` hoặc thứ tự cột trong lúc đang thu bài.

## Xuất báo cáo

- **Xuất Phiên X** tạo một file Excel có một sheet.
- **Xuất tất cả 09 phiên** tạo một file Excel có chín sheet.
- Báo cáo chỉ lấy các cột đang hiển thị trong Sheet; bỏ Email và các cột phản hồi cũ đang ẩn.
- Bảng dùng nền trắng, chữ đen, header nền đen chữ trắng và đường viền đen; không có biểu đồ hoặc màu trang trí.

## Phương án dự phòng

1. Nếu dashboard báo mất kết nối, kiểm tra Internet trên máy trình chiếu rồi bấm **Cập nhật**.
2. Nếu Google Apps Script tạm thời lỗi, mở trực tiếp tab Phiên tương ứng trong Sheet để vẫn theo dõi số bài.
3. Không cấp quyền công khai cho Sheet; chỉ API tổng hợp được công khai và không xuất Họ tên, đơn vị, Email.
