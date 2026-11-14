// Archivio dei contenuti: il repository GitHub del sito.
// Ogni salvataggio è un commit sul branch di pubblicazione: Vercel ricostruisce il sito
// automaticamente e ogni modifica resta nello storico (si può sempre tornare indietro).
// In sviluppo (LOCAL_REPO impostato) legge e scrive direttamente i file su disco.
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';

const err = (status, message) => Object.assign(new Error(message), { status });

class GitHubStore {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.repo = process.env.GITHUB_REPO || 'jefebcn/fsp';
    this.branch = process.env.GITHUB_BRANCH || 'main';
    this.kind = 'github';
  }
  get configured() { return Boolean(this.token); }
  async api(path, opts = {}) {
    if (!this.token) throw err(503, 'Il collegamento a GitHub non è ancora configurato (manca GITHUB_TOKEN).');
    const r = await fetch(`https://api.github.com${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'fsp-dashboard', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
    });
    if (r.status === 404) return null;
    if (!r.ok) { const t = await r.text(); throw err(r.status === 422 ? 409 : 502, `GitHub ${r.status}: ${t.slice(0, 200)}`); }
    return r.status === 204 ? {} : r.json();
  }
  async readText(path) {
    if (!this.token) { // sola lettura: il repository è pubblico
      const r = await fetch(`https://raw.githubusercontent.com/${this.repo}/${encodeURIComponent(this.branch).replace(/%2F/g, '/')}/${encodeURI(path)}`);
      return r.ok ? r.text() : null;
    }
    const d = await this.api(`/repos/${this.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(this.branch)}`);
    if (!d || Array.isArray(d)) return null;
    return Buffer.from(d.content, 'base64').toString('utf8');
  }
  async readNews() {
    if (!this.token) { // sola lettura: elenco dall'indice pubblico del sito
      const r = await fetch(`${process.env.SITE_URL || 'https://fsp-sanmarino.vercel.app'}/search.json`);
      if (!r.ok) throw err(502, 'Impossibile leggere l’elenco delle notizie');
      return (await r.json()).map((x) => ({ id: x.u.split('/').filter(Boolean).pop(), parsed: { title: x.t, date: x.d, categories: x.k || [], featured: Boolean(x.f), cover: x.i || undefined, excerpt: x.e, gallery: [] } }));
    }
    const [owner, name] = this.repo.split('/');
    const q = `query($o:String!,$n:String!,$e:String!){repository(owner:$o,name:$n){object(expression:$e){... on Tree{entries{name object{... on Blob{text}}}}}}}`;
    const d = await this.api('/graphql', { method: 'POST', body: JSON.stringify({ query: q, variables: { o: owner, n: name, e: `${this.branch}:src/content/news` } }) });
    const entries = d?.data?.repository?.object?.entries || [];
    return entries.filter((e) => e.name.endsWith('.md')).map((e) => ({ id: e.name.slice(0, -3), text: e.object?.text || '' }));
  }
  async uploadBlob(base64) {
    const d = await this.api(`/repos/${this.repo}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: base64, encoding: 'base64' }) });
    return d.sha;
  }
  /** files: [{ path, text } | { path, blob } | { path, delete: true }] */
  async commit(files, message, author) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const ref = await this.api(`/repos/${this.repo}/git/ref/heads/${this.branch}`);
      if (!ref) throw err(500, `Branch ${this.branch} non trovato`);
      const head = await this.api(`/repos/${this.repo}/git/commits/${ref.object.sha}`);
      const tree = files.map((f) => f.delete
        ? { path: f.path, mode: '100644', type: 'blob', sha: null }
        : f.blob ? { path: f.path, mode: '100644', type: 'blob', sha: f.blob }
        : { path: f.path, mode: '100644', type: 'blob', content: f.text });
      const t = await this.api(`/repos/${this.repo}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
      const c = await this.api(`/repos/${this.repo}/git/commits`, { method: 'POST', body: JSON.stringify({ message, tree: t.sha, parents: [head.sha], author: { name: `Segreteria FSP (${author})`, email: 'segreteria@fsp.sm' } }) });
      try {
        await this.api(`/repos/${this.repo}/git/refs/heads/${this.branch}`, { method: 'PATCH', body: JSON.stringify({ sha: c.sha, force: false }) });
        return { sha: c.sha };
      } catch (e) { if (e.status !== 409 || attempt === 2) throw e; }
    }
  }
  async history(limit = 30) {
    if (!this.token) {
      const r = await fetch(`https://api.github.com/repos/${this.repo}/commits?sha=${encodeURIComponent(this.branch)}&per_page=${limit}`, { headers: { 'User-Agent': 'fsp-dashboard' } }).catch(() => null);
      const d = r?.ok ? await r.json() : [];
      return d.map((c) => ({ sha: c.sha, message: c.commit.message, date: c.commit.author.date, author: c.commit.author.name }));
    }
    const d = await this.api(`/repos/${this.repo}/commits?sha=${encodeURIComponent(this.branch)}&per_page=${limit}`);
    return (d || []).map((c) => ({ sha: c.sha, message: c.commit.message, date: c.commit.author.date, author: c.commit.author.name, url: c.html_url }));
  }
}

class LocalStore {
  constructor(root) { this.root = root; this.kind = 'local'; this.blobs = new Map(); this.configured = true; }
  async readText(path) { try { return await readFile(join(this.root, path), 'utf8'); } catch { return null; } }
  async readNews() {
    const dir = join(this.root, 'src/content/news');
    const names = (await readdir(dir)).filter((n) => n.endsWith('.md'));
    return Promise.all(names.map(async (n) => ({ id: n.slice(0, -3), text: await readFile(join(dir, n), 'utf8') })));
  }
  async uploadBlob(base64) {
    const buf = Buffer.from(base64, 'base64');
    const sha = createHash('sha1').update(buf).digest('hex');
    this.blobs.set(sha, buf);
    return sha;
  }
  async commit(files, message, author) {
    for (const f of files) {
      const p = join(this.root, f.path);
      if (f.delete) { await rm(p, { force: true }); continue; }
      await mkdir(dirname(p), { recursive: true });
      await writeFile(p, f.blob ? this.blobs.get(f.blob) : f.text);
    }
    this.log = [{ sha: Math.random().toString(16).slice(2, 10), message, date: new Date().toISOString(), author: `Segreteria FSP (${author})` }, ...(this.log || [])];
    return { sha: this.log[0].sha };
  }
  async history(limit = 30) {
    try {
      const out = execFileSync('git', ['-C', this.root, 'log', `-${limit}`, '--pretty=format:%H%x1f%s%x1f%aI%x1f%an'], { encoding: 'utf8' });
      const git = out.split('\n').filter(Boolean).map((l) => { const [sha, message, date, author] = l.split('\x1f'); return { sha, message, date, author }; });
      return [...(this.log || []), ...git].slice(0, limit);
    } catch { return this.log || []; }
  }
}

let store;
export function getStore() {
  if (!store) store = process.env.LOCAL_REPO ? new LocalStore(process.env.LOCAL_REPO) : new GitHubStore();
  return store;
}
