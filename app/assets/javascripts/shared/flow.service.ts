
import {Injectable} from "@angular/core"
import {Http, Headers, RequestOptions} from "@angular/http"
import "rxjs/add/operator/toPromise"
import "rxjs/add/operator/map"
import {Observable} from "rxjs/Rx"


import {FlowTemplate, FlowInstance, FlowGraph, FlowEdge, FlowNode, Processor, Provenance} from "../analyse/flow.model"
import {ErrorService} from "./util/error.service"
import {KeycloakService} from "./keycloak.service"


@Injectable()
export class FlowService {

  private flowClientId: string

  private clientIdUrl = "api/cid"
  private templatesUrl = "api/flow/templates"
  private createInstanceBaseUrl: string = "api/flow/instances/create/"
  private instancesBaseUrl: string = "api/flow/instances/"
  private instancesStartUrl = this.instancesBaseUrl + "start/"
  private instancesStopUrl = this.instancesBaseUrl + "stop/"

  private listProvenanceBaseUrl: string = "api/flow/provenance/list/"

  constructor(private http: Http,
              private errorService: ErrorService) {}

  updateHeaders(options: RequestOptions, rpt: string): RequestOptions  {
    if(options.headers == null)
      options.headers = new Headers()
    options.headers.append("Authorization", "Bearer " + rpt)
    if(this.flowClientId)
      options.headers.append("flow-client-id", this.flowClientId)
    return options
  }


  genClientId(): void {
    this.http.get(this.clientIdUrl)
      .map(response => response.json())
      .subscribe(
        (cid: string) => this.flowClientId = cid
      )
  }

  templates(): Observable<Array<FlowTemplate>> {
    return this.http.get(this.templatesUrl).map(response => response.json())
  }

  instantiateTemplate(templateId: string, rpt: string): Observable<FlowInstance> {
    return this.http.post(this.createInstanceBaseUrl + templateId,
      {},
      this.updateHeaders(new RequestOptions(), rpt)).map(response => response.json())
  }

  instance(flowInstanceId: string): Observable<FlowInstance> {
    return this.http.get(this.instancesBaseUrl + flowInstanceId).map(response => response.json())
  }
  instances(rpt: string): Observable<Array<FlowInstance>> {
    return this.http.get(this.instancesBaseUrl,
      this.updateHeaders(new RequestOptions(), rpt)).map(response => response.json())
  }

  startInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.put(this.instancesStartUrl + flowInstanceId, {}).map(response => response.json())
  }

  stopInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.put(this.instancesStopUrl + flowInstanceId, {}).map(response => response.json())
  }

  destroyInstance(flowInstanceId: string, rpt: string): Observable<boolean> {
    return this.http.delete(this.instancesBaseUrl + flowInstanceId,
      this.updateHeaders(new RequestOptions(), rpt)).map(response => response.json())
  }

  provenance(processorId: string): Observable<Array<Provenance>> {
    return this.http.get(this.listProvenanceBaseUrl + processorId).map(response => response.json())
  }

  toFlowGraph(flowInstance: FlowInstance): FlowGraph {
    let links: FlowEdge[] = []
    let nodes: FlowNode[] = flowInstance.processors.map(p => new FlowNode(p.id, p.type, p.processorType))
    flowInstance.connections.forEach(c => {
      let sourceNodes: FlowNode[] = nodes.filter(p =>  p.uuid === c.source.id)
      let targetNodes: FlowNode[] = nodes.filter(p =>  p.uuid === c.destination.id)
      if(sourceNodes !== null && sourceNodes.length === 1 && targetNodes !== null && targetNodes.length === 1)
        links.push(new FlowEdge(sourceNodes[0].id, targetNodes[0].id))
      else
        this.errorService.handleError("Flow Instance with id " + flowInstance.id + " is not valid")
    })


    return new FlowGraph(nodes, links)
  }


}