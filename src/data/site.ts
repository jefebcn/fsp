// Dati istituzionali della Federazione Sammarinese Pallacanestro.
// Tutti i dati sono ripresi dal sito www.fsp.sm: modificare qui per aggiornare il sito.

export const SITE = {
  name: 'Federazione Sammarinese Pallacanestro',
  short: 'FSP',
  tagline: 'Il basket di San Marino, dal 1968',
  description:
    'Sito ufficiale della Federazione Sammarinese Pallacanestro: minibasket, settore giovanile, nazionali, Campionato Sammarinese, news e contatti.',
  founded: '9 febbraio 1968',
  address: { street: 'Via Rancaglia, 22', place: 'Centro Sportivo, Serravalle', cap: '47899', city: 'Serravalle', country: 'Repubblica di San Marino' },
  coe: 'C.o.E. SM 02404',
  email: 'fsp@omniway.sm',
  phone: '+39 0549 885691',
  fax: '+39 0549 885692',
  mobile: '+39 335 5704089',
  social: {
    instagram: 'https://www.instagram.com/fsp1968/',
    facebook: 'https://www.facebook.com/federazionesammarinese.pallacanestro/',
    facebookGroup: 'https://www.facebook.com/groups/173302223309090/',
    fibaEurope: 'https://www.fibaeurope.com/',
  },
  mapsUrl: 'https://www.openstreetmap.org/search?query=Via%20Rancaglia%2022%20Serravalle%20San%20Marino',
};

export const tel = (n: string) => 'tel:' + n.replace(/[^+\d]/g, '');

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
    label: 'Nazionali', href: '/nazionali/', children: [
      { label: 'Senior', href: '/nazionali/senior/' },
      { label: 'Under 18', href: '/nazionali/under-18/' },
      { label: 'Under 16', href: '/nazionali/under-16/' },
    ],
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

export const DIRETTIVO: Person[] = [
  { name: 'Luca Liberti', role: 'Presidente', photo: '/media/1655196274_luca-liberti.webp' },
  { name: 'Simone Botteghi', role: 'Vice Presidente', photo: '/media/1655724102_botteghi-2.webp' },
  { name: 'Roberto Berardi', role: 'Segretario Generale' },
  { name: 'Veronica Zavoli', role: 'Tesoriere', photo: '/media/1756297823_senza-titolo.webp' },
  { name: 'Davide Giovagnoli', role: 'Consigliere' },
  { name: 'Gabriele Vitali', role: 'Consigliere' },
  { name: 'Diego De Simone', role: 'Sindaco Revisore', photo: '/media/1750091314_diegojumpin2-min.webp' },
  { name: 'Lorenzo Sarti', role: 'Sindaco Revisore' },
  { name: 'Gianfranco Trombetti', role: 'Sindaco Revisore' },
];

export const STAFF_TECNICO: Person[] = [
  { name: 'Luca Liberti', role: 'Presidente', photo: '/media/1655727055_luca-liberti.webp' },
  { name: 'Stefano Rossini', role: 'Head Coach Under 17, Under 13 e Head Coach Nazionale Under 18', photo: '/media/1756297305_ross.webp' },
  { name: 'Sergio Del Bianco', role: 'Head Coach Under 19 e Head Coach Nazionale Under 16', photo: '/media/1756297373_sergio.webp' },
  { name: 'Alberto Vivenzio', role: 'Head Coach Under 15' },
  { name: 'Federico Guida', role: 'Assistant Coach Under 19 e Nazionale Under 16', photo: '/media/1756297332_fede.webp' },
  { name: 'Luca Ricci', role: 'Assistant Coach Under 15 e Under 13' },
  { name: 'Nicolò Botteghi', role: 'Assistant Coach Under 17' },
  { name: 'Oscar Valentini', role: 'Responsabile Minibasket, Istruttore Minibasket, Head Coach Under 12', photo: '/media/1756296917_oscar.webp' },
  { name: 'Giovanna Cristiano', role: 'Istruttrice Minibasket' },
  { name: 'Valentina Selva', role: 'Allenatrice Minibasket' },
  { name: 'Luigi Raschi', role: 'Allenatore Minibasket' },
  { name: 'Davide Macina', role: 'Preparatore atletico' },
  { name: 'Loriano Zannoni', role: 'Addetto Stampa' },
];

