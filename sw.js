/* Sahifalar (HTML): avval internetdan yangisi (1.5 s kutadi), bo'lmasa telefondagi nusxa.
   Kichik fayllar (sahifa, skript, shrift) — versiya bilan birga; audio (mp3) versiyaga kirmaydi:
   birinchi eshitilganda yuklanadi va «arab-tili-audio» keshida doim qoladi (nomida xesh bor — eskirmaydi).
   Yangi versiya (C) chiqqanda eski kesh o'chadi (audio keshi qoladi), ochiq sahifalar o'zi yangilanadi. */
var C = 'arab-tili-v192';
var FILES = ["./", "index.html", "tinglash.html", "yoriqnoma.html", "fel.html", "tg.js", "shell.js", "shell.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html", "70.html", "71.html", "72.html", "73.html", "74.html", "91.html", "92.html", "93.html", "94.html", "95.html", "feellar.html", "sarf.html", "fiqh.html", "f1.html", "sarf-idx.json", "sarflink.js", "tarkib.js", "tarkib2.js", "hdr.js", "naskh.woff"];
var TG = 'https://telegram.org/js/telegram-web-app.js';

var AUD = 'arab-tili-audio', LOAD = {};
function isMp3(u) { return /\.mp3$/i.test(new URL(u).pathname); }

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) {
    return c.addAll(FILES.filter(function (f) { return !/\.mp3$/i.test(f); }).map(function (f) { return new Request(f, { cache: 'no-cache' }); }));
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
    /* yangi versiya: ochiq sahifalarni bir marta qayta yuklash */
    return self.clients.matchAll({ type: 'window' }).then(function (cs) {
      cs.forEach(function (cl) { try { cl.navigate(cl.url); } catch (x) {} });
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
