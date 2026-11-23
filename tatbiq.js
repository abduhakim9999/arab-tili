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
    '.tb .c-b{--c:#0E7490;--t:rgba(14,116,144,.11)}.tb .c-t{--c:#56750F;--t:rgba(86,117,15,.12)}.tb .c-j{--c:#7A3FB8;--t:rgba(122,63,184,.1)}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tb .c-b{--c:#6CD0E6;--t:rgba(108,208,230,.12)}:root:not([data-theme="light"]) .tb .c-t{--c:#B9DB72;--t:rgba(185,219,114,.12)}:root:not([data-theme="light"]) .tb .c-j{--c:#C9A4F5;--t:rgba(201,164,245,.13)}}' +
    ':root[data-theme="dark"] .tb .c-b{--c:#6CD0E6;--t:rgba(108,208,230,.12)}:root[data-theme="dark"] .tb .c-t{--c:#B9DB72;--t:rgba(185,219,114,.12)}:root[data-theme="dark"] .tb .c-j{--c:#C9A4F5;--t:rgba(201,164,245,.13)}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tb .c-k{--c:#8EC3F0;--t:rgba(142,195,240,.13)}:root:not([data-theme="light"]) .tb .c-n{--c:#EBA0D6;--t:rgba(235,160,214,.12)}}' +
    ':root[data-theme="dark"] .tb .c-k{--c:#8EC3F0;--t:rgba(142,195,240,.13)}:root[data-theme="dark"] .tb .c-n{--c:#EBA0D6;--t:rgba(235,160,214,.12)}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tb .c-i{--c:#ADA4FF;--t:rgba(173,164,255,.13)}:root:not([data-theme="light"]) .tb .c-f,:root:not([data-theme="light"]) .tb .c-z{--c:#6FD8BC;--t:rgba(111,216,188,.12)}:root:not([data-theme="light"]) .tb .c-h{--c:#F2A27A;--t:rgba(242,162,122,.13)}:root:not([data-theme="light"]) .tb .c-m{--c:#E8C07A;--t:rgba(232,192,122,.13)}:root:not([data-theme="light"]) .tb .c-a{--c:#F49AB6;--t:rgba(244,154,182,.12)}}' +
    ':root[data-theme="dark"] .tb .c-i{--c:#ADA4FF;--t:rgba(173,164,255,.13)}:root[data-theme="dark"] .tb .c-f,:root[data-theme="dark"] .tb .c-z{--c:#6FD8BC;--t:rgba(111,216,188,.12)}:root[data-theme="dark"] .tb .c-h{--c:#F2A27A;--t:rgba(242,162,122,.13)}:root[data-theme="dark"] .tb .c-m{--c:#E8C07A;--t:rgba(232,192,122,.13)}:root[data-theme="dark"] .tb .c-a{--c:#F49AB6;--t:rgba(244,154,182,.12)}' +
    '.tb{padding-bottom:6px}.tb-tp{display:flex;align-items:center;gap:8px;margin:2px 0 4px;font-size:13px;color:var(--mu)}' +
    '.tb-tp>span:first-child{background:var(--cd);border:1px solid var(--bd);border-radius:9px;padding:2px 9px}' +
    '.tb-nm{font-size:23px;font-weight:700;line-height:1.25;margin:0 0 14px}' +
    '.tb-bs{text-align:center;font-size:25px;line-height:1.7;margin:0 0 8px}' +
    '.tb-vd{display:flex;gap:14px;align-items:center;border:1.5px solid var(--bd);border-radius:18px;padding:10px 12px 10px 10px;background:var(--cd);margin:0 0 20px;box-shadow:inset 0 -3px 0 var(--bd)}' +
    '.tb-vd .tb-th{width:54px;height:88px;border-radius:10px;background:#0F5E3E;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;opacity:.5}' +
    '.tb-vd .tb-th svg{width:24px;height:24px}.tb-vd b{display:block;font-size:16px}.tb-vd small{display:block;font-size:13.5px;color:var(--mu);margin-top:2px}' +
    '.tb-yt{position:relative;width:min(100%,300px);aspect-ratio:9/16;margin:0 auto 20px;border-radius:18px;overflow:hidden;background:#000}.tb-yt iframe,.tb-yt video{position:absolute;inset:0;width:100%;height:100%;border:0;object-fit:contain;background:#000}.tb-tz{text-align:center;color:var(--mu);font-size:15px;margin:0 0 18px}' +
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
    '.tb-fr{border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);padding:2px 10px;margin:0 0 12px}.tb-fr .r{padding:5px 0 6px;border-top:1px solid var(--bd);text-align:center}.tb-fr .r:first-child{border-top:0}' +
    '.tb-fr .fx{display:flex;direction:rtl;justify-content:center;align-items:center;flex-wrap:wrap;gap:0 7px}.tb .tb-fr .ar{font-size:23px;line-height:1.7}.tb-fr i{font-style:normal;color:var(--mu);font-size:16px}' +
    '.tb-fr em{font-style:normal;color:var(--c)}.tb-fr small{display:block;font-size:13px;color:var(--mu);line-height:1.3}' +
    '.tb-nv span{visibility:hidden}.tb-nv a:last-child{text-align:right}.tb-nv small{display:block;font-weight:400;font-size:12.5px;color:var(--mu)}' +
    /* 46-darsdan (21.11.2026): video ranglari — raf binafsha, nasb yashil, kaana tilla, muannaslik «т»si pushti, harf to'q sariq */
    '.tb{--rf:#6A4BD0;--ns:#0E8A55;--kn:#A06A00;--mn:#C2357A;--hf:#B4511F}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tb{--rf:#C9B6FF;--ns:#74E8AE;--kn:#F6D88F;--mn:#FFA3C7;--hf:#F2A27A}}' +
    ':root[data-theme="dark"] .tb{--rf:#C9B6FF;--ns:#74E8AE;--kn:#F6D88F;--mn:#FFA3C7;--hf:#F2A27A}' +
    '.tb .e-r{color:var(--rf)}.tb .e-s{color:var(--ns)}.tb .e-g{color:var(--kn)}.tb .e-n{color:var(--mn)}.tb .e-h{color:var(--hf)}' +
    '.tb .c-r{--c:var(--rf)}.tb .c-s{--c:var(--ns)}.tb .c-g{--c:var(--kn)}.tb .c-r,.tb .c-s,.tb .c-g{--t:color-mix(in srgb,var(--c) 12%,transparent)}' +
    '.tb-gl{border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);padding:10px 8px 8px;margin:0 0 6px;text-align:center}' +
    '.tb-gl .ws{direction:rtl;display:flex;justify-content:center;gap:7px}.tb-gl .ws>div{direction:ltr;flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;border-radius:12px;background:var(--t);padding:2px 4px 7px}' +
    '.tb .tb-gl .ws .ar{font-size:27px;line-height:1.7}.tb-gl b{font-size:12.5px;line-height:1.25;color:var(--c)}.tb-gl b .ar{font-size:1.2em;line-height:1}.tb-gl small{font-size:12px;color:var(--mu)}.tb-gl p{margin:8px 0 0;font-size:14.5px;color:var(--mu)}' +
    '.tb-ps{display:flex;align-items:center;justify-content:center;gap:6px;margin:0 0 6px;color:var(--mu);font-size:14px}.tb-ps svg{width:22px;height:22px}.tb .tb-ps .ar{font-size:24px;color:var(--kn)}' +
    '.tb-gp{display:grid;gap:10px;margin:0 0 14px}.tb-gp .sc{border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);overflow:hidden}' +
    '.tb-gp .hd{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 12px;border-bottom:1px solid var(--bd);font-size:14.5px}.tb .tb-gp .hd .ar{font-size:21px;line-height:1.6;color:var(--mu)}' +
    '.tb-gp .jn{display:flex;flex-direction:row-reverse;align-items:center;gap:8px;padding:2px 12px;background:var(--t);color:var(--c);border-top:1px solid var(--bd)}.tb-gp .hd+.jn{border-top:0}' +
    '.tb .tb-gp .jn .ar{font-size:18px;line-height:1.6}.tb-gp .jn small{font-size:12.5px;font-weight:700}' +
    '.tb-gp .tb-r{padding:2px 12px}.tb .tb-gp .tb-ar .ar{font-size:22px}' +
    '.tb .tb-sn1{font-style:normal;display:inline-block;font-size:12px;font-weight:700;line-height:1.5;color:var(--c);background:var(--t);border-radius:7px;padding:0 8px}' +
    '.tb-sn.gp .tb-sw .ar{font-size:27px;white-space:normal}.tb-sn.gp .tb-wl.tn .tb-w{font-size:21px;line-height:1.7}' +
    '.tb-kf{border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);padding:0 12px 2px;margin:0 0 12px}.tb-mq .tb-kf{margin:10px 0 0;background:var(--bg)}.tb-kf .hd{text-align:right;padding:2px 0 0;font-size:13px;font-weight:700;color:var(--mu)}.tb .tb-kf .hd .ar{font-size:18px;color:var(--c)}' +
    '.tb-kf .r{padding:4px 0 8px;border-top:1px solid var(--bd);text-align:center}.tb-kf .hd+.r{border-top:0}' +
    '.tb-kf .fx,.tb-kf .nt{direction:rtl;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:0 8px}.tb-kf .fx{color:var(--mu)}.tb .tb-kf .fx .ar{font-size:19px;line-height:1.6}' +
    '.tb-kf i{font-style:normal;color:var(--mu)}.tb .tb-kf .nt .ar{font-size:26px;line-height:1.6}.tb-kf small{display:block;font-size:13.5px;color:var(--mu);line-height:1.3}' +
    '.tb-tk{border:1.5px solid var(--bd);border-radius:16px;background:var(--cd);margin:0 0 12px;overflow:hidden;box-shadow:inset 0 -3px 0 var(--bd)}' +
    '.tb-tk .gp{text-align:center;padding:6px 12px 0}.tb .tb-tk .gp .ar{font-size:26px;line-height:1.7;white-space:normal}.tb-tk .tr{margin:0;padding:0 12px 8px;text-align:center;font-size:14.5px;color:var(--mu)}' +
    '.tb-tk .rs{border-top:1px solid var(--bd)}.tb-tk .tb-r{padding:3px 12px}.tb-tk .tb-l{color:var(--tx)}.tb .tb-tk .tb-ar .ar{font-size:23px}' +
    '.tb-tk .jt{border-top:1px solid var(--bd);padding:6px 12px 8px;font-size:13.5px;font-weight:600;color:var(--mu)}' +
    '.tb-ik{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 12px}.tb-ik>div{border-radius:14px;background:var(--t);padding:8px 10px;text-align:center;color:var(--c)}' +
    '.tb-ik small{display:block;font-size:13px;color:var(--mu);line-height:1.3}.tb-ik b{font-size:19px}' +
    '.tb-vq.n2{grid-template-columns:repeat(2,minmax(0,1fr))}.tb-vq.n2:before{left:25%;right:25%}' +
    '.tb-oy{text-align:center;margin:6px 0 10px;padding:4px 10px 8px;border-radius:12px;background:var(--bg);border:1px solid var(--bd)}.tb .tb-oy .ar{display:block;white-space:normal;font-size:23px;line-height:1.8}' +
    '.tb-oy small{display:block;font-size:13.5px;color:var(--mu);line-height:1.4}' +
    '.tb-oh{margin:12px 0 6px;font-size:13px;font-weight:700;color:var(--mu)}' +
    '.tb .tb-oi{display:block;width:100%;text-align:right;direction:rtl;font:inherit;border:1.5px solid var(--bd);background:var(--bg);color:var(--tx);border-radius:12px;padding:3px 12px 5px;margin:0 0 7px;cursor:pointer}' +
    '.tb .tb-oi .ar{display:block;white-space:normal;font-size:22px;line-height:1.75}.tb-oi .op{display:none;border-top:1px dashed var(--bd);margin-top:4px;padding-top:2px}.tb-oi.on .op{display:block}.tb-oi.on{border-color:var(--ac)}' +
    '.tb-oi small{display:block;direction:ltr;text-align:left;font-size:13.5px;color:var(--mu);line-height:1.35;margin:-2px 0 4px}' +
    /* 48-darsdan (23.11.2026): tuslanish jadvali (o'ngdan chapga, qator — shaxs/jins, ustun — son), savolli tarkib kartasi, yopiq jadval mashqi */
    '.tb-tl{width:100%;direction:rtl;border-collapse:separate;border-spacing:0;border:1.5px solid var(--bd);border-radius:14px;overflow:hidden;margin:4px 0 14px;table-layout:fixed;background:var(--cd)}' +
    '.tb-tl th,.tb-tl td{padding:4px 2px;text-align:center;vertical-align:middle;border-top:1px solid var(--bd);border-right:1px solid var(--bd)}.tb-tl .rh{border-right:0}.tb-tl tr:first-child>*{border-top:0}' +
    '.tb-tl th.h1{font-size:12px;font-weight:700;padding:5px 2px}.tb-tl th.h2{font-size:10.5px;font-weight:600;line-height:1.2;padding:3px 1px;background:var(--t,transparent);color:var(--c,var(--mu))}' +
    '.tb-tl th.rh{width:12%;font-size:11px;font-weight:600;color:var(--mu);padding:4px 2px}' +
    '.tb .tb-tl td .ar{display:block;font-size:20px;line-height:1.55}.tb-tl td small{display:block;font-size:10px;color:var(--mu);line-height:1.2;padding-bottom:2px;letter-spacing:-.1px}.tb .tb-tl td small .ar{display:inline;font-size:1.35em;line-height:1}.tb-tl .dh{display:block;font-size:20px;color:var(--mu)}' +
    '.tb .tb-tc{all:unset;box-sizing:border-box;display:block;width:100%;cursor:pointer;border-radius:9px}.tb-tc .q{display:flex;align-items:center;justify-content:center;min-height:42px;margin:2px;border:1.5px dashed var(--bd);border-radius:9px;color:var(--mu);font-weight:700}' +
    '.tb-tc .op{display:none}.tb-tc.on .op{display:block}.tb-tc.on .q{display:none}' +
    '.tb-tk .sv{text-align:center;padding:5px 12px 3px;border-bottom:1px dashed var(--bd);color:var(--mu)}.tb .tb-tk .sv .ar{font-size:21px;line-height:1.7;white-space:normal;color:var(--tx)}.tb-tk .sv small{display:block;font-size:13px}' +
    '.tb-oi small.tz{color:var(--tx);opacity:.85;border-top:1px dotted var(--bd);padding-top:3px}.tb .tb-oi small.tz .ar{display:inline;font-size:1.3em;line-height:1}' +
    '.tb-tl th,.tb-tl td small{direction:ltr}';

  /* arabcha ichida rang: [r]…[/] raf, [s] nasb, [g] kaana, [n] muannaslik «т»si, [h] harf (46-darsdan) */
  function E(s) { return String(s).replace(/\[([rsgnh])\]/g, '<span class="e-$1">').replace(/\[\/\]/g, '</span>'); }
  function A(s) {
    return E(String(s).replace(/⟨([^⟩]+)⟩/g, '<span class="ar" lang="ar">$1</span>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>'));
  }
  function ar(s) { return '<span class="ar" lang="ar">' + E(s) + '</span>'; }
  /* son turi yorlig'i (46-darsdan): b муфрад, t тасния, jt жам таксир, js жам солим — ranglari 5-darsdagidek */
  var SN = { b: ['муфрад', 'b'], t: ['тасния', 't'], jt: ['жам таксир', 'j'], js: ['жам солим', 'j'] };
  function sn(k) { return k && SN[k] ? '<i class="tb-sn1 c-' + SN[k][1] + '">' + SN[k][0] + '</i>' : ''; }
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
      return '<div class="tb-vq' + (x[2] ? ' ' + x[2] : '') + '">' + x[1].map(function (v) { return '<div class="c-' + v[0] + '"><small>' + v[1] + '</small><b>' + v[2] + '</b>' + ar(v[3]) + '<i>' + v[4] + '</i></div>'; }).join('') + '</div>';
    },
    /* muzoraat harflari: [harf, harfdan keyingi qism, ma'no] */
    mzh: function (x) {
      return '<div class="tb-mz c-z">' + x[1].map(function (m) { return '<div><span class="lt ar">' + m[0] + '</span><span class="tb-ww"><span class="ar" lang="ar"><em>' + m[0] + '</em>' + m[1] + '</span><small>' + m[2] + '</small></span></div>'; }).join('') + '</div>';
    },
    /* aylanish: mozi → muzori (qo'shilgan harf em) */
    ayl: function (x) {
      return '<div class="tb-ay c-' + (x[5] || 'z') + '">' + ar(x[1]) + STR + '<span class="ar yn" lang="ar">' + (x[6] === 'o' ? x[3] + '<em>' + x[2] + '</em>' : '<em>' + x[2] + '</em>' + x[3]) + '</span></div><p class="tb-ac">' + A(x[4]) + '</p>';
    },
    /* formula: [муфрад, асос, қўшимча, натижа (<em> — қўшилган қисм), маъно]; x[2] — rang (5-dars, tasniya) */
    fr: function (x) {
      return '<div class="tb-fr c-' + (x[2] || 't') + '">' + x[1].map(function (r) {
        return '<div class="r"><span class="fx">' + ar(r[0]) + '<i>:</i>' + ar(r[1]) + '<i>+</i>' + ar('<em>' + r[2] + '</em>') + '<i>=</i>' + ar(r[3]) + '</span><small>' + A(r[4]) + '</small></div>';
      }).join('') + '</div>';
    },
    /* ---- 46-darsdan (21.11.2026) ---- */
    /* gap bo'laklari yorlig'i bilan: [[so'z, nom, holat, rang], …], tarjima — so'zlar o'ngdan chapga */
    gl: function (x) {
      return '<div class="tb-gl"><div class="ws">' + x[1].map(function (w) { return '<div class="c-' + w[3] + '">' + ar(w[0]) + '<b>' + A(w[1]) + '</b>' + (w[2] ? '<small>' + w[2] + '</small>' : '') + '</div>'; }).join('') +
        '</div>' + (x[2] ? '<p>' + A(x[2]) + '</p>' : '') + '</div>';
    },
    /* pastga strelka + yozuv (masalan «+ كَانَ») */
    ps: function (x) { return '<div class="tb-ps"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6"/></svg><span>' + A(x[1]) + '</span></div>'; },
    /* mubtado–xabar guruhlari: [[sarlavha, arabcha sarlavha, [[rang, arabcha nom, [[son turi (SN), gap], …]], …]], …];
       har gap alohida qatorda, chapda son turi (21.11.2026, foydalanuvchi: «bitta gapga o'xshab turibdi — ajralib tursin») */
    gp: function (x) {
      return '<div class="tb-gp">' + x[1].map(function (g) {
        return '<div class="sc"><div class="hd"><b>' + A(g[0]) + '</b>' + ar(g[1]) + '</div>' + g[2].map(function (r) {
          return '<div class="jn c-' + r[0] + '">' + ar(r[1]) + '<small>' + (r[0] === 'k' ? 'музаккар' : 'муаннас') + '</small></div>' + r[2].map(function (q) {
            return '<div class="tb-r"><span class="tb-l">' + sn(q[0]) + '</span><span class="tb-ar">' + ar(q[1]) + '</span></div>';
          }).join('');
        }).join('') + '</div>';
      }).join('') + '</div>';
    },
    /* kaana formulasi: x[1] — arabcha sarlavha, x[2] — rang, x[3] — [[kaana, mubtado–xabar, natija, tarjima], …] */
    kf: function (x) {
      return '<div class="tb-kf c-' + x[2] + '"><div class="hd">' + A(x[1]) + '</div>' + x[3].map(function (r) {
        return '<div class="r"><div class="fx">' + ar(r[0]) + '<i>+</i>' + ar(r[1]) + '</div><div class="nt"><i>=</i>' + ar(r[2]) + '</div><small>' + (r[4] ? sn(r[4]) + ' ' : '') + A(r[3]) + '</small></div>';
      }).join('') + '</div>';
    },
    /* tarkib kartasi: gap, tarjima, [[so'z, tarkibi, rang], …], jumla turi */
    /* x[5] — savol [arabcha, tarjima]: javob tarkibi ustida xira qatorda (48-darsdan) */
    tk: function (x) {
      return '<div class="tb-tk">' + (x[5] ? '<div class="sv">' + ar(x[5][0]) + '<small>' + A(x[5][1]) + '</small></div>' : '') + '<div class="gp">' + ar(x[1]) + '</div><p class="tr">' + A(x[2]) + '</p><div class="rs">' + x[3].map(function (r) {
        return '<div class="tb-r"><span class="tb-l">' + A(r[1]) + '</span><span class="tb-ar"><span class="ar e-' + r[2] + '" lang="ar">' + E(r[0]) + '</span></span></div>';
      }).join('') + '</div><div class="jt">' + A(x[4]) + '</div></div>';
    },
    /* ikki quti: [[rang, kichik yozuv, katta yozuv], …] */
    ik: function (x) { return '<div class="tb-ik">' + x[1].map(function (b) { return '<div class="c-' + b[0] + '"><small>' + A(b[1]) + '</small><b>' + A(b[2]) + '</b></div>'; }).join('') + '</div>'; },
    /* bosqichlar: [belgi, izoh, arabcha (<em> — qo'shilgan qism), rang] — 4-dars, muannas yasash */
    qd: function (x) {
      return '<div class="tb-qd">' + x[1].map(function (r) { return '<div class="r c-' + (r[3] || 'n') + '"><b>' + r[0] + '</b><span class="tx">' + A(r[1]) + '</span>' + ar(r[2]) + '</div>'; }).join('') + '</div>';
    },
    /* tuslanish jadvali (48-darsdan): x[1] — ustunlar, x[2] — qatorlar */
    tsl: function (x) { return tslH(x[1]); }
  };
  /* kitobdagidek (23.11.2026, foydalanuvchi: «kitobdagidek yaxshi emasmi»): ustun — shaxs va jins (III shaxs eng o'ngda), qator — son.
     t = {h1: [[shaxs, ustunlar soni]], h2: [[jins, rang]], r: [[son, [katak × ustun]]]}; katak: [arabcha, tarjima, 'r2' | 'c2'] yoki 0
     (qo'shni katak egallagan); '—' — yashirin; yop — mashq uchun yopiq kataklar (bosilsa ochiladi) */
  function tslH(t, yop) {
    return '<table class="tb-tl' + (yop ? ' yp' : '') + '"><tr><th class="rh" rowspan="2"></th>' +
      t.h1.map(function (h) { return '<th class="h1" colspan="' + (h[1] || 1) + '">' + h[0] + '</th>'; }).join('') + '</tr><tr>' +
      t.h2.map(function (h) { return '<th class="h2' + (h[1] ? ' c-' + h[1] : '') + '">' + h[0] + '</th>'; }).join('') + '</tr>' + t.r.map(function (r) {
        return '<tr><th class="rh">' + r[0] + '</th>' + r[1].map(function (c) {
          if (!c) return '';
          var ic = (c[0] === '—' ? '<span class="dh">—</span>' : ar(c[0])) + (c[1] ? '<small>' + A(c[1]) + '</small>' : '');
          return '<td' + (c[2] === 'r2' ? ' rowspan="2"' : c[2] === 'c2' ? ' colspan="2"' : '') + '>' +
            (yop ? '<button class="tb-tc" type="button"><span class="q">?</span><span class="op">' + ic + '</span></button>' : ic) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</table>';
  }

  /* qismlar: matn | '⟨a · b → c⟩' — arabcha chiplar alohida qatorda | ['r', izoh, 'a · b → c'] — qator-jadval (izoh chapda, arabcha o'ngda).
     Arabcha gap ichida bo'linib ketmasligi uchun misollar shu yo'l bilan beriladi (21.11.2026, foydalanuvchi). */
  function chip(s) {
    return '<span class="tb-ar">' + s.split(' · ').map(function (g) { return g.split(' → ').map(ar).join('<i>←</i>'); }).join('<i>·</i>') + '</span>';
  }
  function qism(a) {
    var h = '', r = '';
    a.forEach(function (p) {
      /* ['a', uzun arabcha (qatorga bo'linadi — oyat, gap), tarjima] — 46-darsdan */
      if (Array.isArray(p) && p[0] === 'a') { if (r) { h += '<div class="tb-rw">' + r + '</div>'; r = ''; } h += '<div class="tb-oy">' + ar(p[1]) + '<small>' + A(p[2]) + '</small></div>'; return; }
      if (Array.isArray(p)) { r +='<div class="tb-r"><span class="tb-l">' + A(p[1]) + '</span>' + chip(p[2]) + '</div>'; return; }
      if (r) { h += '<div class="tb-rw">' + r + '</div>'; r = ''; }
      h += /^⟨[^⟩]+⟩$/.test(p) ? '<div class="tb-cp">' + chip(p.slice(1, -1)) + '</div>' : '<p>' + A(p) + '</p>';
    });
    return h + (r ? '<div class="tb-rw">' + r + '</div>' : '');
  }

  /* Машқ: {s: savol, j: javob} | {s, aj: [guruhlar [rang, nom]], w: [[so'z, guruh, xato bo'lsa maslahat]]} | {s, sn: [[so'z, harflar]]}
     | {s, tn: [[so'z, izoh, [variantlar], to'g'ri, [har variant uchun maslahat], javob ma'nosi]], c: rang} — bittadan tanlash (4, 5-dars) */
  function mashq(d) {
    return '<ol class="tb-mq">' + d.m.map(function (q, k) {
      var h = '<li data-k="' + k + '"><p>' + A(q.s) + '</p>';
      if (q.b) h += q.b.map(function (x) { return BL[x[0]](x); }).join('');   /* savol ostida blok (namuna) — 46-darsdan */
      if (q.j) h += '<button class="tb-bt tb-jb" type="button">Жавобни кўриш</button><div class="tb-jv" hidden>' + (Array.isArray(q.j) ? qism(q.j) : A(q.j)) + '</div>';
      else if (q.aj) h += '<div class="tb-wl">' + q.w.map(function (w, i) { return '<button class="tb-w" type="button" data-i="' + i + '">' + w[0] + '</button>'; }).join('') + '</div>' +
        '<div class="tb-gb"' + (q.aj.length !== 3 ? ' style="grid-template-columns:repeat(' + q.aj.length + ',minmax(0,1fr))"' : '') + '>' + q.aj.map(function (g, i) { return '<button class="tb-bt c-' + g[0] + '" type="button" data-g="' + i + '">' + g[1] + '</button>'; }).join('') + '</div>' +
        '<p class="tb-xb">Сўзни босинг, кейин туркумини танланг · <span class="sc">0 / ' + q.w.length + '</span></p>';
      else if (q.sn) h += '<div class="tb-sn"></div>';
      else if (q.tn) h += '<div class="tb-sn c-' + (q.c || 'n') + '"></div>';
      /* ty — yopiq jadval (48-darsdan): [ustunlar, qatorlar]; o'quvchi o'zi aytadi, katakni bosib tekshiradi */
      else if (q.ty) h += '<p class="tb-xb">Ҳар катакни аввал ўзингиз айтинг, кейин босиб текширинг.</p>' + tslH(q.ty, 1) +
        '<div class="tb-sr"><button class="tb-bt tb-ha" type="button">Ҳаммасини очиш</button></div>';
      /* oq — harakatsiz gaplarni o'qish (46-darsdan): [[guruh nomi, [[savol, javob, savol harakatli, javob harakatli, tarjima, tarjima], …]], …] */
      else if (q.oq) h += '<p class="tb-xb">Аввал ўзингиз ўқинг, кейин гапни босинг — ҳаракатли ёзилиши ва таржимаси чиқади.</p>' + q.oq.map(function (g) {
        return '<div class="tb-oh">' + g[0] + '</div>' + g[1].map(function (s) {
          return '<button class="tb-oi" type="button">' + ar(s[0]) + ar(s[1]) + '<span class="op">' + ar(s[2]) + '<small>' + A(s[4]) + '</small>' + ar(s[3]) + '<small>' + A(s[5]) + '</small>' +
            (s[6] ? '<small class="tz">' + A(s[6]) + '</small>' : '') + '</span></button>';   /* s[6] — javob tarkibi (48-darsdan) */
        }).join('');
      }).join('') + (q.iz ? '<p class="tb-xb">' + A(q.iz) + '</p>' : '');
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
      (j ? '<p class="tb-xb ' + (s.t === w[3] ? 'ok">Тўғри!' : 'no">' + A(w[4][s.t] || 'Яна ўйлаб кўринг')) + (w[5] ? '<br><span style="color:var(--tx)">Маъноси: ' + A(w[5]) + '</span>' : '') + '</p>' +
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
      if (b.classList.contains('tb-oi') || b.classList.contains('tb-tc')) { b.classList.toggle('on'); return; }
      if (b.classList.contains('tb-ha')) {
        var cs = li.querySelectorAll('.tb-tc'), och = [].some.call(cs, function (c) { return !c.classList.contains('on'); });
        [].forEach.call(cs, function (c) { c.classList.toggle('on', och); }); b.textContent = och ? 'Ҳаммасини ёпиш' : 'Ҳаммасини очиш'; return;
      }
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
    var d = T.D[n], v = o.v; if (!d && !(v && (v.yt || v.mp4))) return false;   /* 21.11.2026: kitob matni hali yo'q, video bor — faqat video */
    if (!document.getElementById('tb-css')) { var st = document.createElement('style'); st.id = 'tb-css'; st.textContent = CSS; document.head.appendChild(st); }
    var h = '<div class="tb">';
    if (d && d.bs) h += '<div class="tb-bs ar" lang="ar">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div>';
    h += '<div class="tb-tp"><span>Татбиқ</span>' + (o.bob || '') + '</div><h2 class="tb-nm">' + n + '-дарс · ' + A(o.nom) + '</h2>';
    h += v && v.yt ? '<div class="tb-yt"><iframe src="https://www.youtube-nocookie.com/embed/' + v.yt + '?playsinline=1&rel=0" title="Видео дарс" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>'
      : v && v.mp4 ? '<div class="tb-yt"><video src="' + v.mp4 + '"' + (v.p ? ' poster="' + v.p + '"' : '') + ' controls playsinline preload="none" title="Видео дарс"></video></div>'   /* YouTube'ga qo'yilguncha — saytdagi mp4 (21.11.2026) */
      : '';   /* video yo'q bo'lsa joy egallamaydi (21.11.2026: bo'lim endi kitob, video — bor darslarda) */
    if (d) {
      h += d.b.map(function (x) { return BL[x[0]](x); }).join('');
      h += '<div class="tb-s">Машқ</div>' + mashq(d);
      h += bolim(d, 'q', 'qd', IQ, 'Қўшимча', 'Мавзуга оид, китобда йўқ') + bolim(d, 'y', 'yd', IY, 'Юқори даража', 'Бундай нарсалар ҳам бор');
    } else h += '<p class="tb-tz">Китоб матни ва машқ — тез орада</p>';
    h += '<div class="tb-nv">' + (o.old ? '<a href="#d' + o.old[0] + '">‹ ' + o.old[0] + '-дарс<small>' + A(o.old[1]) + '</small></a>' : '<span></span>') +
      (o.keyin ? '<a href="#d' + o.keyin[0] + '">' + o.keyin[0] + '-дарс ›<small>' + A(o.keyin[1]) + '</small></a>' : '<span></span>') + '</div></div>';
    el.innerHTML = h;
    if (d) bogla(el, d);
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
  /* ===================== 5-дарс · Муфрад, тасния, жам ===================== */
  /* tasniya yasash mashqi: b — asos (ة siz, oxirgi harakat bilan), ta — ة li so'z; xato variantlar: жам, танвин / ة ўзгармаган */
  function tsT(w, b, ta, uz, uz2, k) {
    var v = ta ? [[b + 'تَانِ', ''], [b + 'ةَانِ', 'Та марбута очиқ «т»га ўзгаради'], [b + 'اتٌ', 'Бу — жам, тасния эмас']]
      : [[b + 'َانِ', ''], [b + 'ُونَ', 'Бу — жам қўшимчаси, тасния эмас'], [b + 'َانٌ', 'Тасния қўшимчаси танвинсиз: ⟨ـَانِ⟩']];
    for (var i = 0; i < k % 3; i++) v.push(v.shift());
    var t = 0; v.forEach(function (x, i) { if (!x[1]) t = i; });
    return [w, uz + ' → таснияси?', v.map(function (x) { return x[0]; }), t, v.map(function (x) { return x[1]; }), uz2];
  }
  function h5(w, g) {
    if (w === 'ثِيرَانٌ') return 'Охири «-аан» бўлса ҳам тасния эмас: «буқалар» — жам';
    if (g === 0) return 'Битта нарса — муфрад';
    if (g === 1) return '«-аани» қўшимчаси — тасния';
    if (/ُونَ$/.test(w)) return '«-уун» қўшимчаси — жам';
    if (/َاتٌ$/.test(w)) return '«-аат» қўшимчаси — жам';
    return 'Шакли ўзгарган жам — 6-дарсда';
  }
  T.D[5] = {
    b: [
      ['dar', 'Исм', [['b', 'Муфрад'], ['t', 'Тасния'], ['j', 'Жам']]],
      ['p', 'Араб тилида исм сон жиҳатидан 3 қисмга бўлинади:'],
      ['vaqt', [['b', '1 та', 'Муфрад', 'طَالِبٌ', 'талаба'], ['t', '2 та', 'Тасния', 'طَالِبَانِ', '2 та талаба'], ['j', '2 тадан кўп', 'Жам', 'طَالِبُونَ', 'талабалар']]],
      ['h', 'b', '1', '**Муфрад**', '(м)'],
      ['p', 'Бир эркак ё бир аёл жинсига мансуб нарсани ифода қилувчи исм **муфрад** (бирлик) деб юритилади. Унга мисол:'],
      ['mis', [['طَالِبٌ', 'талаба (мз)'], ['طَالِبَةٌ', 'талаба қиз (мн)']], 'b'],
      ['h', 't', '2', '**Тасния**', '(т)'],
      ['p', 'Муфради кетидан тасния қўшимчасини зиёда қилган ҳолда, 2 эркак ё 2 аёл жинсига мансуб нарсани ифода қилувчи исм **тасния** (иккилик) деб юритилади.'],
      ['p', 'Тасния қўшимчаси – ⟨ـَانِ⟩'],
      ['p', '**1)** Агар муфрад исмнинг охирида *та марбута* йўқ бўлиб, у замма ё танвин билан тугалланган бўлса, ундан тасния ясашда, ундаги замма ва танвин олиб ташланади, сўнг кетидан тасния қўшимчаси қўшилади. Унга мисол:'],
      ['fr', [['طَالِبٌ', 'طَالِب', 'ـَانِ', 'طَالِبَ<em>انِ</em>', '2 та талаба (мз)'], ['كَسْلَانُ', 'كَسْلَان', 'ـَانِ', 'كَسْلَانَ<em>انِ</em>', '2 та дангаса (мз)']]],
      ['p', '**2)** Агар муфрад исм ⟨ة⟩ – *та марбута* билан тугалланган бўлса, ундан тасния ясашда, ундаги замма ва танвин олиб ташланиб, ⟨ة⟩ – *та марбута* ⟨ت⟩ – *та мафтуҳа* (очиқ т)га ўзгаради, сўнг кетидан тасния қўшимчаси қўшилади. Унга мисол:'],
      ['ayl', 'ة', 'ت', '', 'та марбута очиқ «т»га ўзгаради', 't'],
      ['fr', [['عَائِشَةُ', 'عَائِشَة', 'ـَانِ', 'عَائِشَ<em>تَانِ</em>', '2 Ойша'], ['طَالِبَةٌ', 'طَالِبَة', 'ـَانِ', 'طَالِبَ<em>تَانِ</em>', '2 та талаба қиз (мн)']]],
      ['h', 'j', '3', '**Жам**', '(ж)'],
      ['p', '2 та нарсадан кўпроғини ифода қилувчи исм **жам** (кўплик) деб юритилади. Унга мисол:'],
      ['mis', [['طَالِبُونَ', 'талабалар (мз)'], ['طَالِبَاتٌ', 'талаба қизлар (мн)'], ['طُلَّابٌ', 'талабалар (мз)'], ['فُضَلَاءُ', 'фазилатлилар (мз)']], 'j']
    ],
    m: [
      { s: 'Исм сон жиҳатидан неча қисмга бўлинади? Улар қайсилар?', j: '3 қисмга: **муфрад**, **тасния** ва **жам**.' },
      { s: 'Муфрад деб нимага айтилади? Унга мисол келтиринг.',
        j: ['Бир эркак ё бир аёл жинсига мансуб нарсани ифода қилувчи исм **муфрад** (бирлик) деб юритилади. Масалан:', ['r', 'талаба (мз)', 'طَالِبٌ'], ['r', 'талаба қиз (мн)', 'طَالِبَةٌ']] },
      { s: 'Тасния деб нимага айтилади?', j: 'Муфради кетидан тасния қўшимчасини зиёда қилган ҳолда, 2 эркак ё 2 аёл жинсига мансуб нарсани ифода қилувчи исм **тасния** (иккилик) деб юритилади.' },
      { s: 'Тасния қўшимчаси қандай қўшимча?', j: ['Тасния қўшимчаси:', '⟨ـَانِ⟩'] },
      { s: 'Агар муфрад исмнинг охирида та марбута йўқ бўлиб, у замма ё танвин билан тугалланган бўлса, ундан қай тарзда тасния ясалади? Унга мисол келтиринг.',
        j: ['Ундаги замма ва танвин олиб ташланади, сўнг кетидан тасния қўшимчаси қўшилади. Масалан:', ['r', '2 та талаба (мз)', 'طَالِبٌ → طَالِبَانِ'], ['r', '2 та дангаса (мз)', 'كَسْلَانُ → كَسْلَانَانِ']] },
      { s: 'Агар муфрад исм та марбута билан тугалланган бўлса, ундан қай тарзда тасния ясалади? Унга мисол келтиринг.',
        j: ['Ундаги замма ва танвин олиб ташланиб, та марбута та мафтуҳа (очиқ т)га ўзгаради, сўнг кетидан тасния қўшимчаси қўшилади. Масалан:', ['r', '2 Ойша', 'عَائِشَةُ → عَائِشَتَانِ'], ['r', '2 та талаба қиз (мн)', 'طَالِبَةٌ → طَالِبَتَانِ']] },
      { s: 'Жам деб нимага айтилади? Унга мисол келтиринг.',
        j: ['2 та нарсадан кўпроғини ифода қилувчи исм **жам** (кўплик) деб юритилади. Масалан:', ['r', 'талабалар (мз)', 'طَالِبُونَ'], ['r', 'талаба қизлар (мн)', 'طَالِبَاتٌ'], ['r', 'талабалар (мз)', 'طُلَّابٌ'], ['r', 'фазилатлилар (мз)', 'فُضَلَاءُ']] },
      { s: 'Қуйидаги исмлардан тасния ясанг ҳамда уларнинг маъноларини айтиб беринг:', c: 't',
        tn: [tsT('مُحَمَّدٌ', 'مُحَمَّد', 0, 'Муҳаммад', '2 Муҳаммад', 0), tsT('عَائِشَةُ', 'عَائِشَ', 1, 'Ойша', '2 Ойша', 2), tsT('مُعَلِّمٌ', 'مُعَلِّم', 0, 'муаллим', '2 та муаллим', 1),
          tsT('مُعَلِّمَةٌ', 'مُعَلِّمَ', 1, 'муаллима', '2 та муаллима', 0), tsT('فَاضِلٌ', 'فَاضِل', 0, 'фазилатли (мз)', '2 та фазилатли (мз)', 2), tsT('فَاضِلَةٌ', 'فَاضِلَ', 1, 'фазилатли (мн)', '2 та фазилатли (мн)', 1),
          tsT('ثَوْرٌ', 'ثَوْر', 0, 'буқа', '2 та буқа', 0), tsT('بَقَرَةٌ', 'بَقَرَ', 1, 'сигир', '2 та сигир', 2), tsT('كَسْلَانُ', 'كَسْلَان', 0, 'дангаса (мз)', '2 та дангаса (мз)', 1),
          tsT('قَلَمٌ', 'قَلَم', 0, 'қалам', '2 та қалам', 2), tsT('مِسْطَرَةٌ', 'مِسْطَرَ', 1, 'чизғич', '2 та чизғич', 0), tsT('دَفْتَرٌ', 'دَفْتَر', 0, 'дафтар', '2 та дафтар', 1),
          tsT('كِتَابٌ', 'كِتَاب', 0, 'китоб', '2 та китоб', 0), tsT('سَفَرْجَلٌ', 'سَفَرْجَل', 0, 'беҳи', '2 та беҳи', 2)] },
      { s: 'Қуйидаги исмларни муфрад, тасния ва жамга ажратинг:', aj: [['b', 'Муфрад'], ['t', 'Тасния'], ['j', 'Жам']],
        w: [['مُحَمَّدٌ', 0], ['مُحَمَّدَانِ', 1], ['مُحَمَّدُونَ', 2], ['عَائِشَةُ', 0], ['عَائِشَتَانِ', 1], ['عَائِشَاتٌ', 2], ['مُعَلِّمٌ', 0], ['مُعَلِّمَانِ', 1], ['مُعَلِّمُونَ', 2],
          ['مُعَلِّمَةٌ', 0], ['مُعَلِّمَتَانِ', 1], ['مُعَلِّمَاتٌ', 2], ['طَالِبٌ', 0], ['طَالِبَانِ', 1], ['طَالِبُونَ', 2], ['طُلَّابٌ', 2], ['طَالِبَةٌ', 0], ['طَالِبَتَانِ', 1], ['طَالِبَاتٌ', 2],
          ['فَاضِلٌ', 0], ['فَاضِلَةٌ', 0], ['فَاضِلَانِ', 1], ['فَاضِلَتَانِ', 1], ['فُضَلَاءُ', 2], ['فَاضِلَاتٌ', 2], ['ثَوْرٌ', 0], ['ثَوْرَانِ', 1], ['ثِيرَانٌ', 2],
          ['بَقَرَةٌ', 0], ['بَقَرَتَانِ', 1], ['بَقَرَاتٌ', 2], ['قَلَمٌ', 0], ['قَلَمَانِ', 1], ['أَقْلَامٌ', 2], ['مِسْطَرَةٌ', 0], ['مِسْطَرَتَانِ', 1], ['مَسَاطِرُ', 2]].map(function (x) { return [x[0], x[1], h5(x[0], x[1])]; }) }
    ],
    q: [
      ['Тасниянинг иккинчи шакли', 'Гапдаги ўрнига қараб тасния ⟨ـَيْنِ⟩ билан ҳам келади — бу ҳақда эъроб дарсларида:',
        ['r', 'раф: «икки талаба келди»', 'جَاءَ طَالِبَانِ'], ['r', 'насб: «икки талабани кўрдим»', 'رَأَيْتُ طَالِبَيْنِ'], ['r', 'жар: «икки талаба билан»', 'مَعَ طَالِبَيْنِ']],
      ['Бир эркак ва бир аёл', 'Эркак ва аёл бирга тасния қилинганда музаккар шакли олинади:', ['r', 'ўғил ва қиз талаба — 2 та талаба', 'طَالِبَانِ']],
      ['Тасния замир ва феълда ҳам бор', 'Ўзбек тилида иккилик йўқ, араб тилида эса замир ва феълда ҳам бор:',
        ['r', 'улар иккови', 'هُمَا'], ['r', 'сизлар иккингиз', 'أَنْتُمَا'], ['r', 'иккови (эркак) урди', 'ضَرَبَا'], ['r', 'иккови (аёл) урди', 'ضَرَبَتَا']]
    ],
    y: [
      ['Охири алиф, ё ёки ҳамза билан тугаган исмлар', 'Бундай исмлардан тасния ясалганда охирги ҳарф ўз аслига қайтади ёки ўзгаради:',
        ['r', 'йигит', 'فَتًى → فَتَيَانِ'], ['r', 'таёқ', 'عَصًا → عَصَوَانِ'], ['r', 'қози', 'قَاضٍ → قَاضِيَانِ'], ['r', 'саҳро', 'صَحْرَاءُ → صَحْرَاوَانِ']],
      ['Изофада нун тушади', 'Тасния бошқа исмга изофа қилинганда охиридаги нун тушиб қолади:',
        ['r', 'талабанинг икки китоби', 'كِتَابَانِ → كِتَابَا الطَّالِبِ'], ['r', 'унинг икки қўли', 'يَدَانِ → يَدَاهُ']],
      ['Тағлиб', 'Икки хил нарса улардан бирининг номи билан тасния қилинади:',
        ['r', 'ота-она', 'اَلْأَبَوَانِ'], ['r', 'қуёш ва ой', 'اَلْقَمَرَانِ'], ['r', 'Абу Бакр ва Умар', 'اَلْعُمَرَانِ']]
    ]
  };

  /* ===================== 10-боб · كَانَ ва إِنَّ (46-дарсдан; 21.11.2026) =====================
     Ranglar videodagidek: [g] kaana — tilla, [r] raf — binafsha, [s] nasb — yashil, [n] muannaslik «т»si — pushti, [h] harf. */
  /* mubtado va xabar (46, 47 — kitobda ikkalasida ham bor) */
  var MX = ['gp', [
    ['Ақлли учун', 'لِلْعَاقِلِ', [['k', 'مُذَكَّرٌ', [['b', 'اَلطَّالِبُ كَبِيرٌ'], ['t', 'اَلطَّالِبَانِ كَبِيرَانِ'], ['jt', 'اَلطُّلَّابُ كِبَارٌ'], ['js', 'اَلطَّالِبُونَ كِبَارٌ']]],
      ['n', 'مُؤَنَّثٌ', [['b', 'اَلطَّالِبَةُ كَبِيرَةٌ'], ['t', 'اَلطَّالِبَتَانِ كَبِيرَتَانِ'], ['js', 'اَلطَّالِبَاتُ كَبِيرَاتٌ']]]]],
    ['Ақлсиз учун', 'لِغَيْرِ الْعَاقِلِ', [['k', 'مُذَكَّرٌ', [['b', 'اَلثَّوْرُ كَبِيرٌ'], ['t', 'اَلثَّوْرَانِ كَبِيرَانِ'], ['jt', 'اَلثِّيرَانُ كَبِيرَةٌ']]],
      ['n', 'مُؤَنَّثٌ', [['b', 'اَلْبَقَرَةُ كَبِيرَةٌ'], ['t', 'اَلْبَقَرَتَانِ كَبِيرَتَانِ'], ['js', 'اَلْبَقَرَاتُ كَبِيرَةٌ (كَبِيرَاتٌ)']]]]]]];
  /* tarkib qatorlari: k — kaana shakli va tarkibi; ism/xabar — alomati bilan */
  function tkK(k, t) { return [k, t, 'g']; }
  function tkI(w, k, al) { return [w, '⟨' + k + '⟩ нинг исми, раф қилинган, аломати ' + al, 'r']; }
  function tkX(w, k, al) { return [w, '⟨' + k + '⟩ нинг хабари, насб қилинган, аломати ' + al, 's']; }
  var KTM = 'ноқис мозий феъли, фатҳага мабний, ⟨ت⟩ муаннаслик ҳарфи, сукунга мабний, эъробдан унга ўрин йўқ, 2 сукуннинг ўзаро йўлиқиш қоидаларига кўра касра қилинган';
  var JH = ['لَا', 'жавоб ҳарфи, сукунга мабний, эъробдан унга ўрин йўқ', 'h'];
  function NF(w) { return [w, 'нафий ҳарфи, сукунга мабний, эъробдан унга ўрин йўқ', 'h']; }

  /* ===================== 46-дарс · كَانَ нинг исми ва хабари (1) ===================== */
  T.D[46] = {
    b: [
      ['p', 'Юқоридаги дарсларда биз мубтадо ва хабар раф ўринларидан эканини билиб олган эдик.'],
      ['h', 'r', '1', '**Мубтадо ва хабар**'],
      ['mis', [['اَلطَّالِبُ كَبِيرٌ', 'Толиб каттадир']], 'r', 'k'],
      MX,
      ['h', 'g', '2', '**⟨كَانَ⟩ кирганда**'],
      ['p', 'Энди агар мубтадо ва хабар олдидан ⟨كَانَ⟩ феъли келса, мубтадо раф қилинади ва **⟨كَانَ⟩ нинг исми** деб юритилади, хабар эса насб қилинади ва **⟨كَانَ⟩ нинг хабари** деб юритилади. Демак, ⟨كَانَ⟩ нинг исми исмнинг раф ўринларидан бири, хабари эса исмнинг насб ўринларидан бири саналади. Унга мисол:'],
      ['gl', [['اَلطَّالِ[r]بُ[/]', 'мубтадо', 'раф', 'r'], ['كَبِي[r]رٌ[/]', 'хабар', 'раф', 'r']], 'Толиб каттадир'],
      ['ps', '⟨كَانَ⟩ кирса'],
      ['gl', [['[g]كَانَ[/]', 'ноқис феъл', '', 'g'], ['اَلطَّالِ[r]بُ[/]', '⟨كَانَ⟩ нинг исми', 'раф', 'r'], ['كَبِي[s]رًا[/]', '⟨كَانَ⟩ нинг хабари', 'насб', 's']], 'Толиб катта бўлди (эди)'],
      ['kf', '⟨مُذَكَّرٌ⟩', 'k', [
        ['[g]كَانَ[/]', 'اَلطَّالِبُ كَبِيرٌ', '[g]كَانَ[/] الطَّالِبُ كَبِي[s]رًا[/]', 'Толиб катта бўлди', 'b'],
        ['[g]كَانَ[/]', 'اَلطَّالِبَانِ كَبِيرَانِ', '[g]كَانَ[/] الطَّالِبَانِ كَبِي[s]رَيْنِ[/]', '2 толиб катта бўлди', 't'],
        ['[g]كَانَ[/]', 'اَلطُّلَّابُ كِبَارٌ', '[g]كَانَ[/] الطُّلَّابُ كِبَا[s]رًا[/]', 'Толиблар катта бўлдилар', 'jt'],
        ['[g]كَانَ[/]', 'اَلطَّالِبُونَ كِبَارٌ', '[g]كَانَ[/] الطَّالِبُونَ كِبَا[s]رًا[/]', 'Толиблар катта бўлдилар', 'js']]],
      ['kf', '⟨مُؤَنَّثٌ⟩', 'n', [
        ['[g]كَانَ[n]تْ[/][/]', 'اَلطَّالِبَةُ كَبِيرَةٌ', '[g]كَانَ[n]تِ[/][/] الطَّالِبَةُ كَبِيرَ[s]ةً[/]', 'Толиба катта бўлди', 'b'],
        ['[g]كَانَ[n]تْ[/][/]', 'اَلطَّالِبَتَانِ كَبِيرَتَانِ', '[g]كَانَ[n]تِ[/][/] الطَّالِبَتَانِ كَبِيرَ[s]تَيْنِ[/]', '2 толиба катта бўлди', 't'],
        ['[g]كَانَ[n]تْ[/][/]', 'اَلطَّالِبَاتُ كَبِيرَاتٌ', '[g]كَانَ[n]تِ[/][/] الطَّالِبَاتُ كَبِيرَا[s]تٍ[/]', 'Толибалар катта бўлдилар', 'js']]],
      ['p', 'Юқорида кўрганингиздек, ⟨كَانَ⟩ нинг исми муаннас бўлганида, ⟨كَانَ⟩ феълининг кетига муаннаслик ⟨ت⟩ си боғланади ва 2 сукуннинг ўзаро йўлиқиш қоидаларига кўра ⟨كَانَ⟩ нинг исмига у касра билан боғланади.'],
      ['qd', [['мз', 'исми музаккар', '[g]كَانَ[/]', 'g'], ['мн', 'исми муаннас — кетига муаннаслик «т»си боғланади', '[g]كَانَ[/][n]تْ[/]', 'n'],
        ['2 сукун', 'икки сукун йўлиқади — «т» касра олади', '[g]كَانَ[/][n]تِ[/] الطَّالِبَةُ', 'n']]],
      ['p', '⟨كَانَ⟩ ноқис феъл саналади. Чунки у фоил билан ишламайди. Агар гап қадимда содир бўлган воқеа-ҳодиса ҳақида кетса, ⟨كَانَ⟩ феъли *эди* деб, агар яқинда содир бўлган воқеа-ҳодиса ҳақида кетса, у *бўлди* деб таржима қилинади. Унга мисол:'],
      ['ik', [['m', 'воқеа қадимда бўлган', '«эди»'], ['k', 'воқеа яқинда бўлган', '«бўлди»']]],
      ['mis', [['كَانَ الطَّالِبُ كَبِيرًا.', 'Толиб катта бўлди. Толиб катта эди.']], 'g', 'k'],
      ['h', 's', '3', '**Таркиб**'],
      ['p', 'Келинг, уларнинг таркибларини ҳам кўриб чиқамиз:'],
      ['tk', 'هَلْ [g]كَانَ[/] [r]الطَّالِبُ[/] [s]كَبِيرًا[/]؟', 'Толиб катта бўлдими (эдими)?',
        [tkK('كَانَ', 'ноқис мозий феъли, фатҳага мабний'), tkI('اَلطَّالِبُ', 'كَانَ', 'зоҳирий замма'), tkX('كَبِيرًا', 'كَانَ', 'зоҳирий фатҳа')], 'Жумлатун истифҳомийя.'],
      ['tk', 'نَعَمْ، [g]كَانَ[n]تِ[/][/] [r]الطَّالِبَةُ[/] [s]كَبِيرَةً[/]', 'Ҳа, толиба катта бўлди (эди)',
        [tkK('كَانَ[n]تْ[/]', KTM), tkI('اَلطَّالِبَةُ', 'كَانَتْ', 'зоҳирий замма'), tkX('كَبِيرَةً', 'كَانَتْ', 'зоҳирий фатҳа')], 'Жумлатун хабарийя.'],
      ['p', '⟨كَانَ⟩ нинг манфий кўринишини ясаш учун олдидан ⟨مَا⟩ - ..*мади* нафий ҳарфи қўшилади:'],
      ['ayl', 'كَانَ', 'مَا ', 'كَانَ', 'бўлди, эди → бўлмади, эмас эди', 'h'],
      ['tk', 'أَ [g]كَانَ[/] [r]الطَّالِبَانِ[/] [s]كَبِيرَيْنِ[/]؟', '2 толиб катта бўлдими (эдими)?',
        [tkK('كَانَ', 'ноқис мозий феъли, фатҳага мабний'), tkI('اَلطَّالِبَانِ', 'كَانَ', 'алиф ⟨ا⟩'), tkX('كَبِيرَيْنِ', 'كَانَ', '⟨ي⟩')], 'Жумлатун истифҳомийя.'],
      ['tk', '[h]لَا[/]، [h]مَا[/] [g]كَانَ[n]تِ[/][/] [r]الطَّالِبَتَانِ[/] [s]كَبِيرَتَيْنِ[/]', 'Йўқ, 2 толиба катта бўлмади (… эмас эди)',
        [JH, NF('مَا'), tkK('كَانَ[n]تْ[/]', KTM), tkI('اَلطَّالِبَتَانِ', 'كَانَتْ', 'алиф ⟨ا⟩'), tkX('كَبِيرَتَيْنِ', 'كَانَتْ', '⟨ي⟩')], 'Жумлатун хабарийя.'],
      ['tk', 'هَلْ [g]كَانَ[/] [r]الطَّالِبُونَ[/] [s]كِبَارًا[/]؟', 'Толиблар катта бўлдиларми (эдиларми)?',
        [tkK('كَانَ', 'ноқис мозий феъли, фатҳага мабний'), tkI('اَلطَّالِبُونَ', 'كَانَ', '⟨و⟩'), tkX('كِبَارًا', 'كَانَ', 'зоҳирий фатҳа')], 'Жумлатун истифҳомийя.'],
      ['tk', 'نَعَمْ، [g]كَانَ[/] [r]الطُّلَّابُ[/] [s]كِبَارًا[/]', 'Ҳа, толиблар катта бўлдилар (эдилар)',
        [tkK('كَانَ', 'ноқис мозий феъли, фатҳага мабний'), tkI('اَلطُّلَّابُ', 'كَانَ', 'зоҳирий замма'), tkX('كِبَارًا', 'كَانَ', 'зоҳирий фатҳа')], 'Жумлатун хабарийя.'],
      ['tk', 'لَا، مَا [g]كَانَ[n]تِ[/][/] [r]الطَّالِبَاتُ[/] [s]كَبِيرَاتٍ[/].', 'Йўқ, толибалар катта бўлмадилар (эмас эдилар).',
        [tkK('كَانَ[n]تْ[/]', KTM), tkI('اَلطَّالِبَاتُ', 'كَانَتْ', 'зоҳирий замма'), tkX('كَبِيرَاتٍ', 'كَانَتْ', 'фатҳага ўринбосар касра')], 'Жумлатун хабарийя.']
    ],
    m: [
      { s: 'Агар мубтадо ва хабар олдидан ⟨كَانَ⟩ феъли келса, нима ҳолат содир бўлади? Унга 1 та мисол келтириб, мисолингизни изоҳлаб беринг.',
        j: ['Мубтадо раф қилинади ва **⟨كَانَ⟩ нинг исми** деб юритилади, хабар эса насб қилинади ва **⟨كَانَ⟩ нинг хабари** деб юритилади. Масалан:',
          ['a', 'كَانَ الطَّالِبُ كَبِيرًا', 'Толиб катта бўлди (эди)'],
          ['r', 'ноқис мозий феъли, фатҳага мабний', 'كَانَ'], ['r', '⟨كَانَ⟩ нинг исми, раф қилинган, аломати зоҳирий замма', 'اَلطَّالِبُ'], ['r', '⟨كَانَ⟩ нинг хабари, насб қилинган, аломати зоҳирий фатҳа', 'كَبِيرًا']] },
      { s: '⟨كَانَ⟩ нинг исми ва хабари исмнинг қайси ўринларидан бири саналади?',
        j: '⟨كَانَ⟩ нинг исми — исмнинг **раф** ўринларидан бири (28-дарсдаги 6 та ўриннинг 5-чиси), хабари эса **насб** ўринларидан бири (11 та ўриннинг 10-чиси).' },
      { s: '⟨كَانَ⟩ нинг исми муаннас бўлганида, нима ҳолат содир бўлади?',
        j: ['⟨كَانَ⟩ феълининг кетига муаннаслик ⟨ت⟩ си боғланади ва 2 сукуннинг ўзаро йўлиқиш қоидаларига кўра исмига касра билан боғланади:', ['a', 'كَانَتِ الطَّالِبَةُ كَبِيرَةً', 'Толиба катта бўлди (эди)']] },
      { s: '⟨كَانَ⟩ қандай феъл саналади? Нима учун?', j: '**Ноқис** феъл саналади, чунки у фоил билан ишламайди.' },
      { s: '⟨كَانَ⟩ феъли қандай таржима қилинади?',
        j: ['Гап қадимда содир бўлган воқеа ҳақида кетса — *эди*, яқинда содир бўлган воқеа ҳақида кетса — *бўлди* деб таржима қилинади:', ['a', 'كَانَ الطَّالِبُ كَبِيرًا', 'Толиб катта бўлди. Толиб катта эди.']] },
      { s: '⟨كَانَ⟩ нинг манфий кўриниши қандай ясалади? Унинг манфий кўринишини ясаб, манфий ва мусбат маъноларини айтиб беринг.',
        j: ['Олдидан ⟨مَا⟩ – ..*мади* нафий ҳарфи қўшилади:', ['r', 'мусбат: бўлди, эди', 'كَانَ'], ['r', 'манфий: бўлмади, эмас эди', 'مَا كَانَ']] },
      { s: 'Намунадан фойдаланиб, қуйидаги мубтадо ва хабар олдидан ⟨كَانَ⟩ феълини қўшиб чиқинг ва таржима қилинг:', c: 's gp',
        b: [['kf', 'Намуна', 'k', [['[g]كَانَ[/]', 'اَلطَّالِبُ كَبِيرٌ', '[g]كَانَ[/] الطَّالِبُ كَبِي[s]رًا[/]', 'Толиб катта бўлди (эди)']]]],
        tn: [
          ['اَلْمُعَلِّمُ عَالِمٌ', '⟨كَانَ⟩ қўшинг', ['كَانَ الْمُعَلِّمُ عَالِمًا', 'كَانَ الْمُعَلِّمُ عَالِمٌ', 'كَانَ الْمُعَلِّمَ عَالِمًا'], 0,
            ['', 'Хабар насб қилинади: аломати фатҳа', 'Исм раф қолади: ⟨اَلْمُعَلِّمُ⟩'], 'Муаллим олим бўлди (эди)'],
          ['اَلْمُعَلِّمَانِ عَالِمَانِ', '⟨كَانَ⟩ қўшинг', ['كَانَ الْمُعَلِّمَيْنِ عَالِمَيْنِ', 'كَانَ الْمُعَلِّمَانِ عَالِمَيْنِ', 'كَانَ الْمُعَلِّمَانِ عَالِمَانِ'], 1,
            ['Исм раф қолади: аломати алиф ⟨ا⟩', '', 'Хабар насб қилинади: таснияда аломати ⟨ي⟩'], '2 муаллим олим бўлди (эди)'],
          ['اَلْمُعَلِّمُونَ عَالِمُونَ', '⟨كَانَ⟩ қўшинг', ['كَانَ الْمُعَلِّمُونَ عَالِمُونَ', 'كَانَ الْمُعَلِّمِينَ عَالِمِينَ', 'كَانَ الْمُعَلِّمُونَ عَالِمِينَ'], 2,
            ['Хабар насб қилинади: жам музаккар солимда аломати ⟨ي⟩', 'Исм раф қолади: аломати ⟨و⟩', ''], 'Муаллимлар олим бўлдилар (эдилар)'],
          ['اَلْمُعَلِّمَةُ عَالِمَةٌ', '⟨كَانَتْ⟩ қўшинг', ['كَانَتِ الْمُعَلِّمَةُ عَالِمَةً', 'كَانَ الْمُعَلِّمَةُ عَالِمَةً', 'كَانَتِ الْمُعَلِّمَةُ عَالِمَةٌ'], 0,
            ['', 'Исми муаннас — кетига муаннаслик ⟨ت⟩ си боғланади', 'Хабар насб қилинади: аломати фатҳа'], 'Муаллима олима бўлди (эди)'],
          ['اَلْمُعَلِّمَتَانِ عَالِمَتَانِ', '⟨كَانَتْ⟩ қўшинг', ['كَانَتِ الْمُعَلِّمَتَانِ عَالِمَتَانِ', 'كَانَتْ الْمُعَلِّمَتَانِ عَالِمَتَيْنِ', 'كَانَتِ الْمُعَلِّمَتَانِ عَالِمَتَيْنِ'], 2,
            ['Хабар насб қилинади: аломати ⟨ي⟩', '2 сукун йўлиқса, ⟨ت⟩ касра олади: ⟨كَانَتِ⟩', ''], '2 муаллима олима бўлди (эди)'],
          ['اَلْمُعَلِّمَاتُ عَالِمَاتٌ', '⟨كَانَتْ⟩ қўшинг', ['كَانَتِ الْمُعَلِّمَاتُ عَالِمَاتًا', 'كَانَتِ الْمُعَلِّمَاتُ عَالِمَاتٍ', 'كَانَتِ الْمُعَلِّمَاتُ عَالِمَاتٌ'], 1,
            ['Жам муаннас солимда фатҳа ўрнига касра келади', '', 'Хабар насб қилинади: аломати касра'], 'Муаллималар олима бўлдилар (эдилар)']] },
      { s: 'Қуйидаги гапларни тўғри ўқинг, сўнг таржима ва таркиб қилинг:',
        iz: 'Таркиби — дарсдаги намуналардек: ноқис мозий феъли, исми — раф, хабари — насб.',
        oq: [['1)', [
          ['هل كان الطالب كبيرا؟', 'نعم، كان الطالب كبيرا.', 'هَلْ كَانَ الطَّالِبُ كَبِيرًا؟', 'نَعَمْ، كَانَ الطَّالِبُ كَبِيرًا.', 'Толиб катта бўлдими (эдими)?', 'Ҳа, толиб катта бўлди (эди).'],
          ['أ كان الطالبان كبيرين؟', 'لا، ما كان الطالبان كبيرين.', 'أَ كَانَ الطَّالِبَانِ كَبِيرَيْنِ؟', 'لَا، مَا كَانَ الطَّالِبَانِ كَبِيرَيْنِ.', '2 толиб катта бўлдими (эдими)?', 'Йўқ, 2 толиб катта бўлмади (эмас эди).'],
          ['هل كان الطالبون كبارا؟', 'نعم، كان الطلاب كبارا.', 'هَلْ كَانَ الطَّالِبُونَ كِبَارًا؟', 'نَعَمْ، كَانَ الطُّلَّابُ كِبَارًا.', 'Толиблар катта бўлдиларми (эдиларми)?', 'Ҳа, толиблар катта бўлдилар (эдилар).'],
          ['أ كانت الطالبة كبيرة؟', 'لا، ما كانت الطالبة كبيرة.', 'أَ كَانَتِ الطَّالِبَةُ كَبِيرَةً؟', 'لَا، مَا كَانَتِ الطَّالِبَةُ كَبِيرَةً.', 'Толиба катта бўлдими (эдими)?', 'Йўқ, толиба катта бўлмади (эмас эди).'],
          ['هل كانت الطالبتان كبيرتين؟', 'نعم، كانت الطالبتان كبيرتين.', 'هَلْ كَانَتِ الطَّالِبَتَانِ كَبِيرَتَيْنِ؟', 'نَعَمْ، كَانَتِ الطَّالِبَتَانِ كَبِيرَتَيْنِ.', '2 толиба катта бўлдими (эдими)?', 'Ҳа, 2 толиба катта бўлди (эди).'],
          ['أ كانت الطالبات كبيرات؟', 'لا، ما كانت الطالبات كبيرات.', 'أَ كَانَتِ الطَّالِبَاتُ كَبِيرَاتٍ؟', 'لَا، مَا كَانَتِ الطَّالِبَاتُ كَبِيرَاتٍ.', 'Толибалар катта бўлдиларми (эдиларми)?', 'Йўқ, толибалар катта бўлмадилар (эмас эдилар).']]],
          ['2)', [
          ['هل كان الثور كبيرا؟', 'نعم، كان الثور كبيرا.', 'هَلْ كَانَ الثَّوْرُ كَبِيرًا؟', 'نَعَمْ، كَانَ الثَّوْرُ كَبِيرًا.', 'Буқа катта бўлдими (эдими)?', 'Ҳа, буқа катта бўлди (эди).'],
          ['أ كان الثوران كبيرين؟', 'لا، ما كان الثوران كبيرين.', 'أَ كَانَ الثَّوْرَانِ كَبِيرَيْنِ؟', 'لَا، مَا كَانَ الثَّوْرَانِ كَبِيرَيْنِ.', '2 буқа катта бўлдими (эдими)?', 'Йўқ, 2 буқа катта бўлмади (эмас эди).'],
          ['هل كان الثيران كبيرة؟', 'نعم، كان الثيران كبيرة.', 'هَلْ كَانَ الثِّيرَانُ كَبِيرَةً؟', 'نَعَمْ، كَانَ الثِّيرَانُ كَبِيرَةً.', 'Буқалар катта бўлдими (эдими)?', 'Ҳа, буқалар катта бўлди (эди).'],
          ['أ كانت البقرة كبيرة؟', 'لا، ما كانت البقرة كبيرة.', 'أَ كَانَتِ الْبَقَرَةُ كَبِيرَةً؟', 'لَا، مَا كَانَتِ الْبَقَرَةُ كَبِيرَةً.', 'Сигир катта бўлдими (эдими)?', 'Йўқ, сигир катта бўлмади (эмас эди).'],
          ['هل كانت البقرتان كبيرتين؟', 'نعم، كانت البقرتان كبيرتين.', 'هَلْ كَانَتِ الْبَقَرَتَانِ كَبِيرَتَيْنِ؟', 'نَعَمْ، كَانَتِ الْبَقَرَتَانِ كَبِيرَتَيْنِ.', '2 сигир катта бўлдими (эдими)?', 'Ҳа, 2 сигир катта бўлди (эди).'],
          ['أ كانت البقرات كبيرة؟', 'لا، ما كانت البقرات كبيرات.', 'أَ كَانَتِ الْبَقَرَاتُ كَبِيرَةً؟', 'لَا، مَا كَانَتِ الْبَقَرَاتُ كَبِيرَاتٍ.', 'Сигирлар катта бўлдими (эдими)?', 'Йўқ, сигирлар катта бўлмади (эмас эди). Хабар икки хил ҳам жоиз.']]]] }
    ],
    q: [
      ['Нега «ноқис»?', 'Ноқис — «тўлиқсиз» дегани. Оддий феълга фоили етади — гап тугайди. ⟨كَانَ⟩ эса исми билан тугамайди: «толиб эди…» — нима эди? Унга хабар ҳам керак.',
        ['r', '«Толиб ўтирди» — гап тугади', 'جَلَسَ الطَّالِبُ'], ['r', '«Толиб эди…» — гап чала', 'كَانَ الطَّالِبُ'], ['r', '«Толиб катта эди» — гап тугади', 'كَانَ الطَّالِبُ كَبِيرًا']],
      ['Фақат жинсда мослашади', '⟨كَانَ⟩ исмига жинсда мослашади, сонда эмас: исми иккита ёки кўп бўлса ҳам, ⟨كَانَ⟩ бирликда туради.',
        ['r', '2 толиб', 'كَانَ الطَّالِبَانِ'], ['r', 'толиблар', 'كَانَ الطُّلَّابُ'], ['r', 'толибалар', 'كَانَتِ الطَّالِبَاتُ'],
        'Исми замир бўлса, сонда ҳам ўзгаради («улар эди» — ⟨كَانُوا⟩). Бу ҳақда 48-дарсда.'],
      ['Насб аломатлари бир жойда', 'Хабар доим насбда, лекин аломати сўзнинг турига қараб ҳар хил:',
        ['r', 'муфрад — фатҳа', 'كَبِيرًا'], ['r', 'жам таксир — фатҳа', 'كِبَارًا'], ['r', 'тасния — ⟨ي⟩', 'كَبِيرَيْنِ'],
        ['r', 'жам музаккар солим — ⟨ي⟩', 'عَالِمِينَ'], ['r', 'жам муаннас солим — фатҳа ўрнига касра', 'كَبِيرَاتٍ']],
      ['Ақлсиз нарсалар жами', 'Ақлсиз нарсалар жамида хабар муаннас муфрад бўлиб келади. ⟨كَانَ⟩ кирса, у ҳам насбда:',
        ['r', '«Буқалар катта эди»', 'كَانَ الثِّيرَانُ كَبِيرَةً'], ['r', '«Сигирлар катта эди» — икки хил ҳам жоиз', 'كَانَتِ الْبَقَرَاتُ كَبِيرَةً · كَبِيرَاتٍ']]
    ],
    y: [
      ['Аллоҳ ҳақида — «доимо»', 'Аллоҳнинг сифатлари ҳақидаги гапда ⟨كَانَ⟩ «эди» деб эмас, «доимо» деб таржима қилинади: бу сифат ўтмишда ҳам бор эди, ҳозир ҳам бор.',
        ['a', 'وَكَانَ اللّٰهُ غَفُورًا رَحِيمًا', '«Аллоҳ доимо мағфиратли, раҳмли зотдир»']],
      ['Хабарсиз ⟨كَانَ⟩', 'Баъзан ⟨كَانَ⟩ хабар олмайди ва «бўлди, юз берди, бор бўлди» маъносида келади. Бу ҳолда у ноқис эмас — **тўлиқ (томма)** феъл, кейинги исм эса унинг фоили:',
        ['a', 'وَإِنْ كَانَ ذُو عُسْرَةٍ', '«Агар (қарздор) танг аҳволда бўлса…» (Бақара, 280)']],
      ['«Айланди» маъноси', 'Баъзан ⟨كَانَ⟩ «айланди, бўлиб қолди» маъносида келади — ⟨صَارَ⟩ каби:',
        ['a', 'وَفُتِحَتِ السَّمَاءُ فَكَانَتْ أَبْوَابًا', '«Осмон очилиб, эшиклар бўлиб қолди» (Набаъ, 19)']]
    ]
  };

  /* ===================== 47-дарс · كَانَ нинг исми ва хабари (2) ===================== */
  T.D[47] = {
    b: [
      ['p', '⟨كَانَ⟩ нинг музорийси ҳам мозийсининг ишини бажаради. Яъни у ҳам мубтадо ва хабар олдидан келганида, мубтадо унинг исми ва хабар эса унинг хабари бўлади. ⟨كَانَ⟩ нинг музорийси ҳам ноқис феъл саналади, чунки унинг ҳам фоили бўлмайди.'],
      ['vaqt', [['m', 'ўтган замон', 'Мозий', 'كَانَ', 'бўлди'], ['z', 'ҳозир · келаси', 'Музорий', 'يَكُونُ', 'бўлади']], 'n2'],
      ['p', '⟨يَكُونُ⟩ кўрганингиздек, “бўлади” деб таржима қилинади.'],
      ['h', 'r', '1', '**Мубтадо ва хабар**'],
      ['mis', [['اَلطَّالِبُ كَبِيرٌ', 'Толиб каттадир']], 'r', 'k'],
      MX,
      ['h', 'g', '2', '**⟨يَكُونُ⟩ кирганда**'],
      ['gl', [['[g]يَكُونُ[/]', 'ноқис феъл', '', 'g'], ['اَلطَّالِ[r]بُ[/]', '⟨يَكُونُ⟩ нинг исми', 'раф', 'r'], ['كَبِي[s]رًا[/]', '⟨يَكُونُ⟩ нинг хабари', 'насб', 's']], 'Толиб катта бўлади'],
      ['kf', '⟨مُذَكَّرٌ⟩', 'k', [
        ['[g]يَكُونُ[/]', 'اَلطَّالِبُ كَبِيرٌ', '[g]يَكُونُ[/] الطَّالِبُ كَبِي[s]رًا[/]', 'Толиб катта бўлади', 'b'],
        ['[g]يَكُونُ[/]', 'اَلطَّالِبَانِ كَبِيرَانِ', '[g]يَكُونُ[/] الطَّالِبَانِ كَبِي[s]رَيْنِ[/]', '2 толиб катта бўлади', 't'],
        ['[g]يَكُونُ[/]', 'اَلطُّلَّابُ كِبَارٌ', '[g]يَكُونُ[/] الطُّلَّابُ كِبَا[s]رًا[/]', 'Толиблар катта бўладилар', 'jt']]],
      ['kf', '⟨مُؤَنَّثٌ⟩', 'n', [
        ['[g][n]تَ[/]كُونُ[/]', 'اَلطَّالِبَةُ كَبِيرَةٌ', '[g][n]تَ[/]كُونُ[/] الطَّالِبَةُ كَبِيرَ[s]ةً[/]', 'Толиба катта бўлади', 'b'],
        ['[g][n]تَ[/]كُونُ[/]', 'اَلطَّالِبَتَانِ كَبِيرَتَانِ', '[g][n]تَ[/]كُونُ[/] الطَّالِبَتَانِ كَبِيرَ[s]تَيْنِ[/]', '2 толиба катта бўлади', 't'],
        ['[g][n]تَ[/]كُونُ[/]', 'اَلطَّالِبَاتُ كَبِيرَاتٌ', '[g][n]تَ[/]كُونُ[/] الطَّالِبَاتُ كَبِيرَا[s]تٍ[/]', 'Толибалар катта бўладилар', 'js']]],
      ['p', 'Юқорида кўрганингиздек, ⟨يَكُونُ⟩ нинг исми муаннас бўлганида, ундаги музороат ҳарфи ⟨ت⟩ га ўзгаради.'],
      ['ayl', 'يَكُونُ', 'تَ', 'كُونُ', 'музороат ҳарфи ⟨ت⟩ га ўзгаради', 'n'],
      ['h', 's', '3', '**Таркиб**'],
      ['p', 'Келинг, уларнинг таркибларини ҳам кўриб чиқамиз:'],
      ['tk', 'هَلْ [g]يَكُونُ[/] [r]الطَّالِبُ[/] [s]كَبِيرًا[/]؟', 'Толиб катта бўладими?',
        [tkK('يَكُونُ', 'ноқис музорий феъли'), tkI('اَلطَّالِبُ', 'يَكُونُ', 'зоҳирий замма'), tkX('كَبِيرًا', 'يَكُونُ', 'зоҳирий фатҳа')], 'Жумлатун истифҳомийя.'],
      ['tk', 'نَعَمْ، [g][n]تَ[/]كُونُ[/] [r]الطَّالِبَةُ[/] [s]كَبِيرَةً[/]', 'Ҳа, толиба катта бўлади',
        [tkK('[n]تَ[/]كُونُ', 'ноқис музорий феъли'), tkI('اَلطَّالِبَةُ', 'تَكُونُ', 'зоҳирий замма'), tkX('كَبِيرَةً', 'تَكُونُ', 'зоҳирий фатҳа')], 'Жумлатун хабарийя.'],
      ['p', '⟨يَكُونُ⟩ нинг манфий кўринишини ясаш учун олдидан ⟨لَا⟩ - ..*майди* нафий ҳарфи қўшилади:'],
      ['ayl', 'يَكُونُ', 'لَا ', 'يَكُونُ', 'бўляпти, бўлади → бўлмаяпти, бўлмайди', 'h'],
      ['tk', 'أَ [g]يَكُونُ[/] [r]الطَّالِبَانِ[/] [s]كَبِيرَيْنِ[/]؟', '2 толиб катта бўляптими?',
        [tkK('يَكُونُ', 'ноқис музорий феъли'), tkI('اَلطَّالِبَانِ', 'يَكُونُ', 'алиф ⟨ا⟩'), tkX('كَبِيرَيْنِ', 'يَكُونُ', '⟨ي⟩')], 'Жумлатун истифҳомийя.'],
      ['tk', '[h]لَا[/]، [h]لَا[/] [g][n]تَ[/]كُونُ[/] [r]الطَّالِبَتَانِ[/] [s]كَبِيرَتَيْنِ[/]', 'Йўқ, 2 толиба катта бўлмаяпти',
        [JH, NF('لَا'), tkK('[n]تَ[/]كُونُ', 'ноқис музорий феъли'), tkI('اَلطَّالِبَتَانِ', 'تَكُونُ', 'алиф ⟨ا⟩'), tkX('كَبِيرَتَيْنِ', 'تَكُونُ', '⟨ي⟩')], 'Жумлатун хабарийя.'],
      ['tk', 'هَلْ [g]يَكُونُ[/] [r]الطَّالِبُونَ[/] [s]كِبَارًا[/]؟', 'Толиблар катта бўладиларми?',
        [tkK('يَكُونُ', 'ноқис музорий феъли'), tkI('اَلطَّالِبُونَ', 'يَكُونُ', '⟨و⟩'), tkX('كِبَارًا', 'يَكُونُ', 'зоҳирий фатҳа')], 'Жумлатун истифҳомийя.'],
      ['tk', 'لَا، لَا [g][n]تَ[/]كُونُ[/] [r]الطَّالِبَاتُ[/] [s]كَبِيرَاتٍ[/]', 'Йўқ, толибалар катта бўлмайди',
        [tkK('[n]تَ[/]كُونُ', 'ноқис музорий феъли'), tkI('اَلطَّالِبَاتُ', 'تَكُونُ', 'зоҳирий замма'), tkX('كَبِيرَاتٍ', 'تَكُونُ', 'фатҳага ўринбосар касра')], 'Жумлатун хабарийя.']
    ],
    m: [
      { s: 'Агар мубтадо ва хабар олдидан ⟨يَكُونُ⟩ феъли келса, нима ҳолат содир бўлади? Унга 1 та мисол келтириб, мисолингизни изоҳлаб беринг.',
        j: ['Мубтадо унинг исми, хабар эса унинг хабари бўлади: исми раф, хабари насб қилинади. Масалан:',
          ['a', 'يَكُونُ الطَّالِبُ كَبِيرًا', 'Толиб катта бўлади'],
          ['r', 'ноқис музорий феъли', 'يَكُونُ'], ['r', '⟨يَكُونُ⟩ нинг исми, раф қилинган, аломати зоҳирий замма', 'اَلطَّالِبُ'], ['r', '⟨يَكُونُ⟩ нинг хабари, насб қилинган, аломати зоҳирий фатҳа', 'كَبِيرًا']] },
      { s: '⟨يَكُونُ⟩ нинг исми ва хабари исмнинг қайси ўринларидан бири саналади?',
        j: 'Исми — исмнинг **раф** ўринларидан бири, хабари — **насб** ўринларидан бири (⟨كَانَ⟩ нинг исми ва хабари каби).' },
      { s: '⟨يَكُونُ⟩ нинг исми муаннас бўлганида, нима ҳолат содир бўлади?',
        j: ['Ундаги музороат ҳарфи ⟨ت⟩ га ўзгаради:', ['a', 'تَكُونُ الطَّالِبَةُ كَبِيرَةً', 'Толиба катта бўлади']] },
      { s: '⟨يَكُونُ⟩ қандай феъл саналади? Нима учун?', j: '**Ноқис** феъл саналади, чунки унинг ҳам фоили бўлмайди.' },
      { s: '⟨يَكُونُ⟩ феъли қандай таржима қилинади?', j: '“Бўлади” деб таржима қилинади.' },
      { s: '⟨يَكُونُ⟩ нинг манфий кўриниши қандай ясалади? Унинг манфий кўринишини ясаб, манфий ва мусбат маъноларини айтиб беринг.',
        j: ['Олдидан ⟨لَا⟩ – ..*майди* нафий ҳарфи қўшилади:', ['r', 'мусбат: бўляпти, бўлади', 'يَكُونُ'], ['r', 'манфий: бўлмаяпти, бўлмайди', 'لَا يَكُونُ']] },
      { s: 'Намунадан фойдаланиб, қуйидаги мубтадо ва хабар олдидан ⟨يَكُونُ⟩ феълини қўшиб чиқинг ва таржима қилинг:', c: 's gp',
        b: [['kf', 'Намуна', 'k', [['[g]يَكُونُ[/]', 'اَلطَّالِبُ كَبِيرٌ', '[g]يَكُونُ[/] الطَّالِبُ كَبِي[s]رًا[/]', 'Толиб катта бўляпти']]]],
        tn: [
          ['اَلْمُعَلِّمُ عَالِمٌ', '⟨يَكُونُ⟩ қўшинг', ['يَكُونُ الْمُعَلِّمُ عَالِمٌ', 'كَانَ الْمُعَلِّمُ عَالِمًا', 'يَكُونُ الْمُعَلِّمُ عَالِمًا'], 2,
            ['Хабар насб қилинади: аломати фатҳа', 'Бу — мозий; бизга музорийси керак: ⟨يَكُونُ⟩', ''], 'Муаллим олим бўлади'],
          ['اَلْمُعَلِّمَانِ عَالِمَانِ', '⟨يَكُونُ⟩ қўшинг', ['يَكُونُ الْمُعَلِّمَانِ عَالِمَيْنِ', 'يَكُونُ الْمُعَلِّمَيْنِ عَالِمَيْنِ', 'يَكُونُ الْمُعَلِّمَانِ عَالِمَانِ'], 0,
            ['', 'Исм раф қолади: аломати алиф ⟨ا⟩', 'Хабар насб қилинади: таснияда аломати ⟨ي⟩'], '2 муаллим олим бўлади'],
          ['اَلْمُعَلِّمُونَ عَالِمُونَ', '⟨يَكُونُ⟩ қўшинг', ['يَكُونُ الْمُعَلِّمُونَ عَالِمُونَ', 'يَكُونُ الْمُعَلِّمُونَ عَالِمِينَ', 'تَكُونُ الْمُعَلِّمُونَ عَالِمِينَ'], 1,
            ['Хабар насб қилинади: жам музаккар солимда аломати ⟨ي⟩', '', 'Исми музаккар — музороат ҳарфи ⟨ي⟩'], 'Муаллимлар олим бўладилар'],
          ['اَلْمُعَلِّمَةُ عَالِمَةٌ', '⟨تَكُونُ⟩ қўшинг', ['يَكُونُ الْمُعَلِّمَةُ عَالِمَةً', 'تَكُونُ الْمُعَلِّمَةُ عَالِمَةً', 'تَكُونُ الْمُعَلِّمَةُ عَالِمَةٌ'], 1,
            ['Исми муаннас — музороат ҳарфи ⟨ت⟩ га ўзгаради', '', 'Хабар насб қилинади: аломати фатҳа'], 'Муаллима олима бўлади'],
          ['اَلْمُعَلِّمَتَانِ عَالِمَتَانِ', '⟨تَكُونُ⟩ қўшинг', ['تَكُونُ الْمُعَلِّمَتَانِ عَالِمَتَيْنِ', 'تَكُونُ الْمُعَلِّمَتَانِ عَالِمَتَانِ', 'يَكُونُ الْمُعَلِّمَتَانِ عَالِمَتَيْنِ'], 0,
            ['', 'Хабар насб қилинади: аломати ⟨ي⟩', 'Исми муаннас — ⟨تَكُونُ⟩'], '2 муаллима олима бўлади'],
          ['اَلْمُعَلِّمَاتُ عَالِمَاتٌ', '⟨تَكُونُ⟩ қўшинг', ['تَكُونُ الْمُعَلِّمَاتُ عَالِمَاتٌ', 'تَكُونُ الْمُعَلِّمَاتُ عَالِمَاتًا', 'تَكُونُ الْمُعَلِّمَاتُ عَالِمَاتٍ'], 2,
            ['Хабар насб қилинади: аломати касра', 'Жам муаннас солимда фатҳа ўрнига касра келади', ''], 'Муаллималар олима бўладилар']] },
      { s: 'Қуйидаги гапларни тўғри ўқинг, сўнг таржима ва таркиб қилинг:',
        iz: 'Таркиби — дарсдаги намуналардек: ноқис музорий феъли, исми — раф, хабари — насб.',
        oq: [['1)', [
          ['هل يكون الطالب كبيرا؟', 'نعم، يكون الطالب كبيرا.', 'هَلْ يَكُونُ الطَّالِبُ كَبِيرًا؟', 'نَعَمْ، يَكُونُ الطَّالِبُ كَبِيرًا.', 'Толиб катта бўладими?', 'Ҳа, толиб катта бўлади.'],
          ['أ يكون الطالبان كبيرين؟', 'لا، لا يكون الطالبان كبيرين.', 'أَ يَكُونُ الطَّالِبَانِ كَبِيرَيْنِ؟', 'لَا، لَا يَكُونُ الطَّالِبَانِ كَبِيرَيْنِ.', '2 толиб катта бўладими?', 'Йўқ, 2 толиб катта бўлмайди.'],
          ['هل يكون الطالبون كبارا؟', 'نعم، يكون الطلاب كبارا.', 'هَلْ يَكُونُ الطَّالِبُونَ كِبَارًا؟', 'نَعَمْ، يَكُونُ الطُّلَّابُ كِبَارًا.', 'Толиблар катта бўладиларми?', 'Ҳа, толиблар катта бўладилар.'],
          ['أ تكون الطالبة كبيرة؟', 'لا، لا تكون الطالبة كبيرة.', 'أَ تَكُونُ الطَّالِبَةُ كَبِيرَةً؟', 'لَا، لَا تَكُونُ الطَّالِبَةُ كَبِيرَةً.', 'Толиба катта бўладими?', 'Йўқ, толиба катта бўлмайди.'],
          ['هل تكون الطالبتان كبيرتين؟', 'نعم، تكون الطالبتان كبيرتين.', 'هَلْ تَكُونُ الطَّالِبَتَانِ كَبِيرَتَيْنِ؟', 'نَعَمْ، تَكُونُ الطَّالِبَتَانِ كَبِيرَتَيْنِ.', '2 толиба катта бўладими?', 'Ҳа, 2 толиба катта бўлади.'],
          ['أ تكون الطالبات كبيرات؟', 'لا، لا تكون الطالبات كبيرات.', 'أَ تَكُونُ الطَّالِبَاتُ كَبِيرَاتٍ؟', 'لَا، لَا تَكُونُ الطَّالِبَاتُ كَبِيرَاتٍ.', 'Толибалар катта бўладиларми?', 'Йўқ, толибалар катта бўлмайдилар.']]],
          ['2)', [
          ['هل يكون الثور كبيرا؟', 'نعم، يكون الثور كبيرا.', 'هَلْ يَكُونُ الثَّوْرُ كَبِيرًا؟', 'نَعَمْ، يَكُونُ الثَّوْرُ كَبِيرًا.', 'Буқа катта бўладими?', 'Ҳа, буқа катта бўлади.'],
          ['أ يكون الثوران كبيرين؟', 'لا، لا يكون الثوران كبيرين.', 'أَ يَكُونُ الثَّوْرَانِ كَبِيرَيْنِ؟', 'لَا، لَا يَكُونُ الثَّوْرَانِ كَبِيرَيْنِ.', '2 буқа катта бўладими?', 'Йўқ, 2 буқа катта бўлмайди.'],
          ['هل يكون الثيران كبيرة؟', 'نعم، يكون الثيران كبيرة.', 'هَلْ يَكُونُ الثِّيرَانُ كَبِيرَةً؟', 'نَعَمْ، يَكُونُ الثِّيرَانُ كَبِيرَةً.', 'Буқалар катта бўладими?', 'Ҳа, буқалар катта бўлади.'],
          ['أ تكون البقرة كبيرة؟', 'لا، لا تكون البقرة كبيرة.', 'أَ تَكُونُ الْبَقَرَةُ كَبِيرَةً؟', 'لَا، لَا تَكُونُ الْبَقَرَةُ كَبِيرَةً.', 'Сигир катта бўладими?', 'Йўқ, сигир катта бўлмайди.'],
          ['هل تكون البقرتان كبيرتين؟', 'نعم، تكون البقرتان كبيرتين.', 'هَلْ تَكُونُ الْبَقَرَتَانِ كَبِيرَتَيْنِ؟', 'نَعَمْ، تَكُونُ الْبَقَرَتَانِ كَبِيرَتَيْنِ.', '2 сигир катта бўладими?', 'Ҳа, 2 сигир катта бўлади.'],
          ['أ تكون البقرات كبيرة؟', 'لا، لا تكون البقرات كبيرات.', 'أَ تَكُونُ الْبَقَرَاتُ كَبِيرَةً؟', 'لَا، لَا تَكُونُ الْبَقَرَاتُ كَبِيرَاتٍ.', 'Сигирлар катта бўладими?', 'Йўқ, сигирлар катта бўлмайди. Хабар икки хил ҳам жоиз.']]]] }
    ],
    q: [
      ['⟨كَانَ⟩ + музорий = «қилар эди»', '⟨كَانَ⟩ нинг хабари музорий феъл бўлса, «қилар эди» маъноси чиқади — ўтмишда такрорланиб турган иш. Хабар — бутун жумла, шунинг учун феълнинг охири ўзгармайди: жумла насб ўрнида туради.',
        ['a', 'كَانَ الشَّيْخُ يَقْرَأُ الْقُرْآنَ كُلَّ لَيْلَةٍ', '«Мўйсафид ҳар кеча Қуръон ўқир эди»'],
        'Қуръонда Исмоил алайҳиссалом ҳақида:',
        ['a', 'وَكَانَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ وَكَانَ عِنْدَ رَبِّهِ مَرْضِيًّا', '«У аҳлини намоз ва закотга буюрар эди ва Раббининг ҳузурида рози бўлинган зот эди» (Марям, 55)']],
      ['«Бўлади» ва «қилар эди» фарқи',
        ['r', '⟨يَكُونُ⟩ — «бўлади»', 'يَكُونُ الطَّالِبُ كَبِيرًا'], ['r', '⟨كَانَ⟩ + музорий — «ёзар эди»', 'كَانَ الطَّالِبُ يَكْتُبُ']],
      ['Жавобдаги икки ⟨لَا⟩', 'Биринчиси — «йўқ» (жавоб ҳарфи), иккинчиси — «…майди» (нафий ҳарфи). «Ҳа» эса — ⟨نَعَمْ⟩.',
        ['a', 'لَا، لَا تَكُونُ الطَّالِبَتَانِ كَبِيرَتَيْنِ', 'Йўқ, 2 толиба катта бўлмаяпти']],
      ['Ақлсиз нарсалар жами', 'Муаннас жамда хабар икки хил келади — иккаласи ҳам жоиз:',
        ['r', '«Сигирлар катта бўлади»', 'تَكُونُ الْبَقَرَاتُ كَبِيرَةً · كَبِيرَاتٍ']]
    ],
    y: [
      ['⟨سَ⟩ билан — фақат келаси замон', '⟨يَكُونُ⟩ ҳозирги ва келаси замонни билдиради. Олдига ⟨سَ⟩ ёки ⟨سَوْفَ⟩ келса — фақат келаси замон:',
        ['r', '«Толиб катта бўлади» (келажакда)', 'سَيَكُونُ الطَّالِبُ كَبِيرًا']],
      ['⟨لَمْ⟩ билан — ўтган замон инкори', '⟨لَمْ⟩ музорийни ўтган замон инкорига айлантиради ва охирини сукун қилади: икки сукун йўлиқиб, ⟨و⟩ тушади. Баъзан нун ҳам тушиб қолади:',
        ['r', '«Толиб катта бўлмади»', 'لَمْ يَكُنِ الطَّالِبُ كَبِيرًا'],
        ['a', 'وَقَدْ خَلَقْتُكَ مِنْ قَبْلُ وَلَمْ تَكُ شَيْئًا', '«Ҳолбуки, Мен сени илгари, сен ҳеч нарса бўлмаган ҳолингда яратганман» (Марям, 9)']]
    ]
  };

  /* ===================== 48-дарс · Муттасил замирлар (5) — كَانَ нинг мозийдаги исми ===================== */
  /* kitob jadvallari kitobdagidek: ustun — shaxs va jins (III shaxs o'ngda), qator — son; tarjima har shakl tagida; kaana tilla, zamir — raf (binafsha) */
  var TH48 = { h1: [['III шахс', 2], ['II шахс', 2], ['I шахс', 1]], h2: [['музаккар', 'k'], ['муаннас', 'n'], ['музаккар', 'k'], ['муаннас', 'n'], ['муз. · муан.', '']] };
  var KT48 = { h1: TH48.h1, h2: TH48.h2, r: [
    ['муфрад', [['[g]كَانَ[/]', 'бўлди'], ['[g]كَانَ[/][n]تْ[/]', 'бўлди'], ['[g]كُنْ[/][r]تَ[/]', 'бўлдинг'], ['[g]كُنْ[/][r]تِ[/]', 'бўлдинг'], ['[g]كُنْ[/][r]تُ[/]', 'бўлдим']]],
    ['тасния', [['[g]كَانَ[/][r]ا[/]', 'иккови бўлди'], ['[g]كَانَ[/][n]تَ[/][r]ا[/]', 'иккови бўлди'], ['[g]كُنْ[/][r]تُمَا[/]', 'икковинг бўлдинг', 'c2'], 0, ['[g]كُ[/][r]نَّا[/]', 'бўлдик', 'r2']]],
    ['жам', [['[g]كَانُ[/][r]و[/]ا', 'бўлдилар'], ['[g]كُ[/][r]نَّ[/]', 'бўлдилар'], ['[g]كُنْ[/][r]تُمْ[/]', 'бўлдинглар'], ['[g]كُنْ[/][r]تُنَّ[/]', 'бўлдинглар'], 0]]] };
  var ZT48 = { h1: TH48.h1, h2: TH48.h2, r: [
    ['муфрад', [['—', 'яширин ⟨هُوَ⟩'], ['—', 'яширин ⟨هِيَ⟩'], ['[r]تَ[/]'], ['[r]تِ[/]'], ['[r]تُ[/]']]],
    ['тасния', [['[r]ا[/]'], ['[r]ا[/]'], ['[r]تُمَا[/]', '', 'c2'], 0, ['[r]نَا[/]', '', 'r2']]],
    ['жам', [['[r]و[/]'], ['[r]نَ[/]'], ['[r]تُمْ[/]'], ['[r]تُنَّ[/]'], 0]]] };
  /* harakatsiz gap javobining qisqa tarkibi */
  function TZ(k, ism, x, al) { return '**Таркиби:** ⟨' + k + '⟩ нинг исми — ' + ism + '; хабари ⟨' + x + '⟩ — насб, аломати ' + al; }
  var S48 = 'Исм замир бўлса, сонда ҳам мослашади';

  T.D[48] = {
    b: [
      ['p', 'Ўтган дарсларда муттасил замирлар ичида феълнинг кетидан қўшилиб, унинг ажралмас бир қисми бўлган муттасил замирлар борлиги ҳақида ҳамда бу тур замирлар фоил вазифасини бажарувчи замирлар экани хусусида сўз юритган эдик. ⟨كَانَ⟩ нинг исми бўлган замирлар шу тур замирлардан саналади. ⟨كَانَ⟩ феъли шаклан 3 тур: мозий, музорий ва амрга бўлинар экан, бундай замирлар қуйидагиларга бўлинади:'],
      ['vaqt', [['m', '1 · шу дарс', 'Мозийдаги исми', 'كَانَ', 'бўлди'], ['z', '2 · 49-дарс', 'Музорийдаги исми', 'يَكُونُ', 'бўлади'], ['a', '3 · 50-дарс', 'Амрдаги исми', 'كُنْ', 'бўл']]],
      ['h', 'g', '1', '**⟨كَانَ⟩ нинг тусланиши**', 'бўлди, эди'],
      ['p', '⟨كَانَ⟩ – *бўлди, эди* ноқис мозий феълининг тусланиши:'],
      ['tsl', KT48],
      ['h', 'r', '2', '**Исми бўлган замирлар**'],
      ['p', '⟨كَانَ⟩ *ноқис мозий* феълидаги ⟨كَانَ⟩ нинг исми вазифасини бажарувчи муттасил замирлар:'],
      ['tsl', ZT48],
      ['p', 'Кўрганингиздек, ⟨كَانَ⟩ нинг исми вазифасини бажарувчи муттасил замирлар худди мозий феълидаги фоил вазифасини бажарувчи замирларнинг айни ўзидир.'],
      ['h', 's', '3', '**Таркиб**'],
      ['p', 'Келинг, уларни таркиблари билан кўриб чиқамиз:'],
      ['tk', 'نَعَمْ، [g]كَانَ[/] [s]كَبِيرًا[/]', 'Ҳа, (у) катта бўлди (эди)',
        [tkK('كَانَ', 'ноқис мозий феъли, фатҳага мабний, тагида жоиз ҳолдаги ⟨هُوَ⟩ мустатир замир бор бўлиб, у ⟨كَانَ⟩ нинг исми'), tkX('كَبِيرًا', 'كَانَ', 'зоҳирий фатҳа')],
        'Жумлатун хабарийя.', ['أَ [g]كَانَ[/] [r]الطَّالِبُ[/] [s]كَبِيرًا[/]؟', 'Толиб катта бўлдими (эдими)?']],
      ['p', '⟨كَانَ⟩ *ноқис мозий* феълининг манфий кўриниши, бошқа мозий феълларидек, олдидан ⟨مَا⟩ нафий ҳарфининг келиши билан ясалади:'],
      ['ayl', 'كَانَ', 'مَا ', 'كَانَ', 'бўлди, эди → бўлмади, эмас эди', 'h'],
      ['p', '⟨كَانَ⟩ *ноқис мозий* феъли тусланишга тааллуқли бўлган ўз ҳукмларида бошқа мозий феъллари кабидир.'],
      ['tk', '[h]لَا[/]، [h]مَا[/] [g]كَانُ[r]و[/]ا[/] [s]كِبَارًا[/]', 'Йўқ, (улар) катта бўлмадилар (эмас эдилар)',
        [JH, NF('مَا'), tkK('كَانُ[r]و[/]ا', 'ноқис мозий феъли, заммага мабний, ⟨و⟩ бориз муттасил замир бўлиб, у ⟨كَانُوا⟩ нинг исми, сукунга мабний, раф ўринда, ⟨ا⟩ фарқлаш ҳарфи, сукунга мабний, эъробдан унга ўрин йўқ'),
          tkX('كِبَارًا', 'كَانُوا', 'зоҳирий фатҳа')],
        'Жумлатун хабарийя.', ['هَلْ [g]كَانَ[/] [r]الطُّلَّابُ[/] [s]كِبَارًا[/]؟', 'Толиблар катта бўлдиларми (эдиларми)?']],
      ['tk', 'نَعَمْ، [g]كَانَ[n]تْ[/][/] [s]كَبِيرَةً[/]', 'Ҳа, (у) катта бўлди (эди)',
        [tkK('كَانَ[n]تْ[/]', 'ноқис мозий феъли, фатҳага мабний, ⟨ت⟩ муаннаслик ҳарфи, сукунга мабний, эъробдан унга ўрин йўқ, тагида жоиз ҳолдаги ⟨هِيَ⟩ мустатир замир бор бўлиб, у ⟨كَانَتْ⟩ нинг исми'),
          tkX('كَبِيرَةً', 'كَانَتْ', 'зоҳирий фатҳа')],
        'Жумлатун хабарийя.', ['أَ [g]كَانَ[n]تِ[/][/] [r]الطَّالِبَةُ[/] [s]كَبِيرَةً[/]؟', 'Толиба катта бўлдими (эдими)?']],
      ['tk', '[h]لَا[/]، [h]مَا[/] [g]كَانَ[n]تَ[/][r]ا[/][/] [s]كَبِيرَتَيْنِ[/]', 'Йўқ, иккови катта бўлмади (эмас эди)',
        [JH, NF('مَا'), tkK('كَانَ[n]تَ[/][r]ا[/]', 'ноқис мозий феъли, фатҳага мабний, ⟨ت⟩ муаннаслик ҳарфи, аслида сукунга мабний, кетидан келган ⟨ا⟩ га мос равишда фатҳа қилинган, ⟨ا⟩ бориз муттасил замир бўлиб, у ⟨كَانَتَا⟩ нинг исми, сукунга мабний, раф ўринда'),
          tkX('كَبِيرَتَيْنِ', 'كَانَتَا', '⟨ي⟩')],
        'Жумлатун хабарийя.', ['هَلْ [g]كَانَ[n]تِ[/][/] [r]الطَّالِبَتَانِ[/] [s]كَبِيرَتَيْنِ[/]؟', '2 толиба катта бўлдими (эдими)?']],
      ['tk', 'نَعَمْ، [g]كُ[r]نَّ[/][/] [s]كَبِيرَاتٍ[/]', 'Ҳа, (улар) катта бўлдилар (эдилар)',
        [tkK('كُ[r]نَّ[/]', 'ноқис мозий феъли, сукунга мабний, ⟨ن⟩ бориз муттасил замир бўлиб, у ⟨كُنَّ⟩ нинг исми, фатҳага мабний, раф ўринда, иккинчиси ҳаракатли бўлгани боис биринчи нун иккинчисига идғом қилинган'),
          tkX('كَبِيرَاتٍ', 'كُنَّ', 'фатҳага ўринбосар касра')],
        'Жумлатун хабарийя.', ['هَلْ [g]كَانَ[n]تِ[/][/] [r]الطَّالِبَاتُ[/] [s]كَبِيرَاتٍ[/]؟', 'Толибалар катта бўлдиларми (эдиларми)?']],
      ['tk', 'أَ [g]كُنْ[r]تَ[/][/] [s]كَبِيرًا[/] يَا طَالِبُ؟', 'Эй толиб, катта бўлдингми (эдингми)?',
        [tkK('كُنْ[r]تَ[/]', 'ноқис мозий феъли, сукунга мабний, ⟨ت⟩ бориз муттасил замир бўлиб, у ⟨كُنْتَ⟩ нинг исми, фатҳага мабний, раф ўринда'),
          tkX('كَبِيرًا', 'كُنْتَ', 'зоҳирий фатҳа')],
        'Жумлатун истифҳомийя.']
    ],
    m: [
      { s: '⟨كَانَ⟩ нинг тўлиқ тусланишининг арабчаси ва таржимасини айтиб беринг.', ty: KT48 },
      { s: '⟨كَانَ⟩ нинг исми вазифасини бажарувчи муттасил замирлар қайси феъл замирларига ўхшайди?',
        j: ['Мозий феълидаги **фоил** вазифасини бажарувчи замирларнинг айни ўзидир:', ['r', 'фоил — «ёздим»', 'كَتَبْتُ'], ['r', '⟨كَانَ⟩ нинг исми — «бўлдим»', 'كُنْتُ']] },
      { s: 'Нуқталар ўрнига ⟨كَانَ⟩ ни исми билан эмас, балки унга мос замир билан ифода этинг ва иккала гапнинг таржимасини айтиб беринг:', c: 'g gp',
        tn: [
          ['هَلْ كَانَ الطَّالِبُ كَبِيرًا؟<br>نَعَمْ، … كَبِيرًا.', 'нуқталар ўрнига', ['كَانُوا', 'كَانَ', 'كُنْتَ'], 1,
            ['Толиб битта — ⟨كَانُوا⟩ кўплик учун', '', '⟨كُنْتَ⟩ — «сен»; бу ерда «у» ҳақида гап'], 'Толиб катта бўлдими (эдими)? — Ҳа, (у) катта бўлди (эди).'],
          ['هَلْ كَانَ الطَّالِبَانِ كَبِيرَيْنِ؟<br>لَا، مَا … كَبِيرَيْنِ.', 'нуқталар ўрнига', ['كَانَ', 'كَانَتَا', 'كَانَا'], 2,
            [S48 + ': иккита — ⟨كَانَا⟩', 'Толиблар музаккар — ⟨كَانَتَا⟩ муаннас учун', ''], '2 толиб катта бўлдими (эдими)? — Йўқ, (иккови) катта бўлмади (эмас эди).'],
          ['هَلْ كَانَ الطُّلَّابُ كِبَارًا؟<br>نَعَمْ، … كِبَارًا.', 'нуқталар ўрнига', ['كَانُوا', 'كُنَّ', 'كُنْتُمْ'], 0,
            ['', '⟨كُنَّ⟩ — муаннаслар учун', '⟨كُنْتُمْ⟩ — «сизлар», II шахс'], 'Толиблар катта бўлдиларми (эдиларми)? — Ҳа, (улар) катта бўлдилар (эдилар).'],
          ['هَلْ كَانَتِ الطَّالِبَةُ كَبِيرَةً؟<br>لَا، مَا … كَبِيرَةً.', 'нуқталар ўрнига', ['كَانَ', 'كُنْتِ', 'كَانَتْ'], 2,
            ['Толиба муаннас — муаннаслик ⟨ت⟩ си керак', '⟨كُنْتِ⟩ — «сен» (аёл), II шахс', ''], 'Толиба катта бўлдими (эдими)? — Йўқ, (у) катта бўлмади (эмас эди).'],
          ['هَلْ كَانَتِ الطَّالِبَتَانِ كَبِيرَتَيْنِ؟<br>نَعَمْ، … كَبِيرَتَيْنِ.', 'нуқталар ўрнига', ['كَانَتَا', 'كَانَا', 'كُنْتُمَا'], 0,
            ['', '⟨كَانَا⟩ — музаккар иккита учун', '⟨كُنْتُمَا⟩ — «сиз иккингиз», II шахс'], '2 толиба катта бўлдими (эдими)? — Ҳа, (иккови) катта бўлди (эди).'],
          ['هَلْ كَانَتِ الطَّالِبَاتُ كَبِيرَاتٍ؟<br>لَا، مَا … كَبِيرَاتٍ.', 'нуқталар ўрнига', ['كَانُوا', 'كُنَّ', 'كُنَّا'], 1,
            ['⟨كَانُوا⟩ — музаккарлар учун', '', '⟨كُنَّا⟩ — «биз», I шахс'], 'Толибалар катта бўлдиларми (эдиларми)? — Йўқ, (улар) катта бўлмадилар (эмас эдилар).'],
          ['هَلْ كُنْتَ كَبِيرًا؟<br>نَعَمْ، … كَبِيرًا.', 'нуқталар ўрнига', ['كُنْتَ', 'كُنْتُ', 'كَانَ'], 1,
            ['Савол «сен»га, жавоб «мен» билан берилади', '', '⟨كَانَ⟩ — «у», III шахс'], 'Катта бўлдингми (эдингми)? — Ҳа, катта бўлдим (эдим).'],
          ['هَلْ كُنْتُمَا كَبِيرَيْنِ؟<br>لَا، مَا … كَبِيرَيْنِ.', 'нуқталар ўрнига', ['كُنَّا', 'كُنْتُمَا', 'كَانَا'], 0,
            ['', 'Савол «сиз иккингиз»га, жавоб «биз» билан', '⟨كَانَا⟩ — «улар иккови», III шахс'], 'Икковинг катта бўлдингми (эдингми)? — Йўқ, катта бўлмадик (эмас эдик).'],
          ['هَلْ كُنْتُمْ كِبَارًا؟<br>نَعَمْ، … كِبَارًا.', 'нуқталар ўрнига', ['كُنْتُمْ', 'كَانُوا', 'كُنَّا'], 2,
            ['Савол «сизлар»га, жавоб «биз» билан', '⟨كَانُوا⟩ — «улар», III шахс', ''], 'Катта бўлдингларми (эдингларми)? — Ҳа, катта бўлдик (эдик).'],
          ['هَلْ كُنْتِ كَبِيرَةً؟<br>لَا، مَا … كَبِيرَةً.', 'нуқталар ўрнига', ['كُنْتُ', 'كُنْتِ', 'كَانَتْ'], 0,
            ['', 'Савол «сен»га, жавоб «мен» билан', '⟨كَانَتْ⟩ — «у» (аёл), III шахс'], 'Катта бўлдингми (эдингми)? — Йўқ, катта бўлмадим (эмас эдим).'],
          ['هَلْ كُنْتُمَا كَبِيرَتَيْنِ؟<br>نَعَمْ، … كَبِيرَتَيْنِ.', 'нуқталар ўрнига', ['كَانَتَا', 'كُنْتُمَا', 'كُنَّا'], 2,
            ['⟨كَانَتَا⟩ — «улар иккови», III шахс', 'Савол «сиз иккингиз»га, жавоб «биз» билан', ''], 'Икковинг катта бўлдингми (эдингми)? — Ҳа, катта бўлдик (эдик).'],
          ['هَلْ كُنْتُنَّ كَبِيرَاتٍ؟<br>لَا، مَا … كَبِيرَاتٍ.', 'нуқталар ўрнига', ['كُنَّ', 'كُنَّا', 'كُنْتُنَّ'], 1,
            ['⟨كُنَّ⟩ — «улар» (аёллар), III шахс', '', 'Савол «сизлар»га, жавоб «биз» билан'], 'Катта бўлдингларми (эдингларми)? — Йўқ, катта бўлмадик (эмас эдик).']] },
      { s: 'Қуйидаги жумлаларни тўғри ўқиб, таржима қилинг сўнг таркиб қилинг:',
        iz: 'Таркиби — дарсдаги намуналардек: замир — ⟨كَانَ⟩ нинг исми (раф ўринда), хабари — насб.',
        oq: [['1)', [
          ['أ كان الطالب كبيرا؟', 'نعم، كان كبيرا.', 'أَ كَانَ الطَّالِبُ كَبِيرًا؟', 'نَعَمْ، كَانَ كَبِيرًا.', 'Толиб катта бўлдими (эдими)?', 'Ҳа, (у) катта бўлди (эди).', TZ('كَانَ', 'яширин ⟨هُوَ⟩', 'كَبِيرًا', 'фатҳа')],
          ['هل كان الطالبان كبيرين؟', 'لا، ما كانا كبيرين.', 'هَلْ كَانَ الطَّالِبَانِ كَبِيرَيْنِ؟', 'لَا، مَا كَانَا كَبِيرَيْنِ.', '2 толиб катта бўлдими (эдими)?', 'Йўқ, (иккови) катта бўлмади (эмас эди).', TZ('كَانَا', '⟨ا⟩ замир', 'كَبِيرَيْنِ', '⟨ي⟩')],
          ['أ كان الطالبون كبارا؟', 'نعم، كانوا كبارا.', 'أَ كَانَ الطَّالِبُونَ كِبَارًا؟', 'نَعَمْ، كَانُوا كِبَارًا.', 'Толиблар катта бўлдиларми (эдиларми)?', 'Ҳа, (улар) катта бўлдилар (эдилар).', TZ('كَانُوا', '⟨و⟩ замир', 'كِبَارًا', 'фатҳа')],
          ['هل كانت الطالبة كبيرة؟', 'لا، ما كانت كبيرة.', 'هَلْ كَانَتِ الطَّالِبَةُ كَبِيرَةً؟', 'لَا، مَا كَانَتْ كَبِيرَةً.', 'Толиба катта бўлдими (эдими)?', 'Йўқ, (у) катта бўлмади (эмас эди).', TZ('كَانَتْ', 'яширин ⟨هِيَ⟩', 'كَبِيرَةً', 'фатҳа')],
          ['أ كانت الطالبتان كبيرتين؟', 'نعم، كانتا كبيرتين.', 'أَ كَانَتِ الطَّالِبَتَانِ كَبِيرَتَيْنِ؟', 'نَعَمْ، كَانَتَا كَبِيرَتَيْنِ.', '2 толиба катта бўлдими (эдими)?', 'Ҳа, (иккови) катта бўлди (эди).', TZ('كَانَتَا', '⟨ا⟩ замир', 'كَبِيرَتَيْنِ', '⟨ي⟩')],
          ['هل كانت الطالبات كبيرات؟', 'لا، ما كن كبيرات.', 'هَلْ كَانَتِ الطَّالِبَاتُ كَبِيرَاتٍ؟', 'لَا، مَا كُنَّ كَبِيرَاتٍ.', 'Толибалар катта бўлдиларми (эдиларми)?', 'Йўқ, (улар) катта бўлмадилар (эмас эдилар).', TZ('كُنَّ', '⟨نَ⟩ замир', 'كَبِيرَاتٍ', 'фатҳага ўринбосар касра')],
          ['أ كنت كبيرا يا طالب؟', 'نعم، كنت كبيرا.', 'أَ كُنْتَ كَبِيرًا يَا طَالِبُ؟', 'نَعَمْ، كُنْتُ كَبِيرًا.', 'Эй толиб, катта бўлдингми (эдингми)?', 'Ҳа, катта бўлдим (эдим).', TZ('كُنْتُ', '⟨تُ⟩ замир', 'كَبِيرًا', 'фатҳа')],
          ['هل كنت كبيرة يا طالبة؟', 'لا، ما كنت كبيرة.', 'هَلْ كُنْتِ كَبِيرَةً يَا طَالِبَةُ؟', 'لَا، مَا كُنْتُ كَبِيرَةً.', 'Эй толиба, катта бўлдингми (эдингми)?', 'Йўқ, катта бўлмадим (эмас эдим).', TZ('كُنْتُ', '⟨تُ⟩ замир', 'كَبِيرَةً', 'фатҳа')],
          ['أ كنتما كبيرين يا طالبان؟', 'نعم، كنا كبيرين.', 'أَ كُنْتُمَا كَبِيرَيْنِ يَا طَالِبَانِ؟', 'نَعَمْ، كُنَّا كَبِيرَيْنِ.', 'Эй 2 толиб, икковинг катта бўлдингми (эдингми)?', 'Ҳа, катта бўлдик (эдик).', TZ('كُنَّا', '⟨نَا⟩ замир', 'كَبِيرَيْنِ', '⟨ي⟩')],
          ['هل كنتم كبارا يا طلاب؟', 'لا، ما كنا كبارا.', 'هَلْ كُنْتُمْ كِبَارًا يَا طُلَّابُ؟', 'لَا، مَا كُنَّا كِبَارًا.', 'Эй толиблар, катта бўлдингларми (эдингларми)?', 'Йўқ, катта бўлмадик (эмас эдик).', TZ('كُنَّا', '⟨نَا⟩ замир', 'كِبَارًا', 'фатҳа')],
          ['أ كنتما كبيرتين يا طالبتان؟', 'نعم، كنا كبيرتين.', 'أَ كُنْتُمَا كَبِيرَتَيْنِ يَا طَالِبَتَانِ؟', 'نَعَمْ، كُنَّا كَبِيرَتَيْنِ.', 'Эй 2 толиба, икковинг катта бўлдингми (эдингми)?', 'Ҳа, катта бўлдик (эдик).', TZ('كُنَّا', '⟨نَا⟩ замир', 'كَبِيرَتَيْنِ', '⟨ي⟩')],
          ['أ كنتن كبيرات يا طالبات؟', 'لا، ما كنا كبيرات.', 'أَ كُنْتُنَّ كَبِيرَاتٍ يَا طَالِبَاتُ؟', 'لَا، مَا كُنَّا كَبِيرَاتٍ.', 'Эй толибалар, катта бўлдингларми (эдингларми)?', 'Йўқ, катта бўлмадик (эмас эдик).', TZ('كُنَّا', '⟨نَا⟩ замир', 'كَبِيرَاتٍ', 'фатҳага ўринбосар касра')]]],
          ['2)', [
          ['أ كان الثور كبيرا؟', 'نعم، كان كبيرا.', 'أَ كَانَ الثَّوْرُ كَبِيرًا؟', 'نَعَمْ، كَانَ كَبِيرًا.', 'Буқа катта бўлдими (эдими)?', 'Ҳа, (у) катта бўлди (эди).', TZ('كَانَ', 'яширин ⟨هُوَ⟩', 'كَبِيرًا', 'фатҳа')],
          ['هل كان الثوران كبيرين؟', 'لا، ما كانا كبيرين.', 'هَلْ كَانَ الثَّوْرَانِ كَبِيرَيْنِ؟', 'لَا، مَا كَانَا كَبِيرَيْنِ.', '2 буқа катта бўлдими (эдими)?', 'Йўқ, (иккови) катта бўлмади (эмас эди).', TZ('كَانَا', '⟨ا⟩ замир', 'كَبِيرَيْنِ', '⟨ي⟩')],
          ['أ كان الثيران كبيرة؟', 'نعم، كانت كبيرة.', 'أَ كَانَ الثِّيرَانُ كَبِيرَةً؟', 'نَعَمْ، كَانَتْ كَبِيرَةً.', 'Буқалар катта бўлдими (эдими)?', 'Ҳа, (улар) катта бўлди (эди).', TZ('كَانَتْ', 'яширин ⟨هِيَ⟩ (ақлсиз жам)', 'كَبِيرَةً', 'фатҳа')],
          ['هل كانت البقرة كبيرة؟', 'لا، ما كانت كبيرة.', 'هَلْ كَانَتِ الْبَقَرَةُ كَبِيرَةً؟', 'لَا، مَا كَانَتْ كَبِيرَةً.', 'Сигир катта бўлдими (эдими)?', 'Йўқ, (у) катта бўлмади (эмас эди).', TZ('كَانَتْ', 'яширин ⟨هِيَ⟩', 'كَبِيرَةً', 'фатҳа')],
          ['أ كانت البقرتان كبيرتين؟', 'نعم، كانتا كبيرتين.', 'أَ كَانَتِ الْبَقَرَتَانِ كَبِيرَتَيْنِ؟', 'نَعَمْ، كَانَتَا كَبِيرَتَيْنِ.', '2 сигир катта бўлдими (эдими)?', 'Ҳа, (иккови) катта бўлди (эди).', TZ('كَانَتَا', '⟨ا⟩ замир', 'كَبِيرَتَيْنِ', '⟨ي⟩')],
          ['هل كانت البقرات كبيرات؟', 'لا، ما كن كبيرات.', 'هَلْ كَانَتِ الْبَقَرَاتُ كَبِيرَاتٍ؟', 'لَا، مَا كُنَّ كَبِيرَاتٍ.', 'Сигирлар катта бўлдими (эдими)?', 'Йўқ, (улар) катта бўлмади (эмас эди).', TZ('كُنَّ', '⟨نَ⟩ замир', 'كَبِيرَاتٍ', 'фатҳага ўринбосар касра')],
          ['هل كانت البقرات كبيرة؟', 'نعم، كانت كبيرة.', 'هَلْ كَانَتِ الْبَقَرَاتُ كَبِيرَةً؟', 'نَعَمْ، كَانَتْ كَبِيرَةً.', 'Сигирлар катта бўлдими (эдими)?', 'Ҳа, (улар) катта бўлди (эди). Ақлсиз жамда икки хил ҳам жоиз: ⟨كُنَّ⟩ ҳам, ⟨كَانَتْ⟩ ҳам.', TZ('كَانَتْ', 'яширин ⟨هِيَ⟩ (ақлсиз жам)', 'كَبِيرَةً', 'фатҳа')]]]] }
    ],
    q: [
      [S48, '46-дарсда ⟨كَانَ⟩ исмига сонда мослашмайди, деган эдик. Бу исми **зоҳир** (очиқ айтилган) исм бўлганда: ⟨كَانَ⟩ бирликда қолади. Исми **замир** бўлса, сонни замирнинг ўзи кўрсатади:',
        ['r', '«Толиблар катта эди» — исми зоҳир, ⟨كَانَ⟩ бирликда', 'كَانَ الطُّلَّابُ كِبَارًا'], ['r', '«Улар катта эди» — исми ⟨و⟩ замир', 'كَانُوا كِبَارًا'],
        ['r', '«2 толиба катта эди» — исми зоҳир', 'كَانَتِ الطَّالِبَتَانِ كَبِيرَتَيْنِ'], ['r', '«Иккови катта эди» — исми ⟨ا⟩ замир', 'كَانَتَا كَبِيرَتَيْنِ'],
        'Шунинг учун саволда ⟨كَانَ⟩, жавобда эса ⟨كَانُوا⟩ келади.'],
      ['Икки хил ⟨ت⟩', 'Бири исм эмас, бири — ⟨كَانَ⟩ нинг исми:',
        ['r', 'муаннаслик ҳарфи — сукунли, исм эмас; исми — яширин ⟨هِيَ⟩', 'كَانَتْ'], ['r', 'замир — ҳаракатли, ⟨كَانَ⟩ нинг исми', 'كُنْتَ · كُنْتِ · كُنْتُ'],
        'Муаннаслик «т»си алифли шаклга қўшилади, замир «т» эса алифсиз шаклга.'],
      ['Таркибда — нимага мабний?', '⟨كَانَ⟩ мозий феъли бўлгани учун мабний. Охири қайси замир қўшилишига қараб уч хил бўлади:',
        ['r', '**фатҳага** — замир кўринмаса ёки ⟨ا⟩ қўшилса', 'كَانَ · كَانَتْ · كَانَا · كَانَتَا'], ['r', '**заммага** — ⟨و⟩ қўшилса', 'كَانُوا'],
        ['r', '**сукунга** — ҳаракатли замир қўшилса', 'كُنْتُ · كُنَّا · كُنْتَ · كُنْتِ'], ['r', '', 'كُنْتُمَا · كُنْتُمْ · كُنْتُنَّ · كُنَّ'],
        'Баъзи наҳвчилар мозийни доим фатҳага мабний, бу шаклларда фатҳа тақдирий (кўринмайди) дейди. Китобдагиси — машҳур усул.'],
      ['Алиф қаерга кетди?', 'Ҳаракатли замир қўшилса, ⟨كَانَ⟩ даги алиф тушади ва ⟨ك⟩ замма олади. Замир кўринмаса ёки ⟨ا⟩, ⟨و⟩ қўшилса — алиф жойида:',
        ['r', 'алиф жойида', 'كَانَ · كَانَتْ · كَانَا · كَانَتَا · كَانُوا'], ['r', 'алиф тушган', 'كُنْتُ · كُنْتَ · كُنَّا · كُنَّ'],
        'Сабаби: ⟨كَانَ⟩ нинг асли ⟨كَوَنَ⟩. Ҳаракатли замир қўшилса, феълнинг охирги ҳарфи ⟨ن⟩ сукун олади. Алиф ҳам сукунли — икки сукунли ҳарф ёнма-ён туролмайди, шунинг учун алиф тушади:',
        ['r', 'икки сукун йўлиқади — алиф тушади', 'كَانْتُ → كُنْتُ'],
        '⟨ك⟩ даги замма — тушган ⟨و⟩ ни эслатади (музорийси ⟨يَكُونُ⟩). Асли ⟨ي⟩ ли феълда эса касра бўлади:',
        ['r', 'асли ⟨ي⟩ ли феъл (⟨يَسِيرُ⟩) — касра', 'سَارَ → سِرْتُ'],
        'Музорий ва амрда ҳам шу қоида ишлайди — 49 ва 50-дарсларда.'],
      ['⟨كُنَّ⟩ ва ⟨كُنَّا⟩ адашмасин', 'Иккаласида ҳам идғом бор: феълнинг ⟨ن⟩ си замирнинг ⟨ن⟩ сига қўшилган.',
        ['r', '«улар (аёллар) бўлдилар» — замир ⟨نَ⟩', 'كُنَّ'], ['r', '«биз бўлдик» — замир ⟨نَا⟩', 'كُنَّا'],
        'Охиридаги алиф — «биз».']
    ],
    y: [
      ['Замир ⟨كَانَ⟩ нинг хабари ҳам бўлади', 'Хабар ҳам замир бўлиши мумкин. Унда у икки хил келади — иккаласи ҳам тўғри, қайси бири афзаллигида ихтилоф бор: Сибавайҳ ажратишни, Ибн Молик улашни афзал кўрган.',
        ['r', 'ажратиб — «мен ўша эдим»', 'كُنْتُ إِيَّاهُ'], ['r', 'улаб — «мен ўша эдим»', 'كُنْتُهُ'],
        'Ҳадисда — Ибн Сайёд ҳақида:',
        ['a', 'إِنْ يَكُنْهُ فَلَنْ تُسَلَّطَ عَلَيْهِ', '«Агар у ўша (Дажжол) бўлса, сен унга ғолиб қилинмайсан» (Бухорий, Муслим)'],
        ['r', '⟨هُ⟩ — ⟨يَكُنْ⟩ нинг хабари', 'يَكُنْهُ']],
      ['Исми зоҳир бўлса ҳам кўплик', 'Баъзи араб қабилалари исми зоҳир бўлса ҳам феълни кўпликда айтган. Бу фасиҳ эмас, ҳозирги тилда ишлатилмайди — фақат учраса таниб олиш учун:',
        ['r', 'бу лаҳжада', 'كَانُوا الطُّلَّابُ كِبَارًا'], ['r', 'фасиҳ тилда', 'كَانَ الطُّلَّابُ كِبَارًا'],
        ['r', 'лаҳжа шу мисол билан аталади: «Мени бургалар чақди»', 'أَكَلُونِي الْبَرَاغِيثُ'],
        'Бу ҳолда ⟨و⟩ замир эмас — кўплик белгиси (ҳарф) деб таҳлил қилинади.']
    ]
  };
})();
