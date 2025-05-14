// src/components/Footer.tsx

import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface FooterProps {
  currentUser: { role: string } | null
  onOpenAddReservation: () => void
}

export default function Footer({
  currentUser,
  onOpenAddReservation,
}: FooterProps) {
  const loc = useLocation()
  const navigate = useNavigate()
  const isReservations = loc.pathname === '/reservations'
  const isTableStatus = loc.pathname === '/table-status'
  const isCastList     = loc.pathname === '/cast-list'

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t py-2 flex justify-around">
      {/* 卓状況リンク */}
      <Link
        to="/table-status"
        className={`text-blue-600 hover:underline ${isTableStatus ? 'font-bold' : ''}`}
      >
        卓状況
      </Link>

      {/* 来店予約追加 or 来店予約ページ */}
      {isReservations ? (
        <button
          onClick={onOpenAddReservation}
          className="text-blue-600 hover:underline"
        >
          追加
        </button>
      ) : (
        <Link
          to="/reservations"
          className={`text-blue-600 hover:underline ${isReservations ? 'font-bold' : ''}`}
        >
          来店予約
        </Link>
      )}

      {/* 管理者のみ：キャスト一覧 ⇔ 招待リンク発行 */}
      {currentUser?.role === 'admin' && (
        <>
          {isCastList ? (
            <button
              onClick={() =>
                navigate({ pathname: '/cast-list', search: '?openModal=true' })
              }
              className="text-blue-600 hover:underline font-bold"
            >
              招待リンク発行
            </button>
          ) : (
            <Link
              to="/cast-list"
              className="text-blue-600 hover:underline"
            >
              キャスト一覧
            </Link>
          )}
          <Link
            to="/admin-settings"
            className="text-blue-600 hover:underline"
          >
            設定
          </Link>
        </>
      )}

      {/* キャストユーザーのみ：姫一覧・マイページ */}
      {currentUser?.role === 'cast' && (
        <>
          <Link
            to="/cast/princesses"
            className="text-blue-600 hover:underline"
          >
            姫一覧
          </Link>
          <Link
            to="/my-page"
            className="text-blue-600 hover:underline"
          >
            マイページ
          </Link>
        </>
      )}
    </footer>
  )
}
