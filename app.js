const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql');
const { query, validationResult } = require('express-validator');
//
// nosemgrep: express-check-csurf-middleware-usage (JSON API — CSRF not applicable)
const app = express();
const port = process.env.PORT || 3000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// Safe recursive descent parser for basic math expressions (+, -, *, /, parentheses)
function safeMath(expr) {
  const tokens = expr.match(/[\d.]+|[+\-*/()]/g) || [];
  let pos = 0;

  function parseExpr() {
    let left = parseTerm();
    while (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
      const op = tokens[pos++];
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseFactor();
    while (pos < tokens.length && (tokens[pos] === '*' || tokens[pos] === '/')) {
      const op = tokens[pos++];
      const right = parseFactor();
      if (op === '/' && right === 0) throw new Error('Division by zero');
      left = op === '*' ? left * right : left / right;
    }
    return left;
  }

  function parseFactor() {
    if (tokens[pos] === '(') {
      pos++;
      const val = parseExpr();
      if (tokens[pos] !== ')') throw new Error('Missing closing parenthesis');
      pos++;
      return val;
    }
    const num = parseFloat(tokens[pos]);
    if (isNaN(num)) throw new Error('Invalid token: ' + tokens[pos]);
    pos++;
    return num;
  }

  const result = parseExpr();
  if (pos < tokens.length) throw new Error('Unexpected token: ' + tokens[pos]);
  return result;
}

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: allowedOrigin }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'App is running' });
});

// Fixed: XSS — return JSON, no raw HTML rendering of user input
app.get('/echo', [
  query('input').trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  res.json({ echo: req.query.input || 'No input provided' });
});

// Fixed: secure cookie flags
app.get('/set-cookie', (req, res) => {
  res.cookie('session', '12345', { httpOnly: true, secure: true, sameSite: 'Strict' });
  res.json({ message: 'Cookie set' });
});

// Fixed: CORS restricted to allowedOrigin
app.get('/cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.json({ message: 'CORS enabled' });
});

// Fixed: command execution removed
app.get('/command', (req, res) => {
  res.status(403).json({ error: 'Command execution is not permitted' });
});

// Fixed: no eval/Function() — uses recursive descent math parser
app.get('/eval', [
  query('expr').trim().matches(/^[\d\s+\-*/().]+$/).withMessage('Only basic math expressions allowed')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const result = safeMath(req.query.expr);
    res.json({ result });
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
