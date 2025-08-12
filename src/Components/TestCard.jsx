import { useIsVisible } from "../hook/useIsVisible";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function TestCard({ q, onClick }) {
  const [ref, isVisible] = useIsVisible({ threshold: 0.2 });

  useGSAP(() => {
    if (isVisible) {
        gsap.set(ref.current, {opacity:0})
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 70, filter: "blur(15px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className="bg-black/40 backdrop-blur-xl border border-white/50 duration-200 cursor-pointer flex flex-col items-start justify-between hover:-translate-y-1.5 px-4 py-4 rounded-xl">
      <h2 className="mb-4 text-3xl font-bold text-white">
        {q.title || "Test Set"}
      </h2>
      <p className="text-[#F1F5F9] mb-1 font-medium">
        Level:{" "}
        <span
          className={`${
            q.level === "easy"
              ? "text-green-400"
              : q.level === "medium"
              ? "text-orange-400"
              : "text-red-500"
          } uppercase tracking-wide`}>
          {q.level}
        </span>
      </p>
      <p className="text-[#D1D5DB] mb-1">
        📃 {q.questions?.length || 0} Questions
      </p>
      <p className="text-[#D1D5DB] mb-1">
        Category:{" "}
        <span className="px-4 py-1 italic text-black bg-white rounded">
          {q.category}
        </span>
      </p>
      <p className="text-[#D1D5DB]">
        By: <span className="italic text-white">{q.owner}</span>
      </p>
      <button
        onClick={onClick}
        className="mt-4 w-full bg-white text-black px-4 py-2 rounded hover:bg-[#465062] transition text-sm">
        Start Practice
      </button>
    </div>
  );
}
