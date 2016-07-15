/**
 * Created by cmathew on 14/07/16.
 */
import {ElementRef, Directive} from "@angular/core"

import d3 from "d3"

@Directive({
    selector: "[flow-graph]"
})
export class FlowGraphDirective {

    private el:HTMLElement

    constructor(el:ElementRef) {
        this.el = el.nativeElement

        let width = 400, height = 500

        let select = d3.select(el.nativeElement)

        let svg = select.append("svg")
            .attr("width", width)
            .attr("height", height)

        d3.json("assets/javascripts/analyse/graph.json", function(error, graph) {

            graph.links.forEach(function(d: any) {
                d.source = graph.nodes[d.source]
                d.target = graph.nodes[d.target]
            })

            let link = svg.append("g")
                .attr("class", "link")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("x1", function(d: any) { return d.source.x })
                .attr("y1", function(d: any) { return d.source.y })
                .attr("x2", function(d: any) { return d.target.x })
                .attr("y2", function(d: any) { return d.target.y })
                .attr("stroke-width", 2)
                .attr("stroke", "grey")

            let node = svg.append("g")
                .attr("class", "node")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("r", 10)
                .attr("cx", function(d: any) { return d.x })
                .attr("cy", function(d: any) { return d.y })
                .attr("stroke", "green")
                .attr("fill", "blue")
                .call(d3.behavior.drag()
                    .origin(function(d: any) { return d })
                    .on("drag", function(d: any) {
                        let event = d3.event as DragEvent
                        d.x = event.x, d.y = event.y
                        d3.select(this).attr("cx", d.x).attr("cy", d.y)
                        link.filter(function(l: any) { return l.source === d }).attr("x1", d.x).attr("y1", d.y)
                        link.filter(function(l: any) { return l.target === d }).attr("x2", d.x).attr("y2", d.y)
                    }))
        })
    }
}