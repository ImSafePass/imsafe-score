import React from "react";
import Plot from "react-plotly.js";
import { PlotData } from "plotly.js";

const ResultsChart = () => {
  const trace1 = {
    x: [0, 75, 80, 100],
    type: "box",
    name: "Set 1",
    text: ["Text D", "Text E", "Text F", "Text G"],
  } as PlotData;

  const trace2 = {
    x: [2, 3, 3, 3, 3, 5, 6, 6, 7],
    type: "box",
    name: "Set 2",
  } as PlotData;

  return (
    <Plot
      data={[trace1, trace2]}
      layout={{ width: 600, height: 400, title: "A Fancy Plot" }}
      config={{
        displayModeBar: false,
      }}
    />
  );
};

export default ResultsChart;
