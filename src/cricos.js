// CRICOS search using the official data.gov.au dataset imported into D1.
// Data is refreshed monthly from:
// https://data.gov.au/data/dataset/e5ae7059-bfa8-4fa4-a5c0-c13cf3520193

async function searchCricos(env, params) {
  const { courseName, cricosCode, state, courseLevel } = params;
  const limit = 50;

  // Build WHERE clauses
  const conditions = ['c.expired = 0'];
  const bindings = [];

  if (courseName && courseName.trim()) {
    conditions.push("c.course_name LIKE ?");
    bindings.push(`%${courseName.trim()}%`);
  }
  if (cricosCode && cricosCode.trim()) {
    conditions.push("c.course_code LIKE ?");
    bindings.push(`%${cricosCode.trim()}%`);
  }
  if (courseLevel && courseLevel.trim()) {
    // Match against course_level field
    const levelMap = {
      '1': 'Bachelor',
      '2': 'Master',
      '3': 'Doctoral',
      '4': 'Diploma',
      '5': 'Certificate',
      '6': 'Advanced Diploma',
      '7': 'Graduate Certificate',
      '8': 'Graduate Diploma',
    };
    const levelText = levelMap[courseLevel] || courseLevel;
    conditions.push("c.course_level LIKE ?");
    bindings.push(`%${levelText}%`);
  }

  const whereClause = conditions.join(' AND ');

  let query, results;

  if (state && state.trim()) {
    // Join with locations to filter by state
    query = `
      SELECT DISTINCT c.course_code, c.course_name, c.institution_name, c.course_level,
             c.duration_weeks, c.tuition_fee, c.provider_code, c.vet_national_code,
             l.location_state, l.location_city
      FROM cricos_courses c
      INNER JOIN cricos_course_locations l ON c.course_code = l.course_code
      WHERE ${whereClause}
        AND l.location_state = ?
      ORDER BY c.institution_name, c.course_name
      LIMIT ${limit}
    `;
    bindings.push(state.trim());
  } else {
    // No state filter — use course_locations for a representative state
    query = `
      SELECT c.course_code, c.course_name, c.institution_name, c.course_level,
             c.duration_weeks, c.tuition_fee, c.provider_code, c.vet_national_code,
             (SELECT l.location_state FROM cricos_course_locations l WHERE l.course_code = c.course_code LIMIT 1) as location_state,
             (SELECT l.location_city FROM cricos_course_locations l WHERE l.course_code = c.course_code LIMIT 1) as location_city
      FROM cricos_courses c
      WHERE ${whereClause}
      ORDER BY c.institution_name, c.course_name
      LIMIT ${limit}
    `;
  }

  const stmt = env.DB.prepare(query).bind(...bindings);
  const raw = await stmt.all();
  results = (raw.results || []).map(row => ({
    cricosCode: row.course_code,
    courseName: row.course_name,
    provider: row.institution_name,
    providerCode: row.provider_code,
    level: row.course_level,
    state: row.location_state || '',
    city: row.location_city || '',
    durationWeeks: row.duration_weeks,
    tuitionFee: row.tuition_fee,
    vetCode: row.vet_national_code,
  }));

  return { results, fromCache: false };
}

async function getCricosStats(env) {
  const r = await env.DB.prepare(
    'SELECT COUNT(*) as total, COUNT(DISTINCT institution_name) as providers FROM cricos_courses WHERE expired=0'
  ).first();
  return r;
}

export { searchCricos, getCricosStats };
