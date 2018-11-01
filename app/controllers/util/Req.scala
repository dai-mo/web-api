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

package controllers.util

import org.dcs.commons.error.{ErrorConstants, HttpException}
import play.api.mvc.{AnyContent, Request, RequestHeader}

/**
  * Created by cmathew on 09/07/16.
  */
object Req {
  val AuthTokenKey = "authConfig-token"
  val FlowComponentVersion = "flow-component-version"
  val FlowClientId = "flow-client-id"

  def authToken(implicit request: RequestHeader): Option[String] = {
    request.cookies.get(AuthTokenKey).map(x => x.value)
  }

  def token(tokenKey: String)(implicit request: RequestHeader): Option[String] = {
    request.cookies.get(AuthTokenKey).map(x => x.value)
  }

  def tokenOrError(tokenKey: String)(implicit request: RequestHeader): String = {
    token(tokenKey)(request) match {
      case Some(tokenValue) => tokenValue
      case None => throw new HttpException(ErrorConstants.DCS003.http(401))
    }
  }

  def clientId(implicit request: RequestHeader): String = {
    request.headers.get(FlowClientId).get
  }

  def version(implicit request: RequestHeader): Long = {
    request.headers.get(FlowComponentVersion).get.toLong
  }

  def body(implicit request: Request[AnyContent]): String = {
    request.body.asJson.get.toString()
  }


}
