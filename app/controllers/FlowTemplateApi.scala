package controllers

import java.util.UUID
import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import org.dcs.commons.JsonSerializerImplicits._
import org.dcs.flow.nifi.{NifiApiConfig, NifiFlowClient}
import play.api.mvc.{Action, Controller, EssentialAction}
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowTemplateApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[Long] {

  object NifiFlowApi extends NifiFlowClient with NifiApiConfig

  override def list: EssentialAction = csrfCheckAction { implicit request =>
    Ok(NifiFlowApi.templates(Req.tokenOrError(Req.AuthTokenKey)).toJson)
  }

  override def update(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def destroy(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def find(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }
}
