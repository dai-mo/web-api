/**
 * Created by cmathew on 14/07/16.
 */
import {ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {DCSError, FlowInstance, FlowTemplate} from "./flow.model"
import {KeycloakService} from "../shared/keycloak.service"
import {UIStateStore} from "../shared/ui.state.store"
import {MenuItem, OverlayPanel} from "primeng/primeng"
import {ContextMenu, FlowEntityInfo, TemplateInfo} from "../shared/ui.models"
import {ContextStore} from "../shared/context.store"
import {FlowTabsComponent} from "./flow-tabs.component"


@Component({
  selector: "analyse",
  templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent  implements ContextMenu, OnInit {

  private display: boolean = false

  public status: { isopen:boolean } = { isopen: false }
  public templates: Array<any>
  public templateEntityInfo: FlowEntityInfo
  private items: MenuItem[]

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
        // this.templateSearchPanel.toggle(event, this.flowTabbedPanel)
      }},
      {label: "Create Flow"}
    ]
    this.contextStore.addContext("analyse", this)
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


  showDialog() {
    this.display = true
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

  onTrigger(mcItem: MenuItem): void {
    // test
  }

  mcItems(): MenuItem[] {
    return this.items
  }

  addCMItem(mcItem: MenuItem): void {
    this.items.push(mcItem)
  }
}
