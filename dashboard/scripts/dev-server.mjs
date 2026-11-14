// Server locale per provare la dashboard: node scripts/dev-server.mjs
// Usa i file del repository su disco (LOCAL_REPO) invece di GitHub.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import handler from '../api/index.js';

const root = resolve(new URL('..', import.meta.url).pathname);
process.env.LOCAL_REPO ??= resolve(root, '..');
process.env.SESSION_SECRET ??= 'sviluppo-locale-chiave-segreta-lunga-almeno-32-caratteri';
const port = Number(process.env.PORT || 4400);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  if (path.startsWith('/api/')) return handler(req, res);
  const file = join(root, 'public', path === '/' ? 'index.html' : path);
  try {
    const data = await readFile(file);
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch {
    res.setHeader('Content-Type', types['.html']);
    res.end(await readFile(join(root, 'public/index.html')));
  }
}).listen(port, () => console.log(`Dashboard su http://localhost:${port} (repository: ${process.env.LOCAL_REPO})`));
