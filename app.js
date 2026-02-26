const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql');
const { query, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: allowedOrigin }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'App is running' });
});

// Fixed: source code disclosure removed

// Fixed: XSS — input escaped via express-validator
app.get('/echo', [
  query('input').trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const userInput = escapeHtml(req.query.input || 'No input provided');
  res.send(`<h1>User said: ${userInput}</h1>`);
});

// Fixed: secure cookie flags
app.get('/set-cookie', (req, res) => {
  res.cookie('session', '12345', { httpOnly: true, secure: true, sameSite: 'Strict' });
  res.send('Cookie set');
});

// Fixed: CORS restricted to allowedOrigin
app.get('/cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.send('CORS enabled');
});

// Fixed: command execution removed
app.get('/command', (req, res) => {
  res.status(403).json({ error: 'Command execution is not permitted' });
});

// Fixed: eval() removed — only digits and math operators allowed
app.get('/eval', [
  query('expr').trim().matches(/^[\d\s+\-*/().]+$/).withMessage('Only basic math expressions allowed')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const result = Function('"use strict"; return (' + req.query.expr + ')')();
    res.send(`Result: ${result}`);
  } catch {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

// Fixed: SQL injection — parameterized query
app.get('/sql', [
  query('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const userId = parseInt(req.query.id, 10);
  const connection = mysql.createConnection({});
  connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ results });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
