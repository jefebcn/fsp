// Unica funzione serverless della dashboard: instrada tutte le richieste /api/*.
import { verifyCredentials, createSessionCookie, clearSessionCookie, sessionUser, tooManyAttempts, recordFailure } from '../lib/auth.js';
import { getStore } from '../lib/store.js';
import { parseNews, serializeNews, slugify, sanitizeHtml, CATEGORIES } from '../lib/news.js';
import { readJson, send, isSecure, clientIp } from '../lib/http.js';

const DATA_FILES = {
  'avviso': 'Avviso in evidenza',
  'contatti': 'Contatti e social',
  'direttivo': 'Consiglio direttivo',
  'staff-tecnico': 'Staff tecnico',
  'attivita-federazione': 'Attività della Federazione',
  'impianti': 'Impianti',
  'partner': 'Partner',
  'nazionali': 'Nazionali',
  'giovanili': 'Squadre giovanili',
  'centro-estivo': 'Centro estivo',
  'foglio-google': 'Foglio Google',
};
const dataPath = (name) => `src/data/contenuti/${name}.json`;
const MEDIA_TYPES = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'application/pdf': 'pdf' };

let newsCache = null; // { at, list }
async function allNews(store) {
  if (newsCache && Date.now() - newsCache.at < 15000) return newsCache.list;
  const raw = await store.readNews();
  const list = raw.map((r) => (r.parsed ? { id: r.id, body: '', ...r.parsed } : parseNews(r.id, r.text))).sort((a, b) => String(b.date).localeCompare(String(a.date)) || (b.legacyId || 0) - (a.legacyId || 0));
  newsCache = { at: Date.now(), list };
  return list;
}

