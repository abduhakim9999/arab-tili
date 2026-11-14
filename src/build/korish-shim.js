/* github.io ko'rish manzili (tayyor/__NOM__/; src/build/korish.sh har sahifa boshiga qo'yadi, 14.11.2026; docs/texnik.md 1).
   Asosiy github.io natijalariga tegmaydi: localStorage va keshlar «korish:__NOM__:» oldi bilan alohida;
   server (window.Baza, /api, statistika) va service worker o'chiq — sinov sahifasi kabi («Синов саҳифасида уланмайди»). */
(function () {
  var P = 'korish:__NOM__:', api = /\/api\/|vercel\.app/;
  try {
    var L = window.localStorage;
    var ks = function () { var r = [], i, k; for (i = 0; i < L.length; i++) { k = L.key(i); if (k && k.indexOf(P) === 0) r.push(k.slice(P.length)); } return r; };
    var S = {
      getItem: function (k) { return L.getItem(P + k); },
      setItem: function (k, v) { L.setItem(P + k, String(v)); },
      removeItem: function (k) { L.removeItem(P + k); },
      clear: function () { ks().forEach(function (k) { L.removeItem(P + k); }); },
      key: function (i) { var a = ks(); return i < a.length ? a[i] : null; }
    };
    Object.defineProperty(S, 'length', { configurable: true, get: function () { return ks().length; } });
    var X = new Proxy(S, {
      get: function (t, k) { if (k in t) return t[k]; if (typeof k !== 'string') return undefined; var v = L.getItem(P + k); return v === null ? undefined : v; },
      set: function (t, k, v) { if (!(k in t)) t.setItem(k, v); return true; },
      deleteProperty: function (t, k) { t.removeItem(k); return true; },
      has: function (t, k) { return k in t || L.getItem(P + k) !== null; },
      ownKeys: function () { return ks(); },
      getOwnPropertyDescriptor: function (t, k) { var v = L.getItem(P + k); return v === null ? undefined : { value: v, writable: true, enumerable: true, configurable: true }; }
    });
    Object.defineProperty(window, 'localStorage', { configurable: true, get: function () { return X; } });
  } catch (e) {}
  try {
    if (window.caches) {
      var C = window.caches, co = C.open.bind(C), ch = C.has.bind(C), cd = C['delete'].bind(C), ck = C.keys.bind(C);
      C.open = function (n) { return co(P + n); };
      C.has = function (n) { return ch(P + n); };
      C['delete'] = function (n) { return cd(P + n); };
      C.keys = function () { return ck().then(function (a) { return a.filter(function (n) { return n.indexOf(P) === 0; }).map(function (n) { return n.slice(P.length); }); }); };
    }
  } catch (e) {}
  try { Object.defineProperty(window, 'Baza', { configurable: false, get: function () { return undefined; }, set: function () {} }); } catch (e) {}
  try { if (navigator.serviceWorker) navigator.serviceWorker.register = function () { return Promise.reject(new Error('korish')); }; } catch (e) {}
  try {
    var of = window.fetch;
    window.fetch = function (u) { var s = typeof u === 'string' ? u : (u && u.url) || String(u); return api.test(s) ? Promise.reject(new TypeError('korish: server yopiq')) : of.apply(this, arguments); };
  } catch (e) {}
  try { if (navigator.sendBeacon) { var sb = navigator.sendBeacon.bind(navigator); navigator.sendBeacon = function (u, d) { return api.test(String(u)) ? false : sb(u, d); }; } } catch (e) {}
  try { var xo = XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open = function (m, u) { if (api.test(String(u))) arguments[1] = 'data:,'; return xo.apply(this, arguments); }; } catch (e) {}
})();
