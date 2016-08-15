
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

export class FlowGraphComponent {

  private el:HTMLElement

  @Input()
  set showFlowInstance(flowInstance: FlowInstance) {
    if (flowInstance != null) {
      this.flowGraphService.addFlatGraph(this.el, this.flowService.toFlowGraph(flowInstance), flowInstance.id)
    } else {
      this.errorService.handleError("No Flow Instance to display")
    }
  }


  private testGraph: FlowGraph = {
    "nodes":[
      {"name":"0","width":50,"height":50, "id":"0"},
      {"name":"1","width":50,"height":50, "id":"1"},
      {"name":"2","width":50,"height":50, "id":"2"},
      {"name":"3","width":50,"height":50, "id":"3"},
      {"name":"4","width":50,"height":50, "id":"4"},
      {"name":"5","width":50,"height":50, "id":"5"},
      {"name":"6","width":50,"height":50, "id":"6"}
    ],
    "links":[
      {"source":0,"target":1},
      {"source":1,"target":2},
      {"source":1,"target":3},
      {"source":2,"target":4},
      {"source":3,"target":4},
      {"source":4,"target":5},
      {"source":4,"target":6}
    ]
  }

  constructor(el:ElementRef,
              private flowGraphService: FlowGraphService,
              private flowService: FlowService,
              private errorService: ErrorService) {
    this.el = el.nativeElement
  }
}