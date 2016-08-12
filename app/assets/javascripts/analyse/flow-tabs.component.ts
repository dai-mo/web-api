import {TAB_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap"
import {CORE_DIRECTIVES} from "@angular/common"
import {Component, OnInit, Input} from "@angular/core"
import {FlowTemplate, FlowTab, Processor, FlowInstance} from "./flow.model"
import {FlowGraphComponent} from "./flow-graph.component"
import {FlowService} from "./shared/flow.service"
import {ErrorService} from "../shared/util/error.service"


@Component({
  selector: "flow-tabs",
  directives: [FlowGraphComponent, TAB_DIRECTIVES, CORE_DIRECTIVES],
  providers: [FlowService, ErrorService],
  templateUrl: "partials/analyse/flowtabs.html"
})
export class FlowTabsComponent implements OnInit {

  public nifiUrl: string
  public tabs:Array<FlowTab> = []


  private stateRunning = "RUNNING"
  private stateStopped = "STOPPED"

  constructor(private flowService: FlowService,
              private errorService: ErrorService) {
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
    this.flowService
      .destroyInstance(flowTab.id)
      .subscribe(
        deleteOK => {
          if(!deleteOK)
            alert("Flow Instance could not be deleted")
          else
            this.tabs.filter(t => t.id === flowTab.id).forEach(t => this.tabs.splice(this.tabs.indexOf(t), 1))
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  public startFlow(flowTab: FlowTab) {
    this.flowService
      .startInstance(flowTab.id)
      .subscribe(
        startOK => {
          if(!startOK)
            alert("Flow Instance failed to start")
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  public stopFlow(flowTab: FlowTab) {
    this.flowService
      .stopInstance(flowTab.id)
      .subscribe(
        stopOK => {
          if(!stopOK)
            alert("Flow Instance failed to stop")
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  ngOnInit() {
    this.flowService
      .instances()
      .subscribe(
        instances => {
          instances.map(flowInstance => {
            let flowTab = new FlowTab("#" + (this.tabs.length + 1), flowInstance.id, flowInstance.name, flowInstance)
            this.tabs.push(flowTab)
          })
          if(this.tabs.length > 0)
            this.tabs[0].active = true
        },
        (error: any) => this.errorService.handleError(error)
      )
  }
}