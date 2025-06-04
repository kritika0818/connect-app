require('dotenv').config();
const express = require('express');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const favoritesRoutes = require('./routes/favorites');
const profileRoutes = require('./routes/profile');

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 3000;

// Only start the server if NOT testing (avoid double listen in tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;  // Export app for tests
