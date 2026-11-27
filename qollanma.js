/* Йўриқнома (qollanma.js) — «ҳикоя» кўринишидаги йўл кўрсаткич.
   Ҳақиқий экран расми аввал бутун кўринади, камера керакли жойга яқинлашади, бармоқ босади, кейин босилгандан сўнг очиладиган экран кўрсатилади.
   Маълумот: Qollanma.qosh(калит, { nom, keyingi, ekran: { экран: { нишон: [x, y, w, h] } }, qadam: [...] }) — координата 0..1 (расм ва координатани src/build/qollanma.py олади).
   Қадам: s — экран; t — нишон (ёки рўйхат); z — яқинлик (кичик жой учун); a — 'tap' | 'look'; f — камера қарайдиган жой (бўлмаса t); go — босилгандан кейинги экран;
          n — 'ok' | 'no' (поғона картаси); c — изоҳ («…» ичи ажратиб кўрсатилади, {B} — «биламан» учун кунлар сони, {M} / {M2} — «мустаҳкам» учун 1- ва 2-текширувгача кун).
   Чизма қадами (экран расмисиз): ch — 'tush' (дарс сўзлари «ўрганяпман»га тушади) | 'bildi' ({B} кун → «биламан») | 'must' ({M} кун ✓, яна {M2} кун ✓ → «мустаҳкам») | 'xato' («биламан» ✕ → «ўрганяпман» 2/3).
   Очиш: Qollanma.och(калит, { bildi: 3, must: 7, must2: 21 }) — мавзулар ва расмлар биринчи очилганда юкланади: ўзбекча — qol/mavzu.js, qol/<тема>-<экран>.webp;
   русча (window.TIL === 'ru', 15.11.2026) — qol/mavzu-ru.js, qol/ru-<тема>-<экран>.webp; ўйнаткич ёзувлари — TX жадвалида (ru.js уларга тегмайди: data-ru-yoq).
   Зарблар (27.11.2026): b — [{t, s, f, z, a, go, fx, ch, r, ms}] — кўриниш овозга эргашади: овоздаги сўз айтилганда (ms; овозсиз — r улуши) ҳалқа/бармоқ
   шу жойга ўтади, fx — 'ch1'|'ch2'|'ch3' (чизиқчалар картаси), 'ovoz' (сўз ўқилиши белгиси); ch — чизма босқичи (FZ). qollanma.py яратади.
   Овоз (27.11.2026, фақат ўзбекча): қадамда o — qol/ovoz/ даги файл, od — узунлиги (мс); қадам овоз тугагунча туради, ✕ ёнидаги 🔊 — ўчириш/ёқиш
   (localStorage «qol-ovoz» = '0' — ўчиқ). Овоз элементи биринчи очишда (босиш ичида) «уйғотилади» — iOS бошқа вақтда play() га рухсат бермайди.
   Телефоннинг «орқага» тугмаси ўйнаткични ёпади (history.pushState). Батафсил — docs/texnik.md 20. */
