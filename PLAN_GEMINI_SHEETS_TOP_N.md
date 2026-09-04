# Kế hoạch Gemini trong Google Sheets — Top N công khai

## Mục tiêu

Sau khi chốt phiên, giáo viên chỉ cần tối đa **02 thao tác**:

1. **Chốt phiên** trong bảng điều khiển hiện có. Hệ thống tự tạo bảng chấm Gemini trong Google Sheet.
2. Trong tab chấm, chọn một cột và bấm **Generate and insert** của Gemini trong Google Sheets. Dashboard tự đọc kết quả, tính thứ hạng và công khai Top N.

Không dùng Gemini API, không cần khóa API, không chạy AI mỗi lần dashboard làm mới.

## Điều kiện sử dụng

- File phải là Google Sheets gốc (không phải Excel chưa chuyển đổi).
- Tài khoản giáo viên có quyền dùng hàm `=AI()` hoặc `=Gemini()` trong Google Sheets.
- Đáp án Word `00. Bài tập, tình huống, trắc nghiệm - 30.8.2026.docx` là nguồn đáp án chuẩn.
- Chỉ xử lý khi phiên có trạng thái `CLOSED`.

Nếu Sheet không có hàm AI, toàn bộ luồng chấm tự động tình huống không chạy; trắc nghiệm và phần Đúng/Sai vẫn hoạt động bình thường.

## Thành phần dữ liệu

Apps Script tạo hoặc làm mới hai tab ẩn/điều hành:

| Tab | Mục đích |
|---|---|
| `_GEMINI_REVIEW` | Bài làm, đáp án chuẩn, công thức Gemini và kết quả chấm theo từng bài. |
| `_PUBLIC_TOP` | Dữ liệu Top N đã tính để dashboard công khai đọc. |

`_PUBLIC_TOP` không chứa bài ngoài Top N. Bài của người nằm trong Top N gồm họ tên, đơn vị, thời điểm nộp, bài làm, đáp án chuẩn và kết quả đối chiếu được phép công khai theo yêu cầu đã chốt.

## Luồng chung

```text
Giáo viên bấm Kết thúc ngay
        ↓
Apps Script chốt snapshot dữ liệu
        ↓
Tự tạo các dòng chấm trong _GEMINI_REVIEW
        ↓
Giáo viên bấm Generate and insert trong Google Sheets
        ↓
Gemini ghi kết quả nháp vào cột Kết quả AI
        ↓
Apps Script đọc kết quả, tính Top N, ghi _PUBLIC_TOP
        ↓
Dashboard tự cập nhật Top N và hộp chi tiết công khai
```

Dashboard tự gọi lại dữ liệu theo chu kỳ hiện có. Không cần nút xuất bản riêng trong luồng chuẩn.

## PLAN 6 — Phiên tình huống: 3, 5, 7, 8

### Cấu hình đáp án

Mỗi gạch đầu dòng trong đáp án Word là một **ý chuẩn**.

| Phiên | Số ý chuẩn | Nội dung chấm |
|---|---:|---|
| 3 | 3 | Nội dung công khai ngân sách còn thiếu và mốc công khai. |
| 5 | 2 | Căn cứ Điều 69 và trách nhiệm của thủ trưởng đơn vị. |
| 7 | 2 | Hồ sơ thiếu/thừa liên quan máy phát điện và thẩm quyền. |
| 8 | 4 | Thẩm quyền màn hình LED, chủ trương mua sắm, bước thừa và quyết định thay thế. |

### Cấu trúc `_GEMINI_REVIEW`

| Cột | Giá trị |
|---|---|
| A–D | Mã phiên, mã bài, họ tên, đơn vị. |
| E | Thời điểm nộp. |
| F | Bài làm nguyên văn. |
| G | Đáp án/ý chuẩn giáo viên. |
| H | Prompt cố định cho Gemini. |
| I | Kết quả AI từ `=AI(H2, F2:G2)`. |
| J | Số ý đạt, Apps Script tách từ kết quả AI. |
| K | Số lỗi nghiêm trọng. |
| L | Nhận xét ngắn để công khai. |
| M | Trạng thái: chờ AI / đã chấm / lỗi. |

### Prompt cố định

```text
So sánh Bài làm với các Ý chuẩn giáo viên trong dữ liệu được cung cấp.
Chỉ dựa trên các ý chuẩn, chấp nhận diễn đạt tương đương.
Trả đúng một dòng theo mẫu:
Y1=0 hoặc 1; Y2=0 hoặc 1; Y3=0 hoặc 1; Y4=0 hoặc 1;
LOI_NGHIEM_TRONG=0 hoặc 1; NHAN_XET=tối đa 35 từ.
Không nêu thông tin ngoài dữ liệu và không tự tạo căn cứ pháp lý.
```

Số `Y` được giới hạn đúng bằng số ý chuẩn của từng phiên.

### Tính Top N

```text
Điểm nội dung = tổng Y1…Yn
Ưu tiên 1     = điểm nội dung cao hơn
Ưu tiên 2     = ít lỗi nghiêm trọng hơn
Ưu tiên 3     = nộp sớm hơn
Top N         = tối đa 10 bài có trạng thái “đã chấm”
```

### Hiển thị dashboard

Khối **VINH DANH — Top N nội dung tốt nhất** hiển thị tên, đơn vị, điểm `x/y` và thời điểm nộp.

Bấm vào người trong Top N mở hộp chi tiết công khai:

