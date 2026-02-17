-- Add format (online/in-person) and gallery to events
ALTER TABLE events ADD COLUMN format TEXT DEFAULT 'in-person';
ALTER TABLE events ADD COLUMN gallery TEXT DEFAULT '[]';
ALTER TABLE events ADD COLUMN summary TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN summary_uz TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN summary_en TEXT DEFAULT '';
