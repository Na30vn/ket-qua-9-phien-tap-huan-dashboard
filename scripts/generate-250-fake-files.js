const fs = require('fs');
const path = require('path');

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

const samplePositions = [
  "Công chức Tài chính - Kế toán",
  "Chuyên viên",
  "Kế toán trưởng",
  "Phó Chủ tịch UBND",
  "Chủ tịch UBND",
  "Trưởng phòng Tài chính",
  "Phó Trưởng phòng Tài chính",
  "Công chức Văn phòng - Thống kê",
  "Công chức Địa chính - Xây dựng",
  "Phó Chủ tịch HĐND"
];

const hoList = ["Nguyễn", "Trần", "Lê", "Phạm", "Vũ", "Hoàng", "Phan", "Bùi", "Đặng", "Đỗ", "Hồ", "Ngo", "Dương", "Đinh", "Trương"];
const demList = ["Văn", "Thị", "Quốc", "Nhật", "Thanh", "Hoài", "Tuấn", "Minh", "Đức", "Ngọc", "Hồng", "Anh", "Quang", "Đình", "Hữu"];
const tenList = ["Anh", "Bảo", "Chi", "Dũng", "Em", "Giang", "Hà", "Hùng", "Hải", "Khánh", "Linh", "Mai", "Nam", "Nga", "Phong", "Phúc", "Quân", "Sơn", "Tú", "Thảo", "Trinh", "Tùng", "Vinh", "Yến", "Đạt"];

function generateNames(count) {
  const names = [];
  let index = 0;
  while (names.length < count) {
    const ho = hoList[index % hoList.length];
    const dem = demList[Math.floor(index / hoList.length) % demList.length];
    const ten = tenList[Math.floor(index / (hoList.length * demList.length)) % tenList.length];
    const suffix = Math.floor(index / (hoList.length * demList.length * tenList.length));
    const fullName = suffix === 0 ? `${ho} ${dem} ${ten}` : `${ho} ${dem} ${ten} ${suffix + 1}`;
    names.push(fullName);
    index++;
  }
  return names;
}

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}

const choicesQ1 = [
  "Thu từ quỹ phòng, chống thiên tai được phân bổ cho Uỷ ban nhân dân cấp xã", // Correct
  "Lệ phí do các cơ quan nhà nước thuộc cấp xã thực hiện thu",
  "Tiền thu từ xử phạt vi phạm hành chính, xử phạt khác theo quy định của pháp luật do các cơ quan nhà nước cấp xã thực hiện",
  "Thu từ quỹ đất công ích và thu hoa lợi công sản khác"
];

const choicesQ2 = [
  "Phí thu từ các hoạt động dịch vụ do cơ quan nhà nước cấp xã thực hiện phải nộp vào ngân sách nhà nước, trường hợp được khoán chi phí hoạt động từ nguồn thu phí thì được khấu trừ theo tỷ lệ xác định quy định; phần còn lại (nếu có) nộp ngân sách nhà nước", // Correct
  "Tổ chức thu lệ phí phải nộp đầy đủ, kịp thời số tiền lệ phí thu được vào ngân sách nhà nước",
  "Tổ chức thu phí, lệ phí thực hiện lập và cấp chứng từ thu phí, lệ phí cho người nộp phí, lệ phí theo quy định của Chính phủ về hóa đơn, chứng từ và thủ tục hành chính thuộc lĩnh vực Kho bạc Nhà nước",
  "Người nộp phí, lệ phí thực hiện khai (nếu có), nộp phí, lệ phí theo tháng, quý, năm hoặc theo từng lần phát sinh"
];

const choicesQ3 = [
  "Xây dựng dự toán ngân sách cấp xã đảm bảo dự phòng ngân sách đạt 2% tổng chi ngân sách cấp xã (bao gồm chi bổ sung có mục tiêu từ ngân sách cấp trên)", // Correct
  "Dự toán thu phải thể hiện đầy đủ các khoản thu, sát khả năng thực tế",
  "Dự toán ngân sách nhà nước phải tổng hợp theo từng khoản thu, chi và theo cơ cấu chi đầu tư phát triển, chi thường xuyên, dự phòng ngân sách",
  "Dự toán chi đầu tư phát triển được lập trên cơ sở trên cơ sở kế hoạch đầu tư trung hạn nguồn ngân sách nhà nước khả năng cân đối các nguồn lực trong năm dự toán, quy định của pháp luật"
];

const choicesQ4 = [
  "Chi hỗ trợ hoạt động thường xuyên cho các đơn vị thuộc cấp tỉnh quản lý đóng trên địa bàn", // Correct
  "Chi phòng, chống, khắc phục hậu quả thiên tai, thảm họa, dịch bệnh, cứu đói",
  "Chi cho nhiệm vụ quan trọng về quốc phòng, an ninh",
  "Chi cho các nhiệm vụ cần thiết thuộc nhiệm vụ chi của ngân sách cấp xã mà chưa được dự toán"
];

