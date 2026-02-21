import { Operator } from "./Operator"

export class AdditionOperator extends Operator {
  constructor(column: number, row: number) {
    super(column, row, 2, '#4ECDC4')
  }

  calculate(inputValues: (number | null)[]): number | null {
    return inputValues.filter(v => v !== null).reduce((a, b) => a + b, 0)
  }

  draw(ctx: CanvasRenderingContext2D, gridSize: number): void {
    this.drawConnections(ctx, gridSize)

    const x = this.column * gridSize
    const y = this.row * gridSize
    ctx.fillStyle = '#4ECDC4'
    ctx.fillRect(x + 5, y + 5, gridSize - 10, gridSize - 10)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('+', x + gridSize / 2, y + gridSize / 2)
  }
}