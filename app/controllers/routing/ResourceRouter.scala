package controllers.routing

import play.api.mvc._
import play.api.routing.Router

import scala.runtime.AbstractPartialFunction

/**
  *
  * Inspired by https://jazzy.id.au/2013/05/08/advanced_routing_in_play_framework.html
  *
  * Created by cmathew on 24/06/16.
  */
abstract class ResourceRouter[T](name: Option[String] = None)(implicit idBindable: PathBindable[T])
  extends Router with ResourceController[T] {
  self =>

  private var path: String = ""

  private val MaybeSlash = "/?".r
  private val Id = "/([^/]+)".r

  override def withPrefix(prefix: String): Router = {
    path = prefix
    this
  }

  def prefix = path

  def badRequestAction(id: String) = Action {
    BadRequest
  }

  override def routes = new AbstractPartialFunction[RequestHeader, Handler] {

    def withId(id: String, action: T => EssentialAction) = {
      idBindable.bind("id", id).fold(badRequestAction, action)

    }

//    def withToken(token: String, action: T => EssentialAction) = {
//      idBindable.bind("token", token).fold(badRequestAction, action)
//    }
//
//    def withIdAndToken(id: String, token: String, action: (T,T) => EssentialAction) = {
//      val idBind = idBindable.bind("id", id)
//      if(idBind.isLeft) BadRequest
//      else {
//        val tokenBind = idBindable.bind("token", token)
//      }
//    }

    override def applyOrElse[A <: RequestHeader, B >: Handler](rh: A, default: A => B) = {
      if (rh.path.startsWith(path)) {
        (rh.method, rh.path.drop(path.length)) match {
          case ("GET", MaybeSlash()) => list
          case ("POST", MaybeSlash()) => create
          case ("GET", Id(id)) => withId(id, find)
          case ("PUT", Id(id)) => withId(id, update)
          case ("DELETE", Id(id)) => withId(id, destroy)
          case _ => default(rh)
        }
      } else {
        default(rh)
      }
    }

    def isDefinedAt(rh: RequestHeader) = if (rh.path.startsWith(path)) {
      (rh.method, rh.path.drop(path.length)) match {
        case ("GET", MaybeSlash()) => true
        case ("POST", MaybeSlash()) => true
        case ("GET", Id(id)) => true
        case ("PUT", Id(id)) => true
        case ("DELETE", Id(id)) => true
        case _ => false
      }
    } else {
      false
    }

  }


  override def documentation = Seq(
    ("GET", path, name + ".index"),
    ("GET", path + "/new", name + ".newScreen"),
    ("POST", path, name + ".create"),
    ("GET", path + "/$id<[^/]+>", name + ".show(id: T)"),
    ("GET", path + "/$id<[^/]+>/edit", name + ".edit(id: T)"),
    ("PUT", path + "/$id<[^/]+>", name + ".update(id: T)"),
    ("DELETE", path + "/$id<[^/]+>", name + ".destroy(id: T)")
  )

}
