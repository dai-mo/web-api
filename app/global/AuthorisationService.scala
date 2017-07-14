package global

import java.security.spec.X509EncodedKeySpec
import java.security.{KeyFactory, PublicKey}
import java.util.Date
import javax.inject.Singleton

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64
import controllers.{AuthPolicy, Permission}
import io.jsonwebtoken.{Claims, Jws, Jwts}
import org.dcs.commons.config.Configurator
import org.dcs.commons.error.{ErrorConstants, HttpException}
import org.dcs.commons.serde.YamlSerializerImplicits._
import org.keycloak.authorization.client.representation.{EntitlementRequest, PermissionRequest, ResourceRepresentation, ScopeRepresentation}
import org.keycloak.authorization.client.resource.ProtectionResource
import org.keycloak.authorization.client.{AuthzClient, Configuration}
import org.keycloak.representations.adapters.config.AdapterConfig
import org.keycloak.util.JsonSerialization

import scala.collection.JavaConverters._
import scala.util.control.NonFatal

/**
  * Created by cmathew on 13.10.16.
  */


@Singleton
class AuthorisationService {


  val keycloakConfig: AdapterConfig =
    JsonSerialization.readValue[AdapterConfig](authConfig, classOf[AdapterConfig])
  val authPolicy = authPolicyConfig
  val authzClient: AuthzClient = initAuthzClient()

  def authConfig =
    new Configurator(Some("/auth-config.json"), Some("authConfig")).config()

  def authPolicyConfig =
    new Configurator(Some("/auth-policy.yaml"), Some("authPolicyConfig")).config().toObject[AuthPolicy]

  def initAuthzClient(): AuthzClient = {
    try {
      val configuration: Configuration =
        new Configuration(keycloakConfig.getAuthServerUrl,
          keycloakConfig.getRealm,
          keycloakConfig.getResource,
          keycloakConfig.getCredentials, null)
      AuthzClient.create(configuration)

    } catch {
      case NonFatal(t) =>
        throw new HttpException(ErrorConstants.DCS503.withDescription(t.getMessage).http(401))
    }
  }

  def claims(accessTokenHeader: Option[String], permissionRequests: List[PermissionRequest]): Claims = {
    accessTokenHeader match {
      case Some(token) if token.split(" ").head == "Bearer" => {
        val bearerToken = token.split(" ").tail.head
        val entitlementResource = authzClient.entitlement(bearerToken)

        val entitlementResponse = if(permissionRequests.nonEmpty) {
          val entitlementRequest = new EntitlementRequest
          entitlementRequest.setPermissions(permissionRequests.asJava)
          entitlementResource.get(keycloakConfig.getResource, entitlementRequest)
        } else {
          entitlementResource.getAll(keycloakConfig.getResource)
        }
        claims(entitlementResponse.getRpt)
      }
      case _ => throw new HttpException(ErrorConstants.DCS501.http(401))
    }
  }

  def claims(rptHeader: Option[String]): Claims = {
    rptHeader match {
      case Some(token) if token.split(" ").head == "Bearer" => {
        val bearerToken = token.split(" ").tail.head
        claims(bearerToken)
      }
      case _ => throw new HttpException(ErrorConstants.DCS501.http(401))
    }
  }

  def claims(bearerToken: String): Claims = {
    try {
      val stringKey = keycloakConfig.getRealmKey
      val x509publicKey: X509EncodedKeySpec = new X509EncodedKeySpec(Base64.decode(stringKey))
      val kf: KeyFactory = KeyFactory.getInstance("RSA")
      val publicKey: PublicKey = kf.generatePublic(x509publicKey)
      val parsedJwt: Jws[Claims] = Jwts.parser().setSigningKey(publicKey).parseClaimsJws(bearerToken)
      val claims: Claims = parsedJwt.getBody

      if(claims.getExpiration.before(new Date()))
        throw new HttpException(ErrorConstants.DCS502.withDescription("Token has expired").http(401))

      if(!authPolicy.clients.contains(claims.getAudience))
        throw new HttpException(ErrorConstants.DCS502.withDescription("Client '" + claims.getAudience + "' not recognised").http(401))

      if(claims.getIssuer != keycloakConfig.getAuthServerUrl + "/realms/" + keycloakConfig.getRealm)
        throw new HttpException(ErrorConstants.DCS502.withDescription("Token issuer is not valid").http(401))

      claims

    } catch {
      case re: HttpException => throw re
      case NonFatal(t) => throw new HttpException(ErrorConstants.DCS502.withDescription(t.getMessage).http(401))
    }
  }

  def claimValue(claims: Claims, key:String): Option[String] =
    Option(claims.get(key).asInstanceOf[String])

  def userId(claims: Claims): String = {
    val userId = claims.getSubject
    if(userId.isEmpty)
      throw new HttpException(ErrorConstants.DCS501.http(401))
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
    val policyPath =
      authPolicy.paths.find(policyPath => {
        policyPath.path.r.pattern.matcher(requestPath).matches()
      })
    // if no authConfig policy has been set for the requested endpoint uri path and http method
    // then there are no permissions to check
    if (policyPath.nonEmpty) {
      val policyPathMethod =
        policyPath.get.methods.find(policyPathMethod => policyPathMethod.method == requestMethod)
      if (policyPathMethod.nonEmpty) {
        val perms = permissions(claims)
        val filteredPerms = perms.find(
          p => policyPath.get.name.r.pattern.matcher(p.resourceName).matches()
        )
        if (filteredPerms.isEmpty)
          throw new HttpException(ErrorConstants.DCS503.withDescription("No permissions to access resource (" + policyPath.head.name + ")").http(401))

        val policyScopes = policyPathMethod.get.scopes
        val permissionScopes = filteredPerms.get.scopes
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
        throw new HttpException(ErrorConstants.DCS503.withDescription(t.getMessage).http(401))
    }
  }

  def deleteProtectedResource(uri: String) {
    try {
      val protection: ProtectionResource  = authzClient.protection();
      val resources: java.util.Set[String]  = protection.resource().findByFilter("uri=" + uri);

      if (resources.isEmpty()) {
        throw new HttpException(ErrorConstants.DCS503.withDescription("Could not find protected resource with URI [" + uri + "]").http(501))
      }

      protection.resource().delete(resources.iterator().next());
    } catch {
      case NonFatal(t) =>
        throw new HttpException(ErrorConstants.DCS503.withDescription(t.getMessage).http(501))
    }
  }

  object ClaimKeys {
    val PreferredUsername = "preferred_username"
  }
}


