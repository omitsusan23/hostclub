// src/pages/CastListPage.tsx

import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Header from '../components/Header'

interface Invite {
  id: string
  token: string
  createdAt: string
}

export default function CastListPage() {
  const [invites, setInvites] = useState<Invite[]>(() => {
    const saved = localStorage.getItem('invites')
    return saved ? JSON.parse(saved) : []
  })
  const [modalOpen, setModalOpen] = useState(false)
  const firstShareButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    localStorage.setItem('invites', JSON.stringify(invites))
  }, [invites])

  useEffect(() => {
    if (modalOpen) {
      firstShareButtonRef.current?.focus()
    }
  }, [modalOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modalOpen])

  const issueAndShare = async (shareFn: (url: string) => void) => {
    const token = uuidv4()
    const newInvite: Invite = {
      id: token,
      token,
      createdAt: new Date().toLocaleString(),
    }
    setInvites(prev => [newInvite, ...prev])
    setModalOpen(false)
    const url = `https://your.app/signup?token=${token}`
    shareFn(url)
  }

  const shareViaLine = (url: string) => {
    const lineShare = 'https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(url)
    window.open(lineShare, '_blank')
  }

  const shareViaMail = (url: string) => {
    window.location.href =
      `mailto:?subject=${encodeURIComponent('キャスト招待リンク')}` +
      `&body=${encodeURIComponent('こちらからサインアップしてください：\n' + url)}`
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('招待リンクをクリップボードにコピーしました')
    } catch {
      alert('コピーに失敗しました')
    }
  }

  const revokeInvite = (id: string) => {
    setInvites(prev => prev.filter(inv => inv.id !== id))
  }

  return (
    <>
      <Header title="在籍キャスト一覧">
        <button
          onClick={() => setModalOpen(true)}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          追加
        </button>
      </Header>

      <div className="p-4 pb-16 pt-[calc(env(safe-area-inset-top)+66px)]">
        <ul className="space-y-4">
          {invites.map(inv => (
            <li
              key={inv.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded bg-white"
            >
              <div className="mb-2 md:mb-0 md:w-2/3">
                <p className="text-sm text-gray-700 mb-1">
                  発行日時：
                  <time dateTime={new Date(inv.createdAt).toISOString()}>
                    {inv.createdAt}
                  </time>
                </p>
                <p className="text-sm break-all text-blue-600">
                  https://your.app/signup?token={inv.token}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  共有
                </button>
                <button
                  onClick={() => revokeInvite(inv.id)}
                  className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  取り消し
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3
              id="invite-modal-title"
              className="text-lg font-semibold mb-4 text-center"
            >
              共有方法を選択
            </h3>
            <div className="space-y-3">
              <button
                ref={firstShareButtonRef}
                onClick={() => issueAndShare(shareViaLine)}
                className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                LINEで共有
              </button>
              <button
                onClick={() => issueAndShare(shareViaMail)}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                メールで送信
              </button>
              <button
                onClick={() => issueAndShare(copyToClipboard)}
                className="w-full py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                クリップボードにコピー
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-2 text-sm text-gray-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
