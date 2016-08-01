import {TAB_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap"
import {CORE_DIRECTIVES} from "@angular/common"
import {Component, OnInit, Input} from "@angular/core"
import {FlowTemplate, FlowTab, FlowInstance} from "./flow.model"
import {FlowGraphComponent} from "./flow-graph.component"


@Component({
  selector: "flow-tabs",
  directives: [FlowGraphComponent, TAB_DIRECTIVES, CORE_DIRECTIVES],
  templateUrl: "partials/analyse/flowtabs.html"
})
export class FlowTabsComponent implements OnInit {
  public tabs:Array<FlowTab> = []

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
      let tab = new FlowTab("#" + (this.tabs.length + 1), FlowTab.TemplateType, flowTemplate.id, flowTemplate.name)
      this.tabs.push(tab)
      this.setActiveTab(tab)
    }
  }

  // set instanceToAdd(flowInstance: FlowInstance) {
  //
  // }

  ngOnInit() {
    if(this.tabs.length > 0)
      this.tabs[0].active = true
  }


}