#!/usr/bin/env python3
"""github.io ko'rish manzili uchun yordamchi (src/build/korish.sh chaqiradi; 14.11.2026, docs/texnik.md 1).

    korish.py shim NOM      < sahifa.html  > sahifa.html   — sahifa boshiga korish-shim.js (NOM bilan) qo'yadi
    korish.py sw            < sw.js        > sw.js         — ildizdagi sw.js: /tayyor/ doim internetdan (main da bo'lmasa)
    korish.py royxat 'NOM<TAB>SANA<TAB>XABAR' ...    > index.html    — tayyor/ ro'yxati
"""
import sys, re, os, html

HERE = os.path.dirname(os.path.abspath(__file__))


def shim(nom):
    s = sys.stdin.read()
    js = open(os.path.join(HERE, 'korish-shim.js'), encoding='utf-8').read().replace('__NOM__', nom)
    tag = '<script>' + js + '</script>'
    m = re.search(r'<head\b[^>]*>', s, re.I) or re.search(r'<html\b[^>]*>', s, re.I)
    s = s[:m.end()] + tag + s[m.end():] if m else tag + s
    sys.stdout.write(s)


def sw():
    s = sys.stdin.read()
    eski = r"/\/(sinov-[^/]*|shell-s\.(js|css))$/.test("
    if 'tayyor' not in s and eski in s:
        s = s.replace(eski, r"/\/(sinov-[^/]*|shell-s\.(js|css))$|\/tayyor\//.test(", 1)
    elif 'tayyor' not in s:
        sys.stderr.write('ogohlantirish: sw.js da sinov qatori topilmadi — /tayyor/ istisnosi qo`shilmadi\n')
    sys.stdout.write(s)


def royxat(args):
    li = []
    for a in args:
        nom, sana, xabar = (a.split('\t', 2) + ['', ''])[:3]
        li.append('<li><a href="%s/yol.html"><b>%s</b><small>%s · %s</small></a></li>' % (
            html.escape(nom), html.escape(nom), html.escape(sana), html.escape(xabar[:120])))
    sys.stdout.write('''<!DOCTYPE html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Тайёр ишлар — кўриш</title>
<style>body{font:16px/1.4 system-ui,sans-serif;margin:0;padding:20px;background:#f5f3ee;color:#222}h1{font-size:20px}
p{color:#666;font-size:14px}ul{list-style:none;padding:0}li a{display:block;padding:14px 16px;margin:10px 0;border-radius:14px;background:#fff;
border:1px solid #e3ddd0;color:inherit;text-decoration:none}li b{display:block;font-size:17px;color:#0c5e3f}small{color:#777}</style></head><body>
<h1>Тайёр ишлар — сайтга жойланмаган</h1>
<p>Бу ерда натижалар асосий сайтдан алоҳида сақланади; Telegram орқали кириш ишламайди.</p>
<ul>%s</ul>%s</body></html>
''' % ('\n'.join(li), '' if li else '<p>Ҳозир тайёр иш йўқ.</p>'))


if __name__ == '__main__':
    c = sys.argv[1]
    if c == 'shim':
        shim(sys.argv[2])
    elif c == 'sw':
        sw()
    elif c == 'royxat':
        royxat(sys.argv[2:])
