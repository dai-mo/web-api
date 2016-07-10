package controllers.util

import javax.inject.{Inject, Singleton}

import play.api.mvc.{ActionBuilder, Request, Result}
import play.api.mvc._
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