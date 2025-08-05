import React, { useRef, useState, useEffect } from "react";
import OrgAxios from "../Config/orgAxios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FillDataFromLoginOrRegister } from "../Store/Reducers/Organization";
import maskEmail from '../Utils/EmailMasking';

const OrgOtpVerification = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);
  const [TimerSt, setTimerSt] = useState(false);
  
  useEffect(() => {
    const storedEmail = localStorage.getItem("OrgemailForOtp");
    if (!storedEmail) {
      navigate("/org-login");
    } else {
      const sliceMail = maskEmail(storedEmail)
      setEmail(sliceMail);
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.info("Enter full 6-digit OTP");
      return;
    }
    try {
      const emailSending = localStorage.getItem("OrgemailForOtp");
      const res = await OrgAxios.post("/orgs/verify-otp", {
        email: emailSending,
        otp: fullOtp,
      });

      if (res.status === 200) {
        localStorage.removeItem("OrgemailForOtp");
        localStorage.setItem("OrgToken", res.data.token);
        dispatch(FillDataFromLoginOrRegister(res.data.Org));
        toast.success("OTP Verified. Logged In ✅");
        navigate("/org-profile");
      }
    } catch (err) {
      toast.error("Invalid OTP!");
      console.error(err);
    }
  };

  useEffect(() => {
    const time = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(time);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(time);
      setTimerSt(false);
    };
  }, [TimerSt]);

  const resendOtp = async (email) => {
    try {
      const res = await OrgAxios.post("/orgs/resend-otp", { email });
      toast.success(res.data.message);
      setTimer(60);
      setTimerSt(true);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black font-Satoshi">
      <div className="w-full max-w-md p-8 text-center rounded shadow-2xl bg-zinc-900/60 border-1 border-zinc-200/20">
        <form onSubmit={handleSubmit} className="w-full text-center rounded">
          <h2 className="mb-4 text-2xl font-bold text-[#FFF]">Enter OTP</h2>
          <p className="mb-2 text-[#D1D5DB]">
            Sent to: <b>{email}</b>
          </p>
          <p className="mb-4 text-[#D1D5DB]">
            00:{timer.toString().padStart(2, "0")}
          </p>
          <div className="flex justify-center mb-6 space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-lg text-[#D1D5DB] text-center border-1 border-zinc-200/20 rounded-lg outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-3 mb-6 text-black transition-all duration-200 bg-white rounded cursor-pointer hover:bg-indigo-100">
            Verify OTP
          </button>
        </form>
        <button
          onClick={() => resendOtp(email)}
          className={`w-full py-3 text-black ${
            timer > 1
              ? "pointer-events-none bg-white/30"
              : "pointer-events-auto bg-white"
          }  rounded transition-all duration-200 cursor-pointer hover:bg-[#1E293B]`}>
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OrgOtpVerification;
