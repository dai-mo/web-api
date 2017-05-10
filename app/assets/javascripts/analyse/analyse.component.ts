/**
 * Created by cmathew on 14/07/16.
 */
import {Component, OnInit} from "@angular/core"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {FlowTemplate} from "./flow.model"
import {UIStateStore} from "../shared/ui.state.store"
import {ContextMenu, ContextMenuItem, DialogType, FlowEntityInfo, TemplateInfo} from "../shared/ui.models"
import {ContextStore} from "../shared/context.store"
import {Observable} from "rxjs"


@Component({
  selector: "analyse",
  templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent  implements ContextMenu, OnInit {

  public status: { isopen:boolean } = { isopen: false }
  public templates: Array<any>
  public templateEntityInfo: FlowEntityInfo
  private items: ContextMenuItem[]

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private uiStateStore: UIStateStore,
              private contextStore: ContextStore) {
  }

  templateDialogObs(): Observable<boolean> {
    return this.uiStateStore.dialogObs(DialogType.TEMPLATE_INFO)
  }

  getTemplates() {
    this.flowService
      .templates()
      .subscribe(
        templates => {
          this.templates = templates
          this.templateEntityInfo = new TemplateInfo(templates)
          this.uiStateStore.dialogDisplay(DialogType.TEMPLATE_INFO, true)
        },
        (error: any) =>  {
          this.errorService.handleError(error)
        }
      )
  }

  ngOnInit() {
    this.items = [
      {label: "Instantiate Flow", command: (event) => {
        this.showDialog()
      }},
      {label: "Create Flow"}
    ]
    this.contextStore.addContext("analyse", this)
  }

  showDialog() {
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


  onTrigger(mcItem: ContextMenuItem): void {
    // do nothing
  }

  mcItems(): ContextMenuItem[] {
    return this.items
  }

  addCMItem(mcItem: ContextMenuItem): void {
    this.items.push(mcItem)
  }
}
