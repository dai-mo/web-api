/**
 * Created by cmathew on 14/07/16.
 */
import {Component, OnInit} from "@angular/core"
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap"
import {FlowService} from "./shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {FlowGraphComponent} from "./flow-graph.component"


@Component({
    selector: "analyse",
    directives: [FlowGraphComponent, DROPDOWN_DIRECTIVES],
    providers: [FlowService, ErrorService],
    templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent implements OnInit {
    public disabled:boolean = false
    public nifiUrl: string
    public status: {
        isopen:boolean
    } = {
        isopen: false
    }
    public templates: Array<any>
    public selectedTemplate: any = null

    constructor(window: Window,
                private flowService: FlowService,
                private errorService: ErrorService) {
        this.nifiUrl = window.location.protocol + "//" +
            window.location.host +
            "/nifi"
    }

    getTemplates() {
        this.flowService
            .getTemplates()
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

    public selectTemplate(template: any): void {
        event.preventDefault()
        event.stopPropagation()
        this.status.isopen = !this.status.isopen
        this.selectedTemplate = template
    }
}
