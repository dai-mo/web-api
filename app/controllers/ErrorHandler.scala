package controllers

import controllers.ModelImplicits._
import org.dcs.api.error.{ErrorConstants, ErrorResponse, RESTException}
import play.api.http.HttpErrorHandler
import play.api.libs.json.Json
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent._

class ErrorHandler extends HttpErrorHandler {


  def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
    Future.successful(
      Status(statusCode)(Json.toJson(ErrorResponse("DCS400", "Web client error", statusCode, message)))
    )
  }

  def onServerError(request: RequestHeader, exception: Throwable) = {
    Future.successful(
      if(exception.isInstanceOf[RESTException]) {
        val errorResponse = exception.asInstanceOf[RESTException].errorResponse
        Status(errorResponse.httpStatusCode)(Json.toJson(errorResponse))
      } else {
        InternalServerError(Json.toJson(ErrorConstants.UnknownErrorResponse))
      }
    )
  }

}

