import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";


const SelectBox = ({ option }) => {
  const [selected, setSelected] = useState("Weekly");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleOptionClick = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handelTimer = async () => {
    if (selected === "Select Time :") {
      toast.error("❌ Choose wisely");
    } else {
      sendMessage("Timer-Change", selected);
      toast.success("🎉 Update successfully.");
    }
  };
  
  return (
    <>
      <div className="relative w-full mr-10 font-sans" ref={wrapperRef}>
        <div
          className={`bg-zinc-800/60 text-white px-5 py-2 w-full cursor-pointer select-none relative rounded-md ${
            isOpen ? "rounded-b-none" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}>
          {selected}
          <span className="absolute -translate-y-1/2 top-1/2 right-5">
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-2 h-2 border-t-8 border-x-8 border-x-transparent border-t-white"
            />
          </span>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute left-0 right-0 z-50 text-white shadow-lg top-full bg-zinc-800/60 rounded-b-md"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}>
              {option.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`px-4 py-2 cursor-pointer hover:bg-zinc-800 ${
                    option === selected ? "bg-zinc-800" : ""
                  }`}>
                  {option}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SelectBox;
