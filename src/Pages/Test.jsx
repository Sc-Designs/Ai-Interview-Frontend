import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../Config/Axios";
import { useNavigate } from "react-router-dom";
import animationData from "../assets/handLoading.json";
import Lottie from "lottie-react";
import TestCard from "../Components/TestCard";
import { Search, Brain, Briefcase, Trophy, Zap } from "lucide-react";

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [query, setQuery] = useState("");
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const limit = 6;
  const navigate = useNavigate();

  const categories = [
    "Frontend",
    "Backend",
    "Full Stack",
    "React",
    "Node.js",
    "MongoDB",
    "System Design",
    "JavaScript",
  ];

  const fetchData = async (reset = false) => {
    try {
      const res = await Axios.get(
        `/test/api/send-test-questions?start=${reset ? 0 : start}&limit=${limit}&query=${query}`,
      );
      setQuestions((prev) =>
        reset ? res.data.questions : [...prev, ...res.data.questions],
      );
      setStart(res.data.nextStart || 0);
      setHasMore(res.data.hasMore);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(true);
      setStart(0);
      fetchData(true);
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);

  const handleCategory = (cat) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
      setQuery("");
    } else {
      setActiveCategory(cat);
      setQuery(cat);
    }
  };

  return (
    <div
      className="relative min-h-screen font-sans"
      style={{ background: "#0A0F1E" }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glows */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,212,255,0.09) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(99,102,241,0.07) 0%, transparent 60%)",
        }}
      />

      <Navbar />

      {/* Loading overlay */}
      {isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(10,15,30,0.75)",
            backdropFilter: "blur(6px)",
          }}>
          <div className="w-64">
            <Lottie animationData={animationData} loop />
          </div>
        </div>
      )}

      <section className="relative z-10 min-h-screen px-4 pt-28 pb-20 text-[#E8EDF5] md:px-8">
        {/* ── Hero ── */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-[12px] font-semibold uppercase tracking-widest text-cyan-400"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.2)",
            }}>
            <Zap size={13} />
            AI-Powered Interview Practice
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-[#E8EDF5] mb-5">
            Master Your
            <span
              className="block"
              style={{
                background: "linear-gradient(90deg, #00D4FF 0%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              Next Interview
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/45 leading-relaxed">
            Practice real-world interview questions tailored to your role. Build
            confidence and sharpen your skills with AI-evaluated assessments.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid max-w-3xl grid-cols-3 gap-4 mx-auto mb-16">
          {[
            {
              icon: <Brain size={22} className="text-cyan-400" />,
              value: "200",
              label: "Questions",
            },
            {
              icon: <Briefcase size={22} className="text-indigo-400" />,
              value: "20",
              label: "Test Sets",
            },
            {
              icon: <Trophy size={22} className="text-amber-400" />,
              value: "AI",
              label: "Evaluation",
            },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 py-5 px-4 rounded-2xl"
              style={{
                background: "rgba(20,25,41,0.88)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}>
              {icon}
              <span className="text-2xl font-black text-[#E8EDF5] tabular-nums">
                {value}
              </span>
              <span className="text-[11px] uppercase tracking-widest font-medium text-white/35">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="sticky top-4 z-30 max-w-2xl mx-auto mb-6">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
            style={{
              background: "rgba(20,25,41,0.92)",
              border: "1px solid rgba(0,212,255,0.2)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}>
            <Search size={18} className="text-cyan-400 flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveCategory(null);
              }}
              placeholder="Search by role, tech, or category…"
              className="flex-1 bg-transparent outline-none text-sm text-[#E8EDF5] placeholder:text-white/25"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory(null);
                }}
                className="text-white/30 hover:text-white/60 transition-colors text-lg leading-none">
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── Category filters ── */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto mb-14">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 active:scale-95"
                style={{
                  background: isActive ? "#00D4FF" : "rgba(255,255,255,0.04)",
                  border: isActive ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: isActive ? "#0A0F1E" : "rgba(232,237,245,0.55)",
                }}>
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Banner ── */}
        <div
          className="max-w-5xl mx-auto mb-12 px-7 py-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-4"
          style={{
            background: "rgba(20,25,41,0.7)",
            border: "1px solid rgba(0,212,255,0.1)",
            borderLeft: "3px solid #00D4FF",
          }}>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#E8EDF5] mb-1">
              🚀 Get Interview Ready
            </h2>
            <p className="text-sm text-white/40 leading-relaxed">
              Frontend · Backend · Full Stack · React · Node.js · MongoDB ·
              System Design — all powered by AI to simulate real hiring
              processes.
            </p>
          </div>
          <div
            className="hidden md:block w-px self-stretch"
            style={{ background: "rgba(0,212,255,0.15)" }}
          />
          <div className="flex-shrink-0 text-right">
            <p className="text-[11px] uppercase tracking-widest text-white/25 font-medium mb-0.5">
              Topics covered
            </p>
            <p className="text-2xl font-black text-cyan-400">8+</p>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="max-w-7xl mx-auto">
          {/* Results label */}
          <div className="flex items-center justify-between mb-5 px-1">
            <p className="text-[12px] uppercase tracking-widest font-semibold text-white/25">
              {questions.length > 0
                ? `${questions.length} test sets`
                : "No results"}
            </p>
            {query && (
              <p className="text-[12px] text-white/30">
                Results for <span className="text-cyan-400">"{query}"</span>
              </p>
            )}
          </div>

          <InfiniteScroll
            dataLength={questions.length}
            next={fetchData}
            hasMore={hasMore}
            loader={
              <div className="col-span-full py-8 text-center">
                <p className="text-[13px] text-white/25 uppercase tracking-widest">
                  Loading more…
                </p>
              </div>
            }
            endMessage={
              <div className="col-span-full flex flex-col items-center py-14">
                <span className="text-3xl mb-3">🎉</span>
                <h3 className="text-base font-bold text-[#E8EDF5]">
                  You've seen everything
                </h3>
                <p className="mt-1 text-sm text-white/30">
                  More test sets coming soon.
                </p>
              </div>
            }
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {questions.map((q, i) => (
              <TestCard
                key={i}
                q={q}
                onClick={() => navigate(`/testMicAndCamera/${q._id}`)}
              />
            ))}
          </InfiniteScroll>

          {/* Empty state */}
          {!isLoading && questions.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="text-lg font-bold text-[#E8EDF5] mb-1">
                No matches found
              </h3>
              <p className="text-sm text-white/30">
                Try a different keyword or browse by category above.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory(null);
                }}
                className="mt-5 px-5 py-2 rounded-xl text-sm font-semibold text-cyan-400 transition-all duration-150 hover:bg-cyan-400/10 active:scale-95"
                style={{ border: "1px solid rgba(0,212,255,0.25)" }}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Test;
