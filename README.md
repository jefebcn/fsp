# FSP – Federazione Sammarinese Pallacanestro

Nuovo sito ufficiale della Federazione Sammarinese Pallacanestro (www.fsp.sm), ricostruito per essere
più **semplice, accessibile e family-friendly**, mantenendo tutti i contenuti e le funzionalità del sito precedente.

## Cosa contiene

| Sezione | Percorso | Fonte dati |
|---|---|---|
| Home | `/` | `src/pages/index.astro` |
| News (576 articoli dal 2009) con filtri per categoria, anno e paginazione | `/news/` | `src/content/news/*.md` |
| Ricerca nell'archivio | `/cerca/` | generata da `/search.json` |
| Federazione: chi siamo, storia, direttivo, staff tecnico, impianti | `/federazione/…` | `src/data/site.ts`, `src/data/pages/storia.html` |
| Minibasket, Settore giovanile (pagine per squadra), Centro estivo, Basket a scuola | `/minibasket/`, `/giovanili/…`, `/attivita/…` | `src/data/site.ts` |
| Nazionali Senior, Under 18, Under 16 (rose e staff) | `/nazionali/…` | `src/data/site.ts` |
| Campionato Sammarinese con archivio per stagione | `/campionato/…` | news categoria `campionato` |
| Hall of Fame | `/hall-of-fame/` | news categoria `hall-of-fame` |
| Contatti con modulo | `/contatti/` | `src/data/site.ts` |

I vecchi indirizzi `.php` (es. `/contatti.php`, `/…-n672.php`) vengono reindirizzati con 301 ai nuovi
(`vercel.json`, generato da `scripts/generate-redirects.mjs`), così link condivisi e risultati di Google continuano a funzionare.

## Accessibilità e famiglie

- Contrasti AA, focus visibile, link "Vai al contenuto", menu navigabile da tastiera (Esc chiude)
- Pulsante **"Testo grande"** (preferenza salvata nel browser)
- Numeri leggibili (Raleway con cifre allineate), font ospitato localmente: nessun cookie di terze parti
- Percorsi per età (Minibasket 5-11, Giovanili, Centro estivo, Scuole), galleria foto con navigazione da tastiera
- Rispetto di `prefers-reduced-motion`, layout responsive da 320px

## Colori

| Token | Colore | Uso |
|---|---|---|
| `--c-cyan` | `#00AFE4` | azzurro FSP (fasce, accenti) |
| `--c-blue` / `--c-blue-dark` | `#2693FF` / `#0A6BC4` | link e dettagli |
| `--c-navy` | `#0C3A6D` | titoli, intestazioni |
| `--c-orange` | `#E8701A` | arancio del pallone del logo, pulsanti principali |

## Area Segreteria

La segreteria gestisce notizie e contenuti dalla dashboard riservata in `dashboard/` (progetto Vercel separato):
vedi [dashboard/README.md](dashboard/README.md). I contenuti modificabili sono in `src/data/contenuti/*.json` e `src/content/news/`.

## Sviluppo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # sito statico in dist/
```

### Aggiungere una notizia

Creare un file in `src/content/news/`, ad esempio `src/content/news/nuova-notizia.md`:

```md
---
title: "Titolo della notizia"
date: "2026-01-15"
categories: ["giovanili"]   # giovanili | nazionali | campionato | minibasket | federazione | hall-of-fame
featured: true              # in evidenza in home
cover: "/media/nome-foto.webp"
gallery: ["/media/foto-1.webp", "/media/foto-2.webp"]
excerpt: "Breve riassunto mostrato nelle anteprime."
---

Testo della notizia (Markdown o HTML).
```

Le immagini vanno in `public/media/`.

### Modulo contatti

Senza configurazione il modulo apre il programma di posta con il messaggio già compilato verso `fsp@omniway.sm`.
Per l'invio diretto impostare la variabile `PUBLIC_FORM_ENDPOINT` (es. Formspree o Web3Forms) – vedi `.env.example`.

## Pubblicazione

Il progetto è pronto per **Vercel** (`vercel.json` incluso): importare il repository, framework Astro, nessuna configurazione aggiuntiva.
