import React, { useState } from 'react'
import ShinyText from '../Components/ShinyText';
import HomeGraph from '../Components/HomeGraph';
import UserGraph from '../Components/UserGraph';
import OrganizationGraph from '../Components/OrganizationGraph';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("home");
  const admin = useSelector((state) => state.AdminReducer);
  return (
    <div className="flex justify-center w-full min-h-screen bg-zinc-950">
      <div className="w-[20%] flex flex-col pt-5 gap-y-2 items-center h-screen bg-zinc-900">
        <ShinyText
          text="Admin Panel"
          disabled={false}
          speed={5}
          className="text-2xl font-semibold uppercase custom-class font-Satoshi"
        />
        <div className="overflow-hidden bg-red-400 rounded-full w-25 h-25">
          <img
            src="https://images.unsplash.com/photo-1604546689004-4ca31460dba1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="admin Profile"
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="text-sm text-white font-Satoshi">
          <p>
            Name: - <span className="text-zinc-400">{admin.name}</span>
          </p>
          <p>
            Email: - <span className="text-zinc-400">{admin.email}</span>
          </p>
          <p>
            Phone: - <span className="text-zinc-400">+91 8001165553</span>
          </p>
          <p>
            ID: - <span className="text-zinc-400">{admin._id}</span>
          </p>
          <p>
            Status: -{" "}
            <span className="text-green-500">
              {admin.isActive ? "Active" : "UnActive"}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center w-full mt-5 text-white uppercase">
          <h1
            onClick={() => navigate("/")}
            className="relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-yellow-500 after:top-0 after:left-[-100%] after:opacity-0 hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-white/20">
            <span className="relative z-20 ">Index</span>
          </h1>
          <h1
            onClick={() => setSelectedTab("home")}
            className={`relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-white after:top-0 ${
              selectedTab === "home"
                ? "after:left-[0] after:opacity-100"
                : "after:left-[-100%] after:opacity-0"
            }  hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-white/20 group`}>
            <span
              className={`relative z-20 ${
                selectedTab === "home" ? "text-black" : "text-white"
              } group-hover:text-black`}>
              Home
            </span>
          </h1>
          <h1
            onClick={() => setSelectedTab("user")}
            className={`relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-blue-700 after:top-0 ${
              selectedTab === "user"
                ? "after:left-[0] after:opacity-100"
                : "after:left-[-100%] after:opacity-0"
            } hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-white/20`}>
            <span className="relative z-20">User</span>
          </h1>
          <h1
            onClick={() => setSelectedTab("org")}
            className={`relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-green-700 after:top-0 ${
              selectedTab === "org"
                ? "after:left-[0] after:opacity-100"
                : "after:left-[-100%] after:opacity-0"
            } hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-white/20`}>
            <span className="relative z-20 ">Organization</span>
          </h1>
          <h1 className="relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-violet-500 after:top-0 after:left-[-100%] after:opacity-0 hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-b-1 border-white/20">
            <span className="relative z-20">Settings</span>
          </h1>
          <h1 className="relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-red-500 after:top-0 after:left-[-100%] after:opacity-0 hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-b-1 border-white/20">
            <span className="relative z-20">Logout</span>
          </h1>
        </div>
      </div>
      <div className="w-[80%] h-screen px-10 py-6">
        <div className="flex justify-between w-full">
          <h1 className="text-3xl font-semibold text-white/50 font-Okomito">
            Dashboard
          </h1>
          <button className="px-4 text-white transition-all duration-200 rounded-sm cursor-pointer hover:bg-sky-500 bg-sky-600 font-Satoshi">
            Report Any issue
          </button>
        </div>
        {selectedTab === "home" ? (
          <HomeGraph />
        ) : selectedTab === "user" ? (
          <UserGraph />
        ) : (
          <OrganizationGraph />
        )}
      </div>
    </div>
  );
}

export default Admin