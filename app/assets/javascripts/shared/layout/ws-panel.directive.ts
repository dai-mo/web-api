/**
 * Created by cmathew on 13/07/16.
 */
import {Directive, ElementRef, Renderer} from "@angular/core"

@Directive({
    selector: "[ws-panel]"
})
export class WsPanelDirective {

    private el: HTMLElement

    constructor(elm: ElementRef, private renderer: Renderer) {
        this.el = elm.nativeElement
        let children = elm.nativeElement.parentElement.children
        if(children.length !== 2) {
            alert("Workspace view is not a bootstrap panel with two children")
            return
        }
        let parentStyle = window.getComputedStyle(elm.nativeElement, null)
        let parentHeight = parseInt(parentStyle.getPropertyValue("height"))

        let panelHeading = children[0]
        let panelHeadingStyle = window.getComputedStyle(panelHeading, null)
        let panelHeadingHeight = parseInt(panelHeadingStyle.getPropertyValue("height"))

        let panelBody = this.el

        // this.renderer.setElementStyle(panelBody, "height", (parentHeight - panelHeadingHeight) + "px")
        // this.renderer.setElementStyle(panelBody, "min-height", (parentHeight - panelHeadingHeight) + "px")
    }
}