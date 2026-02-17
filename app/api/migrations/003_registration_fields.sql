-- Add phone, citizenship, telegram to webinar_registrations
ALTER TABLE webinar_registrations ADD COLUMN phone TEXT;
ALTER TABLE webinar_registrations ADD COLUMN citizenship TEXT;
ALTER TABLE webinar_registrations ADD COLUMN telegram TEXT;

-- Add event_registrations table if not exists
CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    citizenship TEXT,
    telegram TEXT,
    status TEXT DEFAULT 'registered',
    created_at TEXT DEFAULT (datetime('now'))
);
