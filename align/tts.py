# align/tts/NAME.txt (1-qator: ovoz, qolgani: matn) -> align/out/NAME.mp3 + NAME.words.json (so'z vaqtlari)
import asyncio, glob, json, os, edge_tts
async def one(f):
    n = os.path.basename(f)[:-4]; o = 'align/out/%s.mp3' % n
    if os.path.exists(o): return
    lines = open(f, encoding='utf-8').read().split('\n', 1)
    voice, text = lines[0].strip(), lines[1].strip()
    c = edge_tts.Communicate(text, voice, rate='-15%', boundary='WordBoundary')
    W = []
    with open(o, 'wb') as fp:
        async for ch in c.stream():
            if ch['type'] == 'audio': fp.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                W.append([ch['text'], round(ch['offset'] / 1e7, 3), round((ch['offset'] + ch['duration']) / 1e7, 3)])
    json.dump(W, open('align/out/%s.words.json' % n, 'w'), ensure_ascii=False)
    print(n, len(W))
async def main():
    for f in sorted(glob.glob('align/tts/*.txt')):
        try: await one(f)
        except Exception as e: print('xato', f, e)
asyncio.run(main())
