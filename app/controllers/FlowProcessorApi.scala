package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util._
import global.ResultSerialiserImplicits._
import org.dcs.api.service._
import org.dcs.commons.SchemaAction
import org.dcs.commons.error.{ErrorConstants, RESTException}
import org.dcs.commons.serde.AvroSchemaStore
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.dcs.flow.ProcessorApi
import org.dcs.remote.cxf.CxfEndpointUtils
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Action, EssentialAction}

/**
  * Created by cmathew on 05.04.17.
  */
@Singleton
class FlowProcessorApi @Inject()(csrfCheckAction: CSRFCheckAction,
                                 csrfTokenAction: CSRFTokenAction,
                                 remote: RemoteClient)
  extends ResourceRouter[String] {

  override def list: EssentialAction = csrfCheckAction { implicit request =>
    remote.broker.services().toResult
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
    remote.broker.filterServiceByProperty(property, regex).toResult
  }

  def create(flowInstanceId: String): EssentialAction =  csrfCheckAction async { implicit request =>
    ProcessorApi.create(Req.body.toObject[ProcessorServiceDefinition], flowInstanceId, Req.clientId)
      .map(_.toResult)
  }

  def detailsForDef(processorServiceClassName: String, stateful: Boolean): EssentialAction =  csrfCheckAction  { implicit request =>
    serviceDetails(processorServiceClassName, stateful).toResult
  }

  def details(processorServiceClassName: String): EssentialAction =  csrfCheckAction  { implicit request =>

    val psds: List[ProcessorServiceDefinition] =
      remote.broker.filterServiceByProperty(CxfEndpointUtils.ClassNameKey, processorServiceClassName)

    if(psds.isEmpty)
      throw new RESTException(ErrorConstants.DCS301)
    else {
      val psd = psds.head
      serviceDetails(psd.processorServiceClassName, psd.stateful).toResult
    }
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


  def serviceDetails(processorServiceClassName: String, stateful: Boolean): ProcessorDetails = {
    val service: RemoteProcessorService =
      if(stateful)
        remote.broker.loadService[StatefulRemoteProcessorService](processorServiceClassName)
      else
        remote.broker.loadService[RemoteProcessorService](processorServiceClassName)
    service.details()
  }
}
