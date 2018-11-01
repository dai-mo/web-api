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
import global.RequestHandler
import org.dcs.commons.serde.JsonSerializerImplicits._
import play.api.mvc.{AnyContent, Controller, Request, Result}
import play.mvc.Http.MimeTypes

/**
  * Created by cmathew on 22/07/16.
  */

trait ContentNegotiation {
  //Self type annotation -> trait must be mixed in into Controller (thus, has access to render, Accepts and Ok)
  self: Controller =>

  //Serializes the provided value according to the Accept headers of the (implicitly) provided request
  def serialize[T](value: T)(implicit request: Request[AnyContent]): Result = {

    val mimeType = RequestHandler.mimeTypeExt(request)
    if(mimeType == None)
      request match {
        case Accepts.Json() => Ok(value.toJson).as(JSON)
        case Accepts.Xml() => NotAcceptable
        case _ => Ok(value.toJson).as(JSON)
      }
    else
      mimeType.get match {
        case MimeTypes.JSON => Ok(value.toJson).as(JSON)
        case _ => NotAcceptable
      }
  }
}