/**
 * HomeHub - Lightweight Zero-Dependency Local Static Server
 * Runs out-of-the-box on Node.js using modern ES Module standard.
 * Vercel-Serverless Safe: Exports request handler function and guards listen().
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = (process.env && process.env.PORT) ? process.env.PORT : 3000;
const ROOT_DIR = __dirname;

// Automatically parse and load .env file if present (safe guard against missing files)
try {
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) {
        const key = line.substring(0, eqIdx).trim();
        let val = line.substring(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        if (process.env && !process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (_) {
  // Silent fallback: never throw on missing or inaccessible .env
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  // Parse URL & query string safely
  let pathname = '/';
  try {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch (_) {
    pathname = req.url ? req.url.split('?')[0] : '/';
  }

  // Safe client configuration endpoint (Never exposes secret/service_role keys)
  if (pathname === '/api/config') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      supabaseUrl: (process.env && process.env.SUPABASE_URL) ? process.env.SUPABASE_URL : '',
      supabaseAnonKey: (process.env && process.env.SUPABASE_ANON_KEY) ? process.env.SUPABASE_ANON_KEY : ''
    }));
    return;
  }

  // Health endpoint
  if (pathname === '/api/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'HomeHub Atelier',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Local image upload endpoint (Guarantees upload success if Supabase Storage is paused/offline)
  if (pathname === '/api/upload' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (!parsed.data) {
          res.writeHead(400, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Content-Type-Options': 'nosniff'
          });
          res.end(JSON.stringify({ error: 'Missing image data' }));
          return;
        }

        const rawExt = (parsed.filename || 'image.jpg').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const allowedExtensions = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'png', 'webp', 'avif', 'gif', 'svg'];
        
        if (!allowedExtensions.includes(rawExt)) {
          res.writeHead(400, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Content-Type-Options': 'nosniff'
          });
          res.end(JSON.stringify({ error: `Disallowed file extension: .${rawExt}. Only standard photographic image formats are allowed.` }));
          return;
        }

        const base64Data = parsed.data.includes(',') ? parsed.data.split(',')[1] : parsed.data;
        const buffer = Buffer.from(base64Data, 'base64');

        // STRICT SVG SANITIZATION STRATEGY
        if (rawExt === 'svg') {
          const svgText = buffer.toString('utf8');
          const dangerousPatterns = [
            /<script\b/i,
            /javascript\s*:/i,
            /\bon\w+\s*=/i, // inline event handlers: onload, onerror, onclick, etc.
            /<foreignObject\b/i,
            /<iframe\b/i,
            /<embed\b/i,
            /<object\b/i,
            /<!ENTITY/i,
            /<!DOCTYPE[^>]*\[/i
          ];

          for (const pattern of dangerousPatterns) {
            if (pattern.test(svgText)) {
              res.writeHead(400, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Content-Type-Options': 'nosniff'
              });
              res.end(JSON.stringify({
                error: 'Security alert: SVG upload rejected. File contains potentially unsafe scripts, entities or event handlers.'
              }));
              return;
            }
          }

          if (!svgText.includes('<svg') || !svgText.includes('</svg>')) {
            res.writeHead(400, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Malformed SVG: missing valid root <svg> tags.' }));
            return;
          }
        }

        const cleanExt = (rawExt === 'jfif' || rawExt === 'pjpeg') ? 'jpg' : rawExt;
        const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${cleanExt}`;
        const uploadDir = path.join(ROOT_DIR, 'assets', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const savePath = path.join(uploadDir, filename);
        fs.writeFileSync(savePath, buffer);

        const publicUrl = `/assets/uploads/${filename}`;
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff'
        });
        res.end(JSON.stringify({ url: publicUrl, success: true }));
      } catch (e) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff'
        });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, pathname);

  // Security check: ensure path is within ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support HTTP Range requests for video/audio streaming
    const range = req.headers.range;
    if (range && stats.size > 0) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;

      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN'
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[HomeHub Server] Port ${PORT} already active; shared instance ready.`);
  } else {
    console.error('[HomeHub Server] Error:', err);
  }
});

// Guard: Only start listening if run directly and NOT in a Vercel serverless environment
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun && !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  HOMEHUB — Real Production-Ready Web Application`);
    console.log(`  SHOP • STYLE • SMART`);
    console.log(`  Local Server running at: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
}

export { server };
export default server;
