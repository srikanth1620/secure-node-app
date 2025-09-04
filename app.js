const express = require('express');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: '10kb' }));

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});