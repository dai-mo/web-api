/*
 * Copyright (c) 2017-2018 brewlabs SAS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package controllers

import javax.inject.{Inject, Singleton}

import controllers.routing.ResourceRouter
import controllers.util.{CSRFCheckAction, CSRFTokenAction}
import global.ResultSerialiserImplicits._
import org.dcs.api.processor.{CoreProperties, RelationshipType, RemoteProcessor}
import org.dcs.api.service.IFlowDataService
import org.dcs.commons.serde.AvroImplicits._
import org.dcs.commons.serde.AvroSchemaStore
import org.dcs.flow.ProcessorApi
import org.dcs.remote.ZkRemoteService
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc.{Action, EssentialAction}

import scala.collection.JavaConverters._

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
    val flowDataService = ZkRemoteService.loadService[IFlowDataService]
    //val typeId = processorId.split(':')
    //val pid = typeId(1)
    ProcessorApi.instance(processorId).
      map(pi => {
        val cp = CoreProperties(pi.properties)
        cp.readSchemaId.foreach(AvroSchemaStore.add)
        cp.writeSchemaId.foreach(AvroSchemaStore.add)
        cp.resolveWriteSchema()
      }).
      map(schema => {
        val response = flowDataService.provenanceByComponentId(processorId, DefaultMaxResults).asScala
        response.
          filter(prov => prov.relationship != RelationshipType.Failure.id).
          map(prov => {
            val content = prov.raw.deSerToJsonString(schema, schema)
            prov.setRaw(null)
            prov.setContent(content)
            prov
          })
      }).map(_.toResult)

  }
}
