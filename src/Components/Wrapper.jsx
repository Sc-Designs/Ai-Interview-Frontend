import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Outlet } from 'react-router-dom';
import Lottie from 'lottie-react';
import waiting from "../assets/waiting.json";
const Wrapper = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const wrapperLoding = async () => {
      try {
        await Promise.all([
          axios.get("http://localhost:3000"),
          axios.get("http://localhost:3001"),
          axios.get("http://localhost:3002"),
          axios.get("http://localhost:3003"),
          axios.get("http://localhost:3004"),
          axios.get("http://localhost:3005"),
          axios.get("http://localhost:3006"),
        ]);
        setReady(true);
      } catch (error) {
        console.error("Error waking services:", error);
        setReady(true);
      }
    };
    wrapperLoding();
  }, []);
   if (!ready) {
     return (
       <div className="w-full h-screen relative bg-black flex flex-col items-center justify-center">
        <h1 className=" absolute bottom-10 -translate-x-1/2 left-1/2 text-xl lg:text-2xl 2xl:text-4xl text-white">All Service are weak Up ☺️</h1>
         <Lottie animationData={waiting} loop={true} />
       </div>
     );};

   return <Outlet />;
};

export default Wrapper