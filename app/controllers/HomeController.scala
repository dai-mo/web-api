package controllers

import java.util.UUID
import javax.inject._

import controllers.util.CSRFCheckAction
import controllers.util.CSRFTokenAction
import controllers.util.Req
import play.api._
import play.api.mvc._
import play.api.routing.Router

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(webJarAssets: WebJarAssets,
                               router: Provider[Router],
                               csrfCheckAction: CSRFCheckAction,
                               csrfTokenAction: CSRFTokenAction) extends Controller {

  /**
    * Create an Action to render an HTML page with a welcome message.
    * The configuration in the `routes` file means that this method
    * will be called when the application receives a `GET` request with
    * a path of `/`.
    */
  def index() = csrfTokenAction { implicit request =>
    val result = Ok(views.html.index(webJarAssets))

    if(request.cookies.get(Req.AuthTokenKey) == None)
      result.withCookies(Cookie(Req.AuthTokenKey,UUID.randomUUID.toString))
    else
      result
  }

  def modulePartials(module:String, partial: String) = Action {
    (module, partial) match  {
      case ("", "wsview.html") => Ok(views.html.partials.wsview())
      case ("", "layout.html") => Ok(views.html.partials.layout())
      case ("analyse", "view.html") => Ok(views.html.partials.analyse.view())
      case ("mobilise", "view.html") => Ok(views.html.partials.mobilise.view())
      case ("visualise", "view.html") => Ok(views.html.partials.visualise.view())
      case _ => NotFound
    }
  }

  def doc() = Action {
    Ok(router.get().documentation.map(_.toString).mkString("\n"))
  }

}
