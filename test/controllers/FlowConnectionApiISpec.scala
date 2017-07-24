package controllers

import java.util.UUID

import controllers.util.Req
import org.dcs.api.processor.RemoteProcessor
import org.dcs.api.service._
import org.scalatestplus.play.OneAppPerTest
import play.api.libs.json.JsObject
import play.api.test.FakeRequest
import play.api.test.Helpers._
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.scalatest.Ignore

/**
  * Created by cmathew on 20.04.17.
  */
@Ignore
class FlowConnectionApiISpec extends WebBaseSpec with OneAppPerTest {

  "Flow Connection Api" should {
    "manage connections correctly" taggedAs IT in {
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

      val processor1 = route(app,
        withDcsCookiesHeaders(FakeRequest(POST, "/api/flow/processor/create/" + flowInstanceId))
          .withTextBody(psd.toJson)
          .withHeaders((Req.FlowClientId, clientId))).get

      status(processor1) mustBe OK

      val createProcessor1Response = contentAsJson(processor1).as[JsObject]
      val processor1InstanceId = (createProcessor1Response \ "id").as[String]

      val processor2 = route(app,
        withDcsCookiesHeaders(FakeRequest(POST, "/api/flow/processor/create/" + flowInstanceId))
          .withTextBody(psd.toJson)
          .withHeaders((Req.FlowClientId, clientId))).get

      status(processor2) mustBe OK

      val createProcessor2Response = contentAsJson(processor2).as[JsObject]
      val processor2InstanceId = (createProcessor2Response \ "id").as[String]

      val connectionCreate = ConnectionConfig(flowInstanceId,
        Connectable(processor1InstanceId, FlowComponent.ProcessorType, flowInstanceId),
        Connectable(processor2InstanceId, FlowComponent.ProcessorType, flowInstanceId),
        Set("success"),
        Set("success", "failure"))

      val createConnection = route(app,
        withDcsCookiesHeaders(FakeRequest(POST, "/api/flow/connection"))
          .withTextBody(connectionCreate.toJson)
          .withHeaders((Req.FlowClientId, clientId))).get

      status(createConnection) mustBe OK

      val connection = contentAsJson(createConnection).as[JsObject].toString.toObject[Connection]
      val cName = "test"
      connection.setName(cName)

      val updateConnection = route(app,
        withDcsCookiesHeaders(FakeRequest(PUT, "/api/flow/connection/" + connection.id))
          .withTextBody(connection.toJson)
          .withHeaders((Req.FlowClientId, clientId))).get

      status(updateConnection) mustBe OK

      val connectionWithName = contentAsJson(updateConnection).as[JsObject].toString.toObject[Connection]
      assert(connectionWithName.name == cName)

      val deleteConnection = route(app,
        withDcsCookiesHeaders(FakeRequest(DELETE, "/api/flow/connection/" + connection.id))
          .withHeaders((Req.FlowComponentVersion, connection.version.toString),
            (Req.FlowClientId, clientId))).get

      status(deleteConnection) mustBe OK

      val deleteInstance = route(app,
        withDcsCookiesHeaders(FakeRequest(DELETE, "/api/flow/instances/" + flowInstanceId))
          .withHeaders((Req.FlowClientId, clientId),
            (Req.FlowComponentVersion, flowInstanceVersion.toString))
      ).get

      status(deleteInstance) mustBe OK
    }
  }
}
