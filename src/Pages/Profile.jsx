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
  const { user } = useSelector((state) => state.UersReducer);
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
    const res = await Axios.get("/user/log-out");
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
      const res = await Axios.get("/result/default-result");
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
       `/result/default-result?start=${result.length}`
     );
     setresult((prev) => [...prev, ...res.data.results]);
     sethasMore(res.data.hasMore);
   } catch (err) {
     console.error(err);
   }
  }
  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-[#0A0A0A] text-[#FFF] py-25 px-6 font-Okomito">
        <div className="max-w-4xl mx-auto bg-[#292524] p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-md">
          <img
            src={
              userDets?.profileImage ||
              "https://images.unsplash.com/photo-1723394212824-a59ce1e2f09a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={userDets.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-[#FFF]"
          />
          <div className="text-center md:text-left">
            <h1 className="mb-1 text-3xl font-bold">{userDets.name}</h1>
            <p className="text-[#D1D5DB]">Email: {userDets.email}</p>
            <p className="text-sm text-[#D1D5DB] mt-1">Role: {userDets.role}</p>
            <p className="text-sm text-[#D1D5DB]">
              Joined:{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4 md:justify-start">
              <button
                onClick={() => navigate("/profile-edit")}
                className="bg-[#131313] text-white px-5 py-2 rounded-xl hover:bg-red-950 transition text-sm">
                Edit Profile
              </button>
              <button
                onClick={LogOut}
                className="px-5 py-2 text-sm text-red-500 transition border border-red-500 rounded-xl hover:bg-red-600 hover:text-white">
                Logout
              </button>
              <button
                onClick={() => navigate("/ai")}
                className="bg-[#131313] text-white px-5 py-2 rounded-xl hover:bg-red-950 transition text-sm">
                Interview Prep. with AI
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid max-w-4xl grid-cols-1 gap-6 mx-auto mt-10 text-center md:grid-cols-3">
          <div className="bg-[#292524] p-6 rounded-xl border-l-4 border-[#FFF]">
            <h3 className="text-lg text-[#D1D5DB] mb-1">Total Tests</h3>
            <p className="text-3xl font-bold">{userDets.result.length}</p>
          </div>
          <div className="bg-[#292524] p-6 rounded-xl border-l-4 border-[#22C55E]">
            <h3 className="text-lg text-[#D1D5DB] mb-1">Average Score</h3>
            <p className="text-3xl font-bold">{avgScore}%</p>
          </div>
          <div className="bg-[#292524] p-6 rounded-xl border-l-4 border-[#FFF]">
            <h3 className="text-lg text-[#D1D5DB] mb-1">Best Score</h3>
            <p className="text-3xl font-bold">{score}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-4 mx-auto mt-12 w-[65vw]">
          <h2 className="w-full text-2xl font-bold text-left">
            Previous Tests
          </h2>
          <div className="flex flex-col w-full gap-y-4">
            {result.length === 0 ? (
              <h1 className="text-[#D1D5DB] text-lg ml-5">
                You have No Test Result.
              </h1>
            ) : (
              result.map((test) => (
                <abbr
                  key={test._id}
                  title="See Result"
                  className="bg-[#292524] no-underline p-5 rounded-xl flex  hover:shadow-xl hover:-translate-y-1.5 hover:scale-102 transition">
                  <Link to={`/result/${test._id}`} className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {test.testName}
                        </h4>
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
          {hasMore && 
            <button
            onClick={() => loadMore()}
            className="px-5 py-2 mt-5 transition-colors duration-200 border rounded-full cursor-pointer hover:bg-white hover:text-black">
              Load More
            </button>
          }
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
