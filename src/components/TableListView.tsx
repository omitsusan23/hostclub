// src/components/TableListView.tsx

import React from 'react'
import { useAppContext } from '../context/AppContext'
import TableCard from './TableCard'

export default function TableListView() {
  const { state } = useAppContext()
  const tables = state.tables

  if (tables.length === 0) {
    return <p className="text-gray-500">まだ反映された卓はありません。</p>
  }

  return (
    <div className="space-y-3">
      {tables.map(table => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  )
}
