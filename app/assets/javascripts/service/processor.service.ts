import {Injectable} from "@angular/core"
import {ApiHttpService} from "../shared/api-http.service"
import {Observable} from "rxjs"
import {Processor} from "../analyse/flow.model"
/**
 * Created by cmathew on 05.07.17.
 */

@Injectable()
export class ProcessorService extends ApiHttpService {

  processorPropertiesUrl(processorId: string): string {
    return "/api/flow/processor/" + processorId + "/properties"
  }

  updateProperties(processorId: string, properties: any): Observable<Processor> {
    return super.put(this.processorPropertiesUrl(processorId), properties)
  }

}
