const CONTROL_HEADERS = ['Phiên', 'Trạng thái', 'Thời gian kết thúc/chốt', 'Số bài lúc chốt', 'Bắt đầu đếm ngược'];

function setupDashboardControl() {
  const spreadsheet = openDashboardSpreadsheet_();
  const sheet = ensureDashboardControlSheet_(spreadsheet);
  const email = Session.getEffectiveUser().getEmail();
  if (email) {
    const properties = PropertiesService.getScriptProperties();
    const emails = String(properties.getProperty('ADMIN_EMAILS') || '')
      .split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
    if (emails.indexOf(email.toLowerCase()) < 0) emails.push(email.toLowerCase());
    properties.setProperty('ADMIN_EMAILS', emails.join(','));
  }
  ensureDashboardTimerTrigger_();
  clearDashboardCache_();
  return {
    ok: true,
    controlSheet: sheet.getName(),
    adminEmail: email || '',
    message: 'Đã khởi tạo bảng điều khiển 09 phiên.'
  };
}

// Chuẩn hóa 09 tab phản hồi sao cho cột Chức vụ đứng sau cột Họ và tên Anh/Chị (cột C).
function chuanHoa9SheetPhien() {
  assertAdmin_();
  const spreadsheet = openDashboardSpreadsheet_();
  const report = [];
  SESSION_CONFIG.forEach(config => {
    const sheet = spreadsheet.getSheetByName(config.name);
    if (!sheet) {
      report.push({ phien: config.id, ok: false, loi: 'Không tìm thấy sheet' });
      return;
    }
    let lastColumn = Math.max(1, sheet.getLastColumn());
    let headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
    
    // Tìm vị trí cột Họ và tên Anh/Chị
    const nameIndex = headers.findIndex(header => /^ho va ten(?:\s|$)/.test(normalizeLookup_(header)));
    // Target position for Chức vụ (1-based column index): right after Name column (e.g. Column 3 if Name is Column 2)
    const targetCol = nameIndex >= 0 ? nameIndex + 2 : 3;

    let posColIndex = headers.findIndex(header => /chuc vu|vi tri|chuc danh/.test(normalizeLookup_(header))) + 1; // 1-based

    if (posColIndex <= 0) {
      // Nếu chưa có cột chức vụ -> Chèn vào ngay sau cột Họ và tên
      sheet.insertColumnAfter(targetCol - 1);
      lastColumn += 1;
      sheet.getRange(1, targetCol).setValue('Chức vụ/Vị trí công tác');
    } else if (posColIndex !== targetCol) {
      // Đã có cột chức vụ ở vị trí khác -> di chuyển về đứng ngay sau cột Họ và tên
      sheet.moveColumns(sheet.getRange(1, posColIndex, Math.max(1, sheet.getLastRow()), 1), targetCol);
    }

    // Lấy lại danh sách header sau khi di chuyển/chèn cột
    lastColumn = Math.max(1, sheet.getLastColumn());
    headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];

    const lastRow = Math.max(1, sheet.getLastRow());
    const usedRange = sheet.getRange(1, 1, lastRow, lastColumn);
    usedRange.setFontFamily('Arial').setFontSize(10).setVerticalAlignment('top');
    sheet.getRange(1, 1, 1, lastColumn)
      .setBackground('#1b365d').setFontColor('#ffffff').setFontWeight('bold')
      .setFontSize(10).setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    sheet.setRowHeight(1, 44);
    sheet.setFrozenRows(1);
    sheet.setHiddenGridlines(false);
    headers.forEach((header, index) => {
      const normalized = normalizeLookup_(header);
      const column = index + 1;
      let width = 180;
      if (index === 0 || /thoi gian|timestamp/.test(normalized)) width = 145;
      else if (/^ho va ten/.test(normalized)) width = 190;
      else if (/chuc vu|vi tri|chuc danh/.test(normalized)) width = 190;
      else if (/^don vi/.test(normalized)) width = 200;
      else if (/score|diem/.test(normalized)) width = 85;
      else if (/giai thich|phan tich|tinh huong|cau tra loi|sap xep/.test(normalized)) width = 320;
      else if (/^cau\s*\d+|^\d+\./.test(normalized)) width = 235;
      sheet.setColumnWidth(column, width);
      if (lastRow > 1) {
        sheet.getRange(2, column, lastRow - 1, 1)
          .setHorizontalAlignment(/score|diem/.test(normalized) ? 'center' : 'left')
          .setWrap(true);
      }
    });
    report.push({ phien: config.id, ok: true });
  });
  clearDashboardCache_();
  return report;
}

function getAdminDashboardData() {
  const email = assertAdmin_();
  const data = getDashboardData_(true);
  return {
    email,
    updatedAt: data.updatedAt,
    sessions: data.sessions.map(session => ({
      id: session.id,
      name: session.name,
      description: session.description,
      phase: session.phase,
      closedAt: session.closedAt,
      totalResponses: session.totalResponses,
      currentResponses: session.currentResponses,
      lateResponses: session.lateResponses,
      timerEndsAt: session.timerEndsAt || null,
      timerStartedAt: session.timerStartedAt || null
    }))
  };
}

