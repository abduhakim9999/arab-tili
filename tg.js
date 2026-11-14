/* Telegram Mini App ulanishi + natijalarni Telegram bulutida saqlash */
(function () {
  var me = document.currentScript;
  /* ko'rinish: «Созламалар» → Кўриниш (yorug / tungi; avto — telefon sozlamasi). docs/texnik.md 16 */
  try { var _k = JSON.parse(localStorage.getItem('sozlama') || '{}').kor; if (_k === 'yorug' || _k === 'tungi') document.documentElement.setAttribute('data-theme', _k === 'tungi' ? 'dark' : 'light'); } catch (e) {}
  /* «Офлайн сақлаш» o'chirilgan bo'lsa — saqlangan dars ovozlari (sw.js keshi) har sahifa ochilganda tozalanadi: telefonda yig'ilib qolmaydi */
  try { if (JSON.parse(localStorage.getItem('sozlama') || '{}').oflayn === false && window.caches) caches.delete('arab-tili-audio'); } catch (e) {}
  /* «baza-vt» (14.11.2026, foydalanuvchi: kerakli hamma narsa akkaunt orqali saqlansin): serverga ham ketadigan sozlama va dars holati
     kalitlarining o'zgargan vaqti (baza.js birlashtirishda yangisini tanlaydi; ro'yxat — baza.js GEN bilan bir xil) va «baza-oz» (yuborilmagan
     o'zgarish bor). Hamma sahifada — baza.js yo'q sahifada (dars, Сарф, Феъллар) ham. baza.js serverdan yozganda (BAZA_ICHKI) belgilanmaydi. */
  try {
    var GEN = /^(dars\d+-holat|sarf-holat|fel_done|fl200_(best|mist|t)|sozlama|sozlama-q|til|dars-uz|dars-tezlik|izoh-til|tinglash-(opt|mode|dars)|fe-pref|oxirgi-dars)$/;
    var s0 = Storage.prototype.setItem, r0 = Storage.prototype.removeItem;
    var belgi = function (st, k) {
      if (window.BAZA_ICHKI || !GEN.test(k)) return;
      try { var m = JSON.parse(st.getItem('baza-vt') || '{}'), t = Date.now(); m[k] = t; s0.call(st, 'baza-vt', JSON.stringify(m)); if (!st.getItem('baza-oz')) s0.call(st, 'baza-oz', String(t)); } catch (e) {}
    };
    Storage.prototype.setItem = function (k, v) { if (this !== window.localStorage) return s0.call(this, k, v); var o = this.getItem(k); s0.call(this, k, v); if (o !== String(v)) belgi(this, k); };
    Storage.prototype.removeItem = function (k) { if (this !== window.localStorage) return r0.call(this, k); var o = this.getItem(k); r0.call(this, k); if (o !== null) belgi(this, k); };
  } catch (e) {}
  var KEY = me.getAttribute('data-key') || '';
  var HOME = me.getAttribute('data-home') || '';
  /* ҚОБИҚ (13.11.2026): bosh sahifaga qaytadigan sahifalar (darslar, Сарф, Наҳв, йўриқнома…) oxirgi ochilgan bo'limga qaytadi —
     qobiq.js uni sessionStorage «qobiq-uy» ga yozadi (yol.html / takror.html / qoidalar.html / yana.html). Yozuv bo'lmasa — bosh sahifa
     (u xaritaga o'tkazadi). Ikkala tilda bir xil (14.11.2026). */
  var UY = '';
  try { UY = sessionStorage.getItem('qobiq-uy') || ''; } catch (e) {}
  if (!/^[a-z-]+\.html$/.test(UY)) UY = '';
  function uyMi(p) { return /\/(index\.html)?$/.test(p); }   /* sayt ildizi (bosh sahifa) */
  if (UY && uyMi(new URL(HOME || 'x', location.href).pathname)) HOME = UY;
  var TK = KEY + '-t', W = null, tm = null, last = 0, BLOCK = false;
  var LT0 = 0; try { LT0 = +(localStorage.getItem(TK) || 0); } catch (e) {}

  /* bosilganda darhol belgi: sahifa yuklanayotganini ko'rsatadi */
  try {
    var css = document.createElement('style');
    css.textContent = 'html.go body{pointer-events:none}' +
      'html.go::before{content:"";position:fixed;z-index:99;left:0;top:0;height:3px;width:100%;background:#0f7a4f;transform-origin:left;animation:gobar 1.4s cubic-bezier(.2,.8,.2,1) forwards}' +
      'html.go::after{content:"";position:fixed;inset:0;z-index:98;background:rgba(0,0,0,.05)}' +
      '@keyframes gobar{from{transform:scaleX(.08)}to{transform:scaleX(.9)}}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
  /* qulf ko'pi bilan 5 s (06.11.2026): sahifa kelmasa (sekin internet) — ekran qotib qolmasin */
  var goT = null;
  function goOff() { clearTimeout(goT); document.documentElement.classList.remove('go'); }
  function goOn() { document.documentElement.classList.add('go'); clearTimeout(goT); goT = setTimeout(goOff, 5000); }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) goOff(); });
  function inTg() {
    if (W) return true;
    if (window.TelegramWebviewProxy || /tgWebApp/.test(location.hash)) return true;
    /* 11.11.2026: telegram-web-app.js Telegramdan tashqarida ham bu kalitga «{}» yozadi —
       ilovada (PWA) havolalar location.replace bo'lib, telefon «orqaga» tugmasi ilovani yopardi. */
    try {
      var p = JSON.parse(sessionStorage.getItem('__telegram__initParams') || '{}');
      return !!(p && (p.tgWebAppData || p.tgWebAppVersion));
    } catch (e) { return false; }
  }
  /* KIRISH (14.11.2026, foydalanuvchi qarori; docs/texnik.md 17). Kech (foydalanuvchi: «kerakli hamma narsa akkaunt orqali saqlansin, boshqa
     telefonda ham ochilsin»): Telegramdan tashqarida **kirishsiz faqat 1-darsni o'qish va eshitish**; natija yaratadigan hammasi — Telegram orqali
     kirgandan keyin. Telegram ichida, sinov va ko'rish (github.io /tayyor/) sahifalarida so'ralmaydi. Kirish — baza.js (ulashBoshla / ulashTekshir).
       N-dars (N≠1), takror.html (Луғат), sarf.html, feellar.html, fel.html, tinglash.html (1-darsdan boshqa) — sahifa ochilganda;
       1-dars — «Луғат» / «Машқ» yorlig'i bosilganda (oynani yopsa bo'ladi); yol.html — so'z saralash va imtihon boshlanganda (Kirish.oyna). */
  var Kirish = window.Kirish = (function () {
    function G(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function kerak() { return !(inTg() || G('baza-tg') || window.KORISH || /\/sinov-[^\/]*$/.test(location.pathname)); }
    var TG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.4 3.6 2.9 10.7c-1 .4-1 1.1-.2 1.4l4.7 1.5 1.8 5.6c.2.6.4.8.9.8s.6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.8zM9.8 14.3l8.2-5.2c.4-.2.7-.1.4.2l-6.9 6.3-.3 3.2z"/></svg>';
    var d = null, xbEl, kt = null;
    function xb(t) { if (xbEl) xbEl.textContent = t; }
    function yop() { clearInterval(kt); if (d && d.parentNode) d.parentNode.removeChild(d); d = null; document.documentElement.style.overflow = ''; }
    function tek() {
      if (document.hidden || !d || !window.Baza || !Baza.ulashKutmoqda()) return;
      Baza.ulashTekshir(function (ok, tugadi) {
        if (ok) { clearInterval(kt); xb('Уланди ✓'); setTimeout(yop, 800); }
        else if (tugadi) { clearInterval(kt); xb('Вақт тугади. Қайта босинг.'); }
      });
    }
    function kut() { clearInterval(kt); kt = setInterval(tek, 3000); }
    var css = false;
    function oyna(yopsa) {           /* yopsa — «Ёпиш» tugmasi (1-dars yorliqlari, xarita); aks holda — «Бош саҳифага қайтиш» */
      if (d || !document.body) return;
      if (!css) { css = true; var st = document.createElement('style');
      st.textContent = '#kr-d{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;background:rgba(8,20,14,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}' +
        '.kr-k{width:100%;max-width:400px;box-sizing:border-box;padding:26px 20px 14px;border-radius:24px;background:#fff;color:#1b1f1d;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.35);font-family:inherit}' +
        '.kr-ib{width:64px;height:64px;margin:0 auto;border-radius:50%;background:#e3f4fd;color:#2AABEE;display:flex;align-items:center;justify-content:center}.kr-ib svg{width:34px;height:34px}' +
        '.kr-k h2{margin:14px 0 8px;font-size:21px;line-height:1.3}.kr-k p{margin:0 0 18px;font-size:15px;line-height:1.5;color:#5a635f}' +
        '.kr-tg{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:54px;border:0;border-radius:16px;background:#2AABEE;color:#fff;font-size:17px;font-weight:700;font-family:inherit;cursor:pointer}.kr-tg svg{width:24px;height:24px}' +
        '.kr-x{margin:10px 0 0;min-height:1.4em;font-size:14px;line-height:1.4;color:#0f7a4f}.kr-uy{display:inline-block;margin-top:4px;padding:10px;color:#5a635f;font-size:15px}' +
        '@media (prefers-color-scheme:dark){html:not([data-theme="light"]) .kr-k{background:#1e2522;color:#e8ecea}html:not([data-theme="light"]) .kr-k p,html:not([data-theme="light"]) .kr-uy{color:#a9b3ae}html:not([data-theme="light"]) .kr-ib{background:#16384a}html:not([data-theme="light"]) .kr-x{color:#6fd3a3}}' +
        'html[data-theme="dark"] .kr-k{background:#1e2522;color:#e8ecea}html[data-theme="dark"] .kr-k p,html[data-theme="dark"] .kr-uy{color:#a9b3ae}html[data-theme="dark"] .kr-ib{background:#16384a}html[data-theme="dark"] .kr-x{color:#6fd3a3}';
      document.head.appendChild(st); }
      d = document.createElement('div');
      d.id = 'kr-d'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'kr-h');
      d.innerHTML = '<div class="kr-k"><div class="kr-ib">' + TG + '</div><h2 id="kr-h">Давом этиш учун киринг</h2>' +
        /* 14.11.2026 (foydalanuvchi): ortiqcha gap yo'q — sarlavha va tugma */
        '<button class="kr-tg" id="kr-b">' + TG + 'Telegram орқали кириш</button><p class="kr-x" id="kr-x" role="status"></p>' +
        (yopsa ? '<button class="kr-uy" id="kr-y" style="border:0;background:none;font:inherit;cursor:pointer">Ёпиш</button>' : '<a class="kr-uy" href="' + (HOME || 'yol.html') + '">Бош саҳифага қайтиш</a>') + '</div>';
      document.body.appendChild(d);
      document.documentElement.style.overflow = 'hidden';
      xbEl = d.querySelector('#kr-x');
      if (yopsa) d.querySelector('#kr-y').onclick = yop;
      d.querySelector('#kr-b').onclick = function () {
        var B = window.Baza;
        if (!B || !B.ulashBoshla) { xb('Бир оз кутиб, қайта босинг…'); return; }
        var tok = B.ulashBoshla();
        try { window.open('https://t.me/Arabtilihivar_bot/darslar?startapp=kir_' + tok, '_blank'); } catch (e) {}
        xb('Telegram очилди. У ерда тасдиқланг ва шу саҳифага қайтинг.');
        kut();
      };
      /* baza.js yo'q sahifada «jim» yuklanadi: o'zi sinxronlamaydi, faqat kirish uchun */
      var yuk = function () { if (window.Baza && Baza.ulashKutmoqda()) { xb('Telegram\'да тасдиқлашингиз кутилмоқда…'); kut(); } };
      if (window.Baza) yuk();
      else { window.BAZA_JIM = 1; var sc = document.createElement('script'); sc.src = 'baza.js'; sc.onload = yuk; sc.onerror = function () { xb('Интернетни текширинг.'); }; document.head.appendChild(sc); }
    }
    document.addEventListener('visibilitychange', tek);
    return { kerak: kerak, oyna: oyna };
  })();
  (function () {
    if (!Kirish.kerak()) return;
    var m = /^dars(\d+)-holat$/.exec(KEY), dars1 = !!m && +m[1] === 1, nom = (location.pathname.match(/([a-z]+)\.html$/) || [])[1] || '';
    var avto = (m && !dars1) || /^(takror|sarf|feellar|fel)$/.test(nom) || (nom === 'tinglash' && !/[?&]d=0*1(&|$)/.test(location.search));
    function boshla() {
      if (avto) { Kirish.oyna(false); return; }
      if (dars1 && typeof window.tab === 'function') {      /* 1-dars: Матн ochiq, «Луғат» (t2) va «Машқ» (t3) — kirgach */
        var t0 = window.tab;
        window.tab = function (n) { if ((n === 2 || n === 3) && Kirish.kerak()) { Kirish.oyna(true); return; } return t0.apply(this, arguments); };
        if (document.querySelector('#t2.on,#t3.on')) t0(1);
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boshla); else boshla();
  })();
  /* sahifalar orasida o'tish: Telegramda tarix yig'ilmasin */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || ev.defaultPrevented || a.target || a.hasAttribute('download') || a.origin !== location.origin ||
        /^(#|javascript:)/.test(a.getAttribute('href')) || a.pathname === location.pathname) return;
    goOn();
    var href = a.href;
    if (UY && uyMi(a.pathname) && !uyMi(location.pathname)) href = new URL(UY, location.href).href;   /* bosh sahifa havolasi → oxirgi bo'lim */
    if (inTg()) { ev.preventDefault(); location.replace(href); return; }
    /* ilova/brauzer: kelgan sahifaga («‹») qaytishda — tarixda orqaga (tarix aylanib qolmasin) */
    if (history.length > 1 && document.referrer && href.split('#')[0] === document.referrer.split('#')[0]) {
      ev.preventDefault(); history.back();
    } else if (href !== a.href) { ev.preventDefault(); location.replace(href); }
  });
  window.addEventListener('pageshow', goOff);

  /* yangi versiya yuklanib bo'lishi bilan sahifa bir marta o'zi yangilanadi */
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      /* 06.11.2026: o'xshamasa o'zi qayta urinadi — internet qaytganda, ilovaga qaytganda, audio to'xtaganda;
         audio o'ynayotganda yoki yozish maydonida turganda yangilanmaydi (eshitish bo'linmasin) */
      var upd = false, rlAt = 0;
      var busy = function () {
        var a = document.querySelectorAll('audio'), i;
        for (i = 0; i < a.length; i++) if (!a[i].paused && !a[i].ended) return true;
        var f = document.activeElement; return !!(f && /^(INPUT|TEXTAREA|SELECT)$/.test(f.tagName));
      };
      /* 10.11.2026: audio sabab o'zi yangilana olmasa — tepada «Янгилаш» tugmasi (bosilsa darhol, bosilmasa audio to'xtaganda o'zi) */
      var bar = null;
      var showBar = function () {
        if (bar || !document.body) return;
        bar = document.createElement('button'); bar.type = 'button'; bar.className = 'upd-bar';
        bar.textContent = '\u21bb Янги версия тайёр \u00b7 Янгилаш';
        bar.style.cssText = 'position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);' +
          'z-index:2147483000;border:0;border-radius:999px;padding:10px 18px;background:#167a4f;color:#fff;' +
          'font:600 15px/1.2 system-ui,-apple-system,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.25);white-space:nowrap;cursor:pointer';
        bar.addEventListener('click', function () { rlAt = Date.now(); goOn(); location.reload(); });
        document.body.appendChild(bar);
      };
      var rel = function () {
        if (!upd || document.hidden || !navigator.onLine) return;
        if (busy()) { showBar(); return; }
        if (Date.now() - rlAt < 10000) return;
        rlAt = Date.now(); goOn(); location.reload();
      };
      /* 10.11.2026: yangi versiyani ilovaga qaytganda va ochiq turganda (10 daqiqada bir) so'rash —
         brauzer o'zi faqat sahifa qayta ochilganda tekshiradi (orqa fondan qaytganda emas) */
      var chkAt = Date.now();
      var check = function () {
        if (upd || document.hidden || !navigator.onLine || Date.now() - chkAt < 60000) return;
        chkAt = Date.now();
        navigator.serviceWorker.getRegistration().then(function (r) { if (r) return r.update(); }).catch(function () {});
      };
      navigator.serviceWorker.addEventListener('controllerchange', function () { upd = true; rel(); });
      window.addEventListener('online', function () { rel(); check(); });
      window.addEventListener('focus', check);
      document.addEventListener('visibilitychange', function () { setTimeout(rel, 300); setTimeout(check, 500); });
      setInterval(check, 600000);
      try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.onEvent) Telegram.WebApp.onEvent('activated', check); } catch (e2) {}
      document.addEventListener('pause', function () { setTimeout(rel, 800); }, true);
      document.addEventListener('ended', function () { setTimeout(rel, 800); }, true);
      setInterval(rel, 15000);
    }
  } catch (e) {}

  /* mahalliy yozuvlarga vaqt belgisi */
  if (KEY) {
    try {
      var orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (BLOCK && this === window.localStorage && k === KEY) return;
        orig.call(this, k, v);
        if (this === window.localStorage && k === KEY) {
          orig.call(this, TK, String(Date.now()));
          if (W) { clearTimeout(tm); tm = setTimeout(up, 4000); }
        }
      };
    } catch (e) {}
  }

  function up() {
    if (!W || !KEY) return;
    var now = Date.now();
    if (now - last < 8000) { clearTimeout(tm); tm = setTimeout(up, 8000); return; }
    last = now;
    try {
      var p = JSON.stringify({ t: +(localStorage.getItem(TK) || now), v: localStorage.getItem(KEY) || '' });
      if (p.length < 4000) W.CloudStorage.setItem(KEY, p);
    } catch (e) {}
  }

  function pull() {
    W.CloudStorage.getItem(KEY, function (err, val) {
      if (err || !val) return;
      try {
        var c = JSON.parse(val), lt = LT0;
        if (c.v && c.t > lt + 1000) {
          localStorage.setItem(KEY, c.v);
          localStorage.setItem(TK, String(c.t));
          if (!sessionStorage.getItem(KEY + '-r')) { sessionStorage.setItem(KEY + '-r', '1'); BLOCK = true; location.reload(); }
        }
      } catch (e) {}
    });
  }


  /* iPhone'dagidek: ekranning chap chetidan o'ngga surib bosh sahifaga qaytish */
  if (HOME) (function () {
    var x0 = 0, y0 = 0, t0 = 0, on = false, lock = 0, dx = 0, b, sh;
    function set(v, anim) {
      b.style.transition = anim ? 'transform .22s ease-out' : 'none';
      b.style.transform = v ? 'translateX(' + v + 'px)' : '';
      sh.style.transition = b.style.transition;
      sh.style.opacity = v ? String(Math.max(0, .35 - v / innerWidth * .35)) : '0';
    }
    document.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      if (e.touches.length > 1 || t.clientX > 28) return;
      b = document.body;
      if (!sh) { sh = document.createElement('div'); sh.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:2147483646'; document.documentElement.appendChild(sh); }
      x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); on = true; lock = 0; dx = 0;
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (!on) return;
      var t = e.touches[0], mx = t.clientX - x0, my = t.clientY - y0;
      if (!lock) { if (Math.abs(mx) < 8 && Math.abs(my) < 8) return; lock = Math.abs(mx) > Math.abs(my) && mx > 0 ? 1 : 2; }
      if (lock !== 1) { on = false; return; }
      e.preventDefault(); dx = Math.max(0, mx); set(dx);
    }, { passive: false });
    function end() {
      if (!on) return; on = false;
      if (lock !== 1) return;
      var v = dx / Math.max(1, Date.now() - t0);
      if (dx > innerWidth * .33 || (v > .5 && dx > 40)) {
        set(innerWidth, true);
        document.documentElement.classList.add('go');
        setTimeout(function () { location.replace(HOME); }, 180);
      } else set(0, true);
    }
    document.addEventListener('touchend', end);
    document.addEventListener('touchcancel', end);
    addEventListener('pageshow', function () { if (b) set(0); });
  })();

  function start() {
    var w = window.Telegram && Telegram.WebApp;
    if (!w || !w.initData) return;          /* oddiy brauzer */
    W = w;
    try { w.ready(); w.expand(); } catch (e) {}
    if (w.BackButton) {
      try {
        if (HOME) { w.BackButton.show(); w.BackButton.onClick(function () { document.documentElement.classList.add('go'); location.replace(HOME); }); }
        else w.BackButton.hide();            /* bosh sahifa: Telegram o'zi yopadi */
      } catch (e) {}
    }
    if (KEY && w.CloudStorage && w.isVersionAtLeast && w.isVersionAtLeast('6.9')) {
      pull();
      document.addEventListener('visibilitychange', function () { if (document.hidden) { last = 0; up(); } });
    }
    document.documentElement.classList.add('in-tg');
    document.dispatchEvent(new Event('tgready'));
  }

  /* statistika: kim kirgan va hozir kim ishlayapti (Google Sheets'ga) */
  var STAT_URL = 'https://script.google.com/macros/s/AKfycbxksQz-jII6bVIWKgl63gfASBRDr4SGsScYJg0jogaulyzOoVluyGtf6pU1TIZV-ntRcA/exec';
  /* Telegram foydalanuvchisi: skript yuklanmasa ham manzildagi tgWebAppData'dan olinadi */
  function tgUser() {
    try {
      var h = location.hash.slice(1), q = '';
      var m = /(?:^|&)tgWebAppData=([^&]*)/.exec(h);
      if (m) q = decodeURIComponent(m[1]);
      else { var ip = JSON.parse(sessionStorage.getItem('__telegram__initParams') || '{}'); q = ip.tgWebAppData || ''; }
      var um = /(?:^|&)user=([^&]*)/.exec(q);
      return um ? JSON.parse(decodeURIComponent(um[1])) : null;
    } catch (e) { return null; }
  }
  /* brauzer ID: localStorage + cookie (biri o'chsa ham ikkinchisidan tiklanadi) */
  function webId() {
    var r = '';
    try { r = localStorage.getItem('stat-id') || ''; } catch (e) {}
    if (!r) { var c = /(?:^|; )statid=([a-z0-9]+)/.exec(document.cookie); if (c) r = c[1]; }
    if (!r) r = 'web' + Math.random().toString(36).slice(2, 10);
    try { localStorage.setItem('stat-id', r); } catch (e) {}
    try { document.cookie = 'statid=' + r + '; max-age=63072000; path=/; SameSite=Lax'; } catch (e) {}
    return r;
  }
  function stat(t) {
    if (!STAT_URL) return;
    /* avtomatik brauzer (Claude sinovi, bot) va kompyuterdagi nusxa statistikaga yozilmaydi (05.11.2026) */
    if (navigator.webdriver || /Headless|bot|crawl|spider|Lighthouse/i.test(navigator.userAgent) || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname)) return;
    try {
      var u = (W && W.initDataUnsafe && W.initDataUnsafe.user) || tgUser(), d;
      if (u) {
        d = { id: 'tg' + u.id, fn: u.first_name || '', ln: u.last_name || '', un: u.username || '' };
        try { localStorage.setItem('stat-tg', JSON.stringify(d)); } catch (e) {}
      } else {
        var o = null; try { o = JSON.parse(localStorage.getItem('stat-tg') || 'null'); } catch (e) {}
        if (o && o.id) d = o;                       /* shu qurilmada oldin Telegram orqali kirgan */
        else d = { id: webId(), fn: '', ln: '', un: '' };
      }
      d.t = t; d.p = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
      fetch(STAT_URL, { method: 'POST', mode: 'no-cors', keepalive: true, body: JSON.stringify(d) }).catch(function () {});
    } catch (e) {}
  }
  function statStart() {
    stat('open');
    setInterval(function () { if (!document.hidden) stat('ping'); }, 60000);
  }

  var sc = document.createElement('script');
  sc.src = 'https://telegram.org/js/telegram-web-app.js';
  sc.onload = function () { start(); statStart(); };
  sc.onerror = statStart;
  document.head.appendChild(sc);
})();

