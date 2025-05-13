// src/components/TableMapView.tsx

import React from 'react'
import { useAppContext } from '../context/AppContext'

export default function TableMapView() {
  const { state } = useAppContext()
  const tables = state.tables
  const settings = state.tableSettings || []

  if (settings.length === 0) {
    return <p className="text-gray-500">マップレイアウト用の設定がありません。</p>
  }

  return (
    <div className="relative w-full h-[400px] bg-gray-100 rounded">
      {settings.map((s: string) => {
        // テーブル番号と一致する反映済みデータを探す
        const t = tables.find(t => t.tableNumber === s)
        // 仮に配置情報が s 文字列だけなら、設定側で座標を持たせる必要があります
        // 今は同じ位置に並べるサンプルとして style 固定値を使用
        const index = settings.indexOf(s)
        const left = (index % 5) * 70 + 20
        const top  = Math.floor(index / 5) * 70 + 20

        return (
          <div
            key={s}
            className="absolute p-2 bg-white border rounded text-xs text-center cursor-pointer"
            style={{ left: `${left}px`, top: `${top}px`, width: '60px' }}
            title={t
              ? `卓番号: ${s}\n担当: ${t.cast}\n姫名: ${t.princess}`
              : `卓番号: ${s}\n空卓`
            }
          >
            {s}
          </div>
        )
      })}
    </div>
  )
}
