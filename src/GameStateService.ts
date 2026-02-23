import { Belt } from './node/Belt';
import type { Node } from './node/Node';
import { AdditionOperator } from './node/operators/AdditionOperator';
import { MultiplicationOperator } from './node/operators/MultiplicationOperator';
import { Operator } from './node/operators/Operator';
import { Source } from './node/Source';
import { Target } from './node/Target';

const TICK_SPEED = 750

export type GameState = {
  gridSize: number
  boardOffset: { x: number, y: number }
  selectedCell: { row: number; column: number } | null
  nodes: Map<string, Node>
}

type StateChange = 'gridSize' | 'selectedCell' | 'nodes' | 'animation' | 'offset'

type StateChangeCallback = (state: GameState, change: StateChange) => void

export class GameStateService {
  private gridSize: number
  private boardOffset: { x: number, y: number }
  private selectedCell: { row: number; column: number } | null
  private nodes: Map<string, Node>
  private subscribers: Set<StateChangeCallback>
  private tickLoop?: number
  private globalProgress: number = 0
  private animationLoop?: number
  private lastAnimationLoopTime?: number

  constructor() {
    this.gridSize = 50
    this.boardOffset = { x: 0, y: 0 }
    this.selectedCell = null
    this.nodes = new Map([
      ['1:1', new Source(1, 1, 2)],
      ['1:5', new Source(1, 5, 3)],
      ['1:9', new Source(1, 9, 4)],
      ['8:5', new Target(8, 5, 20)],
      ['4:3', new AdditionOperator(4, 3)],
      ['4:7', new MultiplicationOperator(4, 7)],
    ])
    this.subscribers = new Set()
  }

  start() {
    if (this.tickLoop) return
    this.tickLoop = setInterval(() => this.tick(), TICK_SPEED)
    this.lastAnimationLoopTime = performance.now()
    this.animationLoop = requestAnimationFrame(() => this.animate())
  }

  stop() {
    this.tickLoop && clearInterval(this.tickLoop)
    this.tickLoop = undefined
    this.animationLoop && cancelAnimationFrame(this.animationLoop)
    this.animationLoop = undefined
  }

  tick() {
    Array.from(this.nodes.values()).filter(node => node instanceof Target).forEach(t => t.pull())
    Array.from(this.nodes.values()).filter(node => node instanceof Operator).forEach(o => o.pull())
    Array.from(this.nodes.values()).filter(node => node instanceof Belt && !node.connections.find(c => c.type === 'output')).forEach(b => b.pull())
    Array.from(this.nodes.values()).forEach(node => node.tick())
    this.notifySubscribers('nodes')
  }

  animate() {
    const delta = performance.now() - (this.lastAnimationLoopTime || 0)
    this.lastAnimationLoopTime = performance.now()
    this.globalProgress += delta / TICK_SPEED
    if (this.globalProgress > 1) this.globalProgress = 0
    this.nodes.forEach(node => node.animate(this.globalProgress))
    this.notifySubscribers('animation')
    this.animationLoop = requestAnimationFrame(() => this.animate())
  }

  setGridSize(newGridSize: number): void {
    if (this.gridSize !== newGridSize) {
      this.gridSize = newGridSize
      this.notifySubscribers('gridSize')
    }
  }

  setBoardOffset(x: number, y: number) {
    if (this.boardOffset.x != x && this.boardOffset.y !== y) {
      this.boardOffset = { x, y }
      this.notifySubscribers('offset')
    }
  }

  setSelectedCell(column: number | null, row: number | null): void {
    if (column === null || row === null) this.selectedCell = null
    else this.selectedCell = { column, row }
    this.notifySubscribers('selectedCell')
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  private notifySubscribers(change: StateChange): void {
    this.subscribers.forEach(callback => callback(this.state, change))
  }

  // Node management
  addNode(node: Node): void {
    const key = `${node.column}:${node.row}`
    this.nodes.set(key, node)
    this.notifySubscribers('nodes')
  }

  get state(): GameState {
    return {
      gridSize: this.gridSize,
      boardOffset: this.boardOffset,
      selectedCell: this.selectedCell,
      nodes: this.nodes,
    }
  }
}
