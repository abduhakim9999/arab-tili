// O'quvchi hujjatlari ombori (24.11.2026; docs/texnik.md 17).
// Asosiy ombor — Upstash Redis (reyting bilan bir baza; env KV_REST_API_* yoki UPSTASH_REDIS_REST_*).
// Sabab: Vercel Blob Hobby'da oyiga 2 000 yozish bepul, oshsa Blob yopiladi; Upstash bepulda oyiga 500 000 buyruq.
// Eski Blob — faqat o'qish uchun zaxira: Redis'da yo'q hujjat birinchi o'qilganda Blob'dan olinib Redis'ga ko'chiriladi
// (sekin ko'chish, hech kim hech narsa yo'qotmaydi). Redis ulanmagan bo'lsa — hammasi avvalgidek Blob'da.
// Kalit: hujjat turi + sha256(tur + ':' + kod) — kodning o'zi hech qayerda saqlanmaydi.
//   baza:<xesh>  — o'quvchi hujjati (so'z belgilari, takror jurnali, sozlamalar…)
//   tg:<xesh>    — Telegram akkaunti (id, username, ism)
//   ulash:<xesh> — bir martalik ulash belgisi, 10 daqiqada o'zi o'chadi
const crypto = require('crypto');
const Rey = require('./_rey.js');

const TOK = process.env.BLOB_READ_WRITE_TOKEN || '';
const STORE = TOK.split('_')[3] || '';

function xesh(tur, s) { return crypto.createHash('sha256').update(tur + ':' + s).digest('hex'); }
function kalit(tur, s) { return tur + ':' + xesh(tur, s); }
function blobYol(tur, s) { return tur + '/' + xesh(tur, s) + '.json'; }

async function blobOl(yol) {
  if (!TOK || !STORE) return null;
  const r = await fetch('https://' + STORE.toLowerCase() + '.private.blob.vercel-storage.com/' + yol + '?t=' + Date.now(),
    { headers: { authorization: 'Bearer ' + TOK }, cache: 'no-store' });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('ol ' + r.status);
  const t = await r.text();
  return t && t !== '{}' ? t : null;
}
async function blobYoz(yol, matn) {
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

function bor() { return Rey.bor() || !!(TOK && STORE); }

// o'qish: Redis → (yo'q bo'lsa) eski Blob → Redis'ga ko'chirish. Natija — JSON obyekt yoki null.
async function ol(tur, s) {
  if (Rey.bor()) {
    const [v] = await Rey.redis([['GET', kalit(tur, s)]]);
    if (v != null) return v === '{}' ? null : JSON.parse(v);
    if (tur === 'ulash') return null;                    // ulash belgilari Blob'dan olinmaydi (10 daqiqalik)
    const eski = await blobOl(blobYol(tur, s)).catch(function () { return null; });
    if (eski == null) return null;
    await Rey.redis([['SET', kalit(tur, s), eski]]);
    return JSON.parse(eski);
  }
  const t = await blobOl(blobYol(tur, s));
  return t == null ? null : JSON.parse(t);
}

// yozish: Redis (ttl — soniya, ixtiyoriy); Redis ulanmagan bo'lsa — Blob
async function yoz(tur, s, matn, ttl) {
  if (Rey.bor()) {
    await Rey.redis([ttl ? ['SET', kalit(tur, s), matn, 'EX', ttl] : ['SET', kalit(tur, s), matn]]);
    return;
  }
  await blobYoz(blobYol(tur, s), matn);
}

// so'rovlar chegarasi: bir kalitga (IP yoki kod) daqiqada n tadan ko'p emas. Redis yo'q bo'lsa — cheklanmaydi.
async function chegara(nom, n) {
  if (!Rey.bor()) return true;
  const k = 'rl:' + xesh('rl', nom).slice(0, 24) + ':' + Math.floor(Date.now() / 60000);
  const [c] = await Rey.redis([['INCR', k], ['EXPIRE', k, 120]]);
  return +c <= n;
}

function ip(req) {
  const x = String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '');
  return x.split(',')[0].trim() || 'nomalum';
}

module.exports = { bor: bor, ol: ol, yoz: yoz, chegara: chegara, ip: ip };
