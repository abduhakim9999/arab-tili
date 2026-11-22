# -*- coding: utf-8 -*-
"""Fe'l boshqaruvi lug'at yozuvida (22.11.2026, foydalanuvchi: «ba'zi so'zlar maf'ul yoki jar harfi bilan ishlaydi — bildirish kerak», «qil»).

Qoida (docs/texnik.md 14): fe'l yozuvining oxirida, qavsda —
  (هُ هُ)       — ikki maf'ul oladi (أَعْطَى، جَعَلَ);
  (عَلَى ..)    — jar harfi bilan.
  Bitta maf'ul «(هُ)» yozilmaydi (22.11.2026, foydalanuvchi: «kerak emas — faqat 2 maf'ulli fe'lda»; lugat_sila_hu.py).
O'zbekcha ma'noda «(...га)», «(...ни)» … — faqat jar harfiga mos qism yoki arabchada maf'ul bo'lib, o'zbekchada «-ни» bo'lmagan joy
(سَاعَدَهُ → «(...га) ёрдам бермоқ», اِتَّبَعَهُ → «(...га) эргашмоқ»).

Nima qiladi: N.html va src/build/outputs/lessonN/index.html dagi VOC, manba vocNN.py, idlar.json kaliti (raqam saqlanadi),
lugat-moziy.json (o'zbekcha ma'no o'zgargan fe'llar). Keyin: python3 src/build/ajrat.py && python3 src/build/tekshir_data.py
Ishlatish (repo ildizidan): python3 src/build/lugat_sila.py   (qayta ishlatilsa — hech narsa o'zgarmaydi)."""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
B = os.path.join(ROOT, 'src', 'build')
HK = re.compile('[ً-ْٰ]')

