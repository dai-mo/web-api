/**
 * Created by cmathew on 29/07/16.
 */

import {Injectable, NgZone} from "@angular/core"
import {FlowGraph, Processor} from "../flow.model"
import {UIStateStore} from "../../shared/ui.state.store"
import {Msg} from "../../shared/ui.models"
import {Store} from "@ngrx/store"
import {SELECT_PROCESSOR} from "../../store/reducers"
import {AppState} from "../../store/state"

declare var vis: any

@Injectable()
export class FlowGraphService {

  constructor(private uiStateStore: UIStateStore,
              private store:Store<AppState>,
              private ngZone: NgZone) {

  }

  addFlatGraph(el:HTMLElement, graph: FlowGraph, id: string): any {
    let data = {
      nodes: graph.nodes,
      edges: graph.edges
    }
    let options = {
      nodes: {
        // shape: "dot",
        // size: 20,
        // font: {
        //   size: 32
        // },
        shadow:true,
        color: {
          background: "white"
        },
        borderWidth:0,
        shapeProperties: {
          useBorderWithImage:true
        }
      },

      edges: {
        width: 2,
        shadow:true
      },
      layout: {
        hierarchical : {
          enabled: true,
          direction: "UD",
          sortMethod: "directed"
        }
      }
    }
    let network = this.ngZone.runOutsideAngular(() => new vis.Network(el, data, options))
    let uiss = this.uiStateStore
    let st = this.store
    let self = this

    network.on("resize", function (params: any) {
      this.fit()
    })

    network.on("click", function (params: any) {
      let selectedNodes = params.nodes
      if (selectedNodes.length > 0) {
        let pid = selectedNodes[0]
        // uiss.setSelectedProcessorId(pid)
        st.dispatch({type: SELECT_PROCESSOR, payload: {id: pid}})
        // FIXME : Displaying errors every time the
        // processor node is clicked is annoying
        // Much better to have somewhere specific
        // to click / hover to get this info
        // uiss.displayProcessorValidationErrors(pid)
      } else {
        // uiss.setSelectedProcessorId(null)
        st.dispatch({type: SELECT_PROCESSOR, payload: {id: ""}})
      }
    }.bind(this))

    return network
  }
}