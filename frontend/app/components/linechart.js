"use client";
import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

export default function LineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "Projects",
              data: [34, 64, 23, 45, 67, 24, 64],
              backgroundColor: ["rgba(147, 51, 234, 1)"],
              borderColor: ["rgba(147, 51, 234, 1)"],
              borderWidth: 2,
              tension: 0.3,
            },
          ],
          borderColor: "rgba(255, 99, 132, 1)", // Red line
          backgroundColor: "rgba(255, 99, 132, 0.5)", // Semi-transparent red fill
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          layout: {
            // padding: 40,
          },
          scales: {
            x: {
              type: "category",
              offset: true,
              grid: {
                offset: true,
                display: false,
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      chartRef.current.chart = newChart;
    }
  }, []);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}
