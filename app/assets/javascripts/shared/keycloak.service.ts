import {Injectable} from "@angular/core"
import Rx, {Observable, Observer} from "rxjs/Rx"
import {Http} from "@angular/http"
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


  static withRptUpdate(apiCall: (rpt: string) => void): void {
    KeycloakService.authConfig.updateToken(5)
      .success(() => {
        KeycloakService.apiRpt.then(function (rpt: string) {
          apiCall(rpt)
        })
      })
      .error(() => {
        console.log("Failed to refresh token")
      })
  }
}