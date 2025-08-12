import React, { useEffect, useState } from "react";
import FacePresenceCheck from "../Components/FacePresenceCheck";
import { useDispatch, useSelector } from "react-redux";
import TextQuestion from "../Components/TextQuestion";
import MCQQuestion from "../Components/MCQQuestion";
import VoiceQuestion from "../Components/VoiceQuestion";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../Config/Axios";
import { resetNumber } from "../Store/Reducers/CameraDetechtionReducer";
import { toast } from "react-toastify";

const QuestionPage = () => {
  const dispatch = useDispatch()
  const number = useSelector((state) => state.CameraDetectReducer);
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate()
  const [isCameraOn, setIsCameraOn] = useState(true)
  useEffect(()=>{
    dispatch(resetNumber())
  },[navigate])
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await Axios.get(`/test/api/question/${id}`);
      setQuestions(res.data.questions);
    };
    fetchQuestions();
  }, [id]);
  const handleAnswerChange = (questionId, answer) => {
    const updated = [...answers];
    const index = updated.findIndex((a) => a.questionId === questionId);
    if (index !== -1) {
      updated[index].answer = answer;
    } else {
      updated.push({ questionId, answer });
    }
    setAnswers(updated);
  };

  const handleNextOrSubmit = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try{
      setIsCameraOn(false);
      navigate("/test");
      toast.success("Test Submited 🎉. It take 2-5 min to get the score.");
      await Axios.post("/ai/api/test-feddback", {
        id,
        answers,
      });
    }catch(err){
      toast.error("Something went wrong, try again!");
      console.log(err);
    }
  };

  const handelPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const renderQuestion = () => {
    const current = questions[currentIndex];
    const currentAnswer =
      answers.find((a) => a.questionId === current._id)?.answer || "";
    switch (current.type) {
      case "text":
        return (
          <TextQuestion
            question={current}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
          />
        );
      case "mcq":
        return (
          <MCQQuestion
            question={current}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
          />
        );
      case "voice":
        return (
          <VoiceQuestion
            question={current}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
          />
        );
      default:
        return <p>Unknown question type.</p>;
    }
  };

  const JumpQuestion = (i)=>{
    setCurrentIndex(i);
  }

  return (
    <section className="min-h-screen relative bg-black text-[#F1F5F9] py-16 px-6 font-Okomito">
      <div
        onClick={() => navigate("/test")}
        className="absolute px-4 py-2 duration-200 bg-blue-400 rounded cursor-pointer hover:bg-blue-500 left-3 top-3">
        <h1 className="pointer-events-none">← Back to Test Section</h1>
      </div>
      <div className="absolute px-4 py-2 bg-red-400 rounded right-3 top-3">
        <h1>Attempts left: {5 - number}</h1>
      </div>
      <div className="grid max-w-5xl gap-10 mx-auto lg:grid-cols-2">
        <div className="w-full px-4 py-2 border rounded-lg bg-zinc-900/60 border-white/50">
          <h2 className="mb-2 text-xl font-semibold">Your Camera</h2>
          <FacePresenceCheck value={isCameraOn} />
          <div className="grid w-full grid-cols-7 gap-2 px-4 py-4 mt-6 mb-4 border rounded border-white/50 bg-zinc-800">
            <h1 className="col-span-7 mb-2 text-2xl">The Questions No. :</h1>
            {questions.map((_, i) => (
              <h1
                onClick={() => JumpQuestion(i)}
                key={i}
                className={`${
                  currentIndex === i ? "bg-black" : "bg-black/50"
                } px-2 py-2 rounded hover:bg-black duration-200 cursor-pointer text-center`}>
                {i + 1}
              </h1>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between px-4 py-10 border rounded-lg border-white/50 bg-zinc-900/60 gap-y-4">
          {questions.length > 0 && (
            <>
              <h2 className="text-xl">
                Question{" "}
                <span className="text-green-400">{currentIndex + 1}</span> /{" "}
                {questions.length}
              </h2>
              {renderQuestion()}
              <div className="flex w-full gap-x-2">
                <button
                  onClick={handelPrev}
                  className="w-full py-2 mt-4 duration-200 rounded cursor-pointer bg-sky-400 hover:bg-sky-600">
                  Previous
                </button>
                <button
                  onClick={handleNextOrSubmit}
                  className={`w-full py-2 mt-4 duration-200 ${
                    currentIndex === questions.length - 1
                      ? "bg-green-400 hover:bg-green-600"
                      : "bg-sky-400 hover:bg-sky-600"
                  } rounded cursor-pointer`}>
                  {currentIndex === questions.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuestionPage;
