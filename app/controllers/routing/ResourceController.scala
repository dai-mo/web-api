package controllers.routing

import controllers.util.ContentNegotiation
import play.api.mvc.{Controller, EssentialAction}

/**
  * Created by cmathew on 24/06/16.
  */
trait ResourceController[T] extends Controller with ContentNegotiation {
  def list: EssentialAction
  def create: EssentialAction
  def find(id: T): EssentialAction
  def update(id: T): EssentialAction
  def destroy(id: T): EssentialAction
}
