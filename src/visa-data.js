// ── POINTS CALCULATOR ───────────────────────────────────────────────────────
export const POINTS_TABLE = {
  age: [
    { label: '18–24', min: 18, max: 24, points: 25 },
    { label: '25–32', min: 25, max: 32, points: 30 },
    { label: '33–39', min: 33, max: 39, points: 25 },
    { label: '40–44', min: 40, max: 44, points: 15 },
    { label: '45+',   min: 45, max: 99, points: 0  },
  ],
  english: [
    { label: 'Competent (IELTS 6 / PTE 50)',   value: 'competent',   points: 0  },
    { label: 'Proficient (IELTS 7 / PTE 65)',   value: 'proficient',  points: 10 },
    { label: 'Superior (IELTS 8 / PTE 79)',     value: 'superior',    points: 20 },
  ],
  education: [
    { label: 'Doctorate (PhD)',                  value: 'phd',        points: 20 },
    { label: 'Bachelor / Masters / Diploma',     value: 'bachelor',   points: 15 },
    { label: 'None of the above',                value: 'none',       points: 0  },
  ],
  ausStudy: [
    { label: 'No Australian study',       value: 'none',      points: 0 },
    { label: '1–2 years in Australia',    value: '1-2',       points: 5 },
    { label: '2+ years in Australia',     value: '2+',        points: 5 },
  ],
  professionalYear: { points: 5, label: 'Completed Professional Year program (+5)' },
  overseasWork: [
    { label: 'Less than 3 years',      value: 'lt3',   points: 0  },
    { label: '3–4 years',             value: '3-4',   points: 5  },
    { label: '5–7 years',             value: '5-7',   points: 10 },
    { label: '8+ years',              value: '8+',    points: 15 },
  ],
  ausWork: [
    { label: 'Less than 1 year',       value: 'lt1',   points: 0  },
    { label: '1–2 years',             value: '1-2',   points: 5  },
    { label: '3–4 years',             value: '3-4',   points: 10 },
    { label: '5–7 years',             value: '5-7',   points: 15 },
    { label: '8+ years',              value: '8+',    points: 20 },
  ],
  partnerSkills: { points: 10, label: 'Partner has competent English + nominated occupation / AQF Cert IV or above (+10)' },
  singleOrAusCitizen: { points: 10, label: 'Single / partner is Australian citizen or PR (+10)' },
  naati: { points: 5, label: 'NAATI community language credential (+5)' },
  nomination190: { points: 5, label: 'State/Territory nomination — Subclass 190 (+5)' },
  nomination491: { points: 15, label: 'State/Territory nomination — Subclass 491 (+15)' },
  regionalStudy: { points: 5, label: 'Study in regional Australia (+5)' },
};

