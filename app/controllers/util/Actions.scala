package controllers.util

import javax.inject.{Inject, Singleton}

import global.Authorisation
import io.jsonwebtoken.Claims
import org.dcs.api.error.{ErrorConstants, RESTException}
import play.api.mvc.{ActionBuilder, Request, Result, _}
import play.filters.csrf.{CSRFAddToken, CSRFCheck}

import scala.concurrent.Future

/**
  * Created by cmathew on 08/07/16.
  */



@Singleton
class CSRFCheckAction @Inject()(checkToken: CSRFCheck) extends ActionBuilder[Request] {
  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = {
    // authentication code here
    block(request)
  }
  override def composeAction[A](action: Action[A]) = checkToken(action)
}

@Singleton
class CSRFTokenAction @Inject()(addToken: CSRFAddToken) extends ActionBuilder[Request] {

  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = {
    // authentication code here
    block(request)
  }
  override def composeAction[A](action: Action[A]) = addToken(action)
}

class AuthorisationRequest[A](val claims: Claims, val request: Request[A]) extends WrappedRequest[A](request)

object AuthorisationAction extends
  ActionBuilder[AuthorisationRequest] with ActionTransformer[Request, AuthorisationRequest] {

  def transform[A](request: Request[A]) = Future.successful {
    new AuthorisationRequest(Authorisation.claims(request.headers.get("authorization")), request)
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

