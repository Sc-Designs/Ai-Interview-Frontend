import React, { memo } from "react";

const Card = ({ heading, para }) => {
  return (
    <div className="p-[1.5px] rounded-2xl group cursor-pointer relative overflow-hidden">
      <div
        className="absolute h-[450%] w-[250%] rotate-90 group-hover:animate-[spin_7s_linear_infinite] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "conic-gradient(rgba(34, 211, 238, 0.4) 0deg 60deg, transparent 60deg 120deg, rgba(168, 85, 247, 0.4) 120deg 180deg, transparent 180deg 240deg, rgba(251, 191, 36, 0.4) 240deg 300deg, transparent 300deg 360deg)",
        }}></div>
      <div className="bg-[#111827] relative z-10 h-full rounded-2xl px-4 py-4 pointer-events-none">
        <h3 className="mb-2 text-2xl font-semibold text-white">{heading}</h3>
        <p className="text-[#94A3B8] px-6">{para}</p>
      </div>
    </div>
  );
};

export default memo(Card);
