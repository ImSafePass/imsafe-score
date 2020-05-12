import React, { useRef, useEffect } from "react";
import Chart from "chart.js";

const ResultsChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      const canvas = (canvasRef.current as unknown) as HTMLCanvasElement;
      const c = canvas.getContext("2d");
      if (c) {
        new Chart(c, {
          type: "horizontalBar",
          data: {
            //Bring in data
            // labels: ["Before Test", "After Test"],
            datasets: [
              {
                label: "whatever",
                data: [1, 100],
                backgroundColor: "rgba(255, 0, 0)",
              },
              {
                label: "Before Test",
                data: [78, 92],
                backgroundColor: ["#3341c0", "#7b8484"],
              },
              {
                data: [0, 100],
                backgroundColor: ["rgba(255, 0, 0)"],
              },
              {
                label: "After Test",
                data: [92, 100],
                backgroundColor: ["rgba(0, 0, 0, 0.2)"],
              },
            ],
          },
          options: {
            //Customize chart options
          },
        });
      }
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ResultsChart;
