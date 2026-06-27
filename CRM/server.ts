import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import path from 'path';
import fs from 'fs';

const PORT = 3000;

class JSONDatabase {
  private filepath = './crm_fallback.json';
  private contacts: any[] = [];
  private lastId = 0;

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filepath)) {
        const data = fs.readFileSync(this.filepath, 'utf8');
        const parsed = JSON.parse(data);
        this.contacts = parsed.contacts || [];
        this.lastId = parsed.lastId || 0;
      }
    } catch (err) {
      console.error('Failed to load JSON database:', err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify({
        contacts: this.contacts,
        lastId: this.lastId
      }, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save JSON database:', err);
    }
  }

  async exec(sql: string) {
    return this;
  }

  async get(sql: string, params: any[] = []) {
    if (sql.includes('COUNT(*)')) {
      return { count: this.contacts.length };
    }
    if (sql.includes('FROM contacts WHERE id = ?')) {
      const id = params[0];
      const found = this.contacts.find((c: any) => String(c.id) === String(id));
      if (!found) return null;
      if (sql.includes('SELECT tags FROM')) {
        return { tags: found.tags || '' };
      }
      return found;
    }
    return null;
  }

  async all(sql: string, params: any[] = []) {
    if (sql.includes('SELECT DISTINCT group_name')) {
      const groups = Array.from(new Set(this.contacts.map((c: any) => c.group_name).filter(Boolean))).sort();
      return groups.map((g: string) => ({ group_name: g }));
    }
    if (sql.includes('SELECT tags FROM contacts')) {
      return this.contacts.filter((c: any) => c.tags).map((c: any) => ({ tags: c.tags }));
    }
    if (sql.includes('SELECT * FROM contacts')) {
      let results = [...this.contacts];
      if (params[0] && params[0].includes('%')) {
        const search = params[0].replace(/%/g, '').toLowerCase();
        results = results.filter((c: any) =>
          (c.name && c.name.toLowerCase().includes(search)) ||
          (c.email && c.email.toLowerCase().includes(search)) ||
          (c.phone && c.phone.toLowerCase().includes(search)) ||
          (c.company && c.company.toLowerCase().includes(search)) ||
          (c.tags && c.tags.toLowerCase().includes(search)) ||
          (c.group_name && c.group_name.toLowerCase().includes(search))
        );
      }
      results.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      return results;
    }
    return [];
  }

  async run(sql: string, params: any[] = []) {
    if (sql.includes('TRANSACTION') || sql.includes('COMMIT') || sql.includes('ROLLBACK')) {
      return { lastID: 0, changes: 0 };
    }
    if (sql.includes('INSERT INTO contacts')) {
      this.lastId++;
      const newContact = {
        id: this.lastId,
        name: params[0],
        phone: params[1] || '',
        email: params[2] || '',
        website: params[3] || '',
        group_name: params[4] || '',
        tags: params[5] || '',
        address: params[6] || '',
        company: params[7] || '',
        job_title: params[8] || '',
        notes: params[9] || '',
        birthday: params[10] || '',
        created_at: new Date().toISOString()
      };
      this.contacts.push(newContact);
      this.save();
      return { lastID: this.lastId, changes: 1 };
    }
    if (sql.includes('UPDATE contacts SET name = ?')) {
      const idx = this.contacts.findIndex((c: any) => String(c.id) === String(params[11]));
      if (idx !== -1) {
        this.contacts[idx] = { ...this.contacts[idx], ...params.slice(0, 11).reduce((acc: any, val: string, i: number) => {
          const fields = ['name', 'phone', 'email', 'website', 'group_name', 'tags', 'address', 'company', 'job_title', 'notes', 'birthday'];
          acc[fields[i]] = val || '';
          return acc;
        }, {}) };
        this.save();
      }
      return { lastID: 0, changes: 1 };
    }
    if (sql.includes('DELETE FROM contacts WHERE id = ?')) {
      this.contacts = this.contacts.filter((c: any) => String(c.id) !== String(params[0]));
      this.save();
      return { lastID: 0, changes: 1 };
    }
    if (sql.includes('DELETE FROM contacts WHERE id IN')) {
      const idsSet = new Set(params.map(String));
      this.contacts = this.contacts.filter((c: any) => !idsSet.has(String(c.id)));
      this.save();
      return { lastID: 0, changes: params.length };
    }
    if (sql.includes('UPDATE contacts SET group_name = ? WHERE id IN')) {
      this.contacts.forEach((c: any) => {
        if (new Set(params.slice(1).map(String)).has(String(c.id))) {
          c.group_name = params[0];
        }
      });
      this.save();
      return { lastID: 0, changes: params.length - 1 };
    }
    if (sql.includes('UPDATE contacts SET tags = ? WHERE id = ?')) {
      const found = this.contacts.find((c: any) => String(c.id) === String(params[1]));
      if (found) {
        found.tags = params[0];
        this.save();
      }
      return { lastID: 0, changes: 1 };
    }
    return { lastID: 0, changes: 0 };
  }
}