function validateNews(n) {
  if (!n.title || !String(n.title).trim()) throw Object.assign(new Error('Il titolo è obbligatorio'), { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date || '')) throw Object.assign(new Error('Data non valida'), { status: 400 });
  const cats = (n.categories || []).filter((c) => CATEGORIES.includes(c));
  if (!cats.length) throw Object.assign(new Error('Scegli almeno una categoria'), { status: 400 });
  const media = (u) => typeof u === 'string' && /^\/media\/[a-z0-9._-]+$/i.test(u);
  return {
    title: String(n.title).trim().slice(0, 200),
    date: n.date,
    categories: cats,
    featured: Boolean(n.featured),
    cover: media(n.cover) ? n.cover : undefined,
    gallery: (n.gallery || []).filter(media),
    videos: (n.videos || []).filter((v) => /^[\w-]{11}$/.test(v)),
    excerpt: String(n.excerpt || '').trim().slice(0, 300),
    legacyId: n.legacyId, legacyUrl: n.legacyUrl,
    body: sanitizeHtml(n.body),
  };
}
const blobsFrom = (uploads) => (Array.isArray(uploads) ? uploads : [])
  .filter((u) => /^public\/(media|docs)\/[a-z0-9._-]+$/i.test(u.path) && /^[0-9a-f]{40}$/.test(u.blob))
  .map((u) => ({ path: u.path, blob: u.blob }));

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x');
  const route = (url.searchParams.get('__path') || url.pathname.replace(/^\/api\/?/, '')).replace(/^\/+|\/+$/g, '');
  const parts = route.split('/');
  const method = req.method;
  const store = getStore();
  try {
    if (route === 'config' && method === 'GET') {
      return send(res, 200, { siteUrl: process.env.SITE_URL || 'https://fsp-sanmarino.vercel.app', storeReady: store.configured, mode: store.kind, sections: DATA_FILES });
    }
    if (method !== 'GET' && req.headers['x-fsp'] !== '1') return send(res, 403, { error: 'Richiesta non valida' });

    if (route === 'login' && method === 'POST') {
      const ip = clientIp(req);
      if (tooManyAttempts(ip)) return send(res, 429, { error: 'Troppi tentativi. Riprova tra 15 minuti.' });
      const { username, password } = await readJson(req);
      const user = verifyCredentials(username, password);
      if (!user) { recordFailure(ip); await new Promise((r) => setTimeout(r, 600)); return send(res, 401, { error: 'Nome utente o password non corretti' }); }
      return send(res, 200, { user }, { 'Set-Cookie': createSessionCookie(user, isSecure(req)) });
    }
    if (route === 'logout' && method === 'POST') return send(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie(isSecure(req)) });

    const user = sessionUser(req);
    if (!user) return send(res, 401, { error: 'Sessione scaduta: accedi di nuovo' });
    if (route === 'me') return send(res, 200, { user });

    // ---- Notizie
    if (parts[0] === 'news') {
      const id = parts[1];
      if (id && !/^[a-z0-9-]+$/.test(id)) return send(res, 400, { error: 'Identificativo non valido' });
      if (!id && method === 'GET') {
        const list = await allNews(store);
        return send(res, 200, list.map(({ body, gallery, ...n }) => ({ ...n, photos: gallery.length })));
      }
      if (id && method === 'GET') {
        const text = await store.readText(`src/content/news/${id}.md`);
        return text ? send(res, 200, parseNews(id, text)) : send(res, 404, { error: 'Notizia non trovata' });
      }
      if (method === 'POST' || method === 'PUT') {
        const input = await readJson(req);
        const n = validateNews(input);
        let newId = id;
        if (!newId) {
          const ids = new Set((await allNews(store)).map((x) => x.id));
          const base = slugify(n.title); newId = base; let i = 2;
          while (ids.has(newId)) newId = `${base}-${i++}`;
        }
        const files = [{ path: `src/content/news/${newId}.md`, text: serializeNews(n) }, ...blobsFrom(input.uploads)];
        const r = await store.commit(files, `[Segreteria] ${id ? 'Modificata' : 'Nuova'} notizia: ${n.title}`, user);
        newsCache = null;
        return send(res, 200, { id: newId, commit: r.sha });
      }
      if (id && method === 'DELETE') {
        const text = await store.readText(`src/content/news/${id}.md`);
        if (!text) return send(res, 404, { error: 'Notizia non trovata' });
        const r = await store.commit([{ path: `src/content/news/${id}.md`, delete: true }], `[Segreteria] Eliminata notizia: ${parseNews(id, text).title}`, user);
        newsCache = null;
        return send(res, 200, { ok: true, commit: r.sha });
      }
    }

    // ---- Dati delle pagine (JSON)
    if (parts[0] === 'data' && DATA_FILES[parts[1]]) {
      const path = dataPath(parts[1]);
      const current = await store.readText(path);
      if (method === 'GET') return send(res, 200, current ? JSON.parse(current) : null);
      if (method === 'PUT') {
        const input = await readJson(req);
        const value = input.value;
        if (current !== null && Array.isArray(JSON.parse(current)) !== Array.isArray(value)) return send(res, 400, { error: 'Formato dei dati non valido' });
        if (value === null || typeof value !== 'object') return send(res, 400, { error: 'Formato dei dati non valido' });
        const text = JSON.stringify(value, null, 2) + '\n';
        if (text.length > 500000) return send(res, 413, { error: 'Dati troppo grandi' });
        const r = await store.commit([{ path, text }, ...blobsFrom(input.uploads)], `[Segreteria] Aggiornato: ${DATA_FILES[parts[1]]}`, user);
        return send(res, 200, { ok: true, commit: r.sha });
      }
    }

    // ---- Caricamento foto e documenti (diventano parte del prossimo salvataggio)
    if (route === 'upload' && method === 'POST') {
      const { name = 'file', type, data } = await readJson(req);
      const ext = MEDIA_TYPES[type];
      if (!ext) return send(res, 400, { error: 'Formato non supportato (usa foto JPG, PNG, WebP o documenti PDF)' });
      const buf = Buffer.from(String(data || ''), 'base64');
      if (!buf.length || buf.length > 3.2e6) return send(res, 413, { error: 'File troppo grande (massimo 3 MB)' });
      const folder = ext === 'pdf' ? 'docs' : 'media';
      const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const file = `u${stamp}-${slugify(String(name).replace(/\.[a-z0-9]+$/i, '')).slice(0, 50)}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const blob = await store.uploadBlob(buf.toString('base64'));
      return send(res, 200, { path: `public/${folder}/${file}`, url: `/${folder}/${file}`, blob });
    }

    if (route === 'history' && method === 'GET') return send(res, 200, await store.history(40));

    return send(res, 404, { error: 'Operazione non trovata' });
  } catch (e) {
    console.error(e);
    return send(res, e.status || 500, { error: e.status ? e.message : 'Errore imprevisto. Riprova tra poco.' });
  }
}
