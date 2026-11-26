# -*- coding: utf-8 -*-
# 11-dars sahifasiga «hamma so'z» lug'atini yozish: python3 src/build/scratchpad/d11/lug11.py [--kor|--mz]
import os, sys
sys.exit('26.11.2026 dan 11-dars lug\'ati — kitob lug\'ati: python3 src/build/scratchpad/lq/kitob1112.py 11 (lq/k11.py)')
ROOT = '/home/claude/arab-tili'
sys.path.insert(0, ROOT + '/src/build')
from lugat_hamma import run
g = {}; exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'voc11.py'), encoding='utf-8').read(), g)
run(11, g['V'])
