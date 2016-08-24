import {Component, ViewChild} from "@angular/core"
import {MODAL_DIRECTIVES, BS_VIEW_PROVIDERS, ModalDirective} from "ng2-bootstrap"
import {CORE_DIRECTIVES} from "@angular/common"
import {ContentComponent} from "./content.component"
import {ViewManagerService} from "../shared/view-manager.service"
/**
 * Created by cmathew on 24/08/16.
 */

@Component({
  selector: "mobilise-overlay",
  directives: [MODAL_DIRECTIVES, CORE_DIRECTIVES],
  viewProviders:[BS_VIEW_PROVIDERS],
  exportAs: "moverlay",
  templateUrl: "partials/mobilise/overlay.html"
})
export class MobiliseOverlayComponent {
  @ViewChild("lgModal") public lgModal: ModalDirective

  title: string
  message: string

  constructor(private viewManagerService: ViewManagerService) {}

  public show() {
    this.lgModal.show()
  }

  public hide() {
    this.lgModal.hide()
  }

  selectedProcessorId(): string {
    return this.viewManagerService.selectedProcessorId
  }
}
