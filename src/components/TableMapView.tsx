import React from 'react'
import { useAppContext } from '../context/AppContext'

// Room outline coordinates
const ROOM_OUTLINE = [
  // Main room outline
  { x: 15, y: 10, w: 70, h: 80 },
  // Bathroom area
  { x: 10, y: 5, w: 20, h: 25 },
  // Small rooms
  { x: 40, y: 10, w: 15, h: 15 },
  { x: 60, y: 10, w: 15, h: 15 },
  // Medium rooms
  { x: 30, y: 45, w: 25, h: 25 },
  { x: 60, y: 45, w: 25, h: 25 },
  // Bottom rooms
  { x: 15, y: 75, w: 15, h: 10 },
  { x: 60, y: 75, w: 15, h: 10 },
  { x: 80, y: 75, w: 15, h: 10 }
]

export default function TableMapView() {
  const { state } = useAppContext()
  const { tableSettings } = state

  if (tableSettings.length === 0) {
    return <p className="text-gray-500">マップレイアウト用の設定がありません。</p>
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg border shadow-inner p-4">
      {/* Room outlines */}
      {ROOM_OUTLINE.map((room, index) => (
        <div
          key={index}
          className="absolute border-2 border-gray-400"
          style={{
            left: `${room.x}%`,
            top: `${room.y}%`,
            width: `${room.w}%`,
            height: `${room.h}%`
          }}
        />
      ))}
    </div>
  )
}