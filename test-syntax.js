/**
 * HomeHub - Comprehensive Test Suite & Module Syntax Validator
 * Tests all ES modules, data integrity, and exports.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let errors = 0;

console.log('======================================================');
console.log('  HOMEHUB — AUTOMATED MODULE AUDIT & TEST SUITE');
console.log('======================================================\n');

// 1. Audit all files recursively
async function auditModules(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await auditModules(fullPath);
    } else if (entry.name.endsWith('.js')) {
      const fileUrl = 'file:///' + fullPath.replace(/\\/g, '/');
      try {
        const mod = await import(fileUrl);
        console.log(`✓ Module Loaded Successfully: ${fullPath} (Exports: ${Object.keys(mod).join(', ') || 'default'})`);
      } catch (err) {
        console.error(`✗ Error loading ${fullPath}:`, err.message);
        errors++;
      }
    }
  }
}

await auditModules(path.join(__dirname, 'js'));

// 2. Data Integrity Checks
try {
  const { INITIAL_PRODUCTS, CATEGORIES } = await import('./js/data/products.js');
  console.log(`\n--- Product Data Integrity ---`);
  console.log(`✓ Total Products: ${INITIAL_PRODUCTS.length}`);
  console.log(`✓ Total Categories: ${CATEGORIES.length}`);

  for (const p of INITIAL_PRODUCTS) {
    if (!p.id || !p.sku || !p.name || !p.price || !p.images) {
      console.error(`✗ Product missing essential fields: ${p.sku}`);
      errors++;
    }
    if (p.images.length < 4) {
      console.error(`✗ Product ${p.sku} has fewer than 4 images: ${p.images.length}`);
      errors++;
    }
  }

  const { MAGAZINE_BOOKS } = await import('./js/data/magazines.js');
  console.log(`\n--- Magazine Books Integrity ---`);
  const bookKeys = Object.keys(MAGAZINE_BOOKS);
  console.log(`✓ Digital Books Count: ${bookKeys.length} (${bookKeys.join(', ')})`);

  for (const [key, book] of Object.entries(MAGAZINE_BOOKS)) {
    if (!book.title || !book.pages || book.pages.length === 0) {
      console.error(`✗ Book ${key} has no pages or missing title.`);
      errors++;
    }
  }

  const { INSPIRATION_VIDEOS } = await import('./js/data/videos.js');
  console.log(`\n--- Video Inspiration Integrity ---`);
  console.log(`✓ Video Masterclasses Count: ${INSPIRATION_VIDEOS.length}`);

  for (const v of INSPIRATION_VIDEOS) {
    if (!v.id || !v.title || !v.thumbnail || (!v.embedUrl && !v.videoUrl)) {
      console.error(`✗ Video missing fields: ${v.id}`);
      errors++;
    }
  }

} catch (err) {
  console.error('✗ Integrity check exception:', err);
  errors++;
}

console.log('\n======================================================');
if (errors === 0) {
  console.log('  ALL AUDITS PASSED: 0 ERRORS DETECTED.');
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error(`  AUDIT FAILED: ${errors} ERRORS DETECTED.`);
  console.log('======================================================\n');
  process.exit(1);
}
