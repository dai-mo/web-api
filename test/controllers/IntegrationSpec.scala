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

import org.scalatest.Ignore
import org.scalatestplus.play._

/**
 * add your integration spec here.
 * An integration test will fire up a whole play application in a real (or headless) browser
 */
@Ignore
class IntegrationSpec extends PlaySpec with OneServerPerTest with OneBrowserPerTest with HtmlUnitFactory {

  "Application" should {

    "work from within a browser" in {

      go to ("http://localhost:" + port)

      pageSource must include ("Your new application is ready.")
    }
  }
}
