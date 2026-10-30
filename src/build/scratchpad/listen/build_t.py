# -*- coding: utf-8 -*-
"""Tinglash: bitta yaxlit mp3 (qulf ekranda ham uzilmasin) + markerlar.
Ishlatish: python3 build_t.py N  (ish papkasida: segN.json, uA/uB/uC/arV wav bo'laklari)
Matn yo'lagi (lN.mp3):  sarlavha -> [AR gap, pauza, UZ tarjima, pauza] ...
Lug'at yo'lagi (vN.mp3): sarlavha -> [AR so'z, pauza, UZ ma'no, pauza, AR so'z (takror), pauza] ...
Har manba (dars ovozi, o'zbekcha, arabcha sun'iy ovoz) bir xil balandlikka (-18 LUFS) keltiriladi,
bo'lak chetlariga qisqa fade qo'yiladi — chiqillash bo'lmasin."""
import sys, os, json, re, subprocess
SR = 44100
def run(c): return subprocess.run(c, check=True, capture_output=True, text=True)
def dur(f): return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).stdout)
def lufs(f):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', e)[-1])
def cut(src, dst, a=None, b=None, gain=0.0, fi=0.012, fo=0.04):
    d = (b - a) if a is not None else dur(src)
    af = 'volume=%.2fdB,afade=t=in:d=%.3f,afade=t=out:st=%.3f:d=%.3f' % (gain, fi, max(0, d - fo), fo)
    c = ['ffmpeg', '-v', 'error', '-y'] + (['-ss', '%.3f' % a, '-to', '%.3f' % b] if a is not None else []) + ['-i', src, '-af', af, '-ar', str(SR), '-ac', '1', dst]
    run(c); return dst
def sil(dst, t): run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=%d:cl=mono' % SR, '-t', '%.2f' % t, dst]); return dst
def speech_parts(f, n, mins=(0.45, 0.6, 0.75, 0.9, 1.1, 1.3), noise=-38):
    """Uzun pauzalar bo'yicha bo'laklarga ajratish; aniq n ta chiqadigan chegarani tanlaydi."""
    D = dur(f)
    for m in mins:
        e = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'silencedetect=noise=%ddB:d=%.2f' % (noise, m), '-f', 'null', '-'], capture_output=True, text=True).stderr
        st = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)]
        en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]
        sp, cur = [], 0.0
        for s0, e0 in zip(st, en + [D] * (len(st) - len(en))):
            if s0 - cur > 0.15: sp.append([cur, s0])
            cur = e0
        if D - cur > 0.15: sp.append([cur, D])
        if len(sp) == n: return sp, m
    raise SystemExit('%s: %d ta bo\'lak topilmadi (oxirgisi %d)' % (f, n, len(sp)))
def concat(parts, out, br='64k'):
    lst = out + '.txt'
    open(lst, 'w').write(''.join("file '%s'\n" % os.path.abspath(p) for p in parts))
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ac', '1', '-ar', str(SR), '-b:a', br, out])

def dp_parts(f, texts, noise=-40, mind=0.18):
    """Pauzalar aniq ajralmasa: matn uzunligiga qarab bo'laklarni guruhlash (dinamik dasturlash)."""
    D = dur(f)
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'silencedetect=noise=%ddB:d=%.2f' % (noise, mind), '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]
    ch, cur, gp = [], 0.0, []
    for s0, e0 in zip(st, en):
        if s0 - cur > 0.06: ch.append([cur, s0]); gp.append(e0 - s0)
        cur = e0
    if D - cur > 0.06: ch.append([cur, D]); gp.append(0)
    K, N = len(ch), len(texts)
    L = [len(re.sub(r'[^\w]', '', t)) + 2 for t in texts]
    r = sum(b - a for a, b in ch) / sum(L)
    INF = float('-inf'); F = [[INF] * (N + 1) for _ in range(K + 1)]; P = [[0] * (N + 1) for _ in range(K + 1)]; F[0][0] = 0
    for i in range(1, K + 1):
        for j in range(1, min(i, N) + 1):
            for a in range(j - 1, i):
                if F[a][j - 1] == INF: continue
                d = ch[i - 1][1] - ch[a][0]; ex = r * L[j - 1]
                s = F[a][j - 1] - ((d - ex) / (0.3 + 0.25 * ex)) ** 2 + 6 * gp[i - 1]
                if s > F[i][j]: F[i][j], P[i][j] = s, a
    out, i = [], K
    for j in range(N, 0, -1):
        a = P[i][j]; out.append([ch[a][0], ch[i - 1][1]]); i = a
    return out[::-1]


def line_bounds(seg, SIL, pad=0.06, end_pad=0.3):
    """Gaplar chegarasi (30.10.2026): chegara FAQAT bir gapning oxirgi so'zi tugashi bilan keyingi gapning
    birinchi so'zi boshlanishi orasida bo'ladi. Shu oraliqda jimlik bo'lsa — eng uzun jimlikning o'rtasi,
    bo'lmasa — oraliq o'rtasi. seg: {qator: [boshi, oxiri]} (so'z vaqtlaridan); SIL: [(start, end)] jimliklar.
    Qaytaradi: {qator: [a0, b0]} — kesiladigan joy."""
    lis = sorted(seg); cut = {}
    def gap_cut(e, s):
        best = None
        for x, y in SIL:
            a, b = max(x, e), min(y, s)
            if b - a > 0.02 and (best is None or b - a > best[1] - best[0]): best = (a, b)
        return (best[0] + best[1]) / 2 if best else (e + s) / 2
    for k, li in enumerate(lis):
        a, b = seg[li]
        a0 = gap_cut(seg[lis[k - 1]][1], a) if k else max(0.0, a - 0.25)
        b0 = gap_cut(b, seg[lis[k + 1]][0]) if k + 1 < len(lis) else b + end_pad
        cut[li] = [round(a0, 3), round(b0, 3)]
    return cut


def check_bounds(cut, words):
    """Tekshiruv: har bo'lakda o'z gapining hamma so'zi to'liq bor, boshqa gapning so'zi yo'q.
    words: [(qator, start, end)] — mustaqil manba (ElevenLabs Scribe) bo'yicha. Xato bo'lsa SystemExit."""
    bad = []
    for li, s, e in words:
        a0, b0 = cut[li]
        if s < a0 - 0.02 or e > b0 + 0.02: bad.append('qator %s: so\'z %.2f–%.2f bo\'lakdan (%.2f–%.2f) chiqib qolgan' % (li, s, e, a0, b0))
        for lj, (c0, d0) in cut.items():
            if lj != li and s > c0 + 0.02 and e < d0 - 0.02: bad.append('qator %s so\'zi %s-qator bo\'lagiga tushgan' % (li, lj))
    if bad: raise SystemExit('BO\'LAKLAR XATO:\n' + '\n'.join(bad))
    return True
