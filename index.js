/**
 * HomeHub - Root Entrypoint for Node.js / Vercel Serverless
 */
import { server, requestHandler } from './server.js';

const PORT = (process.env && process.env.PORT) ? parseInt(process.env.PORT, 10) : 3000;

// Start HTTP listener if run directly via `node index.js`
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('index.js') ||
  process.argv[1].includes('index.js')
);

if (isDirectRun && !process.env.VERCEL && !server.listening) {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  HOMEHUB — Real Production-Ready Web Application`);
    console.log(`  SHOP • STYLE • SMART`);
    console.log(`  Local Server running at: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
}

// Vercel Serverless Function standard handler export
export default function handler(req, res) {
  return requestHandler(req, res);
}

export { server, requestHandler };
