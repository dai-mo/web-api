/**
 * Created by cmathew on 22.11.16.
 */

import {Component} from "@angular/core";
import {UIStateStore} from "../shared/ui.state.store";
import {MapComponent} from "./map/map.component";
import {CORE_DIRECTIVES, NgClass} from "@angular/common";
import {TAB_DIRECTIVES} from "ng2-bootstrap";
import {Provenance} from "../analyse/flow.model";
import {Observable} from "rxjs";
import {ChartComponent} from "./chart/chart.component";


@Component({
  selector: "vis-tabs",
  templateUrl: "partials/visualise/vistabs.html",
  directives: [MapComponent, ChartComponent, TAB_DIRECTIVES, CORE_DIRECTIVES, NgClass]
})
export class VisTabsComponent {

  private provenances : Observable<Provenance[]>

  constructor(private uiStateStore: UIStateStore) {
    this.provenances = uiStateStore.provenances
  }

}



