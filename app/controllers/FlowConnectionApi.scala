package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import global.ResultSerialiserImplicits._
import org.dcs.api.service.{Connection, ConnectionCreate}
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.dcs.flow.ConnectionApi
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Action, EssentialAction}

/**
  * Created by cmathew on 20.04.17.
  */
@Singleton
class FlowConnectionApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  override def list: EssentialAction = Action {
    NotImplemented
  }

  override def create: EssentialAction = csrfCheckAction async { implicit request =>
    ConnectionApi.create(Req.body.toObject[ConnectionCreate], Req.clientId)
      .map(_.toResult)
  }

  override def find(id: String): EssentialAction = Action {
    NotImplemented
  }

  override def update(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    ConnectionApi.update(Req.body.toObject[Connection], Req.clientId)
      .map(_.toResult)
  }

  override def destroy(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    ConnectionApi.remove(id, Req.version, Req.clientId)
      .map(_.toResult)
  }
}
