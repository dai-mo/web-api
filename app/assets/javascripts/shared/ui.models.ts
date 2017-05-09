import {MenuItem, SelectItem} from "primeng/primeng"
import {FlowTemplate} from "../analyse/flow.model"
import {defaultKeyValueDiffers} from "@angular/core/src/change_detection/change_detection"
/**
 * Created by cmathew on 04.05.17.
 */


export interface ContextMenuItem extends MenuItem {}

export interface ContextMenu {
  mcItems(): ContextMenuItem[]
  onTrigger(mcItem: ContextMenuItem): void
  addCMItem(mcItem: ContextMenuItem): void
}

export class FlowEntity {
  id: string
  name: string
  description: string

  constructor(id: string,
              name: string,
              description: string) {
    this.id = id
    this.name = name
    this.description = description
  }
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

export interface FlowEntityInfo {
  list(): FlowEntity[]
  info(flowEntityId: string): FieldGroup[]
}

export class TemplateInfo implements FlowEntityInfo {

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

}