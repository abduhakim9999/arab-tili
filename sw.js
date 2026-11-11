/* Sahifalar (HTML): avval internetdan yangisi (1.5 s kutadi), bo'lmasa telefondagi nusxa.
   Kichik fayllar (sahifa, skript, shrift) — versiya bilan birga; audio (mp3) versiyaga kirmaydi:
   birinchi eshitilganda yuklanadi va «arab-tili-audio» keshida doim qoladi (nomida xesh bor — eskirmaydi).
   Yangi versiya (C) chiqqanda eski kesh o'chadi (audio keshi qoladi), ochiq sahifalar o'zi yangilanadi. */
var C = 'arab-tili-v273';
var FILES = ["./", "index.html", "tinglash.html", "yoriqnoma.html", "fel.html", "tg.js", "shell.js", "shell.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html", "8.html", "9.html", "70.html", "71.html", "72.html", "73.html", "74.html", "91.html", "92.html", "93.html", "94.html", "95.html", "96.html", "feellar.html", "sarf.html", "fiqh.html", "fkitob.html", "f1.html", "sarf-idx.json", "sarflink.js", "tarkib.js", "tarkib2.js", "hdr.js", "naskh.woff"];
var H = {"./": "5e5d15f133", "index.html": "5e5d15f133", "tinglash.html": "d2e2306d60", "yoriqnoma.html": "bda7642bbd", "fel.html": "6f8af68699", "tg.js": "095efabcfa", "shell.js": "40c06c6c29", "shell.css": "7d34dda023", "manifest.webmanifest": "d3a45d859a", "icon-192.png": "0acd724f54", "icon-512.png": "59c156234d", "icon-maskable-512.png": "42e24558b4", "1.html": "7da75920af", "2.html": "e0450672d7", "3.html": "377d9e5233", "4.html": "b05be9ebb8", "5.html": "0d1d304a85", "6.html": "0f7ed32618", "7.html": "e97546e81f", "8.html": "a176268c83", "9.html": "8739e40036", "70.html": "d90f323b2c", "71.html": "8ff91620a6", "72.html": "480b8d0c10", "73.html": "e846238b06", "74.html": "2bfb5ed4e3", "91.html": "c23c0e7f21", "92.html": "974caf6de5", "93.html": "c8d74e4292", "94.html": "96a262b0d7", "95.html": "b65164c521", "96.html": "a65663b766", "feellar.html": "b0e4d84fb2", "sarf.html": "6546c26353", "fiqh.html": "cd4073643a", "fkitob.html": "7742e26350", "f1.html": "2efbd599e3", "sarf-idx.json": "bc8692a745", "sarflink.js": "c087aaf734", "tarkib.js": "3c8ae89c50", "tarkib2.js": "00876d71ed", "hdr.js": "841ad2f877", "naskh.woff": "ba5a1b03b4"};
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
  if (!m) return synth(res);
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
/* AUDIO (12.11.2026). Uch qoida:
   1) Pleyerga beriladigan har javob — SW o'zi yasagan javob (synth). Sabab: Chrome bitta audio uchun javoblar manbasini
      solishtiradi; avval tarmoq javobi (URL bor), keyin keshdan yasalgan javob (URL yo'q) kelsa — media «seeking» da abadiy
      qotadi («Аудио юкланяпти… 35%» qotib turishi shundan edi: fayl orqa fonda keshga tushgach gap bosilsa).
   2) Fayl BIR marta yuklanadi (keep): o'sha yuklanishdan ham pleyer oqim oladi (feed), ham kesh yoziladi.
   3) Yuklanish holati haqqoniy: LOAD[url] = {got, total} — sahifa so'raydi (message 'aud'), foizni shundan ko'rsatadi. */
