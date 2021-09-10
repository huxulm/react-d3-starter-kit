import { withScreenSize } from "@visx/responsive";
import React from "react";
import GeoDemo from "src/components/demo/GeoDemo";
import ZoomDemo from "./components/demo/ZoomDemo";
import GeoChina from "./components/demo/GeoChina";
import "./App.css";
import GeoNigiaState from "./components/demo/GeoNigiaState";
import GeoUrumq from "./components/demo/GeoUrumq";
const Demos = [
  {
    name: "Geo Urumq",
    Component: GeoUrumq,
  },
  {
    name: "Geo China",
    Component: GeoChina,
  },
  {
    name: "Nigia state",
    Component: GeoNigiaState,
  },
  {
    name: "Geo demo",
    Component: GeoDemo,
  },
  {
    name: "Zoom demo",
    Component: ZoomDemo,
  },
];
function App() {
  return (
    <div className="App">
      <div className="demo-container">
        {Demos.map(({ Component }) => (
          <div className="box">
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
