
import {Injectable} from "@angular/core"
import {Http} from "@angular/http"
import "rxjs/add/operator/toPromise"
import "rxjs/add/operator/map"
import {Observable} from "rxjs/Rx"
import {FlowTemplate} from "../flow.template"


@Injectable()
export class FlowService {

    private templatesUrl = "api/flow/templates"
    private instanceBaseUrl: string = "api/flow/instances/create/"

    constructor(private http: Http) {

    }

    getTemplates(): Observable<Array<FlowTemplate>> {
        return this.http.get(this.templatesUrl).map(response => response.json())
    }

    // instantiateTemplate(templateId: string): Observable<Response> {
    //     return this.http.post(this.instanceBaseUrl + templateId, {}).map(response => response.json())
    // }

}