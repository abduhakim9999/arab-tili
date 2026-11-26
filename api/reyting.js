// «Рейтинг» ro'yxati (15.11.2026; docs/texnik.md 19). Hisob — api/_rey.js (har saqlashda api/soz.js yangilaydi).
// So'rov:  POST /api/reyting  {"kod": "...", "til": "ru"}  (kod — ixtiyoriy; bo'lsa o'quvchining o'z o'rni ham beriladi;
//          til: "ru" — ruscha profil ro'yxati, 21.11.2026; bo'lmasa — o'zbekcha)
// Javob:   {"ok": true, "hb": <hafta boshi ms>, "h": {"top": [{"n", "b", "men"?}], "o", "b", "ol"}, "s": {...}, "b": {...}}
//          h — «Ҳафта», s — «Сўзлар · Мустаҳкам», b — «Сўзлар · Билган» (26.11.2026); top — 50 tagacha; o — o'quvchi o'rni (1 dan; 0 — ro'yxatda yo'q), b — bali, ol — bitta yuqoridagi kishining bali.
//          Ombor ulanmagan bo'lsa: {"ok": false, "xato": "ulanmagan"} — sahifa faqat o'quvchining o'zini ko'rsatadi.
// Kod hech qachon javobda qaytmaydi; boshqa o'quvchilardan faqat ism va ball ko'rinadi.
const crypto = require('crypto');
const Rey = require('./_rey.js');
const Ombor = require('./_ombor.js');                   // 24.11.2026: hujjat Redis'da (eski Blob — zaxira)
const RUXSAT = ['https://nurut-tolib.vercel.app', 'https://abduhakim9999.github.io'];
const KODRE = /^[a-z0-9]{20,64}$/;
const TOP = 50;

// hali hisoblanmagan o'quvchi (reyting ulanishidan oldin saqlagan) — hujjatini bir marta o'qib, ro'yxatga qo'shamiz
async function hujjat(kod) { return Ombor.ol('baza', kod); }

function juft(a) { const o = []; for (let i = 0; i + 1 < (a || []).length; i += 2) o.push([a[i], +a[i + 1]]); return o; }

module.exports = async (req, res) => {
  const o = req.headers.origin || '';
  if (RUXSAT.indexOf(o) > -1) { res.setHeader('Access-Control-Allow-Origin', o); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'POST'); res.setHeader('Access-Control-Allow-Headers', 'content-type'); return res.status(204).end(); }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, xato: 'faqat POST' });
  if (!Rey.bor()) return res.status(200).json({ ok: false, xato: 'ulanmagan' });
  try { if (!(await Ombor.chegara('rey:' + Ombor.ip(req), 60))) return res.status(429).json({ ok: false, xato: 'kop' }); } catch (e) {}
  let b = req.body;
  try { if (typeof b === 'string') b = JSON.parse(b); } catch (e) { b = null; }
  const kod = b && typeof b.kod === 'string' && KODRE.test(b.kod) ? b.kod : '';
  const til = b && b.til === 'ru' ? 'ru' : '';
  try {
    const hb = Rey.hisob(null).hb, i = kod ? Rey.id(kod) : '';
    const K = { h: Rey.hk(hb, til), s: Rey.sk(til), b: Rey.bk(til) }, T = ['h', 's', 'b'];
    if (kod) {
      // rey:bx — «Билган» ro'yxati (26.11.2026) qo'shilgandan beri bu o'quvchi hisoblanganmi: yo'q bo'lsa, saqlashni kutmay bir marta hisoblaymiz
      const [bor, bx] = await Rey.redis([['HEXISTS', 'rey:ism', i], ['HEXISTS', 'rey:bx', i]]);
      if (!bor || !bx) {
        const d = await hujjat(kod).catch(function () { return null; });
        if (d && d.v === 1) { await Rey.yangila(kod, d); await Rey.redis([['HSET', 'rey:bx', i, 1]]); }
      }
    }
    const q = T.map(function (t) { return ['ZREVRANGE', K[t], 0, TOP - 1, 'WITHSCORES']; });
    if (kod) T.forEach(function (t) { q.push(['ZREVRANK', K[t], i], ['ZSCORE', K[t], i]); });
    const r = await Rey.redis(q);
    const L = {}, M = {};
    T.forEach(function (t, k) { L[t] = juft(r[k]); M[t] = { o: r[3 + 2 * k] == null ? 0 : +r[3 + 2 * k] + 1, b: +(r[4 + 2 * k] || 0) }; });
    // ismlar va (ro'yxatdan tashqaridagi o'quvchi uchun) bitta yuqoridagining bali
    const ids = {}; T.forEach(function (t) { L[t].forEach(function (x) { ids[x[0]] = 1; }); });
    const ro = Object.keys(ids), q2 = [];
    if (ro.length) q2.push(['HMGET', 'rey:ism'].concat(ro));
    const tash = [];
    if (kod) T.forEach(function (t) { const m = M[t]; if (m.o > TOP) { tash.push(t); q2.push(['ZREVRANGE', K[t], m.o - 2, m.o - 2, 'WITHSCORES']); } });
    const r2 = q2.length ? await Rey.redis(q2) : [];
    const ism = {}; if (ro.length) ro.forEach(function (x, k) { ism[x] = r2[0][k] || ''; });
    tash.forEach(function (t, k) { const a = juft(r2[(ro.length ? 1 : 0) + k]); M[t].ol = a.length ? a[0][1] : 0; });
    const top = function (t) {
      return L[t].map(function (x, k) {
        const e = { n: ism[x[0]] || '', b: x[1] }; if (kod && x[0] === i) e.men = true;
        if (kod && x[0] === i) M[t].o = k + 1;
        return e;
      });
    };
    return res.status(200).json({ ok: true, hb: hb, h: Object.assign({ top: top('h') }, M.h), s: Object.assign({ top: top('s') }, M.s), b: Object.assign({ top: top('b') }, M.b) });
  } catch (e) {
    return res.status(502).json({ ok: false, xato: 'ombor' });
  }
};
