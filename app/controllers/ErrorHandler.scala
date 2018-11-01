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

import controllers.ModelImplicits._
import org.dcs.commons.error._
import play.api.http.HttpErrorHandler
import play.api.libs.json.Json
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent._

class ErrorHandler extends HttpErrorHandler {


  def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
    var result = Status(statusCode)(Json.toJson(HttpErrorResponse("DCS400", "Web client error", message, statusCode)))
    if(statusCode == play.api.http.Status.NOT_FOUND) {
      // handle trailing slashes
      if (request.path.endsWith("/")) {
        val uri = request.path.take(request.path.length - 1) + {
          if (request.path == request.uri) "" // no query string
          else request.uri.substring(request.path.length)
        }
        result = MovedPermanently(uri)
      }
    }
    Future.successful(
      result
    )
  }

  def onServerError(request: RequestHeader, exception: Throwable) = {
    Future.successful(
      exception match {
        case he: HttpException => {
          val errorResponse = he.errorResponse
          Status(errorResponse.httpStatusCode)(Json.toJson(errorResponse))
        }
        case dcse: DCSException => {
          val errorResponse = dcse.errorResponse
          InternalServerError(Json.toJson(errorResponse))
        }
        case _ => {
          exception.printStackTrace()
          InternalServerError(Json.toJson(ErrorConstants.UnknownErrorResponse.withDescription(exception.getMessage)))
        }
      }
    )
  }

}

