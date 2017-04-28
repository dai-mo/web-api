/**
 * Created by cmathew on 15/08/16.
 */

import {FlowService} from "../shared/flow.service";
import {ErrorService} from "../shared/util/error.service";
import {Component, Input, ViewChild} from "@angular/core";
import {Provenance, Action} from "../analyse/flow.model";
import {TOOLTIP_DIRECTIVES} from "ng2-bootstrap";
import {ModalComponent} from "../shared/modal.component";
import {SelectItem} from "primeng/components/common/api";
import {ProcessorPanelComponent} from "./processor-panel.component";
import {UIStateStore} from "../shared/ui.state.store";

@Component({
  selector: "content",
  templateUrl: "partials/mobilise/content.html"
})
export class ContentComponent {
  @ViewChild("dialog") public dialog: ModalComponent

  @ViewChild("poverlay") public poverlay: ProcessorPanelComponent

  private provenances: Array<Provenance> = null

  private actions: Action[] = []

  rowOptions: SelectItem[] = []
  selectedRowOption: string

  formatOptions: SelectItem[] = []
  selectedFormatOption: string

  private results: Array<any> = []
  private columns: Set<string>= new Set<string>()

  private formats: Array<string> = ["raw", "csv"]

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private uiStateStore:UIStateStore) {
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
    this.actions = []
    if(processorId != null)
      this.flowService
        .provenance(processorId)
        .subscribe(
          provenances => {
            this.provenances = provenances
            this.uiStateStore.setProvenances(provenances)
            this.toData(this.provenances)
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

  showProcessorOverlay() {
    this.poverlay.show()
  }

  hasActions(): boolean {
    return this.actions.length > 0
  }

  toData(provs: Array<Provenance>) {
    this.results = []
    this.columns = new Set<string>()
    if(provs != null && provs.length > 0) {
      this.results = provs.map(p => {
        let content = JSON.parse(p.content)
        let record:any = {id: ""}
        for (let key in content) {
          this.columns.add(key)
          if(content[key])
            record[key] = content[key][Object.keys(content[key])[0]]
        }
        record.id = p.id
        return record
      })
    }
  }
}