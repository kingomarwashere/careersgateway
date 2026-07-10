CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  cricos_course_code TEXT,
  cricos_course_name TEXT,
  cricos_provider TEXT,
  message TEXT,
  kondesk_sent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cricos_cache (
  cache_key TEXT PRIMARY KEY,
  results_json TEXT NOT NULL,
  cached_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_user ON inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_cricos_cached ON cricos_cache(cached_at);
