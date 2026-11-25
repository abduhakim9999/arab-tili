/* Sahifalar (HTML): avval internetdan yangisi (1.5 s kutadi), bo'lmasa telefondagi nusxa.
   Kichik fayllar (sahifa, skript, shrift) — versiya bilan birga; audio (mp3) versiyaga kirmaydi:
   birinchi eshitilganda yuklanadi va «arab-tili-audio» keshida doim qoladi (nomida xesh bor — eskirmaydi).
   Yangi versiya (C) chiqqanda eski kesh o'chadi (audio keshi qoladi), ochiq sahifalar o'zi yangilanadi. */
var C = 'arab-tili-v340';
/* 24.11.2026: ruscha darslar (ruN.html) oldindan yuklanmaydi — birinchi ochilganda keshga tushadi (o'zbekcha o'quvchi 3,5 MB ortiqcha yuklamasin) */
var FILES = ["./", "index.html", "tinglash.html", "yoriqnoma.html", "nahv.html", "takror.html", "takror.js", "baza.js", "yol.html", "sozlamalar.html", "yana.html", "qoidalar.html", "tatbiq.js", "reyting.html", "qobiq.js", "qollanma.js", "qol/mavzu.js", "qol/mavzu-ru.js", "data/lugat.json", "data/mashq.json", "data/darslar.json", "data/ikonka.json", "tg.js", "shell.js", "shell.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "1.html", "2.html", "3.html", "4.html", "5.html", "6.html", "7.html", "8.html", "9.html", "10.html", "11.html", "12.html", "70.html", "71.html", "72.html", "73.html", "74.html", "90.html", "91.html", "92.html", "93.html", "94.html", "95.html", "96.html", "97.html", "98.html", "sarf.html", "fiqh.html", "fkitob.html", "f1.html", "sarf-idx.json", "sarflink.js", "tarkib.js", "tarkib2.js", "tarkib3.js", "hdr.js", "naskh.woff", "ru.js", "ru-index.js"];
var H = {"./": "ccbf8e1daa", "index.html": "ccbf8e1daa", "tinglash.html": "c3d9eca968", "yoriqnoma.html": "95333fe01d", "nahv.html": "dc3796cb6c", "takror.html": "8b3b18e5d8", "takror.js": "2b0d29317c", "baza.js": "5394c022fb", "yol.html": "d0af41afaa", "sozlamalar.html": "4cfb5ca5c4", "yana.html": "3ae80e3a07", "qoidalar.html": "7b90c951e5", "tatbiq.js": "20a252be75", "reyting.html": "89c4830331", "qobiq.js": "8a3a72bdae", "qollanma.js": "2884eee41c", "qol/mavzu.js": "7602d0410c", "qol/mavzu-ru.js": "146b5d6402", "data/lugat.json": "03ab52eb05", "data/mashq.json": "5ff5f08f6f", "data/darslar.json": "04f393ff57", "data/ikonka.json": "bbd9ece1a6", "tg.js": "328dfb96be", "shell.js": "d2b21d9fec", "shell.css": "912b01359e", "manifest.webmanifest": "d3a45d859a", "icon-192.png": "0acd724f54", "icon-512.png": "59c156234d", "icon-maskable-512.png": "42e24558b4", "1.html": "37387c4a09", "2.html": "7f68bc9afe", "3.html": "1a21d20bc9", "4.html": "d5fe6ebcea", "5.html": "2579cc6f7b", "6.html": "077a908866", "7.html": "51060a287f", "8.html": "29fbe85d30", "9.html": "6706fd7591", "10.html": "5e564ce22a", "11.html": "05839e560c", "12.html": "65dcbbedb3", "70.html": "2d31585261", "71.html": "eb340d93b8", "72.html": "7a97546044", "73.html": "2d3dcf19a3", "74.html": "82730cc4fc", "90.html": "3a91b141db", "91.html": "2f6e415f2f", "92.html": "74b67c14f4", "93.html": "2adc7dc000", "94.html": "ef3705d1c0", "95.html": "9d61760031", "96.html": "bae15f2dec", "97.html": "b514b0b602", "98.html": "9ba4378dec", "sarf.html": "6546c26353", "fiqh.html": "25cebd5b67", "fkitob.html": "0ece018785", "f1.html": "e4125442a1", "sarf-idx.json": "bc8692a745", "sarflink.js": "c087aaf734", "tarkib.js": "3c8ae89c50", "tarkib2.js": "00876d71ed", "tarkib3.js": "de5d285470", "hdr.js": "841ad2f877", "naskh.woff": "ba5a1b03b4", "ru.js": "17e485cc11", "ru-index.js": "4e0f6447e9"};
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
        var got = {}, jami = 0, bitdi = 0, xAt = 0;
        /* 25.11.2026: ochiq sahifaga o'rnatish foizi («Янги версия юкланмоқда… N%», tg.js) */
        function xabar(oxir) {
          if (!oxir && Date.now() - xAt < 300) return; xAt = Date.now();
          self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
            cs.forEach(function (cl) { cl.postMessage({ t: 'upd', k: bitdi, n: jami }); });
          }).catch(function () {});
        }
        function fromOld(f) {
          if (!o) return Promise.resolve(false);
          return o.match(f, { ignoreSearch: true }).then(function (r) { if (!r) return false; got[f] = oh[f] || ''; return c.put(f, r).then(function () { return true; }); });
        }
        function fromNet(f) {
          return fetch(new Request(f, { cache: 'no-cache' })).then(function (r) { if (!r.ok) throw new Error(r.status); got[f] = H[f] || ''; return c.put(f, r); });
        }
        var fl = FILES.filter(function (f) { return !/\.mp3$/i.test(f); });
        jami = fl.filter(function (f) { return !(H[f] && oh[f] === H[f]); }).length;
        return Promise.all(fl.map(function (f) {
          var yangi = !(H[f] && oh[f] === H[f]);
          var p = yangi ? fromNet(f) : fromOld(f).then(function (ok) { if (!ok) return fromNet(f); });
          return p.catch(function () { return fromOld(f); }).catch(function () {}).then(function () { if (yangi) { bitdi++; xabar(bitdi === jami); } });
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

/* 25.11.2026: ilova ochilganda yangi versiyani darhol so'rash — brauzer o'zi sahifa fayllari yuklanib bo'lgach (bir necha soniya kechikib)
   so'raydi; shu kechikishda eski versiya ko'rinib turardi. Ko'pi bilan 30 s da bir (sw.js ≈15 KB) */
var soradi = 0;
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  if (r.mode === 'navigate' && Date.now() - soradi > 30000) { soradi = Date.now(); try { self.registration.update().catch(function () {}); } catch (x) {} }
  var same = new URL(r.url).origin === location.origin;
  if (!same && r.url !== TG) return;
  /* 21.11.2026: video (mp4) — keshlanmaydi, brauzer o'zi bo'laklab oladi (katta fayl) */
  if (same && /\.mp4$/i.test(new URL(r.url).pathname)) return;
  /* 06.11.2026: sinov sahifalari va ularning fayllari telefonda saqlanmaydi — doim internetdan (eski nusxa chiqmasin); 14.11: github.io /tayyor/ ham */
  if (same && /\/(sinov-[^/]*|shell-s\.(js|css))$|\/tayyor\//.test(new URL(r.url).pathname)) { e.respondWith(fetch(r, { cache: 'no-store' })); return; }
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
