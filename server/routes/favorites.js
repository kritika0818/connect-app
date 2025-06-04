const express = require('express');
const router = express.Router();
const pool = require('../db');

// Dummy auth middleware - replace with your real auth middleware
const verifyUser = (req, res, next) => {
  const userId = req.header('x-user-id');
  if (!userId) return res.status(401).json({ error: 'Unauthorized: no user ID' });
  req.userId = userId;
  next();
};

// Get all favorites for the user
router.get('/', verifyUser, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a favorite
router.post('/', verifyUser, async (req, res) => {
  const { itemId, itemType } = req.body;
  if (!itemId) return res.status(400).json({ error: 'itemId is required' });

  try {
    // Check if already favorited
    const exists = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND item_id = $2',
      [req.userId, itemId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Already favorited' });
    }

    const insertQuery = `
      INSERT INTO favorites (user_id, item_id, item_type)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const insertValues = [req.userId, itemId, itemType || 'event'];

    const result = await pool.query(insertQuery, insertValues);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a favorite
router.delete('/:itemId', verifyUser, async (req, res) => {
  try {
    const deleteQuery = `
      DELETE FROM favorites
      WHERE user_id = $1 AND item_id = $2
      RETURNING *;
    `;
    const result = await pool.query(deleteQuery, [req.userId, req.params.itemId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
