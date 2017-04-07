package controllers

import org.dcs.api.service.ProcessorServiceDefinition
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.scalatest.Ignore
import org.scalatestplus.play.OneAppPerTest
import play.api.libs.json.JsArray
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}

/**
  * Created by cmathew on 07.04.17.
  */
//FIXME: Setting to ignore
//       otherwise this test will be run during the release
//       process. This should be reverted once the integration
//       test environment is setup.
@Ignore
class FlowProcessorApiISpec  extends WebBaseSpec with OneAppPerTest {

  "Flow Processor Api" should {
    "return list of available processor services" taggedAs IT in {
      init(app)

      // test full services list
      val processorServiceDefinitionResponse = route(app,
        withDcsCookiesHeaders(FakeRequest(GET, "/api/flow/processor"))).get

      status(processorServiceDefinitionResponse) mustBe OK

      val processorServicesJS = contentAsJson(processorServiceDefinitionResponse).as[JsArray]

      assert(processorServicesJS.value.nonEmpty)

      val processorServices = processorServicesJS.value.map(js => js.toString().toObject[ProcessorServiceDefinition])
      assert(processorServices.count(_.processorServiceClassName == "org.dcs.core.service.TestProcessorService") == 1)

      // test tag filtered services list
      val tagFilteredProcessorServiceDefinitionResponse = route(app,
        withDcsCookiesHeaders(FakeRequest(GET, "/api/flow/processor/list/org.dcs.processor.tags/.*test.*"))).get

      status(tagFilteredProcessorServiceDefinitionResponse) mustBe OK

      val tagFilteredProcessorServicesJS = contentAsJson(tagFilteredProcessorServiceDefinitionResponse).as[JsArray]

      val tagFilteredProcessorServices = tagFilteredProcessorServicesJS.value.map(js => js.toString().toObject[ProcessorServiceDefinition])
      assert(tagFilteredProcessorServices.exists(_.processorServiceClassName == "org.dcs.core.service.TestProcessorService"))
      assert(tagFilteredProcessorServices.exists(_.processorServiceClassName == "org.dcs.core.service.StatefulTestProcessorService"))

      // test type filtered services list
      val typeFilteredProcessorServiceDefinitionResponse = route(app,
        withDcsCookiesHeaders(FakeRequest(GET, "/api/flow/processor/list/org.dcs.processor.type/worker"))).get

      status(typeFilteredProcessorServiceDefinitionResponse) mustBe OK

      val typeFilteredProcessorServicesJS = contentAsJson(typeFilteredProcessorServiceDefinitionResponse).as[JsArray]

      val typeFilteredProcessorServices = typeFilteredProcessorServicesJS.value.map(js => js.toString().toObject[ProcessorServiceDefinition])
      assert(typeFilteredProcessorServices.exists(_.processorServiceClassName == "org.dcs.core.service.TestProcessorService"))
      assert(typeFilteredProcessorServices.exists(_.processorServiceClassName == "org.dcs.core.service.StatefulTestProcessorService"))

    }
  }

}
