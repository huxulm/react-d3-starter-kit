import React, { useEffect, useState } from "react";
import { ExtendedFeatureCollection } from "d3";
import * as d3 from "d3";
import { WithParentSizeProvidedProps } from "@visx/responsive/lib/enhancers/withParentSize";

export default function (
  Component: React.VoidFunctionComponent<{
    adcode: any;
    geojson?: ExtendedFeatureCollection;
  } & WithParentSizeProvidedProps>,
  adcode: any
): React.FunctionComponent<{}> {
  return function (props: any) {
    const [geojson, setGeojson] = useState<ExtendedFeatureCollection>();
    useEffect(() => {
      if (adcode) {
          // areas_v3/bound/100000_full.json
        d3.json<ExtendedFeatureCollection>(
          // `http://geo.datav.local/areas_v2/bound/geojson?code=${adcode}`
          // `http://geo.datav.local/areas_v2/bound/geojson?code=${adcode}`
          `https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json`
          // `https://raw.githubusercontent.com/yezongyang/china-geojson/master/geometryProvince/${adcode}.json`
        ).then((data) => {
          setGeojson(data);
        });
      }
    }, [props.value]);
    return <Component {...props} adcode={props.adcode} geojson={geojson} />;
  };
}
