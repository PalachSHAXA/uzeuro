const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ADMIN_EMAIL = 'info@uzeuro.eu';

async function sendEmail(to, subject, htmlBody) {
  try {
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'noreply@uzeuro.eu', name: 'UZEURO Association' },
        subject,
        content: [{ type: 'text/html', value: htmlBody }],
      }),
    });
  } catch { /* email send failed silently */ }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const db = env.DB;

    try {
      // --- HEALTH ---
      if (path === '/api/health') {
        return json({ status: 'ok', timestamp: new Date().toISOString() });
      }

      // --- STATS ---
      if (path === '/api/stats' && method === 'GET') {
        const [apps, regs, msgs, events, webinars, pubs, news] = await Promise.all([
          db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status="new" THEN 1 ELSE 0 END) as new_count FROM membership_applications').first(),
          db.prepare('SELECT COUNT(*) as total FROM webinar_registrations').first(),
          db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status="new" THEN 1 ELSE 0 END) as new_count FROM contact_messages').first(),
          db.prepare('SELECT COUNT(*) as total FROM events').first(),
          db.prepare('SELECT COUNT(*) as total FROM webinars').first(),
          db.prepare('SELECT COUNT(*) as total FROM publications').first(),
          db.prepare('SELECT COUNT(*) as total FROM news').first(),
        ]);
        return json({
          applications: apps,
          registrations: regs,
          messages: msgs,
          events,
          webinars,
          publications: pubs,
          news,
        });
      }

      // --- MEMBERSHIP APPLICATIONS ---
      if (path === '/api/membership-apply' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO membership_applications (first_name, last_name, email, company, position, country, experience, tier, specializations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(body.firstName, body.lastName, body.email, body.company || '', body.position || '', body.country || '', body.experience || '', body.tier || 'full', JSON.stringify(body.specializations || [])).run();
        sendEmail(ADMIN_EMAIL, 'New Membership Application — UZEURO',
          `<h2>New Membership Application</h2>
          <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Company:</strong> ${body.company || '—'}</p>
          <p><strong>Position:</strong> ${body.position || '—'}</p>
          <p><strong>Country:</strong> ${body.country || '—'}</p>
          <p><strong>Tier:</strong> ${body.tier || 'full'}</p>`
        );
        return json({ success: true });
      }

      if (path === '/api/applications' && method === 'GET') {
        const status = url.searchParams.get('status');
        let query = 'SELECT * FROM membership_applications';
        if (status) query += ` WHERE status = '${status}'`;
        query += ' ORDER BY created_at DESC';
        const { results } = await db.prepare(query).all();
        return json(results);
      }

      if (path.match(/^\/api\/applications\/(\d+)$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json();
        await db.prepare('UPDATE membership_applications SET status = ?, updated_at = datetime("now") WHERE id = ?').bind(body.status, id).run();
        return json({ success: true });
      }

      if (path.match(/^\/api\/applications\/(\d+)$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM membership_applications WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // --- WEBINAR REGISTRATIONS ---
      if (path === '/api/webinar-register' && method === 'POST') {
        const body = await request.json();
        // Check capacity if webinar exists
        if (body.webinarId) {
          const webinar = await db.prepare('SELECT id, title, max_capacity, registered_count FROM webinars WHERE id = ?').bind(body.webinarId).first();
          if (webinar) {
            const capacity = webinar.max_capacity || 300;
            const registered = webinar.registered_count || 0;
            if (registered >= capacity) return json({ error: 'Webinar is full', remaining: 0 }, 400);
            // Check duplicate
            const existing = await db.prepare('SELECT id FROM webinar_registrations WHERE webinar_id = ? AND email = ?').bind(body.webinarId, body.email).first();
            if (existing) return json({ error: 'Already registered', remaining: capacity - registered }, 400);
            await db.prepare('UPDATE webinars SET registered_count = registered_count + 1 WHERE id = ?').bind(body.webinarId).run();
          }
        }
        await db.prepare(
          'INSERT INTO webinar_registrations (name, email, phone, citizenship, telegram, webinar_id, webinar_title) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(body.name, body.email, body.phone || '', body.citizenship || '', body.telegram || '', body.webinarId, body.webinarTitle).run();
        sendEmail(ADMIN_EMAIL, 'New Webinar Registration — UZEURO',
          `<h2>New Webinar Registration</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Phone:</strong> ${body.phone || '—'}</p>
          <p><strong>Citizenship:</strong> ${body.citizenship || '—'}</p>
          <p><strong>Telegram:</strong> ${body.telegram || '—'}</p>
          <p><strong>Webinar:</strong> ${body.webinarTitle || '—'}</p>`
        );
        return json({ success: true });
      }

      if (path === '/api/registrations' && method === 'GET') {
        const webinarId = url.searchParams.get('webinar_id');
        let query = 'SELECT * FROM webinar_registrations';
        if (webinarId) query += ` WHERE webinar_id = ${webinarId}`;
        query += ' ORDER BY created_at DESC';
        const { results } = await db.prepare(query).all();
        return json(results);
      }

      if (path.match(/^\/api\/registrations\/(\d+)$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json();
        await db.prepare('UPDATE webinar_registrations SET status = ? WHERE id = ?').bind(body.status, id).run();
        return json({ success: true });
      }

      if (path.match(/^\/api\/registrations\/(\d+)$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM webinar_registrations WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // --- CONTACT MESSAGES ---
      if (path === '/api/contact' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
        ).bind(body.name, body.email, body.subject, body.message).run();
        sendEmail(ADMIN_EMAIL, `New Contact Message: ${body.subject} — UZEURO`,
          `<h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Subject:</strong> ${body.subject}</p>
          <p><strong>Message:</strong></p><p>${body.message}</p>`
        );
        return json({ success: true });
      }

      if (path === '/api/messages' && method === 'GET') {
        const status = url.searchParams.get('status');
        let query = 'SELECT * FROM contact_messages';
        if (status) query += ` WHERE status = '${status}'`;
        query += ' ORDER BY created_at DESC';
        const { results } = await db.prepare(query).all();
        return json(results);
      }

      if (path.match(/^\/api\/messages\/(\d+)$/) && method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json();
        await db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').bind(body.status, id).run();
        return json({ success: true });
      }

      if (path.match(/^\/api\/messages\/(\d+)$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM contact_messages WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // --- EVENT REGISTRATION ---
      if (path === '/api/event-register' && method === 'POST') {
        const body = await request.json();
        const event = await db.prepare('SELECT id, title, max_capacity, registered_count FROM events WHERE id = ?').bind(body.eventId).first();
        if (!event) return json({ error: 'Event not found' }, 404);
        const capacity = event.max_capacity || 200;
        const registered = event.registered_count || 0;
        if (registered >= capacity) return json({ error: 'Event is full', remaining: 0 }, 400);
        // Check duplicate
        const existing = await db.prepare('SELECT id FROM event_registrations WHERE event_id = ? AND email = ?').bind(body.eventId, body.email).first();
        if (existing) return json({ error: 'Already registered', remaining: capacity - registered }, 400);
        await db.prepare('INSERT INTO event_registrations (event_id, name, email, phone, citizenship, telegram) VALUES (?, ?, ?, ?, ?, ?)').bind(body.eventId, body.name, body.email, body.phone || '', body.citizenship || '', body.telegram || '').run();
        await db.prepare('UPDATE events SET registered_count = registered_count + 1 WHERE id = ?').bind(body.eventId).run();
        const remaining = capacity - registered - 1;
        sendEmail(ADMIN_EMAIL, `New Event Registration — ${event.title}`,
          `<h2>New Event Registration</h2>
          <p><strong>Event:</strong> ${event.title}</p>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Spots remaining:</strong> ${remaining}</p>`
        );
        return json({ success: true, remaining });
      }

      // --- EVENT REGISTRATIONS LIST ---
      if (path === '/api/event-registrations' && method === 'GET') {
        const eventId = url.searchParams.get('event_id');
        let query = 'SELECT * FROM event_registrations';
        if (eventId) query += ` WHERE event_id = ${eventId}`;
        query += ' ORDER BY created_at DESC';
        const { results } = await db.prepare(query).all();
        return json(results);
      }

      // --- CRUD helper ---
      const crudTables = {
        '/api/events': { table: 'events', fields: ['title', 'title_uz', 'title_en', 'description', 'description_uz', 'description_en', 'event_date', 'event_time', 'location', 'type', 'format', 'image_url', 'gallery', 'summary', 'summary_uz', 'summary_en', 'max_capacity', 'registered_count', 'status'] },
        '/api/webinars': { table: 'webinars', fields: ['title', 'title_uz', 'title_en', 'speaker', 'date', 'duration', 'track', 'description', 'description_uz', 'description_en', 'image_url', 'max_capacity', 'status'] },
        '/api/publications': { table: 'publications', fields: ['title', 'title_uz', 'title_en', 'author', 'category', 'excerpt', 'excerpt_uz', 'excerpt_en', 'content', 'content_uz', 'content_en', 'image_url', 'file_url', 'status'] },
        '/api/news': { table: 'news', fields: ['title', 'title_uz', 'title_en', 'content', 'content_uz', 'content_en', 'excerpt', 'excerpt_uz', 'excerpt_en', 'category', 'image_url', 'status'] },
      };

      // --- UPLOAD FILE to KV ---
      if (path === '/api/upload-file' && method === 'POST') {
        const body = await request.json();
        const base64 = body.data;
        const fileName = body.fileName || 'file';
        const mimeType = body.mimeType || 'application/octet-stream';
        const id = crypto.randomUUID();
        // Handle data URI or raw base64
        let raw = base64;
        const match = base64.match(/^data:[^;]+;base64,(.+)$/);
        if (match) raw = match[1];
        const bytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0));
        await env.FILES.put(id, bytes.buffer, { metadata: { mimeType, fileName } });
        const fileUrl = `${url.origin}/api/files/${id}`;
        return json({ success: true, url: fileUrl, fileName });
      }

      // --- SERVE FILE from KV ---
      if (path.startsWith('/api/files/') && method === 'GET') {
        const id = path.replace('/api/files/', '');
        const { value, metadata } = await env.FILES.getWithMetadata(id, { type: 'arrayBuffer' });
        if (!value) return new Response('Not found', { status: 404 });
        return new Response(value, {
          headers: {
            ...corsHeaders,
            'Content-Type': metadata?.mimeType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${metadata?.fileName || 'download'}"`,
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      }

      // --- DOWNLOAD COUNTER ---
      if (path.match(/^\/api\/publications\/(\d+)\/download$/) && method === 'POST') {
        const id = path.split('/')[3];
        await db.prepare('UPDATE publications SET downloads = downloads + 1 WHERE id = ?').bind(id).run();
        const row = await db.prepare('SELECT downloads FROM publications WHERE id = ?').bind(id).first();
        return json({ success: true, downloads: row?.downloads || 0 });
      }

      // --- UPLOAD IMAGE to KV ---
      if (path === '/api/upload' && method === 'POST') {
        const body = await request.json();
        const base64 = body.data; // "data:image/jpeg;base64,..."
        const id = crypto.randomUUID();
        // Extract mime type and raw base64
        const match = base64.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!match) return json({ error: 'Invalid image data' }, 400);
        const mimeType = match[1];
        const raw = match[2];
        // Convert base64 to ArrayBuffer
        const bytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0));
        await env.IMAGES.put(id, bytes.buffer, { metadata: { mimeType } });
        const imageUrl = `${url.origin}/api/images/${id}`;
        return json({ success: true, url: imageUrl });
      }

      // --- SERVE IMAGE from KV ---
      if (path.startsWith('/api/images/') && method === 'GET') {
        const id = path.replace('/api/images/', '');
        const { value, metadata } = await env.IMAGES.getWithMetadata(id, { type: 'arrayBuffer' });
        if (!value) return new Response('Not found', { status: 404 });
        return new Response(value, {
          headers: {
            ...corsHeaders,
            'Content-Type': metadata?.mimeType || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      }

      // Match CRUD routes
      for (const [basePath, config] of Object.entries(crudTables)) {
        const idMatch = path.match(new RegExp(`^${basePath.replace('/', '\\/')}\\/(\\d+)$`));

        if (path === basePath && method === 'GET') {
          const status = url.searchParams.get('status');
          const filter = url.searchParams.get('filter'); // upcoming, past
          const format = url.searchParams.get('format'); // online, in-person
          const conditions = [];
          if (status) conditions.push(`status = '${status}'`);
          if (config.table === 'events') {
            const today = new Date().toISOString().split('T')[0];
            if (filter === 'upcoming') conditions.push(`event_date >= '${today}'`);
            if (filter === 'past') conditions.push(`event_date < '${today}'`);
            if (format) conditions.push(`format = '${format}'`);
          }
          let query = `SELECT * FROM ${config.table}`;
          if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
          query += ' ORDER BY created_at DESC';
          const { results } = await db.prepare(query).all();
          return json(results);
        }

        if (idMatch && method === 'GET') {
          const row = await db.prepare(`SELECT * FROM ${config.table} WHERE id = ?`).bind(idMatch[1]).first();
          if (!row) return json({ error: 'Not found' }, 404);
          return json(row);
        }

        if (path === basePath && method === 'POST') {
          const body = await request.json();
          const cols = config.fields.filter(f => body[f] !== undefined);
          const vals = cols.map(f => body[f]);
          const placeholders = cols.map(() => '?').join(', ');
          await db.prepare(`INSERT INTO ${config.table} (${cols.join(', ')}) VALUES (${placeholders})`).bind(...vals).run();
          return json({ success: true });
        }

        if (idMatch && method === 'PUT') {
          const body = await request.json();
          const sets = Object.keys(body).filter(k => k !== 'id').map(k => `${k} = ?`);
          const vals = Object.keys(body).filter(k => k !== 'id').map(k => body[k]);
          sets.push('updated_at = datetime("now")');
          await db.prepare(`UPDATE ${config.table} SET ${sets.join(', ')} WHERE id = ?`).bind(...vals, idMatch[1]).run();
          return json({ success: true });
        }

        if (idMatch && method === 'DELETE') {
          await db.prepare(`DELETE FROM ${config.table} WHERE id = ?`).bind(idMatch[1]).run();
          return json({ success: true });
        }
      }

      // --- SETTINGS ---
      if (path === '/api/settings' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM settings').all();
        const obj = {};
        results.forEach(r => { obj[r.key] = r.value; });
        return json(obj);
      }

      if (path === '/api/settings' && method === 'PUT') {
        const body = await request.json();
        for (const [key, value] of Object.entries(body)) {
          await db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime("now"))').bind(key, value).run();
        }
        return json({ success: true });
      }

      return json({ error: 'Not found' }, 404);

    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};
