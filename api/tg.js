// Telegram bot (Vercel). Env: BOT_TOKEN, ADMIN_ID
// O'rnatish: https://<loyiha>.vercel.app/api/tg?setup=1 ni bir marta oching.
const crypto = require('crypto');
const T = process.env.BOT_TOKEN, A = String(process.env.ADMIN_ID || '').trim();
const STAT = 'https://script.google.com/macros/s/AKfycbxksQz-jII6bVIWKgl63gfASBRDr4SGsScYJg0jogaulyzOoVluyGtf6pU1TIZV-ntRcA/exec';
const KEY = crypto.createHash('sha256').update('stat:' + T).digest('hex').slice(0, 32);
// Эшитиш жадвали (Apps Script веб-илова URL)
const ESH = process.env.ESH_URL || 'https://script.google.com/macros/s/AKfycbwfQAUAC3jHlqE5KHAeaqGekAkedI1UP7qECuJpzHF5lwl4fmBn_xEpj5nt8SfKiOBX/exec';
const KEY2 = crypto.createHash('sha256').update('eshit:' + T).digest('hex').slice(0, 32);
const SECRET = crypto.createHash('sha256').update(String(T)).digest('hex').slice(0, 40);

async function tg(m, p) {
  const r = await fetch('https://api.telegram.org/bot' + T + '/' + m, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
  });
  return r.json();
}

async function stat() {
  try {
    const r = await fetch(STAT + '?k=' + KEY), raw = await r.text();
    let d; try { d = JSON.parse(raw); } catch (e) {
      const msg = raw.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
      return 'Статистика олинмади (' + r.status + '): ' + msg;
    }
    if (!d.ok) return 'Статистика олинмади.';
    const L = a => a.length ? a.slice(0, 40).map((x, i) => (i + 1) + '. ' + x).join('\n') + (a.length > 40 ? '\n…' : '') : '—';
    return '📊 Статистика\n\nЖами кирганлар: ' + d.total + '\nБугун: ' + d.today.length + '\nҲозир: ' + d.now.length +
      '\n\n🟢 Ҳозир ишлаётганлар:\n' + L(d.now) + '\n\n📅 Бугун кирганлар:\n' + L(d.today);
  } catch (e) { return 'Статистика олинмади: ' + e.message; }
}

async function esh(a, p) {
  if (!ESH) return { ok: false, err: 'ESH_URL йўқ' };
  try {
    const r = await fetch(ESH, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ k: KEY2, a, ...p }), redirect: 'follow' });
    return JSON.parse(await r.text());
  } catch (e) { return { ok: false, err: e.message }; }
}
const seen = new Set();
let grp = null;
async function loadGrp(force) {
  if (force || !grp || Date.now() - grp.t > 600e3) { const cf = await esh('cfg', {}); grp = { id: String(cf.group || ''), ctrl: String(cf.ctrl || ''), t: Date.now() }; }
  return grp;
}
async function seenUser(u) {
  if (!u || u.is_bot || seen.has(u.id)) return;
  seen.add(u.id); await esh('member', { users: [u] });
}

// Гуруҳдаги хабарлар
async function group(m) {
  const c = String(m.chat.id), t = (m.text || '').trim().split('@')[0];
  if (t === '/ulash' && A && String(m.from && m.from.id) === A) {
    const r = await esh('group', { chat: c });
    grp = null;
    await tg('deleteMessage', { chat_id: c, message_id: m.message_id });
    if (!r.ok) return tg('sendMessage', { chat_id: A, text: '❌ Гуруҳ уланмади: ' + (r.err || '') });
    await tg('sendMessage', { chat_id: c, text: '👋 Ассалому алайкум! Бу гуруҳда аудио дарслар юборилади.\nЭшитганингизни белгилаш учун аввал рўйхатдан ўтинг — тугмани босинг:',
      reply_markup: { inline_keyboard: [[{ text: '👋 Мен шу гуруҳдаман', callback_data: 'r' }]] } });
    return tg('sendMessage', { chat_id: A, text: '✅ Гуруҳ уланди. Энди менга аудио юборинг (изоҳига номини ёзинг, масалан «1-дарс») — гуруҳга «✅ Эшитдим» тугмаси билан жойлайман.' });
  }
  // faqat ulangan guruhdagilar a'zo hisoblanadi (bot turgan boshqa guruhlar emas)
  await loadGrp();
  if (c !== grp.id) return;
  for (const u of (m.new_chat_members || [])) await seenUser(u);
  await seenUser(m.from);
}


