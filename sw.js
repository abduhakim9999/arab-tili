/* Sahifalar (HTML): avval internetdan yangisi (1.5 s kutadi), bo'lmasa telefondagi nusxa.
   Kichik fayllar (sahifa, skript, shrift) — versiya bilan birga; audio (mp3) versiyaga kirmaydi:
   birinchi eshitilganda yuklanadi va «arab-tili-audio» keshida doim qoladi (nomida xesh bor — eskirmaydi).
   Yangi versiya (C) chiqqanda eski kesh o'chadi (audio keshi qoladi), ochiq sahifalar o'zi yangilanadi. */
var C = 'arab-tili-v264';
var FILES = ["./", "index.html", "tinglash.html", "yoriqnoma.html", "fel.html", "tg.js", "shell.js", "shell.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html", "8.html", "9.html", "70.html", "71.html", "72.html", "73.html", "74.html", "91.html", "92.html", "93.html", "94.html", "95.html", "96.html", "feellar.html", "sarf.html", "fiqh.html", "fkitob.html", "f1.html", "sarf-idx.json", "sarflink.js", "tarkib.js", "tarkib2.js", "hdr.js", "naskh.woff"];
var H = {"./": "5f03024173", "index.html": "5f03024173", "tinglash.html": "d2e2306d60", "yoriqnoma.html": "bda7642bbd", "fel.html": "6f8af68699", "tg.js": "7486b5d989", "shell.js": "40c06c6c29", "shell.css": "2ea7b6c1a2", "manifest.webmanifest": "d3a45d859a", "icon-192.png": "0acd724f54", "icon-512.png": "59c156234d", "icon-maskable-512.png": "42e24558b4", "1.html": "046673d62a", "2.html": "5fc0130c05", "3.html": "19a6eb2605", "4.html": "aedce1f529", "5.html": "5071807448", "6.html": "a6dec0e547", "7.html": "93f18e3174", "8.html": "47c14d47fb", "9.html": "0b07e337a6", "70.html": "ec5774bbf8", "71.html": "e6c2202229", "72.html": "04c3bce760", "73.html": "c8c573c699", "74.html": "549dfff037", "91.html": "18d8acc8b6", "92.html": "3ee9349bbd", "93.html": "8041ecd412", "94.html": "44f889c0d1", "95.html": "40f54c4078", "96.html": "e66baaead0", "feellar.html": "b0e4d84fb2", "sarf.html": "6546c26353", "fiqh.html": "cd4073643a", "fkitob.html": "7742e26350", "f1.html": "da22f6503f", "sarf-idx.json": "bc8692a745", "sarflink.js": "c087aaf734", "tarkib.js": "3c8ae89c50", "tarkib2.js": "00876d71ed", "hdr.js": "841ad2f877", "naskh.woff": "ba5a1b03b4"};
var TG = 'https://telegram.org/js/telegram-web-app.js';

var AUD = 'arab-tili-audio', LOAD = {};
function isMp3(u) { return /\.mp3$/i.test(new URL(u).pathname); }

/* 08.11.2026: yangilanish bo'lak-bo'lak — har fayl alohida; o'zgarmagani (H dagi xesh bir xil) eski keshdan ko'chiriladi,
   internetdan kelmagani ham eski nusxada qoladi — o'rnatish hech qachon butunlay bekor bo'lmaydi (sekin internetda ham). */
