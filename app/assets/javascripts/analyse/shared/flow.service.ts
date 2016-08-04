
import {Injectable} from "@angular/core"
import {Http} from "@angular/http"
import "rxjs/add/operator/toPromise"
import "rxjs/add/operator/map"
import {Observable} from "rxjs/Rx"

import {FlowTemplate, FlowInstance, FlowGraph, FlowLink, FlowNode, Processor} from "../flow.model"


@Injectable()
export class FlowService {

  private templatesUrl = "api/flow/templates"
  private createInstanceBaseUrl: string = "api/flow/instances/create/"
  private destroyInstanceBaseUrl: string = "api/flow/instances/"

  constructor(private http: Http) {

  }

  getTemplates(): Observable<Array<FlowTemplate>> {
    return this.http.get(this.templatesUrl).map(response => response.json())
  }

  instantiateTemplate(templateId: string): Observable<FlowInstance> {
    return this.http.post(this.createInstanceBaseUrl + templateId, {}).map(response => response.json())
  }

  destroyInstance(flowInstanceId: string): Observable<FlowInstance> {
    return this.http.delete(this.destroyInstanceBaseUrl + flowInstanceId, {}).map(response => response.json())
  }

  toFlowGraph(flowInstance: FlowInstance): FlowGraph {
    let links: FlowLink[] = []
    flowInstance.connections.forEach(c => {
      let sp: Processor[] = flowInstance.processors.filter(p =>  p.id === c.source.id)
      let tp: Processor[] = flowInstance.processors.filter(p =>  p.id === c.destination.id)
      if(sp != null && tp != null)
        links.push(new FlowLink(flowInstance.processors.indexOf(sp[0]),
            flowInstance.processors.indexOf(tp[0])))
    })

    let nodes: FlowNode[] = flowInstance.processors.map(p => new FlowNode(p.id))
    return new FlowGraph(nodes, links)
  }


}