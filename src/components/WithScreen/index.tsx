import React, { useEffect, useState } from "react";

export default function (
  Component: React.VoidFunctionComponent<{ screenWidth: number; screenHeight }>
): React.FunctionComponent<{}> {
  return function (props: any) {
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [screenHeight, setScreenHeight] = useState<number>(0);
    useEffect(() => {
      setScreenHeight(window.screen.availHeight);
      setScreenWidth(window.screen.availWidth);
    }, []);
    return (
      <Component
        screenHeight={screenHeight}
        screenWidth={screenWidth}
        {...props}
      />
    );
  };
}
