import {MenuItem} from "primeng/primeng"
import {FlowTemplate} from "../analyse/flow.model"
import {defaultKeyValueDiffers} from "@angular/core/src/change_detection/change_detection"
/**
 * Created by cmathew on 04.05.17.
 */


export interface ContextMenu {
  mcItems(): MenuItem[]
  onTrigger(mcItem: MenuItem): void
  addCMItem(mcItem: MenuItem): void
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

enum FieldType {
  STRING,
  BOOLEAN
}
export class Field {
  label: string
  defaultValue: string | boolean
  type: FieldType
  possibleValues: string[]
  value: string | boolean

  constructor(label: string,
              defaultValue: string | boolean = "",
              type: FieldType = FieldType.STRING,
              possibleValues: string[] = []) {
    this.label = label
    this.type = type
    this.defaultValue = defaultValue
    this.possibleValues = possibleValues
    this.value = defaultValue
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