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
var FEEL_SONI = 5;           // кунига нечта феъл
var REYTING = { kun: 7, vaqt: '20:00' };   // ҳафталик рейтинг: Якшанба 20:00

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
  for (var i = 1; i < d.length; i++) if (d[i][0] === k) { if (v === undefined) return d[i][1]; s.getRange(i + 1, 2).setValue(v); return v; }
  if (v === undefined) return '';
  s.appendRow([k, v]); return v;
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
  if (q.k !== key()) return J({ ok: false, err: 'key' });
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (q.a === 'group') { cfg('group', String(q.chat)); out = { ok: true }; }
    else if (q.a === 'cfg') out = { ok: true, group: cfg('group') };
    else if (q.a === 'member') { (q.users || []).forEach(member); out = { ok: true }; }
    else if (q.a === 'post') { var dl = joyla(q.id, q.title, q.chat, q.msg); out = { ok: true, deadline: fmt(dl) }; }
    else if (q.a === 'mark') out = mark(q);
    else if (q.a === 'mode') { if (q.v !== undefined) cfg('mode', q.v); out = { ok: true, mode: cfg('mode') }; }
    else if (q.a === 'queue') {
      var nq = sh('Навбат'), n = nq.getLastRow();
      nq.appendRow([n, q.title, q.file_id, q.kind, '', '']);
      out = { ok: true, n: navbat().length };
    }
    else if (q.a === 'set') {
      if (q.vaqt) { if (!/^\d{1,2}:\d{2}$/.test(q.vaqt)) return J({ ok: false, err: 'вақт нотўғри (масалан 08:00)' }); cfg('vaqt', q.vaqt); }
      if (q.kunlar) cfg('kunlar', q.kunlar);
      out = { ok: true, text: holat() };
    }
    else if (q.a === 'holat') out = { ok: true, text: holat() };
    else if (q.a === 'ans') out = javob(q);
    else if (q.a === 'feel') { feelKun(); out = { ok: true }; }
    else if (q.a === 'rep') out = { ok: true, text: hisobot(q.id) };
    else out = { ok: false, err: 'a' };
  } finally { lock.releaseLock(); }
  return J(out);
}
function J(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// So'rovnoma (hozirgi guruh uslubida): muddat — shu kuni 24:00 gacha
var OPT = ['Алҳамдулиллаҳ ўз вақтида эътибор билан тинглаб эшитдим! 🤗', '⏳ Ҳали эшитмадим'];
function kunOxiri() { return new Date(Utilities.formatDate(now(), TZ, "yyyy-MM-dd'T'23:59:59") + '+05:00'); }
function joyla(id, title, chat, msg) {
  var p = tg('sendPoll', { chat_id: chat, question: '«' + title + '»ни ким ўз вақтида эътибор билан тинглаб эшитди? — 24:00гача!!!',
    options: OPT.map(function (t) { return { text: t }; }), is_anonymous: false, reply_to_message_id: msg });
  var dl = kunOxiri();
  sh('Аудиолар').appendRow([id, title, String(chat), msg, fmt(now()), dl.toISOString(), '', p.ok ? p.result.poll.id : '', p.ok ? p.result.message_id : '']);
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
function hisobot(id) {
  var A = rows('Аудиолар'); if (!A.length) return 'Ҳали аудио юборилмаган.';
  var a = id ? audio(id) : { r: A[A.length - 1] }; if (!a) return 'Топилмади.';
  var h = heard(a.r[0]), yes = [], no = [];
  members().forEach(function (m) { (h[String(m[0])] ? yes : no).push(m[1] + (m[2] ? ' ' + m[2] : '')); });
  return '🎧 ' + a.r[1] + '\nМуддат: ' + fmt(a.r[5]) + '\n\n✅ Эшитганлар (' + yes.length + '):\n' + (yes.join('\n') || '—') +
    '\n\n❌ Эшитмаганлар (' + no.length + '):\n' + (no.join('\n') || '—');
}

var KUN = ['', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба', 'Якшанба'];
function navbat() { return rows('Навбат').filter(function (r) { return r[2] && !r[4]; }); }
function kunlar() { return String(cfg('kunlar')).split(/[ ,]+/).filter(String).map(Number); }
function holat() {
  var q = navbat();
  return '⚙️ Автомат юбориш\nВақт: ' + cfg('vaqt') + '\nКунлар: ' + kunlar().map(function (k) { return KUN[k]; }).join(', ') +
    '\n🔤 Феъл тести: кунига ' + FEEL_SONI + ' та, кейингиси ' + ((Number(cfg('feel_k')) - 1) * FEEL_SONI + 1) + '-феълдан' +
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

// ---------- Феъл тести ----------
function feelKun() {
  var g = cfg('group'); if (!g) return;
  var V = rows('Феъллар'), k = Number(cfg('feel_k')) || 1, a = (k - 1) * FEEL_SONI;
  if (a >= V.length) return;
  var day = V.slice(a, a + FEEL_SONI);
  var Q = sh('Феъл саволлар');
  day.forEach(function (v, j) {
    var right = mn(v[3]), opts = [right], seed = Number(v[0]) * 7919;
    for (var t = 1; opts.length < 4 && t < 400; t++) {
      var o = V[(seed + t * 37) % V.length], m = mn(o[3]);
      if (o[0] !== v[0] && opts.indexOf(m) < 0) opts.push(m);
    }
    var pos = (seed + j) % 4; opts.splice(0, 1); opts.splice(pos, 0, right);
    var au = tg('sendAudio', { chat_id: g, audio: SAYT + 'v' + ('00' + v[0]).slice(-3) + '.mp3', title: v[1] + ' – ' + v[2], performer: 'Феъл ' + v[0],
      caption: '🔤 ' + (j + 1) + '/' + day.length + ' · ' + v[1] + ' – ' + v[2] });
    var r = tg('sendPoll', { chat_id: g, reply_to_message_id: au.ok ? au.result.message_id : undefined, question: v[1] + ' – ' + v[2] + '\nМаъноси қайси?', options: opts.map(function (x) { return { text: x }; }),
      type: 'quiz', correct_option_id: pos, is_anonymous: false, explanation: v[1] + ' – ' + v[2] + ' — ' + right });
    if (r.ok) Q.appendRow([r.result.poll.id, k, v[0], v[1], pos, fmt(now())]);
  });
  cfg('feel_k', k + 1);
}
function mn(x) { return String(x).replace(/\s+/g, ' ').trim().slice(0, 100); }
function javob(q) {
  if (!q.user) return { ok: true };
  var A = rows('Аудиолар');
  for (var j = A.length - 1; j >= 0; j--) if (A[j][7] && String(A[j][7]) === String(q.poll)) {
    member(q.user); belgila(A[j][0], q.user, (q.opt || [])[0] === 0); jadval(); return { ok: true };
  }
  var d = rows('Феъл саволлар'), p = null;
  for (var i = d.length - 1; i >= 0; i--) if (String(d[i][0]) === String(q.poll)) { p = d[i]; break; }
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
    var x = S[r[1]] = S[r[1]] || { n: r[2], ok: 0, all: 0 }; x.all++; if (r[4] === '✅') x.ok++;
  });
  var L = Object.keys(S).map(function (k) { return S[k]; }).sort(function (a, b) { return b.ok - a.ok || a.all - b.all; });
  if (!L.length) return;
  var md = ['🥇', '🥈', '🥉'];
  tg('sendMessage', { chat_id: g, text: '🏆 Ҳафта пешқадамлари (феъл тести)\n\n' + L.slice(0, 10).map(function (x, i) {
    return (md[i] || (i + 1) + '.') + ' ' + x.n + ' — ' + x.ok + ' / ' + x.all; }).join('\n') + '\n\nБаракалла! Келаси ҳафтада ҳам давом этамиз 💪' });
}

// Ҳар 15 дақиқада: автомат юбориш ва муддати тугаган аудиолар бўйича қора рўйхат
function tekshir() {
  try { avtomat(); } catch (e) { Logger.log(e); }
  try { reyting(); } catch (e) { Logger.log(e); }
  var s = sh('Аудиолар'), d = s.getDataRange().getValues(), g = cfg('group');
  for (var i = 1; i < d.length; i++) {
    if (d[i][6] || now() < new Date(d[i][5])) continue;
    var h = heard(d[i][0]), no = members().filter(function (m) { return !h[String(m[0])]; });
    no.forEach(function (m) { sh('Қора рўйхат').appendRow([d[i][1], String(m[0]), m[1], fmt(now())]); });
    s.getRange(i + 1, 7).setValue('якунланди');
    if (g) {
      if (d[i][8]) tg('stopPoll', { chat_id: d[i][2], message_id: d[i][8] });
      else tg('editMessageReplyMarkup', { chat_id: d[i][2], message_id: d[i][3], reply_markup: { inline_keyboard: [[{ text: '⏰ Муддат тугади', callback_data: 'x' }]] } });
      tg('sendMessage', { chat_id: g, text: '⏰ «' + d[i][1] + '» — муддат тугади.\n\n❌ Эшитмаганлар (' + no.length + '):\n' +
        (no.map(function (m) { return '• ' + m[1]; }).join('\n') || '— Ҳамма эшитди! 🎉') });
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
