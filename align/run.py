# align/in/NAME.mp3 -> align/out/NAME.whisper.json (Whisper)
# align/in/NAME.txt bo'lsa -> align/out/NAME.align.json (matnni ovozga majburiy moslash)
import os, json, glob
os.makedirs('align/out', exist_ok=True)
# align/in/NAME.url -> align/out/NAME.mp3 (tashqi havoladan yuklab olish)
import urllib.request
for u in sorted(glob.glob('align/in/*.url')):
    name = os.path.splitext(os.path.basename(u))[0]
    dst = 'align/out/%s.mp3' % name
    if not os.path.exists(dst):
        urllib.request.urlretrieve(open(u).read().strip(), dst)
for mp3 in sorted(glob.glob('align/in/*.mp3')):
    name = os.path.splitext(os.path.basename(mp3))[0]
    txt = 'align/in/%s.txt' % name
    wo = 'align/out/%s.whisper.json' % name
    if not os.path.exists(wo) and not os.path.exists(txt):
        from faster_whisper import WhisperModel
        m = WhisperModel('large-v3', device='cpu', compute_type='int8')
        segs, info = m.transcribe(mp3, language='ar', word_timestamps=True, beam_size=5, vad_filter=False)
        words = [{'text': w.word.strip(), 'start': round(w.start, 3), 'end': round(w.end, 3)} for s in segs for w in s.words]
        json.dump(words, open(wo, 'w'), ensure_ascii=False, indent=0)
    ao = 'align/out/%s.align.json' % name
    if os.path.exists(txt) and not os.path.exists(ao):
        import torch
        from ctc_forced_aligner import (load_audio, load_alignment_model, generate_emissions, preprocess_text,
                                        get_alignments, get_spans, postprocess_results)
        model, tok = load_alignment_model('cpu', dtype=torch.float32)
        wav = load_audio(mp3, model.dtype, model.device)
        em, stride = generate_emissions(model, wav, batch_size=4)
        text = open(txt, encoding='utf-8').read().split()
        ts, tx = preprocess_text(' '.join(text), romanize=True, language='ara')
        segs, scores, blank = get_alignments(em, ts, tok)
        spans = get_spans(ts, segs, blank)
        res = postprocess_results(tx, spans, stride, scores)
        json.dump([{'text': r['text'], 'start': round(r['start'], 3), 'end': round(r['end'], 3)} for r in res],
                  open(ao, 'w'), ensure_ascii=False, indent=0)
