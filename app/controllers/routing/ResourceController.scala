package controllers.routing

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
