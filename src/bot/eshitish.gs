/**
 * Эшитиш жадвали — Telegram гуруҳидаги аудиоларни ким эшитганини ҳисоблайди.
 * Ўрнатиш:
 *  1) Янги Google жадвал очинг → Кенгайтмалар → Apps Script → шу кодни қўйинг.
 *  2) Лойиҳа созламалари → Script Properties → BOT_TOKEN = (ботнинг токени).
 *  3) setup() функциясини бир марта ишга туширинг (рухсат беринг).
 *  4) Жойлаштириш → Янги жойлаштириш → Веб-илова: «Мен номимдан», «Ҳамма» → URL ни нусхалаб олинг.
 */
var TZ = 'Asia/Samarkand';
var MUDDAT_SOAT = 24;
var SAYT = 'https://abduhakim9999.github.io/arab-tili/fq/';
var ILOVA = 'https://t.me/Arabtilihivar_bot/darslar';
var ESLATMA = '21:00';      // muddat tugashidan oldin eslatma vaqti
var FEEL_SONI = 5;           // кунига нечта феъл
var REYTING = { kun: 7, vaqt: '20:00' };   // ҳафталик рейтинг: Якшанба 20:00
var NATIJA = { kunlar: [2, 5], vaqt: '08:00', soni: 10 };   // Сешанба ва Жума 08:00 — охирги 10 та дарс натижаси гуруҳга

function P(k) { return PropertiesService.getScriptProperties().getProperty(k); }
function key() {
  var d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'eshit:' + P('BOT_TOKEN'), Utilities.Charset.UTF_8);
  return d.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('').slice(0, 32);
}
function sh(n, head) {
  var ss = SpreadsheetApp.getActive(), s = ss.getSheetByName(n);
  if (!s) { s = ss.insertSheet(n); if (head) { s.appendRow(head); s.setFrozenRows(1); s.getRange(1, 1, 1, head.length).setFontWeight('bold'); } }
  return s;
}
function rows(n) { var v = sh(n).getDataRange().getValues(); v.shift(); return v; }
function cfg(k, v) {
  var s = sh('Созлама', ['калит', 'қиймат']), d = s.getDataRange().getValues();
  for (var i = 1; i < d.length; i++) if (d[i][0] === k) {
    if (v === undefined) { var x = d[i][1]; return x instanceof Date ? Utilities.formatDate(x, TZ, x.getFullYear() < 1950 ? 'HH:mm' : 'yyyy-MM-dd') : x; }
    s.getRange(i + 1, 2).setNumberFormat('@').setValue(String(v)); return v;
  }
  if (v === undefined) return '';
  s.appendRow([k, '']); s.getRange(s.getLastRow(), 2).setNumberFormat('@').setValue(String(v)); return v;
}
function now() { return new Date(); }
function fmt(d) { return Utilities.formatDate(new Date(d), TZ, 'dd.MM HH:mm'); }
function tg(m, p) {
  var r = UrlFetchApp.fetch('https://api.telegram.org/bot' + P('BOT_TOKEN') + '/' + m,
    { method: 'post', contentType: 'application/json', payload: JSON.stringify(p), muteHttpExceptions: true });
  return JSON.parse(r.getContentText());
}

function setup() {
  sh('Жадвал'); sh('Қора рўйхат', ['аудио', 'user_id', 'исм', 'сана']);
  sh('Аъзолар', ['user_id', 'исм', 'username', 'қўшилган', 'ҳисобланмасин (1)']);
  sh('Аудиолар', ['id', 'номи', 'chat_id', 'message_id', 'юборилди', 'муддат', 'ҳолат', 'poll_id', 'poll_msg']);
  sh('Белгилар', ['аудио_id', 'user_id', 'исм', 'вақт', 'кечикди']);
  sh('Навбат', ['№', 'номи', 'file_id', 'тури', 'ҳолат', 'юборилди']);
  cfg('group', cfg('group') || '');
  if (!cfg('vaqt')) cfg('vaqt', '08:00');
  if (!cfg('kunlar')) cfg('kunlar', '1,2,3,4,5,6,7');
  if (!cfg('feel_k')) cfg('feel_k', 1);
  sh('Феъл саволлар', ['poll_id', 'кун', '№', 'феъл', 'тўғри', 'юборилди']);
  sh('Феъл тест', ['poll_id', 'user_id', 'исм', 'феъл', 'натижа', 'вақт']);
  sh('Хатолар', ['user_id', '№', 'феъл', 'ҳолат']);
  var fs = sh('Феъллар', ['№', 'феъл', 'музореъ', 'маъно']);
  if (fs.getLastRow() < 2) {
    var V = JSON.parse(UrlFetchApp.fetch(SAYT + 'verbs.json').getContentText());
    fs.getRange(2, 1, V.length, 4).setValues(V.map(function (v, i) { return [i + 1, v.m, v.mu, v.me]; }));
  }
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('tekshir').timeBased().everyMinutes(15).create();
  Logger.log('Калит: ' + key());
}

function member(u) {
  if (!u || u.is_bot) return;
  var s = sh('Аъзолар'), d = s.getDataRange().getValues(), nm = [u.first_name, u.last_name].filter(String).join(' ');
  for (var i = 1; i < d.length; i++) if (String(d[i][0]) === String(u.id)) {
    if (nm && d[i][1] !== nm) s.getRange(i + 1, 2).setValue(nm);
    if (u.username && d[i][2] !== '@' + u.username) s.getRange(i + 1, 3).setValue('@' + u.username);
    return;
  }
  s.appendRow([String(u.id), nm, u.username ? '@' + u.username : '', fmt(now()), '']);
}
function members() { return rows('Аъзолар').filter(function (r) { return r[0] && String(r[4]) !== '1'; }); }

