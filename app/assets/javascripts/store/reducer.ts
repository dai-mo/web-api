/**
 * Created by cmathew on 03.07.17.
 */

import {Processor} from "../analyse/flow.model"
import {Action, ActionReducer} from "@ngrx/store"


export const SELECT_PROCESSOR: string = "SELECT_PROCESSOR"
export const SELECT_FLOW_INSTANCE: string = "SELECT_FLOW_INSTANCE"


export const flowTabsReducer: ActionReducer<Processor> =
  (state = undefined, action: Action) => {
    switch (action.type) {
      default:
        return state
    }
  }

export const selectedFlowInstanceIdReducer: ActionReducer<string> =
  (state = "", action: Action) => {
    switch (action.type) {
      case SELECT_FLOW_INSTANCE:
        return action.payload.id
      default:
        return state
    }
  }

export const selectedProcessorIdReducer: ActionReducer<string> =
  (state = "", action: Action) => {
    switch (action.type) {
      case SELECT_PROCESSOR:
        return action.payload.id
      default:
        return state
    }
  }

export const rootReducer = {
  flowTabsReducer,
  selectedFlowInstanceIdReducer,
  selectedProcessorIdReducer
}

