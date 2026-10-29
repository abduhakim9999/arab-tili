# Таркибни эшитиш: NN.html даги «Арабча эъроб» (IRB) дан арабча таркиб овозини ясайди
# ва tinglash.html даги LIST[NN] га "t" (Таркиб режими) қўшади.
# Ишлатиш (репо илдизидан):  python3 src/build/tkbuild.py 93 [--dry]
# Талаб: edge-tts, ffmpeg. Овоз: ar-SA-HamedNeural (ج «ж» бўлиб айтилади; Shakir — «г»).
# Тартиб (оғзаки эъроб): гап → ҳар сўз (сўзнинг ўзи, пауза, эъроби) → шибҳи жумла мутааллиқи → жумла эъроби.
import json, re, sys, os, asyncio, subprocess, hashlib, tempfile

N = sys.argv[1]; DRY = '--dry' in sys.argv
VOICE = 'ar-SA-HamedNeural'
H = 'ًٌٍَُِْ'
dec = json.JSONDecoder()

def var(s, name):
    i = s.find('var ' + name + '=')
    return dec.raw_decode(s[i + len(name) + 5:])[0]

page = open(N + '.html', encoding='utf-8').read()
IRB = var(page, 'IRB'); GT = var(page, 'GT')
ting = open('tinglash.html', encoding='utf-8').read()
oi = ting.find('{"n": ' + N + ',')
L, oend = dec.raw_decode(ting[oi:]); oend += oi

def bare(w):
    return re.sub('[' + H + 'ّٰ]', '', w).replace('ٱ', 'ا').replace('أ', 'ا').replace('إ', 'ا')

# --- шибҳи жумла мутааллиқи (Таркибдан; арабча эъробда йўқ бўлса) ---
def mut_ar(note, ln):
    m = re.search(r'шибҳи жумла бўлиб, (.+?) га мутааллиқ', note)
    if not m: return None
    t = m.group(1).strip()
    m2 = re.search(r'маҳзуф (сифат|хабари муқаддам|хабар)[^ء-ي]*([ء-يً-ّْ]+)', t)
    if m2:
        kind = {'сифат': 'صِفَةٍ', 'хабари муқаддам': 'خَبَرٍ مُقَدَّمٍ', 'хабар': 'خَبَرٍ'}[m2.group(1)]
        return 'وَشِبْهُ الْجُمْلَةِ مُتَعَلِّقٌ بِمَحْذُوفٍ ' + kind + ' تَقْدِيرُهُ: ' + m2.group(2) + '.'
    if not re.search('[ء-ي]', t): return None
    verb = False
    for k, v in IRB.items():
        if k.split('-')[0] != ln: continue
        for w, uz, *_ in v['k']:
            if w and bare(w).replace('ال', '') == bare(t).replace('ال', '') and 'феъли' in uz: verb = True
    if verb: return 'وَشِبْهُ الْجُمْلَةِ مُتَعَلِّقٌ بِالْفِعْلِ «' + t + '».'
    return 'وَشِبْهُ الْجُمْلَةِ مُتَعَلِّقٌ بِـ«' + re.sub('^اَ', 'ا', t) + '».'

# --- талаффуз учун матн (саҳифада кўринадигани ўзгармайди) ---
def waqf(t):
    t = t.strip(); end = ''
    m = re.search(r'[\s.:،,؛;؟?!…]+$', t)
    if m:
        p = m.group(0); t = t[:m.start()]
        end = '؟' if ('؟' in p or '?' in p) else ('!' if '!' in p else '')
    w = t.split(' '); x0 = w[-1]; x = x0.rstrip(H + '\u0651')
    if '\u0651' in x0[len(x):]: x += '\u0651'
    if x.endswith('ة'): x = x[:-1] + 'هْ'
    elif not x.endswith(('ا', 'ى', 'و', 'ي')): x += 'ْ'
    w[-1] = x
    return ' '.join(w) + end

def clean(t):
    return re.sub(r'[\s.:،,؛;؟?!…«»ـ]+', ' ', t).strip()

