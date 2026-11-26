#!/usr/bin/env python3
"""Grammatika videosi: ovoz bo'laklari -> narr.wav + vaqt jadvali (tl.json, tl.js); tovush effektlari -> mix.wav.
Har bo'lak ElevenLabs'da ALOHIDA yasalgan (ovoz/NAME.mp3) — kesilmaydi, faqat chet jimlik olinadi, balandlik tenglanadi.
  python3 prep.py            — narr.wav, tl.json, tl.js
  (mix.wav ni render.py join yozadi: sahifadagi window.SFX ro'yxati bo'yicha mix() chaqiriladi)"""
import subprocess, json, wave, os
import numpy as np

D = os.path.dirname(os.path.abspath(__file__))
SR = 44100
HOP = int(SR * 0.01)

# ball — «Баллар ва рейтинг»: ball nimaga beriladi, 🔥 seriya, «Рейтинг» (yo'riqnoma videosi; matn va jadvallar — docs/ball-video.md, 26.11.2026).
# Qoida kodda: takror.js REY / kunBallari / kunlik, tg.js Ball. 26.11.2026 (13:37 joylashidan keyin): dars «Машқ»i endi «Эъроб» — matn moslandi. Matn oddiy lotinchada; «|» — ekrandagi qadam joyi (qoralamada vaqti matn
# «ball» — kirillcha «балл» (26.11.2026, foydalanuvchi: «balni noto'g'ri talaffuz qilyapti» — lotinchasi ba'zan inglizcha «bo'l»; sinovda «балл» va «bal» ikkalasi yaxshi).
# uzunligiga qarab taxmin qilinadi, haqiqiy ovozdan keyin cue.json ga aniq vaqtlar). Ovoz (rejada): Farruh — foydalanuvchi ruxsati bilan.
import re
IPA = {'xullas': 'Хуллас', 'ball': 'балл', 'ballar': 'баллар', 'ballni': 'баллни', 'ballingiz': 'баллингиз', 'ballgacha': 'баллгача'}   # 26.11.2026: lotincha «ball» hamma joyda «boll» eshitildi (foydalanuvchi) — hamma shakl kirillcha   # gap boshida yolg'iz «X…» so'zi ElevenLabs'da «z» bo'lib ketadi — kirillcha yoziladi (docs/texnik/21: «Сўз йўли», «Xatosiz»)
TXT = {
 # S1 — savol
 'k1': "Reytingda yuqoriga qanday chiqiladi? |Javob oddiy: |qancha ko'p shug'ullansangiz — |shuncha ko'p ball.",
 # S2 — to'g'ri javob 10
 'k2a': "Har bir to'g'ri javob — o'n ball: |«Mashq»da ham, |darsdagi «E'rob»da ham, |«Sarf»da ham. |To'g'ri topsangiz, ekranda «plyus o'n» uchadi.",
 'k2b': "Xato qilsangiz, ball ayrilmaydi. |Lekin bitta savol kuniga faqat bir marta ball beradi.",   # 26.11.2026: «Faqat bitta savol…» ikki xil tushunilardi
 # S3 — so'z «биламан» +50
 'k3': "So'zni uch kun to'g'ri topsangiz, |u «bilaman» pog'onasiga ko'tariladi. |Mukofoti — yana ellik ball.",
 # S4 — dars 80% +100
 'k4': "Darsning «E'rob»idan |birinchi marta sakson foiz oldingizmi? |Yuz ball sizniki.",
 # S5 — tinglash
 'k5': "Tinglash ham hisobda: |har besh daqiqa tinglash — |o'n ball, |kuniga ikki yuz ballgacha.",
 # S6 — olov (kunlik 200)
 'k6a': "«Mashq» sahifasining tepasida |bugungi ballingiz turadi. |U ikki yuzga yetsa — |olov yonadi |va yana ellik ball qo'shiladi.",
 'k6b': "Bu olov gulxanga o'xshaydi: |har kuni o'tin tashlab tursangiz — yonaveradi, |bir kun qoldirsangiz — o'chadi. |O'tini — kuniga ikki yuz ball.",
 # S7 — Рейтинг · Ҳафта
 'k7': "Yig'ilgan ballar «Reyting»dagi |«Hafta» ro'yxatida ko'rinadi. |Har dushanba hisob noldan boshlanadi — |har hafta birinchi bo'lish imkoni bor. |Pastda o'z o'rningiz |va keyingi o'ringacha necha ball qolgani turadi.",
 # S8 — Рейтинг · Сўзлар
 'k8': "Yonidagi «So'zlar» ro'yxati |ballni emas, nechta so'z bilishingizni ko'rsatadi. |U dushanbada o'chmaydi — |bilgan so'zingiz o'zingizda qoladi.",
 # S9 — xulosa
 'k9': "Xullas: |javob bering, |so'z yodlang, |dars o'ting, |tinglang. |Har kuni ozgina — |olov o'chmaydi, |o'rningiz ko'tariladi.",
}
SEQ = [
 ('S1', [('lead', 0.5), 'k1', ('gap', 0.8)]),
 ('S2', [('lead', 0.5), 'k2a', ('gap', 0.5), 'k2b', ('gap', 0.8)]),
 ('S3', [('lead', 0.5), 'k3', ('gap', 0.9)]),
 ('S4', [('lead', 0.5), 'k4', ('gap', 0.9)]),
 ('S5', [('lead', 0.5), 'k5', ('gap', 0.9)]),
 ('S6', [('lead', 0.5), 'k6a', ('gap', 0.6), 'k6b', ('gap', 0.9)]),
 ('S7', [('lead', 0.5), 'k7', ('gap', 0.9)]),
 ('S8', [('lead', 0.5), 'k8', ('gap', 0.9)]),
 ('S9', [('lead', 0.5), 'k9', ('gap', 2.2)]),
]
CUT = {}
ARDUR = {}
SUR = 13.8                             # Farruh ovozining o'rtacha sur'ati (belgi/soniya) — qoralama shu uzunlikka keltiriladi
AR = lambda n: n[0] in 'ab'
CUE = {}
try: CUE = json.load(open(f'{D}/cue.json'))
except Exception: pass
TARGET = 10 ** (-21 / 20)   # faol qismning RMS darajasi


