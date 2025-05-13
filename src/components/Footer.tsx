import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface FooterProps {
  currentUser: { role: string } | null
  onOpenAddReservation: () => void
}

export default function Footer({
  currentUser,
  onOpenAddReservation,
}: FooterProps) {
  const loc = useLocation()
  const isReservations = loc.pathname === '/reservations'
  const isTableStatus = loc.pathname === '/table-status'

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t py-2 flex justify-around">
      <Link
        to="/table-status"
        className={`text-blue-600 hover:underline ${isTableStatus ? 'font-bold' : ''}`}
      >
        卓状況
      </Link>

      {isReservations ? (
        <button onClick={onOpenAddReservation} className="text-blue-600 hover:underline">
          追加
        </button>
      ) : (
        <Link to="/reservations" className="text-blue-600 hover:underline">
          来店予約
        </Link>
      )}

      {currentUser?.role === 'admin' && (
        <>
          <Link to="/cast-list" className="text-blue-600 hover:underline">
            キャスト一覧
          </Link>
          <Link to="/admin-settings" className="text-blue-600 hover:underline">
            設定
          </Link>
        </>
      )}

      {currentUser?.role === 'cast' && (
        <>
          <Link to="/cast/princesses" className="text-blue-600 hover:underline">
            姫一覧
          </Link>
          <Link to="/my-page" className="text-blue-600 hover:underline">
            マイページ
          </Link>
        </>
      )}
    </footer>
  )
}
