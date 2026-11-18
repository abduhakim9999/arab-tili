/* 97-dars «Қоидалар» kartalarini src/build/qt97-yangi.json dan yozadi (19.11.2026). Ishlatish: node src/build/qt97.js */
const fs = require("fs"), Y = JSON.parse(fs.readFileSync(__dirname + "/qt97-yangi.json", "utf8"));
const bad = [];
for (const q in Y) if (q[0] != "_") Y[q].forEach(t => (t.match(/[ء-ي][ء-ْٰ]*/g) || []).forEach(w => { if (w.replace(/[ً-ْٰ]/g, "").length > 1 && !/[ً-ْ]/.test(w)) bad.push(q + ": " + w) }));
if (bad.length) console.log("Harakatsiz so'zlar:", bad.join(" | "));
for (const f of ["97.html", "src/build/outputs/lesson97/index.html"]) {
  let s = fs.readFileSync(f, "utf8"); const i = s.search(/\bQT\s*=\s*\{/); if (i < 0) throw f + ": QT topilmadi";
  let j = s.indexOf("{", i), d = 0, k = j; for (; k < s.length; k++) { if (s[k] == "{") d++; else if (s[k] == "}") { d--; if (!d) break } }
  const QT = eval("(" + s.slice(j, k + 1) + ")"); let n = 0;
  for (const q in Y) { if (q[0] == "_") continue; if (!QT[q]) throw f + ": " + q + " topilmadi"; QT[q][1] = Y[q]; n++ }
  fs.writeFileSync(f, s.slice(0, j) + JSON.stringify(QT) + s.slice(k + 1)); console.log(f, n, "ta qoida");
}