export function calcPoints(profile) {
  let pts = 0;
  const breakdown = [];

  // Age
  const age = parseInt(profile.age) || 0;
  const ageBand = POINTS_TABLE.age.find(b => age >= b.min && age <= b.max);
  if (ageBand) { pts += ageBand.points; breakdown.push({ label: `Age (${ageBand.label})`, points: ageBand.points }); }

  // English
  const eng = POINTS_TABLE.english.find(e => e.value === profile.english_level);
  if (eng) { pts += eng.points; breakdown.push({ label: `English (${eng.label})`, points: eng.points }); }

  // Education
  const edu = POINTS_TABLE.education.find(e => e.value === profile.education_level);
  if (edu) { pts += edu.points; breakdown.push({ label: `Education (${edu.label})`, points: edu.points }); }

  // Australian study
  const ausStudy = POINTS_TABLE.ausStudy.find(e => e.value === profile.aus_study_years);
  if (ausStudy && ausStudy.points) { pts += ausStudy.points; breakdown.push({ label: `Australian Study (${ausStudy.label})`, points: ausStudy.points }); }

  // Professional year
  if (profile.professional_year == 1) { pts += 5; breakdown.push({ label: 'Professional Year', points: 5 }); }

  // Overseas work
  const owork = POINTS_TABLE.overseasWork.find(e => e.value === profile.overseas_work_years);
  if (owork && owork.points) { pts += owork.points; breakdown.push({ label: `Overseas Work (${owork.label})`, points: owork.points }); }

  // Australian work
  const awork = POINTS_TABLE.ausWork.find(e => e.value === profile.aus_work_years);
  if (awork && awork.points) { pts += awork.points; breakdown.push({ label: `Australian Work (${awork.label})`, points: awork.points }); }

  // Partner / single
  if (profile.partner_skills == 1) { pts += 10; breakdown.push({ label: 'Partner Skills', points: 10 }); }
  else if (profile.partner_skills == 2) { pts += 10; breakdown.push({ label: 'Single / AUS Citizen Partner', points: 10 }); }

  // NAATI
  if (profile.naati == 1) { pts += 5; breakdown.push({ label: 'NAATI Community Language', points: 5 }); }

  // Regional study
  if (profile.regional_study == 1) { pts += 5; breakdown.push({ label: 'Regional Australian Study', points: 5 }); }

  // State nomination
  if (profile.state_nomination === '190') { pts += 5; breakdown.push({ label: 'State Nomination (190)', points: 5 }); }
  else if (profile.state_nomination === '491') { pts += 15; breakdown.push({ label: 'State Nomination (491)', points: 15 }); }

  return { total: pts, breakdown };
}

// ── VAC FEES ─────────────────────────────────────────────────────────────────
export const VAC_FEES = [
  { subclass: '189', name: 'Skilled Independent',        primary: 4770, secondary: 2385, child: 1195 },
  { subclass: '190', name: 'Skilled Nominated',          primary: 4770, secondary: 2385, child: 1195 },
  { subclass: '491', name: 'Skilled Work Regional',      primary: 4770, secondary: 2385, child: 1195 },
  { subclass: '186', name: 'Employer Nomination (ENS)',  primary: 4770, secondary: 2385, child: 1195 },
  { subclass: '187', name: 'Regional Sponsored (RSMS)',  primary: 4770, secondary: 2385, child: 1195 },
  { subclass: '482', name: 'Temporary Skill Shortage',   primary: 3115, secondary: 1560, child: 1560 },
  { subclass: '494', name: 'Skilled Employer Sponsored Regional', primary: 4770, secondary: 2385, child: 1195 },
  { subclass: '500', name: 'Student Visa',               primary: 710,  secondary: 355,  child: 355  },
  { subclass: '485', name: 'Graduate Temporary',         primary: 1895, secondary: 950,  child: 475  },
  { subclass: '820', name: 'Partner (onshore)',          primary: 8850, secondary: 4425, child: 0   },
  { subclass: '801', name: 'Partner (permanent onshore)',primary: 0,    secondary: 0,    child: 0, note: 'No additional fee if applying with 820' },
  { subclass: '309', name: 'Partner (offshore)',         primary: 8850, secondary: 4425, child: 0   },
  { subclass: '100', name: 'Partner (permanent offshore)',primary: 0,   secondary: 0,    child: 0, note: 'No additional fee if applying with 309' },
  { subclass: '600', name: 'Visitor Visa',               primary: 190,  secondary: 190,  child: 190 },
  { subclass: '407', name: 'Training Visa',              primary: 335,  secondary: 170,  child: 170 },
];

