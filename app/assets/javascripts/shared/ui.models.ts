import {MenuItem, Message, SelectItem} from "primeng/primeng"
import {
  Configuration,
  CoreProperties,
  EntityType,
  FlowInstance,
  FlowTemplate,
  MetaData,
  Processor,
  ProcessorDetails,
  ProcessorServiceDefinition,
  PropertyDefinition,
  RemoteRelationship,
  SchemaProperties
} from "../analyse/flow.model"
import {UIStateStore} from "./ui.state.store"
import {ProcessorService} from "../service/processor.service"
import {ErrorService} from "./util/error.service"
import {ObservableState} from "../store/state"
import {
  ADD_FLOW_TABS,
  UPDATE_FLOW_INSTANCE,
  UPDATE_SELECTED_FLOW_ENTITY_CONF,
  UPDATE_SELECTED_PROCESSOR
} from "../store/reducers"
import {FlowService} from "../service/flow.service"
import {KeycloakService} from "./keycloak.service"
import {FlowUtils, JSUtils, UIUtils} from "./util/ui.utils"
import {Observable} from "rxjs"

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
  view: string
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
  name: string
  label: string
  description: string
  defaultValue: string
  possibleValues: string[]
  type: FieldType
  level: number
  value: string
  isEditable: boolean
  selectItems: SelectItem[]
  isRequired: boolean
  collector: () => any
  active: boolean = false

  constructor(name: string,
              label: string,
              description: string = "",
              defaultValue: string = "",
              possibleValues: string[] = [],
              type: FieldType = FieldType.STRING,
              value: string = "",
              isEditable: boolean = false,
              isRequired: boolean = false) {
    this.name = name
    this.label = label
    this.description = description
    this.defaultValue = defaultValue
    this.possibleValues = possibleValues
    this.type = type
    this.value = value
    this.isEditable = isEditable
    this.isRequired = isRequired
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

  setCollector(collector: () => any) {
    this.collector = collector
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

  static fromPDef(pd: PropertyDefinition, value: string, isEditable: boolean): Field {
    let pvs: string[] = []
    if(pd.possibleValues !== undefined)
      pvs = pd.possibleValues.map(pv => pv.value)
    return new Field(pd.name,
      pd.displayName,
      pd.description,
      pd.defaultValue,
      pvs,
      Field.fieldType(pd.type),
      value,
      isEditable
    )
  }


}

export class FieldGroup {
  label: string
  fields: Field[] = []
  active: boolean = false
  collector: () => any

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

  setCollector(collector: () => any) {
    this.collector = collector
  }

  static fromMetaData(metadata: MetaData): FieldGroup {
    let fields: Field[] = []

    fields.push(new Field("description", "description", "", "", [], FieldType.STRING,metadata.description))

    let tagsStr = metadata.tags.reduce(function(agg, value) {
      return agg === "" ? value : agg + " , " + value
    }, "")

    fields.push(new Field("tags", "tags", "", "", [], FieldType.STRING, tagsStr))

    let relatedStr = metadata.related.reduce(function(agg, value) {
      return agg === "" ? value : agg + " , " + value
    }, "")

    fields.push(new Field("related", "related", "", "", [], FieldType.STRING, relatedStr))
    return  new FieldGroup("metadata", fields)
  }

  static fromConfiguration(configuration: Configuration): FieldGroup {
    let fields: Field[] = []

    fields.push(new Field("processor class", "processor class", "", "", [], FieldType.STRING, configuration.processorClassName))
    fields.push(new Field("stateful", "stateful", "", "", [], FieldType.STRING, configuration.stateful.toString()))
    fields.push(new Field("trigger type", "trigger type", "", "", [], FieldType.STRING, configuration.triggerType))

    return new FieldGroup("configuration", fields)
  }

  static fromRelationships(relationships: RemoteRelationship[]): FieldGroup {
    let fields: Field[] = []

    relationships.forEach(r => fields.push(new Field(r.id, r.id, r.description, "", [], FieldType.STRING, r.description)))

    return new FieldGroup("relationships", fields)
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
  state?: any

  constructor(id: string,
              name: string,
              description: string,
              status: FlowEntityStatus = FlowEntityStatus.OK,
              state?: any) {
    this.id = id
    this.name = name
    this.description = description
    this.status = status
    this.state = state
  }
}

export abstract class  FlowEntityConf {
  selectedFlowEntityId: string
  flowEntityFieldGroupsMap: Map<string, FieldGroup[]> = new Map<string, FieldGroup[]>()
  flowEntitySpecificFieldsMap: Map<string, Field[]> = new Map<string, Field[]>()
  flowEntities: FlowEntity[] = []

  hideCancel: boolean = false

  constructor(private osstate: ObservableState) {}

  list(): FlowEntity[] {
    return this.flowEntities
  }

  fieldGroups(flowEntityId: string): FieldGroup[] {
    return this.flowEntityFieldGroupsMap.get(flowEntityId)
  }

  selectedEntityFieldGroups(): FieldGroup[] {
    return this.fieldGroups(this.selectedFlowEntityId)
  }

  specificFields(flowEntityId: string): Field[] {
    return this.flowEntitySpecificFieldsMap.get(flowEntityId)
  }

  selectedEntitySpecificFields(): Field[] {
    return this.specificFields(this.selectedFlowEntityId)
  }

  hasEntities(): boolean {
    return this.flowEntities.length > 0
  }

  isSelected(): boolean {
    return this.selectedFlowEntityId !== undefined
  }

  select(flowEntityId: string): void {
    this.selectedFlowEntityId = flowEntityId
    let sefgs = this.selectedEntityFieldGroups()

    if(sefgs !== undefined && sefgs.length > 0)
      sefgs[0].active = true
    else {
      let sesfs = this.selectedEntitySpecificFields()
      if(sesfs !== undefined && sesfs.length > 0)
        sesfs[0].active = true
    }

    this.osstate.dispatch({
      type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
      payload: {flowEntityConf:  this}
    })
  }

  abstract finalise(uiStateStore: UIStateStore, data?: any): void

  abstract cancel(uiStateStore: UIStateStore): void
}


export class TemplateInfo extends FlowEntityConf {

  constructor(flowTemplates: FlowTemplate[],
              private oss: ObservableState) {
    super(oss)
    flowTemplates
      .forEach(ft => {
        this.flowEntities.push(new FlowEntity(ft.id, ft.name, ft.description))
        this.flowEntityFieldGroupsMap.set(ft.id, this.genFieldGroups(ft))
      })
  }

  genFieldGroups(flowTemplate: FlowTemplate): FieldGroup[] {
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

export class FlowCreation extends FlowEntityConf {

  private readonly FLOW_NAME = "name"

  constructor(private oss: ObservableState,
              private flowService: FlowService,
              private errorService: ErrorService) {
    super(oss)

    this.selectedFlowEntityId = this.FLOW_NAME
    this.flowEntities.push(new FlowEntity(this.FLOW_NAME, this.FLOW_NAME, ""))

    let name: Field = new Field(this.FLOW_NAME, this.FLOW_NAME, "Flow Name", "", [], FieldType.STRING, "", true, true)
    this.flowEntityFieldGroupsMap.set(this.FLOW_NAME, [new FieldGroup("Flow Details", [name])])
    this.select(this.selectedFlowEntityId)
  }



  finalise(uiStateStore: UIStateStore, data?: any): void {
    KeycloakService.withTokenUpdate(function (rpt: string) {
      this.flowService.create(data.name, rpt)
        .subscribe(
          (flowInstance: FlowInstance) => {
            let tab = UIUtils.toFlowTab(flowInstance)
            this.oss.dispatch({
              type: ADD_FLOW_TABS,
              payload: {flowTabs: [tab]}
            })
            uiStateStore.setFlowCreationDialogVisible(false)
          },
          (error: any) => {
            this.errorService.handleError(error)
          }
        )
    }.bind(this))
  }

  cancel(uiStateStore: UIStateStore): void {
    uiStateStore.isFlowCreationDialogVisible = false
  }
}

export class ProcessorConf extends FlowEntityConf {


  constructor(defs: ProcessorServiceDefinition[],
              private oss: ObservableState,
              private flowService: FlowService,
              private processorService: ProcessorService,
              private errorService: ErrorService) {
    super(oss)
    defs.forEach(d => this.flowEntities
      .push(
        new FlowEntity(d.processorServiceClassName,
          d.processorServiceClassName,
          "",
          FlowEntityStatus.OK,
          d)))
    if(this.flowEntities.length === 1)
      this.select(this.flowEntities[0].id)
  }

  select(flowEntityId: string): void {
    let selectedFlowEntity = this.flowEntities.find(fe => fe.id === flowEntityId)
    if(selectedFlowEntity !== undefined) {
      let details: Observable<ProcessorDetails>
      if(selectedFlowEntity.state.stateful !== undefined)
        details = this.processorService.details(flowEntityId, selectedFlowEntity.state.stateful)
      else
        details = this.processorService.details(flowEntityId)
      details.subscribe(
        (details: ProcessorDetails) => {
          this.flowEntityFieldGroupsMap
            .set(flowEntityId,
              [FieldGroup.fromMetaData(details.metadata),
                FieldGroup.fromConfiguration(details.configuration),
                FieldGroup.fromRelationships(details.relationships)])
          super.select(flowEntityId)
        },
        (error: any) => {
          this.errorService.handleError(error)
        }
      )
    }
  }


  finalise(uiStateStore: UIStateStore): void {
    let selectedFlowEntity =
      this.flowEntities.find(fe => fe.id === this.selectedFlowEntityId)
    let flowInstanceId = this.oss.activeFlowTab().flowInstance.id
    if(flowInstanceId !== undefined && selectedFlowEntity !== undefined)
      this.processorService.create(flowInstanceId, selectedFlowEntity.state)
        .subscribe(
          (processor: Processor) => {
            uiStateStore.isProcessorConfDialogVisible = false
            this.flowService.instance(this.oss.activeFlowTab().flowInstance.id)
              .subscribe(
                (flowInstance: FlowInstance) => {
                  this.oss.dispatch({
                    type: UPDATE_FLOW_INSTANCE,
                    payload: {
                      flowInstance: flowInstance
                    }
                  })
                },
                (error: any) =>  {
                  this.errorService.handleError(error)
                }
              )
          },
          (error: any) => {
            this.errorService.handleError(error)
          }
        )
  }

  cancel(uiStateStore: UIStateStore): void {
    uiStateStore.isProcessorConfDialogVisible = false
  }

}

export class ProcessorInfo extends FlowEntityConf {

  constructor(processorServiceClassName: string,
              processorDetails: ProcessorDetails,
              private oss: ObservableState,
              private processorService: ProcessorService,
              private errorService: ErrorService) {
    super(oss)
    this.flowEntities
      .push(
        new FlowEntity(processorServiceClassName,
          processorServiceClassName,
          "",
          FlowEntityStatus.OK,
          processorServiceClassName))
    this.flowEntityFieldGroupsMap
      .set(processorServiceClassName,
        [FieldGroup.fromMetaData(processorDetails.metadata),
          FieldGroup.fromConfiguration(processorDetails.configuration),
          FieldGroup.fromRelationships(processorDetails.relationships)])
    this.hideCancel = true
    super.select(processorServiceClassName)
  }


  finalise(uiStateStore: UIStateStore): void {
    uiStateStore.isProcessorInfoDialogVisible = false
  }

  cancel(uiStateStore: UIStateStore): void {
    uiStateStore.isProcessorInfoDialogVisible = false
  }

}

export class ProcessorPropertiesConf extends FlowEntityConf {

  private processor: Processor
  private properties: any
  private propertiesFieldGroup: FieldGroup
  private propertySpecificFields: Field[]

  constructor(processor: Processor,
              private oss: ObservableState,
              private processorService: ProcessorService,
              private errorService: ErrorService) {
    super(oss)
    this.processor = processor
    this.selectedFlowEntityId = processor.id
    this.properties = processor.properties
    this.propertiesFieldGroup= new FieldGroup("properties")
    this.propertySpecificFields = []

    processor.propertyDefinitions.forEach(pd => {
      let pvs: string[] = []
      if(pd.possibleValues !== undefined)
        pvs = pd.possibleValues.map(pv => pv.value)

      let field: Field = Field.fromPDef(pd, this.properties[pd.name], true)

      if(!field.isCorePropertyField()) {
        if (field.isSchemaField())
          this.propertySpecificFields.push(field)
        else
          this.propertiesFieldGroup.add(field)
      }
    })

    if(this.propertiesFieldGroup.fields.length > 0 || this.propertySpecificFields.length > 0) {
      this.flowEntities.push(new FlowEntity(processor.id, processor.processorType, ""))
      if(this.propertiesFieldGroup.fields.length > 0)
        this.flowEntityFieldGroupsMap.set(processor.id, [this.propertiesFieldGroup])
      if(this.propertySpecificFields.length > 0)
        this.flowEntitySpecificFieldsMap.set(processor.id, this.propertySpecificFields)
    }
  }

  finalise(uiStateStore: UIStateStore, data?: any): void {

    if(!JSUtils.isUndefinedOrEmpty(data)) {
      let properties = FlowUtils.addCoreProperties(this.processor, data)
      this.processorService
        .updateProperties(FlowUtils.processorServiceClassName(this.processor), this.processor.id, properties)
        .subscribe(
          (processor: Processor) => {
            if (processor.validationErrors !== undefined)
              this.errorService.handleValidationErrors([processor.validationErrors])
            else {
              this.oss.dispatch({type: UPDATE_SELECTED_PROCESSOR, payload: {processor: processor}})
              uiStateStore.isProcessorPropertiesDialogVisible = false
              uiStateStore.setProcessorPropertiesToUpdate(undefined)
            }
          },
          (error: any) => {
            this.errorService.handleError(error)
          }
        )
    }
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
              mobilise: boolean = false,
              visualise: boolean = false) {
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
