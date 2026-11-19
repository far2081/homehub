import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb'
    }
  }
};

export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    } else if (!body) {
      body = await new Promise((resolve) => {
        let raw = '';
        req.on('data', chunk => { raw += chunk; });
        req.on('end', () => {
          try { resolve(JSON.parse(raw)); } catch (_) { resolve({}); }
        });
      });
    }

    if (!body || !body.data) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing image data' }));
      return;
    }

    const rawExt = (body.filename || 'image.jpg').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const allowedExtensions = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'png', 'webp', 'avif', 'gif', 'svg'];

    if (!allowedExtensions.includes(rawExt)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: `Disallowed file extension: .${rawExt}` }));
      return;
    }

    const base64Data = body.data.includes(',') ? body.data.split(',')[1] : body.data;
    const buffer = Buffer.from(base64Data, 'base64');

    if (rawExt === 'svg') {
      const svgText = buffer.toString('utf8');
      const dangerousPatterns = [
        /<script\b/i,
        /javascript\s*:/i,
        /\bon\w+\s*=/i,
        /<foreignObject\b/i,
        /<iframe\b/i,
        /<embed\b/i,
        /<object\b/i,
        /<!ENTITY/i,
        /<!DOCTYPE[^>]*\[/i
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(svgText)) {
          res.statusCode = 400;
          res.end(JSON.stringify({
            error: 'Security alert: SVG upload rejected. File contains potentially unsafe scripts, entities or event handlers.'
          }));
          return;
        }
      }

      if (!svgText.includes('<svg') || !svgText.includes('</svg>')) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Malformed SVG: missing valid root <svg> tags.' }));
        return;
      }
    }

    const cleanExt = (rawExt === 'jfif' || rawExt === 'pjpeg') ? 'jpg' : rawExt;
    const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${cleanExt}`;

    let savedLocal = false;
    try {
      const uploadDir = path.join(process.cwd(), 'assets', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      savedLocal = true;
    } catch (_) {
      try {
        const tmpDir = path.join(os.tmpdir(), 'homehub_uploads');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        fs.writeFileSync(path.join(tmpDir, filename), buffer);
      } catch (_) {}
    }

    const publicUrl = savedLocal
      ? `/assets/uploads/${filename}`
      : (body.data.startsWith('data:') ? body.data : `data:image/${cleanExt};base64,${base64Data}`);

    res.statusCode = 200;
    res.end(JSON.stringify({ url: publicUrl, success: true }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
}
