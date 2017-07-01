import {Component, Input, OnInit, ViewChild} from "@angular/core"
import {UIStateStore} from "./ui.state.store"
import {SchemaProperties} from "../analyse/flow.model"
import {ErrorService} from "./util/error.service"
import {FlowService} from "./flow.service"
import {Field} from "./ui.models"
import {SelectItem} from "primeng/primeng"
import {SchemaPanelComponent} from "./schema-panel.component"

/**
 * Created by cmathew on 19.05.17.
 */
@Component({
  selector: "schema-property",
  templateUrl: "partials/schemapropertypanel.html"
})

export class SchemaPropertyComponent implements OnInit {
  @ViewChild(SchemaPanelComponent) schemaPanelComponent: SchemaPanelComponent

  @Input() schemaField: Field
  parameters: SelectItem[]
  selectedParameter: string
  fieldName: string

  description: string = "description"
  dynamic: boolean = false

  constructor(private uiStateStore: UIStateStore) {
    this.parameters = []
  }

  ngOnInit() {
    this.fieldName = this.schemaField.label
    this.parameters = []
    let sfs:[{
        name: string
      }] = JSON.parse(this.schemaField.defaultValue)
    sfs.forEach(sf => this.parameters.push({label: sf.name, value: sf.name}))
  }


}
