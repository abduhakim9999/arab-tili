#!/usr/bin/env python3
"""Dars ikonkalarini index.html (var ICO) dan data/ikonka.json ga chiqaradi — «Йўл» xaritasi shu fayldan o'qiydi.
Ikonka qo'shilsa yoki o'zgarsa qayta ishga tushiriladi:  python3 src/build/ikonka.py"""
import json
s = open('index.html', encoding='utf-8').read()
i = s.index('var ICO=') + 8
ico, _ = json.JSONDecoder().raw_decode(s[i:])
out = {k: {'l': v['l'], 's': v['s']} for k, v in ico.items()}
json.dump(out, open('data/ikonka.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('data/ikonka.json:', len(out), 'ta ikonka')
