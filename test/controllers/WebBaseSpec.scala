package controllers

import org.scalatest.Tag
import org.scalatestplus.play.PlaySpec

/**
  * Created by cmathew on 26/07/16.
  */
class WebBaseSpec extends PlaySpec {
  val XsrfTokenCookieName = "XSRF-TOKEN"
  val XsrfTokenHeaderName = "X-XSRF-TOKEN"
  val AuthorizationHeaderName = "Authorization"
}


object IT extends Tag("IT")