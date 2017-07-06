package controllers

import java.util.UUID

import controllers.util.Req
import org.apache.avro.Schema
import org.dcs.api.processor.RemoteProcessor
import org.dcs.api.service.{ProcessorInstance, ProcessorServiceDefinition}
import org.dcs.commons.{SchemaAction, SchemaField}
import org.dcs.commons.serde.JsonPath
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.scalatest.Ignore
import scala.concurrent.duration._
import org.scalatestplus.play.OneAppPerTest
import play.api.libs.json.{JsArray, JsObject, Json}
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}

import scala.concurrent.Await

/**
  * Created by cmathew on 07.04.17.
  */
//FIXME: Setting to ignore
//       otherwise this test will be run during the release
//       process. This should be reverted once the integration
//       test environment is setup.
// @Ignore
class FlowProcessorApiISpec  extends WebBaseSpec with OneAppPerTest {


  "Flow Processor Api" should {
    "return list of available processor services" taggedAs IT in {
      init(app)

      // test full services list
      val processorServiceDefinitionResponse = route(app,
        withDcsCookiesHeaders(FakeRequest(GET, "/api/flow/processor"))).get

      status(processorServiceDefinitionResponse) mustBe OK

      val processorServicesJS = contentAsJson(processorServiceDefinitionResponse).as[JsArray]

      assert(processorServicesJS.value.nonEmpty)

      val processorServices = processorServicesJS.value.map(js => js.toString().toObject[ProcessorServiceDefinition])
      assert(processorServices.count(_.processorServiceClassName == "org.dcs.core.service.TestProcessorService") == 1)

      // test tag filtered services list
      val tagFilteredProcessorServiceDefinitionResponse = route(app,
        withDcsCookiesHeaders(FakeRequest(GET, "/api/flow/processor/list/org.dcs.processor.tags/.*test.*"))).get

      status(tagFilteredProcessorServiceDefinitionResponse) mustBe OK

      val tagFilteredProcessorServicesJS = contentAsJson(tagFilteredProcessorServiceDefinitionResponse).as[JsArray]

      val tagFilteredProcessorServices = tagFilteredProcessorServicesJS.value.map(js => js.toString().toObject[ProcessorServiceDefinition])
      assert(tagFilteredProcessorServices.exists(_.processorServiceClassName == "org.dcs.core.service.TestProcessorService"))
      assert(tagFilteredProcessorServices.exists(_.processorServiceClassName == "org.dcs.core.service.StatefulTestProcessorService"))

      // test type filtered services list
      val typeFilteredProcessorServiceDefinitionResponse = route(app,
        withDcsCookiesHeaders(FakeRequest(GET, "/api/flow/processor/list/org.dcs.processor.type/worker"))).get

      status(typeFilteredProcessorServiceDefinitionResponse) mustBe OK

      val typeFilteredProcessorServicesJS = contentAsJson(typeFilteredProcessorServiceDefinitionResponse).as[JsArray]

      val typeFilteredProcessorServices = typeFilteredProcessorServicesJS.value.map(js => js.toString().toObject[ProcessorServiceDefinition])
      assert(typeFilteredProcessorServices.exists(_.processorServiceClassName == "org.dcs.core.service.TestProcessorService"))
      assert(typeFilteredProcessorServices.exists(_.processorServiceClassName == "org.dcs.core.service.StatefulTestProcessorService"))

    }

    "manage processor lifecycle correctly" taggedAs IT in {
      init(app)

      val clientId = UUID.randomUUID().toString
      val flowInstance = route(app,
        withDcsCookiesHeaders(FakeRequest(POST, "/api/flow/instances/create/test"))
          .withHeaders((Req.FlowClientId, clientId))).get

      status(flowInstance) mustBe OK

      val createInstanceResponse = contentAsJson(flowInstance).as[JsObject]

      val flowInstanceId = (createInstanceResponse \ "id").as[String]
      val flowInstanceVersion = (createInstanceResponse \ "version").as[Long]

      val psd = ProcessorServiceDefinition("org.dcs.core.service.TestProcessorService", RemoteProcessor.WorkerProcessorType, false)

      val processor =  route(app,
        withDcsCookiesHeaders(FakeRequest(POST, "/api/flow/processor/create/" + flowInstanceId))
          .withJsonBody(Json.parse(psd.toJson))
          .withHeaders((Req.FlowClientId, clientId))).get

      status(processor) mustBe OK

      val createProcessorResponse = contentAsJson(processor).as[JsObject]

      val processorInstanceId = (createProcessorResponse \ "id").as[String]

      val processorInstance: ProcessorInstance = createInstanceResponse.toString().toObject[ProcessorInstance]


      val updateProcessorProperties =  route(app,
        withDcsCookiesHeaders(FakeRequest(PUT, "/api/flow/processor/" + processorInstanceId  + "/properties"))
          .withJsonBody(Json.parse((processorInstance.properties + ("user" -> "Bob")).toJson))
          .withHeaders((Req.FlowClientId, clientId))
      ).get

      status(updateProcessorProperties) mustBe OK

      val updateProcessorResponse = contentAsJson(updateProcessorProperties).as[JsObject]
      val updateProcessorInstance = updateProcessorResponse.toString().toObject[ProcessorInstance]

      assert(updateProcessorInstance.properties("user") == "Bob")
      val processorInstanceVersion = (updateProcessorResponse \ "version").as[Long]

      val removeProcessorResponse =  route(app,
        withDcsCookiesHeaders(FakeRequest(DELETE, "/api/flow/processor/" + processorInstanceId))
          .withHeaders((Req.FlowClientId, clientId),
            (Req.FlowComponentVersion, processorInstanceVersion.toString))
      ).get

      status(removeProcessorResponse) mustBe OK

      val deleteInstance = route(app,
        withDcsCookiesHeaders(FakeRequest(DELETE, "/api/flow/instances/" + flowInstanceId))
          .withHeaders((Req.FlowClientId, clientId),
            (Req.FlowComponentVersion, flowInstanceVersion.toString))
      ).get

      status(deleteInstance) mustBe OK
    }

    "update processor schema correctly" taggedAs IT in {
      init(app)

      val clientId = UUID.randomUUID().toString

      val templates = route(app,
        withDcsCookiesHeaders(FakeRequest(GET, "/api/flow/templates"))).get

      status(templates) mustBe OK

      val templatesResponse = contentAsJson(templates).as[JsArray]
      val flowTemplate = templatesResponse.value.find(ft => (ft \ "name").as[String] == "CleanGBIFDataScratch1")

      assert(flowTemplate.isDefined)


      val flowTemplateId = (flowTemplate.get \ "id").as[String]

      val flowInstance = route(app,
        withDcsCookiesHeaders(FakeRequest(POST, "/api/flow/instances/instantiate/" + flowTemplateId))
          .withHeaders((Req.FlowClientId, clientId))
      ).get

      status(flowInstance) mustBe OK

      val createInstanceResponse = contentAsJson(flowInstance).as[JsObject]

      val flowInstanceId = (createInstanceResponse \ "id").as[String]

      val processorId = ((createInstanceResponse \ "processors").
        as[JsArray].value.find(jsv => (jsv \ "processorType").as[String] == RemoteProcessor.IngestionProcessorType).
        get \ "id").as[String]


      val SciNName = "scientificName"
      val remSciNameAction = SchemaAction(SchemaAction.SCHEMA_REM_ACTION, JsonPath.Root + JsonPath.Sep + SciNName)

      var body = List(remSciNameAction).toJson
      var updatedRemProcessors =  route(app,
        withDcsCookiesHeaders(FakeRequest(PUT, "/api/flow/processor/schema/" + flowInstanceId + "/" + processorId))
          .withJsonBody(Json.parse(List(remSciNameAction).toJson))
          .withHeaders((Req.FlowClientId, clientId))).get

      status(updatedRemProcessors) mustBe OK

      var updateProcessorRemSchemaResponse = contentAsJson(updatedRemProcessors).as[JsArray]

      assert(updateProcessorRemSchemaResponse.value.size == 4)

      updateProcessorRemSchemaResponse.value.tail.
        foreach(p => assert(
          new Schema.Parser()
            .parse((p \ "properties" \ "_READ_SCHEMA").as[String]).getField(SciNName) == null
        ))

      val addSciNameAction = SchemaAction(SchemaAction.SCHEMA_ADD_ACTION,
        JsonPath.Root,
        new SchemaField(SciNName, Schema.Type.STRING.getName, "", null))


      val updatedAddSchemaProcessors =  route(app,
        withDcsCookiesHeaders(FakeRequest(PUT, "/api/flow/processor/schema/" + flowInstanceId + "/" + processorId))
          .withJsonBody(Json.parse(List(addSciNameAction).toJson))
          .withHeaders((Req.FlowClientId, clientId))).get

      status(updatedAddSchemaProcessors) mustBe OK

      val updateProcessorAddSchemaResponse = contentAsJson(updatedAddSchemaProcessors).as[JsArray]

      assert(updateProcessorAddSchemaResponse.value.size == 4)

      updateProcessorAddSchemaResponse.value.tail.
        foreach(p => assert(
          new Schema.Parser()
            .parse((p \ "properties" \ "_READ_SCHEMA").as[String]).getField(SciNName) != null
        ))
    }
  }

}
