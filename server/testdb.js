require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to DB, current time:', res.rows[0]);
    await pool.end();
  } catch (err) {
    console.error('Connection test failed:', err);
  }
}

testConnection();
