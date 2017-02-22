package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction}
import global.ResultSerialiserImplicits._
import org.dcs.api.service.IFlowDataService
import org.dcs.commons.serde.AvroImplicits._
import org.dcs.commons.serde.AvroSchemaStore
import org.dcs.remote.ZkRemoteService
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Action, EssentialAction}

import scala.collection.JavaConverters._
import scala.concurrent.Future

/**
  * Created by cmathew on 15/08/16.
  */
@Singleton
class FlowProvenanceApi @Inject()(csrfCheckAction: CSRFCheckAction, csrfTokenAction: CSRFTokenAction)
  extends ResourceRouter[String] {

  val DefaultUserId = "root"
  val DefaultMaxResults = 400

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

  def list(processorId: String): EssentialAction = csrfCheckAction async  { implicit request =>
    val typeId = processorId.split(':')
    Future {
      val response = ZkRemoteService.loadService[IFlowDataService].provenanceByComponentId(typeId(1), DefaultMaxResults).
        asScala
      response.filter(prov => !prov.schemaId.isEmpty && prov.schemaId != "null").
        map(prov => {
          val schema = AvroSchemaStore.get(prov.schemaId)
          val content = prov.raw.deSerToJsonString(schema, schema)
          prov.setRaw(null)
          prov.setContent(content)
          prov
        })
    }.map(_.toResult)

  }
}
