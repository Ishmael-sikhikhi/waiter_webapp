// migrate.js
'use strict';

// Load .env in development
require('dotenv').config();

const fs = require('fs');
const { Pool } = require('pg');

// Define the connection string just like in index.js
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://codex:pg123@localhost:5432/waiters';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const sql = fs.readFileSync('./tables.sql', 'utf8');
    await pool.query(sql);
    console.log('✅ Tables created successfully.');
  } catch (err) {
    console.error('❌ Error running migration:', err);
  } finally {
    await pool.end();
  }
})();
