CREATE TABLE IF NOT EXISTS cricos_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_code TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  vet_national_code TEXT,
  course_level TEXT,
  field_broad TEXT,
  field_narrow TEXT,
  duration_weeks INTEGER,
  tuition_fee TEXT,
  course_language TEXT,
  work_component INTEGER DEFAULT 0,
  foundation_studies INTEGER DEFAULT 0,
  expired INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cricos_course_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_code TEXT NOT NULL,
  course_code TEXT NOT NULL,
  location_name TEXT,
  location_city TEXT,
  location_state TEXT
);

CREATE INDEX IF NOT EXISTS idx_courses_code ON cricos_courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_institution ON cricos_courses(provider_code);
CREATE INDEX IF NOT EXISTS idx_courses_level ON cricos_courses(course_level);
CREATE INDEX IF NOT EXISTS idx_courses_expired ON cricos_courses(expired);
CREATE INDEX IF NOT EXISTS idx_locations_code ON cricos_course_locations(course_code);
CREATE INDEX IF NOT EXISTS idx_locations_state ON cricos_course_locations(location_state);
