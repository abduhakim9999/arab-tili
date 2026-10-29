/* Таркиб режими: сўз остида қисқа вазифа (ҳукм рангида), шибҳи жумла ва жумла қавслари, гап тури.
   Маълумот: window.TKG = {қатор: [[бошланиш, тугаш, ёзув, 's'|'j'], ...]}, window.TKT = {қатор: [[охирги сўз, «Жумлатун …»], ...]} */
(function () {
  var tx = document.getElementById('tx');
  if (!tx) return;
  var G = window.TKG || {}, T = window.TKT || {}, U = window.TKU || {};

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
    '.tkr.g{flex-direction:column;direction:rtl;align-items:flex-start;justify-content:flex-start;gap:2px;flex-wrap:nowrap;border-right-color:var(--tx);background:none;padding:2px 2px 2px 0;border-right:none}' +
    '.tkr.g .tka{font-size:calc(var(--fs,22px)*.86);align-self:stretch}.tkr.g .tks{direction:ltr;font-size:11.5px!important;padding:4px 10px!important}' +
    '.tki{display:flex;flex-direction:column;gap:6px;margin-right:12px;padding-right:10px;border-right:2px solid rgba(15,118,110,.18)}' +
    '.tks{align-self:flex-start;font:600 12px/1 system-ui,-apple-system,sans-serif;color:var(--ac);background:rgba(15,122,79,.12);background:color-mix(in srgb,var(--ac) 13%,transparent);border-radius:999px;padding:5px 10px}' +
    '#tx.tartib .ws span.tkh{background:rgba(15,118,110,.14);border-radius:6px}' +
    '.tkb.s{color:var(--cj)}.tkb.j{color:var(--ac)}.tkb.g{color:var(--tx)}.tkb.g .tkt{font-weight:800}' +
    '.tkz{display:inline-block;color:var(--cx);border:1.5px dashed currentColor;border-radius:9px;padding:0 7px;margin:0 3px;line-height:1.35;background:rgba(210,59,42,.07)}' +
    '#tx.tartib .ws span.kx{text-decoration:underline dotted var(--cx);text-decoration-thickness:2.5px;text-underline-offset:.45em;text-decoration-skip-ink:none}' +
    '.lgd .lga{color:var(--cj)}.lgd .lga b{font-weight:700}' +
    '.lgd .lgx{color:var(--cj)}.lgd .lgx u{text-decoration:underline dotted var(--cx);text-decoration-thickness:2.5px;text-underline-offset:4px}' +
    '.tkx .tka span{font-size:inherit!important;text-align:inherit!important}' +
    '.tkx .tka .pm{color:var(--cm)}.tkx .tka .po{color:var(--co)}.tkx .tka .px{color:var(--cx)}.tkx .tka .pf{color:var(--cf)}.tkx .tka .pb{color:var(--cb)}.tkx .tka .pj{color:var(--cj)}.tkx .tka .ph{color:var(--ch)}' +
    '.lgd .lgk{flex-basis:100%;font-size:12px;color:var(--mu)}' +
    '.tkc{display:inline-flex;flex-direction:column;align-items:center;gap:1px}.tkc>small{direction:ltr;font:500 12px/1.2 system-ui,-apple-system,sans-serif;color:var(--mu)}' +
    '.tku{direction:ltr;font:600 13px/1.3 system-ui,-apple-system,sans-serif;color:var(--tx)}.tku i{font-style:normal;font-weight:500;color:var(--mu)}.tku b{color:var(--cj)}';
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
  /* маҳзуф сўз гап ичида: шибҳи жумладан олдин (вَ/فَ дан кейин) */
  /* тақдир сўзи: «бўлмиш (маҳзуф) X» ёки «(X)», бўлмаса биринчи арабча сўз */
  function tq(src) { return src.match(/бўлмиш (?:маҳзуф )?([؀-ۿ]+)/) || src.match(/\(([؀-ۿ]+)\)/) || src.match(/([؀-ۿ]+)/) }
  function ghost(g) {
    var src = g[2].replace(/^шибҳи жумла — ?/, '').replace(/ ?га мутааллиқ$/, '');
    if (!/маҳзуф/.test(src)) return '';
    var k = tq(src); return k ? k[1] : '';
  }
  var ZW = ['في', 'على', 'علي', 'الى', 'الي', 'لدي', 'من', 'عن', 'مع', 'عند', 'لدى', 'فوق', 'تحت', 'امام', 'خلف', 'بين', 'قبل', 'بعد', 'حول', 'ل', 'ب', 'ك'];
  /* so'z matnni tepadagi rangda (p? klassi bilan) */
  function cl(e) { return (e.className.match(/\bp[a-z]\b/) || [''])[0] }
  function cw(e, t) { var c = cl(e); return c ? '<span class="' + c + '">' + t + '</span>' : t }
  function gz(w, z, e) {
    var g = '<span class="tkz">' + z + '</span>', m = w.match(/^([وف][ً-ْ]*)(.+)$/);
    if (m) { var b = bare(m[2]); if (ZW.some(function (p) { return b.indexOf(p) == 0 && b.length > p.length })) return cw(e, m[1]) + g + ' ' + cw(e, m[2]) }
    return g + ' ' + cw(e, w);
  }
  /* шибҳи жумла изоҳи: рамкада кўриниб турган сўз такрорланмайди */
  function sjd(src) {
    var d = src.replace(/\s*бўлмиш маҳзуф\s+[؀-ۿ]+/, ' бўлмиш маҳзуф').replace(/\s*бўлмиш\s+[؀-ۿ]+/, '').replace(/\s*\([؀-ۿ\s]+\)/g, '').replace(/\s*(га)?\s*мутааллиқ\.?$/, '').trim();
    if (/^маҳзуф [؀-ۿ]+$/.test(d)) return 'маҳзуф феъл';
    return d.replace(/([؀-ۿ]+)/g, '<bdi class="ar">$1</bdi>');
  }
  function sj(i, ln, g, ws) {
    var src = g[2].replace(/^шибҳи жумла — ?/, '').replace(/ ?га мутааллиқ$/, ''), tgt = '', cls = '', hid = '', ti = -1;
    var a = src.match(/^(?:маҳзуф )?([؀-ۿ]+)$/);
    if (a && !/^маҳзуф/.test(src)) {
      var tb = bare(a[1]);
      [].some.call(ln.querySelectorAll('.ws span[data-i]'), function (e) { var q = e.getAttribute('data-i').split('-'); if (bare(e.textContent).slice(-tb.length) == tb || bare(e.textContent) == tb) { ti = +q[1]; tgt = e.textContent; cls = (e.className.match(/\bp[a-z]\b/) || [''])[0]; return true } });
      if (!tgt) tgt = a[1];
    } else {
      var k = tq(src);
      hid = src.replace(/\s*\([^)]*\)/, '').replace(/[؀-ۿ]+/g, '').replace(/\s+/g, ' ').trim();
      tgt = k ? k[1] : '';
    }
    var first = ln.querySelector('[data-i="' + i + '-' + g[0] + '"]'), z = IRB[i + '-' + g[0]] && /зарф/.test(IRB[i + '-' + g[0]].s || '');
    var q = qword(first ? first.textContent : ws[0], z);
    if (src && !tgt && !/маҳзуф/.test(src)) return '<div class="tkr s" data-a="' + g[0] + '" data-b="' + g[1] + '"><span class="tka">' + ws.join(' ') + '</span>' +
      '<span class="tkd"><b>шибҳи жумла</b> · ' + sjd(src) + '</span></div>';
    if (!src || src == 'шибҳи жумла') return '<div class="tkr s" data-a="' + g[0] + '" data-b="' + g[1] + '"><span class="tka">' + ws.join(' ') + '</span>' +
      '<span class="tkd"><b>шибҳи жумла</b></span></div>';
    var u = hid ? null : U[i + '-' + g[0]]; /* яширин (маҳзуф) сўзга маъно берилмайди */
    function es(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] }) }
    var tg = hid ? '<span class="tkt0 hid">' + (tgt || '…') + '</span>' : '<span class="tkt0 ' + cls + '">' + tgt + '</span>';
    return '<div class="tkr s" data-a="' + g[0] + '" data-b="' + g[1] + '"' + (ti >= 0 ? ' data-t="' + ti + '"' : '') + '>' +
      '<div class="tkl2">' + (u ? '<span class="tkc">' + tg + '<small>' + es(u[0]) + '</small></span>' : tg) + '<span class="tkar">→</span>' + (u ? '<span class="tkc"><span class="tka">' + ws.join(' ') + '</span><small>' + es(u[1]) + '</small></span>' : '<span class="tka">' + ws.join(' ') + '</span>') + '</div>' +
      (u && u[2] ? '<span class="tku"><i>Ўзбекча:</i> ' + es(u[2]).replace(/→/g, '<b>→</b>') + '</span>' : '') +
      '<span class="tkd"><b>шибҳи жумла</b>' + (hid ? ' · ' + sjd(src) : '') + '</span>' +
      '</div>';
  }
  /* хабар ўрнидаги жар ва мажрур: ранги ўзиники, остида хабар рангидаги нуқтали чизиқ */
  function kx() {
    [].forEach.call(tx.querySelectorAll('.ws span.kx'), function (e) { e.classList.remove('kx') });
    var n = 0;
    Object.keys(G).forEach(function (i) {
      G[i].forEach(function (g) {
        if (g[3] != 's' || !/маҳзуф/.test(g[2]) || !/хабар/.test(g[2])) return;
        for (var j = g[0]; j <= g[1]; j++) { var e = tx.querySelector('.ws span[data-i="' + i + '-' + j + '"]'); if (e) { e.classList.add('kx'); n++ } }
      });
    });
    var lg = document.getElementById('lg');
    if (lg) { var pm = lg.querySelector('.pm'), po = lg.querySelector('.po'); if (pm && po && pm.nextSibling !== po) pm.parentNode.insertBefore(po, pm.nextSibling) }
    if (lg && Object.keys(G).length && !lg.querySelector('.lga')) { var y = document.createElement('span'); y.className = 'lga'; y.innerHTML = '<b>→</b> — мутааллиқ'; lg.appendChild(y) }
    if (lg && n && !lg.querySelector('.lgx')) { var x = document.createElement('span'); x.className = 'lgx'; x.innerHTML = '<u>Жар ва мажрур</u> — хабар ўрнида'; lg.appendChild(x) }
  }
  function deco() {
    kx();
    if (window.IRB) [].forEach.call(tx.querySelectorAll('.ws span[data-i]'), function (e) {
      var E = IRB[e.getAttribute('data-i')];
      if (E && E.j) e.setAttribute('data-j', E.j); else e.removeAttribute('data-j');
    });
    [].forEach.call(tx.querySelectorAll('.tkj'), function (e) { e.remove() });
    Object.keys(T).forEach(function (i) {
      var a0 = 0;
      T[i].forEach(function (t) {
        var m = t[1].match(/^Жумлатун (?:(исмийя|феълийя), )?(.+?)\.$/);
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
        for (var j = g[0]; j <= g[1]; j++) { var e = ln.querySelector('[data-i="' + i + '-' + j + '"]'); if (e) ws.push(cw(e, e.textContent)) }
        var lab = short(g[2]), m = lab.match(/^(шибҳи жумла|жумла[^,]*|маътуф жумла|сила жумласи|жумлаи ҳолийя)(.*)$/);
        var head = m ? m[1].replace(' → ', '') : lab, rest = m ? m[2] : '';
        if (g[3] == 's') return sj(i, ln, g, ws);
        return '<div class="tkr ' + g[3] + '" data-a="' + g[0] + '" data-b="' + g[1] + '"><span class="tka">' + ws.join(' ') + '</span>' +
          '<span class="tkd"><b>' + head + '</b>' + rest.replace(/^,\s*/, ' · ').replace(/^\s*→\s*/, ' → ') + '</span></div>';
      }
      var used = {}, segs = (T[i] || []).filter(function (t) { return t.st });
      segs.forEach(function (t) {
        var ws = [], gh = {};
        items.forEach(function (g) { if (g[3] == 's' && g[0] >= t.a && g[0] <= t[0]) { var z = ghost(g); if (z) gh[g[0]] = z } });
        for (var j = t.a; j <= t[0]; j++) { var e = ln.querySelector('[data-i="' + i + '-' + j + '"]'); if (e) ws.push(gh[j] ? gz(e.textContent, gh[j], e) : cw(e, e.textContent)) }
        var inner = '';
        items.forEach(function (g, k) { if (g[0] >= t.a && g[0] <= t[0]) { used[k] = 1; inner += card(g) } });
        h += '<div class="tkg"><div class="tkr g" data-a="' + t.a + '" data-b="' + t[0] + '"><span class="tks">' + t.st + '</span>' +
          '<span class="tka">' + ws.join(' ') + '</span></div>' + (inner ? '<div class="tki">' + inner + '</div>' : '') + '</div>';
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
