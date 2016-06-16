package controllers

import javax.inject._

import play.api._
import play.api.mvc._
import play.api.routing.Router

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(webJarAssets: WebJarAssets, router: Provider[Router]) extends Controller {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index() = Action {
    Ok(views.html.index(webJarAssets))
  }

  def rootPartials(partial: String) = modulePartials("", partial)

  def modulePartials(module:String, partial: String) = Action {
    (module, partial) match  {
      case ("", "ws-view.htm") => Ok(views.html.partials.wsview())
      case ("analyse", "jsview.htm") => Ok(views.html.partials.analyse.jsview())
      case ("mobilise", "jsview.htm") => Ok(views.html.partials.mobilise.jsview())
      case ("visualise", "jsview.htm") => Ok(views.html.partials.visualise.jsview())
      case _ => NotFound
    }
  }

  def doc() = Action {
    Ok(router.get().documentation.map(_.toString).mkString("\n"))
  }

}
