package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction}
import org.dcs.flow.ProvenanceApi
import play.api.mvc.{Action, EssentialAction}

/**
  * Created by cmathew on 15/08/16.
  */
@Singleton
class FlowProvenanceApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  val DefaultUserId = "root"
  val DefaultMaxResults = 10

  override def list: EssentialAction = Action {
    NotImplemented
  }

  override def create: EssentialAction = Action {
    NotImplemented
  }

  override def find(id: String): EssentialAction = Action {
    NotImplemented
  }

  override def update(id: String): EssentialAction = Action {
    NotImplemented
  }

  override def destroy(id: String): EssentialAction = Action {
    NotImplemented
  }

  def list(processorId: String): EssentialAction = csrfCheckAction { implicit request =>
    serialize(ProvenanceApi.provenance(processorId, DefaultMaxResults))
  }
}