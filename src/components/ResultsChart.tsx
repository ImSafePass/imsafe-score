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
          options: {
            scales: {
              yAxes: [
                {
                  stacked: true,
                },
              ],
            },
          },
          data: {
            //Bring in data
            labels: ["Before Test", "After Test"],
            datasets: [
              {
                label: "",
                data: [0],
                backgroundColor: ["rgba(255, 0, 0, 1)"],
              },
              {
                label: "",
                data: [92],
                backgroundColor: ["rgba(0, 255, 0, 1)"],
              },
              {
                label: "",
                data: [98],
                backgroundColor: ["#3341c0"],
              },
              {
                label: "",
                data: [100],
                backgroundColor: ["rgba(0, 0, 0, 0)"],
              },
            ],
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