H, HH = '', ' (هُ هُ)'   # (هُ) 22.11.2026 dan yozilmaydi — lugat_sila_hu.py
# dars: [(eski yozuv, yangi yozuv, yangi uz[0] yoki None, yangi mz[0] yoki None)]
O = {
 92: [
  ("قَالَ – يَقُولُ – قُلْ – قَوْلٌ", H),
  ("جَعَلَ – يَجْعَلُ – اِجْعَلْ – جَعْلٌ", HH),
  ("أَكَلَ – يَأْكُلُ – كُلْ – أَكْلٌ", H),
  ("فَكَّرَ – يُفَكِّرُ – فَكِّرْ – تَفْكِيرٌ (فِي ..)", '', "(...ҳақида) ўйламоқ, фикр юритмоқ", "(...ҳақида) ўйлади, фикр юритди"),
  ("صَحِبَ – يَصْحَبُ – اِصْحَبْ – صُحْبَةٌ", H),
  ("زَارَ – يَزُورُ – زُرْ – زِيَارَةٌ", H),
  ("رَجَا – يَرْجُو – اُرْجُ – رَجَاءٌ", H),
  ("حَاوَلَ – يُحَاوِلُ – حَاوِلْ – مُحَاوَلَةٌ", H),
  ("وَافَقَ – يُوَافِقُ – وَافِقْ – مُوَافَقَةٌ (عَلَى ..)", ''),
  ("شَاءَ – يَشَاءُ – شَأْ – مَشِيئَةٌ", H),
 ],
 94: [
  ("اِعْتَقَدَ – يَعْتَقِدُ – اِعْتَقِدْ – اِعْتِقَادٌ", H),
  ("دَرَسَ – يَدْرُسُ – اُدْرُسْ – دِرَاسَةٌ، دَرْسٌ", H),
  ("تَعَلَّمَ – يَتَعَلَّمُ – تَعَلَّمْ – تَعَلُّمٌ", H),
  ("اِسْتَطَاعَ – يَسْتَطِيعُ – اِسْتَطِعْ – اِسْتِطَاعَةٌ", H),
  ("نَطَقَ – يَنْطِقُ – اِنْطِقْ – نُطْقٌ (بِـ..)", '', "(...ни) талаффуз қилмоқ", "(...ни) талаффуз қилди"),
  ("فَهِمَ – يَفْهَمُ – اِفْهَمْ – فَهْمٌ", H),
  ("أَرَادَ – يُرِيدُ – أَرِدْ – إِرَادَةٌ", H),
  ("فَعَلَ – يَفْعَلُ – اِفْعَلْ – فِعْلٌ", H),
  ("حَفِظَ – يَحْفَظُ – اِحْفَظْ – حِفْظٌ", H),
  ("اِتَّبَعَ – يَتَّبِعُ – اِتَّبِعْ – اِتِّبَاعٌ", H, "(...га) риоя қилмоқ, эргашмоқ", "(...га) риоя қилди, эргашди"),
  ("شَاءَ – يَشَاءُ – شَأْ – مَشِيئَةٌ", H),
 ],
 95: [
  ("كَتَبَ – يَكْتُبُ – اُكْتُبْ – كِتَابَةٌ", H),
  ("ذَكَرَ – يَذْكُرُ – اُذْكُرْ – ذِكْرٌ", H),
  ("أَنْزَلَ – يُنْزِلُ – أَنْزِلْ – إِنْزَالٌ", H),
  ("قَالَ – يَقُولُ – قُلْ – قَوْلٌ", H),
  ("عَقَلَ – يَعْقِلُ – اِعْقِلْ – عَقْلٌ", H),
  ("أَعْطَى – يُعْطِي – أَعْطِ – إِعْطَاءٌ", HH, "(...га) бермоқ", "(...га) берди"),
  ("عَرَفَ – يَعْرِفُ – اِعْرِفْ – مَعْرِفَةٌ", H),
  ("أَقْرَضَ – يُقْرِضُ – أَقْرِضْ – إِقْرَاضٌ", HH),
  ("اِقْتَرَضَ – يَقْتَرِضُ – اِقْتَرِضْ – اِقْتِرَاضٌ (مِنْ ..)", ''),
 ],
 96: [
  ("أَرَادَ – يُرِيدُ – أَرِدْ – إِرَادَةٌ", H),
  ("عَرَفَ – يَعْرِفُ – اِعْرِفْ – مَعْرِفَةٌ", H),
  ("دَرَسَ – يَدْرُسُ – اُدْرُسْ – دِرَاسَةٌ، دَرْسٌ", H),
  ("كَفَى – يَكْفِي – اِكْفِ – كِفَايَةٌ", H, "(...га) кифоя қилмоқ, етарли бўлмоқ", "(...га) кифоя қилди, етарли бўлди"),
  ("وَجَبَ – يَجِبُ – وُجُوبٌ", ' (عَلَى ..)', "(...га) шарт (керак) бўлмоқ", "(...га) шарт (керак) бўлди"),
  ("فَهِمَ – يَفْهَمُ – اِفْهَمْ – فَهْمٌ", H),
  ("شَاءَ – يَشَاءُ – شَأْ – مَشِيئَةٌ", H),
 ],
 97: [
  ("اِقْتَرَضَ – يَقْتَرِضُ – اِقْتَرِضْ – اِقْتِرَاضٌ (مِنْ ..)", ''),
  ("تَرْجَمَ – يُتَرْجِمُ – تَرْجِمْ – تَرْجَمَةٌ (إِلَى ..)", ''),
  ("أَلَّفَ – يُؤَلِّفُ – أَلِّفْ – تَأْلِيفٌ", H),
  ("حَمَلَ – يَحْمِلُ – اِحْمِلْ – حَمْلٌ (إِلَى ..)", ''),
  ("هَجَرَ – يَهْجُرُ – اُهْجُرْ – هَجْرٌ", H),
  ("اِسْتَعْمَلَ – يَسْتَعْمِلُ – اِسْتَعْمِلْ – اِسْتِعْمَالٌ", H),
  ("حَارَبَ – يُحَارِبُ – حَارِبْ – مُحَارَبَةٌ", H),
  ("شَجَّعَ – يُشَجِّعُ – شَجِّعْ – تَشْجِيعٌ", H),
  ("وَجَدَ – يَجِدُ – جِدْ – وُجُودٌ", H),
  ("أَدَّى – يُؤَدِّي – أَدِّ – أَدَاءٌ", H),
 ],
 98: [
  ("حَمَلَ – يَحْمِلُ – حَمْلٌ", H),
  ("سَاعَدَ – يُسَاعِدُ – مُسَاعَدَةٌ", ' (عَلَى ..)', "(...га) ёрдам бермоқ", "(...га) ёрдам берди"),
  ("فَعَلَ – يَفْعَلُ – فِعْلٌ", H),
  ("رَفَعَ – يَرْفَعُ – رَفْعٌ", H),
  ("جَزَى – يَجْزِي – جَزَاءٌ", HH),
  ("أَرَادَ – يُرِيدُ – إِرَادَةٌ", H),
  ("طَلَبَ – يَطْلُبُ – طَلَبٌ (مِنْ ..)", ''),
  ("وَفَّقَ – يُوَفِّقُ – تَوْفِيقٌ (فِي ..)", ''),
 ],
}
# misol tarjimasidagi yashil qism (o'zbekcha ma'nodagi «(...га)» ga mos)
MISOL = {(98, "Менга {ёрдам беринглар}"): "Мен{га} {ёрдам беринглар}"}

