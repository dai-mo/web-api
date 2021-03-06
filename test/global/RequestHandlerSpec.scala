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

package global

import controllers.util.RemoteClient
import controllers.{MockAuthorisationService, MockRemote, WebBaseSpec}
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
      .overrides(bind[RemoteClient].to[MockRemote])
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
