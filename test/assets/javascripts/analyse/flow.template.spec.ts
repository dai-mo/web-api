/**
 * Created by cmathew on 20/07/16.
 */
import { FlowTemplate } from "./flow.template"

describe("FlowTemplate", () => {
    it("has id", () => {
        let ft: FlowTemplate = {id: "12"}
        expect(ft.id).toEqual("12")
    })
})