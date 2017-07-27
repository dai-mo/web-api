import {Component} from "@angular/core"
import {UIStateStore} from "./ui.state.store"
import {ObservableState} from "../store/state"
import {
  ComponentType,
  Connectable,
  Connection,
  ConnectionConfig,
  CoreProperties,
  FlowInstance,
  Processor,
  RemoteRelationship
} from "../analyse/flow.model"
import {FlowUtils} from "./util/ui.utils"
import {ConnectionService} from "../service/connection.service"
import {ErrorService} from "./util/error.service"
import {SELECT_PROCESSOR, UPDATE_FLOW_INSTANCE} from "../store/reducers"
import {FlowService} from "../service/flow.service"

/**
 * Created by cmathew on 20.07.17.
 */
@Component({
  selector: "relationships",
  templateUrl: "partials/relationshipspanel.html"
})
export class RelationshipsComponent {
  flowInstanceId: string
  sourceProcessor: Processor
  destinationProcessor: Processor
  sourceConnections: Connection[]
  rels: RemoteRelationship[]

  selectedRel: string

  connections: any = {}


  constructor(private connectionService: ConnectionService,
              private flowService: FlowService,
              private errorService: ErrorService,
              private uiStateStore: UIStateStore,
              private oss:ObservableState) {
    this.flowInstanceId = this.oss.activeFlowTab().flowInstance.id
    this.sourceProcessor = this.oss.selectedProcessor()
    this.destinationProcessor = this.oss.processorToConnect()
    this.sourceConnections = this.oss.connectionsForSourceProcessor(this.oss.selectedProcessor().id)
    this.rels = this.sourceProcessor.relationships
    this.rels.forEach(r => this.connections[r.id] = this.label(r))
  }

  save() {
    this.oss.dispatch({type: SELECT_PROCESSOR, payload: {id: ""}})
    if(this.selectedRel !== undefined) {


      let source: Connectable = {
        id: this.sourceProcessor.id,
        componentType: ComponentType.PROCESSOR,
        flowInstanceId: this.flowInstanceId,
        properties: {
          [CoreProperties._PROCESSOR_TYPE]: this.sourceProcessor.processorType
        }
      }


      let destination: Connectable = {
        id: this.destinationProcessor.id,
        componentType: ComponentType.PROCESSOR,
        flowInstanceId: this.flowInstanceId,
        properties: {
          [CoreProperties._PROCESSOR_TYPE]: this.destinationProcessor.processorType
        }
      }

      let connectionConfig: ConnectionConfig = {
        flowInstanceId: this.flowInstanceId,
        source: source,
        destination: destination,
        selectedRelationships: [this.selectedRel],
        availableRelationships: []
      }

      this.connectionService
        .create(connectionConfig)
        .subscribe(
          (connection: Connection) => {
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
            this.uiStateStore.isRelationshipsSettingsDialogVisible = false
          },
          (error: any) => {
            this.errorService.handleError(error)
          }
        )
    }
  }

  cancel() {
    this.uiStateStore.isRelationshipsSettingsDialogVisible = false
    this.oss.dispatch({type: SELECT_PROCESSOR, payload: {id: ""}})
  }

  ok() {
    this.uiStateStore.isRelationshipsInfoDialogVisible = false
    this.oss.dispatch({type: SELECT_PROCESSOR, payload: {id: ""}})
  }

  select(event: any) {
    this.connections[this.selectedRel] = this.destination(this.rels.find(r => r.id === this.selectedRel))
  }

  destination(rel: RemoteRelationship): string {
    if(rel.autoTerminate)
      return "auto-terminate"
    else
      return this.oss.connectionsForSourceProcessor(this.oss.selectedProcessor().id)
        .map(c => FlowUtils.processorServiceClassName(this.oss.processor(c.config.destination.id))).join()
  }

  label(rel: RemoteRelationship): string {
    return rel.id + " -> " + this.destination(rel)
  }
}