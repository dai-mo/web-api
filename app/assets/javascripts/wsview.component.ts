/**
 * Created by cmathew on 13/07/16.
 */
import {Component, Input} from "@angular/core"
import {WsPanelDirective} from "./wspanel.directive"

@Component({
    selector: "ws-view",
    directives: [WsPanelDirective],
    templateUrl: "partials/wsview.html"
})
export class WsViewComponent {
    @Input()  name: String
}