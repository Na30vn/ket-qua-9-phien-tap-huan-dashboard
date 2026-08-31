const fs = require("node:fs");
const path = require("node:path");

const sourcePath = process.argv[2];
const outputPath = process.argv[3] || path.join(__dirname, "..", "data", "fake.json");
if (!sourcePath) {
  throw new Error("Cách dùng: node scripts/generate-fake-data.js <api-schema.json> [output.json]");
}

const payload = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const quizProfiles = {
  1: { total: 48, units: 12, correct: [36, 34, 30, 24, 27, 20], distribution: [1, 3, 7, 11, 13, 9, 4] },
  4: { total: 52, units: 11, correct: [38, 33, 31, 29, 35, 28, 25, 30, 25], distribution: [1, 1, 3, 5, 7, 10, 10, 8, 5, 2] },
  9: { total: 50, units: 9, correct: [34, 26], distribution: [8, 24, 18] }
};

const openResponses = {
  3: [
    "Cần công khai số liệu dự toán trình Hội đồng nhân dân cùng phần thuyết minh để người dân có thể theo dõi.",
    "Nội dung còn thiếu phần giải trình quyết toán đã được phê chuẩn, bao gồm kết quả thu và chi.",
    "Các mốc công khai tình hình thực hiện dự toán nên là 03 tháng, 06 tháng, 09 tháng và cả năm.",
    "Tình huống mới nêu công khai dự toán được giao nhưng chưa nói đến hồ sơ trình Hội đồng nhân dân.",
    "Cần bổ sung thuyết minh nguyên nhân tăng giảm các khoản thu, chi so với dự toán.",
    "Việc ghi công khai hàng quý chưa phản ánh đúng các mốc thời gian mà quy định yêu cầu.",
    "Theo tôi phải công khai cả dự toán, tình hình thực hiện và quyết toán ngân sách cấp xã.",
    "Quyết toán được phê chuẩn cần có số liệu thu ngân sách nhà nước trên địa bàn và chi ngân sách xã.",
    "Hồ sơ công khai cần bảo đảm người dân tiếp cận được số liệu và phần giải thích kèm theo.",
    "Cần xác định rõ thời điểm công khai sau khi Hội đồng nhân dân phê chuẩn quyết toán.",
    "Tình huống còn thiếu nội dung công khai kết quả thực hiện các kiến nghị sau thanh tra, kiểm toán.",
    "Nên tách rõ công khai dự toán trình, dự toán được giao, thực hiện dự toán và quyết toán."
  ],
  5: [
    "Đơn vị dự toán cấp I đồng thời là đơn vị sử dụng ngân sách lập báo cáo quyết toán và gửi cơ quan tài chính kiểm tra.",
    "Cơ quan tài chính kiểm tra tính đầy đủ của báo cáo và đối chiếu số liệu với xác nhận của Kho bạc Nhà nước.",
    "Thủ trưởng đơn vị chịu trách nhiệm về tính chính xác, trung thực của số liệu quyết toán.",
    "Không cần tổ chức xét duyệt cho chính đơn vị mình theo quy trình áp dụng với đơn vị trực thuộc.",
    "Báo cáo quyết toán phải khớp với số liệu thu, chi đã được Kho bạc Nhà nước xác nhận.",
    "Cần phân biệt trường hợp đơn vị cấp I có đơn vị trực thuộc với trường hợp đồng thời là đơn vị sử dụng ngân sách.",
    "Hồ sơ gửi cơ quan tài chính phải đầy đủ biểu mẫu, thuyết minh và xác nhận số liệu theo quy định.",
    "Trách nhiệm cuối cùng về báo cáo quyết toán thuộc người đứng đầu đơn vị.",
    "Cơ quan tài chính thực hiện kiểm tra thay vì đơn vị tự xét duyệt quyết toán cho chính mình.",
    "Nếu có chênh lệch với Kho bạc Nhà nước thì đơn vị phải rà soát, điều chỉnh trước khi tổng hợp.",
    "Báo cáo cần phản ánh đúng nguồn kinh phí, nhiệm vụ chi và số chuyển nguồn nếu có.",
    "Căn cứ xử lý là khoản 5 Điều 69 Luật Ngân sách nhà nước số 89/2025/QH15."
  ],
  7: [
    "Hồ sơ thiếu quyết định của Chủ tịch UBND xã về tiêu chuẩn, định mức máy phát điện.",
    "Máy phát điện là thiết bị phục vụ hoạt động chung nên phải xác định đúng thẩm quyền quyết định định mức.",
    "Việc trình UBND xã phê duyệt chủ trương và dự kiến kinh phí là bước không cần thiết trong tình huống này.",
    "Người đứng đầu đơn vị dự toán cấp I quyết định nội dung mua sắm theo phân cấp tại Quyết định số 80/2026/QĐ-UBND.",
    "Cần bổ sung căn cứ xác định nhu cầu, công suất và số lượng máy phát điện phù hợp.",
    "Hồ sơ nên làm rõ nguồn kinh phí và dự toán mua sắm đã được giao.",
    "Thiếu bước đối chiếu tiêu chuẩn, định mức trước khi lập kế hoạch lựa chọn nhà thầu.",
    "Thẩm quyền không thuộc tập thể UBND xã đối với quyết định tiêu chuẩn, định mức nêu trong tình huống.",
    "Cần rà soát lại tờ trình để bỏ thủ tục xin phê duyệt chủ trương không cần thiết.",
    "Sau khi đủ căn cứ về định mức mới thực hiện các bước lựa chọn nhà thầu theo quy định.",
    "Hồ sơ có thể gộp phần giải trình nhu cầu sử dụng và hiệu quả đầu tư để tránh lặp nội dung.",
    "Trách nhiệm phê duyệt phải bám đúng phân cấp cho đơn vị dự toán cấp I."
  ],
  8: [
    "Phải trình Chủ tịch UBND xã quyết định tiêu chuẩn, định mức màn hình LED, không trình tập thể UBND xã.",
    "Không cần trình UBND xã phê duyệt chủ trương và dự kiến kinh phí trong trường hợp thuộc thẩm quyền đơn vị dự toán cấp I.",
    "Quy trình đang thừa bước thẩm định kế hoạch lựa chọn nhà thầu.",
    "Tên văn bản cuối phải là quyết định phê duyệt kết quả lựa chọn nhà thầu.",
    "Màn hình LED tại hội trường là thiết bị phục vụ hoạt động chung nên cần có căn cứ về tiêu chuẩn, định mức.",
    "Cần làm rõ kích thước, cấu hình và nhu cầu sử dụng để xác định dự toán phù hợp.",
    "Hồ sơ nên bỏ nội dung xin phê duyệt chủ trương nếu pháp luật phân cấp cho người đứng đầu đơn vị.",
    "Thẩm quyền quyết định tiêu chuẩn, định mức và thẩm quyền mua sắm là hai nội dung cần tách rõ.",
    "Bước phê duyệt kết quả lựa chọn nhà thầu chỉ thực hiện sau khi hoàn thành đánh giá hồ sơ.",
    "Cần rà soát lại căn cứ pháp lý dẫn chiếu trong tờ trình.",
    "Không sử dụng cụm từ quyết định chỉ định thầu nếu quy trình thực tế là phê duyệt kết quả lựa chọn nhà thầu.",
    "Nguồn kinh phí và dự toán được giao cần thể hiện rõ trong hồ sơ mua sắm."
  ]
};

