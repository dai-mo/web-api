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

export class SchemaProperties {
  static _FIELDS_TO_MAP = "_FIELDS_TO_MAP"
  static _FIELD_ACTIONS = "_FIELDS_ACTIONS"

  static isSchemaProperty(propertyName: string): boolean {
    return propertyName === this._FIELDS_TO_MAP ||
      propertyName === this._FIELD_ACTIONS
  }
}

export class CoreProperties {
  static _PROCESSOR_CLASS: string = "_PROCESSOR_CLASS"
  static _PROCESSOR_TYPE: string = "_PROCESSOR_TYPE"
  static _READ_SCHEMA_ID: string = "_READ_SCHEMA_ID"
  static _READ_SCHEMA: string = "_READ_SCHEMA"
  static _WRITE_SCHEMA_ID: string = "_WRITE_SCHEMA_ID"
  static _WRITE_SCHEMA: string = "_WRITE_SCHEMA"

  static isCoreProperty(propertyName: string): boolean {
    return propertyName === this._PROCESSOR_CLASS ||
      propertyName === this._PROCESSOR_TYPE ||
      propertyName === this._READ_SCHEMA_ID ||
      propertyName === this._READ_SCHEMA ||
      propertyName === this._WRITE_SCHEMA_ID ||
      propertyName === this._WRITE_SCHEMA
  }
}

export class PossibleValue {
  value: string
  displayName: string
  description: string
}


export class PropertyDefinition {
  displayName: string
  name: string
  description: string
  defaultValue: string
  possibleValues: PossibleValue[]
  required: boolean
  sensitive: boolean
  dynamic: boolean
  type: string
  level: number
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

export class Processor {
  id: string
  type: string
  processorType: string
  status: string
  properties: any
  propertyDefinitions: PropertyDefinition[]
  validationErrors: string[]
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
  color: {
    background: string,
    highlight: { background: string }
  } = {
    background: "white",
    highlight: {background: "white"}
  }
  valMessages: string[] = []


  private baseUrl: string = window.location.protocol + "//" +
    window.location.host

  constructor(uuid: string,
              type: string,
              ptype: string,
              validationErrors: string[] = [],
              label: string = "") {
    this.uuid = uuid
    this.id = type + ":" + uuid
    this.label = label
    this.type = type
    this.ptype = ptype
    this.title = type.split(".").pop()
    this.image = this.pTypeImage(ptype)
    this.validate(validationErrors)
  }

  validate(validationErrors: string[]) {
    if (validationErrors !== undefined && validationErrors.length > 0) {
      this.color.background = "#8e2f33"
      this.color.highlight.background = "#8e2f33"
      this.valMessages = validationErrors
    }
  }

  pTypeImage(ptype: string): string {


    switch (ptype) {
      case "ingestion":
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
  id?: string = undefined
  name?: string = ""
  flowInstance?: FlowInstance = undefined
  labelToggle?: boolean = false
  active?: boolean = false
  disabled?: boolean = false
  removable?: boolean = false


  constructor(title: string,
              id: string = undefined,
              name: string = "",
              flowInstance: FlowInstance = undefined,
              labelToggle: boolean = false,
              active: boolean = false,
              disabled: boolean = false,
              removable: boolean = false) {
    this.title = title
    this.id = id
    this.name = name
    this.flowInstance = flowInstance
    this.labelToggle = labelToggle
    this.active = active
    this.disabled = disabled
    this.removable = removable

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