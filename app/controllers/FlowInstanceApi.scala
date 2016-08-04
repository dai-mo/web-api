package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import org.dcs.commons.JsonSerializerImplicits._
import org.dcs.flow.nifi.{NifiApiConfig, NifiFlowClient}
import play.api.mvc.EssentialAction

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowInstanceApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  val DefaultUserId = "root"

  object NifiFlowApi extends NifiFlowClient with NifiApiConfig

  override def list: EssentialAction = csrfCheckAction { implicit request =>
    serialize(NifiFlowApi.instances(DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def update(id: String): EssentialAction = csrfCheckAction { implicit request =>
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(NifiFlowApi.remove(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def find(id: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(NifiFlowApi.instance(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  def create(flowTemplateId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(NifiFlowApi.instantiate(flowTemplateId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }
}

