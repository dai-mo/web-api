package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util._
import global.AuthorisationService
import org.dcs.api.service.FlowInstance
import org.dcs.flow.FlowApi
import play.api.mvc.EssentialAction

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowInstanceApi @Inject()(csrfCheckAction: CSRFCheckAction,
                                csrfTokenAction: CSRFTokenAction,
                                authorisationAction: AuthorisationAction,
                                authService: AuthorisationService)
  extends ResourceRouter[String] {

  val DefaultUserId = "root"

  val ScopeFlowInstanceView = "urn:alambeek:scopes:flow-instance:view"
  val ScopeFlowInstanceUpdate = "urn:alambeek:scopes:flow-instance:update"
  val ScopeFlowInstanceDelete = "urn:alambeek:scopes:flow-instance:delete"
  val BaseUrl = "/api/flow/instances"
  val ResourceNamePrefix = "flow-instance"
  val ResourceNameSeparator = ":"
  val Type = "http://alambeek.org/resource/instance"

  override def list: EssentialAction =  (csrfCheckAction
    andThen authorisationAction) { implicit request =>
    val ids = flowInstanceIds(authService.permissions(request.claims))
    if(ids.isEmpty)
      serialize(Nil)
    else
      serialize(ids.map( id => FlowApi.instance(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey))))
  }

  override def update(id: String): EssentialAction = csrfCheckAction { implicit request =>
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = (csrfCheckAction
    andThen authorisationAction) { implicit request =>
    val result = FlowApi.remove(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey))
    authService.deleteProtectedResource(BaseUrl + "/" + id)
    serialize(result)
  }

  override def find(id: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.instance(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  def create(flowTemplateId: String): EssentialAction = (csrfCheckAction
    andThen authorisationAction) { implicit request =>
    val flowInstance: FlowInstance =
      FlowApi.instantiate(flowTemplateId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey))
    authService.createProtectedResource(
      ScopeFlowInstanceView :: ScopeFlowInstanceUpdate :: ScopeFlowInstanceDelete :: Nil,
      ResourceNamePrefix + ResourceNameSeparator + flowInstance.id,
      BaseUrl + "/" + flowInstance.id,
      Type,
      authService.userId(request.claims)
    )
    serialize(flowInstance)
  }

  def start(flowInstanceId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.start(flowInstanceId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  def stop(flowInstanceId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(FlowApi.stop(flowInstanceId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)))
  }

  private def flowInstanceIds(permissions: List[Permission]): List[String] = {
    val ids: List[String] = Nil

    permissions
      .filter(p => p.resourceName.startsWith(ResourceNamePrefix + ResourceNameSeparator))
        .map(p => p.resourceName.split(ResourceNameSeparator).tail.head)
  }
}

