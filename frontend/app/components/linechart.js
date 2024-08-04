"use client";
import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function LineChart({ projects = [] }) {
  const chartRef = useRef(null);

  const getLast7Months = () => {
    const months = [];
    for (let i = 6; i >= 0; i--) {
      months.push(dayjs().subtract(i, "month").format("MMM"));
    }
    return months;
  };

  const countProjectsByMonth = (projects) => {
    const monthCounts = Array(7).fill(0);
    const now = dayjs().utc().startOf("month");

    projects.forEach((project) => {
      const createdAt = dayjs(project.createdAt).utc().startOf("month");
      const diffInMonths = now.diff(createdAt, "month");

      if (diffInMonths >= 0 && diffInMonths < 7) {
        monthCounts[6 - diffInMonths]++;
      }
    });

    return monthCounts;
  };

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");
      const labels = getLast7Months();
      const data = countProjectsByMonth(projects);

      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Projects",
              data: data,
              backgroundColor: "rgba(147, 51, 234, 0.5)",
              borderColor: "rgba(147, 51, 234, 1)",
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
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
  }, [projects]);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}
