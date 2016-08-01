/**
 * Created by cmathew on 20/07/16.
 */
/// <reference path="../../../../typings/globals/jasmine/index.d.ts" />
import { FlowTemplate } from "./flow.model"

describe("FlowTemplate", () => {
    it("has id", () => {
        let ft: FlowTemplate = {
            id: "12",
            name: "name",
            description: "description",
            uri: "uri",
            date: "timestamp"
        }
        expect(ft.id).toEqual("12")
    })
})