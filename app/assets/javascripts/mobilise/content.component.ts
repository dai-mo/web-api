/**
 * Created by cmathew on 15/08/16.
 */

import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {Component, Input} from "@angular/core"
import {Provenance} from "../analyse/flow.model"
import {TOOLTIP_DIRECTIVES} from "ng2-bootstrap"

@Component({
  selector: "content",
  directives: [TOOLTIP_DIRECTIVES],
  templateUrl: "partials/mobilise/content.html"
})
export class ContentComponent {

  private provenances: Array<Provenance> = null

  tooltipContent = "test"
  constructor(private flowService: FlowService,
              private errorService: ErrorService) {

  }

  @Input()
  set showProvenance(processorId: string) {
    if(processorId != null)
      this.flowService
        .provenance(processorId)
        .subscribe(
          provenances => {
            this.provenances = provenances
          },
          (error: any) => this.errorService.handleError(error)
        )
    else
      this.provenances = null
  }

  provenanceInfo(provenance: Provenance) {
    return "<b>id:</b> " + provenance.id
  }
}