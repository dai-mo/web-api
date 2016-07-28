package controllers

import org.scalatestplus.play._
import play.api.test.Helpers._
import play.api.test._


class ApplicationSpec extends WebBaseSpec with OneAppPerTest {

  "Routes" should {
    "send 404 on a bad request" in  {
      route(app, FakeRequest(GET, "/badrequest")).map(status(_)) mustBe Some(NOT_FOUND)
    }
  }

  "HomeController" should {
    "render the index page" in {
      val home = route(app, FakeRequest(GET, "/")).get

      status(home) mustBe OK
      contentAsString(home) must include ("javascripts/test.systemjs.config.js")
    }
  }
  "HomeController" should {
    "render the doc page" in {
      val home = route(app, FakeRequest(GET, "/api/doc")).get

      status(home) mustBe OK
      contentAsString(home) must include ("/api/doc")
    }
  }



}
