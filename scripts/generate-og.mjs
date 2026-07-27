import { chromium } from 'playwright';

const html = `<!doctype html><html><head><style>
  @font-face { font-family: X; src: local('Arial'); }
  body { margin:0; width:1200px; height:630px; background:#fafaf8; color:#14120f;
         font-family: 'Segoe UI', Arial, sans-serif; display:flex; flex-direction:column;
         justify-content:center; padding:0 96px; box-sizing:border-box; }
  .kicker { color:#e84e0f; font-size:28px; letter-spacing:.02em; }
  h1 { font-size:96px; margin:16px 0 8px; letter-spacing:-0.03em; font-weight:700; }
  p { font-size:34px; color:#5b5750; margin:8px 0 0; max-width:900px; line-height:1.35; }
  .rule { position:absolute; left:96px; right:96px; bottom:80px; border-top:2px solid #d9d6cf; }
  .url { position:absolute; bottom:40px; left:96px; font-size:26px; color:#e84e0f; }
</style></head><body>
  <div class="kicker">Mechatronics &amp; Robotics Engineer</div>
  <h1>Piero Flores</h1>
  <p>Robotic manipulation · autonomous navigation · optical metrology · industrial automation</p>
  <div class="rule"></div>
  <div class="url">pieroscv.com</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png written');
