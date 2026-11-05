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
    '.tkar{font:700 16px system-ui;color:var(--tx)}' +
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
    '.tkg.c .tkr.g{flex-direction:row;align-items:center;gap:8px}.tkg.c .tkr.g .tka{font-size:calc(var(--fs,22px)*.7);align-self:auto;flex:1}.tkg.c1{flex-direction:row;justify-content:flex-start;direction:rtl}' +
    '.tkx .tka,.tkx .tka span,.tkx .tkt0{color:var(--mu)!important}.tkx .tkz{color:var(--mu)!important;background:none!important}.tkx .tkt0{background:var(--bg)!important}' +
    '.tkz.f{color:var(--cf);background:rgba(200,90,20,.07)}' +
    '#tx.tartib .ws span.kx{text-decoration:underline dotted var(--cx);text-decoration-thickness:2.5px;text-underline-offset:.45em;text-decoration-skip-ink:none}' +
    '.lgd .lga{color:var(--cj)}.lgd .lga b{font-weight:700}' +
    '.lgd .lgx{color:var(--cj)}.lgd .lgx u{text-decoration:underline dotted var(--cx);text-decoration-thickness:2.5px;text-underline-offset:4px}' +
    '.tkx .tka span{font-size:inherit!important;text-align:inherit!important}' +
    '.tkx .tka .pm{color:var(--cm)}.tkx .tka .po{color:var(--co)}.tkx .tka .px{color:var(--cx)}.tkx .tka .pf{color:var(--cf)}.tkx .tka .pb{color:var(--cb)}.tkx .tka .pj{color:var(--cj)}.tkx .tka .ph{color:var(--ch)}' +
    '.lgd .lgk{flex-basis:100%;font-size:12px;color:var(--mu)}' +
    '.tkc{display:inline-flex;flex-direction:column;align-items:center;gap:1px}.tkc>small{direction:ltr;font:500 12px/1.2 system-ui,-apple-system,sans-serif;color:var(--mu)}' +
    '.tku{direction:ltr;font:600 13px/1.3 system-ui,-apple-system,sans-serif;color:var(--tx)}.tku i{font-style:normal;font-weight:500;color:var(--mu)}.tku b{color:var(--cj)}';
  /* Ягона ранглар (05.11.2026): ҳар бўлак ўз вазифаси рангида; ҳарф ва музофун илайҳ рангсиз; изофа — музоф рангидаги ёй */
  st.textContent +=
    '#tx .ws span[data-i] span.q{padding:0!important;border-radius:0!important;background:none!important;transition:none}' +
    '#tx.tartib .ws span[data-i] span.q0{color:var(--tx)}' +
    '#tx.tartib .ws span.kx{text-decoration:none!important}' +
    '#tx.tartib .ws span.iz{border-bottom:2px solid var(--izc,var(--mu));padding-bottom:7px;border-radius:0}' +
    '#tx.tartib .ws span.iz.izr{border-bottom-right-radius:12px}#tx.tartib .ws span.iz.izl{border-bottom-left-radius:12px}' +
    '#tx.tartib .ws span.iz.izm{margin-left:-4px;padding-left:6px}' +
    '.zc-m{--izc:var(--cm)}.zc-o{--izc:var(--co)}.zc-x{--izc:var(--cx)}.zc-f{--izc:var(--cf)}.zc-b{--izc:var(--cb)}.zc-j{--izc:var(--cj)}.zc-h{--izc:var(--ch)}.zc-mu{--izc:var(--mu)}' +
    '.lgd .lgi{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:16px;color:var(--cm);border-bottom:2px solid var(--cm);border-radius:0 0 10px 10px;padding:0 3px 3px}.lgd .lgi i{font-style:normal;color:var(--tx)}' +
    '.lgd .lgz{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:16px}' +
    '.lgb{display:none!important}.lgd{gap:2px 10px!important;font-size:12px!important;justify-content:center;margin:0 0 6px!important;padding:4px 0!important;border-bottom:1px solid var(--bd)}';
  st.textContent +=
    '.tkx{display:block!important;margin:8px 0 2px!important;padding:8px 12px 6px!important;border-radius:12px!important;background:var(--bg)!important;border:1px solid var(--bd)!important}' +
    '.tq+.tq{border-top:1px solid var(--bd);margin-top:6px;padding-top:6px}' +
    '.tqh{display:flex;justify-content:flex-end;margin:0 0 4px}' +
    '.tqgt{font:700 12px/1 system-ui,-apple-system,sans-serif;color:var(--ac);background:var(--tint,rgba(15,122,79,.1));border-radius:999px;padding:5px 10px}' +
    '.tqr{display:flex;align-items:center;gap:8px;padding:3px 4px;direction:ltr;cursor:pointer;border-radius:8px}' +
    '.tqk{flex:0 0 auto;min-width:78px;font:700 13px/1.2 system-ui,-apple-system,sans-serif;color:var(--mu);text-align:left}' +
    '.tqk i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px}' +
    '.tqar{display:flex;align-items:center;gap:7px;direction:rtl;flex-wrap:wrap}' +
    '.tqc{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:calc(var(--fs,22px)*.85);line-height:1.5;border:1px solid var(--bd);border-radius:9px;padding:0 9px;background:var(--cd);color:var(--tx);direction:rtl;font-weight:400}' +
    '.tqc.d{border-style:dashed;border-color:var(--mu)}' +
    '.tqs{font:600 11.5px system-ui,sans-serif;color:var(--mu);direction:ltr}' +
    '.tql{border-top:1px dashed var(--bd);padding:6px 4px 4px;cursor:pointer;border-radius:8px}' +
    '.tqrow{display:flex;align-items:center;gap:7px;flex-wrap:wrap;direction:ltr}' +
    '.tqkc{font:700 11.5px/1 system-ui,-apple-system,sans-serif;color:var(--mu);border:1px solid var(--bd);border-radius:999px;padding:4px 8px;background:var(--cd)}' +
    '.tqn{font:400 13.5px/1.45 system-ui,-apple-system,sans-serif;color:var(--mu);margin-top:3px;direction:ltr;text-align:left}' +
    '.tqn .ar,.tqj .ar{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:1.25em}' +
    '.tqj{border-top:1px solid var(--bd);margin-top:4px;padding-top:6px;font:400 13.5px/1.45 system-ui,-apple-system,sans-serif;color:var(--mu);direction:ltr;text-align:left}.tqj b{color:var(--tx)}' +
    '.tqr.on,.tql.on{background:var(--tint,rgba(15,122,79,.1))}';
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
    var g = '<span class="tkz' + (z == 'أَدْعُو' ? ' f' : '') + '">' + z + '</span>', m = w.match(/^([وف][ً-ْ]*)(.+)$/);
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
      (/^шибҳи жумла$/.test(sjd(src)) ? '' : '<span class="tkd">' + sjd(src) + '</span>') + '</div>';
    if (!src || src == 'шибҳи жумла') return '<div class="tkr s" data-a="' + g[0] + '" data-b="' + g[1] + '"><span class="tka">' + ws.join(' ') + '</span></div>';
    var u = U[i + '-' + g[0]]; if (u && /^(كَائِن|مَوْجُود)/.test(tgt)) u = null; /* яширин тақдир сўзига (كَائِنٌ، مَوْجُودٌ) маъно берилмайди */
    function es(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] }) }
    var tg = hid ? '<span class="tkt0 hid">' + (tgt || '…') + '</span>' : '<span class="tkt0 ' + cls + '">' + tgt + '</span>';
    return '<div class="tkr s" data-a="' + g[0] + '" data-b="' + g[1] + '"' + (ti >= 0 ? ' data-t="' + ti + '"' : '') + '>' +
      '<div class="tkl2">' + (u ? '<span class="tkc">' + tg + '<small>' + es(u[0]) + '</small></span>' : tg) + '<span class="tkar">→</span>' + (u ? '<span class="tkc"><span class="tka">' + ws.join(' ') + '</span><small>' + es(u[1]) + '</small></span>' : '<span class="tka">' + ws.join(' ') + '</span>') + '</div>' +
      (hid ? '<span class="tkd">' + sjd(src) + '</span>' : '') +
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
    /* → , карта ва нуқтали чизиқ изоҳи — «?» йўриқномасида (shell.js), легендада фақат ранглар */
  }
  function lc(s) { return String(s).replace(/[^ء-يٱ]/g, '').length }
  function prole(u, eff, kxw) {
    var h = u.split(',')[0];
    if (/^(ت муаннаслик|ن сақловчи|сақловчи ҳарф|ا фарқлаш|و ишбоъ|вовул)/.test(u) || /ҳарфи|ҳарф$|ҳарф \(|зоида ҳарф/.test(h)) return '';
    var m = u.match(/^(?:муттасил|мунфасил) замир бўлиб,? (?:у )?([^,]+)/);
    if (m) {
      var r = m[1];
      if (/музофун илайҳ/.test(r)) return '';
      if (/фоил/.test(r)) return 'o';
      if (/мафъулун биҳ/.test(r)) return 'b';
      if (/^мажрур/.test(r)) return kxw ? 'x' : 'j';
      if (/нинг исми/.test(r) || /^мубтадо/.test(r)) return 'm';
      if (/нинг хабари/.test(r) || /^хабар/.test(r)) return 'x';
      return eff;
    }
    return null;
  }
  /* сўзни бўлакларга (олд ҳарф, асос, замир) ажратиш: ҳарфлар сони бўйича; мос келмаса — null */
  function split(t, forms) {
    var c = forms.map(lc), n = c.reduce(function (a, b) { return a + b }, 0), w = lc(t);
    if (n != w) for (var i = 1; i < forms.length; i++) if (bare(forms[i - 1]) == 'ل' && /^ا?ل/.test(bare(forms[i])) && bare(forms[i]).indexOf('ال') == 0) { c[i]--; n--; }
    if (n != w || forms.length < 2) return null;
    var seg = forms.map(function () { return '' }), p = 0, left = c.slice();
    for (var k = 0; k < t.length; k++) {
      var ch = t[k];
      if (/[ء-يٱ]/.test(ch)) { while (p < c.length - 1 && left[p] == 0) p++; left[p]--; }
      seg[p] += ch;
    }
    return seg;
  }
  function rang() {
    if (!window.IRB) return;
    var CV = window.CATOV || {};
    [].forEach.call(tx.querySelectorAll('.ln'), function (ln) {
      if (/МАВЗУ/.test(getComputedStyle(ln, '::before').content || '') || getComputedStyle(ln).display == 'none') return;
      var prevEff = '', prevIl = false, muzEff = '';
      [].forEach.call(ln.querySelectorAll('.ws'), function (ws) {
        var grp = null, gcol = '';
        function close() {
          if (grp && (grp.length > 1 || grp[0].inner)) grp.forEach(function (o, z) {
            o.e.classList.add('iz', 'zc-' + (gcol || 'mu'));
            if (z == 0) o.e.classList.add('izr');
            if (z == grp.length - 1) o.e.classList.add('izl'); else o.e.classList.add('izm');
          });
          grp = null;
        }
        [].forEach.call(ws.querySelectorAll('span[data-i]'), function (e) {
          var k = e.getAttribute('data-i'), E = IRB[k] || {}, K = (E.k || []).filter(function (x) { return x[0] }), A = E.a || [];
          var raw = CV[k] !== undefined ? CV[k] : (window.catOf && window.get ? catOf(get(k)) : '');
          var kxw = e.classList.contains('kx');
          var roles = K.map(function (x) { return prole(x[1], null, kxw) });
          var si = roles.indexOf(null), su = si >= 0 ? K[si][1] : '';
          var il = E.s == 'муз.илайҳ' || /^(лафзи жалола бўлиб )?(музоф бўлиб )?музофун илайҳ/.test(su);
          var J = E.j == 'J';
          var eff;
          if (il) eff = '';
          else if (raw == '^') eff = prevIl ? (J ? '' : muzEff) : prevEff;
          else if (raw == '>' || raw == '-') eff = '';
          else eff = raw || '';
          if (kxw && raw != '>' && !il && eff != 'f') eff = 'x';
          var inIl = il || (raw == '^' && prevIl && J);
          var muz = /музоф бўлиб/.test(su) || A.some(function (a) { return /وَهُوَ مُضَافٌ/.test(a[1]) });
          var inner = roles.some(function (r, z) { return r === '' && /музофун илайҳ/.test(K[z][1]) });
          /* ранг */
          (e.className.match(/\bp[a-z]\b/g) || []).forEach(function (c) { e.classList.remove(c) });
          if (eff) e.classList.add('p' + eff);
          if (window.CAT) { if (eff) CAT[k] = eff; else delete CAT[k]; }
          var seg = K.length > 1 ? split(e.textContent, K.map(function (x) { return x[0] })) : null;
          if (seg && roles.some(function (r) { return r !== null && r !== eff })) {
            e.innerHTML = seg.map(function (t, z) { var r = roles[z] === null ? eff : roles[z]; return '<span class="q ' + (r ? 'p' + r : 'q0') + '">' + t + '</span>' }).join('');
          }
          /* изофа */
          if (grp && inIl) grp.push({ e: e, inner: inner }); else close();
          if (!grp && muz) { grp = [{ e: e, inner: inner }]; gcol = eff; }
          if (grp && inner && !muz) close();
          else if (grp && inner && grp.length == 1 && grp[0].e === e) { grp[0].inner = true; close(); }
          if (!il && raw != '^') muzEff = eff;
          if (raw != '>') { prevEff = eff; prevIl = inIl; }
        });
        close();
      });
    });
    /* таржима рангсиз (05.11.2026, фойдаланувчи қарори) */
    [].forEach.call(tx.querySelectorAll('.ts'), function (e) {
      (e.className.match(/\bp[a-z]\b/g) || []).forEach(function (c) { e.classList.remove(c) });
    });
    /* легенда — дарс ва фиқҳда бир хил */
    var lg = document.getElementById('lg');
    if (lg && !lg.getAttribute('data-v2')) {
      lg.setAttribute('data-v2', '1');
      lg.innerHTML = '<span class="pm">● Мубтадо, исм</span><span class="po">● Фоил</span><span class="px">● Хабар</span><span class="pf">● Феъл</span>' +
        '<span class="pb">● Мафъулун биҳ</span><span class="pj">● Мажрур</span><span class="ph">● Зарф, ҳол</span>';
    }
    if (lg) lg.classList.add('lgo');
  }
  function deco() {
    kx();
    rang();
    if (window.IRB) [].forEach.call(tx.querySelectorAll('.ws span[data-i]'), function (e) {
      var E = IRB[e.getAttribute('data-i')];
      if (E && E.j) e.setAttribute('data-j', E.j); else e.removeAttribute('data-j');
    });
    [].forEach.call(tx.querySelectorAll('.tkj'), function (e) { e.remove() });
    Object.keys(T).forEach(function (i) {
      var a0 = 0;
      T[i].forEach(function (t) {
        var m = t[1].match(/^Жумлатун (?:(исмийя|феълийя|таажжуб), )?(.+?)\.$/);
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

  /* ===== Ягона Таркиб қутиси (05.11.2026; грамматика ва фиқҳда бир хил) =====
     гап тури → асосий бўлаклар (Мубтадо/Хабар ёки Феъл/Фоил/Мафъул) → боғланишлар (тур, сўз → боғланган сўз, изоҳ) → жумла изоҳи */
  var DOT = { m: 'cm', x: 'cx', f: 'cf', o: 'co', b: 'cb', j: 'cj', h: 'ch' };
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] }) }
  function arb(t) { /* «арабча …» бутунича битта rtl бўлак */
    return String(t).split(/(«[^»]*»)/).map(function (x) {
      if (/^«[^»]*[؀-ۿ][^»]*»$/.test(x)) return '«<bdi class="ar" dir="rtl">' + esc(x.slice(1, -1)) + '</bdi>»';
      return esc(x).replace(/([؀-ۿ][؀-ۿً-ْٰ\s،]*[؀-ۿً-ْٰ]|[؀-ۿ])/g, '<bdi class="ar">$1</bdi>');
    }).join('');
  }
  function pc(e) { var m = (e.className || '').match(/\bp([a-z])\b/); return m ? m[1] : '' }
  var PU = /[()\[\]{}.:،؛؟!,«»﴿﴾"]/g;
  function cl(t) { return String(t).replace(PU, '').replace(/\s+/g, ' ').trim() }
  function lead(q) { return !!q && /^[وف]$/.test(bare(q.textContent)) }
  function wtxt(e, c) { /* бутун сўз; олд و/ف ташланади; феълда замир бўлаклари ташланади */
    var qs = [].slice.call(e.querySelectorAll('span.q'));
    if (qs.length < 2) return cl(e.textContent);
    var r = qs.filter(function (q, z) { return !(z == 0 && lead(q)) && !(c == 'f' && /\bp[ob]\b/.test(q.className)) });
    return cl((r.length ? r : qs).map(function (q) { return q.textContent }).join(''));
  }
  function brk(pe, e) { var q = e.querySelector('span.q'); return /[.:،؛؟!,()«»﴿﴾]\s*$/.test(pe.textContent) || /^\s*[(«﴿]/.test(e.textContent) || lead(q) }
  function chip(t, cls) { return '<span class="tqc' + (cls ? ' ' + cls : '') + '">' + esc(t) + '</span>' }
  function short3(a) { return a.length > 3 ? a.slice(0, 2).join(' ') + ' …' : a.join(' ') }
  function stemUz(E) { var k = (E && E.k || []).filter(function (x) { return x[0] }); return k.length ? k.map(function (x) { return x[1] }).join(' · ') : '' }
  function phrases(ln, i, a, b) {
    var P = [], cur = null;
    for (var j = a; j <= b; j++) {
      var e = ln.querySelector('[data-i="' + i + '-' + j + '"]'); if (!e) continue;
      var c = pc(e), iz = e.classList.contains('iz'), iz0 = e.classList.contains('izr');
      if (c && cur && cur.c == c && !iz0 && !brk(cur.e[cur.e.length - 1], e)) { cur.e.push(e); cur.b = j; continue; }
      if (!c && cur && iz && !iz0 && cur.iz && !brk(cur.e[cur.e.length - 1], e)) { cur.e.push(e); cur.b = j; continue; }
      if (c) { cur = { c: c, e: [e], a: j, b: j, iz: iz }; P.push(cur); } else cur = null;
    }
    return P;
  }
  function prow(k, c, body, a, b, t) {
    return '<div class="tqr" data-a="' + a + '" data-b="' + b + '"' + (t != null ? ' data-t="' + t + '"' : '') + '><span class="tqk"><i style="background:var(--' + (DOT[c] || 'mu') + ')"></i>' + k + '</span><span class="tqar">' + body + '</span></div>';
  }
  function pillars(i, ln, t, ghosts) {
    var P = phrases(ln, i, t.a, t[0]), h = '';
    function first(c, after, before) { for (var n = 0; n < P.length; n++) if (P[n].c == c && (after == null || P[n].a > after) && (before == null || P[n].a < before)) return P[n]; return null }
    function ph(p, c) { var ws = (c == 'f' ? p.e.slice(0, 1) : p.e).map(function (e, z) { return z == 0 ? wtxt(e, c) : cl(e.textContent) }).filter(Boolean); return chip(short3(ws)) }
    function E0(p) { return IRB[i + '-' + p.a] || {} }
    if (t.st == 'исмийя') {
      var m = first('m'), x = first('x');
      if (m) h += prow(/нинг исми|^исми$/.test(stemUz(E0(m)) + ' ' + (E0(m).s || '')) ? 'Исм' : 'Мубтадо', 'm', ph(m, 'm'), m.a, m.b);
      else for (var j = t.a; j <= t[0]; j++) { var mm = stemUz(IRB[i + '-' + j]).match(/мубтадоси маҳзуф: \(([؀-ۿً-ْٰ\s]+)\)/) || ((IRB[i + '-' + j] || {}).k || []).map(function (q) { return (q[1] || '').match(/мубтадоси маҳзуф: \(([؀-ۿً-ْٰ\s]+)\)/) }).filter(Boolean)[0]; if (mm) { h += prow('Мубтадо', 'm', chip(mm[1], 'd'), j, j); break } }
      if (x) h += prow('Хабар', 'x', ph(x, 'x'), x.a, x.b);
      else {
        var jx = (G[i] || []).filter(function (g) { return g[3] == 'j' && /хабари?(\b|,|$)/.test(g[2]) && g[0] >= t.a && g[0] <= t[0] })[0];
        if (jx) { var ws = []; for (var q = jx[0]; q <= jx[1]; q++) { var e = ln.querySelector('[data-i="' + i + '-' + q + '"]'); if (e) ws.push(cl(e.textContent)) } h += prow('Хабар', 'x', chip(short3(ws)) + '<small class="tqs">жумла</small>', jx[0], jx[1]); }
      }
    } else if (t.st == 'феълийя') {
      var f = first('f'), fe = f ? IRB[i + '-' + f.a] || {} : {}, fu = stemUz(fe);
      if (f) h += prow('Феъл', 'f', ph(f, 'f'), f.a, f.a);
      else if (ghosts.indexOf('أَدْعُو') >= 0) h += prow('Феъл', 'f', chip('أَدْعُو', 'd'), t.a, t.a);
      var fw = f ? f.e[0] : null;
      if (f && /ноқис/.test(fu)) {
        var mi = first('m', f.a - 1), xi = first('x', f.a - 1), hz = fu.match(/(?:жоиз|вожиб) ҳолдаги (\S+) мустатир замир/);
        if (mi) h += prow('Исм', 'm', ph(mi, 'm'), mi.a, mi.b); else if (hz) h += prow('Исм', 'm', chip(hz[1], 'd'), f.a, f.a);
        if (xi) h += prow('Хабар', 'x', ph(xi, 'x'), xi.a, xi.b);
      } else if (f) {
        var nf = first('f', f.a), bd = nf ? nf.a : null, o = first('o', f.a, bd), inO = fw && fw.querySelector('span.q.po'), hz2 = fu.match(/(?:жоиз|вожиб) ҳолдаги (\S+) мустатир замир бор бўлиб, у (ноиби фоил|фоил)/), bz = fu.match(/([؀-ۿ]+) бориз муттасил замир бўлиб, у (фоил|ноиби фоил)/);
        var nb = /мажҳул/.test(fu) || (o && /^ноиби фоил/.test(stemUz(IRB[i + '-' + o.a])));
        var lab = nb ? 'Ноиби фоил' : 'Фоил';
        if (o) h += prow(lab, 'o', ph(o, 'o'), o.a, o.b);
        else if (inO) h += prow(lab, 'o', chip(cl(inO.textContent)), f.a, f.a);
        else if (hz2) h += prow(hz2[2] == 'ноиби фоил' ? 'Ноиби фоил' : 'Фоил', 'o', chip(hz2[1], 'd') + '<small class="tqs">яширин</small>', f.a, f.a);
        else if (bz) h += prow(lab, 'o', chip(bz[1]), f.a, f.a);
        var b = first('b', f.a, bd), inB = fw && fw.querySelector('span.q.pb');
        if (b) h += prow('Мафъулун биҳ', 'b', ph(b, 'b'), b.a, b.b);
        else if (inB) h += prow('Мафъулун биҳ', 'b', chip(cl(inB.textContent)), f.a, f.a);
      }
      if (!f) { for (var z = t.a; z <= t[0]; z++) if (/^мунодо/.test(stemUz(IRB[i + '-' + z]))) { var me = ln.querySelector('[data-i="' + i + '-' + z + '"]'); if (me) h += prow('Мунодо', 'b', chip(cl(me.textContent)), z, z); break } }
    }
    return h;
  }
  function findW(ln, i, w) {
    var tb = bare(w), hit = null;
    if (!tb) return null;
    [].some.call(ln.querySelectorAll('.ws span[data-i]'), function (e) { var b0 = bare(e.textContent); if (b0 == tb || b0.slice(-tb.length) == tb || b0.replace(/^ال/, '') == tb.replace(/^ال/, '')) { hit = e; return true } });
    return hit;
  }
  function rel(i, ln, g, ws) {
    var kind = '', tgt = '', hid = false, note = '', ti = null, dep = chip(short3(ws), g[3] == 's' ? 'd' : '');
    if (g[3] == 's') {
      var src = g[2].replace(/^шибҳи жумла — ?/, '').replace(/ ?га мутааллиқ$/, '');
      kind = /баён/.test(src) ? 'баён' : /бадал/.test(src) ? 'бадал' : /^ноиби фоил/.test(src) ? 'ноиби фоил' : 'мутааллиқ';
      if (kind == 'мутааллиқ' && /маҳзуф|бўлмиш/.test(src)) { var k1 = tq(src); tgt = k1 ? k1[1] : ''; hid = true; var d = sjd(src); note = /^маҳзуф/.test(d.replace(/<[^>]+>/g, '')) ? d : d; }
      else if (kind == 'мутааллиқ') { var a1 = src.match(/^(?:маҳзуф )?([؀-ۿً-ْٰ\s]+)$/); if (a1) { var we = findW(ln, i, a1[1]); tgt = we ? we.textContent.replace(/[.:،؛؟!,]+$/, '') : a1[1]; if (we) ti = we.getAttribute('data-i').split('-')[1]; } else if (src) note = arb(src); }
      else { var a2 = src.match(/([؀-ۿً-ْٰ]+)/); if (a2) { var we2 = findW(ln, i, a2[1]); tgt = we2 ? we2.textContent.replace(/[.:،؛؟!,]+$/, '') : a2[1]; if (we2) ti = we2.getAttribute('data-i').split('-')[1]; } note = arb(src.replace(/^[؀-ۿً-ْٰ\s]+/, '').trim()); }
      var u = U[i + '-' + g[0]]; if (u && !hid) note = (note ? note + ' · ' : '') + esc(u[1]) + ' → ' + esc(u[0]);
    } else {
      var lab = g[2].replace(/^жумла — ?/, '');
      kind = /сила/.test(lab) ? 'сила' : /маътуф/.test(lab) ? 'атф' : /мафъули|мақули/.test(lab) ? 'мафъул' : /хабар/.test(lab) ? 'хабар' : /сифати/.test(lab) ? 'сифат' : /ҳол/.test(lab) ? 'ҳол' : 'жумла';
      var a3 = lab.match(/([؀-ۿً-ْٰ]+)/);
      if (a3) { var we3 = findW(ln, i, a3[1]); tgt = we3 ? we3.textContent.replace(/[.:،؛؟!,]+$/, '') : a3[1]; if (we3) ti = we3.getAttribute('data-i').split('-')[1]; }
      else if (kind == 'сила') { var pe = ln.querySelector('[data-i="' + i + '-' + (g[0] - 1) + '"]'), PE = IRB[i + '-' + (g[0] - 1)] || {}; if (pe && /мавсул/.test(stemUz(PE) + (PE.s || ''))) { tgt = pe.textContent.replace(/[.:،؛؟!,]+$/, ''); ti = g[0] - 1; } }
      note = arb(lab.replace(/[؀-ۿً-ْٰ]+\s*/, a3 ? '' : '$&').replace(/^нинг /, '').replace(/^сила жумласи,?\s*/, '').replace(/^жумласига /, '').trim());
      note = note.replace(/^(дан|га)\s+/, '');
    }
    var arw = tgt ? chip(tgt, hid ? 'd' : '') + '<span class="tkar">→</span>' : '';
    return '<div class="tql" data-a="' + g[0] + '" data-b="' + g[1] + '"' + (ti != null ? ' data-t="' + ti + '"' : '') + '><div class="tqrow"><span class="tqkc">' + kind + '</span><span class="tqar">' + arw + dep + '</span></div>' + (note ? '<div class="tqn">' + note + '</div>' : '') + '</div>';
  }
  function lay() {
    [].forEach.call(tx.querySelectorAll('.tkx'), function (e) { e.remove() });
    if (!tx.classList.contains('tartib')) return;
    var lns = tx.querySelectorAll('.ln');
    Object.keys(G).concat(Object.keys(T)).filter(function (v, k, a) { return a.indexOf(v) == k }).forEach(function (i) {
      var ln = lns[+i]; if (!ln) return;
      if (/МАВЗУ/.test(getComputedStyle(ln, '::before').content || '') || getComputedStyle(ln).display == 'none') return;
      var items = (G[i] || []).slice().sort(function (a, b) { return a[0] - b[0] || (b[1] - b[0]) - (a[1] - a[0]) });
      function wsOf(g) { var ws = []; for (var j = g[0]; j <= g[1]; j++) { var e = ln.querySelector('[data-i="' + i + '-' + j + '"]'); if (e) ws.push(cl(e.textContent)) } return ws.filter(Boolean) }
      var used = {}, segs = (T[i] || []).filter(function (t) { return t.st || /^[а-яўқғҳё]+йя$/.test(t[1] || '') }), h = '';
      var jstart = {}; items.forEach(function (g) { if (g[3] == 'j') jstart[g[0]] = 1 });
      segs.forEach(function (t) {
        var gh = [];
        items.forEach(function (g) { if (g[3] == 's' && g[0] >= t.a && g[0] <= t[0]) { var z = ghost(g); if (z) gh.push(z) } });
        for (var jn = t.a; jn < t[0]; jn++) { var A = IRB[i + '-' + jn], B = IRB[i + '-' + (jn + 1)]; if (A && B && /^нидо ҳарфи/.test(A.s || '') && /^мунодо/.test(B.s || '')) gh.push('أَدْعُو') }
        var inner = '';
        items.forEach(function (g, k) { if (g[0] >= t.a && g[0] <= t[0]) { used[k] = 1; inner += rel(i, ln, g, wsOf(g)) } });
        var jm = [];
        for (var q = t.a; q <= t[0]; q++) { var Q = IRB[i + '-' + q]; if (Q && Q.jm && !jstart[q]) jm.push(String(Q.jm).replace(/^«[^»]*»\s*—\s*/, '')) }
        var kd = t.st || ([].some.call(ln.querySelectorAll('.ws span[data-i]'), function (e) { var j = +e.getAttribute('data-i').split('-')[1]; return j >= t.a && j <= t[0] && pc(e) == 'f' }) ? 'феълийя' : 'исмийя');
        h += '<div class="tq"><div class="tqh"><span class="tqgt">' + (t.st || t[1]) + '</span></div>' + pillars(i, ln, { a: t.a, 0: t[0], st: kd }, gh) + inner +
          (jm.length ? '<div class="tqj"><b>Жумла:</b> ' + jm.map(arb).join(' · ') + '</div>' : '') + '</div>';
      });
      var rest = ''; items.forEach(function (g, k) { if (!used[k]) rest += rel(i, ln, g, wsOf(g)) });
      if (rest) h += '<div class="tq">' + rest + '</div>';
      if (!h) return;
      var box = document.createElement('div'); box.className = 'tkx'; box.innerHTML = h;
      var trs = ln.querySelectorAll('.tr'), tr = trs[trs.length - 1]; if (tr) tr.parentNode.insertBefore(box, tr.nextSibling); else ln.appendChild(box); /* таржима арабча гап тагида, қути ундан кейин */
      [].forEach.call(box.querySelectorAll('.tqr,.tql'), function (r) {
        r.addEventListener('click', function (ev) {
          ev.stopPropagation();
          var on = !r.classList.contains('on');
          [].forEach.call(tx.querySelectorAll('.tqr.on,.tql.on'), function (x) { x.classList.remove('on') });
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
