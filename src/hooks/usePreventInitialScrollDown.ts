import { useEffect } from 'react'

export const usePreventInitialScrollDown = (durationMs: number = 1000) => {
  useEffect(() => {
    const preventScrollDown = (e: WheelEvent | TouchEvent) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const isAtTop = scrollY <= 0

      // ホイール下 or タッチ下スワイプ時にキャンセル
      if (isAtTop) {
        if (
          (e instanceof WheelEvent && e.deltaY > 0) ||
          (e instanceof TouchEvent && e.touches?.[0]?.clientY < 0)
        ) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener('wheel', preventScrollDown, { passive: false })
    window.addEventListener('touchmove', preventScrollDown, { passive: false })

    const timer = setTimeout(() => {
      window.removeEventListener('wheel', preventScrollDown)
      window.removeEventListener('touchmove', preventScrollDown)
    }, durationMs)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('wheel', preventScrollDown)
      window.removeEventListener('touchmove', preventScrollDown)
    }
  }, [durationMs])
}
