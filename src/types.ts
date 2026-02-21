import type { Node } from "./node/Node"

export type ConnectionType = 'input' | 'output'
export type ConnectionDirection = 'top' | 'right' | 'bottom' | 'left'

export interface Connection {
  type: ConnectionType
  direction: ConnectionDirection
  node: Node
}
