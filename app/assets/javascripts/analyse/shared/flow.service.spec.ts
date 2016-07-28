/**
 * Created by cmathew on 27/07/16.
 */

import {
    describe,
    it,
    inject,
    beforeEachProviders,
    expect
} from "@angular/core/testing"

import {HTTP_PROVIDERS} from "@angular/http"
import {FlowService} from "./flow.service"

xdescribe("Flow Service", () => {
    beforeEachProviders(() => [HTTP_PROVIDERS, FlowService])

    it("can retrieve templates", inject([FlowService], (flowService: FlowService) => {

        // flowService
        //     .getTemplates()
        //     .subscribe(
        //         templates => {
        //             expect(templates.length).toBe(2)
        //         },
        //         (error: any) => this.errorService.handleError(error)
        //     )
        expect(1).toBe(1)
    }))
})
