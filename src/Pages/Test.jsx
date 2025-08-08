import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import InfiniteScroll from "react-infinite-scroll-component";
import Axios from "../Config/Axios";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [query, setQuery] = useState("");
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;
  const navigate = useNavigate();

  const fetchData = async (reset = false) => {
    try {
      const res = await Axios.get(
        `/test/send-test-questions?start=${
          reset ? 0 : start
        }&limit=${limit}&query=${query}`
      );
      setQuestions((prev) =>
        reset ? res.data.questions : [...prev, ...res.data.questions]
      );
      setStart(res.data.nextStart || 0);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setStart(0);
      fetchData(true); 
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-[#0A0A0A] text-[#FFF] pt-22 px-8 font-Okomito">
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
          className="w-full px-6 py-2 text-xl border rounded-full outline-none border-white/50"
        />

        <InfiniteScroll
          dataLength={questions.length}
          next={fetchData}
          hasMore={hasMore}
          loader={
            <h4 className="text-center text-white">Loading more sets...</h4>
          }
          endMessage={
            <div className="bg-black border text-2xl duration-200 border-white/50 flex justify-center items-center cursor-pointer hover:-translate-y-1.5 px-4 py-4 rounded-2xl">
              <p className="text-center text-gray-400 ">
                🎉 No more sets left!
              </p>
            </div>
          }
          className="grid w-full gap-8 mx-auto py-7 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-black hover:bg-slate-950 border border-white/50 duration-200 cursor-pointer flex flex-col items-start justify-between hover:-translate-y-1.5 px-4 py-4 hover:rounded-tr-3xl hover:rounded-bl-3xl hover:rounded-tl-none hover:rounded-br-none rounded-tl-3xl rounded-br-3xl">
              <h2 className="mb-4 text-3xl font-bold text-white">
                {q.title || "Test Set"}
              </h2>
              <p className="text-[#F1F5F9] mb-1 font-medium">
                Level :{" "}
                <span
                  className={`${
                    q.level === "easy"
                      ? "text-green-400"
                      : q.level === "medium"
                      ? "text-orange-400"
                      : "text-red-500"
                  } uppercase tracking-wide`}>
                  {q.level}
                </span>
              </p>
              <p className="text-[#D1D5DB] mb-1">
                📝 {q.questions?.length || 0} Questions
              </p>
              <p className="text-[#D1D5DB] mb-1">
                Category:{" "}
                <span className="px-4 py-1 rounded bg-zinc-700">
                  {q.category}
                </span>
              </p>
              <p className="text-[#D1D5DB]">By : {q.owner}</p>
              <button
                onClick={() => navigate(`/testMicAndCamera/${q._id}`)}
                className="mt-4 bg-[#41464f] text-white px-4 py-2 rounded-xl hover:bg-[#465062] transition text-sm">
                Start Practice
              </button>
            </div>
          ))}
        </InfiniteScroll>
      </section>
      <Footer />
    </div>
  );
};

export default Test;
