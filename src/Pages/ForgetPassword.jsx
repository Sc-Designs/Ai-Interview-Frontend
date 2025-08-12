import Axios from "../Config/Axios";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { TbEyeCancel } from "react-icons/tb";
import { TbEyeCheck } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const pass = useRef(null);
  const [show, setshow] = useState(true);
  const [email, setEmail] = useState("");
  const [otp, setotp] = useState("");
  const [password, setpassword] = useState("");
  const [modal, setmodal] = useState(false);
  const [passModal, setpassModal] = useState(false);
  const [err, seterr] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passregex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailHandeler = async (e) => {
    e.preventDefault();
    if (emailRegex.test(email)) {
        const res = await Axios.post("/user/api/forgetPass", { email });
        if (res.status === 200){   
            toast.success(res.data.message);
            setmodal(true);
        }
    } else {
      toast.error("Input not Valid.");
      setmodal(false);
    }
  };
  const otpHandeler = async (e) => {
    e.preventDefault();
    if (otp.length == 6 && emailRegex.test(email)) {
      toast.info("Wait until we verify.");
      const res = await Axios.post("/user/api/forget-pass-otp", { email, otp });
      if(res.status === 200){
        toast.success(res.data.message)
        setpassModal(res.data.result);
      }
    } else {
      toast.error("Input not Valid.");
      setpassModal(false);
    }
  };
  const passwordHandel = async () => {
    if (passregex.test(password)) {
      try {
        const res = await Axios.post("/user/api/updatePassword", {
          email,
          otp,
          password,
        });
        if (res.status === 200) {
          seterr(false);
          toast.success("Password changed successfully.");
          navigate("/login");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          seterr(false);
          toast.info("Do not reuse your previous password. Try a new one.");
        } else if (error.response?.status === 401) {
          seterr(true);
          toast.error("Invalid or expired OTP.");
        } else {
          seterr(true);
          toast.error("Something went wrong. Please try again.");
        }
      }
    } else {
      seterr(true);
      toast.error("Password format is invalid.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen text-white bg-black">
      <div className="relative px-4 pt-6 pb-30 w-[90%] lg:w-[30%] rounded-md flex flex-col gap-y-7 items-center border-2 border-zinc-900 bg-zinc-900/90">
        <h1 className="text-xl uppercase font-Poppins">Forget Password</h1>
        <div className="relative w-full">
          <div className="flex w-full h-10 overflow-hidden rounded-md bg-zinc-700/40">
            <input
              type="email"
              placeholder="Email..."
              className="w-full px-2 border-none outline-none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.trim());
              }}
            />
            <button
              onClick={emailHandeler}
              className="px-2 cursor-pointer whitespace-nowrap bg-black/70">
              Send OTP
            </button>
          </div>
          {passModal && (
            <p className="absolute w-full pl-2 text-sm text-left text-green-500">
              your Account is verified.
            </p>
          )}
        </div>
        {modal && (
          <div className="flex w-full h-10 overflow-hidden rounded-md bg-zinc-700/40">
            <input
              type="number"
              placeholder="OTP here..."
              className="w-full px-2 border-none outline-none"
              value={otp}
              onChange={(e) => {
                setotp(e.target.value.trim());
              }}
            />
            <button
              onClick={otpHandeler}
              className="px-2 cursor-pointer whitespace-nowrap bg-black/70">
              Verify OTP
            </button>
          </div>
        )}
        {passModal && (
          <div className="relative w-full">
            <div className="flex w-full h-10 overflow-hidden rounded-md bg-zinc-800">
              <div className="relative w-full h-full">
                <input
                  type={show ? "password" : "text"}
                  placeholder="New Password here..."
                  className="w-full h-full px-2 border-none outline-none"
                  autoComplete="true"
                  ref={pass}
                  value={password}
                  onChange={(e) => setpassword(e.target.value.trim())}
                />
                <button
                  onClick={() => setshow(!show)}
                  className="absolute text-xl -translate-y-1/2 right-2 top-1/2">
                  {show ? (
                    <TbEyeCancel className="text-red-400/70" />
                  ) : (
                    <TbEyeCheck className="text-green-400/70" />
                  )}
                </button>
              </div>
              <button
                onClick={passwordHandel}
                className="px-2 cursor-pointer whitespace-nowrap bg-black/70">
                Confirm
              </button>
            </div>
            {err && (
              <p className="absolute text-red-400/90">
                Password must be at least 8 characters and include uppercase,
                lowercase, number, and special character
              </p>
            )}
          </div>
        )}
        <p className="absolute bottom-1 font-Poppins">
          Go To Login :{" "}
          <Link className="cursor-pointer text-zinc-600 hover:text-white" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
