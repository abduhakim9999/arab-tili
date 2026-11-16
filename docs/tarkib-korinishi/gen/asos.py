# -*- coding: utf-8 -*-
# Har bir holat bo'yicha misol gaplar — yangi ko'rinishda. 3 ta rasm chiqaradi.
import asyncio
from playwright.async_api import async_playwright


def w(t, c=''):
    return '<span class="w %s">%s</span>' % (c, t)


def g(cls, *parts):
    return '<span class="%s">%s</span>' % (cls, ' '.join(parts))


P1 = ('1. Асосий ҳолатлар', [
    ('Исмий жумла', w('الْبَيْتُ', 'cm') + ' ' + w('كَبِيرٌ', 'cx') + '.',
     'Уй катта.', 'Мубтадо кўк, хабар қизил.'),
    ('Феълий жумла', w('كَتَبَ', 'cf') + ' ' + w('الطَّالِبُ', 'co') + ' ' + w('الدَّرْسَ', 'cb') + '.',
     'Талаба дарсни ёзди.', 'Феъл жигарранг, фоил бинафша, мафъулун биҳ яшил.'),
    ('Изофа', g('iz l1 bm', w('كِتَابُ', 'cm'), w('الطَّالِبِ')) + ' ' + w('جَدِيدٌ', 'cx') + '.',
     'Талабанинг китоби янги.', 'Ёй — изофа: икки сўз бир бутун. Ёй ранги — музофнинг ранги.'),
    ('Сифат ва мавсуф', w('هَذَا', 'cm') + ' ' + g('sf l1 bx', w('كِتَابٌ', 'cx'), w('جَدِيدٌ')) + '.',
     'Бу — янги китоб.', 'Нуқтали ёй — сифат билан мавсуф.'),
    ('Мутааллиқ — феълга', w('ذَهَبَ', 'cf') + ' ' + w('خَالِدٌ', 'co') + ' ' + g('mt l2 bf', w('إِلَى'), w('الْمَسْجِدِ')) + '.',
     'Холид масжидга борди.', 'Узуқ чизиқ — мутааллиқ. Жигарранг: феълга боғланган.'),
    ('Мутааллиқ — хабарга', w('الْبَيْتُ', 'cm') + ' ' + w('قَرِيبٌ', 'cx') + ' ' + g('mt l2 bx', w('مِنَ'), w('الْمَدْرَسَةِ')) + '.',
     'Уй мактабга яқин.', 'Узуқ чизиқ қизил: хабарга боғланган.'),
])

P2 = ('2. Бир сўз — бир неча вазифа', [
    ('Жар-мажрур ичида изофа',
     w('ذَهَبَ', 'cf') + ' ' + w('خَالِدٌ', 'co') + ' ' + g('mt l2 bf', w('إِلَى'), g('iz l1 bg', w('بَيْتِ'), w('الْمُدِيرِ'))) + '.',
     'Холид мудирнинг уйига борди.', 'Икки қават: юқорида ёй (изофа), пастда узуқ чизиқ (бутун бирикма феълга боғланган).'),
    ('Изофа занжири', g('iz l1 bm', w('مِفْتَاحُ', 'cm'), w('بَابِ'), w('الْبَيْتِ')) + ' ' + w('جَدِيدٌ', 'cx') + '.',
     'Уй эшигининг калити янги.', 'Занжир остида битта узун ёй.'),
    ('Мафъул + музоф + мавсуф',
     '<span class="w"><span class="cf">قَرَأْ</span><span class="co">تُ</span></span> '
     + g('sf l2 bb', g('iz l1 bb', w('كِتَابَ', 'cb'), w('الطَّالِبِ')), w('الْجَدِيدَ')) + '.',
     'Талабанинг янги китобини ўқидим.', 'Яшил сўз — мафъул, музоф ва мавсуф. Юқорида изофа ёйи, пастда сифат ёйи.'),
    ('Бир сўзда феъл, фоил, мафъул',
     '<span class="w"><span class="cf">سَأَلْ</span><span class="co">تُ</span><span class="cb">هُ</span></span> ' + g('mt l2 bf', w('عَنِ'), w('الدَّرْسِ')) + '.',
     'Ундан дарс ҳақида сўрадим.', 'Сўз бўлаклаб бўялади: феъл, фоил (замир), мафъул (замир).'),
    ('Атф', w('جَاءَ', 'cf') + ' ' + w('خَالِدٌ', 'co') + ' ' + g('iz l1 bo', '<span class="w">وَ<span class="co">أَخُو</span>هُ</span>') + '.',
     'Холид ва унинг акаси келди.', 'Маътуф ўзи эргашган сўз рангида (фоилга маътуф — бинафша).'),
])

