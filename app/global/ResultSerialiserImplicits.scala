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

package global

import org.dcs.commons.serde.JsonSerializerImplicits._
import play.api.mvc._
import play.mvc.Http.MimeTypes

/**
  * Created by cmathew on 02.11.16.
  */
object ResultSerialiserImplicits  extends Results {

  implicit class ObjectToResult(obj: Any)  {
    def toResult(implicit request: Request[AnyContent]): Result = {

      val mimeType = RequestHandler.mimeTypeExt(request)
      if(mimeType.isEmpty)
        request.headers.get("Accept") match {
          case Some(MimeTypes.JSON) => Ok(obj.toJson).as(MimeTypes.JSON)
          case Some(MimeTypes.XML) => NotAcceptable
          case _ => Ok(obj.toJson).as(MimeTypes.JSON)
        }
      else
        mimeType.get match {
          case MimeTypes.JSON => Ok(obj.toJson).as(MimeTypes.JSON)
          case _ => NotAcceptable
        }
    }
  }
}
