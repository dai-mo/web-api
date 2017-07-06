import {Injectable} from "@angular/core"
import {Headers, Http, RequestOptions} from "@angular/http"
import "rxjs/add/operator/toPromise"
import "rxjs/add/operator/map"
import {Observable} from "rxjs/Rx"


import {FlowEdge, FlowGraph, FlowInstance, FlowNode, FlowTemplate, Provenance} from "../analyse/flow.model"
import {ErrorService} from "../shared/util/error.service"
import {ApiHttpService} from "../shared/api-http.service"


@Injectable()
export class FlowService extends ApiHttpService {


  private templatesUrl = "api/flow/templates"
  private instantiateFlowBaseUrl: string = "api/flow/instances/instantiate/"
  private createInstanceBaseUrl: string = "api/flow/instances/create/"
  private instancesBaseUrl: string = "api/flow/instances/"
  private instancesStartUrl = this.instancesBaseUrl + "start/"
  private instancesStopUrl = this.instancesBaseUrl + "stop/"

  private listProvenanceBaseUrl: string = "api/flow/provenance/list/"

  constructor(private errorService: ErrorService) {
    super()
  }

  updateHeaders(options: RequestOptions, rpt: string, version: string = ""): RequestOptions  {
    if(options.headers == null)
      options.headers = new Headers()
    options.headers.append("Authorization", "Bearer " + rpt)
    if(this.flowClientId)
      options.headers.append("flow-client-id", this.flowClientId)
    if(version !== "")
      options.headers.append("flow-component-version", version)
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
    return this.http.post(this.instantiateFlowBaseUrl + templateId,
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

  destroyInstance(flowInstanceId: string, rpt: string, version: string): Observable<boolean> {
    return this.http.delete(this.instancesBaseUrl + flowInstanceId,
      this.updateHeaders(new RequestOptions(), rpt, version)).map(response => response.json())
  }

  provenance(processorId: string): Observable<Array<Provenance>> {
    return this.http.get(this.listProvenanceBaseUrl + processorId).map(response => response.json())
  }

  toFlowGraph(flowInstance: FlowInstance): FlowGraph {
    let links: FlowEdge[] = []
    let nodes: FlowNode[] = flowInstance.processors.map(p =>
      new FlowNode(p.id, p.type, p.processorType, p.validationErrors)
    )
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