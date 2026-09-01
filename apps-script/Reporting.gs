const CONTROL_HEADERS = ['Phiên', 'Trạng thái', 'Thời gian chốt', 'Số bài lúc chốt'];

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
  clearDashboardCache_();
  return {
    ok: true,
    controlSheet: sheet.getName(),
    adminEmail: email || '',
    message: 'Đã khởi tạo bảng điều khiển 09 phiên.'
  };
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
      lateResponses: session.lateResponses
    }))
  };
}

function closeDashboardSession(sessionId) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  const spreadsheet = openDashboardSpreadsheet_();
  const controlSheet = ensureDashboardControlSheet_(spreadsheet);
  const responseSheet = spreadsheet.getSheetByName(`Phiên ${id}`);
  if (!responseSheet) throw new Error(`Không tìm thấy tab Phiên ${id}.`);
  const count = countResponseRows_(responseSheet);
  const now = new Date();
  controlSheet.getRange(id + 1, 2, 1, 3).setValues([['CLOSED', now, count]]);
  clearDashboardCache_();
  return { ok: true, sessionId: id, phase: 'CLOSED', closedAt: now.toISOString(), totalResponses: count };
}

function reopenDashboardSession(sessionId) {
  assertAdmin_();
  const id = validateSessionId_(sessionId);
  const spreadsheet = openDashboardSpreadsheet_();
  const controlSheet = ensureDashboardControlSheet_(spreadsheet);
  controlSheet.getRange(id + 1, 2, 1, 3).setValues([['LIVE', '', '']]);
  clearDashboardCache_();
  return { ok: true, sessionId: id, phase: 'LIVE' };
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
  const existing = sheet.getRange(2, 1, SESSION_CONFIG.length, CONTROL_HEADERS.length).getValues();
  const values = SESSION_CONFIG.map((config, index) => {
    const row = existing[index] || [];
    return [config.name, String(row[1] || '').toUpperCase() === 'CLOSED' ? 'CLOSED' : 'LIVE', row[2] || '', row[3] || ''];
  });
  sheet.getRange(2, 1, values.length, CONTROL_HEADERS.length).setValues(values);
  sheet.getRange(1, 1, 1, CONTROL_HEADERS.length).setFontWeight('bold').setBackground('#000000').setFontColor('#ffffff');
  sheet.getRange(2, 3, values.length, 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  sheet.setFrozenRows(1);
  sheet.hideSheet();
  return sheet;
}

function openDashboardSpreadsheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Chưa cấu hình Script Property SPREADSHEET_ID.');
  return SpreadsheetApp.openById(spreadsheetId);
}

function countResponseRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  return sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getDisplayValues()
    .filter(row => row.some(value => String(value).trim() !== '')).length;
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
}
