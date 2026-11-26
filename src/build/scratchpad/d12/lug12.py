# -*- coding: utf-8 -*-
# 12-dars sahifasiga «hamma so'z» lug'atini yozish: python3 src/build/scratchpad/d12/lug12.py [--kor|--mz]
import os, sys
sys.exit('26.11.2026 dan 12-dars lug\'ati — kitob lug\'ati: python3 src/build/scratchpad/lq/kitob1112.py 12 (lq/k12.py)')
ROOT = '/home/claude/arab-tili'
sys.path.insert(0, ROOT + '/src/build')
from lugat_hamma import run
g = {}; exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'voc12.py'), encoding='utf-8').read(), g)
run(12, g['V'])
