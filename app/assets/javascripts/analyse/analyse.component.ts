/**
 * Created by cmathew on 14/07/16.
 */
import {Component, OnInit} from "@angular/core"
import {FlowService} from "../service/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {FlowTemplate} from "./flow.model"
import {UIStateStore} from "../shared/ui.state.store"
import {ContextBarItem, ContextMenuItem, FlowEntityConf, TemplateInfo, UiId} from "../shared/ui.models"
import {ContextStore} from "../shared/context.store"


@Component({
  selector: "analyse",
  templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent  implements OnInit {

  public status: { isopen:boolean } = { isopen: false }
  public templates: Array<any>
  public templateEntityInfo: FlowEntityConf

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private uiStateStore: UIStateStore,
              private contextStore: ContextStore) {
  }

  getTemplates() {
    this.flowService
      .templates()
      .subscribe(
        templates => {
          this.templates = templates
          this.templateEntityInfo = new TemplateInfo(templates)
          this.uiStateStore.isTemplateInfoDialogVisible = true
        },
        (error: any) =>  {
          this.errorService.handleError(error)
        }
      )
  }

  ngOnInit() {
    let cmItems: ContextMenuItem[] = [
      {label: "Instantiate Flow", command: (event) => {
        this.showTemplateInfoDialog()
      }},
      {label: "Create Flow"}
    ]
    this.contextStore.addContextMenu(UiId.ANALYSE, cmItems)
  }

  showTemplateInfoDialog() {
    this.getTemplates()
  }


  public toggleDropdown(event:MouseEvent):void {
    event.preventDefault()
    event.stopPropagation()
    this.status.isopen = !this.status.isopen
  }

  public selectTemplate(event: MouseEvent, flowTemplate: FlowTemplate): void {
    event.preventDefault()
    event.stopPropagation()
    this.status.isopen = !this.status.isopen
  }

}