const choicesQ5 = [
  "Uỷ ban nhân dân cấp xã", // Correct
  "Hội đồng nhân dân cấp xã",
  "Thường trực Hội đồng nhân dân cấp xã",
  "Cơ quan tài chính cấp xã"
];

const choicesQ6 = [
  "Cơ quan tài chính cấp xã", // Correct
  "Cơ quan cấp trên",
  "Kho bạc nhà nước",
  "Thanh tra tài chính"
];

// Correct sequence for Session 2
const correctSeq = ["3", "5", "1", "6", "4", "11", "9", "8", "10", "13", "2", "12", "7"];

// Essay variations for Session 3
const essayTemplates = [
  "Đơn vị Uỷ ban nhân dân xã A thực hiện công khai ngân sách cấp xã chưa đầy đủ theo quy định tại Thông tư 343/2016/TT-BTC. Cụ thể: 1. Chưa công khai số liệu và thuyết minh dự toán ngân sách cấp xã trình Hội đồng nhân dân cấp xã. 2. Thiếu công khai thuyết minh quyết toán ngân sách cấp xã đã được Hội đồng nhân dân phê chuẩn. 3. Tình hình thực hiện dự toán ngân sách mới chỉ công khai theo năm, thiếu báo cáo mốc 03 tháng, 06 tháng, 09 tháng theo Mẫu số 03/CKNS-SCX.",
  "Qua rà soát hồ sơ công khai tài chính của xã, phát hiện các điểm tồn tại sau: Thứ nhất, chưa thực hiện công khai thuyết minh dự toán ngân sách xã khi trình HĐND. Thứ hai, báo cáo quyết toán chưa đính kèm thuyết minh giải trình tình hình thu chi ngân sách đã được HĐND thông qua. Thứ ba, việc công khai tình hình thực hiện dự toán định kỳ bị gộp chung theo quý thay vì đúng các mốc thời gian quy định 3, 6, 9 tháng và cả năm.",
  "Đánh giá việc tuân thủ công khai ngân sách xã: Đơn vị đã niêm yết biểu mẫu nhưng chưa đạt yêu cầu về nội dung và thời hạn. 1) Thiếu bản thuyết minh dự toán ngân sách cấp xã trình HĐND cấp xã; 2) Thiếu công khai thuyết minh quyết toán ngân sách xã đã phê chuẩn; 3) Mốc công khai thực hiện dự toán chưa bảo đảm định kỳ 03 tháng, 06 tháng, 09 tháng và cả năm theo biểu mẫu số 03.",
  "Nội dung công khai ngân sách cấp xã còn 3 vướng mắc chính: (1) Số liệu dự toán trình HĐND xã chưa có thuyết minh chi tiết kèm theo; (2) Quyết toán ngân sách xã sau khi phê chuẩn thiếu nội dung thuyết minh thu chi; (3) Tình hình thực hiện dự toán ngân sách địa phương chưa đăng tải đúng mốc 3 tháng, 6 tháng và 9 tháng theo quy định.",
  "Theo quy định hiện hành về công khai ngân sách cấp xã, UBND xã cần khắc phục ngay các thiếu sót: Bổ sung thuyết minh dự toán ngân sách trình HĐND; Bổ sung thuyết minh quyết toán ngân sách xã được HĐND phê chuẩn; Đảm bảo niêm yết công khai tình hình thực hiện dự toán ngân sách cấp xã đủ 4 mốc: 3 tháng, 6 tháng, 9 tháng và cả năm (theo Mẫu 03)."
];

