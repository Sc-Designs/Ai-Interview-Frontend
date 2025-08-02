import {memo, useState} from "react";
import { NavLink } from "react-router-dom";
import {useSelector} from "react-redux"
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
const Navbar = () => {
    const user = useSelector((state) => state.UersReducer);
    const [menuModal, setMenuModal] = useState(false);
  return (
    <>
      <div className="fixed z-40 px-5 py-4 font-medium left-[90%] -translate-x-1/2 rounded-full lg:py-3 md:bg-white/10 top-5 md:left-1/2 backdrop-blur-2xl md:px-6 font-Okomito">
        <div className="items-center hidden w-full h-full text-xl l md:flex gap-x-10">
          <h1 className="ml-4">🤖</h1>
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
        <div className="flex justify-end text-4xl text-white md:hidden">
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
