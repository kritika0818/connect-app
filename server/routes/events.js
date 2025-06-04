const express = require('express');
const router = express.Router();

// Sample GET route for events
router.get('/', (req, res) => {
  res.json({ message: 'Events route is working!' });
});

// Export the router
module.exports = router;
