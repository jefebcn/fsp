// Area Segreteria FSP – applicazione della dashboard (nessuna dipendenza oltre all'editor Quill).

// ---------- Utilità ----------
const $ = (sel, el = document) => el.querySelector(sel);
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'value') el.value = v;
    else if (k === 'checked') el.checked = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) if (c !== null && c !== undefined && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}
const ICON = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
  news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
  bell: '<path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 004 0"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.6 5.6c3.5 3.5 3.5 9.3 0 12.8M18.4 5.6c-3.5 3.5-3.5 9.3 0 12.8"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  court: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M12 5v14"/><circle cx="12" cy="12" r="2.5"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  child: '<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7M8 11l4-2 4 2M9.5 21l2.5-6 2.5 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  heart: '<path d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.2 4.5 7.3 4.5c2 0 3.5 1.1 4.7 2.7 1.2-1.6 2.7-2.7 4.7-2.7 3.1 0 5.3 2.9 4.3 6.2-1.5 4.7-9 9.3-9 9.3z"/>',
  sheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  out: '<path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/>',
  save: '<path d="M5 3h11l3 3v15H5zM8 3v5h7M8 21v-7h8v7"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>',
  file: '<path d="M6 3h8l5 5v13H6zM14 3v5h5"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>',
};
const icon = (n, cls = 'icon') => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '2'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('class', cls); s.setAttribute('aria-hidden', 'true'); s.innerHTML = ICON[n] || ''; return s; };
const fmtDate = (d) => { try { return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d.length === 10 ? d + 'T12:00:00' : d)); } catch { return d; } };
const fmtDateTime = (d) => new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const clone = (x) => JSON.parse(JSON.stringify(x));

function toast(msg, kind = '') {
  const t = h('div', { class: `toast ${kind ? 'toast--' + kind : ''}` }, msg);
  $('#toast').append(t);
  setTimeout(() => t.remove(), kind === 'err' ? 7000 : 4500);
}
function confirmDialog(title, text, okLabel = 'Conferma', danger = false) {
  return new Promise((resolve) => {
    const d = h('dialog', {}, h('h2', {}, title), h('p', {}, text),
      h('div', { class: 'actions' },
        h('button', { class: 'btn', onclick: () => { d.close(); resolve(false); } }, 'Annulla'),
        h('button', { class: `btn ${danger ? 'btn--danger' : 'btn--navy'}`, onclick: () => { d.close(); resolve(true); } }, okLabel)));
    d.addEventListener('close', () => { d.remove(); resolve(false); });
    document.body.append(d); d.showModal();
  });
}

