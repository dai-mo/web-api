/**
 * Created by cmathew on 14/07/16.
 */
import {Component} from "@angular/core"
import {ErrorService} from "../shared/util/error.service"
import {UIStateStore} from "../shared/ui.state.store"
import {FlowService} from "../shared/flow.service"
import {VisTab} from "../analyse/flow.model"

@Component({
  selector: "visualise",
  templateUrl: "partials/visualise/view.html"
})
export class VisualiseComponent {

  private visTypes: Array<string> = []

  constructor(private flowService: FlowService,
              private uiStateStore: UIStateStore,
              private errorService: ErrorService) {
    this.visTypes.push("map")
    this.visTypes.push("chart")
  }

  public selectVisType(event: MouseEvent, visType: string): void {
    event.preventDefault()
    event.stopPropagation()

    if(visType != null) {
      let visTab: VisTab = new VisTab(visType)
      visTab.active = true
      this.uiStateStore.addVisTab(visTab)
      // FIXME: Not sure why the change detection in this case needs
      //        to be triggered manually
      // this.cdr.detectChanges()
    }

  }


}