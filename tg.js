/* Telegram Mini App ulanishi + natijalarni Telegram bulutida saqlash */
(function () {
  var me = document.currentScript;
  var KEY = me.getAttribute('data-key') || '';
  var HOME = me.getAttribute('data-home') || '';
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
    try { return !!sessionStorage.getItem('__telegram__initParams'); } catch (e) { return false; }
  }
  /* sahifalar orasida o'tish: Telegramda tarix yig'ilmasin */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || ev.defaultPrevented || a.target || a.hasAttribute('download') || a.origin !== location.origin ||
        /^(#|javascript:)/.test(a.getAttribute('href')) || a.pathname === location.pathname) return;
    goOn();
    if (inTg()) { ev.preventDefault(); location.replace(a.href); }
  });
  window.addEventListener('pageshow', goOff);

  /* yangi versiya yuklanib bo'lishi bilan sahifa bir marta o'zi yangilanadi */
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      var rl = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (rl) return; rl = true;
        goOn();
        location.reload();
      });
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

/* Audio yuklanayotganini ko'rsatish (05.11.2026): «Юкланяпти… 40%», internet bo'lmasa — xabar */
(function () {
  var box = null, t = null, cur = null;
  function el() {
    if (box) return box;
    box = document.createElement('div');
    box.setAttribute('role', 'status');
    box.style.cssText = 'position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top));transform:translateX(-50%);z-index:100;' +
      'background:var(--cd,#fff);color:var(--tx,#1e2a26);border:1px solid var(--bd,#e0dccf);border-radius:999px;padding:6px 14px;' +
      'font:600 13.5px/1.3 system-ui,-apple-system,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.15);display:none;white-space:nowrap';
    (document.body || document.documentElement).appendChild(box);
    return box;
  }
  function pct(a) {
    try { if (a.duration > 0 && a.buffered.length) return Math.min(99, Math.round(a.buffered.end(a.buffered.length - 1) / a.duration * 100)); } catch (e) {}
    return -1;
  }
  function show(a, err) {
    var b = el(), p = pct(a);
    if (err || !navigator.onLine) b.textContent = !navigator.onLine ? '📵 Интернет йўқ — аудио ҳали юкланмаган' : '⚠️ Аудио юкланмади — интернетни текширинг';
    else b.textContent = '⏳ Аудио юкланяпти…' + (p > 0 ? ' ' + p + '%' : '');
    b.style.display = 'block';
  }
  function hide() { clearTimeout(t); t = null; cur = null; if (box) box.style.display = 'none'; }
  function wait(ev) {
    var a = ev.target; if (!a || !/^(AUDIO|VIDEO)$/.test(a.tagName)) return;
    if (a.paused && ev.type != 'waiting') return;
    cur = a; clearTimeout(t);
    t = setTimeout(function () { if (cur === a) show(a); }, 500);
  }
  function prog(ev) { if (cur === ev.target && box && box.style.display == 'block') show(ev.target); }
  function done(ev) { if (!cur || cur === ev.target) hide(); }
  function fail(ev) { var a = ev.target; if (!a || !/^(AUDIO|VIDEO)$/.test(a.tagName)) return; if (!a.paused || cur === a) { cur = a; show(a, true); clearTimeout(t); t = setTimeout(hide, 5000); } }
  document.addEventListener('waiting', wait, true);
  document.addEventListener('stalled', wait, true);
  document.addEventListener('progress', prog, true);
  ['playing', 'canplaythrough', 'pause', 'ended', 'emptied'].forEach(function (n) { document.addEventListener(n, done, true); });
  document.addEventListener('error', fail, true);
})();
