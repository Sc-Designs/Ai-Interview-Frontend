import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import OrgAxios from "../Config/orgAxios";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import animationData from "../assets/blue loading.json";

const OrgRegister = () => {
  const [Loding, setLoding] = useState(false);
    const navigate = useNavigate()
    const [see, setsee] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await OrgAxios.post("/orgs/api/register", data);
      if(res.status === 201){
        localStorage.setItem("OrgemailForOtp", data.email);
        toast.success("OTP sent to your email. Please verify.");
        navigate("/org-otp");
      } else if (res.status === 406){
        toast.info("Organization already existing, Please Login.");
        navigate("/org-login");
      }
    } catch (err){
      toast.error("Something went wrong, Please try again after some times.")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-black">
      <div className="w-full max-w-md px-4 py-8 lg:p-8 bg-zinc-900/60 border-1 border-zinc-200/20 rounded-2xl font-Satoshi">
        <h2 className="mb-4 text-3xl font-bold text-center text-white">
          AI Interviewer
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Create your account here and hlep other to crack interview
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className="w-full px-4 py-3 text-white border outline-none border-zinc-200/20 rounded-xl"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
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
              className="w-full px-4 py-3 text-white border outline-none border-zinc-200/20 invalid:border-rose-500 rounded-xl"
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
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="w-full px-4 py-3 pr-10 text-white border outline-none border-zinc-200/20 invalid:border-rose-500 rounded-xl"
            />
            {see ? (
              <FaRegEye
                onClick={() => setsee(false)}
                className="absolute text-lg text-white -translate-y-1/2 cursor-pointer right-3 top-1/2"
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

          {/* Submit */}
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
            Register
            {Loding && (
              <Lottie
                className="w-10 h-10"
                animationData={animationData}
                loop={true}
              />
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/org-login")}
            className="font-medium text-white cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrgRegister;
