/**
 * Created by cmathew on 05.05.17.
 */

import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core"
import {SelectItem} from "primeng/primeng"
import {Field, FieldGroup, FlowEntityConf, FlowEntityStatus} from "./ui.models"
import {UIStateStore} from "./ui.state.store"

@Component({
  selector: "flow-entity",
  templateUrl: "partials/flowentity.html"
})
/**
 * NOTE : If this component is used in a p-dialog then *ngIf needs to be added to the p-dialog
 * because the p-listbox in the this component works correctly (individual items can be selected)
 * only when the underlying SelectItem[] (of flow entities) is initialised but never updated.
 * Since the list of items can change and be updated more than once in any user session, updating the entity list
 * is a requirement. The *ngIf ensures that a new instance of this component is created everytime the p-dialog
 * is called implying a new SelectItem[] (of flow entities) of up-to-date entites.
 */

export class FlowEntityComponent implements OnInit {

  @Input() entityInfo: FlowEntityConf
  @Input() finaliseLabel: string

  private flowEntityStatus = FlowEntityStatus
  entities: SelectItem[]
  selectedEntityValue: {id: string, status: string}
  selectedEntityFieldGroups: FieldGroup[]
  selectedEntitySpecificFields: Field[]

  constructor(private uiStateStore: UIStateStore) {}

  ngOnInit() {
    this.entities = []
    if(this.entityInfo !== undefined) {
      this.entityInfo
        .list()
        .forEach(fe =>
          this.entities
            .push({
              label: fe.name,
              value: {
                id: fe.id,
                status: fe.status
              }
            })
        )
    }
    if(this.hasSingleEntity())
      this.select(this.entityInfo.list()[0].id)
  }

  hasSingleEntity(): boolean {
    return this.entities.length === 1
  }

  select(flowEntityId: string) {
    this.selectedEntityFieldGroups = this.entityInfo.fieldGroups(flowEntityId)
    this.selectedEntitySpecificFields = this.entityInfo.specificFields(flowEntityId)
    this.entityInfo.selectedFlowEntityId = flowEntityId
  }

  finalise() {
    this.entityInfo.finalise(this.uiStateStore)
  }

  cancel() {
    this.entityInfo.cancel(this.uiStateStore)
  }
}