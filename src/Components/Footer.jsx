import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Brain,
  ShieldCheck,
  Building2,
  BriefcaseBusiness,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="relative z-30 overflow-hidden border-t bg-black text-white border-white/10">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* CTA */}
      <div className="relative px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full bg-white/5 border-white/10 backdrop-blur-xl">
            <Brain size={18} />
            <span className="text-sm">AI Powered Interview Platform</span>
          </div>

          <h2 className="max-w-4xl mx-auto text-3xl font-black leading-tight md:text-5xl">
            Transforming Hiring Through
            <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text">
              Intelligent Assessments
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-400">
            Evaluate candidates with AI-powered interviews, automated scoring,
            voice analysis, and real-world technical assessments.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl px-6 py-12 mx-auto">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold">AI Interviewer</h3>

            <p className="max-w-md mt-4 text-gray-400">
              A next-generation hiring platform that helps organizations
              evaluate technical, communication, and problem-solving skills
              through AI-driven interviews.
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="https://www.linkedin.com/in/suvam-chakraborti/"
                target="_blank"
                rel="noreferrer"
                className="p-3 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-1">
                <FaLinkedin size={18} />
              </a>

              <a
                href="https://x.com/SUVAM_001"
                target="_blank"
                rel="noreferrer"
                className="p-3 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-1">
                <FaSquareXTwitter size={18} />
              </a>

              <a
                href="mailto:suvam@suvam.info"
                className="p-3 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-1">
                <Mail size={18} />
              </a>
              <a
                href="https://suvam.info"
                target="_blank"
                rel="noreferrer"
                className="p-3 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-1">
                <BriefcaseBusiness size={18} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Platform</h4>

            <div className="flex flex-col gap-3 text-gray-400">
              <Link to="/org-profile" className="transition hover:text-white">
                <span className="flex items-center gap-2">
                  <Building2 size={16} />
                  Organization
                </span>
              </Link>

              <Link to="/admin-profile" className="transition hover:text-white">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Admin
                </span>
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Legal</h4>

            <div className="flex flex-col gap-3 text-gray-400">
              <Link
                to="/privacy-policy"
                className="transition hover:text-white">
                Privacy Policy
              </Link>

              <Link to="/terms" className="transition hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-white/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} AI Interviewer. All rights reserved.
          </p>

          <p>
            Designed & Developed by{" "}
            <span className="font-semibold text-white">Suvam Chakraborti</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
