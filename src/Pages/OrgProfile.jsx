import React, { useEffect, useState } from "react";
import Dock from "../Components/Dock";
import { VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import { GiIsland } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import DashboardOrg from "../Components/DashboardOrg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import OrgAxios from "../Config/orgAxios";
import { logOutOrg } from "../Store/Reducers/Organization";

const StatCard = ({ value, label }) => (
  <div className="bg-zinc-900 rounded-xl px-4 py-3.5 border border-zinc-800">
    <p className="text-3xl font-medium text-white tracking-tight font-Satoshi">
      {value}
    </p>
    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-Satoshi">
      {label}
    </p>
  </div>
);

const ActionButton = ({ onClick, danger, children }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium border transition-colors duration-150 font-Satoshi cursor-pointer
      ${
        danger
          ? "text-red-400 border-red-900 hover:bg-red-950"
          : "text-zinc-300 border-zinc-800 hover:bg-zinc-800"
      }`}>
    {children}
  </button>
);

const OrgProfile = () => {
  const navigate = useNavigate();
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

  const logOut = async () => {
    try {
      const res = await OrgAxios.get("/orgs/api/logout");
      if (res.status === 200) {
        localStorage.removeItem("OrgToken");
        navigate("/");
        dispatch(logOutOrg());
        toast.success("Logged out successfully.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong, try again later.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white px-5 pt-10 pb-28 lg:px-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 lg:grid lg:grid-cols-[260px_1fr] lg:grid-rows-[auto_1fr]">
        {/* Sidebar */}
        <aside className="flex flex-col gap-4 lg:row-span-2">
          {/* Identity card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-700 flex-shrink-0">
                <img
                  src={
                    Org?.profileImage ||
                    "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=200&auto=format&fit=crop"
                  }
                  className="w-full h-full object-cover"
                  alt="Org logo"
                />
              </div>
              <div className="min-w-0">
                <p className="text-base font-medium text-white truncate font-Satoshi">
                  {Org?.name || "Organisation"}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-Satoshi">
                  {Org?.createdAt
                    ? `Joined ${new Date(Org.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                    : ""}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium text-emerald-400 bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded-full font-Satoshi capitalize">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {Org?.status || "Active"}
                </span>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 flex flex-col gap-1">
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2 font-Satoshi">
                Quick info
              </p>
              {[
                { label: "Email", value: Org?.email },
                { label: "Phone", value: Org?.phoneNumber || "Not set" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col py-2 border-b border-zinc-900 last:border-b-0">
                  <span className="text-xs text-zinc-600 font-Satoshi">
                    {label}
                  </span>
                  <span className="text-sm text-zinc-300 font-medium truncate font-Satoshi">
                    {value}
                  </span>
                </div>
              ))}
              {Org?.domain && (
                <div className="flex flex-col py-2">
                  <span className="text-xs text-zinc-600 font-Satoshi">
                    Domain
                  </span>
                  <a
                    href={Org.domain}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium truncate font-Satoshi">
                    {Org.domain}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2">
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1 font-Satoshi">
              Account
            </p>
            <div className="border-t border-zinc-900 pt-2 mt-1 flex flex-col gap-2">
              <ActionButton onClick={logOut}>🚪 Log out</ActionButton>
              <ActionButton danger>⚠️ Report issue</ActionButton>
              <ActionButton danger>🗑️ Delete account</ActionButton>
            </div>
          </div>
        </aside>

        {/* Greeting + stats */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="w-0.5 rounded-full bg-violet-600 self-stretch flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-medium tracking-tight font-Satoshi">
                Hello, {Org?.name?.split(" ")[0] || "there"} 👋
              </h1>
              <p className="text-sm text-zinc-500 mt-1 font-Satoshi">
                Here's an overview of your organisation.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5 lg:grid-cols-4">
                <StatCard
                  value={Org?.questionSets?.length ?? 0}
                  label="Question sets"
                />
                <StatCard
                  value={Org?.activeCampaigns ?? 0}
                  label="Active campaigns"
                />
                <StatCard
                  value={Org?.totalCandidates ?? 0}
                  label="Candidates"
                />
                <StatCard
                  value={
                    Org?.createdAt
                      ? `${Math.floor((Date.now() - new Date(Org.createdAt)) / (1000 * 60 * 60 * 24 * 30))}m`
                      : "—"
                  }
                  label="Member tenure"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company details */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xs text-zinc-600 uppercase tracking-widest mb-4 font-Satoshi">
            Company details
          </h2>
          <DashboardOrg data={Org} />
        </div>
      </div>

      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
        className="hover:bg-zinc-700/10"
      />
    </div>
  );
};

export default OrgProfile;
