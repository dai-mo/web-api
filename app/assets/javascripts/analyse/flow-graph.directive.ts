
import {ElementRef, Input, OnInit, Directive} from "@angular/core"
import {FlowGraph, FlowTab, FlowInstance} from "./flow.model"
import {FlowGraphService} from "./shared/flow-graph.service"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"

declare let $: any
declare let cola: any


@Directive({
  selector: "[flow-graph]",
  providers: [FlowGraphService, FlowService, ErrorService]
})

export class FlowGraphDirective {

  private el:HTMLElement

  private testGraph: FlowGraph = {
    "nodes":[
      {"label":"0","id":"0","title":"0"},
      {"label":"1","id":"1","title":"1"},
      {"label":"2","id":"2","title":"2"},
      {"label":"3","id":"3","title":"3"},
      {"label":"4","id":"4","title":"4"},
      {"label":"5","id":"5","title":"5"},
      {"label":"6","id":"6","title":"6"}
    ],
    "edges":[
      {"from":"0","to":"1","arrows":"to"},
      {"from":"1","to":"2","arrows":"to"},
      {"from":"1","to":"3","arrows":"to"},
      {"from":"2","to":"4","arrows":"to"},
      {"from":"3","to":"4","arrows":"to"},
      {"from":"4","to":"5","arrows":"to"},
      {"from":"4","to":"6","arrows":"to"}
    ]
  }


  @Input()
  set showFlowInstance(flowInstance: FlowInstance) {
    if (flowInstance != null) {
      this.flowGraphService.addFlatGraph(this.el, this.flowService.toFlowGraph(flowInstance), flowInstance.id)
      // this.flowGraphService.addFlatGraph(this.el, this.testGraph, flowInstance.id)
    } else {
      this.errorService.handleError("No Flow Instance to display")
    }
  }

  constructor(el:ElementRef,
              private flowGraphService: FlowGraphService,
              private flowService: FlowService,
              private errorService: ErrorService) {
    this.el = el.nativeElement
  }
}