/**
 * Created by cmathew on 14/07/16.
 */
import {Component} from "@angular/core"
import {ContentComponent} from "./content.component"
import {UIStateStore} from "../shared/ui.state.store"

@Component({
    selector: "mobilise",
    templateUrl: "partials/mobilise/view.html",
    directives: [ContentComponent]
})
export class MobiliseComponent {

  constructor(private uiStateStore: UIStateStore) {
  }

}