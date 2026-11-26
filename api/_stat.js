// Savol statistikasi (26.11.2026, 4-tekshiruv; foydalanuvchi: «hozir yig'ilsin, ko'rish keyin»; docs/texnik/23-savollar.md «Statistika»).
// «Эъроб» savollariga (dars sahifasi, «Боб якуни», «Китоб якуни», «Хатолар устида ишлаш») har javob o'quvchining takror jurnalida bor:
// [«xd<dars>:<qator>-<so'z>», vaqt, 3 (to'g'ri) | 1 (xato), ms] — tg.js Ball.yoz yozadi. Har saqlashda (api/soz.js) shu o'quvchining hali
// sanalmagan xd yozuvlari kun bo'yicha yig'indiga qo'shiladi:
//   stat:xd:<YYYY-MM-DD> (HASH; kun — Toshkent vaqti), maydonlar: <kalit>|j — javoblar soni, <kalit>|t — to'g'ri, <kalit>|b — birinchi javob
//   (o'quvchi shu kalitga STAT_DAN dan beri birinchi marta javob berdi), <kalit>|bt — birinchi javobi to'g'ri;
//   stat:oxir (HASH) — o'quvchi (Rey.id) → sanalgan eng oxirgi yozuv vaqti (ruscha profil — id + ':ru').
// Kalitda savol turi yo'q (qator-so'z): savol o'zgargan kundan oldingi va keyingi kunlar alohida o'qiladi (o'zgarish sanasi — git, data/mashq.json).
// Faqat yig'indi: kod, ism, o'quvchi raqami maydonlarda yo'q. Ko'rish sahifasi — keyin. Ombor ulanmagan bo'lsa — hech narsa qilmaydi.
// Bilib qo'yish: bir o'quvchining ikki saqlashi bir vaqtda kelsa, o'sha yozuvlar ikki marta sanalishi mumkin (saqlash orasi daqiqalar — kam);
// boshqa qurilmadagi eski (oxirdan oldingi vaqtli) yozuv birlashganda sanalmay qolishi mumkin.
const Rey = require('./_rey.js');

const STAT_DAN = Date.UTC(2026, 10, 26, 19);            // 27.11.2026 00:00 (Toshkent) — yangi savollar (yangi turlar, 2–4-tekshiruv) shundan
const TZ = 5 * 3600000;
const KALIT = /^xd\d{1,3}:\d{1,3}-\d{1,3}$/;
const KO_P = 4000;                                       // bitta saqlashda ko'pi bilan shuncha yozuv (qolgani — keyingi saqlashda)

function kun(t) { return new Date(t + TZ).toISOString().slice(0, 10); }

// jurnal → hali sanalmagan (vaqti > oxir) xd yozuvlari: {Q: {kun: {maydon: son}}, oxir: yangi oxir}
function hisobla(j, oxir, hozir) {
  const xd = (Array.isArray(j) ? j : []).filter(function (e) {
    return Array.isArray(e) && typeof e[0] === 'string' && KALIT.test(e[0]) && typeof e[1] === 'number' &&
      e[1] >= STAT_DAN && e[1] <= hozir + 300000 && (e[2] === 3 || e[2] === 1);
  }).sort(function (a, b) { return a[1] - b[1]; });
  const kor = {}, Q = {};
  let yangi = oxir, n = 0;
  xd.forEach(function (e) {
    const birinchi = !kor[e[0]];
    kor[e[0]] = 1;
    if (e[1] <= oxir || n >= KO_P) return;
    n++; if (e[1] > yangi) yangi = e[1];
    const d = Q[kun(e[1])] = Q[kun(e[1])] || {}, ok = e[2] === 3;
    const q = function (f) { d[f] = (d[f] || 0) + 1; };
    q(e[0] + '|j'); if (ok) q(e[0] + '|t');
    if (birinchi) { q(e[0] + '|b'); if (ok) q(e[0] + '|bt'); }
  });
  return { Q: Q, oxir: yangi };
}

// o'quvchi hujjati saqlanganda (api/soz.js)
async function yangila(kod, d) {
  if (!Rey.bor() || !d || typeof d !== 'object') return;
  const i = Rey.id(kod), hozir = Date.now();
  const P = [['', d.j]];
  if (d.ru && typeof d.ru === 'object' && !Array.isArray(d.ru)) P.push([':ru', d.ru.j]);
  const [ox] = await Rey.redis([['HMGET', 'stat:oxir'].concat(P.map(function (p) { return i + p[0]; }))]);
  const q = [];
  P.forEach(function (p, k) {
    const eski = +((ox || [])[k] || 0), r = hisobla(p[1], eski, hozir);
    Object.keys(r.Q).forEach(function (kn) {
      Object.keys(r.Q[kn]).forEach(function (f) { q.push(['HINCRBY', 'stat:xd:' + kn, f, r.Q[kn][f]]); });
    });
    if (r.oxir > eski) q.push(['HSET', 'stat:oxir', i + p[0], r.oxir]);
  });
  if (q.length) await Rey.redis(q);
}

module.exports = { yangila: yangila, hisobla: hisobla, STAT_DAN: STAT_DAN };
