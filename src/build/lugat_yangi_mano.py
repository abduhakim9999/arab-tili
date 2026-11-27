# -*- coding: utf-8 -*-
"""Lug'at: matnda jar harfi bilan boshqa ma'noda kelgan fe'lga alohida yozuv (27.11.2026; docs/qoidalar/lugat.md 8).
Yozuv dars VOC oxiriga qo'shiladi (Eshitish Луғат tartibi buzilmasin), `asl` — asosiy yozuv id (yangi ma'no, o'z kartasi);
o'sha matn o'rni (`w`) asosiy yozuvdan yangisiga o'tadi. Qayta ishlatilsa — hech narsa o'zgarmaydi.
Keyin: ajrat.py (yangi id), lugat-moziy.json ga mz (shu skript ikkinchi marta — `--mz`), yana ajrat.py, tekshir_data.py.
Diqqat: kitob_hamma.py (70) yoki voc95.py qayta ishga tushirilsa — keyin shu skript ham."""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
B = os.path.join(ROOT, 'src', 'build')

# dars: (asosiy kn, ko'chadigan o'rin, yangi VOC qatori, mz)
YANGI = {
    95: ('55', '16-0', ['55.1', 'جَاءَ – يَجِيءُ – جِئْ – مَجِيءٌ (بِـ..)', ['(...ни) олиб келмоқ'],
                        [['{وَجَاءَ} {^بِ}أَسَالِيبَ جَدِيدَةٍ، لَمْ تَعْرِفْهَا الْعَرَبِيَّةُ مِنْ قَبْلُ.',
                          'илгари араб тили билмаган янги услублар{^ни} {олиб келди}.']],
                        {'w': ['16-0'], 'asl': 555}], ['(...ни) олиб келди']),
    70: ('1514.21', '7-2', ['1514.45', 'سَمِعَ – يَسْمَعُ – اِسْمَعْ – سَمْعٌ، سَمَاعٌ (بِـ..)', ['(...ҳақида) эшитмоқ, хабар топмоқ'],
                             [['لَا، لَمْ {أَسْمَعْ} {^بِ}هَا.', 'Йўқ, у {^ҳақида} {эшитмаганман}.']],
                             {'w': ['7-2'], 'asl': 1163}], ['(...ҳақида) эшитди, хабар топди']),
}


def main():
    if '--mz' in sys.argv:
        L = json.load(open(os.path.join(ROOT, 'data', 'lugat.json'), encoding='utf-8'))['s']
        ID = {(r['d'], r['kn']): r['id'] for r in L}
        mp = os.path.join(B, 'lugat-moziy.json')
        s = open(mp, encoding='utf-8').read()
        for n, (_, _, q, mz) in YANGI.items():
            i = ID.get((n, q[0]))
            if i is None or ('"%d": [' % i) in s:
                continue
            s = s.rstrip().rstrip('}').rstrip() + ',\n"%d": [\n%s\n]\n}\n' % (i, ',\n'.join(json.dumps(x, ensure_ascii=False) for x in mz))
            print('mz: %d-dars %s → id %d' % (n, q[0], i))
        json.loads(s)
        open(mp, 'w', encoding='utf-8').write(s)
        return
    for n, (kn, orin, q, _) in YANGI.items():
        for p in ['%d.html' % n, 'src/build/outputs/lesson%d/index.html' % n]:
            fp = os.path.join(ROOT, p)
            if not os.path.exists(fp):
                continue
            s = open(fp, encoding='utf-8').read()
            m = re.search(r'var VOC=(\[.*?\]);\n', s, re.S)
            V = json.loads(m.group(1))
            if any(v[0] == q[0] for v in V):
                continue
            for v in V:
                if v[0] == kn and orin in v[4].get('w', []):
                    v[4]['w'].remove(orin)
            V.append(json.loads(json.dumps(q, ensure_ascii=False)))
            s = s[:m.start()] + 'var VOC=' + json.dumps(V, ensure_ascii=False) + ';\n' + s[m.end():]
            open(fp, 'w', encoding='utf-8').write(s)
            print('%s: + %s' % (p, q[1]))


if __name__ == '__main__':
    main()
