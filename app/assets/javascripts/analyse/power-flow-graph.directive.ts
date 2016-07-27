/**
 * Created by cmathew on 14/07/16.
 */
import {ElementRef, Directive} from "@angular/core"

import webcola from "webcola"

@Directive({
    selector: "[power-flow-graph]",
})
export class PowerFlowGraphDirective {

    private el:HTMLElement

    constructor(el:ElementRef) {
        this.el = el.nativeElement

        let width = 300, height = 500

        let select = d3.select(el.nativeElement)

        let svg = select.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")

        let color = d3.scale.category20()


        let cola = webcola.d3adaptor()
            .linkDistance(120)
            .avoidOverlaps(true)
            .size([width, height])

        d3.json("assets/javascripts/analyse/powergraph.json", function (error, graph) {
            cola
                .nodes(graph.nodes)
                .links(graph.links)
                .start()

            let link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")

            let node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("rect")
                .attr("class", "node")
                .attr("width", function (d) { return d.width })
                .attr("height", function (d) { return d.height })
                .attr("rx", 5).attr("ry", 5)
                .style("fill", function (d) { return color(1) })
                .call(cola.drag)

            let label = svg.selectAll(".label")
                .data(graph.nodes)
                .enter().append("text")
                .attr("class", "label")
                .text(function (d) { return d.name })
                .call(cola.drag)

            node.append("title")
                .text(function (d) { return d.name })

            cola.on("tick", function () {
                link.attr("x1", function (d) { return d.source.x })
                    .attr("y1", function (d) { return d.source.y })
                    .attr("x2", function (d) { return d.target.x })
                    .attr("y2", function (d) { return d.target.y })

                node.attr("x", function (d) { return d.x - d.width / 2 })
                    .attr("y", function (d) { return d.y - d.height / 2 })

                label.attr("x", function (d) { return d.x })
                    .attr("y", function (d) {
                        let h = this.getBBox().height
                        return d.y + h/4
                    })
            })
        })
    }
}