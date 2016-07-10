package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import org.dcs.commons.JsonSerializerImplicits._
import org.dcs.flow.nifi.{NifiApiConfig, NifiFlowClient}
import play.api.mvc.{Action, Controller, EssentialAction}

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowInstanceApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  object NifiFlowApi extends NifiFlowClient with NifiApiConfig

  override def list: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def update(id: String): EssentialAction = csrfCheckAction { implicit request =>
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = csrfCheckAction { implicit request =>
    Ok(NifiFlowApi.remove(id, Req.tokenOrError(Req.AuthTokenKey)).toJson).as(JSON)
  }

  override def find(id: String): EssentialAction = csrfCheckAction { implicit request =>
    Ok(NifiFlowApi.instance(id, Req.tokenOrError(Req.AuthTokenKey)).toJson).as(JSON)
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  def create(flowTemplateId: String): EssentialAction = csrfCheckAction { implicit request =>
    Ok(NifiFlowApi.instantiate(flowTemplateId, Req.tokenOrError(Req.AuthTokenKey)).toJson).as(JSON)
  }
}

