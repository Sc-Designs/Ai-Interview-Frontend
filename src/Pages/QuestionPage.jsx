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
  const dispatch = useDispatch();
  const number = useSelector((state) => state.CameraDetectReducer);
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    dispatch(resetNumber());
  }, [navigate]);

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
    try {
      setIsCameraOn(false);
      navigate("/test");
      toast.success("Test submitted 🎉 Score ready in 2–5 min.");
      await Axios.post("/ai/api/test-feddback", { id, answers });
    } catch (err) {
      toast.error("Something went wrong, try again!");
      console.log(err);
    }
  };

  const handelPrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
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
        return <p className="text-white/40">Unknown question type.</p>;
    }
  };

  const attemptsLeft = 5 - number;
  const progress = questions.length
    ? Math.round(((currentIndex + 1) / questions.length) * 100)
    : 0;

  return (
    <section
      className="relative min-h-screen text-[#E8EDF5] font-sans"
      style={{ background: "#0A0F1E" }}>
      {/* Background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => navigate("/test")}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-cyan-400 transition-all duration-200 hover:bg-cyan-400/10 active:scale-95"
          style={{ border: "1px solid rgba(0,212,255,0.25)" }}>
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest text-white/35 font-medium">
            Attempts left
          </span>
          <span
            className={`text-sm font-bold px-3 py-0.5 rounded-full tabular-nums ${
              attemptsLeft <= 2
                ? "text-red-400 bg-red-400/10"
                : "text-amber-400 bg-amber-400/10"
            }`}
            style={{
              border: `1px solid ${attemptsLeft <= 2 ? "rgba(248,113,113,0.25)" : "rgba(251,191,36,0.25)"}`,
            }}>
            {attemptsLeft} / 5
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-0.5 bg-white/5">
        <div
          className="h-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main grid */}
      <div className="relative z-10 grid max-w-6xl gap-5 px-4 py-6 mx-auto lg:grid-cols-2">
        {/* Left — camera + navigator */}
        <div className="flex flex-col gap-4">
          {/* Camera card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(20,25,41,0.88)",
              border: "1px solid rgba(0,212,255,0.12)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}>
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span
                className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                style={{ boxShadow: "0 0 6px #4ade80" }}
              />
              <span className="text-[11px] uppercase tracking-widest font-semibold text-white/40">
                Live Camera
              </span>
            </div>
            <div className="p-3">
              <FacePresenceCheck value={isCameraOn} />
            </div>
          </div>

          {/* Question navigator */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(20,25,41,0.88)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-white/35 mb-3">
              Questions
            </p>
            <div className="grid grid-cols-8 gap-2">
              {questions.map((q, i) => {
                const answered = answers.some(
                  (a) => a.questionId === q._id && a.answer,
                );
                const isCurrent = currentIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`aspect-square rounded-lg text-sm font-bold transition-all duration-150 active:scale-95 ${
                      isCurrent
                        ? "text-[#0A0F1E] bg-cyan-400"
                        : answered
                          ? "text-green-400 bg-green-400/10"
                          : "text-white/50 bg-white/5 hover:bg-white/10"
                    }`}
                    style={{
                      border: isCurrent
                        ? "none"
                        : answered
                          ? "1px solid rgba(74,222,128,0.25)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}>
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div
              className="flex items-center gap-4 mt-4 pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex items-center gap-1.5 text-[11px] text-white/35">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Current
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-white/35">
                <span className="w-2.5 h-2.5 rounded-sm bg-green-400/20 border border-green-400/30" />{" "}
                Answered
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-white/35">
                <span className="w-2.5 h-2.5 rounded-sm bg-white/5 border border-white/10" />{" "}
                Pending
              </span>
            </div>
          </div>
        </div>

        {/* Right — question panel */}
        <div
          className="rounded-2xl flex flex-col min-h-[500px]"
          style={{
            background: "rgba(20,25,41,0.88)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}>
          {questions.length > 0 && (
            <>
              {/* Question header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-white/35">
                    Question
                  </span>
                  <span className="text-sm font-bold text-cyan-400 tabular-nums">
                    {currentIndex + 1}
                    <span className="text-white/25 font-normal">
                      {" "}
                      / {questions.length}
                    </span>
                  </span>
                </div>
                <span
                  className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                  style={{
                    background:
                      questions[currentIndex]?.type === "voice"
                        ? "rgba(168,85,247,0.12)"
                        : questions[currentIndex]?.type === "mcq"
                          ? "rgba(0,212,255,0.1)"
                          : "rgba(74,222,128,0.1)",
                    color:
                      questions[currentIndex]?.type === "voice"
                        ? "#c084fc"
                        : questions[currentIndex]?.type === "mcq"
                          ? "#00D4FF"
                          : "#4ade80",
                    border:
                      questions[currentIndex]?.type === "voice"
                        ? "1px solid rgba(168,85,247,0.25)"
                        : questions[currentIndex]?.type === "mcq"
                          ? "1px solid rgba(0,212,255,0.2)"
                          : "1px solid rgba(74,222,128,0.2)",
                  }}>
                  {questions[currentIndex]?.type}
                </span>
              </div>

              {/* Question body */}
              <div className="flex-1 px-6 py-6 overflow-y-auto">
                {renderQuestion()}
              </div>

              {/* Navigation footer */}
              <div
                className="px-6 py-4 flex gap-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  onClick={handelPrev}
                  disabled={currentIndex === 0}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(232,237,245,0.7)",
                    background: "rgba(255,255,255,0.04)",
                  }}>
                  ← Previous
                </button>
                <button
                  onClick={handleNextOrSubmit}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                    currentIndex === questions.length - 1
                      ? "text-[#0A0F1E] bg-green-400 hover:bg-green-300"
                      : "text-[#0A0F1E] bg-cyan-400 hover:bg-cyan-300"
                  }`}>
                  {currentIndex === questions.length - 1
                    ? "Submit Test ✓"
                    : "Next →"}
                </button>
              </div>
            </>
          )}

          {questions.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-white/25 text-sm">
              Loading questions…
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuestionPage;
