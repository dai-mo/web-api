import {Injectable, NgZone} from "@angular/core"
import {State} from "../state/state"

@Injectable()
export class DnDStore {

  constructor(private ngZone: NgZone) {

  }

  pSchemaParameter = new State<any>(undefined, this.ngZone)

}