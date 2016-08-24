import {platformBrowserDynamic} from "@angular/platform-browser-dynamic"
import {NgModule} from "@angular/core"
import {HttpModule} from "@angular/http"
import {App} from "./app.component"
import {ErrorService} from "./shared/util/error.service"
import {FlowService} from "./shared/flow.service"
import {ViewManagerService} from "./shared/view-manager.service"
import {BrowserModule} from "@angular/platform-browser"
import {DataTableModule,SharedModule} from "primeng/primeng"
import {OverlayPanelModule} from "primeng/components/overlaypanel/overlaypanel"

@NgModule({
  declarations: [App],
  providers:[{provide: Window, useValue: window},
    FlowService,
    ViewManagerService,
    ErrorService,],
  imports: [BrowserModule,
    HttpModule,
    DataTableModule,
    SharedModule,
    OverlayPanelModule],
  bootstrap: [App]

})
export class AppModule {

}

platformBrowserDynamic().bootstrapModule(AppModule)