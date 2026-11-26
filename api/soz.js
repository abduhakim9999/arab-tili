// So'z bazasi va natijalarni saqlash (13.11.2026; docs/texnik.md 17).
// Env: BLOB_READ_WRITE_TOKEN — Vercel Blob, yopiq (private) ombor «arab-tili-baza» (loyihaga ulangan).
// So'rov:  POST /api/soz   {"kod": "...", "amal": "ol"}            → {"ok": true, "d": {...} | null}
//          POST /api/soz   {"kod": "...", "amal": "yoz", "d": {...}} → {"ok": true}
// «Telegram орқали кириш» (13.11.2026; docs/texnik.md 18) — saytni Telegram hisobidagi kodga bir martalik belgi orqali ulash:
//          POST /api/soz   {"amal": "ulash", "tok": "...", "kod": "..."}  → {"ok": true}          (Telegram ilovasi, foydalanuvchi tasdiqlagach)
//          POST /api/soz   {"amal": "ulashOl", "tok": "..."}              → {"ok": true, "kod": "..." | null}   (sayt; bir marta beriladi, 10 daqiqa amal qiladi)
// «tok» — sayt yasagan tasodifiy belgi (26 belgi); fayl nomi uning xeshi. O'qilgach fayl bo'shatiladi.
// «kod» — o'quvchining maxfiy ko'chirish kodi (baza.js yasaydi, 26 belgi); fayl nomi uning xeshi — kodsiz hech kim o'qiy olmaydi.
// Hujjatda: so'z belgilari, takror jurnali, yo'l natijalari va o'quvchi o'zi yozgan ism «ism» {n, t} (14.11.2026 dan; ilovadagi boshqa
// o'quvchilarga — keyin reytingda — ko'rinadi). Telegram akkaunti (14.11.2026, foydalanuvchi qarori) — alohida fayl tg/<xesh>.json:
//          POST /api/soz   {"kod": "...", "amal": "tg", "init": Telegram.WebApp.initData}  → {"ok": true}   (bot tokeni bilan tekshiriladi)
//          POST /api/soz   {"kod": "...", "amal": "tgOchir"}                                 → {"ok": true}   («Аккаунтни ўчириш»)
// Telefon raqami so'ralmaydi va saqlanmaydi.
// 24.11.2026: ombor — api/_ombor.js (asosiy Upstash Redis; eski Blob faqat o'qish zaxirasi, birinchi o'qishda Redis'ga ko'chadi).
// So'rovlar chegarasi: bitta IP daqiqada 120 ta, bitta kod daqiqada 12 ta yozish.
const crypto = require('crypto');
const Rey = require('./_rey.js');                       // reyting (15.11.2026; docs/texnik.md 19)
const Stat = require('./_stat.js');                     // savol statistikasi (26.11.2026; docs/texnik/23-savollar.md)
const Ombor = require('./_ombor.js');                   // Redis + eski Blob (24.11.2026)
const MAX = 1536 * 1024;                                 // bitta o'quvchi hujjati chegarasi (14.11.2026: 600 KB → 1,5 MB — dars holati va sozlamalar ham qo'shildi; takror tarixini ixchamlash — docs/rejalar.md 0)
const RUXSAT = ['https://nurut-tolib.vercel.app', 'https://abduhakim9999.github.io'];

const ULASH_MS = 10 * 60 * 1000;                         // ulash belgisi shuncha vaqt amal qiladi
const KODRE = /^[a-z0-9]{20,64}$/;
const BOT = process.env.BOT_TOKEN || '';                // api/tg.js bilan bir xil bot (Mini App initData shu bilan imzolanadi)

// Mini App initData tekshiruvi (core.telegram.org/bots/webapps — «Validating data received via the Mini App»): soxta ma'lumot o'tmaydi
function tgTekshir(init) {
  if (!BOT || typeof init !== 'string' || !init || init.length > 4096) return null;
  const p = new URLSearchParams(init), h = p.get('hash');
  if (!h) return null;
  p.delete('hash');
  const dcs = [...p.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).map(([k, v]) => k + '=' + v).join('\n');
  const key = crypto.createHmac('sha256', 'WebAppData').update(BOT).digest();
  const x = crypto.createHmac('sha256', key).update(dcs).digest('hex');
  if (x.length !== h.length || !crypto.timingSafeEqual(Buffer.from(x), Buffer.from(h))) return null;
  if (!(Date.now() / 1000 - (+p.get('auth_date') || 0) < 86400)) return null;   // 24.11.2026: eski initData qayta ishlatilmasin
  try { const u = JSON.parse(p.get('user') || 'null'); return u && u.id ? u : null; } catch (e) { return null; }
}


