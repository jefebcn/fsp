// Dati del sito. I contenuti modificabili dalla segreteria sono nei file JSON
// in src/data/contenuti/ (li aggiorna la dashboard della segreteria).
import contatti from './contenuti/contatti.json';
import direttivo from './contenuti/direttivo.json';
import staffTecnico from './contenuti/staff-tecnico.json';
import attivita from './contenuti/attivita-federazione.json';
import impianti from './contenuti/impianti.json';
import partner from './contenuti/partner.json';
import nazionali from './contenuti/nazionali.json';
import giovanili from './contenuti/giovanili.json';
import centroEstivo from './contenuti/centro-estivo.json';
import avviso from './contenuti/avviso.json';

export const SITE = {
  ...contatti,
  mapsUrl: `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${contatti.address.street} ${contatti.address.city} San Marino`)}`,
};

export const tel = (n: string) => 'tel:' + n.replace(/[^+\d]/g, '');

/** Trasforma parole chiave separate da virgola ("under 18, u18") in una espressione regolare tollerante a spazi e punti. */
export function keywordsRegex(keywords: string): RegExp {
  const parts = keywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\.|\s+/g, '[\\s.]?').replace(/([a-z])(\d)/g, '$1[\\s.]?$2'));
  return parts.length ? new RegExp(parts.join('|'), 'i') : /$^/;
}

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

// Struttura del menu: rispecchia quella del sito originale (FSP, Giovanili, Nazionali,
// Campionato, Hall of Fame, Attività, News, Contatti), semplificata per famiglie.
export const NAV: NavItem[] = [
  {
    label: 'Federazione', href: '/federazione/', children: [
      { label: 'Chi siamo', href: '/federazione/' },
      { label: 'La nostra storia', href: '/federazione/storia/' },
      { label: 'Consiglio direttivo', href: '/federazione/direttivo/' },
      { label: 'Staff tecnico', href: '/federazione/staff-tecnico/' },
      { label: 'Impianti', href: '/federazione/impianti/' },
    ],
  },
  {
    label: 'Giovani', href: '/giovanili/', children: [
      { label: 'Minibasket (5-11 anni)', href: '/minibasket/' },
      { label: 'Settore giovanile', href: '/giovanili/' },
      { label: 'Centro estivo', href: '/attivita/centro-estivo/' },
      { label: 'Basket a scuola', href: '/attivita/scuole/' },
    ],
  },
  {
    label: 'Nazionali', href: '/nazionali/', children: nazionali.map((s) => ({ label: s.name.replace(/^Nazionale /, ''), href: `/nazionali/${s.slug}/` })),
  },
  { label: 'Campionato', href: '/campionato/' },
  { label: 'Hall of Fame', href: '/hall-of-fame/' },
  { label: 'News', href: '/news/' },
  { label: 'Contatti', href: '/contatti/' },
];

export const CATEGORIES: Record<string, { label: string; color: string; href: string }> = {
  giovanili: { label: 'Giovanili', color: 'var(--c-green)', href: '/news/categoria/giovanili/' },
  nazionali: { label: 'Nazionali', color: 'var(--c-navy)', href: '/news/categoria/nazionali/' },
  campionato: { label: 'Campionato RSM', color: 'var(--c-blue-dark)', href: '/news/categoria/campionato/' },
  minibasket: { label: 'Minibasket', color: 'var(--c-orange-dark)', href: '/news/categoria/minibasket/' },
  federazione: { label: 'Federazione', color: 'var(--c-slate)', href: '/news/categoria/federazione/' },
  'hall-of-fame': { label: 'Hall of Fame', color: 'var(--c-gold)', href: '/hall-of-fame/' },
};

export type Person = { name: string; role: string; photo?: string };
export const DIRETTIVO: Person[] = direttivo;
export const STAFF_TECNICO: Person[] = staffTecnico;
export const ATTIVITA_FEDERAZIONE: string[] = attivita;

export type Impianto = { name: string; venue: string; address: string[]; phone?: string; built: string; surface: string; seats: string; photo: string };
export const IMPIANTI: Impianto[] = impianti;

export const SPONSORS: { name: string; url?: string; logo: string }[] = partner;

export type Squad = {
  slug: string; name: string; season: string; photo: string;
  players: { name: string; born?: string }[]; staff: { role: string; name: string }[]; newsMatch: RegExp;
};
export const NAZIONALI: Squad[] = nazionali.map((s) => ({ ...s, newsMatch: keywordsRegex(s.keywords) }));

export const GIOVANILI = giovanili.map((t) => ({ ...t, match: keywordsRegex(t.keywords) }));

export const CENTRO_ESTIVO = centroEstivo;

/** Avviso in evidenza su tutto il sito (gestito dalla dashboard). Nascosto dopo la data di scadenza. */
export const AVVISO = avviso.attivo && avviso.testo && (!avviso.scadenza || new Date(avviso.scadenza + 'T23:59:59') >= new Date()) ? avviso : null;
