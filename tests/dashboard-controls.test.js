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
assert.match(app, /assets\/qr\/session-\$\{session\.id\}\.png/);
assert.match(app, /event\.source !== controlFrame\.contentWindow/);
assert.match(styles, /\.control-fab/);
assert.match(styles, /\.qr-dialog::backdrop/);
assert.match(admin, /requestedView === 'compact'/);
assert.match(admin, /dashboard-session-updated/);

const embeddedScript = admin.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/<\?!= JSON\.stringify\(requestedSession\) \?>/g, "1")
  .replace(/<\?!= JSON\.stringify\(requestedView\) \?>/g, '"compact"');
new vm.Script(embeddedScript);

console.log("dashboard-controls.test.js: OK");
