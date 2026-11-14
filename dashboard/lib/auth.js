// Autenticazione: utenti con password cifrata (scrypt) definiti nella variabile
// d'ambiente DASHBOARD_USERS e sessione in un cookie firmato (HMAC-SHA256).
import { scryptSync, timingSafeEqual, createHmac, randomBytes } from 'node:crypto';

const COOKIE = 'fsp_sess';
const SESSION_HOURS = 12;

/** DASHBOARD_USERS = "utente:salt:hash,utente2:salt:hash" (generati con scripts/crea-utente.mjs). */
function users() {
  return (process.env.DASHBOARD_USERS || '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
    const [user, salt, hash] = s.split(':');
    return { user, salt, hash };
  });
}

export function hashPassword(password, salt = randomBytes(16).toString('base64url')) {
  const hash = scryptSync(password, salt, 64).toString('base64url');
  return { salt, hash };
}

export function verifyCredentials(username, password) {
  const u = users().find((x) => x.user === String(username || '').trim().toLowerCase());
  // Calcolo sempre lo scrypt (anche per utenti inesistenti) per non rivelare quali utenti esistono.
  const { hash } = hashPassword(String(password || ''), u?.salt || 'x');
  if (!u) return null;
  const a = Buffer.from(hash), b = Buffer.from(u.hash || '');
  return a.length === b.length && timingSafeEqual(a, b) ? u.user : null;
}

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw Object.assign(new Error('SESSION_SECRET mancante o troppo corto'), { status: 500 });
  return s;
}
const sign = (data) => createHmac('sha256', secret()).update(data).digest('base64url');

export function createSessionCookie(user, secure) {
  const payload = Buffer.from(JSON.stringify({ u: user, exp: Date.now() + SESSION_HOURS * 3600e3 })).toString('base64url');
  const token = `${payload}.${sign(payload)}`;
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}${secure ? '; Secure' : ''}`;
}

export const clearSessionCookie = (secure) => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`;

export function sessionUser(req) {
  const raw = (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(COOKIE + '='));
  if (!raw) return null;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  try {
    const { u, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() > exp) return null;
    return users().some((x) => x.user === u) ? u : null;
  } catch { return null; }
}

// Limite tentativi di accesso (per istanza): 8 errori in 15 minuti per IP.
const attempts = new Map();
export function tooManyAttempts(ip) {
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60e3);
  attempts.set(ip, list);
  return list.length >= 8;
}
export const recordFailure = (ip) => attempts.set(ip, [...(attempts.get(ip) || []), Date.now()]);
