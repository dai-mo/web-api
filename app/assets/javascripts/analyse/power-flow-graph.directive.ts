///<reference path="../../../../typings/globals/webcola/index.d.ts"/>

import {ElementRef, Directive} from "@angular/core"

declare let $: any
declare let cola: any


@Directive({
    selector: "[power-flow-graph]",
})

export class PowerFlowGraphDirective {

  private el:HTMLElement

  private graph = {
    "nodes":[
      {"name":"0","width":50,"height":50},
      {"name":"1","width":50,"height":50},
      {"name":"2","width":50,"height":50},
      {"name":"3","width":50,"height":50},
      {"name":"4","width":50,"height":50},
      {"name":"5","width":50,"height":50},
      {"name":"6","width":50,"height":50}
    ],
    "links":[
      {"source":0,"target":1},
      {"source":1,"target":2},
      {"source":1,"target":3},
      {"source":2,"target":4},
      {"source":3,"target":4},
      {"source":4,"target":5},
      {"source":4,"target":6}
    ]
  }

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
            let vis:any = outer.append("g")
            let redraw = function (transition:any) {
                return (transition ? vis.transition() : vis)
                    .attr("transform", "translate(" + zoom.translate() + ") scale(" + zoom.scale() + ")")
            }
            vis.zoomToFit = function () {
                let b = cola.vpsc.Rectangle.empty()
                vis.selectAll("rect").each(function (d:any) {
                    let bb = this.getBBox()
                    b = b.union(new cola.vpsc.Rectangle(bb.x, bb.x + bb.width, bb.y, bb.y + bb.height))
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
        function createLabels(svg:any, graph:any, node:any, d3cola:any, margin:any) {
            let labelwidth = 20, labelheight = 25
            let labels = svg.selectAll(".flowlabel")
                .data(graph.nodes)
                .enter().append("text")
                .attr("class", "flowlabel")
                .text(function (d:any) { return d.name })
                .call(d3cola.drag)

            node.attr("width", labelwidth)
                .each(function (d:any) {
                    d.width = labelwidth + 2 * margin + 10
                    d.height = labelheight + 2 * margin
                })
            node.append("title")
                .text(function (d:any) { return d.name })
            return labels
        }
        function flatGraph(graph: any) {
            let d3cola = cola.d3adaptor()
                .linkDistance(80)
                .avoidOverlaps(true)
                .size([width, height])
            let svg = makeSVG()
            // d3.json(graphfile, function (error, graph) {
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
                    node.each(function (d:any) { return d.innerBounds = d.bounds.inflate(-margin) })
                    link.each(function (d:any) {
                        d.route = cola.vpsc.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5)
                        if (isIE())
                            this.parentNode.insertBefore(this, this)
                    })
                    link.attr("x1", function (d:any) { return d.route.sourceIntersection.x })
                        .attr("y1", function (d:any) { return d.route.sourceIntersection.y })
                        .attr("x2", function (d:any) { return d.route.arrowStart.x })
                        .attr("y2", function (d:any) { return d.route.arrowStart.y })
                    node.attr("x", function (d:any) { return d.innerBounds.x })
                        .attr("y", function (d:any) { return d.innerBounds.y })
                        .attr("width", function (d:any) { return d.innerBounds.width() })
                        .attr("height", function (d:any) { return d.innerBounds.height() })
                    let b:any
                    label
                        .each(function (d:any) {
                            b = this.getBBox()
                        })
                        .attr("x", function (d:any) { return d.x })
                        .attr("y", function (d:any) {
                            return d.y + b.height / 3
                        })
                    // svg.zoomToFit()
                }).on("end", function () { svg.zoomToFit() })
            // })
        }
        function expandGroup(g:any, ms:any) {
            if (g.groups) {
                g.groups.forEach(function (cg:any) { return expandGroup(cg, ms) })
            }
            if (g.leaves) {
                g.leaves.forEach(function (l:any) {
                    ms.push(l.index + 1)
                })
            }
        }
        function getId(v:any, n: any) {
            return (typeof v.index === "number" ? v.index : v.id + n) + 1
        }
        function powerGraph() {
            let d3cola = cola.d3adaptor()
                .convergenceThreshold(0.01)
                .linkDistance(80)
                .handleDisconnected(false)
                .avoidOverlaps(true)
                .size([width, height])
            let svg = makeSVG()
            d3.json(graphfile, function (error, graph) {
                graph.nodes.forEach(function (v:any, i:any) {
                    v.index = i
                })
                let powerGraph:any
                let doLayout = function (response:any) {
                    let group = svg.selectAll(".group")
                        .data(powerGraph.groups)
                        .enter().append("rect")
                        .attr("rx", 8).attr("ry", 8)
                        .attr("class", "group")
                        .style("fill", function (d:any, i:any) { return color(i) })
                    let link = svg.selectAll(".link")
                        .data(powerGraph.powerEdges)
                        .enter().append("line")
                        .attr("class", "link")
                    let margin = 10
                    let node = svg.selectAll(".node")
                        .data(graph.nodes)
                        .enter().append("rect")
                        .attr("class", "node")
                        .attr("width", function (d:any) { return d.width + 2 * margin })
                        .attr("height", function (d:any) { return d.height + 2 * margin })
                        .attr("rx", 4).attr("ry", 4)
                    let label = createLabels(svg, graph, node, d3cola, margin)
                    let vs = response.nodes.filter(function (v:any) { return v.label })
                    vs.forEach(function (v:any) {
                        let index = Number(v.label) - 1
                        let node = graph.nodes[index]
                        node.x = Number(v.x) * node.width / 80 + 50
                        node.y = Number(v.y) / 1.2 + 50
                        node.fixed = 1
                    })
                    d3cola.start(1, 1, 1)
                    d3cola.on("tick", function () {
                        node.each(function (d:any) {
                            d.bounds.setXCentre(d.x)
                            d.bounds.setYCentre(d.y)
                            d.innerBounds = d.bounds.inflate(-margin)
                        })
                        group.each(function (d:any) { return d.innerBounds = d.bounds.inflate(-margin) })
                        link.each(function (d:any) {
                            d.route = cola.vpsc.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5)
                            if (isIE())
                                this.parentNode.insertBefore(this, this)
                        })
                        link.attr("x1", function (d:any) { return d.route.sourceIntersection.x })
                            .attr("y1", function (d:any) { return d.route.sourceIntersection.y })
                            .attr("x2", function (d:any) { return d.route.arrowStart.x })
                            .attr("y2", function (d:any) { return d.route.arrowStart.y })
                        node.attr("x", function (d:any) { return d.innerBounds.x })
                            .attr("y", function (d:any) { return d.innerBounds.y })
                            .attr("width", function (d:any) { return d.innerBounds.width() })
                            .attr("height", function (d:any) { return d.innerBounds.height() })
                        group.attr("x", function (d:any) { return d.innerBounds.x })
                            .attr("y", function (d:any) { return d.innerBounds.y })
                            .attr("width", function (d:any) { return d.innerBounds.width() })
                            .attr("height", function (d:any) { return d.innerBounds.height() })
                        label.attr("x", function (d:any) { return d.x })
                            .attr("y", function (d:any) {
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
                    .powerGraphGroups(function (d:any) {
                        return (powerGraph = d).groups.forEach(function (v:any) { return v.padding = 10 })
                    })
                let modules = { N: graph.nodes.length, ms: <any>[], edges: <any>[] }
                let n = modules.N
                powerGraph.groups.forEach(function (g:any) {
                    let m = <any>[]
                    expandGroup(g, m)
                    modules.ms.push(m)
                })
                powerGraph.powerEdges.forEach(function (e:any) {
                    let N = graph.nodes.length
                    modules.edges.push({ source: getId(e.source, N), target: getId(e.target, N) })
                })
                if (document.URL.toLowerCase().indexOf("marvl.infotech.monash.edu") >= 0) {
                    $.ajax({
                        type: "post",
                        url: "http://marvl.infotech.monash.edu/cgi-bin/test.py",
                        data: JSON.stringify(modules),
                        datatype: "json",
                        success: function (response:any) {
                            doLayout(response)
                        },
                        error: function (jqXHR:any, status: any, err: any) {
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
        flatGraph(this.graph)
        // d3.select("#GridButton").on("click", powerGraph)
        // d3.select("#filemenu").on("change", function () {
        //     d3.selectAll("svg").remove()
        //     graphfile = this.value
        //     flatGraph()
        // })
        function powerGraph2() {
            let d3cola = cola.d3adaptor()
                .jaccardLinkLengths(10, 0.5)
                .avoidOverlaps(true)
                .size([width, height])
            let svg = makeSVG()
            d3.json("assets/javascripts/analyse/powergraph.json", function (error, graph) {
                let powerGraph:any
                d3cola
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .powerGraphGroups(function (d:any) {
                        powerGraph = d
                        powerGraph.groups.forEach(function (v:any) { v.padding = 20 })
                    })
                    .start(10, 10, 10)
                let group = svg.selectAll(".group")
                    .data(powerGraph.groups)
                    .enter().append("rect")
                    .attr("rx", 8).attr("ry", 8)
                    .attr("class", "group")
                    .style("fill", function (d:any, i:any) { return color(i) })
                let link = svg.selectAll(".link")
                    .data(powerGraph.powerEdges)
                    .enter().append("line")
                    .attr("class", "link")
                let margin = 10
                let node = svg.selectAll(".node")
                    .data(graph.nodes)
                    .enter().append("rect")
                    .attr("class", "node")
                    .attr("width", function (d:any) { return d.width + 2 * margin })
                    .attr("height", function (d:any) { return d.height + 2 * margin })
                    .attr("rx", 4).attr("ry", 4)
                let label = svg.selectAll(".label")
                    .data(graph.nodes)
                    .enter().append("text")
                    .attr("class", "label")
                    .text(function (d:any) { return d.name })
                node.append("title")
                    .text(function (d:any) { return d.name })
                d3cola.on("tick", function () {
                    node.each(function (d:any) { d.innerBounds = d.bounds.inflate(-margin) })
                    group.each(function (d:any) { d.innerBounds = d.bounds.inflate(-margin) })
                    link.each(function (d:any) {
                        d.route = cola.vpsc.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5)
                        if (isIE())
                            this.parentNode.insertBefore(this, this)
                    })
                    link.attr("x1", function (d:any) { return d.route.sourceIntersection.x })
                        .attr("y1", function (d:any) { return d.route.sourceIntersection.y })
                        .attr("x2", function (d:any) { return d.route.arrowStart.x })
                        .attr("y2", function (d:any) { return d.route.arrowStart.y })
                    node.attr("x", function (d:any) { return d.innerBounds.x })
                        .attr("y", function (d:any) { return d.innerBounds.y })
                        .attr("width", function (d:any) { return d.innerBounds.width() })
                        .attr("height", function (d:any) { return d.innerBounds.height() })
                    group.attr("x", function (d:any) { return d.innerBounds.x })
                        .attr("y", function (d:any) { return d.innerBounds.y })
                        .attr("width", function (d:any) { return d.innerBounds.width() })
                        .attr("height", function (d:any) { return d.innerBounds.height() })
                    label.attr("x", function (d:any) { return d.x })
                        .attr("y", function (d:any) {
                            let h = this.getBBox().height
                            return d.y + h / 3.5
                        })
                })
            })
        }
        // powerGraph2()
    }
}