// ---------- API ----------
const state = { config: null, user: null, news: null, dirty: false };
async function api(path, { method = 'GET', body } = {}) {
  const r = await fetch(`/api/${path}`, { method, credentials: 'same-origin', headers: { ...(method !== 'GET' ? { 'X-FSP': '1', 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await r.json(); } catch {}
  if (r.status === 401 && path !== 'login') { const was = state.user; state.user = null; if (was) renderLogin('La sessione è scaduta: accedi di nuovo.'); throw new Error('401'); }
  if (!r.ok) throw new Error(data?.error || `Errore ${r.status}`);
  return data;
}

// ---------- Foto e documenti ----------
const previews = new Map(); // url sul sito -> anteprima locale (finché il sito non è aggiornato)
const mediaSrc = (url) => (!url ? '' : previews.get(url) || (url.startsWith('/') ? state.config.siteUrl + url : url));
function readAsDataUrl(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); }); }
async function toWebp(file, maxW = 1600) {
  const src = await readAsDataUrl(file);
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Immagine non leggibile')); i.src = src; });
  const scale = Math.min(1, maxW / img.width);
  const c = document.createElement('canvas'); c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  const dataUrl = c.toDataURL('image/webp', 0.82);
  return dataUrl.startsWith('data:image/webp') ? { dataUrl, type: 'image/webp' } : { dataUrl: c.toDataURL('image/jpeg', 0.85), type: 'image/jpeg' };
}
/** Carica un file e restituisce l'indirizzo che avrà sul sito. uploads: array dove registrare il file per il salvataggio. */
async function uploadFile(file, uploads, maxW) {
  let dataUrl, type;
  if (file.type === 'application/pdf') { dataUrl = await readAsDataUrl(file); type = file.type; }
  else if (file.type.startsWith('image/')) ({ dataUrl, type } = await toWebp(file, maxW));
  else throw new Error('Formato non supportato: usa foto (JPG, PNG, WebP) o PDF');
  const r = await api('upload', { method: 'POST', body: { name: file.name, type, data: dataUrl.split(',')[1] } });
  uploads.push({ path: r.path, blob: r.blob });
  if (type !== 'application/pdf') previews.set(r.url, dataUrl);
  return r.url;
}
function pickFiles({ accept = 'image/*', multiple = false } = {}) {
  return new Promise((resolve) => { const i = h('input', { type: 'file', accept, multiple }); i.onchange = () => resolve([...i.files]); i.click(); });
}

// ---------- Login ----------
function renderLogin(message = '') {
  const err = h('div', { class: 'login__err', role: 'alert', hidden: !message }, message);
  const form = h('form', { class: 'form', onsubmit: async (e) => {
    e.preventDefault();
    const btn = $('button', form); btn.disabled = true; btn.textContent = 'Accesso in corso…';
    try {
      const r = await api('login', { method: 'POST', body: { username: form.username.value, password: form.password.value } });
      state.user = r.user; start();
    } catch (ex) { err.hidden = false; err.textContent = ex.message; btn.disabled = false; btn.textContent = 'Accedi'; }
  } },
    h('div', { class: 'field' }, h('label', { for: 'u' }, 'Nome utente'), h('input', { id: 'u', name: 'username', type: 'text', autocomplete: 'username', required: true, autocapitalize: 'none' })),
    h('div', { class: 'field' }, h('label', { for: 'p' }, 'Password'), h('input', { id: 'p', name: 'password', type: 'password', autocomplete: 'current-password', required: true })),
    h('button', { class: 'btn btn--primary', type: 'submit' }, 'Accedi'));
  $('#app').replaceChildren(h('main', { class: 'login' }, h('div', { class: 'login__card' },
    h('img', { src: '/assets/logo.webp', alt: 'FSP – Federazione Sammarinese Pallacanestro' }),
    h('h1', {}, 'Area Segreteria'), h('p', {}, 'Accedi per gestire notizie, pagine e contenuti del sito della Federazione.'),
    err, form,
    h('p', { class: 'login__foot' }, 'Accesso riservato alla segreteria FSP. Credenziali dimenticate? Contatta l’amministratore del sito.'))));
  $('#u').focus();
}

// ---------- Sezioni modificabili (schema dei moduli) ----------
const CATS = { giovanili: 'Giovanili', nazionali: 'Nazionali', campionato: 'Campionato RSM', minibasket: 'Minibasket', federazione: 'Federazione', 'hall-of-fame': 'Hall of Fame' };
const F = {
  text: (key, label, hint) => ({ key, type: 'text', label, hint }),
  area: (key, label, hint) => ({ key, type: 'textarea', label, hint }),
};
const person = { type: 'object', fields: [F.text('name', 'Nome e cognome'), F.text('role', 'Ruolo'), { key: 'photo', type: 'image', label: 'Foto', variant: 'round', maxW: 600 }] };
const SECTIONS = {
  avviso: {
    icon: 'bell', title: 'Avviso in evidenza', page: '/',
    desc: 'Un messaggio in cima a tutte le pagine del sito: iscrizioni aperte, palestra chiusa, cambio orari…',
    schema: { type: 'object', fields: [
      { key: 'attivo', type: 'bool', label: 'Mostra l’avviso sul sito' },
      F.area('testo', 'Testo dell’avviso', 'Breve e chiaro, una o due frasi.'),
      F.text('link', 'Link (facoltativo)', 'Una pagina del sito (es. /attivita/centro-estivo/) o un indirizzo completo.'),
      F.text('etichettaLink', 'Testo del link', 'Es. “Iscriviti”, “Scopri di più”.'),
      { key: 'tipo', type: 'select', label: 'Colore', options: [['info', 'Arancio · informazione'], ['successo', 'Verde · buona notizia'], ['urgente', 'Rosso · urgente']] },
      { key: 'scadenza', type: 'date', label: 'Nascondi automaticamente dopo il', hint: 'Facoltativo. Il sito lo nasconde alla prima pubblicazione dopo questa data.' },
    ] },
  },
  contatti: {
    icon: 'phone', title: 'Contatti e social', page: '/contatti/',
    desc: 'Indirizzo, telefoni, e-mail e social mostrati in tutto il sito (piè di pagina, pagina Contatti, home).',
    schema: { type: 'object', fields: [
      { key: 'email', type: 'email', label: 'E-mail della segreteria' },
      { type: 'row', fields: [{ key: 'phone', type: 'tel', label: 'Telefono' }, { key: 'mobile', type: 'tel', label: 'Cellulare' }, { key: 'fax', type: 'tel', label: 'Fax' }] },
      { key: 'address', type: 'object', label: 'Indirizzo', fields: [F.text('place', 'Luogo (es. Centro Sportivo, Serravalle)'), F.text('street', 'Via e numero'), { type: 'row', fields: [F.text('cap', 'CAP'), F.text('city', 'Località'), F.text('country', 'Stato')] }] },
      { key: 'social', type: 'object', label: 'Social e link', fields: [{ key: 'instagram', type: 'url', label: 'Instagram' }, { key: 'facebook', type: 'url', label: 'Pagina Facebook' }, { key: 'facebookGroup', type: 'url', label: 'Gruppo Facebook' }, { key: 'fibaEurope', type: 'url', label: 'FIBA Europe' }] },
      F.text('coe', 'Codice operatore economico (C.o.E.)'),
      F.area('description', 'Descrizione del sito per Google', 'Una frase che compare nei risultati di ricerca.'),
    ] },
  },
  direttivo: { icon: 'users', title: 'Consiglio direttivo', page: '/federazione/direttivo/', desc: 'Le persone del consiglio, nell’ordine in cui appaiono sul sito.', schema: { type: 'list', item: person, itemLabel: (x) => x.name || 'Nuova persona', newItem: () => ({ name: '', role: '' }) } },
  'staff-tecnico': { icon: 'ball', title: 'Staff tecnico', page: '/federazione/staff-tecnico/', desc: 'Allenatori, istruttori e collaboratori. I nomi usati qui compaiono anche nelle pagine delle squadre.', schema: { type: 'list', item: person, itemLabel: (x) => x.name || 'Nuova persona', newItem: () => ({ name: '', role: '' }) } },
  'attivita-federazione': { icon: 'list', title: 'Attività della Federazione', page: '/federazione/', desc: 'L’elenco “Le attività della Federazione” nella pagina Chi siamo.', schema: { type: 'strings', label: 'Attività', multiline: true } },
  impianti: {
    icon: 'court', title: 'Impianti', page: '/federazione/impianti/', desc: 'Le palestre con indirizzo, caratteristiche e foto.',
    schema: { type: 'list', itemLabel: (x) => x.name || 'Nuovo impianto', newItem: () => ({ name: '', venue: '', address: [], built: '', surface: '', seats: '', photo: '' }), item: { type: 'object', fields: [
      F.text('name', 'Nome della palestra'), F.text('venue', 'Struttura'), { key: 'address', type: 'lines', label: 'Indirizzo', hint: 'Una riga per volta (via, CAP e località).' },
      { type: 'row', fields: [{ key: 'phone', type: 'tel', label: 'Telefono' }, F.text('built', 'Anno di costruzione')] },
      { type: 'row', fields: [F.text('surface', 'Campo (superficie e misure)'), F.text('seats', 'Posti in tribuna')] },
      { key: 'photo', type: 'image', label: 'Foto', maxW: 1200 },
    ] } },
  },
  nazionali: {
    icon: 'flag', title: 'Nazionali', page: '/nazionali/', desc: 'Rose e staff delle squadre nazionali. Ogni squadra ha la sua pagina sul sito.',
    schema: { type: 'list', itemLabel: (x) => `${x.name || 'Nuova squadra'}${x.season ? ' · ' + x.season : ''}`, newItem: () => ({ slug: '', name: 'Nazionale ', season: String(new Date().getFullYear()), photo: '', players: [], staff: [], keywords: '' }), item: { type: 'object', fields: [
      { type: 'row', fields: [F.text('name', 'Nome della squadra'), F.text('season', 'Stagione')] },
      { key: 'photo', type: 'image', label: 'Foto di squadra', maxW: 1400 },
      { key: 'players', type: 'pairs', label: 'Giocatori', a: ['name', 'Nome e cognome'], b: ['born', 'Data di nascita (facoltativa)'] },
      { key: 'staff', type: 'pairs', label: 'Staff', a: ['role', 'Ruolo'], b: ['name', 'Nome'] },
      F.text('keywords', 'Parole chiave per le notizie collegate', 'Separate da virgola: le notizie che le contengono nel titolo compaiono nella pagina della squadra.'),
    ] } },
  },
  giovanili: {
    icon: 'child', title: 'Squadre giovanili', page: '/giovanili/', desc: 'Le squadre del settore giovanile. Ogni squadra ha la sua pagina con staff e notizie.',
    schema: { type: 'list', itemLabel: (x) => x.name || 'Nuova squadra', newItem: () => ({ slug: '', name: '', age: '', coaches: [], keywords: '' }), item: { type: 'object', fields: [
      { type: 'row', fields: [F.text('name', 'Nome (es. Under 15)'), F.text('age', 'Età indicativa (es. 13-15 anni)')] },
      { key: 'coaches', type: 'strings', label: 'Allenatori', hint: 'Scrivi i nomi esattamente come nello Staff tecnico, così compaiono con foto e ruolo.' },
      F.text('keywords', 'Parole chiave per le notizie collegate', 'Separate da virgola, es. “under 15, u15”.'),
    ] } },
  },
  'centro-estivo': {
    icon: 'sun', title: 'Centro estivo', page: '/attivita/centro-estivo/', desc: 'Informazioni, programma della giornata, tariffe e volantino del centro estivo.',
    schema: { type: 'object', fields: [
      F.area('intro', 'Introduzione'),
      { key: 'poster', type: 'image', label: 'Volantino', maxW: 1400 },
      { key: 'info', type: 'list', label: 'Informazioni principali', itemLabel: (x) => x.title || 'Nuova informazione', newItem: () => ({ icon: 'calendar', title: '', text: '' }), item: { type: 'object', fields: [
        { type: 'row', fields: [F.text('title', 'Titolo (es. Turni)'), { key: 'icon', type: 'select', label: 'Icona', options: [['child', 'Bambino'], ['calendar', 'Calendario'], ['pin', 'Luogo'], ['bus', 'Navetta'], ['clock', 'Orario'], ['users', 'Persone'], ['ball', 'Pallone'], ['heart', 'Cuore'], ['sun', 'Sole'], ['food', 'Pasto'], ['star', 'Stella'], ['phone', 'Telefono'], ['mail', 'E-mail']] }] },
        F.area('text', 'Testo'),
      ] } },
      { key: 'programma', type: 'pairs', label: 'Programma della giornata', a: ['ora', 'Orario'], b: ['attivita', 'Attività'] },
      F.area('tariffe', 'Tariffe', 'Es. prezzi per settimana, sconti fratelli…'),
      { key: 'responsabile', type: 'object', label: 'Responsabile', fields: [{ type: 'row', fields: [F.text('nome', 'Nome'), { key: 'telefono', type: 'tel', label: 'Telefono' }] }] },
    ] },
  },
  partner: {
    icon: 'heart', title: 'Partner e sponsor', page: '/', desc: 'I loghi in fondo alla home page.',
    schema: { type: 'list', itemLabel: (x) => x.name || 'Nuovo partner', newItem: () => ({ name: '', url: '', logo: '' }), item: { type: 'object', fields: [
      { type: 'row', fields: [F.text('name', 'Nome'), { key: 'url', type: 'url', label: 'Sito web (facoltativo)' }] },
      { key: 'logo', type: 'image', label: 'Logo', variant: 'logo', maxW: 500 },
    ] } },
  },
};
const NAV = [
  ['Principale', [['', 'home', 'Panoramica'], ['notizie', 'news', 'Notizie'], ['sezione/avviso', 'bell', 'Avviso in evidenza']]],
  ['Pagine del sito', ['contatti', 'direttivo', 'staff-tecnico', 'attivita-federazione', 'impianti', 'nazionali', 'giovanili', 'centro-estivo', 'partner'].map((k) => [`sezione/${k}`, SECTIONS[k].icon, SECTIONS[k].title])],
  ['Strumenti', [['foglio', 'sheet', 'Foglio Google'], ['storico', 'clock', 'Storico modifiche'], ['guida', 'help', 'Guida']]],
];

// Rendering generico dei moduli: modifica direttamente l'oggetto "value".
function renderField(f, obj, ctx) {
  if (f.type === 'row') return h('div', { class: 'row' }, f.fields.map((x) => renderField(x, obj, ctx)));
  const id = `f${Math.random().toString(36).slice(2, 8)}`;
  const set = (v) => { obj[f.key] = v; ctx.dirty(); };
  const wrap = (control, labelFor = true) => h('div', { class: 'field' }, f.label && (labelFor ? h('label', { for: id }, f.label) : h('span', { class: 'label' }, f.label)), control, f.hint && h('small', {}, f.hint));
  switch (f.type) {
    case 'bool': return h('label', { class: 'switch' }, h('input', { type: 'checkbox', checked: Boolean(obj[f.key]), onchange: (e) => set(e.target.checked) }), f.label);
    case 'textarea': return wrap(h('textarea', { id, value: obj[f.key] ?? '', oninput: (e) => set(e.target.value) }));
    case 'select': return wrap(h('select', { id, onchange: (e) => set(e.target.value) }, f.options.map(([v, l]) => h('option', { value: v, selected: obj[f.key] === v }, l))));
    case 'date': case 'email': case 'tel': case 'url': case 'text':
      return wrap(h('input', { id, type: f.type, value: obj[f.key] ?? '', oninput: (e) => set(e.target.value) }));
    case 'image': return wrap(imageField(obj, f, ctx), false);
    case 'object': { obj[f.key] ??= {}; const box = h('fieldset', { class: 'item' }, h('legend', { class: 'label', style: 'font-weight:700;color:var(--navy);padding:0 6px' }, f.label), h('div', { class: 'form' }, f.fields.map((x) => renderField(x, obj[f.key], ctx)))); return box; }
    case 'lines': return wrap(h('textarea', { id, rows: 3, value: (obj[f.key] || []).join('\n'), oninput: (e) => set(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)) }));
    case 'strings': { obj[f.key] ??= []; return wrap(stringsEditor(obj[f.key], f, ctx), false); }
    case 'pairs': { obj[f.key] ??= []; return wrap(pairsEditor(obj[f.key], f, ctx), false); }
    case 'list': { obj[f.key] ??= []; return h('div', { class: 'field' }, h('span', { class: 'label' }, f.label), listEditor(obj[f.key], f, ctx)); }
  }
  return h('div');
}
function imageField(obj, f, ctx) {
  const box = h('div', { class: `img-field ${f.variant || ''}` });
  const draw = () => box.replaceChildren(
    obj[f.key] ? h('img', { src: mediaSrc(obj[f.key]), alt: '' }) : h('div', { class: 'img-ph' }, 'Nessuna foto'),
    h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' },
      h('button', { type: 'button', class: 'btn btn--sm', onclick: async () => {
        const [file] = await pickFiles(); if (!file) return;
        try { box.style.opacity = .5; obj[f.key] = await uploadFile(file, ctx.uploads, f.maxW || 1600); ctx.dirty(); draw(); } catch (e) { toast(e.message, 'err'); } finally { box.style.opacity = 1; }
      } }, icon('photo'), obj[f.key] ? 'Cambia foto' : 'Carica foto'),
      obj[f.key] && h('button', { type: 'button', class: 'btn btn--sm btn--danger', onclick: () => { obj[f.key] = ''; ctx.dirty(); draw(); } }, 'Rimuovi')));
  draw();
  return box;
}
function moveTools(arr, i, redraw, ctx, label) {
  return h('div', { class: 'item__tools' },
    h('button', { type: 'button', class: 'btn btn--sm btn--ghost', title: 'Sposta su', 'aria-label': `Sposta su ${label}`, disabled: i === 0, onclick: () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; ctx.dirty(); redraw(); } }, icon('up')),
    h('button', { type: 'button', class: 'btn btn--sm btn--ghost', title: 'Sposta giù', 'aria-label': `Sposta giù ${label}`, disabled: i === arr.length - 1, onclick: () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; ctx.dirty(); redraw(); } }, icon('down')),
    h('button', { type: 'button', class: 'btn btn--sm btn--ghost btn--danger', title: 'Elimina', 'aria-label': `Elimina ${label}`, onclick: async () => { if (await confirmDialog('Eliminare?', `“${label}” verrà tolto dall’elenco. La modifica diventa definitiva quando premi Salva.`, 'Elimina', true)) { arr.splice(i, 1); ctx.dirty(); redraw(); } } }, icon('trash')));
}
function listEditor(arr, f, ctx) {
  const box = h('div', { class: 'list' });
  const redraw = () => box.replaceChildren(
    ...arr.map((it, i) => {
      const label = f.itemLabel(it);
      const det = h('details', { class: 'item', open: it.__open || !label || arr.length <= 3 ? true : undefined },
        h('summary', {}, h('span', {}, label)),
        h('div', { class: 'item__head' }, h('span', { class: 'muted' }, `${i + 1} di ${arr.length}`), moveTools(arr, i, redraw, ctx, label)),
        h('div', { class: 'form' }, f.item.fields.map((x) => renderField(x, it, ctx))));
      return det;
    }),
    h('button', { type: 'button', class: 'btn', onclick: () => { const n = f.newItem(); Object.defineProperty(n, '__open', { value: true, enumerable: false }); arr.push(n); ctx.dirty(); redraw(); box.lastElementChild.previousElementSibling?.querySelector('input,textarea')?.focus(); } }, icon('plus'), 'Aggiungi'));
  redraw();
  return box;
}
function stringsEditor(arr, f, ctx) {
  const box = h('div', { class: 'sublist' });
  const redraw = () => box.replaceChildren(
    ...arr.map((s, i) => h('div', { class: 'subrow one' },
      f.multiline ? h('textarea', { rows: 2, value: s, 'aria-label': `${f.label || 'Voce'} ${i + 1}`, oninput: (e) => { arr[i] = e.target.value; ctx.dirty(); } }) : h('input', { type: 'text', value: s, 'aria-label': `${f.label || 'Voce'} ${i + 1}`, oninput: (e) => { arr[i] = e.target.value; ctx.dirty(); } }),
      moveTools(arr, i, redraw, ctx, s || 'voce'))),
    h('div', {}, h('button', { type: 'button', class: 'btn btn--sm', onclick: () => { arr.push(''); ctx.dirty(); redraw(); box.querySelectorAll('input,textarea')[arr.length - 1]?.focus(); } }, icon('plus'), 'Aggiungi')));
  redraw();
  return box;
}
function pairsEditor(arr, f, ctx) {
  const [ka, la] = f.a, [kb, lb] = f.b;
  const box = h('div', { class: 'sublist' });
  const redraw = () => box.replaceChildren(
    arr.length ? h('div', { class: 'subrow muted', style: 'font-size:.85rem;font-weight:700' }, h('span', {}, la), h('span', {}, lb), h('span', {})) : h('p', { class: 'muted', style: 'margin:0' }, 'Nessuna voce.'),
    ...arr.map((it, i) => h('div', { class: 'subrow' },
      h('input', { type: 'text', value: it[ka] ?? '', 'aria-label': `${la} ${i + 1}`, oninput: (e) => { it[ka] = e.target.value; ctx.dirty(); } }),
      h('input', { type: 'text', value: it[kb] ?? '', 'aria-label': `${lb} ${i + 1}`, oninput: (e) => { it[kb] = e.target.value; ctx.dirty(); } }),
      moveTools(arr, i, redraw, ctx, it[ka] || 'voce'))),
    h('div', {}, h('button', { type: 'button', class: 'btn btn--sm', onclick: () => { arr.push({ [ka]: '', [kb]: '' }); ctx.dirty(); redraw(); box.querySelectorAll('.subrow input')[(arr.length - 1) * 2]?.focus(); } }, icon('plus'), 'Aggiungi')));
  redraw();
  return box;
}
// Pulizia prima del salvataggio (righe vuote, identificativi delle pagine).
function cleanSection(name, v) {
  const nonEmpty = (o) => Object.values(o).some((x) => (Array.isArray(x) ? x.length : String(x ?? '').trim()));
  if (name === 'attivita-federazione') return v.map((s) => s.trim()).filter(Boolean);
  if (['direttivo', 'staff-tecnico', 'partner', 'impianti'].includes(name)) return v.filter(nonEmpty).map((p) => { const o = { ...p }; if (!o.photo) delete o.photo; if (!o.url) delete o.url; if (!o.phone) delete o.phone; return o; });
  if (name === 'nazionali' || name === 'giovanili') {
    const used = new Set();
    return v.filter((s) => s.name?.trim()).map((s) => {
      let slug = s.slug || slugify(s.name.replace(/^nazionale\s+/i, '')); let i = 2; while (used.has(slug)) slug = `${slugify(s.name)}-${i++}`; used.add(slug);
      const o = { ...s, slug };
      if (o.players) o.players = o.players.filter((p) => p.name?.trim()).map((p) => (p.born ? p : { name: p.name }));
      if (o.staff) o.staff = o.staff.filter((p) => p.name?.trim() || p.role?.trim());
      if (o.coaches) o.coaches = o.coaches.map((c) => c.trim()).filter(Boolean);
      if (!o.keywords?.trim()) o.keywords = s.name.toLowerCase();
      return o;
    });
  }
  if (name === 'centro-estivo') return { ...v, info: (v.info || []).filter((x) => x.title?.trim() || x.text?.trim()), programma: (v.programma || []).filter((x) => x.ora?.trim() || x.attivita?.trim()) };
  return v;
}

