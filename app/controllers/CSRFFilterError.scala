package controllers

import org.dcs.commons.error.ErrorResponse
import org.dcs.commons.serde.JsonSerializerImplicits._
import play.api.http.Status._
import play.api.mvc.Results.Forbidden
import play.api.mvc.{RequestHeader, Result}

import scala.concurrent.Future


class CSRFFilterError extends play.filters.csrf.CSRF.ErrorHandler {

  override def handle(req: RequestHeader, msg: String): Future[Result] = {
    val response = ErrorResponse("DCS000", "Unauthorised CSRF Access", FORBIDDEN, msg)
    val result = Forbidden(response.toJson)
    Future.successful(result)
  }
}
