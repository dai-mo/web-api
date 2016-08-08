import {TAB_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap"
import {CORE_DIRECTIVES} from "@angular/common"
import {Component, OnInit, Input} from "@angular/core"
import {FlowTemplate, FlowTab, Processor} from "./flow.model"
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


  @Input()
  set templateToInstantiate(flowTemplate: FlowTemplate) {
    if (flowTemplate != null) {
      // create a flow tab with the flow template id - this will be updated later
      // to the instantiated flow instance id
      let tab = new FlowTab("#" + (this.tabs.length + 1), flowTemplate.id, flowTemplate.name)
      this.tabs.push(tab)
      this.setActiveTab(tab)
    }
  }

  public deleteTab(flowTab: FlowTab) {
    this.flowService
      .destroyInstance(flowTab.id)
      .subscribe(
        deleteOK => {
          this.tabs.filter(t => t.id === flowTab.id).forEach(t => this.tabs.splice(this.tabs.indexOf(t), 1))
          alert("Flow Instance with id " + flowTab.id + " deleted")
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  public startFlow(flowTab: FlowTab) {
    this.flowService
      .startInstance(flowTab.id)
      .subscribe(
        (processors: Array<Processor>) => {
          if(processors.filter(p => p.status !== this.stateRunning).length > 0)
            alert("At least one processor failed to start")
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  public stopFlow(flowTab: FlowTab) {
    this.flowService
      .stopInstance(flowTab.id)
      .subscribe(
        (processors: Array<Processor>) => {
          if(processors.filter(p => p.status !== this.stateStopped).length > 0)
            alert("At least one processor failed to start")
        },
        (error: any) => this.errorService.handleError(error)
      )
  }

  ngOnInit() {
    this.flowService
      .instances()
      .subscribe(
        instances => {
          instances.map(i => {
            let flowTab = new FlowTab("#" + (this.tabs.length + 1), i.id, "Flow Instance", i)
            this.tabs.push(flowTab)
          })
          if(this.tabs.length > 0)
            this.tabs[0].active = true
        },
        (error: any) => this.errorService.handleError(error)
      )
  }
}