package controllers.util

import controllers.{MockAuthorisationService, MockRemote, WebBaseSpec}
import global.AuthorisationService
import org.dcs.web.BuildInfo
import org.scalatestplus.play.{OneAppPerSuite, PlaySpec}
import play.api.Application
import play.api.inject._
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.JsObject
import play.api.test.FakeRequest
import play.api.test.Helpers._

/**
  * Created by cmathew on 22/07/16.
  */
class ContentSpec extends WebBaseSpec with OneAppPerSuite {

  override implicit lazy val app: Application =
    new GuiceApplicationBuilder()
      .overrides(bind[AuthorisationService].to(new MockAuthorisationService))
      .overrides(bind[RemoteClient].to[MockRemote])
      .build

  "Default serialized response content type" should {
    "be json" in {
      val health = route(app, FakeRequest(GET, "/api/health")).get

      status(health) mustBe OK
      contentType(health) mustBe Some("application/json")
      contentAsJson(health).as[JsObject].value("version").as[String] mustBe BuildInfo.version
    }
  }

  "Serialized response for requested content type - json" should {
    "be json" in {
      val health = route(app, FakeRequest(GET, "/api/health").withHeaders((ACCEPT, "application/json"))).get

      status(health) mustBe OK
      contentType(health) mustBe Some("application/json")
      contentAsJson(health).as[JsObject].value("version").as[String] mustBe BuildInfo.version
    }
  }


  "Serialized response for requested content type - xml" should {
    "should fail with not acceptable response" in {
      val health = route(app, FakeRequest(GET, "/api/health").withHeaders((ACCEPT, "application/xml"))).get

      status(health) mustBe NOT_ACCEPTABLE
    }
  }

}
