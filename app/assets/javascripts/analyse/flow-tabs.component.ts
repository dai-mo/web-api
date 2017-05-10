import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core"
import {DCSError, FlowInstance, FlowTab} from "./flow.model"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {KeycloakService} from "../shared/keycloak.service"
import {UIStateStore} from "../shared/ui.state.store"


@Component({
  selector: "flow-tabs",
  templateUrl: "partials/analyse/flowtabs.html"
})
export class FlowTabsComponent implements OnInit {

  public nifiUrl: string

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private uiStateStore: UIStateStore) {
    this.nifiUrl = window.location.protocol + "//" +
      window.location.host +
      "/nifi"

  }

  public setActiveTab(flowTab: FlowTab):void {
    this.uiStateStore.getFlowTabs().forEach(t => {
      if(t === flowTab)
        t.active = true
      else
        t.active = false
    })
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
    if(flowInstance != null) {
      let flowTabs: Array<FlowTab> = this.uiStateStore.getFlowTabs()
      let tab = new FlowTab("#" + (flowTabs.length + 1), flowInstance.id, flowInstance.name, flowInstance)
      this.uiStateStore.addFlowTab(tab)
      this.setActiveTab(tab)
    }
  }

  @Input()
  set instantiateFlow(flowInstantiationId: string) {
    if(flowInstantiationId !== undefined) {
      if(flowInstantiationId === ""){
        // do nothing
      }
      else {
        this.instantiateTemplate(flowInstantiationId)
      }
    }
  }

  private instantiateTemplate(flowTemplateId: string): void {
    KeycloakService.withTokenUpdate(function (rpt: string) {
      this.flowService
        .instantiateTemplate(flowTemplateId, rpt)
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


  public deleteTab(flowTabIndex: number) {
    let flowTab: FlowTab = this.uiStateStore.getFlowTabs()[flowTabIndex]
    KeycloakService.withTokenUpdate(function (rpt: string) {
      this.flowService
        .destroyInstance(flowTab.id, rpt)
        .subscribe(
          (deleteOK: boolean) => {
            if (!deleteOK)
              alert("Flow Instance could not be deleted")
            else {
              this.uiStateStore.removeFlowTab(flowTab)
            }
          },
          (error: any) => this.errorService.handleError(error)
        )
    }.bind(this))
  }

  public startFlow(flowTab: FlowTab) {
    this.flowService
      .startInstance(flowTab.id)
      .subscribe(
        startOK => {
          if(startOK) {
            flowTab.flowInstance.state = FlowInstance.stateRunning
            this.uiStateStore.updateFlowTabs()
          } else
            alert("Flow Instance failed to start")
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  public refreshFlow(flowTab: FlowTab) {
    this.flowService
      .instance(flowTab.id)
      .subscribe(
        (flowInstance: FlowInstance) => {
          let flowTabs: Array<FlowTab> = this.uiStateStore.getFlowTabs()
          flowTabs.filter(t => t.id === flowTab.id).forEach(t => t.flowInstance = flowInstance)
          this.uiStateStore.updateFlowTabs()
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  public stopFlow(flowTab: FlowTab) {
    this.flowService
      .stopInstance(flowTab.id)
      .subscribe(
        stopOK => {
          if(stopOK) {
            flowTab.flowInstance.state = FlowInstance.stateStopped
            this.uiStateStore.updateFlowTabs()
          } else
            alert("Flow Instance failed to stop")
        },
        (error: any) => this.errorService.handleError(error)
      )
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
            }
            this.uiStateStore.addFlowTabs(flowTabs)
          },
          (error: any) => this.errorService.handleError(error)
        )
    }.bind(this))
  }
}