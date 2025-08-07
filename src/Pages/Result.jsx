import React, { useEffect, useState } from 'react'
import Axios from "../Config/Axios"
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from "../Components/Navbar";
import Markdown from "markdown-to-jsx";
import ShinyText from '../Components/ShinyText';
const Result = () => {
    const {id} = useParams();
    const [questions, setQuestions] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(()=>{
        const getAnswer = async()=>{
        try{
        const res = await Axios.get(`/result/sending-result/${id}`);
        if(res.status === 200){
            toast.success("Result is Coming! 🎉");
            console.log(res.data)
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
    <div className="w-full min-h-screen text-white bg-black">
      <Navbar />
      <div className="w-full min-h-screen px-5 pt-25 md:px-10 font-Okomito">
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
            <div className="p-6 mt-5 border font-Satoshi bg-zinc-950 border-white/50 rounded-2xl">
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
              <div className="px-5 py-4 mt-4 border-l-4 rounded-lg bg-zinc-900">
                <h4 className="text-xl">🤖 Ai FeedBack :</h4>
                <p className="px-4">
                    <ShinyText
                      text={currentQuestion.feedback}
                      disabled={false}
                      speed={8}
                      className="text-lg font-medium uppercase custom-class font-Satoshi"
                    />
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  className="px-4 py-2 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-500 disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}>
                  ⇐ Prev
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-500 disabled:opacity-50"
                  onClick={handleNext}
                  disabled={
                    currentIndex === questions.questionResults.length - 1
                  }>
                  Next ⇒
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