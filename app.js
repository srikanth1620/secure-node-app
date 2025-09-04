const express = require('express');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: '*' })); // Vulnerable: Permissive CORS

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'App is running' });
});

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

// Vulnerable endpoint: XSS risk
app.get('/echo', (req, res) => {
  const userInput = req.query.input || 'No input provided';
  res.send(`<h1>User said: ${userInput}</h1>`); // Unsafe
});

// Vulnerable endpoint: Insecure cookie
app.get('/set-cookie', (req, res) => {
  res.cookie('session', '12345'); // Unsafe: No flags
  res.send('Cookie set');
});

// Vulnerable endpoint: Permissive CORS
app.get('/cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Unsafe
  res.send('CORS enabled');
});

// Vulnerable endpoint: Command injection
app.get('/command', (req, res) => {
  const userCmd = req.query.cmd || 'ls';
  exec(userCmd, (error, stdout, stderr) => { // Unsafe
    if (error) {
      res.send(stderr);
    } else {
      res.send(stdout);
    }
  });
});

// Vulnerable endpoint: Unsafe eval
app.get('/eval', (req, res) => {
  const userExpr = req.query.expr || '1 + 1';
  const result = eval(userExpr); // Unsafe
  res.send(`Result: ${result}`);
});

// Vulnerable endpoint: Simulated SQL injection
app.get('/sql', (req, res) => {
  const userId = req.query.id || '1';
  const query = `SELECT * FROM users WHERE id = ${userId}`; // Unsafe
  const connection = mysql.createConnection({}); // Mock
  connection.query(query, (err, results) => { // Unsafe
    res.send(`Query: ${query}`);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});