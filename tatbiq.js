/* «Татбиқ» — grammatika kitobi dars sahifalari (21.11.2026, foydalanuvchi qarori; docs/texnik.md 18).
   Manba: src/manba/grammatika/kitob-1-53.md (matn kitobdagidek, faqat ko'rinish bezatilgan).
   Tartib: video → kitob matni (sxemalar bilan) → Машқ (interaktiv) → «Қўшимча» → «Юқори даража» (ikkalasi yopiq; kitobda yo'q,
   mashhur nahv/sarf kitoblaridan — sahifada manba yozilmaydi, loyiha qoidasi 3). qoidalar.html #dN chaqiradi: Tatbiq.chiz(n, el, o).
   Matn belgilari: ⟨…⟩ — arabcha, **…** — qalin, *…* — kursiv. Ranglar: i исм, f феъл, h ҳарф, m мозий, z музорий, a амр. */
(function () {
  var T = window.Tatbiq = { D: {} };

  var CSS = '.tb .ar{font-family:"DarsNaskh","Noto Naskh Arabic",serif;direction:rtl;unicode-bidi:isolate;font-weight:400}' +
    '.tb .c-i{--c:#5446C2;--t:rgba(84,70,194,.11)}.tb .c-f,.tb .c-z{--c:#0D7A62;--t:rgba(13,122,98,.11)}.tb .c-h{--c:#B4511F;--t:rgba(180,81,31,.11)}' +
    '.tb .c-m{--c:#8E5C0E;--t:rgba(142,92,14,.12)}.tb .c-a{--c:#B0335A;--t:rgba(176,51,90,.1)}' +
    '.tb .c-k{--c:#1D66A3;--t:rgba(29,102,163,.11)}.tb .c-n{--c:#A13A86;--t:rgba(161,58,134,.1)}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tb .c-k{--c:#8EC3F0;--t:rgba(142,195,240,.13)}:root:not([data-theme="light"]) .tb .c-n{--c:#EBA0D6;--t:rgba(235,160,214,.12)}}' +
    ':root[data-theme="dark"] .tb .c-k{--c:#8EC3F0;--t:rgba(142,195,240,.13)}:root[data-theme="dark"] .tb .c-n{--c:#EBA0D6;--t:rgba(235,160,214,.12)}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tb .c-i{--c:#ADA4FF;--t:rgba(173,164,255,.13)}:root:not([data-theme="light"]) .tb .c-f,:root:not([data-theme="light"]) .tb .c-z{--c:#6FD8BC;--t:rgba(111,216,188,.12)}:root:not([data-theme="light"]) .tb .c-h{--c:#F2A27A;--t:rgba(242,162,122,.13)}:root:not([data-theme="light"]) .tb .c-m{--c:#E8C07A;--t:rgba(232,192,122,.13)}:root:not([data-theme="light"]) .tb .c-a{--c:#F49AB6;--t:rgba(244,154,182,.12)}}' +
    ':root[data-theme="dark"] .tb .c-i{--c:#ADA4FF;--t:rgba(173,164,255,.13)}:root[data-theme="dark"] .tb .c-f,:root[data-theme="dark"] .tb .c-z{--c:#6FD8BC;--t:rgba(111,216,188,.12)}:root[data-theme="dark"] .tb .c-h{--c:#F2A27A;--t:rgba(242,162,122,.13)}:root[data-theme="dark"] .tb .c-m{--c:#E8C07A;--t:rgba(232,192,122,.13)}:root[data-theme="dark"] .tb .c-a{--c:#F49AB6;--t:rgba(244,154,182,.12)}' +
    '.tb{padding-bottom:6px}.tb-tp{display:flex;align-items:center;gap:8px;margin:2px 0 4px;font-size:13px;color:var(--mu)}' +
    '.tb-tp span{background:var(--cd);border:1px solid var(--bd);border-radius:9px;padding:2px 9px}' +
    '.tb-nm{font-size:23px;font-weight:700;line-height:1.25;margin:0 0 14px}' +
    '.tb-bs{text-align:center;font-size:25px;line-height:1.7;margin:0 0 8px}' +
    '.tb-vd{display:flex;gap:14px;align-items:center;border:1.5px solid var(--bd);border-radius:18px;padding:10px 12px 10px 10px;background:var(--cd);margin:0 0 20px;box-shadow:inset 0 -3px 0 var(--bd)}' +
    '.tb-vd .tb-th{width:54px;height:88px;border-radius:10px;background:#0F5E3E;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;opacity:.5}' +
    '.tb-vd .tb-th svg{width:24px;height:24px}.tb-vd b{display:block;font-size:16px}.tb-vd small{display:block;font-size:13.5px;color:var(--mu);margin-top:2px}' +
    '.tb-yt{position:relative;width:min(100%,300px);aspect-ratio:9/16;margin:0 auto 20px;border-radius:18px;overflow:hidden;background:#000}.tb-yt iframe{position:absolute;inset:0;width:100%;height:100%;border:0}' +
    '.tb-p{margin:0 0 12px;font-size:16.5px;line-height:1.65}.tb-p .ar{font-size:1.3em;line-height:1}' +
    '.tb-h{display:flex;align-items:center;gap:10px;margin:24px 0 8px;font-size:19px;line-height:1.3;color:var(--c)}' +
    '.tb-h i{font-style:normal;flex-shrink:0;width:30px;height:30px;border-radius:9px;background:var(--t);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700}' +
    '.tb-h small{font-size:13.5px;font-weight:400;color:var(--mu)}' +
    '.tb-ms{direction:rtl;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 12px}' +
    '.tb-ms>div{direction:ltr;border-radius:13px;background:var(--t,var(--cd));border:1px solid var(--bd);padding:4px 11px 8px;display:flex;flex-direction:column;min-width:0}' +
    '.tb-ms .ar{font-size:25px;line-height:1.7;text-align:right}.tb-ms span:last-child{font-size:13.5px;line-height:1.35;color:var(--mu)}' +
    '.tb-ms.k{grid-template-columns:minmax(0,1fr)}.tb-ms.k>div{flex-direction:row-reverse;align-items:center;gap:12px;justify-content:space-between;padding:4px 12px}.tb-ms.k .ar{flex-shrink:0}' +
    '.tb-ms.k span:last-child{text-align:left}' +
    '.tb-dr{margin:6px 0 16px;text-align:center}.tb-dr .rt{display:inline-block;padding:5px 18px;border-radius:12px;background:var(--cd);border:1.5px solid var(--bd);font-weight:700;font-size:16px}' +
    '.tb-dr svg{display:block;width:100%;height:24px}.tb-dr path{stroke:var(--mu);stroke-width:1.4;fill:none;opacity:.7}' +
    '.tb-dr .tb-chs{direction:rtl;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}' +
    '.tb-dr .tb-chs span{direction:ltr;display:block;padding:7px 4px;border-radius:12px;background:var(--t);color:var(--c);font-weight:700;font-size:15.5px}' +
    '.tb-dr .tb-chs small{display:block;font-weight:400;font-size:12px;opacity:.85}' +
    '.tb-zn{border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);padding:6px 12px;margin:0 0 12px}' +
    '.tb-zn .r{display:flex;align-items:center;gap:10px;padding:5px 0;border-top:1px solid var(--bd)}.tb-zn .r:first-child{border-top:0}' +
    '.tb-zn b{flex-shrink:0;width:24px;height:24px;border-radius:8px;background:var(--ac);color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center}' +
    '.tb-zn .tb-ww{flex:1;min-width:0;display:flex;flex-direction:column}.tb-zn .tb-ww .ar{font-size:24px;line-height:1.5}.tb-zn .tb-ww small{font-size:12.5px;color:var(--mu);line-height:1.2}' +
    '.tb-lt{display:flex;flex-direction:row-reverse;gap:3px;flex-shrink:0}' +
    '.tb-lt i{font-style:normal;width:20px;height:24px;border-radius:6px;background:color-mix(in srgb,var(--ac) 13%,transparent);color:var(--ac);display:flex;align-items:center;justify-content:center;font-size:16px;font-family:"DarsNaskh","Noto Naskh Arabic",serif}' +
    '.tb-lt i.hl{background:var(--ac);color:#fff}' +
    '.tb-ts{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin:0 0 6px;font-size:14px;color:var(--mu)}.tb-ts .ar{font-size:24px;color:var(--tx)}' +
    '.tb-jd{width:100%;border-collapse:separate;border-spacing:0;border:1.5px solid var(--bd);border-radius:14px;overflow:hidden;margin:4px 0 14px;font-size:14px;table-layout:fixed}' +
    '.tb-jd th,.tb-jd td{padding:8px 6px;text-align:center;border-top:1px solid var(--bd)}.tb-jd tr:first-child th{border-top:0;font-weight:600;color:var(--mu);font-size:12.5px;line-height:1.25}' +
    '.tb-jd th:first-child{text-align:left;padding-left:12px;width:26%}.tb-jd td.y{color:var(--ac);font-weight:700}.tb-jd td.n{color:var(--mu);opacity:.7}' +
    '.tb-jd tr[class] th{color:var(--c);background:var(--t)}' +
    '.tb-vq{direction:rtl;position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:4px 0 16px;padding-top:16px}' +
    '.tb-vq:before{content:"";position:absolute;left:8%;right:8%;top:7px;height:2px;background:var(--bd)}' +
    '.tb-vq>div{direction:ltr;position:relative;text-align:center;border-radius:14px;background:var(--t);padding:16px 4px 9px;color:var(--c)}' +
    '.tb-vq>div:before{content:"";position:absolute;top:-14px;left:50%;margin-left:-6px;width:12px;height:12px;border-radius:50%;background:var(--c);border:2px solid var(--bg)}' +
    '.tb-vq small{display:block;font-size:12px;opacity:.85}.tb-vq b{display:block;font-size:14.5px}.tb-vq .ar{display:block;font-size:26px;line-height:1.6;color:var(--tx)}' +
    '.tb-vq i{display:block;font-style:normal;font-size:13px;color:var(--mu)}.tb-vq .c-a .ar:after{content:"!";font-family:system-ui;font-size:.7em;color:var(--c);margin-right:2px}' +
    '.tb-mz{direction:rtl;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 12px}' +
    '.tb-mz>div{direction:ltr;display:flex;align-items:center;gap:10px;border-radius:14px;border:1px solid var(--bd);background:var(--cd);padding:6px 10px}' +
    '.tb-mz .lt{flex-shrink:0;width:40px;height:40px;border-radius:11px;background:var(--t);color:var(--c);display:flex;align-items:center;justify-content:center;font-size:24px}' +
    '.tb-mz .tb-ww{display:flex;flex-direction:column;min-width:0}.tb-mz .tb-ww .ar{font-size:23px;line-height:1.5}.tb-mz em,.tb-ay em{font-style:normal;color:var(--c)}.tb-mz small{font-size:13px;color:var(--mu)}' +
    '.tb-ay{direction:rtl;display:flex;align-items:center;justify-content:center;gap:14px;border-radius:16px;background:var(--t);padding:8px 12px 4px;margin:0 0 4px}' +
    '.tb-ay .ar{font-size:30px;line-height:1.6}.tb-ay svg{width:26px;height:26px;color:var(--c);transform:scaleX(-1)}' +
    '.tb-ay .yn{animation:tbK 1.4s ease-out .3s both}@keyframes tbK{0%{opacity:0;transform:translateX(-12px)}100%{opacity:1;transform:none}}' +
    '.tb-ac{text-align:center;font-size:13px;color:var(--mu);margin:0 0 14px}' +
    '.tb-s{display:flex;align-items:baseline;gap:10px;margin:30px 0 10px;font-size:20px;font-weight:700}.tb-s small{font-size:13px;font-weight:400;color:var(--mu)}' +
    '.tb-mq{list-style:none;margin:0;padding:0;counter-reset:mq}' +
    '.tb-mq>li{counter-increment:mq;border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);padding:11px 13px 12px;margin:0 0 10px;box-shadow:inset 0 -3px 0 var(--bd)}' +
    '.tb-mq>li>p{margin:0;font-size:16px;line-height:1.5}.tb-mq>li>p:first-child:before{content:counter(mq) ". ";font-weight:700;color:var(--ac)}' +
    '.tb .tb-bt{font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif;border:1.5px solid var(--bd);background:var(--bg);color:var(--tx);border-radius:11px;padding:7px 13px;margin-top:9px;cursor:pointer}' +
    '.tb .tb-bt:active{transform:scale(.98)}.tb-jv{margin-top:9px;padding:9px 12px;border-radius:12px;background:color-mix(in srgb,var(--ac) 9%,transparent);font-size:15px;line-height:1.6}.tb-jv .ar{font-size:1.3em}' +
    '.tb-wl{display:flex;flex-wrap:wrap;direction:rtl;gap:7px;margin:10px 0 2px}' +
    '.tb-w{font:inherit;font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:22px;line-height:1.5;padding:1px 12px;border-radius:11px;border:1.5px solid var(--bd);background:var(--bg);color:var(--tx);cursor:pointer}' +
    '.tb-w.sel{border-color:var(--ac);box-shadow:0 0 0 2px color-mix(in srgb,var(--ac) 30%,transparent)}.tb-w.ok{background:var(--t);border-color:var(--c);color:var(--c);cursor:default}' +
    '.tb-w.no{animation:tbX .35s}@keyframes tbX{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}' +
    '.tb-gb{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:10px}.tb-gb .tb-bt{margin:0;color:var(--c);border-color:var(--c);background:var(--t)}' +
    '.tb-xb{min-height:20px;margin:7px 0 0;font-size:14px;color:var(--mu)}.tb-xb.ok{color:var(--ac)}.tb-xb.no{color:#C2412D}' +
    '.tb-sw{text-align:center;margin:10px 0 4px}.tb-sw .ar{font-size:36px;line-height:1.6}.tb-sw small{display:block;font-size:13px;color:var(--mu)}' +
    '.tb-nb{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.tb-nb .tb-bt{margin:0;padding:8px 0}.tb-nb .tb-bt.ok{background:var(--ac);border-color:var(--ac);color:#fff}.tb-nb .tb-bt.no{border-color:#C2412D;color:#C2412D}' +
    '.tb-sr{display:flex;justify-content:center;margin-top:9px}' +
    '.tb-dt{border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);margin:12px 0 0;overflow:hidden}' +
    '.tb-dt summary{list-style:none;display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer}.tb-dt summary::-webkit-details-marker{display:none}' +
    '.tb-dt summary .ic{flex-shrink:0;width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--ac) 13%,transparent);color:var(--ac)}' +
    '.tb-dt.yd summary .ic{background:rgba(176,51,90,.12);color:#B0335A}.tb-dt summary .ic svg{width:20px;height:20px}' +
    '.tb-dt summary b{display:block;font-size:16.5px}.tb-dt summary small{display:block;font-size:13px;color:var(--mu)}.tb-dt summary .tb-tt{flex:1}' +
    '.tb-dt summary .cv{width:20px;height:20px;color:var(--mu);transition:transform .2s}.tb-dt[open] summary .cv{transform:rotate(180deg)}' +
    '.tb-qi{border-top:1px solid var(--bd);padding:11px 14px 12px}.tb-qi h4{margin:0 0 4px;font-size:15.5px}.tb-qi p{margin:0 0 6px;font-size:15px;line-height:1.65}.tb-qi p:last-child{margin:0}.tb-qi .ar{font-size:1.3em;line-height:1}' +
    '.tb .ar{white-space:nowrap}.tb-jv p{margin:0 0 6px}.tb-jv p:last-child{margin:0}' +
    '.tb-rw{border:1px solid var(--bd);border-radius:12px;overflow:hidden;margin:6px 0 8px;background:var(--bg)}' +
    '.tb-r{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0 12px;padding:4px 12px;border-top:1px solid var(--bd)}.tb-r:first-child{border-top:0}' +
    '.tb-l{flex:1 1 130px;font-size:14px;line-height:1.4;color:var(--mu);padding:3px 0}.tb .tb-l .ar{font-size:1.2em}' +
    '.tb-ar{display:inline-flex;direction:rtl;align-items:center;flex-wrap:wrap;gap:0 7px;margin-left:auto}.tb .tb-ar .ar{font-size:22px;line-height:1.7}.tb-ar i{font-style:normal;color:var(--mu);font-size:15px}' +
    '.tb-cp{display:flex;justify-content:center;margin:2px 0 8px}.tb .tb-cp .ar{font-size:25px}.tb-cp .tb-ar{margin:0 auto}' +
    '.tb-nv{display:flex;justify-content:space-between;gap:10px;margin:24px 0 4px}.tb-nv a,.tb-nv span{flex:1;padding:12px 14px;border-radius:14px;border:1.5px solid var(--bd);background:var(--cd);color:var(--tx);text-decoration:none;font-weight:600;font-size:15px}' +
    '.tb-ms em,.tb-qd em,.tb-r em,.tb-cp em{font-style:normal;color:var(--c)}.tb-dr .tb-chs.n2{grid-template-columns:repeat(2,minmax(0,1fr))}' +
    '.tb-qd{border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);padding:4px 12px;margin:0 0 12px}' +
    '.tb-qd .r{display:flex;align-items:center;gap:10px;padding:4px 0;border-top:1px solid var(--bd)}.tb-qd .r:first-child{border-top:0}' +
    '.tb-qd b{flex-shrink:0;min-width:26px;height:24px;padding:0 4px;border-radius:8px;background:var(--c);color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center}' +
    '.tb-qd .tx{flex:1;min-width:0;font-size:14.5px;line-height:1.35}.tb .tb-qd .ar{flex-shrink:0;font-size:27px;line-height:1.6}' +
    '.tb-wl.tn{justify-content:center;gap:9px}.tb-wl.tn .tb-w{font-size:25px;padding:2px 14px}' +
    '.tb-nv span{visibility:hidden}.tb-nv a:last-child{text-align:right}.tb-nv small{display:block;font-weight:400;font-size:12.5px;color:var(--mu)}';

  function A(s) {
    return String(s).replace(/⟨([^⟩]+)⟩/g, '<span class="ar" lang="ar">$1</span>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>');
  }
  function ar(s) { return '<span class="ar" lang="ar">' + s + '</span>'; }
  var CV = '<svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
  var STR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var IQ = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var IY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 18l5-6 4 4 7-9"/><path d="M15 7h5v5"/></svg>';

  /* bloklar: [tur, ...] */
  var BL = {
    p: function (x) { return '<p class="tb-p">' + A(x[1]) + '</p>'; },
    h: function (x) { return '<h3 class="tb-h c-' + x[1] + '"><i>' + x[2] + '</i><span>' + A(x[3]) + (x[4] ? ' <small>' + A(x[4]) + '</small>' : '') + '</span></h3>'; },
    /* misollar: [ar, uz]; x[2] — rang, x[3] — 'k' (keng, bitta ustun) */
    mis: function (x) {
      return '<div class="tb-ms' + (x[3] ? ' ' + x[3] : '') + (x[2] ? ' c-' + x[2] : '') + '">' + x[1].map(function (m) { return '<div>' + ar(m[0]) + '<span>' + A(m[1]) + '</span></div>'; }).join('') + '</div>';
    },
    /* daraxt: ildiz va uch shox [rang, nom, izoh] */
    dar: function (x) {
      var d2 = x[2].length === 2;
      return '<div class="tb-dr"><span class="rt">' + x[1] + '</span><svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path d="' +
        (d2 ? 'M150 0V10M75 10H225M75 10V24M225 10V24' : 'M150 0V10M50 10H250M50 10V24M150 10V24M250 10V24') + '"/></svg>' +
        '<div class="tb-chs' + (d2 ? ' n2' : '') + '">' + x[2].map(function (c) { return '<span class="c-' + c[0] + '">' + c[1] + (c[2] ? '<small>' + c[2] + '</small>' : '') + '</span>'; }).join('') + '</div></div>';
    },
    /* zinapoya: [so'z, ma'no, harflar] — 1 dan 7 harfgacha */
    zina: function (x) {
      return '<div class="tb-zn">' + x[1].map(function (z) {
        var h = z[2].split(' ');
        return '<div class="r"><b>' + h.length + '</b><span class="tb-ww">' + ar(z[0]) + '<small>' + z[1] + '</small></span><span class="tb-lt">' + h.map(function (l) { return '<i>' + l + '</i>'; }).join('') + '</span></div>';
      }).join('') + '</div>';
    },
    /* tashdid: so'z = harflar (ajratilganlari — hl) */
    tsh: function (x) {
      return '<div class="tb-ts">' + ar(x[1]) + '<span>=</span><span class="tb-lt">' + x[2].split(' ').map(function (l, i) { return '<i' + (x[3].indexOf(i) >= 0 ? ' class="hl"' : '') + '>' + l + '</i>'; }).join('') + '</span><span>' + A(x[4]) + '</span></div>';
    },
    /* jadval: [sarlavhalar], qatorlar [rang, nom, katak...] ('+' — ha, '-' — yo'q) */
    jad: function (x) {
      return '<table class="tb-jd"><tr><th></th>' + x[1].map(function (s) { return '<th>' + s + '</th>'; }).join('') + '</tr>' + x[2].map(function (r) {
        return '<tr class="c-' + r[0] + '"><th>' + r[1] + '</th>' + r.slice(2).map(function (k) { return k === '+' ? '<td class="y">✓</td>' : k === '-' ? '<td class="n">✗</td>' : '<td>' + k + '</td>'; }).join('') + '</tr>';
      }).join('') + '</table>';
    },
    /* vaqt chizig'i: [rang, zamon, nom, so'z, ma'no] */
    vaqt: function (x) {
      return '<div class="tb-vq">' + x[1].map(function (v) { return '<div class="c-' + v[0] + '"><small>' + v[1] + '</small><b>' + v[2] + '</b>' + ar(v[3]) + '<i>' + v[4] + '</i></div>'; }).join('') + '</div>';
    },
    /* muzoraat harflari: [harf, harfdan keyingi qism, ma'no] */
    mzh: function (x) {
      return '<div class="tb-mz c-z">' + x[1].map(function (m) { return '<div><span class="lt ar">' + m[0] + '</span><span class="tb-ww"><span class="ar" lang="ar"><em>' + m[0] + '</em>' + m[1] + '</span><small>' + m[2] + '</small></span></div>'; }).join('') + '</div>';
    },
    /* aylanish: mozi → muzori (qo'shilgan harf em) */
    ayl: function (x) {
      return '<div class="tb-ay c-' + (x[5] || 'z') + '">' + ar(x[1]) + STR + '<span class="ar yn" lang="ar">' + (x[6] === 'o' ? x[3] + '<em>' + x[2] + '</em>' : '<em>' + x[2] + '</em>' + x[3]) + '</span></div><p class="tb-ac">' + A(x[4]) + '</p>';
    },
    /* bosqichlar: [belgi, izoh, arabcha (<em> — qo'shilgan qism), rang] — 4-dars, muannas yasash */
    qd: function (x) {
      return '<div class="tb-qd">' + x[1].map(function (r) { return '<div class="r c-' + (r[3] || 'n') + '"><b>' + r[0] + '</b><span class="tx">' + A(r[1]) + '</span>' + ar(r[2]) + '</div>'; }).join('') + '</div>';
    }
  };

  /* qismlar: matn | '⟨a · b → c⟩' — arabcha chiplar alohida qatorda | ['r', izoh, 'a · b → c'] — qator-jadval (izoh chapda, arabcha o'ngda).
     Arabcha gap ichida bo'linib ketmasligi uchun misollar shu yo'l bilan beriladi (21.11.2026, foydalanuvchi). */
  function chip(s) {
    return '<span class="tb-ar">' + s.split(' · ').map(function (g) { return g.split(' → ').map(ar).join('<i>←</i>'); }).join('<i>·</i>') + '</span>';
  }
  function qism(a) {
    var h = '', r = '';
    a.forEach(function (p) {
      if (Array.isArray(p)) { r += '<div class="tb-r"><span class="tb-l">' + A(p[1]) + '</span>' + chip(p[2]) + '</div>'; return; }
      if (r) { h += '<div class="tb-rw">' + r + '</div>'; r = ''; }
      h += /^⟨[^⟩]+⟩$/.test(p) ? '<div class="tb-cp">' + chip(p.slice(1, -1)) + '</div>' : '<p>' + A(p) + '</p>';
    });
    return h + (r ? '<div class="tb-rw">' + r + '</div>' : '');
  }

  /* Машқ: {s: savol, j: javob} | {s, aj: [guruhlar [rang, nom]], w: [[so'z, guruh, xato bo'lsa maslahat]]} | {s, sn: [[so'z, harflar]]}
     | {s, tn: [[so'z, izoh, [variantlar], to'g'ri, [har variant uchun maslahat]]], c: rang} — bittadan tanlash (4-dars) */
  function mashq(d) {
    return '<ol class="tb-mq">' + d.m.map(function (q, k) {
      var h = '<li data-k="' + k + '"><p>' + A(q.s) + '</p>';
      if (q.j) h += '<button class="tb-bt tb-jb" type="button">Жавобни кўриш</button><div class="tb-jv" hidden>' + (Array.isArray(q.j) ? qism(q.j) : A(q.j)) + '</div>';
      else if (q.aj) h += '<div class="tb-wl">' + q.w.map(function (w, i) { return '<button class="tb-w" type="button" data-i="' + i + '">' + w[0] + '</button>'; }).join('') + '</div>' +
        '<div class="tb-gb"' + (q.aj.length !== 3 ? ' style="grid-template-columns:repeat(' + q.aj.length + ',minmax(0,1fr))"' : '') + '>' + q.aj.map(function (g, i) { return '<button class="tb-bt c-' + g[0] + '" type="button" data-g="' + i + '">' + g[1] + '</button>'; }).join('') + '</div>' +
        '<p class="tb-xb">Сўзни босинг, кейин туркумини танланг · <span class="sc">0 / ' + q.w.length + '</span></p>';
      else if (q.sn) h += '<div class="tb-sn"></div>';
      else if (q.tn) h += '<div class="tb-sn c-' + (q.c || 'n') + '"></div>';
      return h + '</li>';
    }).join('') + '</ol>';
  }
  function snChiz(li, q) {
    var s = li._s || (li._s = { i: 0, b: 0, j: false }), box = li.querySelector('.tb-sn');
    if (s.i >= q.sn.length) {
      box.innerHTML = '<div class="tb-sw"><b style="font-size:20px">' + s.b + ' / ' + q.sn.length + '</b><small>тўғри топилди</small></div><div class="tb-sr"><button class="tb-bt tb-qy" type="button">Қайтадан</button></div>';
      return;
    }
    var w = q.sn[s.i], h = w[1].split(' '), n = '';
    for (var k = 1; k <= 7; k++) n += '<button class="tb-bt' + (s.j ? (k === h.length ? ' ok' : k === s.t ? ' no' : '') : '') + '" type="button" data-n="' + k + '">' + k + '</button>';
    box.innerHTML = '<div class="tb-sw">' + ar(w[0]) + '<small>' + (s.i + 1) + ' / ' + q.sn.length + ' · нечта ҳарф?</small></div><div class="tb-nb">' + n + '</div>' +
      (s.j ? '<div class="tb-ts" style="margin-top:10px"><span class="tb-lt">' + h.map(function (l) { return '<i>' + l + '</i>'; }).join('') + '</span><span>' + h.length + ' ҳарф</span></div>' +
        '<div class="tb-sr"><button class="tb-bt tb-kb" type="button">' + (s.i + 1 < q.sn.length ? 'Кейингиси ›' : 'Натижа') + '</button></div>' : '');
  }
  function tnChiz(li, q) {
    var s = li._s || (li._s = { i: 0, b: 0, t: -1 }), box = li.querySelector('.tb-sn');
    if (s.i >= q.tn.length) {
      box.innerHTML = '<div class="tb-sw"><b style="font-size:20px">' + s.b + ' / ' + q.tn.length + '</b><small>тўғри топилди</small></div><div class="tb-sr"><button class="tb-bt tb-qy" type="button">Қайтадан</button></div>';
      return;
    }
    var w = q.tn[s.i], j = s.t >= 0;
    box.innerHTML = '<div class="tb-sw">' + ar(w[0]) + '<small>' + (s.i + 1) + ' / ' + q.tn.length + ' · ' + A(w[1]) + '</small></div>' +
      '<div class="tb-wl tn">' + w[2].map(function (v, k) { return '<button class="tb-w' + (j ? (k === w[3] ? ' ok' : k === s.t ? ' no' : '') : '') + '" type="button" data-v="' + k + '">' + v + '</button>'; }).join('') + '</div>' +
      (j ? '<p class="tb-xb ' + (s.t === w[3] ? 'ok">Тўғри!' : 'no">' + A(w[4][s.t] || 'Яна ўйлаб кўринг')) + '</p>' +
        '<div class="tb-sr"><button class="tb-bt tb-kb" type="button">' + (s.i + 1 < q.tn.length ? 'Кейингиси ›' : 'Натижа') + '</button></div>' : '');
  }
  /* tinglovchi el ga bir marta ulanadi; joriy dars — el._tbD (dars almashsa eski tinglovchi qolmaydi) */
  function bogla(el, d) {
    el._tbD = d;
    [].forEach.call(el.querySelectorAll('.tb-mq>li'), function (li) { var q = d.m[+li.getAttribute('data-k')]; if (q.sn) snChiz(li, q); else if (q.tn) tnChiz(li, q); });
    if (el._tbB) return; el._tbB = 1;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var li = b.closest('.tb-mq>li'), d = el._tbD; if (!li || !d) return;
      var q = d.m[+li.getAttribute('data-k')], xb = li.querySelector('.tb-xb'); if (!q) return;
      if (b.classList.contains('tb-jb')) { var j = b.nextElementSibling; j.hidden = !j.hidden; b.textContent = j.hidden ? 'Жавобни кўриш' : 'Яшириш'; return; }
      if (q.aj) {
        if (b.classList.contains('tb-w')) {
          if (b.classList.contains('ok')) return;
          [].forEach.call(li.querySelectorAll('.tb-w.sel'), function (x) { x.classList.remove('sel'); });
          b.classList.add('sel'); li._w = b; xb.className = 'tb-xb'; xb.firstChild.textContent = 'Энди туркумини танланг · ';
          return;
        }
        if (b.hasAttribute('data-g')) {
          var w = li._w, g = +b.getAttribute('data-g');
          if (!w) { xb.className = 'tb-xb no'; xb.firstChild.textContent = 'Аввал сўзни босинг · '; return; }
          var t = q.w[+w.getAttribute('data-i')][1];
          w.classList.remove('sel', 'no');
          if (t === g) {
            w.classList.add('ok', 'c-' + q.aj[g][0]); li._w = null; li._b = (li._b || 0) + 1;
            var hammasi = li._b === q.w.length;
            xb.className = 'tb-xb ok'; xb.firstChild.textContent = hammasi ? 'Ҳаммаси тўғри! · ' : 'Тўғри — ' + q.aj[g][1].toLowerCase() + ' · ';
          } else { void w.offsetWidth; w.classList.add('no'); xb.className = 'tb-xb no'; xb.firstChild.textContent = (q.w[+w.getAttribute('data-i')][2] || 'Яна ўйлаб кўринг') + ' · '; }
          xb.querySelector('.sc').textContent = (li._b || 0) + ' / ' + q.w.length;
        }
        return;
      }
      if (q.tn) {
        var u = li._s;
        if (b.hasAttribute('data-v') && u.t < 0) { u.t = +b.getAttribute('data-v'); if (u.t === q.tn[u.i][3]) u.b++; }
        else if (b.classList.contains('tb-kb')) { u.i++; u.t = -1; }
        else if (b.classList.contains('tb-qy')) li._s = { i: 0, b: 0, t: -1 };
        else return;
        tnChiz(li, q); return;
      }
      if (q.sn) {
        var s = li._s;
        if (b.hasAttribute('data-n') && !s.j) { s.j = true; s.t = +b.getAttribute('data-n'); if (s.t === q.sn[s.i][1].split(' ').length) s.b++; }
        else if (b.classList.contains('tb-kb')) { s.i++; s.j = false; }
        else if (b.classList.contains('tb-qy')) li._s = { i: 0, b: 0, j: false };
        else return;
        snChiz(li, q);
      }
    });
  }
  function bolim(d, k, cls, ic, nom, iz) {
    if (!d[k] || !d[k].length) return '';
    return '<details class="tb-dt ' + cls + '"><summary><span class="ic">' + ic + '</span><span class="tb-tt"><b>' + nom + '</b><small>' + iz + '</small></span>' + CV + '</summary>' +
      d[k].map(function (q) { return '<div class="tb-qi"><h4>' + A(q[0]) + '</h4>' + qism(q.slice(1)) + '</div>'; }).join('') + '</details>';
  }

  /* o: {bob: '1-боб · Калима', nom, v: {yt, t}, old: [n, nom], keyin: [n, nom]} */
  T.chiz = function (n, el, o) {
    var d = T.D[n]; if (!d) return false;
    if (!document.getElementById('tb-css')) { var st = document.createElement('style'); st.id = 'tb-css'; st.textContent = CSS; document.head.appendChild(st); }
    var v = o.v, h = '<div class="tb">';
    if (d.bs) h += '<div class="tb-bs ar" lang="ar">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div>';
    h += '<div class="tb-tp"><span>Татбиқ</span>' + (o.bob || '') + '</div><h2 class="tb-nm">' + n + '-дарс · ' + A(o.nom) + '</h2>';
    h += v && v.yt ? '<div class="tb-yt"><iframe src="https://www.youtube-nocookie.com/embed/' + v.yt + '?playsinline=1&rel=0" title="Видео дарс" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>'
      : '<div class="tb-vd"><span class="tb-th">' + PLAY + '</span><span><b>Видео дарс</b><small>Тез орада</small></span></div>';
    h += d.b.map(function (x) { return BL[x[0]](x); }).join('');
    h += '<div class="tb-s">Машқ</div>' + mashq(d);
    h += bolim(d, 'q', 'qd', IQ, 'Қўшимча', 'Мавзуга оид, китобда йўқ') + bolim(d, 'y', 'yd', IY, 'Юқори даража', 'Бундай нарсалар ҳам бор');
    h += '<div class="tb-nv">' + (o.old ? '<a href="#d' + o.old[0] + '">‹ ' + o.old[0] + '-дарс<small>' + A(o.old[1]) + '</small></a>' : '<span></span>') +
      (o.keyin ? '<a href="#d' + o.keyin[0] + '">' + o.keyin[0] + '-дарс ›<small>' + A(o.keyin[1]) + '</small></a>' : '<span></span>') + '</div></div>';
    el.innerHTML = h;
    bogla(el, d);
    return true;
  };

  /* ===================== 1-дарс · Калималарнинг тузилиши ===================== */
  T.D[1] = {
    bs: 1,
    b: [
      ['p', 'Сўз араб тилида **калима** дейилади. Калималар алифбо ҳарфларидан таркиб топган бўлиб, 1 ҳарфлидан 7 ҳарфлигача бўлиши мумкин. Фатҳа, касра ва замма ҳаракат бўлгани учун алифбо ҳарфи ҳисобланмайди. Ташдид остида 2 та ҳарф бўлишини унутманг. Калималарга мисоллар:'],
      ['zina', [['بِ', '...билан', 'ب'], ['فِي', '...да', 'ف ي'], ['قَلَمٌ', 'қалам', 'ق ل م'], ['دَفْتَرٌ', 'дафтар', 'د ف ت ر'],
        ['سَفَرْجَلٌ', 'беҳи', 'س ف ر ج ل'], ['اِجْتِهَادٌ', 'тиришиш', 'ا ج ت ه ا د'], ['اِسْتِغْفَارٌ', 'кечирим сўраш', 'ا س ت غ ف ا ر']]],
      ['tsh', 'مُحَمَّدٌ', 'م ح م م د', [2, 3], 'ташдид — 2 ҳарф'],
      ['p', 'Калималар таркиб топишда 7 сонлидан ошмайди.']
    ],
    m: [
      { s: 'Калима деб нимага айтилади?', j: 'Сўз араб тилида **калима** дейилади.' },
      { s: 'Калималар нимадан таркиб топади ва неча ҳарфлигача бўлади? Уларнинг ҳар бирига битта мисол келтиринг ва ўша сўзнинг маъносини ҳам айтиб кетинг.',
        j: ['Калималар алифбо ҳарфларидан таркиб топади, 1 ҳарфлидан 7 ҳарфлигача бўлади. Мисоллар:',
          ['r', '1 ҳарф — ...билан', 'بِ'], ['r', '2 ҳарф — ...да', 'فِي'], ['r', '3 ҳарф — қалам', 'قَلَمٌ'], ['r', '4 ҳарф — дафтар', 'دَفْتَرٌ'],
          ['r', '5 ҳарф — беҳи', 'سَفَرْجَلٌ'], ['r', '6 ҳарф — тиришиш', 'اِجْتِهَادٌ'], ['r', '7 ҳарф — кечирим сўраш', 'اِسْتِغْفَارٌ']] },
      { s: 'Фатҳа, касра ва замма калимадаги ҳарф сонига кирадими?', j: 'Йўқ. Фатҳа, касра ва замма ҳаракат бўлгани учун алифбо ҳарфи ҳисобланмайди.' },
      { s: 'Қуйидаги сўзларни нечта ҳарфли эканини айтиб беринг:',
        sn: [['بِ', 'ب'], ['قَلَمٌ', 'ق ل م'], ['فِي', 'ف ي'], ['سَفَرْجَلٌ', 'س ف ر ج ل'], ['دَفْتَرٌ', 'د ف ت ر'], ['اِسْتِغْفَارٌ', 'ا س ت غ ف ا ر'], ['اِجْتِهَادٌ', 'ا ج ت ه ا د'],
          ['وَ', 'و'], ['لَا', 'ل ا'], ['إِلَى', 'إ ل ى'], ['كِتَابٌ', 'ك ت ا ب'], ['مُسَافِرٌ', 'م س ا ف ر'], ['اِقْشَعَرَّ', 'ا ق ش ع ر ر'], ['اِسْتِخْبَارٌ', 'ا س ت خ ب ا ر']] }
    ],
    q: [
      ['Ҳарфларни санаганда',
        ['r', 'Танвин ҳарф эмас — ёзилмайдиган «н» товуши: 3 ҳарф', 'قَلَمٌ'],
        ['r', 'Бирга ёзилган, лекин 2 ҳарф: ⟨ل⟩ ва ⟨ا⟩', 'لَا'],
        ['r', 'Сўз бошидаги алиф ҳам ҳарф', 'اِجْتِهَادٌ']],
      ['Нега 7 дан ошмайди?', 'Исмнинг асл (ўзак) ҳарфлари 3, 4 ёки 5 та бўлади, қўшимча ҳарфлар билан энг кўпи 7 тага етади. Феълнинг асл ҳарфлари 3 ёки 4 та, қўшимча ҳарфлар билан энг кўпи 6 та.',
        ['r', 'Исм — 3 асл ҳарф', 'قَلَمٌ'], ['r', 'Исм — 4 асл ҳарф', 'دِرْهَمٌ'], ['r', 'Исм — 5 асл ҳарф', 'سَفَرْجَلٌ'],
        ['r', 'Исм — қўшимча билан 7', 'اِسْتِغْفَارٌ'], ['r', 'Феъл — қўшимча билан 6', 'اِسْتَغْفَرَ · اِقْشَعَرَّ']]
    ],
    y: [
      ['Асл ва зоида ҳарфлар', 'Сарфда сўзнинг асл ҳарфлари ⟨فَعَلَ⟩ ўлчови билан белгиланади, қолганлари зоида (қўшимча) ҳарф дейилади. Зоида ҳарфлар ўнта, улар бир сўзда жамланган:', '⟨سَأَلْتُمُونِيهَا⟩'],
      ['Икки ҳарфли исмлар', 'Баъзи исмлар икки ҳарфли кўринади. Уларнинг ўзагидан бир ҳарф тушиб қолган, асли уч ҳарфли:',
        ['r', 'қўл', 'يَدٌ'], ['r', 'қон', 'دَمٌ']]
    ]
  };

  /* ===================== 2-дарс · Сўз туркумлари ===================== */
  T.D[2] = {
    b: [
      ['dar', 'Калима', [['i', 'Исм'], ['f', 'Феъл'], ['h', 'Ҳарф']]],
      ['p', 'Калима исм, феъл ва ҳарфга бўлинади. Яъни араб тилида сўзлар 3 туркумга бўлинади. Улар:'],
      ['h', 'i', '1', '**Исм**'],
      ['p', 'Мустақил тарзда маъно англатиб, замонни ифода этмайдиган калима **исм** дейилади. Масалан:'],
      ['mis', [['مُحَمَّدٌ', 'Муҳаммад'], ['هَذَا', 'бу'], ['مُعَلِّمٌ', 'муаллим'], ['هُوَ', 'у'], ['كَبِيرٌ', 'катта'], ['ضَارِبٌ', 'урувчи, урган'], ['سَبْعَةٌ', '7 (етти)'], ['ضَرْبٌ', 'уриш, урмоқ']], 'i'],
      ['p', 'Калима танвинли бўлса, у исм бўлади.'],
      ['h', 'f', '2', '**Феъл**'],
      ['p', 'Мустақил тарзда маъно англатиб, замонни ҳам ифода этадиган калима **феъл** дейилади. Масалан:'],
      ['mis', [['ضَرَبَ', 'урди'], ['يَضْرِبُ', 'уряпти'], ['اِضْرِبْ', 'ур']], 'f'],
      ['p', 'Феъл танвинли бўлмайди.'],
      ['h', 'h', '3', '**Ҳарф**'],
      ['p', 'Мустақил тарзда маъно англатмай, исм ёки феъл билан бирга келгандагина маъно ифода этадиган калима **ҳарф** дейилади. Масалан:'],
      ['mis', [['فِي', '...да'], ['لَا', '...маяпти'], ['فِي الْبَيْتِ', 'уйда'], ['لَا يَضْرِبُ', 'урмаяпти']], 'h'],
      ['p', 'Ҳарф танвинли бўлмайди.'],
      ['jad', ['Мустақил маъно', 'Замон', 'Танвин'], [['i', 'Исм', '+', '-', 'бўлиши мумкин'], ['f', 'Феъл', '+', '+', '-'], ['h', 'Ҳарф', '-', '-', '-']]]
    ],
    m: [
      { s: 'Араб тилида калималар неча туркумга бўлинади ва улар қайсилар?', j: '3 туркумга бўлинади: исм, феъл ва ҳарф.' },
      { s: 'Исм деб нимага айтилади? Унга 3 та мисол келтиринг.',
        j: ['Мустақил тарзда маъно англатиб, замонни ифода этмайдиган калима **исм** дейилади. Масалан:', ['r', 'Муҳаммад', 'مُحَمَّدٌ'], ['r', 'муаллим', 'مُعَلِّمٌ'], ['r', 'катта', 'كَبِيرٌ']] },
      { s: 'Феъл деб нимага айтилади? Унга 3 та мисол келтиринг.',
        j: ['Мустақил тарзда маъно англатиб, замонни ҳам ифода этадиган калима **феъл** дейилади. Масалан:', ['r', 'урди', 'ضَرَبَ'], ['r', 'уряпти', 'يَضْرِبُ'], ['r', 'ур', 'اِضْرِبْ']] },
      { s: 'Ҳарф деб нимага айтилади? Унга 2 та мисол келтиринг.',
        j: ['Мустақил тарзда маъно англатмай, исм ёки феъл билан бирга келгандагина маъно ифода этадиган калима **ҳарф** дейилади. Масалан:', ['r', '...да', 'فِي'], ['r', '...маяпти', 'لَا']] },
      { s: 'Исм, феъл ва ҳарф танвинли бўлиши мумкинми?', j: 'Исм танвинли бўлиши мумкин: калима танвинли бўлса, у исм бўлади. Феъл ва ҳарф танвинли бўлмайди.' },
      { s: 'Қуйидаги сўзларни исм, феъл ва ҳарфга ажратинг:', aj: [['i', 'Исм'], ['f', 'Феъл'], ['h', 'Ҳарф']],
        w: [['مُحَمَّدٌ', 0], ['فِي', 2], ['ضَرَبَ', 1], ['هَذَا', 0], ['مُعَلِّمٌ', 0], ['هُوَ', 0], ['يَضْرِبُ', 1], ['كَبِيرٌ', 0], ['ضَارِبٌ', 0], ['سَبْعَةٌ', 0], ['ضَرْبٌ', 0],
          ['بِ', 2], ['لَا', 2], ['قَلَمٌ', 0], ['دَفْتَرٌ', 0], ['سَفَرْجَلٌ', 0], ['اِجْتِهَادٌ', 0], ['اِسْتِغْفَارٌ', 0]] }
    ],
    q: [
      ['Исмнинг белгилари', 'Танвиндан ташқари исм яна шу белгилардан танилади:',
        ['r', 'Охири жар (касра) бўлади', 'فِي الْبَيْتِ'], ['r', 'Олдига ⟨اَلْ⟩ келади', 'اَلْمُعَلِّمُ'], ['r', 'Олдига жар ҳарфи келади', 'بِقَلَمٍ'],
        ['r', 'Танвин олади', 'مُحَمَّدٌ'], ['r', '⟨يَا⟩ билан чақирилади (нидо)', 'يَا مُحَمَّدُ'], ['r', 'Унга ҳукм берилади: «Муҳаммад — катта»', 'مُحَمَّدٌ كَبِيرٌ']],
      ['Феълнинг белгилари', 'Феълни шу белгилардан таниймиз:',
        ['r', 'Олдига ⟨قَدْ⟩ келади', 'قَدْ ضَرَبَ'], ['r', 'Олдига ⟨سَ⟩ келади', 'سَيَضْرِبُ'], ['r', 'Олдига ⟨سَوْفَ⟩ келади', 'سَوْفَ يَضْرِبُ'],
        ['r', 'Охирига сукунли муаннаслик «т»си', 'ضَرَبَتْ'], ['r', '«Сен урдинг» даги ⟨تَ⟩', 'ضَرَبْتَ'], ['r', 'Аёлга буйруқдаги ⟨ي⟩', 'اِضْرِبِي'], ['r', 'Таъкид нуни', 'اِضْرِبَنَّ']],
      ['Ҳарфнинг белгиси', 'Ҳарфнинг ўз белгиси йўқ: исм белгиларини ҳам, феъл белгиларини ҳам олмаслиги — унинг белгиси. Масалан:', '⟨هَلْ · فِي · لَمْ⟩']
    ],
    y: [
      ['Феъл маъносидаги исмлар', 'Феълнинг маъносини беради, лекин исм ҳисобланади: феъл белгиларини олмайди, баъзилари танвин ҳам олади. Номи — исмул-феъл.',
        ['r', 'узоқ бўлди', 'هَيْهَاتَ'], ['r', 'жим бўл', 'صَهْ'], ['r', 'ижобат қил', 'آمِينَ'], ['r', 'танвин билан', 'صَهٍ']],
      ['Феъллиги баҳсли сўзлар', 'Тўғрироқ қавлга кўра булар мозий феъл, чунки сукунли муаннаслик «т»сини олади. Баъзи олимлар ⟨لَيْسَ⟩ ни ҳарф деган.',
        ['r', 'эмас', 'لَيْسَ → لَيْسَتْ'], ['r', 'шояд', 'عَسَى → عَسَتْ'], ['r', 'қандай яхши', 'نِعْمَ → نِعْمَتْ'], ['r', 'қандай ёмон', 'بِئْسَ → بِئْسَتْ']]
    ]
  };

  /* ===================== 3-дарс · Феъл (1) ===================== */
  T.D[3] = {
    b: [
      ['p', 'Бирор нарсанинг иш-ҳаракатини билдирган ҳамда *нима қилди? нима қиляпти? нима қилади?* каби саволларга жавоб берган калима **феъл** деб аталади.'],
      ['dar', 'Феъл', [['m', 'Мозий'], ['z', 'Музорий'], ['a', 'Амр']]],
      ['p', 'Араб тилида феъл шаклан 3 қисмга бўлинади:'],
      ['vaqt', [['m', 'ўтган замон', 'Мозий', 'ضَرَبَ', 'урди'], ['z', 'ҳозир · келаси', 'Музорий', 'يَضْرِبُ', 'уряпти, уради'], ['a', 'талаб', 'Амр', 'اِضْرِبْ', 'ур']]],
      ['h', 'm', '1', '**Мозий**', '(ўтган замон)'],
      ['p', 'Бирор иш-ҳаракатнинг ўтган замонда содир бўлганини ифодаловчи феъл **мозий** (*ўтган замон*) **феъли** деб аталади. Унга мисол:'],
      ['mis', [['ضَرَبَ', 'урган, урган эди, урарди, урди'], ['ذَهَبَ', 'кетган, кетган эди, кетарди, кетди'], ['كَتَبَ', 'ёзган, ёзган эди, ёзарди, ёзди']], 'm', 'k'],
      ['p', 'Сўзловчи ўтган замонни англатувчи ушбу 4 хил маънонинг қай бирини ифода этмоқчи бўлса ҳам, мозий феълини ишлата олади.'],
      ['h', 'z', '2', '**Музорий**', '(ҳозирги - келаси замон)'],
      ['p', 'Бирор иш-ҳаракатнинг ҳозирги ёки келаси замонда содир бўлишини ифодаловчи феъл **музорий** (*ҳозирги - келаси замон*) **феъли** деб аталади. Унга мисол:'],
      ['mis', [['يَضْرِبُ', 'уряпти, уради'], ['يَذْهَبُ', 'кетяпти, кетади'], ['يَكْتُبُ', 'ёзяпти, ёзади']], 'z', 'k'],
      ['p', 'Музорий феъли ⟨أ⟩ ё ⟨ن⟩ ёки ⟨ي⟩ ёҳуд ⟨ت⟩ билан бошланган бўлиши лозим. Унга мисол:'],
      ['mzh', [['يَ', 'ضْرِبُ', 'уряпти'], ['تَ', 'ضْرِبُ', 'уряпсан'], ['أَ', 'ضْرِبُ', 'уряпман'], ['نَ', 'ضْرِبُ', 'уряпмиз']]],
      ['p', 'Бу ҳарфлар **музороат** (*музорийлик*) **ҳарфлари** деб аталади. Чунки мозий феълининг олдидан улардан бири қўшилиши билан у музорийга айланади. Гапда феълнинг мозий ё музорийлигини ҳам мана шу ҳарфларнинг бор ёки йўқлигидан билиб олиш мумкин.'],
      ['ayl', 'ضَرَبَ', 'يَ', 'ضْرِبُ', 'олдига музороат ҳарфи қўшилади, ҳаракатлар ҳам ўзгаради'],
      ['h', 'a', '3', '**Амр**', '(буйруқ)'],
      ['p', 'Унинг ёрдамида бирор иш-ҳаракатнинг содир бўлиши талаб қилинган феъл **амр** (*буйруқ*) **феъли** деб аталади. Унга мисол:'],
      ['mis', [['اِضْرِبْ', 'ур'], ['اِذْهَبْ', 'кет'], ['اُكْتُبْ', 'ёз(гин)']], 'a']
    ],
    m: [
      { s: 'Феъл деб нимага айтилади?', j: 'Бирор нарсанинг иш-ҳаракатини билдирган ҳамда *нима қилди? нима қиляпти? нима қилади?* каби саволларга жавоб берган калима **феъл** деб аталади.' },
      { s: 'Феъл шаклан неча қисмга бўлинади? Улар қайсилар?', j: '3 қисмга: мозий, музорий ва амр.' },
      { s: 'Мозий феъли деб нимага айтилади? Унга 3 та мисол келтиринг ва уларнинг маъноларини айтиб беринг.',
        j: ['Бирор иш-ҳаракатнинг ўтган замонда содир бўлганини ифодаловчи феъл **мозий феъли** деб аталади. Масалан:', ['r', 'урди', 'ضَرَبَ'], ['r', 'кетди', 'ذَهَبَ'], ['r', 'ёзди', 'كَتَبَ']] },
      { s: 'Музорий феъли деб нимага айтилади? Унга 3 та мисол келтиринг ва уларнинг маъноларини айтиб беринг.',
        j: ['Бирор иш-ҳаракатнинг ҳозирги ёки келаси замонда содир бўлишини ифодаловчи феъл **музорий феъли** деб аталади. Масалан:', ['r', 'уряпти, уради', 'يَضْرِبُ'], ['r', 'кетяпти, кетади', 'يَذْهَبُ'], ['r', 'ёзяпти, ёзади', 'يَكْتُبُ']] },
      { s: 'Музороат ҳарфлари қайсилар? Уларни билишнинг бизга нима фойдаси бор?',
        j: ['Музороат ҳарфлари:', '⟨أ · ن · ي · ت⟩', 'Гапда феълнинг мозий ё музорийлигини шу ҳарфларнинг бор ёки йўқлигидан билиб олиш мумкин.'] },
      { s: 'Амр феъли деб нимага айтилади? Унга 3 та мисол келтиринг ва уларнинг маъноларини айтиб беринг.',
        j: ['Унинг ёрдамида бирор иш-ҳаракатнинг содир бўлиши талаб қилинган феъл **амр феъли** деб аталади. Масалан:', ['r', 'ур', 'اِضْرِبْ'], ['r', 'кет', 'اِذْهَبْ'], ['r', 'ёз(гин)', 'اُكْتُبْ']] },
      { s: 'Қуйидаги феълларни мозий, музорий ва амрга ажратинг:', aj: [['m', 'Мозий'], ['z', 'Музорий'], ['a', 'Амр']],
        w: [['ضَرَبَ', 0], ['اِضْرِبْ', 2], ['يَضْرِبُ', 1], ['يَذْهَبُ', 1], ['اِذْهَبْ', 2], ['ذَهَبَ', 0], ['اُكْتُبْ', 2], ['يَكْتُبُ', 1], ['كَتَبَ', 0]] }
    ],
    q: [
      ['Музороат ҳарфларини эслаб қолиш', 'Тўрт ҳарф бир сўзга жамланади:', '⟨أَتَيْنَ⟩', 'Бошқа китобларда шундай жамланган:', '⟨أَنَيْتُ · نَأَيْتُ⟩'],
      ['Ҳар ҳарф кимни билдиради',
        ['r', 'мен', 'أَضْرِبُ'], ['r', 'биз', 'نَضْرِبُ'], ['r', 'у (эркак)', 'يَضْرِبُ'], ['r', 'сен', 'تَضْرِبُ'], ['r', 'у (аёл) — «т» шуни ҳам билдиради', 'هِيَ تَضْرِبُ']],
      ['Музороат ҳарфининг ҳаракати', 'Мозийси тўрт ҳарфли бўлса, музороат ҳарфи заммали бўлади; бошқаларида фатҳали.',
        ['r', 'Тўрт ҳарфли мозий — замма', 'أَكْرَمَ → يُكْرِمُ'], ['r', 'Бошқалари — фатҳа', 'يَضْرِبُ · يَسْتَغْفِرُ']],
      ['Уч феълни қандай таниймиз',
        ['r', 'Мозий — охирига сукунли муаннаслик «т»си қўшилади', 'ضَرَبَتْ'], ['r', 'Музорий — олдига ⟨لَمْ⟩ кела олади', 'لَمْ يَضْرِبْ'], ['r', 'Амр — буйруқ маъноси, аёлга айтилганда ⟨ي⟩ олади', 'اِضْرِبِي']],
      ['«Урарди» ҳақида', 'Ўтган замонда такрорланиб турган иш («урарди») кўпинча ⟨كَانَ⟩ ва музорий билан айтилади. Бу ҳақда 47-дарсда.', '⟨كَانَ يَضْرِبُ⟩']
    ],
    y: [
      ['Мозий — келаси замон маъносида',
        ['r', 'Дуода: «Аллоҳ унга раҳм қилсин»', 'رَحِمَهُ اللّٰهُ'], ['r', 'Шартда: «Аллоҳнинг ёрдами келганда»', 'إِذَا جَاءَ نَصْرُ اللّٰهِ']],
      ['Музорий — ўтган замон маъносида', '⟨لَمْ⟩ билан музорий ўтган замонни билдиради:',
        ['r', '«туғмади ва туғилмади»', 'لَمْ يَلِدْ وَلَمْ يُولَدْ'],
        '⟨سَ⟩ ёки ⟨سَوْفَ⟩ билан эса фақат келаси замонни:', ['r', '«кетади»', 'سَيَذْهَبُ']],
      ['Амрлиги баҳсли сўзлар', 'Тўғрироқ қавлга кўра булар амр феъли, чунки аёлга айтилганда ⟨ي⟩ олади:',
        ['r', 'бер', 'هَاتِ → هَاتِي'], ['r', 'кел', 'تَعَالَ → تَعَالَيْ']]
    ]
  };
  /* ===================== 4-дарс · Музаккар ва муаннас ===================== */
  /* muannas yasash mashqi: to'g'ri — fatha + ةٌ; xato — damma qolgan, ة tanvinsiz; to'g'ri javob o'rni har savolda boshqa */
  function mnT(st, uz, k) {
    var v = [[st + 'َةٌ', ''], [st + 'ُةٌ', 'Охирги ҳарфга фатҳа қўйилади'], [st + 'َةُ', 'Та марбута танвинли бўлади']];
    for (var i = 0; i < k % 3; i++) v.push(v.shift());
    var t = 0; v.forEach(function (x, i) { if (!x[1]) t = i; });
    return [st + 'ٌ', uz + ' (мз) → муаннаси?', v.map(function (x) { return x[0]; }), t, v.map(function (x) { return x[1]; })];
  }
  T.D[4] = {
    b: [
      ['dar', 'Исм', [['k', 'Музаккар'], ['n', 'Муаннас']]],
      ['p', 'Исм жинс жиҳатидан 2 турга бўлинади:'],
      ['h', 'k', '1', '**Музаккар**', '(мз)'],
      ['p', 'Эркак жинсини ифодаловчи исм **музаккар** деб аталади. Унга мисол:'],
      ['mis', [['مُحَمَّدٌ', 'Муҳаммад'], ['مُعَلِّمٌ', 'муаллим'], ['ثَوْرٌ', 'буқа']], 'k'],
      ['h', 'n', '2', '**Муаннас**', '(мн)'],
      ['p', 'Аёл жинсини ифодаловчи исм **муаннас** деб аталади. Унга мисол:'],
      ['mis', [['عَائِشَ<em>ةُ</em>', 'Ойша'], ['مُعَلِّمَ<em>ةٌ</em>', 'муаллима'], ['بَقَرَ<em>ةٌ</em>', 'сигир']], 'n'],
      ['p', '⟨ةٌ⟩ – *та марбута* муаннасликнинг энг катта аломати саналади. ⟨ة⟩ – *та марбута* икки учи туташган ⟨ت⟩ – т дегани.'],
      ['ayl', 'ت', 'ة', '', 'икки учи туташган «т»', 'n'],
      ['p', 'Жонли нарсаларни жинсга ажратишда аввало уларнинг жинсига эътибор қаратилади, муаннаслик аломатига эмас. Жонсиз нарсаларни жинсга ажратишда эса унда муаннаслик аломати бор ёки йўқлигига қаралади. Муаннаслик аломатига эга жонсиз нарсалар номи **муаннас** деб юритилади. Унга мисол:'],
      ['mis', [['مِسْطَرَ<em>ةٌ</em>', 'чизғич']], 'n'],
      ['p', 'Муаннаслик аломатига эга бўлмаган жонсиз нарсалар номи эса **музаккар** деб юритилади. Унга мисол:'],
      ['mis', [['قَلَمٌ', 'қалам'], ['كِتَابٌ', 'китоб']], 'k'],
      ['p', 'Сифатни англатувчи исмларнинг музаккари кетидан ⟨ةٌ⟩ – *та марбута* қўшилса, унинг муаннас кўриниши ҳосил бўлади. Бунда музаккарининг охиридаги танвин олиб ташланади. Сўнг охирги ҳарф устига фатҳа қўйилиб, кетидан танвинли ⟨ةٌ⟩ – *та марбута* қўшилади. Унга мисол:'],
      ['qd', [['мз', 'катта (мз)', 'كَبِيرٌ', 'k'], ['1', 'танвин олиб ташланади', 'كَبِير'], ['2', 'охирги ҳарф устига фатҳа', 'كَبِيرَ'], ['3', 'танвинли та марбута — катта (мн)', 'كَبِيرَ<em>ةٌ</em>']]]
    ],
    m: [
      { s: 'Исм жинс жиҳатидан неча қисмга бўлинади? Улар қайсилар?', j: '2 қисмга: **музаккар** ва **муаннас**.' },
      { s: 'Музаккар деб нимага айтилади? Унга 3 та мисол келтиринг.',
        j: ['Эркак жинсини ифодаловчи исм **музаккар** деб аталади. Масалан:', ['r', 'Муҳаммад', 'مُحَمَّدٌ'], ['r', 'муаллим', 'مُعَلِّمٌ'], ['r', 'буқа', 'ثَوْرٌ']] },
      { s: 'Муаннас деб нимага айтилади? Унга 3 та мисол келтиринг.',
        j: ['Аёл жинсини ифодаловчи исм **муаннас** деб аталади. Масалан:', ['r', 'Ойша', 'عَائِشَةُ'], ['r', 'муаллима', 'مُعَلِّمَةٌ'], ['r', 'сигир', 'بَقَرَةٌ']] },
      { s: 'Муаннасликнинг энг катта аломати қайси?', j: ['Та марбута:', '⟨ةٌ⟩'] },
      { s: 'Жонли нарсаларни жинсга ажратишда нимага эътибор қаратилади?', j: 'Аввало уларнинг жинсига эътибор қаратилади, муаннаслик аломатига эмас.' },
      { s: 'Жонсиз нарсаларни жинсга ажратишда нимага эътибор қаратилади? Жавобингизни мисол билан изоҳлаб беринг.',
        j: ['Унда муаннаслик аломати бор ёки йўқлигига қаралади. Масалан:', ['r', 'чизғич — аломати бор, муаннас', 'مِسْطَرَةٌ'], ['r', 'қалам — аломати йўқ, музаккар', 'قَلَمٌ'], ['r', 'китоб — аломати йўқ, музаккар', 'كِتَابٌ']] },
      { s: '⟨ةٌ⟩ – та марбутанинг маъноси нима?', j: 'Икки учи туташган ⟨ت⟩ – т дегани.' },
      { s: 'Сифатни англатувчи исмларнинг муаннас кўриниши қандай ҳосил қилинади?',
        j: ['Музаккарининг охиридаги танвин олиб ташланади, охирги ҳарф устига фатҳа қўйилиб, кетидан танвинли та марбута қўшилади. Масалан:', ['r', 'катта (мз → мн)', 'كَبِيرٌ → كَبِيرَةٌ']] },
      { s: 'Қуйидаги исмларни музаккар ва муаннасга ажратинг:', aj: [['k', 'Музаккар'], ['n', 'Муаннас']],
        w: [['مُحَمَّدٌ', 0], ['حَمْزَةُ', 0, 'Ҳамза — эркак исми: жонлида жинсига қаралади'], ['عَائِشَةُ', 1], ['مُعَلِّمَةٌ', 1], ['مُعَلِّمٌ', 0],
          ['مَرْيَمُ', 1, 'Марям — аёл исми: жонлида жинсига қаралади'], ['طَالِبٌ', 0], ['طَالِبَةٌ', 1], ['بَقَرَةٌ', 1], ['ثَوْرٌ', 0, 'Буқа — эркак жинси'],
          ['قَلَمٌ', 0, 'Жонсиз ва аломати йўқ — музаккар'], ['مِسْطَرَةٌ', 1, 'Жонсиз, лекин та марбутаси бор — муаннас'], ['كِتَابٌ', 0, 'Жонсиз ва аломати йўқ — музаккар'],
          ['كَبِيرٌ', 0, 'Та марбута йўқ — музаккар сифат'], ['كَبِيرَةٌ', 1, 'Та марбута бор — муаннас сифат']] },
      { s: 'Қуйидаги музаккар сифатларнинг муаннас кўринишини ҳосил қилинг:', c: 'n',
        tn: [mnT('كَبِير', 'катта', 0), mnT('صَغِير', 'кичкина', 1), mnT('طَوِيل', 'узун', 2), mnT('قَصِير', 'калта', 4),
          mnT('وَاسِع', 'кенг', 3), mnT('ضَيِّق', 'тор', 5), mnT('نَظِيف', 'тоза', 7), mnT('وَسِخ', 'кир', 6)] }
    ],
    q: [
      ['Муаннасликнинг яна икки аломати', 'Та марбутадан ташқари исм охиридаги алифи мақсура ва алифи мамдуда ҳам муаннаслик аломати:',
        ['r', 'Алифи мақсура — Салмо (аёл исми)', 'سَلْمَى'], ['r', 'Алифи мақсура — энг катта (мн)', 'كُبْرَى'],
        ['r', 'Алифи мамдуда — саҳро', 'صَحْرَاءُ'], ['r', 'Алифи мамдуда — қизил (мн)', 'حَمْرَاءُ'],
        'Лекин бундай тугаган ҳар сўз ҳам муаннас эмас:', ['r', 'Мусо — эркак исми', 'مُوسَى'], ['r', 'сув — ҳамзаси асл ҳарф', 'مَاءٌ']],
      ['Аломатсиз муаннаслар', 'Баъзи жонсиз исмларда аломат йўқ, лекин араблар уларни муаннас деб ишлатган — бу эшитиб билинади:',
        ['r', 'қуёш', 'شَمْسٌ'], ['r', 'ер', 'أَرْضٌ'], ['r', 'ҳовли, уй', 'دَارٌ'], ['r', 'олов', 'نَارٌ'], ['r', 'уруш', 'حَرْبٌ'], ['r', 'шамол', 'رِيحٌ'],
        'Танадаги жуфт аъзолар ҳам кўпинча муаннас:', ['r', 'қўл', 'يَدٌ'], ['r', 'кўз', 'عَيْنٌ'], ['r', 'қулоқ', 'أُذُنٌ'], ['r', 'оёқ', 'رِجْلٌ']],
      ['Та марбута бор, лекин музаккар', 'Жонлида жинсига қаралади: эркак исмлари та марбута билан ҳам музаккар.',
        ['r', 'Ҳамза', 'حَمْزَةُ'], ['r', 'Талҳа', 'طَلْحَةُ'], ['r', 'Муовия', 'مُعَاوِيَةُ']],
      ['Та марбута қандай ўқилади', 'Тўхтаб ўқилганда (вақф) «ҳ» бўлиб ўқилади, уланиб ўқилганда «т»:',
        ['r', 'тўхтаганда: «муаллимаҳ»', 'مُعَلِّمَهْ'], ['r', 'уланганда: «муаллиматун кабийраҳ»', 'مُعَلِّمَةٌ كَبِيرَةٌ'],
        'Феълдаги муаннаслик «т»си эса очиқ ёзилади:', ['r', 'урди (аёл)', 'ضَرَبَتْ']]
    ],
    y: [
      ['Ҳақиқий ва мажозий муаннас', 'Жонли муаннас — **ҳақиқий** (унинг эркаги бор), жонсиз муаннас — **мажозий**. Бу фарқ кейин феълнинг жинсга мослашувида керак бўлади.',
        ['r', 'ҳақиқий — аёл', 'اِمْرَأَةٌ'], ['r', 'ҳақиқий — урғочи туя', 'نَاقَةٌ'], ['r', 'мажозий — чизғич', 'مِسْطَرَةٌ'], ['r', 'мажозий — қуёш', 'شَمْسٌ']],
      ['Ҳамма сифат ҳам та марбута олмайди', 'Баъзи сифатларнинг муаннаси бошқа қолипда ясалади:',
        ['r', 'қизил', 'أَحْمَرُ → حَمْرَاءُ'], ['r', 'чанқаган', 'عَطْشَانُ → عَطْشَى'],
        'Баъзилари икки жинсга бир хил:', ['r', 'сабрли (эркак ҳам, аёл ҳам)', 'صَبُورٌ'], ['r', 'ўлдирилган (эркак ҳам, аёл ҳам)', 'قَتِيلٌ'],
        'Фақат аёлга хос сифат та марбута олмайди:', ['r', 'ҳомиладор', 'حَامِلٌ']],
      ['Муболаға та марбутаси', 'Баъзан та марбута муаннаслик учун эмас, маънони кучайтириш учун келади — сўз эркакка ҳам айтилади:',
        ['r', 'жуда билимдон', 'عَلَّامَةٌ'], ['r', 'кўп ривоят қилувчи', 'رَاوِيَةٌ']]
    ]
  };
})();