// ── PROCESSING TIMES ──────────────────────────────────────────────────────────
export const PROCESSING_TIMES = [
  { subclass: '189', name: 'Skilled Independent',  p25: 12, p50: 20, p75: 30, p90: 48,  note: 'Invitation required via SkillSelect EOI' },
  { subclass: '190', name: 'Skilled Nominated',    p25: 8,  p50: 14, p75: 22, p90: 36,  note: 'State nomination required first' },
  { subclass: '491', name: 'Skilled Work Regional',p25: 8,  p50: 14, p75: 22, p90: 36,  note: 'State/family nomination required' },
  { subclass: '482', name: 'TSS (employer)',        p25: 1,  p50: 3,  p75: 5,  p90: 9,   note: 'Short stream approx.' },
  { subclass: '186', name: 'ENS (employer nom.)',   p25: 8,  p50: 14, p75: 24, p90: 36,  note: 'Direct entry stream' },
  { subclass: '494', name: 'Employer Sponsored Regional', p25: 8, p50: 14, p75: 22, p90: 36, note: '' },
  { subclass: '500', name: 'Student Visa',          p25: 1,  p50: 2,  p75: 3,  p90: 5,   note: 'Varies by nationality and provider' },
  { subclass: '485', name: 'Graduate Temporary',    p25: 2,  p50: 4,  p75: 7,  p90: 12,  note: '2-year or 4-year stream' },
  { subclass: '820', name: 'Partner (onshore)',     p25: 12, p50: 24, p75: 36, p90: 48,  note: 'Bridging visa granted while waiting' },
  { subclass: '309', name: 'Partner (offshore)',    p25: 12, p50: 24, p75: 36, p90: 48,  note: '' },
  { subclass: '600', name: 'Visitor Visa',          p25: 1,  p50: 1,  p75: 2,  p90: 3,   note: 'Online applications' },
];

// ── STATE NOMINATION CRITERIA ─────────────────────────────────────────────────
export const STATE_CRITERIA = [
  {
    state: 'NSW', fullName: 'New South Wales',
    sc190: { minPoints: 90, notes: 'Must have employment offer or strong ties to NSW. High demand occupations only.' },
    sc491: { minPoints: 85, notes: 'Regional NSW only. Must live/work in designated regional areas.' },
    website: 'https://www.nsw.gov.au/working-in-nsw/visa-and-migration',
  },
  {
    state: 'VIC', fullName: 'Victoria',
    sc190: { minPoints: 90, notes: 'Expression of Interest submitted via Victoria\'s Skilled Visa portal. Occupations from Victorian list.' },
    sc491: { minPoints: 85, notes: 'Must live and work in regional Victoria.' },
    website: 'https://business.vic.gov.au/visa-and-migration',
  },
  {
    state: 'QLD', fullName: 'Queensland',
    sc190: { minPoints: 85, notes: 'QLD Skills in Demand list. Must intend to live and work in QLD.' },
    sc491: { minPoints: 80, notes: 'Regional QLD. Must live in designated regions.' },
    website: 'https://migration.qld.gov.au/',
  },
  {
    state: 'WA', fullName: 'Western Australia',
    sc190: { minPoints: 80, notes: 'WA Skilled Migration Occupation List. Strong preference for in-demand trades/healthcare.' },
    sc491: { minPoints: 75, notes: 'Regional WA. Must reside in regional WA.' },
    website: 'https://www.wa.gov.au/service/employment/migration/migrate-western-australia',
  },
  {
    state: 'SA', fullName: 'South Australia',
    sc190: { minPoints: 75, notes: 'SA Critical Skills List. Lower threshold but strong occupation requirement.' },
    sc491: { minPoints: 65, notes: 'Regional SA. Must live and work in SA.' },
    website: 'https://www.migration.sa.gov.au/',
  },
  {
    state: 'TAS', fullName: 'Tasmania',
    sc190: { minPoints: 65, notes: 'Open to most eligible occupations. Must intend to live and work in Tasmania.' },
    sc491: { minPoints: 60, notes: 'All of Tasmania is classified as regional.' },
    website: 'https://www.migration.tas.gov.au/',
  },
  {
    state: 'ACT', fullName: 'Australian Capital Territory',
    sc190: { minPoints: 90, notes: 'ACT Critical Skills List. Must have an ACT-based job offer in most cases.' },
    sc491: { minPoints: null, notes: 'ACT does not participate in SC 491 (not a regional state).' },
    website: 'https://www.act.gov.au/migration',
  },
  {
    state: 'NT', fullName: 'Northern Territory',
    sc190: { minPoints: 65, notes: 'NT occupation list. Lower points threshold. Strong demand for trades, healthcare, agriculture.' },
    sc491: { minPoints: 60, notes: 'All of NT is classified as regional.' },
    website: 'https://migration.nt.gov.au/',
  },
];