DRAFT = set()


def toza(t): return t.replace('|', '')


def eleven(t): return toza(t) if not IPA else re.sub(r"\b(" + '|'.join(IPA) + r")\b", lambda m: IPA[m.group(1).lower()], toza(t), flags=re.I)


def load(n):
    p = f'{D}/ovoz/{n}.mp3'
    if not os.path.exists(p):
        DRAFT.add(n); p = f'{D}/qoralama/{n}.wav'
        if not os.path.exists(p): return None
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def rms_db(x):
    n = len(x) // HOP
    r = np.sqrt((x[:n * HOP].reshape(n, HOP) ** 2).mean(axis=1) + 1e-12)
    return 20 * np.log10(np.convolve(r, np.ones(3) / 3, mode='same') + 1e-9)


def prep(n):
    x = load(n)
    if x is None: return np.zeros(int((ARDUR[n] if AR(n) else len(toza(TXT[n])) / SUR) * SR))   # ovoz yo'q — taxminiy uzunlikdagi jimlik
    db = rms_db(x); act = np.where(db > db.max() - 38)[0]
    a, b = max(0, act[0] * HOP - int(0.03 * SR)), min(len(x), (act[-1] + 1) * HOP + int(0.16 * SR))
    y = x[a:b].copy(); fi, fo = int(0.008 * SR), int(0.07 * SR)
    y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    d2 = rms_db(y); on = d2 > (d2.max() - 30)
    y *= TARGET / np.sqrt((y[:len(on) * HOP].reshape(-1, HOP)[on] ** 2).mean())
    pk = np.abs(y).max()
    if pk > 0.9: y *= 0.9 / pk
    if n in CUT:
        y = y[int(CUT[n] * SR):].copy(); y[:fi] *= np.linspace(0, 1, fi)
    return y