// ---------- Pagine ----------
function pageHead(title, sub, ...actions) { return h('div', { class: 'page-head' }, h('div', {}, h('h1', {}, title), sub && h('p', {}, sub)), actions.length ? h('div', { class: 'actions' }, actions) : null); }
const siteLink = (path, label = 'Vedi sul sito') => h('a', { class: 'btn', href: state.config.siteUrl + path, target: '_blank', rel: 'noopener' }, icon('ext'), label);
const publishNote = () => h('div', { class: 'note' }, 'Quando salvi, il sito si aggiorna da solo in circa 1-2 minuti. Ogni salvataggio resta nello ', h('a', { href: '#/storico' }, 'storico'), '.');

async function loadNews(force) { if (!state.news || force) state.news = await api('news'); return state.news; }

async function pageDashboard(c) {
  c.append(pageHead(`Ciao, ${state.user}!`, 'Da qui gestisci tutti i contenuti del sito della Federazione.'));
  if (!state.config.storeReady) c.append(h('div', { class: 'note note--warn' }, h('strong', {}, 'Salvataggio non ancora attivo. '), 'Puoi consultare tutto, ma per salvare le modifiche l’amministratore deve completare il collegamento a GitHub (vedi la ', h('a', { href: '#/guida' }, 'Guida'), ').'));
  const [news, avviso, hist] = await Promise.all([loadNews().catch(() => []), api('data/avviso').catch(() => null), api('history').catch(() => [])]);
  c.append(h('div', { class: 'cards' },
    h('div', { class: 'card stat' }, h('strong', {}, news.length), h('span', {}, 'notizie pubblicate')),
    h('div', { class: 'card stat' }, h('strong', { style: 'font-size:1.3rem;padding:.35rem 0' }, news[0] ? fmtDate(news[0].date) : '—'), h('span', {}, 'ultima notizia pubblicata')),
    h('div', { class: 'card stat' }, h('strong', {}, news.filter((n) => n.featured).length), h('span', {}, 'in primo piano')),
    h('div', { class: 'card stat' }, h('strong', { style: `color:${avviso?.attivo ? 'var(--green)' : 'var(--muted)'}` }, avviso?.attivo ? 'Attivo' : 'Spento'), h('span', {}, 'avviso in evidenza'))));
  c.append(h('h2', { class: 'section-gap' }, 'Cosa vuoi fare?'), h('div', { class: 'quick' },
    h('a', { href: '#/notizie/nuova' }, h('span', { class: 'qi', style: 'background:var(--orange)' }, icon('plus')), h('span', {}, 'Pubblica una notizia', h('small', {}, 'Testo, foto e galleria'))),
    h('a', { href: '#/sezione/avviso' }, h('span', { class: 'qi' }, icon('bell')), h('span', {}, 'Avviso in evidenza', h('small', {}, 'Messaggio in cima al sito'))),
    h('a', { href: '#/sezione/centro-estivo' }, h('span', { class: 'qi' }, icon('sun')), h('span', {}, 'Centro estivo', h('small', {}, 'Date, orari, tariffe'))),
    h('a', { href: '#/sezione/nazionali' }, h('span', { class: 'qi' }, icon('flag')), h('span', {}, 'Rose delle Nazionali', h('small', {}, 'Giocatori e staff'))),
    h('a', { href: '#/foglio' }, h('span', { class: 'qi', style: 'background:var(--green)' }, icon('sheet')), h('span', {}, 'Foglio Google', h('small', {}, 'Il foglio di lavoro'))),
    h('a', { href: state.config.siteUrl, target: '_blank', rel: 'noopener' }, h('span', { class: 'qi', style: 'background:var(--cyan)' }, icon('ext')), h('span', {}, 'Apri il sito', h('small', {}, 'Come lo vedono le famiglie')))));
  c.append(h('div', { class: 'grid2 section-gap' },
    h('div', { class: 'card' }, h('h2', {}, 'Ultime notizie'), h('ul', { class: 'timeline' }, news.slice(0, 5).map((n) => h('li', {}, h('a', { href: `#/notizie/${n.id}`, class: 't-title' }, n.title), h('span', { class: 'muted' }, fmtDate(n.date))))), h('p', {}, h('a', { href: '#/notizie' }, 'Tutte le notizie →'))),
    h('div', { class: 'card' }, h('h2', {}, 'Ultime modifiche'), h('ul', { class: 'timeline' }, hist.slice(0, 5).map((x) => h('li', {}, h('span', {}, x.message.split('\n')[0]), h('span', { class: 'muted' }, fmtDateTime(x.date))))), h('p', {}, h('a', { href: '#/storico' }, 'Tutto lo storico →')))));
}

