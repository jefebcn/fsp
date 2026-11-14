# Area Segreteria FSP

Dashboard riservata alla segreteria della Federazione Sammarinese Pallacanestro per gestire i contenuti
del sito pubblico **senza toccare il codice**. È un progetto separato dal sito (indirizzo e accesso propri).

## Cosa si può fare

- **Notizie**: creare, modificare, eliminare; foto principale, galleria (caricamento multiplo, trascinamento),
  testo con editor visuale (grassetto, elenchi, link, foto) o codice HTML, allegati PDF, video YouTube,
  categorie e "in primo piano"
- **Avviso in evidenza**: messaggio in cima a tutte le pagine del sito, con colore, link e scadenza automatica
- **Pagine del sito**: contatti e social, consiglio direttivo, staff tecnico (con foto), attività della Federazione,
  impianti, Nazionali (rose e staff), squadre giovanili, centro estivo (info, programma, tariffe, volantino), partner
- **Foglio Google** della segreteria incorporato e apribile con un clic
- **Storico modifiche**: ogni salvataggio è registrato e si può sempre tornare indietro

## Come funziona

Ogni salvataggio crea un commit sul repository GitHub del sito (`src/content/news/*.md`,
`src/data/contenuti/*.json`, foto in `public/media/`). Vercel ricostruisce il sito pubblico in automatico
(1-2 minuti). Le foto vengono ridimensionate e convertite in WebP nel browser prima del caricamento.

## Configurazione su Vercel (progetto separato, Root Directory = `dashboard`)

| Variabile | Valore |
|---|---|
| `DASHBOARD_USERS` | utenti autorizzati, `utente:salt:hash` separati da virgola (vedi sotto) |
| `SESSION_SECRET` | stringa casuale di almeno 32 caratteri |
| `GITHUB_TOKEN` | token GitHub *fine-grained* limitato al repository del sito con permesso **Contents: Read and write** |
| `GITHUB_REPO` | `jefebcn/fsp` |
| `GITHUB_BRANCH` | branch pubblicato dal sito |
| `SITE_URL` | indirizzo del sito pubblico (per anteprime e link) |

Senza `GITHUB_TOKEN` la dashboard funziona in **sola lettura**.

### Creare il token GitHub

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token
2. Repository access: **Only select repositories** → `jefebcn/fsp`
3. Permissions → Repository permissions → **Contents: Read and write** (Metadata: Read è automatico)
4. Copia il token e incollalo su Vercel → progetto della dashboard → Settings → Environment Variables → `GITHUB_TOKEN`,
   poi Deployments → Redeploy

### Aggiungere un utente o cambiare password

```bash
cd dashboard
node scripts/crea-utente.mjs nomeutente            # genera una password sicura
node scripts/crea-utente.mjs nomeutente LaMiaPassword
```

Copia la riga `utente:salt:hash` in `DASHBOARD_USERS` su Vercel (più utenti separati da virgola) e fai Redeploy.
Le password non sono mai salvate in chiaro.

## Sicurezza

- Password cifrate con scrypt; sessione in cookie `HttpOnly`, `Secure`, `SameSite=Strict`, durata 12 ore
- Limite di 8 tentativi di accesso falliti ogni 15 minuti
- Protezione CSRF (intestazione obbligatoria sulle modifiche), Content-Security-Policy, pagina non indicizzata
- Il testo delle notizie viene ripulito lato server (solo tag sicuri); percorsi e formati dei file controllati
- Il token GitHub resta solo sul server (variabile d'ambiente), mai nel browser

## Prova in locale

```bash
cd dashboard
DASHBOARD_USERS="$(node scripts/crea-utente.mjs prova Prova123! | tail -1)" npm run dev
# http://localhost:4400 — utente "prova", password "Prova123!"; scrive direttamente sui file del repository
```
