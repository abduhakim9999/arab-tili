#!/usr/bin/env python3
"""Eskirgan qoida iboralarini qidiradi (docs/qoidalar/README.md «Qaror yozish tartibi», 28.11.2026).

    python3 src/build/qoida_tekshir.py [qo'shimcha fayl ...]

Ro'yxat — docs/qoidalar/eskirgan.txt (eski ibora<TAB>to'g'ri joy; «re:» — regex).
Qidiradi: docs/**/*.md (tarix.md dan tashqari), CLAUDE.md, src/build/README.md, sessiyadagi skill nusxalari
(/root/.claude/skills/synced/*/{yangi-dars,joyla}/SKILL.md) va argumentdagi fayllar (masalan konspekt nusxasi).
Tarix yozuvi — qatorda «eskirgan», «bekor», «endi», «ilgari», «olib tashlandi», «o'rniga» bo'lsa — sanalmaydi.
Topilsa — chiqish kodi 1.
"""
import glob, os, re, sys

R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
TARIX = re.compile(r"eskirgan|bekor|\bendi\b|ilgari|olib tashlandi|o'rniga|→", re.I)


def royxat():
    out = []
    for q in open(os.path.join(R, 'docs/qoidalar/eskirgan.txt'), encoding='utf-8'):
        q = q.rstrip('\n')
        if not q.strip() or q.startswith('#'):
            continue
        ibora, _, joy = q.partition('\t')
        rx = re.compile(ibora[3:]) if ibora.startswith('re:') else re.compile(re.escape(ibora))
        out.append((ibora, rx, joy))
    return out


def fayllar(extra):
    f = [p for p in glob.glob(os.path.join(R, 'docs/**/*.md'), recursive=True) if not p.endswith('/tarix.md')]
    f += [os.path.join(R, 'CLAUDE.md'), os.path.join(R, 'src/build/README.md')]
    f += sorted(glob.glob('/root/.claude/skills/synced/*/yangi-dars/SKILL.md') + glob.glob('/root/.claude/skills/synced/*/joyla/SKILL.md'))
    return [p for p in f + list(extra) if os.path.isfile(p)]


def main():
    rl, top = royxat(), 0
    for p in fayllar(sys.argv[1:]):
        for n, line in enumerate(open(p, encoding='utf-8', errors='replace'), 1):
            for ibora, rx, joy in rl:
                if rx.search(line) and not TARIX.search(line):
                    top += 1
                    print('TOPILDI: %s:%d  «%s» → %s' % (os.path.relpath(p, R) if p.startswith(R) else p, n, ibora, joy))
    print('eskirgan ibora: %d ta' % top if top else 'eskirgan ibora topilmadi')
    sys.exit(1 if top else 0)


if __name__ == '__main__':
    main()
