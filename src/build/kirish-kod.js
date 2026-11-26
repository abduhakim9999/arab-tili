// Sayt kirish kodini almashtirish (docs/texnik/22-kirish-kodi.md): node src/build/kirish-kod.js 1234
// tg.js dagi KX (kod xeshi) yangilanadi; kodning o'zi hech qayerga yozilmaydi (repo ochiq). Keyin — odatdagidek tayyor-… tarmoq va «joyla».
const fs = require('fs'), path = require('path');
const kod = process.argv[2];
if (!/^\d{4}$/.test(kod || '')) { console.error('4 xonali kod kerak: node src/build/kirish-kod.js 1234'); process.exit(1); }
function xesh(s) { let h = 0x811c9dc5; s = 'nurut-tolib:' + s; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
const f = path.join(__dirname, '..', '..', 'tg.js');
let t = fs.readFileSync(f, 'utf8');
const r = /var KX = '[0-9a-f]{8}'/;
if (!r.test(t)) { console.error('tg.js da KX topilmadi'); process.exit(1); }
fs.writeFileSync(f, t.replace(r, "var KX = '" + xesh(kod) + "'"));
console.log('KX =', xesh(kod));
