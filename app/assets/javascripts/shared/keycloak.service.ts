import {Injectable} from "@angular/core"
import {Observable, Observer} from "rxjs/Rx"
import Rx from "rxjs/Rx"
import {RequestOptions, Http} from "@angular/http"
import {ErrorService} from "./util/error.service"


declare var Keycloak: any
declare var KeycloakAuthorization: any

@Injectable()
export class KeycloakService {
  static authConfig: any = {}
  static authz: any = {}
  static apiRpt: any = {}
  static rpt: string = ""
  static loggedIn: boolean = false
  static logoutUrl: string

  constructor(private http: Http,
              private errorService: ErrorService) {

  }

  static init(): Observable<any> {
    KeycloakService.authConfig = new Keycloak("/assets/keycloak.json")
    KeycloakService.loggedIn = false

    let kcInitObs = Rx.Observable.create(function (observer: Observer<any>) {
      KeycloakService.authConfig.init({ onLoad: "login-required" })
        .success(() => {
          KeycloakService.loggedIn = true

          KeycloakService.authz = new KeycloakAuthorization(KeycloakService.authConfig)
          KeycloakService.apiRpt = KeycloakService.authz.entitlement("alambeek-api")
          KeycloakService.logoutUrl = KeycloakService.authConfig.authServerUrl + "/realms/demo/protocol/openid-connect/logout?redirect_uri=/index.html"
          observer.next(KeycloakService.authConfig)
          observer.complete()
        })
        .error(() => {
          observer.error("Error initialising keycloak")
        })
    })
    return kcInitObs
  }


  logout() {
    console.log("*** LOGOUT ***")
    KeycloakService.loggedIn = false
    KeycloakService.authConfig = null

    window.location.href = KeycloakService.authConfig.logoutUrl
  }

  refreshToken(): Observable<string> {
    let kcRtObs = Rx.Observable.create(function (observer: Observer<any>) {
      if (KeycloakService.authConfig.authz.token) {
        KeycloakService.authConfig.authz.updateToken(5)
          .success(() => {
            observer.next(<string>KeycloakService.authConfig.authz.token)
            observer.complete()
          })
          .error(() => {
            observer.error("Failed to refresh token")
          })
      }
    })
    return kcRtObs
  }
}