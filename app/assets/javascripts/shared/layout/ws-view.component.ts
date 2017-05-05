/**
 * Created by cmathew on 13/07/16.
 */
import {Component, Input, OnInit} from "@angular/core"
import {MenuItem, OverlayPanel} from "primeng/primeng"
import {ContextStore} from "../context.store"

@Component({
    selector: "ws-view",
    templateUrl: "partials/wsview.html"
})
export class WsViewComponent {
    @Input()  name: String

    constructor(private contextStore: ContextStore) {}
}