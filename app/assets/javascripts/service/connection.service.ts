import {Injectable} from "@angular/core"
import {ApiHttpService} from "../shared/api-http.service"
import {Connection, ConnectionConfig} from "../analyse/flow.model"
import {Observable} from "rxjs"
import {ObservableState} from "../store/state"
/**
 * Created by cmathew on 20.07.17.
 */

@Injectable()
export class ConnectionService extends ApiHttpService {

  private readonly connectionBaseUrl = "/api/flow/connection/"

  constructor(private oss: ObservableState) {
    super()
  }

  create(connectionCreate: ConnectionConfig): Observable<Connection> {
    return super.post(this.connectionBaseUrl, connectionCreate)
  }

  delete(connectionId: string, version: string): Observable<boolean> {
    return super.delete(this.connectionBaseUrl + connectionId, this.oss.activeFlowTab().flowInstance.version)
  }
}