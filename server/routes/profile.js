const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL pool connection

// Update user profile by ID
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const {
    name,
    email,
    avatarUrl,     // frontend sends avatarUrl, DB column is avatar_url
    college,
    branch,
    college_city,  // expect snake_case in req.body for consistency
    college_state,
    about,
    location,
  } = req.body;

  console.log('👉 Received update for user ID:', userId);
  console.log('📦 Data:', req.body);

  try {
    const updateQuery = `
      UPDATE users
      SET 
        name = $1,
        email = $2,
        avatar_url = $3,
        college = $4,
        branch = $5,
        college_city = $6,
        college_state = $7,
        about = $8,
        location = $9
      WHERE id::text = $10
      RETURNING *;
    `;

    const values = [
      name,
      email,
      avatarUrl,
      college,
      branch,
      college_city,
      college_state,
      about,
      location,
      userId,
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ Profile updated:', result.rows[0]);
    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('❌ Error updating user profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching user profile:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
