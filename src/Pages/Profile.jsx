import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useDispatch } from "react-redux";
import { logOut } from "../Store/Reducers/UserReducer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BiLinkExternal } from "react-icons/bi";
import Axios from "../Config/Axios";
import { toast } from "react-toastify";

const Profile = () => {
  const user = useSelector((state) => state.UersReducer);
  const [userDets, setuserDets] = useState(user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [result, setresult] = useState([]);
  const [hasMore, sethasMore] = useState(true);

  useEffect(()=>{
    setuserDets(user);
  },[user]);
  
  const LogOut = async () => {
    const res = await Axios.get("/user/api/log-out");
    if (res.status === 200) {
      localStorage.removeItem("UserToken");
      dispatch(logOut());
      toast.success("LogOut Seccessfully.");
      navigate("/");
    } else {
      toast.error("Something wrong, try again!");
    }
  };
  useEffect(() => {
    const fetchDefultResult = async () => {
      const res = await Axios.get("/result/api/default-result");
      setresult(res.data.results);
      setScore(res.data.bestScore);
      setAvgScore(res.data.avgScore);
      sethasMore(res.data.hasMore);
    };
    fetchDefultResult();
  }, []);
  const loadMore = async ()=>{
   try {
     const res = await Axios.get(
       `/result/api/default-result?start=${result.length}`
     );
     setresult((prev) => [...prev, ...res.data.results]);
     sethasMore(res.data.hasMore);
   } catch (err) {
     console.error(err);
   }
  }
  return (
    <div className="min-h-screen text-white bg-zinc-950">
      <Navbar />
      <section className="grid w-full grid-cols-4 grid-rows-2 gap-5 px-6 pt-20 md:pt-26 pb-5 h-fit md:h-[70vh] font-Satoshi">
        <div className="w-full col-span-4 p-8 bg-black border border-white md:row-span-2 md:col-span-2 rounded-xl">
          <div className="flex flex-col items-center md:flex-row gap-x-10">
            <div className="w-32 h-32 overflow-hidden border-2 rounded-full border-white/50">
              <img
                src={
                  userDets?.profileImage ||
                  "https://images.unsplash.com/photo-1723394212824-a59ce1e2f09a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt={userDets.name}
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl">Name: {userDets.name}</h1>
              <h4>Email : {userDets.email}</h4>
              <h4>Role : {userDets.role}</h4>
              <h4>
                Joined At :{" "}
                {new Date(userDets.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
            </div>
          </div>
          <div className="flex flex-col justify-between px-1 mt-5 md:px-10 md:flex-row gap-y-5">
            <button
              onClick={() => navigate("/profile-edit")}
              className="bg-[#fff] text-black px-5 py-2 w-full md:w-fit rounded-xl hover:bg-white/50 cursor-pointer transition text-sm">
              Edit Profile
            </button>
            <button
              onClick={LogOut}
              className="w-full px-10 py-2 text-sm text-red-500 transition border border-red-500 cursor-pointer md:w-fit rounded-xl hover:bg-red-600 hover:text-white">
              Logout
            </button>
            <button
              onClick={() => navigate("/ai")}
              className="bg-[#fff] text-black px-5 py-2 w-full md:w-fit rounded-xl hover:bg-white/50 cursor-pointer transition text-sm">
              Interview Prep. with AI
            </button>
          </div>
          <p className="mt-5 text-xl">{userDets.bio}</p>
        </div>
        <div className="grid w-full grid-cols-2 col-span-4 md:grid-cols-1 md:row-span-2 md:col-span-2 -gap-y-2 md:gap-y-4 rounded-xl grid-row-2">
          <div className="flex flex-col col-span-2 row-span-1 md:col-span-1 md:flex-row md:gap-x-4 gap-y-10">
            <div className="flex flex-col items-center justify-center w-full bg-black border border-white py-9 border-l-6 gap-y-3 rounded-xl border-r-1 border-t-1 border-b-1">
              <h1 className="text-4xl">Total Test</h1>
              <p className="text-2xl">{userDets.result.length}</p>
            </div>
            <div className="flex flex-col items-center justify-center w-full bg-black border py-9 border-sky-400 border-l-6 gap-y-3 rounded-xl border-r-1 border-t-1 border-b-1">
              <h1 className="text-4xl">Avarage Score</h1>
              <p className="text-2xl">{avgScore}%</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full col-span-2 row-span-1 py-1 bg-black border border-l-8 border-green-400 -mt-14 md:mt-0 md:py-14 border-r-1 border-t-1 border-b-1 gap-x-5 rounded-xl">
            <h1 className="text-4xl">Best Score</h1>
            <p className="text-4xl">⇒</p>
            <p className="text-4xl">{score}</p>
          </div>
        </div>
      </section>
      <section className="px-6 pb-5">
        <div className="flex flex-col py-5 gap-y-5">
          {result.length === 0 ? (
            <h1 className="text-[#D1D5DB] text-lg ml-5">
              You have No Test Result.
            </h1>
          ) : (
            result.map((test) => (
              <abbr
                key={test._id}
                title="See Result"
                className="bg-black border border-white/50 no-underline p-5 rounded-xl flex  hover:shadow-xl hover:-translate-y-1.5 hover:scale-102 transition">
                <Link to={`/result/${test._id}`} className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h4 className="text-lg font-semibold">{test.testName}</h4>
                    </div>
                    <div
                      className={`text-lg font-bold flex items-center gap-x-3  ${
                        test.score < 50
                          ? "text-red-400"
                          : test.score < 70
                          ? "text-orange-400"
                          : "text-[#22C55E]"
                      }`}>
                      {test.score}%
                      <BiLinkExternal className="text-[#D1D5DB]/50" />
                    </div>
                  </div>
                </Link>
              </abbr>
            ))
          )}
        </div>
        <div className="flex justify-center w-full">
          {hasMore && (
            <button
              onClick={() => loadMore()}
              className="px-5 py-2 mt-5 transition-colors duration-200 border rounded-full cursor-pointer hover:bg-white hover:text-black">
              Load More
            </button>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
