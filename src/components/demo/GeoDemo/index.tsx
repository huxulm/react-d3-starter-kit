import { withParentSize } from "@visx/responsive";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { useEffect } from "react";
import geojson from "./beijing.json";
import geojson1 from "./beijing_changpin.json";

export default withParentSize(function (props) {
  const style: (width, height) => React.CSSProperties = (width, height) => ({
    width: `${width}px`,
    height: `${height}px`,
    // background: "rgba(177, 177, 187, .8)",
    margin: "0 auto",
  });

  useEffect(() => {

    // Data and color scale
    // @ts-ignore
    var colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    // @ts-ignore
    .range(d3.schemeBlues[7]);

    const svg = d3.select("#geo-demo");
    svg.attr("viewBox", `0 0 ${props.parentWidth} ${props.parentHeight}`);

    var projection = d3
      .geoMercator()
      // @ts-ignore
      .fitSize([props.parentWidth, props.parentHeight], geojson)
    //   .center([0, 20])
      // .translate([props.parentWidth / 2, props.parentHeight / 2]);

    svg
      .selectAll("path")
      // @ts-ignore
      .data(geojson)
      .enter()
      .append("path")
      // @ts-ignore
      .attr("d", d3.geoPath(projection))
      // set the color of each country
      .attr("fill", function (d) {
        return colorScale(100000);
      });
  }, []);

  return (
    <div style={style(props.parentWidth, props.parentWidth)}>
      <svg id="geo-demo"></svg>
    </div>
  );
});
