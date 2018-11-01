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

package controllers.util

import javax.inject.{Inject, Singleton}

import com.google.inject.ImplementedBy
import org.dcs.api.service.{ProcessorDetails, ProcessorServiceDefinition, RemoteProcessorService, StatefulRemoteProcessorService}
import org.dcs.commons.error.{ErrorConstants, HttpException}
import org.dcs.remote.ZkRemoteService
import org.dcs.remote.cxf.CxfEndpointUtils
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

/**
  * Created by cmathew on 08/07/16.
  */

@ImplementedBy(classOf[Remote])
trait RemoteClient {
  init()

  def init(): Unit

  def broker: ZkRemoteService.type

  def serviceDetails(processorServiceClassName: String, stateful: Boolean): ProcessorDetails

  def service(processorServiceClassName: String, stateful: Boolean): RemoteProcessorService

  def service(processorServiceClassName: String): RemoteProcessorService

}

@Singleton
class Remote @Inject() (lifecycle: ApplicationLifecycle) extends RemoteClient {

  override def broker: ZkRemoteService.type = ZkRemoteService

  override def init(): Unit = {
    broker.loadServiceCaches()

    lifecycle.addStopHook { () =>
      Future.successful(broker.dispose)
    }
  }

  override def serviceDetails(processorServiceClassName: String, stateful: Boolean): ProcessorDetails = {
    broker.serviceDetails(processorServiceClassName, stateful)
  }

  override def service(processorServiceClassName: String, stateful: Boolean): RemoteProcessorService = {
    broker.service(processorServiceClassName, stateful)
  }

  override def service(processorServiceClassName: String): RemoteProcessorService = {
    broker.service(processorServiceClassName)
  }
}
