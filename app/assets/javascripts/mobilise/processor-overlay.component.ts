/**
 * Created by cmathew on 25/08/16.
 */

import {Component, ViewChild, Input} from "@angular/core"
import {MODAL_DIRECTIVES, BS_VIEW_PROVIDERS, ModalDirective} from "ng2-bootstrap"
import {CORE_DIRECTIVES} from "@angular/common"
import {SelectItem} from "primeng/components/common/api"
import {Action} from "../analyse/flow.model"

@Component({
  selector: "processor-overlay",
  directives: [MODAL_DIRECTIVES, CORE_DIRECTIVES],
  viewProviders:[BS_VIEW_PROVIDERS],
  exportAs: "poverlay",
  templateUrl: "partials/mobilise/poverlay.html"
})
export class ProcessorOverlayComponent {
  @ViewChild("lgModal") public lgModal: ModalDirective

  @Input() mobiliseActions: Action[]

  processors: SelectItem[]
  selectedProcessor: string = null

  text:string = ""
  constructor() {
    this.processors = []
    this.processors.push({label:"Processor1", value:"Processor1"})
    this.processors.push({label:"Processor2", value:"Processor2"})
    this.processors.push({label:"Processor3", value:"Processor3"})
    this.processors.push({label:"Processor4", value:"Processor4"})
    this.processors.push({label:"Processor5", value:"Processor5"})
    this.processors.push({label:"Processor6", value:"Processor6"})
    this.processors.push({label:"Processor7", value:"Processor7"})
    this.processors.push({label:"Processor8", value:"Processor8"})
    this.processors.push({label:"Processor9", value:"Processor9"})
    this.processors.push({label:"Processor10", value:"Processor10"})
    this.processors.push({label:"Processor11", value:"Processor11"})
  }

  public show() {
    this.selectedProcessor == null
    this.lgModal.show()
  }

  public hide() {
    this.lgModal.hide()
  }

  public isProcessorSelected(): boolean {
    return this.selectedProcessor != null
  }

  public addProcessor() {
    this.mobiliseActions.push({ label: this.selectedProcessor })
    this.hide()
    this.selectedProcessor = null
  }
}