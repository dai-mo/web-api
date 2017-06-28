import {MenuItem, Message, SelectItem} from "primeng/primeng"
import {CoreProperties, EntityType, FlowTemplate, Processor, SchemaProperties} from "../analyse/flow.model"
import {UIStateStore} from "./ui.state.store"
/**
 * Created by cmathew on 04.05.17.
 */
export interface Msg extends Message {}

export class MsgGroup {
  messages: Msg[]
  sticky: boolean = false
  delay: number = 3000

  constructor(messages: Msg[],
              sticky: boolean,
              delay: number) {
    this.messages = messages
    this.sticky = sticky
    this.delay = delay
  }
}

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
  NUMBER,
  BOOLEAN,
  UNKNOWN
}

export enum FieldUIType {
  UNKNOWN,
  TEXT_NOT_EDITABLE,
  TEXT_EDITABLE,
  BOOLEAN,
  VALUE_LIST,
  SCHEMA_FIELD
}

export class Field {
  label: string
  description: string
  defaultValue: string
  possibleValues: string[]
  type: FieldType
  level: number
  value: string
  isEditable: boolean
  selectItems: SelectItem[]

  constructor(label: string,
              description: string = "",
              defaultValue: string = "",
              possibleValues: string[] = [],
              type: FieldType = FieldType.STRING,
              value: string = "",
              isEditable: boolean = false) {
    this.label = label
    this.description = description
    this.defaultValue = defaultValue
    this.possibleValues = possibleValues
    this.type = type
    this.isEditable = isEditable
    if(value !== undefined) {
      if (possibleValues.length > 0) {
        this.value = possibleValues[0]
        this.selectItems = []
        this.possibleValues.forEach(v => this.selectItems.push({label: v, value: v}))
      }
      else
        this.value = defaultValue
    } else {
      this.value = value
    }
  }

  valueToString(value: string | number | boolean): string {
    if(typeof value === "string") {
      return value
    }

    if(typeof value === "number") {
      return value.toString()
    }

    if(typeof value === "boolean") {
      return value.toString()
    }

    return undefined
  }

  updateValue(value: string) {
    this.value = value
  }

  static fieldType(type: string): FieldType {
    switch(type) {
      case "STRING" : return FieldType.STRING
      case "NUMBER" : return FieldType.NUMBER
      case "BOOLEAN": return FieldType.BOOLEAN
      default  : return FieldType.UNKNOWN
    }
  }
  fieldUIType(): FieldUIType {
    if(this.isSchemaField())
      return FieldUIType.SCHEMA_FIELD
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

  isSchemaField(): boolean {
    // FIXME: Change hack check to use field display 'level'
    return SchemaProperties.isSchemaProperty(this.label)
  }

  isCorePropertyField(): boolean {
    // FIXME: Change hack check to use field display 'level'
    return CoreProperties.isCoreProperty(this.label)
  }
}

export class FieldGroup {
  label: string
  fields: Field[] = []

  constructor(label: string,
              fields: Field[] = []) {
    this.label = label
    if(fields === undefined)
      this.fields = []
    else
      this.fields = fields
  }

  add(field: Field) {
    this.fields.push(field)
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

export abstract class  FlowEntityConf {
  selectedFlowEntityId: string
  flowEntityFieldGroupsMap: Map<string, FieldGroup[]> = new Map<string, FieldGroup[]>()
  flowEntitySpecificFieldsMap: Map<string, Field[]> = new Map<string, Field[]>()
  flowEntities: FlowEntity[] = []

  list(): FlowEntity[] {
    return this.flowEntities
  }

  fieldGroups(flowEntityId: string): FieldGroup[] {
    return this.flowEntityFieldGroupsMap.get(flowEntityId)
  }

  specificFields(flowEntityId: string): Field[] {
    return this.flowEntitySpecificFieldsMap.get(flowEntityId)
  }

  hasEntities(): boolean {
    return this.flowEntities.length > 0
  }

  abstract finalise(uiStateStore: UIStateStore): void
  abstract cancel(uiStateStore: UIStateStore): void
}

export enum DialogType {
  TEMPLATE_INFO,
  PROCESSOR_CONF
}

export class TemplateInfo extends FlowEntityConf {

  constructor(flowTemplates: FlowTemplate[]) {
    super()
    flowTemplates
      .forEach(ft => {
        this.flowEntities.push(new FlowEntity(ft.id, ft.name, ft.description))
        this.flowEntityFieldGroupsMap.set(ft.id, this.init(ft))
      })
  }

  init(flowTemplate: FlowTemplate): FieldGroup[] {
    let description = new Field("description", "description", flowTemplate.description)
    let metadata = new FieldGroup("metadata",[description])
    return [metadata]
  }

  finalise(uiStateStore: UIStateStore): void {
    uiStateStore.updateFlowInstantiationId(this.selectedFlowEntityId)
    uiStateStore.isTemplateInfoDialogVisible = false
  }

  cancel(uiStateStore: UIStateStore): void {
    uiStateStore.isTemplateInfoDialogVisible = false
  }
}

export class ProcessorPropertiesConf extends FlowEntityConf {

  constructor(processor: Processor) {
    super()
    let properties = processor.properties
    let propertiesFieldGroup: FieldGroup = new FieldGroup("properties")
    let propertySpecificFields: Field[] = []

    processor.propertyDefinitions.forEach(pd => {
      let pvs: string[] = []
      if(pd.possibleValues !== undefined)
        pvs = pd.possibleValues.map(pv => pv.value)

      let field: Field = new Field(pd.displayName,
        pd.description,
        pd.defaultValue,
        pvs,
        Field.fieldType(pd.type),
        properties[pd.name],
        true
      )
      if(!field.isCorePropertyField()) {
        if (field.isSchemaField())
          propertySpecificFields.push(field)
        else
          propertiesFieldGroup.add(field)
      }
    })

    if(propertiesFieldGroup.fields.length > 0 || propertySpecificFields.length > 0) {
      this.flowEntities.push(new FlowEntity(processor.id, processor.id, ""))
      if(propertiesFieldGroup.fields.length > 0)
        this.flowEntityFieldGroupsMap.set(processor.id, [propertiesFieldGroup])
      if(propertySpecificFields.length > 0)
        this.flowEntitySpecificFieldsMap.set(processor.id, propertySpecificFields)
    }
  }

  finalise(uiStateStore: UIStateStore): void {
    uiStateStore.isProcessorPropertiesDialogVisible = false
  }

  cancel(uiStateStore: UIStateStore): void {
    uiStateStore.isProcessorPropertiesDialogVisible = false
  }
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
