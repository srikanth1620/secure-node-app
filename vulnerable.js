// vulnerable.js - Simple example that Semgrep Community Edition WILL find

const express = require('express');
const app = express();

// === 1. Command Injection (very common detection) ===
app.get('/run', (req, res) => {
  const userCommand = req.query.cmd;           // user-controlled input
  const { exec } = require('child_process');
  exec(`ls ${userCommand}`);                   // ← Semgrep flags this
  res.send('Command executed');
});

// === 2. Hardcoded secret / credential (easy find) ===
const SECRET_KEY = "mySuperSecretPassword123!";   // ← Semgrep flags this

// === 3. Insecure random (weak crypto) ===
const crypto = require('crypto');
function generateToken() {
  return crypto.randomBytes(8).toString('hex');   // too short + predictable in some rules
}

// === 4. Prototype pollution style loop (the one you saw in node_modules) ===
function deepMerge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]);   // ← can trigger prototype-pollution-loop
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

module.exports = { deepMerge };

// Start server (just for completeness)
app.listen(3000, () => {
  console.log('Server running on port 3000');
});