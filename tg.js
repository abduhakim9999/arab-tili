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
    document.documentElement.classList.add('go');
    if (inTg()) { ev.preventDefault(); location.replace(a.href); }
  });
  window.addEventListener('pageshow', function () { document.documentElement.classList.remove('go'); });

  /* yangi versiya yuklanib bo'lishi bilan sahifa bir marta o'zi yangilanadi */
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      var rl = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (rl) return; rl = true;
        document.documentElement.classList.add('go');
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
  function stat(t) {
    if (!STAT_URL) return;
    try {
      var u = W && W.initDataUnsafe && W.initDataUnsafe.user, d;
      if (u) d = { id: 'tg' + u.id, fn: u.first_name || '', ln: u.last_name || '', un: u.username || '' };
      else {
        var r = ''; try { r = localStorage.getItem('stat-id') || ''; if (!r) { r = 'web' + Math.random().toString(36).slice(2, 10); localStorage.setItem('stat-id', r); } } catch (e) { r = 'web-anon'; }
        d = { id: r, fn: '', ln: '', un: '' };
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
