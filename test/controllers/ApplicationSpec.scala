package controllers

import global.AuthorisationService
import org.scalatest.TestData
import org.scalatestplus.play._
import play.api.Application
import play.api.inject._
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.Helpers._
import play.api.test._


class ApplicationSpec extends WebBaseSpec with OneAppPerTest {

  override def newAppForTest(testData: TestData): Application =
    new GuiceApplicationBuilder()
      .overrides(bind[AuthorisationService].to[MockAuthorisationService])
      .build

  "Routes" should {
    "send 404 on a bad request" in  {
      route(app, FakeRequest(GET, "/badrequest")).map(status(_)) mustBe Some(NOT_FOUND)
    }
  }

  "HomeController" should {
    "render the index page" in {
      val home = route(app, FakeRequest(GET, "/")).get

      status(home) mustBe OK
      contentAsString(home) must include ("javascripts/systemjs.config.js")
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
