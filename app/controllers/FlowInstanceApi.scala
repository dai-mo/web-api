package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util._
import global.Authorisation
import org.dcs.api.service.FlowInstance
import org.dcs.flow.FlowApi
import play.api.mvc.EssentialAction

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowInstanceApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  val DefaultUserId = "root"

  val ScopeFlowInstanceView = "urn:alambeek:scopes:flow-instance:delete"
  val BaseUrl = "/api/flow/instances"
  val ResourceNamePrefix = "flow-instance"
  val Type = "http://alambeek.org/resource/instance"

  override def list: EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.instances(DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def update(id: String): EssentialAction = csrfCheckAction { implicit request =>
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = (csrfCheckAction
    andThen AuthorisationAction) { implicit request =>
    val result = FlowApi.remove(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey))
    Authorisation.deleteProtectedResource(BaseUrl + "/" + id)
    serialize(result)
  }

  override def find(id: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.instance(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  def create(flowTemplateId: String): EssentialAction = (csrfCheckAction
    andThen AuthorisationAction) { implicit request =>
    val flowInstance: FlowInstance =
      FlowApi.instantiate(flowTemplateId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey))
    Authorisation.createProtectedResource(ScopeFlowInstanceView :: Nil,
      ResourceNamePrefix + ":" + flowInstance.id,
      BaseUrl + "/" + flowInstance.id,
      Type,
      Authorisation.userId(request.claims))
    serialize(flowInstance)
  }

  def start(flowInstanceId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.start(flowInstanceId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  def stop(flowInstanceId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.stop(flowInstanceId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }
}

