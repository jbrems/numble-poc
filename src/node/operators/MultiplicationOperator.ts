import { Operator } from "./Operator"

export class MultiplicationOperator extends Operator {
  constructor(column: number, row: number) {
    super(column, row, 2, '#FFD93D')
  }

  calculate(inputValues: (number | null)[]): number | null {
    return inputValues.filter(v => v !== null).reduce((a, b) => a * b, 1)
  }

  draw(ctx: CanvasRenderingContext2D, gridSize: number): void {
    this.drawConnections(ctx, gridSize)

    const x = this.column * gridSize
    const y = this.row * gridSize
    ctx.fillStyle = '#FFD93D'
    ctx.fillRect(x + 5, y + 5, gridSize - 10, gridSize - 10)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('x', x + gridSize / 2, y + gridSize / 2)
  }
}