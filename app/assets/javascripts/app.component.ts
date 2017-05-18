/**
 * Created by cmathew on 12/07/16.
 */
/**
 * Created by cmathew on 12/07/16.
 */

import {Component} from "@angular/core"
import {FlowService} from "./shared/flow.service"

@Component({
    selector    : "app",
    template: `
   <router-outlet></router-outlet>   
  `
})
export class App {

    constructor(private flowService: FlowService) {
        this.flowService.genClientId()
    }
}