module.exports = async (req, res) => {
  const o = req.headers.origin || '';
  if (RUXSAT.indexOf(o) > -1) { res.setHeader('Access-Control-Allow-Origin', o); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'POST'); res.setHeader('Access-Control-Allow-Headers', 'content-type'); return res.status(204).end(); }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, xato: 'faqat POST' });
  if (!Ombor.bor()) return res.status(500).json({ ok: false, xato: 'ombor ulanmagan' });
  let b = req.body;
  try { if (typeof b === 'string') b = JSON.parse(b); } catch (e) { b = null; }
  if (!b) return res.status(400).json({ ok: false, xato: 'kod' });
  try {
    if (!(await Ombor.chegara('ip:' + Ombor.ip(req), 120))) return res.status(429).json({ ok: false, xato: 'kop' });
    if (b.amal === 'ulash' || b.amal === 'ulashOl') {
      if (typeof b.tok !== 'string' || !KODRE.test(b.tok)) return res.status(400).json({ ok: false, xato: 'tok' });
      if (b.amal === 'ulash') {
        if (typeof b.kod !== 'string' || !KODRE.test(b.kod)) return res.status(400).json({ ok: false, xato: 'kod' });
        await Ombor.yoz('ulash', b.tok, JSON.stringify({ kod: b.kod, t: Date.now() }), ULASH_MS / 1000);
        return res.status(200).json({ ok: true });
      }
      const u = await Ombor.ol('ulash', b.tok);
      if (!u || typeof u.kod !== 'string' || !(Date.now() - u.t < ULASH_MS)) return res.status(200).json({ ok: true, kod: null });
      await Ombor.yoz('ulash', b.tok, '{}', 60);                     // bir martalik: o'qilgach bo'shatiladi
      return res.status(200).json({ ok: true, kod: u.kod });
    }
    if (typeof b.kod !== 'string' || !KODRE.test(b.kod)) return res.status(400).json({ ok: false, xato: 'kod' });
    if (b.amal === 'ol') return res.status(200).json({ ok: true, d: await Ombor.ol('baza', b.kod) });
    if (b.amal === 'tg') {
      const u = tgTekshir(b.init);
      if (!u) return res.status(400).json({ ok: false, xato: 'tg' });
      await Ombor.yoz('tg', b.kod, JSON.stringify({ id: u.id, username: String(u.username || '').slice(0, 64),
        ism: [u.first_name, u.last_name].filter(Boolean).join(' ').slice(0, 128), til: String(u.language_code || '').slice(0, 8), t: Date.now() }));
      return res.status(200).json({ ok: true });
    }
    if (b.amal === 'tgOchir') { await Ombor.yoz('tg', b.kod, '{}'); return res.status(200).json({ ok: true }); }
    if (b.amal === 'yoz') {
      if (!b.d || typeof b.d !== 'object' || Array.isArray(b.d) || b.d.v !== 1) return res.status(400).json({ ok: false, xato: 'd' });
      if (b.d.ism != null) b.d.ism = b.d.ism && typeof b.d.ism === 'object' && typeof b.d.ism.n === 'string'   // ism — 40 belgigacha
        ? { n: b.d.ism.n.replace(/[\u0000-\u001f]/g, '').slice(0, 40), t: +b.d.ism.t || 0 } : null;
      const matn = JSON.stringify(b.d);
      if (matn.length > MAX) return res.status(413).json({ ok: false, xato: 'katta' });
      if (!(await Ombor.chegara('yoz:' + b.kod, 12))) return res.status(429).json({ ok: false, xato: 'kop' });
      await Ombor.yoz('baza', b.kod, matn);
      // reyting: ball va bilgan so'zlar shu hujjatdan qayta hisoblanadi; zaxira nusxa («kod + eski», ichida «ar») kirmaydi; xato saqlashni buzmaydi
      if (b.d.ar === undefined && !(b.kod.length > 26 && /eski$/.test(b.kod))) {
        try { await Rey.yangila(b.kod, b.d); } catch (e) {}
        try { await Stat.yangila(b.kod, b.d); } catch (e) {}   // «Эъроб» savollari statistikasi — xato saqlashni buzmaydi
      }
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ ok: false, xato: 'amal' });
  } catch (e) {
    return res.status(502).json({ ok: false, xato: 'ombor' });
  }
};
