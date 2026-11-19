/* «Қоидалар» kartalarini src/build/qt-yangi.json dan hamma darslarga yozadi (19.11.2026; avval qt97.js — faqat 97).
   Ishlatish (repo ildizidan): node src/build/qt.js   — har NN.html (va src/build/outputs/lessonNN/index.html) dagi QT[q][1] almashtiriladi. */
const fs = require("fs"), Y = JSON.parse(fs.readFileSync(__dirname + "/qt-yangi.json", "utf8"));
const bad = [];
for (const q in Y) if (q[0] != "_") Y[q].forEach(t => (t.match(/[ء-ي][ء-ْٰ]*/g) || []).forEach(w => { if (w.replace(/[ً-ْٰ]/g, "").length > 1 && !/[ً-ْ]/.test(w)) bad.push(q + ": " + w) }));
if (bad.length) console.log("Harakatsiz so'zlar:", bad.join(" | "));
const files = fs.readdirSync(".").filter(f => /^\d+\.html$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b));
files.slice().forEach(f => { const o = "src/build/outputs/lesson" + String(parseInt(f)).padStart(2, "0") + "/index.html"; if (fs.existsSync(o)) files.push(o) });
for (const f of files) {
  let s = fs.readFileSync(f, "utf8"); const i = s.search(/\bQT\s*=\s*\{/); if (i < 0) continue;
  let j = s.indexOf("{", i), d = 0, k = j; for (; k < s.length; k++) { if (s[k] == "{") d++; else if (s[k] == "}") { d--; if (!d) break } }
  const QT = eval("(" + s.slice(j, k + 1) + ")"); let n = 0;
  for (const q in Y) { if (q[0] == "_" || !QT[q]) continue; QT[q][1] = Y[q]; n++ }
  if (n) { fs.writeFileSync(f, s.slice(0, j) + JSON.stringify(QT) + s.slice(k + 1)); console.log(f, n, "ta qoida"); }
}
