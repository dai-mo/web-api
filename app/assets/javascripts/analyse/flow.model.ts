
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
  version: string
  processors: Processor[]
  connections: Connection[]

}

export class FlowNode {
  name: string
  width: number
  height: number
  id: string

  constructor(id: string,
              name: string = "#",
              width: number = 50,
              height: number = 50) {
    this.name = name
    this.width = width
    this.height = height
    this.id = id
  }
}

export class FlowLink {
  source: number
  target: number

  constructor(source: number,
              target: number) {
    this.source = source
    this.target = target
  }
}

export class FlowGraph {
  nodes: FlowNode[]
  links: FlowLink[]

  constructor(nodes: FlowNode[] = [],
              links: FlowLink[] = []) {
    this.nodes = nodes
    this.links = links
  }
}

export class FlowTab {
  title: string
  id: string
  name: string
  flowInstance: FlowInstance
  active: boolean
  disabled: boolean
  removable: boolean


  constructor(title: string,
              id: string,
              name: string,
              flowInstance: FlowInstance = null,
              active: boolean = false,
              disabled: boolean = false,
              removable: boolean = false){
    this.title = title
    this.id = id
    this.name = name
    this.active = active
    this.disabled = disabled
    this.removable = removable
    this.flowInstance = flowInstance
  }
}