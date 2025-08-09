import React from 'react'
import Lottie from "lottie-react";
import animationData from "../assets/Loading.json"; 

const Loading = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen bg-black'>
      <Lottie
        animationData={animationData}
        loop={true}
      />
    </div>
  );
}

export default Loading