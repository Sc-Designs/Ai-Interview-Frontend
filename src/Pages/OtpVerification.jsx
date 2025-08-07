import React, { useRef, useState, useEffect } from "react";
import Axios from "../Config/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from "../Store/Reducers/UserReducer";

const OtpVerification = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);
  const [TimerSt, setTimerSt] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailForOtp");
    if (!storedEmail) {
      navigate("/login");
    } else {
      setEmail(storedEmail);
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
      const res = await Axios.post("/user/verify-otp", {
        email,
        otp: fullOtp,
      });

      if (res.status === 200 && !res.data.userData.user.block) {
        localStorage.removeItem("emailForOtp");
        localStorage.setItem("UserToken", res.data.token);
        dispatch(login(res.data.userData.user));
        toast.success("OTP Verified. Logged In ✅");
        navigate("/profile");
      } else {
        localStorage.removeItem("emailForOtp");
        toast.error("you are banned by admin");
        navigate("/login")
      }
    } catch (err) {
      toast.error("Invalid OTP!");
      console.error(err);
    }
  };

  useEffect(() => {
    const time = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(time);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(time)
      setTimerSt(false)
    };
  }, [TimerSt]);

  const resendOtp = async (email)=>{
    try{
      const res = await Axios.post("/resend-otp", {email});
      toast.success(res.data.message);
      setTimer(60);
      setTimerSt(true);
    } catch (err){
      toast.error(err.response.data.message);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen font-Okomito bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900">
      <div className="w-full max-w-md p-8 text-center bg-[#0A0A0A] rounded shadow">
        <form
          onSubmit={handleSubmit}
          className="w-full text-center bg-[#0A0A0A] rounded shadow">
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
                className="w-12 h-12 text-lg text-[#D1D5DB] text-center border border-[#A855F7] rounded-lg outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-3 mb-6 text-white bg-indigo-600 rounded cursor-pointer hover:bg-indigo-700">
            Verify OTP
          </button>
        </form>
          <button
            onClick={()=>resendOtp(email)}
            className={`w-full py-3 text-white ${
              timer > 1 ? "pointer-events-none" : "pointer-events-auto"
            } bg-[#1E293B]/60 rounded cursor-pointer hover:bg-[#1E293B]`}>
            Resend OTP
          </button>
      </div>
    </div>
  );
};

export default OtpVerification;
