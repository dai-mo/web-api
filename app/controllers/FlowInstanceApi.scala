package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util._
import global.AuthorisationService
import org.dcs.api.service.FlowInstance
import org.dcs.flow.FlowApi
import play.api.mvc.{Action, EssentialAction}
import global.ResultSerialiserImplicits._
import play.api.libs.concurrent.Execution.Implicits.defaultContext

import scala.concurrent.Future

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

  override def list: EssentialAction =  csrfCheckAction andThen
    RptAction(Nil) andThen
    authorisationAction async { implicit request =>
    val ids = flowInstanceIds(authService.permissions(request.claims))
    if(ids.isEmpty)
      Future.successful(Nil.toResult)
    else
      Future.sequence(ids.map { id =>
        FlowApi.instance(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey))
          .map { flowInstance =>
            flowInstance
          }
      }).map(fiList => fiList.toResult)
  }

  override def update(id: String): EssentialAction = csrfCheckAction { implicit request =>
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = csrfCheckAction andThen
    RptAction(Nil) andThen
    authorisationAction async { implicit request =>
    FlowApi.remove(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey))
      .map { response =>
        if(response)
          authService.deleteProtectedResource(BaseUrl + "/" + id)
        response.toResult
      }
  }

  override def find(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    FlowApi.instance(id, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)).map(_.toResult)
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  def create(flowTemplateId: String): EssentialAction = csrfCheckAction andThen
    RptAction(List("flow-instance")) andThen
    authorisationAction async { implicit request =>
    FlowApi.instantiate(flowTemplateId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey))
      .map { flowInstance =>
        authService.createProtectedResource(
          ScopeFlowInstanceView :: ScopeFlowInstanceUpdate :: ScopeFlowInstanceDelete :: Nil,
          ResourceNamePrefix + ResourceNameSeparator + flowInstance.id,
          BaseUrl + "/" + flowInstance.id,
          Type,
          authService.userId(request.claims)
        )
        flowInstance.toResult
      }
  }


  def start(flowInstanceId: String): EssentialAction = csrfCheckAction async { implicit request =>
    FlowApi.start(flowInstanceId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)).map(_.toResult)
  }

  def stop(flowInstanceId: String): EssentialAction = csrfCheckAction async { implicit request =>
    FlowApi.stop(flowInstanceId, DefaultUserId, Req.tokenOrError(Req.AuthTokenKey)).map(_.toResult)
  }

  private def flowInstanceIds(permissions: List[Permission]): List[String] = {
    val ids: List[String] = Nil

    permissions
      .filter(p => p.resourceName.startsWith(ResourceNamePrefix + ResourceNameSeparator))
      .map(p => p.resourceName.split(ResourceNameSeparator).tail.head)
  }
}

