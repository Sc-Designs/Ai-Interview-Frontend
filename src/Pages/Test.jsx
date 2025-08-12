import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../Config/Axios";
import { useNavigate } from "react-router-dom";
import animationData from "../assets/handLoading.json"
import Lottie from "lottie-react";
import TestCard from "../Components/TestCard";

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [query, setQuery] = useState("");
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 6;
  const navigate = useNavigate();

  const fetchData = async (reset = false) => {
    try {
      const res = await Axios.get(
        `/test/api/send-test-questions?start=${
          reset ? 0 : start
        }&limit=${limit}&query=${query}`
      );
      setQuestions((prev) =>
        reset ? res.data.questions : [...prev, ...res.data.questions]
      );
      setStart(res.data.nextStart || 0);
      setHasMore(res.data.hasMore);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(true);
      setStart(0);
      fetchData(true); 
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div>
      <img
        className="fixed top-0 left-0 z-10 w-full h-screen object-cover brightness-85"
        src="./bg.avif"
        alt=""
      />
      <Navbar />
      <section className="min-h-screen relative z-20 text-[#FFF] pt-26 px-8 font-Okomito">
        <div className="mb-5 text-center">
          <h1 className="text-5xl font-bold">Choose Your Interview Set</h1>
          <p className="text-[#D1D5DB] mt-4 max-w-2xl mx-auto">
            Select a test set based on your role and level. Each test is
            tailored to give you a real interview experience.
          </p>
        </div>

        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder="🔍 Search Question by name or category"
          type="text"
          className="sticky z-30 w-full px-6 py-2 text-xl border rounded-full outline-none top-5 backdrop-blur-3xl border-white/50"
        />
        {isLoading && (
          <div className="absolute z-40 flex items-center justify-center w-full h-screen -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">
            <Lottie animationData={animationData} loop={true} />
          </div>
        )}
        <InfiniteScroll
          dataLength={questions.length}
          next={fetchData}
          hasMore={hasMore}
          loader={
            <h4 className="text-center text-white">Loading more sets...</h4>
          }
          endMessage={
            <div className="bg-black/40 backdrop-blur-xl border text-2xl duration-200 border-white/50 flex justify-center items-center cursor-pointer hover:-translate-y-1.5 px-4 py-4 rounded-2xl">
              <p className="text-center text-gray-400 ">
                🎉 No more sets left!
              </p>
            </div>
          }
          className="grid w-full gap-8 mx-auto py-7 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((q, i) => (
            <TestCard
              key={i}
              q={q}
              onClick={() => navigate(`/testMicAndCamera/${q._id}`)}
            />
          ))}
        </InfiniteScroll>
      </section>
      <Footer />
    </div>
  );
};

export default Test;
