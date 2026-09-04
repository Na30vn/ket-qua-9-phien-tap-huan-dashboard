const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');
const reporting = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Reporting.gs'), 'utf8');

function makeRange(values, onSetValues) {
  return {
    getDisplayValues: () => values.map(row => [...row]),
    getValues: () => values.map(row => [...row]),
    setValues(data) { if (onSetValues) onSetValues(data); return this; },
    setFormulas() { return this; },
    setFontWeight() { return this; }, setBackground() { return this; },
    setFontColor() { return this; }, setHorizontalAlignment() { return this; },
    setVerticalAlignment() { return this; }, setFontSize() { return this; },
    setWrap() { return this; }
  };
}

function buildSpreadsheet(sessionName, sourceRows) {
  let output = null;
  const source = {
    getLastRow: () => sourceRows.length,
    getDataRange: () => makeRange(sourceRows)
  };
  const review = {
    clear() {},
    getRange(row, column) {
      return makeRange([], data => {
        if (row === 1 && column === 1) output = data.map(item => [...item]);
      });
    },
    showColumns() {}, hideColumns() {}, setRowHeight() {}, setFrozenRows() {}, setColumnWidth() {}
  };
  return {
    spreadsheet: {
      getSheetByName: name => name === sessionName ? source : name === '_GEMINI_REVIEW' ? review : null,
      insertSheet: () => review
    },
    getOutput: () => output
  };
}

const context = { console };
vm.createContext(context);
vm.runInContext(`${code}\n${reporting}\nthis.__createReview = taoTabGeminiReview_; this.__compareTop = compareTopParticipants_;`, context);

const openFixture = buildSpreadsheet('Phiên 5', [
  ['Timestamp', 'Họ và tên Anh/Chị', 'Chức vụ/Vị trí công tác', 'Đơn vị công tác', 'Câu trả lời của bạn (Trình bày căn cứ và giải thích chi tiết):'],
  ['04/09/2026 09:00:00', 'Nguyễn Văn A', 'Chuyên viên', 'Phường Hải Châu', 'Bài tự luận']
]);
context.__createReview(openFixture.spreadsheet, 5);
assert.equal(openFixture.getOutput()[1][2], 'Nguyễn Văn A');
assert.equal(openFixture.getOutput()[1][3], 'Phường Hải Châu');
assert.equal(openFixture.getOutput()[1][5], 'Bài tự luận');

const trueFalseHeaders = ['Timestamp', 'Họ và tên Anh/Chị', 'Chức vụ/Vị trí công tác', 'Đơn vị công tác'];
const trueFalseRow = ['04/09/2026 09:01:00', 'Trần Thị B', 'Kế toán', 'Xã Hòa Tiến'];
['Sai', 'Sai', 'Đúng', 'Sai', 'Sai', 'Sai', 'Đúng'].forEach((answer, index) => {
  trueFalseHeaders.push(`${index + 1}. Mệnh đề ${index + 1}`, 'Giải thích lý do / căn cứ cho câu trên:');
  trueFalseRow.push(answer, `Giải thích ${index + 1}`);
});
const trueFalseFixture = buildSpreadsheet('Phiên 6', [trueFalseHeaders, trueFalseRow]);
context.__createReview(trueFalseFixture.spreadsheet, 6);
assert.equal(trueFalseFixture.getOutput()[1][3], 'Xã Hòa Tiến');
assert.equal(trueFalseFixture.getOutput()[1][5], 'Sai; Sai; Đúng; Sai; Sai; Sai; Đúng');
assert.equal(trueFalseFixture.getOutput()[1][8], '7/7');

const ranked = [
  { name: 'Nộp sớm nhưng giải thích ít', choiceCorrectCount: 6, explanationMatchedCount: 3, submittedAtValue: 1 },
  { name: 'Nộp muộn nhưng giải thích nhiều', choiceCorrectCount: 6, explanationMatchedCount: 5, submittedAtValue: 2 },
  { name: 'Nhiều câu đúng nhất', choiceCorrectCount: 7, explanationMatchedCount: 0, submittedAtValue: 3 }
].sort((a, b) => context.__compareTop(a, b, 6));
assert.deepEqual(ranked.map(item => item.name), [
  'Nhiều câu đúng nhất',
  'Nộp muộn nhưng giải thích nhiều',
  'Nộp sớm nhưng giải thích ít'
]);

console.log('reporting-columns.test.js: OK');
