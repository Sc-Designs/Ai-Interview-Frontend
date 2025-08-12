import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import OrgAxios from "../Config/orgAxios"
import { toast } from 'react-toastify';
import Lottie from "lottie-react";
import animationData from "../assets/blue loading.json";

const OrgLogin = () => {
  const [Loding, setLoding] = useState(false);
        const navigate = useNavigate();
        const [see, setsee] = useState(false);
        const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm();
        const onSubmit = async (data) => {
           try {
             const res = await OrgAxios.post("/orgs/api/login", data);
             if (res.status === 200) {
               localStorage.setItem("OrgemailForOtp", data.email);
               toast.success("OTP sent to your email. Please verify.");
               navigate("/org-otp");
             } else {
               toast.error("Email or password wrong!");
             }
           } catch (err) {
             toast.error("Please try again in few minute!");
             console.error(err);
           }
        };
        return (
          <div className="flex items-center justify-center w-full h-screen bg-black ">
            <div className="w-full max-w-md px-8 py-10 shadow-2xl bg-zinc-900/60 border-1 border-zinc-200/20 rounded-2xl font-Satoshi">
              <h2 className="mb-6 text-3xl font-semibold text-center uppercase text-zinc-100">
                AI Interviewer
              </h2>
              <p className="mb-6 text-center text-gray-200/50">
                Welcome back Company, please login to continue
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full px-4 py-3 text-white border outline-none border-zinc-500/50 invalid:border-rose-500 rounded-xl"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={see ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Minimum 8 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
                      },
                    })}
                    className="w-full px-4 py-3 pr-10 text-white border outline-none border-zinc-500/50 rounded-xl"
                  />
                  {see ? (
                    <FaRegEye
                      onClick={() => setsee(false)}
                      className="absolute text-lg text-green-400 -translate-y-1/2 cursor-pointer right-3 top-1/2"
                    />
                  ) : (
                    <FaRegEyeSlash
                      onClick={() => setsee(true)}
                      className="absolute text-lg text-white -translate-y-1/2 cursor-pointer right-3 top-1/2"
                    />
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  onClick={() => setLoding(true)}
                  className="flex items-center justify-center w-full py-1 mb-5 text-xl font-semibold transition-all duration-300 rounded cursor-pointer text-bold bg-zinc-100 hover:bg-indigo-200">
                  {Loding && (
                    <Lottie
                      className="w-10 h-10"
                      animationData={animationData}
                      loop={true}
                    />
                  )}
                  Login
                  {Loding && (
                    <Lottie
                      className="w-10 h-10"
                      animationData={animationData}
                      loop={true}
                    />
                  )}
                </button>
              </form>
              <div className="flex justify-between w-full">
                <button
                  onClick={() => navigate("/org-register")}
                  className="transition-all duration-300 cursor-pointer text-white/50 hover:text-white/80">
                  SignUp
                </button>
                <button className="transition-all duration-300 cursor-pointer text-white/50 hover:text-white/80">
                  Forget Password?
                </button>
              </div>
            </div>
          </div>
        );
}

export default OrgLogin