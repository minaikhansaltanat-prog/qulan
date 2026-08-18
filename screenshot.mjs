import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const width = parseInt(process.argv[4] || '1440', 10);
const height = parseInt(process.argv[5] || '900', 10);

const outDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const existing = fs.readdirSync(outDir).filter((f) => /^screenshot-(\d+)/.test(f));
const nextN = existing.length
  ? Math.max(...existing.map((f) => parseInt(f.match(/^screenshot-(\d+)/)[1], 10))) + 1
  : 1;
const fileName = `screenshot-${nextN}${label ? '-' + label : ''}.png`;
const outPath = path.join(outDir, fileName);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 500));

// Force lazy-loaded images/videos to resolve before capturing.
await page.evaluate(async () => {
  const distance = 600;
  const delay = 90;
  await new Promise((resolve) => {
    let total = 0;
    const timer = setInterval(() => {
      window.scrollBy(0, distance);
      total += distance;
      if (total >= document.body.scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, delay);
  });
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 900));

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(outPath);
