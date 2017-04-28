/**
 * Created by cmathew on 12/07/16.
 */
/**
 * Created by cmathew on 12/07/16.
 */

import {Component, ViewContainerRef} from "@angular/core"
import {WsViewComponent} from "./shared/layout/ws-view.component"
import {ResizeDirective} from "./shared/layout/resize.directive"

@Component({
    selector    : "app",
    templateUrl : "partials/layout.html"
})
export class App{
    // FIXME: This hack is to make the ng2-bootstrap modal work
    // http://valor-software.com/ng2-bootstrap/#/modals
    viewContainerRef: ViewContainerRef
    public constructor(viewContainerRef:ViewContainerRef) {
        // You need this small hack in order to catch application root view container ref
        this.viewContainerRef = viewContainerRef
    }
}