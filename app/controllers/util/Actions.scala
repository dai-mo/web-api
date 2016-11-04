package controllers.util

import javax.inject.{Inject, Singleton}

import global.AuthorisationService
import io.jsonwebtoken.Claims
import play.api.mvc.{ActionBuilder, Request, Result, _}
import play.filters.csrf.{CSRFAddToken, CSRFCheck}

import scala.concurrent.Future

/**
  * Created by cmathew on 08/07/16.
  */



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

class AuthorisationRequest[A](val claims: Claims, val request: Request[A]) extends WrappedRequest[A](request)

@Singleton
class AuthorisationAction @Inject()(authService: AuthorisationService) extends
  ActionBuilder[AuthorisationRequest] with ActionTransformer[Request, AuthorisationRequest] {

  def transform[A](request: Request[A]) = Future.successful {
    new AuthorisationRequest(authService.claims(request.headers.get("authorization")), request)
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

