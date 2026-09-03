const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "apps-script", "AddParticipantFields.gs"), "utf8");
const context = { console };
vm.createContext(context);
vm.runInContext(`${source}\nthis.__units = ACTIVE_UNIT_OPTIONS;`, context);

const units = Array.from(context.__units);
assert.equal(units.length, 83);
assert.equal(new Set(units).size, units.length);
assert.ok(units.includes("Xã Trà Đốc"));
assert.ok(units.includes("Xã Thăng Điền"));
assert.match(source, /function hoanThienThongTinNguoiThamGia9Form\(/);
assert.match(source, /PARTICIPANT_POSITION_TITLE = 'Chức vụ\/Vị trí công tác'/);
assert.match(source, /function kiemTraThongTinVaCauBatBuoc9Form\(/);

console.log("unit-options.test.js: OK");
