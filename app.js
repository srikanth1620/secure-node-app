const express = require('express');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for security headers
app.use(helmet()); // Adds secure HTTP headers (e.g., XSS protection, HSTS)

// Middleware to parse JSON safely
app.use(express.json({ limit: '10kb' })); // Limit payload size to prevent DoS

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'App is running' });
});

// Route to view app.js source code
app.get('/view-code', async (req, res) => {
  try {
    const code = await fs.readFile(path.join(__dirname, 'app.js'), 'utf-8');
    res.set('Content-Type', 'text/plain');
    res.send(code);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read source code' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});