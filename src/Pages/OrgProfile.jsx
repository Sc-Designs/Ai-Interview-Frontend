import React from 'react'
import Dock from '../Components/Dock';
import {
  VscHome,
  VscArchive,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";
import { GiIsland } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import DashboardOrg from '../Components/DashboardOrg';
import { useSelector } from 'react-redux';

const OrgProfile = () => {
    const navigate = useNavigate()
    const organization = useSelector((state) => state.OrganizationReducer);
      const items = [
        {
          icon: <GiIsland size={18} />,
          label: "Landing Page",
          onClick: () => navigate("/"),
        },
        {
          icon: <VscHome size={18} />,
          label: "Home",
          onClick: () => navigate("/org-profile"),
        },
        {
          icon: <VscArchive size={18} />,
          label: "Questions",
          onClick: () => navigate("/sets"),
        },
        {
          icon: <VscAccount size={18} />,
          label: "Profile",
          onClick: () => alert("Profile!"),
        },
        {
          icon: <VscSettingsGear size={18} />,
          label: "Settings",
          onClick: () => alert("Settings!"),
        },
      ];
  return (
    <div className="w-full min-h-screen px-10 py-10 text-white bg-black">
      <div className="grid w-full min-h-screen grid-cols-4 grid-rows-4 gap-5">
        <div className="flex flex-col justify-center col-span-3 px-15 rounded-xl row-spa-n-1 bg-zinc-950 gap-y-6 hover:-translate-y-1.5 transition-transform duration-200 border-1 border-zinc-700">
          <h1 className="text-5xl font-Satoshi">
            Hello, {(organization.name).split(" ")[0] || null} 👋🏽
          </h1>
          <p className="ml-5 text-2xl font-Okomito">
            It's good to see you again. Wellcome back!
          </p>
        </div>
        <div className="col-span-1 row-span-2 border-1 border-zinc-700 rounded-xl bg-zinc-950 hover:-translate-y-1.5 transition-transform duration-200 flex flex-col justify-center items-center px-10">
          <h1 className="text-5xl font-semibold text-center font-Satoshi">
            Total Task Created
          </h1>
          <p className="mt-5 text-6xl font-thin text-center font-Okomito">
            {organization.questionSets.length}
          </p>
        </div>
        <div className="col-span-3 row-span-2 rounded-xl bg-zinc-950 hover:-translate-y-1.5 transition-transform duration-200 border-1 border-zinc-700 p-5">
          <h1 className="text-4xl font-semibold uppercase font-Satoshi">
            Company Details
          </h1>
          <DashboardOrg data={organization} />
        </div>
        <div className="flex flex-col col-span-1 row-span-1 p-3 rounded-xl bg-zinc-950 border-1 border-zinc-700 gap-y-3">
          <button className="py-2 transition-colors duration-200 bg-red-600 rounded cursor-pointer font-Satoshi hover:bg-red-800">
            ⚠️ Report ⚠️
          </button>
          <button className="py-2 transition-colors duration-200 bg-red-600 rounded cursor-pointer font-Satoshi hover:bg-red-800">
            🚧 Logout 🚧
          </button>
          <button className="py-2 transition-colors duration-200 bg-red-600 rounded cursor-pointer font-Satoshi hover:bg-red-800">
            🚫 Perment Delete 🚫
          </button>
        </div>
      </div>
      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
        className="hover:bg-zinc-700/10 "
      />
    </div>
  );
}

export default OrgProfile