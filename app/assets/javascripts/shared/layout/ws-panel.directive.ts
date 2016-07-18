/**
 * Created by cmathew on 13/07/16.
 */
import {Directive, ElementRef} from "@angular/core"

@Directive({
    selector: "[ws-panel]"
})
export class WsPanelDirective {

    private el: HTMLElement

    constructor(elm: ElementRef) {
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

        panelBody.style.height = (parentHeight - panelHeadingHeight) + "px"
        panelBody.style.minHeight = (parentHeight - panelHeadingHeight) + "px"
    }
}