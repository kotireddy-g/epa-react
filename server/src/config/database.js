const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../business_ideas.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    bullet_points TEXT,
    status TEXT DEFAULT 'draft',
    company_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS validations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL,
    validation_data TEXT NOT NULL,
    score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS business_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL,
    template_id TEXT,
    sections TEXT,
    tasks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS implementation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    name TEXT NOT NULL,
    owner TEXT,
    start_date TEXT,
    end_date TEXT,
    completion_percentage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'not-started',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas (id) ON DELETE CASCADE
  );
`);

console.log('✅ Database initialized successfully');

module.exports = db;