// Bảng điều khiển nổi chỉ cần dữ liệu của một phiên. Không gọi
// getDashboardData_ (vốn tổng hợp cả 9 sheet) để thao tác mở/chốt phản hồi nhanh.
function getCompactSessionControl(sessionId) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  const spreadsheet = openDashboardSpreadsheet_();
  const config = SESSION_CONFIG.find(item => item.id === id);
  const state = getDashboardControl_(spreadsheet)[id];
  const responseSheet = spreadsheet.getSheetByName(`Phiên ${id}`);
  const currentResponses = responseSheet ? countResponseRows_(responseSheet) : 0;
  const closed = state.status === 'CLOSED';
  return {
    updatedAt: new Date().toISOString(),
    sessions: [{
      id,
      name: config ? config.name : `Phiên ${id}`,
      description: config ? config.description : '',
      phase: state.status,
      closedAt: state.closedAt ? state.closedAt.toISOString() : null,
      totalResponses: closed ? (state.closedCount || currentResponses) : currentResponses,
      currentResponses,
      lateResponses: closed ? Math.max(0, currentResponses - (state.closedCount || 0)) : 0,
      timerEndsAt: state.timerEndsAt ? state.timerEndsAt.toISOString() : null,
      timerStartedAt: state.timerStartedAt ? state.timerStartedAt.toISOString() : null
    }]
  };
}

function closeDashboardSession(sessionId) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  return closeDashboardSessionAt_(id, new Date());
}

function startDashboardSessionTimer(sessionId, durationMinutes) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  const minutes = Number(durationMinutes);
  if (!isFinite(minutes) || minutes <= 0 || minutes > 10080) {
    throw new Error('Thời gian phải lớn hơn 0 và không quá 10.080 phút (7 ngày).');
  }
  const spreadsheet = openDashboardSpreadsheet_();
  const controlSheet = ensureDashboardControlSheet_(spreadsheet);
  const existing = controlSheet.getRange(id + 1, 2, 1, 4).getValues()[0];
  if (String(existing[0] || '').toUpperCase() === 'CLOSED') {
    throw new Error(`Phiên ${id} đã chốt. Hãy mở lại trước khi đặt đếm ngược mới.`);
  }
  const startedAt = new Date();
  const closeAt = new Date(startedAt.getTime() + minutes * 60000);
  controlSheet.getRange(id + 1, 2, 1, 4).setValues([['TIMED', closeAt, '', startedAt]]);
  clearDashboardCache_();
  return { ok: true, sessionId: id, phase: 'TIMED', durationMinutes: minutes, timerStartedAt: startedAt.toISOString(), timerEndsAt: closeAt.toISOString() };
}

function reopenDashboardSession(sessionId) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  const spreadsheet = openDashboardSpreadsheet_();
  const controlSheet = ensureDashboardControlSheet_(spreadsheet);
  controlSheet.getRange(id + 1, 2, 1, 4).setValues([['NOT_STARTED', '', '', '']]);
  clearDashboardCache_();
  return { ok: true, sessionId: id, phase: 'NOT_STARTED' };
}

/** Chạy bằng trigger mỗi phút; cutoff vẫn dùng đúng mốc tuyệt đối đã lưu. */
function processExpiredDashboardTimers() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { ok: false, message: 'Đang có tiến trình chốt phiên khác.' };
  try {
    const spreadsheet = openDashboardSpreadsheet_();
    const controlSheet = ensureDashboardControlSheet_(spreadsheet);
    const values = controlSheet.getRange(2, 1, SESSION_CONFIG.length, CONTROL_HEADERS.length).getValues();
    const now = new Date();
    const closed = [];
    values.forEach((row, index) => {
      if (String(row[1] || '').toUpperCase() !== 'TIMED') return;
      const closeAt = toDate_(row[2]);
      if (!closeAt || closeAt.getTime() > now.getTime()) return;
      const id = index + 1;
      const responseSheet = spreadsheet.getSheetByName(`Phiên ${id}`);
      if (!responseSheet) return;
      const count = countResponseRowsAtOrBefore_(responseSheet, closeAt);
      controlSheet.getRange(id + 1, 2, 1, 4).setValues([['CLOSED', closeAt, count, row[4] || '']]);
      clearPublicTopForSession_(spreadsheet, id);
      try { taoTabGeminiReview_(spreadsheet, id); } catch (e) { Logger.log('Không thể tạo tab _GEMINI_REVIEW: ' + e); }
      closed.push({ sessionId: id, closedAt: closeAt.toISOString(), totalResponses: count });
    });
    if (closed.length) clearDashboardCache_();
    return { ok: true, closed };
  } finally {
    lock.releaseLock();
  }
}

function closeDashboardSessionAt_(id, closeAt) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const spreadsheet = openDashboardSpreadsheet_();
    const controlSheet = ensureDashboardControlSheet_(spreadsheet);
    const existing = controlSheet.getRange(id + 1, 2, 1, 4).getValues()[0];
    const isClosed = String(existing[0] || '').toUpperCase() === 'CLOSED';
    
    const responseSheet = spreadsheet.getSheetByName(`Phiên ${id}`);
    const count = responseSheet ? countResponseRowsAtOrBefore_(responseSheet, closeAt) : (Number(existing[2]) || 0);
    
    if (!isClosed) {
      controlSheet.getRange(id + 1, 2, 1, 4).setValues([['CLOSED', closeAt, count, existing[3] || '']]);
    }
    // Xóa kết quả của lượt chấm trước. Top chỉ xuất hiện lại khi Gemini chấm
    // hoàn tất và ghi mới vào _PUBLIC_TOP.
    clearPublicTopForSession_(spreadsheet, id);
    
    clearDashboardCache_();
    return { ok: true, alreadyClosed: isClosed, sessionId: id, phase: 'CLOSED', closedAt: closeAt.toISOString(), totalResponses: count };
  } finally {
    lock.releaseLock();
  }
}

// Tách phần tạo công thức Gemini khỏi thao tác chốt để dashboard chuyển trạng
// thái ngay. Admin.html gọi hàm này sau khi đã nhận kết quả chốt thành công.
function prepareGeminiReviewForClosedSession(sessionId) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  if ([3, 5, 6, 7, 8].indexOf(id) < 0) return { ok: true, skipped: true, sessionId: id };
  const spreadsheet = openDashboardSpreadsheet_();
  const state = getDashboardControl_(spreadsheet)[id];
  if (!state || state.status !== 'CLOSED') throw new Error(`Phiên ${id} chưa được chốt.`);
  taoTabGeminiReview_(spreadsheet, id);
  return { ok: true, sessionId: id, reviewPrepared: true };
}

