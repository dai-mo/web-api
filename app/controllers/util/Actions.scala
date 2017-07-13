package controllers.util

import javax.inject.{Inject, Singleton}

import com.google.inject.ImplementedBy
import global.AuthorisationService
import io.jsonwebtoken.Claims
import org.dcs.commons.error.{ErrorConstants, RESTException}
import org.dcs.remote.{RemoteService, ZkRemoteService}
import org.keycloak.authorization.client.representation.PermissionRequest
import play.api.inject.ApplicationLifecycle
import play.api.mvc.{ActionBuilder, Request, Result, _}
import play.filters.csrf.{CSRFAddToken, CSRFCheck}

import scala.concurrent.Future

/**
  * Created by cmathew on 08/07/16.
  */

@ImplementedBy(classOf[Remote])
trait RemoteClient {
  init()
  def init(): Unit

  def broker: ZkRemoteService.type
}

@Singleton
class Remote @Inject() (lifecycle: ApplicationLifecycle) extends RemoteClient {


  override def broker: ZkRemoteService.type = ZkRemoteService

  override def init(): Unit = {
    broker.loadServiceCaches()

    lifecycle.addStopHook { () =>
      Future.successful(broker.dispose)
    }
  }

}

@Singleton
class CSRFCheckAction @Inject()(checkToken: CSRFCheck) extends ActionBuilder[Request] {
  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = {
    block(request)
  }
  override def composeAction[A](action: Action[A]) = checkToken(action)
}

@Singleton
class CSRFTokenAction @Inject()(addToken: CSRFAddToken) extends ActionBuilder[Request] {

  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = {
    block(request)
  }
  override def composeAction[A](action: Action[A]) = addToken(action)
}

object RptAction {
  def apply(permissionsEntities: List[String]): RptAction = {
    new RptAction(permissionsEntities.map(pe => {
      val pr = new PermissionRequest
      pr.setResourceSetName(pe)
      pr
    }))
  }
}
class RptRequest[A](val permissions: List[PermissionRequest], val request: Request[A]) extends WrappedRequest[A](request)

class RptAction(permissions: List[PermissionRequest]) extends ActionTransformer[Request, RptRequest] {

  @Inject() var authService: AuthorisationService = _

  def transform[A](request: Request[A]) = Future.successful {
    new RptRequest(permissions, request)
  }
}

class AuthorisationRequest[A](val claims: Claims, val request: Request[A]) extends WrappedRequest[A](request)

@Singleton
class AuthorisationAction @Inject()(authService: AuthorisationService) extends ActionTransformer[RptRequest, AuthorisationRequest] {

  def transform[A](request: RptRequest[A]) = Future.successful {

    val auth = request.headers.get("authorization")
    if (auth.isDefined) {
      val claims = authService.claims(auth, request.permissions)
      if(!authService.checkPermissions(request.path, request.method, claims))
        throw new RESTException(ErrorConstants.DCS503.withErrorMessage("Insufficient permissions to execute request"))
      new AuthorisationRequest(claims, request)
    } else
      throw new RESTException(ErrorConstants.DCS503.withErrorMessage("No Authorization header"))
  }
}

//object UserAction extends ActionFilter[AuthorisationRequest] {
//  def filter[A](input: AuthorisationRequest[A]) = Future.successful {
//
//    if(!Authorisation.roles(input.claims).contains("user")) {
//      throw new RESTException(ErrorConstants.DCS501.withErrorMessage("Role 'user' is required"))
//    } else
//      None
//  }
//}
//
//object AdminAction extends ActionFilter[AuthorisationRequest] {
//  def filter[A](input: AuthorisationRequest[A]) = Future.successful {
//
//    if(!Authorisation.roles(input.claims).contains("admin")) {
//      throw new RESTException(ErrorConstants.DCS503.withErrorMessage("Role 'admin' is required"))
//    } else
//      None
//  }
//}

//object PermissionAction extends ActionFilter[AuthorisationRequest] {
//  def filter[A](input: AuthorisationRequest[A]) = Future.successful {
//
//    if(!Authorisation.checkPermissions(input.request.path, input.request.method, input.claims)) {
//      throw new RESTException(ErrorConstants.DCS503.withErrorMessage("Insufficient permissions to execute request"))
//    } else
//      None
//  }
//}

