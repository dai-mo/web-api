package controllers

import org.dcs.api.error.ErrorResponse
import org.dcs.api.service._
import play.api.libs.json.{Json, Writes}

/**
  * Created by cmathew on 05/06/16.
  */
object ModelImplicits {


  implicit val throwableWrites = new Writes[Throwable] {
    def writes(throwable: Throwable) = Json.obj(
      "message" -> throwable.getMessage
    )
  }

  implicit val testWrites = Json.writes[TestResponse]
  implicit val errorWrites = Json.writes[ErrorResponse]

//  implicit val connectionWrites = Json.writes[Connection]
//  implicit val flowInstanceWrites = Json.writes[FlowInstance]
//  implicit val flowTemplateWrites = Json.writes[FlowTemplate]
//  implicit val processorInstanceWrites = Json.writes[ProcessorInstance]
//  implicit val listProcessorInstanceWrites = Json.writes[List[ProcessorInstance]]
//  implicit val processorTypeWrites = Json.writes[ProcessorType]

}