// ── ENGLISH REQUIREMENTS ──────────────────────────────────────────────────────
export const ENGLISH_REQUIREMENTS = [
  {
    visa: '189 / 190 / 491',
    name: 'Skilled Migration',
    level: 'Competent English (minimum)',
    ielts:  'L6 / R6 / W6 / S6',
    pte:    'L50 / R50 / W50 / S50',
    toefl:  'L12 / R13 / W21 / S18',
    oet:    'B in all components',
    notes:  'Proficient (IELTS 7) earns +10 pts; Superior (IELTS 8) earns +20 pts',
  },
  {
    visa: '482 (TSS)',
    name: 'Temporary Skill Shortage',
    level: 'Competent English',
    ielts:  'L4.5 / R4.5 / W4.5 / S4.5 (avg 5.0)',
    pte:    '36 in each component (avg 42)',
    toefl:  'L3 / R3 / W14 / S12 (total 24)',
    oet:    'B in each component',
    notes:  'Some exemptions for certain nationalities and assessment pathways',
  },
  {
    visa: '186 (ENS)',
    name: 'Employer Nomination',
    level: 'Competent English',
    ielts:  'L6 / R6 / W6 / S6',
    pte:    'L50 / R50 / W50 / S50',
    toefl:  'L12 / R13 / W21 / S18',
    oet:    'B in all components',
    notes:  'Direct entry stream',
  },
  {
    visa: '500',
    name: 'Student Visa',
    level: 'Provider-dependent',
    ielts:  'Typically 5.5–6.5 overall',
    pte:    'Typically 42–58',
    toefl:  'Typically 46–79',
    oet:    'Typically C+ in all',
    notes:  'Each institution sets its own minimum; confirm with your provider',
  },
  {
    visa: '485',
    name: 'Graduate Temporary',
    level: 'Competent English',
    ielts:  'L6 / R6 / W6 / S6',
    pte:    'L50 / R50 / W50 / S50',
    toefl:  'L12 / R13 / W21 / S18',
    oet:    'B in all components',
    notes:  'Must have met English requirement for the SC 500 student visa',
  },
  {
    visa: '820 / 801 / 309 / 100',
    name: 'Partner Visa',
    level: 'No minimum required',
    ielts:  'N/A',
    pte:    'N/A',
    toefl:  'N/A',
    oet:    'N/A',
    notes:  'English is not mandatory for partner visas; affects some citizenship pathways',
  },
];

// ── STUDENT FUND CALCULATOR ───────────────────────────────────────────────────
export const STUDENT_FUND = {
  livingCostPerYear: 29710,    // AUD (2025 DHA figure)
  partnerPerYear: 10394,
  childPerYear: 4449,
  note: 'Based on DHA 2024-25 financial capacity requirements. Does not include tuition fees, travel, or health cover.',
};

