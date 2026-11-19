/* tarkib3.js — yangi tarkib ko'rinishi «Нур ут-толиб» darslarida (fiqh 1–2 sinovidan ko'chirildi, 18.11.2026).
   Qoidalar — docs/tarkib-korinishi.md (yagona manba). Faqat window.TK3 qo'yilgan darsda ishlaydi (19.11.2026 dan — hamma «Нур ут-толиб» darslari; ruschada hali yo'q).
   Ma'lumot qo'lda yozilmaydi — darsdagi IRB (har so'z e'robi), CATOV, TKG/TKT (shibhi jumla, jumla), QMP/QT (qoidalar) dan avtomat:
     1-qavat (doim, Таркиб yoqilganda): rang — vazifa yoki holat oilasi, ramka — asosiy bo'lak o'rnidagi bo'lak, mahzuf so'z o'z o'rnida;
     2-qavat (bir bosish): bo'lak o'z rangidagi ramkada, bosh so'zdan chiziq, ostida nomi; boshqa gapga — strelka;
     gap ostida «Қоидалар» qutisi; tepada belgilar qatori (ⓘ — to'liq ro'yxat); 3-qavat — so'z oynasi kitob tartibida.
   tarkib2.js dan keyin ulanadi: uning ma'lumotidan foydalanadi, eski qutisi (.tkx) va legendasi yashiriladi. */
