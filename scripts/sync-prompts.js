const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "apps-script", "Code.gs"), "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\nthis.__sessionPrompts = SESSION_PROMPTS;`, context);

for (const fileName of ["demo.json", "fake.json"]) {
  const filePath = path.join(root, "data", fileName);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const session of data.sessions || []) {
    session.prompt = context.__sessionPrompts[session.id] || null;
  }
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

console.log("Đã đồng bộ đề bài vào data/demo.json và data/fake.json.");
