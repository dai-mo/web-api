import {Observable} from "rxjs/Rx"
import {Injectable, NgZone} from "@angular/core"
import {ComponentType, Connection, EntityType, FlowInstance, FlowTab, Processor} from "../analyse/flow.model"
import {Action, Store} from "@ngrx/store"
import {ContextBarItem, FlowEntityConf, UiId} from "../shared/ui.models"
import {ImmutableArray, ImmutableObject} from "seamless-immutable"
import * as SI from "seamless-immutable"

/**
 * Created by cmathew on 01.07.17.
 */

@Injectable()
export class ObservableState {

  selectedProcessorId: Observable<string>

  constructor(private store:Store<AppState>,
              private ngZone: NgZone) {
    this.selectedProcessorId = this.store.select("selectedProcessorId")
  }

  appState(): AppState {

    let state: AppState

    this.store.take(1).subscribe((s: AppState) => state = s)

    // You can always rely on subscribe()
    // running synchronously if you have
    // to get the state value
    return state
  }

  appStore(): Store<AppState> {
    return this.store
  }

  dispatch(action: Action) {
    return  this.ngZone.run(() => this.store.dispatch(action))
  }

  selectedProcessor(): Processor {
    return this.activeFlowTab().flowInstance.processors
      .find(p => p.id === this.appState().selectedProcessorId)
  }

  processorToConnect(): Processor {
    return this.activeFlowTab().flowInstance.processors
      .find(p => p.id === this.appState().processorToConnectId)
  }

  selectedProcessor$(): Observable<Processor> {
    return this.activeFlowTab$()
      .map(ft =>
        ft.flowInstance.processors
          .find(p => p.id === this.appState().selectedProcessorId)
      )
  }

  connectionsForSourceProcessor(processorId: string): Connection[] {
    return this.activeFlowTab()
      .flowInstance.connections.filter(
        c => c.config.source.componentType === ComponentType.PROCESSOR && c.config.source.id === processorId)
  }

  processor(processorId: string): Processor {
    return this.activeFlowTab().flowInstance.processors.find(p => p.id === processorId)
  }

  activeFlowTab(): FlowTab {
    return this.appState().flowTabs.find(ft => ft.active)
  }

  activeFlowTab$(): Observable<FlowTab> {
    return this.appStore()
      .select(state => state.flowTabs)
      .map(fts => fts.find(ft => ft.active))
  }

  hideContextBarItem(cbItem: ContextBarItem): Observable<boolean> {
    return this.selectedProcessorId
      .map(id => {
        switch(cbItem.view) {
          case UiId.ANALYSE:
            if (cbItem.entityType === EntityType.PROCESSOR)
              return id === ""
            else
              return id !== ""
          default:
            return false
        }
      })
  }
}

export interface AppState {
  flowTabs: FlowTab[]
  selectedProcessorId: string
  processorToConnectId: string
  currentProcessorProperties: any
  selectedFlowEntityConf: FlowEntityConf
}

export const initialAppState: AppState = {
  flowTabs: [],
  selectedProcessorId: "",
  processorToConnectId: "",
  currentProcessorProperties: undefined,
  selectedFlowEntityConf: undefined
}

