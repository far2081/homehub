import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CDP_PORT = 9660;
const USER_DATA_DIR = path.join(process.env.TEMP || 'C:\\Temp', 'homehub_preview_' + Date.now());
const BASE_URL = 'http://localhost:3000/?nopreloader=true';
const ARTIFACT_DIR = 'C:\\Users\\zuni\\.gemini\\antigravity\\brain\\a6e4fb1b-300a-46f5-8ff2-e8f6521dc7c3';
const WORKSPACE_DIR = 'C:\\Users\\zuni\\Desktop\\webstore\\assets\\screenshots';

if (!fs.existsSync(WORKSPACE_DIR)) {
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

let messageId = 1;
const pendingRequests = new Map();

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = messageId++;
    const message = JSON.stringify({ id, method, params });
    pendingRequests.set(id, { resolve, reject, method });
    ws.send(message);
  });
}

async function evalInPage(ws, expression) {
  const res = await sendCommand(ws, 'Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (res && res.exceptionDetails) {
    throw new Error(`Eval error in [${expression.slice(0, 80)}]: ` + JSON.stringify(res.exceptionDetails));
  }
  return res && res.result ? res.result.value : undefined;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function captureScreenshot(ws, filename) {
  try {
    console.log(`[Screenshot] Sending Page.captureScreenshot for ${filename}...`);
    const res = await sendCommand(ws, 'Page.captureScreenshot', {
      format: 'png'
    });
    if (!res || !res.data) {
      console.error(`[Screenshot] No data received for ${filename}:`, res);
      return;
    }
    const buffer = Buffer.from(res.data, 'base64');
    const workspacePath = path.join(WORKSPACE_DIR, filename);
    fs.writeFileSync(workspacePath, buffer);

    const artifactPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(artifactPath, buffer);

    console.log(`[Screenshot] Successfully wrote ${filename} (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`[Screenshot Error] ${filename}:`, err.message);
  }
}

async function run() {
  console.log(`[CDP] Launching Headless Chrome on port ${CDP_PORT}...`);
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-web-security',
    `--user-data-dir=${USER_DATA_DIR}`
  ], { detached: true, stdio: 'ignore' });
  chromeProcess.unref();

  let ws = null;
  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      await sleep(400);
      try {
        const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
        versionData = await res.json();
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch (_) {}
    }

    if (!versionData || !versionData.webSocketDebuggerUrl) {
      throw new Error('Failed to connect to Chrome DevTools Protocol.');
    }

    console.log(`[CDP] Connected to: ${versionData.Browser}`);

    const newPageRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' });
    const target = await newPageRes.json();
    console.log(`[CDP] Created Page Target: ${target.id}`);

    ws = new WebSocket(target.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log('[CDP] WebSocket connected');
        resolve();
      };
      ws.onerror = reject;
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.id && pendingRequests.has(msg.id)) {
            const { resolve, reject } = pendingRequests.get(msg.id);
            pendingRequests.delete(msg.id);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        } catch (_) {}
      };
    });

    await sendCommand(ws, 'Page.enable');
    await sendCommand(ws, 'Runtime.enable');
    await sendCommand(ws, 'DOM.enable');

    // 1. DESKTOP PREVIEW (1440x960)
    console.log('\n--- [1] Setting Desktop Viewport (1440x960) ---');
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 960,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('[CDP] Navigating to HomeHub Storefront...');
    await sendCommand(ws, 'Page.navigate', { url: BASE_URL });
    await sleep(2500);

    // Load 'small-spaces' (The Art of Compact Living) and turn to Spread 1 (Pages 2-3 Galley Kitchen panoramic image_8.png)
    console.log('[CDP] Opening The Art of Compact Living (small-spaces) Spread 1 (Pages 2-3)...');
    await evalInPage(ws, `
      (() => {
        if (window.homehub) {
          window.homehub.openBook('small-spaces');
          if (window.homehub.flipbook) {
            window.homehub.flipbook.goToPage(1);
          }
        }
      })()
    `);
    await sleep(2000);

    await captureScreenshot(ws, 'preview_desktop_magazine_spread.png');

    // 2. DESKTOP TABLE OF CONTENTS (TOC) DRAWER
    console.log('\n--- [2] Opening Table of Contents (TOC) Drawer ---');
    await evalInPage(ws, `
      (() => {
        const tocBtn = document.getElementById('flipbook-toc-btn');
        if (tocBtn) tocBtn.click();
      })()
    `);
    await sleep(1000);
    await captureScreenshot(ws, 'preview_desktop_toc_drawer.png');

    // Close TOC drawer
    await evalInPage(ws, `
      (() => {
        const closeBtn = document.getElementById('flipbook-toc-close-btn');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await sleep(600);

    // 3. MOBILE PREVIEW (375x812)
    console.log('\n--- [3] Setting Mobile Viewport (375x812, iPhone) ---');
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true
    });

    console.log('[CDP] Navigating Mobile View...');
    await sendCommand(ws, 'Page.navigate', { url: BASE_URL });
    await sleep(2500);

    // Turn to page 2
    console.log('[CDP] Navigating Mobile to The Art of Compact Living Spread 1...');
    await evalInPage(ws, `
      (() => {
        if (window.homehub) {
          window.homehub.openBook('small-spaces');
          if (window.homehub.flipbook) {
            window.homehub.flipbook.goToPage(1);
          }
        }
      })()
    `);
    await sleep(2000);

    await captureScreenshot(ws, 'preview_mobile_magazine_375px.png');

    console.log('\nAll visual previews captured successfully!');
  } catch (e) {
    console.error('[Run Error]:', e);
  } finally {
    if (ws) {
      try { ws.close(); } catch (_) {}
    }
    try {
      chromeProcess.kill();
    } catch (_) {}
  }
}

run();
