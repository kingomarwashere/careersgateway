import { Hono } from 'hono';
import { hashPassword, verifyPassword, createSession, getCurrentUser, getCookie } from './auth.js';
import { searchCricos } from './cricos.js';
import { pushLeadToKondesk } from './kondesk.js';
import {
  homePage, coursesPage, registerPage, loginPage,
  dashboardPage, contactPage, healthInsurancePage, servicesPage, layout, esc
} from './templates.js';
import {
  pointsPage, timelinePage, documentsPage, feesPage,
  occupationsPage, stateCriteriaPage, processingTimesPage, englishPage, studentFundPage,
  dashboardOverview
} from './visa-tracker.js';

const app = new Hono();

// ── www → apex redirect ──────────────────────────────────────────────────────
app.use('*', async (c, next) => {
  const host = c.req.header('host') || '';
  if (host.startsWith('www.')) {
    const url = new URL(c.req.url);
    url.hostname = url.hostname.replace(/^www\./, '');
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// ── WordPress media proxy — serves /wp-content/* from origin host ────────────
const WP_ORIGIN = '62.169.17.14';
app.get('/wp-content/*', async c => {
  const path = new URL(c.req.url).pathname + new URL(c.req.url).search;
  const originUrl = `https://${WP_ORIGIN}${path}`;
  const res = await fetch(originUrl, {
    headers: {
      'Host': 'careersgateway.com.au',
      'User-Agent': 'Mozilla/5.0',
    },
    cf: { cacheTtl: 86400, cacheEverything: true },
  }).catch(() => null);
  if (!res || !res.ok) {
    // Fallback: try HTTP
    const httpRes = await fetch(`http://${WP_ORIGIN}${path}`, {
      headers: { 'Host': 'careersgateway.com.au' },
    }).catch(() => null);
    if (!httpRes || !httpRes.ok) return c.notFound();
    return new Response(httpRes.body, {
      status: httpRes.status,
      headers: {
        'Content-Type': httpRes.headers.get('Content-Type') || 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

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

  // Notify team of new registration — high-intent signal
  c.executionCtx.waitUntil(pushLeadToKondesk(c.env, {
    fullName, email, phone,
    service: '🆕 New Account Registration',
    message: `New user registered on the portal. Name: ${fullName}, Phone: ${phone}`,
  }));

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

  return c.html(coursesPage(c.get('user'), results, params, fromCache, error, c.req.query('saved')||''));
});

// ── DASHBOARD ───────────────────────────────────────────────────────────────
app.get('/dashboard', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard');
  const [inquiriesRes, profileRes, docsRes, timelineRes] = await Promise.all([
    c.env.DB.prepare('SELECT * FROM inquiries WHERE user_id=? ORDER BY created_at DESC LIMIT 30').bind(user.id).all(),
    c.env.DB.prepare('SELECT * FROM visa_profiles WHERE user_id=?').bind(user.id).first(),
    c.env.DB.prepare('SELECT * FROM document_expiries WHERE user_id=? ORDER BY expiry_date ASC LIMIT 5').bind(user.id).all(),
    c.env.DB.prepare('SELECT * FROM case_timelines WHERE user_id=?').bind(user.id).all(),
  ]);
  const { calcPoints } = await import('./visa-data.js');
  const points = profileRes ? calcPoints(profileRes) : null;
  const completedStages = (timelineRes.results||[]).filter(s => s.milestone_date).length;
  const today = new Date();
  const expiringDocs = (docsRes.results||[]).filter(d => {
    const days = Math.round((new Date(d.expiry_date) - today) / 86400000);
    return days <= 180;
  });
  return c.html(layout('Dashboard', dashboardOverview(user, {
    inquiries: inquiriesRes.results||[],
    profile: profileRes,
    points,
    completedStages,
    totalStages: 7,
    expiringDocs,
  }), user));
});

app.get('/dashboard/save', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/courses');
  const code     = c.req.query('code')     || '';
  const name     = c.req.query('name')     || '';
  const provider = c.req.query('provider') || '';
  const back     = c.req.query('back')     || '';   // search URL to return to

  // Check if already saved
  const existing = await c.env.DB.prepare(
    'SELECT id FROM inquiries WHERE user_id=? AND cricos_course_code=? AND service=?'
  ).bind(user.id, code, 'Saved Course').first();

  if (!existing) {
    await c.env.DB.prepare(
      'INSERT INTO inquiries (user_id, full_name, email, service, cricos_course_code, cricos_course_name, cricos_provider) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(user.id, user.full_name, user.email, 'Saved Course', code, name, provider).run();

    // Notify team — course save is high-intent
    c.executionCtx.waitUntil(pushLeadToKondesk(c.env, {
      fullName: user.full_name,
      email: user.email,
      phone: user.phone || '',
      service: '💾 Course Saved',
      cricosCode: code,
      courseName: name,
      provider,
      message: `${user.full_name} saved a course to their dashboard: ${name} (${code}) at ${provider}`,
    }));
  }

  // Return to courses page with saved=1 flag so we can show a confirmation
  const returnUrl = back ? `${back}&saved=${encodeURIComponent(code)}` : `/courses?saved=${encodeURIComponent(code)}`;
  return c.redirect(returnUrl);
});

// ── VISA TRACKER: POINTS CALCULATOR ─────────────────────────────────────────
app.get('/dashboard/points', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/points');
  const profile = await c.env.DB.prepare('SELECT * FROM visa_profiles WHERE user_id=?').bind(user.id).first();
  return c.html(layout('Points Calculator', pointsPage(user, profile, null), user));
});

app.post('/dashboard/points', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  const form = await c.req.formData();
  const p = {
    occupation_anzsco: form.get('occupation_anzsco')||'',
    occupation_name: form.get('occupation_name')||'',
    visa_subclass: form.get('visa_subclass')||'',
    age: parseInt(form.get('age'))||0,
    english_level: form.get('english_level')||'',
    education_level: form.get('education_level')||'',
    aus_study_years: form.get('aus_study_years')||'none',
    professional_year: form.get('professional_year')==='1'?1:0,
    overseas_work_years: form.get('overseas_work_years')||'lt3',
    aus_work_years: form.get('aus_work_years')||'lt1',
    partner_skills: parseInt(form.get('partner_skills'))||0,
    naati: form.get('naati')==='1'?1:0,
    regional_study: form.get('regional_study')==='1'?1:0,
    state_nomination: form.get('state_nomination')||'',
  };
  await c.env.DB.prepare(`INSERT INTO visa_profiles (user_id,occupation_anzsco,occupation_name,visa_subclass,age,english_level,education_level,aus_study_years,professional_year,overseas_work_years,aus_work_years,partner_skills,naati,regional_study,state_nomination,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET occupation_anzsco=excluded.occupation_anzsco,occupation_name=excluded.occupation_name,visa_subclass=excluded.visa_subclass,age=excluded.age,english_level=excluded.english_level,education_level=excluded.education_level,aus_study_years=excluded.aus_study_years,professional_year=excluded.professional_year,overseas_work_years=excluded.overseas_work_years,aus_work_years=excluded.aus_work_years,partner_skills=excluded.partner_skills,naati=excluded.naati,regional_study=excluded.regional_study,state_nomination=excluded.state_nomination,updated_at=datetime('now')`)
    .bind(user.id,p.occupation_anzsco,p.occupation_name,p.visa_subclass,p.age,p.english_level,p.education_level,p.aus_study_years,p.professional_year,p.overseas_work_years,p.aus_work_years,p.partner_skills,p.naati,p.regional_study,p.state_nomination).run();
  return c.html(layout('Points Calculator', pointsPage(user, p, 'Points saved!'), user));
});

// ── VISA TRACKER: TIMELINE ───────────────────────────────────────────────────
app.get('/dashboard/timeline', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/timeline');
  const { results } = await c.env.DB.prepare('SELECT * FROM case_timelines WHERE user_id=?').bind(user.id).all();
  return c.html(layout('Visa Timeline', timelinePage(user, results, null), user));
});

app.post('/dashboard/timeline', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  const form = await c.req.formData();
  const { TIMELINE_STAGES } = await import('./visa-data.js');
  for (const stage of TIMELINE_STAGES) {
    const date = form.get(`date_${stage.key}`) || null;
    const notes = form.get(`notes_${stage.key}`) || null;
    if (date || notes) {
      await c.env.DB.prepare(`INSERT INTO case_timelines (user_id,stage,milestone_date,notes,updated_at) VALUES (?,?,?,?,datetime('now'))
        ON CONFLICT(user_id,stage) DO UPDATE SET milestone_date=excluded.milestone_date,notes=excluded.notes,updated_at=datetime('now')`)
        .bind(user.id, stage.key, date||null, notes||null).run().catch(()=>{});
    }
  }
  const { results } = await c.env.DB.prepare('SELECT * FROM case_timelines WHERE user_id=?').bind(user.id).all();
  return c.html(layout('Visa Timeline', timelinePage(user, results, 'Timeline saved!'), user));
});

// ── VISA TRACKER: DOCUMENT EXPIRY ────────────────────────────────────────────
app.get('/dashboard/documents', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/documents');
  const { results } = await c.env.DB.prepare('SELECT * FROM document_expiries WHERE user_id=? ORDER BY expiry_date ASC').bind(user.id).all();
  return c.html(layout('Document Expiry', documentsPage(user, results, null), user));
});

app.post('/dashboard/documents', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  const form = await c.req.formData();
  const preset = form.get('doc_label') || '';
  const custom = (form.get('custom_label') || '').trim();
  const label = custom || preset;
  const expiry = form.get('expiry_date') || '';
  if (label && expiry) {
    await c.env.DB.prepare('INSERT INTO document_expiries (user_id,doc_type,doc_label,expiry_date) VALUES (?,?,?,?)')
      .bind(user.id, preset, label, expiry).run();
  }
  return c.redirect('/dashboard/documents');
});

