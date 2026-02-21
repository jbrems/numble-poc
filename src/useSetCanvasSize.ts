import { useEffect, type ForwardedRef } from "react"

export function useSetCanvasSize(
  canvasRef: React.RefObject<HTMLCanvasElement | null> | ForwardedRef<HTMLCanvasElement>,
) {
  useEffect(() => {
    const handleResize = () => {
      if (typeof canvasRef === 'function') return
      if (!canvasRef?.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
}