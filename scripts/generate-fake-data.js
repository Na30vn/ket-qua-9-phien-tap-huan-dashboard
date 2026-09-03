const fs = require("node:fs");
const path = require("node:path");

const sourcePath = process.argv[2];
const outputPath = process.argv[3] || path.join(__dirname, "..", "data", "fake.json");
if (!sourcePath) {
  throw new Error("Cách dùng: node scripts/generate-fake-data.js <api-schema.json> [output.json]");
}

const payload = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const DEMO_TOTAL_RESPONSES = 274;
const quizProfiles = {
  1: { total: DEMO_TOTAL_RESPONSES, correct: [206, 194, 171, 137, 154, 114], distribution: [6, 17, 40, 63, 74, 51, 23] },
  4: { total: DEMO_TOTAL_RESPONSES, correct: [200, 174, 163, 153, 184, 147, 132, 158, 132], distribution: [5, 5, 16, 26, 37, 53, 53, 42, 26, 11] },
  9: { total: DEMO_TOTAL_RESPONSES, correct: [186, 142], distribution: [44, 131, 99] }
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
  "Phường Hòa Khánh", "Phường Liên Chiểu", "Phường Hải Vân", "Phường Tam Kỳ",
  "Phường Quảng Phú", "Phường Hương Trà", "Phường Bàn Thạch", "Phường Điện Bàn",
  "Phường Điện Bàn Đông", "Phường An Thắng", "Phường Điện Bàn Bắc", "Phường Hội An",
  "Phường Hội An Đông", "Phường Hội An Tây", "Xã Hòa Vang", "Xã Hòa Tiến",
  "Xã Bà Nà", "Xã Tam Anh", "Xã Tam Xuân", "Xã Tây Hồ", "Xã Chiên Đàn",
  "Xã Tiên Phước", "Xã Thạnh Bình", "Xã Sơn Cẩm Hà", "Xã Trà Liên", "Xã Trà Giáp",
  "Xã Trà Tân", "Xã Trà My", "Xã Nam Trà My", "Xã Trà Tập", "Xã Trà Vân",
  "Xã Trà Leng", "Xã Thăng Bình", "Xã Thăng An", "Xã Thăng Trường", "Xã Thăng Phú",
  "Xã Đồng Dương", "Xã Quế Sơn Trung", "Xã Xuân Phú", "Xã Nông Sơn", "Xã Quế Phước",
  "Xã Duy Nghĩa", "Xã Nam Phước", "Xã Duy Xuyên", "Xã Thu Bồn", "Xã Điện Bàn Tây",
  "Xã Gò Nổi", "Xã Tân Hiệp", "Xã Đại Lộc", "Xã Hà Nha", "Xã Thượng Đức",
  "Xã Vu Gia", "Xã Phú Thuận", "Xã Thạnh Mỹ", "Xã Bến Giằng", "Xã Nam Giang",
  "Xã Đắc Pring", "Xã La Dêê", "Xã La Êê", "Xã Sông Vàng", "Xã Sông Kôn",
  "Xã Đông Giang", "Xã Avương", "Xã Tây Giang", "Xã Hiệp Đức", "Xã Việt An",
  "Xã Phước Trà", "Xã Khâm Đức", "Xã Phước Năng", "Xã Phước Chánh", "Xã Phước Thành",
  "Xã Phước Hiệp", "Xã Lãnh Ngọc"
];
const missingSampleUnits = ["Xã Trà Đốc", "Xã Thăng Điền"];

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
  session.participatingUnits = sampleUnits.length;
  const sourceQuestions = (session.questions && session.questions.length)
    ? session.questions
    : profile.correct.map((_, idx) => ({
        title: `Câu ${idx + 1}: Câu hỏi trắc nghiệm ${idx + 1}`,
        correctAnswer: "A. Phương án đúng"
      }));
  session.questions = sourceQuestions.map((question, index) =>
    fakeQuizQuestion(question, profile.total, profile.correct[index], index));
  session.scoreStats = scoreStatsFromDistribution(profile.distribution, 10);
  const hardestIndex = profile.correct.reduce((lowest, value, index, values) => value < values[lowest] ? index : lowest, 0);
  const perfectCount = profile.distribution.at(-1);
  session.quizSummary = {
    averageCorrectPercent: profile.correct.reduce((sum, count) => sum + count, 0) / (profile.total * profile.correct.length) * 100,
    hardestQuestion: {
      number: hardestIndex + 1,
      title: session.questions?.[hardestIndex]?.title || `Câu ${hardestIndex + 1}`,
      correctPercent: profile.correct[hardestIndex] / profile.total * 100
    },
    perfectCount,
    perfectRate: perfectCount / profile.total * 100,
    correctDistribution: profile.distribution.map((count, correct) => ({ label: String(correct), count }))
  };
}