- Bài làm của học viên.
- Từng ý chuẩn: đạt/chưa đạt.
- Đáp án giáo viên.
- Nhận xét ngắn Gemini.
- Điểm và thứ hạng.

## PLAN 7 — Phiên 6: Đúng/Sai và giải thích

### Phân tách phần chấm

| Phần | Cách chấm |
|---|---|
| Lựa chọn Đúng/Sai | Apps Script chấm cố định theo 7 đáp án. Không dùng Gemini. |
| Lời giải thích | Gemini đối chiếu với 7 căn cứ trong đáp án Word. |
| Thời điểm nộp | Chỉ dùng để phá hòa khi các tiêu chí trên bằng nhau. |

### Một lượt Gemini cho một bài

Không tạo 7 lời gọi riêng. Một dòng Sheet chứa đủ 7 lựa chọn, 7 lời giải thích và 7 căn cứ chuẩn; Gemini trả về một kết quả duy nhất.

| Cột | Giá trị |
|---|---|
| A–E | Mã phiên, mã bài, họ tên, đơn vị, thời điểm nộp. |
| F | Bảy lựa chọn Đúng/Sai. |
| G | Bảy lời giải thích. |
| H | Bảy đáp án/căn cứ giáo viên. |
| I | Điểm Đúng/Sai do Apps Script tính. |
| J | Kết quả `=AI()` cho cả bảy lời giải thích. |
| K | Số lời giải thích đạt. |
| L | Nhận xét công khai ngắn. |
| M | Trạng thái AI. |

### Prompt cố định

```text
Đối chiếu 7 lời giải thích với từng Căn cứ giáo viên tương ứng.
Không chấm lại lựa chọn Đúng/Sai; chỉ đánh giá lời giải thích.
Trả đúng một dòng:
E1=0 hoặc 1; E2=0 hoặc 1; …; E7=0 hoặc 1;
NHAN_XET=tối đa 45 từ, chỉ nêu ý thiếu/sai quan trọng.
Không tự tạo căn cứ pháp lý.
```

### Tính Top N

```text
Ưu tiên 1 = điểm lựa chọn Đúng/Sai cao hơn
Ưu tiên 2 = số lời giải thích đạt cao hơn
Ưu tiên 3 = nộp sớm hơn
Top N     = tối đa 10 bài có kết quả AI hợp lệ
```

### Hiển thị dashboard

Bấm vào người trong Top N mở một bảng gồm đủ 7 câu:

| Câu | Học viên chọn | Đáp án chuẩn | Giải thích học viên | Căn cứ giáo viên | Đánh giá Gemini |
|---|---|---|---|---|---|

Đầu bảng hiển thị điểm Đúng/Sai, số giải thích đạt, thứ hạng và thời điểm nộp.

## Thao tác của giáo viên

### Thao tác 1 — chốt phiên

Giáo viên bấm **Kết thúc ngay** như hiện tại. Sau khi hệ thống chốt:

- Snapshot bài làm được khóa.
- `_GEMINI_REVIEW` được tạo sẵn với toàn bộ dòng bài làm, đáp án Word, prompt và công thức AI.
- Dashboard tạm hiển thị “Đang chờ chấm Gemini” cho các phiên cần chấm nội dung.

### Thao tác 2 — sinh kết quả Gemini

Giáo viên mở `_GEMINI_REVIEW`, chọn toàn bộ các ô cột `Kết quả AI` và bấm **Generate and insert**.

- Mỗi phiên tối đa 300 bài nằm trong giới hạn chọn 350 ô/lượt của Google Sheets AI.
- Nếu Google giới hạn tạm thời, chia thành các lô 50 bài và chạy lại lô còn thiếu.
- Khi kết quả được chèn, Apps Script tự nhận diện các dòng hợp lệ, tính Top N và ghi `_PUBLIC_TOP`.
- Dashboard cập nhật theo chu kỳ hiện có, không cần thao tác thứ ba.

## Kiểm soát lỗi

| Trạng thái | Xử lý dashboard |
|---|---|
| Chưa có kết quả AI | Hiển thị “Đang chờ chấm Gemini”; không tạo Top N tình huống. |
| Gemini trả sai mẫu | Đánh dấu lỗi dòng đó; bỏ khỏi Top N, không làm hỏng các dòng khác. |
| Hết giới hạn Gemini | Giữ dữ liệu đã chấm; giáo viên chạy phần còn lại vào lúc khác. |
| Cần sửa kết quả | Giáo viên sửa trực tiếp các cột Y/E và nhận xét; dashboard đọc giá trị đã sửa. |
| Không có Gemini trong Sheet | Không công khai Top N tình huống tự động; trắc nghiệm và Đúng/Sai vẫn hoạt động. |

## Kiểm thử trước khi bật thật

1. Chạy 10 bài mẫu của Phiên 3 và đối chiếu từng ý với đáp án Word.
2. Chạy 10 bài mẫu của Phiên 6, kiểm tra điểm Đúng/Sai không đổi khi Gemini lỗi.
3. Kiểm tra ba trường hợp xếp hạng: hơn điểm, bằng điểm khác số giải thích đạt, hòa hoàn toàn theo thời gian nộp.
4. Kiểm tra popup công khai chỉ hiển thị người đã vào Top N.
5. Chỉ sau khi 10 bài mẫu đạt yêu cầu mới bật cho toàn bộ dữ liệu phiên.
