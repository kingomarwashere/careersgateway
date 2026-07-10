import { Hono } from 'hono';
import { hashPassword, verifyPassword, createSession, getCurrentUser, getCookie } from './auth.js';
import { searchCricos } from './cricos.js';
import { pushLeadToKondesk } from './kondesk.js';
import {
  homePage, coursesPage, registerPage, loginPage,
  dashboardPage, contactPage, healthInsurancePage, servicesPage, esc
} from './templates.js';

const app = new Hono();

// ── Auth middleware (attaches user to context) ──────────────────────────────
app.use('*', async (c, next) => {
  c.set('user', await getCurrentUser(c.env, c));
  await next();
});

// ── HOME ────────────────────────────────────────────────────────────────────
app.get('/', c => c.html(homePage(c.get('user'))));

// ── REGISTER ────────────────────────────────────────────────────────────────
app.get('/register', c => {
  if (c.get('user')) return c.redirect('/dashboard');
  return c.html(registerPage());
});

app.post('/register', async c => {
  const form = await c.req.formData();
  const fullName = (form.get('full_name') || '').trim();
  const email = (form.get('email') || '').trim().toLowerCase();
  const phone = (form.get('phone') || '').trim();
  const password = form.get('password') || '';
  const confirm = form.get('confirm_password') || '';
  const vals = { full_name: fullName, email, phone };

  if (!fullName || !email || !phone || !password) return c.html(registerPage('All required fields must be filled in, including phone number.', vals));
  if (password.length < 8) return c.html(registerPage('Password must be at least 8 characters.', vals));
  if (password !== confirm) return c.html(registerPage('Passwords do not match.', vals));

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return c.html(registerPage('An account with this email already exists.', vals));

  const hash = await hashPassword(password);
  const result = await c.env.DB.prepare(
    'INSERT INTO users (email, password_hash, full_name, phone) VALUES (?, ?, ?, ?)'
  ).bind(email, hash, fullName, phone).run();

  const { token, expires } = await createSession(c.env, result.meta.last_row_id);
  c.header('Set-Cookie', `session=${token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`);
  return c.redirect('/dashboard');
});

// ── LOGIN ───────────────────────────────────────────────────────────────────
app.get('/login', c => {
  if (c.get('user')) return c.redirect('/dashboard');
  const redirect = c.req.query('redirect') || '';
  return c.html(loginPage(null, redirect));
});

app.post('/login', async c => {
  const form = await c.req.formData();
  const email = (form.get('email') || '').trim().toLowerCase();
  const password = form.get('password') || '';
  const redirect = form.get('redirect') || '/dashboard';

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return c.html(loginPage('Incorrect email or password.', redirect));
  }

  const { token, expires } = await createSession(c.env, user.id);
  c.header('Set-Cookie', `session=${token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`);
  return c.redirect(redirect.startsWith('/') ? redirect : '/dashboard');
});

// ── LOGOUT ──────────────────────────────────────────────────────────────────
app.get('/logout', async c => {
  const token = getCookie(c, 'session');
  if (token) await c.env.SESSIONS.delete(token);
  c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return c.redirect('/');
});

// ── CRICOS COURSE SEARCH ────────────────────────────────────────────────────
app.get('/courses', async c => {
  const params = {
    courseName: c.req.query('courseName') || '',
    cricosCode: c.req.query('cricosCode') || '',
    state: c.req.query('state') || '',
    courseLevel: c.req.query('courseLevel') || '',
  };

  const hasSearch = Object.values(params).some(v => v);
  let results = [], fromCache = false, error = null;

  if (hasSearch) {
    const r = await searchCricos(c.env, params);
    results = r.results;
    fromCache = r.fromCache;
    error = r.error || null;
  }

  return c.html(coursesPage(c.get('user'), results, params, fromCache, error));
});

// ── DASHBOARD ───────────────────────────────────────────────────────────────
app.get('/dashboard', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard');
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM inquiries WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).bind(user.id).all();
  return c.html(dashboardPage(user, results));
});

app.get('/dashboard/save', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/courses');
  const { code, name, provider } = { code: c.req.query('code'), name: c.req.query('name'), provider: c.req.query('provider') };
  await c.env.DB.prepare(
    'INSERT INTO inquiries (user_id, full_name, email, service, cricos_course_code, cricos_course_name, cricos_provider) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(user.id, user.full_name, user.email, 'Saved Course', code||'', name||'', provider||'').run();
  return c.redirect('/dashboard');
});

