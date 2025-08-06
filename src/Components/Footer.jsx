import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-[#D1D5DB] relative z-30 font-Satoshi">
      {/* Tagline */}
      <div className="px-4 py-5 text-center shadow-lg bg-zinc-800">
        <p className="w-full mx-auto text-xl font-semibold leading-snug sm:text-2xl">
          AI Interviewer – Transforming hiring with real-time AI insights and
          smarter evaluations.
        </p>
      </div>

      {/* Links Section */}
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-6 text-sm sm:flex-row sm:text-base">
        <Link
          to="/admin-profile"
          className="transition duration-200 hover:text-blue-400">
          Admin
        </Link>
        <Link
          to="/org-profile"
          className="transition duration-200 hover:text-blue-400">
          Organization
        </Link>
        <Link
          to="/privacy-policy"
          className="transition duration-200 hover:text-blue-400">
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="transition duration-200 hover:text-blue-400">
          Terms of Service
        </Link>
      </div>

      {/* Divider */}
      <div className="w-4/5 mx-auto border-t border-gray-700" />

      {/* Bottom Section */}
      <div className="px-4 py-5 text-sm text-center sm:text-base">
        <p className="mb-2">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">AI Interview App</span>.
          Built with ❤️ by{" "}
          <span className="font-semibold">Suvam Chakraborti</span>.
        </p>
        <p>
          Follow us on{" "}
          <a
            href="https://www.linkedin.com/in/suvam-chakraborti/"
            target="_blank"
            rel="noreferrer"
            className="text-white underline transition duration-200 underline-offset-4 hover:text-blue-400">
            LinkedIn
          </a>{" "}
          •{" "}
          <a
            href="https://x.com/SUVAM_001"
            target="_blank"
            rel="noreferrer"
            className="text-white underline transition duration-200 underline-offset-4 hover:text-sky-400">
            X (Twitter)
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
