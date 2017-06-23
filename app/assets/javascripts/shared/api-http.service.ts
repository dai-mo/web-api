import {Headers, Http, RequestOptions, RequestOptionsArgs} from "@angular/http"
import {Observable} from "rxjs/Rx"
import {ServiceLocator} from "../app.component"

/**
 * Created by cmathew on 21.06.17.
 */


export class ApiHttpService {
  protected flowClientId: string
  protected clientIdUrl = "api/cid"

  protected http: Http

  constructor() {
    this.http = ServiceLocator.injector.get(Http)
    this.genClientId()
  }

  updateHeaders(options: RequestOptions, rpt: string, version: string = ""): RequestOptions  {
    let ro = options
    if(ro === undefined)
      ro = new RequestOptions()

    if(ro.headers == null)
      ro.headers = new Headers()
    ro.headers.append("Authorization", "Bearer " + rpt)
    if(this.flowClientId)
      ro.headers.append("flow-client-id", this.flowClientId)
    if(version !== "")
      ro.headers.append("flow-component-version", version)
    return ro
  }

  genClientId(): void {
    this.http.get(this.clientIdUrl)
      .map(response => response.json())
      .subscribe(
        (cid: string) => this.flowClientId = cid
      )
  }

  get<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
    return this.http.get(url, options).map(response => response.json())
  }

  put<T>(url: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.put(url, body, this.updateHeaders(options, "")).map(response => response.json())
  }
}