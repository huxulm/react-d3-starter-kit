import { withParentSize } from "@visx/responsive";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { useEffect } from "react";
import chinageojson from "src/china-geojson/china.json";

export default withParentSize(function (props) {
  const style: (width, height) => React.CSSProperties = (width, height) => ({
    width: `${width}px`,
    height: `${height}px`,
    // background: "rgba(177, 177, 187, .8)",
    margin: "0 auto",
  });

  var provinces = chinageojson.features.map((f) => f.properties.name);
  var colorScale = d3.scaleOrdinal(d3.schemeAccent).domain(provinces);

  const getStateColor = (d) => {
    return colorScale(d.properties.name);
  };

  useEffect(() => {
    const [w, h] = [props.parentWidth, props.parentHeight];
    var projection = d3
      .geoMercator()
    // @ts-ignore
    .fitSize([ w, h ], chinageojson);
    var path = d3.geoPath().projection(projection);
    // @ts-ignore
    var center = path.centroid(chinageojson);
    console.log("center", center);
    const svg = d3.select("#geo-demo-china");
    svg
      .attr("viewBox", `0 0 ${w} ${h}`)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "none");

    // draw map
    svg
      .append("g")
      .selectAll("path")
      .data(chinageojson.features)
      .enter()
      .append("path")
      // @ts-ignore
      .attr("d", path)
      .attr("stroke-linejoin", "round")
      .attr("fill-rule", "evenodd")
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
      <svg id="geo-demo-china"></svg>
    </div>
  );
});
