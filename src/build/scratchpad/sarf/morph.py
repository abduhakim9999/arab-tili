# -*- coding: utf-8 -*-
"""Sulosiy mujarrad fe'llar tasrifi (14 sig'a). Hozircha 1-bob (فَعَلَ – يَفْعِلُ) turlari."""
A, I, U, O, SH = 'َ', 'ِ', 'ُ', 'ْ', 'ّ'
UN, AN, IN = 'ٌ', 'ً', 'ٍ'

# 14 sig'a: (olmosh, nom)
SIGA = [('هُوَ', 'ғоиб'), ('هُمَا', 'ғоибайн'), ('هُمْ', 'ғоибин'), ('هِيَ', 'ғоиба'), ('هُمَا', 'ғоибатайн'), ('هُنَّ', 'ғоибот'),
        ('أَنْتَ', 'мухотаб'), ('أَنْتُمَا', 'мухотабайн'), ('أَنْتُمْ', 'мухотабин'), ('أَنْتِ', 'мухотаба'), ('أَنْتُمَا', 'мухотабатайн'), ('أَنْتُنَّ', 'мухотабот'),
        ('أَنَا', 'мутакаллим ваҳда'), ('نَحْنُ', 'мутакаллим маъал ғайр')]
PRE = ['يَ', 'يَ', 'يَ', 'تَ', 'تَ', 'يَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'أَ', 'نَ']
# mozi qo'shimchalari: (lomning harakati, qo'shimcha)
EM = [(A, ''), (A, 'ا'), (U, 'وا'), (A, 'تْ'), (A, 'تَا'), (O, 'نَ'), (O, 'تَ'), (O, 'تُمَا'), (O, 'تُمْ'), (O, 'تِ'), (O, 'تُمَا'), (O, 'تُنَّ'), (O, 'تُ'), (O, 'نَا')]
ER = [(U, ''), (A, 'انِ'), (U, 'ونَ'), (U, ''), (A, 'انِ'), (O, 'نَ'), (U, ''), (A, 'انِ'), (U, 'ونَ'), (I, 'ينَ'), (A, 'انِ'), (O, 'نَ'), (U, ''), (U, '')]
EJ = [(O, ''), (A, 'ا'), (U, 'وا'), (O, ''), (A, 'ا'), (O, 'نَ'), (O, ''), (A, 'ا'), (U, 'وا'), (I, 'ي'), (A, 'ا'), (O, 'نَ'), (O, ''), (O, '')]
MUX = [6, 7, 8, 9, 10, 11]          # mухотаб sig'alari
GOIB = [0, 1, 2, 3, 4, 5, 12, 13]   # amri g'oib (лом билан)
EI = [UN, A + 'انِ', U + 'ونَ', A + 'ةٌ', A + 'تَانِ', A + 'اتٌ']   # ism: muz. birlik, ikki, ko'p; mu'an. birlik, ikki, ko'p

def pre_maj(p): return p[0] + U

def salim(f, a, l, mv=A, uv=I):
    T = {}
    T['mm'] = [f + A + a + mv + l + v + s for v, s in EM]
    T['mj'] = [f + U + a + I + l + v + s for v, s in EM]
    T['rm'] = [PRE[k] + f + O + a + uv + l + v + s for k, (v, s) in enumerate(ER)]
    T['rj'] = [pre_maj(PRE[k]) + f + O + a + A + l + v + s for k, (v, s) in enumerate(ER)]
    J = [PRE[k] + f + O + a + uv + l + v + s for k, (v, s) in enumerate(EJ)]
    JJ = [pre_maj(PRE[k]) + f + O + a + A + l + v + s for k, (v, s) in enumerate(EJ)]
    hw = 'اُ' if uv == U else 'اِ'
    T['amr'] = [hw + f + O + a + uv + l + EJ[k][0] + EJ[k][1] for k in MUX]
    return T, J, JJ

def common(T, J, JJ):
    T['jahd'] = ['لَمْ ' + x for x in J]
    T['nafy'] = ['لَا ' + x for x in T['rm']]
    T['ag'] = ['لِ' + J[k] for k in GOIB]
    T['nahy'] = ['لَا ' + x for x in J]
    return T

def isms(foil, maful):
    return {'foil': [foil + e for e in EI], 'maful': [maful + e for e in EI]}

def conj(r, typ, mv=A, uv=I):
    """r — o'zak harflari (3 ta). typ — tur."""
    f, a, l = r
    if typ == 'misol_mz': typ = 'mudoaf'
    if typ in ('salim',):
        T, J, JJ = salim(f, a, l, mv, uv)
        T.update(isms(f + A + 'ا' + a + I + l, 'مَ' + f + O + a + U + 'و' + l))
    elif typ == 'misol_w':          # وَثَبَ – يَثِبُ : muzore'da و tushadi
        T, J, JJ = salim(f, a, l, mv, uv)
        T['rm'] = [PRE[k] + a + uv + l + v + s for k, (v, s) in enumerate(ER)]
        J = [PRE[k] + a + uv + l + v + s for k, (v, s) in enumerate(EJ)]
        T['rj'] = [pre_maj(PRE[k]) + 'و' + a + A + l + v + s for k, (v, s) in enumerate(ER)]
        JJ = [pre_maj(PRE[k]) + 'و' + a + A + l + v + s for k, (v, s) in enumerate(EJ)]
        T['amr'] = [a + uv + l + EJ[k][0] + EJ[k][1] for k in MUX]
        T.update(isms(f + A + 'ا' + a + I + l, 'مَ' + f + O + a + U + 'و' + l))
    elif typ == 'misol_y':          # يَسَرَ – يَيْسِرُ : ي tushmaydi
        T, J, JJ = salim(f, a, l, mv, uv)
        T['rj'] = [pre_maj(PRE[k]) + 'و' + a + A + l + v + s for k, (v, s) in enumerate(ER)]   # يُوسَرُ
        JJ = [pre_maj(PRE[k]) + 'و' + a + A + l + v + s for k, (v, s) in enumerate(EJ)]
        T['amr'] = ['اِي' + a + uv + l + EJ[k][0] + EJ[k][1] for k in MUX]                       # اِيسِرْ
        T.update(isms(f + A + 'ا' + a + I + l, 'مَ' + f + O + a + U + 'و' + l))
    elif typ == 'mudoaf':           # فَرَّ – يَفِرُّ
        T = {}
        T['mm'] = [f + A + a + SH + v + s if k < 5 else f + A + a + A + a + O + s for k, (v, s) in enumerate(EM)]
        T['mj'] = [f + U + a + SH + v + s if k < 5 else f + U + a + I + a + O + s for k, (v, s) in enumerate(EM)]
        T['rm'] = [PRE[k] + f + uv + a + SH + v + s if k not in (5, 11) else PRE[k] + f + O + a + uv + a + O + s for k, (v, s) in enumerate(ER)]
        T['rj'] = [pre_maj(PRE[k]) + f + A + a + SH + v + s if k not in (5, 11) else pre_maj(PRE[k]) + f + O + a + A + a + O + s for k, (v, s) in enumerate(ER)]
        def jz(p, fv, av, k, v, s):
            if k in (5, 11): return p + f + O + a + av + a + O + s
            return p + f + fv + a + SH + (A if v == O else v) + s     # لَمْ يَفِرَّ
        J = [jz(PRE[k], uv, uv, k, v, s) for k, (v, s) in enumerate(EJ)]
        JJ = [jz(pre_maj(PRE[k]), A, A, k, v, s) for k, (v, s) in enumerate(EJ)]
        T['amr'] = [(f + uv + a + SH + (A if EJ[k][0] == O else EJ[k][0]) + EJ[k][1]) if k != 11 else ('اُ' if uv == U else 'اِ') + f + O + a + uv + a + O + 'نَ' for k in MUX]
        T.update({'foil': [f + A + 'ا' + a + SH + e for e in EI], 'maful': ['مَ' + f + O + a + U + 'و' + a + e for e in EI]})
    elif typ == 'ajvaf_y':          # بَاعَ – يَبِيعُ
        T = {}
        T['mm'] = [f + A + 'ا' + l + v + s if k < 5 else f + I + l + O + s for k, (v, s) in enumerate(EM)]
        T['mj'] = [f + I + 'ي' + l + v + s if k < 5 else f + I + l + O + s for k, (v, s) in enumerate(EM)]
        T['rm'] = [PRE[k] + f + I + 'ي' + l + v + s if k not in (5, 11) else PRE[k] + f + I + l + O + s for k, (v, s) in enumerate(ER)]
        T['rj'] = [pre_maj(PRE[k]) + f + A + 'ا' + l + v + s if k not in (5, 11) else pre_maj(PRE[k]) + f + A + l + O + s for k, (v, s) in enumerate(ER)]
        J = [PRE[k] + f + I + ('ي' if v != O else '') + l + v + s for k, (v, s) in enumerate(EJ)]
        JJ = [pre_maj(PRE[k]) + f + A + ('ا' if v != O else '') + l + v + s for k, (v, s) in enumerate(EJ)]
        T['amr'] = [f + I + ('ي' if EJ[k][0] != O else '') + l + EJ[k][0] + EJ[k][1] for k in MUX]
        T.update({'foil': [f + A + 'ائِ' + l + e for e in EI], 'maful': ['مَ' + f + I + 'ي' + l + e for e in EI]})
    elif typ in ('noqis_y', 'lafif_m'):   # رَمَى – يَرْمِي ; رَوَى – يَرْوِي (lafif maqrun)
        T = {}
        T['mm'] = [f + A + a + A + 'ى', f + A + a + A + 'يَا', f + A + a + A + 'وْا', f + A + a + A + 'تْ', f + A + a + A + 'تَا'] + \
                  [f + A + a + A + 'يْ' + s for v, s in EM[5:]]
        T['mj'] = [f + U + a + I + 'يَ', f + U + a + I + 'يَا', f + U + a + U + 'وا', f + U + a + I + 'يَتْ', f + U + a + I + 'يَتَا'] + \
                  [f + U + a + I + 'ي' + s for v, s in EM[5:]]
        rm_end = [I + 'ي', I + 'يَانِ', U + 'ونَ', I + 'ي', I + 'يَانِ', I + 'ينَ', I + 'ي', I + 'يَانِ', U + 'ونَ', I + 'ينَ', I + 'يَانِ', I + 'ينَ', I + 'ي', I + 'ي']
        rj_end = [A + 'ى', A + 'يَانِ', A + 'وْنَ', A + 'ى', A + 'يَانِ', A + 'يْنَ', A + 'ى', A + 'يَانِ', A + 'وْنَ', A + 'يْنَ', A + 'يَانِ', A + 'يْنَ', A + 'ى', A + 'ى']
        j_end = [I, I + 'يَا', U + 'وا', I, I + 'يَا', I + 'ينَ', I, I + 'يَا', U + 'وا', I + 'ي', I + 'يَا', I + 'ينَ', I, I]
        jj_end = [A, A + 'يَا', A + 'وْا', A, A + 'يَا', A + 'يْنَ', A, A + 'يَا', A + 'وْا', A + 'يْ', A + 'يَا', A + 'يْنَ', A, A]
        T['rm'] = [PRE[k] + f + O + a + e for k, e in enumerate(rm_end)]
        T['rj'] = [pre_maj(PRE[k]) + f + O + a + e for k, e in enumerate(rj_end)]
        J = [PRE[k] + f + O + a + e for k, e in enumerate(j_end)]
        JJ = [pre_maj(PRE[k]) + f + O + a + e for k, e in enumerate(jj_end)]
        T['amr'] = ['اِ' + f + O + a + j_end[k] for k in MUX]
        foil = [f + A + 'ا' + a + IN, f + A + 'ا' + a + I + 'يَانِ', f + A + 'ا' + a + U + 'ونَ', f + A + 'ا' + a + I + 'يَةٌ', f + A + 'ا' + a + I + 'يَتَانِ', f + A + 'ا' + a + I + 'يَاتٌ']
        m = 'مَ' + f + O + a + I + 'يّ'
        T.update({'foil': foil, 'maful': [m + UN, m + A + 'انِ', m + U + 'ونَ', m + A + 'ةٌ', m + A + 'تَانِ', m + A + 'اتٌ']})
    elif typ == 'lafif_f':          # وَحَى – يَحِي (lafif mafruq / multaviy)
        T = {}
        T['mm'] = [f + A + a + A + 'ى', f + A + a + A + 'يَا', f + A + a + A + 'وْا', f + A + a + A + 'تْ', f + A + a + A + 'تَا'] + [f + A + a + A + 'يْ' + s for v, s in EM[5:]]
        T['mj'] = [f + U + a + I + 'يَ', f + U + a + I + 'يَا', f + U + a + U + 'وا', f + U + a + I + 'يَتْ', f + U + a + I + 'يَتَا'] + [f + U + a + I + 'ي' + s for v, s in EM[5:]]
        rm_end = [I + 'ي', I + 'يَانِ', U + 'ونَ', I + 'ي', I + 'يَانِ', I + 'ينَ', I + 'ي', I + 'يَانِ', U + 'ونَ', I + 'ينَ', I + 'يَانِ', I + 'ينَ', I + 'ي', I + 'ي']
        rj_end = [A + 'ى', A + 'يَانِ', A + 'وْنَ', A + 'ى', A + 'يَانِ', A + 'يْنَ', A + 'ى', A + 'يَانِ', A + 'وْنَ', A + 'يْنَ', A + 'يَانِ', A + 'يْنَ', A + 'ى', A + 'ى']
        j_end = [I, I + 'يَا', U + 'وا', I, I + 'يَا', I + 'ينَ', I, I + 'يَا', U + 'وا', I + 'ي', I + 'يَا', I + 'ينَ', I, I]
        jj_end = [A, A + 'يَا', A + 'وْا', A, A + 'يَا', A + 'يْنَ', A, A + 'يَا', A + 'وْا', A + 'يْ', A + 'يَا', A + 'يْنَ', A, A]
        T['rm'] = [PRE[k] + a + e for k, e in enumerate(rm_end)]                     # يَحِي — و tushadi
        T['rj'] = [pre_maj(PRE[k]) + 'و' + a + e for k, e in enumerate(rj_end)]       # يُوحَى
        J = [PRE[k] + a + e for k, e in enumerate(j_end)]
        JJ = [pre_maj(PRE[k]) + 'و' + a + e for k, e in enumerate(jj_end)]
        T['amr'] = [a + j_end[k] for k in MUX]                                       # حِ، حِيَا، حُوا …
        foil = [f + A + 'ا' + a + IN, f + A + 'ا' + a + I + 'يَانِ', f + A + 'ا' + a + U + 'ونَ', f + A + 'ا' + a + I + 'يَةٌ', f + A + 'ا' + a + I + 'يَتَانِ', f + A + 'ا' + a + I + 'يَاتٌ']
        m = 'مَ' + f + O + a + I + 'يّ'
        T.update({'foil': foil, 'maful': [m + UN, m + A + 'انِ', m + U + 'ونَ', m + A + 'ةٌ', m + A + 'تَانِ', m + A + 'اتٌ']})
    elif typ == 'ajvaf_w':          # قَالَ – يَقُولُ (дَامَ – يَدُومُ)
        T = {}
        T['mm'] = [f + A + 'ا' + l + v + s if k < 5 else f + U + l + O + s for k, (v, s) in enumerate(EM)]
        T['mj'] = [f + I + 'ي' + l + v + s if k < 5 else f + I + l + O + s for k, (v, s) in enumerate(EM)]
        T['rm'] = [PRE[k] + f + U + 'و' + l + v + s if k not in (5, 11) else PRE[k] + f + U + l + O + s for k, (v, s) in enumerate(ER)]
        T['rj'] = [pre_maj(PRE[k]) + f + A + 'ا' + l + v + s if k not in (5, 11) else pre_maj(PRE[k]) + f + A + l + O + s for k, (v, s) in enumerate(ER)]
        J = [PRE[k] + f + U + ('و' if v != O else '') + l + v + s for k, (v, s) in enumerate(EJ)]
        JJ = [pre_maj(PRE[k]) + f + A + ('ا' if v != O else '') + l + v + s for k, (v, s) in enumerate(EJ)]
        T['amr'] = [f + U + ('و' if EJ[k][0] != O else '') + l + EJ[k][0] + EJ[k][1] for k in MUX]
        T.update({'foil': [f + A + 'ائِ' + l + e for e in EI], 'maful': ['مَ' + f + U + 'و' + l + e for e in EI]})
    elif typ == 'noqis_w':          # دَعَا – يَدْعُو
        T = {}
        T['mm'] = [f + A + a + A + 'ا', f + A + a + A + 'وَا', f + A + a + A + 'وْا', f + A + a + A + 'تْ', f + A + a + A + 'تَا'] + \
                  [f + A + a + A + 'وْ' + s for v, s in EM[5:]]
        T['mj'] = [f + U + a + I + 'يَ', f + U + a + I + 'يَا', f + U + a + U + 'وا', f + U + a + I + 'يَتْ', f + U + a + I + 'يَتَا'] + \
                  [f + U + a + I + 'ي' + s for v, s in EM[5:]]
        rm_end = [U + 'و', U + 'وَانِ', U + 'ونَ', U + 'و', U + 'وَانِ', U + 'ونَ', U + 'و', U + 'وَانِ', U + 'ونَ', I + 'ينَ', U + 'وَانِ', U + 'ونَ', U + 'و', U + 'و']
        rj_end = [A + 'ى', A + 'يَانِ', A + 'وْنَ', A + 'ى', A + 'يَانِ', A + 'يْنَ', A + 'ى', A + 'يَانِ', A + 'وْنَ', A + 'يْنَ', A + 'يَانِ', A + 'يْنَ', A + 'ى', A + 'ى']
        j_end = [U, U + 'وَا', U + 'وا', U, U + 'وَا', U + 'ونَ', U, U + 'وَا', U + 'وا', I + 'ي', U + 'وَا', U + 'ونَ', U, U]
        jj_end = [A, A + 'يَا', A + 'وْا', A, A + 'يَا', A + 'يْنَ', A, A + 'يَا', A + 'وْا', A + 'يْ', A + 'يَا', A + 'يْنَ', A, A]
        T['rm'] = [PRE[k] + f + O + a + e for k, e in enumerate(rm_end)]
        T['rj'] = [pre_maj(PRE[k]) + f + O + a + e for k, e in enumerate(rj_end)]
        J = [PRE[k] + f + O + a + e for k, e in enumerate(j_end)]
        JJ = [pre_maj(PRE[k]) + f + O + a + e for k, e in enumerate(jj_end)]
        T['amr'] = ['اُ' + f + O + a + j_end[k] for k in MUX]
        foil = [f + A + 'ا' + a + IN, f + A + 'ا' + a + I + 'يَانِ', f + A + 'ا' + a + U + 'ونَ', f + A + 'ا' + a + I + 'يَةٌ', f + A + 'ا' + a + I + 'يَتَانِ', f + A + 'ا' + a + I + 'يَاتٌ']
        m = 'مَ' + f + O + a + U + 'وّ'
        T.update({'foil': foil, 'maful': [m + UN, m + A + 'انِ', m + U + 'ونَ', m + A + 'ةٌ', m + A + 'تَانِ', m + A + 'اتٌ']})
    elif typ == 'mahmuz_f':         # أَخَذَ – يَأْخُذُ : амри ҳозир хُذْ
        f = 'أ'
        T, J, JJ = salim(f, a, l, mv, uv)
        fx = lambda x: x.replace('أَأْ', 'آ').replace('أُأْ', 'أُو').replace('ُأْ', 'ُؤْ')
        T['rm'] = [fx(x) for x in T['rm']]; T['rj'] = [fx(x) for x in T['rj']]
        J = [fx(x) for x in J]; JJ = [fx(x) for x in JJ]
        T['amr'] = [a + uv + l + EJ[k][0] + EJ[k][1] for k in MUX]      # خُذْ، كُلْ، مُرْ
        T.update(isms('آ' + a + I + l, 'مَأْ' + a + U + 'و' + l))
    else:
        raise ValueError(typ)
    T = common(T, J, JJ)
    T['agj'] = ['لِ' + JJ[k] for k in range(14)]
    T['jahdj'] = ['لَمْ ' + x for x in JJ]
    T['nafyj'] = ['لَا ' + x for x in T['rj']]
    T['nahyj'] = ['لَا ' + x for x in JJ]
    return T

if __name__ == '__main__':
    import sys
    for r, t in [('ضرب', 'salim'), ('فرر', 'mudoaf'), ('وثب', 'misol_w'), ('يسر', 'misol_y'), ('بيع', 'ajvaf_y'), ('رمي', 'noqis_y'), ('روي', 'lafif_m'), ('وحي', 'lafif_f')]:
        T = conj(tuple(r), t)
        print('==', r, t)
        for k in ('mm', 'mj', 'rm', 'rj', 'jahd', 'amr', 'ag', 'foil', 'maful'):
            print(' ', k, ' · '.join(T[k]))
