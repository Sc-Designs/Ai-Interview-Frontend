import { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import adminAxios from "../Config/adminAxios";
import SelectBox from "./SelectBox";
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
import { useDispatch } from "react-redux";
import { loadUserandOrgCount } from "../Store/Reducers/AdminReducer";

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
  const dispatch = useDispatch();
  const [selectedTime, setSelectedTime] = useState("Weekly");
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState({ users: null, orgs: null });
  const [stats, setStats] = useState({
    labels: [],
    userData: [],
    orgData: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAxios.get(`/admin/stats?filter=${selectedTime}`);
        setStats(res.data);
        dispatch(
          loadUserandOrgCount({
            UserCount: res.data.userCount,
            OrgCount: res.data.orgCount,
          })
        );
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    fetchStats();
  }, [selectedTime]);

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

  const data = {
    labels: stats.labels,
    datasets: [
      {
        label: "Users",
        data: stats.userData,
        borderColor: "blue",
        backgroundColor: gradient.users,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Organizations",
        data: stats.orgData,
        borderColor: "green",
        backgroundColor: gradient.orgs,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#fff" },
      },
      title: {
        display: true,
        text: "Users and Organizations Analytics",
        color: "#00fbdea4",
        font: { size: 18 },
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
        grid: { color: "rgba(255, 255, 255, 0.09)" },
        ticks: {
          color: "rgba(255,255,255,0.5)",
          minRotation: 45,
          maxRotation: 45,
        },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.09)" },
        ticks: { color: "#fff" },
      },
    },
  };

  return (
    <div className="w-full h-full p-2 pt-4 relative shadow-[0px_0px_10px_4px_rgba(255,255,255,0.15)] border-1 border-zinc-700 bg-zinc-900/80 rounded-2xl">
      <div className="absolute top-1 left-2">
        <SelectBox
          option={["Weekly", "Monthly", "Yearly"]}
          selected={selectedTime}
          setSelected={setSelectedTime}
        />
      </div>
      <Line ref={chartRef} options={options} data={data} />
    </div>
  );
};

export default AreaChart;
