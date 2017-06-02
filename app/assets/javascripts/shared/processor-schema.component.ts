import {Component, Input, OnInit} from "@angular/core"
import {UIStateStore} from "./ui.state.store"
import {Processor} from "../analyse/flow.model"

/**
 * Created by cmathew on 19.05.17.
 */
@Component({
  selector: "processor-schema",
  templateUrl: "partials/processorschema.html"
})

export class ProcessorSchemaComponent{

  constructor(private uiStateStore: UIStateStore) {}

  save() {
    // do nothing
  }

  cancel() {
    this.uiStateStore.isProcessorSchemaDialogVisible = false
  }

}
