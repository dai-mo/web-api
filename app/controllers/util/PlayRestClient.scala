package org.dcs.commons.ws

/**
  * Created by cmathew on 31.10.16.
  */

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import org.dcs.commons.serde.JsonSerializerImplicits._
import org.dcs.commons.error.{ErrorResponse, RESTException}
import play.api.http.MimeTypes
import play.api.libs.ws.{WSRequest, WSResponse}
import play.api.libs.ws.ahc.AhcWSClient

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future


trait PlayRestClient extends ApiConfig {

  implicit val system = ActorSystem()
  implicit val materializer = ActorMaterializer()
  val wsClient = AhcWSClient()

  def defaultHeaders(): List[(String, String)] = {
    ("Content-Type", MimeTypes.JSON) :: Nil
  }

  private def request(path: String,
                      queryParams: List[(String, String)] = List(),
                      headers: List[(String, String)] = List()): WSRequest =
    wsClient.url(endpoint(path))
      .withQueryString(queryParams:_*)
      .withHeaders(headers:_*)


  private def responseOrError(response: WSResponse): Either[ErrorResponse, WSResponse] =
    if(response.status >= 400 && response.status < 600)
      Left(error(response.status, response.body))
    else
      Right(response)


  private def responseOrException(response: WSResponse): WSResponse =
    if(response.status >= 400 && response.status < 600)
      throw new RESTException(error(response.status, response.body))
    else
      response


  def getAsEither(path: String,
                  queryParams: List[(String, String)] = List(),
                  headers: List[(String, String)] = List()): Future[Either[ErrorResponse, WSResponse]] =
    request(path, queryParams, headers)
      .get
      .map(responseOrError)


  def get(path: String,
          queryParams: List[(String, String)] = List(),
          headers: List[(String, String)] = List()): Future[WSResponse] =
    request(path, queryParams, headers)
      .get
      .map(responseOrException)



  def getAsJson(path: String,
                queryParams: List[(String, String)] = List(),
                headers: List[(String, String)] = List()): Future[String] =
    get(path, queryParams, headers)
      .map(_.json.toString)



  def putAsEither[B](path: String,
                     body: B = AnyRef,
                     queryParams: List[(String, String)] = List(),
                     headers: List[(String, String)] = List()): Future[Either[ErrorResponse, WSResponse]] =
    request(path, queryParams, headers)
      .put(body.toJson)
      .map(responseOrError)


  def put[B](path: String,
             body: B = AnyRef,
             queryParams: List[(String, String)] = List(),
             headers: List[(String, String)] = List()): Future[WSResponse] =
    request(path, queryParams, headers)
      .put(body.toJson)
      .map(responseOrException)



  def putAsJson[B](path: String,
                   body: B = AnyRef,
                   queryParams: List[(String, String)] = List(),
                   headers: List[(String, String)] = List()): Future[String] =
    put(path, body, queryParams, headers)
      .map(_.json.toString)


  def postAsEither[B](path: String,
                      body: B = AnyRef,
                      queryParams: List[(String, String)] = List(),
                      headers: List[(String, String)] = List()): Future[Either[ErrorResponse, WSResponse]] =
    request(endpoint(path), queryParams, headers)
      .post(body.toJson)
      .map(responseOrError)


  def post[B](path: String,
              body: B = AnyRef,
              queryParams: List[(String, String)] = List(),
              headers: List[(String, String)] = List()): Future[WSResponse] =
    request(endpoint(path), queryParams, headers)
      .post(body.toJson)
      .map(responseOrException)



  def postAsJson[B](path: String,
                    body: B = AnyRef,
                    queryParams: List[(String, String)] = List(),
                    headers: List[(String, String)] = List()): Future[String] =
    post(path, body, queryParams, headers)
      .map(_.json.toString)


  def deleteAsEither(path: String,
                     queryParams: List[(String, String)] = List(),
                     headers: List[(String, String)] = List()): Future[Either[ErrorResponse, WSResponse]] =
    request(endpoint(path), queryParams, headers)
      .delete
      .map(responseOrError)


  def delete(path: String,
             queryParams: List[(String, String)] = List(),
             headers: List[(String, String)] = List()): Future[WSResponse] =
    request(endpoint(path), queryParams, headers)
      .delete
      .map(responseOrException)



  def deleteAsJson(path: String,
                   queryParams: List[(String, String)] = List(),
                   headers: List[(String, String)] = List()): Future[String] =
    delete(path, queryParams, headers)
      .map(_.json.toString)


}
