/**
 * Created by cmathew on 05.05.17.
 */

import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core"
import {SelectItem} from "primeng/primeng"
import {FieldGroup, FlowEntityInfo, FlowEntityStatus} from "./ui.models"

@Component({
  selector: "flow-entity",
  templateUrl: "partials/flowentity.html"
})
/**
 * NOTE : If this component is used in a p-dialog then *ngIf needs to be added to the p-dialog
 * because the p-listbox in the this component works correctly (individual items can be selected)
 * only when the underlying SelectItem[] (of flow entities) is initialised but never updated.
 * Since the list of can change and be updated more than once in any user session, updating the entity list
 * is a requirement. The *ngIf ensures that a new instance of this component is created everytime the p-dialog
 * is called implying a new SelectItem[] (of flow entities) of up-to-date entites.
 */

export class FlowEntityComponent implements OnInit {

  @Input() entityInfo: FlowEntityInfo
  @Input() finaliseLabel: string

  private flowEntityStatus = FlowEntityStatus
  entities: SelectItem[]
  selectedEntityValue: {id: string, status: string}
  selectedEntityFieldGroups: FieldGroup[]

  ngOnInit() {
    this.entities = []
    if(this.entityInfo)
      this.entityInfo.list().forEach(fe => this.entities.push({label:fe.name, value:{ id: fe.id, status:fe.status}}))

  }

  select(flowEntityId: string) {
    this.selectedEntityFieldGroups = this.entityInfo.info(flowEntityId)
  }
}