function publishGeminiTopIfReady(sessionId) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  return capNhatTabPublicTop_(openDashboardSpreadsheet_(), id) || { ok: false, pending: true, sessionId: id };
}

function kiemTraTrangThaiGeminiPhien3() {
  assertAdmin_();
  const sheet = openDashboardSpreadsheet_().getSheetByName('_GEMINI_REVIEW');
  if (!sheet || sheet.getLastRow() < 2) return { tong: 0, hopLe: 0, dangCho: 0, loiNgonNgu: 0 };
  const results = sheet.getRange(2, 9, sheet.getLastRow() - 1, 1).getDisplayValues().flat();
  const formulas = sheet.getRange(2, 9, sheet.getLastRow() - 1, 1).getFormulas().flat();
  const report = {
    tong: results.length,
    hopLe: results.filter(value => /Y1\s*=\s*[01]/i.test(String(value))).length,
    dangCho: results.filter(value => !String(value || '').trim()).length,
    loiNgonNgu: results.filter(value => /language entered is not supported/i.test(String(value))).length,
    congThucDangChuoi: results.filter(value => /^=AI\(/i.test(String(value).trim())).length
  };
  Logger.log(JSON.stringify({ report: report, mauKetQua: results.slice(0, 5), mauCongThuc: formulas.slice(0, 5) }));
  return report;
}

function capNhatPromptGeminiPhien3() {
  assertAdmin_();
  const spreadsheet = openDashboardSpreadsheet_();
  const sheet = spreadsheet.getSheetByName('_GEMINI_REVIEW');
  if (!sheet || sheet.getLastRow() < 2 || Number(sheet.getRange(2, 1).getValue()) !== 3) {
    throw new Error('Tab _GEMINI_REVIEW hiện không chứa dữ liệu Phiên 3.');
  }
  const prompt = getGeminiEssayPrompt_(3);
  const rowCount = sheet.getLastRow() - 1;
  sheet.getRange(2, 8, rowCount, 1).setValues(Array.from({ length: rowCount }, () => [prompt]));
  SpreadsheetApp.flush();
  return { ok: true, sessionId: 3, rowsUpdated: rowCount };
}

function donGianHoaTabGeminiReview() {
  assertAdmin_();
  const spreadsheet = openDashboardSpreadsheet_();
  const sheet = spreadsheet.getSheetByName('_GEMINI_REVIEW');
  if (!sheet || sheet.getLastRow() < 1) throw new Error('Không tìm thấy tab _GEMINI_REVIEW.');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const removableColumns = headers
    .map((header, index) => ({ normalized: normalizeLookup_(header), column: index + 1 }))
    .filter(item => item.normalized === 'trang thai' || item.normalized === 'so loi nghiem trong')
    .sort((a, b) => b.column - a.column);
  removableColumns.forEach(item => sheet.deleteColumn(item.column));

  const sessionId = sheet.getLastRow() >= 2 ? Number(sheet.getRange(2, 1).getValue()) : 0;
  if ([3, 5, 7, 8].indexOf(sessionId) >= 0 && sheet.getLastRow() >= 2) {
    const prompt = getGeminiEssayPrompt_(sessionId);
    const rowCount = sheet.getLastRow() - 1;
    sheet.getRange(2, 8, rowCount, 1).setValues(Array.from({ length: rowCount }, () => [prompt]));
  }
  formatGeminiReviewSheet_(sheet, sheet.getLastRow(), sessionId);
  SpreadsheetApp.flush();
  return { ok: true, sessionId, removedColumns: removableColumns.map(item => item.column) };
}

function getGeminiEssayPrompt_(id) {
  const semanticRule = 'Grade EACH teacher criterion independently. Set Y=1 when the student states the correct core idea verbatim, with synonyms, common abbreviations, or an equivalent paraphrase. Exact keyword matching, complete sentences, and the same order are not required. One criterion must not affect another. Set Y=0 only when the core idea is truly absent, wrong, or contradictory. Treat 12 months as equivalent to the full year. ';
  const promptMap = {
    3: 'You are grading a short case-study answer written in Vietnamese. Column F is the student answer and column G contains exactly three teacher criteria. Grade each criterion independently by meaning, using a lenient but consistent rule. Award Y=1 when the answer clearly identifies the central missing topic, even if it omits supporting details, figures, the approving authority, or exact wording; do not require a complete reproduction of the reference. For Y1, mentioning a missing explanation for the budget estimate is sufficient. For Y2, mentioning a missing approved settlement or a missing explanation for the settlement is sufficient. Award Y3 only when the answer identifies the required publication milestones of 03, 06, 09 months and the year, or an unambiguous equivalent; saying only quarterly is not sufficient. Do not infer a criterion that is not mentioned. Return exactly: Y1=0/1; Y2=0/1; Y3=0/1; NHAN_XET=concise feedback in Vietnamese under 35 words.',
    5: semanticRule + 'Compare the answer in column F with exactly 2 criteria in column G. Return exactly: Y1=0/1; Y2=0/1; NHAN_XET=concise Vietnamese feedback under 35 words.',
    7: semanticRule + 'Compare the answer in column F with exactly 2 criteria in column G. Return exactly: Y1=0/1; Y2=0/1; NHAN_XET=concise Vietnamese feedback under 35 words.',
    8: semanticRule + 'Compare the answer in column F with exactly 4 criteria in column G. Return exactly: Y1=0/1; Y2=0/1; Y3=0/1; Y4=0/1; NHAN_XET=concise Vietnamese feedback under 35 words.'
  };
  return promptMap[Number(id)] || 'Compare the student answer in column F with the teacher criteria in column G.';
}

function taoTabGeminiReview_(spreadsheet, id) {
  if ([3, 5, 6, 7, 8].indexOf(Number(id)) < 0) return;
  const config = SESSION_CONFIG.find(item => item.id === Number(id));
  if (!config) return;
  const sourceSheet = spreadsheet.getSheetByName(config.name);

  let reviewSheet = spreadsheet.getSheetByName('_GEMINI_REVIEW');
  if (!reviewSheet) {
    reviewSheet = spreadsheet.insertSheet('_GEMINI_REVIEW');
  } else {
    reviewSheet.clear();
  }

  const values = (sourceSheet && sourceSheet.getLastRow() >= 2) ? sourceSheet.getDataRange().getDisplayValues() : [];
  const headers = values.shift() || [];
  const rows = values.filter(row => row.some(cell => String(cell).trim() !== ''));

  if (Number(id) === 6) {
    const reviewHeaders = ['ID Phiên', 'ID Bài', 'Họ và tên', 'Đơn vị', 'Thời điểm nộp', 'Bảy lựa chọn', 'Bảy giải thích', 'Căn cứ giáo viên', 'Điểm Đúng/Sai', 'Kết quả AI', 'Số giải thích đạt', 'Nhận xét AI (Rõ nét)'];
    const referenceNotes = config.referenceNotes || [];
    const correctAnswers = config.correctAnswers || [];
    const questionIndexes = config.questionIndexes || [];
    const explanationIndexes = config.explanationIndexes || [];

    const outputRows = [reviewHeaders];
    rows.forEach((row, index) => {
      const timestamp = row[0] || '';
      const name = row[1] || `Học viên ${index + 1}`;
      const unit = row[2] || '';
      const choices = questionIndexes.map(col => String(row[col] || '').trim()).join('; ');
      const explanations = explanationIndexes.map((col, qIdx) => `Câu ${qIdx + 1}: ${String(row[col] || '').trim()}`).join('\n');
      const references = referenceNotes.map((note, qIdx) => `Câu ${qIdx + 1}: ${note}`).join('\n');

      const prompt = `Grade each explanation independently against the teacher reference. Set E=1 when the student states the correct core idea verbatim or with an equivalent paraphrase; exact keyword matching and complete sentences are not required. Set E=0 only when the core idea is absent, contradictory, or incorrect. Do not lower other items because one item is wrong. Return exactly: E1=0/1; E2=0/1; E3=0/1; E4=0/1; E5=0/1; E6=0/1; E7=0/1; NHAN_XET=concise Vietnamese feedback under 45 words.`;

      outputRows.push([
        id, index + 1, name, unit, timestamp,
        choices, explanations, references + '\n---\nPrompt:\n' + prompt,
        '', '', '', ''
      ]);
    });
    reviewSheet.getRange(1, 1, outputRows.length, reviewHeaders.length).setValues(outputRows);
    if (outputRows.length > 1) {
      const formulaRows = outputRows.slice(1).map((row, index) => {
        const rowIdx = index + 2;
        return [
          `=AI(H${rowIdx}, F${rowIdx}:G${rowIdx})`,
          `=IFERROR(VALUE(REGEXEXTRACT(J${rowIdx}, "E1=(\\d)")) + VALUE(REGEXEXTRACT(J${rowIdx}, "E2=(\\d)")) + VALUE(REGEXEXTRACT(J${rowIdx}, "E3=(\\d)")) + VALUE(REGEXEXTRACT(J${rowIdx}, "E4=(\\d)")) + VALUE(REGEXEXTRACT(J${rowIdx}, "E5=(\\d)")) + VALUE(REGEXEXTRACT(J${rowIdx}, "E6=(\\d)")) + VALUE(REGEXEXTRACT(J${rowIdx}, "E7=(\\d)")), "") & "/7"`,
          `=IFERROR(REGEXEXTRACT(J${rowIdx}, "NHAN_XET=(.+)"), J${rowIdx})`
        ];
      });
      reviewSheet.getRange(2, 10, formulaRows.length, 3).setFormulas(formulaRows);
    }
    formatGeminiReviewSheet_(reviewSheet, outputRows.length, 6);
  } else {
    const reviewHeaders = ['ID Phiên', 'ID Bài', 'Họ và tên', 'Đơn vị', 'Thời điểm nộp', 'Bài làm', 'Ý chuẩn giáo viên', 'Prompt Gemini', 'Kết quả AI', 'Số ý đạt', 'Nhận xét AI (Rõ nét)'];
    const referenceAnswers = Array.isArray(config.referenceAnswer) ? config.referenceAnswer.join('\n') : String(config.referenceAnswer || '');
    const promptText = getGeminiEssayPrompt_(id);
    const totalCriteria = id === 8 ? 4 : id === 3 ? 3 : 2;

    const resolvedConfig = resolveColumns_(headers, config);
    const outputRows = [reviewHeaders];
    rows.forEach((row, index) => {
      const timestamp = row[0] || '';
      const name = row[1] || `Học viên ${index + 1}`;
      const unit = row[2] || '';
      const essay = String(row[resolvedConfig.answerIndex] || '').trim();

      outputRows.push([
        id, index + 1, name, unit, timestamp,
        essay, referenceAnswers, promptText,
        '', '', ''
      ]);
    });
    reviewSheet.getRange(1, 1, outputRows.length, reviewHeaders.length).setValues(outputRows);
    if (outputRows.length > 1) {
      const formulaRows = outputRows.slice(1).map((row, index) => {
        const rowIdx = index + 2;
        const sumParts = [];
        for (let c = 1; c <= totalCriteria; c++) {
          sumParts.push(`IFERROR(VALUE(REGEXEXTRACT(I${rowIdx}, "Y${c}=(\\d)")), 0)`);
        }
        return [
          `=AI(H${rowIdx}, F${rowIdx}:G${rowIdx})`,
          `=IFERROR(${sumParts.join(' + ')}, "") & "/${totalCriteria}"`,
          `=IFERROR(REGEXEXTRACT(I${rowIdx}, "NHAN_XET=(.+)"), I${rowIdx})`
        ];
      });
      reviewSheet.getRange(2, 9, formulaRows.length, 3).setFormulas(formulaRows);
    }
    formatGeminiReviewSheet_(reviewSheet, outputRows.length, id);
  }
}

function formatGeminiReviewSheet_(reviewSheet, numRows, sessionId) {
  if (!reviewSheet || numRows < 1) return;
  const isTrueFalseSession = Number(sessionId) === 6;
  const totalCols = isTrueFalseSession ? 12 : 11;
  const resultColumn = isTrueFalseSession ? 10 : 9;
  const scoreColumn = isTrueFalseSession ? 11 : 10;
  const feedbackColumn = isTrueFalseSession ? 12 : 11;
  
  // 1. Unhide all columns first then hide Column H (Prompt Gemini)
  reviewSheet.showColumns(1, totalCols);
  reviewSheet.hideColumns(8); // Ẩn cột Prompt Gemini để bảng đỡ rối
  
  // 2. Format Header Row
  const headerRange = reviewSheet.getRange(1, 1, 1, totalCols);
  headerRange.setFontWeight('bold')
    .setBackground('#1b365d')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  reviewSheet.setRowHeight(1, 38);
  reviewSheet.setFrozenRows(1);
  
  // 3. Set Column Widths
  const widths = isTrueFalseSession
    ? [60, 60, 160, 160, 140, 260, 320, 300, 110, 220, 100, 350]
    : [60, 60, 160, 160, 140, 320, 280, 200, 220, 80, 350];
  widths.forEach((w, colIdx) => reviewSheet.setColumnWidth(colIdx + 1, w));
  
  // 4. Set Text Wrapping, Formatting & Colors for Data Rows
  if (numRows > 1) {
    const dataRange = reviewSheet.getRange(2, 1, numRows - 1, totalCols);
    dataRange.setVerticalAlignment('top').setFontSize(10);
    
    // Nội dung dài, kết quả AI và nhận xét được xuống dòng.
    [6, 7, 8, resultColumn, feedbackColumn].forEach(colIdx => {
      reviewSheet.getRange(2, colIdx, numRows - 1, 1).setWrap(true);
    });
    
    // Highlight Column I (Kết quả AI Gốc) with soft gray background
    reviewSheet.getRange(2, resultColumn, numRows - 1, 1).setBackground('#f1f3f4').setFontSize(9).setFontColor('#5f6368');
    
    // HIGHLIGHT COL L (NHẬN XÉT AI RÕ NÉT FOR GIẢNG VIÊN) WITH BOLD GREEN/TEAL FONT & SOFT MINT BACKGROUND
    const feedbackRange = reviewSheet.getRange(2, feedbackColumn, numRows - 1, 1);
    feedbackRange.setBackground('#e6f4ea')
      .setFontWeight('bold')
      .setFontSize(11)
      .setFontColor('#137333');
      
    // Highlight Column J (Số ý đạt) with soft blue
    reviewSheet.getRange(2, scoreColumn, numRows - 1, 1).setFontWeight('bold').setFontSize(11).setBackground('#e8f0fe');
    
    // Alignments
    [1, 2, 5, scoreColumn].concat(isTrueFalseSession ? [9] : []).forEach(colIdx => {
      reviewSheet.getRange(2, colIdx, numRows - 1, 1).setHorizontalAlignment('center');
    });
  }
  
  // Không cập nhật _PUBLIC_TOP ở đây: công thức AI vừa được đặt và chưa chắc
  // đã hoàn tất. Bước chấm AI sẽ gọi capNhatTabPublicTop_ sau cùng.
}

function clearPublicTopForSession_(spreadsheet, sessionId) {
  const sheet = spreadsheet.getSheetByName('_PUBLIC_TOP');
  if (!sheet || sheet.getLastRow() < 2) return;
  const rows = sheet.getDataRange().getValues();
  const header = rows.shift();
  const retained = rows.filter(row => Number(row[0]) !== Number(sessionId));
  sheet.clearContents();
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
  if (retained.length) sheet.getRange(2, 1, retained.length, header.length).setValues(retained);
}

function capNhatTabPublicTop_(spreadsheet, sessionId) {
  const id = Number(sessionId);
  if ([3, 5, 6, 7, 8].indexOf(id) < 0) return;
  const config = SESSION_CONFIG.find(item => item.id === id);
  if (!config) return;

  const reviewSheet = spreadsheet.getSheetByName('_GEMINI_REVIEW');
  if (!reviewSheet || reviewSheet.getLastRow() < 2) return;

  const values = reviewSheet.getDataRange().getDisplayValues();
  values.shift(); // Remove header row

  const sessionRows = values.filter(row => Number(row[0]) === id);
  if (!sessionRows.length) return;

  // Công thức =AI có thể đang xử lý. Nếu còn bất kỳ bài nào chưa nhận chuỗi
  // kết quả hợp lệ, không được công bố Top N tạm với điểm 0/3.
  const resultColumn = id === 6 ? 9 : 8;
  const requiredMarkers = id === 6
    ? ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7']
    : Array.from({ length: id === 8 ? 4 : id === 3 ? 3 : 2 }, (_, index) => `Y${index + 1}`);
  const hasAllAiScores = value => requiredMarkers.every(marker =>
    new RegExp(`${marker}\\s*=\\s*[01]`, 'i').test(String(value || ''))
  );
  const pendingCount = sessionRows.filter(row => !hasAllAiScores(row[resultColumn])).length;
  if (pendingCount) {
    clearPublicTopForSession_(spreadsheet, id);
    clearDashboardCache_();
    return { ok: false, pending: true, sessionId: id, pendingCount };
  }

  const referenceAnswers = Array.isArray(config.referenceAnswer) ? config.referenceAnswer : [String(config.referenceAnswer || '')];
  const participantMeta = getFirstParticipantMeta_(spreadsheet, config);

  const parsedItems = sessionRows.map((row, sourceOrder) => {
    const name = String(row[2] || '').trim();
    const unit = String(row[3] || '').trim();
    const submittedAt = String(row[4] || '').trim();
    const submittedDate = parseDisplayTimestamp_(submittedAt);
    const submittedAtValue = submittedDate ? submittedDate.getTime() : Number.MAX_SAFE_INTEGER - sessionRows.length + sourceOrder;
    const participantKey = normalizeLookup_(name) + '|' + normalizeLookup_(unit);
    const position = participantMeta[participantKey] ? participantMeta[participantKey].position : '';
    const essay = String(row[5] || '').trim();
    const rawResultAI = String(row[resultColumn] || '').trim();
    const displayFeedback = String(row[id === 6 ? 11 : 10] || '').trim();

    if (id === 6) {
      let eMatched = [];
      for (let k = 1; k <= 7; k++) {
        const m = rawResultAI.match(new RegExp('E' + k + '=(\\d)'));
        eMatched.push(m ? Number(m[1]) === 1 : false);
      }
      const numMatched = eMatched.filter(Boolean).length;
      const score = numMatched * 10;
      return { name, unit, position, submittedAt, submittedAtValue, sourceOrder, score, scoreChoice: '70/70', scoreExplanation: `${numMatched * 10}/70`, feedback: displayFeedback || rawResultAI, raw: row };
    }

    const totalCriteria = id === 8 ? 4 : id === 3 ? 3 : 2;
    let yMatched = [];
    for (let k = 1; k <= totalCriteria; k++) {
      const m = rawResultAI.match(new RegExp('Y' + k + '=(\\d)'));
      yMatched.push(m ? Number(m[1]) === 1 : false);
    }
    const numMatched = yMatched.filter(Boolean).length;

    const score = numMatched * 10;

    const matchedItems = referenceAnswers.map((criteriaText, idx) => ({
      label: criteriaText,
      matched: Boolean(yMatched[idx])
    }));

    return {
      name,
      unit,
      position,
      submittedAt,
      submittedAtValue,
      sourceOrder,
      score,
      scoreText: `Đạt ${numMatched}/${totalCriteria} ý chuẩn`,
      essay,
      matchedItemsJson: JSON.stringify(matchedItems),
      referenceAnswer: referenceAnswers.join('\n'),
      aiFeedback: displayFeedback || rawResultAI,
      criticalErrors: 0
    };
  });

  const firstAttemptByPerson = {};
  parsedItems.filter(item => item.name).forEach(item => {
    const key = normalizeLookup_(item.name) + '|' + normalizeLookup_(item.unit);
    const current = firstAttemptByPerson[key];
    if (!current || item.submittedAtValue < current.submittedAtValue ||
        (item.submittedAtValue === current.submittedAtValue && item.sourceOrder < current.sourceOrder)) {
      firstAttemptByPerson[key] = item;
    }
  });
  const top10 = Object.keys(firstAttemptByPerson).map(key => firstAttemptByPerson[key])
    .sort((a, b) => b.score - a.score || a.submittedAtValue - b.submittedAtValue || a.name.localeCompare(b.name, 'vi'))
    .slice(0, 10);

  let publicTopSheet = spreadsheet.getSheetByName('_PUBLIC_TOP');
  if (!publicTopSheet) {
    publicTopSheet = spreadsheet.insertSheet('_PUBLIC_TOP');
  }

  const FIXED_HEADER = ['ID Phiên', 'Rank', 'Họ và tên', 'Đơn vị', 'Thời điểm nộp', 'Điểm/Số ý', 'Bài làm', 'Các ý chuẩn (JSON)', 'Đáp án tham chiếu', 'Nhận xét AI', 'Lỗi nghiêm trọng', 'Chức vụ'];
  const NUM_COLS = FIXED_HEADER.length;
  
  const existingValues = publicTopSheet.getLastRow() >= 2 ? publicTopSheet.getDataRange().getValues() : [];
  
  // Lấy các dòng của phiên khác, padding thành 11 cột nếu thiếu
  const otherSessionsRows = existingValues.slice(1)
    .filter(r => Number(r[0]) !== id)
    .map(r => { while (r.length < NUM_COLS) r.push(''); return r.slice(0, NUM_COLS); });

  const newTopRows = top10.map((item, idx) => [
    id,
    idx + 1,
    item.name,
    item.unit,
    item.submittedAt,
    item.scoreText || item.scoreChoice || '',
    item.essay || '',
    item.matchedItemsJson || JSON.stringify(item.questionDetails || []),
    item.referenceAnswer || '',
    item.aiFeedback || '',
    item.criticalErrors || 0,
    item.position || ''
  ]);

  publicTopSheet.clear();
  const finalRows = [FIXED_HEADER, ...otherSessionsRows, ...newTopRows];
  publicTopSheet.getRange(1, 1, finalRows.length, NUM_COLS).setValues(finalRows);
  try { publicTopSheet.hideSheet(); } catch (e) {}
  clearDashboardCache_();
  return { ok: true, sessionId: id, total: newTopRows.length };
}

function getFirstParticipantMeta_(spreadsheet, config) {
  const sheet = spreadsheet.getSheetByName(config.name);
  if (!sheet || sheet.getLastRow() < 2) return {};
  const range = sheet.getDataRange();
  const displayRows = range.getDisplayValues();
  const rawRows = range.getValues();
  const headers = displayRows.shift() || [];
  rawRows.shift();
  const normalizedHeaders = headers.map(header => normalizeLookup_(header));
  const nameIndexes = normalizedHeaders.map((value, index) => ({ value, index })).filter(item => /^ho va ten(?:\s|$)/.test(item.value)).map(item => item.index);
  const unitIndexes = normalizedHeaders.map((value, index) => ({ value, index })).filter(item => /^don vi(?:\s|$)/.test(item.value)).map(item => item.index);
  const positionIndexes = normalizedHeaders.map((value, index) => ({ value, index })).filter(item => /chuc vu|vi tri|chuc danh/.test(item.value)).map(item => item.index);
  const result = {};
  displayRows.forEach((row, index) => {
    const name = lastNonEmptyField_(row, nameIndexes);
    const unit = lastNonEmptyField_(row, unitIndexes);
    if (!name) return;
    const date = toDate_(rawRows[index] && rawRows[index][0]) || parseDisplayTimestamp_(row[0]);
    const time = date ? date.getTime() : Number.MAX_SAFE_INTEGER - displayRows.length + index;
    const key = normalizeLookup_(name) + '|' + normalizeLookup_(unit);
    if (!result[key] || time < result[key].time) {
      result[key] = { time, position: positionIndexes.length ? lastNonEmptyField_(row, positionIndexes) : '' };
    }
  });
  return result;
}

/**
 * CÁC HÀM TIỆN ÍCH CHẠY TRỰC TIẾP TRÊN APPS SCRIPT EDITOR ĐỂ TẠO TAB _GEMINI_REVIEW & CẬP NHẬT TOP N:
 */
function taoTabGeminiReviewPhien3() {
  const spreadsheet = openDashboardSpreadsheet_();
  taoTabGeminiReview_(spreadsheet, 3);
  clearPublicTopForSession_(spreadsheet, 3);
  clearDashboardCache_();
  Logger.log('Đã tạo tab _GEMINI_REVIEW Phiên 3. Chỉ chạy capNhatPublicTopPhien3 sau khi Gemini chấm xong toàn bộ.');
}

function taoTabGeminiReviewPhien5() {
  const spreadsheet = openDashboardSpreadsheet_();
  taoTabGeminiReview_(spreadsheet, 5);
  clearPublicTopForSession_(spreadsheet, 5);
  clearDashboardCache_();
}

function taoTabGeminiReviewPhien6() {
  const spreadsheet = openDashboardSpreadsheet_();
  taoTabGeminiReview_(spreadsheet, 6);
  clearPublicTopForSession_(spreadsheet, 6);
  clearDashboardCache_();
}

function taoTabGeminiReviewPhien7() {
  const spreadsheet = openDashboardSpreadsheet_();
  taoTabGeminiReview_(spreadsheet, 7);
  clearPublicTopForSession_(spreadsheet, 7);
  clearDashboardCache_();
}

function taoTabGeminiReviewPhien8() {
  const spreadsheet = openDashboardSpreadsheet_();
  taoTabGeminiReview_(spreadsheet, 8);
  clearPublicTopForSession_(spreadsheet, 8);
  clearDashboardCache_();
}

function capNhatPublicTopTatCaPhien() {
  const spreadsheet = openDashboardSpreadsheet_();
  [3, 5, 6, 7, 8].forEach(id => capNhatTabPublicTop_(spreadsheet, id));
  Logger.log('Đã cập nhật bảng Vinh danh _PUBLIC_TOP cho tất cả các phiên!');
}

// Trigger mỗi phút: khi công thức Gemini đã trả đủ điểm, tự công bố Top.
// Không ghi bất kỳ Top tạm nào trong thời gian AI còn đang xử lý.
function processPendingGeminiReviews() {
  const spreadsheet = openDashboardSpreadsheet_();
  const control = getDashboardControl_(spreadsheet);
  [3, 5, 6, 7, 8].forEach(id => {
    if (control[id] && control[id].status === 'CLOSED') {
      try { capNhatTabPublicTop_(spreadsheet, id); } catch (e) { Logger.log(`Chờ Gemini Phiên ${id}: ${e}`); }
    }
  });
}

function ensureDashboardTimerTrigger_() {
  const handler = 'processExpiredDashboardTimers';
  const exists = ScriptApp.getProjectTriggers().some(trigger => trigger.getHandlerFunction() === handler);
  if (!exists) ScriptApp.newTrigger(handler).timeBased().everyMinutes(1).create();
  const reviewHandler = 'processPendingGeminiReviews';
  const reviewExists = ScriptApp.getProjectTriggers().some(trigger => trigger.getHandlerFunction() === reviewHandler);
  if (!reviewExists) ScriptApp.newTrigger(reviewHandler).timeBased().everyMinutes(1).create();
}

function createSessionReport(sessionId) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  return createReportWorkbook_([id], `BAO_CAO_KET_QUA_PHIEN_${id}`);
}