const sampleUnits = [
  "Sở Tài chính", "Phường Hải Châu", "Phường Hòa Cường", "Phường Thanh Khê",
  "Phường An Khê", "Phường An Hải", "Phường Sơn Trà", "Phường Ngũ Hành Sơn",
  "Phường Hòa Khánh", "Phường Liên Chiểu", "Xã Hòa Vang", "Xã Hòa Tiến"
];

function scoreStatsFromDistribution(counts, pointsPerQuestion) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const questionCount = counts.length - 1;
  const correctTotal = counts.reduce((sum, count, correct) => sum + count * correct, 0);
  const averageCorrect = total ? correctTotal / total : 0;
  return {
    count: total,
    maxScore: questionCount * pointsPerQuestion,
    average: averageCorrect * pointsPerQuestion,
    averagePercent: questionCount ? averageCorrect / questionCount * 100 : 0,
    mode: "Dữ liệu giả lập",
    distribution: counts.map((count, correct) => ({ label: `${correct * pointsPerQuestion}/${questionCount * pointsPerQuestion}`, count }))
  };
}

function splitCounts(total, buckets) {
  if (!buckets) return [];
  const base = Math.floor(total / buckets);
  const remainder = total % buckets;
  return Array.from({ length: buckets }, (_, index) => base + (index < remainder ? 1 : 0));
}

