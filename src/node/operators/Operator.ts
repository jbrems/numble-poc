import { Node } from "../Node"

export abstract class Operator extends Node {
  public minInputs: number

  constructor(column: number, row: number, minInputs: number, color = '#666') {
    super(column, row, null, color)
    this.minInputs = minInputs
  }

  pull() {
    if (this.hasPushedThisTick) return null

    if (this.connections.filter(c => c.type === 'input').length < this.minInputs) return null
    const inputValues = this.connections.filter(c => c.type === 'input').map(c => {
      return c.node.push()
    })
    if (inputValues.filter(v => v !== null).length < this.minInputs) return null
    this.value = this.calculate(inputValues)
    return this.value
  }

  abstract calculate(inputValues: (number | null)[]): number | null
}