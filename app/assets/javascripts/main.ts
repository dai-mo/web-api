import {bootstrap}    from "@angular/platform-browser-dynamic"
import {provide} from "@angular/core"
import {App} from "./app.component"
import {HTTP_PROVIDERS} from "@angular/http"
import {ErrorService} from "./error.service"
import {FlowService} from "./flow.service"

bootstrap(App,
    [provide(Window, {useValue: window}),
        HTTP_PROVIDERS,
        FlowService,
        ErrorService])