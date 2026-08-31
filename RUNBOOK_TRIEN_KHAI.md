# Phương án vận hành hôm triển khai

## Cơ chế cập nhật

`Google Form → tab Phiên 1–9 → Apps Script ẩn danh → dashboard GitHub Pages`

- Dashboard tự gọi API mỗi 10 giây.
- API giữ bộ nhớ đệm tối đa 5 giây.
- Kết quả thường xuất hiện sau khoảng 5–15 giây, không cần chạy script hoặc tải lại trang thủ công.
- Nút **Cập nhật** dùng để lấy lại dữ liệu ngay khi người trình chiếu cần kiểm tra.

## Trước buổi học

1. Gửi thử một bài vào từng Form.
2. Mở từng nút Phiên 1–9 trên dashboard và đối chiếu số lượt làm.
3. Xóa các bài thử nếu không muốn tính vào kết quả chính thức.
4. Mở sẵn dashboard trên máy trình chiếu, bật toàn màn hình và tắt chế độ ngủ của máy.
5. Chỉ dùng một màn hình dashboard trình chiếu; học viên chỉ mở Google Form.

## Trong buổi học

1. Chọn đúng phiên đang học trên thanh Phiên 1–9.
2. Sau khi học viên gửi bài, chờ tối đa khoảng 15 giây.
3. Nếu số liệu chưa đổi, bấm **Cập nhật** một lần.
4. Không sửa tên tab `Phiên 1` đến `Phiên 9` hoặc thứ tự cột trong lúc đang thu bài.

## Phương án dự phòng

1. Nếu dashboard báo mất kết nối, kiểm tra Internet trên máy trình chiếu rồi bấm **Cập nhật**.
2. Nếu Google Apps Script tạm thời lỗi, mở trực tiếp tab Phiên tương ứng trong Sheet để vẫn theo dõi số bài.
3. Không cấp quyền công khai cho Sheet; chỉ API tổng hợp được công khai và không xuất Họ tên, đơn vị, Email.
