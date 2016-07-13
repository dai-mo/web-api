/**
 * Created by cmathew on 12/07/16.
 */
/**
 * Created by cmathew on 12/07/16.
 */

import {Component} from "@angular/core"
import {WsViewComponent} from "./wsview.component"
import {ResizeDirective} from "./resize.directive"

@Component({
    selector    : "app",
    directives  : [WsViewComponent, ResizeDirective],
    templateUrl : "partials/layout.html"
})
export class App{}