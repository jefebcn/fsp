// Crea le credenziali per un utente della dashboard.
// Uso: node scripts/crea-utente.mjs <utente> [password]
// Se la password non è indicata ne viene generata una sicura.
// Copia la riga "utente:salt:hash" nella variabile DASHBOARD_USERS su Vercel
// (più utenti separati da virgola).
import { randomBytes } from 'node:crypto';
import { hashPassword } from '../lib/auth.js';

const [user, given] = process.argv.slice(2);
if (!user || !/^[a-z0-9._-]+$/.test(user)) { console.error('Uso: node scripts/crea-utente.mjs <utente> [password]   (utente in minuscolo, senza spazi)'); process.exit(1); }
const password = given || randomBytes(9).toString('base64url');
const { salt, hash } = hashPassword(password);
console.log(`Utente:   ${user}\nPassword: ${password}\n\nValore per DASHBOARD_USERS:\n${user}:${salt}:${hash}`);
