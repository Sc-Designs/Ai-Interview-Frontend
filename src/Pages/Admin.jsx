import React, { useEffect, useState } from 'react'
import ShinyText from '../Components/ShinyText';
import HomeGraph from '../Components/HomeGraph';
import UserGraph from '../Components/UserGraph';
import OrganizationGraph from '../Components/OrganizationGraph';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import adminAxios from "../Config/adminAxios";
import { logOut } from '../Store/Reducers/AdminReducer';
import { toast } from 'react-toastify';
import AdminSettings from '../Components/AdminSettings';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("home");
  const admin = useSelector((state) => state.AdminReducer);
  const [adminDets, setadminDets] = useState(admin)

  useEffect(()=>{
  setadminDets(admin)    
  },[admin])
  
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false);
        const logOutadmin = async () => {
          try {
            const res = await adminAxios.post("/admin/logout");
            if (res.status === 200) {
              localStorage.removeItem("AdminToken");
              navigate("/");
              dispatch(logOut());
              toast.success("LogOut successfully.");
            } else {
              toast.error(res.data.message);
            }
          } catch (err) {
            console.log(err)
            toast.error("Something went wrong, try again later!");
          }
        };
  return (
    <div className="flex justify-center w-full min-h-screen bg-zinc-950">
      <div className="w-[20%] hidden lg:flex flex-col pt-5 gap-y-2 items-center min-h-screen bg-zinc-900">
        <ShinyText
          text="Admin Panel"
          disabled={false}
          speed={5}
          className="text-2xl font-semibold uppercase custom-class font-Satoshi"
        />
        <div className="overflow-hidden bg-red-400 rounded-full w-25 h-25">
          <img
            src={adminDets.profileImage || "/Default.jpg"}
            alt="admin Profile"
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="text-sm text-white font-Satoshi">
          <p>
            Name: - <span className="text-zinc-400">{adminDets.name}</span>
          </p>
          <p>
            Email: - <span className="text-zinc-400">{adminDets.email}</span>
          </p>
          <p>
            Phone: -{" "}
            <span className="text-zinc-400">{adminDets.phoneNumber || ""}</span>
          </p>
          <p>
            ID: - <span className="text-zinc-400">{adminDets._id}</span>
          </p>
          <p>
            Status: -{" "}
            <span className="text-green-500">
              {adminDets.isActive ? "Active" : "UnActive"}
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
          <h1
            onClick={() => setSelectedTab("settings")}
            className="relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-violet-500 after:top-0 after:left-[-100%] after:opacity-0 hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-b-1 border-white/20">
            <span className="relative z-20">Settings</span>
          </h1>
          <h1
            onClick={logOutadmin}
            className="relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-red-500 after:top-0 after:left-[-100%] after:opacity-0 hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-b-1 border-white/20">
            <span className="relative z-20">Logout</span>
          </h1>
        </div>
      </div>
      <div
        className={`w-[40%] fixed z-50 transition-all duration-200 ${
          showMenu ? "left-0" : "-left-[100%]"
        } lg:hidden flex flex-col pt-5 gap-y-2 items-center h-screen bg-zinc-900`}>
        <IoClose
          onClick={() => setShowMenu(false)}
          className="absolute text-2xl text-white cursor-pointer right-5"
        />
        <ShinyText
          text="Admin Panel"
          disabled={false}
          speed={5}
          className="text-2xl font-semibold uppercase custom-class font-Satoshi"
        />
        <div className="overflow-hidden bg-red-400 rounded-full w-25 h-25">
          <img
            src={adminDets.profileImage || "/Default.jpg"}
            alt="admin Profile"
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="text-sm text-white font-Satoshi">
          <p>
            Name: -{" "}
            <span className="text-zinc-400">{adminDets.name || ""}</span>
          </p>
          <p>
            Email: -{" "}
            <span className="text-zinc-400">{adminDets.email || ""}</span>
          </p>
          <p>
            Phone: -{" "}
            <span className="text-zinc-400">{adminDets.phoneNumber || ""}</span>
          </p>
          <p>
            ID: - <span className="text-zinc-400">{adminDets._id || ""}</span>
          </p>
          <p>
            Status: -{" "}
            <span className="text-green-500">
              {adminDets.isActive ? "Active" : "UnActive"}
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
            onClick={() => {
              setShowMenu(false);
              setSelectedTab("home");
            }}
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
            onClick={() => {
              setShowMenu(false);
              setSelectedTab("user");
            }}
            className={`relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-blue-700 after:top-0 ${
              selectedTab === "user"
                ? "after:left-[0] after:opacity-100"
                : "after:left-[-100%] after:opacity-0"
            } hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-white/20`}>
            <span className="relative z-20">User</span>
          </h1>
          <h1
            onClick={() => {
              setShowMenu(false);
              setSelectedTab("org");
            }}
            className={`relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-green-700 after:top-0 ${
              selectedTab === "org"
                ? "after:left-[0] after:opacity-100"
                : "after:left-[-100%] after:opacity-0"
            } hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-white/20`}>
            <span className="relative z-20 ">Organization</span>
          </h1>
          <h1
            onClick={() => {
              setShowMenu(false);
              setSelectedTab("settings");
            }}
            className="relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-violet-500 after:top-0 after:left-[-100%] after:opacity-0 hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-b-1 border-white/20">
            <span className="relative z-20">Settings</span>
          </h1>
          <h1
            onClick={logOutadmin}
            className="relative w-full py-4 text-center cursor-pointer after:absolute after:w-full after:h-full after:bg-red-500 after:top-0 after:left-[-100%] after:opacity-0 hover:after:opacity-100 hover:after:left-0 after:transition-all after:duration-500 border-t-1 border-b-1 border-white/20">
            <span className="relative z-20">Logout</span>
          </h1>
        </div>
      </div>
      <div className="md:w-[100%] lg:w-[80%] min-h-screen px-10 py-6">
        <div className="flex justify-between w-full">
          <h1 className="flex items-center text-3xl font-semibold gap-x-4 text-white/50 font-Okomito">
            <HiOutlineMenuAlt4
              onClick={() => setShowMenu(true)}
              className="block text-white cursor-pointer lg:hidden"
            />
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
        ) : selectedTab === "org" ? (
          <OrganizationGraph />
        ) : (
          <AdminSettings />
        )}
      </div>
    </div>
  );
}

export default Admin