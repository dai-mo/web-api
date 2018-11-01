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
import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import org.dcs.api.service.{User, UserApiService}
import org.dcs.commons.error.{ErrorConstants, HttpException}
import org.dcs.commons.serde.JsonSerializerImplicits._
import play.api.mvc.{Cookie, EssentialAction}

/**
  * Created by cmathew on 29/06/16.
  */


@Singleton
class UserApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[Long] {

  object DummyUserApiService extends UserApiService {

    val anon = User("0", "Anonymous")
    val bob  = User("1", "Bob")
    val bri  = User("2", "Bri")

    override def users : List[User] = List(anon, bob, bri)

    override def user(userId: String): User = userId match {
      case "0" => anon
      case "1" => bob
      case "2" => bri
      case _ => throw new HttpException(ErrorConstants.DCS108.http(400))
    }
  }

  override def list: EssentialAction = csrfCheckAction {
    Ok(DummyUserApiService.users().toJson).as(JSON)
  }

  override def update(id: Long): EssentialAction = csrfCheckAction {
    Ok("User updated").as(JSON)
  }

  override def destroy(id: Long): EssentialAction = csrfCheckAction {
    Ok("User deleted").as(JSON)
  }

  override def find(id: Long): EssentialAction = csrfCheckAction {
    Ok(DummyUserApiService.user(id.toString).toJson).as(JSON)
  }

  override def create: EssentialAction = csrfCheckAction {
    Ok("User created").as(JSON)
  }

  def auth(id: Long): EssentialAction = csrfTokenAction {
    Ok(DummyUserApiService.user(id.toString).name + " authenticated").
      withCookies(Cookie(Req.AuthTokenKey, UUID.randomUUID.toString))
  }

}
