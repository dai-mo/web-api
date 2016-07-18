
import {Injectable} from "@angular/core"
import {Http} from "@angular/http"
import {ErrorService} from "./error.service"
import "rxjs/add/operator/toPromise"
import "rxjs/add/operator/map"


@Injectable()
export class FlowService {

    private templatesUrl = "api/flow/templates"

    constructor(private http: Http, private errorService: ErrorService) {

    }

    getTemplates() {
        return this.http.get(this.templatesUrl).map(response => response.json())
    }
}