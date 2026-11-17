import { spawn } from 'child_process';
import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const USER_DATA = 'C:\\temp\\chrome-cdp-' + Date.now();

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function request(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET'
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(d));
        } catch(e) {
          resolve(d);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch(e) {}
    }
  }
}

async function capture() {
  console.log('Launching Chrome for CDP screenshot capture...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    'about:blank'
  ], { stdio: 'ignore' });

  for (let i = 0; i < 30; i++) {
    await sleep(200);
    try {
      const v = await request(`http://127.0.0.1:${PORT}/json/version`);
      if (v?.webSocketDebuggerUrl) break;
    } catch (e) {}
  }

  console.log('Connected to Chrome DevTools Protocol.');

  const captures = [
    {
      name: 'preview-desktop.png',
      url: 'http://localhost:3000/?nopreloader=1#book-living-edit-page-1',
      bookId: 'living-edit',
      pageIndex: 0,
      width: 1440,
      height: 960,
      mobile: false,
      waitMs: 4000
    },
    {
      name: 'preview-double-spread.png',
      url: 'http://localhost:3000/?nopreloader=1#book-living-edit-page-4',
      bookId: 'living-edit',
      pageIndex: 3,
      width: 1440,
      height: 960,
      mobile: false,
      waitMs: 4000
    },
    {
      name: 'preview-layout-e.png',
      url: 'http://localhost:3000/?nopreloader=1#book-living-edit-page-8',
      bookId: 'living-edit',
      pageIndex: 7,
      width: 1440,
      height: 960,
      mobile: false,
      waitMs: 4000
    },
    {
      name: 'preview-mobile.png',
      url: 'http://localhost:3000/?nopreloader=1#book-living-edit-page-4',
      bookId: 'living-edit',
      pageIndex: 3,
      width: 390,
      height: 844,
      mobile: true,
      waitMs: 4000
    }
  ];

  for (const item of captures) {
    console.log(`\n--- Preparing ${item.name} (${item.width}x${item.height}) ---`);
    const pageTarget = await request(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(item.url)}`, { method: 'PUT' });
    console.log(`Page target created: ${pageTarget.id}`);

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: item.width,
      height: item.height,
      deviceScaleFactor: 1,
      mobile: item.mobile
    });

    if (item.mobile) {
      await client.send('Emulation.setUserAgentOverride', {
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
      });
    }

    console.log(`Waiting ${item.waitMs}ms for network & image loading...`);
    await sleep(item.waitMs);

    // Scroll magazine viewport into view and make sure target book & page are active
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const pre = document.getElementById('homehub-preloader');
          if (pre) pre.remove();
          document.documentElement.classList.add('nopreloader');

          if (window.homeHub && window.homeHub.flipbook) {
            window.homeHub.flipbook.loadBook('${item.bookId}', ${item.pageIndex});
          }

          const viewport = document.getElementById('flipbook-viewport') || document.querySelector('.flipbook-stage');
          if (viewport) {
            viewport.scrollIntoView({ block: 'center', inline: 'center' });
          }
          window.dispatchEvent(new Event('resize'));
        })()
      `
    });
    await sleep(2000);

    console.log(`Capturing screenshot ${item.name}...`);
    const screenshot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    const targetPath = path.resolve('assets', item.name);
    fs.writeFileSync(targetPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`Saved: ${targetPath} (${Math.round(screenshot.data.length * 0.75 / 1024)} KB)`);

    // Also copy to artifacts directory
    const artifactPath = path.resolve('C:\\Users\\zuni\\.gemini\\antigravity\\brain\\a4f5fe30-8fac-433b-9fa7-0c11c957054a', item.name);
    fs.writeFileSync(artifactPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`Mirrored to artifact: ${artifactPath}`);

    client.close();
    try {
      await request(`http://127.0.0.1:${PORT}/json/close/${pageTarget.id}`);
    } catch (e) {}
  }

  chromeProc.kill();
  console.log('\nAll screenshots captured and saved successfully!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
