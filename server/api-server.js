import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'data', 'stores.json');

// Load data once when the server starts
const storesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')).stores;

const app = express();
app.use(cors());

app.get('/api/stores', (req, res) => {
  res.json(storesData);
});

app.get('/api/stores/:id', (req, res) => {
  const store = storesData.find((s) => s.id === req.params.id);
  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }
  res.json(store);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
