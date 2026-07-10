import { POINTS_TABLE, calcPoints, VAC_FEES, PROCESSING_TIMES, STATE_CRITERIA, ENGLISH_REQUIREMENTS, STUDENT_FUND, OCCUPATIONS, TIMELINE_STAGES } from './visa-data.js';
import { esc } from './templates.js';

const BASE_CSS = `
  .vt-card{background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 8px rgba(0,0,0,.05);margin-bottom:24px}
  .vt-card h3{font-size:1.1rem;font-weight:700;color:#1a2744;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #e8f0fe}
  .vt-section-title{font-size:1.6rem;font-weight:800;color:#1a2744;margin-bottom:6px}
  .vt-section-sub{color:#64748b;margin-bottom:28px}
  .pts-total{background:linear-gradient(135deg,#1a2744,#1a5bb8);color:#fff;border-radius:16px;padding:28px;text-align:center;margin-bottom:24px}
  .pts-num{font-size:4rem;font-weight:900;line-height:1}
  .pts-label{font-size:1rem;opacity:.85;margin-top:6px}
  .pts-bar{height:8px;background:#e8f0fe;border-radius:4px;overflow:hidden;margin:6px 0 4px}
  .pts-fill{height:100%;background:linear-gradient(90deg,#1a5bb8,#38bdf8);border-radius:4px;transition:.4s}
  .breakdown-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:.9rem}
  .breakdown-row:last-child{border-bottom:none}
  .breakdown-pts{font-weight:700;color:#1a5bb8}

  .timeline-wrap{position:relative;padding-left:44px}
  .timeline-wrap::before{content:'';position:absolute;left:18px;top:0;bottom:0;width:2px;background:#e8f0fe}
  .tl-stage{position:relative;margin-bottom:24px}
  .tl-dot{position:absolute;left:-44px;top:2px;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;z-index:1}
  .tl-dot-done{background:#1a5bb8;color:#fff}
  .tl-dot-active{background:#f59e0b;color:#fff;box-shadow:0 0 0 4px rgba(245,158,11,.2)}
  .tl-dot-pending{background:#f1f5f9;color:#94a3b8;border:2px solid #d1d9e8}
  .tl-content{background:#fff;border-radius:10px;padding:16px;border:1px solid #e8f0fe}
  .tl-content.done{border-color:#dbeafe;background:#f0f6ff}
  .tl-content.active{border-color:#f59e0b;background:#fffbeb}
  .tl-label{font-weight:700;color:#1a2744;font-size:.95rem}
  .tl-date{font-size:.85rem;color:#1a5bb8;font-weight:600;margin-top:2px}
  .tl-desc{font-size:.85rem;color:#64748b;margin-top:4px}

  .doc-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f1f5f9;gap:12px;flex-wrap:wrap}
  .doc-row:last-child{border-bottom:none}
  .doc-label{font-weight:600;font-size:.9rem;color:#1a2744}
  .doc-expiry{font-size:.85rem;color:#64748b}
  .expiry-ok{color:#16a34a;font-weight:600}
  .expiry-warn{color:#d97706;font-weight:600}
  .expiry-danger{color:#dc2626;font-weight:600}
  .expiry-expired{color:#dc2626;font-weight:700}

  .fee-total{font-size:1.6rem;font-weight:800;color:#1a5bb8}
  .occ-row{padding:12px 16px;border-radius:8px;background:#fff;border:1px solid #e8f0fe;margin-bottom:8px}
  .occ-title{font-weight:700;font-size:.95rem;color:#1a2744}
  .occ-meta{font-size:.8rem;color:#64748b;margin-top:3px;display:flex;gap:10px;flex-wrap:wrap}
  .list-mltssl{background:#dcfce7;color:#166534;padding:2px 8px;border-radius:10px;font-weight:600;font-size:.75rem}
  .list-stsol{background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:10px;font-weight:600;font-size:.75rem}
  .state-card{background:#fff;border-radius:10px;border:1px solid #e8f0fe;padding:18px;margin-bottom:12px}
  .state-card h4{font-weight:700;color:#1a2744;margin-bottom:8px}
  .proc-row{display:grid;grid-template-columns:1fr 80px 80px 80px 80px;gap:8px;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:.9rem;align-items:center}
  .proc-row:last-child{border-bottom:none}
  .proc-header{font-weight:700;color:#1a2744;font-size:.8rem;text-transform:uppercase;letter-spacing:.5px}
  .p-val{text-align:center;font-weight:600;color:#1a5bb8}
  .eng-table{width:100%;border-collapse:collapse;font-size:.88rem}
  .eng-table th{background:#f0f6ff;color:#1a2744;font-weight:700;padding:10px 12px;text-align:left}
  .eng-table td{padding:10px 12px;border-bottom:1px solid #f1f5f9;vertical-align:top}
  .eng-table tr:last-child td{border-bottom:none}
  .fund-result{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin-top:16px}
  .fund-total{font-size:1.8rem;font-weight:800;color:#16a34a}
  @media(max-width:600px){.proc-row{grid-template-columns:1fr 60px 60px 60px;}.proc-row>*:last-child{display:none}}
`;

