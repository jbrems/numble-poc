import { useEffect } from 'react'
import { GameStateService } from './GameStateService'
import { BoardCanvas } from './BoardCanvas'
import { AnimationsCanvas } from './AnimationsCanvas'
import { Controls } from './Controls'

function App() {
  const gameStateService = new GameStateService()

  useEffect(() => {
    const handleResize = () => {
      const cols = Math.max(Math.round(window.innerWidth / 50), 10)
      const gridSize = window.innerWidth / cols
      gameStateService.setGridSize(gridSize)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [gameStateService])

  useEffect(() => {
    gameStateService.start()
    return () => gameStateService.stop()
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <BoardCanvas gameStateService={gameStateService} />
      <AnimationsCanvas gameStateService={gameStateService} />
      <Controls gameStateService={gameStateService} />
    </div>
  )
}

export default App
