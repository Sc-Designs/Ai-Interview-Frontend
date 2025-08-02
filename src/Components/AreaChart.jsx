import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useRef, useEffect, useState } from "react";
import SelectBox from "./SelectBox";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AreaChart = () => {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState({ users: null, orgs: null });

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const ctx = chart.ctx;

    const gradientUsers = ctx.createLinearGradient(0, 0, 0, 400);
    gradientUsers.addColorStop(0, "rgba(0, 0, 255, 0.5)");
    gradientUsers.addColorStop(0.6, "rgba(0, 0, 255, 0)");

    const gradientOrgs = ctx.createLinearGradient(0, 0, 0, 400);
    gradientOrgs.addColorStop(0, "rgba(0, 255, 0, 0.5)");
    gradientOrgs.addColorStop(0.6, "rgba(0, 255, 0, 0)");

    setGradient({ users: gradientUsers, orgs: gradientOrgs });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
        },
      },
      title: {
        display: true,
        text: "Users and Organizations Analytics",
        color: "#00fbdea4",
        font: {
          size: 18,
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutCubic",
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255,255,255,0.5)",
          minRotation: 45,
          maxRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };


  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Users",
        data: Array.from(
          { length: 12 },
          () => Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000
        ),
        borderColor: "blue",
        backgroundColor: gradient.users,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Organizations",
        data: Array.from(
          { length: 12 },
          () => Math.floor(Math.random() * (70500 - 1000 + 1)) + 1000
        ),
        borderColor: "green",
        backgroundColor: gradient.orgs,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return (
    <>
    <div className="w-full h-full p-2 relative shadow-[0px_0px_10px_4px_rgba(255,255,255,0.15)] border-1 border-zinc-700 bg-zinc-900/80 rounded-2xl">
      <div className="absolute top-1 right-5">
      <SelectBox option={["Weekly","Monthly","Yearly"]} />
      </div>
      <Line ref={chartRef} options={options} data={data} />
    </div>
    </>
  );
};

export default AreaChart;
