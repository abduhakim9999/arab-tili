// «Рейтинг» ro'yxati (15.11.2026; docs/texnik.md 19). Hisob — api/_rey.js (har saqlashda api/soz.js yangilaydi).
// So'rov:  POST /api/reyting  {"kod": "..."}  (kod — ixtiyoriy; bo'lsa o'quvchining o'z o'rni ham beriladi)
// Javob:   {"ok": true, "hb": <hafta boshi ms>, "h": {"top": [{"n", "b", "men"?}], "o", "b", "ol"}, "s": {...}}
//          top — 50 tagacha; o — o'quvchi o'rni (1 dan; 0 — ro'yxatda yo'q), b — bali, ol — bitta yuqoridagi kishining bali.
//          Ombor ulanmagan bo'lsa: {"ok": false, "xato": "ulanmagan"} — sahifa faqat o'quvchining o'zini ko'rsatadi.
// Kod hech qachon javobda qaytmaydi; boshqa o'quvchilardan faqat ism va ball ko'rinadi.
const crypto = require('crypto');
const Rey = require('./_rey.js');
const RUXSAT = ['https://nurut-tolib.vercel.app', 'https://abduhakim9999.github.io'];
const KODRE = /^[a-z0-9]{20,64}$/;
const TOP = 50;
const TOK = process.env.BLOB_READ_WRITE_TOKEN || '';
const STORE = TOK.split('_')[3] || '';

// hali hisoblanmagan o'quvchi (reyting ulanishidan oldin saqlagan) — hujjatini bir marta o'qib, ro'yxatga qo'shamiz
async function hujjat(kod) {
  if (!TOK || !STORE) return null;
  const f = 'baza/' + crypto.createHash('sha256').update('baza:' + kod).digest('hex') + '.json';
  const r = await fetch('https://' + STORE.toLowerCase() + '.private.blob.vercel-storage.com/' + f + '?t=' + Date.now(),
    { headers: { authorization: 'Bearer ' + TOK }, cache: 'no-store' });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('ol ' + r.status);
  return JSON.parse(await r.text());
}

function juft(a) { const o = []; for (let i = 0; i + 1 < (a || []).length; i += 2) o.push([a[i], +a[i + 1]]); return o; }

module.exports = async (req, res) => {
  const o = req.headers.origin || '';
  if (RUXSAT.indexOf(o) > -1) { res.setHeader('Access-Control-Allow-Origin', o); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'POST'); res.setHeader('Access-Control-Allow-Headers', 'content-type'); return res.status(204).end(); }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, xato: 'faqat POST' });
  if (!Rey.bor()) return res.status(200).json({ ok: false, xato: 'ulanmagan' });
  let b = req.body;
  try { if (typeof b === 'string') b = JSON.parse(b); } catch (e) { b = null; }
  const kod = b && typeof b.kod === 'string' && KODRE.test(b.kod) ? b.kod : '';
  try {
    const hb = Rey.hisob(null).hb, H = Rey.hk(hb), i = kod ? Rey.id(kod) : '';
    if (kod) {
      const [bor] = await Rey.redis([['HEXISTS', 'rey:ism', i]]);
      if (!bor) { const d = await hujjat(kod).catch(function () { return null; }); if (d && d.v === 1) await Rey.yangila(kod, d); }
    }
    const q = [['ZREVRANGE', H, 0, TOP - 1, 'WITHSCORES'], ['ZREVRANGE', 'rey:s', 0, TOP - 1, 'WITHSCORES']];
    if (kod) q.push(['ZREVRANK', H, i], ['ZSCORE', H, i], ['ZREVRANK', 'rey:s', i], ['ZSCORE', 'rey:s', i]);
    const r = await Rey.redis(q);
    const L = { h: juft(r[0]), s: juft(r[1]) };
    const M = { h: { o: r[2] == null ? 0 : +r[2] + 1, b: +(r[3] || 0) }, s: { o: r[4] == null ? 0 : +r[4] + 1, b: +(r[5] || 0) } };
    // ismlar va (ro'yxatdan tashqaridagi o'quvchi uchun) bitta yuqoridagining bali
    const ids = {}; L.h.concat(L.s).forEach(function (x) { ids[x[0]] = 1; });
    const ro = Object.keys(ids), q2 = [];
    if (ro.length) q2.push(['HMGET', 'rey:ism'].concat(ro));
    const tash = [];
    if (kod) [['h', H], ['s', 'rey:s']].forEach(function (x) { const m = M[x[0]]; if (m.o > TOP) { tash.push(x[0]); q2.push(['ZREVRANGE', x[1], m.o - 2, m.o - 2, 'WITHSCORES']); } });
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
    return res.status(200).json({ ok: true, hb: hb, h: Object.assign({ top: top('h') }, M.h), s: Object.assign({ top: top('s') }, M.s) });
  } catch (e) {
    return res.status(502).json({ ok: false, xato: 'ombor' });
  }
};
