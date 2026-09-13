import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4321/';
const outDir = process.argv[3] ?? 'shots';
const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'mobile-390x844', width: 390, height: 844 },
];
// Second pass with a stage chosen, so the selected state gets looked at too.
const states = [
  { suffix: '', hash: '' },
  { suffix: '-v0', hash: '#v0' },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

for (const vp of viewports) {
  for (const state of states) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    await page.goto(url + state.hash, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${outDir}/${vp.name}${state.suffix}-full.png`,
      fullPage: true,
    });
    await page.close();
  }
}

await browser.close();
console.log(`screenshots written to ${outDir}/`);
