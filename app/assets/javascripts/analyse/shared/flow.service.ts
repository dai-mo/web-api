
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
  private instancesBaseUrl: string = "api/flow/instances/"
  private instancesStartUrl = this.instancesBaseUrl + "start/"
  private instancesStopUrl = this.instancesBaseUrl + "stop/"

  constructor(private http: Http) {

  }

  templates(): Observable<Array<FlowTemplate>> {
    return this.http.get(this.templatesUrl).map(response => response.json())
  }

  instantiateTemplate(templateId: string): Observable<FlowInstance> {
    return this.http.post(this.createInstanceBaseUrl + templateId, {}).map(response => response.json())
  }

  instance(flowInstanceId: string): Observable<FlowInstance> {
    return this.http.get(this.instancesBaseUrl + flowInstanceId).map(response => response.json())
  }
  instances(): Observable<Array<FlowInstance>> {
    return this.http.get(this.instancesBaseUrl).map(response => response.json())
  }

  startInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.put(this.instancesStartUrl + flowInstanceId, {}).map(response => response.json())
  }

  stopInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.put(this.instancesStopUrl + flowInstanceId, {}).map(response => response.json())
  }

  destroyInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.delete(this.instancesBaseUrl + flowInstanceId, {}).map(response => response.json())
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