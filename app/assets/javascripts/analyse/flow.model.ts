/**
 * Created by cmathew on 14/07/16.
 */

export enum EntityType {
  FLOW_INSTANCE,
  PROCESSOR
}

export class FlowTemplate {
  id: string
  name: string
  description: string
  uri:string
  date:string
}

export class ProcessorProperties {
  _PROCESSOR_CLASS: string
  _PROCESSOR_TYPE: string
  _READ_SCHEMA_ID: string
  _READ_SCHEMA: string
  _WRITE_SCHEMA_ID: string
  _WRITE_SCHEMA: string
}

export class Processor {
  id: string
  type: string
  processorType: string
  status: string
  properties: ProcessorProperties
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
  uuid: string
  id: string
  type: string
  ptype: string
  title: string
  image: string
  shape: string = "image"
  color: {background: string}  = {background: "white"}
  highlight: {background: string}  = {background: "blue"}


  private baseUrl: string = window.location.protocol + "//" +
    window.location.host
  constructor(uuid: string,
              type: string,
              ptype: string,
              label: string = "") {
    this.uuid = uuid
    this.id = type + ":" + uuid
    this.label = label
    this.type = type
    this.ptype = ptype
    this.title = type.split(".").pop()
    this.image = this.pTypeImage(ptype)
  }

  pTypeImage(ptype: string): string {


    switch (ptype) {
      case "data-ingestion":
        return this.baseUrl + "/assets/images/ingestion_processor.svg"
      case "worker":
        return this.baseUrl + "/assets/images/worker_processor.svg"
      case "sink":
        return this.baseUrl + "/assets/images/sink_processor.svg"
      default:
        return this.baseUrl + "/assets/images/worker_processor.svg"
    }
  }
}

export class FlowEdge {
  from: string
  to: string
  arrows: string

  constructor(from: string,
              to: string,
              arrows: string = "to") {
    this.from = from
    this.to = to
    this.arrows = arrows
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
              id: string = undefined,
              name: string = "",
              flowInstance: FlowInstance = undefined,
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

export class VisTab {
  visType: string
  active: boolean

  constructor(visType: string,
              active: boolean = false) {
    this.visType = visType
    this.active = active
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

export class ProcessorUIState {
  selectedProcessorId: string

  constructor(selectedProcessorId: string = null) {
    this.selectedProcessorId = selectedProcessorId
  }
}

export class FlowCreation {
  instantiationId: string
}