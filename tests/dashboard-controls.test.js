const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

for (let id = 1; id <= 9; id += 1) {
  const qr = path.join(root, "assets", "qr", `session-${id}.png`);
  assert.ok(fs.existsSync(qr), `Thiếu QR Phiên ${id}`);
  assert.ok(fs.statSync(qr).size > 6000, `QR Phiên ${id} không hợp lệ`);
}

const index = read("index.html");
const app = read("app.js");
const styles = read("styles.css");
const admin = read(path.join("apps-script", "Admin.html"));

assert.match(index, /id="qr-dialog"/);
assert.match(index, /id="control-fab"/);
assert.match(index, /id="control-frame"/);
assert.match(index, /id="demo-control"/);
assert.doesNotMatch(index, /Mở trang quản trị đầy đủ/);
assert.match(app, /assets\/qr\/session-\$\{session\.id\}\.png/);
assert.match(app, /event\.source !== controlFrame\.contentWindow/);
assert.match(styles, /\.control-fab/);
assert.match(styles, /\.qr-dialog::backdrop/);
assert.match(admin, /requestedView === 'compact'/);
assert.match(admin, /dashboard-session-updated/);
assert.doesNotMatch(admin, /Đăng nhập: \$\{data\.email\}/);
assert.match(admin, /Đang load dữ liệu…/);
assert.match(admin, /notice\.classList\.add\('is-hidden'\)/);
assert.match(admin, /startDashboardSessionTimer/);
assert.match(admin, /data-countdown/);
assert.match(admin, /Chưa bắt đầu/);
assert.match(admin, />phút</);
assert.match(admin, /Đã bắt đầu \$\{result\.durationMinutes\} phút/);
assert.match(admin, /Kết thúc ngay/);
assert.match(app, /phaseLabel/);
assert.match(app, /Phiên chưa bắt đầu/);
assert.match(app, /renderUnitParticipation/);
assert.match(app, /Xem danh sách chưa tham gia/);
assert.match(app, /renderLeaderboard/);
assert.match(app, /Top \$\{leaders\.length\} làm đúng/);
assert.match(app, /correct-step-list/);
assert.match(styles, /\.leaderboard-list/);
assert.match(styles, /\.correct-step-list/);
assert.match(app, /demotimer/);
assert.match(app, /CHẾ ĐỘ DEMO · KHÔNG ẢNH HƯỞNG DỮ LIỆU THẬT/);
assert.match(app, /controlFrame\.hidden = true/);
assert.match(app, /persistDemoUrlState/);

const embeddedScript = admin.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/<\?!= JSON\.stringify\(requestedSession\) \?>/g, "1")
  .replace(/<\?!= JSON\.stringify\(requestedView\) \?>/g, '"compact"');
new vm.Script(embeddedScript);

console.log("dashboard-controls.test.js: OK");