async function startServer() {
  const app = new Hono();
  app.use('*', cors({ origin: '*' }));

  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
  } catch (err) {
    console.error('Error creating public dir:', err);
  }

  let db: any;
  try {
    console.log('Initializing SQLite database...');
    const sqlite3 = await import('sqlite3');
    const { open } = await import('sqlite');
    db = await open({ filename: './crm.db', driver: sqlite3.default.Database });
    console.log('SQLite database initialized!');
  } catch (err: any) {
    console.log('Using JSONDatabase fallback');
    db = new JSONDatabase();
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      website TEXT,
      group_name TEXT,
      tags TEXT,
      address TEXT,
      company TEXT,
      job_title TEXT,
      notes TEXT,
      birthday TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const countRow = await db.get('SELECT COUNT(*) as count FROM contacts');
  if (countRow && countRow.count === 0) {
    console.log('Seeding demo contacts...');
    const demoContacts = [
      { name: 'Alice Smith', phone: '+1 (555) 123-4567', email: 'alice@alphacorp.com', website: 'https://alphacorp.com', group_name: 'Customers', tags: 'vip, follow-up', address: '123 Main St, New York, NY', company: 'Alpha Corp', job_title: 'Sales Manager', notes: 'Prefers email communication.', birthday: '1990-05-15' },
      { name: 'Bob Jones', phone: '+1 (555) 987-6543', email: 'bob@betalabs.co', website: 'https://betalabs.co', group_name: 'Leads', tags: 'tech, cold-lead', address: '456 Science Dr, Boston, MA', company: 'Beta Labs', job_title: 'Lead Engineer', notes: 'Met at TechConf.', birthday: '1985-11-22' },
      { name: 'Charlie Brown', phone: '+1 (555) 456-7890', email: 'charlie@gammaventures.com', website: 'https://gammaventures.com', group_name: 'Partners', tags: 'investor, high-priority', address: '789 Capital Way, SF', company: 'Gamma Ventures', job_title: 'CEO', notes: 'Strategic partnership.', birthday: '1978-02-28' },
      { name: 'Diana Prince', phone: '+1 (555) 321-7654', email: 'diana@deltaltd.org', website: 'https://deltaltd.org', group_name: 'Customers', tags: 'active, friendly', address: '101 Amazon Pl, Seattle', company: 'Delta Ltd', job_title: 'Marketing Director', notes: 'Regular customer.', birthday: '1988-08-18' },
      { name: 'Evan Wright', phone: '+1 (555) 654-3210', email: 'evan@wrightconsulting.net', website: 'https://wrightconsulting.net', group_name: 'Consultants', tags: 'external, contract', address: '202 Solo Blvd, Austin', company: 'Wright Consulting', job_title: 'Principal Consultant', notes: 'Key resource.', birthday: '1993-12-05' }
    ];
    for (const c of demoContacts) {
      await db.run(`INSERT INTO contacts (name, phone, email, website, group_name, tags, address, company, job_title, notes, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.name, c.phone, c.email, c.website, c.group_name, c.tags, c.address, c.company, c.job_title, c.notes, c.birthday]);
    }
  }

  app.get('/api/health', (c) => c.json({ status: 'ok', database: 'sqlite' }));

  app.get('/api/contacts', async (c) => {
    try {
      const search = c.req.query('search');
      const group = c.req.query('group');
      const tag = c.req.query('tag');
      let query = 'SELECT * FROM contacts WHERE 1=1';
      const params: any[] = [];

      if (search) {
        query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR tags LIKE ? OR group_name LIKE ?)';
        const searchVal = `%${search}%`;
        params.push(searchVal, searchVal, searchVal, searchVal, searchVal, searchVal);
      }
      if (group) {
        query += ' AND LOWER(TRIM(group_name)) = LOWER(TRIM(?))';
        params.push(group as string);
      }
      if (tag) {
        query += ' AND LOWER(tags) LIKE ?';
        params.push(`%${String(tag).toLowerCase()}%`);
      }

      query += ' ORDER BY name ASC';
      let contacts: any[] = await db.all(query, params);

      if (tag) {
        const lowerTag = String(tag).trim().toLowerCase();
        contacts = contacts.filter((contact: any) =>
          contact.tags && contact.tags.split(',').map((t: string) => t.trim().toLowerCase()).includes(lowerTag)
        );
      }
      return c.json(contacts);
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.get('/api/contacts/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const contact = await db.get('SELECT * FROM contacts WHERE id = ?', [id]);
      if (!contact) return c.json({ error: 'Contact not found' }, 404);
      return c.json(contact);
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post('/api/contacts', async (c) => {
    try {
      const body = await c.req.json();
      const { name, phone, email, website, group_name, tags, address, company, job_title, notes, birthday } = body;
      if (!name) return c.json({ error: 'Name is required' }, 400);
      const result = await db.run(`INSERT INTO contacts (name, phone, email, website, group_name, tags, address, company, job_title, notes, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, phone || '', email || '', website || '', group_name || '', tags || '', address || '', company || '', job_title || '', notes || '', birthday || '']);
      const newContact = await db.get('SELECT * FROM contacts WHERE id = ?', [result.lastID]);
      return c.json(newContact, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.put('/api/contacts/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const { name, phone, email, website, group_name, tags, address, company, job_title, notes, birthday } = body;
      if (!name) return c.json({ error: 'Name is required' }, 400);
      await db.run(`UPDATE contacts SET name = ?, phone = ?, email = ?, website = ?, group_name = ?, tags = ?, address = ?, company = ?, job_title = ?, notes = ?, birthday = ? WHERE id = ?`,
        [name, phone || '', email || '', website || '', group_name || '', tags || '', address || '', company || '', job_title || '', notes || '', birthday || '', id]);
      const updatedContact = await db.get('SELECT * FROM contacts WHERE id = ?', [id]);
      if (!updatedContact) return c.json({ error: 'Contact not found' }, 404);
      return c.json(updatedContact);
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.delete('/api/contacts/:id', async (c) => {
    try {
      const id = c.req.param('id');
      await db.run('DELETE FROM contacts WHERE id = ?', [id]);
      return c.json({ success: true });
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post('/api/contacts/bulk-delete', async (c) => {
    try {
      const { ids } = await c.req.json();
      if (!Array.isArray(ids) || ids.length === 0) return c.json({ error: 'No IDs provided' }, 400);
      const placeholders = ids.map(() => '?').join(',');
      await db.run(`DELETE FROM contacts WHERE id IN (${placeholders})`, ids);
      return c.json({ success: true, count: ids.length });
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post('/api/contacts/bulk-update-groups', async (c) => {
    try {
      const { ids, group_name } = await c.req.json();
      if (!Array.isArray(ids) || ids.length === 0) return c.json({ error: 'No IDs provided' }, 400);
      const placeholders = ids.map(() => '?').join(',');
      await db.run(`UPDATE contacts SET group_name = ? WHERE id IN (${placeholders})`, [group_name, ...ids]);
      return c.json({ success: true, count: ids.length });
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post('/api/contacts/bulk-update-tags', async (c) => {
    try {
      const { ids, tags, action } = await c.req.json();
      if (!Array.isArray(ids) || ids.length === 0) return c.json({ error: 'No IDs provided' }, 400);
      if (!Array.isArray(tags)) return c.json({ error: 'Tags must be an array' }, 400);

      for (const id of ids) {
        const contact = await db.get('SELECT tags FROM contacts WHERE id = ?', [id]);
        if (!contact) continue;
        let currentTags = contact.tags ? contact.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
        if (action === 'set') {
          currentTags = tags.map((t: string) => t.trim()).filter(Boolean);
        } else if (action === 'add') {
          tags.forEach((tag: string) => {
            const trimmed = tag.trim();
            if (trimmed && !currentTags.includes(trimmed)) currentTags.push(trimmed);
          });
        } else if (action === 'remove') {
          currentTags = currentTags.filter((tag: string) => !tags.map((t: string) => t.trim()).includes(tag));
        }
        await db.run('UPDATE contacts SET tags = ? WHERE id = ?', [currentTags.join(', '), id]);
      }
      return c.json({ success: true, count: ids.length });
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post('/api/contacts/import', async (c) => {
    try {
      const { contacts, defaultGroup, defaultTags } = await c.req.json();
      if (!Array.isArray(contacts) || contacts.length === 0) return c.json({ error: 'No contacts provided' }, 400);
      await db.run('BEGIN TRANSACTION');
      for (const contact of contacts) {
        const name = contact.name || 'Unnamed Contact';
        const phone = contact.phone || '';
        const email = contact.email || '';
        const website = contact.website || '';
        let group_name = contact.group_name || contact.group || '';
        if (!group_name && defaultGroup) group_name = defaultGroup;
        let importedTags = contact.tags ? String(contact.tags).split(',').map((t: string) => t.trim()).filter(Boolean) : [];
        if (defaultTags && Array.isArray(defaultTags)) {
          defaultTags.forEach((t: string) => {
            if (t.trim() && !importedTags.includes(t.trim())) importedTags.push(t.trim());
          });
        }
        const tagsStr = importedTags.join(', ');
        await db.run(`INSERT INTO contacts (name, phone, email, website, group_name, tags, address, company, job_title, notes, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [name, phone, email, website, group_name, tagsStr, contact.address || '', contact.company || contact.org || '', contact.job_title || contact.title || '', contact.notes || contact.note || '', contact.birthday || contact.bday || '']);
      }
      await db.run('COMMIT');
      return c.json({ success: true, count: contacts.length });
    } catch (err: any) {
      await db.run('ROLLBACK').catch(() => {});
      return c.json({ error: err.message }, 500);
    }
  });

  app.get('/api/groups', async (c) => {
    try {
      const rows = await db.all('SELECT DISTINCT group_name FROM contacts WHERE group_name IS NOT NULL AND group_name != "" ORDER BY group_name ASC');
      return c.json(rows.map((r: any) => r.group_name));
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.get('/api/tags', async (c) => {
    try {
      const rows = await db.all('SELECT tags FROM contacts WHERE tags IS NOT NULL AND tags != ""');
      const tagsSet = new Set<string>();
      rows.forEach((r: any) => {
        r.tags.split(',').forEach((t: string) => {
          const trimmed = t.trim();
          if (trimmed) tagsSet.add(trimmed);
        });
      });
      return c.json(Array.from(tagsSet).sort());
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.use('*', serveStatic({ root: './public' }));
  app.get('*', serveStatic({ root: './public', path: 'index.html' }));

  return { fetch: app.fetch };
}

const server = await startServer();

Bun.serve({
  port: PORT,
  fetch: server.fetch
});

console.log(`Server running on http://localhost:${PORT}`);