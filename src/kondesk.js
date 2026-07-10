const NOTIFY_EMAIL = 'Cgabijendra@gmail.com';

async function pushLeadToKondesk(env, lead) {
  const [sheetsResult, emailResult, kondeskResult] = await Promise.allSettled([
    pushToGoogleSheet(env, lead),
    sendEmail(env, lead),
    pushToKondesk(env, lead),
  ]);

  const sheetOk  = sheetsResult.status  === 'fulfilled';
  const emailOk  = emailResult.status   === 'fulfilled';
  const kondeskOk = kondeskResult.status === 'fulfilled' && kondeskResult.value === true;

  // success = true if at least Google Sheet or email went through
  return { success: sheetOk || emailOk, kondeskOk, sheetOk, emailOk };
}

async function pushToGoogleSheet(env, lead) {
  const url = env.GOOGLE_SHEET_WEBHOOK;
  if (!url) return;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName:   lead.fullName,
      email:      lead.email,
      phone:      lead.phone || '',
      service:    lead.service || '',
      courseName: lead.courseName || '',
      cricosCode: lead.cricosCode || '',
      provider:   lead.provider || '',
      message:    lead.message || '',
      source:     'careersgateway.com.au',
      submittedAt: new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }),
    }),
  });
}

async function sendEmail(env, lead) {
  const dt = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney', dateStyle: 'full', timeStyle: 'short' });
  const html = `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1a2744;max-width:600px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#1a2744,#1a5bb8);padding:24px 28px;border-radius:8px 8px 0 0">
    <img src="https://careersgateway.com.au/wp-content/uploads/2025/06/cropped-Screenshot-2025-06-15-at-1.59.23_PM-300x159-removebg-preview-192x192.png" style="height:36px;filter:brightness(0) invert(1)">
    <h2 style="color:#fff;margin:8px 0 0;font-size:1.1rem">New Inquiry — Careers Gateway Portal</h2>
  </div>
  <div style="background:#f0f6ff;padding:24px 28px;border-radius:0 0 8px 8px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#64748b;width:130px;font-size:.9rem">Name</td><td style="padding:8px 0;font-weight:700">${esc(lead.fullName)}</td></tr>
      <tr style="background:#fff"><td style="padding:8px 12px;color:#64748b;font-size:.9rem">Email</td><td style="padding:8px 12px"><a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:.9rem">Phone</td><td style="padding:8px 0"><a href="tel:${esc(lead.phone||'')}">${esc(lead.phone||'—')}</a></td></tr>
      <tr style="background:#fff"><td style="padding:8px 12px;color:#64748b;font-size:.9rem">Service</td><td style="padding:8px 12px">${esc(lead.service||'—')}</td></tr>
      ${lead.courseName ? `<tr><td style="padding:8px 0;color:#64748b;font-size:.9rem">Course</td><td style="padding:8px 0">${esc(lead.courseName)}${lead.cricosCode ? ` <span style="color:#1a5bb8;font-size:.85rem">(CRICOS: ${esc(lead.cricosCode)})</span>` : ''}</td></tr>` : ''}
      ${lead.provider ? `<tr style="background:#fff"><td style="padding:8px 12px;color:#64748b;font-size:.9rem">Institution</td><td style="padding:8px 12px">${esc(lead.provider)}</td></tr>` : ''}
      ${lead.message ? `<tr><td style="padding:8px 0;color:#64748b;font-size:.9rem;vertical-align:top">Message</td><td style="padding:8px 0">${esc(lead.message)}</td></tr>` : ''}
      <tr style="background:#fff"><td style="padding:8px 12px;color:#64748b;font-size:.9rem">Submitted</td><td style="padding:8px 12px;font-size:.85rem">${dt}</td></tr>
    </table>
    <div style="margin-top:20px;text-align:center">
      <a href="mailto:${esc(lead.email)}" style="background:#1a5bb8;color:#fff;padding:11px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:.9rem">Reply to ${esc(lead.fullName.split(' ')[0])}</a>
    </div>
  </div>
</body></html>`;

  // MailChannels (works on Cloudflare Workers for domains with SPF set)
  try {
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: NOTIFY_EMAIL, name: 'Bijendra — Careers Gateway' }] }],
        from: { email: 'noreply@careersgateway.com.au', name: 'Careers Gateway Portal' },
        reply_to: { email: lead.email, name: lead.fullName },
        subject: `New Inquiry: ${lead.fullName} — ${lead.service || 'General'}`,
        content: [
          { type: 'text/plain', value: `New inquiry from ${lead.fullName} (${lead.email} / ${lead.phone})\n\nService: ${lead.service}\nCourse: ${lead.courseName||'N/A'}\nMessage: ${lead.message||'N/A'}` },
          { type: 'text/html', value: html },
        ],
      }),
    });
  } catch (_) {}
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function pushToKondesk(env, lead) {
  const endpoints = [
    'https://app.konpare.online/api/leads',
    'https://app.konpare.online/api/v1/leads',
  ];
  const payload = {
    api_key: env.KONPARE_KEY,
    lead: {
      full_name: lead.fullName, email: lead.email, phone: lead.phone||'',
      service: lead.service||'Course Inquiry', course_code: lead.cricosCode||'',
      course_name: lead.courseName||'', provider: lead.provider||'',
      message: lead.message||'', source: 'careersgateway.com.au',
    }
  };
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.KONPARE_KEY}`, 'x-api-key': env.KONPARE_KEY },
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
    } catch (_) {}
  }
  return false;
}

export { pushLeadToKondesk };
