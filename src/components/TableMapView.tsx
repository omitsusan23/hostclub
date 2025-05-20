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
  storeId
}: {
  tables: Table[]
  storeId: string
}) {
  const [cfg, setCfg] = useState<MapConfig | null>(null)

  useEffect(() => {
    import(`../config/maps/${storeId}.json`)
      .then(m => setCfg(m.default))
      .catch(err => console.error(err))
  }, [storeId])

  if (!cfg) return <div>マップを読み込み中…</div>

  return (
    <section
      className="relative mx-auto"
      style={{
        width: '100%',
        maxWidth: 800,
        aspectRatio: '4/3',
        background: `url(${cfg.background}) no-repeat center/contain`
      }}
    >
      {tables.map(t => {
        const p = cfg.tables[t.tableNumber]
        if (!p) return null
        return (
          <button
            key={t.id}
            className="absolute bg-white border rounded shadow text-sm"
            style={{
              left:  `${p.x}%`,
              top:   `${p.y}%`,
              width: `${p.w}%`,
              height:`${p.h}%`
            }}
            onClick={() => {/* 詳細モーダルを開く */}}
          >
            {t.tableNumber}
          </button>
        )
      })}
    </section>
  )
}
