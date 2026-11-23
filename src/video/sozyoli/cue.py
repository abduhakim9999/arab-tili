#!/usr/bin/env python3
"""Qadam («|») vaqtlarini haqiqiy ovozdan avtomat topadi va cue.json ga yozadi (bepul; tekshir.py dagi fonema modeli).
Matn (prep.TXT) sodda fonema qatoriga aylantiriladi, model eshitgan vaqtli qator bilan moslanadi (difflib);
har «|» dan keyingi birinchi mos tovush vaqti — qadam vaqti. Chiqishda har qadam yonida kutilgan va eshitilgan bo'lak — ko'z bilan tekshirish uchun.
  python3 cue.py [nom …]   (nomsiz — hamma o'zbekcha bo'laklar; --yozma — cue.json ga yozmaydi)"""
import sys, re, json, difflib
import prep, tekshir

RN = {'ɑ': 'a', 'æ': 'a', 'ɐ': 'a', 'ʌ': 'a', 'ə': 'e', 'ɛ': 'e', 'ɜ': 'e', 'ɪ': 'i', 'ɨ': 'i', 'y': 'u', 'ʊ': 'u', 'ɯ': 'u', 'ɔ': 'o', 'ɒ': 'o', 'ø': 'o', 'œ': 'o',
      'ɡ': 'g', 'ɣ': 'g', 'ʁ': 'g', 'χ': 'x', 'ħ': 'h', 'ɦ': 'h', 'ʔ': '', 'ʕ': '', 'q': 'k', 'ɾ': 'r', 'ɹ': 'r', 'ʀ': 'r', 'j': 'y', 'ʃ': 'S', 'ʒ': 'J', 'ŋ': 'n', 'ɲ': 'n', 'ɫ': 'l',
      'β': 'v', 'w': 'v', 'ʋ': 'v', 'θ': 's', 'ð': 'z', 'ç': 'x', 'ɕ': 'S', 'ʂ': 'S', 'ʐ': 'J', 'ɸ': 'f', 'c': 'k', 'ɟ': 'g'}


def rec(n):                                     # eshitilgan: [(vaqt, belgi)]
    out = []
    for t, p in tekshir.phones(n):
        p = p.replace('dʒ', 'J').replace('tʃ', 'C').replace('ts', 'ts')
        for ch in p:
            if ch in 'ːˈˌ̪̃ʰʲˤ̩̯': continue
            ch = RN.get(ch, ch)
            if ch and not (out and out[-1][1] == ch and t - out[-1][0] < 0.03): out.append((t, ch))
    return out


def exp(n):                                     # kutilgan: belgilar va har «|» ning o'rni
    s = prep.TXT[n].lower().replace('kaana', 'kana').replace('maa', 'ma').replace('jamiyl', 'jamil')
    s = s.replace("o'", 'o').replace("g'", 'g').replace('sh', 'S').replace('ch', 'C').replace('j', 'J').replace('q', 'k').replace("'", '')
    chars = []; marks = []; words = []
    for part in s.split('|'):
        marks.append(len(chars)); words.append(part.strip()[:14])
        chars += [c for c in part if c.isalpha()]
    return chars, marks[1:], words[1:]


def cues(n):
    r = rec(n); e, marks, words = exp(n)
    rc = [c for _, c in r]
    blocks = difflib.SequenceMatcher(None, e, rc, autojunk=False).get_matching_blocks()
    out = [0]; rows = []
    for m, w in zip(marks, words):
        t = None
        for a, b, size in blocks:
            if size and a + size > m:
                i = max(a, m); j = b + (i - a)
                t = r[j][0] - 0.065 * min(i - m, 6)                      # mos tovush qadamdan keyinroq bo'lsa — o'rtacha tovush uzunligicha orqaga
                lo = max((r[k][0] for k in range(j) if r[k][0] < r[j][0]), default=0)     # oldingi tovushdan oldinga o'tmaydi
                if i > m: t = max(t, lo + 0.02)
                break
        t = round(max(out[-1] + 0.05, (t if t is not None else out[-1] + 0.3) - 0.04), 2)
        out.append(t)
        rows.append(f"   {t:6.2f}  {w:<14}  ←  {''.join(c for tt, c in r if t - 0.02 <= tt < t + 0.9)[:12]}")
    return out, rows


if __name__ == '__main__':
    names = [a for a in sys.argv[1:] if not a.startswith('--')] or sorted(k for k in prep.TXT if not prep.AR(k))
    C = dict(prep.CUE)
    for n in names:
        c, rows = cues(n); C[n] = c
        print(n); print('\n'.join(rows))
    if '--yozma' not in sys.argv: json.dump(C, open(f'{prep.D}/cue.json', 'w'), indent=1)