function doPost(e) {
  var q = JSON.parse(e.postData.contents || '{}'), out;
  if (q.a === 'app') return J(ilova(q));
  if (q.k !== key()) return J({ ok: false, err: 'key' });
  if (q.a === 'yangila') return J(yangila());
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (q.a === 'group') { cfg('group', String(q.chat)); out = { ok: true }; }
    else if (q.a === 'cfg') out = { ok: true, group: cfg('group'), ctrl: cfg('ctrl') };
    else if (q.a === 'ctrl') { cfg('ctrl', String(q.chat)); out = { ok: true }; }
    else if (q.a === 'member') { (q.users || []).forEach(member); out = { ok: true }; }
    else if (q.a === 'post') { var dl = joyla(q.id, q.title, q.chat, q.msg); out = { ok: true, deadline: fmt(dl) }; }
    else if (q.a === 'mark') out = mark(q);
    else if (q.a === 'mode') { if (q.v !== undefined) cfg('mode', q.v); out = { ok: true, mode: cfg('mode') }; }
    else if (q.a === 'queue') {
      var nq = sh('Навбат'), n = nq.getLastRow();
      nq.appendRow([n, q.title, q.file_id, q.kind, '', '']);
      out = { ok: true, n: navbat().length };
    }
    else if (q.a === 'qlist') out = { ok: true, list: navbatQator().map(function (x) { return { t: String(x.v[1]), k: String(x.v[3] || 'audio') }; }) };
    else if (q.a === 'qdel') {
      var Q = navbatQator(), ps = (q.ps || []).map(Number).filter(function (i) { return Q[i]; }).sort(function (a, b) { return b - a; });
      ps.forEach(function (i) { sh('Навбат').deleteRow(Q[i].row); });
      out = { ok: true, n: ps.length };
    }
    else if (q.a === 'qup') {
      var Q2 = navbatQator(), i2 = Number(q.p);
      if (i2 > 0 && Q2[i2]) {
        var ns = sh('Навбат'), a1 = ns.getRange(Q2[i2 - 1].row, 1, 1, 6), a2 = ns.getRange(Q2[i2].row, 1, 1, 6), v1 = a1.getValues(), v2 = a2.getValues();
        a1.setValues(v2); a2.setValues(v1);
      }
      out = { ok: true };
    }
    else if (q.a === 'set') {
      if (q.vaqt) { if (!/^\d{1,2}:\d{2}$/.test(q.vaqt)) return J({ ok: false, err: 'вақт нотўғри (масалан 08:00)' }); cfg('vaqt', q.vaqt); }
      if (q.kunlar) cfg('kunlar', q.kunlar);
      if (q.nat_tur !== undefined) cfg('nat_tur', q.nat_tur === 'e' || q.nat_tur === 'f' ? q.nat_tur : 'ef');
      if (q.feel_k) { if (!/^\d+$/.test(q.feel_k)) return J({ ok: false, err: 'рақам ёзинг, масалан: /fel_k 1' }); cfg('feel_k', Number(q.feel_k)); }
      out = { ok: true, text: holat() };
    }
    else if (q.a === 'holat') out = { ok: true, text: holat() };
    else if (q.a === 'ans') out = javob(q);
    else if (q.a === 'feel') out = feelKun();
    else if (q.a === 'rep') out = { ok: true, text: hisobot(q.id) };
    else if (q.a === 'nat') out = natijalar(true);
    else if (q.a === 'alist') out = { ok: true, list: rows('Аудиолар').filter(function (r) { return r[0]; }).slice(-12).reverse()
      .map(function (r) { return { id: String(r[0]), t: String(r[1]), d: r[4] instanceof Date ? Utilities.formatDate(r[4], TZ, 'dd.MM HH:mm') : String(r[4] || '') }; }) };  // юборилган вақти — бир хил номлиларни ажратиш учун
    else if (q.a === 'del') out = ochir(q.id);
    else if (q.a === 'rep2') out = hisobot2(q.v, q.d, Number(q.p) || 0);
    else out = { ok: false, err: 'a' };
  } finally { lock.releaseLock(); }
  return J(out);
}
function J(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// So'rovnoma (hozirgi guruh uslubida): muddat — shu kuni 24:00 gacha
var OPT = ['Алҳамдулиллаҳ ўз вақтида эътибор билан тинглаб эшитдим! 🤗', '⏳ Ҳали эшитмадим'];
function kunOxiri() { return new Date(Utilities.formatDate(now(), TZ, "yyyy-MM-dd'T'23:59:59") + '+05:00'); }
function joyla(id, title, chat, msg) {
  var dl = kunOxiri();
  var base = { chat_id: chat, question: '«' + title + '»ни ким ўз вақтида эътибор билан тинглаб эшитди? — 24:00гача!!!',
    is_anonymous: false, reply_to_message_id: msg };
  // Avval: bitta javob + Telegram'ning o'z taymeri (close_date). Telegram qabul qilmasa — soddaroq variantlar.
  var tries = [
    { options: [OPT[0]], close_date: Math.floor(dl.getTime() / 1000) },
    { options: [OPT[0]] },
    { options: OPT, close_date: Math.floor(dl.getTime() / 1000) },
    { options: OPT }
  ], p = null;
  for (var i = 0; i < tries.length; i++) {
    var q = JSON.parse(JSON.stringify(base));
    q.options = tries[i].options.map(function (t) { return { text: t }; });
    if (tries[i].close_date) q.close_date = tries[i].close_date;
    p = tg('sendPoll', q);
    if (p.ok) break;
    Logger.log('sendPoll ' + i + ': ' + p.description);
  }
  sh('Аудиолар').appendRow([id, title, String(chat), msg, fmt(now()), dl.toISOString(), '', p && p.ok ? "'" + p.result.poll.id : '', p && p.ok ? p.result.message_id : '']);  // ' — жадвал узун рақамни яхлитламасин
  jadval();
  return dl;
}
function belgila(id, user, on) {
  var s = sh('Белгилар'), d = s.getDataRange().getValues();
  for (var i = d.length - 1; i >= 1; i--) if (String(d[i][0]) === String(id) && String(d[i][1]) === String(user.id)) { if (on) return; s.deleteRow(i + 1); }
  if (on) s.appendRow([String(id), String(user.id), [user.first_name, user.last_name].filter(String).join(' '), fmt(now()), '']);
}

function audio(id) {
  var d = rows('Аудиолар');
  for (var i = d.length - 1; i >= 0; i--) if (String(d[i][0]) === String(id)) return { row: i + 2, r: d[i] };
  return null;
}
function mark(q) {
  member(q.user);
  var a = audio(q.id); if (!a) return { ok: true, text: 'Аудио топилмади.' };
  var b = rows('Белгилар').some(function (r) { return String(r[0]) === String(q.id) && String(r[1]) === String(q.user.id); });
  if (b) return { ok: true, text: 'Сиз аввал белгилагансиз ✅' };
  var late = now() > new Date(a.r[5]);
  sh('Белгилар').appendRow([String(q.id), String(q.user.id), [q.user.first_name, q.user.last_name].filter(String).join(' '), fmt(now()), late ? 1 : '']);
  jadval();
  return { ok: true, text: late ? 'Белгиланди, лекин муддат ўтиб кетган ⏰' : 'Белгиланди ✅ Баракалла!' };
}

function heard(id) {
  var m = {};
  rows('Белгилар').forEach(function (r) { if (String(r[0]) === String(id) && String(r[4]) !== '1') m[String(r[1])] = 1; });
  return m;
}
// Саҳифаларга бўлиш (Telegram хабари 4096 белгидан ошмасин)
function sahifa(bosh, B, p) {
  var P = [[]], len = 0;
  B.forEach(function (b) { if (len + b.length > 3300 && P[P.length - 1].length) { P.push([]); len = 0; } P[P.length - 1].push(b); len += b.length + 2; });
  p = Math.max(0, Math.min(p, P.length - 1));
  return { ok: true, text: bosh + (P.length > 1 ? ' · саҳифа ' + (p + 1) + '/' + P.length : '') + '\n\n' + P[p].join('\n\n'), pages: P.length, page: p };
}
// Кунлик феъл ҳисоботи: v='fe' — кунлар бўйича, v='fo' — одамлар бўйича
function hisobotFeel(v, d, p) {
  var t = now(), today = Utilities.formatDate(t, TZ, 'yyyy-MM-dd'), oy = today.slice(0, 7), hafta = Utilities.formatDate(new Date(t.getTime() - 7 * 864e5), TZ, 'yyyy-MM-dd');
  var F = rows('Феъл кунлар').map(function (r) { return { d: String(r[0]).replace(/^'/, ''), k: Number(r[1]) }; })
    .filter(function (f) { return f.k && (d === 'all' || (d === 'm' ? f.d.slice(0, 7) === oy : f.d >= hafta)); });
  var davr = d === 'm' ? 'шу ой' : d === 'all' ? 'ҳаммаси' : 'охирги 7 кун';
  if (!F.length) return { ok: true, text: '🔤 Кунлик феъл (' + davr + ')\n\nБу даврда феъл юборилмаган.', pages: 1 };
  var T = rows('Феъл тест'), V = rows('Феъллар'), M = members(), R = F.map(function (f) { return feelNatija(f.k, f.d, T, V); });
  var nom = function (f) { return ((f.k - 1) * FEEL_SONI + 1) + '–' + (f.k * FEEL_SONI) + ' (' + f.d.slice(8, 10) + '.' + f.d.slice(5, 7) + ')'; }, B = [];
  if (v === 'fo') {
    M.forEach(function (m) {
      var id = String(m[0]), no = [], ok = 0, ball = 0;
      F.forEach(function (f, i) { var x = R[i].ha.filter(function (h) { return String(h.id) === id; })[0]; if (x) { ok++; ball += x.ok; } else no.push(nom(f)); });
      B.push((no.length ? '❌ ' : '✅ ') + (m[1] || 'аъзо') + ' — ' + ok + ' / ' + F.length + ' кун' + (ok ? ', ўртача ' + (Math.round(ball / ok * 10) / 10) + '/' + FEEL_SONI : '') +
        (no.length ? '\n   Ишламаган: ' + no.join(', ') : ''));
    });
    B.sort(function (a, b) { return (a.charAt(0) === '❌' ? 0 : 1) - (b.charAt(0) === '❌' ? 0 : 1); });
  } else {
    F.slice().reverse().forEach(function (f, j) {
      var r = R[F.length - 1 - j];
      B.push('🔤 ' + nom(f) + '\n   ✅ ' + (r.ha.map(function (x) { return x.n + ' ' + x.ok + '/' + FEEL_SONI; }).join(', ') || '—') +
        '\n   ❌ ' + (r.yoq.map(function (m) { return m[1] || 'аъзо'; }).join(', ') || '—'));
    });
  }
  return sahifa('🔤 Кунлик феъл — ' + (v === 'fo' ? '👤 одамлар бўйича' : '📅 кунлар бўйича') + ' (' + davr + ')\nКунлар: ' + F.length + ' · Аъзолар: ' + M.length, B, p);
}
// Ёзувлар бўйича (v='e') ёки одамлар бўйича (v='o') ҳисобот; d: '7' — охирги 7 кун, 'm' — шу ой, 'all' — ҳаммаси
var HAFTA = ['Якш', 'Душ', 'Сеш', 'Чор', 'Пай', 'Жум', 'Шан'];
function hisobot2(v, d, p) {
  if (v === 'fe' || v === 'fo') return hisobotFeel(v, d, p);
  var A = rows('Аудиолар').filter(function (r) { return r[0] && r[5]; }), t = now(), oy = Utilities.formatDate(t, TZ, 'yyyy-MM');
  A = A.filter(function (r) {
    var dl = new Date(r[5]);
    if (d === 'm') return Utilities.formatDate(dl, TZ, 'yyyy-MM') === oy;
    if (d === 'all') return true;
    return dl.getTime() >= t.getTime() - 7 * 864e5;
  });
  var davr = d === 'm' ? 'шу ой' : d === 'all' ? 'ҳаммаси' : 'охирги 7 кун';
  if (!A.length) return { ok: true, text: '📋 Ҳисобот (' + davr + ')\n\nБу даврда ҳивар юборилмаган.', pages: 1 };
  // ким қайси ёзувни белгилаган (кечикканлар алоҳида)
  var H = {}, L = {};
  rows('Белгилар').forEach(function (r) { var k = String(r[0]) + '|' + String(r[1]); if (String(r[4]) === '1') L[k] = 1; else H[k] = 1; });
  var M = members(), kun = function (r) { var dl = new Date(r[5]); return Utilities.formatDate(dl, TZ, 'dd.MM') + ', ' + HAFTA[Number(Utilities.formatDate(dl, TZ, 'u')) % 7]; };
  var davom = function () { return false; };   // «якунланмаган» ажратилмайди: эшитди ёки эшитмади
  var B = [];
  if (v === 'o') {
    M.forEach(function (m) {
      var id = String(m[0]), no = [], kech = [], ok = 0;
      A.forEach(function (r) { var k = String(r[0]) + '|' + id; if (H[k]) ok++; else if (L[k]) kech.push(r[1]); else if (!davom(r)) no.push(r[1] + ' (' + kun(r) + ')'); });
      B.push((no.length ? '❌ ' : '✅ ') + (m[1] || 'аъзо') + ' — ' + ok + ' / ' + A.length +
        (no.length ? '\n   Эшитмаган: ' + no.join(', ') : '') + (kech.length ? '\n   ⏰ Кечикиб: ' + kech.join(', ') : ''));
    });
    B.sort(function (a, b) { return (a.charAt(0) === '❌' ? 0 : 1) - (b.charAt(0) === '❌' ? 0 : 1); });
  } else {
    A.slice().reverse().forEach(function (r) {
      var no = [], kech = [], ok = 0;
      M.forEach(function (m) { var k = String(r[0]) + '|' + String(m[0]); if (H[k]) ok++; else if (L[k]) kech.push(m[1]); else no.push(m[1] || 'аъзо'); });
      B.push('🎧 ' + r[1] + ' (' + kun(r) + ')' + (davom(r) ? ' ⏳' : '') + '\n   ✅ ' + ok + ' · ' + (davom(r) ? '⏳ ҳали: ' : '❌ ') + (no.length ? no.join(', ') : '—') + (kech.length ? '\n   ⏰ Кечикиб: ' + kech.join(', ') : ''));
    });
  }
  // саҳифаларга бўлиш (Telegram хабари 4096 белгидан ошмасин)
  var P = [[]], len = 0;
  B.forEach(function (b) { if (len + b.length > 3300 && P[P.length - 1].length) { P.push([]); len = 0; } P[P.length - 1].push(b); len += b.length + 2; });
  p = Math.max(0, Math.min(p, P.length - 1));
  var bosh = '📋 Ҳисобот — ' + (v === 'o' ? '👤 одамлар бўйича' : '🎧 ҳиварлар бўйича') + ' (' + davr + ')\nҲиварлар: ' + A.length + ' · Аъзолар: ' + M.length + (P.length > 1 ? ' · саҳифа ' + (p + 1) + '/' + P.length : '') + '\n\n';
  return { ok: true, text: bosh + P[p].join('\n\n'), pages: P.length, page: p };
}
function hisobot(id) {
  var A = rows('Аудиолар'); if (!A.length) return 'Ҳали аудио юборилмаган.';
  var a = id ? audio(id) : { r: A[A.length - 1] }; if (!a) return 'Топилмади.';
  var h = heard(a.r[0]), yes = [], no = [];
  members().forEach(function (m) { (h[String(m[0])] ? yes : no).push(m[1] + (m[2] ? ' ' + m[2] : '')); });
  return '🎧 ' + a.r[1] + '\nМуддат: ' + fmt(a.r[5]) + '\n\n✅ Эшитганлар (' + yes.length + '):\n' + (yes.join('\n') || '—') +
    '\n\n❌ Эшитмаганлар (' + no.length + '):\n' + (no.join('\n') || '—');
}

var KUN = ['', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба', 'Якшанба'];
// Навбатдаги (ҳали юборилмаган) аудиолар — жадвалдаги қатор рақами билан
function navbatQator() {
  var d = sh('Навбат').getDataRange().getValues(), r = [];
  for (var i = 1; i < d.length; i++) if (d[i][2] && !d[i][4]) r.push({ row: i + 1, v: d[i] });
  return r;
}
function navbat() { return rows('Навбат').filter(function (r) { return r[2] && !r[4]; }); }
function kunlar() { return String(cfg('kunlar')).split(/[ ,]+/).filter(String).map(Number); }
function holat() {
  var q = navbat();
  return '⚙️ Автомат юбориш\nВақт: ' + cfg('vaqt') + '\nКунлар: ' + kunlar().map(function (k) { return KUN[k]; }).join(', ') +
    '\n🔤 Феъл тести: кунига ' + FEEL_SONI + ' та, кейингиси ' + ((Number(cfg('feel_k')) - 1) * FEEL_SONI + 1) + '-феълдан' +
    '\n📣 Натижа: ' + ({ e: 'фақат ҳивар', f: 'фақат кунлик феъл' }[cfg('nat_tur')] || 'ҳивар + кунлик феъл') +
    '\n\n📋 Навбатда: ' + q.length + ' та' + (q.length ? '\nКейингиси: ' + q[0][1] : '') +
    '\n\nЎзгартириш: /vaqt 08:00 · /kunlar 1,2,3,4,5,6 (1 — Душанба, 7 — Якшанба)';
}
function bugunKun() { var d = Number(Utilities.formatDate(now(), TZ, 'u')); return d; }
// Навбатдаги кейинги аудиони гуруҳга юбориш
function avtomat() {
  var g = cfg('group'); if (!g) return;
  var today = Utilities.formatDate(now(), TZ, 'yyyy-MM-dd');
  if (cfg('oxirgi') === today) return;
  if (kunlar().indexOf(bugunKun()) < 0) return;
  if (Utilities.formatDate(now(), TZ, 'HH:mm') < ('0' + cfg('vaqt')).slice(-5)) return;
  cfg('oxirgi', today);
  var s = sh('Навбат'), d = s.getDataRange().getValues();
  for (var i = 1; i < d.length; i++) {
    if (!d[i][2] || d[i][4]) continue;
    var id = Date.now().toString(36), title = d[i][1], kind = d[i][3] || 'audio';
    var M = { audio: 'sendAudio', voice: 'sendVoice', document: 'sendDocument', video: 'sendVideo' }[kind] || 'sendAudio';
    var p = { chat_id: g, caption: title };
    p[kind === 'document' ? 'document' : kind] = d[i][2];
    var r = tg(M, p);
    if (!r.ok) { s.getRange(i + 1, 5).setValue('хато: ' + (r.description || '')); continue; }
    joyla(id, title, g, r.result.message_id);
    s.getRange(i + 1, 5, 1, 2).setValues([['юборилди', fmt(now())]]);
    break;
  }
  try { feelKun(); } catch (e) { Logger.log(e); }
}

function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
// 21:00 da: muddati bugun tugaydigan audio bo'yicha hali eshitmaganlarga eslatma (ismi bosiladigan qilib)
function eslatma() {
  if (Utilities.formatDate(now(), TZ, 'HH:mm') < ESLATMA) return;
  var s = sh('Аудиолар'), d = s.getDataRange().getValues();
  for (var i = 1; i < d.length; i++) {
    if (d[i][6] || d[i][9] || now() > new Date(d[i][5])) continue;
    if (new Date(d[i][5]).getTime() - now().getTime() > 12 * 3600e3) continue;
    s.getRange(i + 1, 10).setValue('эслатилди');
    var h = heard(d[i][0]), no = members().filter(function (m) { return !h[String(m[0])]; });
    if (!no.length) continue;
    tg('sendMessage', { chat_id: d[i][2], parse_mode: 'HTML', reply_to_message_id: d[i][3],
      text: '⏰ «' + esc(d[i][1]) + '» — муддат тугашига оз қолди (24:00)!\n\nҲали белгиламаганлар (' + no.length + '):\n' +
        no.map(function (m) { return '• <a href="tg://user?id=' + m[0] + '">' + esc(m[1] || 'аъзо') + '</a>'; }).join('\n') +
        '\n\nЭшитиб, сўровномада белгилаб қўйинг 🤗' });
  }
}

// ---------- Феъл тести ----------
function feelKun() {
  var g = cfg('group'); if (!g) return { ok: false, err: 'гуруҳ уланмаган' };
  var V = rows('Феъллар'), k = Number(cfg('feel_k')) || 1, a = (k - 1) * FEEL_SONI;
  if (a >= V.length) return { ok: false, err: 'феъллар тугади. /fel_k 1 билан бошидан бошланг' };
  var day = V.slice(a, a + FEEL_SONI);
  var au = tg('sendAudio', { chat_id: g, audio: SAYT + 'd' + ('0' + k).slice(-2) + '.mp3?v=' + Date.now(), title: 'Феъллар ' + (a + 1) + '–' + (a + day.length), performer: 'نور الطالب',
    caption: '🔤 Феъллар ' + (a + 1) + '–' + (a + day.length) + ':\n' + day.map(function (v, j) { return (a + j + 1) + '. ' + v[1] + (v[2] ? ' – ' + v[2] : ''); }).join('\n') +
      '\n\nЭшитинг ва тестни ечинг 👇',
    reply_markup: { inline_keyboard: [[{ text: '▶️ Тестни очиш', url: ILOVA + '?startapp=fel_' + k }]] } });
  if (!au.ok) return { ok: false, err: (au.description || 'юборилмади') + ' (Феъллар ' + (a + 1) + '–' + (a + day.length) + ')' };
  cfg('feel_k', k + 1);
  // кун охирида «ким ишлади / ким ишламади» рўйхати учун эслаб қўйилади
  sh('Феъл кунлар', ['сана', 'кун (k)', 'message_id']).appendRow(["'" + Utilities.formatDate(now(), TZ, 'yyyy-MM-dd'), k, au.result.message_id]);
  return { ok: true, text: 'Феъллар ' + (a + 1) + '–' + (a + day.length) + ' гуруҳга юборилди.' };
}
// ---------- Ilova (Mini App) so'rovlari: Telegram imzosi tekshiriladi ----------
function hex(b) { return b.map(function (x) { return ('0' + (x & 255).toString(16)).slice(-2); }).join(''); }
function tekshirInit(init) {
  if (!init) return null;
  var P = {}, h = '';
  String(init).split('&').forEach(function (kv) {
    var i = kv.indexOf('='), k = kv.slice(0, i), v = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' '));
    if (k === 'hash') h = v; else P[k] = v;
  });
  var dcs = Object.keys(P).sort().map(function (k) { return k + '=' + P[k]; }).join('\n');
  var sec = Utilities.computeHmacSha256Signature(P_TOKEN(), 'WebAppData');
  var sig = hex(Utilities.computeHmacSha256Signature(Utilities.newBlob(dcs).getBytes(), sec));
  if (sig !== h) return null;
  if (Date.now() / 1000 - Number(P.auth_date || 0) > 7 * 86400) return null;
  try { return JSON.parse(P.user); } catch (e) { return null; }
}
function P_TOKEN() { return P('BOT_TOKEN'); }
function ilova(q) {
  var u = tekshirInit(q.init); if (!u) return { ok: false, err: 'auth' };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (q.b === 'bugun') {
      var R = feelNatija(Number(q.k) || 1, Utilities.formatDate(now(), TZ, 'yyyy-MM-dd'), rows('Феъл тест'), rows('Феъллар'));
      return { ok: true, jami: R.day.length, ha: R.ha.map(function (x) { return { n: x.n, ok: x.ok, men: String(x.id) === String(u.id) }; }),
        yoq: R.yoq.map(function (m) { return m[1] || 'аъзо'; }) };
    }
    if (q.b === 'get') {
      var m = rows('Хатолар').filter(function (r) { return String(r[0]) === String(u.id) && !r[3]; }).map(function (r) { return Number(r[1]); });
      return { ok: true, mist: m };
    }
    if (q.b === 'res') {
      member(u);
      var nm = [u.first_name, u.last_name].filter(String).join(' '), V = rows('Феъллар'), T = sh('Феъл тест'), X = sh('Хатолар'), xd = X.getDataRange().getValues();
      (q.res || []).forEach(function (r) {
        var v = V[r.n - 1] || []; T.appendRow(['app:' + q.k, String(u.id), nm, v[1] || r.n, r.ok ? '✅' : '❌', now()]);
        var found = -1;
        for (var i = 1; i < xd.length; i++) if (String(xd[i][0]) === String(u.id) && Number(xd[i][1]) === Number(r.n) && !xd[i][3]) found = i;
        if (!r.ok && found < 0) { X.appendRow([String(u.id), r.n, v[1] || '', '']); xd.push([String(u.id), r.n, '', '']); }
        if (r.ok && found > 0) { X.getRange(found + 1, 4).setValue('ўрганди'); xd[found][3] = 'ўрганди'; }
      });
      return { ok: true, streak: kunlar_ketma(u.id) };
    }
    return { ok: false };
  } finally { lock.releaseLock(); }
}
// Ketma-ket necha kun fe'l testida qatnashgan
function kunlar_ketma(uid) {
  var D = {};
  rows('Феъл тест').forEach(function (r) { if (String(r[1]) === String(uid) && r[5]) D[Utilities.formatDate(new Date(r[5]), TZ, 'yyyy-MM-dd')] = 1; });
  var n = 0, d = now();
  while (D[Utilities.formatDate(d, TZ, 'yyyy-MM-dd')]) { n++; d = new Date(d.getTime() - 864e5); }
  return n;
}
function mn(x) { return String(x).replace(/\s+/g, ' ').trim().slice(0, 100); }
// Сўровнома рақами: эски қаторларда жадвал уни сонга айлантириб яхлитлаган бўлиши мумкин
function birPoll(a, b) {
  if (String(a) === String(b)) return true;
  return typeof a === 'number' && /^\d+$/.test(String(b)) && a === Number(b);
}
function javob(q) {
  if (!q.user) return { ok: true };
  var A = rows('Аудиолар');
  for (var j = A.length - 1; j >= 0; j--) if (A[j][7] && birPoll(A[j][7], q.poll)) {
    member(q.user); belgila(A[j][0], q.user, (q.opt || [])[0] === 0); jadval(); return { ok: true };
  }
  var d = rows('Феъл саволлар'), p = null;
  for (var i = d.length - 1; i >= 0; i--) if (birPoll(d[i][0], q.poll)) { p = d[i]; break; }
  if (!p || !q.user) return { ok: true };
  member(q.user);
  var ok = (q.opt || [])[0] === Number(p[4]);
  sh('Феъл тест').appendRow([String(q.poll), String(q.user.id), [q.user.first_name, q.user.last_name].filter(String).join(' '), p[3], ok ? '✅' : '❌', now()]);
  return { ok: true };
}
function reyting() {
  var g = cfg('group'), today = Utilities.formatDate(now(), TZ, 'yyyy-MM-dd');
  if (!g || cfg('reyt') === today || bugunKun() !== REYTING.kun || Utilities.formatDate(now(), TZ, 'HH:mm') < REYTING.vaqt) return;
  cfg('reyt', today);
  var from = now().getTime() - 7 * 864e5, S = {};
  rows('Феъл тест').forEach(function (r) {
    if (new Date(r[5]).getTime() < from) return;
    var x = S[r[1]] = S[r[1]] || { id: r[1], n: r[2], ok: 0, all: 0 }; x.all++; if (r[4] === '✅') x.ok++;
  });
  var L = Object.keys(S).map(function (k) { return S[k]; }).sort(function (a, b) { return b.ok - a.ok || a.all - b.all; });
  if (!L.length) return;
  var md = ['🥇', '🥈', '🥉'];
  tg('sendMessage', { chat_id: g, text: '🏆 Ҳафта пешқадамлари (феъл тести)\n\n' + L.slice(0, 10).map(function (x, i) {
    var k = kunlar_ketma(x.id); return (md[i] || (i + 1) + '.') + ' ' + x.n + ' — ' + x.ok + ' / ' + x.all + (k > 1 ? ' 🔥' + k : ''); }).join('\n') + '\n\nБаракалла! Келаси ҳафтада ҳам давом этамиз 💪' });
}

// Ҳар 15 дақиқада: автомат юбориш ва муддати тугаган аудиолар бўйича қора рўйхат
// Бир кунлик феъл тести натижаси: ким ишлади (биринчи жавоблар бўйича), ким ишламади
function feelNatija(k, sana, T, V) {
  var a = (k - 1) * FEEL_SONI, day = V.slice(a, a + FEEL_SONI).map(function (v) { return String(v[1]); }), U = {};
  T.forEach(function (r) {
    if (String(r[0]) !== 'app:' + k || !r[5] || Utilities.formatDate(new Date(r[5]), TZ, 'yyyy-MM-dd') !== sana) return;
    var vb = String(r[3]); if (day.indexOf(vb) < 0) return;
    var u = U[r[1]] = U[r[1]] || { n: r[2], v: {} };
    if (!(vb in u.v)) u.v[vb] = r[4] === '✅';   // ҳар феълнинг биринчи жавоби ҳисобланади
  });
  var ha = Object.keys(U).map(function (id) { var u = U[id], ok = 0; for (var x in u.v) if (u.v[x]) ok++; return { id: id, n: u.n, ok: ok }; })
    .sort(function (x, y) { return y.ok - x.ok; });
  var yoq = members().filter(function (m) { return !U[String(m[0])]; });
  return { a: a, day: day, ha: ha, yoq: yoq };
}
// Сешанба ва Жума 08:00: охирги 10 та дарс + шу даврдаги феъл тестлари — ким нимани қолдирди (гуруҳга битта хабар)
function natijalar(majbur) {
  var g = cfg('group'); if (!g) return { ok: false, err: 'гуруҳ уланмаган' };
  var today = Utilities.formatDate(now(), TZ, 'yyyy-MM-dd');
  if (!majbur) {
    if (NATIJA.kunlar.indexOf(bugunKun()) < 0 || Utilities.formatDate(now(), TZ, 'HH:mm') < NATIJA.vaqt || cfg('nat') === today) return;
    cfg('nat', today);
  }
  // эски навбатдаги феъл кунларини варақга кўчириш (бир марта)
  try { var kut = JSON.parse(cfg('feel_kut') || '[]'); if (kut.length) { kut.forEach(function (p) { sh('Феъл кунлар', ['сана', 'кун (k)', 'message_id']).appendRow(["'" + p.d, p.k, p.m]); }); cfg('feel_kut', '[]'); } } catch (e) {}
  var ftxt = '', M = members(), t = now(), kun = function (x) { return Utilities.formatDate(new Date(x), TZ, 'dd.MM'); };
  // дарслар: охирги 10 таси (эшитди ёки эшитмади)
  var A = rows('Аудиолар').filter(function (r) { return r[0] && r[5]; }).slice(-NATIJA.soni);
  var H = {}; rows('Белгилар').forEach(function (r) { if (String(r[4]) !== '1') H[String(r[0]) + '|' + String(r[1])] = 1; });
  var txt = '🎧 Ҳивар натижалари — охирги ' + A.length + ' та дарс';
  if (A.length) {
    txt += '\n(' + A[0][1] + ' … ' + A[A.length - 1][1] + ' · ' + kun(A[0][5]) + '–' + kun(A[A.length - 1][5]) + ')';
    var hamma = [], qol = [];
    M.forEach(function (m) {
      var no = A.filter(function (r) { return !H[String(r[0]) + '|' + String(m[0])]; }).map(function (r) { return r[1]; });
      if (no.length) qol.push({ n: m[1] || 'аъзо', no: no }); else hamma.push(m[1] || 'аъзо');
    });
    qol.sort(function (a, b) { return b.no.length - a.no.length; });
    txt += '\n\n✅ Ҳаммасини эшитганлар (' + hamma.length + '):\n' + (hamma.join(', ') || '—');
    txt += '\n\n❌ Эшитмаганлар (' + qol.length + '):\n' + (qol.map(function (x) { return '• ' + x.n + ' — ' + x.no.length + ' та: ' + x.no.join(', '); }).join('\n') || '— Ҳамма ҳаммасини эшитди! 🎉');
  } else txt += '\n\nҲали якунланган дарс йўқ.';
  // феъл тести: шу даврда юборилган кунлар (охирги 10 та)
  var bosh = A.length ? Utilities.formatDate(new Date(new Date(A[0][5]).getTime() - 864e5), TZ, 'yyyy-MM-dd') : '';
  var F = rows('Феъл кунлар').map(function (r) { return { d: String(r[0]).replace(/^'/, ''), k: Number(r[1]) }; })
    .filter(function (f) { return f.d <= today && (!bosh || f.d >= bosh); }).slice(-NATIJA.soni);
  if (F.length) {
    var T = rows('Феъл тест'), D = {};
    T.forEach(function (r) { if (r[5]) D[String(r[1]) + '|' + String(r[0]) + '|' + Utilities.formatDate(new Date(r[5]), TZ, 'yyyy-MM-dd')] = 1; });
    var fh = [], fq = [];
    M.forEach(function (m) {
      var no = F.filter(function (f) { return !D[String(m[0]) + '|app:' + f.k + '|' + f.d]; })
        .map(function (f) { return ((f.k - 1) * FEEL_SONI + 1) + '–' + (f.k * FEEL_SONI) + ' (' + f.d.slice(8, 10) + '.' + f.d.slice(5, 7) + ')'; });
      if (no.length) fq.push({ n: m[1] || 'аъзо', no: no }); else fh.push(m[1] || 'аъзо');
    });
    fq.sort(function (a, b) { return b.no.length - a.no.length; });
    ftxt = '🔤 Кунлик феъл натижалари — охирги ' + F.length + ' кун';
    ftxt += '\n\n✅ Ҳар куни ишлаганлар (' + fh.length + '):\n' + (fh.join(', ') || '—');
    ftxt += '\n\n❌ Ишламаганлар (' + fq.length + '):\n' + (fq.map(function (x) { return '• ' + x.n + ' — ' + x.no.length + ' кун: ' + x.no.join(', '); }).join('\n') || '— Ҳамма ишлади! 🎉');
  }
  // ёзувлар ва феъл тести — алоҳида хабарлар (ҳар бири 4096 белгидан ошмасин)
  var yubor = function (x) {
    var rest = x;
    while (rest.length > 3900) { var cut = rest.lastIndexOf('\n', 3900); if (cut < 1000) cut = 3900; tg('sendMessage', { chat_id: g, text: rest.slice(0, cut) }); rest = rest.slice(cut + 1); }
    tg('sendMessage', { chat_id: g, text: rest });
  };
  var tur = cfg('nat_tur');   // 'e' — фақат ёзувлар, 'f' — фақат феъл, бошқаси — иккаласи
  if (tur !== 'f') yubor(txt);
  if (tur !== 'e' && F.length) yubor(ftxt);
  return { ok: true, text: 'Натижа гуруҳга юборилди (' + A.length + ' дарс, ' + F.length + ' феъл куни).' };
}
// Ёзувни (масалан, синов учун юборилганини) жадвалдан ўчириш: Аудиолар қатори ва унга берилган белгилар
function ochir(id) {
  if (!id) return { ok: false, err: 'id йўқ' };
  var s = sh('Аудиолар'), d = s.getDataRange().getValues(), nom = '';
  for (var i = d.length - 1; i >= 1; i--) if (String(d[i][0]) === String(id)) { nom = d[i][1]; s.deleteRow(i + 1); }
  if (!nom) return { ok: false, err: 'ҳивар топилмади' };
  var b = sh('Белгилар'), bd = b.getDataRange().getValues(), n = 0;
  for (var j = bd.length - 1; j >= 1; j--) if (String(bd[j][0]) === String(id)) { b.deleteRow(j + 1); n++; }
  jadval();
  return { ok: true, text: '🗑 «' + nom + '» ўчирилди (' + n + ' та белги билан). Гуруҳдаги хабарнинг ўзи қолади.' };
}
function tekshir() {
  try { avtomat(); } catch (e) { Logger.log(e); }
  try { natijalar(); } catch (e) { Logger.log(e); }
  try { reyting(); } catch (e) { Logger.log(e); }
  try { eslatma(); } catch (e) { Logger.log(e); }
  var s = sh('Аудиолар'), d = s.getDataRange().getValues(), g = cfg('group');
  for (var i = 1; i < d.length; i++) {
    if (d[i][6] || now() < new Date(d[i][5])) continue;
    var h = heard(d[i][0]), no = members().filter(function (m) { return !h[String(m[0])]; });
    no.forEach(function (m) { sh('Қора рўйхат').appendRow([d[i][1], String(m[0]), m[1], fmt(now())]); });
    s.getRange(i + 1, 7).setValue('якунланди');
    if (g) {
      if (d[i][8]) tg('stopPoll', { chat_id: d[i][2], message_id: d[i][8] });
      else tg('editMessageReplyMarkup', { chat_id: d[i][2], message_id: d[i][3], reply_markup: { inline_keyboard: [[{ text: '⏰ Муддат тугади', callback_data: 'x' }]] } });
      // ҳар бир дарс учун алоҳида хабар юборилмайди — натижа Сешанба ва Жума жамланиб чиқади
    }
  }
  jadval();
}

// «Жадвал» вароғи: қаторлар — аъзолар, устунлар — аудиолар
function jadval() {
  var A = rows('Аудиолар'), M = members(), B = rows('Белгилар'), s = sh('Жадвал');
  var hit = {}; B.forEach(function (r) { hit[r[0] + '|' + r[1]] = String(r[4]) === '1' ? '⏰' : '✅'; });
  var head = ['Исм', 'username'].concat(A.map(function (a) { return a[1]; })).concat(['Эшитмаган']);
  var out = [head];
  M.forEach(function (m) {
    var miss = 0, row = [m[1], m[2]];
    A.forEach(function (a) {
      var v = hit[a[0] + '|' + m[0]];
      if (!v) v = a[6] ? '❌' : '…';
      if (v === '❌' || v === '⏰') miss++;
      row.push(v);
    });
    row.push(miss); out.push(row);
  });
  s.clear(); s.getRange(1, 1, out.length, head.length).setValues(out);
  s.setFrozenRows(1); s.setFrozenColumns(1); s.getRange(1, 1, 1, head.length).setFontWeight('bold');
  if (out.length > 1 && head.length > 3) s.getRange(2, 3, out.length - 1, head.length - 3).setHorizontalAlignment('center');
}

// ---------- Ўзини ўзи янгилаш: GitHub'даги энг янги кодни олиб, янги версияни Deploy қилади ----------
// Бир марта созланади: script.google.com/home/usersettings → Google Apps Script API = On,
// appsscript.json да oauthScopes (script.projects, script.deployments) бўлиши керак.
var DEPLOY_ID = 'AKfycbwfQAUAC3jHlqE5KHAeaqGekAkedI1UP7qECuJpzHF5lwl4fmBn_xEpj5nt8SfKiOBX';   // бот уланган веб-илова
var GH = 'https://api.github.com/repos/abduhakim9999/arab-tili/contents/src/bot/';
// GitHub API'нинг чеклови (Google серверлари умумий) — бўлмаса raw ва jsDelivr орқали олинади
function ghFayl(n) {
  var U = [[GH + n + '?ref=main&t=' + Date.now(), { Accept: 'application/vnd.github.raw' }],
    ['https://raw.githubusercontent.com/abduhakim9999/arab-tili/main/src/bot/' + n + '?t=' + Date.now(), {}],
    ['https://cdn.jsdelivr.net/gh/abduhakim9999/arab-tili@main/src/bot/' + n, {}]];
  for (var i = 0; i < U.length; i++) {
    try { var r = UrlFetchApp.fetch(U[i][0], { headers: U[i][1], muteHttpExceptions: true }); if (r.getResponseCode() === 200) return r.getContentText(); } catch (e) {}
  }
  return null;
}
function gapi(method, path, body) {
  var o = { method: method, headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true, contentType: 'application/json' };
  if (body) o.payload = JSON.stringify(body);
  var r = UrlFetchApp.fetch('https://script.googleapis.com/v1/projects/' + ScriptApp.getScriptId() + path, o), t = r.getContentText();
  var j = {}; try { j = JSON.parse(t || '{}'); } catch (e) {}
  if (r.getResponseCode() >= 300) throw new Error((j.error && j.error.message) || ('HTTP ' + r.getResponseCode()));
  return j;
}
function yangila() {
  try {
    var kod = ghFayl('eshitish.gs');
    if (!kod || kod.indexOf('function doPost') < 0 || kod.indexOf('function yangila') < 0) return { ok: false, err: 'GitHub\'дан код олинмади ёки у тўлиқ эмас' };
    var man = ghFayl('appsscript.json');
    var c = gapi('get', '/content'), files = c.files || [], topdi = false;
    files.forEach(function (f) {
      if (!topdi && f.type === 'SERVER_JS' && f.source.indexOf('function yangila') >= 0) { f.source = kod; topdi = true; }
      else if (f.type === 'JSON' && f.name === 'appsscript' && man) f.source = man;
    });
    if (!topdi) return { ok: false, err: 'скрипт ичида асосий файл топилмади' };
    gapi('put', '/content', { files: files });
    var sana = Utilities.formatDate(now(), TZ, 'dd.MM.yyyy HH:mm');
    var v = gapi('post', '/versions', { description: 'yangila ' + sana });
    var url = '', m; try { url = ScriptApp.getService().getUrl() || ''; } catch (e) {}
    m = /\/s\/([^/]+)\/(exec|dev)/.exec(url);
    var id = m && m[2] === 'exec' ? m[1] : DEPLOY_ID;
    if (!id) return { ok: false, err: 'Deploy топилмади (версия ' + v.versionNumber + ' яратилди, Deploy қўлда қилинг)' };
    gapi('put', '/deployments/' + id, { deploymentConfig: { scriptId: ScriptApp.getScriptId(), versionNumber: v.versionNumber, manifestFileName: 'appsscript', description: 'yangila ' + sana } });
    var sat = (kod.match(/\n/g) || []).length;
    return { ok: true, text: '✅ Скрипт янгиланди: версия ' + v.versionNumber + ' (' + sana + ', ' + sat + ' қатор).' };
  } catch (e) {
    var t = String(e.message || e);
    if (/has not been used|disabled|SERVICE_DISABLED/i.test(t)) t += '\n\n👉 script.google.com/home/usersettings да «Google Apps Script API» ни On қилинг.';
    if (/insufficient|scope|PERMISSION_DENIED/i.test(t)) t += '\n\n👉 appsscript.json да рухсатлар (oauthScopes) етишмаяпти ёки рухсат берилмаган.';
    return { ok: false, err: t };
  }
}
// Созлашдан кейин бир марта муҳаррирда ишга туширинг: рухсат сўрайди ва Apps Script API ишлаётганини текширади
function ruxsat() {
  var c = gapi('get', '/content');
  Logger.log('✅ Apps Script API ишлаяпти, файллар: ' + (c.files || []).map(function (f) { return f.name; }).join(', '));
}
