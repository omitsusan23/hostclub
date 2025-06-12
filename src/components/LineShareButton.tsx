import React from 'react'

type Props = {
  onGenerate: (shareFn: (url: string) => void) => void
  buttonRef?: React.RefObject<HTMLButtonElement>
  text?: string
}

export const LineShareButton: React.FC<Props> = ({
  onGenerate,
  buttonRef,
  text = 'LINEで共有'
}) => {
  const handleShare = () => {
    onGenerate((url: string) => {
      const ua = navigator.userAgent.toLowerCase()

      if (ua.includes('android')) {
        // Androidの場合：LINEアプリに遷移
        window.location.href = `intent://msg/text/${encodeURIComponent(url)}#Intent;scheme=line;package=jp.naver.line.android;end`
      } else if (ua.includes('iphone') || ua.includes('ipad')) {
        // iOSの場合：LINEアプリに遷移
        window.location.href = `https://line.me/R/msg/text/?${encodeURIComponent(url)}`
      } else {
        // それ以外（PCなど）はWeb版LINE共有
        const lineWeb = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
        window.open(lineWeb, '_blank')
      }
    })
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleShare}
      className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
    >
      {text}
    </button>
  )
}
