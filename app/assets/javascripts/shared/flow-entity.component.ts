/**
 * Created by cmathew on 05.05.17.
 */

import {Component} from "@angular/core"
import {SelectItem} from "primeng/primeng"

@Component({
  selector: "flow-entity",
  templateUrl: "partials/flowentity.html"
})
export class FlowEntityComponent {

  entities: SelectItem[]
  selectedEntity: string = null

  text:string = ""
  constructor() {
    this.entities = []
    this.entities.push({label:"Processor1", value:"Processor1"})
    this.entities.push({label:"Processor2", value:"Processor2"})
    this.entities.push({label:"Processor3", value:"Processor3"})
    this.entities.push({label:"Processor4", value:"Processor4"})
    this.entities.push({label:"Processor5", value:"Processor5"})
    this.entities.push({label:"Processor6", value:"Processor6"})
    this.entities.push({label:"Processor7", value:"Processor7"})
    this.entities.push({label:"Processor8", value:"Processor8"})
    this.entities.push({label:"Processor9", value:"Processor9"})
    this.entities.push({label:"Processor10", value:"Processor10"})
    this.entities.push({label:"Processor11", value:"Processor11"})
    this.entities.push({label:"Processor12", value:"Processor12"})
    this.entities.push({label:"Processor13", value:"Processor13"})
    this.entities.push({label:"Processor14", value:"Processor14"})
    this.entities.push({label:"Processor15", value:"Processor15"})
    this.entities.push({label:"Processor16", value:"Processor16"})
    this.entities.push({label:"Processor17", value:"Processor17"})
    this.entities.push({label:"Processor18", value:"Processor18"})
    this.entities.push({label:"Processor19", value:"Processor19"})
    this.entities.push({label:"Processor20", value:"Processor20"})
    this.entities.push({label:"Processor21", value:"Processor21"})
    this.entities.push({label:"Processor22", value:"Processor22"})
    this.entities.push({label:"Processor23", value:"Processor23"})
    this.entities.push({label:"Processor24", value:"Processor24"})
  }
}