P3 = ('3. Қийинроқ ҳолатлар', [
    ('Кана', w('كَانَ', 'cf') + ' ' + w('الْجَوُّ', 'cm') + ' ' + w('بَارِداً', 'cx') + '.',
     'Ҳаво совуқ эди.', 'Кана феъл рангида; исми мубтадо, хабари хабар рангида.'),
    ('Инна', w('إِنَّ') + ' ' + w('الْعِلْمَ', 'cm') + ' ' + w('نُورٌ', 'cx') + '.',
     'Албатта, илм — нур.', 'Инна ҳарф, қора; исми мубтадо, хабари хабар рангида.'),
    ('Хабар олдинда', w('فِي', 'cx') + ' ' + w('الْبَيْتِ', 'cx') + ' ' + w('رَجُلٌ', 'cm') + '.',
     'Уйда бир киши бор.', 'Жар-мажрур хабар бўлиб келган — қизил; мубтадо кейинда — кўк.'),
    ('Мажҳул феъл', w('كُتِبَ', 'cf') + ' ' + w('الدَّرْسُ', 'co') + '.',
     'Дарс ёзилди.', 'Ноиби фоил — фоил рангида.'),
    ('Ҳол ва зарф', w('جَاءَ', 'cf') + ' ' + w('خَالِدٌ', 'co') + ' ' + w('مَاشِياً') + ' ' + w('صَبَاحاً') + '.',
     'Холид эрталаб пиёда келди.', 'Ҳол ва зарф қора, чизиқсиз. Аниқ номи ичкарида.'),
    ('Жумла — хабар', w('الطَّالِبُ', 'cm') + ' ' + g('jm jx', w('يَكْتُبُ', 'cf'), w('الدَّرْسَ', 'cb')) + '.',
     'Талаба дарс ёзяпти.', 'Ички жумла хабар бўлиб келган: фони оч қизил. Ичидаги сўзлар ўз рангида.'),
    ('Сила жумласи',
     w('جَاءَ', 'cf') + ' ' + g('sf l1 bo', w('الطَّالِبُ', 'co'), w('الَّذِي')) + ' ' + g('jm jg', w('كَتَبَ', 'cf'), w('الدَّرْسَ', 'cb')) + '.',
     'Дарсни ёзган талаба келди.', 'Ички жумла устун эмас: фони кулранг. «Аллази» мавсуфига нуқтали ёй билан боғланган.'),
])

CSS = '''
@font-face{font-family:DarsNaskh;src:url('file:///home/claude/arab-tili/naskh.woff') format('woff')}
*{box-sizing:border-box}
body{margin:0;padding:20px;background:#d9d6cc;font-family:Roboto,'Noto Sans',system-ui,sans-serif;color:#1c1f1d;display:flex;gap:20px;align-items:flex-start}
.ph{width:390px;background:#f7f5ef;display:flex;flex-direction:column;padding:16px;gap:12px}
.sec{font-size:17px;font-weight:700;line-height:22px}
.lg{display:flex;flex-direction:column;gap:7px;padding:0 2px 12px;border-bottom:1px solid #ebe6da;font-size:12.5px;line-height:18px}
.lg .r{display:flex;flex-wrap:wrap;gap:5px 14px;align-items:center}
.lg .it{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.lg i{display:inline-block;width:9px;height:9px;border-radius:2px}
.lg u{display:inline-block;width:26px;height:7px;text-decoration:none;border-bottom:2px solid #6b716c}
.lg u.a{border-radius:0 0 8px 8px}
.lg u.d{border-bottom:2.5px dotted #6b716c;border-radius:0 0 8px 8px}
.lg u.m{border-bottom-style:dashed}
.lg u.j{height:14px;width:26px;border:0;border-radius:4px;background:#fbe2dd}
.ex{background:#fff;border:1px solid #ebe6da;border-radius:18px;padding:10px 16px 12px}
.k{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:#454b47}
.k b{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#e3efe8;color:#0b5e3c;font-size:11.5px}
.ar{font-family:DarsNaskh,'Noto Naskh Arabic',serif;direction:rtl}
p.s{margin:0;font-size:27px;line-height:2.7;text-align:right;padding-bottom:14px}
.w{white-space:nowrap}
.cm{color:#1f5fd1}.cx{color:#d23b2a}.cf{color:#946200}.co{color:#5b3fd9}.cb{color:#13893a}
.iz,.sf,.mt,.jm{-webkit-box-decoration-break:clone;box-decoration-break:clone}
.l1{padding-bottom:6px}.l2{padding-bottom:15px}
.iz{border-bottom:2px solid;border-radius:0 0 12px 12px}
.sf{border-bottom:2.5px dotted;border-radius:0 0 12px 12px}
.mt{border-bottom:2px dashed}
.bm{border-color:#1f5fd1}.bx{border-color:#d23b2a}.bf{border-color:#946200}.bo{border-color:#5b3fd9}.bb{border-color:#13893a}.bg{border-color:#a3a8a3}
.jm{border-radius:8px;padding:3px 5px}
.jx{background:#fbe2dd}.jg{background:#e9e6dd}
.tr{margin:0;font-size:13.5px;line-height:19px;color:#1c1f1d}
.nt{margin:3px 0 0;font-size:12px;line-height:16px;color:#6b716c}
'''

LEG = '''<div class="lg">
<div class="r"><span class="it"><i style="background:#1f5fd1"></i>Мубтадо</span><span class="it"><i style="background:#d23b2a"></i>Хабар</span>
<span class="it"><i style="background:#946200"></i>Феъл</span><span class="it"><i style="background:#5b3fd9"></i>Фоил</span>
<span class="it"><i style="background:#13893a"></i>Мафъулун биҳ</span></div>
<div class="r"><span class="it"><u class="a"></u>изофа</span><span class="it"><u class="d"></u>сифат</span>
<span class="it"><u class="m"></u>мутааллиқ</span><span class="it"><u class="j"></u>ички жумла</span></div>
</div>'''


