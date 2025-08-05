import React, { useState } from "react";
import Orgaxios from "../Config/orgAxios"
import { useNavigate } from 'react-router-dom';

const questionTypes = ["text", "mcq", "voice"];
const levels = ["easy", "medium", "hard"];

const SetBuilder = () => {
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
        const { data } = await Orgaxios.post("/test/questions-created", q);
        return data._id;
      })
    );

    const { data: final } = await Orgaxios.post("/test/set-created", {
      ...testInfo,
      questions: savedQuestionIds,
    });

    setStep("done");
  } catch (error) {
    console.error("❌ Error submitting test:", error);
    alert("❌ Something went wrong while submitting the test.");
  }
};


  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-black font-Satoshi">
      <button
        onClick={()=>navigate("/sets")}
        className="absolute px-5 py-2 text-white rounded left-2 top-2 bg-sky-500">
        ⬅ Back to Sets
      </button>
      <div className="px-6 py-10 text-white w-[40%] rounded-2xl bg-zinc-900">
        <h2 className="mb-10 text-5xl font-bold text-center uppercase">
          Create Test Set
        </h2>

        {/* STEP 1: Test Info */}
        {step === "test-info" && (
          <form
            onSubmit={handleTestInfoSubmit}
            className="flex flex-col w-full gap-y-5">
            <input
              placeholder="Test Title"
              value={testInfo.title}
              onChange={(e) =>
                setTestInfo({ ...testInfo, title: e.target.value })
              }
              className="w-full p-3 rounded outline-none bg-zinc-800"
              required
            />
            <input
              placeholder="Category"
              value={testInfo.category}
              onChange={(e) =>
                setTestInfo({ ...testInfo, category: e.target.value })
              }
              className="w-full p-3 rounded outline-none bg-zinc-800"
              required
            />
            <select
              value={testInfo.level}
              onChange={(e) =>
                setTestInfo({ ...testInfo, level: e.target.value })
              }
              className="w-full p-3 rounded outline-none bg-zinc-800">
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl.toUpperCase()}
                </option>
              ))}
            </select>

            <button
              className="w-full p-3 font-bold transition-colors duration-200 bg-green-500 rounded cursor-pointer hover:bg-green-700"
              type="submit">
              Next: Add Questions
            </button>
          </form>
        )}
        {/* Step 2: Questions One-by-One */}
        {step === "question" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Question {currentIndex + 1} of 10
            </h3>

            <select
              value={currentQuestion.type}
              onChange={(e) =>
                updateQuestion({
                  type: e.target.value,
                  options: ["", "", "", ""],
                })
              }
              className="w-full p-3 rounded outline-none bg-zinc-800">
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>

            <input
              placeholder="Question Text"
              value={currentQuestion.questionText}
              onChange={(e) => updateQuestion({ questionText: e.target.value })}
              className="w-full p-3 rounded outline-none bg-zinc-800"
              required
            />

            {currentQuestion.type === "mcq" && (
              <div className="space-y-2">
                {currentQuestion.options.map((opt, idx) => (
                  <input
                    key={idx}
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[idx] = e.target.value;
                      updateQuestion({ options: newOptions });
                    }}
                    className="w-full p-2 rounded outline-none bg-zinc-700"
                  />
                ))}
              </div>
            )}

            <input
              placeholder="Correct Answer"
              value={currentQuestion.correctAnswer}
              onChange={(e) =>
                updateQuestion({ correctAnswer: e.target.value })
              }
              className="w-full p-3 bg-green-700 rounded outline-none"
              required
            />

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className={`w-full p-3 rounded font-bold ${
                  currentIndex === 0
                    ? "bg-zinc-600 pointer-events-none"
                    : "bg-sky-500 pointer-events-auto"
                }`}>
                ⬅ Prev
              </button>
              {currentIndex === 9 ? (
                <button
                  onClick={handleFinalSubmit}
                  className="w-full p-3 font-bold bg-green-600 rounded">
                  ✅ Submit Set
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goToNext}
                  className="w-full p-3 font-bold rounded bg-sky-500">
                  Next ➡
                </button>
              )}
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-3 text-center">
            <h3 className="text-xl font-bold text-green-400">
              🎉 Test Set Created Successfully!
            </h3>
            <p className="text-sm text-gray-400">
              You can now create another set.
            </p>
            <button
              onClick={()=>navigate("/sets")}
              className="px-5 py-2 mt-4 transition-colors duration-200 rounded cursor-pointer bg-sky-500 hover:bg-sky-600">
              Go Back to sets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetBuilder;
