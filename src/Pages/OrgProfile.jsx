import React, { useEffect, useState } from 'react'
import Dock from '../Components/Dock';
import {
  VscArchive,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";
import { GiIsland } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import DashboardOrg from '../Components/DashboardOrg';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import OrgAxios from "../Config/orgAxios";
import { logOutOrg } from '../Store/Reducers/Organization';

const OrgProfile = () => {
    const navigate = useNavigate()
    const organization = useSelector((state) => state.OrganizationReducer);
    const dispatch = useDispatch();
    const [Org, setOrg] = useState(organization);

    useEffect(() => {
      setOrg(organization);
    }, [organization]);
    
    const items = [
      {
        icon: <GiIsland size={18} />,
        label: "Landing Page",
        onClick: () => navigate("/"),
      },
      {
        icon: <VscArchive size={18} />,
        label: "Questions",
        onClick: () => navigate("/sets"),
      },
      {
        icon: <VscAccount size={18} />,
        label: "Profile",
        onClick: () => navigate("/org-profile"),
      },
      {
        icon: <VscSettingsGear size={18} />,
        label: "Settings",
        onClick: () => navigate("/org-profile-edit"),
      },
    ];

      const logOut = async ()=>{
        try {
          const res = await OrgAxios.get("/orgs/logout");
          if(res.status === 200){ 
            localStorage.removeItem("OrgToken");
            navigate("/");
            dispatch(logOutOrg());
            toast.success("LogOut successfully.");
          } else {
            toast.error(res.data.message);
          }
        } catch(err) {
          toast.error("Something went wrong, try again later!");
        }
      }
    
  return (
    <div className="w-full min-h-screen px-5 pt-10 text-white bg-black lg:px-10">
      <div className="flex flex-col h-full grid-cols-4 grid-rows-3 gap-5 w-ful lg:grid">
        <div className="flex flex-col justify-center col-span-3 py-5 px-5 lg:px-15 rounded-xl lg:row-span-1 bg-zinc-950 gap-y-6 hover:-translate-y-1.5 transition-transform duration-200 border-1 border-zinc-700">
          <h1 className="text-4xl lg:text-5xl font-Satoshi">
            Hello, {Org?.name.split(" ")[0] || null} 👋🏽
          </h1>
          <p className="text-2xl lg:ml-5 font-Okomito">
            It's good to see you again. Wellcome back!
          </p>
        </div>
        <div className="col-span-1 py-5 row-span-2 border-1 border-zinc-700 rounded-xl bg-zinc-950 hover:-translate-y-1.5 transition-transform duration-200 flex flex-col justify-center items-center px-10">
          <h1 className="text-5xl font-semibold text-center font-Satoshi">
            Total Sets Created
          </h1>
          <p className="mt-5 text-6xl font-thin text-center font-Okomito">
            {Org?.questionSets?.length}
          </p>
        </div>
        <div className="col-span-3 row-span-2 rounded-xl bg-zinc-950 hover:-translate-y-1.5 transition-transform duration-200 border-1 border-zinc-700 p-3 lg:p-5">
          <h1 className="text-3xl font-semibold text-center uppercase lg:text-left font-Satoshi">
            Company Details
          </h1>
          <DashboardOrg data={Org} />
        </div>
        <div className="flex flex-col col-span-1 row-span-1 p-3 rounded-xl bg-zinc-950 border-1 border-zinc-700 gap-y-3">
          <button className="py-2 transition-colors duration-200 bg-red-600 rounded cursor-pointer font-Satoshi hover:bg-red-800">
            ⚠️ Report ⚠️
          </button>
          <button
            onClick={logOut}
            className="py-2 transition-colors duration-200 bg-red-600 rounded cursor-pointer font-Satoshi hover:bg-red-800">
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