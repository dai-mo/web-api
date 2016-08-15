package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import org.dcs.flow.FlowApi
import play.api.mvc.EssentialAction

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowInstanceApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  val DefaultUserId = "root"


  override def list: EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.instances(DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def update(id: String): EssentialAction = csrfCheckAction { implicit request =>
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.remove(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def find(id: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.instance(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  def create(flowTemplateId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.instantiate(flowTemplateId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  def start(flowInstanceId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.start(flowInstanceId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  def stop(flowInstanceId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.stop(flowInstanceId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }
}

