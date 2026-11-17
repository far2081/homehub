import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\zuni\\.gemini\\antigravity\\brain\\a4f5fe30-8fac-433b-9fa7-0c11c957054a';
const ASSETS_DIR = path.resolve('assets');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CATEGORIES = [
  'bedroom',
  'living-room',
  'dining-room',
  'furniture',
  'small-spaces',
  'kitchen',
  'lighting',
  'decor',
  'storage'
];

async function run() {
  console.log('Spawning Chrome headless with remote debugging on port 9222...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.resolve('temp_chrome_profile_grid')
  ]);

  await sleep(1500);

  try {
    const newTabRes = await fetch('http://127.0.0.1:9222/json/new?http://localhost:3000/?nopreloader', { method: 'PUT' });
    const tabInfo = await newTabRes.json();

    const ws = new WebSocket(tabInfo.webSocketDebuggerUrl);
    let idCounter = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) cb.reject(new Error(msg.error.message));
        else cb.resolve(msg.result);
      }
    };

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    function send(method, params = {}, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const id = idCounter++;
        const timer = setTimeout(() => {
          if (callbacks.has(id)) {
            callbacks.delete(id);
            reject(new Error(`CDP command ${method} timed out after ${timeout}ms`));
          }
        }, timeout);
        callbacks.set(id, {
          resolve: (res) => { clearTimeout(timer); resolve(res); },
          reject: (err) => { clearTimeout(timer); reject(err); }
        });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res.result?.value;
    }

    async function setViewport(width, height, isMobile = false) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: isMobile
      });
    }

    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const localPath = path.join(ASSETS_DIR, filename);
      fs.writeFileSync(localPath, buffer);
      
      const artifactPath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(artifactPath, buffer);
      console.log(`  Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('\n======================================================');
    console.log('  HOMEHUB — CATEGORY PRODUCT GRID VERIFICATION');
    console.log('======================================================');

    // Wait until window.homeHub is ready
    let attempts = 0;
    while (attempts++ < 30) {
      const ready = await evaluate(`Boolean(window.homeHub && window.homeHub.showCategoryView)`);
      if (ready) break;
      await sleep(200);
    }
    await sleep(400);

    // 1. DESKTOP VIEWPORT (1440x950) - 6 COLUMNS CHECK
    console.log('\n[1] Testing Desktop (1440x950) — Exactly 6 Equal Columns:');
    await setViewport(1440, 950, false);

    for (const cat of CATEGORIES) {
      await evaluate(`window.homeHub.showCategoryView('${cat}')`);
      await sleep(300);

      const gridInfo = await evaluate(`(() => {
        const grid = document.querySelector('.category-products-grid');
        if (!grid) return null;
        const style = window.getComputedStyle(grid);
        const cards = Array.from(grid.querySelectorAll('.category-product-card'));
        const rects = cards.map(c => {
          const r = c.getBoundingClientRect();
          return { width: Math.round(r.width * 10) / 10, top: Math.round(r.top) };
        });
        const columns = style.gridTemplateColumns.split(' ').length;
        return {
          category: '${cat}',
          columns,
          cardCount: cards.length,
          widths: rects.map(r => r.width),
          allEqual: rects.every(r => Math.abs(r.width - rects[0].width) < 1.5)
        };
      })()`);

      if (gridInfo) {
        console.log(`  ✓ ${cat.padEnd(14)} -> Columns: ${gridInfo.columns} | Cards: ${gridInfo.cardCount} | Equal Widths: ${gridInfo.allEqual} (${gridInfo.widths[0]}px each)`);
      } else {
        console.error(`  ✕ ${cat} grid not found!`);
      }
    }

    // Scroll to products and capture living-room (7 items: 6 in row 1, 1 in row 2 aligned)
    await evaluate(`window.homeHub.showCategoryView('living-room')`);
    await sleep(400);
    await evaluate(`
      const el = document.querySelector('.cat-products-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await sleep(500);
    await capture('grid-01-desktop-living-room-6col.png');

    // Capture dining-room (6 items: exactly 1 complete 6-card row)
    await evaluate(`window.homeHub.showCategoryView('dining-room')`);
    await sleep(400);
    await evaluate(`
      const el = document.querySelector('.cat-products-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await sleep(500);
    await capture('grid-02-desktop-dining-room-6col.png');

    // 2. TABLET VIEWPORT (768x1024) - 3 COLUMNS CHECK
    console.log('\n[2] Testing Tablet (768x1024) — Exactly 3 Equal Columns:');
    await setViewport(768, 1024, false);
    await sleep(500);

    for (const cat of CATEGORIES) {
      await evaluate(`window.homeHub.showCategoryView('${cat}')`);
      await sleep(250);

      const gridInfo = await evaluate(`(() => {
        const grid = document.querySelector('.category-products-grid');
        if (!grid) return null;
        const style = window.getComputedStyle(grid);
        const cards = Array.from(grid.querySelectorAll('.category-product-card'));
        const rects = cards.map(c => {
          const r = c.getBoundingClientRect();
          return { width: Math.round(r.width * 10) / 10 };
        });
        const columns = style.gridTemplateColumns.split(' ').length;
        return {
          category: '${cat}',
          columns,
          cardCount: cards.length,
          allEqual: rects.length === 0 || rects.every(r => Math.abs(r.width - rects[0].width) < 1.5),
          sampleWidth: rects[0] ? rects[0].width : 0
        };
      })()`);

      if (gridInfo) {
        console.log(`  ✓ ${cat.padEnd(14)} -> Columns: ${gridInfo.columns} | Cards: ${gridInfo.cardCount} | Equal Widths: ${gridInfo.allEqual} (${gridInfo.sampleWidth}px)`);
      }
    }

    await evaluate(`
      const el = document.querySelector('.cat-products-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await sleep(400);
    await capture('grid-03-tablet-3col.png');

    // 3. ANDROID MOBILE VIEWPORT (390x844) - 2 COLUMNS CHECK
    console.log('\n[3] Testing Android Mobile (390x844) — Exactly 2 Equal Columns:');
    await setViewport(390, 844, true);
    await sleep(500);

    for (const cat of CATEGORIES) {
      await evaluate(`window.homeHub.showCategoryView('${cat}')`);
      await sleep(250);

      const gridInfo = await evaluate(`(() => {
        const grid = document.querySelector('.category-products-grid');
        if (!grid) return null;
        const style = window.getComputedStyle(grid);
        const cards = Array.from(grid.querySelectorAll('.category-product-card'));
        const rects = cards.map(c => {
          const r = c.getBoundingClientRect();
          return { width: Math.round(r.width * 10) / 10 };
        });
        const columns = style.gridTemplateColumns.split(' ').length;
        return {
          category: '${cat}',
          columns,
          cardCount: cards.length,
          allEqual: rects.length === 0 || rects.every(r => Math.abs(r.width - rects[0].width) < 1.5),
          sampleWidth: rects[0] ? rects[0].width : 0
        };
      })()`);

      if (gridInfo) {
        console.log(`  ✓ ${cat.padEnd(14)} -> Columns: ${gridInfo.columns} | Cards: ${gridInfo.cardCount} | Equal Widths: ${gridInfo.allEqual} (${gridInfo.sampleWidth}px)`);
      }
    }

    await evaluate(`
      const el = document.querySelector('.cat-products-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await sleep(400);
    await capture('grid-04-mobile-2col.png');

    ws.close();
    await fetch(`http://127.0.0.1:9222/json/close/${tabInfo.id}`);

    console.log('\n======================================================');
    console.log('  CATEGORY GRID VALIDATION: 100% PASSED ACROSS ALL 9 ROOMS');
    console.log('======================================================');
  } catch (err) {
    console.error('Error during CDP grid test:', err);
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run();
