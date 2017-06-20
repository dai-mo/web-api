import {MenuItem, SelectItem} from "primeng/primeng"
import {EntityType, FlowTemplate} from "../analyse/flow.model"
import {UIStateStore} from "./ui.state.store"
/**
 * Created by cmathew on 04.05.17.
 */

export class UiId {
  static ANALYSE: string = "analyse"
  static MOBILISE: string = "mobilise"
  static VISUALISE: string = "visualise"
  static VIS_MAP: string = "map"
  static VIS_CHART: string = "chart"
}

export interface ContextMenuItem extends MenuItem {}

export class ContextBarItem {
  entityType: EntityType
  iconClass: string = ""
  enabled: boolean = false
  hidden?: boolean = false
  command: (event: any) => void
}

export enum FieldType {
  STRING,
  BOOLEAN
}

export enum FieldUIType {
  UNKNOWN,
  TEXT_NOT_EDITABLE,
  TEXT_EDITABLE,
  BOOLEAN,
  VALUE_LIST
}

export class Field {
  label: string
  defaultValue: string | boolean
  type: FieldType
  possibleValues: string[]
  value: string | boolean
  isEditable: boolean
  selectItems: SelectItem[]

  constructor(label: string,
              defaultValue: string | boolean = "",
              type: FieldType = FieldType.STRING,
              possibleValues: string[] = [],
              isEditable: boolean = false) {
    this.label = label
    this.type = type
    this.defaultValue = defaultValue
    this.possibleValues = possibleValues
    this.isEditable = isEditable
    if(possibleValues.length > 0) {
      this.value = possibleValues[0]
      this.selectItems = []
      this.possibleValues.forEach(v => this.selectItems.push({label:v, value:v}))
    }
    else
      this.value = defaultValue
  }

  updateValue(value: string | boolean) {
    this.value = value
  }

  fieldUIType(): FieldUIType {
    if(typeof this.value === "string") {
      if(this.possibleValues.length > 0)
        return FieldUIType.VALUE_LIST
      if(!this.isEditable)
        return FieldUIType.TEXT_NOT_EDITABLE
      return FieldUIType.TEXT_EDITABLE
    }
    if(typeof this.value === "boolean") {
      return FieldUIType.BOOLEAN
    }
    return FieldUIType.UNKNOWN
  }
}

export class FieldGroup {
  label: string
  fields: Field[]

  constructor(label: string,
              fields: Field[]) {
    this.label = label
    this.fields = fields
  }
}

export enum FlowEntityStatus {
  OK,
  WARNING
}

export class FlowEntity {
  id: string
  name: string
  description: string
  status: FlowEntityStatus

  constructor(id: string,
              name: string,
              description: string,
              status: FlowEntityStatus = FlowEntityStatus.OK) {
    this.id = id
    this.name = name
    this.description = description
    this.status = status
  }
}

export interface FlowEntityInfo {
  selectedFlowEntityId: string
  list(): FlowEntity[]
  info(flowEntityId: string): FieldGroup[]
  finalise(uiStateStore: UIStateStore): void
  cancel(uiStateStore: UIStateStore): void
}

export class TemplateInfo implements FlowEntityInfo {


  selectedFlowEntityId: string
  flowEntityInfoMap: Map<string, FieldGroup[]> = new Map<string, FieldGroup[]>()
  flowEntities: FlowEntity[] = []

  constructor(flowTemplates: FlowTemplate[]) {
    flowTemplates
      .forEach(ft => {
        this.flowEntities.push(new FlowEntity(ft.id, ft.name, ft.description))
        this.flowEntityInfoMap.set(ft.id, this.fieldGroups(ft))
      })
  }

  fieldGroups(flowTemplate: FlowTemplate): FieldGroup[] {
    let description = new Field("description", flowTemplate.description)
    let metadata = new FieldGroup("metadata",[description])
    return [metadata]
  }

  list(): FlowEntity[] {
    return this.flowEntities
  }

  info(flowEntityId: string): FieldGroup[] {
    return this.flowEntityInfoMap.get(flowEntityId)
  }

  finalise(uiStateStore: UIStateStore): void {
    uiStateStore.updateFlowInstantiationId(this.selectedFlowEntityId)
    uiStateStore.isTemplateInfoDialogVisible = false
  }

  cancel(uiStateStore: UIStateStore): void {
    uiStateStore.isTemplateInfoDialogVisible = false
  }
}

export enum DialogType {
  TEMPLATE_INFO
}

export class ViewsVisible {
  analyse: boolean
  mobilise: boolean
  visualise: boolean

  constructor(analyse: boolean = true,
              mobilise: boolean = true,
              visualise: boolean = true) {
    this.analyse = analyse
    this.mobilise = mobilise
    this.visualise = visualise
  }

  noViewsVisible(): number {
    if((this.analyse && !this.mobilise && !this.visualise) ||
      (!this.analyse && this.mobilise && !this.visualise) ||
      (!this.analyse && !this.mobilise && this.visualise))
      return 1
    if((!this.analyse && this.mobilise && this.visualise) ||
      (this.analyse && !this.mobilise && this.visualise) ||
      (this.analyse && this.mobilise && !this.visualise))
      return 2
    return 3
  }
}
