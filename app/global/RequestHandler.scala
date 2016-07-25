package global

import javax.inject.Inject

import global.RequestHandler._
import play.api.http._
import play.api.mvc._
import play.api.routing.Router
import play.mvc.Http.{HeaderNames, MimeTypes}

import scala.language.postfixOps

object RequestHandler {
  val JsonPattern = "(^/api.*)\\.(json|xml)(\\??.*)".r

  def mimeType(ext: String): String = ext match {
    case "json" => MimeTypes.JSON
    case "xml" => MimeTypes.XML
    case _ => MimeTypes.JSON
  }
  def mimeTypeExt(request: RequestHeader): Option[String] = request.uri match {
    case JsonPattern(baseUri, ext, query) => Some(mimeType(ext))
    case _ => None
  }


  def requestWithoutExt(request: RequestHeader): RequestHeader = request.uri match {
    case JsonPattern(baseUri, ext, query) => request.copy(
      uri = baseUri + query,
      path = baseUri
    )
    case _ => request
  }
}

/**
  * Created by cmathew on 22/07/16.
  */
class RequestHandler @Inject() (router: Router,
                                errorHandler: HttpErrorHandler,
                                configuration: HttpConfiguration,
                                filters: HttpFilters
                               ) extends DefaultHttpRequestHandler(router, errorHandler, configuration, filters) {

  override def routeRequest(request: RequestHeader) =
    super.routeRequest(requestWithoutExt(request))
}
