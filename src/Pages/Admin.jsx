import React, { useEffect, useState } from "react";
import ShinyText from "../Components/ShinyText";
import HomeGraph from "../Components/HomeGraph";
import UserGraph from "../Components/UserGraph";
import OrganizationGraph from "../Components/OrganizationGraph";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import adminAxios from "../Config/adminAxios";
import { logOut } from "../Store/Reducers/AdminReducer";
import { toast } from "react-toastify";
import AdminSettings from "../Components/AdminSettings";

const NAV = [
  { key: "home", label: "Home", accent: "bg-white", textActive: "text-black" },
  {
    key: "user",
    label: "Users",
    accent: "bg-blue-600",
    textActive: "text-white",
  },
  {
    key: "org",
    label: "Orgs",
    accent: "bg-emerald-600",
    textActive: "text-white",
  },
  {
    key: "settings",
    label: "Settings",
    accent: "bg-violet-600",
    textActive: "text-white",
  },
];

const NavItem = ({ item, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`relative w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 font-Satoshi cursor-pointer flex items-center gap-3
      ${
        selected
          ? "bg-white/10 text-white"
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}>
    {selected && (
      <span
        className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r ${item.accent}`}
      />
    )}
    {item.label}
  </button>
);

const SidebarContent = ({
  adminDets,
  selectedTab,
  setSelectedTab,
  navigate,
  logOutadmin,
  onClose,
}) => (
  <div className="flex flex-col h-full">
    <div className="px-5 pt-6 pb-4 border-b border-zinc-800">
      <ShinyText
        text="Admin Panel"
        disabled={false}
        speed={5}
        className="text-xs font-semibold uppercase tracking-widest font-Satoshi"
      />
      <div className="flex items-center gap-3 mt-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 flex-shrink-0">
          <img
            src={adminDets.profileImage || "/Default.jpg"}
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate font-Satoshi">
            {adminDets.name}
          </p>
          <p className="text-xs text-zinc-500 truncate font-Satoshi">
            {adminDets.email}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="text-xs text-emerald-400 font-Satoshi capitalize">
          {adminDets.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>

    <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
      <p className="text-xs text-zinc-600 uppercase tracking-widest px-1 mb-2 font-Satoshi">
        Navigation
      </p>
      <button
        onClick={() => {
          navigate("/");
          onClose?.();
        }}
        className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150 font-Satoshi cursor-pointer">
        ← Landing page
      </button>
      {NAV.map((item) => (
        <NavItem
          key={item.key}
          item={item}
          selected={selectedTab === item.key}
          onClick={() => {
            setSelectedTab(item.key);
            onClose?.();
          }}
        />
      ))}
    </nav>

    <div className="px-3 pb-5 border-t border-zinc-800 pt-3">
      <p className="text-xs text-zinc-600 uppercase tracking-widest px-1 mb-2 font-Satoshi">
        Account
      </p>
      <button
        onClick={logOutadmin}
        className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-red-950 hover:text-red-300 transition-all duration-150 font-Satoshi cursor-pointer">
        Log out
      </button>
      <p className="text-xs text-zinc-700 px-1 mt-3 font-mono truncate">
        {adminDets._id}
      </p>
    </div>
  </div>
);

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("home");
  const admin = useSelector((state) => state.AdminReducer);
  const [adminDets, setAdminDets] = useState(admin);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setAdminDets(admin);
  }, [admin]);

  const logOutadmin = async () => {
    try {
      const res = await adminAxios.post("/admin/api/logout");
      if (res.status === 200) {
        localStorage.removeItem("AdminToken");
        navigate("/");
        dispatch(logOut());
        toast.success("Logged out successfully.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, try again later.");
    }
  };

  const tabLabel = NAV.find((n) => n.key === selectedTab)?.label || "Settings";

  return (
    <div className="flex w-full min-h-screen bg-zinc-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 min-h-screen bg-zinc-900 border-r border-zinc-800">
        <SidebarContent
          adminDets={adminDets}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          navigate={navigate}
          logOutadmin={logOutadmin}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setShowMenu(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-200 lg:hidden
          ${showMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <button
          onClick={() => setShowMenu(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer">
          <IoClose size={20} />
        </button>
        <SidebarContent
          adminDets={adminDets}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          navigate={navigate}
          logOutadmin={logOutadmin}
          onClose={() => setShowMenu(false)}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen flex flex-col px-4 py-6 lg:px-8 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMenu(true)}
              className="lg:hidden text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <HiOutlineMenuAlt4 size={22} />
            </button>
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest font-Satoshi">
                Dashboard
              </p>
              <h1 className="text-xl font-medium text-white font-Satoshi">
                {tabLabel}
              </h1>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors font-Satoshi cursor-pointer">
            Report issue
          </button>
        </div>

        <div className="flex-1">
          {selectedTab === "home" && <HomeGraph />}
          {selectedTab === "user" && <UserGraph />}
          {selectedTab === "org" && <OrganizationGraph />}
          {selectedTab === "settings" && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
