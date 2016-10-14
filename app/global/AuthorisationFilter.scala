package global

import javax.inject.Inject

import controllers.ModelImplicits._
import akka.stream.Materializer
import org.dcs.api.error.{ErrorConstants, RESTException}
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
class AuthorisationFilter @Inject() (implicit val mat: Materializer) extends Filter {
  def apply(nextFilter: RequestHeader => Future[Result])
           (requestHeader: RequestHeader): Future[Result] = {
    val headers = requestHeader.headers
    var perms = true
    var result: Option[Future[Result]] = None
    val auth = headers.get("authorization")
    if (auth.isDefined) {
      perms = false
      try {
        val claims = Authorisation.claims(headers.get("authorization"))
        perms = Authorisation.checkPermissions(requestHeader.path, requestHeader.method, claims)
      } catch {
        case re: RESTException => {
          val er = re.errorResponse
          result = Some(Future {
            Status(er.httpStatusCode)(Json.toJson(er))
          })
        }
        case NonFatal(t) => result = Some(Future {
          Status(401)(Json.toJson(ErrorConstants.DCS500))
        })
      }
    }
    if (perms) {
      nextFilter(requestHeader)
    } else {
      if(result.isDefined)
        result.get
      else {
        val er = ErrorConstants.DCS503.withErrorMessage("Insufficient permissions to execute request")
        Future(Status(er.httpStatusCode)(er.toJson))
      }
    }
  }
}

