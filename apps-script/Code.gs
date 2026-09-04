const CACHE_SECONDS = 5;
const MAX_PUBLIC_TEXT_RESPONSES = 40;
const MAX_LIVE_RESPONSES = 10;
const MAX_EXPLANATIONS_PER_CHOICE = 5;
const CONTROL_SHEET_NAME = '_DASHBOARD_CONTROL';

const SESSION_FORM_IDS = {
  1: '1Y-hWQ48BD7oY5fPDXXQOBSZYq2tCoVTG3CUv2swJirk',
  2: '1FUPYBBfxv_4hHHC8RuyatvgmJXhM6bcZz98wElmn6Q4',
  3: '107cKSnhSdvMStJPiqi5lTW9jg1Va5LkfgtgUfzMIe1I',
  4: '1nRp8sFbzi-z-sJtWbfkC26h2TbBpVl6zN2d997KaRvU',
  5: '1RQ5AjKgzUPkGXDay8N9rmLmyz7ObbFp0rNMqFVwnhE4',
  6: '1NAGUw2Eebr2DkoobCXHn-e0bNJmzIfjQoWLr4VjdllU',
  7: '1iGTpKxlI_ksXtUoKv0Ir3toXRUs0O9_sRVXSfspG5zw',
  8: '1q2-8J9OxKcAHIBz6CWpQGTVyXxEuaqMzELhoWf7-LWk',
  9: '1w65HrpYrgI9RX2iYEu7jz57ka0TIG-CCJzJ8rcPBZ-4'
};

const SESSION_PROMPTS = {
  2: {
    label: 'ĐỀ BÀI SẮP XẾP',
    title: 'Sắp xếp các hoạt động theo quy trình quản lý ngân sách cấp xã, theo thời gian:',
    items: [
      'Cơ quan tài chính cấp xã tổng hợp, cân đối, lập dự toán ngân sách cấp xã, phương án phân bổ dự toán ngân sách cấp xã, báo cáo Ủy ban nhân dân cấp xã.',
      'Cơ quan tài chính cấp xã tổng hợp quyết toán năm của các đơn vị dự toán cấp I thuộc ngân sách cấp mình, trình Ủy ban nhân dân cấp xã.',
      'Cơ quan thu lập dự toán các khoản thu ngân sách.',
      'Sau khi có ý kiến của Thường trực Hội đồng nhân dân cấp xã, Ủy ban nhân dân cấp xã gửi dự toán thu ngân sách nhà nước trên địa bàn, dự toán thu, chi ngân sách cấp xã đến Ủy ban nhân dân cấp tỉnh và Sở Tài chính.',
      'Các đơn vị sử dụng ngân sách, đơn vị dự toán lập dự toán thu, chi của đơn vị.',
      'Ủy ban nhân dân cấp xã trình Thường trực Hội đồng nhân dân cấp xã xem xét cho ý kiến trước khi báo cáo Sở Tài chính.',
      'Hội đồng nhân dân cấp xã xem xét, phê chuẩn báo cáo quyết toán ngân sách cấp mình trước ngày 31 tháng 3 năm sau, gửi Ủy ban nhân dân cấp tỉnh chậm nhất sau 05 ngày làm việc kể từ ngày báo cáo quyết toán được phê chuẩn.',
      'Các đơn vị sử dụng ngân sách lập hồ sơ đề nghị chi gửi Kho bạc Nhà nước để thanh toán hoặc tạm ứng theo quy định.',
      'Chậm nhất sau 05 ngày làm việc kể từ ngày Hội đồng nhân dân cấp xã quyết định dự toán ngân sách, Ủy ban nhân dân cấp xã giao dự toán thu, chi ngân sách cho từng cơ quan, đơn vị trực thuộc, đồng thời báo cáo Sở Tài chính về dự toán ngân sách đã được Hội đồng nhân dân cấp xã quyết định và Ủy ban nhân dân cấp xã giao.',
      'Điều chỉnh dự toán ngân sách cấp xã hằng năm (nếu có).',
      'Chậm nhất sau 10 ngày kể từ ngày Hội đồng nhân dân cấp tỉnh quyết định dự toán và phân bổ ngân sách, căn cứ quyết định giao dự toán ngân sách của Ủy ban nhân dân cấp tỉnh, Hội đồng nhân dân cấp xã quyết định dự toán thu ngân sách nhà nước trên địa bàn, thu, chi ngân sách cấp xã và phân bổ dự toán ngân sách cấp xã.',
      'Ủy ban nhân dân cấp xã lập quyết toán thu ngân sách nhà nước trên địa bàn và quyết toán thu, chi ngân sách cấp xã báo cáo Thường trực Hội đồng nhân dân cùng cấp cho ý kiến trước ngày 10 tháng 3 năm sau và tiếp thu, hoàn chỉnh để trình Hội đồng nhân dân cùng cấp xem xét, phê chuẩn, đồng thời gửi Sở Tài chính.',
      'Các đơn vị được giao dự toán ngân sách khoá sổ, lập quyết toán thu, chi ngân sách nhà nước của đơn vị mình gửi cơ quan tài chính cấp xã để kiểm tra tính đầy đủ, khớp đúng giữa các số liệu quyết toán với xác nhận của KBNN.'
    ],
    instruction: 'Nhập các số thứ tự cách nhau bằng dấu phẩy và không cần dấu cách (ví dụ: 1,2,3,4,...).'
  },
  3: {
    label: 'TÌNH HUỐNG',
    title: 'Xã A thực hiện công khai ngân sách hằng năm trên Cổng thông tin điện tử của xã, gồm các nội dung sau:',
    items: [
      'Công khai dự toán ngân sách cấp xã được Hội đồng nhân dân cấp xã quyết định, cụ thể: Công khai số liệu dự toán ngân sách cấp xã và kế hoạch hoạt động tài chính khác ở cấp xã, gồm các chỉ tiêu: dự toán cân đối ngân sách cấp xã; dự toán thu ngân sách nhà nước trên địa bàn, thu ngân sách xã được hưởng theo phân cấp; số bổ sung cân đối, số bổ sung có mục tiêu từ ngân sách cấp tỉnh cho ngân sách cấp xã; dự toán chi ngân sách cấp xã theo lĩnh vực và chi tiết cho từng cơ quan, đơn vị.',
      'Công khai tình hình thực hiện dự toán ngân sách cấp xã (hàng quý), gồm các chỉ tiêu: đánh giá cân đối ngân sách cấp xã; đánh giá thực hiện thu ngân sách cấp xã theo lĩnh vực; đánh giá thực hiện chi ngân sách cấp xã theo lĩnh vực.',
      'Công khai số liệu quyết toán ngân sách cấp xã được Hội đồng nhân dân cấp xã phê chuẩn, thông qua, gồm các chỉ tiêu: quyết toán cân đối ngân sách cấp xã; quyết toán thu ngân sách nhà nước trên địa bàn, thu ngân sách cấp xã được hưởng theo phân cấp; số bổ sung cân đối từ ngân sách cấp tỉnh cho ngân sách cấp xã; quyết toán chi ngân sách cấp xã theo lĩnh vực và chi tiết cơ quan, đơn vị và chi tiết kết quả các hoạt động tài chính khác của cấp xã.'
    ],
    question: 'Nội dung công khai của xã A đã đảm bảo theo quy định hiện hành chưa? Cần bổ sung gì?'
  },
  5: {
    label: 'TÌNH HUỐNG',
    title: 'Theo khoản 1 Điều 3 Thông tư số 59/2026/TT-BTC ngày 29/05/2026 về xét duyệt và tổng hợp quyết toán năm:',
    paragraphs: ['“Điều 3. Quy trình xét duyệt và tổng hợp quyết toán năm: 1. Đơn vị dự toán cấp trên trực tiếp, đơn vị giao dự toán, đơn vị dự toán cấp I (trường hợp là đơn vị dự toán cấp trên trực tiếp của đơn vị sử dụng ngân sách) thực hiện xét duyệt, thông báo xét duyệt quyết toán đối với đơn vị sử dụng ngân sách thuộc phạm vi quản lý, đơn vị được giao dự toán theo quy định tại Điều 4 Thông tư này.”'],
    question: 'Theo quy định nêu trên thì Ủy ban nhân dân xã, phường có phải thực hiện xét duyệt, thông báo xét duyệt quyết toán đối với đơn vị sử dụng ngân sách thuộc phạm vi quản lý (các Phòng chuyên môn, đơn vị sự nghiệp trực thuộc) hay không?'
  },
  7: {
    label: 'TÌNH HUỐNG',
    title: 'Hồ sơ mua máy phát điện trị giá 20 triệu đồng tại Văn phòng HĐND-UBND xã, từ nguồn ngân sách cấp xã, gồm:',
    items: [
      'Đề nghị mua máy phát điện của chuyên viên A trình Trưởng phòng Kinh tế duyệt (đồng ý và giao cho chuyên viên A triển khai nội dung này).',
      'Chuyên viên A lập dự toán mua máy phát điện (chủng loại, số lượng, giá dự toán, nguồn kinh phí) trình Trưởng phòng Kinh tế duyệt.',
      'Tờ trình UBND xã phê duyệt chủ trương và dự kiến kinh phí; UBND xã ra Quyết định phê duyệt chủ trương và dự kiến kinh phí mua sắm tài sản, trang thiết bị.',
      'Hóa đơn tài chính.',
      'Giấy đề nghị thanh toán được Trưởng phòng Kinh tế duyệt chi.',
      'Giấy rút dự toán.'
    ],
    question: 'Hồ sơ mua sắm này thừa, thiếu gì?'
  },
  8: {
    label: 'TÌNH HUỐNG',
    title: 'Hồ sơ mua màn hình LED tại Hội trường trị giá 70 triệu đồng tại Văn phòng HĐND-UBND xã, từ nguồn ngân sách cấp xã, gồm:',
    items: [
      'Đề nghị mua màn hình LED của chuyên viên A trình Chánh Văn phòng HĐND-UBND xã duyệt (đồng ý và giao cho chuyên viên A triển khai nội dung này).',
      'Thư mời gửi nhà thầu; báo giá của nhà thầu.',
      'Chuyên viên A lập dự toán mua màn hình LED (chủng loại, số lượng, giá dự toán, nguồn kinh phí) trình Chánh Văn phòng HĐND-UBND xã duyệt.',
      'Tờ trình UBND xã phê duyệt chủ trương và dự kiến kinh phí và quyết định tiêu chuẩn định mức máy móc thiết bị.',
      'Tờ trình kế hoạch lựa chọn nhà thầu.',
      'Thẩm định kế hoạch lựa chọn nhà thầu.',
      'Trình UBND ra Quyết định phê duyệt kế hoạch lựa chọn nhà thầu.',
      'Thư mời gửi nhà thầu đính kèm Dự thảo Hợp đồng mua sắm.',
      'Biên bản thương thảo hoàn thiện hợp đồng.',
      'Tờ trình đề nghị phê duyệt kết quả lựa chọn nhà thầu.',
      'Quyết định chỉ định thầu.',
      'Hợp đồng, Biên bản nghiệm thu, Thanh lý hợp đồng.',
      'Hóa đơn tài chính.',
      'Giấy đề nghị thanh toán trình Chánh Văn phòng HĐND-UBND xã duyệt chi.',
      'Giấy rút dự toán.'
    ],
    question: 'Hồ sơ mua sắm này thừa, thiếu gì?'
  }
};