function generateDataFiles() {
  const outputDir = path.join(__dirname, '..', 'data-fake-250');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const names = generateNames(250);
  const baseTime = new Date('2026-08-31T08:00:00Z');

  // --- PHIÊN 1: 250 bản ghi ---
  const p1Headers = [
    "Timestamp",
    "Họ và tên Anh/Chị",
    "Chức vụ/Vị trí công tác",
    "Đơn vị công tác",
    "Câu 1: Trong phân cấp ngân sách địa phương, khoản thu nào sau đây không thuộc nguồn thu ngân sách cấp xã:",
    "Câu 2: Yêu cầu nào sau đây không đúng khi quản lý thu phí, lệ phí:",
    "Câu 3: Yêu cầu nào là không đúng khi lập dự toán ngân sách cấp xã:",
    "Câu 4: Nội dung nào dưới đây không đúng về sử dụng dự phòng ngân sách cấp huyện:",
    "Câu 5: Thẩm quyền quyết định sử dụng dự phòng ngân sách cấp xã:",
    "Câu 6: Cơ quan nào có quyền tạm đình chỉ chi ngân sách của các cơ quan, tổ chức, đơn vị dự toán ngân sách cấp xã khi không chấp hành đúng chế độ báo cáo kế toán, quyết toán, báo cáo tài chính khác và chịu trách nhiệm về quyết định của mình:",
    "Score"
  ];

  const p1Rows = [p1Headers.join('\t')];
  names.forEach((name, i) => {
    const timestamp = formatDate(new Date(baseTime.getTime() + i * 45000));
    const unit = sampleUnits[i % sampleUnits.length];
    const position = samplePositions[i % samplePositions.length];

    // High score bias for top participants
    const isTop = i < 15;
    const isGood = i < 150;

    const q1 = isGood ? choicesQ1[0] : choicesQ1[i % 4];
    const q2 = isGood ? choicesQ2[0] : choicesQ2[(i + 1) % 4];
    const q3 = isGood ? choicesQ3[0] : choicesQ3[(i + 2) % 4];
    const q4 = isGood ? choicesQ4[0] : choicesQ4[(i + 3) % 4];
    const q5 = isTop ? choicesQ5[0] : choicesQ5[i % 4];
    const q6 = isTop ? choicesQ6[0] : choicesQ6[(i + 1) % 4];

    let correctCount = 0;
    if (q1 === choicesQ1[0]) correctCount++;
    if (q2 === choicesQ2[0]) correctCount++;
    if (q3 === choicesQ3[0]) correctCount++;
    if (q4 === choicesQ4[0]) correctCount++;
    if (q5 === choicesQ5[0]) correctCount++;
    if (q6 === choicesQ6[0]) correctCount++;

    const score = `${correctCount * 10} / 60`;
    p1Rows.push([timestamp, name, position, unit, q1, q2, q3, q4, q5, q6, score].join('\t'));
  });

  fs.writeFileSync(path.join(outputDir, 'phien_1_fake_250.tsv'), p1Rows.join('\n'), 'utf8');

  // --- PHIÊN 2: 250 bản ghi ---
  const p2Headers = [
    "Timestamp",
    "Họ và tên Anh/Chị",
    "Chức vụ/Vị trí công tác",
    "Đơn vị công tác",
    "Sắp xếp các hoạt động theo quy trình quản lý ngân sách cấp xã, theo thời gian:",
    "Score"
  ];

  const p2Rows = [p2Headers.join('\t')];
  names.forEach((name, i) => {
    const timestamp = formatDate(new Date(baseTime.getTime() + i * 50000));
    const unit = sampleUnits[(i + 5) % sampleUnits.length];
    const position = samplePositions[(i + 3) % samplePositions.length];

    let seq = correctSeq.slice();
    if (i >= 5 && i < 50) {
      // 1 swap
      const temp = seq[2]; seq[2] = seq[3]; seq[3] = temp;
    } else if (i >= 50 && i < 150) {
      // 2 swaps
      const temp1 = seq[1]; seq[1] = seq[4]; seq[4] = temp1;
      const temp2 = seq[8]; seq[8] = seq[10]; seq[10] = temp2;
    } else if (i >= 150) {
      // random shuffle a bit
      seq = ["1","2","3","4","5","6","7","8","9","10","11","12","13"];
    }

    const seqStr = seq.join(',');
    let correctCount = 0;
    seq.forEach((val, idx) => { if (val === correctSeq[idx]) correctCount++; });
    const score = `${correctCount} / 13`;

    p2Rows.push([timestamp, name, position, unit, seqStr, score].join('\t'));
  });

  fs.writeFileSync(path.join(outputDir, 'phien_2_fake_250.tsv'), p2Rows.join('\n'), 'utf8');

  // --- PHIÊN 3: 250 bản ghi ---
  const p3Headers = [
    "Timestamp",
    "Họ và tên Anh/Chị",
    "Chức vụ/Vị trí công tác",
    "Đơn vị công tác",
    "Tình huống công khai ngân sách cấp xã"
  ];

  const p3Rows = [p3Headers.join('\t')];
  names.forEach((name, i) => {
    const timestamp = formatDate(new Date(baseTime.getTime() + i * 60000));
    const unit = sampleUnits[(i + 10) % sampleUnits.length];
    const position = samplePositions[(i + 6) % samplePositions.length];
    const essay = essayTemplates[i % essayTemplates.length];

    p3Rows.push([timestamp, name, position, unit, essay].join('\t'));
  });

  fs.writeFileSync(path.join(outputDir, 'phien_3_fake_250.tsv'), p3Rows.join('\n'), 'utf8');

  console.log('Successfully generated 3 data files in data-fake-250/ directory!');
}

generateDataFiles();
