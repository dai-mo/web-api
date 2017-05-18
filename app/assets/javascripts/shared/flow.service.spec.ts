
import {
  ResponseOptions, Response, Http, BaseRequestOptions, ConnectionBackend, HttpModule,
  XHRBackend
} from "@angular/http"
import {inject, fakeAsync, tick, TestBed, async} from "@angular/core/testing"
import {MockBackend, MockConnection} from "@angular/http/testing"
import {FlowService} from "./flow.service"
import {FlowTemplate, FlowInstance, FlowGraph, FlowNode} from "../analyse/flow.model"
import {ErrorService} from "./util/error.service"
import {platformBrowserDynamicTesting, BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing"


// FIXME: Move to ng2 rc5 makes these tests which mock http resquests fail
// with error "No NgModule metadata found for 'DynamicTestModule'"
describe("Flow Service", () => {

  // setup
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        FlowService,
        ErrorService,
        { provide: XHRBackend, useClass: MockBackend },
      ]
    })
  })


  it("should retrieve templates",
    inject([XHRBackend, FlowService],
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
              expect(ts.length).toBe(2)
            })

      })
    ))

  it("it should retrieve a template",
    async(inject([XHRBackend, FlowService], (mockbackend: MockBackend, flowService: FlowService) => {
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
              "type": "some.type",
              "status": "STOPPED",
              "processorType": "type"
            },
            {
              "id": "623f3887-cc72-412e-82d8-e21ee0d7705f",
              "type": "some.type",
              "status": "STOPPED",
              "processorType": "type"
            },
            {
              "id": "555bde07-8282-4719-aec6-6a64ce227c60",
              "type": "some.type",
              "status": "STOPPED",
              "processorType": "type"
            },
            {
              "id": "9b9620fe-3c40-4263-82eb-f49853a6ef79",
              "type": "some.type",
              "status": "STOPPED",
              "processorType": "type"
            },
            {
              "id": "ee25be65-4479-4528-b5f7-dc24a75eaf22",
              "type": "some.type",
              "status": "STOPPED",
              "processorType": "type"
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
        .instantiateTemplate("7c88e3e4-0dce-498b-8ee0-098281abb32a", "qwerty")
        .subscribe(
          instance => {
            expect(instance.processors.length).toBe(5)
            expect(instance.connections.length).toBe(4)

            let nodes: FlowNode[] = []
            nodes.push(new FlowNode("555bde07-8282-4719-aec6-6a64ce227c60",
              "some.type",
              "ptype",
              "label"))
            nodes.push(new FlowNode("623f3887-cc72-412e-82d8-e21ee0d7705f",
              "some.type",
              "ptype",
              "label"))
            nodes.push(new FlowNode("9b9620fe-3c40-4263-82eb-f49853a6ef79",
              "some.type",
              "ptype",
              "label"))
            nodes.push(new FlowNode("31893b7f-2b44-48d6-b07f-174edde34745",
              "some.type",
              "ptype",
              "label"))
            nodes.push(new FlowNode("ee25be65-4479-4528-b5f7-dc24a75eaf22",
              "some.type",
              "ptype",
              "label"))
            let expFlowGraph: FlowGraph = {
              "nodes": nodes,
              "edges":[
                {"from":"555bde07-8282-4719-aec6-6a64ce227c60","to":"623f3887-cc72-412e-82d8-e21ee0d7705f","arrows":"to"},
                {"from":"623f3887-cc72-412e-82d8-e21ee0d7705f","to":"9b9620fe-3c40-4263-82eb-f49853a6ef79","arrows":"to"},
                {"from":"9b9620fe-3c40-4263-82eb-f49853a6ef79","to":"31893b7f-2b44-48d6-b07f-174edde34745","arrows":"to"},
                {"from":"31893b7f-2b44-48d6-b07f-174edde34745","to":"ee25be65-4479-4528-b5f7-dc24a75eaf22","arrows":"to"}
              ]
            }
            let actFlowGraph = flowService.toFlowGraph(instance)

            expect(actFlowGraph.nodes.length).toBe(expFlowGraph.nodes.length)
            actFlowGraph.nodes.forEach(an => {
              expect(expFlowGraph.nodes.filter(en => an.id === en.id).length).toBe(1)
            })

            expect(actFlowGraph.edges.length).toBe(expFlowGraph.edges.length)
          })
    })))
})
