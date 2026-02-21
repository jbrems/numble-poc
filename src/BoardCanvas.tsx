import { useEffect, useRef } from 'react'
import { type GameState, GameStateService } from './GameStateService'
import { useSetCanvasSize } from './useSetCanvasSize'

interface BoardCanvasProps {
  gameStateService: GameStateService
}

export function BoardCanvas({ gameStateService }: BoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useSetCanvasSize(canvasRef)

  function drawBoard(state: GameState) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    const cols = Math.round(canvas.width / state.gridSize)
    const rows = Math.floor(canvas.height / state.gridSize)

    ctx.strokeStyle = '#444444'
    ctx.lineWidth = 1

    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = i * state.gridSize
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rows * state.gridSize)
      ctx.stroke()
    }

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = i * state.gridSize
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Nodes
    state.nodes.forEach((node) => node.draw(ctx, state.gridSize))

    // Selected cell
    ctx.strokeStyle = 'gold'
    ctx.lineWidth = 3
    if (state.selectedCell) {
      const x = state.selectedCell.column * state.gridSize
      const y = state.selectedCell.row * state.gridSize
      ctx.strokeRect(x, y, state.gridSize, state.gridSize)
    }
  }

  useEffect(() => {
    const unsubscribe = gameStateService.subscribe((state, change) => {
      if (change !== 'animation') drawBoard(state)
    })

    drawBoard(gameStateService.state)

    return unsubscribe
  }, [gameStateService])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const column = Math.floor(x / gameStateService.state.gridSize)
      const row = Math.floor(y / gameStateService.state.gridSize)
      gameStateService.setSelectedCell(column, row)
    }

    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [gameStateService])

  return <canvas ref={canvasRef} className="absolute inset-0 cursor-cell" />
}
