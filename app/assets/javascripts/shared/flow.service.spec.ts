/// <reference path="../../../../typings/globals/jasmine/index.d.ts" />

import {ResponseOptions, Response, Http, BaseRequestOptions, ConnectionBackend, HttpModule} from "@angular/http"
import {inject, fakeAsync, tick} from "@angular/core/testing"
import {MockBackend, MockConnection} from "@angular/http/testing"
import {FlowService} from "./flow.service"
import {FlowTemplate, FlowInstance, FlowGraph} from "../analyse/flow.model"
import {ErrorService} from "./util/error.service"
import {TestBed} from "@angular/core/testing/test_bed"
import {platformBrowserDynamicTesting, BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing"
import {async} from "@angular/core/testing/async"

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
)

// FIXME: Move to ng2 rc5 makes these tests which mock http resquests fail
// with error "No NgModule metadata found for 'DynamicTestModule'"
xdescribe("Flow Service", () => {

  // setup
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {provide: MockBackend, useClass: MockBackend},
        {provide: BaseRequestOptions, useClass: BaseRequestOptions},
        {
          provide: Http,
          useFactory: (backend:ConnectionBackend, options:BaseRequestOptions) =>  {
            return new Http(backend, options)
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {provide: ErrorService, useClass: ErrorService},
        {
          provide: FlowService,
          useFactory: (http: Http, errorService: ErrorService) => { return new FlowService(http, errorService) },
          deps: [Http, ErrorService]
        }
      ],
      imports: [
        HttpModule
      ]
    })
  })


  it("can retrieve templates",
    inject([MockBackend, FlowService],
      fakeAsync((mockbackend: MockBackend, flowService: FlowService) => {
        let ts: Array<FlowTemplate>
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
          .templates()
          .subscribe(
            templates => {
              ts = templates
            })
        tick()
        expect(ts.length).toBe(2)
      })
    ))

  it("it can instantiate a template",
    async(inject([MockBackend, FlowService], (mockbackend: MockBackend, flowService: FlowService) => {
      mockbackend.connections.subscribe((connection: MockConnection) => {

        let mockResponseBody: FlowInstance = {
          "id": "",
          "name": "DateConversion",
          "nameId": "aff997c4-d43c-4a7e-93b6-1f1ae2bddf8a",
          "state": "RUNNING",
          "version": "3",
          "processors": [
            {
              "id": "31893b7f-2b44-48d6-b07f-174edde34745",
              "status": "STOPPED"
            },
            {
              "id": "623f3887-cc72-412e-82d8-e21ee0d7705f",
              "status": "STOPPED"
            },
            {
              "id": "555bde07-8282-4719-aec6-6a64ce227c60",
              "status": "STOPPED"
            },
            {
              "id": "9b9620fe-3c40-4263-82eb-f49853a6ef79",
              "status": "STOPPED"
            },
            {
              "id": "ee25be65-4479-4528-b5f7-dc24a75eaf22",
              "status": "STOPPED"
            }
          ],
          "connections": [
            {
              "id": "102509b5-3ae2-41b3-b7a8-15b3203419c4",
              "source": {
                "id": "623f3887-cc72-412e-82d8-e21ee0d7705f",
                "type": "PROCESSOR"
              },
              "destination": {
                "id": "9b9620fe-3c40-4263-82eb-f49853a6ef79",
                "type": "PROCESSOR"
              }
            },
            {
              "id": "19c466d3-9af5-4634-8d07-4860e1d26511",
              "source": {
                "id": "31893b7f-2b44-48d6-b07f-174edde34745",
                "type": "PROCESSOR"
              },
              "destination": {
                "id": "ee25be65-4479-4528-b5f7-dc24a75eaf22",
                "type": "PROCESSOR"
              }
            },
            {
              "id": "21d17780-5127-4140-8096-82018fd717e4",
              "source": {
                "id": "9b9620fe-3c40-4263-82eb-f49853a6ef79",
                "type": "PROCESSOR"
              },
              "destination": {
                "id": "31893b7f-2b44-48d6-b07f-174edde34745",
                "type": "PROCESSOR"
              }
            },
            {
              "id": "da36ece5-9c3d-40c5-95d0-672040db749c",
              "source": {
                "id": "555bde07-8282-4719-aec6-6a64ce227c60",
                "type": "PROCESSOR"
              },
              "destination": {
                "id": "623f3887-cc72-412e-82d8-e21ee0d7705f",
                "type": "PROCESSOR"
              }
            }
          ]
        }

        let response = new ResponseOptions({body: JSON.stringify(mockResponseBody)})
        connection.mockRespond(new Response(response))
      })


      flowService
        .instantiateTemplate("7c88e3e4-0dce-498b-8ee0-098281abb32a")
        .subscribe(
          instance => {
            expect(instance.processors.length).toBe(5)
            expect(instance.connections.length).toBe(4)

            let expFlowGraph: FlowGraph = {
              "nodes":[
                {"name":"","width":50,"height":50,"id":"555bde07-8282-4719-aec6-6a64ce227c60"},
                {"name":"","width":50,"height":50,"id":"623f3887-cc72-412e-82d8-e21ee0d7705f"},
                {"name":"","width":50,"height":50,"id":"9b9620fe-3c40-4263-82eb-f49853a6ef79"},
                {"name":"","width":50,"height":50,"id":"31893b7f-2b44-48d6-b07f-174edde34745"},
                {"name":"","width":50,"height":50,"id":"ee25be65-4479-4528-b5f7-dc24a75eaf22"},

              ],
              "links":[
                {"source":0,"target":1},
                {"source":1,"target":2},
                {"source":2,"target":3},
                {"source":3,"target":4}
              ]
            }
            let actFlowGraph = flowService.toFlowGraph(instance)

            expect(actFlowGraph.nodes.length).toBe(expFlowGraph.nodes.length)
            actFlowGraph.nodes.forEach(an => {
              expect(expFlowGraph.nodes.filter(en => an.id === en.id).length).toBe(1)
            })

            expect(actFlowGraph.links.length).toBe(expFlowGraph.links.length)
            let actConnTuples = actFlowGraph.links.map(l =>
              [actFlowGraph.nodes[l.source].id, actFlowGraph.nodes[l.target].id])
              .sort((c1, c2) => {
                if(c1[0] < c2[0]) return -1
                if(c1[0] > c2[0]) return 1
                return 0
              })
            let expConnTuples = expFlowGraph.links.map(l =>
              [expFlowGraph.nodes[l.source].id, expFlowGraph.nodes[l.target].id])
              .sort((c1, c2) => {
                if(c1[0] < c2[0]) return -1
                if(c1[0] > c2[0]) return 1
                return 0
              })
            expect(actConnTuples).toEqual(expConnTuples)
          })
    })))
})
