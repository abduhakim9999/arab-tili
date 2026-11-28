/* Таркиб режими: сўз остида қисқа вазифа (ҳукм рангида), шибҳи жумла ва жумла қавслари, гап тури.
   Маълумот: window.TKG = {қатор: [[бошланиш, тугаш, ёзув, 's'|'j'], ...]}, window.TKT = {қатор: [[охирги сўз, «Жумлатун …»], ...]} */
(function () {
  var tx = document.getElementById('tx');
  if (!tx) return;
  var G = window.TKG || {}, T = window.TKT || {};

  var st = document.createElement('style');
  st.textContent =
    '#tx.tartib .ws span[data-n]::before,#tx.tartib .ts[data-n]::before{content:none!important;display:none!important}' +
    '#tx.tartib .ws span[data-s]::after{white-space:normal;width:min-content;min-width:100%;margin:-3px auto 5px;text-align:center}' +
    '#tx.tartib .ws span[data-j="R"]::after{color:var(--cR)}#tx.tartib .ws span[data-j="N"]::after{color:var(--cN)}' +
    '#tx.tartib .ws span[data-j="J"]::after{color:var(--cJ)}#tx.tartib .ws span[data-j="Z"]::after{color:var(--cZ)}' +
    '#tx .ws{position:relative}' +
    '#tx .tkj{display:none}#tx.tartib .tkj{display:block;align-self:flex-start;direction:ltr;font:700 10.5px system-ui,-apple-system,sans-serif;font-style:normal;color:var(--ac);background:rgba(15,118,110,.08);border-radius:8px;padding:2px 6px;margin:calc(var(--fs,22px)*.55) 2px 0;white-space:nowrap}' +
    '.tkb{position:absolute;pointer-events:none}' +
    '.tkb .tkl{height:6px;border:1.5px solid currentColor;border-top:none;border-radius:0 0 6px 6px;opacity:.75}' +
    '.tkb.cont-r .tkl{border-right-style:dashed;border-bottom-right-radius:0}.tkb.cont-l .tkl{border-left-style:dashed;border-bottom-left-radius:0}' +
    '.tkb .tkt{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:max-content;font:600 10.5px/1.25 system-ui,-apple-system,sans-serif;text-align:center;direction:ltr;unicode-bidi:isolate}' +
    '.tkb.s{color:var(--cj)}.tkb.j{color:var(--ac)}' +
    '.lgd .lgk{flex-basis:100%;font-size:12px;color:var(--mu)}';
  document.head.appendChild(st);

  var bl = document.getElementById('bl');
  if (bl) bl.textContent = 'Таркиб';
  var lg = document.getElementById('lg');
  if (lg && !lg.querySelector('.lgk')) {
    var k = document.createElement('span');
    k.className = 'lgk';
    k.innerHTML = 'Остидаги ёзув: <b style="color:var(--cR)">раф</b> · <b style="color:var(--cN)">насб</b> · <b style="color:var(--cJ)">жар</b> · <b style="color:var(--cZ)">жазм</b> · мабний — кулранг';
    lg.appendChild(k);
  }

  function deco() {
    if (window.IRB) [].forEach.call(tx.querySelectorAll('.ws span[data-i]'), function (e) {
      var E = IRB[e.getAttribute('data-i')];
      if (E && E.j) e.setAttribute('data-j', E.j); else e.removeAttribute('data-j');
    });
    [].forEach.call(tx.querySelectorAll('.tkj'), function (e) { e.remove() });
    Object.keys(T).forEach(function (i) {
      T[i].forEach(function (t) {
        var e = tx.querySelector('[data-i="' + i + '-' + t[0] + '"]');
        if (!e) return;
        var c = document.createElement('i');
        c.className = 'tkj';
        c.textContent = t[1];
        e.parentNode.insertBefore(c, e.nextSibling);
      });
    });
    lay();
  }

  function clear() {
    [].forEach.call(tx.querySelectorAll('.tkb'), function (e) { e.remove() });
    [].forEach.call(tx.querySelectorAll('[data-tkp]'), function (e) { e.style.paddingBottom = ''; e.removeAttribute('data-tkp') });
  }

  function lay() {
    clear();
    if (!tx.classList.contains('tartib') || !tx.offsetParent) return;
    var lns = tx.querySelectorAll('.ln'), rows = {}, rid = 0, all = [];
    Object.keys(G).forEach(function (i) {
      var ln = lns[+i];
      if (!ln) return;
      G[i].forEach(function (g) {
        var parts = [], m = {};
        for (var j = g[0]; j <= g[1]; j++) {
          var e = ln.querySelector('[data-i="' + i + '-' + j + '"]');
          if (!e) continue;
          var ws = e.parentNode;
          if (!ws.__tk) ws.__tk = ++rid;
          var key = ws.__tk + '|' + e.offsetTop;
          if (!m[key]) { m[key] = { ws: ws, key: key, sp: [] }; parts.push(m[key]) }
          m[key].sp.push(e);
        }
        parts.forEach(function (p, pi) {
          var l = 1e9, r = -1e9;
          p.sp.forEach(function (e) { l = Math.min(l, e.offsetLeft); r = Math.max(r, e.offsetLeft + e.offsetWidth) });
          var b = document.createElement('div');
          b.className = 'tkb ' + g[3] + (pi < parts.length - 1 ? ' cont-l' : '') + (pi > 0 ? ' cont-r' : '');
          b.style.left = (l + 1) + 'px';
          b.style.width = Math.max(8, r - l - 2) + 'px';
          b.style.top = '0px';
          b.innerHTML = '<div class="tkl"></div>' + (pi == 0 ? '<div class="tkt"></div>' : '');
          p.ws.appendChild(b);
          var t = b.querySelector('.tkt'), h = 8, x0 = l, x1 = r;
          if (t) {
            t.textContent = g[2];
            t.style.maxWidth = Math.max(r - l, Math.min(220, p.ws.clientWidth)) + 'px';
            var tw = t.offsetWidth, cx = (l + r) / 2, lo = cx - tw / 2, hi = cx + tw / 2, W = p.ws.clientWidth, sh = 0;
            if (lo < 0) sh = -lo; else if (hi > W) sh = W - hi;
            if (sh) t.style.transform = 'translateX(calc(-50% + ' + sh + 'px))';
            x0 = Math.min(l, lo + sh); x1 = Math.max(r, hi + sh);
            h = 8 + t.offsetHeight + 4;
          }
          var R = rows[p.key] || (rows[p.key] = { ws: p.ws, top: p.sp[0].offsetTop, pcs: [] });
          var it = { el: b, x0: x0, x1: x1, h: h, w: r - l };
          R.pcs.push(it); all.push(it);
        });
      });
    });
    // qator a'zolari padding qo'yilishidan oldin yig'iladi (keyingi qatorlar pastga suriladi)
    Object.keys(rows).forEach(function (k) {
      var R = rows[k];
      R.mem = [].filter.call(R.ws.children, function (e) { return !e.classList.contains('tkb') && e.offsetTop == R.top });
    });
    // har bir qatorda: ichki (tor) qavs so'zga yaqin, kesishganlari pastroq
    Object.keys(rows).forEach(function (k) {
      var R = rows[k], lv = [];
      R.pcs.sort(function (a, b) { return a.w - b.w });
      R.pcs.forEach(function (p) {
        var L = 0;
        while (lv[L] && lv[L].some(function (q) { return p.x0 < q.x1 + 4 && q.x0 < p.x1 + 4 })) L++;
        (lv[L] = lv[L] || []).push(p); p.L = L;
      });
      R.hs = lv.map(function (a) { return Math.max.apply(null, a.map(function (p) { return p.h })) });
      R.pad = R.hs.reduce(function (s, v) { return s + v }, 0) + 2;
      R.mem.forEach(function (e) {
        R.it = R.it || e;
        e.setAttribute('data-tkp', R.pad);
        e.style.paddingBottom = R.pad + 'px';
      });
    });
    Object.keys(rows).forEach(function (k) {
      var R = rows[k], e = R.it;
      if (!e) return;
      var base = e.offsetTop + e.offsetHeight - R.pad;
      R.pcs.forEach(function (p) {
        var y = base;
        for (var q = 0; q < p.L; q++) y += R.hs[q];
        p.el.style.top = y + 'px';
      });
    });
  }

  var tm = 0;
  function later() { cancelAnimationFrame(tm); tm = requestAnimationFrame(lay) }

  function wrap(n, f) {
    var o = window[n];
    if (typeof o != 'function') return;
    window[n] = function () { var r = o.apply(this, arguments); f(); return r };
  }
  wrap('build', deco);
  wrap('bol', lay);
  wrap('tab', later);
  wrap('fz', later);
  deco();

  var lw = 0;
  if (window.ResizeObserver) new ResizeObserver(function () { if (tx.clientWidth != lw) { lw = tx.clientWidth; later() } }).observe(tx);
  else window.addEventListener('resize', later);
  if (window.MutationObserver) new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', later);
})();
