/**
 * Created by cmathew on 14/07/16.
 */
import {Component} from "@angular/core"
import {ContentComponent} from "./content.component"
import {ViewManagerService} from "../shared/view-manager.service"

@Component({
    selector: "mobilise",
    templateUrl: "partials/mobilise/view.html",
    directives: [ContentComponent]
})
export class MobiliseComponent {

  constructor(private viewManagerService: ViewManagerService) {}

  selectedProcessorId(): string {
    return this.viewManagerService.selectedProcessorId
  }
}