import React from "react";
import AreaChart from "./AreaChart";
import SpotlightCard from "./SpotlightCard";
import { FaUserTie } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { useSelector } from "react-redux";

const StatCard = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-zinc-500 uppercase tracking-widest font-Satoshi">
        {label}
      </p>
      <p className="text-2xl font-medium text-white tracking-tight font-Satoshi">
        {value}
      </p>
    </div>
  </div>
);

const HomeGraph = () => {
  const admin = useSelector((state) => state.AdminReducer);

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden h-[55vh] lg:h-[60vh] p-4">
        <AreaChart />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          icon={<FaUserTie className="text-sky-400" size={18} />}
          label="Total users"
          value={admin?.count?.UserCount ?? 0}
          color="bg-sky-950"
        />
        <StatCard
          icon={<HiBuildingOffice2 className="text-emerald-400" size={18} />}
          label="Total organisations"
          value={admin?.count?.OrgCount ?? 0}
          color="bg-emerald-950"
        />
      </div>
    </div>
  );
};

export default HomeGraph;