const SESSION_CONFIG = [
  { id: 1, name: 'Phiên 1', kind: 'quiz', typeLabel: 'Trắc nghiệm 6 câu', description: 'Phân cấp nguồn thu, nhiệm vụ chi ngân sách xã', formId: '1Y-hWQ48BD7oY5fPDXXQOBSZYq2tCoVTG3CUv2swJirk', scoreIndex: 1, questionIndexes: [4,5,6,7,8,9], pointsPerQuestion: 10, correctAnswers: [
    'Thu từ quỹ phòng, chống thiên tai được phân bổ cho Uỷ ban nhân dân cấp xã',
    'Phí thu từ các hoạt động dịch vụ do cơ quan nhà nước cấp xã thực hiện phải nộp vào ngân sách nhà nước, trường hợp được khoán chi phí hoạt động từ nguồn thu phí thì được khấu trừ theo tỷ lệ xác định quy định; phần còn lại (nếu có) nộp ngân sách nhà nước',
    'Xây dựng dự toán ngân sách cấp xã đảm bảo dự phòng ngân sách đạt 2% tổng chi ngân sách cấp xã (bao gồm chi bổ sung có mục tiêu từ ngân sách cấp trên)',
    'Chi hỗ trợ hoạt động thường xuyên cho các đơn vị thuộc cấp tỉnh quản lý đóng trên địa bàn',
    'Uỷ ban nhân dân cấp xã',
    'Cơ quan tài chính cấp xã'
  ], choices: [
    [
      'Lệ phí do các cơ quan nhà nước thuộc cấp xã thực hiện thu',
      'Tiền thu từ xử phạt vi phạm hành chính, xử phạt khác theo quy định của pháp luật do các cơ quan nhà nước cấp xã thực hiện',
      'Thu từ quỹ phòng, chống thiên tai được phân bổ cho Uỷ ban nhân dân cấp xã',
      'Thu từ quỹ đất công ích và thu hoa lợi công sản khác'
    ],
    [
      'Tổ chức thu lệ phí phải nộp đầy đủ, kịp thời số tiền lệ phí thu được vào ngân sách nhà nước',
      'Tổ chức thu phí, lệ phí thực hiện lập và cấp chứng từ thu phí, lệ phí cho người nộp phí, lệ phí theo quy định của Chính phủ về hóa đơn, chứng từ và thủ tục hành chính thuộc lĩnh vực Kho bạc Nhà nước',
      'Phí thu từ các hoạt động dịch vụ do cơ quan nhà nước cấp xã thực hiện phải nộp vào ngân sách nhà nước, trường hợp được khoán chi phí hoạt động từ nguồn thu phí thì được khấu trừ theo tỷ lệ xác định quy định; phần còn lại (nếu có) nộp ngân sách nhà nước',
      'Người nộp phí, lệ phí thực hiện khai (nếu có), nộp phí, lệ phí theo tháng, quý, năm hoặc theo từng lần phát sinh'
    ],
    [
      'Dự toán thu phải thể hiện đầy đủ các khoản thu, sát khả năng thực tế',
      'Dự toán ngân sách nhà nước phải tổng hợp theo từng khoản thu, chi và theo cơ cấu chi đầu tư phát triển, chi thường xuyên, dự phòng ngân sách',
      'Dự toán chi đầu tư phát triển được lập trên cơ sở trên cơ sở kế hoạch đầu tư trung hạn nguồn ngân sách nhà nước khả năng cân đối các nguồn lực trong năm dự toán, quy định của pháp luật',
      'Xây dựng dự toán ngân sách cấp xã đảm bảo dự phòng ngân sách đạt 2% tổng chi ngân sách cấp xã (bao gồm chi bổ sung có mục tiêu từ ngân sách cấp trên)'
    ],
    [
      'Chi phòng, chống, khắc phục hậu quả thiên tai, thảm họa, dịch bệnh, cứu đói',
      'Chi cho nhiệm vụ quan trọng về quốc phòng, an ninh',
      'Chi cho các nhiệm vụ cần thiết thuộc nhiệm vụ chi của ngân sách cấp xã mà chưa được dự toán',
      'Chi hỗ trợ hoạt động thường xuyên cho các đơn vị thuộc cấp tỉnh quản lý đóng trên địa bàn'
    ],
    ['Uỷ ban nhân dân cấp xã', 'Hội đồng nhân dân cấp xã', 'Thường trực Hội đồng nhân dân cấp xã', 'Cơ quan tài chính cấp xã'],
    ['Cơ quan cấp trên', 'Cơ quan tài chính cấp xã', 'Kho bạc nhà nước', 'Thanh tra tài chính']
  ] },
  { id: 2, name: 'Phiên 2', kind: 'ordering', typeLabel: 'Sắp xếp thứ tự', description: 'Quy trình quản lý ngân sách cấp xã', prompt: SESSION_PROMPTS[2], scoreIndex: 4, answerIndex: 3, answerHeaderPattern: /^Sắp xếp các hoạt động/i, correctSequence: '3, 5, 1, 6, 4, 11, 9, 8, 10, 13, 2, 12, 7' },
  { id: 3, name: 'Phiên 3', kind: 'open', typeLabel: 'Tình huống tự luận', description: 'Công khai ngân sách cấp xã', prompt: SESSION_PROMPTS[3], scoreIndex: 4, answerIndex: 3, answerHeaderPattern: /^(Tình huống|Câu trả lời)/i, referenceAnswer: [
    'Thiếu công khai số liệu và thuyết minh dự toán ngân sách cấp xã trình Hội đồng nhân dân cấp xã.',
    'Thiếu công khai thuyết minh quyết toán ngân sách cấp xã đã được Hội đồng nhân dân cấp xã phê chuẩn, gồm kết quả thu và kết quả chi ngân sách cấp xã.',
    'Tình hình thực hiện dự toán phải công khai theo các mốc 03 tháng, 06 tháng, 09 tháng và năm; không ghi chung là hàng quý.'
  ] },
  { id: 4, name: 'Phiên 4', kind: 'quiz', typeLabel: 'Trắc nghiệm 9 câu', description: 'Điều hành ngân sách xã và quyết toán ngân sách xã', formId: '1nRp8sFbzi-z-sJtWbfkC26h2TbBpVl6zN2d997KaRvU', scoreIndex: 1, questionIndexes: [2,3,4,5,6,7,8,9,10], pointsPerQuestion: 10, correctAnswers: [
    'B. Bổ sung kinh phí hoạt động thường xuyên cho các cơ quan, tổ chức, đơn vị dự toán ngân sách cấp xã',
    'C. Ủy ban nhân dân cấp xã quyết định sử dụng số tăng thu so với dự toán, dự toán chi còn lại của ngân sách cấp xã và báo cáo Thường trực Hội đồng nhân dân cấp xã kết quả thực hiện, báo cáo Hội đồng nhân dân cấp xã tại kỳ họp gần nhất',
    'C. Trước ngày 31 tháng 12 năm trước',
    'B. Số quyết toán thu ngân sách nhà nước là số thu đã thực nộp và số thu đã hạch toán thu ngân sách nhà nước theo quy định. Các khoản thu thuộc ngân sách các năm trước nộp ngân sách năm sau phải hạch toán vào thu ngân sách năm trước',
    'A. Các khoản dự toán được Ủy ban nhân dân các cấp bổ sung sau ngày 30 tháng 9 năm thực hiện dự toán đã hết nhiệm vụ chi',
    'C. 31 tháng 01 năm sau',
    'B. Hết thời gian chỉnh lý quyết toán ngân sách, các khoản được ngân sách thành phố cấp kinh phí bổ sung có mục tiêu còn thừa, đã hết nhiệm vụ chi được chuyển nguồn, không phải nộp trả',
    'D. Kể từ ngày báo cáo quyết toán thu ngân sách nhà nước trên địa bàn và quyết toán thu, chi ngân sách cấp xã được phê chuẩn gửi Ủy ban nhân dân cấp tỉnh chậm nhất sau 10 ngày làm việc',
    'B. Ngân sách thành phố hỗ trợ nhu cầu thực hiện cải cách tiền lương (bao gồm cả quỹ tiền thưởng) cho các xã theo nhu cầu (không phải báo cáo nguồn thực hiện cải cách chính sách tiền lương còn dư tại các xã, phường và đơn vị dự toán)'
  ], choices: [
    ['A. Bổ sung tăng dự phòng ngân sách trong phạm vi quy định', 'B. Bổ sung kinh phí hoạt động thường xuyên cho các cơ quan, tổ chức, đơn vị dự toán ngân sách cấp xã', 'C. Bổ sung nguồn thực hiện chính sách tiền lương', 'D. Tăng chi đầu tư một số dự án quan trọng'],
    ['A. Ủy ban nhân dân cấp xã trình Thường trực Hội đồng nhân dân cấp xã quyết định sử dụng số tăng thu so với dự toán, dự toán chi còn lại của ngân sách cấp xã.', 'B. Hội đồng nhân dân cấp xã quyết định sử dụng số tăng thu so với dự toán, dự toán chi còn lại của ngân sách cấp xã', 'C. Ủy ban nhân dân cấp xã quyết định sử dụng số tăng thu so với dự toán, dự toán chi còn lại của ngân sách cấp xã và báo cáo Thường trực Hội đồng nhân dân cấp xã kết quả thực hiện, báo cáo Hội đồng nhân dân cấp xã tại kỳ họp gần nhất', 'D. Uỷ ban nhân dân cấp xã lập phương án sử dụng số tăng thu so với dự toán, dự toán chi còn lại của ngân sách cấp xã, báo cáo Thường trực Hội đồng nhân dân cấp xã quyết định và báo cáo Hội đồng nhân dân cấp xã tại kỳ họp gần nhất'],
    ['A. Chậm nhất sau 10 ngày làm việc kể từ ngày Hội đồng nhân dân cấp xã quyết định dự toán ngân sách', 'B. Trước ngày 10 tháng 12 năm trước', 'C. Trước ngày 31 tháng 12 năm trước', 'D. Trước ngày 31 tháng 1 năm nay'],
    ['A. Số liệu quyết toán ngân sách nhà nước phải chính xác, trung thực, đầy đủ', 'B. Số quyết toán thu ngân sách nhà nước là số thu đã thực nộp và số thu đã hạch toán thu ngân sách nhà nước theo quy định. Các khoản thu thuộc ngân sách các năm trước nộp ngân sách năm sau phải hạch toán vào thu ngân sách năm trước', 'C. Số liệu quyết toán ngân sách của đơn vị sử dụng ngân sách, của chủ đầu tư và của ngân sách các cấp phải được đối chiếu, xác nhận với Kho bạc Nhà nước nơi giao dịch', 'D. Những khoản chi ngân sách nhà nước không đúng với quy định của pháp luật phải được thu hồi đầy đủ, kịp thời cho ngân sách; các khoản nộp trả ngân sách cấp trên phải nộp trả kịp thời'],
    ['A. Các khoản dự toán được Ủy ban nhân dân các cấp bổ sung sau ngày 30 tháng 9 năm thực hiện dự toán đã hết nhiệm vụ chi', 'B. Nguồn thực hiện chính sách tiền lương, phụ cấp, trợ cấp và các khoản tính theo tiền lương;', 'C. Kinh phí được giao tự chủ của các đơn vị sự nghiệp công lập và các cơ quan nhà nước', 'D. Chi mua sắm hàng hóa, dịch vụ (bao gồm thuê hàng hóa, dịch vụ), sửa chữa, cải tạo, nâng cấp, mở rộng, xây dựng mới hạng mục công trình trong các dự án đã đầu tư xây dựng, đặt hàng, giao nhiệm vụ đã đầy đủ hồ sơ, đã ký hợp đồng hoặc đã hoàn thành đấu thầu theo quy định của pháp luật về đấu thầu trước ngày 31 tháng 12 năm thực hiện dự toán'],
    ['A. 25 tháng 01 năm sau', 'B. 29 tháng 01 năm sau', 'C. 31 tháng 01 năm sau', 'D. 31 tháng 03 năm sau'],
    ['A. Hết thời gian chỉnh lý quyết toán ngân sách, các khoản dự toán chi, bao gồm cả các khoản bổ sung trong năm, chưa thực hiện, chưa chi hết hoặc hết nhiệm vụ chi phải hủy dự toán, trừ các trường hợp được chuyển nguồn sang năm sau để tiếp tục thực hiện theo quy định', 'B. Hết thời gian chỉnh lý quyết toán ngân sách, các khoản được ngân sách thành phố cấp kinh phí bổ sung có mục tiêu còn thừa, đã hết nhiệm vụ chi được chuyển nguồn, không phải nộp trả', 'C. Đến cuối ngày 31 tháng 12, số dư tài khoản tiền gửi các khoản ngân sách cấp của đơn vị dự toán mở tại Kho bạc Nhà nước được tiếp tục chi trong thời gian chỉnh lý quyết toán; hết thời gian chỉnh lý quyết toán mà vẫn còn dư thì nộp trả ngân sách nhà nước, trừ trường hợp nhiệm vụ chi được chuyển nguồn sang năm sau theo quy định', 'D. Số dư trên tài khoản tiền gửi không thuộc ngân sách nhà nước cấp, được chuyển sang năm sau sử dụng theo quy định của pháp luật có liên quan'],
    ['A. Ủy ban nhân dân cấp xã lập quyết toán thu ngân sách nhà nước trên địa bàn và quyết toán thu, chi ngân sách cấp xã báo cáo Thường trực Hội đồng nhân dân cùng cấp cho ý kiến trước ngày 10 tháng 3 năm sau', 'B. Hội đồng nhân dân cấp xã xem xét, phê chuẩn báo cáo quyết toán ngân sách cấp mình trước ngày 31 tháng 3 năm sau', 'C. Kể từ ngày báo cáo quyết toán thu ngân sách nhà nước trên địa bàn và quyết toán thu, chi ngân sách cấp xã được phê chuẩn gửi Ủy ban nhân dân cấp tỉnh chậm nhất sau 05 ngày làm việc', 'D. Kể từ ngày báo cáo quyết toán thu ngân sách nhà nước trên địa bàn và quyết toán thu, chi ngân sách cấp xã được phê chuẩn gửi Ủy ban nhân dân cấp tỉnh chậm nhất sau 10 ngày làm việc'],
    ['A. Nguồn thực hiện cải cách chính sách tiền lương được sử dụng để bảo đảm điều chỉnh mức lương cơ sở hằng năm và bảo đảm các chính sách an sinh xã hội do Trung ương ban hành (đối với ngân sách địa phương)', 'B. Ngân sách thành phố hỗ trợ nhu cầu thực hiện cải cách tiền lương (bao gồm cả quỹ tiền thưởng) cho các xã theo nhu cầu (không phải báo cáo nguồn thực hiện cải cách chính sách tiền lương còn dư tại các xã, phường và đơn vị dự toán)', 'C. Nguồn thực hiện chính sách tiền lương có thể được bổ sung từ số tăng thu so với dự toán, dự toán chi còn lại của cấp ngân sách khi kết thúc năm ngân sách', 'D. Ngân sách thành phố hỗ trợ nhu cầu thực hiện cải cách tiền lương (bao gồm cả quỹ tiền thưởng) cho các xã sau khi đã cân đối nguồn mà chưa đáp ứng đủ nhu cầu theo chế độ quy định']
  ] },
  { id: 5, name: 'Phiên 5', kind: 'open', typeLabel: 'Tình huống tự luận', description: 'Xét duyệt quyết toán ngân sách cấp xã', prompt: SESSION_PROMPTS[5], scoreIndex: 2, answerIndex: 1, answerHeaderPattern: /^Câu trả lời của bạn/i, referenceAnswer: [
    'Khi đơn vị dự toán cấp I đồng thời là đơn vị sử dụng ngân sách, đơn vị không tự xét duyệt quyết toán mà lập báo cáo gửi cơ quan tài chính kiểm tra tính đầy đủ và khớp đúng với xác nhận của Kho bạc Nhà nước. Việc nêu thêm trách nhiệm của thủ trưởng đơn vị là đúng nhưng không bắt buộc để đạt ý này.'
  ] },
  { id: 6, name: 'Phiên 6', kind: 'true_false', typeLabel: 'Đúng/Sai và giải thích', description: 'Tiêu chuẩn định mức máy móc thiết bị', scoreIndex: 1, questionIndexes: [2,4,6,8,10,12,14], explanationIndexes: [3,5,7,9,11,13,15], pointsPerQuestion: 10, correctAnswers: ['Sai','Sai','Đúng','Sai','Sai','Sai','Đúng'], referenceNotes: [
    'Sai: Bí thư đảng ủy xã chỉ được trang bị 1 máy tính xách tay tối đa 25 triệu đồng và 1 máy tính để bàn tối đa 20 triệu đồng.',
    'Sai: Mỗi phòng làm việc không quá 3 người chỉ được trang bị 1 máy in tối đa 13 triệu đồng.',
    'Đúng: Mức giá tối đa của máy tính xách tay là 20 triệu đồng, chưa bao gồm bản quyền phần mềm.',
    'Sai: Điều hòa là thiết bị phục vụ hoạt động chung; theo phân cấp phải trình Chủ tịch UBND xã quyết định.',
    'Sai: Màn hình LED tại hội trường là thiết bị phục vụ hoạt động chung; theo phân cấp phải trình Chủ tịch UBND xã quyết định.',
    'Sai: Máy chiếu tại lớp học là thiết bị chuyên dùng; theo phân cấp phải trình Sở Giáo dục và Đào tạo quyết định.',
    'Đúng: Bàn ghế lớp học là thiết bị chuyên dùng; nếu không đủ điều kiện là tài sản cố định thì thủ trưởng đơn vị quyết định.'
  ] },
  { id: 7, name: 'Phiên 7', kind: 'open', typeLabel: 'Phân tích hồ sơ', description: 'Hồ sơ mua sắm không quá 50 triệu đồng', prompt: SESSION_PROMPTS[7], scoreIndex: 2, answerIndex: 1, answerHeaderPattern: /^Phân tích hồ sơ/i, referenceAnswer: [
    'Thiếu trình Chủ tịch UBND xã quyết định tiêu chuẩn, định mức máy phát điện vì đây là thiết bị phục vụ hoạt động chung của cơ quan, đơn vị.',
    'Thừa hồ sơ trình UBND xã phê duyệt chủ trương và dự kiến kinh phí; theo Quyết định số 80/2026/QĐ-UBND, người đứng đầu đơn vị dự toán cấp I thuộc UBND cấp xã quyết định nội dung này.'
  ] },
  { id: 8, name: 'Phiên 8', kind: 'open', typeLabel: 'Phân tích hồ sơ', description: 'Hồ sơ mua sắm chỉ định thầu rút gọn', prompt: SESSION_PROMPTS[8], scoreIndex: 2, answerIndex: 1, answerHeaderPattern: /^Phân tích hồ sơ/i, referenceAnswer: [
    'Trình Chủ tịch UBND xã, không phải UBND xã, quyết định tiêu chuẩn và định mức màn hình LED vì đây là thiết bị phục vụ hoạt động chung.',
    'Không phải trình UBND xã phê duyệt chủ trương và dự kiến kinh phí; thẩm quyền thuộc người đứng đầu đơn vị dự toán cấp I theo Quyết định số 80/2026/QĐ-UBND.',
    'Thừa bước thẩm định kế hoạch lựa chọn nhà thầu.',
    'Thay “Quyết định chỉ định thầu” bằng “Quyết định phê duyệt kết quả lựa chọn nhà thầu”.'
  ] },
  { id: 9, name: 'Phiên 9', kind: 'quiz', typeLabel: 'Trắc nghiệm 2 câu', description: 'Quản lý, sử dụng tài sản công', formId: '1w65HrpYrgI9RX2iYEu7jz57ka0TIG-CCJzJ8rcPBZ-4', scoreIndex: 1, questionIndexes: [2,3], pointsPerQuestion: 10, correctAnswers: [
    'C. Xây dựng và ban hành quy định về phân cấp thẩm quyền quyết định quản lý, sử dụng, khai thác và xử lý tài sản công',
    'B. Đơn vị sự nghiệp công lập sử dụng hội trường của đơn vị để kinh doanh, cho thuê có trách nhiệm lập hồ sơ đề nghị, báo cáo Chủ tịch Ủy ban nhân dân phường, xã quyết định khai thác tài sản; không phải lập Đề án sử dụng tài sản công vào mục đích kinh doanh, cho thuê'
  ], choices: [
    ['A. Thực hiện thống kê, kế toán kịp thời, đầy đủ về hiện vật, giá trị theo quy định của pháp luật về thống kê, pháp luật về kế toán và pháp luật có liên quan', 'B. Cơ quan, tổ chức, đơn vị được giao quản lý, sử dụng tài sản công có trách nhiệm kiểm kê tài sản vào cuối kỳ kế toán năm và kiểm kê theo quyết định kiểm kê, đánh giá lại tài sản công của Thủ tướng Chính phủ, xác định tài sản thừa, thiếu và nguyên nhân để xử lý theo quy định của pháp luật; thực hiện báo cáo tình hình quản lý, sử dụng tài sản công', 'C. Xây dựng và ban hành quy định về phân cấp thẩm quyền quyết định quản lý, sử dụng, khai thác và xử lý tài sản công', 'D. Đảm bảo các cơ quan, tổ chức, đơn vị của xã xây dựng và tổ chức thực hiện quy chế quản lý, sử dụng tài sản công'],
    ['A. Đơn vị sự nghiệp công lập sử dụng tài sản công để phục vụ hoạt động phụ trợ, hỗ trợ trực tiếp cho việc thực hiện chức năng, nhiệm vụ của đơn vị có trách nhiệm lập hồ sơ đề nghị, báo cáo Chủ tịch Ủy ban nhân dân phường, xã quyết định khai thác tài sản; không phải lập Đề án sử dụng tài sản công vào mục đích kinh doanh, cho thuê, liên doanh, liên kết', 'B. Đơn vị sự nghiệp công lập sử dụng hội trường của đơn vị để kinh doanh, cho thuê có trách nhiệm lập hồ sơ đề nghị, báo cáo Chủ tịch Ủy ban nhân dân phường, xã quyết định khai thác tài sản; không phải lập Đề án sử dụng tài sản công vào mục đích kinh doanh, cho thuê', 'C. Hình thức khai thác phòng họp, phần diện tích sử dụng chung thuộc cơ sở hoạt động sự nghiệp: Bố trí cho cơ quan nhà nước, đơn vị lực lượng vũ trang nhân dân, đơn vị sự nghiệp công lập, cơ quan Đảng Cộng sản Việt Nam, Mặt trận Tổ quốc Việt Nam và tổ chức trực thuộc Mặt trận Tổ quốc Việt Nam sử dụng tạm thời trong thời gian chưa có tài sản hoặc đang trong thời gian thực hiện cải tạo, sửa chữa, nâng cấp, đầu tư xây dựng trụ sở làm việc, cơ sở hoạt động sự nghiệp', 'D. Đơn vị sự nghiệp công lập sử dụng hội trường của đơn vị để kinh doanh, cho thuê có trách nhiệm lập Đề án sử dụng tài sản công vào mục đích kinh doanh, cho thuê, báo cáo Ủy ban nhân dân phường, xã xem xét, có ý kiến về Đề án, trình Chủ tịch Ủy ban nhân dân phường, xã quyết định phê duyệt Đề án sử dụng tài sản công vào mục đích kinh doanh, cho thuê của đơn vị sự nghiệp công lập thuộc phạm vi quản lý.']
  ] }
];

