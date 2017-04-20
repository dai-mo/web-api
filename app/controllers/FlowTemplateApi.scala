package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util._
import org.dcs.flow.FlowApi
import play.api.mvc.EssentialAction

import global.ResultSerialiserImplicits._
import play.api.libs.concurrent.Execution.Implicits.defaultContext

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowTemplateApi @Inject()(csrfCheckAction: CSRFCheckAction,
                                csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[Long] {



  override def list: EssentialAction = csrfCheckAction async { implicit request =>
    FlowApi.templates.map(_.toResult)
  }

  override def update(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def destroy(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def find(id: Long): EssentialAction = csrfCheckAction {
    NotImplemented
  }

  override def create: EssentialAction = csrfCheckAction {
    NotImplemented
  }
}

