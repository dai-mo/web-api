import {TAB_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap"
import {CORE_DIRECTIVES, NgClass} from "@angular/common"
import {Component, OnInit, Input, ChangeDetectorRef, NgZone, ChangeDetectionStrategy} from "@angular/core"
import {FlowTab, FlowInstance} from "./flow.model"
import {FlowGraphDirective} from "./flow-graph.directive"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {KeycloakService} from "../shared/keycloak.service"
import {UIStateStore} from "../shared/ui.state.store"
import {Observable} from "rxjs"


@Component({
  selector: "flow-tabs",
  directives: [FlowGraphDirective, TAB_DIRECTIVES, CORE_DIRECTIVES, NgClass],
  templateUrl: "partials/analyse/flowtabs.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowTabsComponent implements OnInit {

  public nifiUrl: string

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private cdr:ChangeDetectorRef,
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

  @Input()
  set addFlowInstance(flowInstance: FlowInstance) {
    if(flowInstance != null) {
      let flowTabs: Array<FlowTab> = this.uiStateStore.getFlowTabs()
      let tab = new FlowTab("#" + (flowTabs.length + 1), flowInstance.id, flowInstance.name, flowInstance)
      this.uiStateStore.addFlowTab(tab)
      this.setActiveTab(tab)
    }
  }

  public deleteTab(flowTab: FlowTab) {
    let er:any = {}
    let pr:any  = {}

    pr.resource_set_name = "flow-instance:" + flowTab.id
    er.permissions = [pr]

    KeycloakService.withRptUpdate(function (rpt: string) {
      this.flowService
          .destroyInstance(flowTab.id, rpt)
          .subscribe(
              (deleteOK: boolean) => {
                if (!deleteOK)
                  alert("Flow Instance could not be deleted")
                else {
                  this.uiStateStore.removeFlowTab(flowTab)
                }
                // FIXME: Not sure why the change detection in this case needs
                //        to be triggered manually
                this.cdr.detectChanges()
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
    KeycloakService.withRptUpdate(function (rpt: string) {
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

                // FIXME: Not sure why the change detection in this case needs
                //        to be triggered manually
                this.cdr.detectChanges()
              },
              (error: any) => this.errorService.handleError(error)
          )
    }.bind(this))
  }
}