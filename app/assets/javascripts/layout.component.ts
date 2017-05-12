/**
 * Created by cmathew on 03.05.17.
 */
import {Component} from "@angular/core"
import {UiId} from "./shared/ui.models"

@Component({
  selector    : "app",
  templateUrl : "partials/layout.html"
})
export class LayoutComponent {

  uiId = UiId
}