function synth(res) { return new Response(res.body, { status: res.status, statusText: res.statusText, headers: res.headers }); }
function net(r) { return fetch(r).then(synth); }
function wake(st) { var w = st.wait; st.wait = []; w.forEach(function (f) { f(); }); }
function keep(url) {
  if (LOAD[url]) return LOAD[url];
  var st = LOAD[url] = { chunks: [], got: 0, total: 0, done: false, fail: false, wait: [], type: 'audio/mpeg' };
  st.head = fetch(url).then(function (res) {
    if (!res || res.status !== 200 || !res.body) throw new Error('status');
    st.total = +res.headers.get('Content-Length') || 0; st.type = res.headers.get('Content-Type') || st.type;
    st.body = res.body.getReader();
  });
  st.all = st.head.then(function () {
    function rd() {
      return st.body.read().then(function (x) {
        if (x.done) return;
        st.chunks.push(x.value); st.got += x.value.byteLength; wake(st);
        return rd();
      });
    }
    return rd();
  }).then(function () {
    if (st.total && st.got !== st.total) throw new Error('short');
    var h = { 'Content-Type': st.type, 'Content-Length': String(st.got) };
    return caches.open(AUD).then(function (a) { return a.put(url, new Response(new Blob(st.chunks, { type: st.type }), { status: 200, headers: h })); });
  }).then(function () { st.done = true; }, function () { st.fail = true; }).then(function () { delete LOAD[url]; wake(st); });
  st.head.catch(function () {});
  return st;
}
/* davom etayotgan yuklanishdan a..b baytlarni oqim qilib berish (kelmagan qismini kutadi) */
function feed(st, a, b) {
  var pos = a, ci = 0, cs = 0; /* ci — bo'lak raqami, cs — shu bo'lak boshi (bayt) */
  var body = new ReadableStream({
    pull: function (c) {
      function next() {
        if (pos > b) { c.close(); return; }
        while (ci < st.chunks.length && cs + st.chunks[ci].byteLength <= pos) { cs += st.chunks[ci].byteLength; ci++; }
        if (ci < st.chunks.length) {
          var ch = st.chunks[ci], from = pos - cs, to = Math.min(ch.byteLength, b + 1 - cs);
          c.enqueue(ch.subarray(from, to).slice()); pos = cs + to; return;
        }
        if (st.fail) { c.error(new Error('net')); return; }
        if (st.done) { c.close(); return; }
        return new Promise(function (ok) { st.wait.push(ok); }).then(next);
      }
      return next();
    }
  });
  return new Response(body, { status: 206, headers: { 'Content-Type': st.type, 'Content-Range': 'bytes ' + a + '-' + b + '/' + st.total,
                                                       'Content-Length': String(b - a + 1), 'Accept-Ranges': 'bytes' } });
}
/* keshda yo'q audio so'rovi: yuklanish boshlangan/boshlanadi; so'ralgan joy yuklangan qismga yaqin bo'lsa — o'sha yuklanishdan,
   uzoq bo'lsa (oldinga surilgan) — tarmoqdan shu bo'lak (yuklanish orqa fonda davom etadi) */
var NEAR = 96 * 1024;
function audio(e, r, url) {
  var st = keep(url);
  e.waitUntil(st.all);
  var m = /bytes=(\d+)-(\d*)/.exec(r.headers.get('range') || '');
  if (r.headers.has('range') && !m) return net(r);
  var a = m ? +m[1] : 0;
  return st.head.then(function () {
    if (!st.total || st.fail || a > st.got + NEAR || a >= st.total) return net(r);
    var b = m && m[2] ? Math.min(+m[2], st.total - 1) : st.total - 1;
    if (!m) { /* Range'siz so'rov — to'liq javob (200) */
      var full = feed(st, 0, st.total - 1);
      return new Response(full.body, { status: 200, headers: { 'Content-Type': st.type, 'Content-Length': String(st.total), 'Accept-Ranges': 'bytes' } });
    }
    return feed(st, a, b);
  }, function () { return net(r); });
}
/* sahifa so'raydi: audio telefondami, yuklanyaptimi, necha foiz ({t:'aud', url, start}) */
self.addEventListener('message', function (e) {
  var d = e.data || {}, port = e.ports && e.ports[0];
  if (d.t !== 'aud' || !d.url || !port) return;
  var url = String(d.url).split('#')[0].split('?')[0];
  e.waitUntil(caches.match(url, { ignoreSearch: true }).then(function (hit) {
    var st = LOAD[url];
    if (!hit && !st && d.start) { st = keep(url); st.all.then(function () {}); }
    port.postMessage({ cached: !!hit, loading: !!st, got: st ? st.got : 0, total: st ? st.total : 0 });
    if (st && d.start) return st.all;
  }));
});

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
      if (hit) return isRange ? ranged(r, hit) : synth(hit);
      return audio(e, r, url);
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
