/**
 * Created by cmathew on 14/07/16.
 */
import {Component, OnInit} from "@angular/core"
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {FlowGraphComponent} from "./flow-graph.component"
import {FlowTabsComponent} from "./flow-tabs.component"
import {FlowTemplate, FlowInstance, FlowTab} from "./flow.model"


@Component({
    selector: "analyse",
    directives: [FlowTabsComponent, DROPDOWN_DIRECTIVES],
    providers: [FlowService, ErrorService],
    templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent implements OnInit {
    public disabled:boolean = false

    public status: {
        isopen:boolean
    } = {
        isopen: false
    }
    public templates: Array<any>
    public flowInstanceToAdd: FlowInstance = null

    constructor(window: Window,
                private flowService: FlowService,
                private errorService: ErrorService) {

    }

    getTemplates() {
        this.flowService
            .templates()
            .subscribe(
                templates => {
                    this.templates = templates
                },
                (error: any) => this.errorService.handleError(error)
            )
    }

    ngOnInit() {
        this.getTemplates()
    }


    public toggleDropdown(event:MouseEvent):void {
        event.preventDefault()
        event.stopPropagation()
        this.status.isopen = !this.status.isopen
    }

    public selectTemplate(event: MouseEvent, flowTemplate: FlowTemplate): void {
        event.preventDefault()
        event.stopPropagation()
        this.status.isopen = !this.status.isopen
        this.instantiateTemplate(flowTemplate)
    }

    private instantiateTemplate(flowTemplate: FlowTemplate): void {
        this.flowService
          .instantiateTemplate(flowTemplate.id)
          .subscribe(
            (flowInstance: FlowInstance) => {
                this.flowInstanceToAdd = flowInstance
            },
            (error:any) => this.errorService.handleError(error)
          )
    }
}
