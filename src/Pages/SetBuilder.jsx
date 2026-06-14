import React, { useState } from "react";
import Orgaxios from "../Config/orgAxios"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addQuestionId } from "../Store/Reducers/Organization";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Save,
  CheckCircle2,
  Layers,
} from "lucide-react";

const questionTypes = ["text", "mcq", "voice"];
const levels = ["easy", "medium", "hard"];

const SetBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
const [testInfo, setTestInfo] = useState({
  title: "",
  category: "",
  level: "easy",
});

const [questions, setQuestions] = useState(
  Array.from({ length: 10 }, () => ({
    type: "text",
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  }))
);

const [step, setStep] = useState("test-info");
const [currentIndex, setCurrentIndex] = useState(0);

const currentQuestion = questions[currentIndex];

const handleTestInfoSubmit = (e) => {
  e.preventDefault();
  setStep("question");
};

const updateQuestion = (updatedData) => {
  setQuestions((prev) =>
    prev.map((q, i) => (i === currentIndex ? { ...q, ...updatedData } : q))
  );
};

const goToNext = () => {
  if (currentIndex < 9) setCurrentIndex((prev) => prev + 1);
};

const goToPrev = () => {
  if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
};

const handleFinalSubmit = async () => {
  try {
    const savedQuestionIds = await Promise.all(
      questions.map(async (q) => {
        const { data } = await Orgaxios.post("/test/api/questions-created", q);
        return data._id;
      })
    );

    const res = await Orgaxios.post("/test/api/set-created", {
      ...testInfo,
      questions: savedQuestionIds,
    });
    if(res.status === 201){
      toast.success("Set created successfully!");
      dispatch(addQuestionId(res.data.id));
      navigate("/org-profile");
    }
    setStep("done");
  } catch (error) {
    console.error("❌ Error submitting test:", error);
    alert("❌ Something went wrong while submitting the test.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white font-Satoshi py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/sets")}
          className="flex items-center gap-2 px-5 py-3 mb-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition">
          <ArrowLeft size={18} />
          Back to Sets
        </button>
      </div>
      <div className="bg-zinc-900/70 max-w-5xl mx-auto backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl p-8">
        <h2 className="mb-10 text-5xl font-bold text-center uppercase">
          Create Test Set
        </h2>

        {/* STEP 1: Test Info */}
        {step === "test-info" && (
          <form onSubmit={handleTestInfoSubmit} className="space-y-5">
            <div className="text-center mb-8">
              <BookOpen size={50} className="mx-auto text-sky-500 mb-4" />

              <h2 className="text-4xl font-bold">Create Test Set</h2>

              <p className="text-zinc-400 mt-2">
                Configure your interview test
              </p>
            </div>

            <div>
              <label className="text-zinc-400 text-sm">Test Title</label>

              <input
                placeholder="Frontend Interview"
                value={testInfo.title}
                onChange={(e) =>
                  setTestInfo({
                    ...testInfo,
                    title: e.target.value,
                  })
                }
                className="w-full mt-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-zinc-400 text-sm">Category</label>

              <input
                placeholder="Web Development"
                value={testInfo.category}
                onChange={(e) =>
                  setTestInfo({
                    ...testInfo,
                    category: e.target.value,
                  })
                }
                className="w-full mt-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-zinc-400 text-sm">Difficulty</label>

              <select
                value={testInfo.level}
                onChange={(e) =>
                  setTestInfo({
                    ...testInfo,
                    level: e.target.value,
                  })
                }
                className="w-full mt-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-sky-500">
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-lg hover:scale-[1.01] transition">
              Continue to Questions
            </button>
          </form>
        )}
        {/* Step 2: Questions One-by-One */}
        {step === "question" && (
          <div className="space-y-4">
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="font-medium">Progress</span>

                <span className="text-sky-400">{currentIndex + 1} / 10</span>
              </div>

              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / 10) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-5">
                Question {currentIndex + 1}
              </h3>

              <select
                value={currentQuestion.type}
                onChange={(e) =>
                  updateQuestion({
                    type: e.target.value,
                    options: ["", "", "", ""],
                  })
                }
                className="w-full mb-4 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl outline-none focus:border-sky-500">
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Enter your question..."
                value={currentQuestion.questionText}
                onChange={(e) =>
                  updateQuestion({
                    questionText: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl resize-none outline-none focus:border-sky-500"
              />

              {currentQuestion.type === "mcq" && (
                <div className="grid gap-3 mt-5">
                  {currentQuestion.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + idx)}
                      </div>

                      <input
                        value={opt}
                        placeholder={`Option ${idx + 1}`}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];

                          newOptions[idx] = e.target.value;

                          updateQuestion({
                            options: newOptions,
                          });
                        }}
                        className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl outline-none focus:border-sky-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              <textarea
                value={currentQuestion.correctAnswer}
                onChange={(e) =>
                  updateQuestion({
                    correctAnswer: e.target.value,
                  })
                }
                rows={4}
                placeholder="Correct Answer"
                className="w-full mt-5 px-4 py-3 bg-green-950/40 border border-green-600/30 rounded-xl resize-none outline-none focus:border-green-500"
              />

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition">
                  <div className="flex justify-center items-center gap-2">
                    <ChevronLeft size={18} />
                    Previous
                  </div>
                </button>

                {currentIndex === 9 ? (
                  <button
                    onClick={handleFinalSubmit}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold">
                    <div className="flex justify-center items-center gap-2">
                      <Save size={18} />
                      Create Test Set
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goToNext}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600">
                    <div className="flex justify-center items-center gap-2">
                      Next
                      <ChevronRight size={18} />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-10">
            <CheckCircle2 size={80} className="mx-auto text-green-500 mb-5" />

            <h2 className="text-3xl font-bold mb-3">Test Set Created!</h2>

            <p className="text-zinc-400">Your interview test is ready.</p>

            <button
              onClick={() => navigate("/sets")}
              className="mt-8 px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 transition">
              Back to Sets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetBuilder;
