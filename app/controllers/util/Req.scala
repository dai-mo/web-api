package controllers.util

import org.dcs.commons.error.{ErrorConstants, RESTException}
import play.api.mvc.{AnyContent, Request, RequestHeader}
import org.dcs.commons.serde.JsonSerializerImplicits._

import scala.reflect.ClassTag

/**
  * Created by cmathew on 09/07/16.
  */
object Req {
  val AuthTokenKey = "authConfig-token"
  val FlowComponentVersion = "flow-component-version"
  val FlowClientId = "flow-client-id"

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

  def clientId(implicit request: RequestHeader): String = {
    request.headers.get(FlowClientId).get
  }

  def version(implicit request: RequestHeader): Long = {
    request.headers.get(FlowComponentVersion).get.toLong
  }

  def body(implicit request: Request[AnyContent]): String = {
    request.body.asText.get
  }
}
