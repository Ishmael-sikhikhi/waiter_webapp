// migrate.js
const fs = require('fs');
const { Pool } = require('pg');

DATABASE_URL="postgresql://waiters_db_user:wuaA40cOKsiiK5Jv9XNjMvIcOOVvClXw@dpg-d0gvdhk9c44c73963bng-a/waiters_db"

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
});

(async () => {
  try {
    const sql = fs.readFileSync('./tables.sql').toString();
    await pool.query(sql);
    console.log('✅ Tables created successfully.');
  } catch (err) {
    console.error('❌ Error running migration:', err);
  } finally {
    await pool.end();
  }
})();
