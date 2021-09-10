import * as d3 from "d3";
import { ZoomTransform } from "d3";
import { useEffect, useRef } from "react";
import "./ZoomDemo.css";

function random() {
  return d3.randomNormal(0, 1)();
}

export default function () {
  const data: any[][] = Array.from({ length: 800 }, () => [random(), random()]);
  const chartRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const svg = d3.select("#geo-demo-zoom");
    // @ts-ignore
    svg.attr("viewBox", [-800 / 2, -500 / 2, 800, 500]);
    svg.attr("width", "100%");
    svg.attr("height", "100%");
    svg
      .append("defs")
      .append("style")
      .text(`circle.highlighted { stroke: orangered; fill: orangered; }`);
    const g = svg.append("g");
    // x and y are scales that project the data space to the ‘unzoomed’ pixel referential
    const x = d3.scaleLinear().domain([0, 1]).range([0, 100]);
    const y = d3.scaleLinear().domain([0, 1]).range([0, 100]);
    const delaunay = d3.Delaunay.from(
      data,
      (d) => x(d[0]),
      (d) => y(d[1])
    );

    const points = g
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => {
          return x(d[0])
      })
      .attr("cy", (d) => y(d[1]));

    let transform: any;
    const zoom = d3.zoom().on("zoom", (e) => {
      g.attr("transform", (transform = e.transform));
      g.style("stroke-width", 3 / Math.sqrt(transform.k));
      points.attr("r", 3 / Math.sqrt(transform.k));
    });

    svg
      .call(zoom)
      // @ts-ignore
      .call(zoom.transform, d3.zoomIdentity)
      .on("pointermove", (event) => {
        const p = transform.invert(d3.pointer(event));
        // @ts-ignore
        const i = delaunay.find(...p);
        points.classed("highlighted", (_, j) => i === j);
        d3.select(points.nodes()[i]).raise();
      });
  }, []);
  return (
    // <div className="zoom">
      <div className="chart" ref={chartRef}>
        <svg id="geo-demo-zoom"></svg>
      </div>
    // </div>
  );
}
