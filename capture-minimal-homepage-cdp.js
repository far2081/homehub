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
    console.log('Opened tab:', tabInfo.id);

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
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    await send('Page.enable');
    await send('Runtime.enable');

    // 1. Desktop Minimal Homepage (Header -> Digital Magazine -> Footer)
    console.log('\n[1] Capturing Minimal Homepage (Desktop 1440x950)...');
    await setViewport(1440, 950, false);
    await sleep(2000);
    await capture('homehub-minimal-desktop-home.png');

    // 2. Turn Page in 3D Magazine to show interactive 3D reading directly on homepage
    console.log('\n[2] Flipping Page in 3D Magazine Flipbook...');
    await evaluate(`
      if (window.homeHub && window.homeHub.flipbook) {
        window.homeHub.flipbook.nextPage();
      }
    `);
    await sleep(1000);
    await capture('homehub-minimal-desktop-turn.png');

    // 3. Android Mobile Minimal Homepage (Mobile Header -> Magazine -> Footer)
    console.log('\n[3] Capturing Minimal Mobile Homepage (390x844)...');
    await setViewport(390, 844, true);
    await sleep(1500);
    await capture('homehub-minimal-mobile-home.png');

    // 4. Verify Inner Category Page & HOME Navigation
    console.log('\n[4] Testing Inner Category Page and HOME Navigation...');
    await setViewport(1440, 950, false);
    await evaluate(`
      if (window.homeHub) window.homeHub.showCategoryView('bedroom');
    `);
    await sleep(1200);
    await capture('homehub-minimal-category-working.png');

    // Return to minimal homepage
    await evaluate(`
      const homeBtn = document.getElementById('cat-page-home-btn');
      if (homeBtn) homeBtn.click();
    `);
    await sleep(800);

    ws.close();
    await fetch(`http://127.0.0.1:9222/json/close/${tabInfo.id}`);
    console.log('\n======================================================');
    console.log('  MINIMAL HOMEPAGE SCREENSHOTS CAPTURED SUCCESSFULLY!');
    console.log('======================================================');
  } catch (err) {
    console.error('Error during CDP execution:', err);
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run();
