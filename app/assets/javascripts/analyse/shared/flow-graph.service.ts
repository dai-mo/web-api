/**
 * Created by cmathew on 29/07/16.
 */

import {Injectable, NgZone} from "@angular/core"
import {FlowGraph, FlowInstance} from "../flow.model"
import {UIStateStore} from "../../shared/ui.state.store"
import {Store} from "@ngrx/store"
import {SELECT_PROCESSOR, SELECT_PROCESSOR_TO_CONNECT, UPDATE_FLOW_INSTANCE} from "../../store/reducers"
import {AppState, ObservableState} from "../../store/state"
import {ConnectionService} from "../../service/connection.service"
import {ErrorService} from "../../shared/util/error.service"
import {FlowService} from "../../service/flow.service"

declare var vis: any

@Injectable()
export class FlowGraphService {

  constructor(private uiStateStore: UIStateStore,
              private connectionService: ConnectionService,
              private flowService: FlowService,
              private oss: ObservableState,
              private errorService: ErrorService,
              private store:Store<AppState>,
              private ngZone: NgZone) {

  }

  addFlatGraph(el:HTMLElement, graph: FlowGraph, id: string): any {
    let uiss = this.uiStateStore
    let fs = this.flowService
    let oss = this.oss

    let st = this.store
    let self = this

    let cs = this.connectionService
    let es =  this.errorService

    let data = {
      nodes: graph.nodes,
      edges: graph.edges
    }
    let options = {
      nodes: {
        shadow: true,
        color: {
          background: "white"
        },
        borderWidth: 0,
        shapeProperties: {
          useBorderWithImage: true
        }
      },
      edges: {
        width: 2,
        shadow: true
      },
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed"
        }
      },
      manipulation: {
        addNode: false,
        deleteNode: false,
        editEdge: false,
        addEdge: function (data: any, callback: any) {
          if (data.from === data.to)
            return
          else {
            st.dispatch({type: SELECT_PROCESSOR, payload: {id: data.from}})
            st.dispatch({type: SELECT_PROCESSOR_TO_CONNECT, payload: {id: data.to}})
            uiss.isRelationshipsSettingsDialogVisible = true
            return
          }
        },
        deleteEdge: function (data: any, callback: any) {
          data.edges.forEach((seid: any) => {
            let connection = graph.edges.find(e => e.id === seid).connection
            cs.delete(connection.id, connection.version)
              .subscribe(
                (deleteOk: boolean) => {
                  if(deleteOk)
                    fs.instance(oss.activeFlowTab().flowInstance.id)
                      .subscribe(
                        (flowInstance: FlowInstance) => {
                          oss.dispatch({
                            type: UPDATE_FLOW_INSTANCE,
                            payload: {
                              flowInstance: flowInstance
                            }
                          })
                        },
                        (error: any) => {
                          this.errorService.handleError(error)
                        }
                      )
                },
                (error: any) => {
                  this.errorService.handleError(error)
                }
              )
          })
          return
        }
      }
    }
    let network = this.ngZone.runOutsideAngular(() => new vis.Network(el, data, options))


    network.on("resize", function (params: any) {
      this.fit()
    })

    network.on("click", function (params: any) {
      let selectedNodes = params.nodes

      if (selectedNodes.length > 0) {
        let pid = selectedNodes[0]
        st.dispatch({type: SELECT_PROCESSOR, payload: {id: pid}})
      } else {
        st.dispatch({type: SELECT_PROCESSOR, payload: {id: ""}})
      }
    }.bind(this))



    return network
  }

}