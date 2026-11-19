#!/usr/bin/env python3
"""Grammatika videosi: ovoz bo'laklarini tayyorlash va vaqt jadvali (tl.json, narr.wav).
Har bo'lak ElevenLabs'da ALOHIDA yasalgan (ovoz/NAME.mp3) — bu yerda kesilmaydi, faqat chetdagi jimlik olinadi,
balandlik tenglanadi va ketma-ket teriladi. Ishga tushirish: python3 prep.py"""
import subprocess, json, wave, os, sys
import numpy as np

D = os.path.dirname(os.path.abspath(__file__))
SR = 44100
HOP = int(SR * 0.01)

# Talaffuz ro'yxati (20.11.2026, foydalanuvchi tanlovi — tovush belgisi, «3-variant»): ovoz matnida arabcha so'z va harf nomi shunday yoziladi.
#   كَانَ  -> /ˈkaːna/  (qo'shimcha bilan: /ˈkaːnaniŋ/, /ˈkaːnaɡa/)      مَا -> /maː/      لَا -> /laː/
#   ت -> "ta"   ي -> "ya"   (o'zbekcha «to», «yo», «mo», «lo» emas — «to» ط bo'lib eshitiladi)
# Bo'lak boshida kelgan qo'shimchali shakl qisqa chiqadi — oldiga so'z qo'yiladi («Agar …», «Endi …»). Tekshiruv: tekshir.py (k–n oralig'i).
# Ovozga berilgan matnlar (o'zbekcha — Davronbek, lotincha; arabcha — Abdullah, tanvin «نْ» bilan — vaqfsiz o'qilishi uchun).
# «|» — ekrandagi qadam shu joyda almashadi (gap ichidagi pauza izlanadi).
TXT = {
 'u0': "Bitta so'z gapning oxirini o'zgartirib yuboradi. | Bu so'z — /ˈkaːna/.",
 'u1': "Mana oddiy gap: tolib kattadir. | Mubtado ham, xabar ham raf holatida. | Oxirlarida zamma turibdi.",
 'u2': "Endi gap boshiga /ˈkaːna/ keladi. | Mubtado /ˈkaːnaniŋ/ ismi deb ataladi | va raf holicha qoladi. | Xabar esa /ˈkaːnaniŋ/ xabari bo'lib, | nasb qilinadi. | Zamma fathaga aylanadi.",
 'u3': "Demak, /ˈkaːnaniŋ/ ismi — raf, | xabari — nasb. | /ˈkaːna/ noqis fe'l sanaladi, chunki u fo'il bilan ishlamaydi.",
 'u4': "Tarjimasi: qadimgi voqea haqida bo'lsa — \"edi\", | yaqinda bo'lgan voqea haqida bo'lsa — \"bo'ldi\".",
 'u5': "Agar /ˈkaːnaniŋ/ ismi muannas bo'lsa, /ˈkaːnaɡa/ muannaslik harfi | \"ta\" qo'shiladi. | Ikki sukun yo'liqmasligi uchun, u keyingi so'zga | kasra bilan bog'lanadi.",
 'u6a': "Nasb alomati so'zga qarab o'zgaradi. | Birlikda — fatha. | Ikkilikda esa — \"ya\" harfi.",
 'u6b': "Muannas ko'plikda — fathaga o'rinbosar kasra.",
 'u7a': "Endi /ˈkaːnaniŋ/ muzorisi. U ham xuddi shunday ishlaydi va | \"bo'ladi\" deb tarjima qilinadi.",
 'u7b': "Inkor uchun mozi oldidan | /maː/, | muzori oldidan esa | /laː/ qo'shiladi.",
 'u8a': "Xulosa. | /ˈkaːna/ mubtado va xabar oldidan keladi. | Ismi — raf, | xabari — nasb. | Endi savol: bo'sh joyga qaysi biri to'g'ri keladi?",
 'u8b': "To'g'ri javob — fathalisi, chunki u /ˈkaːnaniŋ/ xabari. | Keyingi videoda: /ˈkaːna/ va zamirlar.",
 'a1': "اَلطَّالِبُ كَبِيرُنْ.", 'a2': "كَانَ الطَّالِبُ كَبِيرَنْ.", 'a5': "كَانَتِ الطَّالِبَةُ كَبِيرَتَنْ.",
 'a6b': "كَانَ الطَّالِبَانِ كَبِيرَيْنِ.", 'a6c': "كَانَتِ الطَّالِبَاتُ كَبِيرَاتِنْ.", 'a7a': "يَكُونُ الطَّالِبُ كَبِيرَنْ.",
 'a7b': "مَا كَانَ الطَّالِبُ كَبِيرَنْ.", 'a8': "كَانَ الْجَوُّ جَمِيلَنْ.",
}
# Sahnalar: ('lead'|'gap', soniya) yoki bo'lak nomi
SEQ = [
 ('S0', [('lead', 1.0), 'u0', ('gap', 1.6)]),
 ('S1', [('lead', 0.6), 'a1', ('gap', 0.35), 'u1', ('gap', 0.45)]),
 ('S2', [('lead', 0.0), 'u2', ('gap', 0.35), 'a2', ('gap', 0.9)]),
 ('S3', [('lead', 0.6), 'u3', ('gap', 0.4), 'u4', ('gap', 0.8)]),
 ('S5', [('lead', 0.6), 'u5', ('gap', 0.35), 'a5', ('gap', 0.9)]),
 ('S6', [('lead', 0.6), 'u6a', ('gap', 0.3), 'a6b', ('gap', 0.4), 'u6b', ('gap', 0.3), 'a6c', ('gap', 0.9)]),
 ('S7', [('lead', 0.6), 'u7a', ('gap', 0.3), 'a7a', ('gap', 0.5), 'u7b', ('gap', 0.3), 'a7b', ('gap', 0.9)]),
 ('S8', [('lead', 0.6), 'u8a', ('gap', 2.6), 'a8', ('gap', 0.45), 'u8b', ('gap', 2.2)]),
]
# Qadam vaqtlari (bo'lak boshidan, soniya) — pauzalarga qarab qo'lda belgilangan; yo'q bo'lak uchun cues() avtomat topadi.
CUE = {
 'u0': [0, 4.02],
 'u1': [0, 2.54, 5.47],
 'u2': [0, 2.16, 4.24, 5.98, 8.22, 9.38],
 'u3': [0, 2.58, 4.14],
 'u4': [0, 2.95, 3.67, 5.9],
 'u5': [0, 3.97, 5.17, 8.03],
 'u6a': [0, 2.62, 4.34],
 'u6b': [0, 1.62],
 'u7a': [0, 3.7],
 'u7b': [0, 1.7, 2.44, 3.8],
 'u8a': [0, 0.88, 3.8, 5.1, 6.64],
 'u8b': [0, 4.3],
}
TARGET = {'u': 10 ** (-21 / 20), 'a': 10 ** (-21 / 20)}   # faol qismning RMS darajasi