function createAllSessionsReport() {
  assertAdmin_();
  return createReportWorkbook_(SESSION_CONFIG.map(config => config.id), 'BAO_CAO_KET_QUA_09_PHIEN');
}

function createReportWorkbook_(sessionIds, baseName) {
  const source = openDashboardSpreadsheet_();
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  const target = SpreadsheetApp.create(`${baseName}_${stamp}`);
  const defaultSheet = target.getSheets()[0];

  sessionIds.forEach((id, index) => {
    const sourceSheet = source.getSheetByName(`Phiên ${id}`);
    if (!sourceSheet) throw new Error(`Không tìm thấy tab Phiên ${id}.`);
    const targetSheet = index === 0 ? defaultSheet : target.insertSheet();
    targetSheet.setName(`Phiên ${id}`);
    copyVisibleColumns_(sourceSheet, targetSheet);
    formatReportSheet_(targetSheet);
  });

  SpreadsheetApp.flush();
  const id = target.getId();
  return {
    ok: true,
    name: target.getName(),
    fileUrl: target.getUrl(),
    downloadUrl: `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`
  };
}

function copyVisibleColumns_(sourceSheet, targetSheet) {
  const lastRow = Math.max(1, sourceSheet.getLastRow());
  const lastColumn = sourceSheet.getLastColumn();
  const visibleColumns = [];
  for (let column = 1; column <= lastColumn; column += 1) {
    if (!sourceSheet.isColumnHiddenByUser(column)) visibleColumns.push(column);
  }
  if (!visibleColumns.length) throw new Error(`${sourceSheet.getName()} không có cột hiển thị để xuất.`);
  const sourceValues = sourceSheet.getRange(1, 1, lastRow, lastColumn).getDisplayValues();
  const values = sourceValues.map(row => visibleColumns.map(column => row[column - 1]));
  ensureSheetSize_(targetSheet, values.length, visibleColumns.length);
  targetSheet.getRange(1, 1, values.length, visibleColumns.length).setValues(values);
}

