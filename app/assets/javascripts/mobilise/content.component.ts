/**
 * Created by cmathew on 15/08/16.
 */

import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {Component, Input, ViewChild} from "@angular/core"
import {Provenance, Action} from "../analyse/flow.model"
import {TOOLTIP_DIRECTIVES} from "ng2-bootstrap"
import {ModalComponent} from "../shared/modal.component"
import {ViewManagerService} from "../shared/view-manager.service"
import {SELECT_DIRECTIVES} from "ng2-select"
import {MobiliseOverlayComponent} from "./overlay.component"
import {SelectItem} from "primeng/components/common/api"
import {ProcessorOverlayComponent} from "./processor-overlay.component"

@Component({
  selector: "content",
  directives: [TOOLTIP_DIRECTIVES, SELECT_DIRECTIVES, ModalComponent, MobiliseOverlayComponent, ProcessorOverlayComponent],
  templateUrl: "partials/mobilise/content.html"
})
export class ContentComponent {
  @ViewChild("dialog") public dialog: ModalComponent
  @ViewChild("moverlay") public moverlay: MobiliseOverlayComponent
  @ViewChild("poverlay") public poverlay: MobiliseOverlayComponent

  private provenances: Array<Provenance> = null

  private actions: Action[] = []

  @Input() isMainPanel:boolean = true


  rowOptions: SelectItem[] = []
  selectedRowOption: string

  formatOptions: SelectItem[] = []
  selectedFormatOption: string

  private formats: Array<string> = ["raw", "csv"]

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private viewManagerService: ViewManagerService) {
    this.rowOptions = []
    this.rowOptions.push({label:"rows", value: null})
    this.rowOptions.push({label:"last 10", value:{id:1, name: "last 10", code: "last_10"}})
    this.rowOptions.push({label:"last 50", value:{id:2, name: "last 50", code: "last_50"}})
    this.rowOptions.push({label:"all", value:{id:3, name: "all", code: "all"}})

    this.formatOptions = []
    this.formatOptions.push({label:"format", value: null})
    this.formatOptions.push({label:"csv", value:{id:1, name: "csv", code: "csv"}})
    this.formatOptions.push({label:"raw", value:{id:2, name: "raw", code: "raw"}})
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

  showProcessorOverlay() {
    this.poverlay.show()
  }

  hasActions(): boolean {
    return this.actions.length > 0
  }
}