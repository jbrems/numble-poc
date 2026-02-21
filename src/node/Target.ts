import { Node } from "./Node"

export class Target extends Node {
  public targetValue: number

  constructor(column: number, row: number, value: number) {
    super(column, row, null, '#f44336')
    this.targetValue = value
  }

  draw(ctx: CanvasRenderingContext2D, gridSize: number): void {
    this.drawConnections(ctx, gridSize)

    const x = this.column * gridSize
    const y = this.row * gridSize
    ctx.fillStyle = '#f44336'
    ctx.fillRect(x + 5, y + 5, gridSize - 10, gridSize - 10)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.targetValue.toString(), x + gridSize / 2, y + gridSize / 2)
  }
}