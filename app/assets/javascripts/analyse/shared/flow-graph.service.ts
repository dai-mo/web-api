/**
 * Created by cmathew on 29/07/16.
 */

import {Injectable} from "@angular/core"

import {FlowGraph} from "../flow.model"

declare let cola: any

@Injectable()
export class FlowGraphService {



  addFlatGraph(el:HTMLElement, graph: FlowGraph) {

    let width = 300, height = 500

    let select = d3.select(el)

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
    function createLabels(svg:any, graph:FlowGraph, node:any, d3cola:any, margin:any) {
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
    function flatGraph(graph: FlowGraph) {
      let d3cola = cola.d3adaptor()
        .linkDistance(80)
        .avoidOverlaps(true)
        .size([width, height])
      let svg = makeSVG()

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

      }).on("end", function () { svg.zoomToFit() })

    }
    function isIE() { return ((navigator.appName === "Microsoft Internet Explorer") || ((navigator.appName === "Netscape") && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null))) }
    flatGraph(graph)
  }
}