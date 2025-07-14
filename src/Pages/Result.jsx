import React, { useEffect, useState } from 'react'
import Axios from "../Config/Axios"
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from "../Components/Navbar";
import Markdown from "markdown-to-jsx";
const Result = () => {
    const {id} = useParams();
    const [questions, setQuestions] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(()=>{
        const getAnswer = async()=>{
        try{
        const res = await Axios.get(`/result/${id}`);
        if(res.status === 200){
            toast.success("Result is Coming! 🎉");
            setQuestions(res.data)
        }
        }catch(err){
            toast.error("Something went wrong, Please try again later!")
        }
    }
    getAnswer();
    },[])
    const currentQuestion = questions?.questionResults?.[currentIndex];
    const handleNext = () => {
      if (currentIndex < questions.questionResults.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    const handlePrev = () => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };
  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <div className="w-full min-h-screen px-5 py-15 md:px-10 font-Okomito">
        <h1 className="text-2xl">
          Set Name is :{" "}
          <span className="text-[#FFF] italic">" {questions?.testName} "</span>
        </h1>
        <h1 className="text-2xl">
          Set Score is :{" "}
          <span
            className={`${
              questions?.score < 50
                ? "text-rose-400"
                : questions?.score < 70
                ? "text-orange-400"
                : "text-green-400"
            } font-mono`}>
            {questions?.score}
          </span>
        </h1>
        <div>
          {currentQuestion && (
            <div className="mt-10 bg-[#282525] rounded-2xl p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">
                Question {currentIndex + 1} of{" "}
                {questions.questionResults.length}
              </h2>
              <p className="mb-3 text-2xl">
                <span className="text-[#FFF]">Q:</span>{" "}
                {currentQuestion.questionText}
              </p>
              <p className="mb-1 text-xl">
                <span className="text-gray-400 ">Your Answer:</span>{" "}
                <span className="text-white">
                  " {currentQuestion.userAnswer} "
                </span>
              </p>
              <p className="mb-1 text-xl">
                <span className="text-gray-400">Correct Answer:</span>{" "}
                <span className="text-green-400">
                  {currentQuestion.correctAnswer}
                </span>
              </p>
              {currentQuestion.score != null && (
                <p className="mb-1 text-xl">
                  <span className="text-gray-400">Score:</span>{" "}
                  <span
                    className={`${
                      currentQuestion.score < 5
                        ? "text-rose-400"
                        : questions?.score < 7
                        ? "text-orange-400"
                        : "text-green-400"
                    }`}>
                    {currentQuestion.score}
                  </span>
                </p>
              )}
              <div className="bg-[#1d1c1b] mt-4 px-5 py-2 rounded-lg border-l-4">
                <h4 className="text-xl">🤖 Ai FeedBack :</h4>
                <p className="px-4">
                  <Markdown className="text-gray-400">
                    {currentQuestion.feedback}
                  </Markdown>
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  className="px-4 py-2 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-500 disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}>
                  ⬅️ Prev
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-500 disabled:opacity-50"
                  onClick={handleNext}
                  disabled={
                    currentIndex === questions.questionResults.length - 1
                  }>
                  Next ➡️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Result