function syncSessionFormTitles() {
  return SESSION_CONFIG.map(config => {
    const title = `${config.name}: ${config.description}`;
    FormApp.openById(SESSION_FORM_IDS[config.id]).setTitle(title);
    return { id: config.id, title };
  });
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.admin === '1') {
    const template = HtmlService.createTemplateFromFile('Admin');
    template.requestedSession = Number(params.session || 1);
    template.requestedView = String(params.view || 'control');
    return template.evaluate()
      .setTitle('Điều khiển Dashboard 09 phiên')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  const callback = String(params.callback || '');
  const data = getDashboardData_(params.refresh === '1');
  const json = JSON.stringify(data);
  if (callback && /^[A-Za-z_$][\w$\.]*$/.test(callback)) {
    return ContentService.createTextOutput(`${callback}(${json});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function openDashboardSpreadsheet_() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (spreadsheetId) return SpreadsheetApp.openById(spreadsheetId);
  throw new Error('Không thể kết nối đến Google Sheet.');
}

function getDashboardData_(forceRefresh) {
  const cache = CacheService.getScriptCache();
  if (!forceRefresh) {
    const cached = cache.get('dashboard-v7');
    if (cached) return JSON.parse(cached);
  }
  const spreadsheet = openDashboardSpreadsheet_();

  // Không đồng bộ _PUBLIC_TOP khi chỉ tải dashboard. Top N chỉ được ghi sau khi
  // Gemini hoàn tất chấm và hàm cập nhật Top N được gọi ở bước chấm.
  const control = getDashboardControl_(spreadsheet);
  const unitCatalog = getStandardUnitCatalog_(spreadsheet);
  const sessions = SESSION_CONFIG.map(config => aggregateSession_(spreadsheet, config, control[config.id], unitCatalog));
  const payload = { version: 7, updatedAt: new Date().toISOString(), sessions };
  const serialized = JSON.stringify(payload);
  if (serialized.length < 95000) cache.put('dashboard-v7', serialized, CACHE_SECONDS);
  return payload;
}

function aggregateSession_(spreadsheet, config, controlState, unitCatalog) {
  const sheet = spreadsheet.getSheetByName(config.name);
  if (!sheet) return { ...config, totalResponses: 0, error: `Không tìm thấy tab ${config.name}` };
  const range = sheet.getDataRange();
  const displayValues = range.getDisplayValues();
  const rawValues = range.getValues();
  const headers = displayValues.shift() || [];
  rawValues.shift();
  const allEntries = displayValues.map((display, index) => ({ display, raw: rawValues[index] || [] }))
    .filter(entry => entry.display.some(cell => String(cell).trim() !== ''));
  const phase = controlState && ['NOT_STARTED', 'TIMED', 'CLOSED'].indexOf(controlState.status) >= 0
    ? controlState.status
    : 'NOT_STARTED';
  const closedAt = phase === 'CLOSED' ? controlState.closedAt : null;
  const entries = closedAt
    ? allEntries.filter(entry => isAtOrBeforeCutoff_(entry.raw[0], entry.display[0], closedAt))
    : allEntries;
  const rows = entries.map(entry => entry.display);
  const resolvedConfig = resolveColumns_(headers, config);
  const unitStats = aggregateUnitParticipation_(rows, headers, unitCatalog || []);
  const unitBreakdown = unitStats.unitBreakdown;
  const result = {
    id: config.id,
    name: config.name,
    kind: config.kind,
    typeLabel: config.typeLabel,
    description: config.description,
    prompt: config.prompt || null,
    phase,
    closedAt: closedAt ? closedAt.toISOString() : null,
    timerStartedAt: phase === 'TIMED' && controlState && controlState.timerStartedAt ? controlState.timerStartedAt.toISOString() : null,
    timerEndsAt: phase === 'TIMED' && controlState && controlState.timerEndsAt ? controlState.timerEndsAt.toISOString() : null,
    currentResponses: allEntries.length,
    lateResponses: Math.max(0, allEntries.length - rows.length),
    totalResponses: rows.length,
    participatingUnits: unitStats.participatingUnits,
    totalUnits: unitStats.totalUnits,
    missingUnits: unitStats.missingUnits,
    unmappedUnitResponses: unitStats.unmappedResponses,
    unitBreakdown,
    scoreStats: phase === 'CLOSED'
      ? getScoreStats_(rows, resolvedConfig)
      : { count: 0, distribution: [], mode: 'Ẩn trong lúc nhận bài' }
  };
  const requiresAiReview = [3, 5, 6, 7, 8].indexOf(config.id) >= 0;
  // Các phiên có Gemini chỉ lấy Top N đã được công bố từ _PUBLIC_TOP. Tuyệt đối
  // không dựng bảng xếp hạng tạm từ câu trả lời gốc, vì kết quả đó chưa được chấm.
  result.leaderboard = phase === 'CLOSED' && !requiresAiReview
    ? buildPerfectLeaderboard_(entries, headers, resolvedConfig)
    : [];
  if (phase === 'CLOSED' && requiresAiReview) {
    result.topParticipants = getTopParticipantsFromSheet_(spreadsheet, config.id);
    result.aiReviewPending = !result.topParticipants.length;
  }

  if (config.kind === 'quiz' || config.kind === 'true_false') {
    const configuredChoices = config.kind === 'quiz' ? (config.choices || []) : [];
    result.questions = resolvedConfig.questionIndexes.map((columnIndex, index) => {
      const answers = rows.map(row => String(row[columnIndex] || '').trim()).filter(Boolean);
      const counts = countValues_(answers);
      const countMap = counts.reduce((map, item) => { map[normalizeAnswer_(item.value)] = item.count; return map; }, {});
      const labels = configuredChoices[index] && configuredChoices[index].length
        ? configuredChoices[index]
        : counts.map(item => item.value);
      const correctCount = answers.filter(answer => sameAnswer_(answer, resolvedConfig.correctAnswers[index])).length;
      const unansweredCount = Math.max(0, rows.length - answers.length);
      const question = {
        title: cleanQuestionTitle_(headers[columnIndex] || `Câu ${index + 1}`),
        totalAnswers: answers.length,
        correctAnswer: phase === 'CLOSED' ? resolvedConfig.correctAnswers[index] : '',
        referenceNote: phase === 'CLOSED' && resolvedConfig.referenceNotes ? resolvedConfig.referenceNotes[index] : '',
        correctCount: phase === 'CLOSED' ? correctCount : null,
        unansweredCount: phase === 'CLOSED' ? unansweredCount : null,
        options: labels.map(label => ({
          label,
          count: countMap[normalizeAnswer_(label)] || 0,
          isCorrect: phase === 'CLOSED' && sameAnswer_(label, resolvedConfig.correctAnswers[index])
        }))
      };
      question.incorrectCount = phase === 'CLOSED' ? Math.max(0, rows.length - correctCount - unansweredCount) : null;
      question.correctPercent = phase === 'CLOSED' && rows.length ? correctCount / rows.length * 100 : null;
      if (resolvedConfig.explanationIndexes) {
        const explanationGroups = { trueChoice: [], falseChoice: [], otherChoice: [] };
        rows.forEach(row => {
          const text = sanitizePublicText_(row[resolvedConfig.explanationIndexes[index]]);
          if (!text) return;
          const selectedAnswer = String(row[columnIndex] || '').trim();
          const item = { selectedAnswer: selectedAnswer || 'Chưa chọn', text };
          const normalizedChoice = normalizeAnswer_(selectedAnswer);
          if (normalizedChoice === normalizeAnswer_('Đúng')) explanationGroups.trueChoice.push(item);
          else if (normalizedChoice === normalizeAnswer_('Sai')) explanationGroups.falseChoice.push(item);
          else explanationGroups.otherChoice.push(item);
        });
        const balanced = explanationGroups.trueChoice.slice(0, MAX_EXPLANATIONS_PER_CHOICE)
          .concat(explanationGroups.falseChoice.slice(0, MAX_EXPLANATIONS_PER_CHOICE));
        question.explanations = balanced.concat(
          explanationGroups.otherChoice.slice(0, Math.max(0, MAX_EXPLANATIONS_PER_CHOICE * 2 - balanced.length))
        );
      }
      return question;
    });
    result.quizSummary = phase === 'CLOSED'
      ? buildQuizSummary_(result.questions, result.scoreStats, config.pointsPerQuestion || 1)
      : null;
    if (config.kind === 'true_false') {
      const possibleExplanations = rows.length * resolvedConfig.explanationIndexes.length;
      const explanationCount = resolvedConfig.explanationIndexes.reduce((sum, columnIndex) =>
        sum + rows.filter(row => String(row[columnIndex] || '').trim()).length, 0);
      result.explanationStats = {
        count: explanationCount,
        rate: possibleExplanations ? explanationCount / possibleExplanations * 100 : 0
      };
    }
  }

  if (config.kind === 'ordering') {
    const answers = rows.map(row => normalizeSequence_(row[resolvedConfig.answerIndex])).filter(Boolean);
    const correct = normalizeSequence_(config.correctSequence);
    result.ordering = phase === 'CLOSED'
      ? {
          correctSequence: config.correctSequence,
          correctSteps: buildCorrectOrderingSteps_(config),
          correctCount: answers.filter(answer => answer === correct).length,
          correctRate: rows.length ? answers.filter(answer => answer === correct).length / rows.length * 100 : 0,
          uniqueSequenceCount: new Set(answers).size,
          positionAccuracy: buildPositionAccuracy_(answers, correct),
          commonSequences: countValues_(answers).filter(item => item.value !== correct).slice(0, 5),
          samples: answers.slice(0, MAX_LIVE_RESPONSES)
        }
      : { samples: answers.slice(0, MAX_LIVE_RESPONSES) };
  }

  if (config.kind === 'open') {
    const publicResponses = rows
      .map(row => sanitizePublicText_(row[resolvedConfig.answerIndex]))
      .filter(Boolean);
    result.referenceAnswer = phase === 'CLOSED' ? (config.referenceAnswer || []) : [];
    result.responses = publicResponses.slice(0, phase === 'CLOSED' ? MAX_PUBLIC_TEXT_RESPONSES : MAX_LIVE_RESPONSES);
    result.liveResponses = result.responses.slice(0, MAX_LIVE_RESPONSES);
  }
  return result;
}

function buildCorrectOrderingSteps_(config) {
  const items = config.prompt && config.prompt.items ? config.prompt.items : [];
  return normalizeSequence_(config.correctSequence).split(',').filter(Boolean).map((step, index) => ({
    position: index + 1,
    step: Number(step),
    text: items[Number(step) - 1] || ''
  }));
}

function buildPerfectLeaderboard_(entries, headers, config) {
  const nameIndexes = headers.map((header, index) => ({ value: normalizeLookup_(header), index }))
    .filter(item => /^ho va ten(?:\s|$)/.test(item.value)).map(item => item.index);
  const unitIndexes = headers.map((header, index) => ({ value: normalizeLookup_(header), index }))
    .filter(item => /^don vi(?:\s|$)/.test(item.value)).map(item => item.index);
  const positionIndexes = headers.map((header, index) => ({ value: normalizeLookup_(header), index }))
    .filter(item => /chuc vu|vi tri|chuc danh/.test(item.value)).map(item => item.index);

  if (!nameIndexes.length || !unitIndexes.length) return [];
  const maximum = config.correctAnswers && config.questionIndexes
    ? config.questionIndexes.length * (config.pointsPerQuestion || 1)
    : config.kind === 'ordering' ? normalizeSequence_(config.correctSequence).split(',').filter(Boolean).length : 0;
  if (!maximum) return [];
  const candidates = entries.map(entry => {
    const row = entry.display;
    let score = 0;
    let correctCount = 0;
    let totalCount = 0;
    let questionDetails = [];
    if (config.correctAnswers && config.questionIndexes) {
      totalCount = config.questionIndexes.length;
      correctCount = config.questionIndexes.reduce((sum, columnIndex, index) => {
        const isCorrect = sameAnswer_(row[columnIndex], config.correctAnswers[index]);
        questionDetails.push({
          number: index + 1,
          title: cleanQuestionTitle_(headers[columnIndex] || `Câu ${index + 1}`),
          userChoice: String(row[columnIndex] || '').trim() || 'Chưa trả lời',
          correctChoice: config.correctAnswers[index],
          isCorrect
        });
        return sum + (isCorrect ? 1 : 0);
      }, 0);
      score = correctCount * (config.pointsPerQuestion || 1);
    } else if (config.kind === 'ordering') {
      const correctSteps = normalizeSequence_(config.correctSequence).split(',').filter(Boolean);
      const submittedSteps = normalizeSequence_(row[config.answerIndex]).split(',').filter(Boolean);
      totalCount = correctSteps.length;
      questionDetails = correctSteps.map((step, index) => {
        const submittedStep = submittedSteps[index] || '';
        const isCorrect = submittedStep === step;
        return {
          number: index + 1,
          title: `Vị trí ${index + 1}`,
          userChoice: submittedStep
            ? `Bước ${submittedStep}: ${(config.prompt?.items || [])[Number(submittedStep) - 1] || ''}`
            : 'Chưa xếp bước này',
          correctChoice: `Bước ${step}: ${(config.prompt?.items || [])[Number(step) - 1] || ''}`,
          isCorrect
        };
      });
      correctCount = questionDetails.filter(item => item.isCorrect).length;
      score = correctCount;
    }
    const completedAt = toDate_(entry.raw[0]) || parseDisplayTimestamp_(row[0]);
    const position = positionIndexes.length ? lastNonEmptyField_(row, positionIndexes) : '';

    return {
      name: lastNonEmptyField_(row, nameIndexes),
      unit: lastNonEmptyField_(row, unitIndexes),
      position,
      score,
      maxScore: maximum,
      result: config.kind === 'ordering' ? `${correctCount}/${totalCount} bước đúng` : `${correctCount}/${totalCount} câu đúng`,
      scoreText: config.kind === 'ordering' ? `${correctCount}/${totalCount} bước đúng` : `${correctCount}/${totalCount} câu đúng`,
      completedAt: completedAt ? completedAt.toISOString() : null,
      completedAtValue: completedAt ? completedAt.getTime() : Number.MAX_SAFE_INTEGER,
      questionDetails
    };
  }).filter(item => item.name);
  const firstByPerson = {};
  candidates.forEach(item => {
    const key = normalizeLookup_(item.name) + '|' + normalizeLookup_(item.unit);
    const current = firstByPerson[key];
    if (!current || item.completedAtValue < current.completedAtValue) {
      firstByPerson[key] = item;
    }
  });
  return Object.keys(firstByPerson).map(key => firstByPerson[key])
    .sort((a, b) => b.score - a.score || a.completedAtValue - b.completedAtValue || a.name.localeCompare(b.name, 'vi'))
    .slice(0, 10)
    .map((item, idx) => ({
      rank: idx + 1,
      name: item.name,
      unit: item.unit,
      position: item.position || '',
      score: item.score,
      maxScore: item.maxScore,
      result: item.result,
      scoreText: item.scoreText,
      completedAt: item.completedAt,
      submittedAt: item.completedAt,
      questionDetails: item.questionDetails
    }));
}

function lastNonEmptyField_(row, indexes) {
  const values = indexes.map(index => String(row[index] || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  return values[values.length - 1] || '';
}

function buildQuizSummary_(questions, scoreStats, pointsPerQuestion) {
  const hardest = scoreStats.count && questions.length
    ? questions.map((question, index) => ({
        number: index + 1,
        title: question.title,
        correctPercent: question.correctPercent
      })).sort((a,b) => a.correctPercent - b.correctPercent || a.number - b.number)[0]
    : null;
  const correctDistribution = (scoreStats.distribution || []).map(item => {
    const score = parseFloat(String(item.label).split('/')[0]) || 0;
    return { label: String(Math.round(score / pointsPerQuestion)), count: item.count };
  });
  const maxQuestions = questions.length;
  const perfectLabel = `${maxQuestions * pointsPerQuestion}/${maxQuestions * pointsPerQuestion}`;
  const perfectCount = (scoreStats.distribution || []).find(item => item.label === perfectLabel)?.count || 0;
  return {
    averageCorrectPercent: scoreStats.averagePercent || 0,
    hardestQuestion: hardest,
    perfectCount,
    perfectRate: scoreStats.count ? perfectCount / scoreStats.count * 100 : 0,
    correctDistribution
  };
}

function buildPositionAccuracy_(answers, correctSequence) {
  const correctSteps = String(correctSequence || '').split(',').filter(Boolean);
  const sequences = answers.map(answer => String(answer || '').split(',').filter(Boolean));
  return correctSteps.map((step, index) => {
    const count = sequences.filter(sequence => sequence[index] === step).length;
    return {
      step,
      position: index + 1,
      count,
      percent: sequences.length ? count / sequences.length * 100 : 0
    };
  });
}

function countDistinctField_(rows, headers, normalizedPattern) {
  return aggregateField_(rows, headers, normalizedPattern).length;
}

function getStandardUnitCatalog_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('DM_DON_VI');
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues()
    .map(row => String(row[0] || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((unit, index, units) => units.findIndex(candidate => normalizeLookup_(candidate) === normalizeLookup_(unit)) === index);
}

function aggregateUnitParticipation_(rows, headers, catalog) {
  const rawBreakdown = aggregateField_(rows, headers, /^don vi(?:\s|$)/);
  if (!catalog.length) {
    return {
      unitBreakdown: rawBreakdown,
      participatingUnits: rawBreakdown.length,
      totalUnits: rawBreakdown.length,
      missingUnits: [],
      unmappedResponses: 0
    };
  }

  const aliases = {};
  catalog.forEach(unit => buildUnitAliasKeys_(unit).forEach(key => { if (!aliases[key]) aliases[key] = unit; }));
  const grouped = {};
  let unmappedResponses = 0;
  rawBreakdown.forEach(item => {
    const canonical = aliases[normalizeLookup_(item.unit)] || null;
    if (!canonical) {
      unmappedResponses += Number(item.count || 0);
      return;
    }
    const key = normalizeLookup_(canonical);
    if (!grouped[key]) grouped[key] = { unit: canonical, count: 0 };
    grouped[key].count += Number(item.count || 0);
  });
  const unitBreakdown = Object.keys(grouped).map(key => grouped[key])
    .sort((a, b) => b.count - a.count || a.unit.localeCompare(b.unit, 'vi'));
  const participated = new Set(unitBreakdown.map(item => normalizeLookup_(item.unit)));
  const missingUnits = catalog.filter(unit => !participated.has(normalizeLookup_(unit)));
  return {
    unitBreakdown,
    participatingUnits: unitBreakdown.length,
    totalUnits: catalog.length,
    missingUnits,
    unmappedResponses
  };
}

function buildUnitAliasKeys_(unit) {
  const normalized = normalizeLookup_(unit);
  const words = normalized.split(' ').filter(Boolean);
  const aliases = [normalized];
  if (words.length > 2) aliases.push(words[0] + ' ' + words.slice(1).map(word => word[0]).join(''));
  return Array.from(new Set(aliases));
}

function aggregateField_(rows, headers, normalizedPattern) {
  const indexes = headers
    .map((header, index) => ({ normalized: normalizeLookup_(header), index }))
    .filter(item => normalizedPattern.test(item.normalized))
    .map(item => item.index);
  if (!indexes.length) return [];
  const values = rows.map(row => {
    const candidates = indexes.map(index => String(row[index] || '').trim()).filter(Boolean);
    return candidates[candidates.length - 1] || '';
  }).filter(Boolean);
  const grouped = {};
  values.forEach(value => {
    const key = normalizeLookup_(value);
    if (!key) return;
    if (!grouped[key]) grouped[key] = { unit: value.replace(/\s+/g, ' ').trim(), count: 0 };
    grouped[key].count += 1;
  });
  return Object.keys(grouped)
    .map(key => grouped[key])
    .sort((a, b) => b.count - a.count || a.unit.localeCompare(b.unit, 'vi'));
}

function normalizeLookup_(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[Đđ]/g, 'd')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

function resolveColumns_(headers, config) {
  const resolved = Object.assign({}, config);
  resolved.scoreIndex = findHeaderIndex_(headers, /^Score$/i, config.scoreIndex);

  if (config.kind === 'quiz') {
    resolved.questionIndexes = config.correctAnswers.map((answer, index) =>
      findHeaderIndex_(headers, new RegExp('^\\s*Câu\\s*' + (index + 1) + '\\s*:', 'i'), config.questionIndexes[index]));
  }

  if (config.kind === 'true_false') {
    resolved.questionIndexes = config.correctAnswers.map((answer, index) =>
      findHeaderIndex_(headers, new RegExp('^\\s*' + (index + 1) + '\\.\\s*'), config.questionIndexes[index]));
    const explanationColumns = headers
      .map((header, index) => ({ header: String(header || ''), index }))
      .filter(item => /Giải thích lý do\s*\/\s*căn cứ/i.test(item.header))
      .map(item => item.index);
    resolved.explanationIndexes = config.explanationIndexes.map((fallback, index) => explanationColumns[index] ?? fallback);
  }

  if (config.answerHeaderPattern) {
    resolved.answerIndex = findHeaderIndex_(headers, config.answerHeaderPattern, config.answerIndex);
  }
  return resolved;
}

function findHeaderIndex_(headers, pattern, fallback) {
  const found = headers.findIndex(header => pattern.test(String(header || '').trim()));
  return found >= 0 ? found : fallback;
}

function getScoreStats_(rows, config) {
  if (config.correctAnswers && config.questionIndexes) {
    return aggregateComputedScores_(rows, config.questionIndexes, config.correctAnswers, config.pointsPerQuestion || 1);
  }
  if (config.kind === 'ordering') {
    const correct = normalizeSequence_(config.correctSequence);
    const answers = rows.map(row => normalizeSequence_(row[config.answerIndex]));
    return aggregateBinaryScores_(answers.map(answer => Boolean(answer) && answer === correct), 10);
  }
  if (config.kind === 'open') return { count: 0, distribution: [], mode: 'Không chấm tự động' };
  return aggregateScores_(rows, config.scoreIndex);
}

function aggregateComputedScores_(rows, indexes, correctAnswers, pointsPerQuestion) {
  const maxScore = indexes.length * pointsPerQuestion;
  const scores = rows.map(row => indexes.reduce((sum, columnIndex, index) =>
    sum + (sameAnswer_(row[columnIndex], correctAnswers[index]) ? pointsPerQuestion : 0), 0));
  return makeScoreStats_(scores, maxScore, 'Tính lại từ đáp án chuẩn');
}

function aggregateBinaryScores_(matches, maxScore) {
  return makeScoreStats_(matches.map(match => match ? maxScore : 0), maxScore, 'Tính từ đáp án chuẩn');
}

function makeScoreStats_(scores, maxScore, mode) {
  if (!scores.length) return { count: 0, distribution: [], mode };
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const distribution = countValues_(scores.map(score => `${score}/${maxScore}`))
    .sort((a,b) => parseFloat(a.value) - parseFloat(b.value));
  return {
    count: scores.length,
    maxScore,
    average,
    averagePercent: maxScore ? average / maxScore * 100 : 0,
    mode,
    distribution: distribution.map(item => ({ label: item.value, count: item.count }))
  };
}

function sameAnswer_(value, expected) {
  return Boolean(normalizeAnswer_(value)) && normalizeAnswer_(value) === normalizeAnswer_(expected);
}

function normalizeAnswer_(value) {
  return String(value || '').normalize('NFC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('vi');
}

function aggregateScores_(rows, scoreIndex) {
  if (scoreIndex === undefined || scoreIndex === null) return { count: 0, distribution: [] };
  const parsed = rows.map(row => parseScore_(row[scoreIndex])).filter(Boolean);
  if (!parsed.length) return { count: 0, distribution: [] };
  const maxScore = Math.max.apply(null, parsed.map(item => item.max || item.value));
  const average = parsed.reduce((sum, item) => sum + item.value, 0) / parsed.length;
  const averagePercent = parsed.reduce((sum, item) => sum + item.percent, 0) / parsed.length;
  const distribution = countValues_(parsed.map(item => item.label)).sort((a,b) => parseFloat(a.value) - parseFloat(b.value));
  return { count: parsed.length, maxScore, average, averagePercent, distribution: distribution.map(item => ({ label: item.value, count: item.count })) };
}

function parseScore_(raw) {
  const text = String(raw || '').trim().replace(',', '.');
  if (!text) return null;
  const fraction = text.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (fraction) {
    const value = Number(fraction[1]);
    const max = Number(fraction[2]);
    return { value, max, percent: max ? value / max * 100 : 0, label: `${value}/${max}` };
  }
  const value = Number(text);
  if (!Number.isFinite(value)) return null;
  return { value, max: value, percent: 100, label: String(value) };
}

function countValues_(values) {
  const map = new Map();
  values.forEach(value => map.set(value, (map.get(value) || 0) + 1));
  return Array.from(map, ([value, count]) => ({ value, count })).sort((a,b) => b.count - a.count || String(a.value).localeCompare(String(b.value), 'vi'));
}

function normalizeSequence_(value) {
  const numbers = String(value || '').match(/\d+/g);
  return numbers ? numbers.join(',') : '';
}

function cleanQuestionTitle_(value) {
  return String(value || '').replace(/^\s*\d+\.\s*/, '').replace(/^\s*Câu\s+\d+\s*:\s*/i, '').trim();
}

function sanitizePublicText_(value) {
  return String(value || '')
    .trim()
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[đã ẩn email]')
    .replace(/(?:\+?84|0)(?:[ .-]?\d){9,10}/g, '[đã ẩn số điện thoại]')
    .slice(0, 3000);
}

function getDashboardControl_(spreadsheet) {
  const defaults = {};
  SESSION_CONFIG.forEach(config => {
    defaults[config.id] = { status: 'NOT_STARTED', closedAt: null, closedCount: null, timerStartedAt: null, timerEndsAt: null };
  });
  const sheet = spreadsheet.getSheetByName(CONTROL_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return defaults;
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  values.forEach(row => {
    const idMatch = String(row[0] || '').match(/\d+/);
    const id = idMatch ? Number(idMatch[0]) : 0;
    if (!defaults[id]) return;
    const rawStatus = String(row[1] || '').trim().toUpperCase();
    const storedEndAt = toDate_(row[2]);
    const timerStartedAt = toDate_(row[4]);
    const timerExpired = rawStatus === 'TIMED' && storedEndAt && storedEndAt.getTime() <= Date.now();
    const status = rawStatus === 'CLOSED' || timerExpired
      ? 'CLOSED'
      : rawStatus === 'TIMED' ? 'TIMED' : 'NOT_STARTED';
    const closedAt = status === 'CLOSED' ? storedEndAt : null;
    defaults[id] = {
      status,
      closedAt,
      closedCount: Number(row[3]) || null,
      timerStartedAt: rawStatus === 'TIMED' && !timerExpired ? timerStartedAt : null,
      timerEndsAt: rawStatus === 'TIMED' && !timerExpired ? storedEndAt : null
    };
  });
  return defaults;
}

function isAtOrBeforeCutoff_(rawTimestamp, displayTimestamp, cutoff) {
  const timestamp = toDate_(rawTimestamp) || parseDisplayTimestamp_(displayTimestamp);
  if (!timestamp) return true;
  return timestamp.getTime() <= cutoff.getTime();
}

function toDate_(value) {
  if (!value) return null;
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) return value;
  if (typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function parseDisplayTimestamp_(value) {
  const text = String(value || '').trim();
  const match = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!match) return null;
  const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0));
  return isNaN(date.getTime()) ? null : date;
}

function getTopParticipantsFromSheet_(spreadsheet, sessionId) {
  const sheet = spreadsheet.getSheetByName('_PUBLIC_TOP');
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  values.shift(); // Remove header
  const filtered = values.filter(row => Number(row[0]) === Number(sessionId));
  if (!filtered.length) return [];
  
  return filtered.map(row => {
    try {
      if (Number(sessionId) === 6) {
        let questionDetails = [];
        try { questionDetails = row[7] && typeof row[7] === 'string' ? JSON.parse(row[7]) : []; } catch(e) {}
        return {
          rank: Number(row[1]) || 1,
          name: String(row[2] || ''),
          unit: String(row[3] || ''),
          submittedAt: String(row[4] || ''),
          scoreChoice: String(row[5] || '70/70'),
          scoreExplanation: String(row[6] || ''),
          aiFeedback: String(row[9] || ''),
          questionDetails,
          position: String(row[11] || '')
        };
      }
      let matchedItems = [];
      try { matchedItems = row[7] && typeof row[7] === 'string' ? JSON.parse(row[7]) : []; } catch(e) {}
      return {
        rank: Number(row[1]) || 1,
        name: String(row[2] || ''),
        unit: String(row[3] || ''),
        submittedAt: String(row[4] || ''),
        scoreText: String(row[5] || ''),
        essay: String(row[6] || ''),
        matchedItems,
        referenceAnswer: String(row[8] || ''),
        aiFeedback: String(row[9] || ''),
        criticalErrors: Number(row[10]) || 0,
        position: String(row[11] || '')
      };
    } catch (err) {
      return null;
    }
  }).filter(Boolean);
}

function taoDuLieuMauChoPhien_(spreadsheet, sessionId) {
  const config = SESSION_CONFIG.find(item => item.id === Number(sessionId));
  if (!config) return { success: false, message: 'Không tìm thấy cấu hình phiên' };
  let sheet = spreadsheet.getSheetByName(config.name);
  if (!sheet) return { success: false, message: `Không tìm thấy tab ${config.name}` };
  
  const sampleNames = [
    "Trần Thị Minh Trang", "Nguyễn Hoàng Nam", "Lê Phương Anh", "Phạm Văn Đức", "Đỗ Hoài Thu",
    "Vũ Nhật Minh", "Bùi Thanh Hằng", "Đặng Quang Vinh", "Trương Mỹ Duyên", "Phan Tuấn Kiệt",
    "Hà Thị Mai", "Ngô Quốc Bảo"
  ];
  const sampleUnits = [
    "Phường Hải Châu", "Phường Hòa Cường", "Phường Thanh Khê", "Phường An Khê", "Phường An Hải",
    "Phường Sơn Trà", "Phường Ngũ Hành Sơn", "Phường Hòa Khánh", "Phường Liên Chiểu", "Phường Hải Vân",
    "Xã Hòa Vang", "Xã Hòa Tiến"
  ];
  const samplePositions = [
    "Chuyên viên", "Công chức Tài chính - Kế toán", "Phó Trưởng phòng", "Kế toán trưởng",
    "Chuyên viên", "Công chức Tài chính - Kế toán", "Phó Chủ tịch UBND", "Trưởng phòng",
    "Chuyên viên", "Kế toán", "Công chức Tài chính - Kế toán", "Chuyên viên"
  ];
  
  const now = new Date();
  const rowsToAdd = [];
  
  if (config.id === 3) {
    const essays = [
      "Xã A chưa đảm bảo công khai đầy đủ. Cần bổ sung số liệu và thuyết minh dự toán trình HĐND xã; thuyết minh quyết toán đã được phê chuẩn; các mốc công khai 03, 06, 09 tháng và cả năm. (BÀI MẪU TEST)",
      "Nội dung công khai còn thiếu phần giải trình quyết toán và biểu mẫu tình hình thực hiện ngân sách mốc 3, 6, 9 tháng. (BÀI MẪU TEST)",
      "Cần bổ sung thuyết minh dự toán trình HĐND xã và công khai quyết toán được phê chuẩn theo quy định hiện hành. (BÀI MẪU TEST)",
      "Thiếu thuyết minh quyết toán và thiếu mốc thời gian công khai chi tiết theo quy định. (BÀI MẪU TEST)",
      "Xã cần công khai đầy đủ dự toán trình, dự toán giao, tình hình thực hiện 3-6-9-12 tháng và quyết toán. (BÀI MẪU TEST)",
      "Công khai dự toán trình HĐND xã cần có thuyết minh kèm theo số liệu chi tiết các khoản thu chi. (BÀI MẪU TEST)",
      "Thiếu thuyết minh báo cáo quyết toán ngân sách xã đã được HĐND phê chuẩn. (BÀI MẪU TEST)",
      "Quy định yêu cầu công khai thực hiện dự toán các mốc 3, 6, 9 tháng và năm, không ghi chung chung. (BÀI MẪU TEST)",
      "Chưa đạt vì thiếu thuyết minh dự toán và quyết toán được duyệt theo quy định. (BÀI MẪU TEST)",
      "Cần bổ sung thuyết minh số liệu dự toán thu chi ngân sách cấp xã. (BÀI MẪU TEST)",
      "Xã A ghi hàng quý là chưa chuẩn mốc 3-6-9 tháng theo quy định. (BÀI MẪU TEST)",
      "Cần bổ sung thuyết minh quyết toán và mốc công khai 9 tháng. (BÀI MẪU TEST)"
    ];
    sampleNames.forEach((name, i) => {
      rowsToAdd.push(buildOpenSampleRow_(sheet, config, new Date(now.getTime() - i * 60000), name, sampleUnits[i], samplePositions[i], essays[i]));
    });
  } else if (config.id === 5) {
    const essays = [
      "Theo khoản 5 Điều 69 Luật NSNN 2025, khi đơn vị cấp I đồng thời là đơn vị sử dụng NS thì lập báo cáo gửi cơ quan tài chính kiểm tra. Thủ trưởng chịu trách nhiệm. (BÀI MẪU TEST)",
      "Đơn vị cấp I không tự xét duyệt cho chính mình mà gửi cơ quan tài chính kiểm tra tính đầy đủ và khớp đúng KBNN. (BÀI MẪU TEST)",
      "Theo quy định Điều 69 Luật Ngân sách nhà nước, thủ trưởng đơn vị ký báo cáo quyết toán và gửi cơ quan tài chính. (BÀI MẪU TEST)",
      "Báo cáo quyết toán lập gửi cơ quan tài chính để kiểm tra, không cần tổ chức xét duyệt nội bộ. (BÀI MẪU TEST)",
      "Quy trình áp dụng theo khoản 5 Điều 69, gửi cơ quan tài chính đối chiếu số liệu Kho bạc. (BÀI MẪU TEST)",
      "Ủy ban nhân dân cấp xã lập báo cáo gửi cơ quan tài chính kiểm tra theo quy định. (BÀI MẪU TEST)",
      "Thủ trưởng đơn vị chịu trách nhiệm về số liệu quyết toán của đơn vị mình. (BÀI MẪU TEST)",
      "Cơ quan tài chính đối chiếu số liệu với Kho bạc nhà nước thay vì xét duyệt. (BÀI MẪU TEST)",
      "Đơn vị sử dụng ngân sách đồng thời là cấp I lập báo cáo gửi tài chính. (BÀI MẪU TEST)",
      "Căn cứ Khoản 5 Điều 69 Luật NSNN 2025 về xét duyệt quyết toán. (BÀI MẪU TEST)",
      "Báo cáo quyết toán phải khớp đúng với xác nhận Kho bạc. (BÀI MẪU TEST)",
      "Thủ trưởng đơn vị chịu trách nhiệm tính chính xác của quyết toán. (BÀI MẪU TEST)"
    ];
    sampleNames.forEach((name, i) => {
      rowsToAdd.push(buildOpenSampleRow_(sheet, config, new Date(now.getTime() - i * 60000), name, sampleUnits[i], samplePositions[i], essays[i]));
    });
  } else if (config.id === 7) {
    const essays = [
      "Thiếu trình Chủ tịch UBND xã quyết định tiêu chuẩn định mức máy phát điện. Thừa hồ sơ trình UBND xã phê duyệt chủ trương và dự kiến kinh phí. (BÀI MẪU TEST)",
      "Hồ sơ thừa bước xin chủ trương của UBND xã vì thẩm quyền thuộc người đứng đầu cấp I theo QĐ 80/2026. (BÀI MẪU TEST)",
      "Cần bổ sung quyết định tiêu chuẩn định mức của Chủ tịch UBND xã trước khi mua sắm. (BÀI MẪU TEST)",
      "Thiếu quyết định định mức máy phát điện của Chủ tịch UBND xã. (BÀI MẪU TEST)",
      "Thừa tờ trình UBND xã phê duyệt chủ trương mua sắm thiết bị. (BÀI MẪU TEST)",
      "Máy phát điện là thiết bị chung, cần quyết định tiêu chuẩn định mức của Chủ tịch UBND xã. (BÀI MẪU TEST)",
      "Thừa bước trình tập thể UBND xã phê duyệt chủ trương kinh phí. (BÀI MẪU TEST)",
      "Người đứng đầu đơn vị dự toán cấp I tự quyết định theo phân cấp. (BÀI MẪU TEST)",
      "Thiếu quyết định tiêu chuẩn định mức thiết bị dùng chung. (BÀI MẪU TEST)",
      "Hồ sơ thừa tờ trình xin phê duyệt chủ trương không cần thiết. (BÀI MẪU TEST)",
      "Trình Chủ tịch UBND xã quyết định định mức máy phát điện. (BÀI MẪU TEST)",
      "Bỏ bước trình UBND xã phê duyệt chủ trương theo QĐ 80/2026. (BÀI MẪU TEST)"
    ];
    sampleNames.forEach((name, i) => {
      rowsToAdd.push(buildOpenSampleRow_(sheet, config, new Date(now.getTime() - i * 60000), name, sampleUnits[i], samplePositions[i], essays[i]));
    });
  } else if (config.id === 8) {
    const essays = [
      "Hồ sơ thừa thiếu 4 điểm: 1. Trình Chủ tịch UBND xã quyết định định mức. 2. Không trình UBND xã phê duyệt chủ trương. 3. Thừa thẩm định KHLCNT. 4. Thay QĐ chỉ định thầu bằng QĐ phê duyệt KQLCNT. (BÀI MẪU TEST)",
      "Trình Chủ tịch UBND xã quyết định tiêu chuẩn định mức màn hình LED; Thừa bước thẩm định KHLCNT. (BÀI MẪU TEST)",
      "Không trình UBND xã phê duyệt chủ trương; Đổi tên QĐ chỉ định thầu thành QĐ phê duyệt KQLCNT. (BÀI MẪU TEST)",
      "Thừa bước thẩm định kế hoạch lựa chọn nhà thầu và thừa bước xin phê duyệt chủ trương. (BÀI MẪU TEST)",
      "Thẩm quyền định mức thuộc Chủ tịch UBND xã; thẩm quyền mua sắm thuộc đơn vị dự toán cấp I. (BÀI MẪU TEST)",
      "Trình Chủ tịch UBND xã quyết định tiêu chuẩn định mức màn hình LED hội trường. (BÀI MẪU TEST)",
      "Thừa bước thẩm định KHLCNT trong hồ sơ mua sắm này. (BÀI MẪU TEST)",
      "Thay QĐ chỉ định thầu bằng QĐ phê duyệt kết quả lựa chọn nhà thầu. (BÀI MẪU TEST)",
      "Không phải trình UBND xã phê duyệt chủ trương và dự kiến kinh phí. (BÀI MẪU TEST)",
      "Thẩm quyền định mức màn hình LED thuộc Chủ tịch UBND xã. (BÀI MẪU TEST)",
      "Thừa bước xin phê duyệt chủ trương mua sắm. (BÀI MẪU TEST)",
      "Bổ sung quyết định phê duyệt kết quả lựa chọn nhà thầu. (BÀI MẪU TEST)"
    ];
    sampleNames.forEach((name, i) => {
      rowsToAdd.push(buildOpenSampleRow_(sheet, config, new Date(now.getTime() - i * 60000), name, sampleUnits[i], samplePositions[i], essays[i]));
    });
  } else if (config.id === 6) {
    sampleNames.forEach((name, i) => {
      rowsToAdd.push([
        new Date(now.getTime() - i * 60000), name, sampleUnits[i],
        "Sai", "Bí thư chỉ được 1 xách tay max 25tr và 1 để bàn max 20tr (BÀI MẪU TEST)",
        "Sai", "Phòng <=3 người chỉ 1 máy in max 13tr (BÀI MẪU TEST)",
        "Đúng", "Mức giá max 20tr chưa gồm bản quyền (BÀI MẪU TEST)",
        "Sai", "Điều hòa là thiết bị chung, trình Chủ tịch UBND xã (BÀI MẪU TEST)",
        "Sai", "Màn hình LED hội trường trình Chủ tịch UBND xã (BÀI MẪU TEST)",
        "Sai", "Máy chiếu lớp học trình Sở GD&ĐT (BÀI MẪU TEST)",
        "Đúng", "Nếu không đủ TSCĐ thì thủ trưởng đơn vị quyết định (BÀI MẪU TEST)"
      ]);
    });
  }
  
  if (rowsToAdd.length) {
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);
  }
  
  // Tự động khởi tạo tab _GEMINI_REVIEW ngay khi tạo dữ liệu mẫu
  try {
    taoTabGeminiReview_(spreadsheet, config.id);
  } catch (e) {
    Logger.log('Tự động tạo tab _GEMINI_REVIEW trong taoDuLieuMau: ' + e);
  }
  
  return { success: true, count: rowsToAdd.length };
}

function buildOpenSampleRow_(sheet, config, timestamp, name, unit, position, essay) {
  const headers = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getDisplayValues()[0];
  const resolved = resolveColumns_(headers, config);
  const row = Array(headers.length).fill('');
  row[0] = timestamp;
  headers.forEach((header, index) => {
    const normalized = normalizeLookup_(header);
    if (/^ho va ten(?:\s|$)/.test(normalized)) row[index] = name;
    else if (/^don vi(?:\s|$)/.test(normalized)) row[index] = unit;
    else if (/chuc vu|vi tri|chuc danh/.test(normalized)) row[index] = position;
  });
  row[resolved.answerIndex] = essay;
  return row;
}

function xoaDuLieuMauChoPhien_(spreadsheet, sessionId) {
  const config = SESSION_CONFIG.find(item => item.id === Number(sessionId));
  if (!config) return { success: false, message: 'Không tìm thấy cấu hình phiên' };
  let sheet = spreadsheet.getSheetByName(config.name);
  if (!sheet || sheet.getLastRow() < 2) return { success: true, count: 0 };
  
  const values = sheet.getDataRange().getValues();
  let deletedCount = 0;
  for (let i = values.length - 1; i >= 1; i--) {
    const rowStr = values[i].join(' ');
    if (rowStr.indexOf('(BÀI MẪU TEST)') >= 0) {
      sheet.deleteRow(i + 1);
      deletedCount++;
    }
  }
  return { success: true, count: deletedCount };
}

/**
 * MENU TỰ ĐỘNG XUẤT HIỆN TRÊN GOOGLE SHEETS
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🤖 Gemini Review')
      .addSubMenu(ui.createMenu('BƯỚC 1 — Tạo sheet chấm bài')
        .addItem('Phiên 3 (Tình huống mở)', 'taoTabGeminiReviewPhien3')
        .addItem('Phiên 5 (Tình huống mở)', 'taoTabGeminiReviewPhien5')
        .addItem('Phiên 6 (Đúng/Sai 7 câu)', 'taoTabGeminiReviewPhien6')
        .addItem('Phiên 7 (Tình huống mở)', 'taoTabGeminiReviewPhien7')
        .addItem('Phiên 8 (Tình huống mở)', 'taoTabGeminiReviewPhien8'))
      .addSeparator()
      .addSubMenu(ui.createMenu('BƯỚC 2 — Cập nhật Vinh danh lên Dashboard')
        .addItem('Phiên 3 → Đẩy Top N lên Dashboard', 'capNhatPublicTopPhien3')
        .addItem('Phiên 5 → Đẩy Top N lên Dashboard', 'capNhatPublicTopPhien5')
        .addItem('Phiên 6 → Đẩy Top N lên Dashboard', 'capNhatPublicTopPhien6')
        .addItem('Phiên 7 → Đẩy Top N lên Dashboard', 'capNhatPublicTopPhien7')
        .addItem('Phiên 8 → Đẩy Top N lên Dashboard', 'capNhatPublicTopPhien8')
        .addItem('Tất cả phiên → Đẩy Top N', 'capNhatPublicTopTatCaPhien'))
      .addSeparator()
      .addItem('🎨 Đưa cột Chức vụ lên sau Họ tên & Format 9 Sheet', 'chuanHoa9SheetPhien')
      .addSeparator()
      .addItem('📝 Tạo 12 bài làm mẫu (Phiên 3)', 'taoDuLieuMauPhien3')
      .addItem('📝 Tạo bài mẫu (Tất cả các phiên)', 'taoDuLieuMauTatCaPhien')
      .addItem('🧹 Xóa sạch bài làm mẫu', 'xoaDuLieuMauTatCaPhien')
      .addToUi();
  } catch (e) {
    Logger.log('Không thể tạo menu onOpen: ' + e);
  }
}

function capNhatPublicTopPhien3() {
  const spreadsheet = openDashboardSpreadsheet_();
  notifyPublicTopUpdate_(capNhatTabPublicTop_(spreadsheet, 3), 3);
}

function capNhatPublicTopPhien5() {
  const spreadsheet = openDashboardSpreadsheet_();
  notifyPublicTopUpdate_(capNhatTabPublicTop_(spreadsheet, 5), 5);
}

function capNhatPublicTopPhien6() {
  const spreadsheet = openDashboardSpreadsheet_();
  notifyPublicTopUpdate_(capNhatTabPublicTop_(spreadsheet, 6), 6);
}

function capNhatPublicTopPhien7() {
  const spreadsheet = openDashboardSpreadsheet_();
  notifyPublicTopUpdate_(capNhatTabPublicTop_(spreadsheet, 7), 7);
}

function capNhatPublicTopPhien8() {
  const spreadsheet = openDashboardSpreadsheet_();
  notifyPublicTopUpdate_(capNhatTabPublicTop_(spreadsheet, 8), 8);
}

function notifyPublicTopUpdate_(result, sessionId) {
  const message = result && result.pending
    ? `⏳ Phiên ${sessionId} còn ${result.pendingCount} bài Gemini chưa chấm xong. Dashboard chưa công bố Top.`
    : `✅ Đã cập nhật Top N Phiên ${sessionId} lên Dashboard. Hãy tải lại dashboard.`;
  try { SpreadsheetApp.getUi().alert(message); } catch(e) { Logger.log(message); }
}

/**
 * CÁC HÀM TIỆN ÍCH CHẠY TRỰC TIẾP TRÊN APPS SCRIPT EDITOR ĐỂ FAKE BÀI LÀM TEST:
 */
function taoDuLieuMauPhien3() {
  const spreadsheet = openDashboardSpreadsheet_();
  const res = taoDuLieuMauChoPhien_(spreadsheet, 3);
  taoTabGeminiReview_(spreadsheet, 3);
  return res;
}

function taoDuLieuMauPhien5() {
  const spreadsheet = openDashboardSpreadsheet_();
  const res = taoDuLieuMauChoPhien_(spreadsheet, 5);
  taoTabGeminiReview_(spreadsheet, 5);
  return res;
}

function taoDuLieuMauPhien6() {
  const spreadsheet = openDashboardSpreadsheet_();
  const res = taoDuLieuMauChoPhien_(spreadsheet, 6);
  taoTabGeminiReview_(spreadsheet, 6);
  return res;
}

function taoDuLieuMauPhien7() {
  const spreadsheet = openDashboardSpreadsheet_();
  const res = taoDuLieuMauChoPhien_(spreadsheet, 7);
  taoTabGeminiReview_(spreadsheet, 7);
  return res;
}

function taoDuLieuMauPhien8() {
  const spreadsheet = openDashboardSpreadsheet_();
  const res = taoDuLieuMauChoPhien_(spreadsheet, 8);
  taoTabGeminiReview_(spreadsheet, 8);
  return res;
}

function taoDuLieuMauTatCaPhien() {
  const spreadsheet = openDashboardSpreadsheet_();
  [3, 5, 6, 7, 8].forEach(id => {
    taoDuLieuMauChoPhien_(spreadsheet, id);
    taoTabGeminiReview_(spreadsheet, id);
  });
  Logger.log('Đã tạo dữ liệu mẫu và tab _GEMINI_REVIEW cho tất cả các phiên 3, 5, 6, 7, 8');
}

function xoaDuLieuMauTatCaPhien() {
  const spreadsheet = openDashboardSpreadsheet_();
  [3, 5, 6, 7, 8].forEach(id => xoaDuLieuMauChoPhien_(spreadsheet, id));
  Logger.log('Đã xóa dữ liệu mẫu khỏi tất cả các phiên');
}
