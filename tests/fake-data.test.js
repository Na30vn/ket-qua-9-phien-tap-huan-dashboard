const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "fake.json"), "utf8"));

assert.equal(data.fake, true);
assert.equal(data.version, 5);
assert.equal(data.sessions.length, 9);
assert.deepEqual(data.sessions.map(session => session.id), [1, 2, 3, 4, 5, 6, 7, 8, 9]);

for (const session of data.sessions) {
  assert.equal(session.totalResponses, 274, `Phiên ${session.id} phải mô phỏng đủ 274 học viên`);
  assert.equal(session.currentResponses, 274);
  assert.equal(session.phase, "CLOSED");
  assert.equal(session.participatingUnits, 81, `Phiên ${session.id} phải có đủ 81 đơn vị thực tế`);
  assert.equal(session.unitBreakdown.length, session.participatingUnits);
  assert.equal(session.unitBreakdown.reduce((sum, item) => sum + item.count, 0), session.totalResponses);

  if (session.kind === "quiz" || session.kind === "true_false") {
    assert.ok(session.questions.length > 0);
    for (const question of session.questions) {
      assert.equal(question.totalAnswers, session.totalResponses);
      assert.equal(question.options.reduce((sum, option) => sum + option.count, 0), session.totalResponses);
      assert.equal(question.correctCount + question.incorrectCount + question.unansweredCount, session.totalResponses);
    }
  }

  if (session.kind === "true_false") {
    for (const question of session.questions) {
      assert.equal(question.explanations.length, 10);
      assert.equal(question.explanations.filter(item => item.selectedAnswer === "Đúng").length, 5);
      assert.equal(question.explanations.filter(item => item.selectedAnswer === "Sai").length, 5);
    }
  }

  if (session.kind === "open") {
    assert.ok(session.referenceAnswer.length > 0);
    assert.ok(session.responses.length >= 10);
    assert.ok(session.participatingUnits > 0);
    assert.equal(session.liveResponses.length, 10);
  }
}

const ordering = data.sessions.find(session => session.id === 2).ordering;
assert.equal(ordering.positionAccuracy.length, 13);
assert.ok(ordering.commonSequences.length <= 5);
assert.equal(ordering.samples.length, 10);
assert.equal(data.sessions.find(session => session.id === 2).prompt.items.length, 13);
for (const id of [2, 3, 5, 7, 8]) {
  assert.ok(data.sessions.find(session => session.id === id).prompt, `Phiên ${id} phải có đề bài`);
}
for (const id of [3, 5, 7, 8]) {
  assert.equal(data.sessions.find(session => session.id === id).prompt.label, "TÌNH HUỐNG");
}

const serialized = JSON.stringify(data);
assert.equal(/"email"\s*:|"phone"\s*:|"fullName"\s*:/.test(serialized), false);
console.log("fake-data.test.js: OK");
