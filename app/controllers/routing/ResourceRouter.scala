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

  val IdKey = "id"
  val TokenKey = "token"

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
      idBindable.bind(IdKey, id).fold(badRequestAction, action)

    }


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
