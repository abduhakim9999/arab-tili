# Arabcha (to'liq harakatli) so'z -> IPA (ElevenLabs v4 uchun, lug'at so'zini vaqfsiz o'qitish)
C = {'ء':'ʔ','أ':'ʔ','إ':'ʔ','ؤ':'ʔ','ئ':'ʔ','ب':'b','ت':'t','ث':'θ','ج':'dʒ','ح':'ħ','خ':'x','د':'d','ذ':'ð','ر':'r',
     'ز':'z','س':'s','ش':'ʃ','ص':'sˤ','ض':'dˤ','ط':'tˤ','ظ':'ðˤ','ع':'ʕ','غ':'ɣ','ف':'f','ق':'q','ك':'k','ل':'l','م':'m',
     'ن':'n','ه':'h','و':'w','ي':'j','ة':'t'}
V = {'َ':'a','ُ':'u','ِ':'i','ً':'an','ٌ':'un','ٍ':'in'}
SUK, SHD = 'ْ', 'ّ'
MARKS = set(V) | {SUK, SHD}
def units(w):
    out = []
    for ch in w:
        if ch in MARKS and out: out[-1][1].append(ch)
        elif ch not in '؟?!.،': out.append([ch, []])
    return out
def ipa(w):
    u = units(w.strip()); s = ''
    for k, (ch, m) in enumerate(u):
        v = ''.join(V[x] for x in m if x in V); sh = SHD in m
        prev = u[k-1] if k else None; pv = [x for x in (prev[1] if prev else []) if x in V]
        if ch == 'آ': s += 'ʔaː'; continue
        if ch == 'ا':
            if k == 0: s += 'ʔ' + v; continue          # so'z boshidagi alif (hamzat vasl ham) — yakka so'zda ʔ
            if pv and V[pv[0]] == 'an': continue      # ـًا
            if not m: s += 'ː'; continue              # cho'ziq a
        if ch == 'ى':
            if pv and V[pv[0]] == 'an': continue
            s += 'ː'; continue
        if ch in 'وي' and not m and pv and V[pv[0]] == ('u' if ch == 'و' else 'i'): s += 'ː'; continue
        if ch == 'ل' and not m and k + 1 < len(u) and SHD in u[k+1][1] and k == 1: continue  # quyosh harfi
        c = C[ch]; s += (c[0] + c if sh else c) + v
    return '/' + s + '/'
def last_vowel(w):
    u = units(w.strip()); ch, m = u[-1]
    return any(x in V for x in m)
if __name__ == '__main__':
    import json, sys
    HW = json.load(open(sys.argv[1], encoding='utf-8'))
    for i, w in enumerate(HW):
        if last_vowel(w): print(i, w, ipa(w))
