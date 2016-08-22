package controllers

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
class FlowInstanceApiISpec extends WebBaseSpec with OneAppPerTest {

  "Template Instantiation" should {
    "return the instantiated template" taggedAs(IT) in {
      val home = route(app, FakeRequest(GET, "/")).get

      status(home) mustBe OK
      val authToken = cookies(home).get(Req.AuthTokenKey)
      assert(authToken != None)

      val xsrfToken = cookies(home).get(XsrfTokenCookieName)
      assert(xsrfToken != None)


      val instance = route(app,
        FakeRequest(POST, "/api/flow/instances/create/7c88e3e4-0dce-498b-8ee0-098281abb32a")
        .withCookies(authToken.get, xsrfToken.get)
        .withHeaders((XsrfTokenHeaderName, xsrfToken.get.value))).get

      status(instance) mustBe OK

      val response = contentAsJson(instance).as[JsObject]
      assert(response.value("processors").as[JsArray].value.size == 5)

    }
  }
}
