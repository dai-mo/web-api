/**
 * Created by cmathew on 29/07/16.
 */

import {Injectable} from "@angular/core"

import {FlowGraph, FlowNode} from "../flow.model"

import d3 from "d3"

declare let cola: any

@Injectable()
export class FlowGraphService {



  addFlatGraph(el:HTMLElement, graph: FlowGraph) {

    let width = 500
    let height = 500

    // Used for generating id attributes e.g. marker entities
    let id = Math.random().toString()

    let select = d3.select(el)


    function makeSVG(id: string) {

      let outer = select.append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("pointer-events", "all")
        .attr("class", "flex-panel")


      // define arrow markers for graph links
      outer.append("defs").append("marker")
        .attr("id", "end-arrow-" + id)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("markerWidth", 3)
        .attr("markerHeight", 3)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("stroke-width", "2px")
        .attr("fill", "#555")
      let zoomBox = outer.append("rect")
        .attr("class", "background")
        .attr("width", "100%")
        .attr("height", "100%")
      let vis:any = outer.append("g")
      let redraw = function (transition:any) {
        return (transition ? vis.transition() : vis)
        // FIXME: zooming currently produces the error - Error: <g> attribute transform: Expected number, "translate(NaN,NaN) scale(N…".
        //  .attr("transform", "translate(" + zoom.translate() + ") scale(" + zoom.scale() + ")")
      }
      vis.zoomToFit = function () {
        let b = cola.vpsc.Rectangle.empty()
        vis.selectAll("rect").each(function (d:any) {
          let bb = this.getBoundingClientRect()
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


    function flatGraph(graph: FlowGraph, id: string) {

      let d3cola = cola.d3adaptor()
        .linkDistance(80)
        .avoidOverlaps(true)
        .size([width, height])
      let svg = makeSVG(id)


      let link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
      let margin = 10

      let tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("display", "none")
        .attr("class", "d3-tip")

      let node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("rect")
        .attr("class", "node")
        .attr("rx", 4).attr("ry", 4)
        .on("mouseenter", function(d:any) {
          let event = d3.event as DragEvent
          return tooltip
            .style("visibility", "visible")
            .style("display", "block")
            .style("top", (event.pageY-50)+"px").style("left",(event.pageX+40)+"px")
            .html("<span style='color:grey'>id:</span> <strong>" + d.id + "</strong>")
        })
        .on("mousedown", function() {
          return tooltip.style("visibility", "hidden").style("display", "none")
        })
        .on("mouseleave", function() {
          return tooltip.style("visibility", "hidden").style("display", "none")
        })
        .call(d3cola.drag)


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
        link.attr("marker-end", "url(#end-arrow-" + id +  ")")
          .attr("x1", function (d:any) { return d.route.sourceIntersection.x })
          .attr("y1", function (d:any) { return d.route.sourceIntersection.y })
          .attr("x2", function (d:any) { return d.route.arrowStart.x })
          .attr("y2", function (d:any) { return d.route.arrowStart.y })
        let nodewidth = 30, nodeheight = 30
        node.attr("x", function (d:any) { return d.innerBounds.x })
          .attr("y", function (d:any) { return d.innerBounds.y })
          .attr("width", nodewidth)
          .attr("height", nodeheight)

      }).on("end", function () { svg.zoomToFit() })

    }
    function isIE() { return ((navigator.appName === "Microsoft Internet Explorer") || ((navigator.appName === "Netscape") && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null))) }
    flatGraph(graph, id)
  }
}