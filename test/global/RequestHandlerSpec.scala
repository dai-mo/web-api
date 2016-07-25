package global

import org.dcs.web.BuildInfo
import org.scalatestplus.play.{OneAppPerSuite, PlaySpec}
import play.api.libs.json.JsObject
import play.api.test.FakeRequest
import play.api.test.Helpers._

/**
  * Created by cmathew on 22/07/16.
  */
class RequestHandlerSpec extends PlaySpec with OneAppPerSuite {

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