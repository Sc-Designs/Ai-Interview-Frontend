import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import LightRays from '../Components/LightRays';
import SpotlightCard from '../Components/SpotLightCard';
import SplitText from '../Components/SplitText';
import TextType from '../Components/TextType';

const Home = () => {
    const card = [
      {
        heading: "🎤 Realistic Mock Interviews",
        para: "Simulate real interview environments with voice and camera-based mock sessions.",
      },
      {
        heading: "🤖 AI-Generated Questions",
        para: "Get custom questions based on job role, level, and industry.",
      },
      {
        heading: "📊 Instant Feedback",
        para: "AI analyzes your responses and provides real-time tips to improve.",
      },
      {
        heading: "🔍 Skill-wise Analysis",
        para: "Identify your strong and weak areas with detailed performance charts.",
      },
      {
        heading: "🎯 Role-Specific Practice",
        para: "Choose from roles like Frontend Developer, HR, Data Scientist, and more.",
      },
      {
        heading: "🌐 Anywhere, Anytime",
        para: "Accessible from any device. Practice at your pace, whenever you want.",
      },
    ];
    const cards = [
      {
        icon: "📝",
        header: "1. Choose Your Role",
        para: "Select the job role and interview type you want to practice.",
      },
      {
        icon: "🎙️",
        header: "2. Start the Interview",
        para: "Answer AI-generated questions using voice or text in real-time.",
      },
      {
        icon: "📈",
        header: "3. Get Feedback",
        para: "Receive detailed insights and recommendations instantly.",
      },
    ];
    const navigate = useNavigate()
  return (
    <div className="w-full min-h-screen bg-[#000] relative">
      <Navbar />
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffff"
        raysSpeed={0.2}
        lightSpread={2}
        rayLength={6}
        fadeDistance={2.5}
        followMouse={true}
        saturation={2}
        mouseInfluence={0.3}
        noiseAmount={0.5}
        distortion={2}
        className="custom-rays"
      />
      <section className="w-full min-h-screen text-center text-[#FFF] flex flex-col gap-y-10 md:gap-y-5 px-7 py-35 md:px-15 md:py-40 font-Satoshi">
        <SplitText
          text="Crack Interviews with Confidence — Powered by AI."
          className="relative z-10 pb-2 text-5xl font-bold text-center md:text-7xl md:leading-20"
          delay={30}
          duration={0.4}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 80 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.5}
          rootMargin="-100px"
          textAlign="center"
        />
        <TextType
          text={[
            "Get personalized mock interviews, Practice smart. Perform better.",
            "Prepare smarter with AI-generated mock interviews, real-time feedback.",
            "And performance insights. Your next big job starts here.",
          ]}
          typingSpeed={55}
          pauseDuration={2500}
          showCursor={true}
          cursorCharacter="_"
          deletingSpeed={20}
        />
        <div className="flex flex-col justify-center mt-8 md:flex-row gap-x-4 gap-y-10">
          <abbr title="Start Mock Test" className="underline-none">
            <button
              onClick={() => navigate("/test")}
              className="bg-[#3B82F6] text-white font-Okomito text-xl md:text-lg cursor-pointer w-full md:w-fit px-6 py-3 rounded-2xl hover:bg-blue-600 transition">
              Start Practicing
            </button>
          </abbr>
          <abbr title="Free Trial">
            <button
              onClick={() => navigate("/about")}
              className="relative border border-[#A855F7] font-Okomito text-xl group md:text-lg cursor-pointer after:absolute after:w-full after:h-full after:bg-[#A855F7] after:top-[100%] after:left-0 overflow-hidden hover:after:top-0 after:duration-200 after:rounded-full hover:after:rounded-none w-full md:w-fit md:px-6 py-3 rounded-2xl hover:bg-[#1E293B] transition">
              <span className="relative z-20 duration-100 text-[#A855F7] group-hover:text-white">
                About Us
              </span>
            </button>
          </abbr>
        </div>
      </section>
      <section className="py-5 text-[#FFF] px-6">
        <h2 className="mb-10 text-4xl font-bold text-center">
          Why Choose Our AI Interview App?
        </h2>
        <div className="grid max-w-6xl gap-10 mx-auto text-center md:grid-cols-2 lg:grid-cols-3">
          {card.map((elem, index) => (
            <SpotlightCard
              key={index}
              className="px-4 py-8 custom-spotlight-card"
              spotlightColor="rgba(0, 229, 255, 0.3)">
              <h1 className="mb-4 text-xl pointer-events-none whitespace-nowrap font-Okomito">
                {elem.heading}
              </h1>
              <p className="pointer-events-none">{elem.para}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>
      <section className="py-20  text-[#FFF] px-6">
        <h2 className="mb-12 text-4xl font-bold text-center">How It Works</h2>
        <div className="grid max-w-5xl gap-12 mx-auto text-center md:grid-cols-3">
          {cards.map((item, i) => (
            <div key={i}>
              <div className="mb-4 text-4xl">{item.icon}</div>
              <h3 className="mb-2 text-2xl font-semibold">
               {item.header}
              </h3>
              <p className="text-[#D1D5DB]">
                {item.para}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 text-[#FFF] px-6">
        <h2 className="mb-12 text-4xl font-bold text-center">What Users Say</h2>
        <div className="grid max-w-4xl gap-10 mx-auto md:grid-cols-2">
          <div className="bg-[#111827] p-6 rounded-xl">
            <p className="italic text-[#D1D5DB]">
              "I cracked my dream job after just two weeks of using this app!
              The feedback is spot on."
            </p>
            <p className="mt-4 font-semibold">
              – Ayan Mukherjee, Full Stack Developer
            </p>
          </div>
          <div className="bg-[#111827] p-6 rounded-xl">
            <p className="italic text-[#D1D5DB]">
              "The AI interviewer feels real. It's like having a coach on
              demand."
            </p>
            <p className="mt-4 font-semibold">
              – Sneha Patil, Backend Developer
            </p>
          </div>
        </div>
      </section>
      <section className="text-center py-20 text-[#FFF]">
        <h2 className="mb-4 text-4xl font-bold">
          Ready to Level Up Your Interviews?
        </h2>
        <p className="text-[#D1D5DB] max-w-xl mx-auto mb-8">
          Join thousands of job seekers practicing smarter with AI. Your perfect
          interview is just one click away.
        </p>
        <button
          onClick={() => navigate("/test")}
          className="bg-[#3B82F6] text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-700 transition">
          Get Started Now
        </button>
      </section>
      <Footer />
    </div>
  );
}

export default Home