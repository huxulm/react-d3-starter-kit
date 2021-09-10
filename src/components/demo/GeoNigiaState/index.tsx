import { withParentSize } from "@visx/responsive";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { useEffect } from "react";
import nigeria from "./nigeria_state_boundaries.json";

export default withParentSize(function (props) {
  const style: (width, height) => React.CSSProperties = (width, height) => ({
    width: `${width}px`,
    height: `${height}px`,
    // background: "rgba(177, 177, 187, .8)",
    margin: "0 auto",
  });

  var states = nigeria.features.map((f) => f.properties.admin1Name);

  var colorScale = d3.scaleOrdinal(d3.schemeAccent).domain(states);

  const getStateColor = (d) => {
    return colorScale(d.properties.admin1Name);
  };

  useEffect(() => {
    const [w, h] = [props.parentWidth, props.parentHeight];
    var projection = d3
      .geoMercator()
      .fitExtent(
        [
          [20, 20],
          [w - 20, h - 20],
        ],
        // @ts-ignore
        nigeria
      );

    var path = d3.geoPath().projection(projection);

    const svg = d3.select("#geo-demo1");
    svg.attr("viewBox", `0 0 ${props.parentWidth} ${props.parentHeight}`);
    svg.attr("fill", "none");

    // draw map
    svg
      .append("g")
      .selectAll("path")
      .data(nigeria.features)
      .enter()
      .append("path")
      // @ts-ignore
      .attr("d", path)
      .style("fill", getStateColor)
      .style("stroke", "black")
      .on("mouseover", function (d) {
        d3.select(this).style("fill", "white");
      })
      .on("mouseout", function () {
        d3.select(this).style("fill", getStateColor);
      });
  }, []);

  return (
    <div style={style(props.parentWidth, props.parentWidth)}>
      <svg id="geo-demo1"></svg>
    </div>
  );
});
