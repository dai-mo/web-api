///<reference path="../../../../typings/globals/webcola/index.d.ts"/>

import {ElementRef, Directive, Input, OnInit} from "@angular/core"
import {FlowTemplate, FlowGraph} from "./flow.model"
import {FlowGraphService} from "./shared/flow-graph.service"

declare let $: any
declare let cola: any


@Directive({
  selector: "[flow-graph]",
  providers: [FlowGraphService]
})

export class PowerFlowGraphDirective implements OnInit {

  @Input() flowTemplate: FlowTemplate = new FlowTemplate()


  ngOnInit() {
    console.log(this.flowTemplate.id)
  }

  private el:HTMLElement

  private graph: FlowGraph = {
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
              private flowGraphService: FlowGraphService) {
    flowGraphService.addFlatGraph(el.nativeElement, this.graph)
  }
}