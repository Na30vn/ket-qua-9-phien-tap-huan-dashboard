const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "apps-script", "Code.gs"), "utf8");

const rowsBySheet = {
  "Phiên 1": [
    ["Timestamp", "Score", "Họ và tên", "Đơn vị", "C1", "C2", "C3", "C4", "C5", "C6", "Email"],
    ["31/8/2026", "0 / 60", "Nguyễn Văn A", "Đơn vị A",
      "Thu từ quỹ phòng, chống thiên tai được phân bổ cho Uỷ ban nhân dân cấp xã",
      "Phí thu từ các hoạt động dịch vụ do cơ quan nhà nước cấp xã thực hiện phải nộp vào ngân sách nhà nước, trường hợp được khoán chi phí hoạt động từ nguồn thu phí thì được khấu trừ theo tỷ lệ xác định quy định; phần còn lại (nếu có) nộp ngân sách nhà nước",
      "Xây dựng dự toán ngân sách cấp xã đảm bảo dự phòng ngân sách đạt 2% tổng chi ngân sách cấp xã (bao gồm chi bổ sung có mục tiêu từ ngân sách cấp trên)",
      "Chi hỗ trợ hoạt động thường xuyên cho các đơn vị thuộc cấp tỉnh quản lý đóng trên địa bàn",
      "Uỷ ban nhân dân cấp xã", "Sai", "a@example.com"]
  ],
  "Phiên 2": [
    ["Timestamp", "Họ và tên", "Đơn vị", "Sắp xếp", "Score"],
    ["31/8/2026", "Nguyễn Văn A", "Đơn vị A", "3-5-1-6-4-11-9-8-10-13-2-12-7", "10 / 10"]
  ],
  "Phiên 3": [
    ["Timestamp", "Họ và tên", "Đơn vị", "Tình huống", "Score"],
    ["31/8/2026", "Nguyễn Văn A", "Đơn vị A", "Liên hệ a@example.com hoặc 0912345678", ""]
  ],
  "Phiên 4": [["Timestamp", "Score", "Họ và tên", "Đơn vị công tác", "Câu 1: A", "Câu 2: B", "Câu 3: C", "Câu 4: D", "Câu 5: E", "Câu 6: F", "Câu 7: G", "Câu 8: H", "Câu 9: I"]],
  "Phiên 5": [["Timestamp", "Họ và tên", "Đơn vị công tác", "Câu trả lời của bạn (Trình bày căn cứ và giải thích chi tiết):", "Score"]],
  "Phiên 6": [
    ["Timestamp", "Score", "Họ và tên", "Đơn vị công tác", "1. C1", "-> Giải thích lý do / căn cứ cho câu trên:", "2. C2", "-> Giải thích lý do / căn cứ cho câu trên:", "3. C3", "-> Giải thích lý do / căn cứ cho câu trên:", "4. C4", "-> Giải thích lý do / căn cứ cho câu trên:", "5. C5", "-> Giải thích lý do / căn cứ cho câu trên:", "6. C6", "-> Giải thích lý do / căn cứ cho câu trên:", "7. C7", "-> Giải thích lý do / căn cứ cho câu trên:"],
    ["31/8/2026", "5 / 7", "Nguyễn Văn A", "Đơn vị A", "Sai", "Giải thích 1", "Sai", "Giải thích 2", "Đúng", "Giải thích 3", "Sai", "Giải thích 4", "Sai", "Giải thích 5", "Sai", "Giải thích 6", "Đúng", "Giải thích 7"]
  ],
  "Phiên 7": [["Timestamp", "Họ và tên", "Đơn vị công tác", "Phân tích hồ sơ (Chỉ ra những nội dung thừa / thiếu và căn cứ pháp lý):", "Score"]],
  "Phiên 8": [["Timestamp", "Họ và tên", "Đơn vị công tác", "Phân tích hồ sơ (Chỉ ra những nội dung thừa / thiếu và căn cứ pháp lý):", "Score"]],
  "Phiên 9": [["Timestamp", "Score", "Họ và tên", "Đơn vị công tác", "Câu 1: A", "Câu 2: B"]]
};

const context = {
  console,
  CacheService: { getScriptCache: () => ({ get: () => null, put: () => {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: key => key === "SPREADSHEET_ID" ? "test-sheet" : null }) },
  SpreadsheetApp: {
    openById: () => ({
      getSheetByName: name => rowsBySheet[name] ? {
        getDataRange: () => ({ getDisplayValues: () => rowsBySheet[name].map(row => [...row]) })
      } : null
    })
  },
  ContentService: {
    MimeType: { JSON: "json", JAVASCRIPT: "javascript" },
    createTextOutput: text => ({ text, setMimeType() { return this; } })
  }
};

vm.createContext(context);
vm.runInContext(`${source}\nthis.__getDashboardData = getDashboardData_;`, context);
const data = context.__getDashboardData(true);

assert.equal(data.sessions.length, 9);
assert.equal(data.sessions[0].totalResponses, 1);
assert.equal(data.sessions[0].questions.length, 6);
assert.equal(data.sessions[0].scoreStats.averagePercent, 50 / 60 * 100);
assert.equal(data.sessions[0].scoreStats.mode, "Tính lại từ đáp án chuẩn");
assert.equal(data.sessions[0].participatingUnits, 1);
assert.equal(data.sessions[0].quizSummary.hardestQuestion.number, 6);
assert.deepEqual(
  JSON.parse(JSON.stringify(data.sessions[0].quizSummary.correctDistribution)),
  [{ label: "5", count: 1 }]
);
assert.equal(data.sessions[1].ordering.correctCount, 1);
assert.equal(data.sessions[1].scoreStats.average, 10);
assert.equal(data.sessions[1].ordering.correctRate, 100);
assert.equal(data.sessions[1].ordering.uniqueSequenceCount, 1);
assert.equal(data.sessions[1].ordering.positionAccuracy.length, 13);
assert.equal(data.sessions[1].ordering.positionAccuracy[0].percent, 100);
assert.equal(data.sessions[2].referenceAnswer.length, 3);
assert.equal(data.sessions[2].participatingUnits, 1);
assert.equal(data.sessions[5].questions[0].options[0].label, "Sai");
assert.equal(data.sessions[5].questions[0].explanations[0], "Giải thích 1");
assert.match(data.sessions[5].questions[0].referenceNote, /^Sai:/);
assert.equal(data.sessions[5].scoreStats.average, 70);
assert.equal(data.sessions[5].scoreStats.maxScore, 70);
assert.equal(data.sessions[5].explanationStats.rate, 100);

const serialized = JSON.stringify(data);
assert.equal(serialized.includes("Nguyễn Văn A"), false);
assert.equal(serialized.includes("Đơn vị A"), false);
assert.equal(serialized.includes("a@example.com"), false);
assert.equal(serialized.includes("0912345678"), false);
assert.equal(serialized.includes("[đã ẩn email]"), true);
assert.equal(serialized.includes("[đã ẩn số điện thoại]"), true);

console.log("aggregate.test.js: OK");