def wav_write(p, x):
    with wave.open(p, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


def qadam(n, dur):
    """«|» belgilaridan qadam vaqtlari (matn uzunligiga mutanosib) — cue.json da bo'lmasa."""
    parts = TXT[n].split('|'); tot = sum(len(p) for p in parts); acc = 0; out = [0]
    for p in parts[:-1]:
        acc += len(p); out.append(round(dur * acc / tot, 2))
    return out


def main():
    clips = {}; t = 0.0; scenes = []; parts = []; subs = []
    for sid, items in SEQ:
        s0 = t
        for it in items:
            if isinstance(it, tuple): t += it[1]; continue
            y = prep(it); dur = len(y) / SR
            cs = CUE.get(it) or (qadam(it, dur) if not AR(it) else [0])
            clips[it] = {'s': round(t, 3), 'e': round(t + dur, 3), 'c': [round(t + c, 3) for c in cs]}
            if it in DRAFT and not AR(it):                                      # subtitr — faqat ovozi hali yo'q o'zbekcha bo'laklarga (gap bo'yicha)
                gs = [g.strip() for g in re.split(r'(?<=[.?!])\s+', toza(TXT[it])) if g.strip()]; tot = sum(len(g) for g in gs); acc = 0
                for g in gs:
                    subs.append([round(t + dur * acc / tot, 2), round(t + dur * (acc + len(g)) / tot, 2), g]); acc += len(g)
            if it in DRAFT and AR(it): subs.append([round(t, 2), round(t + dur, 2), '(арабчаси ҳақиқий овозда ўқилади)'])
            parts.append((t, y)); t += dur
        scenes.append({'id': sid, 's': round(s0, 3), 'e': round(t, 3)})
    total = np.ceil(t * 30) / 30
    out = np.zeros(int(total * SR) + 1)
    for st, y in parts:
        i = int(st * SR); out[i:i + len(y)] += y
    wav_write(f'{D}/narr.wav', out)
    tl = {'dur': round(float(total), 3), 'fps': 30, 'clips': clips, 'scenes': scenes, 'draft': sorted(DRAFT), 'subs': subs if DRAFT else []}
    json.dump(tl, open(f'{D}/tl.json', 'w'), indent=1, ensure_ascii=False)
    open(f'{D}/tl.js', 'w').write('window.TL=' + json.dumps(tl, ensure_ascii=False) + ';')
    est = float(total) + sum(len(toza(TXT[n])) / SUR - (clips[n]['e'] - clips[n]['s']) for n in clips if not AR(n))      # hamma o'zbekcha bo'lak Farruhda yoziladi
    print(f"haqiqiy ovoz bilan taxminan {int(est // 60)}:{est % 60:04.1f} (chegara 3:00)")
    print('jami', round(float(total), 2), 's;', len(parts), "bo'lak;", ' '.join(f"{s['id']}={s['s']:.1f}" for s in scenes), '| qoralama:', ' '.join(sorted(DRAFT)) or "yo'q")


# ---- Tovush effektlari (sintez, bepul; juda past ovozda) ----
def _env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def _noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def _bp(x, f0, f1, q=2.2):                       # markazi f0 -> f1 ga siljiydigan rezonator
    y = np.zeros(len(x)); y1 = y2 = 0.0; n = len(x)
    for i in range(n):
        f = f0 * (f1 / f0) ** (i / n); w = 2 * np.pi * f / SR; r = 1 - w / (2 * q)
        v = (1 - r) * x[i] + 2 * r * np.cos(w) * y1 - r * r * y2
        y2 = y1; y1 = v; y[i] = v
    return y


# Haqiqiy tovush effektlari (ElevenLabs Sound Effects v3; foydalanuvchi, 21.11.2026: «Eleven bilan qil») — sfx/NAME.mp3 bo'lsa shu olinadi,
# bo'lmasa pastdagi sintez. Har biri: faol qismi kesib olinadi (THR dB dan baland joy), uzunligi MAXLEN bilan cheklanadi, chetlari so'ndiriladi.
SFXREAL = {  # nom: (bo'sag'a dB, eng ko'p uzunlik s, kirish so'nishi s, chiqish so'nishi s)
 'whoosh': (-24, 0.75, 0.06, 0.18), 'whoosh2': (-24, 0.75, 0.06, 0.18), 'pop': (-35, 0.25, 0.002, 0.06), 'thud': (-35, 0.40, 0.002, 0.10),
 'shimmer': (-35, 0.90, 0.004, 0.25), 'chime': (-40, 1.40, 0.004, 0.35), 'tick': (-35, 0.15, 0.001, 0.04)}


def sfx_real(name):
    p = f'{D}/../sozyoli/sfx/{name}.mp3'                   # ElevenLabs effektlari — «Сўз йўли» bilan umumiy
    if name not in SFXREAL or not os.path.exists(p): return None
    thr, mx, fi, fo = SFXREAL[name]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-af', 'highpass=f=120', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64); h = int(SR * .005); n = len(x) // h
    e = np.sqrt((x[:n * h].reshape(n, h) ** 2).mean(axis=1) + 1e-12); act = np.where(20 * np.log10(e / e.max()) > thr)[0]
    a = max(0, act[0] * h - int(.008 * SR)); b = min(len(x), (act[-1] + 1) * h + int(fo * SR), a + int(mx * SR))
    y = x[a:b].copy(); i, o = max(1, int(fi * SR)), max(1, int(fo * SR))
    y[:i] *= np.linspace(0, 1, i); y[-o:] *= np.linspace(1, 0, o)
    return y / (np.abs(y).max() + 1e-9)


def _lvl(y):                                     # eng baland 30 ms lik bo'lakning RMS darajasi
    w = int(SR * .03); c = np.cumsum(np.concatenate([[0], y ** 2]))
    return np.sqrt(((c[w:] - c[:-w]) / w).max()) if len(y) > w else np.sqrt((y ** 2).mean())


def sfx(name):
    r = sfx_real(name)
    if r is not None: return r * (_lvl(sfx_synth(name)) / (_lvl(r) + 1e-9))    # balandligi avvalgi (sintez) effektniki bilan teng
    return sfx_synth(name)


def sfx_synth(name):
    if name == 'whoosh':                         # sirpanib o'tish
        n = int(0.55 * SR); e = np.sin(np.pi * np.arange(n) / n) ** 2.2
        y = _bp(_noise(n, 1), 500, 3200) * e
    elif name == 'whoosh2':                      # teskari (pasayuvchi)
        n = int(0.5 * SR); e = np.sin(np.pi * np.arange(n) / n) ** 2.2
        y = _bp(_noise(n, 2), 2800, 450) * e
    elif name == 'pop':                          # yorliq chiqishi
        n = int(0.14 * SR); t = np.arange(n) / SR
        y = np.sin(2 * np.pi * np.cumsum(880 * np.exp(-t / 0.05) + 260) / SR) * _env(n, 0.002, 0.035)
    elif name == 'thud':                         # so'z qo'nishi
        n = int(0.32 * SR); t = np.arange(n) / SR
        y = np.sin(2 * np.pi * np.cumsum(140 * np.exp(-t / 0.06) + 62) / SR) * _env(n, 0.003, 0.09) + 0.25 * _bp(_noise(n, 3), 1800, 900) * _env(n, 0.001, 0.02)
    elif name == 'shimmer':                      # harakat o'zgarishi
        n = int(0.7 * SR); y = np.zeros(n)
        for k, f in enumerate([2093, 2637, 3136, 3951]):
            o = int(k * 0.035 * SR); m = n - o
            y[o:] += np.sin(2 * np.pi * f * np.arange(m) / SR) * _env(m, 0.004, 0.16) / (k + 1.5)
    elif name == 'chime':                        # to'g'ri javob
        n = int(1.3 * SR); y = np.zeros(n)
        for o, f in [(0, 1046.5), (0.11, 1568)]:
            i = int(o * SR); m = n - i; t = np.arange(m) / SR
            y[i:] += (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 3 * f * t)) * _env(m, 0.004, 0.33)
    elif name == 'tick':                         # sanoq
        n = int(0.06 * SR); t = np.arange(n) / SR
        y = np.sin(2 * np.pi * 1700 * t) * _env(n, 0.001, 0.012)
    else: raise KeyError(name)
    return y / (np.abs(y).max() + 1e-9)


VOL = {'whoosh': 0.085, 'whoosh2': 0.08, 'pop': 0.10, 'thud': 0.20, 'shimmer': 0.05, 'chime': 0.09, 'tick': 0.06}


def mix(events):
    """events: [[nom, soniya, kuch(ixtiyoriy)], ...] -> mix.wav (narr.wav + effektlar)"""
    with wave.open(f'{D}/narr.wav') as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64) / 32767
    cache = {}
    for ev in events:
        name, t = ev[0], ev[1]; k = ev[2] if len(ev) > 2 else 1
        if name not in cache: cache[name] = sfx(name)
        y = cache[name] * VOL[name] * k; i = int(t * SR)
        if i < 0 or i >= len(x): continue
        m = min(len(y), len(x) - i); x[i:i + m] += y[:m]
    wav_write(f'{D}/mix.wav', x)
    return len(events)


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'matn':
        for k, v in TXT.items():
            if not os.path.exists(f'{D}/ovoz/{k}.mp3'): print(k, len(eleven(v)), eleven(v), sep='\t')
    else: main()
