import { useEffect, useRef } from 'react'
import { GameStateService, type GameState } from './GameStateService'
import { useSetCanvasSize } from './useSetCanvasSize'
import { Belt } from './node/Belt'

interface AnimationsCanvasProps {
  gameStateService: GameStateService // we can use gameState to trigger re-render if needed, but animations run independently
}

export function AnimationsCanvas({ gameStateService }: AnimationsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useSetCanvasSize(canvasRef)

  function draw(state: GameState) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // simple animation: moving translucent circles
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    Array.from(state.nodes.values()).filter(node => node instanceof Belt).forEach(belt => belt.drawValue(ctx, state.gridSize))
  }

  useEffect(() => {
    const unsubscribe = gameStateService.subscribe((state) => {
      draw(state)
    })

    draw(gameStateService.state)

    return unsubscribe
  }, [gameStateService])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}
