
import {ElementRef, Input, OnInit, Directive, ChangeDetectionStrategy} from "@angular/core"
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

  @Input()
  set showFlowInstance(flowInstance: FlowInstance) {
    if (flowInstance != null) {
      this.flowGraphService.addFlatGraph(this.el, this.flowService.toFlowGraph(flowInstance), flowInstance.id)
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