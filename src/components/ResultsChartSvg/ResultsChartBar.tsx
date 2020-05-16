import React, { useState, useEffect } from "react";

import { TriplePoint } from "../../utils/bayes";

import "./index.scss";

interface Props extends TriplePoint {
  height: number;
  width: number;
  className?: string;
}

const ResultsChart = ({ height, width, low, high, mid, className }: Props) => {
  const [barWidth, setBarWidth] = useState(0);
  const [radius, setRadius] = useState(0);
  const [circleX, setCircleX] = useState(mid * width);

  useEffect(() => {
    if (high && low) {
      setBarWidth(high - low);
    }
    setRadius(height / 10);
    setCircleX(mid * width);
  }, [high, low, height, mid, width]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
    >
      <rect width={width} height={height} className="bar-bg" />
      {low && high ? (
        <rect
          x={low * width}
          style={{ width: barWidth * width }}
          height={height}
          className="bar-range"
        />
      ) : null}
      <circle
        style={{
          transform: `translate(${circleX}px, ${height / 2}px)`,
          transition: "transform 0.8s ease",
        }}
        r={radius}
      />
    </svg>
  );
};

export default ResultsChart;