function applyOrdering(session) {
  const total = DEMO_TOTAL_RESPONSES;
  const correctCount = 54;
  const correctSteps = String(session.ordering.correctSequence).split(",").map(value => value.trim());
  const positionCounts = [250, 232, 208, 185, 173, 149, 179, 161, 143, 131, 119, 107, 95];
  session.totalResponses = total;
  session.participatingUnits = sampleUnits.length;
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
    correctSteps: correctSteps.map((step, index) => ({
      position: index + 1,
      step: Number(step),
      text: session.prompt.items[Number(step) - 1]
    })),
    correctCount,
    correctRate: correctCount / total * 100,
    uniqueSequenceCount: 96,
    positionAccuracy: correctSteps.map((step, index) => ({
      step,
      position: index + 1,
      count: positionCounts[index],
      percent: positionCounts[index] / total * 100
    })),
    commonSequences: [
      { value: "3,5,1,4,6,11,9,8,10,13,2,12,7", count: 43 },
      { value: "3,5,1,6,11,4,9,8,10,13,2,12,7", count: 35 },
      { value: "3,1,5,6,4,11,9,8,10,13,2,12,7", count: 29 },
      { value: "5,3,1,6,4,11,9,8,10,13,2,12,7", count: 24 },
      { value: "3,5,1,6,4,11,8,9,10,13,2,12,7", count: 18 }
    ],
    samples: [
      "3,5,1,6,4,11,9,8,10,13,2,12,7", "3,5,1,4,6,11,9,8,10,13,2,12,7",
      "3,1,5,6,4,11,9,8,10,13,2,12,7", "5,3,1,6,4,11,9,8,10,13,2,12,7",
      "3,5,1,6,4,11,8,9,10,13,2,12,7", "3,5,1,6,11,4,9,8,10,13,2,12,7",
      "3,5,1,6,4,11,9,8,10,13,2,12,7", "3,5,1,6,4,9,11,8,10,13,2,12,7",
      "3,5,1,6,4,11,9,10,8,13,2,12,7", "3,5,1,6,4,11,9,8,10,2,13,12,7"
    ]
  };
}

function applyLeaderboard(session) {
  if (![1, 2, 4, 6, 9].includes(session.id)) {
    session.leaderboard = [];
    return;
  }
  const names = ["Nguyễn Minh Anh", "Trần Thu Hà", "Lê Quốc Bảo", "Phạm Hoài Nam", "Đỗ Thanh Hương", "Võ Đức Anh", "Nguyễn Hải Yến", "Bùi Quang Huy", "Trương Mỹ Linh", "Lê Ngọc Sơn"];
  const total = session.kind === "ordering" ? 13 : session.questions.length;
  session.leaderboard = names.map((name, index) => ({
    name,
    unit: sampleUnits[index],
    result: session.kind === "ordering" ? `${total}/${total} bước đúng` : `${total}/${total} câu đúng`,
    completedAt: new Date(Date.UTC(2026, 7, 31, 8, 15, 10 + index * 7)).toISOString()
  }));
}

