package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction, Req}
import global.ResultSerialiserImplicits._
import org.dcs.api.service.{ProcessorInstance, ProcessorServiceDefinition}
import org.dcs.commons.SchemaAction
import org.dcs.commons.error.{ErrorConstants, ErrorResponse}
import org.dcs.commons.serde.AvroSchemaStore
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.dcs.flow.ProcessorApi
import org.dcs.remote.ZkRemoteService
import play.api.libs.concurrent.Execution.Implicits.defaultContext
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

  override def find(id: String): EssentialAction =  csrfCheckAction async { implicit request =>
    ProcessorApi.instance(id).map(_.toResult)
  }

  override def update(id: String): EssentialAction =  csrfCheckAction async { implicit request =>
    ProcessorApi.update(Req.body.toObject[ProcessorInstance], Req.clientId)
    .map(_.toResult)
  }

  override def destroy(id: String): EssentialAction =  csrfCheckAction async { implicit request =>
    ProcessorApi.remove(id, Req.version, Req.clientId)
      .map(_.toResult)
  }

  def list(property: String, regex: String): EssentialAction = csrfCheckAction { implicit request =>
    ZkRemoteService.loadServiceCaches()
    ZkRemoteService.filterServiceByProperty(property, regex).toResult
  }

  def create(flowInstanceId: String): EssentialAction =  csrfCheckAction async { implicit request =>
    ProcessorApi.create(Req.body.toObject[ProcessorServiceDefinition], flowInstanceId, Req.clientId)
      .map(_.toResult)
  }

  def schema(schemaId: String): EssentialAction = csrfCheckAction { implicit request =>
    AvroSchemaStore.add(schemaId)
    AvroSchemaStore.get(schemaId).map(s => Ok(s.toString)).
      getOrElse(ErrorConstants.DCS002.toResult)
  }

  def updateProperties(processorId: String): EssentialAction = csrfCheckAction async { implicit request =>
    ProcessorApi.updateProperties(processorId, Req.body.toMapOf[String], Req.clientId).
      map(_.toResult)
  }

  def updateSchema(flowInstanceId: String, processorId: String): EssentialAction = csrfCheckAction async { implicit request =>
    ProcessorApi.updateSchema(flowInstanceId, processorId, Req.body.asList[SchemaAction], Req.clientId).
      map(_.toResult)
  }

  def start(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    ProcessorApi.start(id, Req.version, Req.clientId).map(_.toResult)
  }

  def stop(id: String): EssentialAction = csrfCheckAction async { implicit request =>
    ProcessorApi.stop(id, Req.version, Req.clientId).map(_.toResult)
  }
}
