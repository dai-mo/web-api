/**
 * Created by cmathew on 15/08/16.
 */

import {FlowService} from "../service/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {Component, Input} from "@angular/core"
import {Action, Provenance} from "../analyse/flow.model"
import {SelectItem} from "primeng/components/common/api"

import {UIStateStore} from "../shared/ui.state.store"

@Component({
  selector: "content",
  templateUrl: "partials/mobilise/content.html"
})
export class ContentComponent {

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
          },
          (error: any) => {
            this.errorService.handleError(error)
            // this.dialog.show("Processor Output", "Output for this processor has expired or been deleted")
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