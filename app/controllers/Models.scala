package controllers

import scala.beans.BeanProperty


/**
  * Created by cmathew on 22/07/16.
  */
case class Health(@BeanProperty var version:String) {
  def this() = this("")
}