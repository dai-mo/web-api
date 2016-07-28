/**
 * Created by cmathew on 27/07/16.
 */

import {provide, Injector, ReflectiveInjector} from "@angular/core"
import {
    ResponseOptions,
    Response,
    Http,
    BaseRequestOptions,
    RequestMethod
} from "@angular/http"

import {
    describe,
    expect,
    it,
    inject,
    fakeAsync,
    beforeEachProviders,
    async, addProviders
} from "@angular/core/testing"

import { MockBackend, MockConnection } from "@angular/http/testing"

import {FlowService} from "./flow.service"
import {FlowTemplate} from "../flow.template"

const mockHttpProvider = {
    deps: [ MockBackend, BaseRequestOptions ],
    useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
        return new Http(backend, defaultOptions)
    }
}

describe("Flow Service", () => {

    // setup
    beforeEach(() => {
        addProviders([
            FlowService,
            MockBackend,
            BaseRequestOptions,
            {
                provide: Http,
                useFactory: (backend:MockBackend, options:BaseRequestOptions) => new Http(backend, options),
                deps: [MockBackend, BaseRequestOptions]
            }
        ])
    })



it("can retrieve templates",
    async(inject([MockBackend, FlowService], (mockbackend: MockBackend, flowService: FlowService) => {
        mockbackend.connections.subscribe((connection: MockConnection) => {

            let mockResponseBody: FlowTemplate[] = [
                {
                    "id": "7c88e3e4-0dce-498b-8ee0-098281abb32a",
                    "uri": "http://localhost:8888/nifi-api/controller/templates/7c88e3e4-0dce-498b-8ee0-098281abb32a",
                    "name": "CsvToJSON",
                    "description": "",
                    "date": "1464736682000"
                },
                {
                    "id": "d73b5a44-5968-47d5-9a9a-aea5664c5835",
                    "uri": "http://localhost:8888/nifi-api/controller/templates/d73b5a44-5968-47d5-9a9a-aea5664c5835",
                    "name": "DateConversion",
                    "description": "",
                    "date": "1464728751000"
                }
            ]

            let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)})
            connection.mockRespond(new Response(response))
        })

        flowService
            .getTemplates()
            .subscribe(
                templates => {
                    expect(templates.length).toBe(2)
                })
    })))
})
