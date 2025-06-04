// db.js
require('dotenv').config();  // Load environment variables from .env

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,  // Required for Railway SSL connection
  },
  max: 10,                    // Max connections in pool
  idleTimeoutMillis: 30000,   // Close idle clients after 30s
  connectionTimeoutMillis: 5000,  // Return an error after 5s if connection could not be established
});

// Optional: catch errors on idle clients to prevent app crashing
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
