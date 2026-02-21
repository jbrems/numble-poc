import { Node } from "./Node"

export class Source extends Node {
  constructor(column: number, row: number, value: number) {
    super(column, row, value, '#4CAF50')
    this.value = value
  }

  public push(): number | null {
    return this.value
  }

  draw(ctx: CanvasRenderingContext2D, gridSize: number): void {
    this.drawConnections(ctx, gridSize)

    const x = this.column * gridSize
    const y = this.row * gridSize
    ctx.fillStyle = '#4caf50'
    ctx.fillRect(x + 5, y + 5, gridSize - 10, gridSize - 10)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.value!.toString(), x + gridSize / 2, y + gridSize / 2)
  }
}