function formatReportSheet_(sheet) {
  const lastRow = Math.max(1, sheet.getLastRow());
  const lastColumn = Math.max(1, sheet.getLastColumn());
  const range = sheet.getRange(1, 1, lastRow, lastColumn);
  sheet.clearFormats();
  sheet.setHiddenGridlines(true);
  sheet.setFrozenRows(1);
  sheet.setTabColor(null);
  range
    .setBackground('#ffffff')
    .setFontColor('#000000')
    .setFontFamily('Arial')
    .setFontSize(10)
    .setVerticalAlignment('top')
    .setWrap(true)
    .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange(1, 1, 1, lastColumn)
    .setBackground('#000000')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, lastColumn).setHorizontalAlignment('left');
  if (lastRow > 1 && !sheet.getFilter()) sheet.getRange(1, 1, lastRow, lastColumn).createFilter();
  sheet.autoResizeColumns(1, lastColumn);
  for (let column = 1; column <= lastColumn; column += 1) {
    const width = sheet.getColumnWidth(column);
    sheet.setColumnWidth(column, Math.min(420, Math.max(110, width)));
  }
  sheet.setRowHeight(1, 36);
}

function ensureSheetSize_(sheet, rows, columns) {
  if (sheet.getMaxRows() < rows) sheet.insertRowsAfter(sheet.getMaxRows(), rows - sheet.getMaxRows());
  if (sheet.getMaxColumns() < columns) sheet.insertColumnsAfter(sheet.getMaxColumns(), columns - sheet.getMaxColumns());
}

function ensureDashboardControlSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(CONTROL_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(CONTROL_SHEET_NAME);
  ensureSheetSize_(sheet, SESSION_CONFIG.length + 1, CONTROL_HEADERS.length);
  sheet.getRange(1, 1, 1, CONTROL_HEADERS.length).setValues([CONTROL_HEADERS]);
  const statusRange = sheet.getRange(2, 2, SESSION_CONFIG.length, 1);
  // Xóa rule cũ (LIVE/CLOSED) trước khi ghi trạng thái mới để tránh lỗi xác thực ô B2:B10.
  statusRange.clearDataValidations();
  const existing = sheet.getRange(2, 1, SESSION_CONFIG.length, CONTROL_HEADERS.length).getValues();
  const values = SESSION_CONFIG.map((config, index) => {
    const row = existing[index] || [];
    const rawStatus = String(row[1] || '').toUpperCase();
    const status = rawStatus === 'CLOSED' || rawStatus === 'TIMED' ? rawStatus : 'NOT_STARTED';
    return [config.name, status, row[2] || '', row[3] || '', row[4] || ''];
  });
  sheet.getRange(2, 1, values.length, CONTROL_HEADERS.length).setValues(values);
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['NOT_STARTED', 'TIMED', 'CLOSED'], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);
  sheet.getRange(1, 1, 1, CONTROL_HEADERS.length).setFontWeight('bold').setBackground('#000000').setFontColor('#ffffff');
  sheet.getRange(2, 3, values.length, 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  sheet.setFrozenRows(1);
  sheet.hideSheet();
  return sheet;
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

function countResponseRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  return sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getDisplayValues()
    .filter(row => row.some(value => String(value).trim() !== '')).length;
}

function countResponseRowsAtOrBefore_(sheet, cutoff) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const lastColumn = sheet.getLastColumn();
  const range = sheet.getRange(2, 1, lastRow - 1, lastColumn);
  const rawRows = range.getValues();
  const displayRows = range.getDisplayValues();
  return displayRows.filter((row, index) =>
    row.some(value => String(value).trim() !== '') &&
    isAtOrBeforeCutoff_(rawRows[index][0], row[0], cutoff)
  ).length;
}

function validateSessionId_(sessionId) {
  const id = Number(sessionId);
  if (!Number.isInteger(id) || id < 1 || id > 9) throw new Error('Phiên không hợp lệ.');
  return id;
}

function assertAdmin_() {
  const email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  const allowed = String(PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS') || '')
    .split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  if (!email || allowed.indexOf(email) < 0) throw new Error('Bạn chưa được cấp quyền điều khiển hoặc xuất báo cáo.');
  return email;
}

function clearDashboardCache_() {
  CacheService.getScriptCache().remove('dashboard-v5');
  CacheService.getScriptCache().remove('dashboard-v6');
  CacheService.getScriptCache().remove('dashboard-v7');
}
