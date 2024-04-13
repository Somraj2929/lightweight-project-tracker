"use client";
import { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

export default function BarChart() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("https://dummyjson.com/users");
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       const firstSix = data.users.slice(0, 6);
  //       setChartData(firstSix);
  //     } catch (error) {
  //       console.error("There was an error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      // const label = chartData.map((items) => items.firstName);
      // const data = chartData.map((items) => items.weight);

      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: ["Open", "In Progress", "Completed"],
          datasets: [
            {
              // barPercentage: 0.9,
              barThickness: 60,
              label: "Projects",
              data: [34, 94, 23],
              backgroundColor: ["#0070F0", "#F5A524", "#18C964"],
              borderColor: ["#0070F0", "#F5A524", "#18C964"],
              borderWidth: 1,
              borderRadius: 10,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: false,
              text: "Weight Name Info",
            },
            legend: {
              display: false,
            },
          },
          layout: {
            // padding: 40,
          },
          // responsive: true
          scales: {
            x: {
              type: "category",
              grid: {
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
