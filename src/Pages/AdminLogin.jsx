import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import adminAxios from "../Config/adminAxios";

const AdminLogin = () => {
      const navigate = useNavigate();
      const [see, setsee] = useState(false);
        const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm();
       const onSubmit = async (data)=>{
        const res = await adminAxios.post("/admin/login", data);
       };
  return (
    <div className="flex items-center justify-center w-full h-screen bg-black ">
      <div className="w-full max-w-md px-8 py-10 shadow-2xl bg-zinc-900/60 border-1 border-zinc-200/20 rounded-2xl font-Satoshi">
        <h2 className="mb-6 text-3xl font-semibold text-center uppercase text-zinc-100">
          AI Interviewer
        </h2>
        <p className="mb-6 text-center text-gray-200/50">
          Welcome back Admin, please login to continue
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
            className="w-full py-2 mb-5 text-xl font-semibold transition-all duration-300 cursor-pointer text-bold bg-zinc-100 rounded-xl hover:bg-indigo-200">
            Login
          </button>
        </form>
        <button className="w-full text-right transition-all duration-300 cursor-pointer text-white/50 hover:text-white/80">
          Forget Password?
        </button>
      </div>
    </div>
  );
}

export default AdminLogin