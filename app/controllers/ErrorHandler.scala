package controllers

import javax.inject.Inject

import org.dcs.api.error.{ErrorConstants, ErrorResponse, RESTException}
import play.api.http.HttpErrorHandler
import play.api.libs.json.Json
import play.api.mvc._
import play.api.mvc.Results._
import controllers.ModelImplicits._

import scala.concurrent._

class ErrorHandler extends HttpErrorHandler {


  def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
    Future.successful(
      Status(statusCode)("A client error occurred: " + message)
    )
  }

  def onServerError(request: RequestHeader, exception: Throwable) = {
    Future.successful(
      if(exception.isInstanceOf[RESTException])
        InternalServerError(Json.toJson(exception.asInstanceOf[RESTException].errorResponse))
      else {
        exception.printStackTrace
        InternalServerError(Json.toJson(ErrorConstants.UnknownErrorResponse))
      }
    )
  }

}

