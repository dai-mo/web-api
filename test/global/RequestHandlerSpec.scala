package global

import controllers.{MockAuthorisationService, WebBaseSpec}
import org.dcs.web.BuildInfo
import org.scalatest.TestData
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
class RequestHandlerSpec extends WebBaseSpec with OneAppPerSuite {

  override implicit lazy val app: Application =
    new GuiceApplicationBuilder()
      .overrides(bind[AuthorisationService].to[MockAuthorisationService])
      .build

  "Serialized response for requested extension with query param - json" should {
    "be json" in {
      val health = route(app, FakeRequest(GET, "/api/health.json?query=test")).get

      status(health) mustBe OK
      contentType(health) mustBe Some("application/json")
      contentAsJson(health).as[JsObject].value("version").as[String] mustBe BuildInfo.version
    }
  }

  "Serialized response for requested extension - xml and requested content type - json" should {
    "should fail with not acceptable response" in {
      val health = route(app, FakeRequest(GET, "/api/health.xml?query=test").withHeaders((ACCEPT, "application/json"))).get

      status(health) mustBe NOT_ACCEPTABLE
    }
  }

  "Serialized response for requested extension - xml" should {
    "should fail with not acceptable response" in {
      val health = route(app, FakeRequest(GET, "/api/health.xml")).get

      status(health) mustBe NOT_ACCEPTABLE
    }
  }
}