MANBA = {92: ['a92/voc92.py', 'a92/voc92h.py'], 94: ['a94/voc94.py'], 95: ['a95/voc95.py'], 96: ['a96/voc96.py'],
         97: ['a97/voc97.py', 'a97/voc97h.py'], 98: ['d98/voc98.py']}


def yangi(eski, q):
    if q.startswith('>'):                           # qavsdagini almashtirish
        return re.sub(r'\s*\([^()]*\)\s*$', '', eski) + ' ' + q[1:]
    return eski + q


def plain(s):
    return HK.sub('', s)


def main():
    idl_p = os.path.join(B, 'idlar.json')
    I = json.load(open(idl_p, encoding='utf-8'))
    M_p = os.path.join(B, 'lugat-moziy.json')
    M = json.load(open(M_p, encoding='utf-8'))
    L = {(r['d'], r.get('yozuv') or r['ar']): r for r in json.load(open(os.path.join(ROOT, 'data', 'lugat.json'), encoding='utf-8'))['s']}
    jami = 0
    for n, ozg in O.items():
        jad = {}
        for t in ozg:
            e, q = t[0], t[1]
            jad[e] = (yangi(e, q) if q else e, t[2] if len(t) > 2 else None, t[3] if len(t) > 3 else None)
        # 1) sahifa va outputs dagi VOC
        for p in ['%d.html' % n, 'src/build/outputs/lesson%d/index.html' % n]:
            fp = os.path.join(ROOT, p)
            if not os.path.exists(fp):
                continue
            s = open(fp, encoding='utf-8').read()
            m = re.search(r'var VOC=(\[.*?\]);\n', s, re.S)
            V = json.loads(m.group(1))
            ok = 0
            for v in V:
                if v[1] in jad:
                    yz, uz, _ = jad[v[1]]
                    v[1] = yz
                    if uz:
                        v[2][0] = uz
                    ok += 1
                for x in v[3]:
                    if (n, x[1]) in MISOL:
                        x[1] = MISOL[(n, x[1])]
            yangiV = 'var VOC=' + json.dumps(V, ensure_ascii=False) + ';\n'
            s = s[:m.start()] + yangiV + s[m.end():]
            open(fp, 'w', encoding='utf-8').write(s)
            print('%s: %d yozuv' % (p, ok))
        # 2) manba
        for f in MANBA.get(n, []):
            fp = os.path.join(B, 'scratchpad', f)
            if not os.path.exists(fp):
                continue
            s = s0 = open(fp, encoding='utf-8').read()
            for e, (yz, uz, mz) in jad.items():
                if yz != e:
                    s = s.replace('"%s"' % e, '"%s"' % yz)
                i = s.find('"%s"' % yz) if uz else -1
                if i >= 0:                              # shu yozuv qatori: keyingi « (» gacha
                    j = s.find('[', i)
                    k = s.find(']', j)
                    s = s[:j] + '["%s"]' % uz + s[k + 1:]
                    oxir = s.find('\n (', i + 1)
                    oxir = len(s) if oxir < 0 else oxir
                    a = s.find('mz=[', i, oxir)
                    if mz and a >= 0:
                        b = s.find(']', a)
                        s = s[:a] + 'mz=["%s"]' % mz + s[b + 1:]
            for (dn, a), b in MISOL.items():
                if dn == n:
                    s = s.replace('"%s"' % a, '"%s"' % b)
            if s != s0:
                open(fp, 'w', encoding='utf-8').write(s)
                print('  manba %s' % f)
        # 3) idlar.json kaliti (raqam saqlanadi) va lugat-moziy.json
        for e, (yz, uz, mz) in jad.items():
            if yz != e:
                for c in range(1, 4):
                    k0, k1 = '%d|%s|%d' % (n, plain(e), c), '%d|%s|%d' % (n, plain(yz), c)
                    if k0 in I['w']:
                        I['w'][k1] = I['w'].pop(k0)
            r = L.get((n, e)) or L.get((n, yz))
            if mz and r:
                M[str(r['id'])] = [mz]
            jami += 1
    open(idl_p, 'w', encoding='utf-8').write(json.dumps(I, ensure_ascii=False, indent=0, sort_keys=True) + '\n')
    open(M_p, 'w', encoding='utf-8').write(json.dumps(M, ensure_ascii=False, indent=0) + '\n')
    print('Jami: %d fe\'l. Endi: python3 src/build/ajrat.py && python3 src/build/tekshir_data.py' % jami)


if __name__ == '__main__':
    main()