function fakeQuizQuestion(question, total, correctCount, index) {
  const correctAnswer = question.correctAnswer;
  const existing = (question.options || []).map(option => option.label).filter(label => label && label !== correctAnswer);
  const labels = [correctAnswer, ...existing].filter((label, position, all) => all.indexOf(label) === position);
  while (labels.length < 4) labels.push(`Phương án minh họa ${String.fromCharCode(65 + labels.length)}`);
  const selected = labels.slice(0, 4);
  const wrongCounts = splitCounts(total - correctCount, selected.length - 1);
  return {
    ...question,
    totalAnswers: total,
    correctCount,
    incorrectCount: total - correctCount,
    unansweredCount: 0,
    correctPercent: correctCount / total * 100,
    options: selected.map((label, optionIndex) => ({
      label,
      count: optionIndex === 0 ? correctCount : wrongCounts[optionIndex - 1],
      isCorrect: optionIndex === 0
    })),
    explanations: question.explanations || []
  };
}

function applyQuiz(session, profile) {
  session.totalResponses = profile.total;
  session.participatingUnits = profile.units;
  session.questions = session.questions.map((question, index) =>
    fakeQuizQuestion(question, profile.total, profile.correct[index], index));
  session.scoreStats = scoreStatsFromDistribution(profile.distribution, 10);
  const hardestIndex = profile.correct.reduce((lowest, value, index, values) => value < values[lowest] ? index : lowest, 0);
  const perfectCount = profile.distribution.at(-1);
  session.quizSummary = {
    averageCorrectPercent: profile.correct.reduce((sum, count) => sum + count, 0) / (profile.total * profile.correct.length) * 100,
    hardestQuestion: {
      number: hardestIndex + 1,
      title: session.questions[hardestIndex].title,
      correctPercent: profile.correct[hardestIndex] / profile.total * 100
    },
    perfectCount,
    perfectRate: perfectCount / profile.total * 100,
    correctDistribution: profile.distribution.map((count, correct) => ({ label: String(correct), count }))
  };
}

function applyOrdering(session) {
  const total = 46;
  const correctCount = 9;
  const correctSteps = String(session.ordering.correctSequence).split(",").map(value => value.trim());
  const positionCounts = [42, 39, 35, 31, 29, 25, 30, 27, 24, 22, 20, 18, 16];
  session.totalResponses = total;
  session.participatingUnits = 10;
  session.scoreStats = {
    count: total,
    maxScore: 10,
    average: correctCount / total * 10,
    averagePercent: correctCount / total * 100,
    mode: "Dữ liệu giả lập",
    distribution: [{ label: "0/10", count: total - correctCount }, { label: "10/10", count: correctCount }]
  };
  session.ordering = {
    ...session.ordering,
    correctCount,
    correctRate: correctCount / total * 100,
    uniqueSequenceCount: 18,
    positionAccuracy: correctSteps.map((step, index) => ({
      step,
      position: index + 1,
      count: positionCounts[index],
      percent: positionCounts[index] / total * 100
    })),
    commonSequences: [
      { value: "3,5,1,4,6,11,9,8,10,13,2,12,7", count: 8 },
      { value: "3,5,1,6,11,4,9,8,10,13,2,12,7", count: 6 },
      { value: "3,1,5,6,4,11,9,8,10,13,2,12,7", count: 5 },
      { value: "5,3,1,6,4,11,9,8,10,13,2,12,7", count: 4 },
      { value: "3,5,1,6,4,11,8,9,10,13,2,12,7", count: 3 }
    ]
  };
}

