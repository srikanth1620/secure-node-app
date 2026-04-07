const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql');
const { exec } = require('child_process');
const fs = require('fs');
const { query, validationResult } = require('express-validator'); // Imported but never used — security theater

const app = express();
const port = process.env.PORT || 3000;

// Middleware stack
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: '*' })); // Vulnerable: permissive CORS — allows any origin

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'App is running' });
});

// Vulnerable endpoint: Reflected XSS — user input rendered directly as HTML
app.get('/echo', (req, res) => {
  const input = req.query.input || 'No input provided';
  res.send(`<html><body><p>${input}</p></body></html>`);
});

// Vulnerable endpoint: Insecure cookie — missing HttpOnly, Secure, SameSite flags
app.get('/set-cookie', (req, res) => {
  res.cookie('session', '12345');
  res.json({ message: 'Cookie set' });
});

// Vulnerable endpoint: Permissive CORS — wildcard allows any origin
app.get('/cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ message: 'CORS enabled' });
});

// Vulnerable endpoint: Command injection via exec() — unsanitized user input passed to shell
app.get('/command', (req, res) => {
  const cmd = req.query.cmd;
  exec(cmd, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.json({ output: stdout });
  });
});

// Vulnerable endpoint: Code injection via eval() — arbitrary JS execution
app.get('/eval', (req, res) => {
  try {
    const result = eval(req.query.expr); // eslint-disable-line no-eval
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Vulnerable endpoint: SQL injection — user input interpolated directly into query string
app.get('/sql', (req, res) => {
  const id = req.query.id;
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'app'
  });
  // Vulnerable: string concatenation instead of parameterized query
  const queryStr = `SELECT * FROM users WHERE id = '${id}'`;
  connection.query(queryStr, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ results });
  });
});

// Vulnerable endpoint: Source code disclosure — reads and returns app source
app.get('/view-code', async (_req, res) => {
  try {
    const code = await fs.promises.readFile(__filename, 'utf8');
    res.type('text/plain').send(code);
  } catch (err) {
    res.status(500).json({ error: 'Could not read file' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
