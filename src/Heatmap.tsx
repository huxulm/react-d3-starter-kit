import React, { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleSequential } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateInferno } from "d3-scale-chromatic";
import { group } from "d3-array";
import { csv } from "d3-fetch";
import "d3-transition";
import "./Heatmap.css";

export default function () {
  const d3container = useRef<HTMLDivElement>(null);
  const d3svg = useRef<SVGSVGElement>(null);
  const [margin, setMargin] = useState({
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  });

  const [dimensions, setDimensions] = useState({
    width: 600 - margin.left - margin.right,
    height: 450 - margin.top - margin.bottom,
  });
  const { width, height } = dimensions;
  useEffect(() => {
    // setDimensions((dimensions) => ({
    //   ...dimensions,
    //   width: window.innerWidth - margin.top - margin.bottom,
    //   height: window.innerHeight - margin.top - margin.bottom,
    // }));
  }, []);

  useEffect(() => {
    if (!d3container) {
      return;
    }
    let svg = select(d3svg.current);
    svg.selectAll("g").remove();
    svg
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //Read the data
    csv("http://localhost:3000/csv/heatmap_data.csv").then((data: any) => {
      // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
      var myGroups = group<any, any>(data, function (d) {
        return d.group;
      }).keys();
      var myVars = group<any, any>(data, function (d) {
        return d.variable;
      }).keys();
      svg.selectAll("g").remove();

      // Build X scales and axis:
      var x = scaleBand().range([25, width]).domain(myGroups).padding(0.02);
      svg
        .append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("color", "white")
        .call(axisBottom(x).tickSize(0))
        .select(".domain")
        .remove();

      // Build Y scales and axis:
      var y = scaleBand()
        .range([height - margin.bottom, 0])
        .domain(myVars)
        .padding(0.02);
      svg
        .append("g")
        .attr("transform", `translate(25, 0)`)
        .attr("color", "white")
        .style("font-size", 15)
        .call(axisLeft(y).tickSize(0))
        .select(".domain")
        .remove();

      // Build color scale
      var myColor = scaleSequential()
        .interpolator(interpolateInferno)
        .domain([1, 100]);

      // create a tooltip
      var tooltip = svg
        .append("g")
        .attr("id", "tooltip")
        .style("visibility", "hide");

      // tooltip background
      var tooltip_bg = tooltip
        .append("rect")
        .style("opacity", 0)
        .attr("width", 28)
        .attr("height", 28)
        .attr("y", 0)
        .attr("x", 25)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", `rgba(255, 255, 255, .5)`);

      var tooltip_txt = tooltip
        .append("text")
        .style("color", "black")
        .style("font-weight", 900)
        .attr("stroke", "none")
        .attr("x", 28)
        .attr("y", 20);

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = (e: any, d: any) => {
        tooltip
          .style("visibility", "visible")
          .attr("transform", `translate(${x(d.group)},${y(d.variable)})`);
        tooltip_txt.style("opacity", 1);
        tooltip_bg.style("opacity", 1);
        tooltip_txt.text(d.value);
        select(e.currentTarget).attr("stroke-width", 1).attr("stroke", "white");
      };
      var mouseleave = function (e: any, d: any) {
        tooltip.style("visibility", "hide");
        tooltip_txt.attr("opacity", 0);
        select(e.currentTarget).attr("stroke", "none");
      };

      const t = svg.transition().duration(2000);

      // add the squares
      svg
        .append("g")
        .attr("pointer-events", "all")
        .selectAll("rect")
        .data<any[]>(data)
        .join((enter) =>
          enter
            .append("rect")
            .attr("x", (d: any, i) => {
              return x(d.group);
            })
            .attr("y", function (d: any) {
              return y(d.variable);
            })
            .attr("rx", 0)
            .attr("ry", 0)
            .attr("width", 0)
            .attr("height", 0)
            .style("fill", function (d: any) {
              return myColor(d.value);
            })
            .style("stroke-width", 4)
            // .style("stroke", "none")
            .style("opacity", 0.8)
            .call((g) =>
              g
                .transition(t)
                .duration(1000)
                .delay((d: any, i) => x(d.group) + (i + 1) * 5)
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
            )
        )
        .on("mouseover", mouseover)
        .on("mouseout", mouseleave);
      svg.on("mouseout", mouseleave);

      svg.append("use").attr("xlink:href", "#tooltip");
    });
  }, [dimensions]);
  return (
    <div className="container" ref={d3container}>
      <svg ref={d3svg}></svg>
    </div>
  );
}
