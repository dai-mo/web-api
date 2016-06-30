package controllers

import javax.inject.{Inject, Singleton}

import org.dcs.commons.JsonSerializerImplicits._
import org.dcs.flow.nifi.{NifiApiConfig, NifiFlowClient}
import play.api.mvc.{Action, Controller}

/**
  * Created by cmathew on 08/06/16.
  */

@Singleton
class FlowTemplateApi @Inject() extends Controller {

  object NifiFlowApi extends NifiFlowClient with NifiApiConfig

  def flowTemplatesGet(clientId: String) = Action {
    Ok(NifiFlowApi.templates(clientId).toJson).as(JSON)
  }

  def flowInstantiatePost(flowTemplateId:String, clientId: String) = Action {
    Ok(NifiFlowApi.instantiate(flowTemplateId, clientId).toJson).as(JSON)
  }

  def flowInstanceGet(flowInstanceId: String, clientId: String) = Action {
    Ok(NifiFlowApi.instance(flowInstanceId, clientId).toJson).as(JSON)
  }

  def flowRemoveDelete(flowInstanceId: String, clientId: String) = Action {
    Ok(NifiFlowApi.remove(flowInstanceId, clientId).toJson).as(JSON)
  }
}

