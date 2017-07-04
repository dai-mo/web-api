import {Component, Input, OnInit} from "@angular/core"
import {DCSError, EntityType, FlowCreation, FlowInstance, FlowTab} from "./flow.model"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {KeycloakService} from "../shared/keycloak.service"
import {UIStateStore} from "../shared/ui.state.store"
import {ContextStore} from "../shared/context.store"
import {ContextBarItem, ContextMenuItem, ProcessorPropertiesConf, UiId} from "../shared/ui.models"
import {NotificationService} from "../shared/util/notification.service"


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

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private notificationService: NotificationService,
              private uiStateStore: UIStateStore,
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

  public activeTab(): FlowTab {
    return this.uiStateStore.getFlowTabs().find(ft => ft.active)
  }


  public selectActiveTab(index: number): void {
    let at = this.uiStateStore.getFlowTabs()[index]
    if(at) this.setActiveTab(at)
  }

  public setActiveTab(flowTab: FlowTab):void {
    flowTab.active = true
    this.uiStateStore.getFlowTabs().forEach(t => {
      if(t !== flowTab)
        t.active = false
    })
    this.updateContextBarItems(flowTab)
  }

  updateContextBarItems(flowTab: FlowTab) {
    this.stopFlowBarItem.enabled = flowTab.isRunning()
    this.startFlowBarItem.enabled = !flowTab.isRunning()
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
      let flowTabs: Array<FlowTab> = this.uiStateStore.getFlowTabs()
      let tab = new FlowTab("#" + (flowTabs.length + 1), flowInstance.id, flowInstance.name, flowInstance)
      this.setActiveTab(tab)
      this.uiStateStore.addFlowTab(tab)
    }
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
              let flowTabs = this.uiStateStore.getFlowTabs()
              let flowTabIndex = flowTabs.indexOf(flowTab)
              if(flowTabs.length > 1)
                if(flowTabIndex === 0 )
                  this.selectActiveTab(1)
                else
                  this.selectActiveTab(flowTabIndex - 1)
              this.uiStateStore.removeFlowTab(flowTab)
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
              flowTab.flowInstance.state = FlowInstance.stateRunning
              this.uiStateStore.updateFlowTabs()
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
            let flowTabs: Array<FlowTab> = this.uiStateStore.getFlowTabs()
            flowTabs.filter(t => t.id === flowTab.id).forEach(t => t.flowInstance = flowInstance)
            this.uiStateStore.updateFlowTabs()
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
              flowTab.flowInstance.state = FlowInstance.stateStopped
              this.uiStateStore.updateFlowTabs()
              this.updateContextBarItems(flowTab)
            } else
              alert("Flow Instance failed to stop")
          },
          (error: any) => this.errorService.handleError(error)
        )
    }
  }

  ngOnInit() {
    KeycloakService.withTokenUpdate(function (rpt: string) {
      this.flowService
        .instances(rpt)
        .subscribe(
          (instances: Array<FlowInstance>) => {
            let flowTabs: FlowTab[] = []
            instances.map((flowInstance: FlowInstance) => {
              let flowTab = new FlowTab("#" + (flowTabs.length + 1), flowInstance.id, flowInstance.name, flowInstance)
              flowTabs.push(flowTab)
            })

            if (flowTabs.length > 0) {
              flowTabs[0].active = true
              this.emptyTab = undefined
            } else {
              this.emptyTab = new FlowTab("...")
            }

            this.uiStateStore.addFlowTabs(flowTabs)
            this.selectActiveTab(flowTabs.length - 1)
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
          let conf: ProcessorPropertiesConf =
            this.uiStateStore.getSelectedProcessorPropertiesConf()
          if(conf === undefined || !conf.hasEntities()) {
            this.uiStateStore.isProcessorPropertiesDialogVisible = false
            this.notificationService
              .warn({
                title: "Processor Properties",
                description: "No configurable properties for chosen processor"})
          } else {
            this.uiStateStore.isProcessorPropertiesDialogVisible = true
          }
        }}
    ]
    this.contextStore.addContextBar(UiId.ANALYSE, cbItems)
  }
}