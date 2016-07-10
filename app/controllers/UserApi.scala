package controllers

import java.util.UUID
import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import org.dcs.api.error.{ErrorConstants, RESTException}
import org.dcs.api.service.{User, UserApiService}
import org.dcs.commons.JsonSerializerImplicits._
import play.api.mvc.{Action, Cookie, EssentialAction}
import play.api.routing.{Router, SimpleRouter}

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
      case _ => throw new RESTException(ErrorConstants.DCS108)
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
