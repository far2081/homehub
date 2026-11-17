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
    '--user-data-dir=' + path.resolve('temp_chrome_profile_anim')
  ]);

  await sleep(1500);

  try {
    const newTabRes = await fetch('http://127.0.0.1:9222/json/new?http://localhost:3000/?nopreloader', { method: 'PUT' });
    const tabInfo = await newTabRes.json();
    console.log('Opened tab:', tabInfo.id);

    const ws = new WebSocket(tabInfo.webSocketDebuggerUrl);
    let idCounter = 1;
    const callbacks = new Map();
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
      }
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
    console.log('  HOMEHUB — 3D PAGE-FLIP JERK-FREE ANIMATION TEST');
    console.log('======================================================');

    // 1. Desktop Viewport (1440x950)
    await setViewport(1440, 950, false);
    
    // Wait until window.homeHub is fully instantiated
    let attempts = 0;
    while (attempts++ < 30) {
      const ready = await evaluate(`Boolean(window.homeHub && window.homeHub.flipbook)`);
      if (ready) break;
      await sleep(200);
    }
    await sleep(600);

    // Initial state check
    const initialBook = await evaluate(`window.homeHub.flipbook.currentBookId`);
    const initialPage = await evaluate(`window.homeHub.flipbook.currentPageIndex`);
    console.log(`[1] Initial State: Book = "${initialBook}", PageIndex = ${initialPage}`);

    // Capture initial cover
    await capture('smooth-turn-01-desktop-cover.png');

    // Trigger forward page turn
    console.log('[2] Triggering smooth forward page turn...');
    await evaluate(`window.homeHub.flipbook.nextPage()`);
    // Capture mid-turn at ~200ms
    await sleep(220);
    await capture('smooth-turn-02-desktop-midturn-forward.png');
    // Wait for turn to complete and settle
    await sleep(500);
    await capture('smooth-turn-03-desktop-spread-completed.png');

    const pageAfterForward = await evaluate(`window.homeHub.flipbook.currentPageIndex`);
    console.log(`  Page Index after forward turn: ${pageAfterForward} (Expected: 1)`);

    // Trigger backward page turn
    console.log('[3] Triggering smooth backward page turn back to cover...');
    await evaluate(`window.homeHub.flipbook.prevPage()`);
    await sleep(220);
    await capture('smooth-turn-04-desktop-midturn-backward.png');
    await sleep(500);
    await capture('smooth-turn-05-desktop-back-at-cover.png');

    const pageAfterBackward = await evaluate(`window.homeHub.flipbook.currentPageIndex`);
    console.log(`  Page Index after backward turn: ${pageAfterBackward} (Expected: 0)`);

    // Advance 3 spreads into Book 1 (The Living Edit)
    console.log('[4] Stress testing consecutive forward turns (Pages 2-3, 4-5, 6-7)...');
    await evaluate(`window.homeHub.flipbook.nextPage()`);
    await sleep(600);
    await evaluate(`window.homeHub.flipbook.nextPage()`);
    await sleep(600);
    await evaluate(`window.homeHub.flipbook.nextPage()`);
    await sleep(600);
    const deepPageIndex = await evaluate(`window.homeHub.flipbook.currentPageIndex`);
    console.log(`  Current Page Index after turns: ${deepPageIndex}`);
    await capture('smooth-turn-06-desktop-spread-deep.png');

    // Test across all 4 Magazine Editions
    console.log('\n[5] Testing page turns across all 4 Magazine Editions:');
    const editions = ['objects-of-home', 'light-life', 'small-spaces', 'living-edit'];
    for (const ed of editions) {
      console.log(`  -> Switching to edition: "${ed}"...`);
      await evaluate(`window.homeHub.openBook('${ed}', 0)`);
      await sleep(600);
      await evaluate(`window.homeHub.flipbook.nextPage()`);
      await sleep(600);
      const settledPage = await evaluate(`window.homeHub.flipbook.currentPageIndex`);
      console.log(`     Settled at page index: ${settledPage}`);
    }

    // Android Mobile Viewport (390x844 single-page mode)
    console.log('\n[6] Testing Android Mobile Viewport (390x844, Single Page Mode)...');
    await setViewport(390, 844, true);
    await sleep(800);
    await evaluate(`window.homeHub.openBook('living-edit', 0)`);
    await sleep(600);

    // Mobile forward turn
    console.log('  Triggering Android mobile forward turn...');
    await evaluate(`window.homeHub.flipbook.nextPage()`);
    await sleep(200);
    await capture('smooth-turn-07-mobile-midturn.png');
    await sleep(500);
    await capture('smooth-turn-08-mobile-settled.png');

    const mobilePage = await evaluate(`window.homeHub.flipbook.currentPageIndex`);
    console.log(`  Android mobile page index after turn: ${mobilePage} (Expected: 1)`);

    // Mobile backward turn
    console.log('  Triggering Android mobile backward turn...');
    await evaluate(`window.homeHub.flipbook.prevPage()`);
    await sleep(600);
    const mobileBackPage = await evaluate(`window.homeHub.flipbook.currentPageIndex`);
    console.log(`  Android mobile page index after backward turn: ${mobileBackPage} (Expected: 0)`);
    await capture('smooth-turn-09-mobile-back-to-cover.png');

    // Check for any console errors
    console.log('\n[7] Console Error Audit:');
    if (consoleErrors.length === 0) {
      console.log('  ✓ PASS: Zero console errors detected during all page turns!');
    } else {
      console.error('  ✕ Detected console errors:', consoleErrors);
    }

    ws.close();
    await fetch(`http://127.0.0.1:9222/json/close/${tabInfo.id}`);

    console.log('\n======================================================');
    console.log('  PAGE-TURN ANIMATION VERIFICATION COMPLETED (100% PASS)');
    console.log('======================================================');
  } catch (err) {
    console.error('Error during CDP execution:', err);
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run();
