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

    // 1. Desktop Viewport (1440x950) - Homepage
    console.log('\n[1] Capturing Homepage Desktop View...');
    await setViewport(1440, 950, false);
    await sleep(1500);
    await capture('homehub-01-desktop-home.png');

    // 2. Open Categories Dropdown
    console.log('\n[2] Testing Categories Dropdown (All 9 Categories)...');
    await evaluate(`
      const wrap = document.getElementById('header-categories-wrapper');
      if (wrap) wrap.classList.add('is-open');
    `);
    await sleep(600);
    await capture('homehub-02-categories-dropdown.png');
    await evaluate(`
      const wrap = document.getElementById('header-categories-wrapper');
      if (wrap) wrap.classList.remove('is-open');
    `);

    // 3. Navigate to Bedroom Category Page
    console.log('\n[3] Testing Bedroom Category Destination Page...');
    await evaluate(`
      const bedLink = document.querySelector('.category-dropdown-item[data-cat="bedroom"]');
      if (bedLink) bedLink.click();
    `);
    await sleep(1200);
    await capture('homehub-03-category-bedroom.png');

    // 4. Test Playable Video Modal from Bedroom Page
    console.log('\n[4] Testing Room Makeover Video Modal...');
    await evaluate(`
      const watchBtn = document.querySelector('.cat-watch-video-btn');
      if (watchBtn) watchBtn.click();
    `);
    await sleep(1000);
    await capture('homehub-04-video-makeover-modal.png');
    await evaluate(`
      const closeBtn = document.getElementById('vmodal-close-btn');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(500);

    // 5. Test Small Spaces Category Page
    console.log('\n[5] Testing Small Spaces Category Page...');
    await evaluate(`
      if (window.homeHub) window.homeHub.showCategoryView('small-spaces');
    `);
    await sleep(1200);
    await capture('homehub-05-category-small-spaces.png');

    // 6. Test Shop All Full Catalogue View (#shop)
    console.log('\n[6] Testing Shop All Catalogue Page (#shop)...');
    await evaluate(`
      const shopBtn = document.getElementById('header-nav-shop');
      if (shopBtn) shopBtn.click();
    `);
    await sleep(1200);
    await capture('homehub-06-shop-catalogue.png');

    // 7. Test Add to Bag & Shopping Bag Drawer
    console.log('\n[7] Testing Add to Bag & Shopping Cart Drawer...');
    await evaluate(`
      const addBtn = document.querySelector('.add-to-cart-btn') || document.querySelector('.cat-card-add-btn');
      if (addBtn) addBtn.click();
      if (window.homeHub && window.homeHub.cart) window.homeHub.cart.open();
    `);
    await sleep(800);
    await capture('homehub-07-cart-drawer.png');
    await evaluate(`
      const cartClose = document.getElementById('close-cart-btn') || document.querySelector('.cart-close-btn');
      if (cartClose) cartClose.click();
    `);
    await sleep(500);

    // 8. Test Interior Ideas & Masterclasses View (#ideas)
    console.log('\n[8] Testing Interior Ideas & Masterclasses View (#ideas)...');
    await evaluate(`
      const ideasBtn = document.getElementById('header-nav-ideas');
      if (ideasBtn) ideasBtn.click();
    `);
    await sleep(1200);
    await capture('homehub-08-interior-ideas.png');

    // 9. Test HOME Button Navigation
    console.log('\n[9] Testing Return to HOME via Header Button...');
    await evaluate(`
      const homeBtn = document.getElementById('header-home-btn');
      if (homeBtn) homeBtn.click();
    `);
    await sleep(1000);
    await capture('homehub-09-home-returned.png');

    // 10. Android Mobile Viewport (390x844) - Mobile Homepage & Drawer
    console.log('\n[10] Testing Android Mobile Viewport & Navigation Drawer...');
    await setViewport(390, 844, true);
    await sleep(800);
    await evaluate(`
      const toggle = document.getElementById('mobile-nav-toggle');
      if (toggle) toggle.click();
    `);
    await sleep(800);
    await capture('homehub-10-mobile-drawer.png');

    // 11. Android Mobile Category View (Dining Room)
    console.log('\n[11] Testing Android Mobile Category View (Dining Room)...');
    await evaluate(`
      const mobClose = document.getElementById('mobile-nav-close');
      if (mobClose) mobClose.click();
      if (window.homeHub) window.homeHub.showCategoryView('dining-room');
    `);
    await sleep(1200);
    await capture('homehub-11-mobile-category-dining.png');

    ws.close();
    await fetch(`http://127.0.0.1:9222/json/close/${tabInfo.id}`);
    console.log('\n======================================================');
    console.log('  ALL BROWSER SCREENSHOTS CAPTURED SUCCESSFULLY (11/11)');
    console.log('======================================================');
  } catch (err) {
    console.error('Error during CDP execution:', err);
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run();
