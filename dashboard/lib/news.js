// Lettura e scrittura delle notizie (file Markdown con intestazione in src/content/news/).
export const CATEGORIES = ['giovanili', 'nazionali', 'campionato', 'minibasket', 'federazione', 'hall-of-fame'];
const FIELDS = ['title', 'date', 'categories', 'featured', 'cover', 'gallery', 'videos', 'excerpt', 'legacyId', 'legacyUrl'];

export function parseNews(id, text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const data = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i < 0) continue;
      const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim();
      try { data[k] = JSON.parse(v); } catch { data[k] = v.replace(/^["']|["']$/g, ''); }
    }
  }
  return { id, ...data, categories: data.categories || ['federazione'], gallery: data.gallery || [], featured: Boolean(data.featured), body: (m ? m[2] : text).trim() };
}

export const textOf = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

export function serializeNews(n) {
  const data = { ...n };
  if (!data.excerpt) { const t = textOf(n.body); data.excerpt = t.length > 200 ? t.slice(0, 200).replace(/\s+\S*$/, '') + '…' : t; }
  const lines = FIELDS.filter((k) => data[k] !== undefined && data[k] !== '' && !(Array.isArray(data[k]) && !data[k].length) && !(k === 'featured' && !data[k]))
    .map((k) => `${k}: ${JSON.stringify(data[k])}`);
  return `---\n${lines.join('\n')}\n---\n\n${String(n.body || '').trim()}\n`;
}

export function slugify(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '') || 'notizia';
}

/** Pulisce l'HTML dell'editor: tiene solo tag e attributi sicuri. */
export function sanitizeHtml(html) {
  const allowed = new Set(['p', 'br', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'blockquote', 'img', 'iframe', 'table', 'thead', 'tbody', 'tr', 'td', 'th']);
  return String(html || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tag, name, attrs) => {
      name = name.toLowerCase();
      if (name === 'b') name = 'strong';
      if (name === 'i') name = 'em';
      if (!allowed.has(name)) return '';
      if (tag.startsWith('</')) return `</${name}>`;
      const get = (a) => (attrs.match(new RegExp(`\\s${a}\\s*=\\s*"([^"]*)"`, 'i')) || [])[1];
      const safeUrl = (u) => (u && /^(https?:|mailto:|tel:|\/)/i.test(u.trim()) ? u.trim().replace(/"/g, '&quot;') : null);
      if (name === 'a') { const h = safeUrl(get('href')); return h ? `<a href="${h}"${/^https?:/i.test(h) ? ' rel="noopener" target="_blank"' : ''}>` : '<a>'; }
      if (name === 'img') { const s = safeUrl(get('src')); return s ? `<img src="${s}" alt="${(get('alt') || '').replace(/"/g, '&quot;')}" loading="lazy">` : ''; }
      if (name === 'iframe') { const s = get('src') || ''; return /^https:\/\/(www\.)?(youtube(-nocookie)?\.com|player\.vimeo\.com)\//.test(s) ? `<iframe src="${s}" loading="lazy" allowfullscreen>` : ''; }
      return `<${name}>`;
    })
    .replace(/<p>\s*(<br>)?\s*<\/p>/g, '')
    .trim();
}
