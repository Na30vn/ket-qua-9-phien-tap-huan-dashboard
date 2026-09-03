# Kế hoạch AI cho Phiên 3, 5, 6, 7, 8

## Nguyên tắc

- Chỉ chạy sau khi phiên đã chốt và quản trị viên chủ động bấm **Phân tích bằng AI**.
- Không gọi AI khi dashboard tự làm mới, khi người xem mở trang hoặc khi chưa có rubric được duyệt.
- Đáp án Đúng/Sai của Phiên 6 tiếp tục chấm bằng rule hiện có; AI chỉ đánh giá phần giải thích.
- Không gửi họ tên, đơn vị, email hoặc chức vụ cho AI. Mỗi bài dùng một mã nội bộ và nội dung đã lọc thông tin cá nhân.
- Không tạo điểm số nếu rubric chưa quy định thang điểm và trọng số.

## Dữ liệu và rubric cần chuẩn bị

1. Giảng viên duyệt rubric riêng cho Phiên 3, 5, 7, 8, gồm các ý bắt buộc, ý chấp nhận tương đương và lỗi nghiêm trọng.
2. Giảng viên duyệt rubric giải thích cho 7 câu Phiên 6, dựa trên `referenceNotes` hiện có.
3. Mặc định dùng bốn mức: `Đúng và đầy đủ`, `Đúng một phần`, `Chưa chính xác`, `Không đủ thông tin`.
4. Chỉ bổ sung điểm số sau khi giảng viên quy định rõ điểm từng mức và cách kết hợp với phần lựa chọn.

## Kiến trúc tiết kiệm quota

```text
Quản trị viên chốt phiên
        ↓
Bấm “Phân tích bằng AI”
        ↓
Apps Script lấy snapshot chính thức và ẩn thông tin cá nhân
        ↓
Tạo hash: phiên + câu trả lời + phiên bản rubric + phiên bản prompt
        ↓
Đã có kết quả theo hash → dùng lại, không gọi AI
Chưa có kết quả → đưa vào hàng đợi batch
        ↓
Lưu structured JSON vào _AI_EVALUATION
        ↓
Dashboard chỉ đọc kết quả đã lưu
```

- Xử lý theo batch nhỏ, mặc định 10 bài/lần chạy.
- Mỗi hash được gọi tối đa một lần khi thành công; lỗi tạm thời retry tối đa 2 lần với thời gian chờ tăng dần.
- Có ngân sách mỗi phiên, mặc định tối đa 300 bài và tối đa 3 lần chạy thủ công/ngày.
- Khi đổi rubric hoặc prompt, tạo phiên bản mới; kết quả cũ vẫn giữ để truy vết.

## PLAN 6 — Phiên 3, 5, 7, 8

Kết quả mỗi bài:

```json
{
  "classification": "Đúng một phần",
  "matchedCriteria": ["..."],
  "missingCriteria": ["..."],
  "misconceptions": ["..."],
  "shortFeedback": "...",
  "confidence": "high|medium|low"
}
```

Dashboard sau khi chốt hiển thị:

- Số bài đã xử lý / đang chờ / lỗi.
- Tỷ lệ bốn mức phân loại.
- Các ý học viên nắm tốt.
- Các ý còn thiếu hoặc nhầm lẫn phổ biến.
- Tối đa 10 phản hồi minh họa đã ẩn danh; không trả toàn bộ kết quả cá nhân qua API công khai.

Top 10 cho các phiên này chỉ được bật khi rubric có điểm số được duyệt. Nếu chưa có, AI chỉ tổng hợp và phân loại.

## PLAN 7 — Phiên 6

1. Rule hiện tại chấm lựa chọn Đúng/Sai và không phụ thuộc AI.
2. AI nhận câu hỏi, `referenceNote`, lựa chọn của học viên và phần giải thích đã ẩn danh.
3. AI trả một trong bốn mức cùng các ý đúng, ý thiếu và hiểu nhầm.
4. Dashboard hiển thị nhãn đánh giá cạnh từng giải thích và tổng hợp lỗi phổ biến theo câu.
5. Không tính điểm tổng hợp cho đến khi có trọng số được giảng viên duyệt.

## Lưu trữ và vận hành

Tab ẩn `_AI_EVALUATION` gồm: mã phiên, mã bài, mã câu, hash nội dung, phiên bản rubric, phiên bản prompt, trạng thái, số lần thử, kết quả JSON, lỗi rút gọn và thời gian cập nhật.

Khóa API chỉ lưu trong Script Properties với tên `GEMINI_API_KEY`. API công khai không trả khóa, prompt nội bộ, log lỗi chi tiết hoặc dữ liệu định danh.

Trang quản trị có các nút:

- **Phân tích bằng AI** — chạy các bài chưa có cache.
- **Tiếp tục batch** — xử lý batch kế tiếp.
- **Thử lại bài lỗi** — chỉ thử lại lỗi, không chạy lại bài thành công.
- **Xóa kết quả AI của phiên** — yêu cầu xác nhận và không xóa phản hồi gốc.

## Kiểm thử và triển khai

1. Unit test hash, cache, retry, giới hạn quota và schema JSON.
2. Demo đủ trạng thái: chưa chạy, processing, thành công, lỗi, hết quota và rubric thay đổi.
3. Kiểm tra AI lỗi không ảnh hưởng dashboard hoặc kết quả rule Phiên 6.
4. Chạy thử 5–10 bài ẩn danh trên một phiên, giảng viên đối chiếu thủ công.
5. Chỉ sau khi rubric và kết quả mẫu được duyệt mới bật cho toàn bộ dữ liệu.

## Điều kiện bắt đầu triển khai

- Có rubric được giảng viên duyệt cho từng phiên/câu.
- Có lựa chọn mô hình và khóa API phía máy chủ.
- Có mức ngân sách quota/ngày được chấp thuận.
- Có quyết định rõ: chỉ phân loại hay có chấm điểm; nếu chấm điểm phải có thang điểm và trọng số.
