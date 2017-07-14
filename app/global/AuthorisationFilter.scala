package global

import javax.inject.Inject

import akka.stream.Materializer
import controllers.ModelImplicits._
import org.dcs.commons.error._
import play.api.libs.json.Json
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.control.NonFatal

/**
  *
  * Created by cmathew on 13.10.16.
  */

// FIXME: Not really sure if we need a filter which checks every
// api call for permissions or if it is more efficient to
// have the check for specific api endpoints (RptAction)
// Currently, this filter is not used

object AuthorisationFilter {
  def permit(requestHeader: RequestHeader,
             authService: AuthorisationService): Option[HttpErrorResponse] = {
    val headers = requestHeader.headers
    var perms = true
    var error: Option[HttpErrorResponse] = None
    val auth = headers.get("authorization")
    if (auth.isDefined) {
      perms = false
      try {
        val claims = authService.claims(headers.get("authorization"))
        perms = authService.checkPermissions(requestHeader.path, requestHeader.method, claims)
      } catch {
        case re: HttpException => {
          val er = re.errorResponse
          error = Some(er)
        }
        case NonFatal(t) => error = Some(ErrorConstants.DCS500.http(500))
      }
    }
    if (perms) {
      None
    } else {
      if(error.isDefined)
        Some(error.get)
      else {
        val er = ErrorConstants.DCS503.withDescription("Insufficient permissions to execute request").http(401)
        Some(er)
      }
    }
  }
}

class AuthorisationFilter @Inject() (authService: AuthorisationService,
                                     implicit val mat: Materializer) extends Filter {
  def apply(nextFilter: RequestHeader => Future[Result])
           (requestHeader: RequestHeader): Future[Result] = {
    val error: Option[HttpErrorResponse] = AuthorisationFilter.permit(requestHeader, authService)
    if (error.isEmpty) {
      nextFilter(requestHeader)
    } else {
      Future(Status(error.get.httpStatusCode)(Json.toJson(error.get)))
    }
  }
}

