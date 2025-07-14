import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-[#D1D5DB] text-center font-Okomito py-6 px-4">
      <p>&copy; 2025 AI Interview App. Built with ❤️ by Suvam Chakraborti.</p>
      <p className="mt-2">
        Follow us on{" "}
        <a
          href="https://www.linkedin.com/in/suvam-chakraborti/"
          target="_blank"
          className="text-[#FFF] underline">
          LinkedIn
        </a>{" "}
        •{" "}
        <a
          href="https://x.com/SUVAM_001"
          target="_blank"
          className="text-[#FFF] underline">
          X (Twitter)
        </a>
      </p>
    </footer>
  );
}

export default Footer