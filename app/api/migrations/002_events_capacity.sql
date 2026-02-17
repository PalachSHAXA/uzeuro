-- Add capacity and registration count to events
ALTER TABLE events ADD COLUMN max_capacity INTEGER DEFAULT 200;
ALTER TABLE events ADD COLUMN registered_count INTEGER DEFAULT 0;

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'registered',
    created_at TEXT DEFAULT (datetime('now'))
);
