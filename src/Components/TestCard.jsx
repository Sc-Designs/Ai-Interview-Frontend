import { useIsVisible } from "../hook/useIsVisible";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const levelConfig = {
  easy: {
    label: "Easy",
    color: "text-green-400",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
  },
  medium: {
    label: "Medium",
    color: "text-amber-400",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
  },
  hard: {
    label: "Hard",
    color: "text-red-400",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
  },
};

export default function TestCard({ q, onClick }) {
  const [ref, isVisible] = useIsVisible({ threshold: 0.2 });

  useGSAP(() => {
    if (isVisible) {
      gsap.set(ref.current, { opacity: 0 });
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 70, filter: "blur(15px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power2.out",
        },
      );
    }
  }, [isVisible]);

  const level = levelConfig[q.level] || levelConfig.medium;
  const questionCount = q.questions?.length || 0;

  return (
    <div
      ref={ref}
      className="group flex flex-col cursor-pointer rounded-2xl transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "rgba(20,25,41,0.88)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = "1px solid rgba(0,212,255,0.2)";
        e.currentTarget.style.boxShadow =
          "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
      }}>
      {/* Card header */}
      <div
        className="px-5 pt-5 pb-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Level + category row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${level.color}`}
            style={{
              background: level.bg,
              border: `1px solid ${level.border}`,
            }}>
            {level.label}
          </span>
          <span
            className="text-[11px] font-semibold uppercase tracking-widest text-white/35 px-2.5 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
            {q.category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#E8EDF5] leading-snug line-clamp-2">
          {q.title || "Test Set"}
        </h2>
      </div>

      {/* Card body */}
      <div className="flex-1 flex flex-col px-5 py-4 gap-3">
        {/* Question count */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.15)",
            }}>
            📃
          </div>
          <span className="text-sm text-white/50">
            <span className="text-[#E8EDF5] font-semibold tabular-nums">
              {questionCount}
            </span>{" "}
            {questionCount === 1 ? "Question" : "Questions"}
          </span>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
            👤
          </div>
          <span className="text-sm text-white/50">
            By <span className="text-[#E8EDF5] font-medium">{q.owner}</span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={onClick}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-[#0A0F1E] bg-cyan-400 transition-all duration-200 hover:bg-cyan-300 active:scale-[0.98]">
          Start Practice →
        </button>
      </div>
    </div>
  );
}
