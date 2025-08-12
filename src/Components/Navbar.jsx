import {memo, useEffect, useRef, useState} from "react";
import { NavLink } from "react-router-dom";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import Robot from "../assets/E V E.json"
import Lottie from "lottie-react";
const Navbar = () => {
    const [menuModal, setMenuModal] = useState(false);
    const fixedMenu = useRef(null);
    
     useEffect(() => {
       let lastScrollY = window.scrollY;
       const handleScroll = () => {
         const currentScrollY = window.scrollY;
         if (currentScrollY > lastScrollY && currentScrollY > 50) {
           fixedMenu.current.style.top = "-20%";
         } else if (currentScrollY < lastScrollY) {
           fixedMenu.current.style.top = "5%";
         }
         lastScrollY = currentScrollY;
       };
       window.addEventListener("scroll", handleScroll);
       return () => window.removeEventListener("scroll", handleScroll);
     }, []);
     
  return (
    <>
      <div
        ref={fixedMenu}
        className="fixed z-50 px-3 md:py-1 transition-all duration-500 font-medium left-[85%] border border-white/10 -translate-x-1/2 rounded md:rounded-full lg:py-1 bg-white/5 top-5 md:left-1/2 backdrop-blur-sm md:px-6 font-Okomito">
        <div className="items-center hidden w-full h-full text-xl l md:flex gap-x-10">
          <div className="w-13 h-13">
          <Lottie animationData={Robot} loop={true} />
          </div>
          {[
            { name: "Home", to: "/" },
            { name: "Test", to: "/test" },
            { name: "About", to: "/about" },
            { name: "Contact", to: "/contact" },
          ].map((elem, i) => (
            <NavLink
              key={i}
              to={elem.to}
              className={({ isActive }) =>
                isActive === true ? "text-[#FFF]" : "text-white"
              }>
              {elem.name}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            className="bg-[#3B82F6] px-10 ml-20 text-white rounded-full py-1">
            Profile
          </NavLink>
        </div>
        <div className="flex justify-end text-5xl text-white md:hidden">
          <HiMenuAlt4 onClick={() => setMenuModal(true)} />
        </div>
      </div>
      <div
        className={`fixed top-0 z-50 ${
          menuModal ? "left-[0%]" : "left-[100%]"
        } text-4xl uppercase backdrop-blur-2xl transition-all duration-300 h-screen flex-col md:hidden w-full flex justify-center items-center gap-y-10`}>
        <AiOutlineClose
          onClick={() => setMenuModal(false)}
          className="absolute text-white top-5 right-5"
        />
        {[
          { name: "Home", to: "/" },
          { name: "Test", to: "/test" },
          { name: "About", to: "/about" },
          { name: "Contact", to: "/contact" },
        ].map((elem, i) => (
          <NavLink
            key={i}
            to={elem.to}
            className={({ isActive }) =>
              isActive === true ? "text-[#FFF]" : "text-white"
            }>
            {elem.name}
          </NavLink>
        ))}
        <NavLink
          to="/profile"
          className="bg-[#3B82F6] px-14 text-white rounded-full py-3">
          Profile
        </NavLink>
      </div>
    </>
  );
};

export default memo(Navbar);
