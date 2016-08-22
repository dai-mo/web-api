/**
 * Created by cmathew on 20/08/16.
 */

import {CORE_DIRECTIVES} from "@angular/common"
import {MODAL_DIRECTIVES, BS_VIEW_PROVIDERS, ModalDirective} from "ng2-bootstrap"
import {Component, ViewChild, Injectable} from "@angular/core"

@Component({
  selector: "modal",
  directives: [MODAL_DIRECTIVES, CORE_DIRECTIVES],
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