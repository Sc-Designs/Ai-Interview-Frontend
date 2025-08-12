import Lottie from 'lottie-react'
import React from 'react'
import animationData from "../assets/Under Maintenance.json"
import Navbar from '../Components/Navbar'
const CommingSoon = () => {
  return (
    <div className="w-full h-screen flex flex-col  justify-center items-center bg-black">
      <Navbar />
           <h1 className="text-white absolute bottom-20 font-Satoshi font-bold text-6xl">Comming Soon!</h1>
        <Lottie
          animationData={animationData}
          loop={true}
          className="  scale-30"
        />

    </div>
  );
}

export default CommingSoon