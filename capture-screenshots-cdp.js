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

async function run() {
  console.log('Spawning Chrome headless with remote debugging on port 9222...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.resolve('temp_chrome_profile')
  ]);

  await sleep(1500);

  try {
    const newTabRes = await fetch('http://127.0.0.1:9222/json/new?http://localhost:3000/?nopreloader', { method: 'PUT' });
    const tabInfo = await newTabRes.json();
    console.log('Opened tab:', tabInfo.id, tabInfo.webSocketDebuggerUrl);

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
    console.log('Connected to Chrome DevTools Protocol via WebSocket');

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = idCounter++;
        callbacks.set(id, { resolve, reject });
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
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes) to assets & artifact dir`);
    }

    await send('Page.enable');
    await send('Runtime.enable');

    // 1. Desktop Viewport (1400x900)
    console.log('Configuring desktop viewport (1400x900)...');
    await setViewport(1400, 900, false);
    await sleep(1500);

    console.log('Capturing Screenshot 1: Homepage Desktop with Book Header navigation...');
    await capture('preview-desktop-nav.png');

    // 2. Open Furniture Book Navigation Window
    console.log('Opening Furniture Book Navigation window...');
    await evaluate(`
      const btn = document.querySelector('[data-nav-book="furniture"]');
      if (btn) btn.click();
    `);
    await sleep(1000);

    console.log('Capturing Screenshot 2: Book Navigation Window (Furniture Book)...');
    await capture('preview-book-nav-furniture.png');

    // 3. Click "Living Room Collection" inside the Furniture Book
    console.log('Clicking "Living Room Collection" inside Furniture Book...');
    await evaluate(`
      const link = document.querySelector('.book-nav-action-link[data-target="collection:living-room"]');
      if (link) link.click();
    `);
    await sleep(1000);

    console.log('Capturing Screenshot 3: Full-Page Category/Collection Webpage...');
    await capture('preview-category-page.png');

    // 4. Click HOME button on category webpage
    console.log('Clicking HOME button on Category Webpage...');
    await evaluate(`
      const homeBtn = document.getElementById('cat-page-home-btn');
      if (homeBtn) homeBtn.click();
    `);
    await sleep(1000);

    console.log('Capturing Screenshot 4: Home Returned...');
    await capture('preview-home-returned.png');

    // 5. Mobile Viewport (390x844) - Mobile Book Navigation
    console.log('Configuring mobile viewport (390x844)...');
    await setViewport(390, 844, true);
    await sleep(1000);

    console.log('Opening Mobile Drawer & Lighting Book Navigation...');
    await evaluate(`
      const toggle = document.getElementById('mobile-nav-toggle');
      if (toggle) toggle.click();
    `);
    await sleep(600);
    await evaluate(`
      const lightBtn = document.querySelector('#mobile-nav-drawer [data-nav-book="lighting"]');
      if (lightBtn) lightBtn.click();
    `);
    await sleep(1000);

    console.log('Capturing Screenshot 5: Mobile Book Navigation Window...');
    await capture('preview-mobile-book-nav.png');

    ws.close();
    await fetch(`http://127.0.0.1:9222/json/close/${tabInfo.id}`);
    console.log('All screenshots captured successfully.');
  } catch (err) {
    console.error('Error during CDP execution:', err);
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run();
