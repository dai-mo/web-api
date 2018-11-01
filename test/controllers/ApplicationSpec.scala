/*
 * Copyright (c) 2017-2018 brewlabs SAS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package controllers

import controllers.util.RemoteClient
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
      .overrides(bind[RemoteClient].to[MockRemote])
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
