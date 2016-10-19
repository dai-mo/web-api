
import {Injectable} from "@angular/core"
import {Http, Headers, RequestOptions} from "@angular/http"
import "rxjs/add/operator/toPromise"
import "rxjs/add/operator/map"
import {Observable} from "rxjs/Rx"


import {FlowTemplate, FlowInstance, FlowGraph, FlowLink, FlowNode, Processor, Provenance} from "../analyse/flow.model"
import {ErrorService} from "./util/error.service"
import {KeycloakService} from "./keycloak.service"


@Injectable()
export class FlowService {

  private templatesUrl = "api/flow/templates"

  private createInstanceBaseUrl: string = "api/flow/instances/create/"
  private instancesBaseUrl: string = "api/flow/instances/"
  private instancesStartUrl = this.instancesBaseUrl + "start/"
  private instancesStopUrl = this.instancesBaseUrl + "stop/"

  private listProvenanceBaseUrl: string = "api/flow/provenance/list/"

  constructor(private http: Http,
              private errorService: ErrorService) {

  }

  static updateHeaders(options: RequestOptions, rpt: string): RequestOptions  {
    if(options.headers == null)
      options.headers = new Headers()
    options.headers.append("Authorization", "Bearer " + rpt)
    return options
  }

  templates(): Observable<Array<FlowTemplate>> {
    return this.http.get(this.templatesUrl).map(response => response.json())
  }

  instantiateTemplate(templateId: string, rpt: string): Observable<FlowInstance> {
    return this.http.post(this.createInstanceBaseUrl + templateId,
      {},
      FlowService.updateHeaders(new RequestOptions(), rpt)).map(response => response.json())
  }

  instance(flowInstanceId: string): Observable<FlowInstance> {
    return this.http.get(this.instancesBaseUrl + flowInstanceId).map(response => response.json())
  }
  instances(rpt: string): Observable<Array<FlowInstance>> {
    return this.http.get(this.instancesBaseUrl,
      FlowService.updateHeaders(new RequestOptions(), rpt)).map(response => response.json())
  }

  startInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.put(this.instancesStartUrl + flowInstanceId, {}).map(response => response.json())
  }

  stopInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.put(this.instancesStopUrl + flowInstanceId, {}).map(response => response.json())
  }

  destroyInstance(flowInstanceId: string, rpt: string): Observable<boolean> {
    return this.http.delete(this.instancesBaseUrl + flowInstanceId,
      FlowService.updateHeaders(new RequestOptions(), rpt)).map(response => response.json())
  }

  provenance(processorId: string): Observable<Array<Provenance>> {
    return this.http.get(this.listProvenanceBaseUrl + processorId).map(response => response.json())
  }

  toFlowGraph(flowInstance: FlowInstance): FlowGraph {
    let links: FlowLink[] = []
    flowInstance.connections.forEach(c => {
      let sp: Processor[] = flowInstance.processors.filter(p =>  p.id === c.source.id)
      let tp: Processor[] = flowInstance.processors.filter(p =>  p.id === c.destination.id)
      if(sp !== null && sp.length === 1 && tp !== null && tp.length === 1)
        links.push(new FlowLink(flowInstance.processors.indexOf(sp[0]),
            flowInstance.processors.indexOf(tp[0])))
      else
        this.errorService.handleError("Flow Instance with id " + flowInstance.id + " is not valid")
    })

    let nodes: FlowNode[] = flowInstance.processors.map(p => new FlowNode(p.id))
    return new FlowGraph(nodes, links)
  }


}