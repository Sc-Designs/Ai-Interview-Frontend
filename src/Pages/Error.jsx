import React from 'react'
import Navbar from '../Components/Navbar'
import Lottie from 'lottie-react'
import animationData from "../assets/Questioning.json"
const Error = () => {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-black'>
        <Navbar />
        <Lottie className='scale-80' animationData={animationData} loop={true} />
        <h1 className='text-white font-Satoshi absolute bottom-20 text-7xl'>404</h1>
    </div>
  )
}

export default Error