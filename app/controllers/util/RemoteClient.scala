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
    service(processorServiceClassName, stateful).details()
  }

  override def service(processorServiceClassName: String, stateful: Boolean): RemoteProcessorService = {
    if (stateful)
      broker.loadService[StatefulRemoteProcessorService](processorServiceClassName)
    else
      broker.loadService[RemoteProcessorService](processorServiceClassName)
  }

  override def service(processorServiceClassName: String): RemoteProcessorService = {
    val psds: List[ProcessorServiceDefinition] =
      broker.filterServiceByProperty(CxfEndpointUtils.ClassNameKey, processorServiceClassName)

    if(psds.isEmpty)
      throw new HttpException(ErrorConstants.DCS301.http(400))
    else {
      val psd = psds.head
      service(psd.processorServiceClassName, psd.stateful)
    }
  }
}
