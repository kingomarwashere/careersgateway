const CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2744;background:#f8faff}
  a{color:#1a5bb8;text-decoration:none}
  a:hover{text-decoration:underline}

  /* NAV */
  nav{background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08);position:sticky;top:0;z-index:100}
  .nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:68px}
  .nav-logo{font-size:1.25rem;font-weight:700;color:#1a2744;display:flex;align-items:center;gap:10px}
  .nav-logo span{color:#1a5bb8}
  .nav-links{display:flex;gap:28px;align-items:center;list-style:none}
  .nav-links a{font-size:.95rem;color:#1a2744;font-weight:500}
  .nav-links a:hover{color:#1a5bb8;text-decoration:none}
  .nav-cta{background:#1a5bb8;color:#fff!important;padding:9px 22px;border-radius:6px;font-weight:600!important}
  .nav-cta:hover{background:#154fa0;text-decoration:none!important}
  .nav-user{display:flex;align-items:center;gap:16px;font-size:.9rem}

  /* HERO */
  .hero{background:linear-gradient(135deg,#1a2744 0%,#1a5bb8 100%);color:#fff;padding:80px 24px;text-align:center}
  .hero h1{font-size:2.8rem;font-weight:800;margin-bottom:16px;line-height:1.2}
  .hero p{font-size:1.2rem;opacity:.9;max-width:600px;margin:0 auto 32px}
  .hero-btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
  .btn{display:inline-block;padding:13px 30px;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;border:none;transition:.2s}
  .btn-white{background:#fff;color:#1a5bb8}
  .btn-white:hover{background:#e8f0fe;text-decoration:none}
  .btn-outline{border:2px solid #fff;color:#fff;background:transparent}
  .btn-outline:hover{background:rgba(255,255,255,.12);text-decoration:none}
  .btn-primary{background:#1a5bb8;color:#fff}
  .btn-primary:hover{background:#154fa0;text-decoration:none}
  .btn-success{background:#16a34a;color:#fff}
  .btn-success:hover{background:#15803d;text-decoration:none}

  /* SECTIONS */
  section{padding:64px 24px}
  .container{max-width:1200px;margin:0 auto}
  .section-title{font-size:2rem;font-weight:700;text-align:center;margin-bottom:12px;color:#1a2744}
  .section-sub{text-align:center;color:#64748b;font-size:1.05rem;margin-bottom:48px}

  /* SERVICES GRID */
  .services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
  .service-card{background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:.2s;border:1px solid #e8f0fe}
  .service-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(26,91,184,.12)}
  .service-icon{font-size:2rem;margin-bottom:12px}
  .service-card h3{font-size:1.1rem;font-weight:700;margin-bottom:8px;color:#1a2744}
  .service-card p{font-size:.9rem;color:#64748b;line-height:1.6}
  .service-link{display:inline-block;margin-top:14px;font-size:.9rem;font-weight:600;color:#1a5bb8}

  /* STATS */
  .stats-bar{background:#1a5bb8;color:#fff;padding:40px 24px}
  .stats-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:24px;text-align:center}
  .stat-num{font-size:2.2rem;font-weight:800}
  .stat-label{font-size:.9rem;opacity:.85;margin-top:4px}

  /* WHY US */
  .why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
  .why-card{background:#fff;border-radius:10px;padding:24px;border-left:4px solid #1a5bb8;box-shadow:0 2px 8px rgba(0,0,0,.05)}
  .why-card h4{font-weight:700;margin-bottom:8px;color:#1a2744}
  .why-card p{font-size:.9rem;color:#64748b}

  /* TESTIMONIALS */
  .testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
  .testi-card{background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
  .stars{color:#f59e0b;font-size:1.1rem;margin-bottom:12px}
  .testi-text{color:#374151;font-style:italic;line-height:1.7;margin-bottom:16px}
  .testi-name{font-weight:700;color:#1a2744}

  /* FORMS */
  .form-card{background:#fff;border-radius:16px;padding:40px;max-width:520px;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .form-card h2{font-size:1.6rem;font-weight:700;margin-bottom:8px;text-align:center}
  .form-card .sub{text-align:center;color:#64748b;margin-bottom:28px;font-size:.95rem}
  .form-group{margin-bottom:18px}
  .form-group label{display:block;font-weight:600;font-size:.9rem;margin-bottom:6px;color:#1a2744}
  .form-group input,.form-group select,.form-group textarea{width:100%;padding:11px 14px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.95rem;transition:.2s;background:#fafbff}
  .form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:#1a5bb8;background:#fff}
  .form-group textarea{resize:vertical;min-height:100px}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .form-submit{width:100%;padding:13px;background:#1a5bb8;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer;transition:.2s;margin-top:8px}
  .form-submit:hover{background:#154fa0}
  .form-footer{text-align:center;margin-top:20px;font-size:.9rem;color:#64748b}
  .alert{padding:12px 16px;border-radius:8px;margin-bottom:18px;font-size:.9rem}
  .alert-success{background:#dcfce7;color:#16a34a;border:1px solid #bbf7d0}
  .alert-error{background:#fee2e2;color:#dc2626;border:1px solid #fecaca}
  .alert-info{background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe}

  /* COURSE SEARCH */
  .search-bar{background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,.06);margin-bottom:32px}
  .search-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;align-items:end}
  .search-grid .btn{padding:11px 24px;font-size:.95rem}
  .results-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
  .results-count{font-size:.95rem;color:#64748b}
  .course-card{background:#fff;border-radius:10px;padding:22px;box-shadow:0 2px 8px rgba(0,0,0,.05);margin-bottom:16px;border:1px solid #e8f0fe;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}
  .course-info h3{font-size:1.05rem;font-weight:700;color:#1a2744;margin-bottom:6px}
  .course-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:.8rem;font-weight:600}
  .badge-blue{background:#dbeafe;color:#1d4ed8}
  .badge-green{background:#dcfce7;color:#166534}
  .badge-gray{background:#f3f4f6;color:#374151}
  .course-actions{display:flex;flex-direction:column;gap:8px;min-width:160px}
  .btn-sm{padding:8px 16px;font-size:.85rem;border-radius:6px}

  /* DASHBOARD */
  .dash-grid{display:grid;grid-template-columns:240px 1fr;gap:28px;align-items:start}
  .dash-sidebar{background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
  .dash-user{text-align:center;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #e8f0fe}
  .dash-avatar{width:64px;height:64px;background:#1a5bb8;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.6rem;font-weight:700;margin:0 auto 12px}
  .dash-nav{list-style:none}
  .dash-nav li{margin-bottom:4px}
  .dash-nav a{display:block;padding:10px 14px;border-radius:8px;font-size:.95rem;color:#374151;font-weight:500;transition:.15s}
  .dash-nav a:hover,.dash-nav a.active{background:#dbeafe;color:#1a5bb8;text-decoration:none}
  .dash-main{display:flex;flex-direction:column;gap:24px}
  .dash-card{background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
  .dash-card h3{font-size:1.1rem;font-weight:700;margin-bottom:18px;color:#1a2744;padding-bottom:12px;border-bottom:1px solid #e8f0fe}
  .inquiry-row{padding:14px 0;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
  .inquiry-row:last-child{border-bottom:none}
  .inquiry-info{font-size:.9rem;color:#374151}
  .inquiry-date{font-size:.8rem;color:#94a3b8}

  /* FOOTER */
  footer{background:#1a2744;color:#cbd5e1;padding:48px 24px 24px}
  .footer-inner{max-width:1200px;margin:0 auto}
  .footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;margin-bottom:40px}
  .footer-col h4{color:#fff;font-weight:700;margin-bottom:16px}
  .footer-col ul{list-style:none}
  .footer-col ul li{margin-bottom:8px}
  .footer-col ul li a{color:#94a3b8;font-size:.9rem}
  .footer-col ul li a:hover{color:#fff;text-decoration:none}
  .footer-contact{font-size:.9rem;line-height:1.8;color:#94a3b8}
  .footer-bottom{border-top:1px solid #2d3d5a;padding-top:20px;text-align:center;font-size:.85rem;color:#64748b}

  /* KONPARE WIDGET */
  .widget-wrap{background:#fff;border-radius:12px;padding:12px;box-shadow:0 2px 12px rgba(0,0,0,.08);overflow:hidden}
  .widget-wrap iframe{width:100%;border:none;min-height:560px;display:block}

  @media(max-width:768px){
    .hero h1{font-size:1.9rem}
    .nav-links{display:none}
    .dash-grid{grid-template-columns:1fr}
    .form-row{grid-template-columns:1fr}
    .course-card{flex-direction:column}
    .course-actions{flex-direction:row;min-width:auto}
  }
`;

function layout(title, body, user = null, extraHead = '') {
  const navUser = user
    ? `<div class="nav-user"><span>Hi, <strong>${esc(user.full_name.split(' ')[0])}</strong></span><a href="/dashboard" class="btn btn-primary btn-sm" style="padding:7px 16px;font-size:.85rem">Dashboard</a><a href="/logout" style="font-size:.85rem;color:#64748b">Logout</a></div>`
    : `<div class="nav-user"><a href="/login">Login</a><a href="/register" class="btn btn-primary btn-sm" style="padding:7px 16px;font-size:.85rem">Register</a></div>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — Careers Gateway Australia</title>
<style>${CSS}</style>
${extraHead}
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">🎓 Careers <span>Gateway</span></a>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/courses">Find Courses</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/health-insurance">Health Insurance</a></li>
      <li><a href="/contact">Contact</a></li>
      <li><a href="/courses" class="nav-cta">Search CRICOS</a></li>
    </ul>
    ${navUser}
  </div>
</nav>
${body}
<footer>
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-col">
        <h4>🎓 Careers Gateway</h4>
        <p class="footer-contact">Your trusted partner for education, migration, and career services in Australia.<br><br>
        📍 Sydney, NSW<br>📞 +61 2 XXXX XXXX<br>✉️ info@careersgateway.com.au</p>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul>
          <li><a href="/services/education">Education & Visa</a></li>
          <li><a href="/services/migration">Migration Services</a></li>
          <li><a href="/services/recruitment">Recruitment & Labour Hire</a></li>
          <li><a href="/services/rpl">RPL Assessment</a></li>
          <li><a href="/services/skills">Skills Assessment</a></li>
          <li><a href="/health-insurance">OSHC/OVHC Insurance</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/courses">CRICOS Course Search</a></li>
          <li><a href="/register">Create Account</a></li>
          <li><a href="/contact">Book Consultation</a></li>
          <li><a href="https://careersgateway.com.au">Main Website</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      © ${new Date().getFullYear()} Careers Gateway Australia. All rights reserved. |
      <a href="https://careersgateway.com.au" style="color:#94a3b8">careersgateway.com.au</a>
    </div>
  </div>
</footer>
</body></html>`;
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function homePage(user) {
  return layout('Your Gateway to Success', `
  <div class="hero">
    <div class="container">
      <h1>Your Gateway to Success<br>in Australia 🇦🇺</h1>
      <p>Guiding individuals and businesses through education, migration, and career pathways with certified, multilingual professionals.</p>
      <div class="hero-btns">
        <a href="/courses" class="btn btn-white">🔍 Search CRICOS Courses</a>
        <a href="/contact" class="btn btn-outline">Book Free Consultation</a>
      </div>
    </div>
  </div>

  <div class="stats-bar">
    <div class="stats-inner">
      <div><div class="stat-num">5,000+</div><div class="stat-label">Clients Helped</div></div>
      <div><div class="stat-num">98%</div><div class="stat-label">Success Rate</div></div>
      <div><div class="stat-num">15+</div><div class="stat-label">Years Experience</div></div>
      <div><div class="stat-num">50+</div><div class="stat-label">Partner Institutions</div></div>
    </div>
  </div>

  <section style="background:#fff">
    <div class="container">
      <h2 class="section-title">Our Services</h2>
      <p class="section-sub">Comprehensive support for every stage of your Australian journey</p>
      <div class="services-grid">
        ${[
          ['🎓','Education & Visa Services','Expert guidance on student visas, course selection, and institution enrolment through CRICOS-registered providers.','/services/education'],
          ['🌏','Migration Services','Skilled migration, family visas, employer nominations, and permanent residency pathways.','/services/migration'],
          ['💼','Recruitment & Labour Hire','Connecting skilled professionals with Australian employers. RPL-recognised workforce solutions.','/services/recruitment'],
          ['📋','RPL Assessment','Recognition of Prior Learning for tradespeople, nurses, engineers, and other professionals.','/services/rpl'],
          ['✅','Skills Assessment','Formal skills assessments for visa and registration purposes across multiple industry bodies.','/services/skills'],
          ['🏥','Health Insurance (OSHC/OVHC)','Compare and buy Overseas Student Health Cover and Overseas Visitor Health Cover instantly.','/health-insurance'],
          ['💰','Easy Tax Return','Simple, fast Australian tax returns for international students and working holiday visa holders.','/services/tax'],
          ['❤️','Aged Care Services','Placement and support services for aged care pathways and qualifications.','/services/aged-care'],
        ].map(([icon,title,desc,link]) => `
          <div class="service-card">
            <div class="service-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${desc}</p>
            <a href="${link}" class="service-link">Learn more →</a>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section style="background:#f0f6ff">
    <div class="container">
      <h2 class="section-title">Find Your Course</h2>
      <p class="section-sub">Search thousands of CRICOS-registered courses from Australian institutions</p>
      <form action="/courses" method="GET" style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.06);max-width:800px;margin:0 auto">
        <div class="search-grid">
          <div class="form-group" style="margin:0">
            <label>Course Name</label>
            <input type="text" name="courseName" placeholder="e.g. Bachelor of Nursing">
          </div>
          <div class="form-group" style="margin:0">
            <label>State</label>
            <select name="state">
              <option value="">All States</option>
              <option>NSW</option><option>VIC</option><option>QLD</option>
              <option>WA</option><option>SA</option><option>TAS</option>
              <option>ACT</option><option>NT</option>
            </select>
          </div>
          <div class="form-group" style="margin:0">
            <label>Course Level</label>
            <select name="courseLevel">
              <option value="">All Levels</option>
              <option value="1">Bachelor Degree</option>
              <option value="2">Master Degree</option>
              <option value="3">Doctoral Degree</option>
              <option value="4">Diploma</option>
              <option value="5">Certificate</option>
            </select>
          </div>
          <div style="display:flex;align-items:flex-end">
            <button type="submit" class="btn btn-primary" style="width:100%;padding:11px">🔍 Search</button>
          </div>
        </div>
      </form>
    </div>
  </section>

  <section>
    <div class="container">
      <h2 class="section-title">Why Choose Us?</h2>
      <p class="section-sub">Five reasons thousands trust Careers Gateway</p>
      <div class="why-grid">
        ${[
          ['🏅','MARA Registered Agents','All migration advice from registered MARA agents — fully compliant and trustworthy.'],
          ['🌐','Multilingual Support','We speak your language. Services available in English, Hindi, Nepali, and more.'],
          ['🔄','End-to-End Service','From course selection to visa lodgement to arrival — one team, the whole journey.'],
          ['📊','Proven Track Record','98% success rate across thousands of student and migration visa applications.'],
          ['💡','Transparent Pricing','No hidden fees. Clear, upfront pricing with written agreements for all services.'],
        ].map(([icon,title,desc]) => `
          <div class="why-card">
            <h4>${icon} ${title}</h4>
            <p>${desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section style="background:#fff">
    <div class="container">
      <h2 class="section-title">What Our Clients Say</h2>
      <p class="section-sub">Real stories from real people</p>
      <div class="testi-grid">
        ${[
          ['Priya S.','Sydney','Careers Gateway made my student visa process so easy. They found me the perfect nursing course and handled everything. Couldn\'t recommend them more highly!'],
          ['Raj M.','Melbourne','From RPL assessment to skills recognition — the team was professional and quick. I got my qualification recognised within 3 months.'],
          ['Anita K.','Brisbane','The migration team helped my whole family get permanent residency. They were patient, thorough, and available whenever we needed them.'],
        ].map(([name,city,text]) => `
          <div class="testi-card">
            <div class="stars">★★★★★</div>
            <p class="testi-text">"${text}"</p>
            <div class="testi-name">${name} <span style="color:#94a3b8;font-weight:400">— ${city}</span></div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section style="background:linear-gradient(135deg,#1a2744,#1a5bb8);color:#fff;text-align:center">
    <div class="container">
      <h2 style="font-size:2rem;font-weight:800;margin-bottom:12px">Ready to Start Your Journey?</h2>
      <p style="opacity:.9;margin-bottom:32px;font-size:1.1rem">Book a free consultation with our experts today</p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <a href="/register" class="btn btn-white">Create Free Account</a>
        <a href="/contact" class="btn btn-outline">Book Consultation</a>
      </div>
    </div>
  </section>
  `, user);
}

function coursesPage(user, results, params, fromCache, error) {
  const hasSearch = Object.values(params).some(v => v);
  const stateOptions = ['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'];
  const levelOptions = [['1','Bachelor Degree'],['2','Master Degree'],['3','Doctoral Degree'],['4','Diploma'],['5','Certificate'],['6','Advanced Diploma'],['7','Graduate Certificate'],['8','Graduate Diploma']];

  return layout('CRICOS Course Search', `
  <section style="background:linear-gradient(135deg,#1a2744,#1a5bb8);padding:40px 24px;color:#fff;text-align:center">
    <div class="container">
      <h1 style="font-size:2rem;font-weight:800;margin-bottom:8px">🔍 CRICOS Course Search</h1>
      <p style="opacity:.9">Search thousands of courses from CRICOS-registered Australian institutions</p>
    </div>
  </section>
  <section>
    <div class="container">
      <form action="/courses" method="GET" class="search-bar">
        <div class="search-grid">
          <div class="form-group" style="margin:0">
            <label>Course Name</label>
            <input type="text" name="courseName" placeholder="e.g. Bachelor of Nursing" value="${esc(params.courseName||'')}">
          </div>
          <div class="form-group" style="margin:0">
            <label>CRICOS Code</label>
            <input type="text" name="cricosCode" placeholder="e.g. 093765C" value="${esc(params.cricosCode||'')}">
          </div>
          <div class="form-group" style="margin:0">
            <label>State</label>
            <select name="state">
              <option value="">All States</option>
              ${stateOptions.map(s => `<option value="${s}"${params.state===s?' selected':''}>${s}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin:0">
            <label>Course Level</label>
            <select name="courseLevel">
              <option value="">All Levels</option>
              ${levelOptions.map(([v,l]) => `<option value="${v}"${params.courseLevel===v?' selected':''}>${l}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;align-items:flex-end;gap:8px">
            <button type="submit" class="btn btn-primary" style="flex:1;padding:11px">🔍 Search</button>
            <a href="/courses" class="btn" style="padding:11px 14px;background:#f1f5f9;color:#374151">Clear</a>
          </div>
        </div>
      </form>

      ${!hasSearch ? `
        <div style="text-align:center;padding:60px 20px;color:#64748b">
          <div style="font-size:3rem;margin-bottom:16px">🎓</div>
          <h3 style="font-size:1.3rem;margin-bottom:8px;color:#1a2744">Search CRICOS-Registered Courses</h3>
          <p>Enter a course name, state, or level above to find courses from Australian institutions</p>
        </div>
      ` : error ? `
        <div class="alert alert-error">Unable to fetch CRICOS data right now. Please try again shortly.</div>
      ` : results.length === 0 ? `
        <div style="text-align:center;padding:60px 20px;color:#64748b">
          <div style="font-size:3rem;margin-bottom:16px">🔎</div>
          <h3 style="font-size:1.3rem;margin-bottom:8px;color:#1a2744">No courses found</h3>
          <p>Try broadening your search — use fewer keywords or remove filters</p>
        </div>
      ` : `
        <div class="results-header">
          <div class="results-count"><strong>${results.length}</strong> courses found ${fromCache ? '<span style="color:#94a3b8;font-size:.8rem">(cached)</span>' : ''}</div>
          ${user ? '' : '<a href="/register" class="btn btn-primary btn-sm">Save courses — Register free</a>'}
        </div>
        ${results.map(c => `
          <div class="course-card">
            <div class="course-info">
              <h3>${esc(c.courseName || 'Course')}</h3>
              <div style="color:#64748b;font-size:.9rem;margin-bottom:6px">${esc(c.provider || '')}</div>
              <div class="course-meta">
                ${c.cricosCode ? `<span class="badge badge-blue">CRICOS: ${esc(c.cricosCode)}</span>` : ''}
                ${c.state ? `<span class="badge badge-gray">📍 ${esc(c.state)}</span>` : ''}
                ${c.duration ? `<span class="badge badge-gray">⏱ ${esc(c.duration)}</span>` : ''}
                ${c.fee ? `<span class="badge badge-green">💰 ${esc(c.fee)}</span>` : ''}
              </div>
            </div>
            <div class="course-actions">
              <a href="/contact?course=${encodeURIComponent(c.courseName||'')}&code=${encodeURIComponent(c.cricosCode||'')}&provider=${encodeURIComponent(c.provider||'')}" class="btn btn-primary btn-sm">Book Consultation</a>
              ${user ? `<a href="/dashboard/save?code=${encodeURIComponent(c.cricosCode||'')}&name=${encodeURIComponent(c.courseName||'')}&provider=${encodeURIComponent(c.provider||'')}" class="btn btn-sm" style="background:#f0f6ff;color:#1a5bb8;text-align:center">💾 Save Course</a>` : ''}
            </div>
          </div>
        `).join('')}
      `}

      <div style="margin-top:32px;padding:20px;background:#f0f6ff;border-radius:10px;text-align:center">
        <p style="color:#1a2744;font-weight:600;margin-bottom:8px">Need help choosing the right course?</p>
        <p style="color:#64748b;font-size:.9rem;margin-bottom:14px">Our education advisors speak your language and know the Australian system inside out</p>
        <a href="/contact" class="btn btn-primary">Book Free Consultation</a>
      </div>
    </div>
  </section>
  `, user);
}

function registerPage(error, values = {}) {
  return layout('Create Account', `
  <section style="padding:60px 24px;background:#f0f6ff;min-height:80vh">
    <div class="form-card">
      <h2>Create Your Account</h2>
      <p class="sub">Track courses, save inquiries, and get personalised support</p>
      ${error ? `<div class="alert alert-error">${esc(error)}</div>` : ''}
      <form method="POST" action="/register">
        <div class="form-row">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" name="full_name" required placeholder="Your full name" value="${esc(values.full_name||'')}">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" placeholder="+61 4XX XXX XXX" value="${esc(values.phone||'')}">
          </div>
        </div>
        <div class="form-group">
          <label>Email Address *</label>
          <input type="email" name="email" required placeholder="you@example.com" value="${esc(values.email||'')}">
        </div>
        <div class="form-group">
          <label>Password *</label>
          <input type="password" name="password" required placeholder="Minimum 8 characters" minlength="8">
        </div>
        <div class="form-group">
          <label>Confirm Password *</label>
          <input type="password" name="confirm_password" required placeholder="Repeat your password">
        </div>
        <button type="submit" class="form-submit">Create Account</button>
      </form>
      <div class="form-footer">Already have an account? <a href="/login">Login here</a></div>
    </div>
  </section>
  `);
}

function loginPage(error, redirect = '') {
  return layout('Login', `
  <section style="padding:60px 24px;background:#f0f6ff;min-height:80vh">
    <div class="form-card">
      <h2>Welcome Back</h2>
      <p class="sub">Login to your Careers Gateway account</p>
      ${error ? `<div class="alert alert-error">${esc(error)}</div>` : ''}
      <form method="POST" action="/login">
        <input type="hidden" name="redirect" value="${esc(redirect)}">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" required placeholder="you@example.com" autofocus>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" required placeholder="Your password">
        </div>
        <button type="submit" class="form-submit">Login</button>
      </form>
      <div class="form-footer">Don't have an account? <a href="/register">Register free</a></div>
    </div>
  </section>
  `);
}

function dashboardPage(user, inquiries) {
  const initials = user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  return layout('Dashboard', `
  <section style="padding:40px 24px">
    <div class="container">
      <div class="dash-grid">
        <div class="dash-sidebar">
          <div class="dash-user">
            <div class="dash-avatar">${esc(initials)}</div>
            <div style="font-weight:700;color:#1a2744">${esc(user.full_name)}</div>
            <div style="font-size:.85rem;color:#94a3b8;margin-top:4px">${esc(user.email)}</div>
          </div>
          <ul class="dash-nav">
            <li><a href="/dashboard" class="active">📊 Overview</a></li>
            <li><a href="/courses">🔍 Search Courses</a></li>
            <li><a href="/contact">📝 New Inquiry</a></li>
            <li><a href="/health-insurance">🏥 Health Insurance</a></li>
            <li><a href="/dashboard/profile">👤 My Profile</a></li>
            <li><a href="/logout" style="color:#dc2626">🚪 Logout</a></li>
          </ul>
        </div>
        <div class="dash-main">
          <div class="dash-card">
            <h3>Welcome back, ${esc(user.full_name.split(' ')[0])}! 👋</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px">
              <div style="background:#f0f6ff;border-radius:8px;padding:16px;text-align:center">
                <div style="font-size:1.8rem;font-weight:700;color:#1a5bb8">${inquiries.length}</div>
                <div style="font-size:.85rem;color:#64748b;margin-top:4px">Inquiries</div>
              </div>
              <div style="background:#f0fdf4;border-radius:8px;padding:16px;text-align:center">
                <div style="font-size:1.8rem;font-weight:700;color:#16a34a">${inquiries.filter(i=>i.kondesk_sent).length}</div>
                <div style="font-size:.85rem;color:#64748b;margin-top:4px">Processed</div>
              </div>
            </div>
          </div>
          <div class="dash-card">
            <h3>My Inquiries</h3>
            ${inquiries.length === 0 ? `
              <div style="text-align:center;padding:30px 0;color:#94a3b8">
                <div style="font-size:2rem;margin-bottom:10px">📋</div>
                <p>No inquiries yet. <a href="/contact">Book a consultation</a> or <a href="/courses">search courses</a>.</p>
              </div>
            ` : inquiries.map(i => `
              <div class="inquiry-row">
                <div>
                  <div class="inquiry-info"><strong>${esc(i.service||'General Inquiry')}</strong>${i.cricos_course_name ? ` — ${esc(i.cricos_course_name)}` : ''}</div>
                  ${i.cricos_provider ? `<div style="font-size:.85rem;color:#64748b">${esc(i.cricos_provider)}</div>` : ''}
                  <div class="inquiry-date">${new Date(i.created_at).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}</div>
                </div>
                <span class="badge ${i.kondesk_sent ? 'badge-green' : 'badge-gray'}">${i.kondesk_sent ? '✓ Processing' : 'Received'}</span>
              </div>
            `).join('')}
          </div>
          <div class="dash-card">
            <h3>Quick Actions</h3>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <a href="/courses" class="btn btn-primary btn-sm">🔍 Find Courses</a>
              <a href="/contact" class="btn btn-sm" style="background:#f0f6ff;color:#1a5bb8">📝 Book Consultation</a>
              <a href="/health-insurance" class="btn btn-sm" style="background:#f0fdf4;color:#16a34a">🏥 OSHC Insurance</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `, user);
}

function contactPage(user, params = {}, success = false, error = '') {
  const services = ['Education & Visa Services','Migration Services','Recruitment & Labour Hire','RPL Assessment','Skills Assessment','Health Insurance (OSHC/OVHC)','Easy Tax Return','Aged Care Services','Course Inquiry','General Inquiry'];
  return layout('Contact & Book Consultation', `
  <section style="background:linear-gradient(135deg,#1a2744,#1a5bb8);padding:40px 24px;color:#fff;text-align:center">
    <div class="container">
      <h1 style="font-size:2rem;font-weight:800;margin-bottom:8px">Book a Free Consultation</h1>
      <p style="opacity:.9">Our team will get back to you within 24 hours</p>
    </div>
  </section>
  <section style="padding:48px 24px">
    <div class="container" style="max-width:900px">
      <div style="display:grid;grid-template-columns:1fr 340px;gap:32px;align-items:start" class="contact-layout">
        <div class="form-card" style="max-width:none">
          <h2 style="text-align:left">Send Us a Message</h2>
          <p class="sub" style="text-align:left">Fill in your details and we'll be in touch soon</p>
          ${success ? '<div class="alert alert-success">✅ Your inquiry has been submitted! Our team will contact you within 24 hours.</div>' : ''}
          ${error ? `<div class="alert alert-error">${esc(error)}</div>` : ''}
          ${params.course ? `<div class="alert alert-info">🎓 <strong>${esc(params.course)}</strong>${params.code ? ` (CRICOS: ${esc(params.code)})` : ''} — ${esc(params.provider||'')}</div>` : ''}
          <form method="POST" action="/contact">
            <input type="hidden" name="cricos_course" value="${esc(params.course||'')}">
            <input type="hidden" name="cricos_code" value="${esc(params.code||'')}">
            <input type="hidden" name="cricos_provider" value="${esc(params.provider||'')}">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" name="full_name" required placeholder="Your full name" value="${esc(user?.full_name||'')}">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" placeholder="+61 4XX XXX XXX" value="${esc(user?.phone||'')}">
              </div>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" name="email" required placeholder="you@example.com" value="${esc(user?.email||'')}">
            </div>
            <div class="form-group">
              <label>Service Interested In</label>
              <select name="service">
                ${services.map(s => `<option value="${s}"${(params.course && s==='Course Inquiry')||(!params.course && s==='General Inquiry')?' selected':''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea name="message" placeholder="Tell us about your situation and what you're looking to achieve in Australia..."></textarea>
            </div>
            <button type="submit" class="form-submit">Send Inquiry →</button>
          </form>
        </div>
        <div>
          <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.05);margin-bottom:20px">
            <h4 style="font-weight:700;margin-bottom:16px;color:#1a2744">📞 Contact Details</h4>
            <div style="font-size:.9rem;line-height:2;color:#374151">
              <div>📍 Sydney, NSW, Australia</div>
              <div>📞 <a href="tel:+61200000000">+61 2 XXXX XXXX</a></div>
              <div>✉️ <a href="mailto:info@careersgateway.com.au">info@careersgateway.com.au</a></div>
              <div>🕐 Mon–Fri: 9am–6pm AEST</div>
            </div>
          </div>
          <div style="background:#f0f6ff;border-radius:12px;padding:20px">
            <h4 style="font-weight:700;margin-bottom:10px;color:#1a2744">✅ What Happens Next</h4>
            <ol style="padding-left:18px;font-size:.9rem;color:#374151;line-height:2">
              <li>We receive your inquiry</li>
              <li>A specialist is assigned</li>
              <li>You're contacted within 24h</li>
              <li>Free initial consultation</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
  <style>.contact-layout{grid-template-columns:1fr 340px}@media(max-width:768px){.contact-layout{grid-template-columns:1fr}}</style>
  `, user);
}

function healthInsurancePage(user, konpareKey) {
  return layout('Health Insurance — OSHC & OVHC', `
  <section style="background:linear-gradient(135deg,#064e3b,#059669);padding:48px 24px;color:#fff;text-align:center">
    <div class="container">
      <h1 style="font-size:2rem;font-weight:800;margin-bottom:8px">🏥 Health Insurance for Students & Visitors</h1>
      <p style="opacity:.9">Compare and buy OSHC & OVHC policies instantly through our Konpare-powered portal</p>
    </div>
  </section>
  <section>
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:40px">
        ${[
          ['🏥','OSHC','Overseas Student Health Cover','Required for all international student visa holders in Australia'],
          ['🌏','OVHC','Overseas Visitors Health Cover','For visitors, working holiday makers, and sponsored workers'],
          ['💊','Cover Includes','Hospital, GP, Prescriptions','Plus emergency ambulance in most policies'],
          ['⚡','Instant','Online Purchase','Get your certificate of insurance immediately'],
        ].map(([icon,short,title,desc]) => `
          <div style="background:#fff;border-radius:10px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.05);border-top:3px solid #059669">
            <div style="font-size:1.5rem;margin-bottom:8px">${icon}</div>
            <div style="font-size:.75rem;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.5px">${short}</div>
            <h4 style="font-weight:700;margin:6px 0;color:#1a2744">${title}</h4>
            <p style="font-size:.85rem;color:#64748b">${desc}</p>
          </div>
        `).join('')}
      </div>

      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:20px;color:#1a2744">Compare & Buy Now</h2>
      <div class="widget-wrap">
        <iframe
          src="https://app.konpare.online/widget/?key=${esc(konpareKey)}"
          title="OSHC OVHC Health Insurance Comparison"
          allow="payment"
          loading="lazy">
        </iframe>
      </div>

      <div style="margin-top:24px;padding:20px;background:#f0fdf4;border-radius:10px;text-align:center">
        <p style="color:#166534;font-size:.9rem">🔒 Secure payments powered by Konpare. Policies from all major Australian health insurers.</p>
      </div>
    </div>
  </section>
  `, user);
}

function servicesPage(user, service) {
  const pages = {
    education: { title: 'Education & Visa Services', icon: '🎓', desc: 'We help international students find and enrol in CRICOS-registered courses at Australian universities, TAFE colleges, and private providers. Our education counsellors assess your academic background, career goals, and visa eligibility to recommend the best pathway for you.', items: ['CRICOS course selection and application','Student visa (subclass 500) lodgement','Enrolment support and CoE assistance','Pre-departure briefings','Airport pickup and arrival support'] },
    migration: { title: 'Migration Services', icon: '🌏', desc: 'Our MARA-registered migration agents provide expert advice on all Australian visa subclasses. From skilled migration to family reunification, we handle your case end-to-end.', items: ['Skilled Independent (189, 190, 491)','Employer Nomination Scheme (186, 187)','Family visas (309, 100, 820, 801)','Partner and spouse visas','Bridging and tourist visas'] },
    recruitment: { title: 'Recruitment & Labour Hire', icon: '💼', desc: 'We connect skilled professionals with Australian employers across healthcare, construction, IT, and hospitality sectors.', items: ['Job placement for skilled migrants','Labour hire for construction and agriculture','Healthcare and nursing recruitment','Resume and interview preparation','Work rights advice'] },
    rpl: { title: 'RPL Assessment', icon: '📋', desc: 'Recognition of Prior Learning (RPL) lets you convert your overseas work experience into Australian qualifications without re-studying.', items: ['Trade qualifications (Certificate III/IV)','Healthcare and nursing qualifications','Engineering and IT assessments','Portfolio preparation support','Fast-track pathways available'] },
    skills: { title: 'Skills Assessment', icon: '✅', desc: 'Formal skills assessments required for skilled migration visas, assessed by bodies such as Engineers Australia, TRA, VETASSESS, ANMAC, and more.', items: ['Engineers Australia','Trades Recognition Australia (TRA)','VETASSESS (professional occupations)','ANMAC (nursing and midwifery)','AIM, CPAA, CPA Australia'] },
    tax: { title: 'Easy Tax Return', icon: '💰', desc: 'Quick, affordable Australian tax returns for international students and working holiday visa holders.', items: ['Tax file number (TFN) applications','Annual tax return lodgement','Working holiday tax refunds','HECS/HELP debt queries','Superannuation withdrawals on departure'] },
    'aged-care': { title: 'Aged Care Services', icon: '❤️', desc: 'Pathways into Australia\'s growing aged care sector, including qualification recognition and job placement.', items: ['Certificate III in Individual Support','AHPRA registration assistance','Job placement in aged care facilities','Visa pathways for aged care workers','Ongoing compliance support'] },
  };
  const page = pages[service];
  if (!page) return null;
  return layout(page.title, `
  <section style="background:linear-gradient(135deg,#1a2744,#1a5bb8);padding:48px 24px;color:#fff;text-align:center">
    <div class="container">
      <div style="font-size:3rem;margin-bottom:12px">${page.icon}</div>
      <h1 style="font-size:2rem;font-weight:800;margin-bottom:8px">${page.title}</h1>
    </div>
  </section>
  <section>
    <div class="container" style="max-width:900px">
      <div style="display:grid;grid-template-columns:1fr 320px;gap:32px;align-items:start">
        <div>
          <p style="font-size:1.05rem;color:#374151;line-height:1.8;margin-bottom:28px">${page.desc}</p>
          <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:16px;color:#1a2744">What's Included</h3>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
            ${page.items.map(item => `<li style="display:flex;align-items:flex-start;gap:10px;font-size:.95rem;color:#374151"><span style="color:#1a5bb8;font-weight:700;margin-top:1px">✓</span>${item}</li>`).join('')}
          </ul>
        </div>
        <div>
          <div class="form-card" style="max-width:none;padding:28px">
            <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;text-align:center">Get Started Today</h3>
            <p style="font-size:.9rem;color:#64748b;text-align:center;margin-bottom:20px">Book a free initial consultation with one of our ${page.title} specialists</p>
            <a href="/contact?service=${encodeURIComponent(page.title)}" class="btn btn-primary" style="display:block;text-align:center;padding:13px">Book Free Consultation</a>
            <div style="text-align:center;margin-top:16px;font-size:.85rem;color:#94a3b8">No obligation · Response within 24h</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `, user);
}

export { layout, esc, homePage, coursesPage, registerPage, loginPage, dashboardPage, contactPage, healthInsurancePage, servicesPage };
