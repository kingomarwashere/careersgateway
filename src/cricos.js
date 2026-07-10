const CRICOS_BASE = 'https://cricos.education.gov.au';
const CACHE_TTL_HOURS = 24;

async function fetchViewState() {
  const res = await fetch(`${CRICOS_BASE}/Course/CourseSearch.aspx`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    }
  });
  const html = await res.text();
  const cookies = res.headers.get('set-cookie') || '';

  const vs = (html.match(/id="__VIEWSTATE"\s+value="([^"]+)"/) || [])[1] || '';
  const vsgen = (html.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/) || [])[1] || '';
  const ev = (html.match(/id="__EVENTVALIDATION"\s+value="([^"]+)"/) || [])[1] || '';
  return { vs, vsgen, ev, cookies };
}

function parseCricosResults(html) {
  const courses = [];
  // Match table rows in the results table
  const tableMatch = html.match(/<table[^>]*id="[^"]*grd[^"]*"[^>]*>([\s\S]*?)<\/table>/i)
    || html.match(/<table[^>]*class="[^"]*result[^"]*"[^>]*>([\s\S]*?)<\/table>/i)
    || html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi);

  if (!tableMatch) return courses;

  const tableHtml = Array.isArray(tableMatch) ? tableMatch.find(t => t.includes('CRICOS') || t.includes('Course')) || tableMatch[0] : tableMatch[1] || tableMatch[0];

  // Extract all <tr> rows with <td> cells
  const rows = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  for (const row of rows) {
    const cells = (row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [])
      .map(td => td.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim());
    if (cells.length >= 4 && cells.some(c => c.length > 2)) {
      courses.push({
        cricosCode: cells[0] || '',
        courseName: cells[1] || '',
        provider: cells[2] || '',
        state: cells[3] || '',
        duration: cells[4] || '',
        fee: cells[5] || '',
      });
    }
  }
  return courses.filter(c => c.cricosCode || c.courseName);
}

async function searchCricos(env, params) {
  const cacheKey = JSON.stringify(params);
  const cached = await env.DB.prepare('SELECT results_json, cached_at FROM cricos_cache WHERE cache_key = ?')
    .bind(cacheKey).first();

  if (cached) {
    const ageHours = (Date.now() - new Date(cached.cached_at).getTime()) / 3600000;
    if (ageHours < CACHE_TTL_HOURS) {
      return { results: JSON.parse(cached.results_json), fromCache: true };
    }
  }

  try {
    const { vs, vsgen, ev, cookies } = await fetchViewState();

    const formData = new URLSearchParams({
      '__VIEWSTATE': vs,
      '__VIEWSTATEGENERATOR': vsgen,
      '__EVENTVALIDATION': ev,
      'ctl00$ContentPlaceHolder1$txtCourseName': params.courseName || '',
      'ctl00$ContentPlaceHolder1$txtCRICOSCourseCode': params.cricosCode || '',
      'ctl00$ContentPlaceHolder1$ddlState': params.state || '',
      'ctl00$ContentPlaceHolder1$ddlCourseLevel': params.courseLevel || '',
      'ctl00$ContentPlaceHolder1$ddlBroadField': params.broadField || '',
      'ctl00$ContentPlaceHolder1$ddlNarrowField': '',
      'ctl00$ContentPlaceHolder1$ddlDetailedField': '',
      'ctl00$ContentPlaceHolder1$ddlLanguage': '',
      'ctl00$ContentPlaceHolder1$btnSearch': 'Search',
    });

    const res = await fetch(`${CRICOS_BASE}/Course/CourseSearch.aspx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `${CRICOS_BASE}/Course/CourseSearch.aspx`,
        'Cookie': cookies,
      },
      body: formData.toString(),
    });

    const html = await res.text();
    const results = parseCricosResults(html);

    await env.DB.prepare(
      'INSERT OR REPLACE INTO cricos_cache (cache_key, results_json, cached_at) VALUES (?, ?, datetime("now"))'
    ).bind(cacheKey, JSON.stringify(results)).run();

    return { results, fromCache: false };
  } catch (e) {
    if (cached) return { results: JSON.parse(cached.results_json), fromCache: true, stale: true };
    return { results: [], error: e.message };
  }
}

export { searchCricos };
