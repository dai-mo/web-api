/**
 * Created by cmathew on 13/07/16.
 */
import {Directive, ElementRef, Input} from "@angular/core"

@Directive({
    selector: "[resize]"
})
export class ResizeDirective {

    private el:HTMLElement

    private resizeType:string
    private dragging: boolean

    private start:number

    private prevElm: HTMLElement
    private prevElmWidth: number
    private prevElmHeight: number
    private prevElmPanelHeadingHeight: number
    private prevElmStyle: CSSStyleDeclaration
    private prevElmPanelHeading: HTMLElement
    private prevElmPanelBody: HTMLElement
    private prevElmStartFlexBasis: number

    private nextElm: HTMLElement
    private nextElmWidth: number
    private nextElmHeight: number
    private nextElmPanelHeadingHeight: number
    private nextElmStyle: CSSStyleDeclaration
    private nextElmPanelHeading: HTMLElement
    private nextElmPanelBody: HTMLElement
    private nextElmStartFlexBasis: number

    constructor(el:ElementRef) {
        this.el = el.nativeElement
    }

    private init() {
        let siblings = this.el.parentElement.children
        if (siblings.length !== 3) {
            alert("Flex container contains incorrect number of children")
            return
        }
        this.prevElm = siblings[0] as HTMLElement
        this.nextElm = siblings[2] as HTMLElement
    }

    private initProperties() {

        this.prevElmStyle = window.getComputedStyle(this.prevElm, null)
        this.prevElmWidth = parseInt(this.prevElmStyle.width)
        this.prevElmHeight = parseInt(this.prevElmStyle.height)
        this.prevElmStartFlexBasis = parseInt(this.prevElmStyle.flexBasis)

        this.nextElmStyle = window.getComputedStyle(this.nextElm, null)
        this.nextElmWidth = parseInt(this.nextElmStyle.width)
        this.nextElmHeight = parseInt(this.nextElmStyle.height)
        this.nextElmStartFlexBasis = parseInt(this.nextElmStyle.flexBasis)
    }

    private initPanelProperties() {

        let prevElemChildren: HTMLCollection = this.prevElm.children
        let nextElemChildren: HTMLCollection = this.nextElm.children

        if(this.resizeType !== "column") {
            // this will be true in the case of the row flex box
            return
        }
        this.prevElmPanelHeading = prevElemChildren[0] as HTMLElement
        let prevElmPanelHeadingStyle = window.getComputedStyle(this.prevElmPanelHeading, null)
        this.prevElmPanelHeadingHeight = parseInt(prevElmPanelHeadingStyle.height)
        this.prevElmPanelBody = prevElemChildren[1] as HTMLElement

        this.nextElmPanelHeading = nextElemChildren[0] as HTMLElement
        let nextElmPanelHeadingStyle = window.getComputedStyle(this.nextElmPanelHeading, null)
        this.nextElmPanelHeadingHeight = parseInt(nextElmPanelHeadingStyle.height)
        this.nextElmPanelBody = nextElemChildren[1] as HTMLElement
    }

    private updatePanelProperties(prevHeight: number, nextHeight: number) {
        this.prevElmPanelBody.style.height = prevHeight + "px"
        this.prevElmPanelBody.style.minHeight = prevHeight + "px"
        this.nextElmPanelBody.style.height = nextHeight + "px"
        this.nextElmPanelBody.style.minHeight = nextHeight + "px"
    }

    private endDrag() {
        this.dragging = false
        document.body.removeEventListener("mouseup", this.endDrag, false)
        document.body.removeEventListener("mousemove", this.drag, false)
    }

    private drag(event: MouseEvent) {
        if(!this.dragging) return

        let offset = 0, prevFlexBasis = 1, nextFlexBasis = 1
        switch (this.resizeType) {
            case "column":
                offset = this.start - event.clientY
                prevFlexBasis = this.prevElmHeight - offset
                nextFlexBasis = this.nextElmHeight + offset
                break
            case "row":
                offset = this.start - event.clientX
                prevFlexBasis = this.prevElmWidth - offset
                nextFlexBasis = this.nextElmWidth + offset
                break
        }

        this.prevElm.style.flexBasis = prevFlexBasis + "px"
        this.nextElm.style.flexBasis = nextFlexBasis + "px"

        if (this.resizeType === "column" &&
            this.nextElmPanelHeadingHeight < nextFlexBasis &&
            this.prevElmPanelHeadingHeight < prevFlexBasis) {
            this.updatePanelProperties(prevFlexBasis - this.prevElmPanelHeadingHeight,
                nextFlexBasis - this.nextElmPanelHeadingHeight)
        }
    }

    private startDrag(event: MouseEvent) {

        switch(this.resizeType) {
            case "column":
                this.start = event.clientY
                break
            case "row":
                this.start = event.clientX
                break
            default:
                return
        }

        this.initProperties()
        this.initPanelProperties()
        this.dragging = true

        document.body.addEventListener("mouseup", this.endDrag.bind(this), false)
        document.body.addEventListener("mousemove", this.drag.bind(this), false)
    }


    @Input() set type(type: string) {
        let self = this
        this.resizeType = type
        this.init()
        this.initProperties()
        this.el.onmousedown = function(event: MouseEvent) {
            if(event.which === 1) {
                self.startDrag(event)
            }
        }
    }
}