/* Ruscha qatlam (11.11.2026). O'zbekcha sahifa va uning kodi o'zgarmaydi: ekranga chiqqan o'zbekcha
   matn lug'at (window.RU_DICT) bo'yicha ruschaga o'giriladi. Arabcha so'zlar joyida qoladi (kerak bo'lsa
   o'rni almashadi). Ma'lumotda allaqachon ruscha bo'lgan satrlar (gap tarjimasi, lug'at, so'z ma'nosi)
   U+2063 belgisi bilan o'ralgan — ularga tegilmaydi. Topilmagan matn window.RU_MISS ga yoziladi.
   Kalit qoidasi src/ru/build.py dagi norm() bilan bir xil bo'lishi shart. */
(function () {
  'use strict';
  var D = window.RU_DICT || {}, MISS = window.RU_MISS = {};
  var MARK = '\u2063';
  var reCy = /[\u0400-\u04FF]/, reAr = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  var AR = '[\\u0600-\\u06FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF]';
  var reRun = new RegExp(AR + '+(?:[\\s\\u060C\\u2026]+' + AR + '+)*', 'g');
  var reGrp = /[\uE000-\uEFFF](?:[\s\u060C\u2026]+[\uE000-\uEFFF])*/g;   /* yonma-yon arabcha bo'laklar — bitta guruh */
  var reSplit = /(, |; |\. | — |: | \u00B7 )/;
  var seen = new WeakSet(), setAttr = new WeakMap();
  var V = {};   /* ruscha qiymatlar: kod ruscha matnni qayta qo'ysa (nusxa) — o'zgarmaydi, «topilmadi» ham emas */
  if (!D['«»']) D['«»'] = '«»';
  Object.keys(D).forEach(function (k) {
    var v = D[k].replace(/\d+(?:[.,]\d+)?/g, '#').replace(/\{\d+\}/g, '◌');
    V[v.charAt(0).toLowerCase() + v.slice(1)] = 1;
  });

  function cap(s) { return s.replace(/[\u0400-\u04FFa-z]/i, function (c) { return c.toUpperCase(); }); }
  function isUp(c) { return c && c !== c.toLowerCase() && c === c.toUpperCase(); }

  /* body: boshi/oxiri tozalangan matn (ichida F-tokenlar — arabcha guruhlar, Q-tokenlar — qo'shtirnoqlar) */
  function find(body, G, Q) {
    var g = [], n = [], q = [];
    var k = body.replace(/[\uF000-\uF7FF]/g, function (c) { g.push(c); return '\u25CC'; })
      .replace(/[\uF800-\uF8FF]/g, function (c) { q.push(c); return '«»'; })
      .replace(/\d+(?:[.,]\d+)?/g, function (c) { n.push(c); return '#'; })
      .replace(/\u200B/g, '').replace(/\s+/g, ' ');
    var up = isUp(k.charAt(0)), key = up ? k.charAt(0).toLowerCase() + k.slice(1) : k;
    if (!Object.prototype.hasOwnProperty.call(D, key)) return V[key] === 1 ? body : null;
    var v = D[key], gi = 0, ni = 0, qi = 0, bad = false;
    v = v.replace(/\{(\d+)\}/g, function (m, d) { return g[+d - 1] || ''; })
      .replace(/\u25CC/g, function () { return g[gi++] || ''; })
      .replace(/#/g, function () { return ni < n.length ? n[ni++] : '#'; })
      .replace(/«»/g, function () {
        var c = q[qi++]; if (!c) return '«»';
        var r = trStr(Q[c.charCodeAt(0) - 0xF800], G, Q); if (r == null) bad = true;
        return '«' + (r == null ? Q[c.charCodeAt(0) - 0xF800] : r) + '»';
      });
    if (bad) return null;
    return up ? cap(v) : v;
  }
  function look(s, G, Q) {
    var m = s.match(/^([^\u0400-\u04FF\uF000-\uF8FF0-9«(]*)([\s\S]*?)([\s.,:;!?\u2026]*)$/);
    if (!m[2]) return null;
    var r = null;   /* avval qo'shtirnoq ichi bilan birga (aniq kalit), keyin «» qolipi */
    if (/[\uF800-\uF8FF]/.test(m[2])) r = find(m[2].replace(/[\uF800-\uF8FF]/g, function (c) { return '\u00AB' + Q[c.charCodeAt(0) - 0xF800] + '\u00BB'; }), G, Q);
    if (r == null) r = find(m[2], G, Q);
    return r == null ? null : m[1] + r + m[3];
  }
  function miss(s, G, Q) {
    var k = s.replace(/[\uF800-\uF8FF]/g, function (c) { return '«' + Q[c.charCodeAt(0) - 0xF800] + '»'; })
      .replace(/[\uF000-\uF7FF]/g, '\u25CC').replace(/\s+/g, ' ').trim();
    MISS[k] = (MISS[k] || 0) + 1;
  }
  /* S: matn, arabcha guruhlar F-token bilan. Natija: tarjima (tokenlar bilan) yoki null */
  function trStr(S, G, Q) {
    if (!reCy.test(S)) return S;
    var lead = S.match(/^\s*/)[0], core = S.slice(lead.length).replace(/\s+$/, ''), trail = S.slice(lead.length + core.length);
    var r = look(core, G, Q);                                   /* 1) butun satr (qo'shtirnoq ichi bilan) */
    if (r == null) {
      var c2 = core.replace(/«([^«»]*[\u0400-\u04FF][^«»]*)»/g, function (m, x) {
        Q.push(x); return String.fromCharCode(0xF800 + Q.length - 1);
      });
      if (c2 !== core) r = look(c2, G, Q);                        /* 2) qo'shtirnoq ichi alohida */
      if (r == null) {                                          /* 3) bo'laklab */
        var P = c2.split(reSplit), ok = P.length > 1, out = [];
        for (var i = 0; ok && i < P.length; i++) {
          if (i % 2 || !/[\u0400-\u04FF\uF800-\uF8FF]/.test(P[i])) { out.push(P[i]); continue; }
          var x = look(P[i], G, Q);
          if (x == null) { ok = false; miss(P[i], G, Q); } else out.push(x);
        }
        r = ok ? out.join('') : null;
        if (r == null && P.length < 2) miss(c2, G, Q);
      }
    }
    return r == null ? null : lead + r + trail;
  }

  var reInl = /^(SPAN|B|I|EM|STRONG|BDI|BDO|MARK|U|SMALL)$/;
  function isAtom(n) {
    if (n.nodeType !== 1 || !reInl.test(n.nodeName)) return false;
    var t = n.textContent; return reAr.test(t) && !reCy.test(t);
  }
  function doText(t) {
    if (seen.has(t)) return; var p = t.parentNode; if (!p) return;
    var d = t.data; if (!reCy.test(d)) return;
    if (/^(SCRIPT|STYLE|TEXTAREA|TITLE)$/.test(p.nodeName)) return;
    if (d.indexOf(MARK) >= 0) { seen.add(t); return; }
    var U = [t], n = t.previousSibling;
    while (n && ((n.nodeType === 3 && n.data.indexOf(MARK) < 0) || isAtom(n))) { U.unshift(n); n = n.previousSibling; }
    n = t.nextSibling;
    while (n && ((n.nodeType === 3 && n.data.indexOf(MARK) < 0) || isAtom(n))) { U.push(n); n = n.nextSibling; }
    var A = [], S = '';
    U.forEach(function (x) {
      if (x.nodeType === 3) { seen.add(x); S += x.data.replace(reRun, function (m) { A.push(m); return String.fromCharCode(0xE000 + A.length - 1); }); }
      else { A.push(x); S += String.fromCharCode(0xE000 + A.length - 1); }
    });
    var G = [], Q = [];
    S = S.replace(reGrp, function (m) { G.push(m); return String.fromCharCode(0xF000 + G.length - 1); });
    var R = trStr(S, G, Q);
    if (R == null || R === S) return;
    R = R.replace(/[\uF000-\uF7FF]/g, function (c) { return G[c.charCodeAt(0) - 0xF000]; });
    var hasEl = A.some(function (a) { return typeof a !== 'string'; });
    if (!hasEl && U.length === 1) { t.data = R.replace(/[\uE000-\uEFFF]/g, function (c) { return A[c.charCodeAt(0) - 0xE000]; }); return; }
    var f = document.createDocumentFragment(), buf = '';
    function flush() { if (buf) { var x = document.createTextNode(buf); seen.add(x); f.appendChild(x); buf = ''; } }
    for (var i = 0; i < R.length; i++) {
      var c = R.charCodeAt(i);
      if (c >= 0xE000 && c <= 0xEFFF) { var a = A[c - 0xE000]; if (typeof a === 'string') buf += a; else { flush(); f.appendChild(a); } }
      else buf += R.charAt(i);
    }
    flush();
    var ref = U[U.length - 1].nextSibling;
    U.forEach(function (x) { if (x.nodeType === 3 && x.parentNode === p) p.removeChild(x); });
    p.insertBefore(f, ref && ref.parentNode === p ? ref : null);
  }
  var ATTR = ['aria-label', 'placeholder', 'title'];
  function doAttr(e) {
    for (var i = 0; i < ATTR.length; i++) {
      var v = e.getAttribute(ATTR[i]); if (!v || !reCy.test(v) || v.indexOf(MARK) >= 0) continue;
      var m = setAttr.get(e) || {}; if (m[ATTR[i]] === v) continue;
      var A = [], G = [], Q = [];
      var S = v.replace(reRun, function (x) { A.push(x); return String.fromCharCode(0xE000 + A.length - 1); })
        .replace(reGrp, function (x) { G.push(x); return String.fromCharCode(0xF000 + G.length - 1); });
      var R = trStr(S, G, Q); if (R == null) { m[ATTR[i]] = v; setAttr.set(e, m); continue; }
      R = R.replace(/[\uF000-\uF7FF]/g, function (c) { return G[c.charCodeAt(0) - 0xF000]; })
        .replace(/[\uE000-\uEFFF]/g, function (c) { return A[c.charCodeAt(0) - 0xE000]; });
      m[ATTR[i]] = R; setAttr.set(e, m); e.setAttribute(ATTR[i], R);
    }
  }
  function scan(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA)$/.test(root.nodeName)) return;
    doAttr(root);
    var q = root.querySelectorAll('[aria-label],[placeholder],[title]');
    for (var i = 0; i < q.length; i++) doAttr(q[i]);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), L = [], n;
    while ((n = w.nextNode())) L.push(n);
    L.forEach(doText);
  }
  var obs = new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === 'childList') { for (var j = 0; j < r.addedNodes.length; j++) scan(r.addedNodes[j]); }
      else if (r.type === 'characterData') { seen.delete(r.target); scan(r.target); }
      else if (r.target.nodeType === 1) doAttr(r.target);
    }
    obs.takeRecords();   /* o'zimiz qilgan o'zgarishlar qayta ko'rilmaydi */
  });
  obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  function all() { if (document.body) { scan(document.body); obs.takeRecords(); } }
  document.addEventListener('DOMContentLoaded', all);
  window.addEventListener('load', all);
  window.RU_SCAN = all;
  /* qulf ekranidagi pleyer yozuvi (Media Session) — DOM emas, shuning uchun alohida */
  function plain(v) {
    if (typeof v !== 'string' || !reCy.test(v) || v.indexOf(MARK) >= 0) return v;
    var A = [], G = [], Q = [];
    var S = v.replace(reRun, function (x) { A.push(x); return String.fromCharCode(0xE000 + A.length - 1); })
      .replace(reGrp, function (x) { G.push(x); return String.fromCharCode(0xF000 + G.length - 1); });
    var R = trStr(S, G, Q); if (R == null) return v;
    return R.replace(/[\uF000-\uF7FF]/g, function (c) { return G[c.charCodeAt(0) - 0xF000]; })
      .replace(/[\uE000-\uEFFF]/g, function (c) { return A[c.charCodeAt(0) - 0xE000]; });
  }
  window.RU_TR = plain;
  if (window.MediaMetadata) {
    var MM = window.MediaMetadata;
    window.MediaMetadata = function (o) {
      o = o || {}; ['title', 'artist', 'album'].forEach(function (k) { if (o[k]) o[k] = plain(o[k]).split(MARK).join(''); });
      return new MM(o);
    };
    window.MediaMetadata.prototype = MM.prototype;
  }
})();
