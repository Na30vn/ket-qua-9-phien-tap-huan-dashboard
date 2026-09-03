const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "apps-script", "Reporting.gs"), "utf8");
const table = [
  ["Phiên", "Trạng thái", "Thời gian kết thúc/chốt", "Số bài lúc chốt", "Bắt đầu đếm ngược"],
  ...Array.from({ length: 9 }, (_, index) => [`Phiên ${index + 1}`, "NOT_STARTED", "", "", ""])
];
let validationValues = [];

function rangeFor(row, column, rowCount, columnCount) {
  const range = {
    getValues: () => Array.from({ length: rowCount }, (_, r) =>
      Array.from({ length: columnCount }, (_, c) => table[row - 1 + r]?.[column - 1 + c] ?? "")),
    setValues: values => {
      values.forEach((valuesRow, r) => valuesRow.forEach((value, c) => {
        if (!table[row - 1 + r]) table[row - 1 + r] = [];
        table[row - 1 + r][column - 1 + c] = value;
      }));
      return range;
    },
    setFontWeight: () => range,
    setBackground: () => range,
    setFontColor: () => range,
    setNumberFormat: () => range,
    clearDataValidations: () => range,
    setDataValidation: rule => { validationValues = rule.values; return range; }
  };
  return range;
}

const controlSheet = {
  getName: () => "_DASHBOARD_CONTROL",
  getMaxRows: () => 20,
  getMaxColumns: () => 8,
  getRange: rangeFor,
  setFrozenRows: () => {},
  hideSheet: () => {}
};
const beforeCutoff = new Date("2026-09-03T01:00:00.000Z");
const afterCutoff = new Date("2026-09-03T03:00:00.000Z");
const responseSheet = {
  getLastRow: () => 3,
  getLastColumn: () => 1,
  getRange: () => ({
    getValues: () => [[beforeCutoff], [afterCutoff]],
    getDisplayValues: () => [["03/09/2026 08:00:00"], ["03/09/2026 10:00:00"]]
  })
};
const spreadsheet = {
  getSheetByName: name => name === "_DASHBOARD_CONTROL" ? controlSheet : name === "Phiên 1" ? responseSheet : null,
  insertSheet: () => controlSheet
};
let triggerCreated = 0;
const lock = { tryLock: () => true, waitLock: () => {}, releaseLock: () => {} };

const context = {
  console,
  SESSION_CONFIG: Array.from({ length: 9 }, (_, index) => ({ id: index + 1, name: `Phiên ${index + 1}` })),
  CONTROL_SHEET_NAME: "_DASHBOARD_CONTROL",
  Session: {
    getActiveUser: () => ({ getEmail: () => "admin@example.com" }),
    getEffectiveUser: () => ({ getEmail: () => "admin@example.com" })
  },
  PropertiesService: { getScriptProperties: () => ({
    getProperty: key => key === "SPREADSHEET_ID" ? "test" : key === "ADMIN_EMAILS" ? "admin@example.com" : "",
    setProperty: () => {}
  }) },
  SpreadsheetApp: {
    openById: () => spreadsheet,
    newDataValidation: () => ({
      requireValueInList(values) { this.values = values; return this; },
      setAllowInvalid() { return this; },
      build() { return { values: this.values }; }
    })
  },
  CacheService: { getScriptCache: () => ({ remove: () => {} }) },
  LockService: { getScriptLock: () => lock },
  ScriptApp: {
    getProjectTriggers: () => [],
    newTrigger: () => ({ timeBased: () => ({ everyMinutes: () => ({ create: () => { triggerCreated += 1; } }) }) })
  },
  toDate_: value => value instanceof Date && !Number.isNaN(value.getTime()) ? value : null,
  isAtOrBeforeCutoff_: (raw, display, cutoff) => raw instanceof Date ? raw.getTime() <= cutoff.getTime() : true
};

vm.createContext(context);
vm.runInContext(`${source}\nthis.__start = startDashboardSessionTimer; this.__process = processExpiredDashboardTimers; this.__reopen = reopenDashboardSession; this.__close = closeDashboardSession;`, context);

const started = context.__start(1, 1);
assert.equal(table[1][1], "TIMED");
assert.equal(started.phase, "TIMED");
assert.equal(started.durationMinutes, 1);
assert.deepEqual(JSON.parse(JSON.stringify(validationValues)), ["NOT_STARTED", "TIMED", "CLOSED"]);
assert.ok(new Date(started.timerEndsAt).getTime() > Date.now());
assert.equal(triggerCreated, 2);

table[1][2] = new Date("2026-09-03T02:00:00.000Z");
const processed = context.__process();
assert.equal(processed.closed.length, 1);
assert.equal(table[1][1], "CLOSED");
assert.equal(table[1][3], 1);
assert.equal(context.__process().closed.length, 0);

context.__reopen(1);
assert.deepEqual(table[1].slice(1, 5), ["NOT_STARTED", "", "", ""]);
const closed = context.__close(1);
assert.equal(closed.phase, "CLOSED");
assert.equal(context.__close(1).alreadyClosed, true);

console.log("timer-control.test.js: OK");
