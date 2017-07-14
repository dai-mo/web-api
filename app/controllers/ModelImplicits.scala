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
