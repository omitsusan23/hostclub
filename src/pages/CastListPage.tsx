import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Header from '../components/Header'
import { supabase } from '../lib/supabase'
import { useAppContext } from '../context/AppContext'
import { LineShareButton } from '../components/LineShareButton'

interface Cast {
  id: string
  role: 'cast' | 'operator'
  invite_token: string
  created_at: string
  store_id: string
}

export default function CastListPage() {
  const { state } = useAppContext()
  const [casts, setCasts] = useState<Cast[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'cast' | 'operator'>('cast')
  const [latestUrl, setLatestUrl] = useState<string | null>(null)
  const firstShareButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!state.session) return

    const fetchCasts = async () => {
      const { data, error } = await supabase
        .from('casts')
        .select('*')
        .eq('store_id', state.session.user.user_metadata?.store_id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('キャスト取得エラー:', error)
      } else {
        setCasts(data as Cast[])
      }
    }

    fetchCasts()
  }, [state.session])

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

    const { error } = await supabase.from('casts').insert([
      {
        invite_token: token,
        store_id: state.session?.user?.user_metadata?.store_id,
        role: selectedRole,
        created_by: state.session?.user?.id,
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      alert('招待の登録に失敗しました')
      console.error(error)
      return
    }

    const storeId = state.session?.user?.user_metadata?.store_id
    const baseDomain = 'hostclub-tableststus.com'
    const url = `https://${storeId}.${baseDomain}/signup?token=${token}`

    setLatestUrl(url)
    shareFn(url)
    setModalOpen(false)

    const { data, error: fetchError } = await supabase
      .from('casts')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })

    if (!fetchError) {
      setCasts(data as Cast[])
    }
  }

  const shareViaLine = (url: string) => {
    const ua = navigator.userAgent.toLowerCase()
    const message = encodeURIComponent(url)

    if (ua.includes('android')) {
      window.location.href = `intent://msg/text/${message}#Intent;scheme=line;package=jp.naver.line.android;end`
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
      window.location.href = `line://msg/text/${message}`
    } else {
      alert('この端末ではLINE共有がサポートされていません。')
    }
  }

  const shareViaMail = (url: string) => {
    window.location.href =
      `mailto:?subject=${encodeURIComponent('キャスト招待リンク')}` +
      `&body=${encodeURIComponent('こちらからサインアップしてください：\n' + url)}`
  }

  const copyToClipboard = async (url: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
        alert('招待リンクをクリップボードにコピーしました')
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        alert('招待リンクをクリップボードにコピーしました')
      }
    } catch (err) {
      console.error('コピー失敗:', err)
      alert(`コピーに失敗しました。長押しで手動コピーしてください。\n\n${url}`)
    }
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
          {casts.map((cast) => (
            <li
              key={cast.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded bg-white"
            >
              <div className="mb-2 md:mb-0 md:w-2/3">
                <p className="text-sm text-gray-700 mb-1">
                  発行日時：
                  <time dateTime={cast.created_at}>
                    {new Date(cast.created_at).toLocaleString()}
                  </time>
                </p>
                <p className="text-sm text-gray-800 mb-1">役割：{cast.role}</p>
                <p className="text-sm break-all text-blue-600">
                  https://{cast.store_id}.hostclub-tableststus.com/signup?token={cast.invite_token}
                </p>
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

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">役割を選択:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'cast' | 'operator')}
                className="w-full border rounded px-3 py-2"
              >
                <option value="cast">キャスト</option>
                <option value="operator">オペレーター</option>
              </select>
            </div>

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
