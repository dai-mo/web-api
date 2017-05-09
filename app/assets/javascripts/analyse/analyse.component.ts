/**
 * Created by cmathew on 14/07/16.
 */
import {ChangeDetectorRef, Component, OnInit} from "@angular/core"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {DCSError, FlowInstance, FlowTemplate} from "./flow.model"
import {KeycloakService} from "../shared/keycloak.service"
import {UIStateStore} from "../shared/ui.state.store"
import {MenuItem} from "primeng/primeng"
import {ContextMenu, ContextMenuItem, FlowEntityInfo, TemplateInfo} from "../shared/ui.models"
import {ContextStore} from "../shared/context.store"


@Component({
  selector: "analyse",
  templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent  implements ContextMenu, OnInit {

  private templatePanelDisplay: boolean = false

  public status: { isopen:boolean } = { isopen: false }
  public templates: Array<any>
  public templateEntityInfo: FlowEntityInfo
  private items: ContextMenuItem[]

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private cdr:ChangeDetectorRef,
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
          this.templatePanelDisplay = true
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
    this.instantiateTemplate(flowTemplate)
  }

  private instantiateTemplate(flowTemplate: FlowTemplate): void {

    KeycloakService.withTokenUpdate(function (rpt: string) {
      this.flowService
        .instantiateTemplate(flowTemplate.id, rpt)
        .subscribe(
          (flowInstance: FlowInstance) => {
            this.uiStateStore.setFlowInstanceToAdd(flowInstance)
            // FIXME: Not sure why the change detection in this case needs
            //        to be triggered manually
            this.cdr.detectChanges()
          },
          (error: any) => {
            this.errorService.handleError(error)
            let dcsError: DCSError = error.json()
            this.dialog.show(dcsError.message, dcsError.errorMessage)
          }
        )
    }.bind(this))

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
