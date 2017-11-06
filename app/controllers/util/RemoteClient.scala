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
