/**
 * Created by cmathew on 12/07/16.
 */
/**
 * Created by cmathew on 12/07/16.
 */

import {Component} from "@angular/core"
import {WsViewComponent} from "./shared/layout/ws-view.component"
import {ResizeDirective} from "./shared/layout/resize.directive"

@Component({
    selector    : "app",
    directives  : [WsViewComponent, ResizeDirective],
    templateUrl : "partials/layout.html"
})
export class App{}