/**
 * Created by cmathew on 14/07/16.
 */
import {ElementRef, Directive} from "@angular/core"

import * as d3 from "d3"

@Directive({
    selector: "[visjs]"
})
export class FlowGraphDirective {

    private el:HTMLElement

    // constructor(el:ElementRef) {
    //     this.el = el.nativeElement
    //
    //     // create an array with nodes
    //     let nodes = new visjs.DataSet([
    //         {id: 1, label: "Node 1"},
    //         {id: 2, label: "Node 2"},
    //         {id: 3, label: "Node 3"},
    //         {id: 4, label: "Node 4"},
    //         {id: 5, label: "Node 5"}
    //     ])
    //
    //     // create an array with edges
    //     let edges = new visjs.DataSet([
    //         {from: 1, to: 3},
    //         {from: 1, to: 2},
    //         {from: 2, to: 4},
    //         {from: 2, to: 5}
    //     ])
    //
    //     let flow = {
    //         nodes: nodes,
    //         edges: edges
    //     }
    //     let options = {}
    //     new visjs.Network(this.el, flow, options)
    // }
}