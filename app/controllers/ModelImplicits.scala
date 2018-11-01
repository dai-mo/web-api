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

import org.dcs.api.service._
import org.dcs.commons.error.{ErrorResponse, HttpErrorResponse}
import play.api.libs.json.{Json, Writes}

/**
  * Created by cmathew on 05/06/16.
  */
object ModelImplicits {


  implicit val throwableWrites = new Writes[Throwable] {
    def writes(throwable: Throwable) = Json.obj(
      "message" -> throwable.getMessage
    )
  }

  implicit val testWrites = Json.writes[TestResponse]
  implicit val errorWrites = Json.writes[ErrorResponse]
  implicit val httpErrorWrites = Json.writes[HttpErrorResponse]

}