function applyTrueFalse(session) {
  const total = 45;
  const correctCounts = [28, 25, 35, 21, 18, 26, 32];
  const explanations = [
    "Căn cứ về đối tượng, số lượng và mức giá tối đa cần được áp dụng đồng thời.",
    "Nhận định chưa đúng vì thẩm quyền và loại tài sản trong tình huống chưa được xác định chính xác.",
    "Tôi chọn theo mức giá tối đa và phạm vi chi phí được nêu trong quy định.",
    "Thiết bị này phục vụ hoạt động chung nên phải áp dụng đúng thẩm quyền quyết định.",
    "Cần phân biệt thiết bị dùng chung với thiết bị chuyên dùng tại cơ sở giáo dục.",
    "Thẩm quyền quyết định thuộc cơ quan chuyên môn theo phân cấp hiện hành.",
    "Trường hợp không đủ tiêu chuẩn là tài sản cố định thì người đứng đầu đơn vị quyết định."
  ];
  session.totalResponses = total;
  session.participatingUnits = 10;
  session.questions = session.questions.map((question, index) => {
    const correct = question.correctAnswer;
    const correctCount = correctCounts[index];
    const trueCount = correct === "Đúng" ? correctCount : total - correctCount;
    const falseCount = total - trueCount;
    return {
      ...question,
      totalAnswers: total,
      correctCount,
      incorrectCount: total - correctCount,
      unansweredCount: 0,
      correctPercent: correctCount / total * 100,
      options: [
        { label: "Đúng", count: trueCount, isCorrect: correct === "Đúng" },
        { label: "Sai", count: falseCount, isCorrect: correct === "Sai" }
      ],
      explanations: Array.from({ length: 8 }, (_, answerIndex) =>
        `${explanations[index]} Ý kiến minh họa số ${answerIndex + 1}.`)
    };
  });
  const correctTotal = correctCounts.reduce((sum, count) => sum + count, 0);
  const hardestIndex = correctCounts.indexOf(Math.min(...correctCounts));
  session.scoreStats = {
    count: total,
    maxScore: 70,
    average: correctTotal / total * 10,
    averagePercent: correctTotal / (total * 7) * 100,
    mode: "Dữ liệu giả lập",
    distribution: []
  };
  session.quizSummary = {
    averageCorrectPercent: session.scoreStats.averagePercent,
    hardestQuestion: {
      number: hardestIndex + 1,
      title: session.questions[hardestIndex].title,
      correctPercent: correctCounts[hardestIndex] / total * 100
    },
    perfectCount: 5,
    perfectRate: 5 / total * 100,
    correctDistribution: []
  };
  session.explanationStats = { count: 266, rate: 266 / (total * 7) * 100 };
}

for (const session of payload.sessions) {
  if (quizProfiles[session.id]) applyQuiz(session, quizProfiles[session.id]);
  else if (session.id === 2) applyOrdering(session);
  else if (session.id === 6) applyTrueFalse(session);
  else if (openResponses[session.id]) {
    const totals = { 3: 36, 5: 33, 7: 38, 8: 35 };
    const units = { 3: 9, 5: 8, 7: 10, 8: 9 };
    session.totalResponses = totals[session.id];
    session.participatingUnits = units[session.id];
    session.scoreStats = { count: 0, distribution: [], mode: "Không chấm tự động" };
    session.responses = openResponses[session.id];
  }
  const unitCount = Math.min(Number(session.participatingUnits || 0), sampleUnits.length);
  const unitCounts = splitCounts(session.totalResponses, unitCount).sort((a, b) => b - a);
  session.unitBreakdown = sampleUnits.slice(0, unitCount)
    .map((unit, index) => ({ unit, count: unitCounts[index] }))
    .filter(item => item.count > 0);
  session.participatingUnits = session.unitBreakdown.length;
}

payload.version = 4;
payload.fake = true;
payload.updatedAt = new Date().toISOString();
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`Đã tạo ${outputPath}`);
