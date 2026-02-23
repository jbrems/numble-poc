import type { GameState } from "../GameStateService"
import type { Connection } from "../types"

export abstract class Node {
  public column: number
  public row: number
  public connections: Connection[]
  public value: number | null
  public hasPushedThisTick: boolean = false
  public color: string

  constructor(column: number, row: number, value: number | null, color: string = '#666', connections: Connection[] = []) {
    this.column = column
    this.row = row
    this.value = value
    this.color = color
    this.connections = connections
  }

  public drawNode(ctx: CanvasRenderingContext2D, gridSize: number, boardOffset: { x: number, y: number }) {
    const translate: [number, number] = [boardOffset.x * gridSize, boardOffset.y * gridSize]
    ctx.translate(...translate)
    this.draw(ctx, gridSize)
    ctx.translate(-translate[0], - translate[1])
  }

  public abstract draw(ctx: CanvasRenderingContext2D, gridSize: number): void

  public drawValue(_ctx: CanvasRenderingContext2D, _state: GameState): void { }

  public animate(_delta: number) { }

  public tick() {
    this.hasPushedThisTick = false
  }

  public push(): number | null {
    if (this.hasPushedThisTick) return null
    const valueToPush = this.value
    this.pull()
    this.hasPushedThisTick = true
    return valueToPush
  }

  public pull() {
    if (this.hasPushedThisTick) return
    const inputNode = this.connections.find(c => c.type === 'input')?.node
    const inputValue = inputNode ? inputNode.push() : null
    this.value = inputValue
  }

  protected drawConnections(ctx: CanvasRenderingContext2D, gridSize: number) {
    const x = this.column * gridSize
    const y = this.row * gridSize

    ctx.fillStyle = '#666'

    if (this.connections.find(c => c.direction === 'right')) ctx.fillRect(x + gridSize - 11, y + 10, 11, gridSize - 20)
    if (this.connections.find(c => c.direction === 'bottom')) ctx.fillRect(x + 10, y + gridSize - 11, gridSize - 20, 11)
    if (this.connections.find(c => c.direction === 'left')) ctx.fillRect(x, y + 10, 11, gridSize - 20)
    if (this.connections.find(c => c.direction === 'top')) ctx.fillRect(x + 10, y, gridSize - 20, 11)
  }
}