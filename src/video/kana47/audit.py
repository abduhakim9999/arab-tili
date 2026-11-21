#!/usr/bin/env python3
"""Ovoz–tasvir mosligini tekshirish (foydalanuvchi, 21.11.2026: «videoni o'zing yana bir marta ko'rib chiqib, tekshirib, to'g'rilab ketasan»):
har «|» qadami uchun o'sha ibora aytib bo'lingan paytdagi kadr olinadi va sahna bo'yicha varaqlarga yig'iladi (audit/S1-1.jpg …);
yonida ro'yxat: vaqt — aytilgan ibora. Ko'z bilan solishtiriladi: ibora nimani aytsa, ekranda o'sha ko'rinib/yorishib turishi kerak.
  python3 audit.py [S3 S9 …]"""
import json, os, subprocess, sys, re
import prep
D = prep.D; TL = json.load(open(f'{D}/tl.json')); C = TL['clips']
SEQ = {sid: [i for i in items if isinstance(i, str)] for sid, items in prep.SEQ}
want = sys.argv[1:] or list(SEQ)
rows = {}
for sid in want:
    r = []
    for n in SEQ[sid]:
        c = C[n]
        if prep.AR(n) and n[0] != 'q': r.append((round((c['s'] + c['e']) / 2, 2), f'{n}: [arabcha o\'qilmoqda] ' + prep.TXT[n])); continue
        parts = prep.TXT[n].split('|')
        for i, p in enumerate(parts):
            a = c['c'][i]; b = c['c'][i + 1] if i + 1 < len(parts) else c['e'] + 0.25
            r.append((round(min(b - 0.08, a + 1.6), 2), f'{n}[{i}] ' + p.strip()))
    rows[sid] = r
ts = sorted({t for r in rows.values() for t, _ in r})
subprocess.run([sys.executable, f'{D}/render.py', 'test'] + [str(t) for t in ts], check=True, stdout=subprocess.DEVNULL)
os.makedirs(f'{D}/audit', exist_ok=True)
for sid, r in rows.items():
    for k in range(0, len(r), 6):
        part = r[k:k + 6]; ins = []
        for t, _ in part: ins += ['-i', f'{D}/test/t{t:07.2f}.jpg']
        n = len(part); fc = ''.join(f'[{i}:v]scale=400:-1[v{i}];' for i in range(n)) + ''.join(f'[v{i}]' for i in range(n)) + (f'hstack=inputs={n}' if n > 1 else 'null')
        out = f'{D}/audit/{sid}-{k // 6 + 1}.jpg'
        subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', fc, '-q:v', '4', out], check=True)
        print(out.replace(D + '/', ''), '|', '  ||  '.join(f'{t:.1f} {lab}' for t, lab in part))
