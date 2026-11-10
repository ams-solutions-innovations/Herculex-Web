// Serves the built Flutter web app (../Herculex/build/web) locally on port 5555
// with proper MIME types, CORS headers, and SPA fallback for go_router.

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appDir = resolve(process.env.HERCULEX_APP_DIR ?? join(root, '..', 'Herculex'));
const webBuildDir = join(appDir, 'build', 'web');

const PORT = Number(process.env.PORT ?? 5555);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.wasm': 'application/wasm',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.map': 'application/json',
};

if (!existsSync(join(webBuildDir, 'index.html'))) {
  console.error(`\x1b[31m[error]\x1b[0m Flutter web build not found at: ${webBuildDir}`);
  console.error('Run `flutter build web` or `pwsh tool/web/build_web.ps1` in the Herculex app repository.');
  process.exit(1);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);

  // Security check: prevent directory traversal
  let filePath = join(webBuildDir, pathname);
  if (!filePath.startsWith(webBuildDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // If requesting a directory, look for index.html
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  // SPA fallback: if file does not exist, serve index.html
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(webBuildDir, 'index.html');
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'HEAD') {
    res.writeHead(200);
    res.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on('error', (err) => {
    res.writeHead(500);
    res.end(`Internal Server Error: ${err.message}`);
  });
  stream.pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n\x1b[36m🚀 Herculex Web App running locally:\x1b[0m`);
  console.log(`   \x1b[1mhttp://localhost:${PORT}/\x1b[0m\n`);
});
