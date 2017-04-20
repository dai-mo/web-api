package controllers

import java.util.UUID

import controllers.util.Req
import org.scalatest.Ignore
import org.scalatestplus.play._
import play.api.libs.json.{JsArray, JsObject}
import play.api.test.Helpers._
import play.api.test._

/**
  * Created by cmathew on 25/07/16.
  */
//FIXME: Setting to ignore
//       otherwise this test will be run during the release
//       process. This should be reverted once the integration
//       test environment is setup.
@Ignore
class FlowInstanceApiISpec  extends WebBaseSpec with OneAppPerTest {

  "Template Instantiation" should {
    "return the instantiated template" taggedAs(IT) in {

      init(app)

      val clientId = UUID.randomUUID().toString

      val templates = route(app,
        withDcsCookiesHeaders(FakeRequest(GET, "/api/flow/templates"))).get

      status(templates) mustBe OK

      val templatesResponse = contentAsJson(templates).as[JsArray]
      val flowTemplate = templatesResponse.value.find(ft => (ft \ "name").as[String] == "CleanGBIFData")

      assert(flowTemplate.isDefined)


      val flowTemplateId = (flowTemplate.get \ "id").as[String]

      val flowInstance = route(app,
        withDcsCookiesHeaders(FakeRequest(POST, "/api/flow/instances/instantiate/" + flowTemplateId))
          .withHeaders((Req.FlowClientId, clientId))
      ).get

      status(flowInstance) mustBe OK

      val createInstanceResponse = contentAsJson(flowInstance).as[JsObject]
      assert((createInstanceResponse \ "processors").as[JsArray].value.size == 4)

      val flowInstanceId = (createInstanceResponse \ "id").as[String]
      val flowInstanceVersion = (createInstanceResponse \ "version").as[Long]

      val deleteInstance = route(app,
        withDcsCookiesHeaders(FakeRequest(DELETE, "/api/flow/instances/" + flowInstanceId))
      .withHeaders((Req.FlowClientId, clientId),
        (Req.FlowComponentVersion, flowInstanceVersion.toString))  ).get

      status(deleteInstance) mustBe OK

    }
  }
}
