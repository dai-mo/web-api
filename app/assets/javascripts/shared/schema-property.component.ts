import {Component, Input, OnInit, ViewChild} from "@angular/core"
import {UIStateStore} from "./ui.state.store"
import {FlowInstance, Processor} from "../analyse/flow.model"
import {SchemaPanelComponent} from "./schema-panel.component"
import {ErrorService} from "./util/error.service"
import {FlowService} from "./flow.service"
import {Field} from "./ui.models"

/**
 * Created by cmathew on 19.05.17.
 */
@Component({
  selector: "schema-property",
  templateUrl: "partials/schemapropertypanel.html"
})

export class SchemaPropertyComponent {

  @Input() entityField: Field
  constructor(private uiStateStore: UIStateStore,
              private flowService: FlowService,
              private errorService:ErrorService) {}

  save() {
    // this.schemaPanelComponent.updateSchema()
    //   .subscribe(
    //     processors => {
    //       this.flowService.instance(this.uiStateStore.getActiveFlowTab().flowInstance.id)
    //         .subscribe(
    //           (flowInstance: FlowInstance) => {
    //             this.uiStateStore.getActiveFlowTab().flowInstance = flowInstance
    //             this.uiStateStore.updateFlowTabs()
    //             this.uiStateStore.isProcessorSchemaDialogVisible = false
    //           },
    //           (error: any) =>  {
    //             this.errorService.handleError(error)
    //           }
    //         )
    //     },
    //     (error: any) =>  {
    //       this.errorService.handleError(error)
    //     }
    //   )
  }

  cancel() {
    this.uiStateStore.isProcessorPropertiesDialogVisible = false
  }

}
