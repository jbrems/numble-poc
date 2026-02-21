import type { Connection } from "../types"
import { Node } from "./Node"

export class Belt extends Node {
  public progress: number

  constructor(column: number, row: number, connections: Connection[]) {
    super(column, row, null, '#666', connections)
    this.progress = 0.5
  }

  animate(progress: number) {
    this.progress = progress
  }

  draw(ctx: CanvasRenderingContext2D, gridSize: number): void {
    this.drawConnections(ctx, gridSize)

    const x = this.column * gridSize
    const y = this.row * gridSize

    ctx.fillStyle = '#666'
    ctx.fillRect(x + 10, y + 10, gridSize - 20, gridSize - 20)

    ctx.fillStyle = '#999'
    // draw direction arrow based on connections
    if (this.connections.find(c => c.type === 'output' && c.direction === 'right')) {
      ctx.beginPath()
      ctx.moveTo(x + gridSize - 15, y + gridSize / 2)
      ctx.lineTo(x + gridSize - 25, y + gridSize / 2 - 5)
      ctx.lineTo(x + gridSize - 25, y + gridSize / 2 + 5)
      ctx.closePath()
      ctx.fill()
    }
    if (this.connections.find(c => c.type === 'output' && c.direction === 'bottom')) {
      ctx.beginPath()
      ctx.moveTo(x + gridSize / 2, y + gridSize - 15)
      ctx.lineTo(x + gridSize / 2 - 5, y + gridSize - 25)
      ctx.lineTo(x + gridSize / 2 + 5, y + gridSize - 25)
      ctx.closePath()
      ctx.fill()
    }
    if (this.connections.find(c => c.type === 'output' && c.direction === 'left')) {
      ctx.beginPath()
      ctx.moveTo(x + 15, y + gridSize / 2)
      ctx.lineTo(x + 25, y + gridSize / 2 - 5)
      ctx.lineTo(x + 25, y + gridSize / 2 + 5)
      ctx.closePath()
      ctx.fill()
    }
    if (this.connections.find(c => c.type === 'output' && c.direction === 'top')) {
      ctx.beginPath()
      ctx.moveTo(x + gridSize / 2, y + 15)
      ctx.lineTo(x + gridSize / 2 - 5, y + 25)
      ctx.lineTo(x + gridSize / 2 + 5, y + 25)
      ctx.closePath()
      ctx.fill()
    }
  }

  drawValue(ctx: CanvasRenderingContext2D, gridSize: number): void {
    if (this.value !== null) {
      const inputDirection = this.connections.find(c => c.type === 'input')?.direction || 'none'
      const outputDirection = this.connections.find(c => c.type === 'output')?.direction || 'none'
      const inputProgress = { left: { x: -1, y: 0 }, top: { x: 0, y: -1 }, right: { x: 1, y: 0 }, bottom: { x: 0, y: 1 }, none: { x: 0, y: 0 } }[inputDirection]
      const outputProgress = { left: { x: -1, y: 0 }, top: { x: 0, y: -1 }, right: { x: 1, y: 0 }, bottom: { x: 0, y: 1 }, none: { x: 0, y: 0 } }[outputDirection]

      const packetX = this.column * gridSize + gridSize / 2 + (gridSize * (Math.max(0.5 - this.progress, 0)) * inputProgress.x) + (gridSize * (Math.max(this.progress - 0.5, 0)) * outputProgress.x)
      const packetY = this.row * gridSize + gridSize / 2 + (gridSize * (Math.max(0.5 - this.progress, 0)) * inputProgress.y) + (gridSize * (Math.max(this.progress - 0.5, 0)) * outputProgress.y)

      ctx.fillStyle = this.getInputColor()
      ctx.beginPath()
      ctx.ellipse(packetX, packetY, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fff'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        this.value.toString(),
        packetX,
        packetY
      )
    }
  }

  getInputColor(): string {
    const inputNode = this.connections.find(c => c.type === 'input')?.node
    if (!inputNode) return '#666'
    if (inputNode instanceof Belt) return inputNode.getInputColor()
    return inputNode.color
  }
}