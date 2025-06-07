// server/api-server.js
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.join(__dirname, 'data', 'stores.json')

const app = express()
app.use(cors())
app.use(express.json())

// 静的ファイル（画像）
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')))

// JSONファイル読み込み（サブドメイン → 店舗情報）
let storesData = {}
try {
  storesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
} catch {
  console.warn('stores.json が正しく読み込めませんでした')
}

// GET: サブドメインに対応した店舗情報を返す
app.get('/api/store-config/:subdomain', (req, res) => {
  const { subdomain } = req.params
  const store = storesData[subdomain]
  if (!store) {
    return res.status(404).json({ error: '店舗が見つかりません' })
  }
  res.json(store)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ API server running: http://localhost:${PORT}`)
})
