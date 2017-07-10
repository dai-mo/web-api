import {Injectable} from "@angular/core"
import {ApiHttpService} from "../shared/api-http.service"
import {Observable} from "rxjs"
import {Processor, ProcessorDetails, ProcessorServiceDefinition} from "../analyse/flow.model"
/**
 * Created by cmathew on 05.07.17.
 */

@Injectable()
export class ProcessorService extends ApiHttpService {

  private readonly processorBaseUrl = "/api/flow/processor/"

  processorPropertiesUrl(processorId: string): string {
    return  this.processorBaseUrl + processorId + "/properties"
  }

  updateProperties(processorId: string, properties: any): Observable<Processor> {
    return super.put(this.processorPropertiesUrl(processorId), properties)
  }

  details(processorServiceClassName: string, stateful: boolean): Observable<ProcessorDetails> {
    return super.get(this.processorBaseUrl + "details/" +
      processorServiceClassName +
      "/" +
      stateful)
  }

  list(): Observable<ProcessorServiceDefinition[]> {
    return super.get(this.processorBaseUrl)
  }
}
