import {Component, Input, OnInit} from "@angular/core"
import {DCSError, EntityType, FlowCreation, FlowInstance, FlowTab} from "./flow.model"
import {FlowService} from "../service/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {KeycloakService} from "../shared/keycloak.service"
import {UIStateStore} from "../shared/ui.state.store"
import {ContextStore} from "../shared/context.store"
import {ContextBarItem, ContextMenuItem, ProcessorPropertiesConf, UiId} from "../shared/ui.models"
import {NotificationService} from "../shared/util/notification.service"
import {AppState, ObservableState} from "../store/state"
import {
  ADD_FLOW_TABS, REMOVE_FLOW_TAB, SELECT_FLOW_TAB, UPDATE_FLOW_INSTANCE,
  UPDATE_FLOW_INSTANCE_STATE
} from "../store/reducers"
import {ProcessorService} from "../service/processor.service"
import * as SI from "seamless-immutable"
import {Observable} from "rxjs"


@Component({
  selector: "flow-tabs",
  templateUrl: "partials/analyse/flowtabs.html"
})
export class FlowTabsComponent implements OnInit {

  public nifiUrl: string
  flowCMItems: ContextMenuItem[]

  emptyTab: FlowTab

  private stopFlowBarItem: ContextBarItem
  private startFlowBarItem: ContextBarItem

