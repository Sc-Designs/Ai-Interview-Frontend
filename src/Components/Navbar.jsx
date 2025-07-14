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
      <div className="fixed top-0 z-40 left-0 backdrop-blur-2xl bg-[#0A0A0A]/20 w-full px-5 md:px-10 py-4  font-Okomito font-medium">
        <div className="justify-end hidden w-full h-full text-xl md:flex gap-x-10 items-">
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
            className="bg-[#3B82F6] px-10 text-white rounded-full py-1">
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
          className="bg-[#FFF] px-14 text-white rounded-full py-3">
          Profile
        </NavLink>
      </div>
    </>
  );
};

export default memo(Navbar);