function applyTrueFalse(session) {
  const total = DEMO_TOTAL_RESPONSES;
  const correctCounts = [170, 152, 213, 128, 110, 158, 195];
  const explanations = [
    "Căn cứ về đối tượng, số lượng và mức giá tối đa cần được áp dụng đồng thời.",
    "Nhận định chưa đúng vì thẩm quyền và loại tài sản trong tình huống chưa được xác định chính xác.",
    "Tôi chọn theo mức giá tối đa và phạm vi chi phí được nêu trong quy định.",
    "Thiết bị này phục vụ hoạt động chung nên phải áp dụng đúng thẩm quyền quyết định.",
    "Cần phân biệt thiết bị dùng chung với thiết bị chuyên dùng tại cơ sở giáo dục.",
    "Thẩm quyền quyết định thuộc cơ quan chuyên môn theo phân cấp hiện hành.",
  ];
  const titles = [
    "Bí thư Đảng ủy xã được trang bị 1 máy tính xách tay max 25tr và 1 máy để bàn max 20tr",
    "Phòng làm việc từ 3 người trở xuống được trang bị tối đa 1 máy in max 13tr",
    "Mức giá máy tính 20 triệu đồng chưa bao gồm bản quyền phần mềm",
    "Điều hòa nhiệt độ phòng làm việc là thiết bị chung, do Chủ tịch UBND xã quyết định",
    "Màn hình LED hội trường là thiết bị dùng chung, do Chủ tịch UBND xã quyết định",
    "Máy chiếu lớp học là thiết bị chuyên dùng, do Sở GD&ĐT ban hành tiêu chuẩn",
    "Không đủ tiêu chuẩn tài sản cố định thì thủ trưởng đơn vị quyết định"
  ];
  const sourceQuestions = (session.questions && session.questions.length)
    ? session.questions
    : titles.map((title, idx) => ({ title, correctAnswer: idx === 2 || idx === 6 ? "Đúng" : "Sai" }));
  session.totalResponses = total;
  session.participatingUnits = sampleUnits.length;
  session.questions = sourceQuestions.map((question, index) => {
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
      explanations: [
        ...Array.from({ length: 5 }, (_, answerIndex) => ({
          selectedAnswer: "Đúng",
          text: `${explanations[index]} Đây là giải thích minh họa số ${answerIndex + 1} của nhóm chọn Đúng.`
        })),
        ...Array.from({ length: 5 }, (_, answerIndex) => ({
          selectedAnswer: "Sai",
          text: `${explanations[index]} Đây là giải thích minh họa số ${answerIndex + 1} của nhóm chọn Sai.`
        }))
      ]
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
      title: session.questions?.[hardestIndex]?.title || `Câu ${hardestIndex + 1}`,
      correctPercent: correctCounts[hardestIndex] / total * 100
    },
    perfectCount: 30,
    perfectRate: 30 / total * 100,
    correctDistribution: []
  };
  session.explanationStats = { count: 1619, rate: 1619 / (total * 7) * 100 };
}

const samplePositions = [
  "Kế toán trưởng", "Phó Trưởng phòng", "Chủ tịch UBND xã", "Công chức Kế toán",
  "Chuyên viên chính", "Phó Chủ tịch UBND xã", "Trưởng phòng", "Thủ quỹ",
  "Chuyên viên", "Phó Chánh Văn phòng"
];