export const ATTIVITA_FEDERAZIONE: string[] = [
  'Supporto logistico e organizzativo per le proprie affiliate che disputano i campionati seniores italiani (Pallacanestro Titano, Basket 2000)',
  'Organizzazione del Campionato Sammarinese',
  'Organizzazione dei corsi di avviamento al Minibasket, dislocati in 2 diverse strutture nella Repubblica, assicurando competente e qualificata assistenza tecnica',
  "Organizzazione dell'annuale Festa del Minibasket",
  "Organizzazione di tutta l'attività giovanile, selezioni under 13, under 14, under 15, under 17, under 19, compresa la partecipazione a manifestazioni internazionali di apposite selezioni under 16 e under 18, assicurando competente e qualificata assistenza tecnica e atletica",
  "Supporto all'annuale edizione dei Giochi della Gioventù",
  "Organizzazione dell'attività della Nazionale seniores, compresa la partecipazione ai Giochi dei Piccoli Stati d'Europa e ad altre manifestazioni internazionali",
  "Partecipazione con personale, strutture e materiale tecnico all'annuale edizione di Sport in Fiera",
  "Organizzazione, in collaborazione con la Federazione Sport Speciali, dell'annuale Trofeo dedicato a Martin Mancini di basket in carrozzina",
];

export type Impianto = { name: string; venue: string; address: string[]; phone?: string; built: string; surface: string; seats: string; photo: string };

export const IMPIANTI: Impianto[] = [
  {
    name: 'Palestra Multieventi Sport Domus', venue: 'Multieventi Sport Domus',
    address: ['Via Rancaglia 30', '47899 Serravalle'], phone: '0549 885628',
    built: '1998', surface: 'Parquet, 44 x 22 m', seats: '1.200 posti', photo: '/media/impianti_domus.webp',
  },
  {
    name: 'Palestra "Umberto Briganti" Fonte dell\'Ovo', venue: "Centro Studi Fonte dell'Ovo",
    address: ['Viale Campo dei Giudei', '47890 San Marino'], phone: '0549 991994',
    built: '1990', surface: 'Resina, 36 x 18 m', seats: '150 posti', photo: '/media/impianti_briganti.webp',
  },
  {
    name: 'Palestra Acquaviva', venue: 'Palestra Scuole di Acquaviva',
    address: ['Via Nitella', '47892 Acquaviva'],
    built: '2009', surface: 'Parquet, 36 x 18 m', seats: '200 posti', photo: '/media/impianti_acquaviva.webp',
  },
];

export const SPONSORS = [
  { name: 'Seriset', url: 'https://www.seriset.com/', logo: '/media/1655799075_logo_seriset.webp' },
  { name: 'TIM San Marino', url: 'https://www.telecomitalia.sm/', logo: '/media/1664199011_logo-tism.webp' },
  { name: 'Titanka!', url: 'https://www.titanka.com/', logo: '/media/1664198878_titanka_logo.webp' },
  { name: 'Profumerie Liberti', url: 'https://profumerieliberti.sm/', logo: '/media/1664198940_logo_liberti.webp' },
  { name: 'Acqua Shop', logo: '/media/1664199067_logo-acquashop.webp' },
  { name: 'IeS Informatica e Servizi', url: 'https://www.ies.sm', logo: '/media/1655808038_logo_ies.webp' },
  { name: 'Giochi del Titano', url: 'https://www.giochideltitano.sm/', logo: '/media/1664198686_logo-giochi-del-titano.webp' },
  { name: 'BAC Banca Agricola Commerciale', url: 'https://www.bac.sm', logo: '/media/1664198561_logo_bac.webp' },
  { name: 'Cool Things', url: 'https://www.coolthings.sm/', logo: '/media/1655797372_cool_things.webp' },
  { name: 'Tonelli', url: 'https://www.tonellism.com/', logo: '/media/1664198573_logo-tonelli.webp' },
  { name: 'IAM', url: 'https://www.iamrsm.com/it', logo: '/media/1664198214_iam-logo.webp' },
];

export type Squad = {
  slug: string; name: string; season: string; photo: string; intro?: string;
  players: { name: string; born?: string }[]; staff: { role: string; name: string }[]; newsMatch: RegExp;
};

