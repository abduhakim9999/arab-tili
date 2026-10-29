import re,data
L=r'[ء-ي]';Dc='ً-ْٰ'
def check(s):
    bad=[]
    for w in re.findall(r'[ء-يً-ْٰـ]+',s):
        units=re.findall(r'([ء-ي])([ً-ْٰ]*)',w)
        for i,(c,d) in enumerate(units):
            if d: 
                if 'ّ' in d and not re.search('[َ-ًِ-ٍ]',d): bad.append((w,'shadda-no-vowel'))
                continue
            prev=units[i-1][1] if i>0 else ''
            nxt=units[i+1] if i+1<len(units) else None
            if c in 'اآـ': continue
            if nxt and nxt[0]=='ا' and '\u064B' in nxt[1]: continue
            if c=='ل' and i>0 and '\u0650' in units[i-1][1] and units[i-1][0]=='ل' and nxt and '\u0651' in nxt[1]: continue
            if c=='ى' and 'َ' in prev: continue
            if c=='ى' and 'ً' in prev: continue
            if c=='و' and 'ُ' in prev: continue
            if c=='ي' and 'ِ' in prev: continue
            if c=='ل' and i>0 and units[i-1][0]=='ا' and nxt and 'ّ' in nxt[1]: continue
            bad.append((w,c))
    return bad
tot=0
for k,e in data.E.items():
    for h,t in e['a']:
        for b in check(h)+check(t):
            print(k,b);tot+=1
print('issues',tot)
