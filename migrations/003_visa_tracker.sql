CREATE TABLE IF NOT EXISTS visa_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  occupation_anzsco TEXT,
  occupation_name TEXT,
  visa_subclass TEXT,
  age INTEGER,
  english_level TEXT,
  education_level TEXT,
  aus_study_years REAL,
  professional_year INTEGER DEFAULT 0,
  overseas_work_years REAL,
  aus_work_years REAL,
  partner_skills INTEGER DEFAULT 0,
  naati INTEGER DEFAULT 0,
  regional_study INTEGER DEFAULT 0,
  state_nomination TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS case_timelines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  stage TEXT NOT NULL,
  milestone_date TEXT,
  notes TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS document_expiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  doc_type TEXT NOT NULL,
  doc_label TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  reminder_days INTEGER DEFAULT 180,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_visa_profiles_user ON visa_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_timelines_user ON case_timelines(user_id);
CREATE INDEX IF NOT EXISTS idx_docs_user ON document_expiries(user_id);
CREATE INDEX IF NOT EXISTS idx_docs_expiry ON document_expiries(expiry_date);
