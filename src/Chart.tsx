import React, { useRef, useEffect } from "react";
import Chart from "chart.js";

const PieChart = () => {
  const totalRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (totalRef && totalRef.current) {
      const pieRef = totalRef.current.getContext("2d");
      if (pieRef) {
        new Chart(pieRef, {
          type: "pie",
          data: {
            //Bring in data
            labels: ["Negative", "Positive"],
            datasets: [
              {
                label: "Total",
                data: [75, 25],
                backgroundColor: ["#3341c0", "#7b8484"],
              },
              {
                label: "Test",
                data: [75, 25],
                backgroundColor: ["transparent", "rgba(0, 0, 0, 0.2)"],
              },
              {
                label: "Test",
                data: [75, 25],
                backgroundColor: ["rgba(0,0,0,0.2)", "transparent"],
              },
            ],
          },
          options: {
            //Customize chart options
          },
        });
      }
    }
  }, [totalRef]);

  return (
    <div>
      <canvas ref={totalRef} />
    </div>
  );
};

export default PieChart;
