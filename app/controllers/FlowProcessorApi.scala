package controllers

import java.nio.charset.StandardCharsets
import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util._
import global.ResultSerialiserImplicits._
import org.dcs.api.processor.{CoreProperties, ProcessorValidation, RemoteProperty}
import org.dcs.api.service._
import org.dcs.commons.SchemaAction
import org.dcs.commons.error._
import org.dcs.commons.serde.AvroSchemaStore
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.dcs.flow.ProcessorApi
import org.dcs.remote.cxf.CxfEndpointUtils
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Action, EssentialAction}

import scala.collection.JavaConverters._
import scala.concurrent.Future

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
    remote.serviceDetails(processorServiceClassName, stateful).toResult
  }

  def details(processorServiceClassName: String): EssentialAction =  csrfCheckAction  { implicit request =>
    remote.service(processorServiceClassName).details().toResult
  }

  def schema(schemaId: String): EssentialAction = csrfCheckAction { implicit request =>
    AvroSchemaStore.add(schemaId)
    AvroSchemaStore.get(schemaId).map(s => Ok(s.toString)).
      getOrElse(ErrorConstants.DCS002.toResult)
  }

  def properties(processorServiceClassName: String): EssentialAction = csrfCheckAction  { implicit request =>
    remote.service(processorServiceClassName).properties().asScala.toList.toResult
  }

  private def escapeSchema(schemaJson: String): String =
    if(schemaJson.startsWith("\"") && schemaJson.endsWith("\""))
      schemaJson.substring(1, schemaJson.length() - 1).replace("\\", "")
    else
      schemaJson

  def updateProperties(processorServiceClassName: String, processorId: String): EssentialAction = csrfCheckAction async { implicit request =>

    val initialProperties = Req.body.toMapOf[String]
    val propertyDefinitions = remote.service(processorServiceClassName).properties().asScala.toList
    val props = {
      var ps = initialProperties ++ remote.service(processorServiceClassName).resolveProperties(initialProperties.asJava).asScala.toMap
      // FIXME: Why do we need to escape double quotes for the schemas ?
      //        Is this the SOAP serialisation ?
      val readSchema = ps.get(CoreProperties.ReadSchemaKey).map(schema => escapeSchema(schema))
      val writeSchema = ps.get(CoreProperties.WriteSchemaKey).map(schema => escapeSchema(schema))

      readSchema.foreach(schema => ps = ps + (CoreProperties.ReadSchemaKey -> schema))
      writeSchema.foreach(schema => ps = ps + (CoreProperties.WriteSchemaKey -> schema))

      if (readSchema.isDefined && readSchema.get.nonEmpty) {
        ProcessorApi.updateSchemaProperty(processorId,
          CoreProperties.ReadSchemaKey,
          readSchema.get,
          Req.clientId)
          .map(_ => ps)
      } else
        Future(ps)
    }
    props.flatMap { properties =>
      val validation = ProcessorValidation.validate(processorId,
        properties,
        propertyDefinitions,
        false)
      val withoutCoreProperties = CoreProperties.without(properties)
      if (validation.isDefined) {
        val propertiesToUpdate =
          withoutCoreProperties
            .filter(p => !validation.get.validationInfo
              .exists(_.exists(vi => vi._1 == ValidationErrorResponse.ProcessorPropertyName && vi._2 == p._1))
            )
        if (propertiesToUpdate.isEmpty)
          throw new ValidationException(validation.get)

        ProcessorApi.updateProperties(processorId, propertiesToUpdate, Req.clientId)

      } else {
        ProcessorApi.updateProperties(processorId, withoutCoreProperties, Req.clientId)
      }
    }
      .map(_.toResult)

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

  def destroy(id: String,
              flowInstanceId: String,
              processorType: String): EssentialAction =  csrfCheckAction async { implicit request =>
    ProcessorApi.remove(id, flowInstanceId, processorType, Req.version, Req.clientId)
      .map(_.toResult)
  }


}