/* Audio yuklanishi — haqqoniy holat (12.11.2026; avvalgisi pleyer buferi foizini ko'rsatardi va qotib qolardi).
   Audio o'ynashni kutib qolsa: SW dan so'raladi (message 'aud') — fayl telefondami, yuklanyaptimi, necha foiz.
   • yuklanyapti      → «⬇️ Аудио юкланяпти… N%» (N — faylning haqiqiy yuklangan qismi)
   • telefonda tayyor → pleyer o'zi qayta ulanadi va o'sha joydan davom etadi (heal) — chiqib-kirish shart emas
   • yuklanmadi / internet yo'q → sababi yoziladi + «Юклаш» tugmasi (bosilsa qayta yuklaydi) */
(function () {
  var box = null, txt = null, btn = null, t = null, cur = null, poll = null, since = 0, heals = 0, lastHeal = 0, tried = false, shownAt = 0;
  function el() {
    if (box) return box;
    box = document.createElement('div');
    box.setAttribute('role', 'status');
    box.style.cssText = 'position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top));transform:translateX(-50%);z-index:100;' +
      'background:var(--cd,#fff);color:var(--tx,#1e2a26);border:1px solid var(--bd,#e0dccf);border-radius:999px;padding:6px 8px 6px 14px;' +
      'font:600 13.5px/1.3 system-ui,-apple-system,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.15);display:none;white-space:nowrap;' +
      'align-items:center;gap:10px;max-width:calc(100vw - 24px)';
    txt = document.createElement('span'); txt.style.cssText = 'overflow:hidden;text-overflow:ellipsis;padding-right:6px';
    btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Юклаш';
    btn.style.cssText = 'display:none;border:0;border-radius:999px;padding:6px 14px;font:700 13.5px/1.2 system-ui,-apple-system,sans-serif;' +
      'background:var(--ac,#0f7a4f);color:#fff;cursor:pointer';
    btn.addEventListener('click', function (e) { e.stopPropagation(); if (cur) { tried = false; heals = 0; since = Date.now(); set('⬇️ Аудио юкланяпти…', false); ask(cur, true, function (s) { if (!s) heal(cur, true); }); } });
    box.appendChild(txt); box.appendChild(btn);
    (document.body || document.documentElement).appendChild(box);
    return box;
  }
  function set(text, withBtn) { el(); txt.textContent = text; btn.style.display = withBtn ? 'block' : 'none'; box.style.display = 'flex'; if (!shownAt) shownAt = Date.now(); }
  function hide() { clearTimeout(t); t = null; clearInterval(poll); poll = null; cur = null; shownAt = 0; if (box) box.style.display = 'none'; }
  function src(a) { return String(a.currentSrc || a.src || '').split('#')[0].split('?')[0]; }
  /* SW dan holat: cb({cached, loading, got, total}) yoki cb(null) — SW yo'q / javob bermadi */
  function ask(a, start, cb) {
    var c = navigator.serviceWorker && navigator.serviceWorker.controller, done = false;
    function fin(v) { if (!done) { done = true; cb(v); } }
    if (!c || !/\.mp3$/i.test(src(a))) return fin(null);
    try {
      var ch = new MessageChannel();
      ch.port1.onmessage = function (e) { fin(e.data || null); };
      c.postMessage({ t: 'aud', url: src(a), start: !!start }, [ch.port2]);
      setTimeout(function () { fin(null); }, 1500);
    } catch (e) { fin(null); }
  }
  /* pleyerni qayta ulash: joy, tezlik saqlanadi; o'ynayotgan bo'lsa davom etadi */
  function heal(a, force) {
    var now = Date.now();
    if (!force && (heals >= 4 || now - lastHeal < 4000)) return;
    heals++; lastHeal = now;
    var at = a.currentTime || 0, rate = a.playbackRate || 1, want = !a.paused || force || now - playAt < 4000;
    function back() {
      a.removeEventListener('loadedmetadata', back);
      try { if ('progSeek' in window) window.progSeek = true; if (at > 0.05) a.currentTime = at; a.playbackRate = rate; } catch (e) {}
      if (want) { var p = a.play(); if (p && p.catch) p.catch(function () {}); }
    }
    a.addEventListener('loadedmetadata', back);
    /* manzilga «?h=…» qo'shiladi: shunchaki load() qilinsa Chrome o'z xotirasidagi eski bo'laklarni (va ularning manbasini)
       qayta ishlatadi — qotish takrorlanadi. Yangi manzil — yangi ulanish. SW va server «?…» ni hisobga olmaydi. */
    try { var u = src(a); if (/\.mp3$/i.test(u)) a.src = u + '?h=' + now.toString(36); else a.load(); } catch (e) {}
    cur = a; since = now; if (!poll) poll = setInterval(tick, 700);
  }
  function tick() {
    var a = cur; if (!a) return;
    var wait = Date.now() - since;
    if (!navigator.onLine) { ask(a, false, function (s) { if (cur !== a) return; if (s && s.cached) heal(a); else set('📵 Интернет йўқ', true); }); return; }
    ask(a, !tried, function (s) {
      if (cur !== a) return;
      tried = true;
      if (!s) { /* SW yo'q (birinchi kirish): foizsiz; uzoq qotsa — qayta ulanadi, bo'lmasa tugma */
        if (wait > 6000 && heals < 2) heal(a);
        set(wait > 15000 ? '⚠️ Аудио юкланмади' : '⏳ Аудио юкланяпти…', wait > 15000); return;
      }
      if (s.cached) { set('⏳ Аудио очиляпти…', false); if (wait > 1200) heal(a); return; }
      if (s.loading) {
        var p = s.total ? Math.min(99, Math.floor(s.got / s.total * 100)) : -1;
        set('⬇️ Аудио юкланяпти…' + (p >= 0 ? ' ' + p + '%' : ''), false); return;
      }
      set('⚠️ Аудио юкланмади', true);
    });
  }
  function wait(ev) {
    var a = ev.target; if (!a || !/^(AUDIO|VIDEO)$/.test(a.tagName)) return;
    if (a.paused && ev.type != 'waiting') return;
    if (ev.type == 'stalled' && a.readyState >= 3) return; /* yetarli yuklangan bo'lsa «stalled» da yozuv chiqmasin */
    if (cur === a) return;
    cur = a; clearTimeout(t); since = Date.now(); heals = 0; tried = false; t0 = a.currentTime;
    t = setTimeout(function () { if (cur === a) { tick(); clearInterval(poll); poll = setInterval(tick, 700); } }, 500);
  }
  var t0 = 0, playAt = 0, errAt = 0;
  document.addEventListener('play', function (ev) { if (ev.target && /^(AUDIO|VIDEO)$/.test(ev.target.tagName)) playAt = Date.now(); }, true);
  function done(ev) {
    if (cur && cur !== ev.target) return;
    var now = Date.now();
    if (ev.type === 'emptied' && now - lastHeal < 3000) return;   /* o'zimiz qayta ulayapmiz */
    if (ev.type === 'pause' && now - errAt < 1500) return;        /* xatodan keyin brauzer o'zi to'xtatdi — foydalanuvchi emas */
    hide();
  }
  /* pleyer xato bersa (ulanish uzildi, javob mos kelmadi): foydalanuvchi o'ynatmoqchi bo'lgan bo'lsa — o'zi qayta ulanadi */
  function fail(ev) {
    var a = ev.target; if (!a || !/^(AUDIO|VIDEO)$/.test(a.tagName)) return;
    var now = Date.now(), want = !a.paused || cur === a || now - playAt < 4000;
    if (!want) return;
    errAt = now;
    if (cur !== a) { cur = a; since = now; heals = 0; tried = false; t0 = a.currentTime; }
    if (heals < 3 && navigator.onLine) { set('⏳ Аудио очиляпти…', false); heals++; lastHeal = 0; heal(a, true); }
    else { clearInterval(poll); poll = setInterval(tick, 700); tick(); }
  }
  document.addEventListener('waiting', wait, true);
  document.addEventListener('stalled', wait, true);
  ['playing', 'canplaythrough', 'pause', 'ended', 'emptied'].forEach(function (n) { document.addEventListener(n, done, true); });
  document.addEventListener('error', fail, true);
  /* audio vaqti oldinga yursa — yozuv yopiladi */
  document.addEventListener('timeupdate', function (ev) {
    var a = ev.target; if (cur !== a) return;
    if (!a.paused && !a.seeking && a.currentTime > t0 + 0.3 && a.readyState >= 3) hide(); else if (a.seeking || a.currentTime < t0) t0 = a.currentTime;
  }, true);
  window.addEventListener('online', function () { if (cur) { tried = false; tick(); } });
})();
