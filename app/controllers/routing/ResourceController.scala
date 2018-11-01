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

package controllers.routing

import controllers.util.ContentNegotiation
import play.api.mvc.{Controller, EssentialAction}

/**
  * Created by cmathew on 24/06/16.
  */
trait ResourceController[T] extends Controller {
  def list: EssentialAction
  def create: EssentialAction
  def find(id: T): EssentialAction
  def update(id: T): EssentialAction
  def destroy(id: T): EssentialAction
}
