const CACHE_SECONDS = 30;
const MAX_PUBLIC_TEXT_RESPONSES = 40;

const SESSION_CONFIG = [
  { id: 1, name: 'Phiên 1', kind: 'quiz', typeLabel: 'Trắc nghiệm 6 câu', description: 'Phân cấp thu, chi và lập dự toán ngân sách cấp xã', scoreIndex: 1, questionIndexes: [4,5,6,7,8,9] },
  { id: 2, name: 'Phiên 2', kind: 'ordering', typeLabel: 'Sắp xếp thứ tự', description: 'Quy trình quản lý ngân sách cấp xã theo thời gian', scoreIndex: 4, answerIndex: 3, correctSequence: '3, 5, 1, 6, 4, 11, 9, 8, 10, 13, 2, 12, 7' },
  { id: 3, name: 'Phiên 3', kind: 'open', typeLabel: 'Tình huống tự luận', description: 'Thực hiện công khai ngân sách cấp xã', scoreIndex: 4, answerIndex: 3 },
  { id: 4, name: 'Phiên 4', kind: 'quiz', typeLabel: 'Trắc nghiệm 9 câu', description: 'Quản lý ngân sách cấp xã', scoreIndex: 1, questionIndexes: [2,3,4,5,6,7,8,9,10] },
  { id: 5, name: 'Phiên 5', kind: 'open', typeLabel: 'Tình huống tự luận', description: 'Xét duyệt và tổng hợp quyết toán năm', scoreIndex: 2, answerIndex: 1 },
  { id: 6, name: 'Phiên 6', kind: 'true_false', typeLabel: 'Đúng/Sai và giải thích', description: 'Định mức trang thiết bị, tài sản', scoreIndex: 1, questionIndexes: [2,4,6,8,10,12,14], explanationIndexes: [3,5,7,9,11,13,15] },
  { id: 7, name: 'Phiên 7', kind: 'open', typeLabel: 'Phân tích hồ sơ', description: 'Tình huống mua sắm máy phát điện', scoreIndex: 2, answerIndex: 1 },
  { id: 8, name: 'Phiên 8', kind: 'open', typeLabel: 'Phân tích hồ sơ', description: 'Tình huống mua sắm màn hình LED', scoreIndex: 2, answerIndex: 1 },
  { id: 9, name: 'Phiên 9', kind: 'quiz', typeLabel: 'Trắc nghiệm 2 câu', description: 'Quản lý và khai thác tài sản công', scoreIndex: 1, questionIndexes: [2,3] }
];

function doGet(e) {
  const params = (e && e.parameter) || {};
  const callback = String(params.callback || '');
  const data = getDashboardData_(params.refresh === '1');
  const json = JSON.stringify(data);
  if (callback && /^[A-Za-z_$][\w$\.]*$/.test(callback)) {
    return ContentService.createTextOutput(`${callback}(${json});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function getDashboardData_(forceRefresh) {
  const cache = CacheService.getScriptCache();
  if (!forceRefresh) {
    const cached = cache.get('dashboard-v1');
    if (cached) return JSON.parse(cached);
  }
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Chưa cấu hình Script Property SPREADSHEET_ID');
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sessions = SESSION_CONFIG.map(config => aggregateSession_(spreadsheet, config));
  const payload = { version: 1, updatedAt: new Date().toISOString(), sessions };
  const serialized = JSON.stringify(payload);
  if (serialized.length < 95000) cache.put('dashboard-v1', serialized, CACHE_SECONDS);
  return payload;
}

function aggregateSession_(spreadsheet, config) {
  const sheet = spreadsheet.getSheetByName(config.name);
  if (!sheet) return { ...config, totalResponses: 0, error: `Không tìm thấy tab ${config.name}` };
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift() || [];
  const rows = values.filter(row => row.some(cell => String(cell).trim() !== ''));
  const result = {
    id: config.id,
    name: config.name,
    kind: config.kind,
    typeLabel: config.typeLabel,
    description: config.description,
    totalResponses: rows.length,
    scoreStats: aggregateScores_(rows, config.scoreIndex)
  };

  if (config.kind === 'quiz' || config.kind === 'true_false') {
    result.questions = config.questionIndexes.map((columnIndex, index) => {
      const answers = rows.map(row => String(row[columnIndex] || '').trim()).filter(Boolean);
      const counts = countValues_(answers);
      const question = {
        title: cleanQuestionTitle_(headers[columnIndex] || `Câu ${index + 1}`),
        totalAnswers: answers.length,
        options: counts.map(item => ({ label: item.value, count: item.count }))
      };
      if (config.explanationIndexes) {
        question.explanations = rows
          .map(row => sanitizePublicText_(row[config.explanationIndexes[index]]))
          .filter(Boolean)
          .slice(0, 12);
      }
      return question;
    });
  }

  if (config.kind === 'ordering') {
    const answers = rows.map(row => normalizeSequence_(row[config.answerIndex])).filter(Boolean);
    const correct = normalizeSequence_(config.correctSequence);
    result.ordering = {
      correctSequence: config.correctSequence,
      correctCount: answers.filter(answer => answer === correct).length,
      commonSequences: countValues_(answers).slice(0, 8)
    };
  }

  if (config.kind === 'open') {
    result.responses = rows
      .map(row => sanitizePublicText_(row[config.answerIndex]))
      .filter(Boolean)
      .slice(0, MAX_PUBLIC_TEXT_RESPONSES);
  }
  return result;
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
