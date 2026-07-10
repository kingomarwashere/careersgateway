const PBKDF2_ITERATIONS = 100000;

async function hashPassword(password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial, 256
  );
  const hashArr = Array.from(new Uint8Array(bits));
  const saltArr = Array.from(salt);
  return `pbkdf2:${PBKDF2_ITERATIONS}:${btoa(String.fromCharCode(...saltArr))}:${btoa(String.fromCharCode(...hashArr))}`;
}

async function verifyPassword(password, stored) {
  const [, iters, saltB64, hashB64] = stored.split(':');
  const enc = new TextEncoder();
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const expectedHash = Uint8Array.from(atob(hashB64), c => c.charCodeAt(0));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: parseInt(iters), hash: 'SHA-256' },
    keyMaterial, 256
  );
  const actualHash = new Uint8Array(bits);
  if (actualHash.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < actualHash.length; i++) diff |= actualHash[i] ^ expectedHash[i];
  return diff === 0;
}

function generateToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function createSession(env, userId) {
  const token = generateToken();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await env.SESSIONS.put(token, JSON.stringify({ userId, expires: expires.toISOString() }), {
    expirationTtl: 30 * 24 * 60 * 60
  });
  return { token, expires };
}

async function getSession(env, token) {
  if (!token) return null;
  const data = await env.SESSIONS.get(token);
  if (!data) return null;
  const session = JSON.parse(data);
  if (new Date(session.expires) < new Date()) {
    await env.SESSIONS.delete(token);
    return null;
  }
  return session;
}

async function getCurrentUser(env, c) {
  const token = getCookie(c, 'session');
  if (!token) return null;
  const session = await getSession(env, token);
  if (!session) return null;
  const user = await env.DB.prepare('SELECT id, email, full_name, phone FROM users WHERE id = ?')
    .bind(session.userId).first();
  return user || null;
}

function getCookie(c, name) {
  const header = c.req.header('Cookie') || '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export { hashPassword, verifyPassword, createSession, getSession, getCurrentUser, getCookie };