// ===== Бошқарув панели (тугмалар) =====
const KUNN = ['', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба', 'Якшанба'];
const FEEL_KUN = 40, FEEL_N = 5;
const CMDS = [
  ['panel', '🎛 Бошқарув панели (тугмалар)'], ['holat', 'Созламалар ва навбат'], ['hisobot', 'Ким эшитди, ким эшитмади'],
  ['fel', 'Феъл тестини ҳозир юбориш'], ['fel_k', 'Феъл тести қайси кундан (масалан: /fel_k 1)'],
  ['navbat', 'Аудиоларни навбатга йиғиш'], ['tamom', 'Навбат режимини ўчириш'],
  ['vaqt', 'Юбориш вақти (масалан: /vaqt 08:00)'], ['kunlar', 'Юбориш кунлари (масалан: /kunlar 1,2,3)'],
  ['natija', 'Натижани ҳозир гуруҳга юбориш'], ['stat', 'Сайт статистикаси'], ['help', 'Ёрдам']
].map(([command, description]) => ({ command, description }));
let menuSet = false;
async function setMenu() {
  if (menuSet || !A) return; menuSet = true;
  await tg('setMyCommands', { commands: [], scope: { type: 'default' } });
  await tg('setMyCommands', { commands: CMDS, scope: { type: 'chat', chat_id: Number(A) } });
  const g = await loadGrp();
  if (g.ctrl) await tg('setMyCommands', { commands: CMDS, scope: { type: 'chat_member', chat_id: Number(g.ctrl), user_id: Number(A) } });
}
function parseH(tx, md) {
  tx = tx || '';
  const g = re => ((tx.match(re) || [])[1] || '').trim();
  const vq = (g(/Вақт: ([^\n]*)/).match(/(\d{1,2}:\d{2})/) || [])[1] || '';
  const kn = g(/Кунлар: ([^\n]*)/).split(/,\s*/).map(x => KUNN.indexOf(x)).filter(x => x > 0);
  const n1 = Number(g(/кейингиси (\d+)-феълдан/)) || 1, nt = g(/📣 Натижа: ([^\n]*)/), nb = Number(g(/Навбатда: (\d+)/)) || 0;
  return { text: tx.replace(/\n*Ўзгартириш:[^\n]*/, '').replace(/Вақт: [^\n]*/, 'Вақт: ' + (vq || '—')), vaqt: vq, kunlar: kn, k: Math.floor((n1 - 1) / FEEL_N) + 1, navbat: md === 'navbat', nb, nat: (nt === 'фақат кунлик ҳивар' || nt === 'фақат ҳивар' || nt === 'фақат ёзувлар') ? 'e' : (nt === 'фақат кунлик феъл' || nt === 'фақат феъл') ? 'f' : 'ef' };
}
async function holatSt() {
  const [h, md] = await Promise.all([esh('holat', {}), esh('mode', {})]);
  return { ok: !!h.ok, err: h.err, ...parseH(h.text, md.mode) };
}
const NATN = { ef: '🎧 Кунлик ҳивар + 🔤 Кунлик феъл', e: 'фақат 🎧 Кунлик ҳивар', f: 'фақат 🔤 Кунлик феъл' }, NATK = { ef: 'e', e: 'f', f: 'ef' };   // навбат билан алмашади
const B = (text, d) => ({ text, callback_data: 'p:' + d });
const ORQA = [[B('◀️ Орқага', 'h')]], OH = [[B('◀️ Орқага', 'G:h')]], ON = [[B('◀️ Орқага', 'G:n')]], OF = [[B('◀️ Орқага', 'G:f')]], OS = [[B('◀️ Орқага', 'G:s')]];
function mainView(s, note, sec) {
  if (!s.ok) return { text: '❌ Ҳолат олинмади: ' + (s.err || ''), kb: [[B('🔄 Қайта уриниш', 'h')]] };
  const a = (s.k - 1) * FEEL_N + 1, pre = note ? note + '\n\n' : '';
  // бўлимлар: n — натижалар, f — кунлик феъл, s — созлама
  if (sec === 'n') return { text: pre + '📋 Натижалар\n\n📣 Натижа тури: ' + NATN[s.nat] + '\n(Автомат: ҳар Сешанба ва Жума 08:00)', kb: [
    [B('📋 Ҳисобот', 'r')], [B('📣 Натижани ҳозир юбориш', 'z')], [B('📣 Натижа тури: ' + NATN[s.nat], 'P:' + NATK[s.nat])], ...ORQA] };
  if (sec === 'f') return { text: pre + '🔤 Кунлик феъл\n\nКейинги сафар: ' + s.k + '-кун (феъллар ' + a + '–' + (a + FEEL_N - 1) + ')', kb: [
    [B('🔤 Феълни ҳозир юбориш', 'f')], [B('🔢 Феъл куни: ' + s.k + ' (' + a + '–' + (a + FEEL_N - 1) + ')', 'k:' + s.k)], [B('🧹 Натижаларни тозалаш', 'C')], ...ORQA] };
  if (sec === 'h') return { text: pre + '🎧 Кунлик ҳивар\n\n📋 Навбатда: ' + (s.nb || 0) + ' та\n📥 Навбат: ' + (s.navbat ? 'ёқиқ — ботга юборган аудиоларингиз навбатга тушади' : 'ўчиқ — ботга юборган аудио дарҳол гуруҳга кетади'), kb: [
    [B('▶️ Кейингисини ҳозир юбориш', 'H')],
    [B('📋 Навбат рўйхати (' + (s.nb || 0) + ')', 'L:0'), B('📥 Навбат: ' + (s.navbat ? 'ёқиқ ✅' : 'ўчиқ'), 'n:' + (s.navbat ? 1 : 0))],
    [B('🗑 Ҳиварни ўчириш', 'X')],
    [B('🧹 Натижаларни тозалаш', 'J')], ...ORQA] };
  if (sec === 's') return { text: pre + '⚙️ Созлама\n\n' + s.text, kb: [
    [B('⏰ Вақт: ' + (s.vaqt || '—'), 't:' + s.vaqt), B('📅 Кунлар', 'd:' + s.kunlar.join(''))],
    [B('📈 Статистика', 's')], ...ORQA] };
  return { text: pre + '🎛 Бошқарув панели\n\n' + s.text, kb: [
    [B('📋 Натижалар', 'G:n')],
    [B('🎧 Кунлик ҳивар', 'G:h')],
    [B('🔤 Кунлик феъл', 'G:f')],
    [B('⚙️ Созлама', 'G:s')],
    [B('🔄 Янгилаш', 'h')]
  ] };
}
async function panelView() { return mainView(await holatSt()); }
function kunView(k, note) {
  const a = (k - 1) * FEEL_N + 1;
  return { text: (note ? note + '\n\n' : '') + '🔢 Феъл тести кейинги сафар ' + k + '-кундан чиқади (феъллар ' + a + '–' + (a + FEEL_N - 1) + ').\n\nТанланг:', kb: [
    [B('⏪ −5', 'K:' + (k - 5)), B('◀️ −1', 'K:' + (k - 1)), B(String(k), 'k:' + k), B('+1 ▶️', 'K:' + (k + 1)), B('+5 ⏩', 'K:' + (k + 5))],
    [B('1-кун (бошидан)', 'K:1')], ...OF] };
}
function vaqtView(vq, note) {
  const rows = [];
  for (let h = 5; h <= 22; h += 3) rows.push([0, 1, 2].map(i => { const t = String(h + i).padStart(2, '0') + ':00'; return B((t === vq ? '✅ ' : '') + t, 'T:' + t); }));
  return { text: (note ? note + '\n\n' : '') + '⏰ Автомат юбориш вақти: ' + (vq || '—') + '\n\nБошқа дақиқа керак бўлса, ёзинг: /vaqt 08:30', kb: [...rows, ...OS] };
}
function kunlarView(kn, note) {
  const btn = i => B((kn.includes(i) ? '✅ ' : '▫️ ') + KUNN[i], 'D:' + i + ':' + kn.join(''));
  return { text: (note ? note + '\n\n' : '') + '📅 Юбориш кунлари — босиб белгиланг ёки олиб ташланг:', kb: [[btn(1), btn(2)], [btn(3), btn(4)], [btn(5), btn(6)], [btn(7)], ...OS] };
}
// Ҳисобот: v — 'e' ёзувлар / 'o' одамлар, d — '7' | 'm' | 'all', p — саҳифа
async function hisView(v, d, p) {
  const r = await esh('rep2', { v, d, p });
  if (!r.ok) {
    // эски скриптда rep2 йўқ — оддий ҳисобот
    const o = await esh('rep', { id: '' });
    return { text: (o.text || ('Ҳисобот олинмади: ' + (r.err || ''))) + '\n\n(Тўлиқ ҳисобот учун Apps Script кодини янгиланг)', kb: ON };
  }
  // юқорида: ҳивар ёки кунлик феъл (алоҳида); иккинчи қатор: шу бўлим ичида қандай кўриш
  const fl = v === 'fe' || v === 'fo', tk = (lbl, on) => (on ? '✅ ' : '') + lbl, pg = r.page || 0, kb = [
    [B(tk('🎧 Кунлик ҳивар', !fl), 'R:e:' + d + ':0'), B(tk('🔤 Кунлик феъл', fl), 'R:fe:' + d + ':0')],
    fl ? [B(tk('📅 Кунлар бўйича', v === 'fe'), 'R:fe:' + d + ':0'), B(tk('👤 Одамлар бўйича', v === 'fo'), 'R:fo:' + d + ':0')]
       : [B(tk('🎧 Дарслар бўйича', v === 'e'), 'R:e:' + d + ':0'), B(tk('👤 Одамлар бўйича', v === 'o'), 'R:o:' + d + ':0')],
    [B(tk('7 кун', d === '7'), 'R:' + v + ':7:0'), B(tk('Шу ой', d === 'm'), 'R:' + v + ':m:0'), B(tk('Ҳаммаси', d === 'all'), 'R:' + v + ':all:0')]];
  if ((r.pages || 1) > 1) kb.push([B('◀️', 'R:' + v + ':' + d + ':' + Math.max(0, pg - 1)), B((pg + 1) + '/' + r.pages, 'R:' + v + ':' + d + ':' + pg), B('▶️', 'R:' + v + ':' + d + ':' + Math.min(r.pages - 1, pg + 1))]);
  if (!fl) kb.push([B('🗑 Ҳиварни ўчириш', 'X')]);
  kb.push(...ON);
  return { text: r.text, kb };
}
async function panelCb(q) {
  const d = q.data.slice(2), c = q.message.chat.id, mid = q.message.message_id, arg = d.split(':');
  // тугма босилгани дарҳол билинсин
  await tg('answerCallbackQuery', { callback_query_id: q.id, text: '⏳' });
  let v = null;
  if (d === '_') return;
  if (d === 'h') v = await panelView();
  else if (arg[0] === 'G') v = mainView(await holatSt(), '', arg[1]);
  else if (d === 'r') v = await hisView('e', '7', 0);
  else if (d === 'X' || arg[0] === 'S') {
    // бир нечтасини белгилаб ўчириш: белгиланганлар рўйхатдаги ўрни бўйича (bitmask) сақланади
    const r = await esh('alist', {}), L = (r.ok && r.list) || [];
    if (!L.length) v = { text: r.ok ? 'Ҳиварлар йўқ.' : '❌ ' + (r.err || 'скриптни янгиланг'), kb: OH };
    else {
      const mask = arg[0] === 'S' ? (Number(arg[1]) || 0) : 0, all = (1 << L.length) - 1;
      const n = L.filter((x, i) => mask & (1 << i)).length;
      v = { text: '🗑 Ўчириладиган ҳиварларни белгиланг (охирги ' + L.length + ' та).\nҲивар ва унга берилган белгилар жадвалдан ўчади, гуруҳдаги хабар қолади.' + (n ? '\n\nБелгиланди: ' + n + ' та' : ''),
        kb: [...L.map((x, i) => [B((mask & (1 << i) ? '✅ ' : '▫️ ') + x.t + (x.d ? ' (' + x.d + ')' : ''), 'S:' + (mask ^ (1 << i)))]),
          [B(mask === all ? '▫️ Ҳеч бирини' : '☑️ Ҳаммасини белгилаш', 'S:' + (mask === all ? 0 : all))],
          ...(n ? [[B('🗑 Белгиланганларни ўчириш (' + n + ')', 'Q:' + mask)]] : []), ...OH] };
    }
  }
  else if (arg[0] === 'Q') {
    const r = await esh('alist', {}), L = (r.ok && r.list) || [], mask = Number(arg[1]) || 0, sel = L.filter((x, i) => mask & (1 << i));
    v = { text: '🗑 Шу ' + sel.length + ' та ҳивар ўчирилсинми? Буни қайтариб бўлмайди.\n\n' + sel.map(x => '• ' + x.t + (x.d ? ' (' + x.d + ')' : '')).join('\n'),
      kb: [[B('🗑 Жадвалдан ҳам, гуруҳдан ҳам', 'W:' + mask + ':1')], [B('📋 Фақат жадвалдан', 'W:' + mask + ':0')], [B('◀️ Йўқ', 'S:' + mask)]] };
  }
  else if (arg[0] === 'W') {
    const r = await esh('alist', {}), L = (r.ok && r.list) || [], mask = Number(arg[1]) || 0, sel = L.filter((x, i) => mask & (1 << i));
    await tg('editMessageText', { chat_id: c, message_id: mid, text: '⏳ Ўчирилмоқда… (' + sel.length + ' та)' });
    let ok = 0; const err = [];
    const gr = arg[2] === '1', gx = [];
    for (const x of sel) { const d2 = await esh('del', { id: x.id, g: gr ? 1 : 0 }); if (d2.ok) { ok++; if (d2.gx && d2.gx.length) gx.push(x.t); } else err.push(x.t + ': ' + (d2.err || '')); }
    v = { text: '🗑 Ўчирилди: ' + ok + ' та.' + (err.length ? '\n❌ ' + err.join('\n❌ ') : '') +
        (gr ? (gx.length ? '\n⚠️ Гуруҳдан ўчмаганлар (эски ёки ботда ҳуқуқ йўқ — қўлда ўчиринг): ' + gx.join(', ') : '\nГуруҳдан ҳам ўчирилди.') : '\nГуруҳдаги хабарлар жойида қолди.'), kb: [[B('🗑 Яна ўчириш', 'X')], ...OH] };
  }
  else if (arg[0] === 'R') v = await hisView(arg[1], arg[2], Number(arg[3]) || 0);
  else if (d === 's') v = { text: await stat(), kb: OS };
  else if (d === 'z') v = { text: '📣 Охирги 10 та дарс ва кунлик феъл натижаси ҳозир гуруҳга юборилсинми?\n(Автомат: ҳар Сешанба ва Жума 08:00 да)', kb: [[B('✅ Ҳа, юбор', 'Z'), B('◀️ Йўқ', 'G:n')]] };
  else if (d === 'Z') { const r = await esh('nat', {}); v = { text: r.ok ? '✅ ' + (r.text || 'Юборилди.') : '❌ Юборилмади: ' + (r.err || 'скриптни янгиланг'), kb: ON }; }
  else if (d === 'f') v = { text: '🔤 Феъл тести ҳозир гуруҳга юборилсинми?', kb: [[B('✅ Ҳа, юбор', 'F'), B('◀️ Йўқ', 'G:f')]] };
  else if (d === 'F') { const r = await esh('feel', {}); v = { text: r.ok ? '✅ ' + (r.text || 'Феъл тести гуруҳга юборилди.') : '❌ Юборилмади: ' + (r.err || ''), kb: OF }; }
  else if (arg[0] === 'n') {
    const on = arg[1] !== '1';
    const [, h] = await Promise.all([esh('mode', { v: on ? 'navbat' : '' }), esh('holat', {})]);
    v = mainView({ ok: !!h.ok, err: h.err, ...parseH(h.text, on ? 'navbat' : '') }, on ? '✅ Навбат ёқилди: энди юборган аудиоларингиз навбатга тушади.' : '✅ Навбат ўчирилди: аудио дарҳол гуруҳга кетади.', 'h');
  }
  else if (arg[0] === 'L' || arg[0] === 'U' || arg[0] === 'V') {
    // навбатдаги аудиолар: тартиби, ⬆️ олдинга суриш, белгилаб ўчириш
    let note = '', mask = arg[0] === 'L' ? (Number(arg[1]) || 0) : 0;
    if (arg[0] === 'U') { await esh('qup', { p: Number(arg[1]) }); note = '⬆️ Сурилди.\n\n'; }
    if (arg[0] === 'V') {
      const pre = await esh('qlist', {}), ps = ((pre.ok && pre.list) || []).map((x, i) => i).filter(i => (Number(arg[1]) || 0) & (1 << i));
      const r = await esh('qdel', { ps }); note = r.ok ? '🗑 Навбатдан ўчирилди: ' + r.n + ' та.\n\n' : '❌ ' + (r.err || 'скриптни янгиланг') + '\n\n';
    }
    const r = await esh('qlist', {}), L = ((r.ok && r.list) || []).slice(0, 20);
    if (!r.ok) v = { text: '❌ Навбат олинмади: ' + (r.err || 'Apps Script кодини янгиланг'), kb: OH };
    else if (!L.length) v = { text: note + '📋 Навбат бўш.\nНавбат ёқиқ бўлса, ботга юборган аудиоларингиз шу ерга тушади.', kb: OH };
    else {
      const all = (1 << L.length) - 1, n = L.filter((x, i) => mask & (1 << i)).length;
      v = { text: note + '📋 Навбат — ' + L.length + ' та (юқоридагиси биринчи кетади)\nБосиб белгиланг ёки ⬆️ билан олдинга суринг.' + (n ? '\n\nБелгиланди: ' + n + ' та' : ''),
        kb: [...L.map((x, i) => [B((mask & (1 << i) ? '✅ ' : '▫️ ') + (i + 1) + '. ' + x.t, 'L:' + (mask ^ (1 << i))), ...(i ? [B('⬆️', 'U:' + i)] : [])]),
          [B(mask === all ? '▫️ Ҳеч бирини' : '☑️ Ҳаммасини белгилаш', 'L:' + (mask === all ? 0 : all))],
          ...(n ? [[B('🗑 Белгиланганларни ўчириш (' + n + ')', 'M:' + mask)]] : []), ...OH] };
    }
  }
  else if (arg[0] === 'M') {
    const r = await esh('qlist', {}), L = (r.ok && r.list) || [], mask = Number(arg[1]) || 0, sel = L.filter((x, i) => mask & (1 << i));
    v = { text: '🗑 Навбатдан шу ' + sel.length + ' та аудио ўчирилсинми?\n\n' + sel.map(x => '• ' + x.t).join('\n'), kb: [[B('✅ Ҳа, ўчир', 'V:' + mask), B('◀️ Йўқ', 'L:' + mask)]] };
  }
  else if (d === 'H') v = { text: '▶️ Навбатдаги биринчи ҳивар ҳозир гуруҳга юборилсинми?', kb: [[B('✅ Ҳа, юбор', 'HH'), B('◀️ Йўқ', 'G:h')]] };
  else if (d === 'HH') { const r = await esh('qsend', {}); v = { text: r.ok ? r.text : '❌ ' + (r.err || 'Apps Script кодини янгиланг'), kb: OH }; }
  else if (d === 'J') v = { text: '🧹 Кунлик ҳивар натижалари бутунлай ўчирилсинми?\n\nЮборилган ҳиварлар рўйхати, ким эшитгани (белгилар) ва қора рўйхат ўчади. Навбат, гуруҳдаги хабарлар ва кунлик феълга тегилмайди. Буни қайтариб бўлмайди.', kb: [[B('✅ Ҳа, тозала', 'JJ'), B('◀️ Йўқ', 'G:h')]] };
  else if (d === 'JJ') { const r = await esh('htoza', {}); v = { text: r.ok ? r.text : '❌ ' + (r.err || 'Apps Script кодини янгиланг'), kb: OH }; }
  else if (d === 'C') v = { text: '🧹 Кунлик феъл натижалари бутунлай ўчирилсинми?\n\nКим қачон ишлагани, баллар, хатолар ва юборилган кунлар рўйхати ўчади. Феъллар рўйхати ва ҳивар натижаларига тегилмайди. Буни қайтариб бўлмайди.', kb: [[B('✅ Ҳа, тозала', 'CC'), B('◀️ Йўқ', 'G:f')]] };
  else if (d === 'CC') { const r = await esh('ftoza', {}); v = { text: r.ok ? r.text : '❌ ' + (r.err || 'Apps Script кодини янгиланг'), kb: OF }; }
  else if (arg[0] === 'P') {
    const nt = NATN[arg[1]] ? arg[1] : 'ef';
    const [r, md] = await Promise.all([esh('set', { nat_tur: nt }), esh('mode', {})]);
    const st = { ok: !!r.ok, err: r.err, ...parseH(r.text, md.mode) };
    v = mainView(st, r.ok ? (st.nat === nt ? '✅ Натижа: ' + NATN[nt] : '⚠️ Сақланмади — Apps Script кодини янгиланг') : '❌ ' + (r.err || ''), 'n');
  }
  else if (arg[0] === 'k') v = kunView(Number(arg[1]) || 1);
  else if (arg[0] === 'K') {
    const k = Math.min(FEEL_KUN, Math.max(1, Number(arg[1]) || 1));
    const r = await esh('set', { feel_k: String(k) });
    v = kunView(r.ok ? parseH(r.text).k : k, r.ok ? '✅ Сақланди' : '❌ ' + (r.err || ''));
  }
  else if (arg[0] === 't') v = vaqtView(d.slice(2));
  else if (arg[0] === 'T') {
    const t = d.slice(2), r = await esh('set', { vaqt: t });
    v = vaqtView(r.ok ? (parseH(r.text).vaqt || t) : '', r.ok ? '✅ Сақланди: ' + t : '❌ ' + (r.err || ''));
  }
  else if (arg[0] === 'd') v = kunlarView((arg[1] || '').split('').map(Number));
  else if (arg[0] === 'D') {
    const x = Number(arg[1]); let kn = (arg[2] || '').split('').map(Number);
    kn = kn.includes(x) ? kn.filter(y => y !== x) : [...kn, x].sort();
    if (!kn.length) v = kunlarView([x], '⚠️ Камида битта кун қолсин');
    else { const r = await esh('set', { kunlar: kn.join(',') }); v = kunlarView(r.ok ? parseH(r.text).kunlar : kn, r.ok ? '✅ Сақланди' : '❌ ' + (r.err || '')); }
  }
  if (v) return tg('editMessageText', { chat_id: c, message_id: mid, text: v.text.slice(0, 4000), reply_markup: { inline_keyboard: v.kb } });
}

async function callback(q) {
  const d = q.data || '';
  if (d.startsWith('p:')) { if (!A || String(q.from.id) !== A) return tg('answerCallbackQuery', { callback_query_id: q.id, text: 'Фақат админ учун' }); return panelCb(q); }
  let text = '';
  if (d === 'r') { seen.delete(q.from.id); await seenUser(q.from); text = 'Рўйхатга олиндингиз ✅'; }
  else if (d === 'x') text = 'Бу аудионинг муддати тугаган.';
  else if (d.startsWith('e:')) { const r = await esh('mark', { id: d.slice(2), user: q.from }); text = r.text || 'Хатолик, қайта босинг.'; }
  return tg('answerCallbackQuery', { callback_query_id: q.id, text, show_alert: false });
}

// Админ юборган аудиони гуруҳга жойлаш
async function postAudio(m) {
  const c = String(m.chat.id), f = m.audio || m.voice || m.document || m.video;
  const cf = await esh('cfg', {});
  if (!cf.ok || !cf.group) return tg('sendMessage', { chat_id: c, text: '❌ Гуруҳ уланмаган. Ботни гуруҳга админ қилиб қўшинг ва гуруҳда /ulash деб ёзинг.' + (cf.err ? '\n(' + cf.err + ')' : '') });
  const title = (m.caption || (f && (f.title || f.file_name)) || 'Аудио').trim().split('\n')[0].replace(/\.(m4a|mp3|ogg|oga|opus|wav|aac|mp4)$/i, '').slice(0, 80);
  const id = Date.now().toString(36);
  const x = await tg('copyMessage', { chat_id: cf.group, from_chat_id: c, message_id: m.message_id });
  if (!x.ok) return tg('sendMessage', { chat_id: c, text: '❌ Юборилмади: ' + (x.description || '') });
  const r = await esh('post', { id, title, chat: cf.group, msg: x.result.message_id });
  return tg('sendMessage', { chat_id: c, reply_to_message_id: m.message_id, text: '✅ Гуруҳга юборилди: «' + title + '» + сўровнома\n⏰ Муддат: ' + (r.deadline || 'бугун 24:00') + '\n\n/hisobot — ким эшитди, ким эшитмади.' });
}

const KIND = { voice: 'овозли хабар', video_note: 'видео-доира', sticker: 'стикер', photo: 'расм',
  video: 'видео', document: 'файл', audio: 'аудио', animation: 'GIF', location: 'жойлашув', contact: 'контакт',
  story: 'сторис', poll: 'сўровнома', dice: 'ўйин эмодзиси 🎲', venue: 'манзил', game: 'ўйин', web_app_data: 'илова тугмасидан маълумот',
  paid_media: 'пулли медиа', giveaway: 'совға ўйини', giveaway_winners: 'совға ғолиблари', checklist: 'чек-рўйхат', invoice: 'тўлов ҳисоби',
  successful_payment: 'тўлов', users_shared: 'фойдаланувчи улашилди', chat_shared: 'чат улашилди', write_access_allowed: 'ботга ёзишга рухсат берди',
  pinned_message: 'хабарни қадади', forward_origin: 'бошқа жойдан юборилган хабар' };
const STD = new Set(['message_id', 'from', 'chat', 'date', 'edit_date', 'entities', 'caption_entities', 'reply_to_message', 'message_thread_id', 'has_protected_content', 'via_bot', 'link_preview_options', 'reply_markup', 'sender_chat', 'author_signature', 'media_group_id', 'is_topic_message', 'is_automatic_forward', 'external_reply', 'quote', 'show_caption_above_media', 'has_media_spoiler', 'effect_id', 'caption', 'text', 'forward_from', 'forward_date', 'forward_from_chat', 'forward_sender_name', 'forward_signature', 'forward_from_message_id', 'business_connection_id', 'sender_business_bot', 'sender_boost_count']);

async function handle(m) {
  const c = String(m.chat.id), t = (m.text || '').trim().replace(/^(\/\w+)@\w+/, '$1').replace(/^\/\w+/, x => x.toLowerCase());
  let ctrl = false;
  if (m.chat.type === 'group' || m.chat.type === 'supergroup') {
    // boshqaruv guruhi: admin buyruq va audiolarni shu yerda yozadi
    if (t.split('@')[0] === '/boshqaruv' && A && String(m.from && m.from.id) === A) {
      const r = await esh('ctrl', { chat: c }); grp = null;
      return tg('sendMessage', { chat_id: c, text: r.ok ? '✅ Бу гуруҳ энди бошқарув чати. Аудио ва буйруқларни шу ерга ёзинг (/help).' : '❌ ' + (r.err || '') });
    }
    await loadGrp();
    if (grp.ctrl && c === grp.ctrl && A && String(m.from && m.from.id) === A) ctrl = true;
    else return group(m);
  } else if (m.chat.type !== 'private') return;
  if (t === '/id') return tg('sendMessage', { chat_id: c, text: 'ID: ' + c });

  // Admin javobi
  if (A && (c === A || ctrl)) {
    if (t === '/panel') { setMenu(); const v = await panelView(); return tg('sendMessage', { chat_id: c, text: v.text, reply_markup: { inline_keyboard: v.kb } }); }
    if (t === '/stat') return tg('sendMessage', { chat_id: c, text: await stat() });
    if (t === '/hisobot') { const v = await hisView('e', '7', 0); return tg('sendMessage', { chat_id: c, text: v.text.slice(0, 4000), reply_markup: { inline_keyboard: v.kb } }); }
    if (t.startsWith('/hisobot')) { const r = await esh('rep', { id: t.split(' ')[1] || '' }); return tg('sendMessage', { chat_id: c, text: r.text || ('Ҳисобот олинмади: ' + (r.err || '')) }); }
    if (t === '/navbat') { await esh('mode', { v: 'navbat' }); const h = await esh('holat', {}); return tg('sendMessage', { chat_id: c, text: '📥 Навбат режими ёқилди. Энди аудиоларни кетма-кет юборинг (изоҳига номини ёзинг) — улар навбатга тушади.\nТугатгач: /tamom\n\n' + (h.text || '') }); }
    if (t === '/tamom') { await esh('mode', { v: '' }); const h = await esh('holat', {}); return tg('sendMessage', { chat_id: c, text: '✅ Навбат режими ўчирилди. Энди юборилган аудио дарҳол гуруҳга кетади.\n\n' + (h.text || '') }); }
    if (/^\/fee?l_k\b/.test(t)) {
      const v = t.split(/\s+/)[1];
      if (!v) { const h = await esh('holat', {}); return tg('sendMessage', { chat_id: c, text: 'Феъл тестини қайси кундан бошлаш: /fel_k 1 (1 — энг бошидан)\n\n' + (h.text || '') }); }
      const r = await esh('set', { feel_k: v });
      return tg('sendMessage', { chat_id: c, text: r.ok ? '✅ Феъл тести ' + v + '-кундан давом этади.' : '❌ ' + (r.err || '') });
    }
    if (t === '/fel' || t === '/feel') { const r = await esh('feel', {}); return tg('sendMessage', { chat_id: c, text: r.ok ? '🔤 ' + (r.text || 'Феъл тести гуруҳга юборилди.') : '❌ Юборилмади: ' + (r.err || '') }); }
    if (t === '/natija') { const r = await esh('nat', {}); return tg('sendMessage', { chat_id: c, text: r.ok ? '✅ ' + (r.text || 'Юборилди.') : '❌ Юборилмади: ' + (r.err || 'скриптни янгиланг') }); }
    if (t === '/holat') { const h = await esh('holat', {}); return tg('sendMessage', { chat_id: c, text: h.text || ('Олинмади: ' + (h.err || '')) }); }
    if (t.startsWith('/vaqt') || t.startsWith('/kunlar')) {
      const v = t.split(/\s+/).slice(1).join(',');
      const r = await esh('set', t.startsWith('/vaqt') ? { vaqt: v } : { kunlar: v });
      return tg('sendMessage', { chat_id: c, text: r.ok ? '✅ Сақланди.\n\n' + r.text : '❌ ' + (r.err || '') });
    }
    if (!m.reply_to_message && (m.audio || m.voice || m.document || m.video)) {
      const md = await esh('mode', {});
      if (md.mode === 'navbat') {
        const kind = m.audio ? 'audio' : m.voice ? 'voice' : m.video ? 'video' : 'document', f = m[kind];
        const title = (m.caption || f.title || f.file_name || 'Аудио').trim().split('\n')[0].replace(/\.(m4a|mp3|ogg|oga|opus|wav|aac|mp4)$/i, '').slice(0, 80);
        const r = await esh('queue', { title, file_id: f.file_id, kind });
        return tg('sendMessage', { chat_id: c, reply_to_message_id: m.message_id, text: r.ok ? '📥 Навбатга қўшилди: «' + title + '» (навбатда ' + r.n + ' та)' : '❌ ' + (r.err || '') });
      }
      return postAudio(m);
    }
    if (t === '/start' || t === '/help') { await setMenu(); return tg('sendMessage', { chat_id: c, text: 'Сиз — админсиз.\n\n• /panel — 🎛 тугмали бошқарув панели (энг қулайи).\n• Кимдир ботга ёзса, хабари шу ерга 💬 белгиси билан келади.\n• Жавоб бериш учун ўша хабарга Reply қилинг (матн, овоз, расм — ҳаммаси бўлади).\n• /stat — статистика.\n• /boshqaruv — (алоҳида гуруҳда ёзилади) ўша гуруҳни бошқарув чати қилади: аудио ва буйруқлар ўша ерда.\n• Аудио юборсангиз (изоҳига номини ёзинг) — гуруҳга сўровнома билан жойланади (муддат — шу куни 24:00).\n• /hisobot — охирги аудиони ким эшитди, ким эшитмади.\n• /navbat — аудиоларни навбатга йиғиш (автомат юбориш учун), /tamom — тугатиш.\n• /holat — автомат юбориш созламалари ва навбат.\n• /fel_k 1 — феъл тестини қайси кундан бошлаш (1 — бошидан).\n• /fel — феъл тестини ҳозир юбориш (одатда аудио билан бирга ўзи чиқади).\n• /vaqt 08:00 — юбориш вақти; /kunlar 1,2,3,4,5,6 — кунлар (1 — Душанба).\n\nСинаб кўриш учун бошқа аккаунтдан ёзинг.' }); }
    const r = m.reply_to_message;
    const id = r && ((r.text || r.caption || '').match(/ID (\d+)/) || [])[1];
    if (!id) return tg('sendMessage', { chat_id: c, text: 'Жавоб бериш учун 💬 белгили хабарга Reply қилинг.' });
    const x = await tg('copyMessage', { chat_id: id, from_chat_id: c, message_id: m.message_id });
    if (x.ok) return tg('setMessageReaction', { chat_id: c, message_id: m.message_id, reaction: [{ type: 'emoji', emoji: '👍' }] });
    return tg('sendMessage', { chat_id: c, reply_to_message_id: m.message_id, text: '❌ Юборилмади: ' + (x.description || '') });
  }

  if (t === '/start') await tg('sendMessage', { chat_id: c, text: 'Ассалому алайкум! Хабарингизни ёзинг, биз жавоб берамиз.' });
  if (!A) return;

  const f = m.from || {};
  const nm = [f.first_name, f.last_name].filter(Boolean).join(' ') || '(номсиз)';
  const head = '💬 ' + nm + ' (' + (f.username ? '@' + f.username : '-') + ', ID ' + c + ')';

  if (m.text) return tg('sendMessage', { chat_id: A, text: head + '\n\n' + m.text });
  // хизмат хабарлари (кўчириб бўлмайди) — фақат битта қисқа қатор
  if (m.write_access_allowed) return tg('sendMessage', { chat_id: A, text: head + '\n\n✅ Тест иловасини очди, ботга рухсат берди.' });
  // Media: imkon bo'lsa izoh (caption) bilan bitta xabar
  const cap = head + (m.caption ? '\n\n' + m.caption : '');
  const x = await tg('copyMessage', { chat_id: A, from_chat_id: c, message_id: m.message_id, caption: cap });
  if (x.ok && !m.sticker && !m.video_note && !m.location && !m.contact) return;
  const k = Object.keys(KIND).find(key => key !== 'forward_origin' && m[key]) || (m.forward_origin ? 'forward_origin' : '');
  const other = Object.keys(m).filter(key => !STD.has(key) && !KIND[key]);
  const nom = k ? KIND[k] : (other.length ? 'номаълум тур: ' + other.join(', ') : 'хабар');
  const h = await tg('sendMessage', { chat_id: A, text: head + '\n\n[' + nom + ']' + (!x.ok ? '\n(кўчириб бўлмади' + (x.description ? ': ' + x.description : '') + ')' : '') });
  if (!x.ok) { const y = await tg('forwardMessage', { chat_id: A, from_chat_id: c, message_id: m.message_id }); if (!y.ok && h.ok) await tg('sendMessage', { chat_id: A, reply_to_message_id: h.result.message_id, text: 'Ўзини ҳам юбориб бўлмади' + (y.description ? ': ' + y.description : '') }); }
}

module.exports = async (req, res) => {
  if (!T) return res.status(500).send('BOT_TOKEN yo\'q');
  if (req.method === 'GET') {
    if (req.query.setup) {
      const url = 'https://' + req.headers.host + '/api/tg';
      const r = await tg('setWebhook', { url, secret_token: SECRET, drop_pending_updates: true, allowed_updates: ['message', 'callback_query', 'poll_answer'] });
      menuSet = false; await setMenu();
      return res.status(200).json({ ...r, admin: A ? 'bor' : 'ADMIN_ID qo\'yilmagan' });
    }
    if (req.query.info) {
      const w = await tg('getWebhookInfo', {}), r = w.result || {};
      return res.status(200).json({ allowed_updates: r.allowed_updates, pending: r.pending_update_count, last_error: r.last_error_message || null, last_error_date: r.last_error_date ? new Date(r.last_error_date * 1000).toISOString() : null, ip: r.ip_address ? 'bor' : null });
    }
    return res.status(200).send('ok');
  }
  if (req.headers['x-telegram-bot-api-secret-token'] !== SECRET) return res.status(401).send('no');
  try {
    if (req.body && req.body.message) await handle(req.body.message);
    else if (req.body && req.body.callback_query) await callback(req.body.callback_query);
    else if (req.body && req.body.poll_answer) { const a = req.body.poll_answer; await esh('ans', { poll: a.poll_id, user: a.user, opt: a.option_ids }); }
  } catch (e) { console.error(e); }
  res.status(200).send('ok');
};
