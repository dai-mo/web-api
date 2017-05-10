import {Component, Input, OnInit} from "@angular/core"
import {Field, FieldGroup, FieldType, FieldUIType} from "./ui.models"
import {SelectItem} from "primeng/primeng"
/**
 * Created by cmathew on 08.05.17.
 */
@Component({
  selector: "flow-entity-info",
  templateUrl: "partials/flowentityinfo.html"
})

export class FlowEntityInfoComponent implements OnInit {

  @Input() entityFieldGroup: FieldGroup
  fields: Field[]
  private fieldUIType = FieldUIType

  ngOnInit() {
    this.fields = this.entityFieldGroup.fields
    this.fields.push(new Field("label", "This is a verrrrrry verrrry verrrry verrrry verrrry loonnnnnng description"))
    this.fields.push(new Field("check", false, FieldType.BOOLEAN))
    this.fields.push(new Field("property", "value", FieldType.STRING,[], true))
    this.fields.push(new Field("list", "", FieldType.STRING,["value1", "value2", "value3"]))
  }


}