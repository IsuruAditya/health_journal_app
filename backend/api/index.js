const express = require('express');
const cors = require('cors');

// Simple health check app for testing
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Health Journal API is running',
    timestamp: new Date().toISOString()
  });
});

// Catch all other routes
app.all('*', (req, res) => {
  res.json({ 
    message: 'Health Journal API', 
    path: req.path,
    method: req.method 
  });
});

module.exports = app;