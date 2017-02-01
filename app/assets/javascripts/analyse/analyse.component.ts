/**
 * Created by cmathew on 14/07/16.
 */
import {Component, OnInit, ViewChild, ChangeDetectorRef, NgZone} from "@angular/core"
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap"
import {FlowService} from "../shared/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {FlowTabsComponent} from "./flow-tabs.component"
import {FlowTemplate, FlowInstance, DCSError} from "./flow.model"
import {ModalComponent} from "../shared/modal.component"
import {KeycloakService} from "../shared/keycloak.service"
import {UIStateStore} from "../shared/ui.state.store"


@Component({
  selector: "analyse",
  directives: [FlowTabsComponent, DROPDOWN_DIRECTIVES, ModalComponent],
  providers: [FlowService, ErrorService],
  templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent implements OnInit {
  @ViewChild("dialog") public dialog: ModalComponent

  public status: { isopen:boolean } = { isopen: false }
  public templates: Array<any>

  constructor(private flowService: FlowService,
              private errorService: ErrorService,
              private cdr:ChangeDetectorRef,
              private uiStateStore: UIStateStore) {
  }

  getTemplates() {
    this.flowService
      .templates()
      .subscribe(
        templates => {
          this.templates = templates
        },
        (error: any) =>  {
          this.errorService.handleError(error)
        }
      )
  }

  ngOnInit() {
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
    let er:any = {}
    let pr:any  = {}

    pr.resource_set_name = "flow-instance"
    er.permissions = [pr]

    KeycloakService.withRptUpdate(function (rpt: string) {
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
}