var HK = 'sw-hash.json';
self.addEventListener('install', function (e) {
  e.waitUntil(Promise.all([caches.open(C), caches.keys()]).then(function (a) {
    var c = a[0], old = a[1].filter(function (k) { return k !== C && k !== AUD && /^arab-tili-v\d+$/.test(k); });
    old.sort(function (x, y) { return +y.split('-v')[1] - +x.split('-v')[1]; });
    return (old.length ? caches.open(old[0]) : Promise.resolve(null)).then(function (o) {
      return (o ? o.match(HK).then(function (r) { return r ? r.json() : {}; }).catch(function () { return {}; }) : Promise.resolve({})).then(function (oh) {
        var got = {};
        function fromOld(f) {
          if (!o) return Promise.resolve(false);
          return o.match(f, { ignoreSearch: true }).then(function (r) { if (!r) return false; got[f] = oh[f] || ''; return c.put(f, r).then(function () { return true; }); });
        }
        function fromNet(f) {
          return fetch(new Request(f, { cache: 'no-cache' })).then(function (r) { if (!r.ok) throw new Error(r.status); got[f] = H[f] || ''; return c.put(f, r); });
        }
        return Promise.all(FILES.filter(function (f) { return !/\.mp3$/i.test(f); }).map(function (f) {
          var p = (H[f] && oh[f] === H[f]) ? fromOld(f).then(function (ok) { if (!ok) return fromNet(f); }) : fromNet(f);
          return p.catch(function () { return fromOld(f); }).catch(function () {});
        })).then(function () { return c.put(HK, new Response(JSON.stringify(got), { headers: { 'Content-Type': 'application/json' } })); });
      });
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  var upd = false;
  e.waitUntil(caches.keys().then(function (ks) {
    var old = ks.filter(function (k) { return k !== C && k !== AUD; }); upd = old.length > 0;
    /* eski versiyalardagi audioni yangi audio keshiga ko'chirish — qayta yuklanmasin */
    return caches.open(AUD).then(function (a) {
      return Promise.all(old.map(function (k) {
        return caches.open(k).then(function (oc) {
          return oc.keys().then(function (rs) {
            return Promise.all(rs.filter(function (q) { return isMp3(q.url); }).map(function (q) {
              return oc.match(q).then(function (res) { return res ? a.put(q.url.split('#')[0], res) : null; });
            }));
          });
        }).catch(function () {});
      }));
    }).then(function () { return Promise.all(old.map(function (k) { return caches.delete(k); })); });
  }).then(function () { return self.clients.claim(); }).then(function () {
    if (!upd) return;
    /* yangi versiya: ochiq sahifalarni bir marta qayta yuklash. 10.11.2026: tg.js li sahifalar o'zi yangilanadi
       (controllerchange; audio o'ynayotganda kutadi, «Янгилаш» tugmasi) — bu yerda faqat tg.js siz fiqh sahifalari */
    return self.clients.matchAll({ type: 'window' }).then(function (cs) {
      cs.forEach(function (cl) { try { if (/\/(fiqh|fkitob|f\d+)\.html$/.test(new URL(cl.url).pathname)) cl.navigate(cl.url); } catch (x) {} });
    });
  }));
});

/* audio: so'ralgan bo'lakni saqlangan fayldan kesib berish (orqaga-oldinga surish uchun) */
function ranged(req, res) {
  var m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  if (!m) return res;
  return res.arrayBuffer().then(function (buf) {
    var size = buf.byteLength, a = m[1] ? +m[1] : 0, b = m[2] ? Math.min(+m[2], size - 1) : size - 1;
    if (!m[1] && m[2]) { a = Math.max(0, size - +m[2]); b = size - 1; }
    if (a >= size) return new Response('', { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
    return new Response(buf.slice(a, b + 1), {
      status: 206,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg', 'Content-Range': 'bytes ' + a + '-' + b + '/' + size,
                 'Content-Length': String(b - a + 1), 'Accept-Ranges': 'bytes' }
    });
  });
}
/* audio birinchi marta: tarmoqdan oqim bilan beriladi, orqa fonda butun fayl keshga yoziladi (bir marta) */
function keep(url) {
  if (LOAD[url]) return LOAD[url];
  LOAD[url] = fetch(url).then(function (res) {
    if (res && res.status === 200) return caches.open(AUD).then(function (a) { return a.put(url, res); });
  }).catch(function () {}).then(function () { delete LOAD[url]; });
  return LOAD[url];
}

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var same = new URL(r.url).origin === location.origin;
  if (!same && r.url !== TG) return;
  /* 06.11.2026: sinov sahifalari va ularning fayllari telefonda saqlanmaydi — doim internetdan (eski nusxa chiqmasin) */
  if (same && /\/(sinov-[^/]*|shell-s\.(js|css))$/.test(new URL(r.url).pathname)) { e.respondWith(fetch(r, { cache: 'no-store' })); return; }
  var isRange = r.headers.has('range');
  if (same && isMp3(r.url)) {
    var url = r.url.split('#')[0].split('?')[0];
    e.respondWith(caches.match(url, { ignoreSearch: true }).then(function (hit) {
      if (hit) return isRange ? ranged(r, hit) : hit;
      e.waitUntil(keep(url));
      return fetch(r);
    }));
    return;
  }
  e.respondWith(caches.open(C).then(function (c) {
    var key = isRange ? r.url.split('#')[0] : r;
    return c.match(key, { ignoreSearch: same }).then(function (hit) {
      if (isRange) {
        if (hit) return ranged(r, hit);
        return fetch(r);
      }
      var net = fetch(r, { cache: 'no-cache' }).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone());
        return res;
      });
      var page = r.mode === 'navigate' || /\.html$|\/$/.test(new URL(r.url).pathname);
      if (page && hit) {
        /* sahifa: yangisi 1.5 s ichida kelsa — o'sha, kelmasa — telefondagi nusxa (yangisi keshga yoziladi) */
        e.waitUntil(net.catch(function () {}));
        return Promise.race([net.catch(function () { return hit; }),
                             new Promise(function (ok) { setTimeout(function () { ok(hit); }, 1500); })]);
      }
      if (hit) { e.waitUntil(net.catch(function () {})); return hit; }
      return net;
    });
  }));
});
