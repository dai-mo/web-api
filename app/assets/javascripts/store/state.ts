import {BehaviorSubject, Observable} from "rxjs/Rx"
import {Injectable, NgZone} from "@angular/core"
import {Record} from "immutable"
import {EntityType, FlowInstance, FlowTab, Processor} from "../analyse/flow.model"
import {Store} from "@ngrx/store"
import {UIStateStore} from "../shared/ui.state.store"
import {ContextBarItem, UiId} from "../shared/ui.models"

/**
 * Created by cmathew on 01.07.17.
 */

@Injectable()
export class ObservableStateStore {

  selectedProcessorId: Observable<string>

  constructor(private store:Store<AppState>,
              private uiStateStore: UIStateStore) {
    this.selectedProcessorId = this.store.select("selectedProcessorIdReducer")
  }

  selectedProcessor(): Observable<Processor> {
    return this.selectedProcessorId
      .withLatestFrom(this.store)
      .map(([processorId, appState]) =>
        this.uiStateStore.getActiveFlowProcessor(processorId))
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
  selectedFlowInstanceId: ""
  selectedProcessorId: ""
}

export const initialAppState: AppState = {
  flowTabs: [],
  selectedFlowInstanceId: "",
  selectedProcessorId: ""
}

