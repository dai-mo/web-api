/**
 * Created by cmathew on 15/08/16.
 */

import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {Component, Input, ViewChild} from "@angular/core"
import {Provenance} from "../analyse/flow.model"
import {TOOLTIP_DIRECTIVES} from "ng2-bootstrap"
import {ModalComponent} from "../shared/modal.component"
import {ViewManagerService} from "../shared/view-manager.service"
import {SELECT_DIRECTIVES} from "ng2-select"
import {MobiliseOverlayComponent} from "./overlay.component"

@Component({
  selector: "content",
  directives: [TOOLTIP_DIRECTIVES, SELECT_DIRECTIVES, ModalComponent, MobiliseOverlayComponent],
  templateUrl: "partials/mobilise/content.html"
})
export class ContentComponent {
  @ViewChild("dialog") public dialog: ModalComponent
  @ViewChild("moverlay") public moverlay: MobiliseOverlayComponent

  private provenances: Array<Provenance> = null

  @Input() isMainPanel:boolean = true

  private rows: Array<string> = ["last 10", "last 50", "last 100", "All"]
  private formats: Array<string> = ["raw", "csv"]
  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private viewManagerService: ViewManagerService) {

  }

  @Input()
  set showProvenance(processorId: string) {
    if(processorId != null)
      this.flowService
        .provenance(processorId)
        .subscribe(
          provenances => {
            this.provenances = provenances
            // FIXME: There are two cases for which the resulting provenance list can be empty
            // 1) the processor has just started and not registered any output
            // 2) there are no results corresponding to the query (e.g. date range)
            if(provenances.length === 0)
              this.dialog.show("Processor Output", "Output is not available. Please retry later or expand the query.")
          },
          (error: any) => {
            this.errorService.handleError(error)
            this.dialog.show("Processor Output", "Output for this processor has expired or been deleted")
          }
        )
    else
      this.provenances = null
  }

  provenanceInfo(provenance: Provenance) {
    return "<b>id:</b> " + provenance.id
  }

  hasResults(): boolean {
    return this.provenances != null && this.provenances.length > 0
  }

  selectedProcessorId(): string {
    return this.viewManagerService.selectedProcessorId
  }

  showOverlay() {
    this.moverlay.show()
  }
}