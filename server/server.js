import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

const dataFile = path.join(process.cwd(), 'server', 'data', 'stores.json');

function loadData() {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  }
  return [];
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

let stores = loadData();

app.get('/stores', (req, res) => {
  res.json(stores);
});

app.post('/stores', (req, res) => {
  const store = { id: uuid(), ...req.body };
  stores.push(store);
  saveData(stores);
  res.status(201).json(store);
});

app.get('/stores/:id', (req, res) => {
  const store = stores.find((s) => s.id === req.params.id);
  if (!store) return res.sendStatus(404);
  res.json(store);
});

app.put('/stores/:id', (req, res) => {
  const index = stores.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.sendStatus(404);
  stores[index] = { ...stores[index], ...req.body };
  saveData(stores);
  res.json(stores[index]);
});

app.delete('/stores/:id', (req, res) => {
  const index = stores.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.sendStatus(404);
  const removed = stores.splice(index, 1)[0];
  saveData(stores);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