(function () {
  if (!window.TK3 || !window.IRB) return;
  var tx = document.getElementById('tx');
  if (!tx) return;
  var IRB = window.IRB, G = window.TKG || {}, TT = window.TKT || {}, CV = window.CATOV || {}, QMP = window.QMP || {}, QT = window.QT || {};
  tx.classList.add('nv');
  tx.style.position = 'relative';

  /* ===================== uslublar ===================== */
  var st = document.createElement('style');
  st.textContent =
    ':root{--nb:#0c6a30;--nn:#2fae5a;--nz:#db2777;--nj:#0e93b5;--nh:#0a5a70;--nd:#5c3a06}' +
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nb:#4ddb84;--nn:#b5f0c9;--nj:#4fc6e3;--nh:#a5e6f5;--nd:#e6b866;--nz:#f472b6}}' +
    ':root[data-theme="dark"]{--nb:#4ddb84;--nn:#b5f0c9;--nj:#4fc6e3;--nh:#a5e6f5;--nd:#e6b866;--nz:#f472b6}' +
    /* eski Таркиб belgilari yangi ko'rinishda yo'q */
    '#tx.nv .tkx{display:none!important}' +
    '#tx.tartib.nv .ws span[data-n]::before{content:none!important}' +
    '#tx.nv .ws span[data-i] span.q3{padding:0!important;border-radius:0!important;background:none!important;font-size:inherit!important;line-height:inherit!important;cursor:inherit;transition:none!important}' +
    '#tx.tartib.nv .ws span[data-i]{color:var(--tx)}' +
    '#tx.tartib.nv .n-cm{color:var(--cm)!important}#tx.tartib.nv .n-cx{color:var(--cx)!important}#tx.tartib.nv .n-cf{color:var(--cf)!important}' +
    '#tx.tartib.nv .n-co{color:var(--co)!important}#tx.tartib.nv .n-cb{color:var(--nb)!important}#tx.tartib.nv .n-cn{color:var(--nn)!important}' +
    '#tx.tartib.nv .n-cj{color:var(--nj)!important}#tx.tartib.nv .n-jh{color:var(--nh)!important}#tx.tartib.nv .n-cd{color:var(--nd)!important}' +
    '#tx.tartib.nv .n-0{color:var(--tx)!important}#tx.tartib.nv .n-cz{color:var(--nz)!important}' +
    /* tegish va audio belgilari: bosilgan so'z o'z yashil fonida (tarjimadagi jufti bilan bir xil — 19.11.2026, foydalanuvchi), audio belgisi faqat ijroda */
    '#tx.tartib.nv:not(.apl) .ws span.pl,#tx.tartib.nv:not(.apl) .ts.pl{background:none!important}' +
    /* ramka (doim): asosiy bo'lak o'rnidagi bo'lak */
    '#tx.tartib.nv .ws span.t3r{border-top:1.8px solid var(--rc);border-bottom:1.8px solid var(--rc);border-radius:0}' +
    '#tx.tartib.nv .ws span.t3r.t3s{border-right:1.8px solid var(--rc);border-top-right-radius:10px;border-bottom-right-radius:10px}' +
    '#tx.tartib.nv .ws span.t3r.t3e{border-left:1.8px solid var(--rc);border-top-left-radius:10px;border-bottom-left-radius:10px}' +
    '#tx.tartib.nv .ws span.t3r:not(.t3e){margin-left:-4px;padding-left:6px}' +
    /* ramka doim ko'rinmaydi — faqat bosilganda (t3fo); joyi saqlanadi, matn siljimaydi (18.11.2026, foydalanuvchi: 3-yo'l) */
    '.t3r{--rc:transparent}.t3fo.t3rc-cx{--rc:var(--cx)}.t3fo.t3rc-cb{--rc:var(--nb)}.t3fo.t3rc-co{--rc:var(--co)}.t3fo.t3rc-cm{--rc:var(--cm)}' +
    /* mahzuf so'z — o'z o'rnida, kichik va xira (faqat Таркибда) */
    '#tx .ws span.t3h{display:none}' +
    '#tx.tartib.nv .ws span.t3h{display:inline-block;align-self:center;font-size:calc(var(--fs,22px)*.62);line-height:1.3;padding:0 5px;border:1px dashed var(--mu);border-radius:8px;color:var(--mu);opacity:.6;cursor:pointer}' +
    '#tx.tartib.nv .ws span.t3h.t3f{opacity:1}#tx .ws span.t3h{transition:none!important}' +
    '#tx.tartib.nv .ws span.t3h.t3hm.t3f{border-color:var(--cm);color:var(--cm)}' +
    /* kananing (mubtadoning) mahzuf xabari — zarf bilan bitta ramkada; ichida uzuq «pilla» (18.11.2026, foydalanuvchi) */
    '#tx.tartib.nv .ws span.t3h.t3r{border:0;border-top:1.8px solid var(--rc);border-bottom:1.8px solid var(--rc);border-radius:0;opacity:1;align-self:stretch;display:inline-flex;align-items:center;position:relative;padding:0 9px}' +
    '#tx.tartib.nv .ws span.t3h.t3r.t3s{border-right:1.8px solid var(--rc);border-top-right-radius:10px;border-bottom-right-radius:10px}' +
    '#tx.tartib.nv .ws span.t3h.t3r.t3e{border-left:1.8px solid var(--rc);border-top-left-radius:10px;border-bottom-left-radius:10px}' +
    '#tx.tartib.nv .ws span.t3h.t3r:not(.t3e){margin-left:-4px;padding-left:11px}' +
    '#tx.tartib.nv .ws span.t3h.t3r::after{content:"";position:absolute;inset:6px 3px 6px 5px;border:1px dashed var(--mu);border-radius:8px;opacity:.7;pointer-events:none}' +
    '#tx.tartib.nv .ln.t3dim .ws span.t3h.t3r:not(.t3f){opacity:.32}' +
    /* yashirin foil — fe'l tagida, faqat bosganda / belgilar «Фоил» */
    '#tx .ws span[data-i]{position:relative}' +
    '#tx .ws span[data-i] span.t3y{display:none}' +
    '#tx.tartib.nv .ws span[data-i].t3f span.t3y,#tx.tartib.nv .ws span[data-i] span.t3y.t3f,#tx.tartib.nv .ws span[data-i] span.t3y.lgh{display:block;position:absolute;left:50%;top:84%;transform:translateX(-50%);font-size:calc(var(--fs,22px)*.58)!important;line-height:1!important;white-space:nowrap;color:var(--co);pointer-events:none;padding:0!important;background:none!important}' +
    /* 2-qavat */
    '.t3k{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:3}' +
    '.t3c{position:absolute;z-index:4;transform:translateX(-50%);font:600 11px/1 system-ui,sans-serif;color:var(--bg);border-radius:999px;padding:4px 8px;white-space:nowrap;pointer-events:none}' +
    '.t3c .ar{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:15px;font-weight:400;margin-left:2px;display:inline}' +
    '#tx.tartib.nv .ln.t3dim .ws span[data-i]:not(.t3f),#tx.tartib.nv .ln.t3dim .ws span.t3h:not(.t3f){opacity:.32;transition:opacity .15s}' +
    /* belgilar qatori (A variant) */
    '#lg.t3lg{flex-direction:column!important;align-items:stretch!important;gap:0!important;border-bottom:0!important;padding:4px 0 6px!important}' +
    '#lg.t3lg .lg-z{display:flex;width:100%;align-items:center;gap:8px;border:1px solid var(--bd);background:var(--cd);border-radius:999px;padding:6px 10px;font:600 12.5px/1.2 system-ui,sans-serif;color:var(--tx);cursor:pointer;overflow:hidden}' +
    '#lg.t3lg .lg-z span{flex:0 0 auto;white-space:nowrap}' +
    '#lg.t3lg .lg-z em{font-style:normal;font-weight:800;font-size:10.5px;letter-spacing:.05em;color:var(--mu);margin-right:3px;text-transform:uppercase}' +
    '#lg.t3lg .lg-z i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:2px}' +
    '#lg.t3lg .lg-z b{margin-left:auto;flex:0 0 auto;font-weight:600;color:var(--mu);font-size:15px;line-height:1}' +
    '#lg.t3lg .lg-t{margin:6px 0 0;padding:7px 10px;border-radius:10px;font:400 13.5px/1.45 system-ui,sans-serif;background:var(--cd);border-left:4px solid var(--ac);color:var(--tx);text-align:left}' +
    '#lg.t3lg .lg-t[hidden]{display:none}' +
    '#tx.tartib.nv .ws span.lgd{opacity:.25}' +
    '#tx.tartib.nv .lgh{background:color-mix(in srgb,var(--ac) 14%,transparent)!important;border-radius:6px}' +
    '.t3sh-o{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:60}' +
    '.t3sh{position:fixed;left:0;right:0;bottom:0;max-height:88%;overflow:auto;background:var(--bg);border-radius:22px 22px 0 0;z-index:61;padding:10px 18px calc(22px + env(safe-area-inset-bottom,0px));font-family:system-ui,sans-serif;color:var(--tx);box-shadow:0 -6px 24px rgba(0,0,0,.2);max-width:560px;margin:0 auto}' +
    '.t3sh .hb{width:40px;height:5px;border-radius:3px;background:var(--bd);margin:0 auto 8px}' +
    '.t3sh .hd{display:flex;justify-content:space-between;align-items:center}' +
    '.t3sh h3{margin:0;font-size:18px}' +
    '.t3sh .x{border:0;background:var(--cd);width:32px;height:32px;border-radius:50%;font-size:16px;color:var(--mu);cursor:pointer}' +
    '.t3sh h4{margin:14px 0 4px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}' +
    '.t3sh h4 em{font-style:normal;text-transform:none;letter-spacing:0;font-weight:600;opacity:.8}' +
    '.t3sh .r{display:grid;grid-template-columns:26px 1fr auto;gap:2px 10px;align-items:center;padding:6px 0;border-top:1px solid var(--bd)}' +
    '.t3sh .r[data-c]:not(.off){cursor:pointer}' +
    '.t3sh .r i{width:14px;height:14px;border-radius:4px;justify-self:center}' +
    '.t3sh .r.off{opacity:.42}.t3sh .r.off small::after{content:" · бу дарсда йўқ";font-style:italic}' +
    '.t3sh .r .t{font-size:14.5px;line-height:1.35}.t3sh .r .t small{display:block;color:var(--mu);font-size:12.5px}' +
    '.t3sh .r .a{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:21px;direction:rtl}' +
    '.t3sh .ic{font-size:18px;justify-self:center;font-style:normal}' +
    '.t3sh .fr{border:2px solid var(--cx);border-radius:8px;padding:0 6px;color:var(--cx)}' +
    '.t3sh .hz{border:1.5px dashed var(--mu);border-radius:8px;padding:0 6px;color:var(--mu);font-size:17px}' +
    /* «Қоидалар» qutisi */
    '#tx .nqb{display:none}' +
    '#tx.tartib.nv .nqb{display:block;margin:8px 0 2px;padding:8px 12px 6px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);direction:ltr;text-align:left}' +
    /* yopiq turadi, sarlavha bosilsa ochiladi (19.11.2026, foydalanuvchi) */
    '#tx.tartib.nv .nqb:not(.op){padding:4px 12px}.nqb:not(.op) .nq-r{display:none}' +
    '.nqb .fgt{margin-left:auto;font:700 12px/1 system-ui,-apple-system,sans-serif;letter-spacing:0;text-transform:none;color:var(--ac);background:var(--tint,rgba(15,122,79,.1));border-radius:999px;padding:5px 10px}' +
    '.nqb .nq-h{display:flex;align-items:center;gap:6px;min-height:32px;cursor:pointer;-webkit-tap-highlight-color:transparent;font:800 11px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin:0}' +
    '.nqb .nq-v{font:400 15px/1 system-ui,sans-serif}.nqb .nq-v::after{content:"▾"}.nqb.op .nq-v::after{content:"▴"}.nqb.op .nq-h{color:var(--tx)}' +
    '.nqb .nq-r{display:flex;flex-wrap:wrap;align-items:center;gap:0 6px;padding:6px;border-top:1px dashed var(--bd);border-radius:8px;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.nqb .nq-h+.nq-r{border-top:0}' +
    '.nqb .nq-m{flex:1 1 0;min-width:0;display:flex;flex-wrap:wrap;align-items:center;gap:2px 10px}' +
    '.nqb .nq-t{flex:0 0 auto;font:600 14.5px/1.35 system-ui,-apple-system,sans-serif;color:var(--tx);white-space:nowrap}' +
    '.nqb .nq-c{flex:1 1 auto;min-width:0;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:2px 10px;font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:calc(var(--fs,22px)*.9);line-height:1.5;direction:rtl}' +
    '.nqb .nq-c>span{white-space:normal;overflow-wrap:anywhere}.nqb .nq-t .ar{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:1.25em;font-weight:400}' +
    '.nqb .nq-g{flex:0 0 auto;color:var(--mu);font:400 18px/1 system-ui,sans-serif;margin-left:2px}' +
    '.nqb .nq-g::after{content:"›"}.nqb .nq-r.on .nq-g::after{content:"⌄"}' +
    '.nqb .nq-r.on{background:var(--tint,rgba(15,122,79,.08));border-top-color:transparent}' +
    '.nqb .nq-k{display:none;flex:0 0 100%;margin:6px 0 2px;padding:8px 10px;background:var(--cd);border:1px solid var(--bd);border-radius:10px;font:400 13.5px/1.5 system-ui,sans-serif;color:var(--tx);cursor:default}' +
    '.nqb .nq-r.on .nq-k{display:block}' +
    '.nqb .nq-k b{font-weight:800}' +
    '.nqb .nq-k .ar{display:inline;font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:18px;font-weight:400}' +
    '.nqb .nq-k ul{margin:6px 0 0;padding:0;list-style:none}.nqb .nq-k li{margin:0;padding:6px 0;border-top:1px dashed var(--bd)}' +
    '.nqb .nq-k .nq-more{display:inline-block;margin-top:6px;font-weight:700;color:var(--ac);cursor:pointer}' +
    '.nqb .nq-hz{border:1.5px dashed var(--mu);border-radius:8px;padding:0 7px;color:var(--mu)}' +
    /* so'z oynasi (kitob tartibida) */
    '#sb .zo-uz .zp{margin-top:14px}#sb .zo-uz .zp.z1{margin-top:4px}' +
    '#sb .zo-uz .zph{display:flex;align-items:center;gap:14px;margin-bottom:6px}' +
    '#sb .zo-uz .zph::before,#sb .zo-uz .zph::after{content:"";flex:1;height:1.5px;background:var(--bd)}' +
    '#sb .zo-uz .zph .ar{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:34px;line-height:1.35;display:inline;font-weight:400}' +
    '#sb .zo-uz .zs{display:grid;grid-template-columns:22px 74px 1fr;gap:0 8px;padding:4px 0;align-items:start}' +
    '#sb .zo-uz .zs i{font-style:normal;width:20px;height:20px;border-radius:50%;background:var(--bd);color:var(--mu);font:800 11.5px/20px system-ui,sans-serif;text-align:center;margin-top:3px}' +
    '#sb .zo-uz .zs .l{color:var(--mu);font-size:13.5px;padding-top:3px}' +
    '#sb .zo-uz .zs .v{font-size:15.5px;line-height:1.5}' +
    '#sb .zo-uz .a2{display:block;direction:rtl;text-align:right;font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:17px;line-height:1.6;color:var(--mu)}' +
    '#sb .zo-uz .zb{margin-top:12px;padding:9px 11px;border-radius:10px;border:1.5px solid var(--bd);font-size:15px;line-height:1.5}' +
    '#sb .zo-uz .zb>b{font-weight:800}' +
    '#sb .zo-uz .zn{margin-top:10px;font-size:14px;line-height:1.55;color:var(--mu)}' +
    '#sb .zo-uz .ar{font-family:"DarsNaskh","Noto Naskh Arabic",serif}' +
    '#sb .hk .t3vz{color:var(--tx)}' +
    /* «Ҳозирги жой» */
    '.t3now{display:none;position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--t3nb,230px) + env(safe-area-inset-bottom,0px));z-index:19;background:var(--ac);color:#fff;border:0;border-radius:999px;padding:10px 18px;font:700 14px/1 system-ui,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.2);cursor:pointer;white-space:nowrap}' +
    '.t3now.on{display:block}' +
    /* har gap kartasida ▶ — chap yuqori burchakda, chegaraga mingashib (matnni yopmaydi) */
    '#tx.nv .ln{position:relative}' +
    '#tx.nv .t3pl{position:absolute;top:-11px;left:-5px;z-index:2;width:30px;height:30px;border-radius:50%;border:1px solid var(--bd);background:var(--cd);color:var(--ac);display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.12);-webkit-tap-highlight-color:transparent}' +
    '#tx.nv .t3pl.on{background:var(--ac);color:var(--cd);border-color:var(--ac)}' +
    '#tx.nv .t3pl svg{display:block}';
  document.head.appendChild(st);

  /* ===================== yordamchilar ===================== */
  var ARX = /[؀-ۿ]/;
  function bare(s) { return String(s).replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/[^ء-ي]/g, '') }
  function lc(s) { return String(s).replace(/[^ء-يٱ]/g, '').length }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] }) }
  /* arabcha bo'lak — qavslari bilan bitta o'ngdan-chapga bo'lak (vaqf: «وَ(الْأَمْرُ) هَكَذَا» chalkashmasin) */
  function arw(s) { return esc(s).replace(/\(?[؀-ۿ](?:[؀-ۿً-ْٰ\s،؛…()]*[؀-ۿً-ْٰ)])?/g, function (m) { return '<bdi class="ar">' + m + '</bdi>' }) }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1) }
  function tartib() { return tx.classList.contains('tartib') }
  function lines() { return tx.querySelectorAll('.ln') }
  function wEl(k) { return tx.querySelector('.ws span[data-i="' + k + '"]') }
  /* so'z matni (yashirin zamirsiz) */
  function wt(e) { var q = e.querySelectorAll('span.q3'); return q.length ? [].map.call(q, function (z) { return z.textContent }).join('') : e.textContent }

  /* ---------- IRB qatorini tahlil: tur va rang ---------- */
  var TYP = /^(жамъ вови — муттасил замир|муттасил замир|мунфасил замир|ажратиш \(фасл\) замири|муаннас учун исм ишора|исм ишора|исм мавсул|исм истифҳом|истифҳом исми|лафзи жалола|исм шарт|шарт исми)\s+бўлиб,?\s*(у\s+)?/;
  function seg0(u) { return String(u).split(/,\s*/)[0] }
  function isHarf(u) {
    var f = seg0(u);
    if (/бўлиб/.test(f)) return false;
    return /ҳарфи|ҳарф(\s|$|\()|^нафий$|^нафий\s|^(ت муаннаслик|ن сақловчи|сақловчи ҳарф|ا фарқлаш|و ишбоъ|вовул)/.test(f);
  }
  function isFsuf(u) { return /^(ت муаннаслик|таънис ҳарфи|ن сақловчи|сақловчи ҳарф|ا фарқлаш|و ишбоъ)/.test(u) }
  function rowK(u) {
    var f = seg0(u);
    if (isHarf(u)) return 'h';
    if (/замир бўлиб|замири/.test(f)) return 'z';
    if (!/бўлиб/.test(f) && /феъл/.test(f)) return 'f';
    return 'n';
  }
  function roleOf(u) { var f = seg0(u), m = f.match(TYP); var r = m ? f.slice(m[0].length) : f; return r.replace(/^(лафзи жалола\s+бўлиб\s+)?музоф\s+бўлиб\s+/, '') }
  function roleC(r) {
    if (/ноиби фоил/.test(r)) return 'co';
    if (/фоил/.test(r) && !/фоилдан/.test(r)) return 'co';
    if (/мафъулун мутлақ|мафъули мутлақ|мафъулун лаҳу|мафъулун маъаҳу|мафъулун фийҳ/.test(r)) return 'cn';
    if (/мафъул/.test(r)) return 'cb';
    if (/музофун илайҳ/.test(r)) return 'cj';
    if (/нинг исми|^исми|мубтадо/.test(r)) return 'cm';
    if (/нинг хабари|^хабар/.test(r)) return 'cx';
    if (/^мажрур|мажрур$/.test(r)) return 'cj';
    if (/га маътуф|^маътуф|сифат|бадал|таъкид/.test(r)) return '^';
    if (/зарф|^ҳол|ҳол$|тамйиз|мустасно|мунодо/.test(r)) return 'cn';
    if (/фасл|ажратиш/.test(r)) return '0';
    return '?';
  }
  function harfC(u) {
    if (/жар ҳарфи/.test(u)) return 'jh';
    if (/ўхшатиш|истидрок ва насб|таъкид ва насб|орзу|умид|инкор қилиш ҳарфи|жинсни/.test(u)) return 'cz';
    if (/насб|жазм|наҳий|тақиқ/.test(u)) return 'cd';
    return '0';
  }
  function naqis(u) { return /ноқис|бошлаш феъли|яқинлик феъли|афъол|كَانَ нинг шакли|синглиси/.test(u) }
  var CVC = { m: 'cm', x: 'cx', f: 'cf', o: 'co', b: 'cb', j: 'cj', h: 'cn', '-': 'cn', '>': 'jh' };
  function holC(j) { return j == 'J' ? 'cj' : j == 'N' ? 'cn' : '' }

  /* so'zni bo'laklarga (oldidagi harf, asos, zamir) ajratish — harflar soni bo'yicha (tarkib2.js split bilan bir xil) */
  function split(t, forms) {
    var c = forms.map(lc), n = c.reduce(function (a, b) { return a + b }, 0), w = lc(t);
    if (n != w) for (var i = 1; i < forms.length; i++) if (bare(forms[i - 1]) == 'ل' && bare(forms[i]).indexOf('ال') == 0) { c[i]--; n--; }
    if (n != w || forms.length < 2) return null;
    var seg = forms.map(function () { return '' }), p = 0, left = c.slice();
    for (var k = 0; k < t.length; k++) {
      var ch = t[k];
      if (/[ء-يٱ]/.test(ch)) { while (p < c.length - 1 && left[p] == 0) p++; left[p]--; }
      seg[p] += ch;
    }
    return seg;
  }

  /* ===================== 1-qavat: so'zlar tahlili ===================== */
  var WD = {}, LW = [], GH = [], FR = [], RELS = {}, SEGS = [];
  function analyse() {
    WD = {}; LW = [];
    [].forEach.call(lines(), function (ln, L) {
      LW[L] = [];
      [].forEach.call(ln.querySelectorAll('.ws span[data-i]'), function (e) {
        var k = e.getAttribute('data-i'), p = k.split('-'), i = +p[1], E = IRB[k] || {};
        var rows = (E.k || []).filter(function (x) { return x[0] }).map(function (x) { return { t: x[0], u: x[1], k: rowK(x[1]) } });
        var nrows = (E.k || []).filter(function (x) { return !x[0] }).map(function (x) { return x[1] });
        var mi = 0; for (var z = 0; z < rows.length; z++) if (rows[z].k != 'h') { mi = z; break }
        var w = { e: e, k: k, L: L, i: i, E: E, rows: rows, nrows: nrows, mi: mi, j: E.j || '', mc: '', role: '', isF: false, harf: false, tob: null, yz: '' };
        var r = rows[mi];
        if (r) {
          w.role = roleOf(r.u);
          if (r.k == 'f') { w.isF = true; w.mc = naqis(r.u) ? 'cz' : 'cf'; var y = r.u.match(/(?:жоиз|вожиб) ҳолдаги (\S+) мустатир замир[^,]*,?\s*(.*)/); if (y) { w.yz = y[1]; w.yzc = /исми|мубтадо/.test(y[2]) ? 'cm' : 'co' } }
          else if (r.k == 'h') { w.harf = true; w.mc = harfC(r.u); }
          else {
            var c = roleC(w.role), cv = CV[k];
            if (c == '?') c = (cv && CVC[cv]) || holC(w.j) || '0';
            w.mc = c;
          }
        } else w.mc = (CV[k] && CVC[CV[k]]) || holC(w.j) || '0';
        WD[k] = w; LW[L][i] = w;
      });
      /* tobe' (sifat, ma'tuf, badal, ta'kid) — ergashgan so'z rangida */
      LW[L].forEach(function (w) {
        if (!w || w.mc != '^') return;
        var t = tobe(w), u = (w.rows[w.mi] || {}).u || '';
        w.tl = /маътуф/.test(u) ? 'маътуф' : /бадал/.test(u) ? 'бадал' : /таъкид/.test(u) ? 'таъкид' : 'сифат';
        w.tob = t.k; w.mc = t.c || holC(w.j) || '0';
      });
    });
  }
  function findTxt(L, before, a) {
    var b = bare(a); if (!b) return null;
    for (var i = before - 1; i >= 0; i--) { var w = LW[L][i]; if (w && (bare(wt(w.e)) == b || bare(wt(w.e)).replace(/^[وف]/, '') == b || bare(w.rows[w.mi] ? w.rows[w.mi].t : '') == b)) return w }
    for (var i2 = 0; i2 < LW[L].length; i2++) { var w2 = LW[L][i2]; if (w2 && bare(wt(w2.e)) == b) return w2 }
    return null;
  }
  function tobe(w) {
    var r = w.rows[w.mi], m = r && r.u.match(/^(.+?) га маътуф/);
    if (m && ARX.test(m[1])) { var t = findTxt(w.L, w.i, m[1]); if (t) return { c: t.mc == '^' ? '' : t.mc, k: t.k } }
    for (var i = w.i - 1; i >= 0 && i >= w.i - 9; i--) {
      var c = LW[w.L][i]; if (!c || c.harf || c.mc == '^' || c.mc == '0' || c.mc == '') continue;
      if (c.isF && !w.isF) continue;
      if (w.j && c.j && w.j != c.j) continue;
      return { c: c.mc, k: c.tob && c.tl == 'сифат' && w.tl != 'маътуф' ? c.tob : c.k };
    }
    return { c: '', k: null };
  }

  /* so'z ichini bo'laklab bo'yash */
  function paint() {
    Object.keys(WD).forEach(function (k) {
      var w = WD[k], e = w.e;
      (e.className.match(/\b(p[a-z]|iz|izr|izl|izm|zc-\S+|kx|n-\S+|t3\S*)\b/g) || []).forEach(function (c) { e.classList.remove(c) });
      var txt = wt(e), segs = w.rows.length > 1 ? split(txt, w.rows.map(function (r) { return r.t })) : null;
      var mcls = 'n-' + (w.mc || '0');
      e.classList.add(mcls);
      w.segc = [];
      if (segs) {
        var fc = w.isF ? w.mc : '';
        e.innerHTML = segs.map(function (t, z) {
          var r = w.rows[z], c;
          if (z == w.mi) c = w.mc;
          else if (r.k == 'h') c = (fc && isFsuf(r.u)) ? fc : harfC(r.u);
          else if (r.k == 'f') c = naqis(r.u) ? 'cz' : 'cf';
          else if (r.k == 'z') { c = roleC(roleOf(r.u)); if (c == '?' || c == '^') c = /жар ўринда/.test(r.u) ? 'cj' : /насб ўринда/.test(r.u) ? 'cn' : (c == '^' ? w.mc : '0'); }
          else { c = roleC(roleOf(r.u)); if (c == '?' || c == '^') c = w.mc; }
          w.segc[z] = c || '0';
          return '<span class="q3 n-' + (c || '0') + (z == w.mi ? ' q3m' : '') + '">' + esc(t) + '</span>';
        }).join('');
      } else {
        e.innerHTML = '<span class="q3 q3m ' + mcls + '">' + esc(txt) + '</span>';
        w.segc = [w.mc || '0'];
      }
      if (w.yz) e.insertAdjacentHTML('beforeend', '<span class="t3y n-' + w.yzc + '">' + w.yz + '</span>');
    });
  }

  /* ===================== mahzuf so'z, ramka, bog'lanishlar ===================== */
  function tq(src) { var m = src.match(/бўлмиш (?:маҳзуф )?([؀-ۿً-ْٰ]+)/) || src.match(/\(([؀-ۿً-ْٰ]+)\)/); return m ? m[1] : '' }
  function ghosts() {
    [].forEach.call(tx.querySelectorAll('.ws span.t3h'), function (g) { g.remove() });
    GH = [];
    function add(L, before, t, why, kind, grp) {
      var w = LW[L] && LW[L][before]; if (!w || !t) return null;
      var g = document.createElement('span'); g.className = 't3h' + (kind == 'm' ? ' t3hm' : ''); g.textContent = t; g.setAttribute('data-h', GH.length);
      w.e.parentNode.insertBefore(g, w.e);
      var o = { L: L, i: before, t: t, why: why, kind: kind, grp: grp || null, e: g }; GH.push(o); return o;
    }
    Object.keys(G).forEach(function (L) {
      (G[L] || []).forEach(function (g) {
        if (g[3] != 's') return;
        var d = g[2];
        var mb = d.match(/маҳзуф мубтадо ([؀-ۿً-ْٰ]+)/);
        if (mb) add(+L, g[0], mb[1], 'маҳзуф мубтадо', 'm', g);
        if (/маҳзуф/.test(d)) { var t = tq(d.replace(/маҳзуф мубтадо [؀-ۿً-ْٰ]+/, '')); if (t) { var o = add(+L, g[0], t, d.replace(/^шибҳи жумла — ?/, ''), 'k', g); if (o) g.gh = o } }
      });
    });
    Object.keys(WD).forEach(function (k) {
      var w = WD[k];
      w.nrows.forEach(function (u) {
        var m = u.match(/^мубтадоси маҳзуф.*?\(([؀-ۿً-ْٰ ]+)\)/); if (m) add(w.L, w.i, m[1], 'маҳзуф мубтадо', 'm');
      });
    });
  }
  /* xabar bo'lgan jumla: arabcha e'robda «وَجُمْلَةُ «…» فِي مَحَلِّ رَفْعٍ خَبَرُ …» bo'lsa-yu, TKG da guruhi bo'lmasa —
     guruh qo'shiladi (eski darslar, 19.11.2026): ramka va mubtado ipi shundan chiqadi. «…» — jumla bo'lak oxirigacha */
  function jx() {
    Object.keys(WD).forEach(function (k) {
      var w = WD[k], row = LW[w.L]; if (!row) return;
      (w.E.a || []).forEach(function (p) {
        var m = (p[1] || '').match(/جُمْلَةُ «([^»]+)» فِي مَحَلِّ (رَفْعٍ|نَصْبٍ) خَبَرُ/); if (!m) return;
        var toks = m[1].replace(/…/g, ' ').trim().split(/\s+/), t0 = bare(toks[0]), i0 = -1;
        if (!t0) return;
        function hit(i) { var o = row[i]; if (!o) return false; var b = bare(wt(o.e)); return b == t0 || b.replace(/^[وف]/, '') == t0 }
        for (var d = 0; d < row.length && i0 < 0; d++) { if (hit(w.i - d)) i0 = w.i - d; else if (hit(w.i + d)) i0 = w.i + d }
        if (i0 < 0) return;
        var end = Math.min(row.length - 1, i0 + toks.length - 1);
        if (/…/.test(m[1])) { end = row.length - 1; (TT[w.L] || []).forEach(function (t) { if (t[0] >= i0 && t[0] < end) end = t[0] }) }
        var g = G[w.L] = G[w.L] || [];
        if (g.some(function (x) { return x[3] == 'j' && x[0] <= i0 && x[1] >= end })) return;
        g.push([i0, end, 'жумла — хабар, ' + (m[2] == 'رَفْعٍ' ? 'раф' : 'насб') + ' ўринда', 'j']);
      });
    });
  }
  /* ramka (doim): bo'lak so'zlari rangi gapdagi o'rnini ko'rsatmasa — o'sha o'rin rangidagi ramka */
  function frames() {
    FR = [];
    Object.keys(G).forEach(function (L) {
      (G[L] || []).forEach(function (g) {
        var d = g[2], c = '';
        if (g[3] == 's') { if (/хабар/.test(d) && !/сифат/.test(d)) c = 'cx'; else if (/ноиби фоил/.test(d)) c = 'co'; }
        else if (g[3] == 'j') { if (/хабар/.test(d)) c = 'cx'; else if (/мафъул|мақули қавл/.test(d)) c = 'cb'; else if (/ноиби фоил|фоил ўрнида/.test(d)) c = 'co'; }
        if (c) FR.push({ L: +L, a: g[0], b: g[1], c: c, g: g, gh: g[3] == 's' && c == 'cx' && g.gh && /маҳзуф хабар/.test(d) ? g.gh : null });
      });
    });
    /* bir so'zda ikki ramka bo'lsa — kattasi */
    FR.sort(function (p, q) { return (q.b - q.a) - (p.b - p.a) });
    var used = {};
    FR = FR.filter(function (f) { for (var i = f.a; i <= f.b; i++) if (used[f.L + '-' + i]) return false; for (var j = f.a; j <= f.b; j++) used[f.L + '-' + j] = 1; return true });
    FR.forEach(function (f) {
      var E = frEls(f);
      E.forEach(function (e, n) { e.classList.add('t3r', 't3rc-' + f.c); e.t3fr = f; if (n == 0) e.classList.add('t3s'); if (n == E.length - 1) e.classList.add('t3e') });
      for (var i = f.a; i <= f.b; i++) { var w = LW[f.L][i]; if (w) w.fr = f }
    });
    rowFix();
  }
  /* ramka elementlari tartibda: mahzuf xabar (bo'lsa) + so'zlar */
  /* mahzuf xabar bo'lsa — ramka faqat o'zida: katta kitoblarda xabar — o'sha, zarf / jar-majrur unga mutaalliq (18.11.2026, foydalanuvchi) */
  function frEls(f) { if (f.gh) return [f.gh.e]; var o = []; for (var i = f.a; i <= f.b; i++) if (LW[f.L][i]) o.push(LW[f.L][i].e); return o }
  /* nishon doimiy ramkada bo'lsa — o'sha qatordagi butun ramka qutisi (sim ramkaning o'rtasiga ulanadi) */
  /* sim nishoni: mahzuf xabar bo'lsa — o'zi (katta kitoblardagidek xabar — o'sha; 18.11.2026, foydalanuvchi), aks holda doimiy ramka butunicha */
  /* yashirin zamir (fe'l tagida) ko'rinib turgan bo'lsa — ramka uni ham o'z ichiga oladi: pastki chiziq zamir ostidan o'tadi (19.11.2026, foydalanuvchi) */
  function yzQ(els) { var o = []; els.forEach(function (x) { var y = x && x.querySelector && x.querySelector('.t3y'); if (y && y.offsetParent) o.push(y.getBoundingClientRect()) }); return o }
  function yzX(els, LL) { yzQ(els).forEach(function (q) { LL.forEach(function (z) { if (q.left < z.r && q.right > z.l && q.top < z.b + 30) z.b = Math.max(z.b, q.bottom + 6) }) }) }
  function yzB(te, r) {
    var o = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    yzQ(te.t3fr ? frEls(te.t3fr) : [te]).forEach(function (q) { if (q.left < o.right && q.right > o.left && q.top < o.bottom + 30) o.bottom = Math.max(o.bottom, q.bottom + 6) });
    return o;
  }
  function frT(te, rel) { return te.classList.contains('t3r') && rel.tl && !te.classList.contains('t3h') ? frBox(te) : ykR(te) }
  function frBox(te) {
    var q = ykR(te), f = te.t3fr; if (!f) return q;
    var m = (q.top + q.bottom) / 2, z = { left: q.left, right: q.right, top: q.top, bottom: q.bottom };
    frEls(f).forEach(function (x) { var r = ykR(x); if (Math.abs((r.top + r.bottom) / 2 - m) < 14) { z.left = Math.min(z.left, r.left); z.right = Math.max(z.right, r.right); z.top = Math.min(z.top, r.top); z.bottom = Math.max(z.bottom, r.bottom) } });
    z.width = z.right - z.left; return z;
  }
  /* ramka qatordan qatorga o'tsa — bo'linish joyida ochiq qoladi (t3o) */
  function rowFix() {
    FR.forEach(function (f) {
      var prev = null, E = frEls(f);
      E.forEach(function (e, n) {
        if (n != 0) e.classList.remove('t3s'); if (n != E.length - 1) e.classList.remove('t3e'); e.classList.remove('t3o');
        if (prev && Math.abs(prev.offsetTop - e.offsetTop) > 4) { prev.classList.add('t3o'); }
        prev = e;
      });
    });
  }

  /* bog'lanishlar: har so'z bosilganda nima chiqishi */
  function grpWords(L, a, b) { var o = []; for (var i = a; i <= b; i++) if (LW[L][i]) o.push(LW[L][i]); return o }
  function relations() {
    RELS = {};
    function set(k, r) { if (!RELS[k]) RELS[k] = r }
    function els(ws) { return ws.map(function (w) { return w.e }) }
    LW.forEach(function (row, L) {
      if (!row) return;
      /* tobe' */
      row.forEach(function (w) {
        if (!w || !w.tob) return;
        var t = WD[w.tob];
        if (t) set(w.k, { src: [w.e], tg: [t.e], lab: w.tl });
      });
      /* izofa: muzofun ilayh — muzofga */
      row.forEach(function (w) {
        if (!w || !/музофун илайҳ/.test(w.role)) return;
        for (var i = w.i - 1; i >= 0; i--) { var p = row[i]; if (!p) continue; if (p.harf) break; set(w.k, { src: [w.e], tg: [p.e], lab: 'музофун илайҳ' }); break }
      });
      /* jumla guruhlari: sila — mavsulga, muzofun ilayh jumla — zarfga */
      (G[L] || []).forEach(function (g) {
        if (g[3] != 'j') return;
        var ws = grpWords(L, g[0], g[1]), h = row[g[0] - 1]; if (!ws.length || !h) return;
        if (/сила/.test(g[2])) set(h.k, { src: els(ws), tg: [h.e], lab: 'сила', grp: true });
        else if (/музофун илайҳ/.test(g[2])) set(h.k, { src: els(ws), tg: [h.e], lab: 'музофун илайҳ', grp: true });
      });
      /* shibhi jumla — mutaalliq */
      (G[L] || []).forEach(function (g) {
        if (g[3] != 's') return;
        var ws = grpWords(L, g[0], g[1]); if (!ws.length) return;
        var d = g[2].replace(/^шибҳи жумла — ?/, ''), tg = [];
        if (g.gh) tg = [g.gh.e];
        else if (!/маҳзуф/.test(d)) { var a = d.match(/^([؀-ۿً-ْٰ]+)/); var t = a && findTxt(L, g[0], a[1]); if (t) tg = [t.e] }
        var r = { src: els(ws), tg: tg, lab: tg.length ? 'мутааллиқ' : (/маҳзуф жавоб/.test(d) ? 'мутааллиқ (жавоби маҳзуф)' : 'мутааллиқ'), grp: true };
        ws.forEach(function (w) { if (!/музофун илайҳ/.test(w.role) && !w.tob) set(w.k, r) });
      });
      /* zarf — IRB qatoridagi «… га мутааллиқ» */
      row.forEach(function (w) {
        if (!w || RELS[w.k]) return;
        var u = (w.rows[w.mi] || {}).u || '', m = u.match(/шибҳи жумла бўлиб,? ([؀-ۿً-ْٰ]+) га мутааллиқ/);
        if (m) { var t = findTxt(L, w.i, m[1]); set(w.k, { src: [w.e], tg: t ? [t.e] : [], lab: 'мутааллиқ' }) }
      });
      /* gap asoslari — har jumla bo'lagida (TKT chegaralari) */
      var segs = [], a0 = 0;
      (TT[L] || []).forEach(function (t) { segs.push([a0, t[0]]); a0 = t[0] + 1 });
      if (!segs.length || a0 < row.length) segs.push([a0, row.length - 1]);
      segs.forEach(function (sg) {
        var W = row.slice(sg[0], sg[1] + 1).filter(Boolean);
        var kn = W.filter(function (w) { return w.mc == 'cz' })[0];
        var mb = W.filter(function (w) { return w.mc == 'cm' && !w.tob && !w.fr })[0];
        var xb = W.filter(function (w) { return (w.mc == 'cx' && !w.tob) || (w.fr && w.fr.c == 'cx') })[0];
        var gm = GH.filter(function (g) { return g.L == L && g.kind == 'm' && g.i >= sg[0] && g.i <= sg[1] })[0];
        var xs = xb ? (xb.fr ? [frEls(xb.fr)[0]] : [xb.e]) : [];
        var ky = kn && kn.yz && kn.yzc == 'cm' ? kn.e.querySelector('.t3y') : null;
        var ms = mb ? [mb.e] : gm ? [gm.e] : ky ? [ky] : [];
        if (kn && (ms.length || xs.length)) {
          /* kana / inna va sheriklari: undan ikki ip — ismiga va xabariga (18.11.2026, foydalanuvchi) */
          var kt = [], kl = [];
          if (ms.length) { kt.push(ms[0]); kl.push('исми') }
          if (xs.length) { kt.push(xs[0]); kl.push('хабари') }
          var kr = { src: [kn.e], tg: kt, tl: kl, tgf: true, lab: '' };
          set(kn.k, kr); if (mb) set(mb.k, kr); if (gm) gm.rel = kr;
          if (xb) (xb.fr ? grpWords(L, xb.fr.a, xb.fr.b) : [xb]).forEach(function (w) { set(w.k, kr) });
          if (xb && xb.fr && xb.fr.gh && !xb.fr.gh.rel) xb.fr.gh.rel = kr;
        }
        else if (ms.length && xs.length) {
          var pr = { src: ms, tg: xs, tl: ['хабар'], tgf: true, lab: 'мубтадо' };
          if (mb) set(mb.k, pr); if (gm) gm.rel = pr;
          (xb.fr ? grpWords(L, xb.fr.a, xb.fr.b) : [xb]).forEach(function (w) { set(w.k, pr) });
          if (xb.fr && xb.fr.gh && !xb.fr.gh.rel) xb.fr.gh.rel = pr;
        }
        /* bitta bo'lakda bir nechta mubtado–xabar (atf qilingan jumlalar, 19.11.2026): har juftlik o'z ipi bilan.
           Avval xabar izohidagi «X нинг хабари» bo'yicha, bo'lmasa — tartib bo'yicha (sonlari teng bo'lsa) */
        {
          var tx0 = kn && (ms.length || xs.length) ? xs : (ms.length && xs.length ? xs : []);
          var mbs = W.filter(function (w) { return w.mc == 'cm' && !w.tob && !w.fr && !RELS[w.k] });
          var xu = [], seen = [];
          W.forEach(function (w) {
            if (!((w.mc == 'cx' && !w.tob) || (w.fr && w.fr.c == 'cx'))) return;
            if (w.fr) { if (seen.indexOf(w.fr) >= 0) return; seen.push(w.fr) }
            var ws2 = w.fr ? grpWords(L, w.fr.a, w.fr.b) : [w];
            var el = w.fr ? frEls(w.fr)[0] : w.e;
            if (tx0.indexOf(el) >= 0 || ws2.some(function (o) { return RELS[o.k] && (RELS[o.k].lab == 'мубтадо' || RELS[o.k].src[0] === (kn && kn.e)) })) return;
            xu.push({ w: w, ws: ws2, el: el });
          });
          function pair(m, x) {
            var p2 = { src: [m.e], tg: [x.el], tl: ['хабар'], tgf: true, lab: 'мубтадо' };
            set(m.k, p2); x.ws.forEach(function (o) { set(o.k, p2) });
            mbs.splice(mbs.indexOf(m), 1); xu.splice(xu.indexOf(x), 1);
          }
          xu.slice().forEach(function (x) {
            var h = ((x.w.nrows.join(' ') + ' ' + ((x.w.rows[x.w.mi] || {}).u || '')).match(/([؀-ۿً-ْٰ]+) нинг хабари/) || [])[1];
            var m = h && mbs.filter(function (o) { var b = bare(wt(o.e)), q = bare(h); return b == q || b.replace(/^[وف]/, '') == q })[0];
            if (m) pair(m, x);
          });
          if (mbs.length && mbs.length == xu.length) mbs.slice().forEach(function (m, z) { pair(m, xu[0]) });
        }
        /* fe'l — foil — maf'ul */
        W.forEach(function (w) {
          if (w.mc == 'co' && !w.tob) { var f = prevF(row, w.i, sg[0]); if (f) set(w.k, { src: [w.e], tg: [f.e], lab: /ноиби/.test(w.role) ? 'ноиби фоил' : 'фоил', tl: ['феъл'], tgf: true }) }
          if (w.mc == 'cb' && !w.tob) { var f2 = prevF(row, w.i, 0); if (f2) set(w.k, { src: [w.e], tg: [f2.e], lab: 'мафъулун биҳ', tl: ['феъл'], tgf: true }) }
        });
        W.forEach(function (w) {
          if (!w.isF || w.mc == 'cz') return;
          var fo = W.filter(function (o) { return o.mc == 'co' && !o.tob && o.i > w.i && prevF(row, o.i, sg[0]) === w })[0];
          set(w.k, fo ? { src: [w.e], tg: [fo.e], lab: 'феъл', tl: ['фоил'], tgf: true } : { src: [w.e], tg: [], lab: 'феъл' });
        });
      });
      /* mubtadoning ikkinchi xabari (jumla, ko'pincha keyingi gapda) — mubtadodan unga ham ip (18.11.2026, foydalanuvchi) */
      (G[L] || []).forEach(function (g) {
        if (g[3] != 'j' || !/иккинчи хабар/.test(g[2])) return;
        var ws = grpWords(L, g[0], g[1]); if (!ws.length) return;
        var hint = (ws.map(function (w) { return w.nrows.join(' ') }).join(' ').match(/мубтадонинг \(([^)]+)\)/) || [])[1], mb = null;
        for (var L2 = L; L2 >= 0 && L2 >= L - 3 && !mb; L2--) {
          var r2 = LW[L2] || [];
          for (var i = (L2 == L ? g[0] - 1 : r2.length - 1); i >= 0; i--) {
            var w = r2[i]; if (!w) continue;
            if (hint ? bare(wt(w.e)).replace(/^[وف]/, '') == bare(hint) : (w.mc == 'cm' && !w.tob && /мубтадо/.test(w.role))) { mb = w; break }
          }
        }
        if (!mb) return;
        var r1 = RELS[mb.k];
        if (r1 && r1.tl && r1.src[0] === mb.e) { r1.tg = r1.tg.concat([ws[0].e]); r1.tl = r1.tl.map(function (t) { return t == 'хабар' ? '1-хабар' : t }).concat(['2-хабар']) }
        else RELS[mb.k] = { src: [mb.e], tg: [ws[0].e], tl: ['2-хабар'], tgf: true, lab: 'мубтадо' };
        RELS[ws[0].k] = { src: els(ws), tg: [mb.e], tl: ['мубтадо'], lab: '2-хабар', grp: true, tgf: true };
      });
      /* qolganlari — o'z ramkasi va nomi */
      row.forEach(function (w) {
        if (!w || RELS[w.k] || w.mc == '0' || w.mc == '') return;
        var nm = w.harf ? '' : (w.role || '').replace(/,.*$/, '');
        set(w.k, { src: [w.e], tg: [], lab: nm });
      });
    });
  }
  function prevF(row, i, a) { for (var j = i - 1; j >= a; j--) { var w = row[j]; if (w && w.isF && w.mc != 'cz') return w } return null }

  /* ===================== 2-qavat: chizish ===================== */
  var YS = null, YC = null, YX = [], YF = [], YN = 0;
  function ykI() {
    if (YS && YS.parentNode === tx) return;
    YS = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); YS.setAttribute('class', 't3k'); tx.appendChild(YS);
    YC = document.createElement('div'); YC.className = 't3c'; YC.hidden = true; tx.appendChild(YC);
  }
  var PADS = [];
  function unpad() { PADS.forEach(function (e) { e.style.paddingBottom = '' }); PADS = [] }
  function clr(keep) {
    if (!keep) unpad();
    if (YS) YS.innerHTML = ''; if (YC) YC.hidden = true; YX.forEach(function (d) { d.remove() }); YX = [];
    YF.forEach(function (e) { e.classList.remove('t3f', 't3fo') }); YF = [];
    [].forEach.call(tx.querySelectorAll('.t3dim,.nq-r.on'), function (e) { e.classList.remove('t3dim', 'on') });
  }
  /* tanlovga tegishli doimiy ramkalar — ko'rinadi va butunicha yonadi */
  function frOn(els, rel) {
    var seen = [];
    els.forEach(function (e) { var f = e && e.t3fr; if (!f || seen.indexOf(f) >= 0) return; if (f.gh && !(rel && rel.tl && (rel.tg || []).indexOf(e) >= 0)) return; seen.push(f); frEls(f).forEach(function (x) { x.classList.add('t3fo', 't3f'); YF.push(x) }) });
  }
  function ykR(el) {
    var R = el.getClientRects(), f = R[0]; if (!f) return el.getBoundingClientRect();
    var l = f.left, r = f.right, t = f.top, b = f.bottom;
    [].forEach.call(R, function (x) { if (Math.abs((x.top + x.bottom) - (f.top + f.bottom)) < 12 && x.width > 0) { l = Math.min(l, x.left); r = Math.max(r, x.right); t = Math.min(t, x.top); b = Math.max(b, x.bottom) } });
    return { left: l, right: r, top: t, bottom: b, width: r - l };
  }
  var TXC = '', MU = '';
  function frC(e) { return getComputedStyle(e).borderTopColor }
  function colOf(e) { var q = (e.querySelector && e.querySelector('.q3m')) || e, c = getComputedStyle(q).color; if (c == TXC) c = MU; return c }
  function rows(ws) {
    var L = [];
    ws.forEach(function (x) {
      var q = ykR(x), m = (q.top + q.bottom) / 2, f = null;
      L.forEach(function (z) { if (Math.abs((z.t + z.b) / 2 - m) < 12) f = z });
      if (f) { f.l = Math.min(f.l, q.left); f.r = Math.max(f.r, q.right); f.t = Math.min(f.t, q.top); f.b = Math.max(f.b, q.bottom) } else L.push({ l: q.left, r: q.right, t: q.top, b: q.bottom });
    });
    return L;
  }
  /* bir necha qatorga bo'lingan bo'lak: bo'linish joyida ramka ochiq — keyingi qatorda davom etadi */
  function pieces(L, c, col, ins) {
    if (L.length < 2) return L.length ? rect(L[0], c, col, false, ins) : '';
    var o = '', E = 12, R = 10;
    L.forEach(function (z, i) {
      var x0 = z.l - c.left - 3, x1 = z.r - c.left + 3, y0 = z.t - c.top + 3, y1 = z.b - c.top - 3, oL = i < L.length - 1, oR = i > 0, d;
      if (oL && oR) d = 'M' + (x0 - E) + ' ' + y0 + ' H' + (x1 + E) + ' M' + (x0 - E) + ' ' + y1 + ' H' + (x1 + E);
      else if (oL) d = 'M' + (x0 - E) + ' ' + y0 + ' H' + (x1 - R) + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + R) + ' V' + (y1 - R) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - R) + ' ' + y1 + ' H' + (x0 - E);
      else d = 'M' + (x1 + E) + ' ' + y0 + ' H' + (x0 + R) + ' Q' + x0 + ' ' + y0 + ' ' + x0 + ' ' + (y0 + R) + ' V' + (y1 - R) + ' Q' + x0 + ' ' + y1 + ' ' + (x0 + R) + ' ' + y1 + ' H' + (x1 + E);
      o += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2" stroke-linecap="round"/>';
    });
    return o;
  }
  /* nuqtalar orqali sim, burchaklari yumaloq */
  function rpath(P, R) {
    P = P.filter(function (p, k) { return k == 0 || Math.abs(p[0] - P[k - 1][0]) > .5 || Math.abs(p[1] - P[k - 1][1]) > .5 });
    var d = 'M' + P[0][0] + ' ' + P[0][1];
    for (var k = 1; k < P.length; k++) {
      var p = P[k], q = P[k - 1], n = P[k + 1];
      if (!n) { d += ' L' + p[0] + ' ' + p[1]; break }
      var l1 = Math.hypot(p[0] - q[0], p[1] - q[1]), l2 = Math.hypot(n[0] - p[0], n[1] - p[1]), r = Math.min(R, l1 / 2, l2 / 2);
      var a = [p[0] - (p[0] - q[0]) / l1 * r, p[1] - (p[1] - q[1]) / l1 * r], b = [p[0] + (n[0] - p[0]) / l2 * r, p[1] + (n[1] - p[1]) / l2 * r];
      d += ' L' + a[0] + ' ' + a[1] + ' Q' + p[0] + ' ' + p[1] + ' ' + b[0] + ' ' + b[1];
    }
    return d;
  }
  /* ins — doimiy ramka ichidagi so'zga ichkariroq (kichikroq) ramka, ikki chiziq ustma-ust tushmasin */
  function rect(z, c, col, dash, ins) { var o = ins ? -2 : 3, v = ins ? 6 : 3; return '<rect x="' + (z.l - c.left - o) + '" y="' + (z.t - c.top + v) + '" width="' + (z.r - z.l + 2 * o) + '" height="' + (z.b - z.t - 2 * v) + '" rx="' + (ins ? 8 : 10) + '" fill="none" stroke="' + col + '" stroke-width="2"' + (dash ? ' stroke-dasharray="6 4"' : '') + '/>' }
  function show(rel, again) {
    clr(again); if (!tartib() || !rel) return;
    ykI();
    TXC = getComputedStyle(tx).color; MU = getComputedStyle(document.documentElement).getPropertyValue('--mu').trim() || '#8a8f8a';
    var src = rel.src.filter(Boolean); if (!src.length) return;
    frOn(src.concat(rel.tg || []), rel);
    src.concat((rel.tg || []).filter(Boolean)).forEach(function (x) { x.classList.add('t3f'); YF.push(x) });
    var ln = src[0].closest('.ln'), c = tx.getBoundingClientRect();
    var last = src[src.length - 1], fc = colOf(last), LL = rows(src);
    /* yashirin zamir ko'rinsa — ramka uni ham o'z ichiga oladi */
    yzX(src, LL);
    var a = { left: Math.min.apply(null, LL.map(function (z) { return z.l })), right: Math.max.apply(null, LL.map(function (z) { return z.r })), top: Math.min.apply(null, LL.map(function (z) { return z.t })), bottom: Math.max.apply(null, LL.map(function (z) { return z.b })) };
    /* bo'lak bir necha qatorda bo'lsa — chiziq va yorliq bog'langan so'zga eng yaqin qatordagi bo'lagiga */
    var t0 = (rel.tg || []).filter(function (te) { return te && te.closest('.ln') === ln })[0] || (rel.tg || []).filter(Boolean)[0], pk = LL[LL.length - 1];
    if (t0 && LL.length > 1) { var q0 = ykR(t0), m0 = (q0.top + q0.bottom) / 2; pk = LL.reduce(function (p, z) { return Math.abs((z.t + z.b) / 2 - m0) < Math.abs((p.t + p.b) / 2 - m0) ? z : p }) }
    var inFr = src.every(function (x) { return x.classList.contains('t3r') }) && src.length > 1 && rel.grp;
    var RS = src.filter(function (x) { return !x.classList.contains('t3h') }); /* mahzufning o'z uzuq ramkasi bor */
    var ins = !inFr && RS.length > 0 && RS.every(function (x) { return x.classList.contains('t3r') });
    if (inFr) fc = frC(src[0]); /* butun bo'lak doimiy ramkada — uning rangi */
    var sf = inFr || !RS.length ? 0 : ins ? 6 : 3, so = inFr || !RS.length ? 0 : ins ? -2 : 3;
    var fx = (pk.l + pk.r) / 2 - c.left, fb = pk.b - c.top - sf, ft = pk.t - c.top + sf, ly = fb + 6, h = '';
    if (!inFr && RS.length) { var RR = rows(RS); yzX(RS, RR); h += pieces(RR, c, fc, ins) } /* ramka chizig'i yashirin zamir ustidan o'tmasin (19.11.2026, foydalanuvchi) */
    var XT = null, XB = null, LS = [];
    (rel.tg || []).forEach(function (te, ti) {
      if (!te) return; te.classList.add('t3f'); YF.push(te);
      if (te.t3fr && rel.tl) frEls(te.t3fr).forEach(function (x) { x.classList.add('t3f'); YF.push(x) }); /* nishon ramkada — butun ramka yonadi */
      var tr = te.classList.contains('t3r'), cc = tr && rel.tl ? frC(te) : colOf(te), inS = src.some(function (x) { return x !== te && x.contains && x.contains(te) });
      if (te.closest('.ln') === ln) {
        var tq = yzB(te, frT(te, rel));
        if (!inS && !te.classList.contains('t3h') && !(tr && rel.tl)) h += rect({ l: tq.left, r: tq.right, t: tq.top, b: tq.bottom }, c, cc, false, tr);
        if (rel.tl && rel.tl[ti]) LS.push([rel.tl[ti], (tq.left + tq.right) / 2 - c.left, tq.bottom - c.top + 4, cc]);
        if (inS) return;
      }
      if (te.closest('.ln') !== ln) {
        /* boshqa gapdagi nishon: sim bo'lakning o'sha chiqish nuqtasidan (ramka osti / usti o'rtasi) chiqib, o'ng chetdan yuradi va nishonga ulanadi — strelkasiz (18.11.2026, foydalanuvchi) */
        var bb = frT(te, rel), up = bb.top < a.top;
        if (!te.classList.contains('t3r')) h += rect({ l: bb.left, r: bb.right, t: bb.top, b: bb.bottom }, c, cc, !rel.tgf);
        var xr = Math.min(Math.max(a.right, bb.right) - c.left + 14, c.width - 6), tx1 = (bb.left + bb.right) / 2 - c.left,
          y0 = up ? ft : fb, y1 = up ? ft - 10 : fb + 10, ey = up ? bb.bottom - c.top + 12 : bb.top - c.top - 12, end = up ? bb.bottom - c.top + 1 : bb.top - c.top - 1, gid = 't3m' + (YN++);
        /* nishon qator boshida (o'ng chetda) bo'lsa — sim uning ramkasiga yondan ulanadi (18.11.2026, foydalanuvchi: «o'sha ramkaga ulanib ketsin») */
        var wsr = (te.closest('.ws') || te).getBoundingClientRect(), side = Math.abs(bb.right - wsr.right) < 14,
          my = (bb.top + bb.bottom) / 2 - c.top, sx2 = bb.right - c.left + (te.classList.contains('t3r') ? 1 : 4);
        h += '<defs><linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="0" y1="' + y0 + '" x2="0" y2="' + end + '"><stop offset="0" stop-color="' + fc + '"/><stop offset=".45" stop-color="' + fc + '"/><stop offset=".55" stop-color="' + cc + '"/><stop offset="1" stop-color="' + cc + '"/></linearGradient></defs>' +
          '<path d="' + rpath(side ? [[fx, y0], [fx, y1], [xr, y1], [xr, my], [sx2, my]] : [[fx, y0], [fx, y1], [xr, y1], [xr, ey], [tx1, ey], [tx1, end]], 10) + '" fill="none" stroke="url(#' + gid + ')" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<circle cx="' + fx + '" cy="' + y0 + '" r="3.3" fill="' + fc + '"/>';
        var xw = wt(te).replace(/[:،.؟!\s–]+$/, '');
        if (rel.tl && rel.tl[ti]) LS.push(side ? [rel.tl[ti], bb.right - c.left - 16, up ? bb.bottom - c.top + 2 : bb.top - c.top - 24, cc, null, '', 2] : [rel.tl[ti], tx1, ey - 11, cc, null, '', 2]); /* nomi — sim ulangan joy yonida */
        else if (!XT) XT = { e: te, up: up, x: xw };
        return;
      }
      /* gap ichidagi nishon: sim bo'lak ramkasining o'rtasidan chiqib, nishon ramkasining chetiga ulanadi (so'z ichiga kirmaydi) — boshqa gapga simdek, yumaloq burchakli (18.11.2026, foydalanuvchi) */
      var gh0 = te.classList.contains('t3h') && !tr, b = yzB(te, frT(te, rel)), tf = gh0 || (tr && rel.tl) ? 0 : tr ? 6 : 3, to = gh0 || (tr && rel.tl) ? 0 : tr ? -2 : 3, tx2 = (b.left + b.right) / 2 - c.left,
        tb = b.bottom - c.top - tf, tt = b.top - c.top + tf, id = 't3g' + (YN++), P, y0, y9;
      var same = Math.abs((pk.t + pk.b) - (b.top + b.bottom)) < 40;
      if (same) { var yb = Math.max(fb, tb) + 9; P = [[fx, fb], [fx, yb], [tx2, yb], [tx2, tb]]; y0 = fb; y9 = tb; ly = Math.max(ly, yb + 4) }
      else if (b.top < pk.t) { var ym = (ft + tb) / 2; P = [[fx, ft], [fx, ym], [tx2, ym], [tx2, tb]]; y0 = ft; y9 = tb }
      else { var ym2 = (fb + tt) / 2; P = [[fx, fb], [fx, ym2], [tx2, ym2], [tx2, tt]]; y0 = fb; y9 = tt }
      h += '<defs><linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + fx + '" y1="' + y0 + '" x2="' + tx2 + '" y2="' + y9 + '"><stop offset="0" stop-color="' + fc + '"/><stop offset=".45" stop-color="' + fc + '"/><stop offset=".55" stop-color="' + cc + '"/><stop offset="1" stop-color="' + cc + '"/></linearGradient></defs>' +
        '<path d="' + rpath(P, 8) + '" fill="none" stroke="url(#' + id + ')" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="' + fx + '" cy="' + y0 + '" r="3.3" fill="' + fc + '"/>';
    });
    YS.insertAdjacentHTML('beforeend', h);
    if (rel.lab) {
      if (XT) { YC.innerHTML = esc(rel.lab) + ' ' + (XT.up ? '↑' : '↓') + ' <b class="ar">' + esc(XT.x) + '</b>'; YC.t3 = XT.e; YC.style.pointerEvents = 'auto'; YC.style.cursor = 'pointer' }
      else { YC.textContent = rel.lab; YC.t3 = null; YC.style.pointerEvents = 'none' }
      YC.style.background = fc; YC.hidden = false; var lw = YC.offsetWidth / 2; YC.style.left = Math.min(Math.max(fx, lw + 4), c.width - lw - 4) + 'px'; YC.style.top = ly + 'px';
    }
    /* nishon yorliqlari: chiziqlar ostida; bir-biriga tegsa — yonga (sig'masa — pastga) */
    var placed = YC.hidden ? [] : [YC.getBoundingClientRect()];
    LS.forEach(function (sp) {
      var d = document.createElement('div'); d.className = 't3c'; d.style.background = sp[3]; tx.appendChild(d); YX.push(d);
      if (sp[6]) d.t3x = 1;
      if (sp[4]) { d.innerHTML = esc(sp[0]) + ' <b class="ar">' + esc(sp[5]) + '</b>'; d.t3 = sp[4]; d.style.pointerEvents = 'auto'; d.style.cursor = 'pointer' } else d.textContent = sp[0];
      var w = d.offsetWidth / 2, x = Math.min(Math.max(sp[6] == 2 ? sp[1] - w - 8 : sp[1], w + 4), c.width - w - 4), y = sp[6] ? sp[2] : Math.max(sp[2], ly);
      d.style.left = x + 'px'; d.style.top = y + 'px';
      for (var t = 0; t < 6; t++) {
        var r = d.getBoundingClientRect(), hit = placed.filter(function (p) { return r.left < p.right + 4 && p.left < r.right + 4 && r.top < p.bottom && p.top < r.bottom })[0];
        if (!hit) break;
        var nx = (r.left + r.right) / 2 < (hit.left + hit.right) / 2 ? hit.left - c.left - 6 - w : hit.right - c.left + 6 + w;
        if (nx - w < 4 || nx + w > c.width - 4) { y = hit.bottom - c.top + 4; d.style.top = y + 'px' } else { x = nx; d.style.left = x + 'px' }
      }
      placed.push(d.getBoundingClientRect());
    });
    if (ln) ln.classList.add('t3dim');
    /* yorliq arabcha qatordan pastga — tarjima ustiga — tushsa: qator ostiga vaqtincha joy ochib, qayta chiziladi */
    if (!again) {
      var r1 = src[0].closest && src[0].closest('.r1'), lb = 0;
      [YC].concat(YX).forEach(function (d) { if (d && !d.hidden && !d.t3x) lb = Math.max(lb, d.getBoundingClientRect().bottom) });
      if (r1 && lb) { var ov = lb - r1.getBoundingClientRect().bottom + 4; if (ov > 0) { r1.style.paddingBottom = Math.ceil(ov) + 'px'; PADS.push(r1); show(rel, true) } }
    }
  }

  /* ===================== «Қоидалар» qutisi ===================== */
  var ORD = ['MUBXAB', 'KANA', 'LAYSA', 'LAKINNA', 'ANNA', 'LANAFI', 'FAIL', 'MAFUL', 'JARR', 'IDAFA', 'ATF', 'SIFAT', 'BADAL', 'HAL', 'ZARF', 'MUTLAQ', 'TAMYIZ', 'NIDA'];
  var NM = { JARR: 'Жар ва мажрур', ATF: 'Атф', KANA: 'كَانَ ва синглилари', ZARF: 'Зарф', ISTIF: 'Савол сўзи', PRON: 'Муттасил замир', DAMIR: 'Мунфасил замир', ISHARA: 'Исм ишора', MAWSUL: 'Исм мавсул', GHAYR: 'Ғайри мунсариф', MUDRAF: 'Музорийнинг рафи', AMR: 'Амр феъли', MOZI: 'Мозий феъл', SIFAT: 'Сифат', SHART: 'Шарт' };
  function chipW(w) {
    var h = '';
    [].forEach.call(w.e.querySelectorAll('span.q3'), function (q) { h += '<span class="' + q.className.replace(/\bq3m?\b/g, '').trim() + '">' + esc(q.textContent.replace(/[:،.؟!]+$/, '')) + '</span>' });
    return h || esc(w.e.textContent);
  }
  /* qoida matni: **…** — qalin (band nomi), \n — yangi qator (19.11.2026) */
  function qf(s) { return arw(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>') }
  var OPN = {}; /* ochiq qutilar (gap raqami) — faqat shu ochilishda; dars qayta ochilsa hammasi yopiq */
  function box(L) {
    var row = LW[L]; if (!row || !row.length) return '';
    var K = {}, ks = [];
    row.forEach(function (w) { if (!w) return; (QMP[w.k] || []).forEach(function (q) { if (!QT[q]) return; if (!K[q]) { K[q] = []; ks.push(q) } K[q].push(w.i) }) });
    /* كَانَ / إِنَّ qatori: kana, ismi va xabari (ramkasi butunicha, mahzufi bilan) — 18.11.2026, foydalanuvchi */
    var KH = {};
    ['KANA', 'LAYSA', 'LAKINNA', 'ANNA'].forEach(function (q) {
      if (!K[q]) return;
      K[q].slice().forEach(function (i) {
        var w = row[i], r = w && w.mc == 'cz' && RELS[w.k]; if (!r || !r.tl) return;
        r.tg.forEach(function (te) {
          if (!te) return; var f = te.t3fr, ix = [];
          if (f && f.L == L) { if (f.gh) { KH[f.gh.i - .5] = f.gh; ix.push(f.gh.i - .5) } else for (var j = f.a; j <= f.b; j++) ix.push(j) }
          else { var k = te.getAttribute('data-i'), ww = k && WD[k]; if (ww && ww.L == L) ix.push(ww.i) }
          ix.forEach(function (j) { if ((row[j] || KH[j]) && K[q].indexOf(j) < 0) K[q].push(j) });
        });
      });
    });
    ks.sort(function (p, q) { var a = ORD.indexOf(p), b = ORD.indexOf(q); a = a < 0 ? 99 : a; b = b < 0 ? 99 : b; return a - b || K[p][0] - K[q][0] });
    var gh = GH.filter(function (g) { return g.L == L });
    var bf = []; row.forEach(function (w) { if (w && w.E.o) w.E.o.forEach(function (o) { if (/Бошқа фикр/.test(o[0])) bf.push([w, o[1]]) }) });
    if (!ks.length && !gh.length && !bf.length) return '';
    var ty = [];
    (TT[L] || []).forEach(function (t) { var m = String(t[1]).match(/Жумлатун (исмийя|феълийя|таажжуб)/), v = t.st || (m && m[1]); if (v && ty.indexOf(v) < 0) ty.push(v) });
    var n = ks.length + (gh.length ? 1 : 0) + bf.length;
    var o = '<div class="nqb' + (OPN[L] ? ' op' : '') + '" data-l="' + L + '"><div class="nq-h" role="button" aria-expanded="' + !!OPN[L] + '"><span>Қоидалар (' + n + ')</span><span class="nq-v"></span>' +
      (ty.length ? '<span class="fgt">' + ty.join(' · ') + '</span>' : '') + '</div>';
    if (ks.length) {
      ks.forEach(function (q) {
        var ix = K[q].sort(function (a, b) { return a - b }), runs = [], cur = null;
        ix.forEach(function (i) { if (cur && i - cur[cur.length - 1] <= 1) cur.push(i); else { cur = [i]; runs.push(cur) } });
        var T = QT[q], more = T[1].slice(1);
        o += '<div class="nq-r" data-q="' + q + '"><div class="nq-m"><div class="nq-t">' + arw(NM[q] || T[0]) + '</div><div class="nq-c">' +
          runs.map(function (r) { var hz = r.filter(function (i) { return KH[i] }).map(function (i) { return GH.indexOf(KH[i]) }), wi = r.filter(function (i) { return !KH[i] }); return '<span data-w="' + wi.join(',') + '"' + (hz.length ? ' data-h="' + hz.join(',') + '"' : '') + '>' + r.map(function (i) { return KH[i] ? '<span class="nq-hz">' + esc(KH[i].t) + '</span>' : chipW(row[i]) }).join(' ') + '</span>' }).join('') +
          '</div></div><span class="nq-g"></span><div class="nq-k">' + qf(T[1][0] || '') + (more.length ? '<div><span class="nq-more">Батафсил ▾</span><ul hidden>' + more.map(function (s) { return '<li>' + qf(s) + '</li>' }).join('') + '</ul></div>' : '') + '</div></div>';
      });
    }
    if (gh.length) {
      o += '<div class="nq-r" data-hz="1"><div class="nq-m"><div class="nq-t">Ҳазф</div><div class="nq-c">' + gh.map(function (g) { return '<span class="nq-hz">' + esc(g.t) + '</span>' }).join('') +
        '</div></div><span class="nq-g"></span><div class="nq-k"><b>Ҳазф</b> — гапда тушиб қолган (маҳзуф), лекин маъно ва эъробда бор сўз. Матнда ўз ўрнида кичик ва хира кўрсатилади.' +
        gh.map(function (g) { return '<div>• <span class="ar">' + esc(g.t) + '</span> — ' + arw(g.why) + '</div>' }).join('') + '</div></div>';
    }
    bf.forEach(function (b, n) {
      o += '<div class="nq-r nq-bf" data-b="' + n + '" data-w="' + b[0].i + '"><div class="nq-m"><div class="nq-t">⚖️ Бошқа фикр</div><div class="nq-c"><span>' + chipW(b[0]) + '</span></div></div><span class="nq-g"></span><div class="nq-k">' + arw(b[1]) + '</div></div>';
    });
    return o + '</div>';
  }
  function boxes() {
    [].forEach.call(tx.querySelectorAll('.nqb'), function (b) { b.remove() });
    [].forEach.call(lines(), function (ln, L) {
      if (getComputedStyle(ln).display == 'none') return;
      var h = box(L); if (!h) return;
      var trs = ln.querySelectorAll('.tr'), tr = trs[trs.length - 1];
      var d = document.createElement('div'); d.innerHTML = h; var b = d.firstChild;
      if (tr) tr.parentNode.insertBefore(b, tr.nextSibling); else ln.appendChild(b);
      /* quti bosilishi — o'zida (shell.js «abzas bosilsa o'qiydi» ishlamasin) */
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var mo = ev.target.closest('.nq-more'); if (mo) { var ul = mo.nextElementSibling; if (ul) { ul.hidden = !ul.hidden; mo.textContent = ul.hidden ? 'Батафсил ▾' : 'Йиғиш ▴' } return }
        if (ev.target.closest('.nq-k')) return;
        if (ev.target.closest('.nq-h')) {
          var op = !b.classList.contains('op'); clr(); b.classList.toggle('op', op);
          OPN[b.getAttribute('data-l')] = op; b.firstChild.setAttribute('aria-expanded', op); return;
        }
        var r = ev.target.closest('.nq-r'); if (r) nqOn(r); else clr();
      });
    });
  }
  function nqOn(r) {
    var on = r.classList.contains('on'); clr(); if (on || !tartib()) return;
    var b = r.closest('.nqb'), L = +b.getAttribute('data-l'), ln = r.closest('.ln'), row = LW[L];
    r.classList.add('on'); ykI();
    TXC = getComputedStyle(tx).color; MU = getComputedStyle(document.documentElement).getPropertyValue('--mu').trim() || '#8a8f8a';
    var c = tx.getBoundingClientRect(), h = '', G2 = [];
    if (r.dataset.hz) GH.filter(function (g) { return g.L == L }).forEach(function (g) { G2.push([g.e]) });
    else if (r.dataset.q) [].forEach.call(r.querySelectorAll('.nq-c>span[data-w]'), function (s) { G2.push(s.getAttribute('data-w').split(',').map(function (i) { return row[+i] && row[+i].e }).concat((s.getAttribute('data-h') || '').split(',').map(function (h) { return h !== '' && GH[+h] && GH[+h].e })).filter(Boolean)) });
    else if (r.dataset.w) G2.push([row[+r.dataset.w].e]);
    G2.forEach(function (ws) { frOn(ws) });
    G2.forEach(function (ws) {
      if (!ws.length) return; var fc = colOf(ws[ws.length - 1]);
      ws.forEach(function (x) { x.classList.add('t3f'); YF.push(x) });
      h += pieces(rows(ws), c, fc);
    });
    YS.insertAdjacentHTML('beforeend', h); if (ln) ln.classList.add('t3dim');
  }

  /* ===================== belgilar ===================== */
  var LGV = { cm: '--cm', cx: '--cx', co: '--co', cb: '--nb', cn: '--nn', cj: '--nj', jh: '--nh', cf: '--cf', cd: '--nd', cz: '--nz' };
  var LGT = { cm: '<b>Мубтадо</b> — гап нима ҳақида (كَانَ ва إِنَّ нинг исми ҳам). Раф қилинган (аломати — замма).', cx: '<b>Хабар</b> — мубтадо ҳақида нима дейилади (كَانَ ва إِنَّ нинг хабари ҳам).',
    co: '<b>Фоил, ноиби фоил</b> — ишни ким қилди. Раф қилинган (замма).', cb: '<b>Мафъулун биҳ</b> — иш нимага тушди. Насб қилинган (фатҳа).',
    cn: '<b>Мансуб</b> — мафъулун биҳдан бошқа насб қилинганлар: мафъулун мутлақ, ҳол, зарф, тамйиз… (фатҳа).', cj: '<b>Мажрур</b> — жар ҳарфидан кейинги исм ёки музофун илайҳ. Жар қилинган (касра).',
    jh: '<b>Жар ҳарфи</b> — ўзидан кейинги исмни жар қилади.', cz: '<b>كَانَ, إِنَّ ва синглилари</b> — мубтадо ва хабарга кириб, бирини исми, бирини хабари қилади.', cf: '<b>Феъл</b> — иш-ҳаракат.', cd: '<b>Насб / жазм ҳарфи</b> — музориъ феълни насб ёки жазм қилади.' };
  var GRP = [['Раф', ['cm', 'cx', 'co']], ['Насб', ['cb', 'cn']], ['Жар', ['cj', 'jh']], ['Феъл', ['cf', 'cd', 'cz']]];
  var LEX = { cm: 'الطَّالِبُ', cx: 'مُجْتَهِدٌ', co: 'الطَّالِبُ', cb: 'الْكِتَابَ', cn: 'سَرِيعاً', cj: 'الْبَيْتِ', jh: 'فِي', cf: 'قَرَأَ', cd: 'لَنْ ، لَمْ', cz: 'كَانَ ، إِنَّ' };
  function has(c) { return !!tx.querySelector('.q3.n-' + c) || (c == 'co' && !!tx.querySelector('.t3y')) }
  function legend() {
    var lg = document.getElementById('lg'); if (!lg) return;
    lg.classList.add('t3lg');
    var z = GRP.map(function (g) { var cs = g[1].filter(has); return cs.length ? '<span><em>' + g[0] + '</em>' + cs.map(function (c) { return '<i style="background:var(' + LGV[c] + ')"></i>' }).join('') + '</span>' : '' }).join('');
    lg.innerHTML = '<button class="lg-z" type="button" aria-label="Белгилар">' + z + '<b>ⓘ</b></button><div class="lg-t" hidden></div>';
  }
  function lgEx(c) {
    if (c == 'jh') { var u = []; [].forEach.call(tx.querySelectorAll('.q3.n-jh'), function (e) { var t = e.textContent.trim(); if (u.indexOf(t) < 0 && u.length < 3) u.push(t) }); return u.join(' ، ') }
    var e = tx.querySelector('.q3.q3m.n-' + c) || tx.querySelector('.q3.n-' + c); return e ? e.textContent.replace(/[:،.؟!]+$/, '').trim() : (LEX[c] || '');
  }
  function lgOff() { [].forEach.call(tx.querySelectorAll('.lgh,.lgd'), function (e) { e.classList.remove('lgh', 'lgd') }); var t = document.querySelector('#lg .lg-t'); if (t) t.hidden = true }
  function lgOn(c) {
    lgOff(); clr();
    [].forEach.call(tx.querySelectorAll('.ws span[data-i]'), function (e) {
      if (getComputedStyle(e.closest('.ln')).display == 'none') return;
      var q = e.querySelectorAll('.q3.n-' + c + (c == 'co' ? ',.t3y' : ''));
      if (q.length) [].forEach.call(q, function (z) { z.classList.add('lgh') }); else e.classList.add('lgd');
    });
    var t = document.querySelector('#lg .lg-t'); if (t) { t.innerHTML = LGT[c]; t.hidden = false }
  }
  function sheet() {
    var R = function (c, t, sm) { var on = has(c); return '<div class="r' + (on ? '' : ' off') + '" data-c="' + c + '"><i style="background:var(' + LGV[c] + ')"></i><div class="t">' + t + '<small>' + sm + '</small></div><span class="a" style="color:var(' + LGV[c] + ')">' + (on ? lgEx(c) : LEX[c]) + '</span></div>' },
      I = function (ic, t, sm, a) { return '<div class="r"><i class="ic" style="width:auto;height:auto;background:none">' + ic + '</i><div class="t">' + t + '<small>' + sm + '</small></div><span class="a">' + (a || '') + '</span></div>' };
    var o = document.createElement('div'); o.className = 't3sh-o'; var w = document.createElement('div'); w.className = 't3sh';
    w.innerHTML = '<div class="hb"></div><div class="hd"><h3>Белгилар</h3><button class="x" type="button" aria-label="Ёпиш">✕</button></div>' +
      '<h4>Раф қилинганлар <em>— аломати замма</em></h4>' + R('cm', 'Мубтадо', 'гап нима ҳақида; كَانَ ва إِنَّ нинг исми') + R('cx', 'Хабар', 'мубтадо ҳақида нима дейилади') + R('co', 'Фоил, ноиби фоил', 'ишни ким қилди') +
      '<h4>Насб қилинганлар <em>— аломати фатҳа</em></h4>' + R('cb', 'Мафъулун биҳ', 'иш нимага тушди') + R('cn', 'Мансуб', 'мафъулун мутлақ, ҳол, зарф…') +
      '<h4>Жар қилинганлар <em>— аломати касра</em></h4>' + R('cj', 'Мажрур', 'жар ҳарфидан кейин, музофун илайҳ') + R('jh', 'Жар ҳарфи', 'ўзидан кейинги исмни жар қилади') +
      '<h4>Феъл</h4>' + R('cf', 'Феъл', 'иш-ҳаракат') + R('cd', 'Насб / жазм ҳарфи', 'музориъ феълни ўзгартиради') + R('cz', 'كَانَ, إِنَّ ва синглилари', 'мубтадо ва хабарга киради') +
      '<h4>Белгилар</h4>' + I('▢', 'Рамка', 'бир неча сўз бирга битта вазифада: масалан, жар ва мажрур — хабар; босилганда кўринади', '<span class="fr">فِي الْبَيْتِ</span>') +
      I('┆', 'Узуқ чизиқ', 'тушиб қолган (маҳзуф) сўз', '<span class="hz">كَائِنٌ</span>') +
      '<h4>Қандай ишлатилади</h4>' + I('👆', 'Бир босиш', 'бўлак рамкада, боғланган сўзга чизиқ ва номи') + I('✋', 'Босиб туриш', 'сўзнинг тўлиқ таҳлили') + I('▤', 'Гап остидаги қоида', 'босинг — сўзлар ёнади, қоида очилади') + I('↑', 'Ҳозирги жой', 'аудио ўқиётган жойга қайтиш');
    var cl = function () { o.remove(); w.remove() }; o.onclick = cl; w.querySelector('.x').onclick = cl;
    w.addEventListener('click', function (ev) { var r = ev.target.closest('.r[data-c]:not(.off)'); if (!r) return; cl(); lgOn(r.getAttribute('data-c')) });
    document.body.appendChild(o); document.body.appendChild(w);
  }

  /* ===================== 3-qavat: so'z oynasi (kitob tartibida) ===================== */
  var ACAT = [['h', /^(مرفوع|منصوب|مجرور|مجزوم)/], ['a', /^وعلام/], ['m', /^(متعلق|والجار)/], ['y', /^والفاعل/], ['v2', /^(وهو|وهي)$/]];
  function arPieces(s) {
    var ws = String(s || '').replace(/\.\s*$/, '').split(/\s+/).filter(Boolean), P = [], cur = { c: 'v', w: [] }, brk = false;
    ws.forEach(function (w, n) {
      var b = bare(w), nb = bare(ws[n + 1] || ''), c = null;
      for (var z = 0; z < ACAT.length; z++) if (ACAT[z][1].test(b)) { c = ACAT[z][0]; break }
      if (!c && /^مبني/.test(b) && nb != 'للمجهول') c = 'b';
      if (!c && (b == 'في' || b == 'لا') && /^محل/.test(nb)) c = 'o';
      if (c && c != cur.c) { if (cur.w.length) P.push(cur); cur = { c: c, w: [] } }
      cur.w.push(w); brk = /،$/.test(w);
    });
    if (cur.w.length) P.push(cur);
    P.forEach(function (p) { p.s = p.w.join(' ').replace(/،$/, '') });
    return P;
  }
  function uzCat(s) {
    if (/(раф|насб|жар|жазм) қилинган/.test(s)) return 'h';
    if (/^аломати\s/.test(s)) return 'a';
    if (/мабний/.test(s) && !/мабний эмас/.test(s)) return 'b';
    if (/ўринда$|ўрин йўқ/.test(s)) return 'o';
    if (/мутааллиқ|шибҳи жумла бўлиб/.test(s)) return 'm';
    if (/мустатир замир|^у фоил/.test(s)) return 'y';
    return null;
  }
  var LBL = { h: 'Ҳукми', a: 'Аломати', b: 'Бино', o: 'Ўрни' };
  function zt(k) {
    var w = WD[k]; if (!w) return null;
    var E = w.E, A = (E.a || []).filter(function (p) { return p[0] }), J = (E.a || []).filter(function (p) { return !p[0] }), useA = A.length == w.rows.length;
    var parts = [], B = [], N = [], yz = null;
    w.rows.forEach(function (r, z) {
      var ss = r.u.split(/,\s+/), steps = [], P = useA ? arPieces(A[z][1]) : [], used = {};
      function arOf(c) { var o = P.filter(function (p) { return p.c == c || (c == 'v' && p.c == 'v2') }); o.forEach(function (p) { used[P.indexOf(p)] = 1 }); return o.map(function (p) { return p.s }).join('، ') }
      var harf = r.k == 'h', typ = harf || r.k == 'f' || r.k == 'z';
      ss.forEach(function (s, n) {
        var c = uzCat(s);
        if (n == 0) {
          var m = s.match(TYP);
          if (m) { steps.push(['Тури', m[1], arOf('v')]); steps.push(['Вазифаси', s.slice(m[0].length), '']) }
          else steps.push([typ ? 'Тури' : 'Вазифаси', s, arOf('v')]);
          return;
        }
        if (c == 'm') { var lm = B[B.length - 1], tm = s.replace(/^ўзи\s+/, ''); if (lm && lm[0] == 'Мутааллиқ' && lm.z === z) lm[1] += ', ' + tm; else { var nb = ['Мутааллиқ', tm, arOf('m')]; nb.z = z; B.push(nb) } return }
        if (c == 'y') { var y = (w.yz || ''); if (!yz) yz = { a: y, s: [] }; yz.s.push(s); return }
        if (c && LBL[c]) { steps.push([LBL[c], c == 'a' ? s.replace(/^аломати\s+/, '') : s, arOf(c)]); return }
        if (steps.length) steps[steps.length - 1][1] += ', ' + s; else steps.push(['Изоҳ', s, '']);
      });
      /* qolgan arabcha bo'laklar — oxirgi qadamga */
      var left = P.filter(function (p, i) { return !used[i] && p.c != 'm' && p.c != 'y' }).map(function (p) { return p.s }).join('، ');
      if (left && steps.length) { var ls = steps[steps.length - 1]; ls[2] = (ls[2] ? ls[2] + '، ' : '') + left }
      var mm = P.filter(function (p) { return p.c == 'm' }).map(function (p) { return p.s }).join('، ');
      if (mm && !B.some(function (b) { return b[0] == 'Мутааллиқ' && b[2] })) { var bm = B.filter(function (b) { return b[0] == 'Мутааллиқ' })[0]; if (bm) bm[2] = mm; else B.push(['Мутааллиқ', '', mm]) }
      var yy = P.filter(function (p) { return p.c == 'y' }).map(function (p) { return p.s }).join('، ');
      if (yy && yz) yz.ar = yy;
      parts.push({ a: r.t, c: (w.segc && w.segc[z]) || w.mc, s: steps });
    });
    if (yz) parts.push({ a: yz.a, c: w.yzc || 'co', s: [['Тури', (yz.s[0] || '').replace(/^тагида\s+/, '').replace(/\s*бор бўлиб$/, ''), yz.ar || ''], ['Вазифаси', (yz.s[1] || 'фоил').replace(/^у\s+/, ''), '']] });
    w.nrows.forEach(function (u) {
      if (/шибҳи жумла бўлиб/.test(u)) { var bm = B.filter(function (b) { return b[0] == 'Мутааллиқ' })[0]; if (bm && !bm[1]) bm[1] = u; else if (!bm) B.push(['Мутааллиқ', u, '']) }
      else if (/маҳзуф/.test(u)) B.push(['Ҳазф', u, ''])
      else if (/жумла/.test(u)) B.push(['Жумла', u, J.length ? J[0][1] : ''])
      else N.push(u);
    });
    if (E.jm && !B.some(function (b) { return b[0] == 'Жумла' })) B.push(['Жумла', E.jm, J.length ? J[J.length - 1][1] : '']);
    var mi = w.rows[w.mi], vz = mi ? cap(seg0(mi.u)) : '';
    return { vz: vz, parts: parts, b: B, n: N };
  }
  function ztH(Z) {
    var m = Z.parts.length > 1, o = '';
    Z.parts.forEach(function (p, i) {
      o += '<div class="zp' + (i ? '' : ' z1') + '">' + (m ? '<div class="zph"><span class="ar" style="color:var(' + (p.c == 'cz' ? '--nz' : LGV[p.c] || '--tx') + ')">' + esc(p.a) + '</span></div>' : '') +
        p.s.map(function (q, n) { return '<div class="zs"><i>' + (n + 1) + '</i><span class="l">' + q[0] + '</span><span class="v">' + arw(q[1]) + (q[2] ? '<span class="a2">' + esc(q[2]) + '</span>' : '') + '</span></div>' }).join('') + '</div>';
    });
    Z.b.forEach(function (q) { o += '<div class="zb"><b>' + q[0] + ':</b> ' + arw(q[1]) + (q[2] ? '<span class="a2">' + esc(q[2]) + '</span>' : '') + '</div>' });
    if (Z.n.length) o += '<div class="zn">' + Z.n.map(function (z) { return '↳ ' + arw(z) }).join('<br>') + '</div>';
    return o;
  }
  if (typeof window.op == 'function') {
    var op0 = window.op;
    window.op = function (el) {
      var r = op0.apply(this, arguments);
      try {
        var k = el.getAttribute('data-i'), Z = zt(k), sb = document.getElementById('sb'); if (!Z || !sb) return r;
        var uz = sb.querySelector('.zo-uz'); if (uz) uz.innerHTML = ztH(Z);
        var hk = sb.querySelector('.hk'); if (hk && Z.vz) hk.insertAdjacentHTML('afterbegin', '<span class="t3vz">' + esc(Z.vz) + '</span> ');
      } catch (e) { }
      return r;
    };
  }

  /* ===================== «Ҳозирги жой» va audio ===================== */
  var au = document.querySelector('audio'), NB = document.createElement('button');
  NB.className = 't3now'; NB.type = 'button'; document.body.appendChild(NB);
  NB.addEventListener('click', function () { var e = tx.querySelector('.ws span.pl'); if (!e) return; window.uScr = 0; e.scrollIntoView({ block: 'center', behavior: 'smooth' }); NB.classList.remove('on') });
  function nowChk() {
    var p1 = document.getElementById('p1'), e = tx.querySelector('.ws span.pl');
    if (!au || au.paused || !e || (p1 && p1.classList.contains('hide'))) { NB.classList.remove('on'); return }
    var r = e.getBoundingClientRect();
    var top = 100, bot = innerHeight - 230;
    if (r.bottom < top) { NB.textContent = '↑ Ҳозирги жой'; NB.classList.add('on') }
    else if (r.top > bot) { NB.textContent = '↓ Ҳозирги жой'; NB.classList.add('on') }
    else NB.classList.remove('on');
  }
  if (au) {
    au.addEventListener('play', function () { tx.classList.add('apl') });
    au.addEventListener('pause', function () { tx.classList.remove('apl'); NB.classList.remove('on') });
    au.addEventListener('ended', function () { tx.classList.remove('apl'); NB.classList.remove('on') });
    if (!au.paused) tx.classList.add('apl');
    setInterval(nowChk, 600);
    addEventListener('scroll', function () { setTimeout(nowChk, 50) }, { passive: true });
  }
  /* ===================== bo'sh joy — bekor qilish; ▶ — shu gapni o'qish (18.11.2026, sinov) ===================== */
  /* shell.js da abzasning bo'sh joyi bosilsa gap o'qilardi — bu darsda u o'rniga belgilangan narsa bekor bo'ladi */
  tx.addEventListener('click', function (ev) {
    if (ev.target.closest('.ws span,.ts,[data-i],button,a,input,select,textarea,label,.sheet,.zo,.nqb,.t3c')) return;
    if (!ev.target.closest('.ln')) return;
    ev.stopPropagation();
    clr(); lgOff();
    [].forEach.call(document.querySelectorAll('.ws span.on,.ts.on'), function (x) { x.classList.remove('on') });
  }, true);
  function lnStart(L) { var st = null; (window.TM || []).forEach(function (w) { if (w[0] === L && (st === null || w[2] < st)) st = w[2] }); return st }
  /* gap oxiri: keyingi gap boshigacha; «ЎЗ» yoqilgan bo'lsa o'zbekcha tarjimasi ham o'qiladi */
  function lnEnd(L, st) {
    var e = st, nx = null, uz = !!document.querySelector('.pbar .uzb.on');
    (window.TM || []).forEach(function (w) {
      if (w[0] === L) e = Math.max(e, w[3]);
      else if (w[2] > st && w[2] < 1e5 && (nx === null || w[2] < nx)) nx = w[2];
    });
    if (uz) return nx !== null ? nx - 0.1 : 1e9;
    return nx !== null ? Math.min(nx - 0.05, e + 0.4) : e + 0.4;
  }
  function curL() { var e = tx.querySelector('.ws span.pl'), ln = e && e.closest('.ln'); return ln ? [].indexOf.call(lines(), ln) : -1 }
  function plBtns() {
    [].forEach.call(tx.querySelectorAll('.t3pl'), function (b) { b.remove() });
    [].forEach.call(lines(), function (ln, L) {
      if (lnStart(L) === null || getComputedStyle(ln).display == 'none') return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 't3pl'; b.setAttribute('data-l', L); b.setAttribute('aria-label', 'Шу гапни тинглаш');
      b.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
      ln.appendChild(b);
    });
    plState();
  }
  function plState() {
    var L = au && !au.paused ? curL() : -1;
    [].forEach.call(tx.querySelectorAll('.t3pl'), function (b) {
      var on = +b.getAttribute('data-l') === L; if (b.classList.contains('on') === on) return;
      b.classList.toggle('on', on);
      b.innerHTML = on ? '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    });
  }
  tx.addEventListener('click', function (ev) {
    var b = ev.target.closest('.t3pl'); if (!b || !au) return;
    ev.stopPropagation();
    var L = +b.getAttribute('data-l');
    if (!au.paused && curL() === L) { au.pause(); return }
    var st = lnStart(L); if (st === null) return;
    if (typeof window.setLoop === 'function') window.setLoop(-1);
    if ('stopAt' in window) window.stopAt = null;
    window.uScr = 0;
    /* 19.11.2026 (foydalanuvchi): karta ▶ — faqat shu kartani o'qib to'xtaydi; davomi — pastdagi ▶ */
    var en = lnEnd(L, st);
    var go = function () { window.progSeek = true; au.currentTime = Math.max(0, st - 0.05); if ('stopAt' in window) window.stopAt = en };
    if (au.readyState >= 1) go(); else au.addEventListener('loadedmetadata', function f() { au.removeEventListener('loadedmetadata', f); go() });
    if (au.paused) { var p = au.play(); if (p && p.catch) p.catch(function () { }) }
  }, true);
  if (au) ['play', 'pause', 'ended', 'timeupdate'].forEach(function (n) { au.addEventListener(n, plState) });

  /* ===================== hodisalar ===================== */
  tx.addEventListener('click', function (ev) {
    var sh = document.getElementById('sh'); if (sh && sh.classList.contains('on')) return;
    var lb = ev.target.closest('.t3c'); if (lb) { if (lb.t3) lb.t3.scrollIntoView({ block: 'center', behavior: 'smooth' }); return }
    if (!tartib()) return;
    var g = ev.target.closest('.ws span.t3h');
    if (g) { var o = GH[+g.getAttribute('data-h')]; show(o && o.rel ? o.rel : { src: [g], tg: [], lab: o ? (o.kind == 'm' ? 'маҳзуф мубтадо' : 'маҳзуф') : 'маҳзуф' }); return }
    var e = ev.target.closest('.ws span[data-i]');
    if (e) { lgOff(); show(RELS[e.getAttribute('data-i')]); return }
    clr();
  });
  document.addEventListener('click', function (ev) {
    if (ev.target.closest('#lg .lg-z')) { clr(); lgOff(); sheet(); return }
    if (!ev.target.closest('#lg .lg-t') && !ev.target.closest('.t3sh')) lgOff();
    if (!ev.target.closest('#tx')) clr();
  });

  /* ===================== yig'ish ===================== */
  function deco3() {
    clr();
    analyse(); paint(); ghosts(); jx(); frames(); relations(); boxes(); legend(); plBtns();
  }
  function relayout() { clr(); rowFix() }
  function wrap(n, f) { var o = window[n]; if (typeof o != 'function') return; window[n] = function () { var r = o.apply(this, arguments); f(); return r } }
  wrap('build', deco3);
  wrap('bol', function () { clr(); lgOff(); requestAnimationFrame(rowFix) });
  wrap('fz', function () { requestAnimationFrame(relayout) });
  wrap('tab', function () { clr(); lgOff() });
  deco3();
  var lw = 0;
  if (window.ResizeObserver) new ResizeObserver(function () { if (tx.clientWidth != lw) { lw = tx.clientWidth; requestAnimationFrame(relayout) } }).observe(tx);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(relayout) });
  window.T3 = { WD: function () { return WD }, RELS: function () { return RELS }, GH: function () { return GH }, FR: function () { return FR }, zt: zt, show: show, relayout: relayout };
})();
