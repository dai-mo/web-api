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

import org.dcs.commons.error.ErrorResponse
import org.dcs.commons.serde.JsonSerializerImplicits._
import play.api.http.Status._
import play.api.mvc.Results.Forbidden
import play.api.mvc.{RequestHeader, Result}

import scala.concurrent.Future


class CSRFFilterError extends play.filters.csrf.CSRF.ErrorHandler {

  override def handle(req: RequestHeader, msg: String): Future[Result] = {
    val response = ErrorResponse("DCS000", "Unauthorised CSRF Access", msg)
    val result = Forbidden(response.toJson)
    Future.successful(result)
  }
}
