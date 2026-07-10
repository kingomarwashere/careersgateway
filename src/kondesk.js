// Konpare/Kondesk lead push
// The Konpare API key is used for their widget embed (OSHC comparison)
// and for posting lead data when a course inquiry is submitted.
async function pushLeadToKondesk(env, lead) {
  const payload = {
    api_key: env.KONPARE_KEY,
    lead: {
      full_name: lead.fullName,
      email: lead.email,
      phone: lead.phone || '',
      service: lead.service || 'Course Inquiry',
      course_code: lead.cricosCode || '',
      course_name: lead.courseName || '',
      provider: lead.provider || '',
      message: lead.message || '',
      source: 'careers.bored.investments',
    }
  };

  // Try Konpare lead submission endpoint
  const endpoints = [
    'https://app.konpare.online/api/leads',
    'https://app.konpare.online/api/v1/leads',
    'https://app.kondesk.com/api/leads',
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.KONPARE_KEY}`,
          'x-api-key': env.KONPARE_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { success: true, endpoint: url };
    } catch (_) {}
  }

  // Fallback: email notification
  await sendEmailFallback(env, lead);
  return { success: false, fallback: 'email' };
}

async function sendEmailFallback(env, lead) {
  // Cloudflare Email Routing send — uses MailChannels via Workers
  const emailBody = `
New Lead from Careers Gateway Portal

Name: ${lead.fullName}
Email: ${lead.email}
Phone: ${lead.phone || 'N/A'}
Service: ${lead.service || 'N/A'}
Course: ${lead.courseName || 'N/A'} (${lead.cricosCode || 'N/A'})
Provider: ${lead.provider || 'N/A'}
Message: ${lead.message || 'N/A'}
Submitted: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}
  `.trim();

  try {
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: env.CONTACT_EMAIL, name: 'Careers Gateway' }] }],
        from: { email: 'noreply@careersgateway.com.au', name: 'Careers Gateway Portal' },
        subject: `New Lead: ${lead.fullName} — ${lead.service || 'Course Inquiry'}`,
        content: [{ type: 'text/plain', value: emailBody }],
      }),
    });
  } catch (_) {}
}

export { pushLeadToKondesk };
