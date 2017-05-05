/**
 * Created by cmathew on 25/08/16.
 */

import {Component, Input} from "@angular/core"
import {SelectItem} from "primeng/components/common/api"
import {Action} from "../analyse/flow.model"

@Component({
  selector: "processor-panel",
  exportAs: "poverlay",
  templateUrl: "partials/mobilise/processorpanel.html"
})
export class ProcessorPanelComponent {

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
    this.processors.push({label:"Processor12", value:"Processor12"})
    this.processors.push({label:"Processor13", value:"Processor13"})
    this.processors.push({label:"Processor14", value:"Processor14"})
    this.processors.push({label:"Processor15", value:"Processor15"})
    this.processors.push({label:"Processor16", value:"Processor16"})
    this.processors.push({label:"Processor17", value:"Processor17"})
    this.processors.push({label:"Processor18", value:"Processor18"})
    this.processors.push({label:"Processor19", value:"Processor19"})
    this.processors.push({label:"Processor20", value:"Processor20"})
    this.processors.push({label:"Processor21", value:"Processor21"})
    this.processors.push({label:"Processor22", value:"Processor22"})
    this.processors.push({label:"Processor23", value:"Processor23"})
    this.processors.push({label:"Processor24", value:"Processor24"})
  }

  public show() {
    this.selectedProcessor == null
  }

  public isProcessorSelected(): boolean {
    return this.selectedProcessor != null
  }

  public addProcessor() {
    this.mobiliseActions.push({ label: this.selectedProcessor })
    this.selectedProcessor = null
  }
}