function applyTopParticipants(session) {
  const names = [
    "Trần Thị Minh Trang", "Nguyễn Hoàng Nam", "Lê Phương Anh", "Phạm Văn Đức",
    "Đỗ Hoài Thu", "Vũ Nhật Minh", "Bùi Thanh Hằng", "Đặng Quang Vinh",
    "Trương Mỹ Duyên", "Phan Tuấn Kiệt"
  ];

  if (session.id === 1) {
    session.topParticipants = names.map((name, index) => ({
      rank: index + 1,
      name,
      unit: sampleUnits[index],
      position: samplePositions[index],
      submittedAt: new Date(Date.UTC(2026, 7, 31, 8, 14, 10 + index * 12)).toISOString(),
      scoreText: index < 3 ? "6/6 câu đúng" : index < 7 ? "5/6 câu đúng" : "4/6 câu đúng",
      result: index < 3 ? "6/6 câu đúng" : index < 7 ? "5/6 câu đúng" : "4/6 câu đúng",
      questionDetails: [
        { number: 1, title: "Trong phân cấp ngân sách địa phương, khoản thu nào không thuộc ngân sách xã", userChoice: "A. Thu phí, lệ phí theo quy định", correctChoice: "A. Thu phí, lệ phí theo quy định", isCorrect: true },
        { number: 2, title: "Yêu cầu không đúng khi quản lý thu phí, lệ phí", userChoice: "C. Để lại 100% không kê khai", correctChoice: "C. Để lại 100% không kê khai", isCorrect: true },
        { number: 3, title: "Yêu cầu không đúng khi lập dự toán ngân sách xã", userChoice: "B. Lập dự toán không căn cứ vào kế hoạch", correctChoice: "B. Lập dự toán không căn cứ vào kế hoạch", isCorrect: true },
        { number: 4, title: "Nội dung không đúng về sử dụng dự phòng ngân sách huyện", userChoice: "D. Tự ý chi ngoài dự toán", correctChoice: "D. Tự ý chi ngoài dự toán", isCorrect: true },
        { number: 5, title: "Thẩm quyền quyết định sử dụng dự phòng ngân sách xã", userChoice: "A. Chủ tịch UBND xã", correctChoice: "A. Chủ tịch UBND xã", isCorrect: true },
        { number: 6, title: "Cơ quan có quyền tạm đình chỉ chi ngân sách cấp xã", userChoice: index < 5 ? "C. Trưởng phòng Tài chính - Kế hoạch" : "B. Chủ tịch HĐND xã", correctChoice: "C. Trưởng phòng Tài chính - Kế hoạch", isCorrect: index < 5 }
      ]
    }));
  } else if (session.id === 2) {
    const correctSeq = ["3", "5", "1", "6", "4", "11", "9", "8", "10", "13", "2", "12", "7"];
    session.topParticipants = names.map((name, index) => ({
      rank: index + 1,
      name,
      unit: sampleUnits[index],
      position: samplePositions[index],
      submittedAt: new Date(Date.UTC(2026, 7, 31, 8, 15, 5 + index * 10)).toISOString(),
      scoreText: index === 0 ? "13/13 bước đúng" : index < 4 ? "12/13 bước đúng" : "11/13 bước đúng",
      result: index === 0 ? "13/13 bước đúng" : index < 4 ? "12/13 bước đúng" : "11/13 bước đúng",
      questionDetails: correctSeq.map((step, idx) => {
        const isWrong = index > 0 && idx === 3;
        const userStep = isWrong ? "4" : step;
        return {
          number: idx + 1,
          title: `Vị trí ${idx + 1}`,
          userChoice: `Bước ${userStep}: ${session.prompt?.items?.[Number(userStep) - 1] || ""}`,
          correctChoice: `Bước ${step}: ${session.prompt?.items?.[Number(step) - 1] || ""}`,
          isCorrect: !isWrong
        };
      })
    }));
  } else if (session.id === 3) {
    session.topParticipants = names.map((name, index) => ({
      rank: index + 1,
      name,
      unit: sampleUnits[index],
      position: samplePositions[index],
      submittedAt: new Date(Date.UTC(2026, 7, 31, 8, 14, 10 + index * 12)).toISOString(),
      scoreText: index < 5 ? "3/3 ý chuẩn" : "2/3 ý chuẩn",
      essay: `Xã A chưa đảm bảo công khai đầy đủ. Cần bổ sung công khai số liệu và thuyết minh dự toán ngân sách cấp xã trình HĐND xã; công khai thuyết minh quyết toán ngân sách đã được HĐND phê chuẩn. Đặc biệt tình hình thực hiện dự toán phải công khai theo các mốc 03 tháng, 06 tháng, 09 tháng và cả năm (mẫu số 03), không ghi chung hàng quý. (Bài làm mẫu học viên ${name})`,
      matchedItems: [
        { label: "Ý 1: Công khai số liệu & thuyết minh dự toán trình HĐND xã", matched: true },
        { label: "Ý 2: Công khai thuyết minh quyết toán HĐND đã phê chuẩn", matched: index < 8 },
        { label: "Ý 3: Mốc công khai 03, 06, 09 tháng và năm (không ghi chung hàng quý)", matched: index < 5 }
      ],
      referenceAnswer: "1. Thiếu công khai số liệu và thuyết minh dự toán trình HĐND xã.\n2. Thiếu công khai thuyết minh quyết toán HĐND phê chuẩn.\n3. Tình hình thực hiện phải công khai mốc 3, 6, 9 tháng và năm.",
      aiFeedback: index < 3 ? "Bài làm lập luận xuất sắc, chỉ ra đầy đủ 3 ý chuẩn theo quy định hiện hành." : "Nêu đúng 2/3 ý cốt lõi, diễn đạt rõ ràng.",
      criticalErrors: 0
    }));
  } else if (session.id === 5) {
    session.topParticipants = names.map((name, index) => ({
      rank: index + 1,
      name,
      unit: sampleUnits[index],
      position: samplePositions[index],
      submittedAt: new Date(Date.UTC(2026, 7, 31, 8, 16, 5 + index * 15)).toISOString(),
      scoreText: index < 7 ? "2/2 ý chuẩn" : "1/2 ý chuẩn",
      essay: `Theo khoản 5 Điều 69 Luật Ngân sách nhà nước số 89/2025/QH15, khi đơn vị dự toán cấp I đồng thời là đơn vị sử dụng ngân sách thì lập báo cáo quyết toán gửi cơ quan tài chính để kiểm tra tính đầy đủ, khớp đúng với KBNN. Thủ trưởng đơn vị chịu trách nhiệm về quyết toán của đơn vị mình. (Bài làm mẫu học viên ${name})`,
      matchedItems: [
        { label: "Ý 1: Căn cứ khoản 5 Điều 69 Luật NSNN 2025 (đơn vị cấp I đồng thời là đơn vị sử dụng NS gửi cơ quan tài chính kiểm tra)", matched: true },
        { label: "Ý 2: Thủ trưởng đơn vị chịu trách nhiệm về báo cáo quyết toán của đơn vị mình", matched: index < 7 }
      ],
      referenceAnswer: "1. Theo khoản 5 Điều 69 Luật NSNN 2025, đơn vị dự toán cấp I đồng thời là đơn vị sử dụng ngân sách lập báo cáo quyết toán gửi cơ quan tài chính kiểm tra.\n2. Thủ trưởng đơn vị chịu trách nhiệm về quyết toán.",
      aiFeedback: index < 4 ? "Trả lời chính xác căn cứ Điều 69 Luật NSNN 2025 và trách nhiệm của thủ trưởng đơn vị." : "Nắm đúng quy định về gửi cơ quan tài chính kiểm tra.",
      criticalErrors: 0
    }));
  } else if (session.id === 7) {
    session.topParticipants = names.map((name, index) => ({
      rank: index + 1,
      name,
      unit: sampleUnits[index],
      position: samplePositions[index],
      submittedAt: new Date(Date.UTC(2026, 7, 31, 8, 18, 20 + index * 10)).toISOString(),
      scoreText: index < 6 ? "2/2 ý chuẩn" : "1/2 ý chuẩn",
      essay: `Hồ sơ thừa và thiếu như sau: Thiếu trình Chủ tịch UBND xã quyết định tiêu chuẩn, định mức máy phát điện vì đây là thiết bị phục vụ hoạt động chung của cơ quan. Thừa hồ sơ trình UBND xã phê duyệt chủ trương và dự kiến kinh phí vì người đứng đầu đơn vị dự toán cấp I tự quyết định theo QĐ số 80/2026/QĐ-UBND. (Bài làm mẫu học viên ${name})`,
      matchedItems: [
        { label: "Ý 1: Thiếu trình Chủ tịch UBND xã quyết định tiêu chuẩn, định mức (thiết bị hoạt động chung)", matched: true },
        { label: "Ý 2: Thừa trình UBND xã phê duyệt chủ trương & dự kiến kinh phí (thẩm quyền người đứng đầu cấp I)", matched: index < 6 }
      ],
      referenceAnswer: "1. Thiếu trình Chủ tịch UBND xã quyết định tiêu chuẩn, định mức.\n2. Thừa hồ sơ trình UBND xã phê duyệt chủ trương và dự kiến kinh phí.",
      aiFeedback: index < 3 ? "Phân tích hồ sơ rất sắc bén, chỉ ra chính xác cả điểm thừa và điểm thiếu về thẩm quyền." : "Chỉ ra đúng thẩm quyền của Chủ tịch UBND xã.",
      criticalErrors: 0
    }));
  } else if (session.id === 8) {
    session.topParticipants = names.map((name, index) => ({
      rank: index + 1,
      name,
      unit: sampleUnits[index],
      position: samplePositions[index],
      submittedAt: new Date(Date.UTC(2026, 7, 31, 8, 20, 15 + index * 14)).toISOString(),
      scoreText: index < 4 ? "4/4 ý chuẩn" : index < 8 ? "3/4 ý chuẩn" : "2/4 ý chuẩn",
      essay: `Hồ sơ thừa thiếu gồm 4 điểm: 1. Trình Chủ tịch UBND xã (không phải tập thể UBND xã) quyết định tiêu chuẩn định mức. 2. Không trình UBND xã phê duyệt chủ trương (thuộc thẩm quyền người đứng đầu đơn vị cấp I theo QĐ 80/2026/QĐ-UBND). 3. Thừa bước thẩm định KHLCNT. 4. Thay QĐ chỉ định thầu bằng QĐ phê duyệt kết quả KQLCNT. (Bài làm mẫu học viên ${name})`,
      matchedItems: [
        { label: "Ý 1: Trình Chủ tịch UBND xã (không phải UBND xã) quyết định tiêu chuẩn định mức", matched: true },
        { label: "Ý 2: Thừa bước trình UBND xã phê duyệt chủ trương và dự kiến kinh phí", matched: index < 8 },
        { label: "Ý 3: Thừa bước thẩm định kế hoạch lựa chọn nhà thầu", matched: index < 6 },
        { label: "Ý 4: Thay 'QĐ chỉ định thầu' bằng 'QĐ phê duyệt KQLCNT'", matched: index < 4 }
      ],
      referenceAnswer: "1. Trình Chủ tịch UBND xã quyết định tiêu chuẩn định mức.\n2. Không trình UBND xã phê duyệt chủ trương.\n3. Thừa thẩm định KHLCNT.\n4. Thay QĐ chỉ định thầu bằng QĐ phê duyệt KQLCNT.",
      aiFeedback: index < 2 ? "Xuất sắc! Phát hiện đầy đủ 4 lỗi sai và điểm thừa thiếu trong hồ sơ mua sắm màn hình LED." : "Phát hiện đúng các lỗi trọng yếu về thủ tục đấu thầu.",
      criticalErrors: 0
    }));
  } else if (session.id === 6) {
    session.topParticipants = names.map((name, index) => ({
      rank: index + 1,
      name,
      unit: sampleUnits[index],
      position: samplePositions[index],
      submittedAt: new Date(Date.UTC(2026, 7, 31, 8, 22, 10 + index * 8)).toISOString(),
      scoreChoice: "70/70",
      scoreExplanation: `${7 - Math.floor(index / 3)}/7 giải thích đạt`,
      aiFeedback: index < 3 ? "Xuất sắc! Đúng 7/7 câu và cả 7 lời giải thích đều viện dẫn đúng căn cứ tiêu chuẩn định mức." : "Lựa chọn Đúng/Sai đạt điểm tuyệt đối 70/70.",
      questionDetails: [
        { number: 1, title: "Bí thư Đảng ủy xã...", userChoice: "Sai", correctChoice: "Sai", isChoiceCorrect: true, userExplanation: "Bí thư xã chỉ được 1 máy xách tay max 25 triệu và 1 máy để bàn max 20 triệu.", referenceNote: "Sai: Bí thư chỉ được 1 máy xách tay (max 25tr) và 1 máy để bàn (max 20tr).", explanationMatched: true },
        { number: 2, title: "Phòng làm việc...", userChoice: "Sai", correctChoice: "Sai", isChoiceCorrect: true, userExplanation: "Phòng không quá 3 người chỉ được 1 máy in tối đa 13 triệu.", referenceNote: "Sai: Mỗi phòng <= 3 người chỉ được 1 máy in max 13tr.", explanationMatched: true },
        { number: 3, title: "Mức giá máy tính...", userChoice: "Đúng", correctChoice: "Đúng", isChoiceCorrect: true, userExplanation: "Mức giá max 20 triệu chưa bao gồm bản quyền phần mềm.", referenceNote: "Đúng: Giá max 20 triệu chưa bao gồm bản quyền.", explanationMatched: true },
        { number: 4, title: "Điều hòa nhiệt độ...", userChoice: "Sai", correctChoice: "Sai", isChoiceCorrect: true, userExplanation: "Điều hòa là thiết bị chung, phải trình Chủ tịch UBND xã quyết định.", referenceNote: "Sai: Thiết bị chung, trình Chủ tịch UBND xã.", explanationMatched: index < 8 },
        { number: 5, title: "Màn hình LED...", userChoice: "Sai", correctChoice: "Sai", isChoiceCorrect: true, userExplanation: "Màn hình LED hội trường là thiết bị chung, trình Chủ tịch UBND xã.", referenceNote: "Sai: Thiết bị chung, trình Chủ tịch UBND xã.", explanationMatched: index < 6 },
        { number: 6, title: "Máy chiếu lớp học...", userChoice: "Sai", correctChoice: "Sai", isChoiceCorrect: true, userExplanation: "Máy chiếu lớp học là thiết bị chuyên dùng, trình Sở GD&ĐT.", referenceNote: "Sai: Thiết bị chuyên dùng, trình Sở GD&ĐT.", explanationMatched: index < 4 },
        { number: 7, title: "Bàn ghế lớp học...", userChoice: "Đúng", correctChoice: "Đúng", isChoiceCorrect: true, userExplanation: "Không đủ tiêu chuẩn tài sản cố định thì thủ trưởng đơn vị quyết định.", referenceNote: "Đúng: Nếu không đủ TSCĐ thì thủ trưởng đơn vị quyết định.", explanationMatched: true }
      ]
    }));
  }
}

