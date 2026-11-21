"""«Татбиқ» kitobi muqovasini yasash: src/build/muqova-tatbiq.html → fon/tatbiq.jpg (750×1125, JPEG).
Ishga tushirish (repo ildizidan): python3 src/build/muqova.py
Bob rasmi qo'shilsa yoki o'zgarsa — HTML dagi G ro'yxati yangilanadi va qayta yasaladi (docs/texnik.md 18)."""
import asyncio, io, os
from PIL import Image
from playwright.async_api import async_playwright

ILDIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MANBA = os.path.join(ILDIZ, 'src', 'build', 'muqova-tatbiq.html')
CHIQ = os.path.join(ILDIZ, 'fon', 'tatbiq.jpg')


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 600, 'height': 900}, device_scale_factor=1.25)
        await pg.goto('file://' + MANBA)
        await pg.evaluate('document.fonts.ready')
        await pg.wait_for_timeout(500)
        png = await pg.screenshot()
        await b.close()
    Image.open(io.BytesIO(png)).convert('RGB').save(CHIQ, quality=84, optimize=True, progressive=True)
    print(CHIQ, os.path.getsize(CHIQ), 'bayt')

asyncio.run(main())