def load(n):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{D}/ovoz/{n}.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def rms_db(x):
    n = len(x) // HOP
    fr = x[:n * HOP].reshape(n, HOP)
    r = np.sqrt((fr ** 2).mean(axis=1) + 1e-12)
    r = np.convolve(r, np.ones(3) / 3, mode='same')
    return 20 * np.log10(r + 1e-9)


def prep(n):
    x = load(n)
    db = rms_db(x)
    thr = db.max() - 38
    act = np.where(db > thr)[0]
    a, b = max(0, act[0] * HOP - int(0.03 * SR)), min(len(x), (act[-1] + 1) * HOP + int(0.16 * SR))
    y = x[a:b].copy()
    fi, fo = int(0.008 * SR), int(0.07 * SR)
    y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    d2 = rms_db(y); on = d2 > (d2.max() - 30)
    g = TARGET[n[0]] / np.sqrt((y[:len(on) * HOP].reshape(-1, HOP)[on] ** 2).mean())
    y *= g
    pk = np.abs(y).max()
    if pk > 0.9: y *= 0.9 / pk
    # ichki pauzalar (>= 0.14 s)
    sil = d2 < (d2.max() - 32); pauses = []; i = 0
    while i < len(sil):
        if sil[i]:
            j = i
            while j < len(sil) and sil[j]: j += 1
            if (j - i) * 0.01 >= 0.14 and i > 5 and j < len(sil) - 5: pauses.append((i * 0.01, j * 0.01))
            i = j
        else: i += 1
    return y, pauses


def cues(n, dur, pauses):
    seg = [s.strip() for s in TXT[n].split('|')]
    if len(seg) == 1: return [0.0], []
    L = [sum(c.isalpha() for c in s) for s in seg]; tot = sum(L); out = [0.0]; how = []; acc = 0; last = 0.0
    for k in range(len(seg) - 1):
        acc += L[k]; exp = dur * acc / tot
        cand = [p for p in pauses if p[1] > last + 0.25]
        best = min(cand, key=lambda p: abs((p[0] + p[1]) / 2 - exp)) if cand else None
        if best and abs((best[0] + best[1]) / 2 - exp) < max(0.9, 0.16 * dur):
            t = best[1] - 0.06; how.append('p')
        else:
            t = exp; how.append('~')
        out.append(round(t, 3)); last = t
    return out, how


def main():
    clips = {}; t = 0.0; scenes = []; parts = []
    for sid, items in SEQ:
        s0 = t
        for it in items:
            if isinstance(it, tuple): t += it[1]; continue
            y, pauses = prep(it); dur = len(y) / SR
            cu, how = (CUE[it], ['q']) if it in CUE else cues(it, dur, pauses)
            clips[it] = {'s': round(t, 3), 'e': round(t + dur, 3), 'c': [round(t + c, 3) for c in cu]}
            parts.append((t, y))
            print(f"{it:4s} {dur:5.2f}s  start {t:6.2f}  pauses {[(round(a,2),round(b,2)) for a,b in pauses]}  cues {cu} {''.join(how)}")
            t += dur
        scenes.append({'id': sid, 's': round(s0, 3), 'e': round(t, 3)})
    total = np.ceil(t * 30) / 30
    out = np.zeros(int(total * SR) + 1)
    for st, y in parts:
        i = int(st * SR); out[i:i + len(y)] += y
    pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
    with wave.open(f'{D}/narr.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    tl = {'dur': round(float(total), 3), 'fps': 30, 'clips': clips, 'scenes': scenes}
    json.dump(tl, open(f'{D}/tl.json', 'w'), indent=1)
    open(f'{D}/tl.js', 'w').write('window.TL=' + json.dumps(tl) + ';')
    print('total', total, 's;', len(parts), 'clips')


if __name__ == '__main__':
    main()