async function pageNewsList(c) {
  c.append(pageHead('Notizie', 'Tutte le notizie del sito, dalla più recente.', h('a', { class: 'btn btn--primary', href: '#/notizie/nuova' }, icon('plus'), 'Nuova notizia')));
  const news = await loadNews(true);
  const years = [...new Set(news.map((n) => String(n.date).slice(0, 4)))].sort().reverse();
  const q = h('input', { type: 'search', placeholder: 'Cerca per titolo…', 'aria-label': 'Cerca notizie' });
  const cat = h('select', { 'aria-label': 'Categoria' }, h('option', { value: '' }, 'Tutte le categorie'), Object.entries(CATS).map(([k, v]) => h('option', { value: k }, v)));
  const year = h('select', { 'aria-label': 'Anno' }, h('option', { value: '' }, 'Tutti gli anni'), years.map((y) => h('option', { value: y }, y)));
  const tbody = h('tbody'); const info = h('p', { class: 'muted' }); const pager = h('div', { class: 'pager' });
  let page = 1; const PER = 25;
  const draw = () => {
    const term = q.value.trim().toLowerCase();
    const list = news.filter((n) => (!term || n.title.toLowerCase().includes(term)) && (!cat.value || n.categories.includes(cat.value)) && (!year.value || String(n.date).startsWith(year.value)));
    const pages = Math.max(1, Math.ceil(list.length / PER)); page = Math.min(page, pages);
    info.textContent = `${list.length} notizie${list.length > PER ? ` · pagina ${page} di ${pages}` : ''}`;
    tbody.replaceChildren(...list.slice((page - 1) * PER, page * PER).map((n) => h('tr', {},
      h('td', { class: 'hide-sm' }, n.cover ? h('img', { class: 'thumb', src: mediaSrc(n.cover), alt: '', loading: 'lazy' }) : h('span', { class: 'thumb' })),
      h('td', {}, h('a', { class: 't-title', href: `#/notizie/${n.id}` }, n.title), h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;margin-top:4px' }, n.categories.map((k) => h('span', { class: 'chip' }, CATS[k] || k)), n.featured && h('span', { class: 'chip chip--star' }, '★ Primo piano'), n.photos ? h('span', { class: 'chip' }, `${n.photos} foto`) : null)),
      h('td', { class: 'hide-sm', style: 'white-space:nowrap' }, fmtDate(n.date)),
      h('td', {}, h('div', { class: 'actions' },
        h('a', { class: 'btn btn--sm', href: `#/notizie/${n.id}` }, icon('edit'), 'Modifica'),
        h('a', { class: 'btn btn--sm hide-sm', href: `${state.config.siteUrl}/news/${n.id}/`, target: '_blank', rel: 'noopener', title: 'Vedi sul sito', 'aria-label': `Vedi sul sito: ${n.title}` }, icon('ext')),
        h('button', { class: 'btn btn--sm btn--danger', 'aria-label': `Elimina: ${n.title}`, onclick: () => deleteNews(n) }, icon('trash')))))));
    pager.replaceChildren(
      h('button', { class: 'btn btn--sm', disabled: page <= 1, onclick: () => { page--; draw(); } }, '← Precedenti'),
      h('span', { class: 'muted' }, `${page} / ${pages}`),
      h('button', { class: 'btn btn--sm', disabled: page >= pages, onclick: () => { page++; draw(); } }, 'Successive →'));
  };
  [q, cat, year].forEach((el) => el.addEventListener('input', () => { page = 1; draw(); }));
  c.append(h('div', { class: 'toolbar' }, q, cat, year), info,
    h('table', { class: 'table' }, h('thead', {}, h('tr', {}, h('th', { class: 'hide-sm' }, 'Foto'), h('th', {}, 'Titolo'), h('th', { class: 'hide-sm' }, 'Data'), h('th', {}, h('span', { class: 'vh' }, 'Azioni')))), tbody), pager);
  draw();
}
async function deleteNews(n) {
  if (!(await confirmDialog('Eliminare la notizia?', `“${n.title}” verrà tolta dal sito. Se serve, potrà essere recuperata dallo storico delle modifiche.`, 'Elimina notizia', true))) return;
  try { await api(`news/${n.id}`, { method: 'DELETE' }); toast('Notizia eliminata. Il sito si aggiorna tra 1-2 minuti.', 'ok'); state.news = null; route(); } catch (e) { toast(e.message, 'err'); }
}

async function pageNewsEdit(c, id) {
  const isNew = !id;
  const n = isNew ? { title: '', date: today(), categories: [], featured: false, cover: '', gallery: [], videos: [], excerpt: '', body: '' } : await api(`news/${id}`);
  const ctx = { uploads: [], dirty: () => { state.dirty = true; } };
  c.append(pageHead(isNew ? 'Nuova notizia' : 'Modifica notizia', isNew ? 'Compila i campi e premi “Pubblica”.' : n.title, !isNew && siteLink(`/news/${id}/`)));
  c.append(publishNote());
  const form = h('form', { class: 'form', onsubmit: (e) => e.preventDefault() });
  form.append(
    renderField({ key: 'title', type: 'text', label: 'Titolo *' }, n, ctx),
    h('div', { class: 'row' }, renderField({ key: 'date', type: 'date', label: 'Data *' }, n, ctx),
      h('div', { class: 'field' }, h('span', { class: 'label' }, 'In evidenza'), h('label', { class: 'switch' }, h('input', { type: 'checkbox', checked: n.featured, onchange: (e) => { n.featured = e.target.checked; ctx.dirty(); } }), 'Mostra in primo piano in home'))),
    h('div', { class: 'field' }, h('span', { class: 'label' }, 'Categoria *'), h('div', { class: 'cats' }, Object.entries(CATS).map(([k, v]) => h('label', {}, h('input', { type: 'checkbox', checked: n.categories.includes(k), onchange: (e) => { n.categories = e.target.checked ? [...n.categories, k] : n.categories.filter((x) => x !== k); ctx.dirty(); } }), v)))),
    renderField({ key: 'cover', type: 'image', label: 'Foto principale', maxW: 1400 }, n, ctx));

  // Testo: editor visuale (Quill) o codice HTML
  const hasTable = /<table/i.test(n.body);
  const toAbs = (html) => html.replace(/(src|href)="\/(media|docs)\//g, `$1="${state.config.siteUrl}/$2/`);
  const toRel = (html) => { let s = html; for (const [url, data] of previews) s = s.split(data).join(url); return s.split(`${state.config.siteUrl}/media/`).join('/media/').split(`${state.config.siteUrl}/docs/`).join('/docs/'); };
  const edHost = h('div'); const src = h('textarea', { class: 'html-src', 'aria-label': 'Codice HTML del testo', hidden: true, oninput: ctx.dirty });
  const wrap = h('div', { class: 'editor-wrap' }, edHost, src);
  let quill = null; let mode = hasTable ? 'html' : 'visual';
  const getBody = () => (mode === 'html' ? src.value : toRel(quill.getSemanticHTML().replace(/&nbsp;/g, ' ')));
  const tabs = h('div', { class: 'tabs', role: 'group', 'aria-label': 'Modalità editor' });
  const setMode = (m, initial) => {
    if (!initial) { const body = getBody(); if (m === 'html') src.value = body; else quill.clipboard.dangerouslyPasteHTML(toAbs(body)); }
    mode = m; src.hidden = m !== 'html'; wrap.querySelector('.ql-toolbar')?.toggleAttribute('hidden', m === 'html'); edHost.hidden = m === 'html';
    tabs.replaceChildren(h('button', { type: 'button', 'aria-pressed': String(m === 'visual'), onclick: () => mode !== 'visual' && setMode('visual') }, 'Editor visuale'), h('button', { type: 'button', 'aria-pressed': String(m === 'html'), onclick: () => mode !== 'html' && setMode('html') }, 'Codice HTML'));
  };
  const attach = h('button', { type: 'button', class: 'btn btn--sm', onclick: async () => {
    const [file] = await pickFiles({ accept: 'application/pdf' }); if (!file) return;
    try { const url = await uploadFile(file, ctx.uploads); const label = file.name.replace(/\.pdf$/i, '');
      if (mode === 'html') src.setRangeText(`<a href="${url}">${label} (PDF)</a>`, src.selectionStart, src.selectionEnd, 'end');
      else { const r = quill.getSelection(true); quill.insertText(r.index, `${label} (PDF)`, { link: state.config.siteUrl + url }); }
      ctx.dirty(); toast('Documento allegato al testo.', 'ok');
    } catch (e) { toast(e.message, 'err'); }
  } }, icon('file'), 'Allega un PDF');
  form.append(h('div', { class: 'field' }, h('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap' }, h('span', { class: 'label' }, 'Testo della notizia'), h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, attach, tabs)),
    hasTable && h('div', { class: 'note note--warn', style: 'margin:0' }, 'Questa notizia contiene tabelle (tabellini o classifiche): per non perderle è aperta in modalità “Codice HTML”. Puoi modificare il testo tra i tag.'),
    wrap));
  form.append(renderField({ key: 'excerpt', type: 'textarea', label: 'Riassunto (facoltativo)', hint: 'Compare nelle anteprime. Se lo lasci vuoto viene preso l’inizio del testo.' }, n, ctx));

  // Galleria
  const gal = h('div', { class: 'gallery' });
  const drawGal = () => gal.replaceChildren(...n.gallery.map((u, i) => h('figure', {}, h('img', { src: mediaSrc(u), alt: `Foto ${i + 1}` }), h('button', { type: 'button', class: 'btn btn--sm btn--danger', 'aria-label': `Rimuovi foto ${i + 1}`, onclick: () => { n.gallery.splice(i, 1); ctx.dirty(); drawGal(); } }, icon('trash')))));
  const addPhotos = async (files) => {
    files = files.filter((f) => f.type.startsWith('image/')); if (!files.length) return;
    toast(`Caricamento di ${files.length} foto…`);
    for (const f of files) { try { n.gallery.push(await uploadFile(f, ctx.uploads)); ctx.dirty(); drawGal(); } catch (e) { toast(`${f.name}: ${e.message}`, 'err'); } }
  };
  const drop = h('div', { class: 'drop' }, 'Trascina qui le foto oppure ', h('button', { type: 'button', class: 'btn btn--sm', onclick: async () => addPhotos(await pickFiles({ multiple: true })) }, icon('photo'), 'Scegli le foto'), h('div', { class: 'muted', style: 'font-size:.85rem;margin-top:6px' }, 'Le foto vengono ridimensionate automaticamente per il web.'));
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); addPhotos([...e.dataTransfer.files]); });
  drawGal();
  form.append(h('div', { class: 'field' }, h('span', { class: 'label' }, 'Galleria fotografica'), gal, drop));
  form.append(h('div', { class: 'field' }, h('label', { for: 'yt' }, 'Video YouTube (facoltativo)'), h('input', { id: 'yt', type: 'url', placeholder: 'https://www.youtube.com/watch?v=…', value: (n.videos || []).map((v) => `https://youtu.be/${v}`).join(' '), oninput: (e) => { n.videos = [...e.target.value.matchAll(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/g)].map((m) => m[1]); ctx.dirty(); } }), h('small', {}, 'Incolla uno o più link, separati da spazio.')));

  const saveBtn = h('button', { type: 'button', class: 'btn btn--primary', onclick: async () => {
    n.body = getBody();
    if (!n.title.trim()) return toast('Scrivi il titolo della notizia.', 'err');
    if (!n.categories.length) return toast('Scegli almeno una categoria.', 'err');
    saveBtn.disabled = true; saveBtn.textContent = 'Pubblicazione…';
    try {
      const r = await api(isNew ? 'news' : `news/${id}`, { method: isNew ? 'POST' : 'PUT', body: { ...n, uploads: ctx.uploads } });
      state.dirty = false; state.news = null; ctx.uploads.length = 0;
      toast(isNew ? 'Notizia pubblicata! Sarà visibile sul sito tra 1-2 minuti.' : 'Modifiche salvate! Il sito si aggiorna tra 1-2 minuti.', 'ok');
      location.hash = `#/notizie/${r.id}`;
    } catch (e) { toast(e.message, 'err'); saveBtn.disabled = false; saveBtn.replaceChildren(icon('save'), isNew ? 'Pubblica' : 'Salva modifiche'); }
  } }, icon('save'), isNew ? 'Pubblica' : 'Salva modifiche');
  form.append(h('div', { class: 'savebar' }, saveBtn, h('a', { class: 'btn', href: '#/notizie' }, 'Annulla'), !isNew && h('button', { type: 'button', class: 'btn btn--danger', onclick: () => deleteNews(n) }, icon('trash'), 'Elimina')));
  c.append(form);

  // Quill (caricato da CDN)
  for (let i = 0; i < 50 && !window.Quill; i++) await new Promise((r) => setTimeout(r, 100));
  if (!window.Quill) { mode = 'html'; src.value = n.body; setMode('html', true); return; }
  quill = new window.Quill(edHost, { theme: 'snow', placeholder: 'Scrivi qui il testo della notizia…', modules: { toolbar: { container: [[{ header: [false, 2, 3] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['blockquote', 'link', 'image'], ['clean']], handlers: {
    image: async () => { const [file] = await pickFiles(); if (!file) return; try { const url = await uploadFile(file, ctx.uploads, 1400); const r = quill.getSelection(true); quill.insertEmbed(r.index, 'image', previews.get(url), 'user'); ctx.dirty(); } catch (e) { toast(e.message, 'err'); } },
  } } } });
  if (mode === 'html') src.value = n.body; else quill.clipboard.dangerouslyPasteHTML(toAbs(n.body));
  quill.on('text-change', ctx.dirty);
  setMode(mode, true);
  state.dirty = false;
}

async function pageSection(c, name) {
  const sec = SECTIONS[name];
  if (!sec) return pageNotFound(c);
  const value = await api(`data/${name}`);
  const ctx = { uploads: [], dirty: () => { state.dirty = true; } };
  c.append(pageHead(sec.title, sec.desc, siteLink(sec.page)), publishNote());
  const root = { v: value };
  const s = sec.schema;
  const body = s.type === 'object' ? h('div', { class: 'form' }, s.fields.map((f) => renderField(f, root.v, ctx)))
    : s.type === 'list' ? listEditor(root.v, s, ctx)
    : stringsEditor(root.v, s, ctx);
  const saveBtn = h('button', { type: 'button', class: 'btn btn--primary', onclick: async () => {
    saveBtn.disabled = true; saveBtn.textContent = 'Salvataggio…';
    try {
      await api(`data/${name}`, { method: 'PUT', body: { value: cleanSection(name, clone(root.v)), uploads: ctx.uploads } });
      state.dirty = false; ctx.uploads.length = 0;
      toast('Salvato! Il sito si aggiorna tra 1-2 minuti.', 'ok');
    } catch (e) { toast(e.message, 'err'); }
    saveBtn.disabled = false; saveBtn.replaceChildren(icon('save'), 'Salva modifiche');
  } }, icon('save'), 'Salva modifiche');
  c.append(h('form', { class: 'form', onsubmit: (e) => e.preventDefault() }, body, h('div', { class: 'savebar' }, saveBtn, h('span', { class: 'muted' }, 'Le modifiche vanno online solo dopo aver premuto “Salva”.'))));
}

async function pageSheet(c) {
  const v = await api('data/foglio-google');
  const ctx = { uploads: [], dirty: () => { state.dirty = true; } };
  const id = (v.url.match(/\/d\/([\w-]+)/) || [])[1];
  c.append(pageHead('Foglio Google', 'Il foglio di lavoro della segreteria, sempre a portata di mano.', v.url && h('a', { class: 'btn btn--navy', href: v.url, target: '_blank', rel: 'noopener' }, icon('ext'), 'Apri il foglio')));
  c.append(h('div', { class: 'note' }, 'Il foglio si vede qui sotto solo se nel browser sei collegato con un account Google autorizzato ad aprirlo. Se non compare, usa “Apri il foglio”.'));
  if (id) c.append(h('iframe', { class: 'sheet-frame', src: `https://docs.google.com/spreadsheets/d/${id}/edit?rm=minimal`, title: v.titolo || 'Foglio Google' }));
  const saveBtn = h('button', { type: 'button', class: 'btn btn--primary', onclick: async () => {
    try { await api('data/foglio-google', { method: 'PUT', body: { value: v, uploads: [] } }); state.dirty = false; toast('Collegamento salvato.', 'ok'); route(); } catch (e) { toast(e.message, 'err'); }
  } }, icon('save'), 'Salva collegamento');
  c.append(h('details', { class: 'item section-gap' }, h('summary', {}, 'Cambia il foglio collegato'), h('div', { class: 'form' },
    renderField({ key: 'titolo', type: 'text', label: 'Nome' }, v, ctx),
    renderField({ key: 'url', type: 'url', label: 'Link del foglio Google', hint: 'Copia il link dalla barra degli indirizzi del foglio.' }, v, ctx),
    renderField({ key: 'note', type: 'textarea', label: 'Note' }, v, ctx), h('div', {}, saveBtn))));
}

async function pageHistory(c) {
  c.append(pageHead('Storico modifiche', 'Ogni salvataggio è registrato: in caso di errore si può sempre tornare alla versione precedente.'));
  const list = await api('history');
  c.append(h('ul', { class: 'timeline' }, list.map((x) => {
    const seg = x.message.startsWith('[Segreteria]');
    return h('li', {}, h('span', {}, seg ? h('span', { class: 'seg' }, 'Segreteria · ') : h('span', { class: 'muted' }, 'Sviluppo · '), x.message.split('\n')[0].replace('[Segreteria] ', '')), h('span', { class: 'muted' }, `${x.author} · ${fmtDateTime(x.date)}`));
  })));
}

function pageGuide(c) {
  c.append(pageHead('Guida rapida', 'Come funziona l’area segreteria.'));
  const sec = (t, ...p) => h('div', { class: 'card', style: 'margin-bottom:14px' }, h('h2', {}, t), ...p);
  c.append(
    sec('Pubblicare una notizia', h('ol', {}, h('li', {}, 'Vai su ', h('a', { href: '#/notizie/nuova' }, 'Notizie → Nuova notizia'), '.'), h('li', {}, 'Scrivi titolo, data e scegli la categoria.'), h('li', {}, 'Carica la foto principale e, se vuoi, le foto della galleria (anche più di una alla volta).'), h('li', {}, 'Scrivi il testo: puoi usare grassetto, elenchi, link, foto e allegare PDF.'), h('li', {}, 'Premi “Pubblica”: dopo 1-2 minuti la notizia è online.'))),
    sec('Quando vanno online le modifiche?', h('p', {}, 'Ogni volta che premi Salva o Pubblica, il sito viene ricostruito automaticamente. Ci vogliono circa 1-2 minuti. Se non vedi subito la modifica, ricarica la pagina del sito.')),
    sec('Foto e documenti', h('p', {}, 'Le foto vengono ridimensionate e ottimizzate automaticamente. Formati: JPG, PNG, WebP. I PDF (volantini, comunicati, moduli) si allegano nel testo con “Allega un PDF”. Dimensione massima 3 MB per file.')),
    sec('Avviso in evidenza', h('p', {}, 'Serve per comunicazioni importanti (iscrizioni aperte, palestra chiusa…). Attivalo, scrivi il testo e, se vuoi, una data dopo la quale sparisce da solo.')),
    sec('Ho sbagliato qualcosa', h('p', {}, 'Nessun problema: ogni salvataggio è registrato nello ', h('a', { href: '#/storico' }, 'Storico modifiche'), '. L’amministratore del sito può ripristinare qualsiasi versione precedente.')),
    sec('Accesso e password', h('p', {}, 'L’accesso è riservato agli utenti della segreteria. Per aggiungere un utente o cambiare la password contatta l’amministratore del sito. Per sicurezza la sessione scade dopo 12 ore.')),
    !state.config.storeReady && sec('Per l’amministratore: attivare il salvataggio', h('p', {}, 'Su Vercel, nel progetto della dashboard, aggiungi la variabile GITHUB_TOKEN con un token GitHub (fine-grained) con permesso “Contents: read and write” sul repository del sito. Istruzioni complete nel file dashboard/README.md.')));
}
function pageNotFound(c) { c.append(pageHead('Pagina non trovata', ''), h('a', { href: '#/', class: 'btn' }, 'Torna alla panoramica')); }

// ---------- Layout e navigazione ----------
function shell() {
  const side = h('nav', { class: 'side', 'aria-label': 'Menu della dashboard' },
    h('div', { class: 'side__brand' }, h('img', { src: '/assets/logo.webp', alt: '' }), h('div', {}, h('strong', {}, 'Area Segreteria'), h('span', {}, 'Federazione Sammarinese Pallacanestro'))),
    NAV.map(([group, items]) => [h('div', { class: 'side__group' }, group), items.map(([path, ic, label]) => h('a', { href: `#/${path}`, 'data-path': path }, icon(ic), label))]),
    h('div', { class: 'side__foot' }, h('a', { href: state.config.siteUrl, target: '_blank', rel: 'noopener' }, icon('ext'), 'Apri il sito pubblico')));
  const top = h('header', { class: 'topbar' },
    h('button', { class: 'btn btn--sm menu-btn', 'aria-label': 'Apri il menu', onclick: () => $('.shell').classList.toggle('nav-open') }, icon('menu')),
    h('span', { class: 'muted mode-label', style: 'font-weight:600' }, state.config.mode === 'local' ? 'Modalità prova (file locali)' : !state.config.storeReady ? 'Sola lettura: salvataggio non ancora attivo' : ''),
    h('div', { class: 'topbar__user' }, h('span', { class: 'avatar', 'aria-hidden': 'true' }, state.user[0]), h('span', { style: 'font-weight:650' }, state.user),
      h('button', { class: 'btn btn--sm', onclick: async () => { if (state.dirty && !(await confirmDialog('Uscire?', 'Hai modifiche non salvate che andranno perse.', 'Esci senza salvare', true))) return; await api('logout', { method: 'POST' }).catch(() => {}); state.user = null; state.dirty = false; renderLogin(); } }, icon('out'), 'Esci')));
  $('#app').replaceChildren(h('div', { class: 'shell' }, side, h('div', { class: 'main' }, top, h('main', { class: 'content', id: 'content', tabindex: '-1' }))));
  side.addEventListener('click', (e) => { if (e.target.closest('a')) $('.shell').classList.remove('nav-open'); });
}
let lastHash = location.hash;
async function route() {
  if (!state.user) return;
  const path = location.hash.replace(/^#\/?/, '');
  const c = $('#content');
  document.querySelectorAll('.side a[data-path]').forEach((a) => {
    const p = a.dataset.path;
    a.toggleAttribute('aria-current', p === path || (p && path.startsWith(p + '/')) || (p === 'notizie' && path.startsWith('notizie')));
    if (a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'page');
  });
  c.replaceChildren(h('p', { class: 'muted' }, 'Caricamento…'));
  const frag = h('div');
  try {
    const [a, b] = path.split('/');
    if (!a) await pageDashboard(frag);
    else if (a === 'notizie' && !b) await pageNewsList(frag);
    else if (a === 'notizie') await pageNewsEdit(frag, b === 'nuova' ? null : b);
    else if (a === 'sezione') await pageSection(frag, b);
    else if (a === 'foglio') await pageSheet(frag);
    else if (a === 'storico') await pageHistory(frag);
    else if (a === 'guida') pageGuide(frag);
    else pageNotFound(frag);
    c.replaceChildren(...frag.childNodes);
  } catch (e) {
    if (e.message !== '401') c.replaceChildren(h('div', { class: 'note note--err' }, 'Impossibile caricare la pagina: ', e.message));
  }
  document.title = `${$('h1', c)?.textContent || 'Area Segreteria'} · FSP`;
  c.focus({ preventScroll: true }); window.scrollTo(0, 0);
  lastHash = location.hash;
}
window.addEventListener('hashchange', async () => {
  if (state.dirty && location.hash !== lastHash) {
    const target = location.hash; history.replaceState(null, '', lastHash);
    if (!(await confirmDialog('Uscire senza salvare?', 'Hai modifiche non salvate in questa pagina.', 'Esci senza salvare', true))) return;
    state.dirty = false; location.hash = target; return;
  }
  route();
});
window.addEventListener('beforeunload', (e) => { if (state.dirty) { e.preventDefault(); e.returnValue = ''; } });

function start() { shell(); route(); }
(async function boot() {
  try { state.config = await api('config'); } catch (e) { $('#app').replaceChildren(h('p', { class: 'boot' }, 'Servizio non raggiungibile: ', e.message)); return; }
  try { state.user = (await api('me')).user; start(); } catch { if (!state.user) renderLogin(); }
})();
