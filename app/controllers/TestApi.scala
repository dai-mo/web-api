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
import controllers.util.{CSRFCheckAction, CSRFTokenAction}
import org.dcs.api.service.{TestApiService, TestResponse}
import org.dcs.commons.error.{DCSException, ErrorConstants}
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.dcs.remote.ZkRemoteService
import play.api.mvc.EssentialAction

/**
  * Created by cmathew on 03/06/16.
  */

@Singleton
class TestApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  override def list: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def update(id: String): EssentialAction = csrfCheckAction {
    NotImplemented
  }
  override def destroy(id: String): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def find(id: String): EssentialAction = csrfCheckAction {
    id match {
      case "local" => Ok(TestResponse("Hello World. This is DCS!").toJson).as(JSON)
      case "remote" => {
        val testResponse = ZkRemoteService.loadService[TestApiService].hello("World")
        Ok(testResponse.toJson).as(JSON)
      }
      case "error" => throw new DCSException(ErrorConstants.DCS001)
    }
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }
}
