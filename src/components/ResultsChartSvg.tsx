import React, { useRef } from "react";

import ResultsChartBar from "./ResultsChartBar";
import { TriplePoint } from "../utils/bayes";

interface Props {
  bars: {
    label: string;
    data: TriplePoint;
  }[];
}

const ResultsChart = ({ bars }: Props) => {
  const barHeight = 50;
  const ref = useRef<HTMLDivElement>(null);
  const textPercent = 0.2;

  const width = ref?.current?.offsetWidth || 0;

  return (
    <div
      ref={ref}
      className="flex flex-col bg-white rounded-sm p-4 my-2 result-bars"
    >
      {ref?.current
        ? bars.map((bar, ind) => (
            <div
              style={{ height: barHeight }}
              className={`my-2 flex flex-row items-center justify-start`}
            >
              <div
                style={{ width: width * textPercent, height: barHeight }}
                className="flex items-center justify-end pr-2 font-bold"
                key={bar.label}
              >
                {bar.label}
              </div>
              <div key={bar.label}>
                <ResultsChartBar
                  className={`result-bar bar-${ind}`}
                  height={barHeight}
                  width={width * (1 - textPercent)}
                  {...bar.data}
                />
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default ResultsChart;
