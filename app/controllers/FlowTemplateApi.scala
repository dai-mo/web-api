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
import controllers.util._
import org.dcs.flow.FlowApi
import play.api.mvc.EssentialAction

import global.ResultSerialiserImplicits._
import play.api.libs.concurrent.Execution.Implicits.defaultContext

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowTemplateApi @Inject()(csrfCheckAction: CSRFCheckAction,
                                csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[Long] {



  override def list: EssentialAction = csrfCheckAction async { implicit request =>
    FlowApi.templates.map(_.toResult)
  }

  override def update(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def destroy(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def find(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }
}

