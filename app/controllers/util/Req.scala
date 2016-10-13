package controllers.util

import org.dcs.api.error.{ErrorConstants, RESTException}
import play.api.mvc.RequestHeader

/**
  * Created by cmathew on 09/07/16.
  */
object Req {
  val AuthTokenKey = "authConfig-token"

  def authToken(implicit request: RequestHeader): Option[String] = {
    request.cookies.get(AuthTokenKey).map(x => x.value)
  }

  def token(tokenKey: String)(implicit request: RequestHeader): Option[String] = {
    request.cookies.get(AuthTokenKey).map(x => x.value)
  }

  def tokenOrError(tokenKey: String)(implicit request: RequestHeader): String = {
    token(tokenKey)(request) match {
      case Some(tokenValue) => tokenValue
      case None => throw new RESTException(ErrorConstants.DCS003)
    }
  }
}
