const fs = require("fs");

const p = "src/components/career/MarketingHub.jsx";
const content = fs.readFileSync(p, "utf8").split(/\r?\n/);

let seen = false;
const out = [];

for (const line of content) {
  if (line.includes("@/api/base44Client")) {
    if (!seen) {
      seen = true;
      out.push(line);
    } else {
      // remove duplicado
    }
  } else {
    out.push(line);
  }
}

fs.writeFileSync(p, out.join("\n"), "utf8");
console.log("OK: duplicate base44 import removed from", p);