def speak(t):
    t = t.replace('بِـ«', 'بِ').replace('«', '').replace('»', '').replace('…', '').replace('ـ', '')
    t = re.sub(r' \((ا[^)]*)\)', r' أَوِ \1', t); t = re.sub(r' \(([^)]*)\)', r' أَوْ \1', t)
    t = t.replace('ﷺ', 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ')
    return waqf(re.sub(r'\s+', ' ', t))

# --- бўлаклар ---
chunks = []   # {key, clips:[(text, gap_after)], sa, su}
lines = sorted(L['l'], key=int)
for ln in lines:
    ar, uz = L['l'][ln][0], L['l'][ln][1]
    keys = sorted([k for k in IRB if k.split('-')[0] == ln], key=lambda k: int(k.split('-')[1]))
    if not keys: continue
    chunks.append({'key': ln + 's', 'clips': [(speak(ar), 0)], 'sa': ar, 'su': uz, 'gap': 1.0})
    bounds = sorted(b[0] for b in GT.get(ln, [])) or [10**6]
    def sent(idx):
        for b in bounds:
            if idx <= b: return b
        return bounds[-1]
    pend = {}
    for n, k in enumerate(keys):
        v = IRB[k]; idx = int(k.split('-')[1])
        kw = [x for x in v['k'] if x[0]]
        subs = [a for a in v['a'] if a[0]]
        notes = [a[1] for a in v['a'] if not a[0]]
        arall = ' '.join(a[1] for a in v['a'])
        mut = None
        if 'مُتَعَلِّق' not in arall:
            for x in v['k']:
                if not x[0] and 'мутааллиқ' in x[1]:
                    mut = mut_ar(x[1], ln) or mut
                    if not mut: print('?? мутааллиқ', k, x[1])
        for j, (w, a) in enumerate(subs):
            su = (kw[j][1] if len(kw) == len(subs) else (kw[0][1] if kw else ''))
            clips = [(clean(w), 0.35), (speak(a), 0)]
            sa = w + ': ' + a
            if j == len(subs) - 1:
                for nt in notes:
                    if not re.match('وَ(ال)?جُمْلَةُ', nt): clips[-1] = (clips[-1][0], 0.3); clips.append((speak(nt), 0)); sa += ' ' + nt
                if mut: clips[-1] = (clips[-1][0], 0.3); clips.append((speak(mut), 0)); sa += ' ' + mut
            chunks.append({'key': k + '.' + str(j), 'clips': clips, 'sa': sa, 'su': su, 'gap': 0.7})
        for nt in notes:
            if re.match('وَ(ال)?جُمْلَةُ', nt): pend.setdefault(sent(idx), []).append(nt)
        nxt = int(keys[n + 1].split('-')[1]) if n + 1 < len(keys) else 10**7
        for b in sorted(pend):
            if b < nxt and (b <= idx or nxt == 10**7):
                for i2, nt in enumerate(pend.pop(b)):
                    chunks.append({'key': ln + 'j' + str(b) + '.' + str(i2), 'clips': [(speak(nt), 0)], 'sa': nt, 'su': '', 'gap': 0.9})
    chunks[-1]['gap'] = 1.4

if DRY:
    for c in chunks: print(c['key'], ' | '.join(t for t, g in c['clips']))
    print(len(chunks), 'бўлак'); sys.exit()

# --- овоз ---
import edge_tts
TMP = tempfile.mkdtemp(prefix='tk' + N + '_')
texts = sorted({t for c in chunks for t, g in c['clips']})
fn = {t: os.path.join(TMP, hashlib.md5(t.encode()).hexdigest()[:12]) for t in texts}
sem = asyncio.Semaphore(6)
async def one(t):
    async with sem:
        for _ in range(4):
            try:
                await edge_tts.Communicate(t, VOICE).save(fn[t] + '.mp3'); return
            except Exception as e: err = e; await asyncio.sleep(2)
        raise err
async def allv(): await asyncio.gather(*[one(t) for t in texts])
asyncio.run(allv())
TRIM = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,areverse'
def run(*a): subprocess.run(list(a), check=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
for t in texts: run('ffmpeg', '-v', 'error', '-y', '-i', fn[t] + '.mp3', '-af', TRIM, '-ar', '24000', '-ac', '1', fn[t] + '.wav')
sil = {}
def z(g):
    if g not in sil:
        sil[g] = os.path.join(TMP, 'z%s.wav' % g); run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', str(g), sil[g])
    return sil[g]
# бош қисм (бисмиллаҳ + дарс рақами) — ҳивор овозидан
hd = L['m'][0]; hsrc = os.path.join(TMP, 'h.mp3')
open(hsrc, 'wb').write(subprocess.check_output(['git', 'show', 'HEAD:' + L['f']]))
hw = os.path.join(TMP, 'h.wav'); run('ffmpeg', '-v', 'error', '-y', '-i', hsrc, '-t', str(hd[3]), '-ar', '24000', '-ac', '1', hw)
seq = [hw, z(0.8)]; T = dur(hw) + 0.8
M = [[0, 'h', 0.0, round(dur(hw), 2)]]; LL = {}
for c in chunks:
    st = T
    for t, g in c['clips']:
        seq.append(fn[t] + '.wav'); T += dur(fn[t] + '.wav')
        if g: seq.append(z(g)); T += g
    M.append([c['key'], 'ar', round(st, 2), round(T, 2)]); LL[c['key']] = [c['sa'], c['su'], '']
    seq.append(z(c['gap'])); T += c['gap']
lst = os.path.join(TMP, 'list.txt')
open(lst, 'w').write(''.join("file '%s'\n" % f for f in seq))
out = os.path.join(TMP, 'out.mp3')
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ar', '24000', '-ac', '1', '-b:a', '32k', out)
h8 = hashlib.md5(open(out, 'rb').read()).hexdigest()[:8]
name = 't%s-%s.mp3' % (N, h8)
old = (L.get('t') or {}).get('f')
if old and os.path.exists(old): os.remove(old)
os.replace(out, name)
L['t'] = {'f': name, 'm': M, 'l': LL}
ting = ting[:oi] + json.dumps(L, ensure_ascii=False) + ting[oend:]
open('tinglash.html', 'w', encoding='utf-8').write(ting)
print(name, round(T / 60, 1), 'дақиқа,', len(chunks), 'бўлак')
