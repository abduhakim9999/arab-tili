// Reyting hisobi va ombori (15.11.2026; docs/texnik.md 19). «_» bilan boshlangan fayl Vercel'da alohida funksiya bo'lmaydi —
// api/soz.js (har saqlashda yangilaydi) va api/reyting.js (ro'yxatni beradi) ishlatadi.
// Ombor: Upstash Redis (Vercel Marketplace orqali «arab-tili» loyihasiga ulanadi; env KV_REST_API_URL / KV_REST_API_TOKEN
// yoki UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — o'zi qo'yiladi). Ulanmagan bo'lsa — hech narsa qilmaydi (sayt ishlayveradi).
// Kalitlar: rey:h:<hafta boshi ms> — haftalik ball (ZSET, 3 hafta saqlanadi); rey:s — bilgan so'zlar (ZSET); rey:ism — ism (HASH).
// Ruscha profil (21.11.2026, foydalanuvchi: ruschada reyting alohida — ruscha o'qiyotganlar o'zaro): hujjatning «ru» qismidan,
// kalitlar rey:ru:h:<hb>, rey:ru:s; ism umumiy (rey:ism). Ikkala tilda o'qigan o'quvchi ikkala ro'yxatda alohida ball bilan.
// O'quvchi raqami — sha256("rey:" + kod) boshidagi 20 belgi: koddan topib bo'lmaydi, kod ko'rinmaydi.
// Ball va so'z soni — serverda, o'quvchi hujjatidagi takror jurnalidan (takror.js Takror.ball — sahifa bilan bir xil qoida).
const crypto = require('crypto');
const Takror = require('../takror.js');
const LUG = require('../data/lugat.json').s.filter(function (r) { return r.tk; });

const RURL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const HAFTA_SAQLA = 21 * 86400;                         // haftalik ro'yxat shuncha soniya turadi

function bor() { return !!(RURL && TOKEN); }
function id(kod) { return crypto.createHash('sha256').update('rey:' + kod).digest('hex').slice(0, 20); }
function hk(hb, til) { return (til === 'ru' ? 'rey:ru:h:' : 'rey:h:') + hb; }
function sk(til) { return til === 'ru' ? 'rey:ru:s' : 'rey:s'; }

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

// «Сўзлар» ro'yxati — faqat «мустаҳкам» so'zlar (23.11.2026, foydalanuvchi qarori: «Биламан» tugmasi bilan reytingga chiqib bo'lmasin —
// so'z «Такрор»da 7 + 21 kundan keyin ikki tekshiruvdan o'tgach sanaladi). Holat — takror.js Takror.holatlar (sahifa bilan bir xil qoida; kun — Toshkent vaqti)
function bilgan(d) {
  const W = d.soz || {}, H = Takror.holatlar(Array.isArray(d.j) ? d.j : [], { a: W.a || {}, b: W.b || {} }, -Takror.REY.TZ / 60000, LUG.map(function (r) { return String(r.id); }));
  let c = 0;
  LUG.forEach(function (r) { if (H[r.id] && H[r.id].st === 'm') c++; });
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
  const q = [
    x.h > 0 ? ['ZADD', H, x.h, i] : ['ZREM', H, i],
    ['EXPIRE', H, HAFTA_SAQLA],
    x.s > 0 ? ['ZADD', 'rey:s', x.s, i] : ['ZREM', 'rey:s', i],
    ['HSET', 'rey:ism', i, x.n]                          // bo'sh ism ham yoziladi — «bu o'quvchi hisoblangan» belgisi
  ];
  const ru = d && d.ru && typeof d.ru === 'object' && !Array.isArray(d.ru) ? d.ru : null;   // ruscha profil — faqat ruschada o'qiganda
  if (ru) {
    const y = hisob(ru), HR = hk(y.hb, 'ru');
    q.push(y.h > 0 ? ['ZADD', HR, y.h, i] : ['ZREM', HR, i], ['EXPIRE', HR, HAFTA_SAQLA], y.s > 0 ? ['ZADD', sk('ru'), y.s, i] : ['ZREM', sk('ru'), i]);
  }
  await redis(q);
}

module.exports = { bor: bor, id: id, hk: hk, sk: sk, redis: redis, hisob: hisob, yangila: yangila, tozaIsm: tozaIsm };