  flowTabs: Observable<FlowTab[]> = this.oss.appStore().select((state: AppState) => state.flowTabs)

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private notificationService: NotificationService,
              private oss: ObservableState,
              private uiStateStore: UIStateStore,
              private processorService: ProcessorService,
              private contextStore: ContextStore) {
    this.nifiUrl = window.location.protocol + "//" +
      window.location.host +
      "/nifi"

    this.flowCMItems =  [
      {label: "Start Flow"},
      {label: "Stop Flow"},
      {label: "Delete Flow"}
    ]
  }

  public isRunning(flowTab: FlowTab) {
    return flowTab.flowInstance.state === FlowInstance.stateRunning
  }

  public isStopped(flowTab: FlowTab) {
    return flowTab.flowInstance.state === FlowInstance.stateStopped
  }

  public isNotStarted(flowTab: FlowTab) {
    return flowTab.flowInstance.state === FlowInstance.stateNotStarted
  }

  public activeTab(): FlowTab {
    return this.oss.appState().flowTabs.find(ft => ft.active)
  }


  public selectActiveTab(index: number): void {
    let at = this.oss.appState().flowTabs[index]
    if(at) this.setActiveTab(at)
  }

  public setActiveTab(flowTab: FlowTab): void {

    this.oss.dispatch({
      type: SELECT_FLOW_TAB,
      payload: {flowTab: flowTab}
    })

    this.updateContextBarItems(flowTab)
  }

  selectTab(event: any) {
    this.oss.dispatch({
      type: SELECT_FLOW_TAB,
      payload: this.oss.appState().flowTabs[event.index]
    })
  }

  updateContextBarItems(flowTab: FlowTab) {
    this.stopFlowBarItem.enabled = this.isRunning(flowTab)
    this.startFlowBarItem.enabled = !this.isRunning(flowTab)
  }

  public toggleTabLabel(flowTab: FlowTab) {
    flowTab.labelToggle = !flowTab.labelToggle
  }

  public tabLabel(flowTab: FlowTab): string {
    if(flowTab.labelToggle)
      return flowTab.flowInstance.nameId
    else
      return flowTab.flowInstance.name
  }

  private addFlowInstance(flowInstance: FlowInstance) {
    if (flowInstance) {
      let tab = this.toFlowTab(flowInstance)
      this.addFlowTabs([tab])
    }
  }

  private addFlowTabs(flowTabs: FlowTab[]) {
    if (flowTabs !== undefined && flowTabs.length > 0) {

      this.oss.dispatch({
        type: ADD_FLOW_TABS,
        payload: {flowTabs: flowTabs}
      })
    }
  }

  private toFlowTab(flowInstance: FlowInstance): FlowTab {
    return SI.from(new FlowTab("#",
      flowInstance.id,
      flowInstance.name,
      flowInstance))
  }


  @Input()
  set instantiateFlow(flowCreation: FlowCreation) {
    if(flowCreation.instantiationId) {
      if(flowCreation.instantiationId === ""){
        // do nothing
      }
      else {
        this.instantiateTemplate(flowCreation)
      }
    }
  }

  private instantiateTemplate(flowCreation: FlowCreation): void {
    KeycloakService.withTokenUpdate(function (rpt: string) {
      this.flowService
        .instantiateTemplate(flowCreation.instantiationId, rpt)
        .subscribe(
          (flowInstance: FlowInstance) => {
            this.addFlowInstance(flowInstance)
          },
          (error: any) => {
            this.errorService.handleError(error)
            let dcsError: DCSError = error.json()
            this.dialog.show(dcsError.message, dcsError.errorMessage)
          }
        )
    }.bind(this))

  }

  public deleteTab(flowTab: FlowTab) {
    KeycloakService.withTokenUpdate(function (rpt: string) {
      this.flowService
        .destroyInstance(flowTab.id, rpt, flowTab.flowInstance.version)
        .subscribe(
          (deleteOK: boolean) => {
            if (!deleteOK)
              alert("Flow Instance could not be deleted")
            else {
              let flowTabs = this.oss.appState().flowTabs
              let flowTabIndex = flowTabs.indexOf(flowTab)
              this.oss.dispatch({
                type: REMOVE_FLOW_TAB,
                payload: {
                  flowTabId: flowTab.id,
                  index: flowTabIndex
                }
              })
            }
          },
          (error: any) => this.errorService.handleError(error)
        )
    }.bind(this))
  }

  public startFlow(flowTab: FlowTab) {
    if(flowTab) {
      this.flowService
        .startInstance(flowTab.id)
        .subscribe(
          startOK => {
            if (startOK) {
              this.oss.dispatch({
                type: UPDATE_FLOW_INSTANCE_STATE,
                payload: {
                  flowInstanceId: flowTab.flowInstance.id,
                  state: FlowInstance.stateRunning
                }
              })
              this.updateContextBarItems(flowTab)
            } else
              alert("Flow Instance failed to start")
          },
          (error: any) => this.errorService.handleError(error)
        )
    }
  }

  public refreshFlow(flowTab: FlowTab) {
    if(flowTab) {
      this.flowService
        .instance(flowTab.id)
        .subscribe(
          (flowInstance: FlowInstance) => {
            this.oss.dispatch({
              type: UPDATE_FLOW_INSTANCE,
              payload: {
                flowInstance: flowInstance
              }
            })
            this.updateContextBarItems(flowTab)
          },
          (error: any) => this.errorService.handleError(error)
        )
    }
  }

  public stopFlow(flowTab: FlowTab) {
    if(flowTab) {
      this.flowService
        .stopInstance(flowTab.id)
        .subscribe(
          stopOK => {
            if (stopOK) {
              this.oss.dispatch({
                type: UPDATE_FLOW_INSTANCE_STATE,
                payload: {
                  flowInstanceId: flowTab.flowInstance.id,
                  state: FlowInstance.stateStopped
                }
              })
              this.updateContextBarItems(flowTab)
            } else
              alert("Flow Instance failed to stop")
          },
          (error: any) => this.errorService.handleError(error)
        )
    }
  }

  getSelectedProcessorPropertiesConf(): ProcessorPropertiesConf {
    let sp = this.oss.selectedProcessor()
    if (sp !== undefined) {
      return new ProcessorPropertiesConf(sp,
        this.oss,
        this.processorService,
        this.errorService)
    }
    return undefined
  }

  ngOnInit() {
    KeycloakService.withTokenUpdate(function (rpt: string) {
      this.flowService
        .instances(rpt)
        .subscribe(
          (instances: Array<FlowInstance>) => {
            let flowTabs: FlowTab[] = instances.map((flowInstance: FlowInstance) => {
              return this.toFlowTab(flowInstance)
            })

            this.addFlowTabs(flowTabs)
          },
          (error: any) => this.errorService.handleError(error)
        )
    }.bind(this))

    this.stopFlowBarItem =  {
      view: UiId.ANALYSE,
      entityType: EntityType.FLOW_INSTANCE,
      iconClass: "fa-stop",
      enabled: false,
      command: (event) => {
        this.stopFlow(this.activeTab())
      }}
    this.startFlowBarItem = {
      view: UiId.ANALYSE,
      entityType: EntityType.FLOW_INSTANCE,
      iconClass: "fa-play",
      enabled: true,
      command: (event) => {
        this.startFlow(this.activeTab())
      }}

    let cbItems: ContextBarItem[] = [
      {
        view: UiId.ANALYSE,
        entityType: EntityType.FLOW_INSTANCE,
        iconClass: "fa-trash",
        enabled: true,
        command: (event) => {
          this.deleteTab(this.activeTab())
        }},
      this.stopFlowBarItem,
      this.startFlowBarItem,
      {
        view: UiId.ANALYSE,
        entityType: EntityType.FLOW_INSTANCE,
        iconClass: "fa-refresh",
        enabled: true,
        command: (event) => {
          this.refreshFlow(this.activeTab())
        }},
      {
        view: UiId.ANALYSE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-list-alt",
        enabled: true,
        hidden: true,
        command: () => {
          this.uiStateStore.isProcessorSchemaDialogVisible = true
        }},
      {
        view: UiId.ANALYSE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-cogs",
        enabled: true,
        hidden: true,
        command: () => {
          let conf = this.getSelectedProcessorPropertiesConf()
          if (conf !== undefined && !conf.hasEntities()) {
            this.uiStateStore.isProcessorPropertiesDialogVisible = false
            this.notificationService
              .warn({
                title: "Processor Properties",
                description: "No configurable properties for chosen processor"
              })
          } else {
            this.uiStateStore.isProcessorPropertiesDialogVisible = true
          }
        }
      }
    ]
    this.contextStore.addContextBar(UiId.ANALYSE, cbItems)
  }
}