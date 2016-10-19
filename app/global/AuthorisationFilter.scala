package global

import javax.inject.Inject

import controllers.ModelImplicits._
import akka.stream.Materializer
import org.dcs.api.error.{ErrorConstants, ErrorResponse, RESTException}
import org.dcs.commons.JsonSerializerImplicits._
import play.api.libs.json.Json
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.control.NonFatal

/**
  * Created by cmathew on 13.10.16.
  */

object AuthorisationFilter {
  def permit(requestHeader: RequestHeader,
             authService: AuthorisationService): Option[ErrorResponse] = {
    val headers = requestHeader.headers
    var perms = true
    var error: Option[ErrorResponse] = None
    val auth = headers.get("authorization")
    if (auth.isDefined) {
      perms = false
      try {
        val claims = authService.claims(headers.get("authorization"))
        perms = authService.checkPermissions(requestHeader.path, requestHeader.method, claims)
      } catch {
        case re: RESTException => {
          val er = re.errorResponse
          error = Some(er)
        }
        case NonFatal(t) => error = Some(ErrorConstants.DCS500)
      }
    }
    if (perms) {
      None
    } else {
      if(error.isDefined)
        Some(error.get)
      else {
        val er = ErrorConstants.DCS503.withErrorMessage("Insufficient permissions to execute request")
        Some(er)
      }
    }
  }
}

class AuthorisationFilter @Inject() (authService: AuthorisationService,
                                     implicit val mat: Materializer) extends Filter {
  def apply(nextFilter: RequestHeader => Future[Result])
           (requestHeader: RequestHeader): Future[Result] = {
    val error: Option[ErrorResponse] = AuthorisationFilter.permit(requestHeader, authService)
    if (error.isEmpty) {
      nextFilter(requestHeader)
    } else {
      Future(Status(error.get.httpStatusCode)(Json.toJson(error.get)))
    }
  }
}

