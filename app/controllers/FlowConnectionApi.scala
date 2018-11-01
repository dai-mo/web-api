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

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import global.ResultSerialiserImplicits._
import org.dcs.api.processor.ConnectionValidation
import org.dcs.api.service.{Connection, ConnectionConfig, FlowComponent}
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.dcs.flow.{ConnectionApi, FlowApi}
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Action, EssentialAction}

/**
  * Created by cmathew on 20.04.17.
  */
@Singleton
class FlowConnectionApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  override def list: EssentialAction = Action {
    NotImplemented
  }

  override def create: EssentialAction = csrfCheckAction async { implicit request =>
    val connectionConfig: ConnectionConfig = Req.body.toObject[ConnectionConfig]
    ConnectionValidation.validate(connectionConfig)

    ConnectionApi.create(connectionConfig, Req.clientId)
      .map(_.toResult)
  }

  override def find(id: String): EssentialAction = Action {
    NotImplemented
  }

  override def update(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    ConnectionApi.update(Req.body.toObject[Connection], Req.clientId)
      .map(_.toResult)
  }

  override def destroy(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    ConnectionApi.remove(id, Req.version, Req.clientId)
      .map(_.toResult)
  }

  def destroyExternal(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    ConnectionApi.remove(Req.body.toObject[Connection], Req.clientId)
      .map(_.toResult)
  }
}
