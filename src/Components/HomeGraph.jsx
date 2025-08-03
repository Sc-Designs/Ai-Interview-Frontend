import React from 'react'
import AreaChart from './AreaChart'
import SpotlightCard from './SpotLightCard'
import { FaUserTie } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";

const HomeGraph = () => {
  return (
    <>
    <div className="relative w-full px-4 py-4 my-5 overflow-hidden bg-black rounded-3xl h-96">
          <AreaChart />
        </div>
        <div className="grid grid-cols-2 gap-x-10">
          <SpotlightCard
            className="px-8 py-8 text-white custom-spotlight-card"
            spotlightColor="rgba(0, 229, 255, 0.5)">
            <h1 className="text-3xl font-semibold font-Okomito">Total User</h1>
            <p className="flex items-center text-xl gap-x-2">
              <FaUserTie />
              2
            </p>
          </SpotlightCard>
          <SpotlightCard
            className="px-8 py-8 text-white custom-spotlight-card"
            spotlightColor="rgba(0, 255, 20, 0.5)">
            <h1 className="text-3xl font-semibold font-Okomito">
              Total Organization
            </h1>
            <p className="flex items-center text-xl gap-x-2">
              <HiBuildingOffice2 />
              1
            </p>
          </SpotlightCard>
        </div>
        </>
  )
}

export default HomeGraph