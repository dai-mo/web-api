/**
 * Created by cmathew on 14/07/16.
 */
import {Component, OnInit} from "@angular/core"
import {Location} from "@angular/common"
import {FlowService} from "../flow.service"
import {ErrorService} from "../error.service"
import {FlowGraphDirective} from "./flow-graph.directive"

@Component({
    selector: "analyse",
    directives: [FlowGraphDirective],
    providers: [FlowService, ErrorService],
    templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent implements OnInit {
    nifiUrl: string
    templates: Array<any>
    status: boolean

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

}
