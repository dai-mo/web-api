package controllers

import com.fasterxml.jackson.annotation.JsonProperty

import scala.beans.BeanProperty


/**
  * Created by cmathew on 22/07/16.
  */
case class Health(@BeanProperty var version:String) {
  def this() = this("")
}

case class KeycloakConfig(var realm: String,
                          var realmPublicKey: String,
                          var authServerUrl: String,
                          var client: String)

case class Permission(var scopes: List[String],
                      var resourceId: String,
                      var resourceName: String)

case class AuthPolicy(var clients: List[String],
                      var paths: List[AuthPolicyPath])

case class AuthPolicyPath(var name: String,
                          var path: String,
                          var methods: List[AuthPolicyMethod])

case class AuthPolicyMethod(var method: String,
                            var scopes: List[String])
