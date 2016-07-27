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

        let color = d3.scale.category20()

        let graphfile = "assets/javascripts/analyse/powergraph.json"
        function makeSVG() {
            let outer = select.append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("pointer-events", "all")
            // define arrow markers for graph links
            outer.append("svg:defs").append("svg:marker")
                .attr("id", "end-arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 5)
                .attr("markerWidth", 3)
                .attr("markerHeight", 3)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5L2,0")
                .attr("stroke-width", "0px")
                .attr("fill", "#555")
            let zoomBox = outer.append("rect")
                .attr("class", "background")
                .attr("width", "100%")
                .attr("height", "100%")
            let vis = outer.append("g")
            let redraw = function (transition) {
                return (transition ? vis.transition() : vis)
                    .attr("transform", "translate(" + zoom.translate() + ") scale(" + zoom.scale() + ")")
            }
            vis.zoomToFit = function () {
                let b = webcola.vpsc.Rectangle.empty()
                vis.selectAll("rect").each(function (d) {
                    let bb = this.getBBox()
                    b = b.union(new webcola.vpsc.Rectangle(bb.x, bb.x + bb.width, bb.y, bb.y + bb.height))
                })
                let w = b.width(), h = b.height()
                let cw = Number(outer.attr("width")), ch = Number(outer.attr("height"))
                let s = Math.min(cw / w, ch / h)
                let tx = (-b.x * s + (cw / s - w) * s / 2), ty = (-b.y * s + (ch / s - h) * s / 2)
                zoom.translate([tx, ty]).scale(s)
                redraw(true)
            }
            let zoom = d3.behavior.zoom()
            zoomBox.call(zoom.on("zoom", redraw))
                .on("dblclick.zoom", vis.zoomToFit)
            return vis
        }
        function createLabels(svg, graph, node, d3cola, margin) {
            let labelwidth = 0, labelheight = 0
            let labels = svg.selectAll(".flowlabel")
                .data(graph.nodes)
                .enter().append("text")
                .attr("class", "flowlabel")
                .text(function (d) { return d.name })
                .call(d3cola.drag)
                .each(function (d) {
                    let bb = this.getBBox()
                    labelwidth = Math.max(labelwidth, bb.width)
                    labelheight = Math.max(labelheight, bb.height)
                })
            node.attr("width", labelwidth)
                .each(function (d) {
                    d.width = labelwidth + 2 * margin + 10
                    d.height = labelheight + 2 * margin
                })
            node.append("title")
                .text(function (d) { return d.name })
            return labels
        }
        function flatGraph() {
            let d3cola = webcola.d3adaptor()
                .linkDistance(80)
                .avoidOverlaps(true)
                .size([width, height])
            let svg = makeSVG()
            d3.json(graphfile, function (error, graph) {
                let link = svg.selectAll(".link")
                    .data(graph.links)
                    .enter().append("line")
                    .attr("class", "link")
                let margin = 10
                let node = svg.selectAll(".node")
                    .data(graph.nodes)
                    .enter().append("rect")
                    .attr("class", "node")
                    .attr("rx", 4).attr("ry", 4)
                let label = createLabels(svg, graph, node, d3cola, margin)
                d3cola
                    .convergenceThreshold(0.1)
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .start(10, 10, 10)
                d3cola.on("tick", function () {
                    node.each(function (d) { return d.innerBounds = d.bounds.inflate(-margin) })
                    link.each(function (d) {
                        d.route = webcola.vpsc.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5)
                        if (isIE())
                            this.parentNode.insertBefore(this, this)
                    })
                    link.attr("x1", function (d) { return d.route.sourceIntersection.x })
                        .attr("y1", function (d) { return d.route.sourceIntersection.y })
                        .attr("x2", function (d) { return d.route.arrowStart.x })
                        .attr("y2", function (d) { return d.route.arrowStart.y })
                    node.attr("x", function (d) { return d.innerBounds.x })
                        .attr("y", function (d) { return d.innerBounds.y })
                        .attr("width", function (d) { return d.innerBounds.width() })
                        .attr("height", function (d) { return d.innerBounds.height() })
                    let b
                    label
                        .each(function (d) {
                            b = this.getBBox()
                        })
                        .attr("x", function (d) { return d.x })
                        .attr("y", function (d) {
                            return d.y + b.height / 3
                        })
                    // svg.zoomToFit()
                }).on("end", function () { svg.zoomToFit() })
            })
        }
        function expandGroup(g, ms) {
            if (g.groups) {
                g.groups.forEach(function (cg) { return expandGroup(cg, ms) })
            }
            if (g.leaves) {
                g.leaves.forEach(function (l) {
                    ms.push(l.index + 1)
                })
            }
        }
        function getId(v, n) {
            return (typeof v.index === "number" ? v.index : v.id + n) + 1
        }
        function powerGraph() {
            let d3cola = webcola.d3adaptor()
                .convergenceThreshold(0.01)
                .linkDistance(80)
                .handleDisconnected(false)
                .avoidOverlaps(true)
                .size([width, height])
            let svg = makeSVG()
            d3.json(graphfile, function (error, graph) {
                graph.nodes.forEach(function (v, i) {
                    v.index = i
                })
                let powerGraph
                let doLayout = function (response) {
                    let group = svg.selectAll(".group")
                        .data(powerGraph.groups)
                        .enter().append("rect")
                        .attr("rx", 8).attr("ry", 8)
                        .attr("class", "group")
                        .style("fill", function (d, i) { return color(i) })
                    let link = svg.selectAll(".link")
                        .data(powerGraph.powerEdges)
                        .enter().append("line")
                        .attr("class", "link")
                    let margin = 10
                    let node = svg.selectAll(".node")
                        .data(graph.nodes)
                        .enter().append("rect")
                        .attr("class", "node")
                        .attr("width", function (d) { return d.width + 2 * margin })
                        .attr("height", function (d) { return d.height + 2 * margin })
                        .attr("rx", 4).attr("ry", 4)
                    let label = createLabels(svg, graph, node, d3cola, margin)
                    let vs = response.nodes.filter(function (v) { return v.label })
                    vs.forEach(function (v) {
                        let index = Number(v.label) - 1
                        let node = graph.nodes[index]
                        node.x = Number(v.x) * node.width / 80 + 50
                        node.y = Number(v.y) / 1.2 + 50
                        node.fixed = 1
                    })
                    d3cola.start(1, 1, 1)
                    d3cola.on("tick", function () {
                        node.each(function (d) {
                            d.bounds.setXCentre(d.x)
                            d.bounds.setYCentre(d.y)
                            d.innerBounds = d.bounds.inflate(-margin)
                        })
                        group.each(function (d) { return d.innerBounds = d.bounds.inflate(-margin) })
                        link.each(function (d) {
                            d.route = webcola.vpsc.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5)
                            if (isIE())
                                this.parentNode.insertBefore(this, this)
                        })
                        link.attr("x1", function (d) { return d.route.sourceIntersection.x })
                            .attr("y1", function (d) { return d.route.sourceIntersection.y })
                            .attr("x2", function (d) { return d.route.arrowStart.x })
                            .attr("y2", function (d) { return d.route.arrowStart.y })
                        node.attr("x", function (d) { return d.innerBounds.x })
                            .attr("y", function (d) { return d.innerBounds.y })
                            .attr("width", function (d) { return d.innerBounds.width() })
                            .attr("height", function (d) { return d.innerBounds.height() })
                        group.attr("x", function (d) { return d.innerBounds.x })
                            .attr("y", function (d) { return d.innerBounds.y })
                            .attr("width", function (d) { return d.innerBounds.width() })
                            .attr("height", function (d) { return d.innerBounds.height() })
                        label.attr("x", function (d) { return d.x })
                            .attr("y", function (d) {
                                let h = this.getBBox().height
                                return d.y + h / 3.5
                            })
                    }).on("end", function () {
                        return svg.zoomToFit()
                    })
                }
                d3cola
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .powerGraphGroups(function (d) { return (powerGraph = d).groups.forEach(function (v) { return v.padding = 10 }) })
                let modules = { N: graph.nodes.length, ms: [], edges: [] }
                let n = modules.N
                powerGraph.groups.forEach(function (g) {
                    let m = []
                    expandGroup(g, m)
                    modules.ms.push(m)
                })
                powerGraph.powerEdges.forEach(function (e) {
                    let N = graph.nodes.length
                    modules.edges.push({ source: getId(e.source, N), target: getId(e.target, N) })
                })
                if (document.URL.toLowerCase().indexOf("marvl.infotech.monash.edu") >= 0) {
                    $.ajax({
                        type: "post",
                        url: "http://marvl.infotech.monash.edu/cgi-bin/test.py",
                        data: JSON.stringify(modules),
                        datatype: "json",
                        success: function (response) {
                            doLayout(response)
                        },
                        error: function (jqXHR, status, err) {
                            alert(status)
                        }
                    })
                }
                else {
                    d3.json(graphfile.replace(/.json/, "pgresponse.json"), function (error, response) {
                        doLayout(response)
                    })
                }
            })
        }
        function isIE() { return ((navigator.appName === "Microsoft Internet Explorer") || ((navigator.appName === "Netscape") && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null))) }
        flatGraph()
        d3.select("#GridButton").on("click", powerGraph)
        d3.select("#filemenu").on("change", function () {
            d3.selectAll("svg").remove()
            graphfile = this.value
            flatGraph()
        })
        function powerGraph2() {
            let d3cola = webcola.d3adaptor()
                .jaccardLinkLengths(10, 0.5)
                .avoidOverlaps(true)
                .size([width, height])
            let svg = makeSVG()
            d3.json("assets/javascripts/analyse/powergraph.json", function (error, graph) {
                let powerGraph
                d3cola
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .powerGraphGroups(function (d) {
                        powerGraph = d
                        powerGraph.groups.forEach(function (v) { v.padding = 20 })
                    })
                    .start(10, 10, 10)
                let group = svg.selectAll(".group")
                    .data(powerGraph.groups)
                    .enter().append("rect")
                    .attr("rx", 8).attr("ry", 8)
                    .attr("class", "group")
                    .style("fill", function (d, i) { return color(i) })
                let link = svg.selectAll(".link")
                    .data(powerGraph.powerEdges)
                    .enter().append("line")
                    .attr("class", "link")
                let margin = 10
                let node = svg.selectAll(".node")
                    .data(graph.nodes)
                    .enter().append("rect")
                    .attr("class", "node")
                    .attr("width", function (d) { return d.width + 2 * margin })
                    .attr("height", function (d) { return d.height + 2 * margin })
                    .attr("rx", 4).attr("ry", 4)
                let label = svg.selectAll(".label")
                    .data(graph.nodes)
                    .enter().append("text")
                    .attr("class", "label")
                    .text(function (d) { return d.name })
                node.append("title")
                    .text(function (d) { return d.name })
                d3cola.on("tick", function () {
                    node.each(function (d) { d.innerBounds = d.bounds.inflate(-margin) })
                    group.each(function (d) { d.innerBounds = d.bounds.inflate(-margin) })
                    link.each(function (d) {
                        d.route = webcola.vpsc.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5)
                        if (isIE())
                            this.parentNode.insertBefore(this, this)
                    })
                    link.attr("x1", function (d) { return d.route.sourceIntersection.x })
                        .attr("y1", function (d) { return d.route.sourceIntersection.y })
                        .attr("x2", function (d) { return d.route.arrowStart.x })
                        .attr("y2", function (d) { return d.route.arrowStart.y })
                    node.attr("x", function (d) { return d.innerBounds.x })
                        .attr("y", function (d) { return d.innerBounds.y })
                        .attr("width", function (d) { return d.innerBounds.width() })
                        .attr("height", function (d) { return d.innerBounds.height() })
                    group.attr("x", function (d) { return d.innerBounds.x })
                        .attr("y", function (d) { return d.innerBounds.y })
                        .attr("width", function (d) { return d.innerBounds.width() })
                        .attr("height", function (d) { return d.innerBounds.height() })
                    label.attr("x", function (d) { return d.x })
                        .attr("y", function (d) {
                            let h = this.getBBox().height
                            return d.y + h / 3.5
                        })
                })
            })
        }
        powerGraph2()
    }
}