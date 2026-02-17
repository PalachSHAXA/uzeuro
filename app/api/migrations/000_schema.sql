-- UZEURO Admin Database Schema

-- 1. Membership applications (from site)
CREATE TABLE IF NOT EXISTS membership_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    position TEXT,
    country TEXT,
    experience TEXT,
    tier TEXT DEFAULT 'full',
    specializations TEXT,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 2. Webinar registrations (from site)
CREATE TABLE IF NOT EXISTS webinar_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    webinar_id INTEGER,
    webinar_title TEXT,
    status TEXT DEFAULT 'registered',
    created_at TEXT DEFAULT (datetime('now'))
);

-- 3. Contact messages (from site)
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now'))
);

-- 4. Events
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    title_uz TEXT,
    title_en TEXT,
    description TEXT,
    description_uz TEXT,
    description_en TEXT,
    event_date TEXT,
    event_time TEXT,
    location TEXT,
    type TEXT DEFAULT 'conference',
    image_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 5. Webinars
CREATE TABLE IF NOT EXISTS webinars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    title_uz TEXT,
    title_en TEXT,
    speaker TEXT,
    date TEXT,
    duration TEXT,
    track TEXT DEFAULT 'professional',
    description TEXT,
    description_uz TEXT,
    description_en TEXT,
    image_url TEXT,
    max_capacity INTEGER DEFAULT 300,
    registered_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 6. Publications
CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    title_uz TEXT,
    title_en TEXT,
    author TEXT,
    category TEXT DEFAULT 'articles',
    excerpt TEXT,
    excerpt_uz TEXT,
    excerpt_en TEXT,
    content TEXT,
    content_uz TEXT,
    content_en TEXT,
    image_url TEXT,
    file_url TEXT,
    downloads INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 7. News
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    title_uz TEXT,
    title_en TEXT,
    content TEXT,
    content_uz TEXT,
    content_en TEXT,
    excerpt TEXT,
    excerpt_uz TEXT,
    excerpt_en TEXT,
    category TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 8. Settings (key-value)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
