# -*- coding: utf-8 -*-
"""22.11.2026: «ج» ko'plik «مؤ.» dan keyin yozilgan yozuvlar — ajrat.py ko'plikni muannasga qo'shib yuborardi
(kartada «مؤ.» yonida ko'plik, «ج» bo'sh). Tartib: so'z – (harf) – ج – مؤ. Id saqlanadi (idlar.json kaliti ko'chiriladi)."""
import json, os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'src/build'))
from ajrat import plain

T = {
 73: [("أَسْمَرُ مؤ. سَمْرَاءُ ج سُمْرٌ", "أَسْمَرُ ج سُمْرٌ مؤ. سَمْرَاءُ")],
 94: [("جَدِيدٌ مؤ. جَدِيدَةٌ ج جُدُدٌ", "جَدِيدٌ ج جُدُدٌ مؤ. جَدِيدَةٌ"),
      ("كَرِيمٌ مؤ. كَرِيمَةٌ ج كِرَامٌ", "كَرِيمٌ ج كِرَامٌ مؤ. كَرِيمَةٌ")],
 95: [("جَدِيدٌ مؤ. جَدِيدَةٌ ج جُدُدٌ", "جَدِيدٌ ج جُدُدٌ مؤ. جَدِيدَةٌ"),
      ("كَرِيمٌ مؤ. كَرِيمَةٌ ج كِرَامٌ", "كَرِيمٌ ج كِرَامٌ مؤ. كَرِيمَةٌ"),
      ("خَاصٌّ مؤ. خَاصَّةٌ (بِـ..)", "خَاصٌّ (بِـ..) مؤ. خَاصَّةٌ")],
 96: [("كَرِيمٌ مؤ. كَرِيمَةٌ ج كِرَامٌ", "كَرِيمٌ ج كِرَامٌ مؤ. كَرِيمَةٌ")],
 97: [("عَرَبِيٌّ مؤ. عَرَبِيَّةٌ ج عَرَبٌ", "عَرَبِيٌّ ج عَرَبٌ مؤ. عَرَبِيَّةٌ")],
}
ip = os.path.join(ROOT, 'src/build/idlar.json')
I = json.load(open(ip, encoding='utf-8'))
for n, R in T.items():
    for p in ('%d.html' % n, 'src/build/outputs/lesson%02d/index.html' % n):
        p = os.path.join(ROOT, p)
        if not os.path.exists(p):
            continue
        s = open(p, encoding='utf-8').read()
        for a, b in R:
            q = json.dumps(a, ensure_ascii=False)
            c = s.count(q)
            assert c == 1, (p, a, c)
            s = s.replace(q, json.dumps(b, ensure_ascii=False))
        open(p, 'w', encoding='utf-8').write(s)
        print(p, len(R))
    for a, b in R:
        k0, k1 = '%d|%s|1' % (n, plain(a)), '%d|%s|1' % (n, plain(b))
        if k0 in I['w']:
            I['w'][k1] = I['w'].pop(k0)
            print('kalit', n, k1)
json.dump(I, open(ip, 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True); open(ip, "a").write("\n")
