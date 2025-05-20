import React from 'react'
import { useAppContext } from '../context/AppContext'

// Define table positions based on the floor plan
const TABLE_POSITIONS = {
  '1': { left: '15%', top: '10%', width: '20%', height: '25%' },
  '2': { left: '40%', top: '10%', width: '15%', height: '15%' },
  '3': { left: '60%', top: '10%', width: '15%', height: '15%' },
  '4': { left: '30%', top: '45%', width: '25%', height: '25%' },
  '5': { left: '60%', top: '45%', width: '25%', height: '25%' },
  '6': { left: '60%', top: '75%', width: '15%', height: '10%' },
  '7': { left: '80%', top: '75%', width: '15%', height: '10%' },
  '8': { left: '15%', top: '75%', width: '15%', height: '10%' }
}

export default function TableMapView() {
  const { state } = useAppContext()
  const { tables, tableSettings } = state

  if (settings.length === 0) {
    return <p className="text-gray-500">マップレイアウト用の設定がありません。</p>
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg border shadow-inner p-4">
      {/* Background image */}
      <img 
        src="/floorplans/rberu-sapporo.png"
        alt="Floor plan"
        className="absolute inset-0 w-full h-full object-contain opacity-20"
      />
      
      {/* Tables */}
      {Object.entries(TABLE_POSITIONS).map(([number, position]) => {
        const table = tables.find(t => t.tableNumber === number)
        const isOccupied = !!table
        
        return (
          <div
            key={number}
            className={`absolute rounded-lg border-2 ${
              isOccupied ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
            } flex flex-col items-center justify-center transition-colors`}
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              height: position.height
            }}
          >
            <span className="font-bold text-lg">{number}</span>
            {table && (
              <div className="text-xs text-center">
                <div>{table.princess}</div>
                <div>{table.time}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}