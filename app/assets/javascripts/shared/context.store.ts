import {Injectable, NgZone} from "@angular/core"
import {BehaviorSubject, Observable} from "rxjs/Rx"
import {ContextBarItem, ContextMenuItem} from "./ui.models"

/**
 * Created by cmathew on 04.05.17.
 */

@Injectable()
export class ContextStore {

  private contextMenuItemsObsMap: Map<string, BehaviorSubject<ContextMenuItem[]>> =
    new Map<string, BehaviorSubject<ContextMenuItem[]>>()

  private contextBarItemsObsMap: Map<string, BehaviorSubject<ContextBarItem[]>> =
    new Map<string, BehaviorSubject<ContextBarItem[]>>()

  constructor(private ngZone: NgZone) {}

  obs(key: string, obsMap: Map<string, BehaviorSubject<any[]>>): Observable<ContextMenuItem[]> {
    if(!obsMap.has(key)) {
      this.addContextMenu(key, [])
    }
    return obsMap.get(key).asObservable()
  }

  contextMenuObs(key: string): Observable<ContextMenuItem[]> {
    return this.obs(key, this.contextMenuItemsObsMap)
  }

  addContextMenu(key: string, cmItems: ContextMenuItem[]) {
    let _context: BehaviorSubject<ContextMenuItem[]>

    if(this.contextMenuItemsObsMap.has(key)) {
      _context = this.contextMenuItemsObsMap.get(key)
    } else {
      _context = new BehaviorSubject(cmItems)
      this.contextMenuItemsObsMap.set(key, _context)
    }

    this.ngZone.run(() => _context.next(cmItems))
  }

  addContextMenuItems(key: string, mcItems: ContextMenuItem[]) {
    let _context = this.contextMenuItemsObsMap.get(key)
    let currentCMItems = _context.getValue()
    mcItems.forEach(mci => currentCMItems.push(mci))
    this.ngZone.run(() => _context.next(_context.getValue()))
  }

  removeContextMenuItems(key: string, mcItems: ContextMenuItem[]) {
    let _context = this.contextMenuItemsObsMap.get(key)
    let currentCMItems = _context.getValue()
    mcItems.forEach(mci => {
      let index = currentCMItems.indexOf(mci)
      currentCMItems.splice(index, 1)
    })
    this.ngZone.run(() => _context.next(_context.getValue()))
  }

}
