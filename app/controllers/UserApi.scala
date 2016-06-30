package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import org.dcs.api.error.{ErrorConstants, RESTException}
import org.dcs.api.service.{User, UserApiService}
import org.dcs.commons.JsonSerializerImplicits._
import play.api.mvc.{Action, EssentialAction}
import play.api.routing.{Router, SimpleRouter}

/**
  * Created by cmathew on 29/06/16.
  */


@Singleton
class UserApi @Inject() extends ResourceRouter[Long] {

  object DummyUserApiService extends UserApiService {
    val bob = User("1", "Bob")
    val bri = User("2", "Bri")
    override def users(): List[User] = List(bob, bri)

    override def user(userId: String): User = userId match {
      case "1" => bob
      case "2" => bri
      case _ => throw new RESTException(ErrorConstants.DCS108)
    }
  }

  override def list: EssentialAction = Action {
    Ok(DummyUserApiService.users().toJson).as(JSON)
  }

  override def update(id: Long): EssentialAction = Action {
    Ok("User updated").as(JSON)
  }

  override def destroy(id: Long): EssentialAction = Action {
    Ok("User deleted").as(JSON)
  }

  override def find(id: Long): EssentialAction = Action {
    Ok(DummyUserApiService.user(id.toString).toJson).as(JSON)
  }

  override def create: EssentialAction = Action {
    Ok("User created").as(JSON)
  }
}
