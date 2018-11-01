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

import java.security.KeyPair

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64
import controllers.WebBaseSpec.{AuthorizationHeaderName, XsrfTokenCookieName, XsrfTokenHeaderName}
import controllers.util.{RemoteClient, Req}
import global.AuthorisationService
import org.dcs.api.service.{ProcessorDetails, RemoteProcessorService}
import org.dcs.commons.config.Configurator
import org.dcs.remote.ZkRemoteService
import org.keycloak.authorization.client.AuthzClient
import org.scalatest.{SuiteMixin, Tag}
import org.scalatest.mock.MockitoSugar
import org.scalatestplus.play.{OneAppPerTest, PlaySpec}
import play.api.Application
import play.api.mvc.Cookie
import play.api.test.FakeRequest
import play.api.test.Helpers._

/**
  * Created by cmathew on 26/07/16.
  */

object WebBaseSpec {
  val XsrfTokenCookieName = "XSRF-TOKEN"
  val XsrfTokenHeaderName = "X-XSRF-TOKEN"
  val AuthorizationHeaderName = "Authorization"

  val TestKeyPair: KeyPair = io.jsonwebtoken.impl.crypto.RsaProvider.generateKeyPair(512)

}
class WebBaseSpec extends PlaySpec with MockitoSugar {

  var authService: AuthorisationService = _
  var xsrfToken: Option[Cookie] = None
  var authToken: Option[Cookie] = None

  def init(app: Application): Unit = {
    authService = new AuthorisationService()
    val home = route(app, FakeRequest(GET, "/")).get
    status(home) mustBe OK

    authToken = cookies(home).get(Req.AuthTokenKey)
    assert(authToken.isDefined)

    xsrfToken = cookies(home).get(XsrfTokenCookieName)
    assert(xsrfToken.isDefined)
  }

  def accessToken = authService.authzClient.obtainAccessToken("dcs", "dcs").getToken

  def withDcsCookiesHeaders[A](fr: FakeRequest[A]): FakeRequest[A] = {
    withDcsHeaders(withDcsCookies(fr))
  }

  def withDcsCookies[A](fr: FakeRequest[A]): FakeRequest[A] = {
    fr.withCookies(authToken.get, xsrfToken.get)
  }
  def withDcsHeaders[A](fr: FakeRequest[A]): FakeRequest[A] = {
    fr.withHeaders((XsrfTokenHeaderName, xsrfToken.get.value),
      (AuthorizationHeaderName, "Bearer " + accessToken))
  }

  def withBody[A](body: A)(fr: FakeRequest[A]): FakeRequest[A] = {
    fr.withBody(body)
  }
}



class MockAuthorisationService extends AuthorisationService {

  keycloakConfig.setRealmKey(Base64.encode(WebBaseSpec.TestKeyPair.getPublic.getEncoded))

  def updateRealmKey(realmKey: String): MockAuthorisationService = {
    keycloakConfig.setRealmKey(realmKey)
    this
  }

  override def authConfig =
    new Configurator(Some("/auth-config.json"), None).config()

  override def initAuthzClient(): AuthzClient = null

}


class MockRemote extends RemoteClient {
  override def init: Unit = {}

  override def broker: ZkRemoteService.type = null

  override def serviceDetails(processorServiceClassName: String, stateful: Boolean): ProcessorDetails = null

  override def service(processorServiceClassName: String, stateful: Boolean): RemoteProcessorService = null

  override def service(processorServiceClassName: String): RemoteProcessorService = null
}

object IT extends Tag("IT")