function dashWrap(user, activeTab, content) {
  const initials = user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const tabs = [
    { key: 'overview',          href: '/dashboard',                      label: '📊 Overview' },
    { key: 'points',            href: '/dashboard/points',               label: '🔢 Points Calculator' },
    { key: 'timeline',          href: '/dashboard/timeline',             label: '📅 Visa Timeline' },
    { key: 'documents',         href: '/dashboard/documents',            label: '📄 Document Expiry' },
    { key: 'fees',              href: '/dashboard/fees',                 label: '💰 VAC Fee Calculator' },
    { key: 'occupations',       href: '/dashboard/occupations',          label: '🔍 Occupation Search' },
    { key: 'state-criteria',    href: '/dashboard/state-criteria',       label: '🗺️ State Criteria' },
    { key: 'processing-times',  href: '/dashboard/processing-times',     label: '⏱️ Processing Times' },
    { key: 'english',           href: '/dashboard/english',              label: '🗣️ English Requirements' },
    { key: 'student-fund',      href: '/dashboard/student-fund',         label: '🎓 Student Fund Calc' },
    { key: 'courses',           href: '/courses',                        label: '🎓 Search Courses' },
    { key: 'contact',           href: '/contact',                        label: '📝 Book Consultation' },
    { key: 'profile',           href: '/dashboard/profile',              label: '👤 My Profile' },
  ];

  return `
  <style>${BASE_CSS}</style>
  <section style="padding:32px 24px;background:#f8faff;min-height:85vh">
    <div class="container">
      <div style="display:grid;grid-template-columns:240px 1fr;gap:28px;align-items:start" class="dash-grid">
        <div class="dash-sidebar">
          <div class="dash-user">
            <div class="dash-avatar">${esc(initials)}</div>
            <div style="font-weight:700;color:#1a2744;font-size:.95rem">${esc(user.full_name)}</div>
            <div style="font-size:.8rem;color:#94a3b8;margin-top:3px">${esc(user.email)}</div>
          </div>
          <ul class="dash-nav">
            ${tabs.map(t => `<li><a href="${t.href}" class="${activeTab===t.key?'active':''}" style="font-size:.88rem">${t.label}</a></li>`).join('')}
            <li><a href="/logout" style="color:#dc2626;font-size:.88rem">🚪 Logout</a></li>
          </ul>
        </div>
        <div>${content}</div>
      </div>
    </div>
  </section>
  <style>@media(max-width:768px){.dash-grid{grid-template-columns:1fr!important}}</style>`;
}

