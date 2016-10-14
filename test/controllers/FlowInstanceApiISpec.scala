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

      val rpt = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4anhCbl9aZXl5NHg0YXdHUVVHNl9FZmxRaUNZR2NPckpieFZLeHE3ZXBzIn0.eyJqdGkiOiJiMWY1ZWViYS1hMTA3LTRjNzUtODQzZC1kMGVmMGRlOTM0YzEiLCJleHAiOjE0NzYyNjg2MTksIm5iZiI6MCwiaWF0IjoxNDc2MjY4MzE5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjE4MDgwL2F1dGgvcmVhbG1zL2FsYW1iZWVrIiwiYXVkIjoiYWxhbWJlZWstd2ViYXBwIiwic3ViIjoiMDE0YWJiNjgtMWVkZi00NjZhLWFmODctNDE4MWY3YzhmOGIxIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWxhbWJlZWstd2ViYXBwIiwibm9uY2UiOiJmNDZmYTYwNi02ODA1LTQ4MjktOTg3Mi03MmIxYWZlNGJhYWUiLCJhdXRoX3RpbWUiOjE0NzYyNjgzMTUsInNlc3Npb25fc3RhdGUiOiJkZjVhYzgwOS04ZWZjLTQyMTYtYWVjYS01Y2E0MzNmMGE0ZTYiLCJuYW1lIjoiQ2hlcmlhbiBNYXRoZXciLCJnaXZlbl9uYW1lIjoiQ2hlcmlhbiIsImZhbWlseV9uYW1lIjoiTWF0aGV3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiY21hdGhldyIsImVtYWlsIjoiY2hlcmlhbi5tYXRoZXdAYnJld2xhYnMuZXUiLCJhY3IiOiIxIiwiY2xpZW50X3Nlc3Npb24iOiI5OWE1YWY5OS04NDI2LTQwYmMtYjE5MS1kNTRiNTQ5ZGViMGYiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiIsInVzZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1wcm9maWxlIl19fSwiYXV0aG9yaXphdGlvbiI6eyJwZXJtaXNzaW9ucyI6W3sic2NvcGVzIjpbInVybjphbGFtYmVlazpzY29wZXM6Zmxvdy1pbnN0YW5jZTpjcmVhdGUiXSwicmVzb3VyY2Vfc2V0X2lkIjoiY2UyZTk3N2QtM2QzZi00ZmE1LWJmMTYtZGE2ZGVjMzVlOWRmIiwicmVzb3VyY2Vfc2V0X25hbWUiOiJmbG93LWluc3RhbmNlIn0seyJyZXNvdXJjZV9zZXRfaWQiOiJhOWQyYWViNS1hZjE2LTQzNGYtYmY4My01ZTcwZWU5N2YyMDciLCJyZXNvdXJjZV9zZXRfbmFtZSI6IkRlZmF1bHQgUmVzb3VyY2UifV19fQ.bZjjiZrYLH2MJA_jP7Hq3xGjDMVx1d7Leeh10RNDTXJtkvCyD6gGEshlOKzV40D8Dq2Uj8Dqq3pyn_XCDLZWXzNL_V5OcX400DkjQrSvhkSZAkkLkGj7f5-flAwb1h6rvIq6Y8XIRxx2tcx9xh67iw7KPYmDOwFV3KZf_CNwXhpVhUT4RRYw6TayMTr_jAn0YAF15XCyICXdv3hNjs_LrvYemy3YSLx0HAbdk62uBwdT6jEmFWGrmg2RFdrZkOrRMzhWiFoxajETqicbuEvJa570V1f5iatH4xyiZMfB1_xM42Mp_Mjxc5RpYdIrUfRuHpmYtYifqQzRsE0TE80AmQ"
      val instance = route(app,
        FakeRequest(POST, "/api/flow/instances/create/3a0ed808-3cad-4895-8f64-f54364aceac6")
        .withCookies(authToken.get, xsrfToken.get)
        .withHeaders((XsrfTokenHeaderName, xsrfToken.get.value),
          (AuthorizationHeaderName, "Bearer " + rpt))).get

      status(instance) mustBe OK

      val response = contentAsJson(instance).as[JsObject]
      assert(response.value("processors").as[JsArray].value.size == 5)

    }
  }
}
