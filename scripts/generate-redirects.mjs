// Genera vercel.json con i redirect 301 dai vecchi indirizzi .php di www.fsp.sm
// ai nuovi indirizzi, così link condivisi e risultati di Google continuano a funzionare.
// Uso: node scripts/generate-redirects.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const news = JSON.parse(readFileSync(new URL('./legacy-news-redirects.json', import.meta.url), 'utf8'));
const pages = {
  '/index.php': '/',
  '/federazione.php': '/federazione/',
  '/la-nostra-storia.php': '/federazione/storia/',
  '/staff-direttivo.php': '/federazione/direttivo/',
  '/staff-tecnico.php': '/federazione/staff-tecnico/',
  '/impianti.php': '/federazione/impianti/',
  '/under-18-giovanile.php': '/giovanili/under-18/',
  '/under-16-giovanile.php': '/giovanili/under-16/',
  '/under-15-giovanile.php': '/giovanili/under-15/',
  '/under-14-giovanile.php': '/giovanili/under-14/',
  '/under-13-giovanile.php': '/giovanili/under-13/',
  '/u13-giovanile.php': '/giovanili/under-13/',
  '/u14-giovanile.php': '/giovanili/under-14/',
  '/u15-regionale-giovanile.php': '/giovanili/under-15/',
  '/u16-regionale-giovanile.php': '/giovanili/under-16/',
  '/tvb-under-16-eccellenza-giovanile.php': '/giovanili/under-16/',
  '/tvb-under-18-regionale-giovanile.php': '/giovanili/under-18/',
  '/tvb-under-18-elite-giovanile.php': '/giovanili/under-18/',
  '/esordienti.php': '/giovanili/esordienti/',
  '/mini-basket.php': '/minibasket/',
  '/nazionale-senior.php': '/nazionali/senior/',
  '/nazionale-under-18.php': '/nazionali/under-18/',
  '/nazionale-under-16.php': '/nazionali/under-16/',
  '/campionato-2013.php': '/campionato/2013/',
  '/campionato-2014.php': '/campionato/2014/',
  '/campionato-2015.php': '/campionato/',
  '/campionato-2016.php': '/campionato/',
  '/hall-of-fame.php': '/hall-of-fame/',
  '/scuole.php': '/attivita/scuole/',
  '/centro-estivo.php': '/attivita/centro-estivo/',
  '/contatti.php': '/contatti/',
  '/news-in-primo-piano.php': '/news/',
  '/news-giovanili-c1.php': '/news/categoria/giovanili/',
  '/news-nazionali-c2.php': '/news/categoria/nazionali/',
  '/news-campionato-rsm-c3.php': '/news/categoria/campionato/',
  '/news-mini-basket-c4.php': '/news/categoria/minibasket/',
  '/news-federazione-c5.php': '/news/categoria/federazione/',
};
const all = { ...pages, ...news };
const redirects = Object.entries(all).map(([source, destination]) => ({ source, destination, permanent: true }));
const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'astro',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  // Non ricostruire il sito quando cambia solo la dashboard
  ignoreCommand: "git diff --quiet HEAD^ HEAD -- . ':(exclude)dashboard'",
  trailingSlash: true,
  redirects,
  headers: [
    { source: '/media/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/_astro/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] },
  ],
};
writeFileSync(new URL('../vercel.json', import.meta.url), JSON.stringify(config, null, 2) + '\n');
console.log(`vercel.json: ${redirects.length} redirect`);
