import {Injectable} from "@angular/core"
import {BehaviorSubject, Observable} from "rxjs/Rx"
import {ContextMenu} from "./ui.models"
import {MenuItem} from "primeng/primeng"

/**
 * Created by cmathew on 04.05.17.
 */

@Injectable()
export class ContextStore {

  private contextObsMap: Map<String, BehaviorSubject<ContextMenu>> = new Map<String, BehaviorSubject<ContextMenu>>()


  obs(key: string): Observable<ContextMenu> {
    if(!this.contextObsMap.has(key)) {
      this.addContext(key, new EmptyContextMenu())
    }
    return this.contextObsMap.get(key).asObservable()
  }

  addContext(key: String, context: ContextMenu) {
    let _context: BehaviorSubject<ContextMenu>

    if(this.contextObsMap.has(key)) {
     _context = this.contextObsMap.get(key)
    } else {
      _context = new BehaviorSubject(context)
      this.contextObsMap.set(key, _context)
    }

    _context.next(context)
  }

  addContextMenuItem(key: String, mcItem: MenuItem) {
    let _context = this.contextObsMap.get(key)
    _context.getValue().addCMItem(mcItem)
    _context.next(_context.getValue())
  }

}

export class EmptyContextMenu implements ContextMenu {
  mcItems(): MenuItem[] {
    return []
  }

  onTrigger(mcItem: MenuItem): void {
    // do nothing
  }

  addCMItem(mcItem: MenuItem): void {
    // do nothing
  }

}