/**
 * Created by cmathew on 29/07/16.
 */

import {Injectable} from "@angular/core"
import {FlowGraph} from "../flow.model"
import {UIStateStore} from "../../shared/ui.state.store"

declare var vis: any

@Injectable()
export class FlowGraphService {



  constructor(private uiStateStore:UIStateStore) {

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
    let network = new vis.Network(el, data, options)
    let uiss = this.uiStateStore
    let self = this

    // network.on("resize", function (params: any) {
    //   this.fit()
    // })

    network.on("click", function (params: any) {
      let selectedNodes = params.nodes
      if (selectedNodes.length > 0) {
        let pid = selectedNodes[0]
        uiss.setSelectedProcessorId(pid)
      } else {
        uiss.setSelectedProcessorId(null)
      }
    })

    return network
  }
}