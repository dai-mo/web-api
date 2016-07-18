import {bootstrap}    from "@angular/platform-browser-dynamic"
import {provide} from "@angular/core"
import {HTTP_PROVIDERS} from "@angular/http"

import {App} from "./app.component"
import {ErrorService} from "./shared/util/error.service"
import {FlowService} from "./analyse/shared/flow.service"

bootstrap(App,
    [provide(Window, {useValue: window}),
        HTTP_PROVIDERS,
        FlowService,
        ErrorService])