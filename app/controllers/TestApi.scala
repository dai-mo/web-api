package controllers

import javax.inject.{Inject, Singleton}

import controllers.ModelImplicits._
import org.dcs.api.error.{ErrorResponse, RESTException}
import org.dcs.api.service.TestApiService
import org.dcs.remote.ZkRemoteService
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

/**
  * Created by cmathew on 03/06/16.
  */

@Singleton
class TestApi @Inject() extends Controller {

  def testHelloGet(name: Option[String]) = Action {
    val testResponse = ZkRemoteService.loadService[TestApiService].
      hello(name.getOrElse("World"))
    Ok(Json.toJson(testResponse))
  }

  def testErrorGet(code:String, message: String, httpStatusCode: Int) = Action {
    throw new RESTException(ErrorResponse(code, message, httpStatusCode))
    Ok("Unreachable code")
  }
}
