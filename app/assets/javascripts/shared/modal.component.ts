/**
 * Created by cmathew on 20/08/16.
 */

import {BS_VIEW_PROVIDERS, MODAL_DIRECTIVES, ModalDirective} from "ng2-bootstrap"
import {Component, ViewChild} from "@angular/core"

@Component({
  selector: "modal",
  viewProviders:[BS_VIEW_PROVIDERS],
  exportAs: "dialog",
  templateUrl: "partials/modal.html"
})
export class ModalComponent {
  @ViewChild("childModal") public childModal: ModalDirective

  title: string
  message: string


  public show(title: string, message: string) {
    this.title = title
    this.message = message
    this.childModal.show()
  }

  public hide() {
    this.childModal.hide()
  }
}