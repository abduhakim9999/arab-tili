// So'z bazasi va natijalarni saqlash (13.11.2026; docs/texnik.md 17).
// Env: BLOB_READ_WRITE_TOKEN — Vercel Blob, yopiq (private) ombor «arab-tili-baza» (loyihaga ulangan).
// So'rov:  POST /api/soz   {"kod": "...", "amal": "ol"}            → {"ok": true, "d": {...} | null}
//          POST /api/soz   {"kod": "...", "amal": "yoz", "d": {...}} → {"ok": true}
// «Telegram орқали кириш» (13.11.2026; docs/texnik.md 18) — saytni Telegram hisobidagi kodga bir martalik belgi orqali ulash:
//          POST /api/soz   {"amal": "ulash", "tok": "...", "kod": "..."}  → {"ok": true}          (Telegram ilovasi, foydalanuvchi tasdiqlagach)
//          POST /api/soz   {"amal": "ulashOl", "tok": "..."}              → {"ok": true, "kod": "..." | null}   (sayt; bir marta beriladi, 10 daqiqa amal qiladi)
// «tok» — sayt yasagan tasodifiy belgi (26 belgi); fayl nomi uning xeshi. O'qilgach fayl bo'shatiladi.
// «kod» — o'quvchining maxfiy ko'chirish kodi (baza.js yasaydi, 26 belgi); fayl nomi uning xeshi — kodsiz hech kim o'qiy olmaydi.
// Ismlar, telefon va boshqa shaxsiy ma'lumot saqlanmaydi: faqat so'z belgilari, takror jurnali va yo'l natijalari.
// Blob bilan to'g'ridan-to'g'ri HTTP orqali ishlaydi (loyihada package.json yo'q): so'rov qolipi @vercel/blob SDK manbasidan (api v13).
const crypto = require('crypto');
const TOK = process.env.BLOB_READ_WRITE_TOKEN || '';
const STORE = TOK.split('_')[3] || '';
const MAX = 600 * 1024;                                  // bitta o'quvchi hujjati chegarasi
const RUXSAT = ['https://nurut-tolib.vercel.app', 'https://abduhakim9999.github.io'];

const ULASH_MS = 10 * 60 * 1000;                         // ulash belgisi shuncha vaqt amal qiladi
const KODRE = /^[a-z0-9]{20,64}$/;

function fayl(kod) { return 'baza/' + crypto.createHash('sha256').update('baza:' + kod).digest('hex') + '.json'; }
function faylU(tok) { return 'ulash/' + crypto.createHash('sha256').update('ulash:' + tok).digest('hex') + '.json'; }

async function ol(yol) {
  const r = await fetch('https://' + STORE.toLowerCase() + '.private.blob.vercel-storage.com/' + yol + '?t=' + Date.now(),
    { headers: { authorization: 'Bearer ' + TOK }, cache: 'no-store' });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('ol ' + r.status);
  return JSON.parse(await r.text());
}
async function yoz(yol, matn) {
  const r = await fetch('https://vercel.com/api/blob/?pathname=' + encodeURIComponent(yol), {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + TOK, 'x-api-version': '13', 'x-vercel-blob-store-id': STORE,
      'x-vercel-blob-access': 'private', 'x-add-random-suffix': '0', 'x-allow-overwrite': '1',
      'x-content-type': 'application/json', 'x-cache-control-max-age': '60'
    },
    body: matn
  });
  if (!r.ok) throw new Error('yoz ' + r.status + ' ' + (await r.text()).slice(0, 200));
}

module.exports = async (req, res) => {
  const o = req.headers.origin || '';
  if (RUXSAT.indexOf(o) > -1) { res.setHeader('Access-Control-Allow-Origin', o); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'POST'); res.setHeader('Access-Control-Allow-Headers', 'content-type'); return res.status(204).end(); }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, xato: 'faqat POST' });
  if (!TOK || !STORE) return res.status(500).json({ ok: false, xato: 'ombor ulanmagan' });
  let b = req.body;
  try { if (typeof b === 'string') b = JSON.parse(b); } catch (e) { b = null; }
  if (!b) return res.status(400).json({ ok: false, xato: 'kod' });
  try {
    if (b.amal === 'ulash' || b.amal === 'ulashOl') {
      if (typeof b.tok !== 'string' || !KODRE.test(b.tok)) return res.status(400).json({ ok: false, xato: 'tok' });
      if (b.amal === 'ulash') {
        if (typeof b.kod !== 'string' || !KODRE.test(b.kod)) return res.status(400).json({ ok: false, xato: 'kod' });
        await yoz(faylU(b.tok), JSON.stringify({ kod: b.kod, t: Date.now() }));
        return res.status(200).json({ ok: true });
      }
      const u = await ol(faylU(b.tok));
      if (!u || typeof u.kod !== 'string' || !(Date.now() - u.t < ULASH_MS)) return res.status(200).json({ ok: true, kod: null });
      await yoz(faylU(b.tok), '{}');                     // bir martalik: o'qilgach bo'shatiladi
      return res.status(200).json({ ok: true, kod: u.kod });
    }
    if (typeof b.kod !== 'string' || !KODRE.test(b.kod)) return res.status(400).json({ ok: false, xato: 'kod' });
    if (b.amal === 'ol') return res.status(200).json({ ok: true, d: await ol(fayl(b.kod)) });
    if (b.amal === 'yoz') {
      if (!b.d || typeof b.d !== 'object' || Array.isArray(b.d) || b.d.v !== 1) return res.status(400).json({ ok: false, xato: 'd' });
      const matn = JSON.stringify(b.d);
      if (matn.length > MAX) return res.status(413).json({ ok: false, xato: 'katta' });
      await yoz(fayl(b.kod), matn);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ ok: false, xato: 'amal' });
  } catch (e) {
    return res.status(502).json({ ok: false, xato: 'ombor' });
  }
};