// ── OCCUPATIONS (MLTSSL + key STSOL) ─────────────────────────────────────────
export const OCCUPATIONS = [
  // ICT
  { anzsco: '261111', title: 'ICT Business Analyst',             list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '261112', title: 'Systems Analyst',                  list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '261311', title: 'Analyst Programmer',               list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '261312', title: 'Developer Programmer',             list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '261313', title: 'Software Engineer',                list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '261314', title: 'Software Tester',                  list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '261399', title: 'Software/Apps Programmers NEC',    list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '262111', title: 'Database Administrator',           list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '262112', title: 'ICT Security Specialist',          list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '263111', title: 'Computer Network Engineer',        list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '263112', title: 'Network Administrator',            list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '263211', title: 'ICT Quality Assurance Engineer',   list: 'MLTSSL', authority: 'ACS',      visas: ['189','190','491','482','186'] },
  { anzsco: '263311', title: 'Telecommunications Engineer',      list: 'MLTSSL', authority: 'ANZSCO',   visas: ['189','190','491','482','186'] },
  // Nursing / Healthcare
  { anzsco: '254111', title: 'Occupational Therapist',           list: 'MLTSSL', authority: 'AOTC',     visas: ['189','190','491','482','186'] },
  { anzsco: '252411', title: 'Physiotherapist',                  list: 'MLTSSL', authority: 'APC',      visas: ['189','190','491','482','186'] },
  { anzsco: '252511', title: 'Podiatrist',                       list: 'MLTSSL', authority: 'PODAC',    visas: ['189','190','491','482','186'] },
  { anzsco: '252711', title: 'Radiographer',                     list: 'MLTSSL', authority: 'AIR',      visas: ['189','190','491','482','186'] },
  { anzsco: '252211', title: 'Medical Laboratory Scientist',     list: 'MLTSSL', authority: 'AIMS',     visas: ['189','190','491','482','186'] },
  { anzsco: '272311', title: 'Registered Nurse (Medical)',       list: 'MLTSSL', authority: 'ANMAC',    visas: ['189','190','491','482','186'] },
  { anzsco: '272312', title: 'Registered Nurse (Surgical)',      list: 'MLTSSL', authority: 'ANMAC',    visas: ['189','190','491','482','186'] },
  { anzsco: '272317', title: 'Registered Nurse (Mental Health)', list: 'MLTSSL', authority: 'ANMAC',    visas: ['189','190','491','482','186'] },
  { anzsco: '272399', title: 'Registered Nurses NEC',            list: 'MLTSSL', authority: 'ANMAC',    visas: ['189','190','491','482','186'] },
  { anzsco: '251211', title: 'Medical Practitioner (General)',   list: 'MLTSSL', authority: 'AMC',      visas: ['189','190','491','482','186'] },
  { anzsco: '253111', title: 'General Practitioner',             list: 'MLTSSL', authority: 'AMC',      visas: ['189','190','491','482','186'] },
  { anzsco: '253321', title: 'Psychiatrist',                     list: 'MLTSSL', authority: 'AMC',      visas: ['189','190','491','482','186'] },
  { anzsco: '253999', title: 'Medical Specialists NEC',          list: 'MLTSSL', authority: 'AMC',      visas: ['189','190','491','482','186'] },
  // Engineering
  { anzsco: '233111', title: 'Chemical Engineer',                list: 'MLTSSL', authority: 'Engineers Australia', visas: ['189','190','491','482','186'] },
  { anzsco: '233211', title: 'Civil Engineer',                   list: 'MLTSSL', authority: 'Engineers Australia', visas: ['189','190','491','482','186'] },
  { anzsco: '233214', title: 'Structural Engineer',              list: 'MLTSSL', authority: 'Engineers Australia', visas: ['189','190','491','482','186'] },
  { anzsco: '233512', title: 'Mechanical Engineer',              list: 'MLTSSL', authority: 'Engineers Australia', visas: ['189','190','491','482','186'] },
  { anzsco: '233611', title: 'Mining Engineer',                  list: 'MLTSSL', authority: 'Engineers Australia', visas: ['189','190','491','482','186'] },
  { anzsco: '233999', title: 'Engineering Professionals NEC',    list: 'MLTSSL', authority: 'Engineers Australia', visas: ['189','190','491','482','186'] },
  { anzsco: '232111', title: 'Architect',                        list: 'MLTSSL', authority: 'AACA',     visas: ['189','190','491','482','186'] },
  { anzsco: '232212', title: 'Landscape Architect',              list: 'MLTSSL', authority: 'AILA',     visas: ['189','190','491','482','186'] },
  // Accounting / Finance
  { anzsco: '221111', title: 'Accountant (General)',             list: 'MLTSSL', authority: 'CPAA/CAANZ/IPA', visas: ['189','190','491','482','186'] },
  { anzsco: '221112', title: 'Management Accountant',            list: 'MLTSSL', authority: 'CPAA/CAANZ/IPA', visas: ['189','190','491','482','186'] },
  { anzsco: '221113', title: 'Taxation Accountant',              list: 'MLTSSL', authority: 'CPAA/CAANZ/IPA', visas: ['189','190','491','482','186'] },
  { anzsco: '221114', title: 'External Auditor',                 list: 'MLTSSL', authority: 'CPAA/CAANZ',     visas: ['189','190','491','482','186'] },
  { anzsco: '222111', title: 'Financial Investment Adviser',     list: 'STSOL',  authority: 'FINSIA',   visas: ['190','491','482'] },
  // Education
  { anzsco: '241111', title: 'Early Childhood Teacher',          list: 'MLTSSL', authority: 'ACECQA',   visas: ['189','190','491','482','186'] },
  { anzsco: '241411', title: 'Special Education Teacher',        list: 'MLTSSL', authority: 'AITSL',    visas: ['189','190','491','482','186'] },
  { anzsco: '241213', title: 'Secondary School Teacher',         list: 'STSOL',  authority: 'AITSL',    visas: ['190','491','482'] },
  // Trades
  { anzsco: '323211', title: 'Fitter (general)',                 list: 'MLTSSL', authority: 'TRA',      visas: ['189','190','491','482','186'] },
  { anzsco: '342111', title: 'Electrician (general)',            list: 'MLTSSL', authority: 'TRA',      visas: ['189','190','491','482','186'] },
  { anzsco: '334111', title: 'Plumber (general)',                list: 'MLTSSL', authority: 'TRA',      visas: ['189','190','491','482','186'] },
  { anzsco: '331112', title: 'Bricklayer',                       list: 'MLTSSL', authority: 'TRA',      visas: ['189','190','491','482','186'] },
  { anzsco: '331211', title: 'Carpenter and Joiner',             list: 'MLTSSL', authority: 'TRA',      visas: ['189','190','491','482','186'] },
  { anzsco: '333111', title: 'Painting Tradesperson',            list: 'MLTSSL', authority: 'TRA',      visas: ['189','190','491','482','186'] },
  { anzsco: '361111', title: 'Veterinarian',                     list: 'MLTSSL', authority: 'AVA',      visas: ['189','190','491','482','186'] },
  { anzsco: '251411', title: 'Optometrist',                      list: 'MLTSSL', authority: 'OCANZ',    visas: ['189','190','491','482','186'] },
  { anzsco: '251611', title: 'Dental Therapist',                 list: 'MLTSSL', authority: 'ADC',      visas: ['189','190','491','482','186'] },
  { anzsco: '252311', title: 'Dental Specialist',                list: 'MLTSSL', authority: 'ADC',      visas: ['189','190','491','482','186'] },
  { anzsco: '271311', title: 'Social Worker',                    list: 'MLTSSL', authority: 'AASW',     visas: ['189','190','491','482','186'] },
  { anzsco: '272111', title: 'Counsellor',                       list: 'STSOL',  authority: 'VETASSESS',visas: ['190','491','482'] },
];

export const TIMELINE_STAGES = [
  { key: 'skill_assessment',  label: 'Skills Assessment',       icon: '📋', desc: 'Skills assessed by relevant authority (TRA, ACS, ANMAC, Engineers Australia, etc.)' },
  { key: 'english_test',      label: 'English Test',            icon: '🗣️', desc: 'IELTS, PTE, TOEFL, or OET completed' },
  { key: 'eoi_lodged',        label: 'EOI Submitted',           icon: '📝', desc: 'Expression of Interest submitted in SkillSelect' },
  { key: 'invitation',        label: 'Invitation Received',     icon: '✉️', desc: 'Invitation to Apply (ITA) received from DHA or state authority' },
  { key: 'visa_lodged',       label: 'Visa Application Lodged', icon: '🚀', desc: 'Visa application submitted to the Department of Home Affairs' },
  { key: 'decision',          label: 'Decision Made',           icon: '⚖️', desc: 'DHA has made a decision on the application' },
  { key: 'visa_granted',      label: 'Visa Granted! 🎉',        icon: '🎉', desc: 'Visa approved — welcome to Australia!' },
];