export const NAZIONALI: Squad[] = [
  {
    slug: 'senior', name: 'Nazionale Senior', season: '2024', photo: '/media/1719015947_nazionale-senior-san-marino-2024.webp',
    players: [
      { name: 'Nicola Borello', born: '25-06-1997' }, { name: 'Matteo Federico Botteghi', born: '10-11-1995' },
      { name: 'Mathias Alberto Cadiman', born: '27-09-2006' }, { name: 'Tommaso Felici', born: '17-10-2001' },
      { name: 'Leonardo Maria Fiorani', born: '11-05-2000' }, { name: 'Francesco Maria Guida', born: '18-04-2004' },
      { name: 'Davide Macina', born: '01-07-1993' }, { name: 'Gioele Moretti', born: '02-11-1993' },
      { name: 'Matteo Mularoni', born: '27-07-2003' }, { name: 'Kevin Riccardi', born: '22-03-1998' },
      { name: 'Pietro Ugolini', born: '05-11-2000' }, { name: 'Enrico Zanotti', born: '11-04-1990' },
    ],
    staff: [{ role: 'Head coach', name: 'Daniele Valentini' }, { role: 'Assistant coach', name: 'Nicola Galli' }],
    newsMatch: /senior|seniores|piccoli stati|small countries|nazionale maggiore|giochi dei piccoli/i,
  },
  {
    slug: 'under-18', name: 'Nazionale Under 18', season: '2025', photo: '/media/1756297097_u18.webp',
    players: ['Eugenio Falcioni', 'Michele Pagliarani', 'Matteo Valamggi', 'Manuel San Martini', 'Thomas Gasperoni', 'Mattia Sartini',
      'Federico San Martini', 'Edoardo Cenni', 'Mattia Giovannini', 'Samuele Cecchetti', 'Giacomo Valentini', 'Mattia Nanni'].map((name) => ({ name })),
    staff: [{ role: 'Head coach', name: 'Stefano Rossini' }, { role: 'Assistant coach', name: 'Oscar Valentini' }, { role: 'Fisioterapista', name: 'Matteo Iuliani' }],
    newsMatch: /u\.?\s?18|under\s?18/i,
  },
  {
    slug: 'under-16', name: 'Nazionale Under 16', season: '2025', photo: '/media/1756296450_webp.webp',
    players: ['Giacomo Casadei', 'Edoardo Cenni', 'Mattia Fantini', 'Mattia Giovannini', 'Alex Lisi', 'Giacomo Lullo', 'Lorenzo Mattia Mussoni',
      'Alex Pelliccioni', 'Manuel San Martini', 'Matteo Alejo Suarez Ramirez', 'Gianluca Tura', 'Giacomo Valentini'].map((name) => ({ name })),
    staff: [{ role: 'Head coach', name: 'Sergio Del Bianco' }, { role: 'Assistant coach', name: 'Federico Guida' }, { role: 'Fisioterapista', name: 'Matteo Iuliani' }],
    newsMatch: /u\.?\s?16|under\s?16/i,
  },
];

// Squadre del settore giovanile (menu "Giovanili" del sito originale + annate citate dallo staff tecnico).
export const GIOVANILI = [
  { slug: 'under-19', name: 'Under 19', age: '17-19 anni', coaches: ['Sergio Del Bianco', 'Federico Guida'], match: /u\.?\s?19|under\s?19/i },
  { slug: 'under-18', name: 'Under 18', age: '16-18 anni', coaches: [], match: /u\.?\s?18|under\s?18/i },
  { slug: 'under-17', name: 'Under 17', age: '15-17 anni', coaches: ['Stefano Rossini', 'Nicolò Botteghi'], match: /u\.?\s?17|under\s?17/i },
  { slug: 'under-16', name: 'Under 16', age: '14-16 anni', coaches: [], match: /u\.?\s?16|under\s?16/i },
  { slug: 'under-15', name: 'Under 15', age: '13-15 anni', coaches: ['Alberto Vivenzio', 'Luca Ricci'], match: /u\.?\s?15|under\s?15/i },
  { slug: 'under-14', name: 'Under 14', age: '12-14 anni', coaches: [], match: /u\.?\s?14|under\s?14/i },
  { slug: 'under-13', name: 'Under 13', age: '11-13 anni', coaches: ['Stefano Rossini', 'Luca Ricci'], match: /u\.?\s?13|under\s?13/i },
  { slug: 'esordienti', name: 'Esordienti', age: '11-12 anni', coaches: ['Oscar Valentini'], match: /esordient|under\s?12|u12/i },
];
