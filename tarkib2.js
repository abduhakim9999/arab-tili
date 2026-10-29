/* Таркиб режими: сўз остида қисқа вазифа (ҳукм рангида), шибҳи жумла ва жумла қавслари, гап тури.
   Маълумот: window.TKG = {қатор: [[бошланиш, тугаш, ёзув, 's'|'j'], ...]}, window.TKT = {қатор: [[охирги сўз, «Жумлатун …»], ...]} */
(function () {
  var tx = document.getElementById('tx');
  if (!tx) return;
  var G = window.TKG || {}, T = window.TKT || {};

  var st = document.createElement('style');
  st.textContent =
    '#tx.tartib .ws span[data-n]::before,#tx.tartib .ts[data-n]::before{content:none!important;display:none!important}' +
    '#tx.tartib .ws span[data-s]::after{content:none!important;display:none!important}' +
    '#tx.tartib .ws span[data-j="R"]::after{color:var(--cR)}#tx.tartib .ws span[data-j="N"]::after{color:var(--cN)}' +
    '#tx.tartib .ws span[data-j="J"]::after{color:var(--cJ)}#tx.tartib .ws span[data-j="Z"]::after{color:var(--cZ)}' +
    '#tx .ws{position:relative}' +
    '#tx .tkj{display:none}#tx.tartib .tkj{display:block;align-self:flex-start;direction:ltr;font:600 11px/1.3 system-ui,-apple-system,sans-serif;color:var(--tx);border-radius:8px;padding:0;margin:calc(var(--fs,22px)*.55) 2px 0;white-space:nowrap}' +
    '.tkb{position:absolute;pointer-events:none}' +
    '.tkb .tkl{height:6px;border:1.5px solid currentColor;border-top:none;border-radius:0 0 6px 6px;opacity:.75}' +
    '.tkb.cont-r .tkl{border-right-style:dashed;border-bottom-right-radius:0}.tkb.cont-l .tkl{border-left-style:dashed;border-bottom-left-radius:0}' +
    '.tkb .tkt{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:max-content;font:600 10.5px/1.25 system-ui,-apple-system,sans-serif;text-align:center;direction:ltr;unicode-bidi:isolate}' +
    '#tx .tkj{align-self:flex-start!important;margin:calc(var(--fs,22px)*.62) 4px 0!important;display:none;gap:6px;align-items:center}#tx.tartib .tkj{display:inline-flex!important}#tx.tartib .tkj{font:700 11.5px/1 system-ui,-apple-system,sans-serif!important;color:var(--ac)!important;background:rgba(15,118,110,.09);border:1px solid rgba(15,118,110,.25);border-radius:999px;padding:5px 10px!important;letter-spacing:.02em}#tx .tkj span{font:italic 600 11px/1.3 system-ui,-apple-system,sans-serif!important;cursor:default!important;color:var(--mu);border:1px dashed var(--bd);border-radius:999px;padding:0 7px}' +
    '.tkx{margin:8px 0 2px;padding:8px 10px;border-radius:12px;background:rgba(15,118,110,.05);border:1px solid rgba(15,118,110,.14);display:flex;flex-direction:column;gap:6px}' +
    '.tkr{display:flex;flex-direction:column;gap:1px;padding:5px 8px;border-radius:9px;border-right:3px solid var(--ac);background:var(--cd);cursor:pointer}' +
    '.tkr.s{border-right-color:var(--cj)}.tkr.on{box-shadow:0 0 0 1.5px var(--ac)}' +
    '.tkr .tka{direction:rtl;text-align:right;font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:calc(var(--fs,22px)*.78);line-height:1.5;color:var(--tx)}' +
    '.tkr .tkd{font:500 12.5px/1.35 system-ui,-apple-system,sans-serif;color:var(--mu)}.tkr .tkd b{font-weight:700;color:var(--ac)}.tkr.s .tkd b{color:var(--cj)}' +
    '.tkl2{display:flex;direction:rtl;align-items:center;gap:8px;flex-wrap:wrap}.tkl2 .tka{font-size:calc(var(--fs,22px)*.78)}' +
    '.tkar{font:700 16px system-ui;color:var(--cj)}' +
    '.tkt0{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:calc(var(--fs,22px)*.78);line-height:1.5;padding:0 8px;border-radius:8px;background:rgba(127,127,127,.08)}' +
    '.tkt0.pf{color:var(--cf)}.tkt0.pm{color:var(--cm)}.tkt0.px{color:var(--cx)}.tkt0.po{color:var(--co)}.tkt0.pb{color:var(--cb)}.tkt0.pj{color:var(--cj)}.tkt0.ph{color:var(--ch)}' +
    '.tkt0.hid{color:var(--mu);border:1px dashed var(--bd);background:none}.tkt0.hid i{font:italic 500 11.5px system-ui,sans-serif}' +
    '.tkq{font:500 12px/1.3 system-ui,-apple-system,sans-serif;color:var(--mu);font-style:italic}.tkd .ar{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:15px}' +
    '#tx.tartib .ws span.tkh2{background:rgba(42,118,118,.0);box-shadow:inset 0 -3px 0 var(--cj)}' +
    '.tkg{display:flex;flex-direction:column;gap:6px}.tkg+.tkg{margin-top:4px;padding-top:8px;border-top:1px dashed rgba(15,118,110,.25)}' +
    '.tkr.g{flex-direction:row;direction:rtl;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;border-right-color:var(--tx);background:none;padding:2px 2px 2px 0;border-right:none}' +
    '.tkr.g .tka{font-size:calc(var(--fs,22px)*.86)}.tkr.g .tks{direction:ltr;font-size:11.5px!important;padding:5px 10px!important}' +
    '.tki{display:flex;flex-direction:column;gap:6px;margin-right:12px;padding-right:10px;border-right:2px solid rgba(15,118,110,.18)}' +
    '.tks{align-self:flex-start;font:700 12px/1 system-ui,-apple-system,sans-serif;color:#fff;background:var(--ac);border-radius:999px;padding:6px 11px}' +
    '#tx.tartib .ws span.tkh{background:rgba(15,118,110,.14);border-radius:6px}' +
    '.tkb.s{color:var(--cj)}.tkb.j{color:var(--ac)}.tkb.g{color:var(--tx)}.tkb.g .tkt{font-weight:800}' +
    '.lgd .lgk{flex-basis:100%;font-size:12px;color:var(--mu)}';
  document.head.appendChild(st);

  var bl = document.getElementById('bl');
  if (bl) bl.textContent = 'Таркиб';
  var AR = '[\u0600-\u06FF]+';
  function short(s) {
    var m = s.match(new RegExp('^шибҳи жумла — (?:маҳзуф )?(.*?)(?: га мутааллиқ| га)?$'));
    if (/^шибҳи жумла/.test(s)) {
      var r = s.replace(/^шибҳи жумла — ?/, '').replace(/ ?га мутааллиқ$/, '');
      var a = r.match(new RegExp('^(' + AR + ')$'));
      if (a) return 'шибҳи жумла → ' + a[1];
      if (/хабар муқаддам/.test(r)) return 'шибҳи жумла → маҳзуф хабар муқаддам';
      if (/хабар/.test(r) && /маҳзуф/.test(r) && !/нинг/.test(r)) return 'шибҳи жумла → маҳзуф хабар';
      return r ? 'шибҳи жумла → ' + r : 'шибҳи жумла';
    }
    if (/^жумлатун/.test(s)) return s.charAt(0).toUpperCase() + s.slice(1);
    if (/^жумла/.test(s)) {
      var p = (s.match(/(раф|насб|жар) ўринда/) || [])[1], ro = '';
      if (/сила/.test(s)) return 'сила жумласи';
      var ro = /маътуф/.test(s) ? 'маътуф жумла' : /мафъули|мақули қавл/.test(s) ? 'жумла мафъулун биҳ' : /хабари|хабар/.test(s) ? 'жумла хабар'
        : /сифати/.test(s) ? 'жумла сифат' : /ҳол/.test(s) ? 'жумлаи ҳолийя' : '';
      if (!ro) return /ўрин йўқ/.test(s) ? 'жумла, эъробдан унга ўрин йўқ' : 'жумла';
      return ro + (p ? ', ' + p + ' ўринда' : '');
    }
    return s;
  }
  function bare(s) { return String(s).replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/[^ء-ي]/g, '') }
  var QW = [['في', 'қаерда? нимада?'], ['الى', 'қаерга? нимага?'], ['الي', 'қаерга? нимага?'], ['من', 'қаердан? нимадан?'], ['عن', 'ким ҳақида? нимадан?'], ['على', 'кимга? нимага?'],
    ['مع', 'ким билан?'], ['ل', 'ким учун? нима учун?'], ['ب', 'нима билан? нимада?'], ['ك', 'нимадек?']];
  function qword(w, isz) {
    if (isz) return 'қачон? қаерда?';
    var b0 = bare(w), bs = [b0, b0.replace(/^[وف]/, '')];
    for (var n = 0; n < 2; n++) for (var k = 0; k < QW.length; k++) if (bs[n].indexOf(QW[k][0]) == 0 && (QW[k][0].length > 1 || bs[n].length > 1)) return QW[k][1];
    return '';
  }
  function sj(i, ln, g, ws) {
    var src = g[2].replace(/^шибҳи жумла — ?/, '').replace(/ ?га мутааллиқ$/, ''), tgt = '', cls = '', hid = '', ti = -1;
    var a = src.match(/^(?:маҳзуф )?([؀-ۿ]+)$/);
    if (a && !/^маҳзуф/.test(src)) {
      var tb = bare(a[1]);
      [].some.call(ln.querySelectorAll('.ws span[data-i]'), function (e) { var q = e.getAttribute('data-i').split('-'); if (bare(e.textContent).slice(-tb.length) == tb || bare(e.textContent) == tb) { ti = +q[1]; tgt = e.textContent; cls = (e.className.match(/\bp[a-z]\b/) || [''])[0]; return true } });
      if (!tgt) tgt = a[1];
    } else {
      var k = src.match(/([؀-ۿ]+)/);
      hid = src.replace(/\s*\([^)]*\)/, '').replace(/[؀-ۿ]+/g, '').replace(/\s+/g, ' ').trim();
      tgt = k ? k[1] : '';
    }
    var first = ln.querySelector('[data-i="' + i + '-' + g[0] + '"]'), z = IRB[i + '-' + g[0]] && /зарф/.test(IRB[i + '-' + g[0]].s || '');
    var q = qword(first ? first.textContent : ws[0], z);
    var tg = hid ? '<span class="tkt0 hid">' + (tgt || '…') + '</span>' : '<span class="tkt0 ' + cls + '">' + tgt + '</span>';
    return '<div class="tkr s" data-a="' + g[0] + '" data-b="' + g[1] + '"' + (ti >= 0 ? ' data-t="' + ti + '"' : '') + '>' +
      '<div class="tkl2">' + tg + '<span class="tkar">→</span><span class="tka">' + ws.join(' ') + '</span></div>' +
      '<span class="tkd"><b>шибҳи жумла</b> · ' + (hid ? hid + (tgt ? ' (<bdi class="ar">' + tgt + '</bdi>)' : '') + ' га мутааллиқ, у яширин' : '<bdi class="ar">' + tgt + '</bdi> га мутааллиқ') + '</span>' +
      (q && !hid ? '<span class="tkq">Савол: ' + q + '</span>' : '') + '</div>';
  }
  function deco() {
    if (window.IRB) [].forEach.call(tx.querySelectorAll('.ws span[data-i]'), function (e) {
      var E = IRB[e.getAttribute('data-i')];
      if (E && E.j) e.setAttribute('data-j', E.j); else e.removeAttribute('data-j');
    });
    [].forEach.call(tx.querySelectorAll('.tkj'), function (e) { e.remove() });
    Object.keys(T).forEach(function (i) {
      var a0 = 0;
      T[i].forEach(function (t) {
        var m = t[1].match(/^Жумлатун (?:(исмийя|феълийя), )?(\S+?)\.$/);
        if (m && !t.done) {
          t[1] = m[2]; t.st = m[1] || ''; t.done = 1;
        }
        t.a = a0; a0 = t[0] + 1;
        var e = tx.querySelector('[data-i="' + i + '-' + t[0] + '"]');
        if (!e) return;
        var c = document.createElement('i');
        c.className = 'tkj';
        if (!t.st) return;
        c.textContent = 'Жумлатун ' + t.st;
        if (0) e.parentNode.insertBefore(c, e.nextSibling);
      });
    });
    lay();
  }

  function clear() {
    [].forEach.call(tx.querySelectorAll('.tkb'), function (e) { e.remove() });
    [].forEach.call(tx.querySelectorAll('[data-tkp]'), function (e) { e.style.paddingBottom = ''; e.removeAttribute('data-tkp') });
  }

  function lay() {
    [].forEach.call(tx.querySelectorAll('.tkx'), function (e) { e.remove() });
    if (!tx.classList.contains('tartib')) return;
    var lns = tx.querySelectorAll('.ln');
    Object.keys(G).concat(Object.keys(T)).filter(function (v, k, a) { return a.indexOf(v) == k }).forEach(function (i) {
      var ln = lns[+i]; if (!ln) return;
      var items = (G[i] || []).slice().sort(function (a, b) { return a[0] - b[0] || (b[1] - b[0]) - (a[1] - a[0]) });
      var h = '';
      function card(g) {
        var ws = [];
        for (var j = g[0]; j <= g[1]; j++) { var e = ln.querySelector('[data-i="' + i + '-' + j + '"]'); if (e) ws.push(e.textContent) }
        var lab = short(g[2]), m = lab.match(/^(шибҳи жумла|жумла[^,]*|маътуф жумла|сила жумласи|жумлаи ҳолийя)(.*)$/);
        var head = m ? m[1].replace(' → ', '') : lab, rest = m ? m[2] : '';
        if (g[3] == 's') return sj(i, ln, g, ws);
        return '<div class="tkr ' + g[3] + '" data-a="' + g[0] + '" data-b="' + g[1] + '"><span class="tka">' + ws.join(' ') + '</span>' +
          '<span class="tkd"><b>' + head + '</b>' + rest.replace(/^,\s*/, ' · ').replace(/^\s*→\s*/, ' → ') + '</span></div>';
      }
      var used = {}, segs = (T[i] || []).filter(function (t) { return t.st });
      segs.forEach(function (t) {
        var ws = [];
        for (var j = t.a; j <= t[0]; j++) { var e = ln.querySelector('[data-i="' + i + '-' + j + '"]'); if (e) ws.push(e.textContent) }
        var inner = '';
        items.forEach(function (g, k) { if (g[0] >= t.a && g[0] <= t[0]) { used[k] = 1; inner += card(g) } });
        h += '<div class="tkg"><div class="tkr g" data-a="' + t.a + '" data-b="' + t[0] + '"><span class="tka">' + ws.join(' ') + '</span>' +
          '<span class="tks">Жумлатун ' + t.st + '</span></div>' + (inner ? '<div class="tki">' + inner + '</div>' : '') + '</div>';
      });
      items.forEach(function (g, k) { if (!used[k]) h += card(g) });
      if (!h) return;
      var box = document.createElement('div'); box.className = 'tkx'; box.innerHTML = h;
      var trs = ln.querySelectorAll('.tr'), tr = trs[trs.length - 1]; (tr ? tr.parentNode : ln).insertBefore(box, tr);
      [].forEach.call(box.querySelectorAll('.tkr'), function (r) {
        r.addEventListener('click', function (ev) {
          ev.stopPropagation();
          var on = !r.classList.contains('on');
          [].forEach.call(tx.querySelectorAll('.tkr.on'), function (x) { x.classList.remove('on') });
          [].forEach.call(tx.querySelectorAll('.ws span.tkh'), function (x) { x.classList.remove('tkh', 'tkh2') });
          if (!on) return; r.classList.add('on');
          for (var j = +r.dataset.a; j <= +r.dataset.b; j++) { var e = ln.querySelector('[data-i="' + i + '-' + j + '"]'); if (e) e.classList.add('tkh') }
          if (r.dataset.t) { var e2 = ln.querySelector('[data-i="' + i + '-' + r.dataset.t + '"]'); if (e2) e2.classList.add('tkh', 'tkh2') }
        });
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