// ── POINTS CALCULATOR ───────────────────────────────────────────────────────
export function pointsPage(user, profile, flash) {
  const result = profile ? calcPoints(profile) : null;
  const total = result ? result.total : 0;
  const pct = Math.min(100, (total / 100) * 100);
  const statusColor = total >= 90 ? '#16a34a' : total >= 65 ? '#d97706' : '#dc2626';
  const statusLabel = total >= 90 ? '✅ Competitive' : total >= 65 ? '⚠️ Getting there' : '🔴 Below typical threshold';

  const selFor = (name, options, current) =>
    `<select name="${name}" class="form-group-input" style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem;background:#fafbff">
      ${options.map(o => `<option value="${esc(String(o.value||o))}"${String(current)===String(o.value||o)?' selected':''}>${esc(o.label||o)}</option>`).join('')}
    </select>`;

  const fg = (label, name, select) => `
    <div class="form-group">
      <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px;color:#1a2744">${label}</label>
      ${select}
    </div>`;

  const p = profile || {};

  const body = `
    <div class="vt-section-title">🔢 Points Calculator</div>
    <p class="vt-section-sub">Australian skilled migration points test (SC 189 / 190 / 491)</p>

    ${result ? `
    <div class="pts-total">
      <div class="pts-num">${total}</div>
      <div class="pts-label">Total Points</div>
      <div style="margin-top:12px;font-size:1rem;font-weight:700">${statusLabel}</div>
      <div style="margin-top:8px;font-size:.85rem;opacity:.8">Typical invitation threshold: 65–90+ (varies by occupation & round)</div>
    </div>
    <div class="vt-card">
      <h3>Points Breakdown</h3>
      ${result.breakdown.map(b => `
        <div class="breakdown-row">
          <span>${esc(b.label)}</span>
          <span class="breakdown-pts">+${b.points}</span>
        </div>`).join('')}
      <div class="breakdown-row" style="font-weight:700;font-size:1rem;border-top:2px solid #e8f0fe;margin-top:4px;padding-top:12px">
        <span>Total</span><span style="color:#1a5bb8;font-size:1.1rem">+${total}</span>
      </div>
      <div style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:#64748b;margin-bottom:4px"><span>0</span><span>65</span><span>90</span><span>100</span></div>
        <div class="pts-bar"><div class="pts-fill" style="width:${pct}%"></div></div>
      </div>
    </div>` : ''}

    <div class="vt-card">
      <h3>${result ? 'Update Your Points Profile' : 'Enter Your Details'}</h3>
      ${flash ? `<div class="alert alert-success">${esc(flash)}</div>` : ''}
      <form method="POST" action="/dashboard/points">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          ${fg('Age', 'age', `<input type="number" name="age" value="${esc(String(p.age||''))}" min="18" max="70" placeholder="e.g. 28" style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">`)}
          ${fg('English Level', 'english_level', selFor('english_level', POINTS_TABLE.english, p.english_level||''))}
          ${fg('Highest Education', 'education_level', selFor('education_level', POINTS_TABLE.education, p.education_level||''))}
          ${fg('Australian Study', 'aus_study_years', selFor('aus_study_years', POINTS_TABLE.ausStudy, p.aus_study_years||''))}
          ${fg('Overseas Work Experience', 'overseas_work_years', selFor('overseas_work_years', POINTS_TABLE.overseasWork, p.overseas_work_years||''))}
          ${fg('Australian Work Experience', 'aus_work_years', selFor('aus_work_years', POINTS_TABLE.ausWork, p.aus_work_years||''))}
          ${fg('State Nomination', 'state_nomination', selFor('state_nomination',
            [{label:'None',value:''},{label:'State nomination — SC 190 (+5)',value:'190'},{label:'State nomination — SC 491 (+15)',value:'491'}],
            p.state_nomination||''))}
          ${fg('Partner Status', 'partner_skills', selFor('partner_skills',
            [{label:'Partner has skills + competent English (+10)',value:'1'},{label:'Single / partner is AUS citizen or PR (+10)',value:'2'},{label:'Partner (no points)',value:'0'}],
            p.partner_skills||'0'))}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:8px">
          <label style="display:flex;align-items:center;gap:8px;font-size:.88rem;cursor:pointer">
            <input type="checkbox" name="professional_year" value="1" ${p.professional_year==1?'checked':''}> Professional Year (+5)
          </label>
          <label style="display:flex;align-items:center;gap:8px;font-size:.88rem;cursor:pointer">
            <input type="checkbox" name="naati" value="1" ${p.naati==1?'checked':''}> NAATI Credential (+5)
          </label>
          <label style="display:flex;align-items:center;gap:8px;font-size:.88rem;cursor:pointer">
            <input type="checkbox" name="regional_study" value="1" ${p.regional_study==1?'checked':''}> Regional Study (+5)
          </label>
        </div>
        <button type="submit" class="form-submit" style="margin-top:20px">Calculate Points</button>
      </form>
    </div>`;

  return dashWrap(user, 'points', body);
}

// ── VISA TIMELINE ────────────────────────────────────────────────────────────
export function timelinePage(user, stages, flash) {
  const stageMap = {};
  (stages || []).forEach(s => { stageMap[s.stage] = s; });
  const completedCount = TIMELINE_STAGES.filter(s => stageMap[s.key]?.milestone_date).length;
  const activeIdx = TIMELINE_STAGES.findIndex(s => !stageMap[s.key]?.milestone_date);

  const body = `
    <div class="vt-section-title">📅 Visa Case Timeline</div>
    <p class="vt-section-sub">Track your migration journey from skills assessment to visa grant</p>
    ${flash ? `<div class="alert alert-success">${esc(flash)}</div>` : ''}

    <div class="vt-card" style="padding:16px 24px">
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div>
          <div style="font-size:.8rem;color:#64748b">Progress</div>
          <div style="font-weight:700;font-size:1.1rem;color:#1a2744">${completedCount} / ${TIMELINE_STAGES.length} stages</div>
        </div>
        <div style="flex:1;min-width:200px">
          <div class="pts-bar"><div class="pts-fill" style="width:${Math.round((completedCount/TIMELINE_STAGES.length)*100)}%"></div></div>
        </div>
        <div style="font-weight:700;color:#1a5bb8">${Math.round((completedCount/TIMELINE_STAGES.length)*100)}%</div>
      </div>
    </div>

    <form method="POST" action="/dashboard/timeline">
      <div class="timeline-wrap">
        ${TIMELINE_STAGES.map((stage, i) => {
          const saved = stageMap[stage.key];
          const isDone = !!saved?.milestone_date;
          const isActive = !isDone && i === activeIdx;
          const dotClass = isDone ? 'tl-dot-done' : isActive ? 'tl-dot-active' : 'tl-dot-pending';
          const cardClass = isDone ? 'done' : isActive ? 'active' : '';
          return `
            <div class="tl-stage">
              <div class="tl-dot ${dotClass}">${isDone ? '✓' : stage.icon}</div>
              <div class="tl-content ${cardClass}">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
                  <div>
                    <div class="tl-label">${stage.label}</div>
                    <div class="tl-desc">${stage.desc}</div>
                    ${saved?.milestone_date ? `<div class="tl-date">📅 ${new Date(saved.milestone_date).toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}</div>` : ''}
                  </div>
                  <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
                    <input type="date" name="date_${esc(stage.key)}" value="${esc(saved?.milestone_date||'')}"
                      style="padding:6px 10px;border:1.5px solid #d1d9e8;border-radius:6px;font-size:.85rem">
                    ${saved?.notes ? `<span style="font-size:.8rem;color:#64748b;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(saved.notes)}</span>` : ''}
                  </div>
                </div>
                <div style="margin-top:8px">
                  <input type="text" name="notes_${esc(stage.key)}" value="${esc(saved?.notes||'')}"
                    placeholder="Notes (optional)"
                    style="width:100%;padding:6px 10px;border:1.5px solid #d1d9e8;border-radius:6px;font-size:.82rem">
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
      <button type="submit" class="form-submit">Save Timeline</button>
    </form>`;

  return dashWrap(user, 'timeline', body);
}

// ── DOCUMENT EXPIRY ──────────────────────────────────────────────────────────
export function documentsPage(user, docs, flash) {
  const today = new Date();
  const sorted = [...(docs||[])].sort((a,b) => new Date(a.expiry_date) - new Date(b.expiry_date));

  function expiryStatus(dateStr) {
    const d = new Date(dateStr);
    const days = Math.round((d - today) / 86400000);
    if (days < 0) return { cls: 'expiry-expired', label: `Expired ${Math.abs(days)}d ago` };
    if (days <= 30) return { cls: 'expiry-danger', label: `Expires in ${days}d` };
    if (days <= 180) return { cls: 'expiry-warn', label: `Expires in ${days}d` };
    return { cls: 'expiry-ok', label: `${days}d remaining` };
  }

  const presets = ['Passport','Current Visa','English Test (IELTS/PTE)','Skills Assessment','EOI Expiry','Health Insurance (OSHC)','Police Clearance','Medical Certificate','Employer Sponsorship','Other Document'];

  const body = `
    <div class="vt-section-title">📄 Document Expiry Tracker</div>
    <p class="vt-section-sub">Monitor passport, visa, English test, and other critical document expiry dates</p>
    ${flash ? `<div class="alert alert-success">${esc(flash)}</div>` : ''}

    ${sorted.length > 0 ? `
    <div class="vt-card">
      <h3>Your Documents</h3>
      ${sorted.map(d => {
        const { cls, label } = expiryStatus(d.expiry_date);
        return `
        <div class="doc-row">
          <div>
            <div class="doc-label">${esc(d.doc_label)}</div>
            <div class="doc-expiry">${new Date(d.expiry_date).toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <span class="${cls}">${label}</span>
            <form method="POST" action="/dashboard/documents/delete" style="display:inline">
              <input type="hidden" name="id" value="${d.id}">
              <button type="submit" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:.85rem;padding:4px 8px;border-radius:4px;border:1px solid #fecaca">Delete</button>
            </form>
          </div>
        </div>`}).join('')}
    </div>` : ''}

    <div class="vt-card">
      <h3>Add Document</h3>
      <form method="POST" action="/dashboard/documents">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="form-group">
            <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Document Type</label>
            <select name="doc_label" style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
              ${presets.map(p => `<option value="${esc(p)}">${esc(p)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Expiry Date</label>
            <input type="date" name="expiry_date" required style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
          </div>
          <div class="form-group">
            <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Custom Label (optional)</label>
            <input type="text" name="custom_label" placeholder="e.g. Passport — Australian" style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
          </div>
          <div style="display:flex;align-items:flex-end">
            <button type="submit" class="form-submit" style="margin:0">Add Document</button>
          </div>
        </div>
      </form>
    </div>`;

  return dashWrap(user, 'documents', body);
}

// ── VAC FEE CALCULATOR ────────────────────────────────────────────────────────
export function feesPage(user) {
  const body = `
    <div class="vt-section-title">💰 VAC Fee Calculator</div>
    <p class="vt-section-sub">Estimate your Visa Application Charge (as at 2025–26)</p>

    <div class="vt-card">
      <h3>Select Visa & Applicants</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px">
        <div>
          <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Visa Subclass</label>
          <select id="vac-subclass" style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem" onchange="calcVAC()">
            ${VAC_FEES.map(v => `<option value="${v.subclass}" data-p="${v.primary}" data-s="${v.secondary}" data-c="${v.child}" data-note="${esc(v.note||'')}">SC ${v.subclass} — ${v.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Secondary Applicants (partner)</label>
          <input type="number" id="vac-secondary" value="0" min="0" max="5" onchange="calcVAC()" style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Dependent Children</label>
          <input type="number" id="vac-children" value="0" min="0" max="10" onchange="calcVAC()" style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
        </div>
      </div>
      <div id="vac-result" style="background:#f0f6ff;border-radius:10px;padding:20px">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;text-align:center;margin-bottom:16px">
          <div><div style="font-size:.8rem;color:#64748b">Primary</div><div style="font-weight:700;color:#1a2744" id="vac-p-cost">—</div></div>
          <div><div style="font-size:.8rem;color:#64748b">Secondary</div><div style="font-weight:700;color:#1a2744" id="vac-s-cost">—</div></div>
          <div><div style="font-size:.8rem;color:#64748b">Children</div><div style="font-weight:700;color:#1a2744" id="vac-c-cost">—</div></div>
          <div style="border-left:2px solid #d1d9e8"><div style="font-size:.8rem;color:#64748b">Total VAC</div><div class="fee-total" id="vac-total">—</div></div>
        </div>
        <div id="vac-note" style="font-size:.82rem;color:#64748b"></div>
        <div style="font-size:.78rem;color:#94a3b8;margin-top:8px">Figures in AUD. VAC fees are subject to change; verify at homeaffairs.gov.au before lodging.</div>
      </div>
    </div>

    <script>
    function calcVAC(){
      const sel=document.getElementById('vac-subclass');
      const opt=sel.options[sel.selectedIndex];
      const p=parseInt(opt.dataset.p)||0, s=parseInt(opt.dataset.s)||0, c=parseInt(opt.dataset.c)||0;
      const ns=parseInt(document.getElementById('vac-secondary').value)||0;
      const nc=parseInt(document.getElementById('vac-children').value)||0;
      const tot=p+(s*ns)+(c*nc);
      const fmt=n=>n===0?'$0':'$'+n.toLocaleString();
      document.getElementById('vac-p-cost').textContent=fmt(p);
      document.getElementById('vac-s-cost').textContent=ns>0?fmt(s*ns):'$0';
      document.getElementById('vac-c-cost').textContent=nc>0?fmt(c*nc):'$0';
      document.getElementById('vac-total').textContent='$'+tot.toLocaleString();
      document.getElementById('vac-note').textContent=opt.dataset.note||'';
    }
    calcVAC();
    </script>`;

  return dashWrap(user, 'fees', body);
}

// ── OCCUPATION SEARCH ─────────────────────────────────────────────────────────
export function occupationsPage(user, query) {
  const q = (query || '').toLowerCase().trim();
  const results = q ? OCCUPATIONS.filter(o =>
    o.title.toLowerCase().includes(q) ||
    o.anzsco.includes(q) ||
    o.authority.toLowerCase().includes(q)
  ) : OCCUPATIONS.slice(0, 30);

  const body = `
    <div class="vt-section-title">🔍 Occupation Search</div>
    <p class="vt-section-sub">MLTSSL and STSOL occupations with visa eligibility and assessing authority</p>

    <form method="GET" action="/dashboard/occupations" style="margin-bottom:24px">
      <div style="display:flex;gap:10px">
        <input type="text" name="q" value="${esc(query||'')}" placeholder="Search by job title, ANZSCO code, or authority…"
          style="flex:1;padding:11px 14px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.95rem">
        <button type="submit" class="btn btn-primary" style="padding:11px 24px;white-space:nowrap">Search</button>
      </div>
    </form>

    ${results.length === 0 ? `<div class="vt-card" style="text-align:center;color:#64748b;padding:48px">No occupations found for "${esc(q)}"</div>` : `
    <div style="margin-bottom:10px;font-size:.9rem;color:#64748b">${q ? `${results.length} result${results.length!==1?'s':''} for "${esc(q)}"` : `Showing first ${results.length} occupations — search to filter`}</div>
    ${results.map(o => `
      <div class="occ-row">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <div>
            <div class="occ-title">${esc(o.title)}</div>
            <div class="occ-meta">
              <span>ANZSCO: ${esc(o.anzsco)}</span>
              <span class="list-${o.list.toLowerCase()}">${esc(o.list)}</span>
              <span>Authority: ${esc(o.authority)}</span>
            </div>
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;flex-shrink:0">
            ${o.visas.map(v => `<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:10px;font-size:.75rem;font-weight:600">SC ${v}</span>`).join('')}
          </div>
        </div>
      </div>`).join('')}`}

    <div style="margin-top:20px;padding:14px 18px;background:#f0f6ff;border-radius:8px;font-size:.85rem;color:#1a2744">
      💡 <strong>MLTSSL</strong> occupations can be nominated for SC 189 (independent), 190, 491, 482, and 186.
      <strong>STSOL</strong> occupations require state/employer sponsorship (190, 491, 482). Always verify the current list at
      <a href="https://immi.homeaffairs.gov.au" target="_blank">immi.homeaffairs.gov.au</a>.
    </div>`;

  return dashWrap(user, 'occupations', body);
}

// ── STATE NOMINATION CRITERIA ─────────────────────────────────────────────────
export function stateCriteriaPage(user) {
  const body = `
    <div class="vt-section-title">🗺️ State Nomination Criteria</div>
    <p class="vt-section-sub">Minimum points and key requirements for SC 190 and SC 491 by state/territory (2025–26)</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${STATE_CRITERIA.map(s => `
        <div class="state-card">
          <h4>${s.fullName} (${s.state})</h4>
          <div style="margin-bottom:10px">
            <div style="font-size:.8rem;font-weight:700;color:#1a5bb8;margin-bottom:4px">SC 190 — Skilled Nominated</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="background:#dbeafe;color:#1d4ed8;padding:3px 10px;border-radius:12px;font-size:.85rem;font-weight:700">${s.sc190.minPoints ? s.sc190.minPoints + ' pts min' : 'N/A'}</span>
            </div>
            <div style="font-size:.82rem;color:#64748b">${esc(s.sc190.notes)}</div>
          </div>
          <div style="margin-bottom:12px">
            <div style="font-size:.8rem;font-weight:700;color:#16a34a;margin-bottom:4px">SC 491 — Skilled Regional</div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="background:#dcfce7;color:#166534;padding:3px 10px;border-radius:12px;font-size:.85rem;font-weight:700">${s.sc491.minPoints != null ? s.sc491.minPoints + ' pts min' : 'N/A'}</span>
            </div>
            <div style="font-size:.82rem;color:#64748b">${esc(s.sc491.notes)}</div>
          </div>
          <a href="${esc(s.website)}" target="_blank" style="font-size:.82rem;color:#1a5bb8;font-weight:600">Official site →</a>
        </div>`).join('')}
    </div>
    <div style="margin-top:20px;padding:14px 18px;background:#fffbeb;border-radius:8px;font-size:.85rem;color:#92400e;border:1px solid #fde68a">
      ⚠️ State criteria change frequently and may close mid-year. Always verify directly with the state migration authority before applying.
    </div>
    <style>@media(max-width:700px){.state-card+.state-card{margin-top:0}div[style*="grid-template-columns:1fr 1fr"]{grid-template-columns:1fr!important}}</style>`;

  return dashWrap(user, 'state-criteria', body);
}

// ── PROCESSING TIMES ──────────────────────────────────────────────────────────
export function processingTimesPage(user) {
  const body = `
    <div class="vt-section-title">⏱️ Visa Processing Times</div>
    <p class="vt-section-sub">Estimated processing times in months (percentile-based, 2025–26)</p>

    <div class="vt-card">
      <div class="proc-row proc-header" style="border-bottom:2px solid #e8f0fe;margin-bottom:4px">
        <span>Visa</span><span style="text-align:center">P25</span><span style="text-align:center">P50</span><span style="text-align:center">P75</span><span style="text-align:center">P90</span>
      </div>
      ${PROCESSING_TIMES.map(v => `
        <div class="proc-row">
          <div>
            <div style="font-weight:600;font-size:.9rem;color:#1a2744">SC ${v.subclass} — ${v.name}</div>
            ${v.note ? `<div style="font-size:.78rem;color:#94a3b8">${esc(v.note)}</div>` : ''}
          </div>
          <span class="p-val">${v.p25}m</span>
          <span class="p-val">${v.p50}m</span>
          <span class="p-val">${v.p75}m</span>
          <span class="p-val">${v.p90}m</span>
        </div>`).join('')}
    </div>
    <div style="padding:14px 18px;background:#f0f6ff;border-radius:8px;font-size:.85rem;color:#1a2744">
      <strong>Reading this table:</strong> P50 means 50% of applications are decided within that many months.
      P25 = fastest quarter, P90 = slowest 10%. Times are estimates — check
      <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times" target="_blank">DHA's live dashboard</a> for current figures.
    </div>`;

  return dashWrap(user, 'processing-times', body);
}

// ── ENGLISH REQUIREMENTS ──────────────────────────────────────────────────────
export function englishPage(user) {
  const body = `
    <div class="vt-section-title">🗣️ English Requirements</div>
    <p class="vt-section-sub">Required scores by visa subclass across IELTS, PTE, TOEFL, and OET</p>

    <div class="vt-card" style="padding:0;overflow:hidden">
      <table class="eng-table">
        <thead>
          <tr>
            <th>Visa</th>
            <th>Level Required</th>
            <th>IELTS</th>
            <th>PTE Academic</th>
            <th>TOEFL iBT</th>
            <th>OET</th>
          </tr>
        </thead>
        <tbody>
          ${ENGLISH_REQUIREMENTS.map(e => `
            <tr>
              <td><strong>SC ${e.visa}</strong><br><span style="font-size:.8rem;color:#64748b">${esc(e.name)}</span></td>
              <td><span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:10px;font-size:.8rem;font-weight:600;white-space:nowrap">${esc(e.level)}</span></td>
              <td style="font-family:monospace;font-size:.85rem">${esc(e.ielts)}</td>
              <td style="font-family:monospace;font-size:.85rem">${esc(e.pte)}</td>
              <td style="font-family:monospace;font-size:.85rem">${esc(e.toefl)}</td>
              <td style="font-family:monospace;font-size:.85rem">${esc(e.oet)}</td>
            </tr>
            <tr><td colspan="6" style="font-size:.8rem;color:#64748b;padding:4px 12px 12px;background:#fafbff">${esc(e.notes)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:14px 18px;background:#fffbeb;border-radius:8px;font-size:.85rem;color:#92400e;border:1px solid #fde68a">
      ⚠️ Scores shown are component-by-component minimums. Some subclasses require all four skills to meet the threshold individually. Verify on the DHA website before testing.
    </div>
    <style>.eng-table{overflow-x:auto}</style>`;

  return dashWrap(user, 'english', body);
}

// ── STUDENT FUND CALCULATOR ────────────────────────────────────────────────────
export function studentFundPage(user) {
  const body = `
    <div class="vt-section-title">🎓 Student Fund Calculator</div>
    <p class="vt-section-sub">Minimum financial capacity required for an Australian student visa (SC 500)</p>

    <div class="vt-card">
      <h3>Calculate Required Funds</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
        <div>
          <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Tuition Fees (per year, AUD)</label>
          <input type="number" id="sf-tuition" value="25000" min="0" step="500" oninput="calcSF()"
            style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Course Duration (years)</label>
          <input type="number" id="sf-years" value="2" min="0.5" max="8" step="0.5" oninput="calcSF()"
            style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Accompanying Partner?</label>
          <select id="sf-partner" onchange="calcSF()" style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
            <option value="0">No partner</option>
            <option value="1">Yes — 1 partner</option>
          </select>
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:.85rem;margin-bottom:5px">Number of Dependent Children</label>
          <input type="number" id="sf-children" value="0" min="0" max="8" oninput="calcSF()"
            style="width:100%;padding:10px 12px;border:1.5px solid #d1d9e8;border-radius:8px;font-size:.9rem">
        </div>
      </div>

      <div class="fund-result" id="sf-result">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:16px;text-align:center">
          <div><div style="font-size:.8rem;color:#64748b">Tuition (total)</div><div style="font-weight:700" id="sf-r-tuition">—</div></div>
          <div><div style="font-size:.8rem;color:#64748b">Living Costs</div><div style="font-weight:700" id="sf-r-living">—</div></div>
          <div><div style="font-size:.8rem;color:#64748b">Travel (est.)</div><div style="font-weight:700" id="sf-r-travel">—</div></div>
          <div><div style="font-size:.8rem;color:#64748b">Partner</div><div style="font-weight:700" id="sf-r-partner">—</div></div>
          <div><div style="font-size:.8rem;color:#64748b">Children</div><div style="font-weight:700" id="sf-r-children">—</div></div>
        </div>
        <div style="border-top:2px solid #bbf7d0;padding-top:16px;text-align:center">
          <div style="font-size:.85rem;color:#166534;margin-bottom:4px">Minimum Funds Required</div>
          <div class="fund-total" id="sf-total">—</div>
        </div>
      </div>
      <div style="margin-top:12px;font-size:.8rem;color:#94a3b8">${esc(STUDENT_FUND.note)}</div>
    </div>

    <div class="vt-card">
      <h3>2025–26 Living Cost Figures (DHA)</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:.9rem">
        <div>Principal applicant: <strong>$${STUDENT_FUND.livingCostPerYear.toLocaleString()}/year</strong></div>
        <div>Partner: <strong>$${STUDENT_FUND.partnerPerYear.toLocaleString()}/year</strong></div>
        <div>Each child: <strong>$${STUDENT_FUND.childPerYear.toLocaleString()}/year</strong></div>
        <div>Travel (estimate): <strong>~$4,000 return</strong></div>
      </div>
    </div>

    <script>
    function calcSF(){
      const tuition=parseFloat(document.getElementById('sf-tuition').value)||0;
      const years=parseFloat(document.getElementById('sf-years').value)||1;
      const partner=parseInt(document.getElementById('sf-partner').value)||0;
      const children=parseInt(document.getElementById('sf-children').value)||0;
      const living=${STUDENT_FUND.livingCostPerYear}*years;
      const travelEst=4000;
      const partnerCost=${STUDENT_FUND.partnerPerYear}*years*partner;
      const childCost=${STUDENT_FUND.childPerYear}*years*children;
      const tuitionTotal=tuition*years;
      const total=tuitionTotal+living+travelEst+partnerCost+childCost;
      const fmt=n=>'$'+Math.round(n).toLocaleString();
      document.getElementById('sf-r-tuition').textContent=fmt(tuitionTotal);
      document.getElementById('sf-r-living').textContent=fmt(living);
      document.getElementById('sf-r-travel').textContent=fmt(travelEst);
      document.getElementById('sf-r-partner').textContent=fmt(partnerCost);
      document.getElementById('sf-r-children').textContent=fmt(childCost);
      document.getElementById('sf-total').textContent=fmt(total);
    }
    calcSF();
    </script>`;

  return dashWrap(user, 'student-fund', body);
}

// ── DASHBOARD OVERVIEW (replaces old dashboardPage) ──────────────────────────
export function dashboardOverview(user, { inquiries, profile, points, completedStages, totalStages, expiringDocs }) {
  const today = new Date();

  const quickStats = [
    {
      label: 'Migration Points',
      value: points ? `${points.total} pts` : '—',
      sub: points ? (points.total >= 90 ? 'Competitive' : points.total >= 65 ? 'Getting there' : 'Below threshold') : 'Not calculated',
      color: points ? (points.total >= 90 ? '#16a34a' : points.total >= 65 ? '#d97706' : '#dc2626') : '#94a3b8',
      href: '/dashboard/points',
      icon: '🔢',
    },
    {
      label: 'Visa Timeline',
      value: `${completedStages} / ${totalStages}`,
      sub: completedStages === totalStages ? '🎉 Visa granted!' : completedStages === 0 ? 'Not started' : 'In progress',
      color: '#1a5bb8',
      href: '/dashboard/timeline',
      icon: '📅',
    },
    {
      label: 'Expiring Documents',
      value: expiringDocs.length > 0 ? expiringDocs.length : '✓',
      sub: expiringDocs.length > 0 ? 'Need attention' : 'All clear',
      color: expiringDocs.length > 0 ? '#dc2626' : '#16a34a',
      href: '/dashboard/documents',
      icon: '📄',
    },
    {
      label: 'Saved Courses',
      value: inquiries.filter(i => i.service === 'Saved Course').length || '—',
      sub: inquiries.filter(i => i.service !== 'Saved Course').length + ' consultation request' + (inquiries.filter(i => i.service !== 'Saved Course').length !== 1 ? 's' : ''),
      color: '#1a5bb8',
      href: '/contact',
      icon: '📝',
    },
  ];

  const tools = [
    { href: '/dashboard/points',           icon: '🔢', label: 'Points Calculator',      desc: 'Calculate your skilled migration points score' },
    { href: '/dashboard/timeline',          icon: '📅', label: 'Visa Timeline',          desc: 'Track your case from skills assessment to grant' },
    { href: '/dashboard/documents',         icon: '📄', label: 'Document Expiry',        desc: 'Passport, visa, English test, skills assessment' },
    { href: '/dashboard/fees',              icon: '💰', label: 'VAC Fee Calculator',     desc: 'Estimate your Visa Application Charge' },
    { href: '/dashboard/occupations',       icon: '🔍', label: 'Occupation Search',      desc: 'MLTSSL/STSOL list with visa eligibility' },
    { href: '/dashboard/state-criteria',    icon: '🗺️', label: 'State Criteria',         desc: 'SC 190 & 491 min points by state' },
    { href: '/dashboard/processing-times',  icon: '⏱️', label: 'Processing Times',       desc: 'P25/P50/P75/P90 percentile estimates' },
    { href: '/dashboard/english',           icon: '🗣️', label: 'English Requirements',   desc: 'IELTS/PTE/TOEFL/OET by visa subclass' },
    { href: '/dashboard/student-fund',      icon: '🎓', label: 'Student Fund Calc',      desc: 'Minimum savings for student visa' },
    { href: '/courses',                     icon: '🔎', label: 'CRICOS Course Search',   desc: 'Search 26K+ registered courses' },
    { href: '/contact',                     icon: '📞', label: 'Book Consultation',      desc: 'Talk to a Careers Gateway expert' },
    { href: '/health-insurance',            icon: '🏥', label: 'Health Insurance',       desc: 'Compare OSHC & OVHC policies' },
  ];

  const body = `
    <div style="margin-bottom:24px">
      <div style="font-size:1.6rem;font-weight:800;color:#1a2744">Welcome back, ${esc(user.full_name.split(' ')[0])}! 👋</div>
      <div style="color:#64748b;margin-top:4px">Your migration dashboard — everything in one place</div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:28px">
      ${quickStats.map(s => `
        <a href="${s.href}" style="text-decoration:none">
          <div style="background:#fff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.05);border-top:3px solid ${s.color};transition:.15s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
            <div style="font-size:1.5rem">${s.icon}</div>
            <div style="font-size:1.4rem;font-weight:800;color:${s.color};margin:6px 0 2px">${s.value}</div>
            <div style="font-size:.8rem;font-weight:700;color:#1a2744">${s.label}</div>
            <div style="font-size:.75rem;color:#94a3b8;margin-top:2px">${s.sub}</div>
          </div>
        </a>`).join('')}
    </div>

    ${expiringDocs.length > 0 ? `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px;margin-bottom:24px;display:flex;align-items:flex-start;gap:12px">
      <div style="font-size:1.4rem">⚠️</div>
      <div>
        <div style="font-weight:700;color:#c2410c;margin-bottom:4px">Documents expiring soon</div>
        ${expiringDocs.map(d => {
          const days = Math.round((new Date(d.expiry_date) - today) / 86400000);
          return `<div style="font-size:.88rem;color:#7c2d12">${esc(d.doc_label)} — ${days < 0 ? 'EXPIRED' : `expires in ${days} days`}</div>`;
        }).join('')}
        <a href="/dashboard/documents" style="font-size:.85rem;font-weight:600;color:#c2410c;margin-top:6px;display:inline-block">Manage documents →</a>
      </div>
    </div>` : ''}

    <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.05);margin-bottom:24px">
      <div style="font-weight:700;color:#1a2744;font-size:1rem;margin-bottom:16px">🧰 Migration Tools</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">
        ${tools.map(t => `
          <a href="${t.href}" style="text-decoration:none;display:flex;align-items:flex-start;gap:10px;padding:12px;border-radius:8px;border:1px solid #e8f0fe;transition:.15s" onmouseover="this.style.background='#f0f6ff'" onmouseout="this.style.background=''">
            <span style="font-size:1.1rem;flex-shrink:0">${t.icon}</span>
            <div>
              <div style="font-weight:600;font-size:.88rem;color:#1a2744">${t.label}</div>
              <div style="font-size:.78rem;color:#94a3b8;margin-top:1px">${t.desc}</div>
            </div>
          </a>`).join('')}
      </div>
    </div>

    ${(() => {
      const savedCourses = inquiries.filter(i => i.service === 'Saved Course');
      const actualInquiries = inquiries.filter(i => i.service !== 'Saved Course');
      return `
      ${savedCourses.length > 0 ? `
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.05)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div style="font-weight:700;color:#1a2744;font-size:1rem">💾 Saved Courses (${savedCourses.length})</div>
          <a href="/courses" style="font-size:.85rem;color:#1a5bb8;font-weight:600">Search more →</a>
        </div>
        ${savedCourses.slice(0,5).map(i => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;flex-wrap:wrap;gap:8px">
            <div>
              <div style="font-weight:600;font-size:.9rem;color:#1a2744">${esc(i.cricos_course_name||'Course')}</div>
              <div style="font-size:.8rem;color:#64748b">${esc(i.cricos_provider||'')}${i.cricos_course_code ? ` · CRICOS: ${esc(i.cricos_course_code)}` : ''}</div>
              <div style="font-size:.78rem;color:#94a3b8">${new Date(i.created_at).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}</div>
            </div>
            <a href="/contact?course=${encodeURIComponent(i.cricos_course_name||'')}&code=${encodeURIComponent(i.cricos_course_code||'')}&provider=${encodeURIComponent(i.cricos_provider||'')}"
               style="background:#1a5bb8;color:#fff;padding:6px 14px;border-radius:6px;font-size:.82rem;font-weight:600;text-decoration:none;white-space:nowrap">
               Book Consultation
            </a>
          </div>`).join('')}
      </div>` : ''}

      ${actualInquiries.length > 0 ? `
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.05)">
        <div style="font-weight:700;color:#1a2744;font-size:1rem;margin-bottom:16px">📋 My Inquiries (${actualInquiries.length})</div>
        ${actualInquiries.slice(0,5).map(i => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;flex-wrap:wrap;gap:8px">
            <div>
              <div style="font-weight:600;font-size:.9rem;color:#1a2744">${esc(i.service||'General Inquiry')}${i.cricos_course_name ? ` — ${esc(i.cricos_course_name)}` : ''}</div>
              <div style="font-size:.8rem;color:#94a3b8">${new Date(i.created_at).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}</div>
            </div>
            <span style="background:${i.kondesk_sent?'#dcfce7':'#f1f5f9'};color:${i.kondesk_sent?'#166534':'#374151'};padding:3px 10px;border-radius:12px;font-size:.8rem;font-weight:600">${i.kondesk_sent?'✓ Processing':'Received'}</span>
          </div>`).join('')}
      </div>` : ''}

      ${savedCourses.length === 0 && actualInquiries.length === 0 ? `
      <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.05);text-align:center;color:#94a3b8">
        <div style="font-size:2rem;margin-bottom:10px">🎓</div>
        <div style="font-weight:600;color:#1a2744;margin-bottom:6px">You haven't saved any courses yet</div>
        <p style="font-size:.9rem;margin-bottom:16px">Search CRICOS courses and save the ones you're interested in.</p>
        <a href="/courses" class="btn btn-primary" style="padding:10px 24px;font-size:.9rem">Search Courses</a>
      </div>` : ''}`;
    })()}`;

  return dashWrap(user, 'overview', body);
}

export { dashWrap };
