// Reyting hisobi va ombori (15.11.2026; docs/texnik.md 19). «_» bilan boshlangan fayl Vercel'da alohida funksiya bo'lmaydi —
// api/soz.js (har saqlashda yangilaydi) va api/reyting.js (ro'yxatni beradi) ishlatadi.
// Ombor: Upstash Redis (Vercel Marketplace orqali «arab-tili» loyihasiga ulanadi; env KV_REST_API_URL / KV_REST_API_TOKEN
// yoki UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — o'zi qo'yiladi). Ulanmagan bo'lsa — hech narsa qilmaydi (sayt ishlayveradi).
// Kalitlar: rey:h:<hafta boshi ms> — haftalik ball (ZSET, 3 hafta saqlanadi); rey:s — bilgan so'zlar (ZSET); rey:ism — ism (HASH).
// O'quvchi raqami — sha256("rey:" + kod) boshidagi 20 belgi: koddan topib bo'lmaydi, kod ko'rinmaydi.
// Ball va so'z soni — serverda, o'quvchi hujjatidagi takror jurnalidan (takror.js Takror.ball — sahifa bilan bir xil qoida).
const crypto = require('crypto');
const Takror = require('../takror.js');
const LUG = require('../data/lugat.json').s.filter(function (r) { return r.tk; });

const RURL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const HAFTA_SAQLA = 21 * 86400;                         // haftalik ro'yxat shuncha soniya turadi
const BILDI = 3;                                        // takror.html BILDI bilan bir xil

function bor() { return !!(RURL && TOKEN); }
function id(kod) { return crypto.createHash('sha256').update('rey:' + kod).digest('hex').slice(0, 20); }
function hk(hb) { return 'rey:h:' + hb; }

async function redis(cmds) {                            // pipeline: [[cmd, ...args], ...] → [natija, ...]
  const r = await fetch(RURL.replace(/\/$/, '') + '/pipeline', {
    method: 'POST', headers: { authorization: 'Bearer ' + TOKEN, 'content-type': 'application/json' }, body: JSON.stringify(cmds)
  });
  if (!r.ok) throw new Error('redis ' + r.status);
  const j = await r.json();
  return j.map(function (x) { if (x.error) throw new Error('redis ' + x.error); return x.result; });
}

// ism: boshqaruv va ko'rinmas belgilarsiz (o'ngdan-chapga o'giruvchilar ham), 30 belgigacha
function tozaIsm(n) {
  return String(n || '').replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁠-⁯﻿]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);
}

// «N сўзни биламан» — takror.html sozlar() + menHisob() bilan bir xil (kun — Toshkent vaqti, sahifada — o'quvchi soati)
function bilgan(d) {
  const W = d.soz || {}, b = W.b || {}, a = W.a || {}, k = W.k || {}, s = W.s || {};
  const f = {}; let faol = Object.keys(s); if (!faol.length) faol = ['1']; faol.forEach(function (x) { f[x] = 1; });
  const K = {};
  (Array.isArray(d.j) ? d.j : []).slice().sort(function (x, y) { return x[1] - y[1]; }).forEach(function (e) {
    const m = /^w(\d+)[auos]$/.exec(e && e[0]); if (!m) return;
    const x = K[m[1]] = K[m[1]] || { d: 0, k: null, n: 0 }; x.n++;
    if (e[2] === 1) { x.d = 0; x.k = null; return; }
    const kn = Math.floor((e[1] + Takror.REY.TZ) / 86400000); if (kn !== x.k) { x.k = kn; x.d++; }
  });
  let c = 0;
  LUG.forEach(function (r) {
    const x = K[r.id] || { d: 0, n: 0 };
    if (!(f[r.d] || b[r.id] || a[r.id] || x.n > 0)) return;      // «mening so'zlarim»ga kirmagan
    if (x.d >= BILDI) c++;
    else if (!b[r.id] && (a[r.id] || k[r.id])) c++;
  });
  return c;
}

function hisob(d, t) {
  const hb = Takror.haftaBoshi(t || Date.now());
  const j = Array.isArray(d && d.j) ? d.j.filter(function (e) { return Array.isArray(e) && typeof e[0] === 'string' && typeof e[1] === 'number'; }) : [];
  return { hb: hb, h: Takror.ball(j, hb), s: d ? bilgan(Object.assign({}, d, { j: j })) : 0, n: tozaIsm(d && d.ism && d.ism.n) };
}

// o'quvchi hujjati saqlanganda — ro'yxatlarni yangilash
async function yangila(kod, d) {
  if (!bor()) return;
  const x = hisob(d), i = id(kod), H = hk(x.hb);
  await redis([
    x.h > 0 ? ['ZADD', H, x.h, i] : ['ZREM', H, i],
    ['EXPIRE', H, HAFTA_SAQLA],
    x.s > 0 ? ['ZADD', 'rey:s', x.s, i] : ['ZREM', 'rey:s', i],
    ['HSET', 'rey:ism', i, x.n]                          // bo'sh ism ham yoziladi — «bu o'quvchi hisoblangan» belgisi
  ]);
}

module.exports = { bor: bor, id: id, hk: hk, redis: redis, hisob: hisob, yangila: yangila, tozaIsm: tozaIsm };
