# -*- coding: utf-8 -*-
import re
M = {'а':'a','б':'b','в':'v','г':'g','д':'d','ё':'yo','ж':'j','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
     'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'x','ц':'s','ч':'ch','ш':'sh','ъ':'ʼ','ь':'','э':'e','ю':'yu','я':'ya',
     'ў':'oʻ','қ':'q','ғ':'gʻ','ҳ':'h','ы':'i'}
V = set('аеёиоуэюяў')
def lat(s):
    out = []
    for i, ch in enumerate(s):
        lo = ch.lower(); up = ch != lo
        if lo == 'е':
            prev = s[i-1].lower() if i else ' '
            r = 'ye' if (not prev.isalpha() or prev in V or prev == 'ъ') else 'e'
        elif lo in M: r = M[lo]
        else: out.append(ch); continue
        if up and r: r = r[0].upper() + r[1:]
        out.append(r)
    return ''.join(out)
