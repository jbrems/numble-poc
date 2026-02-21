import { useCallback, useEffect, useState } from "react";
import type { GameState, GameStateService } from "./GameStateService";
import { Belt } from "./node/Belt";

export function Controls({ gameStateService }: { gameStateService: GameStateService }) {
  const [state, setState] = useState<GameState>({} as GameState)

  useEffect(() => {
    const unsubscribe = gameStateService.subscribe((state) => {
      setState(state)
    })
    return () => unsubscribe()
  }, [gameStateService])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!state.selectedCell) return
      if (e.key === 'ArrowRight') tryAddBelt(1, 0)
      else if (e.key === 'ArrowDown') tryAddBelt(0, 1)
      else if (e.key === 'ArrowLeft') tryAddBelt(-1, 0)
      else if (e.key === 'ArrowUp') tryAddBelt(0, -1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state, gameStateService])

  function tryAddBelt(x: number, y: number) {
    if (!state.selectedCell) return
    const succeeded = addBelt(x, y)
    if (succeeded) gameStateService.setSelectedCell(state.selectedCell!.column + x, state.selectedCell!.row + y)
    else gameStateService.setSelectedCell(null, null)
  }

  const addBelt = useCallback((x: number, y: number) => {
    if (!state.selectedCell) return false

    const currentNode = state.nodes.get(`${state.selectedCell.column}:${state.selectedCell.row}`)!
    const outputDirection = x === 1 ? 'right' : x === -1 ? 'left' : y === 1 ? 'bottom' : 'top'
    const inputDirection = x === 1 ? 'left' : x === -1 ? 'right' : y === 1 ? 'top' : 'bottom'

    const connectingNode = state.nodes.get(`${state.selectedCell.column + x}:${state.selectedCell.row + y}`)
    if (connectingNode) {
      currentNode.connections.push({ type: 'output', direction: outputDirection, node: connectingNode })
      connectingNode.connections.push({ type: 'input', direction: inputDirection, node: currentNode })
      return false
    }

    const newNode = new Belt(state.selectedCell.column + x, state.selectedCell.row + y, [{ type: 'input', direction: inputDirection, node: currentNode }])
    currentNode.connections.push({ type: 'output', direction: outputDirection, node: newNode })
    gameStateService.addNode(newNode)

    return true
  }, [state, gameStateService])

  if (!state.selectedCell) return null
  return <div className="absolute top-[var(--top)] left-[var(--left)]" style={{ '--top': `${state.selectedCell.row * gameStateService.state.gridSize}px`, '--left': `${state.selectedCell.column * gameStateService.state.gridSize}px`, '--gridSize': `${gameStateService.state.gridSize}px` } as React.CSSProperties}>
    <button type="button" onClick={() => tryAddBelt(1, 0)} className="absolute border border-gray-300 rounded-[4px] cursor-pointer w-[30px] h-[30px] translate-x-[calc(var(--gridSize)+5px)] translate-y-[calc(var(--gridSize)*0.5-15px)]">→</button>
    <button type="button" onClick={() => tryAddBelt(0, 1)} className="absolute border border-gray-300 rounded-[4px] cursor-pointer w-[30px] h-[30px] translate-x-[calc(var(--gridSize)*0.5-15px)] translate-y-[calc(var(--gridSize)+5px)]">↓</button>
    <button type="button" onClick={() => tryAddBelt(-1, 0)} className="absolute border border-gray-300 rounded-[4px] cursor-pointer w-[30px] h-[30px] -translate-x-[35px] translate-y-[calc(var(--gridSize)*0.5-15px)]">←</button>
    <button type="button" onClick={() => tryAddBelt(0, -1)} className="absolute border border-gray-300 rounded-[4px] cursor-pointer w-[30px] h-[30px] translate-x-[calc(var(--gridSize)*0.5-15px)] -translate-y-[35px]">↑</button>
  </div>
}