for (const session of payload.sessions) {
  if (quizProfiles[session.id]) applyQuiz(session, quizProfiles[session.id]);
  else if (session.id === 2) applyOrdering(session);
  else if (session.id === 6) applyTrueFalse(session);
  else if (openResponses[session.id]) {
    session.totalResponses = DEMO_TOTAL_RESPONSES;
    session.participatingUnits = sampleUnits.length;
    session.scoreStats = { count: 0, distribution: [], mode: "Không chấm tự động" };
    session.responses = openResponses[session.id];
    session.liveResponses = session.responses.slice(0, 10);
  }
  const unitCount = Math.min(Number(session.participatingUnits || 0), sampleUnits.length);
  const unitCounts = splitCounts(session.totalResponses, unitCount).sort((a, b) => b - a);
  session.unitBreakdown = sampleUnits.slice(0, unitCount)
    .map((unit, index) => ({ unit, count: unitCounts[index] }))
    .filter(item => item.count > 0);
  session.participatingUnits = session.unitBreakdown.length;
  session.totalUnits = sampleUnits.length + missingSampleUnits.length;
  session.missingUnits = missingSampleUnits.slice();
  session.unmappedUnitResponses = 0;
  session.phase = "CLOSED";
  session.closedAt = "2026-08-31T09:30:00.000Z";
  session.timerStartedAt = null;
  session.timerEndsAt = null;
  session.currentResponses = session.totalResponses;
  session.lateResponses = 0;
  applyLeaderboard(session);
  applyTopParticipants(session);
}

payload.version = 7;
payload.fake = true;
payload.updatedAt = new Date().toISOString();
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`Đã tạo ${outputPath}`);