app.get('/dashboard/profile', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  const { layout, esc } = await import('./templates.js');
  return c.html(layout('My Profile', `
    <section style="padding:40px 24px">
      <div class="container" style="max-width:560px">
        <div class="form-card">
          <h2>My Profile</h2>
          <p class="sub">Update your account information</p>
          <form method="POST" action="/dashboard/profile">
            <div class="form-group"><label>Full Name</label><input type="text" name="full_name" value="${esc(user.full_name)}" required></div>
            <div class="form-group"><label>Email</label><input type="email" value="${esc(user.email)}" disabled style="background:#f1f5f9;color:#94a3b8"></div>
            <div class="form-group"><label>Phone</label><input type="tel" name="phone" value="${esc(user.phone||'')}"></div>
            <div class="form-group"><label>New Password (leave blank to keep current)</label><input type="password" name="password" minlength="8"></div>
            <button type="submit" class="form-submit">Save Changes</button>
          </form>
        </div>
      </div>
    </section>
  `, user));
});

app.post('/dashboard/profile', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  const form = await c.req.formData();
  const fullName = (form.get('full_name') || '').trim();
  const phone = (form.get('phone') || '').trim();
  const password = form.get('password') || '';

  if (password) {
    const hash = await hashPassword(password);
    await c.env.DB.prepare('UPDATE users SET full_name=?, phone=?, password_hash=? WHERE id=?')
      .bind(fullName, phone, hash, user.id).run();
  } else {
    await c.env.DB.prepare('UPDATE users SET full_name=?, phone=? WHERE id=?')
      .bind(fullName, phone, user.id).run();
  }
  return c.redirect('/dashboard');
});

// ── CONTACT / INQUIRY ────────────────────────────────────────────────────────
app.get('/contact', c => {
  const params = {
    course: c.req.query('course') || '',
    code: c.req.query('code') || '',
    provider: c.req.query('provider') || '',
    service: c.req.query('service') || '',
  };
  return c.html(contactPage(c.get('user'), params));
});

app.post('/contact', async c => {
  const user = c.get('user');
  const form = await c.req.formData();
  const fullName = (form.get('full_name') || '').trim();
  const email = (form.get('email') || '').trim().toLowerCase();
  const phone = (form.get('phone') || '').trim();
  const service = form.get('service') || 'General Inquiry';
  const message = form.get('message') || '';
  const cricosCode = form.get('cricos_code') || '';
  const cricosName = form.get('cricos_course') || '';
  const cricosProvider = form.get('cricos_provider') || '';

  if (!fullName || !email) {
    return c.html(contactPage(user, {}, false, 'Name and email are required.'));
  }

  const insert = await c.env.DB.prepare(
    `INSERT INTO inquiries (user_id, full_name, email, phone, service, cricos_course_code, cricos_course_name, cricos_provider, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(user?.id || null, fullName, email, phone, service, cricosCode, cricosName, cricosProvider, message).run();

  const lead = { fullName, email, phone, service, cricosCode, courseName: cricosName, provider: cricosProvider, message };
  const pushed = await pushLeadToKondesk(c.env, lead);

  if (pushed.success) {
    await c.env.DB.prepare('UPDATE inquiries SET kondesk_sent=1 WHERE id=?')
      .bind(insert.meta.last_row_id).run();
  }

  const params = { course: cricosName, code: cricosCode, provider: cricosProvider };
  return c.html(contactPage(user, params, true));
});

// ── HEALTH INSURANCE (KONPARE WIDGET) ────────────────────────────────────────
app.get('/health-insurance', c =>
  c.html(healthInsurancePage(c.get('user'), c.env.KONPARE_KEY))
);

// ── SERVICES ─────────────────────────────────────────────────────────────────
app.get('/services', c => c.redirect('/'));
app.get('/services/:slug', c => {
  const html = servicesPage(c.get('user'), c.req.param('slug'));
  if (!html) return c.redirect('/');
  return c.html(html);
});

// ── 404 ──────────────────────────────────────────────────────────────────────
app.notFound(c => {
  const { layout } = { layout: (t, b, u) => `<!DOCTYPE html><html><head><title>${t}</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial;text-align:center;padding:80px 24px;color:#1a2744"><h1 style="font-size:4rem">404</h1><p style="color:#64748b;margin:12px 0 24px">Page not found</p><a href="/" style="background:#1a5bb8;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none">Go Home</a></body></html>` };
  return c.html(`<!DOCTYPE html><html><head><title>404 Not Found</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Arial;text-align:center;padding:80px 24px;color:#1a2744"><h1 style="font-size:4rem">404</h1><p style="color:#64748b;margin:12px 0 24px">Page not found</p><a href="/" style="background:#1a5bb8;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700">Go Home</a></body></html>`, 404);
});

export default app;
