package controllers

import java.security.KeyPair

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64
import global.AuthorisationService
import org.dcs.commons.config.Configurator
import org.keycloak.authorization.client.AuthzClient
import org.scalatest.Tag
import org.scalatest.mock.MockitoSugar
import org.scalatestplus.play.PlaySpec
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder

/**
  * Created by cmathew on 26/07/16.
  */

object WebBaseSpec {
  val XsrfTokenCookieName = "XSRF-TOKEN"
  val XsrfTokenHeaderName = "X-XSRF-TOKEN"
  val AuthorizationHeaderName = "Authorization"

  val TestKeyPair: KeyPair = io.jsonwebtoken.impl.crypto.RsaProvider.generateKeyPair(512)

}
class WebBaseSpec extends PlaySpec with MockitoSugar

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

object IT extends Tag("IT")