(function () {
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NIS = 844 / 390, MV = {}, joriy = null, kut = null, yukl = 0;
  var PAPKA = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^\/]*$/, '') + 'qol/' : 'qol/'; })();
  var SH = '<rect x="16" y="2" width="10" height="32" rx="5"/><rect x="25" y="19" width="9" height="16" rx="4.5"/><rect x="33" y="22" width="8" height="14" rx="4"/>' +
    '<rect x="10" y="26" width="31" height="28" rx="10"/><rect x="3" y="30" width="9" height="19" rx="4.5" transform="rotate(-32 7.5 39.5)"/>';
  var QOL = '<svg viewBox="0 0 48 60" aria-hidden="true"><g stroke="#16241d" stroke-width="4.6" stroke-linejoin="round">' + SH + '</g><g fill="#fff">' + SH +
    '</g><path d="M25.5 21v8M33.5 24v7" stroke="#16241d" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4.2" height="14" rx="1.4"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.4"/></svg>';
  /* 27.11.2026: ovoz tugmasi belgilari va bo'sh tovush (ovoz elementini birinchi bosishda «uyg'otish» uchun) */
  var SP1 = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  var SP0 = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="m16 9 5 6M21 9l-5 6"/></svg>';
  var JIM = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=', AU = null, AUO = false;
  var OV0 = 250, OV1 = 700;                           /* ovoz qadam boshidan 250 ms keyin boshlanadi; tugagach 700 ms dan keyin keyingi qadam */
  function ovozYoq() { try { return localStorage.getItem('qol-ovoz') === '0'; } catch (e) { return false; } }
  function uygot() {                                  /* bosish ichida chaqiriladi: keyingi play() lar setTimeout ichida ham ishlaydi (iOS, Telegram) */
    if (!AU) { try { AU = new Audio(); AU.preload = 'auto'; } catch (e) { return; } }
    if (AUO) return;
    try { AU.src = JIM; var p = AU.play(); if (p && p.then) p.then(function () { AUO = true; }, function () {}); } catch (e) {}
  }
  var SPK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z"/></svg>';
  var CSS =
    '.qs{position:fixed;inset:0;z-index:2147482000;display:flex;justify-content:center;background:radial-gradient(130% 70% at 50% 0%,#0f4231 0%,#072a1f 52%,#041911 100%);color:#f4eeda;font:16px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;opacity:0;transition:opacity .28s;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;touch-action:manipulation}' +
    '.qs.on{opacity:1}.qs *{box-sizing:border-box}' +
    '.qs button{font:inherit;cursor:pointer;-webkit-appearance:none;appearance:none}' +
    '.qs-in{width:100%;max-width:520px;height:100%;display:flex;flex-direction:column;padding:calc(10px + env(safe-area-inset-top,0px)) 0 calc(12px + env(safe-area-inset-bottom,0px));transform:translateY(16px);transition:transform .36s cubic-bezier(.2,.8,.2,1)}' +
    '.qs.on .qs-in{transform:none}' +
    /* 23.11.2026 (foydalanuvchi: «ekran to'liq ochiladigan emas — oyna bo'lib, bo'sh joyni bosib chiqib ketsa bo'ladi»): o.varaq — pastdan chiqadigan oyna (takror.html) */
    '.qs.qs-va{background:rgba(0,0,0,.5);align-items:flex-end}' +
    '.qs-va .qs-in{height:84%;border-radius:22px 22px 0 0;padding-top:0;background:radial-gradient(130% 70% at 50% 0%,#0f4231 0%,#072a1f 52%,#041911 100%);transform:translateY(100%)}' +
    '.qs-tut{flex-shrink:0;height:20px;display:flex;align-items:center;justify-content:center;touch-action:none;cursor:grab}' +
    '.qs-tut::before{content:"";width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,.35)}' +
    '.qs-pr{display:flex;gap:4px;padding:0 14px}' +
    '.qs-pr i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.2);overflow:hidden}' +
    '.qs-pr b{display:block;width:0;height:100%;border-radius:2px;background:#f6dc94}' +
    '.qs-pr i.d b{width:100%}.qs-pr i.on b{animation:qs-fl linear forwards}' +
    '@keyframes qs-fl{to{width:100%}}' +
    '.qs-hd{display:flex;align-items:center;gap:8px;padding:8px 12px 8px 16px}' +
    '.qs-hd>b{font-size:17px;font-weight:750;letter-spacing:-.01em}' +
    '.qs-hd>span{flex:1;font-size:13px;color:#9db5a7;font-variant-numeric:tabular-nums}' +
    '.qs-hb{width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.1);color:#f4eeda;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0}' +
    '.qs-st{position:relative;flex:1;min-height:0;margin:0 14px;border-radius:20px;overflow:hidden;cursor:pointer}' +
    '.qs-cam{position:absolute;left:0;top:0;width:100%;aspect-ratio:390/844;transform-origin:0 0;transition:transform .78s cubic-bezier(.45,0,.15,1),opacity .35s;will-change:transform}' +
    '.qs-scr{position:absolute;inset:0;border-radius:24px;overflow:hidden;background:#0b0f0d;box-shadow:0 0 0 1.5px rgba(255,255,255,.22),0 16px 44px rgba(0,0,0,.5)}' +
    '.qs-i{position:absolute;inset:0;width:100%;height:100%;opacity:0;z-index:1;transition:opacity .42s;pointer-events:none}' +
    '.qs-i.on{opacity:1}.qs-i.ust{z-index:2}' +
    '.qs-r{position:absolute;z-index:3;border-radius:14px;box-shadow:0 0 0 3px #f2c14e,0 0 0 2400px rgba(4,22,15,.5);opacity:0;transition:opacity .32s,left .5s cubic-bezier(.4,0,.2,1),top .5s cubic-bezier(.4,0,.2,1),width .5s cubic-bezier(.4,0,.2,1),height .5s cubic-bezier(.4,0,.2,1);pointer-events:none}' +
    '.qs-r.on{opacity:1}' +
    '.qs-r.on::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 3px #f2c14e;animation:qs-pu 1.5s ease-out infinite}' +
    '@keyframes qs-pu{to{inset:-11px;opacity:0}}' +
    '.qs-r.fl{box-shadow:0 0 0 3px #f2c14e,inset 0 0 0 100px rgba(242,193,78,.2);transition:none;animation:qs-fa .55s ease-out}' +
    '@keyframes qs-fa{0%{opacity:0}20%{opacity:1}60%{opacity:1}100%{opacity:0}}' +
    '.qs-rp{position:absolute;z-index:4;width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:50%;background:rgba(242,193,78,.6);opacity:0;pointer-events:none}' +
    '.qs-rp.go{animation:qs-rp .62s ease-out}' +
    '@keyframes qs-rp{0%{opacity:.95;transform:scale(.3)}100%{opacity:0;transform:scale(3.3)}}' +
    '.qs-hand{position:absolute;left:0;top:0;z-index:5;width:46px;height:58px;opacity:0;pointer-events:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.4));transition:transform .78s cubic-bezier(.45,0,.15,1),opacity .25s}' +
    '.qs-hand.on{opacity:1}' +
    '.qs-hand svg{display:block;width:100%;height:100%;transform-origin:42% 4%}' +
    '.qs-hand.bos svg{animation:qs-bs .38s ease-in-out}' +
    '@keyframes qs-bs{45%{transform:scale(.8)}}' +
    '.qs-ts{position:absolute;z-index:6;left:50%;top:12px;width:min(336px,calc(100% - 20px));padding:10px 12px 11px;border-radius:16px;background:#fffdf6;color:#1c1f1d;box-shadow:0 10px 30px rgba(0,0,0,.45);opacity:0;transform:translate(-50%,-14px) scale(.96);transition:opacity .22s,transform .42s cubic-bezier(.3,1.5,.5,1);pointer-events:none}' +
    '.qs-ts.on{opacity:1;transform:translate(-50%,0)}' +
    /* 27.11.2026: zarb effektlari — chiziqchalar kartasi (pastda), so'z o'qilishi belgisi, chizmadagi so'z chiziqchalari */
    '.qs-ts.alt{top:auto;bottom:12px}' +
    '.qs-cz{display:flex;align-items:center;gap:9px;transition:transform .3s}.qs-cz.pop{animation:qs-pp .5s}' +
    '@keyframes qs-pp{40%{transform:scale(1.05)}}' +
    '.qs-cz .ar{flex:1;text-align:right;font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:25px;line-height:1.35}' +
    '.qs-cz em{display:flex;gap:3px}.qs-cz em i{width:19px;height:6px;border-radius:3px;background:#e6e1d4;transition:background .35s,transform .35s}' +
    '.qs-cz em i.y{background:#d9a21b;transform:scaleY(1.35)}.qs-cz em i.g{background:#1b855a}' +
    '.qs-cz small{font-size:12px;font-weight:800;color:#a2690a;transition:color .3s}.qs-cz small.g{color:#1b855a}' +
    '.qs-cz.q{margin-top:9px;padding-top:9px;border-top:1px solid #eee6d6;animation:qs-in .45s ease-out}.qs-cz.q em i{background:#ecb9b1}.qs-cz.q small{color:#b3261e}' +
    '.qs-cz.q b{width:22px;height:22px;border-radius:50%;background:#b3261e;color:#fff;font-size:14px;line-height:22px;text-align:center;animation:qs-up 1s ease-in-out 3}' +
    '@keyframes qs-in{from{opacity:0;transform:translateY(8px)}}@keyframes qs-up{50%{transform:translateY(-4px)}}' +
    '.qs-ck{display:flex;gap:4px;margin-top:7px}.qs-ck span{padding:3px 8px;border-radius:999px;box-shadow:0 0 0 1px #ebe6da;color:#8a8f8b;font-size:11.5px;font-weight:700;transition:background .3s,color .3s,box-shadow .3s}' +
    '.qs-ck span.ok{background:#e2f1e9;box-shadow:0 0 0 1.5px #1b855a;color:#1b855a}.qs-ck span.ok::after{content:" ✓"}' +
    '.qs-sn{position:absolute;z-index:5;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:#f2c14e;color:#12382a;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.35)}' +
    '.qs-sn svg{width:22px;height:22px}.qs-sn.go{animation:qs-sn 2.6s ease-out}' +
    '.qs-sn::before,.qs-sn::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid #f2c14e;opacity:0}' +
    '.qs-sn.go::before{animation:qs-sw 1.1s .25s ease-out 2}.qs-sn.go::after{animation:qs-sw 1.1s .6s ease-out 2}' +
    '@keyframes qs-sn{0%{opacity:0;transform:scale(.4)}12%{opacity:1;transform:scale(1.1)}20%{transform:scale(1)}85%{opacity:1}100%{opacity:0}}' +
    '@keyframes qs-sw{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.5)}}' +
    '.qs-db{display:flex;gap:2px;margin-top:3px;text-decoration:none}.qs-db i{width:12px;height:4px;border-radius:2px;background:#e6e1d4;transition:background .35s}' +
    '.qs-db.y i.f{background:#d9a21b}.qs-db.g i{background:#1b855a}.qs-db.m i{background:#2c63b8}.qs-db.yo,.qs-dk.yo span{animation:qs-yo .7s 2}' +
    '@keyframes qs-yo{50%{transform:scale(1.25)}}' +
    '.qs-nh{font-size:15px;font-weight:800;margin-bottom:7px}.qs-nh.ok{color:#1b855a}.qs-nh.no{color:#b3261e}' +
    '.qs-lv{display:flex;gap:4px}' +
    '.qs-lv span{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:6px 5px;border-radius:10px;font-size:10.5px;font-weight:750;white-space:nowrap;color:var(--k);background:color-mix(in srgb,var(--k) 9%,#fffdf6);opacity:.55;transition:opacity .35s,background .35s,box-shadow .35s,transform .35s}' +
    '.qs-lv .l0{--k:#b3261e}.qs-lv .l1{--k:#a2690a}.qs-lv .l2{--k:#1b855a}.qs-lv .l3{--k:#2c63b8}' +
    '.qs-lv span.on{opacity:1;background:color-mix(in srgb,var(--k) 20%,#fffdf6);box-shadow:inset 0 0 0 1.5px var(--k);transform:translateY(-2px)}' +
    '.qs-lv em{display:flex;gap:3px}' +
    '.qs-lv em i{width:6px;height:6px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--k);transition:background .3s}' +
    '.qs-lv.d1 em i:first-child{background:var(--k)}' +
    '.qs-nt{margin-top:8px;font-size:13px;line-height:1.35;color:#555c56}.qs-nt b{color:#1c1f1d}' +
    /* чизма: поғоналар ва сўз карточкалари */
    '@font-face{font-family:"DarsNaskh";src:url(naskh.woff)}' +
    '.qs-st.dz .qs-cam{opacity:0}' +
    '.qs-dz{position:absolute;inset:0;z-index:2;border-radius:20px;overflow:hidden;background:#fffdf6;color:#1c1f1d;opacity:0;pointer-events:none;transition:opacity .35s}' +
    '.qs-st.dz .qs-dz{opacity:1}' +
    '.qs-dp{position:absolute;left:10px;right:10px;bottom:0;height:62%;display:flex;align-items:flex-end;gap:5px}' +
    '.qs-dp div{--k:#b3261e;flex:1;min-width:0;height:26%;padding-top:8px;border-radius:12px 12px 0 0;border-top:4px solid var(--k);background:color-mix(in srgb,var(--k) 14%,#fffdf6);color:var(--k);font-size:clamp(9.5px,2.9vw,11.5px);font-weight:800;letter-spacing:-.01em;text-align:center;white-space:nowrap;transition:background .35s}' +
    '.qs-dp div:nth-child(2){height:50%;--k:#a2690a}.qs-dp div:nth-child(3){height:74%;--k:#1b855a}.qs-dp div:nth-child(4){height:98%;--k:#2c63b8}' +
    '.qs-dp div.on{background:color-mix(in srgb,var(--k) 32%,#fffdf6)}' +
    '.qs-dl{position:absolute;left:12px;top:12px;width:136px;padding:9px 11px 10px;border-radius:13px;background:#fff;box-shadow:0 0 0 1px #ebe6da,0 4px 12px rgba(0,0,0,.08);font-size:14px;transition:opacity .35s,transform .35s}' +
    '.qs-dl b{display:block}' +
    '.qs-dl u{display:block;height:6px;margin-top:7px;border-radius:3px;background:#e3ece6;overflow:hidden;text-decoration:none}' +
    '.qs-dl u i{display:block;width:0;height:100%;border-radius:3px;background:#0f7a4f;transition:width 1.3s ease-in-out}' +
    '.qs-dl span{display:block;margin-top:5px;font-size:12.5px;font-weight:700;color:#6b716c}.qs-dl.dn span{color:#1b855a}' +
    '.qs-dl.x{opacity:0;transform:translateY(-8px)}' +
    '.qs-dk,.qs-dm{position:absolute;right:10px;top:12px;transition:opacity .3s}' +
    '.qs-dk{display:flex;gap:4px}' +
    '.qs-dk span{padding:4px 8px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px #ebe6da;color:#6b716c;font-size:12px;font-weight:700;transition:background .3s,color .3s,box-shadow .3s}' +
    '.qs-dk span.ok{background:#e2f1e9;box-shadow:0 0 0 1.5px #1b855a;color:#1b855a}.qs-dk span.ok::after{content:" ✓"}' +
    '.qs-dm{padding:5px 12px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px #ebe6da;color:#2c63b8;font-size:13px;font-weight:700}' +
    '.qs-dm b{display:inline-block;min-width:21px;font-size:15px;text-align:right}' +
    '.qs-dx{opacity:0}' +
    '.qs-dw{position:absolute;left:0;top:0;opacity:0;transition:transform .7s cubic-bezier(.45,.05,.35,1),opacity .3s}' +
    '.qs-dw.tu{transition:transform .62s cubic-bezier(.55,0,.6,1.15),opacity .3s}' +
    '.qs-dw>div{position:relative;display:flex;flex-direction:column;align-items:center;min-width:62px;padding:2px 9px 5px;border-radius:12px;background:#fff;border:2px solid var(--k,#d9d3c4);box-shadow:0 4px 12px rgba(0,0,0,.14);transition:border-color .35s}' +
    '.qs-dw .ar{font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:23px;line-height:1.4}' +
    '.qs-dw small{font-size:11.5px;line-height:1;color:#6b716c}' +
    '.qs-dw>div.hop{animation:qs-hop .7s cubic-bezier(.3,0,.4,1)}' +
    '@keyframes qs-hop{45%{transform:translateY(-26px)}}' +
    '.qs-dw>div.shk{animation:qs-shk .45s}' +
    '@keyframes qs-shk{20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}' +
    '.qs-dw em{position:absolute;left:50%;top:-13px;width:26px;height:26px;margin-left:-13px;border-radius:50%;color:#fff;font:800 15px/26px system-ui,sans-serif;font-style:normal;text-align:center;opacity:0}' +
    '.qs-dw em.ok{background:#1b855a}.qs-dw em.no{background:#b3261e}.qs-dw em.ok::after{content:"✓"}.qs-dw em.no::after{content:"✕"}' +
    '.qs-dw em.go{animation:qs-fb 1s ease-out}' +
    '@keyframes qs-fb{0%{opacity:0;transform:translateY(6px) scale(.6)}20%{opacity:1;transform:translateY(-6px) scale(1.1)}70%{opacity:1;transform:translateY(-8px)}100%{opacity:0;transform:translateY(-14px)}}' +
    '.qs-yk{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-size:14px;color:#9db5a7}' +
    '.qs-en{position:absolute;inset:0;z-index:7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:20px;background:rgba(4,22,15,.92);opacity:0;pointer-events:none;transition:opacity .3s;cursor:default}' +
    '.qs-en.on{opacity:1;pointer-events:auto}' +
    '.qs-en h4{margin:0 0 8px;font-size:21px;font-weight:800}' +
    '.qs-eb{width:min(280px,100%);height:52px;border-radius:15px;border:0;font-size:16.5px;font-weight:750}' +
    '.qs-eb.a{background:#f6dc94;color:#12382a}.qs-eb.b{background:rgba(255,255,255,.13);color:#f4eeda}' +
    '.qs-cp{height:4.3em;margin:10px 18px 2px;font-size:16.5px;line-height:1.42;font-weight:600;display:flex;align-items:center}' +
    '.qs-cp p{margin:0;transition:opacity .18s,transform .22s}' +
    '.qs-cp p.f{opacity:0;transform:translateY(5px)}' +
    '.qs-cp b{color:#f6dc94;font-weight:750}' +
    '.qs-ct{display:flex;align-items:center;justify-content:center;gap:20px;padding-top:4px}' +
    '.qs-cb{width:46px;height:46px;border-radius:50%;border:0;background:rgba(255,255,255,.1);color:#f4eeda;font-size:26px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0 0 3px}' +
    '.qs-cb.pp{width:56px;height:56px;background:#f6dc94;color:#12382a;padding:0;box-shadow:0 4px 0 #c9a85c}' +
    '.qs-cb:active,.qs-hb:active{transform:scale(.94)}' +
    '@media (prefers-reduced-motion:reduce){.qs,.qs *{transition:none!important;animation:none!important}}';

  function uslub() {
    if (document.getElementById('qs-css')) return;
    var s = document.createElement('style'); s.id = 'qs-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  /* ўйнаткич ёзувлари (15.11.2026: русчаси ҳам) */
  var TX = {
    uz: { yuk: 'Юкланяпти…', xato: 'Расмлар юкланмади. Интернетни текшириб, қайта очинг.', tamom: 'Тамом ✓', key: 'Кейингиси: ', tush: 'Тушунарли', qayta: '↻ Қайта кўриш',
          yop: 'Ёпиш', old: 'Олдинги', keyi: 'Кейинги', tox: 'Тўхтатиш', dav: 'Давом этиш', tema: 'Кундузги / тунги', ok: '✓ Билдим', no: '✕ Билмадим',
          lv: ['билмайман', 'ўрганяпман', 'биламан', 'мустаҳкам'], nok: function (k) { return k + ' тўғри топсангиз — <b>биламан</b>'; },   /* 27.11.2026: «кетма-кет» shart emas */
          ov0: 'Овозни ўчириш', ov1: 'Овозни ёқиш', nno: 'Сўз <b>ўрганяпман</b>да қолади, ҳисоб бошидан',
          dars: '📖 1-дарс', mashq: 'Эъроб', qy: 'кўп хато', kun: function (i) { return i + '-кун'; }, otdi: '📅 <b>0</b> кун ўтди', soz: ['дарс', 'исм', 'бир'],
          kunlar: function (n) { return n + ' кун'; } },
    ru: { yuk: 'Загрузка…', xato: 'Картинки не загрузились. Проверьте интернет и откройте снова.', tamom: 'Готово ✓', key: 'Дальше: ', tush: 'Понятно', qayta: '↻ Посмотреть снова',
          yop: 'Закрыть', old: 'Назад', keyi: 'Далее', tox: 'Пауза', dav: 'Продолжить', tema: 'Светлая / тёмная', ok: '✓ Помню', no: '✕ Не помню',
          lv: ['не знаю', 'учу', 'знаю', 'прочно'], nok: function (k) { return k + ' правильно — <b>знаю</b>'; }, ov0: 'Выключить звук', ov1: 'Включить звук', nno: 'Слово остаётся на <b>учу</b>, счёт заново',
          dars: '📖 Урок 1', mashq: 'Иъраб', qy: 'много ошибок', kun: function (i) { return 'День ' + i; }, otdi: '📅 прошло дней: <b>0</b>', soz: ['урок', 'имя', 'один'],
          kunlar: function (n) { var d = n % 10, h = n % 100; return n + ' ' + (d === 1 && h !== 11 ? 'день' : d >= 2 && d <= 4 && (h < 12 || h > 14) ? 'дня' : 'дней'); } }
  };
  function tema() {
    var d = document.documentElement.getAttribute('data-theme');
    return d === 'dark' || (!d && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function och(kalit, o) {
    var RU = window.TIL === 'ru', X = TX[RU ? 'ru' : 'uz'];
    if (!RU) uygot();
    var M = MV[kalit];
    if (!M) {                                          /* мавзулар ҳали юкланмаган: qol/mavzu.js бир марта юкланади */
      if (yukl === 2) return null;
      kut = [kalit, o];
      if (!yukl) {
        yukl = 1; var sc = document.createElement('script'); sc.src = (o && o.papka || PAPKA) + (RU ? 'mavzu-ru.js' : 'mavzu.js');
        sc.onload = function () { yukl = 2; var k = kut; kut = null; if (k) och(k[0], k[1]); };
        sc.onerror = function () { yukl = 0; kut = null; };
        document.head.appendChild(sc);
      }
      return null;
    }
    o = o || {}; if (joriy) joriy.yop(true); uslub();
    var T = o.tema || tema(), P = o.papka || PAPKA, B = o.bildi || 3, MU = o.must || 7, MU2 = o.must2 || 21, ND = Math.min(B, 5), Q = M.qadam, n = Q.length, i, seg = '', kun = '';
    var SOZ = [['دَرْسٌ', X.soz[0]], ['اِسْمٌ', X.soz[1]], ['وَاحِدٌ', X.soz[2]]];        /* чизмадаги намуна сўзлар (1-дарс луғатидан) */
    for (i = 1; i <= ND; i++) kun += '<span>' + X.kun(i) + '</span>';
    var KN = M.keyingi && MV[M.keyingi] ? MV[M.keyingi].nom : '';
    var OV = !RU && !!AU && Q.some(function (q) { return q.o; }), jim = ovozYoq();
    var el = document.createElement('div');
    el.className = o.varaq ? 'qs qs-va' : 'qs'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', M.nom); el.setAttribute('data-ru-yoq', '');
    for (i = 0; i < n; i++) seg += '<i><b></b></i>';
    el.innerHTML = '<div class="qs-in">' + (o.varaq ? '<div class="qs-tut"></div>' : '') + '<div class="qs-pr">' + seg + '</div>' +
      '<div class="qs-hd"><b>' + M.nom + '</b><span></span>' + (o.temaTugma ? '<button class="qs-hb" data-q="tema" aria-label="' + X.tema + '">◐</button>' : '') +
      (OV ? '<button class="qs-hb" data-q="ovoz"></button>' : '') + '<button class="qs-hb" data-q="yop" aria-label="' + X.yop + '">✕</button></div>' +
      '<div class="qs-st"><div class="qs-cam"><div class="qs-scr"><img class="qs-i" alt=""><img class="qs-i" alt=""><div class="qs-r"></div><div class="qs-rp"></div><div class="qs-sn">' + SPK + '</div></div></div>' +
      '<div class="qs-dz"><div class="qs-dl"><b>' + X.dars + '</b><u><i></i></u><span>' + X.mashq + '</span></div><div class="qs-dk">' + kun + '</div>' +
      '<div class="qs-dm">' + X.otdi + '</div><div class="qs-dp">' + X.lv.map(function (t) { return '<div>' + t + '</div>'; }).join('') + '</div>' +
      SOZ.map(function (w) { return '<div class="qs-dw"><div><span class="ar" lang="ar" dir="rtl">' + w[0] + '</span><small>' + w[1] + '</small><u class="qs-db"><i></i><i></i><i></i></u><em></em></div></div>'; }).join('') + '</div>' +
      '<div class="qs-hand">' + QOL + '</div><div class="qs-ts"></div><div class="qs-yk">' + X.yuk + '</div>' +
      '<div class="qs-en"><h4>' + X.tamom + '</h4>' +
      (KN ? '<button class="qs-eb a" data-q="key">' + X.key + KN + ' ›</button>' : '<button class="qs-eb a" data-q="yop">' + X.tush + '</button>') +
      '<button class="qs-eb b" data-q="qayta">' + X.qayta + '</button>' + (KN ? '<button class="qs-eb b" data-q="yop">' + X.yop + '</button>' : '') + '</div></div>' +
      '<div class="qs-cp"><p></p></div>' +
      '<div class="qs-ct"><button class="qs-cb" data-q="-1" aria-label="' + X.old + '">‹</button><button class="qs-cb pp" data-q="pp" aria-label="' + X.tox + '"></button>' +
      '<button class="qs-cb" data-q="1" aria-label="' + X.keyi + '">›</button></div></div>';
    document.body.appendChild(el);
    var oldOv = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
    var tarix = false;                                 /* «орқага» тугмаси ўйнаткични ёпсин: тарихга битта ҳолат қўшилади */
    try { if (!(history.state && history.state.qol)) history.pushState({ qol: 1 }, ''); tarix = true; } catch (e) {}
    function orqaga() { yopish(false, true); }
    var $ = function (s) { return el.querySelector(s); };
    var st = $('.qs-st'), cam = $('.qs-cam'), im = el.querySelectorAll('.qs-i'), ring = $('.qs-r'), rp = $('.qs-rp'), hand = $('.qs-hand'),
        ts = $('.qs-ts'), sn = $('.qs-sn'), yk = $('.qs-yk'), en = $('.qs-en'), cp = $('.qs-cp p'), hn = $('.qs-hd span'), pr = $('.qs-pr').children, pp = $('[data-q="pp"]');
    var dz = $('.qs-dz'), dl = $('.qs-dl'), dpb = $('.qs-dl u i'), dls = $('.qs-dl span'), dk = $('.qs-dk'), dm = $('.qs-dm'), dmb = $('.qs-dm b'),
        dp = $('.qs-dp').children, dw = el.querySelectorAll('.qs-dw'), KR = ['#b3261e', '#a2690a', '#1b855a', '#2c63b8'], raf = 0;
    var sw = 0, sh = 0, ih = 0, cur = -1, ish = !RM, TM = [], ekr = null, ol = 0, xt = 0, rt = 0, yq = false, tayyor = false, ochiq = true;

    function olcham() { sw = st.clientWidth; sh = st.clientHeight; ih = sw * NIS; }
    function at(ms, f) { TM.push(setTimeout(f, ms)); }
    function toz() { TM.forEach(clearTimeout); TM = []; cancelAnimationFrame(raf); }
    function rect(e, t) {
      var R = M.ekran[e], x0 = 1, y0 = 1, x1 = 0, y1 = 0;
      [].concat(t).forEach(function (k) { var a = R[k]; if (!a) return; x0 = Math.min(x0, a[0]); y0 = Math.min(y0, a[1]); x1 = Math.max(x1, a[0] + a[2]); y1 = Math.max(y1, a[1] + a[3]); });
      return [x0, y0, x1 - x0, y1 - y0];
    }
    /* камера: butun — бутун экран (ўртада, кичик); yaqin — нишон яқиндан (экран эни ойнани тўлдиради) */
    function butun() { var z = Math.min(1, (sh - 24) / ih); return { z: z, x: (sw - sw * z) / 2, y: (sh - ih * z) / 2 }; }
    function yaqin(a, zq) {
      var z0 = butun().z, z = zq || Math.max(z0, Math.min(1.3, .9 / a[2], .92 * sh / (a[3] * ih)));
      if (!zq && z > .93 && z < 1.08) z = 1;
      var x = sw / 2 - (a[0] + a[2] / 2) * sw * z, y = sh * .46 - (a[1] + a[3] / 2) * ih * z;
      x = z <= 1 ? (sw - sw * z) / 2 : Math.max(sw - sw * z, Math.min(0, x));
      y = ih * z > sh ? Math.max(sh - ih * z, Math.min(0, y)) : (sh - ih * z) / 2;
      return { z: z, x: x, y: y };
    }
    function kam(K, tez) {
      cam.style.transition = tez ? 'none' : '';
      cam.style.transform = 'translate(' + K.x + 'px,' + K.y + 'px) scale(' + K.z + ')';
      if (tez) void cam.offsetWidth;
    }
    function joy(e, a, p) {
      e.style.left = 'calc(' + a[0] * 100 + '% - ' + p + 'px)'; e.style.top = 'calc(' + a[1] * 100 + '% - ' + p + 'px)';
      e.style.width = 'calc(' + a[2] * 100 + '% + ' + 2 * p + 'px)'; e.style.height = 'calc(' + a[3] * 100 + '% + ' + 2 * p + 'px)';
    }
    function ekran(nom) {
      if (ekr === nom) return false;
      ekr = nom; ol = 1 - ol; clearTimeout(xt);
      var a = im[ol], b = im[1 - ol];
      a.src = P + (RU ? 'ru-' : '') + T + '-' + nom + '.webp';
      a.classList.add('ust', 'on'); b.classList.remove('ust');
      xt = setTimeout(function () { b.classList.remove('on'); }, 470);
      return true;
    }
    function qol(p) {
      if (!hand.classList.contains('on')) {
        hand.style.transition = 'none'; hand.style.transform = 'translate(' + (p[0] + 34) + 'px,' + (p[1] + 100) + 'px)';
        void hand.offsetWidth; hand.style.transition = '';
      }
      hand.style.transform = 'translate(' + (p[0] - 20) + 'px,' + (p[1] - 2) + 'px)'; hand.classList.add('on');
    }
    function qolYoq() { hand.classList.remove('on'); }
    function qayta(e, k) { e.classList.remove(k); void e.offsetWidth; e.classList.add(k); }
    function bos(a, u, v) {
      qayta(hand, 'bos');
      rp.style.left = u * 100 + '%'; rp.style.top = v * 100 + '%'; qayta(rp, 'go');
      joy(ring, a, 3); ring.className = 'qs-r'; qayta(ring, 'fl');
    }
    function natija(tur) {
      var L = X.lv;
      ts.className = 'qs-ts';
      ts.innerHTML = '<div class="qs-nh ' + tur + '">' + (tur === 'ok' ? X.ok : X.no) + '</div><div class="qs-lv">' +
        L.map(function (t, j) { return '<span class="l' + j + (j === 1 ? ' on' : '') + '">' + t + (j === 1 ? '<em><i></i><i></i><i></i></em>' : '') + '</span>'; }).join('') +
        '</div><div class="qs-nt">' + (tur === 'ok' ? X.nok(X.kunlar(B)) : X.nno) + '</div>';
      ts.classList.add('on');
      at(RM ? 0 : 560, function () {
        var lv = ts.querySelector('.qs-lv');
        if (tur === 'ok') lv.classList.add('d1');
        /* xato — «ўрганяпман»da qoladi, nuqtalar 0 (23.11.2026; oldin «билмайман»ga tushardi) */
      });
    }
    function matn(c) { return c.replace('{Bk}', X.kunlar(B)).replace('{M2k}', X.kunlar(MU2)).replace('{Mk}', X.kunlar(MU)).replace('{B}', B).replace('{M2}', MU2).replace('{M}', MU).replace(/«[^»]+»/g, function (m) { return '<b>' + m + '</b>'; }); }
    /* ---- чизма: сўз карточкаси (j) жойи: 'ls' — дарс картаси ортида (яширин), 0..3 — поғона устида (q — устма-уст тартиб), null — йўқ */
    function dJoy(j, x, q) {
      var w = dw[j], b = w.firstChild;
      if (x === null) { w.style.opacity = 0; return; }
      var r = dz.getBoundingClientRect(), a, p;
      if (x === 'ls') { a = dl.getBoundingClientRect(); p = [a.left - r.left + 10 + j * 8, a.bottom - r.top - b.offsetHeight]; }
      else { a = dp[x].getBoundingClientRect(); p = [a.left - r.left + (a.width - b.offsetWidth) / 2, a.top - r.top - (b.offsetHeight + 5) * ((q || 0) + 1) + 1]; }
      w.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px)'; w.style.opacity = x === 'ls' ? 0 : 1;
      b.style.setProperty('--k', typeof x === 'number' ? KR[x] : '#d9d3c4');
    }
    function dHolat(h) {                               /* ls — дарс картаси, pr — «Машқ» чизиғи %, dn — тугади, dy — ✓ кунлар (-1 — йўқ), mo — ўтган кун (-1 — йўқ), on — ёниқ поғона */
      dl.classList.toggle('x', !h.ls); dl.classList.toggle('dn', !!h.dn); dls.textContent = h.dn ? X.mashq + ' · 80% ✓' : X.mashq; dpb.style.width = (h.pr || 0) + '%';
      dk.classList.toggle('qs-dx', !(h.dy >= 0)); for (var j = 0; j < ND; j++) dk.children[j].classList.toggle('ok', j < h.dy);
      dm.classList.toggle('qs-dx', !(h.mo >= 0)); if (h.mo >= 0) dmb.textContent = h.mo;
      for (j = 0; j < 4; j++) dp[j].classList.toggle('on', j === h.on);
    }
    function dTez(f) {                                 /* бошланғич ҳолат — ҳаракатсиз */
      [].forEach.call(dw, function (w) { w.style.transition = 'none'; w.classList.remove('tu'); w.firstChild.classList.remove('hop', 'shk'); }); dpb.style.transition = 'none';
      f(); void dz.offsetWidth;
      [].forEach.call(dw, function (w) { w.style.transition = ''; }); dpb.style.transition = '';
    }
    function dBelgi(tur, j) { j = j || 0; var e = dw[j].querySelector('em'); e.className = tur; void e.offsetWidth; e.classList.add('go'); if (tur === 'no') qayta(dw[j].firstChild, 'shk'); }
    function dSakra(x) { dw[0].classList.remove('tu'); dJoy(0, x); qayta(dw[0].firstChild, 'hop'); }
    /* 27.11.2026: chizmadagi so'z kartasida ham «Луғат»dagi kabi 3 chiziqcha — n ta to'la; k: 'y' sariq (ўрганяпман), 'g' yashil, 'm' ko'k */
    function dBar(j, n, k) { var u = dw[j].querySelector('u'); u.className = 'qs-db' + (k ? ' ' + k : ''); [].forEach.call(u.children, function (i, x) { i.classList.toggle('f', x < n); }); }
    function dKunlar(a) { for (var j = 0; j < ND; j++) dk.children[j].textContent = X.kun(a ? a[j] : j + 1); }
    var FZ = {};                                       /* joriy chizma bosqichlari (zarblar chaqiradi: ch) */
    /* sahnani boshlaydi, davomiyligini (ms) qaytaradi; zarbli — bosqichlarni ovozdagi so'zlar boshlaydi, aks holda o'z vaqt jadvali */
    function chizma(ch, zarbli) {
      FZ = {}; dKunlar();
      if (ch === 'tush') {
        dTez(function () { dHolat({ ls: 1, pr: 0, dy: -1, mo: -1, on: -1 }); for (var j = 0; j < 3; j++) { dJoy(j, 'ls'); dBar(j, 0, 'y'); } });
        FZ.p80 = function () { dpb.style.width = '80%'; at(1400, function () { dHolat({ ls: 1, pr: 80, dn: 1, dy: -1, mo: -1, on: -1 }); }); };
        FZ.tush = function () { dHolat({ ls: 1, pr: 80, dn: 1, dy: -1, mo: -1, on: 1 }); [0, 1, 2].forEach(function (j) { at(j * 340, function () { dw[j].classList.add('tu'); dJoy(j, 1, j); }); }); };
        if (!zarbli) { at(350, FZ.p80); at(2150, FZ.tush); }
        return 5400;
      }
      if (ch === 'bildi') {
        dTez(function () { dHolat({ ls: 0, dy: 0, mo: -1, on: 1 }); dJoy(0, 1); dBar(0, 0, 'y'); dJoy(1, null); dJoy(2, null); });
        FZ.kun = function () { for (var d = 1; d <= ND; d++) (function (d) { at((d - 1) * 620, function () { dHolat({ ls: 0, dy: d, mo: -1, on: 1 }); dBelgi('ok'); dBar(0, d, 'y'); }); })(d); };
        FZ.sakra = function () { dHolat({ ls: 0, dy: ND, mo: -1, on: 2 }); dSakra(2); dBar(0, 3, 'g'); };
        FZ.oraliq = function () { dKunlar([1, 4, 6, 9, 11]); qayta(dk, 'yo'); };   /* kunlar ketma-ket shart emas: 1, 4, 6-kun */
        if (!zarbli) { at(300, FZ.kun); at(300 + ND * 620 + 500, FZ.sakra); at(300 + ND * 620 + 1900, FZ.oraliq); }
        return 300 + ND * 620 + 4000;
      }
      if (ch === 'must') {                             /* 23.11.2026: ikki tekshiruv — MU kun ✓, yana MU2 kun ✓ → «мустаҳкам» */
        var sana = function (gacha) { var t0 = performance.now(); (function f(t) { var k = Math.min(1, (t - t0) / 1300); dmb.textContent = Math.round(k * gacha); if (k < 1) raf = requestAnimationFrame(f); })(t0); };
        dTez(function () { dHolat({ ls: 0, dy: -1, mo: 0, on: 2 }); dJoy(0, 2); dBar(0, 3, 'g'); dJoy(1, null); dJoy(2, null); });
        FZ.m1 = function () { sana(MU); at(1550, function () { dBelgi('ok'); }); };
        FZ.m2 = function () { dmb.textContent = 0; sana(MU2); at(1550, function () { dBelgi('ok'); }); };
        FZ.sakra = function () { dHolat({ ls: 0, dy: -1, mo: MU2, on: 3 }); dSakra(3); dBar(0, 3, 'm'); };
        if (!zarbli) { at(400, FZ.m1); at(2700, FZ.m2); at(4950, FZ.sakra); }
        return 7500;
      }
      /* xato (23.11.2026; 27.11.2026 — ikkinchi so'z ham): «биламан» so'z ✕ → «ўрганяпман», 2 chiziqcha qoladi; «ўрганяпман» so'z ✕ → 0 */
      dTez(function () { dHolat({ ls: 0, dy: -1, mo: -1, on: 2 }); dJoy(0, 2); dBar(0, 3, 'g'); dJoy(1, null); dJoy(2, null); });
      FZ.x1 = function () { dBelgi('no'); at(750, function () { dHolat({ ls: 0, dy: -1, mo: -1, on: 1 }); dw[0].classList.add('tu'); dJoy(0, 1); dBar(0, Math.min(B - 1, 3), 'y'); }); };
      FZ.x2 = function () { qayta(dw[0].querySelector('u'), 'yo'); };
      FZ.x3 = function () { dJoy(1, 1, 1); dBar(1, 1, 'y'); at(950, function () { dBelgi('no', 1); }); at(1550, function () { dBar(1, 0, 'y'); qayta(dw[1].querySelector('u'), 'yo'); }); };
      if (!zarbli) { at(900, FZ.x1); at(2500, FZ.x2); at(3400, FZ.x3); }
      return 6200;
    }
    /* ---- zarblar (27.11.2026): ko'rinish ovozga ergashadi */
    function joyTez(e, a, p) { e.style.transition = 'opacity .32s'; joy(e, a, p); void e.offsetWidth; e.style.transition = ''; }
    function chQator() { return '<div class="qs-cz"><em><i></i><i></i><i></i></em><small>' + X.lv[1] + '</small><span class="ar" lang="ar" dir="rtl">وَاحِدٌ</span></div>'; }
    function effekt(fx, a) {
      if (fx === 'ovoz') { if (!a) return; sn.style.left = (a[0] + a[2] * .12) * 100 + '%'; sn.style.top = (a[1] + a[3] / 2) * 100 + '%'; qayta(sn, 'go'); return; }
      if (fx === 'ch1') {                              /* chiziqchalar kunma-kun to'ladi */
        ts.className = 'qs-ts alt'; ts.innerHTML = chQator() + '<div class="qs-ck">' + [1, 2, 3].map(function (d) { return '<span>' + X.kun(d) + '</span>'; }).join('') + '</div>';
        void ts.offsetWidth; ts.classList.add('on');
        [0, 1, 2].forEach(function (j) { at(500 + j * 700, function () { var r = ts.querySelector('.qs-cz'); if (!r) return; r.querySelectorAll('em i')[j].className = 'y'; ts.querySelectorAll('.qs-ck span')[j].classList.add('ok'); }); });
        return;
      }
      var r = ts.querySelector('.qs-cz');
      if (fx === 'ch2' && r) { [].forEach.call(r.querySelectorAll('em i'), function (i) { i.className = 'g'; }); var m = r.querySelector('small'); m.textContent = X.lv[2]; m.className = 'g'; qayta(r, 'pop'); return; }
      if (fx === 'ch3' && r) ts.insertAdjacentHTML('beforeend', '<div class="qs-cz q"><em><i></i><i></i><i></i></em><small>' + X.qy + '</small><span class="ar" lang="ar" dir="rtl">أَوَّلٌ</span><b>↑</b></div>');
    }
    function zarb(z) {
      if (z.ch) { if (FZ[z.ch]) FZ[z.ch](); return; }
      if (z.fx && !z.t) { effekt(z.fx); return; }
      var e = z.s || ekr, yangi = e !== ekr;
      if (yangi) ekran(e);
      var a = rect(e, z.t), f = z.f ? rect(e, z.f) : a, K = yaqin(f, z.z), u = a[0] + a[2] / 2, v = a[1] + a[3] * .45;
      var sur = !yangi && z.a !== 'tap' && ring.classList.contains('on');   /* shu ekranda halqa yangi joyga suzib o'tadi */
      if (!sur) ring.className = 'qs-r';
      kam(K); yq = true;
      if (z.a === 'tap') {
        qol([u * sw * K.z + K.x, v * ih * K.z + K.y]);
        at(820, function () { bos(a, u, v); if (z.fx) effekt(z.fx, a); });
        if (z.go) at(1160, function () { ekran(z.go); kam(butun()); yq = false; qolYoq(); });
        return;
      }
      qolYoq();
      if (sur) joy(ring, a, 4);
      else at(yangi ? 520 : 320, function () { joyTez(ring, a, 4); ring.classList.add('on'); });
      if (z.fx) effekt(z.fx, a);
    }
    /* zarb vaqti (qadam boshidan, ms): ovoz bilan — so'zning ovozdagi vaqti; ovozsiz — matndagi ulushi yozuv vaqtida */
    function zarbVaqt(z, s) { return OV && !jim && s.od ? OV0 + (z.ms != null ? z.ms : Math.round(z.r * s.od)) : Math.round(z.r * (700 + 40 * s.c.length)); }
    /* zarb harakati qancha davom etadi — keyingisi undan oldin boshlanmaydi (ovozsiz/ruschada vaqtlar zich bo'lganda ham bir-birini bosmaydi) */
    function zarbUzun(z) {
      return z.fx === 'ch1' ? 2700 : z.ch === 'kun' ? ND * 620 + 400 : z.ch === 'm1' || z.ch === 'm2' || z.ch === 'x3' ? 1800 : z.ch === 'p80' ? 1500 :
        z.ch === 'tush' || z.ch === 'x1' ? 1200 : z.a === 'tap' ? (z.go ? 1500 : 1100) : 650;
    }
    function zarbQoy(s, dur, tayyor) {                 /* tayyor — qadamning o'z harakati tugaydigan vaqt (zarb undan oldin boshlanmaydi) */
      if (!s.b) return dur;
      var oxir = tayyor, uz = tayyor ? 650 : 0;
      s.b.forEach(function (z) { var t = Math.max(zarbVaqt(z, s), oxir + uz); oxir = t; uz = zarbUzun(z); at(t, function () { zarb(z); }); });
      return Math.max(dur, oxir + Math.max(2400, uz + 900));
    }
    function segm(k, dur) {
      for (var j = 0; j < n; j++) pr[j].className = j < k || (j === k && !ish) ? 'd' : '';
      if (ish) { var b = pr[k].firstChild; b.style.animationDuration = dur + 'ms'; void b.offsetWidth; pr[k].className = 'on'; }
    }
    function ppIcon() { pp.innerHTML = ish ? PAUSE : PLAY; pp.setAttribute('aria-label', ish ? X.tox : X.dav); }
    function ovIcon() { var b = $('[data-q="ovoz"]'); if (!b) return; b.innerHTML = jim ? SP0 : SP1; b.setAttribute('aria-pressed', String(!jim)); b.setAttribute('aria-label', jim ? X.ov1 : X.ov0); }
    function ovTox() { if (!AU) return; AU.onended = AU.onerror = null; try { AU.pause(); } catch (e) {} }
    function ovDur(s, dur) { return OV && !jim && s.o ? Math.max(dur, OV0 + s.od + OV1) : dur; }
    /* keyingi qadamga o'tish: vaqt tugashi VA ovoz tugashi kerak (ovoz sekin yuklansa ham gap kesilmaydi; ko'pi bilan +5 s kutadi) */
    function kutish(k, s, dur) {
      if (!ish) return;
      var oq = OV && !jim && s.o, t = false, a = !oq;
      function nx() { if (t && a && cur === k && ish) bor(k + 1); }
      if (oq) {
        at(OV0, function () {
          AU.onended = AU.onerror = function () { a = true; nx(); };
          try { AU.src = P + 'ovoz/' + s.o; var p = AU.play(); if (p && p.catch) p.catch(function () { a = true; nx(); }); } catch (e) { a = true; }
        });
        at(dur + 5000, function () { a = true; nx(); });
      }
      at(dur, function () { t = true; nx(); });
    }

    function bor(k) {
      toz(); ovTox(); en.classList.remove('on');
      if (k >= n) { tugadi(); return; }
      if (k < 0) k = 0;
      cur = k;
      var s = Q[k], dur;
      hn.textContent = (k + 1) + ' / ' + n;
      cp.classList.add('f'); at(RM ? 0 : 170, function () { cp.innerHTML = matn(s.c); cp.classList.remove('f'); });
      ts.classList.remove('on'); ring.className = 'qs-r';
      if (s.ch) {                                        /* чизма қадами: экран расми ўрнида поғоналар */
        st.classList.add('dz'); qolYoq(); yq = false; ts.classList.remove('on');
        dur = ovDur(s, Math.max(chizma(s.ch, !!(s.b && s.b.some(function (z) { return z.ch; }))), 1300 + 40 * s.c.length));
        dur = zarbQoy(s, dur, 0);
        segm(k, dur); kutish(k, s, dur);
        return;
      }
      st.classList.remove('dz');
      var a = rect(s.s, s.t), f = s.f ? rect(s.s, s.f) : a;
      var yangi = ekran(s.s) || !yq;
      if (yangi) { kam(butun()); yq = false; qolYoq(); }
      var t0 = RM ? 0 : yangi ? 650 : 280, K = yaqin(f, s.z), u = a[0] + a[2] / 2, v = a[1] + a[3] * .45;
      at(t0, function () { kam(K); yq = true; if (s.a === 'tap') qol([u * sw * K.z + K.x, v * ih * K.z + K.y]); else qolYoq(); });
      var tayyor;
      if (s.a === 'look') { at(t0 + 540, function () { joyTez(ring, a, 4); ring.classList.add('on'); }); dur = t0 + 2900; tayyor = t0 + 1000; }
      else {
        var tb = t0 + 920;
        at(tb, function () { bos(a, u, v); });
        if (s.n) { at(tb + 300, function () { natija(s.n); }); dur = tb + 3100; tayyor = tb + 900; }
        else if (s.go) { at(tb + 340, function () { ekran(s.go); kam(butun()); yq = false; qolYoq(); }); dur = tb + 340 + 800 + 1000; tayyor = tb + 1200; }
        else { dur = tb + 1500; tayyor = tb + 600; }
      }
      dur = zarbQoy(s, ovDur(s, Math.max(dur, 1300 + 40 * s.c.length)), tayyor);
      segm(k, dur);
      kutish(k, s, dur);
    }
    function tugadi() {
      toz(); ovTox(); ish = false; cur = n - 1; ppIcon(); qolYoq(); ring.className = 'qs-r'; ts.classList.remove('on');
      for (var j = 0; j < n; j++) pr[j].className = 'd';
      en.classList.add('on');
      if (o.tugadi) o.tugadi();                          /* oxirigacha ko'rildi (takror.html: ⓘ yonidagi nuqta o'chadi) */
    }
    function keyingi(d) {
      if (!tayyor) return;
      if (en.classList.contains('on')) { if (d < 0) bor(n - 1); return; }
      bor(cur + d);
    }
    function toxta() { if (!ish) return; ish = false; toz(); ovTox(); ppIcon(); if (cur >= 0) pr[cur].className = 'd'; }
    function yopish(tez, popdan) {
      if (!ochiq) return; ochiq = false; toz(); ovTox(); clearTimeout(xt); clearTimeout(rt);
      window.removeEventListener('popstate', orqaga);
      if (tez !== true && !popdan && tarix) { try { if (history.state && history.state.qol) history.back(); } catch (e) {} }
      window.removeEventListener('resize', olchOzgardi); document.removeEventListener('keydown', tugma); document.removeEventListener('visibilitychange', korin);
      document.documentElement.style.overflow = oldOv; if (joriy === api) joriy = null;
      if (tez === true) { if (el.parentNode) el.parentNode.removeChild(el); return; }
      el.classList.remove('on'); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
      if (o.yopilganda) o.yopilganda();
    }
    function olchOzgardi() {
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (!tayyor || (st.clientWidth === sw && st.clientHeight === sh)) return;
        olcham(); yq = false; kam(butun(), true); qolYoq(); if (!en.classList.contains('on')) bor(cur);
      }, 200);
    }
    function tugma(e) {
      if (e.key === 'Escape') yopish(); else if (e.key === 'ArrowRight') keyingi(1); else if (e.key === 'ArrowLeft') keyingi(-1);
    }
    function korin() { if (document.hidden) toxta(); }

    st.onclick = function (e) {
      if (e.target.closest('.qs-en')) return;
      var r = st.getBoundingClientRect(); keyingi(e.clientX - r.left < r.width * .3 ? -1 : 1);   /* чап томон — олдинги, ўнг томон — кейинги */
    };
    el.addEventListener('click', function (e) {
      if (o.varaq && e.target === el) { yopish(); return; }   /* oynadan tashqari (bo'sh joy) bosilsa — yopiladi */
      var b = e.target.closest('[data-q]'); if (!b) return;
      var q = b.getAttribute('data-q');
      if (q === 'yop') yopish();
      else if (q === 'ovoz') {                         /* 27.11.2026: ovozni o'chirish / yoqish (tanlov eslab qolinadi) */
        jim = !jim; try { localStorage.setItem('qol-ovoz', jim ? '0' : '1'); } catch (x) {} ovIcon();
        if (!jim) uygot();
        if (tayyor && !en.classList.contains('on')) { if (ish) bor(cur); else ovTox(); }
      }
      else if (q === 'tema') { o.tema = T === 'dark' ? 'light' : 'dark'; yopish(true); och(kalit, o); }
      else if (q === 'key') { o.tema = T; yopish(true); och(M.keyingi, o); }
      else if (!tayyor) return;
      else if (q === 'qayta') { ish = !RM; ppIcon(); bor(0); }
      else if (q === 'pp') {
        if (en.classList.contains('on')) { ish = true; ppIcon(); bor(0); }
        else if (ish) toxta();
        else { ish = true; ppIcon(); bor(cur); }
      }
      else keyingi(+q);
    });
    if (o.varaq) (function () {                         /* tepadagi chiziqni pastga surish — yopadi */
      var ic = el.querySelector('.qs-in'), tu = el.querySelector('.qs-tut'), y0 = null, dy = 0;
      tu.addEventListener('pointerdown', function (e) { y0 = e.clientY; dy = 0; ic.style.transition = 'none'; try { tu.setPointerCapture(e.pointerId); } catch (x) {} });
      tu.addEventListener('pointermove', function (e) { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); ic.style.transform = 'translateY(' + dy + 'px)'; });
      var qo = function () { if (y0 === null) return; y0 = null; ic.style.transition = ''; if (dy > 80) { ic.style.transform = 'translateY(100%)'; yopish(); } else ic.style.transform = ''; };
      tu.addEventListener('pointerup', qo); tu.addEventListener('pointercancel', qo);
    })();
    window.addEventListener('popstate', orqaga); window.addEventListener('resize', olchOzgardi); document.addEventListener('keydown', tugma); document.addEventListener('visibilitychange', korin);

    /* расмларни олдиндан юклаш, кейин бошлаш */
    var nom = Object.keys(M.ekran), yuk = 0, xato = 0, vaqt = false, bosh = false;
    function boshla() {
      if (bosh || !ochiq || !vaqt || yuk < nom.length) return;
      bosh = true;
      if (xato) { yk.textContent = X.xato; return; }
      tayyor = true; if (yk.parentNode) yk.parentNode.removeChild(yk);
      olcham(); kam(butun(), true); ppIcon(); ovIcon();
      if (OV && !jim && window.fetch) Q.forEach(function (q) { if (q.o) fetch(P + 'ovoz/' + q.o).catch(function () {}); });   /* oldindan keshga */
      bor(0);
    }
    nom.forEach(function (k) { var I = new Image(); I.onload = function () { yuk++; boshla(); }; I.onerror = function () { xato++; yuk++; boshla(); }; I.src = P + (RU ? 'ru-' : '') + T + '-' + k + '.webp'; });
    setTimeout(function () { vaqt = true; boshla(); }, RM ? 0 : 380);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('on'); }); });

    var api = { yop: yopish, bor: function (k) { if (tayyor) bor(k); }, toxta: toxta, holat: function () { return tayyor ? cur : -1; } };
    joriy = api;
    return api;
  }

  window.Qollanma = { qosh: function (k, m) { MV[k] = m; }, och: och, yop: function () { if (joriy) joriy.yop(); } };
})();
