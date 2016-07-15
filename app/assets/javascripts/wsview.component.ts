/**
 * Created by cmathew on 13/07/16.
 */
import {Component, Input} from "@angular/core"
import {WsPanelDirective} from "./wspanel.directive"
import {MobiliseComponent} from "./mobilise.component"
import {VisualiseComponent} from "./visualise/visualise.component"
import {AnalyseComponent} from "./analyse/analyse.component"

@Component({
    selector: "ws-view",
    directives: [WsPanelDirective, VisualiseComponent, MobiliseComponent, AnalyseComponent],
    templateUrl: "partials/wsview.html"
})
export class WsViewComponent {
    @Input()  name: String
}