package global

import java.security.spec.X509EncodedKeySpec
import java.security.{KeyFactory, PublicKey}
import java.util.Date

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64
import controllers.{AuthPolicy, Permission}
import io.jsonwebtoken.{Claims, Jws, Jwts}
import org.dcs.api.error.{ErrorConstants, RESTException}
import org.dcs.commons.config.Configurator
import org.dcs.commons.YamlSerializerImplicits._
import org.keycloak.authorization.client.representation.{ResourceRepresentation, ScopeRepresentation}
import org.keycloak.authorization.client.resource.ProtectionResource
import org.keycloak.authorization.client.{AuthzClient, Configuration}
import org.keycloak.representations.adapters.config.AdapterConfig
import org.keycloak.util.JsonSerialization

import scala.collection.JavaConverters._
import scala.util.control.NonFatal

/**
  * Created by cmathew on 13.10.16.
  */
class Authorisation {

}

object AuthConfigurator extends Configurator(None, Some("authConfig"))
object AuthPolicyConfigurator extends Configurator(Some("/auth-policy.yaml"), Some("authPolicyConfig"))

object Authorisation {

  val keycloakConfig: AdapterConfig =
    JsonSerialization.readValue[AdapterConfig](AuthConfigurator.config(), classOf[AdapterConfig])
  val authPolicy = AuthPolicyConfigurator.config().toObject[AuthPolicy]
  val authzClient: AuthzClient = {
    try {
      val configuration: Configuration =
        new Configuration(keycloakConfig.getAuthServerUrl,
          keycloakConfig.getRealm,
          keycloakConfig.getResource,
          keycloakConfig.getCredentials, null)
      AuthzClient.create(configuration)
    } catch {
      case NonFatal(t) =>
        throw new RESTException(ErrorConstants.DCS503.withErrorMessage(t.getMessage))
    }
  }

  def claims(tokenHeader: Option[String]): Claims = {
    tokenHeader match {
      case Some(token) if token.split(" ").head == "Bearer" => {
        val bearerToken = token.split(" ").tail.head

        try {
          val stringKey = keycloakConfig.getRealmKey
          val x509publicKey: X509EncodedKeySpec = new X509EncodedKeySpec(Base64.decode(stringKey))
          val kf: KeyFactory = KeyFactory.getInstance("RSA")
          val publicKey: PublicKey = kf.generatePublic(x509publicKey)
          val parsedJwt: Jws[Claims] = Jwts.parser().setSigningKey(publicKey).parseClaimsJws(bearerToken)
          val claims: Claims = parsedJwt.getBody

          if(claims.getExpiration.before(new Date()))
            throw new RESTException(ErrorConstants.DCS502.withErrorMessage("Token has expired"))
          else if(!authPolicy.clients.contains(claims.getAudience))
            throw new RESTException(ErrorConstants.DCS502.withErrorMessage("Client " + claims.getAudience + " not recognised"))
          else if(claims.getIssuer != keycloakConfig.getAuthServerUrl + "/realms/" + keycloakConfig.getRealm)
            throw new RESTException(ErrorConstants.DCS502.withErrorMessage("Token issuer is not valid"))
          else
            claims

        } catch {
          case NonFatal(t) => throw new RESTException(ErrorConstants.DCS502.withErrorMessage(t.getMessage))
        }
      }
      case _ => throw new RESTException(ErrorConstants.DCS501)
    }
  }

  def claimValue(claims: Claims, key:String): Option[String] =
    Option(claims.get(key).asInstanceOf[String])

  def userId(claims: Claims): String = {
    val userId = claims.getSubject
    if(userId.isEmpty)
      throw new RESTException(ErrorConstants.DCS501)
    userId
  }

  def roles(claims: Claims): List[String] = {
    var rolelabels: List[String] = Nil
    val realm_access =
      claims.get("realm_access")
        .asInstanceOf[java.util.LinkedHashMap[String, java.util.ArrayList[String]]]
    if(realm_access != null) {
      val roles = realm_access.get("roles")
      if(roles != null)
        rolelabels = roles.asScala.toList
    }

    rolelabels
  }

  def permissions(claims: Claims): List[Permission] = {
    var permissionDetails: List[Permission] = Nil
    val authorization =
      claims.get("authorization")
        .asInstanceOf[java.util.LinkedHashMap[String, java.util.ArrayList[java.util.LinkedHashMap[String, AnyRef]]]]
    if(authorization != null) {
      val permissions = authorization.get("permissions")
      if(permissions != null)
        permissionDetails = permissions.asScala.toList.map(
          lhm =>  {
            val scopes = lhm.get("scopes").asInstanceOf[java.util.ArrayList[String]]
            new Permission(
              if(scopes == null) Nil else scopes.asScala.toList,
              lhm.get("resource_set_id").asInstanceOf[String],
              lhm.get("resource_set_name").asInstanceOf[String])
          })
      // scopes , resource_set_id, resource_set_name
    }
    permissionDetails
  }

  def checkPermissions(requestPath: String,
                       requestMethod: String,
                       claims: Claims): Boolean = {
    val policyPaths =
      authPolicy.paths.filter(policyPath => {
        policyPath.path.r.findFirstIn(requestPath).isDefined
      })
    // if no authConfig policy has been set for the requested endpoint uri path and http method
    // then there are no permissions to check
    if (policyPaths.nonEmpty) {
      val policyPathMethods =
        policyPaths.head.methods.filter(policyPathMethod => policyPathMethod.method == requestMethod)
      if (policyPathMethods.nonEmpty) {
        val perms = permissions(claims)
        val filteredPerms = perms.filter(p => policyPaths.head.name.r.findFirstIn(p.resourceName).isDefined)
        if (filteredPerms.isEmpty)
          throw new RESTException(ErrorConstants.DCS503.withErrorMessage("Insufficient permissions to access resource (" + policyPaths.head.name + ")"))
        val policyScopes = policyPathMethods.head.scopes
        val permissionScopes = filteredPerms.head.scopes
        policyScopes.forall(scope => permissionScopes.contains(scope))
      } else
        true
    } else
      true
  }

  def createProtectedResource(scopeLabels: List[String],
                              name: String,
                              uri: String,
                              `type`: String,
                              userId: String) {
    try {
      val scopes: java.util.HashSet[ScopeRepresentation]  = new java.util.HashSet[ScopeRepresentation]()

      scopeLabels.foreach(s => scopes.add(new ScopeRepresentation(s)))

      val resource: ResourceRepresentation  =
        new ResourceRepresentation(name, scopes, uri, `type`);

      resource.setOwner(userId)

      authzClient.protection().resource().create(resource);
    } catch {
      case NonFatal(t) =>
        throw new RESTException(ErrorConstants.DCS503.withErrorMessage(t.getMessage))
    }
  }

  def deleteProtectedResource(uri: String) {
    try {
      val protection: ProtectionResource  = authzClient.protection();
      val resources: java.util.Set[String]  = protection.resource().findByFilter("uri=" + uri);

      if (resources.isEmpty()) {
        throw new RESTException(ErrorConstants.DCS503.withErrorMessage("Could not find protected resource with URI [" + uri + "]"))
      }

      protection.resource().delete(resources.iterator().next());
    } catch {
      case NonFatal(t) =>
        throw new RESTException(ErrorConstants.DCS503.withErrorMessage(t.getMessage))
    }
  }

  object ClaimKeys {
    val PreferredUsername = "preferred_username"
  }
}


