package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction}
import global.ResultSerialiserImplicits._
import org.dcs.remote.ZkRemoteService
import play.api.mvc.{Action, EssentialAction}

/**
  * Created by cmathew on 05.04.17.
  */
@Singleton
class FlowProcessorApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {



  override def list: EssentialAction = csrfCheckAction { implicit request =>
    ZkRemoteService.loadServiceCaches()
    ZkRemoteService.services().toResult
  }
  override def create: EssentialAction =  Action {
    NotImplemented
  }

  override def find(id: String): EssentialAction =  Action {
    NotImplemented
  }

  override def update(id: String): EssentialAction =  Action {
    NotImplemented
  }

  override def destroy(id: String): EssentialAction =  Action {
    NotImplemented
  }

  def list(property: String, regex: String): EssentialAction = csrfCheckAction { implicit request =>
    ZkRemoteService.loadServiceCaches()
    ZkRemoteService.filterServiceByProperty(property, regex).toResult
  }
}
