const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Health Journal API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      records: '/api/health-records'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Health Journal API is running',
    timestamp: new Date().toISOString()
  });
});

// Catch all other routes
app.all('*', (req, res) => {
  res.json({ 
    success: false,
    message: 'Health Journal API - Endpoint under development', 
    path: req.path,
    method: req.method 
  });
});

module.exports = app;