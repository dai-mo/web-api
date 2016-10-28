/**
 * Created by cmathew on 29/07/16.
 */

import {Injectable} from "@angular/core"

import {FlowGraph, FlowNode} from "../flow.model"

import {ViewManagerService} from "../../shared/view-manager.service"

declare var vis: any

@Injectable()
export class FlowGraphService {

  constructor(private vms: ViewManagerService) {

  }

  addFlatGraph(el:HTMLElement, graph: FlowGraph, id: string) {
    let data = {
      nodes: graph.nodes,
      edges: graph.edges
    }
    let options = {
      nodes: {
        shape: "dot",
        size: 20,
        font: {
          size: 32
        },
        borderWidth: 2,
        shadow:true
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

    network.on("click", function (params: any) {
      let selectedNodes = params.nodes
      if(selectedNodes.length > 0)
        this.vms.selectedProcessorId = selectedNodes[0]
      else
        this.vms.selectedProcessorId = null
    }.bind(this))
  }
}