package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util._
import global.AuthorisationService
import global.ResultSerialiserImplicits._
import io.jsonwebtoken.Claims
import org.dcs.flow.FlowApi
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.EssentialAction

import scala.concurrent.Future

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowInstanceApi @Inject()(csrfCheckAction: CSRFCheckAction,
                                csrfTokenAction: CSRFTokenAction,
                                authorisationAction: AuthorisationAction,
                                authService: AuthorisationService,
                                remote: RemoteClient)
  extends ResourceRouter[String] {

  val DefaultFlowParentId = "root"

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
        FlowApi.instance(id, Req.clientId)
          .map { flowInstance =>
            flowInstance
          }
      }).map(fiList => fiList.toResult)
  }

  override def update(id: String): EssentialAction = csrfCheckAction { implicit request =>
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = csrfCheckAction { implicit request =>
    NotImplemented
  }

  override def find(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    FlowApi.instance(id, Req.clientId).map(_.toResult)
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }

  def instantiate(flowTemplateId: String): EssentialAction = csrfCheckAction andThen
    RptAction(List("flow-instance")) andThen
    authorisationAction async { implicit request =>
    FlowApi.instantiate(flowTemplateId, Req.clientId)
      .map { flowInstance =>
        createProtectedResource(flowInstance.id, request.claims)
        flowInstance.toResult
      }
  }

  def create(name: String): EssentialAction = csrfCheckAction andThen
    RptAction(List("flow-instance")) andThen
    authorisationAction async { implicit request =>
    FlowApi.create(name, Req.clientId)
      .map { flowInstance =>
        createProtectedResource(flowInstance.id, request.claims)
        flowInstance.toResult
      }
  }

  def start(flowInstanceId: String): EssentialAction = csrfCheckAction async { implicit request =>
    FlowApi.start(flowInstanceId, Req.clientId).map(_.toResult)
  }

  def stop(flowInstanceId: String): EssentialAction = csrfCheckAction async { implicit request =>
    FlowApi.stop(flowInstanceId, Req.clientId).map(_.toResult)
  }

  def destroy(id: String, hasExternal: Boolean): EssentialAction = csrfCheckAction andThen
    RptAction(Nil) andThen
    authorisationAction async { implicit request =>
    FlowApi.remove(id, Req.version, Req.clientId, hasExternal)
      .map { response =>
        if(response)
          authService.deleteProtectedResource(BaseUrl + "/" + id)
        response.toResult
      }
  }

  private def flowInstanceIds(permissions: List[Permission]): List[String] = {
    val ids: List[String] = Nil

    permissions
      .filter(p => p.resourceName.startsWith(ResourceNamePrefix + ResourceNameSeparator))
      .map(p => p.resourceName.split(ResourceNameSeparator).tail.head)
  }

  private def createProtectedResource(flowInstanceId: String, claims: Claims): Unit =
    authService.createProtectedResource(ScopeFlowInstanceView :: ScopeFlowInstanceUpdate :: ScopeFlowInstanceDelete :: Nil,
      ResourceNamePrefix + ResourceNameSeparator + flowInstanceId,
      BaseUrl + "/" + flowInstanceId,
      Type,
      authService.userId(claims))
}

