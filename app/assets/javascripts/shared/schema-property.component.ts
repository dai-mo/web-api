import {Component, Input, OnInit} from "@angular/core"
import {UIStateStore} from "./ui.state.store"
import {SchemaProperties} from "../analyse/flow.model"
import {ErrorService} from "./util/error.service"
import {FlowService} from "./flow.service"
import {Field} from "./ui.models"
import {SelectItem} from "primeng/primeng"

/**
 * Created by cmathew on 19.05.17.
 */
@Component({
  selector: "schema-property",
  templateUrl: "partials/schemapropertypanel.html"
})

export class SchemaPropertyComponent implements OnInit {

  @Input() schemaField: Field
  parameters: SelectItem[]
  selectedParameter: string

  label: string = ""
  dynamic: boolean = false

  constructor(private uiStateStore: UIStateStore) {
    this.parameters = []
  }

  ngOnInit() {
    this.parameters = []
    switch(this.schemaField.label) {
      case SchemaProperties._FIELDS_TO_MAP:
        break
      case SchemaProperties._FIELD_ACTIONS:
        let fas:[{
          jsonPath: string,
          cmd: string,
          args: string
        }] = JSON.parse(this.schemaField.defaultValue)
        fas.forEach(fa => this.parameters.push({label: fa.cmd, value: fa.cmd}))
        this.label = "commands"
        this.dynamic = true
        break
      default:
        break
    }
  }

  save() {

  }

  cancel() {
    this.uiStateStore.isProcessorPropertiesDialogVisible = false
  }

}
