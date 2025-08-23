import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import Axios from "../Config/Axios"
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import animationData from "../assets/blue loading.json";

const Login = () => {
  const [Loding, setLoding] = useState(false);
  const navigate = useNavigate();
  const [see, setsee] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await Axios.post("/user/api/login", data);
      if (res.status === 200) {
        localStorage.setItem("emailForOtp", data.email);
        toast.success("OTP sent to your email. Please verify.");
        navigate("/otp");
      } else {
        toast.error("Email or password wrong!");
      }
    } catch (err) {
      toast.error("Please try again in few minute!");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-black">
      <div className="w-full max-w-md px-4 py-8 lg:p-8 border-1 border-zinc-200/20 bg-zinc-900/60 rounded-2xl font-Satoshi">
        <h2 className="mb-6 text-3xl font-bold text-center text-white">
          AI Interviewer
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Welcome back user, please login to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  value: 8,
                  message: "Minimum 8 characters",
                },
              })}
              className="w-full px-4 py-3 pr-10 text-white border outline-none border-zinc-200/20 rounded-xl"
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
        <div className="flex flex-col justify-between mt-6 gap-y-4 lg:flex-row">
          <p className="text-center text-gray-500 ">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-medium text-white cursor-pointer">
              Register
            </span>
          </p>
          <button
            onClick={() => navigate("/user-forget-pass")}
            className="cursor-pointer text-zinc-500 hover:text-white">
            Forget Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
