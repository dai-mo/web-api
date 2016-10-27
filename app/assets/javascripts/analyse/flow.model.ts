
/**
 * Created by cmathew on 14/07/16.
 */


export class FlowTemplate {
  id: string
  name: string
  description: string
  uri:string
  date:string
}

export class Processor {
  id: string
  status: string
}

export class ConnectionPort {
  id: string
  type: string
}
export class Connection {
  id: string
  source: ConnectionPort
  destination: ConnectionPort

}
export class FlowInstance {
  id: string
  name: string
  nameId: string
  version: string
  state: string
  processors: Processor[]
  connections: Connection[]

  static stateRunning = "RUNNING"
  static stateStopped = "STOPPED"
  static stateNotStarted = "NOT_STARTED"

}

export class FlowNode {
  label: string
  id: string

  constructor(id: string,
              label: string = "") {
    this.label = label

    this.id = id
  }
}

export class FlowEdge {
  from: number
  to: number

  constructor(from: number,
              to: number) {
    this.from = from
    this.to = to
  }
}

export class FlowGraph {
  nodes: FlowNode[]
  edges: FlowEdge[]

  constructor(nodes: FlowNode[] = [],
              edges: FlowEdge[] = []) {
    this.nodes = nodes
    this.edges = edges
  }
}


export class FlowTab {
  title: string
  id: string
  name: string
  labelToggle: boolean
  flowInstance: FlowInstance
  active: boolean
  disabled: boolean
  removable: boolean


  constructor(title: string,
              id: string,
              name: string,
              flowInstance: FlowInstance,
              labelToggle: boolean = false,
              active: boolean = false,
              disabled: boolean = false,
              removable: boolean = false){
    this.title = title
    this.id = id
    this.name = name
    this.flowInstance = flowInstance
    this.labelToggle = labelToggle
    this.active = active
    this.disabled = disabled
    this.removable = removable
  }

  instanceState() {
    return this.flowInstance.state
  }

  isRunning() {
    return this.flowInstance.state === FlowInstance.stateRunning
  }

  isStopped() {
    return this.flowInstance.state === FlowInstance.stateStopped
  }

  isNotStarted() {
    return this.flowInstance.state === FlowInstance.stateNotStarted
  }
}

export class Provenance {
  id: string
  content: string
}

export class Action {
  label: string
}

export class DCSError {
  code: string
  message: string
  httpStatusCode: number
  errorMessage: string
}