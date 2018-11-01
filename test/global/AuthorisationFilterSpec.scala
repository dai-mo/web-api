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


import java.util.Date

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64
import controllers.WebBaseSpec._
import controllers.{MockAuthorisationService, Permission, WebBaseSpec}
import io.jsonwebtoken.{Jwts, SignatureAlgorithm}
import org.apache.commons.lang3.time.DateUtils
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.collection.JavaConverters._
import scala.collection.mutable

object AuthorisationFilterSpec {

  val DefaultIssuer = "http://keycloak:8080/auth/realms/alambeek"
  val DefaultAudience = "alambeek-webapp"

  val DefaultPermissions = List(
    Permission(
      List("urn:alambeek:scopes:flow-instance:create"),
      "create-flow-instance-id",
      "flow-instance"),
    Permission(
      List("urn:alambeek:scopes:flow-instance:delete",
        "urn:alambeek:scopes:flow-instance:view",
        "urn:alambeek:scopes:flow-instance:update"),
      "manage-flow-instance-id",
      "flow-instance:1")
  )
}

/**
  * Created by cmathew on 14.10.16.
  */
class AuthorisationFilterSpec extends WebBaseSpec {

  import AuthorisationFilterSpec._

  "Authorisation Filter" should {
    "not permit rpt with an expired timestamp" in {
      val rpt = generateRpt(expirationDate = new Date())

      val request = FakeRequest(POST, "/").withHeaders((AuthorizationHeaderName, "Bearer " + rpt))

      val authService = new MockAuthorisationService()
      val result = AuthorisationFilter.permit(request, authService)

      assert(result.isDefined)
      assert(result.get.httpStatusCode == 401)
      assert(result.get.code == "DCS502")
    }
  }

  "Authorisation Filter" should {
    "not permit invalid rpt" in {


      val request = FakeRequest(POST, "/").withHeaders((AuthorizationHeaderName, "Bearer " + "invalidrpt"))

      val authService = new MockAuthorisationService()
      val result = AuthorisationFilter.permit(request, authService)

      assert(result.isDefined)
      assert(result.get.httpStatusCode == 401)
      assert(result.get.code == "DCS502")

    }
  }

  "Authorisation Filter" should {
    "not permit invalid client / issuer" in {

      var rpt = generateRpt(audience = "invalid client")

      var request = FakeRequest(POST, "/").withHeaders((AuthorizationHeaderName, "Bearer " + rpt))

      val authService = new MockAuthorisationService()
      var result = AuthorisationFilter.permit(request, authService)

      assert(result.isDefined)
      assert(result.get.httpStatusCode == 401)
      assert(result.get.code == "DCS502")

      rpt = generateRpt(issuer = "invalid issuer")

      request = FakeRequest(POST, "/").withHeaders((AuthorizationHeaderName, "Bearer " + rpt))

      result = AuthorisationFilter.permit(request, authService)

      assert(result.isDefined)
      assert(result.get.httpStatusCode == 401)
      assert(result.get.code == "DCS502")

    }
  }



  "Authorisation Filter" should {
    "not permit protected api endpoints with invalid permissions" in {

      val invalidPermissions = List(
        Permission(
          List("urn:alambeek:scopes:flow-instance:invalid"),
          "create-flow-instance-id",
          "flow-instance"))

      val rpt = generateRpt(permissions = invalidPermissions)

      val request = FakeRequest(POST, "/api/flow/instances/create/12345").withHeaders((AuthorizationHeaderName, "Bearer " + rpt))

      val authService = new MockAuthorisationService()
      val result = AuthorisationFilter.permit(request, authService)

      assert(result.isDefined)
      assert(result.get.httpStatusCode == 401)
      assert(result.get.code == "DCS503")

    }
  }

  "Authorisation Filter" should {
    "not permit protected api endpoints with empty permissions" in {

      val rpt = generateRpt(permissions = Nil)

      val request = FakeRequest(POST, "/api/flow/instances/create/12345").withHeaders((AuthorizationHeaderName, "Bearer " + rpt))

      val authService = new MockAuthorisationService()
      val result = AuthorisationFilter.permit(request, authService)

      assert(result.isDefined)
      assert(result.get.httpStatusCode == 401)
      assert(result.get.code == "DCS503")

    }
  }

  "Authorisation Filter" should {
    "permit api endpoints not listed in the auth policy config" in {

      val rpt = generateRpt()

      val request = FakeRequest(POST, "/").withHeaders((AuthorizationHeaderName, "Bearer " + rpt))

      val authService = new MockAuthorisationService()
      val result = AuthorisationFilter.permit(request, authService)

      assert(result.isEmpty)

    }
  }


  "Authorisation Filter" should {
    "permit protected api endpoints with valid permissions" in {

      val rpt = generateRpt()

      val request = FakeRequest(POST, "/api/flow/instances/create/12345").withHeaders((AuthorizationHeaderName, "Bearer " + rpt))

      val authService = new MockAuthorisationService()
      val result = AuthorisationFilter.permit(request, authService)

      assert(result.isEmpty)

    }
  }



  def generateRpt(permissions: List[Permission] = DefaultPermissions,
                  audience: String = DefaultAudience,
                  issuer: String = DefaultIssuer,
                  expirationDate: Date = DateUtils.addHours(new Date(), 1)): String = {
    val rptPermissions = permissions.map(p => mutable.LinkedHashMap("scopes" -> p.scopes.asJava,
      "resource_set_id" -> p.resourceId,
      "resource_set_name" -> p.resourceName).asJava).asJava

    Jwts.builder()
      .claim("authorization",  mutable.LinkedHashMap("permissions" -> rptPermissions).asJava)
      .setAudience(audience)
      .setIssuer(issuer)
      .setExpiration(expirationDate)
      .signWith(SignatureAlgorithm.RS256, TestKeyPair.getPrivate)
      .compact()
  }
}


