const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "apps-script", "AddParticipantFields.gs"), "utf8");
const context = { console };
vm.createContext(context);
vm.runInContext(`${source}\nthis.__units = ACTIVE_UNIT_OPTIONS;`, context);

const units = Array.from(context.__units);
assert.equal(units.length, 94);
assert.equal(new Set(units).size, units.length);
assert.ok(units.includes("Xã Trà Đốc"));
assert.ok(units.includes("Xã Thăng Điền"));
[
  "Phường Cẩm Lệ", "Phường Hòa Xuân", "Xã Núi Thành", "Xã Tam Mỹ", "Xã Bến Hiên",
  "Xã Hùng Sơn", "Xã Quế Sơn", "Xã Trà Linh", "Xã Đức Phú", "Xã Tam Hải", "Xã Phú Ninh"
].forEach(unit => assert.ok(units.includes(unit), unit));
assert.match(source, /function dongBoDropdownDonViChoPhien5Den9\(/);
assert.match(source, /\[5, 6, 7, 8, 9\]\.forEach/);
assert.match(source, /function hoanThienThongTinNguoiThamGia9Form\(/);
assert.match(source, /PARTICIPANT_POSITION_TITLE = 'Chức vụ\/Vị trí công tác'/);
assert.match(source, /function kiemTraThongTinVaCauBatBuoc9Form\(/);

console.log("unit-options.test.js: OK");
