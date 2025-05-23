// src/components/TableMapView.tsx
import React, { useEffect, useState } from 'react'
import type { Table } from '../context/AppContext'

interface Pos { x: number; y: number; w: number; h: number }
interface MapConfig {
  id: string
  background: string
  tables: Record<string, Pos>
}

export default function TableMapView({
  tables,
  storeId,
  openDetailModal
}: {
  tables: Table[]
  storeId: string
  openDetailModal: (table: Table) => void
}) {
  const [cfg, setCfg] = useState<MapConfig | null>(null)

  useEffect(() => {
    const mapPath = `/config/maps/${storeId}.json`
    fetch(mapPath)
      .then(res => res.json())
      .then(data => {
        setCfg(data)
      })
      .catch(err => {
        console.error('マップJSONの読み込みに失敗しました:', err)
      })
  }, [storeId])

  if (!cfg) return <div>マップを読み込み中…</div>

  return (
    <section
      className="relative w-full max-w-screen-md mx-auto bg-no-repeat bg-center bg-contain"
      style={{
        paddingBottom: '75%',           // 4:3 のアスペクト比を維持
        backgroundImage: `url(${cfg.background})`,
      }}
    >
      {tables.map(table => {
        const p = cfg.tables[table.tableNumber]
        if (!p) return null
        return (
          <button
            key={table.id}
            className="absolute bg-white border rounded shadow text-sm flex items-center justify-center"
            style={{
              left:    `${p.x}%`,
              top:     `${p.y}%`,
              width:   `${p.w}%`,
              height:  `${p.h}%`,
              transform: 'translate(-50%, -50%)',  // 座標をボタン中心に合わせる
            }}
            onClick={() => openDetailModal(table)}
          >
            {table.tableNumber}
          </button>
        )
      })}
    </section>
  )
}
