/* Fiqh ilovasi (09.11.2026): faqat nurut-tolib-fiqh domenida. Internetdan oladi, ochilgan sahifalarni saqlaydi — internet bo'lmasa saqlanganini ko'rsatadi. */
var C = 'fiqh-v1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin || r.headers.has('range')) return;
  e.respondWith(fetch(r, { cache: 'no-cache' }).then(function (res) {
    if (res.ok && res.status === 200) { var c = res.clone(); caches.open(C).then(function (x) { x.put(r, c); }); }
    return res;
  }).catch(function () { return caches.match(r, { ignoreSearch: true }).then(function (m) { return m || Response.error(); }); }));
});
