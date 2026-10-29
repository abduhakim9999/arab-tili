/* Avval telefondagi nusxa darhol ochiladi, yangisi orqa fonda yuklab olinadi.
   Yangi versiya (VER) chiqqanda hammasi qaytadan yuklanadi. */
var C = 'arab-tili-v155';
var FILES = ["./", "index.html", "tinglash.html", "fel.html", "tg.js", "shell.js", "shell.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "1.html", "2.html", "3.html", "4.html", "70.html", "71.html", "72.html", "73.html", "74.html", "91.html", "92.html", "93.html", "feellar.html", "sarf.html", "sarf-idx.json", "sarflink.js", "tarkib.js", "tarkib2.js", "hdr.js", "naskh.woff", "a1-8915a8a5.mp3", "a2-e553110d.mp3", "a3-25daf782.mp3", "a4-34c34994.mp3", "a70-38568abf.mp3", "a71-10b47ba4.mp3", "a72-b1ffc444.mp3", "a73-26e4389d.mp3", "a74-999cfa80.mp3", "a91-c13b9797.mp3", "a92-73d0b542.mp3", "a93-97fe1435.mp3", "l74-c166f09f.mp3"];
var TG = 'https://telegram.org/js/telegram-web-app.js';

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
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

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var same = new URL(r.url).origin === location.origin;
  if (!same && r.url !== TG) return;
  var isRange = r.headers.has('range');
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
      if (hit) { e.waitUntil(net.catch(function () {})); return hit; }
      return net;
    });
  }));
});