app.post('/dashboard/documents/delete', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  const form = await c.req.formData();
  const id = parseInt(form.get('id'));
  if (id) await c.env.DB.prepare('DELETE FROM document_expiries WHERE id=? AND user_id=?').bind(id, user.id).run();
  return c.redirect('/dashboard/documents');
});

// ── VISA TRACKER: STATIC TOOLS ───────────────────────────────────────────────
app.get('/dashboard/fees', c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/fees');
  return c.html(layout('VAC Fee Calculator', feesPage(user), user));
});

app.get('/dashboard/occupations', c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/occupations');
  return c.html(layout('Occupation Search', occupationsPage(user, c.req.query('q')||''), user));
});

app.get('/dashboard/state-criteria', c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/state-criteria');
  return c.html(layout('State Nomination Criteria', stateCriteriaPage(user), user));
});

app.get('/dashboard/processing-times', c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/processing-times');
  return c.html(layout('Processing Times', processingTimesPage(user), user));
});

app.get('/dashboard/english', c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/english');
  return c.html(layout('English Requirements', englishPage(user), user));
});

app.get('/dashboard/student-fund', c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login?redirect=/dashboard/student-fund');
  return c.html(layout('Student Fund Calculator', studentFundPage(user), user));
});

// ── PROFILE ──────────────────────────────────────────────────────────────────
app.get('/dashboard/profile', async c => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
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

  // Mark sent when Google Sheet or email confirmed delivery (Kondesk API not available)
  if (pushed.sheetOk || pushed.emailOk) {
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

// ── SCHEDULED: daily document expiry notifications ───────────────────────────
async function scheduled(event, env, ctx) {
  const today = new Date();
  const in30  = new Date(today); in30.setDate(in30.getDate() + 30);
  const in7   = new Date(today); in7.setDate(in7.getDate() + 7);

  // Get all expiring documents with user details
  const { results } = await env.DB.prepare(`
    SELECT d.id, d.doc_label, d.expiry_date, d.user_id,
           u.full_name, u.email, u.phone
    FROM document_expiries d
    JOIN users u ON u.id = d.user_id
    WHERE d.expiry_date <= ?
    ORDER BY d.expiry_date ASC
  `).bind(in30.toISOString().split('T')[0]).all();

  if (!results || results.length === 0) return;

  // Group by urgency
  const expired  = results.filter(d => new Date(d.expiry_date) < today);
  const urgent   = results.filter(d => { const dt = new Date(d.expiry_date); return dt >= today && dt <= in7; });
  const upcoming = results.filter(d => { const dt = new Date(d.expiry_date); return dt > in7 && dt <= in30; });

  const fmt = d => new Date(d.expiry_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  const row = d => `<tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">${d.doc_label}</td><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">${d.full_name}</td><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9"><a href="mailto:${d.email}">${d.email}</a></td><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">${d.phone||'—'}</td><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9">${fmt(d)}</td></tr>`;

  const section = (title, color, rows) => rows.length === 0 ? '' : `
    <h3 style="color:${color};margin:20px 0 8px;font-size:1rem">${title} (${rows.length})</h3>
    <table style="width:100%;border-collapse:collapse;font-size:.88rem;margin-bottom:16px">
      <tr style="background:#f8faff"><th style="padding:8px 12px;text-align:left">Document</th><th style="padding:8px 12px;text-align:left">Client</th><th style="padding:8px 12px;text-align:left">Email</th><th style="padding:8px 12px;text-align:left">Phone</th><th style="padding:8px 12px;text-align:left">Expiry</th></tr>
      ${rows.map(row).join('')}
    </table>`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:700px;color:#1a2744">
      <div style="background:#1a5bb8;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0;font-size:1rem">📄 Daily Document Expiry Report — Careers Gateway</h2>
        <div style="color:rgba(255,255,255,.8);font-size:.85rem;margin-top:4px">${today.toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
      </div>
      <div style="padding:20px 24px;background:#f8faff;border:1px solid #e8f0fe;border-top:none;border-radius:0 0 8px 8px">
        ${section('🔴 Already Expired', '#dc2626', expired)}
        ${section('🟠 Expiring within 7 days', '#d97706', urgent)}
        ${section('🟡 Expiring within 30 days', '#ca8a04', upcoming)}
        <div style="margin-top:16px;padding:12px;background:#dbeafe;border-radius:6px;font-size:.85rem;color:#1d4ed8">
          ${results.length} document${results.length!==1?'s':''} across ${new Set(results.map(r=>r.user_id)).size} client${new Set(results.map(r=>r.user_id)).size!==1?'s':''} require attention.
          <a href="https://careers.bored.investments/dashboard">View Dashboard →</a>
        </div>
      </div>
    </div>`;

  await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: env.CONTACT_EMAIL, name: 'Careers Gateway Team' }] }],
      from: { email: 'contact@careersgateway.com.au', name: 'Careers Gateway Portal' },
      subject: `📄 ${results.length} document${results.length!==1?'s':''} expiring — Daily Expiry Report`,
      content: [{ type: 'text/html', value: html }],
    }),
  }).catch(() => {});

  // Also push to Google Sheet for record
  if (env.GOOGLE_SHEET_WEBHOOK) {
    await fetch(env.GOOGLE_SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'SYSTEM - Daily Expiry Report',
        email: env.CONTACT_EMAIL,
        phone: '',
        service: `📄 Document Expiry Alert: ${results.length} documents`,
        message: results.map(d => `${d.doc_label} | ${d.full_name} | ${d.email} | ${fmt(d)}`).join('\n'),
        source: 'cron-daily-expiry',
        submittedAt: today.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }),
      }),
    }).catch(() => {});
  }
}

export default { fetch: app.fetch, scheduled };
