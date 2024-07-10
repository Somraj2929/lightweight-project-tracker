"use client";
import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

export default function BarChart({ projects = [] }) {
  const chartRef = useRef(null);

  const filterProjects = (status) => {
    return projects.filter((project) => project.status === status);
  };

  const openProjects = filterProjects("open");
  const inProgressProjects = filterProjects("inprogress");
  const closedProjects = filterProjects("closed");

  useEffect(() => {
    if (!chartRef.current) return;

    const context = chartRef.current.getContext("2d");

    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    const newChart = new Chart(context, {
      type: "bar",
      data: {
        labels: ["Open", "In Progress", "Closed"],
        datasets: [
          {
            barThickness: 60,
            label: "Projects",
            data: [
              openProjects.length,
              inProgressProjects.length,
              closedProjects.length,
            ],
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
  }, [projects]);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}
