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

# kana02 — «كَانَ ва замирлар» (48-dars), yangi tartibdagi 2-video (har mavzuga alohida qisqa video).
# Matn oddiy lotinchada yoziladi; «|» — ekrandagi qadam joyi (qoralamada vaqti matn uzunligiga qarab taxmin qilinadi,
# haqiqiy ovozdan keyin cue.json ga aniq vaqtlar yoziladi — tekshir.py --zich). ElevenLabs matni: python3 prep.py matn
# (arabcha so'zlar talaffuz ro'yxati bo'yicha tovush belgisiga almashadi).
import re
IPA = {'kaananing': '/ˈkaːnaniŋ/', 'kaanaga': '/ˈkaːnaɡa/', 'kaanada': '/ˈkaːnada/', 'kaanuu': '/ˈkaːnuː/', 'kaana': '/ˈkaːna/',
       'kuntum': '/ˈkuntum/', 'kuntu': '/ˈkuntu/', 'kunta': '/ˈkunta/', 'kunnaa': '/ˈkunnaː/', 'katabtu': '/kaˈtabtu/'}
TXT = {
 'u0': "Hamma o'z o'tmishini «edim» bilan eslaydi: |«men tolib edim». |O'tgan safar gapga bir mehmon kirgan edi: |kaana. |Bugun uning o'ziga mehmon keladi — |zamir. |Masalan, «men»: |arabchada u alohida turmaydi, |fe'lning etagiga yopishadi.",
 'u1': "Bu mehmon sizga tanish. |Oddiy fe'lda u foil bo'ladi: |katabtu — |«men yozdim». |Kaanada esa |xuddi shu zamir |uning ismi bo'ladi. |Xabar esa |odatdagidek nasbda.",
 'u2': "Zamir almashsa, kaananing oxiri ham almashadi. |«Ular» — kaanuu. |«Sen» — kunta. |«Siz» — kuntum. |«Men» — kuntu. |«Biz» — kunnaa. |Qolgan shakllar ham shu qolipda — |to'liq jadval ekranda. |«U» deganda, ya'ni uchinchi shaxs birlikda, zamir ko'rinmaydi: |kaana. |Buni keyingi videoda ko'ramiz.",
 'u3': "Xulosa: |kaanaga ulangan zamir — uning ismi, |xabar esa nasbda. |Endi sinab ko'ring: |«Biz xursand edik» — |bo'sh joyga qaysi biri mos?",
 'u3b': "To'g'ri — |kunnaa: |«biz» ulangan. |Keyingi videoda: |zamir ko'rinmasa — |u qayerda?",
 'a0': "كُنْتُ طَالِبَنْ.", 'a6': "كُنَّا فَرِحِينَ.",
}
SEQ = [
 ('S0', [('lead', 0.6), 'u0', ('gap', 0.3), 'a0', ('gap', 0.8)]),
 ('S1', [('lead', 0.2), 'u1', ('gap', 0.8)]),
 ('S2', [('lead', 0.2), 'u2', ('gap', 0.9)]),
 ('S3', [('lead', 0.3), 'u3', ('gap', 2.6), 'a6', ('gap', 0.45), 'u3b', ('gap', 2.4)]),
]
CUE = {}
try: CUE = json.load(open(f'{D}/cue.json'))
except Exception: pass
TARGET = 10 ** (-21 / 20)   # faol qismning RMS darajasi


DRAFT = set()


def toza(t): return t.replace('|', '')


def eleven(t): return re.sub(r"\b(" + '|'.join(IPA) + r")\b", lambda m: IPA[m.group(1).lower()], toza(t), flags=re.I)


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
    if x is None: return np.zeros(int(len(toza(TXT[n])) / 14.0 * SR))          # ovoz yo'q — taxminiy uzunlikdagi jimlik
    db = rms_db(x); act = np.where(db > db.max() - 38)[0]
    a, b = max(0, act[0] * HOP - int(0.03 * SR)), min(len(x), (act[-1] + 1) * HOP + int(0.16 * SR))
    y = x[a:b].copy(); fi, fo = int(0.008 * SR), int(0.07 * SR)
    y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    d2 = rms_db(y); on = d2 > (d2.max() - 30)
    y *= TARGET / np.sqrt((y[:len(on) * HOP].reshape(-1, HOP)[on] ** 2).mean())
    pk = np.abs(y).max()
    if pk > 0.9: y *= 0.9 / pk
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
            cs = CUE.get(it) or (qadam(it, dur) if it[0] == 'u' else [0])
            clips[it] = {'s': round(t, 3), 'e': round(t + dur, 3), 'c': [round(t + c, 3) for c in cs]}
            if it[0] == 'u':                                                    # subtitr bo'laklari (gap bo'yicha)
                gs = [g.strip() for g in re.split(r'(?<=[.?!])\s+', toza(TXT[it])) if g.strip()]; tot = sum(len(g) for g in gs); acc = 0
                for g in gs:
                    subs.append([round(t + dur * acc / tot, 2), round(t + dur * (acc + len(g)) / tot, 2), g]); acc += len(g)
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


def sfx(name):
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
            if k[0] == 'u': print(k, len(eleven(v)), eleven(v), sep='\t')
    else: main()
