import {TAB_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap"
import {CORE_DIRECTIVES, NgClass} from "@angular/common"
import {Component, OnInit, Input, ChangeDetectorRef} from "@angular/core"
import {FlowTab, FlowInstance} from "./flow.model"
import {FlowGraphDirective} from "./flow-graph.directive"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {KeycloakService} from "../shared/keycloak.service"


@Component({
  selector: "flow-tabs",
  directives: [FlowGraphDirective, TAB_DIRECTIVES, CORE_DIRECTIVES, NgClass],
  providers: [FlowService, ErrorService],
  templateUrl: "partials/analyse/flowtabs.html"
})
export class FlowTabsComponent implements OnInit {

  public nifiUrl: string
  public tabs:Array<FlowTab> = []

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private cdr: ChangeDetectorRef) {
    this.nifiUrl = window.location.protocol + "//" +
      window.location.host +
      "/nifi"
  }

  public setActiveTab(flowTab: FlowTab):void {
    this.tabs.forEach(t => {
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
      let tab = new FlowTab("#" + (this.tabs.length + 1), flowInstance.id, flowInstance.name, flowInstance)
      this.tabs.push(tab)
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
              this.tabs.filter((t: FlowTab) => t.id === flowTab.id)
                .forEach((t: FlowTab) => this.tabs.splice(this.tabs.indexOf(t), 1))
              this.cdr.detectChanges()
            }
          },
          (error: any) => this.errorService.handleError(error)
        )
    }.bind(this), er)
  }

  public startFlow(flowTab: FlowTab) {
    this.flowService
      .startInstance(flowTab.id)
      .subscribe(
        startOK => {
          if(startOK)
            flowTab.flowInstance.state = FlowInstance.stateRunning
          else
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
          this.tabs.filter(t => t.id === flowTab.id).forEach(t => t.flowInstance = flowInstance)
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  public stopFlow(flowTab: FlowTab) {
    this.flowService
      .stopInstance(flowTab.id)
      .subscribe(
        stopOK => {
          if(stopOK)
            flowTab.flowInstance.state = FlowInstance.stateStopped
          else
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
            instances.map((flowInstance: FlowInstance) => {
              let flowTab = new FlowTab("#" + (this.tabs.length + 1), flowInstance.id, flowInstance.name, flowInstance)
              this.tabs.push(flowTab)
            })
            if (this.tabs.length > 0)
              this.tabs[0].active = true
            this.cdr.detectChanges()
          },
          (error: any) => this.errorService.handleError(error)
        )
    }.bind(this))
  }
}