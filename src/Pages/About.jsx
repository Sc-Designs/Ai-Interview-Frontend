import React, { useState } from 'react'
import Navbar from '../Components/Navbar';
import { NavLink } from 'react-router-dom';
import Footer from '../Components/Footer';
import Card from '../Components/Card';

const About = () => {
  const [card, setCard] = useState([
    {
      heading: "🎤 Voice-Based Interview",
      para: "Simulate real interviews with voice input and feedback.",
    },
    {
      heading: "🤖 AI-Powered Engine",
      para: "Get smart, adaptive question sets based on your profile.",
    },
    {
      heading: "📊 Instant Feedback",
      para: "See your weak spots and improve with AI-based scoring",
    },
  ]);
  return (
    <div className="bg-[#0A0A0A] w-full min-h-screen">
      <Navbar />
      <section className="py-20 text-[#FFF] px-6 font-Okomito">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">About Us</h2>
          <p className="text-[#D1D5DB] text-lg mb-6">
            We're on a mission to redefine how candidates prepare for interviews
            in the modern era. Traditional prep methods are slow, unstructured,
            and outdated.
          </p>
          <p className="text-[#D1D5DB] text-lg mb-6">
            Our AI Interview & Mock Tester uses state-of-the-art AI to simulate
            real interview environments, generate role-specific questions, and
            provide instant feedback — all to help you grow faster and smarter.
          </p>
          <p className="text-[#D1D5DB] text-lg">
            Whether you're a fresher preparing for your first job or a
            professional switching careers, our platform adapts to your needs
            and gives you the edge to succeed.
          </p>
        </div>
        <div className="grid max-w-5xl gap-10 mx-auto mt-12 text-left md:grid-cols-2">
          <Card
            heading={"🚀 Our Vision"}
            para={
              "To make world-class interview preparation accessible, smart, and personalized for everyone."
            }
          />
          <Card
            heading={"🎯 Our Mission"}
            para={
              "To empower job seekers with the tools and confidence they need to ace any interview, anywhere."
            }
          />
        </div>
      </section>
      <section className="bg-[#0A0A0A] text-[#FFF] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">How It All Started</h2>
          <p className="text-[#D1D5DB] text-lg">
            We’ve been there — facing interview anxiety, uncertain prep, and
            generic tips. That’s why we built an app that simulates real
            interviews using voice, AI, and instant feedback.
            <br />
            <br />
            This platform was created to give everyone — from freshers to
            experienced pros — a smarter way to practice and win.
          </p>
        </div>
      </section>
      <section className="bg-card text-[#FFF] py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="mb-12 text-3xl font-bold">What Makes Us Different</h2>
          <div className="grid gap-10 text-left md:grid-cols-3">
            {card.map((elem, i) => (
              <Card key={i} heading={elem.heading} para={elem.para} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#0A0A0A] text-[#FFF] py-20 px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Meet the Creator</h2>
          <p className="text-[#D1D5DB] mt-2">
            Built by passionate developer Suvam Chakraborti 🎯
          </p>
        </div>
      </section>
      <section className="py-16 text-center text-white font-okomito">
        <h2 className="mb-4 text-4xl font-bold">Ready to Practice Smarter?</h2>
        <p className="px-6 mb-6 text-lg">
          Join thousands already preparing better with our AI Interview Tool.
        </p>
        <NavLink
          to="/"
          className="bg-[#A855F7] text-[#F1F5F9] px-6 py-3 rounded-xl font-semibold hover:bg-[#A855F7]/50 transition">
          Start Your First Interview
        </NavLink>
      </section>
      <Footer />
    </div>
  );
}

export default About