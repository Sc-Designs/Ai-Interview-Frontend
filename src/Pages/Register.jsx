import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
const Register = () => {
    const navigate = useNavigate()
    const [see, setsee] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Register Data:", data);
    // Call register API here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900">
      <div className="w-full max-w-md p-8 bg-[#1E293B] shadow-2xl rounded-2xl font-Okomito">
        <h2 className="mb-6 text-3xl font-bold text-center text-indigo-700">
          AI Interviewer
        </h2>
        <p className="mb-6 text-center text-gray-500">Create a new account</p>

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
              className="w-full px-4 py-3 text-white border border-[#A855F7] outline-none rounded-xl"
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
              className="w-full px-4 py-3 text-white border border-[#A855F7] outline-none invalid:border-rose-500 rounded-xl"
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
              className="w-full px-4 py-3 pr-10 text-white border border-[#A855F7] outline-none invalid:border-rose-500 rounded-xl"
            />
            {see ? (
              <FaRegEye onClick={()=>setsee(false)} className="absolute text-lg text-white -translate-y-1/2 cursor-pointer right-3 top-1/2" />
            ) : (
              <FaRegEyeSlash onClick={()=>setsee(true)} className="absolute text-lg text-white -translate-y-1/2 cursor-pointer right-3 top-1/2" />
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
            className="w-full py-3 text-white transition duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-700">
            Register
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-600 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
