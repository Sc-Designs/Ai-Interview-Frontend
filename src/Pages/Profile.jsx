import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { logOut } from "../Store/Reducers/UserReducer";
import { Link, useNavigate } from "react-router-dom";
import { BiLinkExternal } from "react-icons/bi";
import Axios from "../Config/Axios";
import { toast } from "react-toastify";

const Profile = () => {
  const user = useSelector((state) => state.UersReducer);
  const [userDets, setUserDets] = useState(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [result, setResult] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setUserDets(user);
  }, [user]);

  const LogOut = async () => {
    const res = await Axios.get("/user/api/log-out");
    if (res.status === 200) {
      localStorage.removeItem("UserToken");
      dispatch(logOut());
      toast.success("Logged out successfully.");
      navigate("/");
    } else {
      toast.error("Something went wrong, try again!");
    }
  };

  useEffect(() => {
    const fetchDefaultResult = async () => {
      const res = await Axios.get("/result/api/default-result");
      setResult(res.data.results);
      setScore(res.data.bestScore);
      setAvgScore(res.data.avgScore);
      setHasMore(res.data.hasMore);
    };
    fetchDefaultResult();
  }, []);

  const loadMore = async () => {
    try {
      const res = await Axios.get(
        `/result/api/default-result?start=${result.length}`,
      );
      setResult((prev) => [...prev, ...res.data.results]);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error(err);
    }
  };

  const joinedDate = new Date(userDets.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Total Tests",
      value: userDets.result?.length ?? 0,
      accent: "rgba(255,255,255,0.15)",
      border: "rgba(255,255,255,0.12)",
      valueColor: "#E8EDF5",
    },
    {
      label: "Avg. Score",
      value: `${avgScore}%`,
      accent: "rgba(0,212,255,0.15)",
      border: "rgba(0,212,255,0.25)",
      valueColor: "#00D4FF",
    },
    {
      label: "Best Score",
      value: `${score}%`,
      accent: "rgba(74,222,128,0.12)",
      border: "rgba(74,222,128,0.25)",
      valueColor: "#4ade80",
    },
  ];

  const getScoreStyle = (s) => {
    if (s < 50)
      return {
        color: "#f87171",
        bg: "rgba(248,113,113,0.08)",
        border: "rgba(248,113,113,0.2)",
      };
    if (s < 70)
      return {
        color: "#fbbf24",
        bg: "rgba(251,191,36,0.08)",
        border: "rgba(251,191,36,0.2)",
      };
    return {
      color: "#4ade80",
      bg: "rgba(74,222,128,0.08)",
      border: "rgba(74,222,128,0.2)",
    };
  };

  return (
    <div
      className="relative min-h-screen font-sans"
      style={{ background: "#0A0F1E" }}>
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 65%)",
        }}
      />

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-28 pb-20 text-[#E8EDF5]">
        {/* ── Profile card ── */}
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{
            background: "rgba(20,25,41,0.88)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}>
          {/* Top accent bar */}
          <div
            className="h-1 w-full"
            style={{
              background: "linear-gradient(90deg, #00D4FF 0%, #818cf8 100%)",
            }}
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              {/* Avatar */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden"
                  style={{
                    border: "2px solid rgba(0,212,255,0.3)",
                    boxShadow: "0 0 24px rgba(0,212,255,0.12)",
                  }}>
                  <img
                    src={
                      userDets?.profileImage ||
                      "https://images.unsplash.com/photo-1723394212824-a59ce1e2f09a?q=80&w=735&auto=format&fit=crop"
                    }
                    alt={userDets.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online dot */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                    style={{ boxShadow: "0 0 6px #4ade80" }}
                  />
                  <span className="text-[11px] uppercase tracking-widest text-white/35 font-medium">
                    Active
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-center gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF5]">
                  {userDets.name}
                </h1>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1">
                  {[
                    { label: "Email", value: userDets.email },
                    { label: "Joined", value: joinedDate },
                  ].map(({ label, value }) => (
                    <p key={label} className="text-sm text-white/40">
                      <span className="text-white/25 uppercase tracking-widest text-[10px] font-semibold mr-1.5">
                        {label}
                      </span>
                      <span className="text-white/65">{value}</span>
                    </p>
                  ))}
                </div>
                {userDets.bio && (
                  <p className="mt-2 text-sm text-white/40 leading-relaxed max-w-lg">
                    {userDets.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex flex-wrap gap-3 mt-6 pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => navigate("/profile-edit")}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-[#E8EDF5] transition-all duration-150 hover:bg-white/10 active:scale-95"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                }}>
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/ai")}
                className="px-5 py-2 rounded-xl text-sm font-bold text-[#0A0F1E] bg-cyan-400 transition-all duration-150 hover:bg-cyan-300 active:scale-95">
                Interview Prep with AI →
              </button>
              <button
                onClick={LogOut}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-red-400 transition-all duration-150 hover:bg-red-400/10 active:scale-95 ml-auto"
                style={{ border: "1px solid rgba(248,113,113,0.25)" }}>
                Log out
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {stats.map(({ label, value, accent, border, valueColor }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-6 rounded-2xl gap-2"
              style={{ background: accent, border: `1px solid ${border}` }}>
              <span
                className="text-3xl font-black tabular-nums"
                style={{ color: valueColor }}>
                {value}
              </span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-white/35">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Results ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(20,25,41,0.88)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-white/35">
              Test History
            </p>
            <span className="text-[11px] tabular-nums text-white/25">
              {result.length} {result.length === 1 ? "result" : "results"}
            </span>
          </div>

          {/* List */}
          <div
            className="divide-y"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {result.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-2">
                <span className="text-4xl">📋</span>
                <p className="text-sm text-white/30">No test results yet.</p>
                <button
                  onClick={() => navigate("/test")}
                  className="mt-3 px-5 py-2 rounded-xl text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400/10 active:scale-95"
                  style={{ border: "1px solid rgba(0,212,255,0.25)" }}>
                  Take your first test →
                </button>
              </div>
            ) : (
              result.map((test) => {
                const s = getScoreStyle(test.score);
                return (
                  <Link
                    key={test._id}
                    to={`/result/${test._id}`}
                    className="flex items-center justify-between px-6 py-4 transition-all duration-150 group"
                    style={{ background: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }>
                    <div className="flex items-center gap-3">
                      {/* Score dot */}
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: s.color,
                          boxShadow: `0 0 6px ${s.color}`,
                        }}
                      />
                      <span className="text-sm font-medium text-[#E8EDF5]/80 group-hover:text-[#E8EDF5] transition-colors">
                        {test.testName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm font-bold tabular-nums px-2.5 py-0.5 rounded-full"
                        style={{
                          color: s.color,
                          background: s.bg,
                          border: `1px solid ${s.border}`,
                        }}>
                        {test.score}%
                      </span>
                      <BiLinkExternal
                        className="text-white/20 group-hover:text-white/50 transition-colors"
                        size={14}
                      />
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Load more */}
          {hasMore && result.length > 0 && (
            <div
              className="px-6 py-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={loadMore}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white/50 transition-all duration-150 hover:text-white/80 hover:bg-white/5 active:scale-[0.99]"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                Load more results
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
