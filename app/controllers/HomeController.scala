package controllers

import java.util.UUID
import javax.inject._

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import org.dcs.web.BuildInfo
import play.api.mvc._
import play.api.routing.Router
import views.html.partials.modal
import global.ResultSerialiserImplicits._

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(webJarAssets: WebJarAssets,
                               router: Provider[Router],
                               csrfCheckAction: CSRFCheckAction,
                               csrfTokenAction: CSRFTokenAction) extends ResourceRouter[String] {

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
      case ("", "modal.html") => Ok(views.html.partials.modal())
      case ("", "configureprocessor.html") => Ok(views.html.partials.configureprocessor())

      case ("analyse", "view.html") => Ok(views.html.partials.analyse.view())
      case ("analyse", "flowtabs.html") => Ok(views.html.partials.analyse.flowtabs())

      case ("mobilise", "view.html") => Ok(views.html.partials.mobilise.view())
      case ("mobilise", "content.html") => Ok(views.html.partials.mobilise.content())
      case ("mobilise", "processorpanel.html") => Ok(views.html.partials.mobilise.processorpanel())

      case ("visualise", "view.html") => Ok(views.html.partials.visualise.view())
      case _ => NotFound
    }
  }

  def health = Action { implicit request =>
    Health(BuildInfo.version).toResult
  }

  def doc() = Action {
    Ok(router.get().documentation.map(_.toString).mkString("\n"))
  }

  override def list: EssentialAction = index

  override def update(id: String): EssentialAction = Action {
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = Action {
    NotImplemented
  }

  override def find(id: String): EssentialAction = id match {
    case "health" => health
    case "doc" => doc
    case _ =>  Action {NotFound}
  }

  override def create: EssentialAction = Action {
    NotImplemented
  }
}
