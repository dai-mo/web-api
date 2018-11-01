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

import java.util.UUID
import javax.inject._

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import org.dcs.web.BuildInfo
import play.api.mvc._
import play.api.routing.Router
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
  def index = Action {
    Ok(views.html.index("Your new application is ready."))
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

  def randomClientId: EssentialAction = Action { implicit request =>
    UUID.randomUUID().toString.toResult
  }
}
