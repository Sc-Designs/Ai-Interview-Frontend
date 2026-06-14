import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrgAxios from "../Config/orgAxios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Save,
  BookOpen,
  Layers,
  Tag,
  CheckCircle,
} from "lucide-react";

const EditTest = () => {
  const { testId } = useParams();
  const { register, handleSubmit, setValue, getValues, watch, reset } =
    useForm();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const watchType = watch("type");
  const navigate = useNavigate();

  // Ensure options array always has 4 slots
  const ensureFourOptions = (options) => {
    return [...(options || []), "", "", "", ""].slice(0, 4);
  };

  // load test and normalize questions
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await OrgAxios.get(`/test/api/set-update/${testId}`);

        // normalize questions to always have options array (4 slots)
        const normalized = (data.questions || []).map((q) => ({
          ...q,
          options: ensureFourOptions(q.options),
          questionText: q.questionText ?? "",
          type: q.type ?? "text",
          correctAnswer: q.correctAnswer ?? "",
        }));

        setQuestions(normalized);

        // set top-level fields
        setValue("title", data.name || "");
        setValue("level", data.level || "easy");
        setValue("category", data.category || "");

        // reset form with first question
        reset({
          title: data.name || "",
          level: data.level || "easy",
          category: data.category || "",
          ...normalized[0],
        });
      } catch (err) {
        console.error("Error fetching test:", err);
      }
    };
    fetchTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, reset, setValue]);

  // Build the question object out of current form values
  const buildCurrentQuestionFromForm = () => {
    const values = getValues();
    return {
      ...questions[currentIndex],
      questionText: values.questionText ?? "",
      type: values.type ?? "text",
      options:
        values.type === "mcq"
          ? ensureFourOptions(values.options)
          : questions[currentIndex].options || ["", "", "", ""],
      correctAnswer: values.correctAnswer ?? "",
    };
  };

  // Update questions array synchronously and return updated array
  const updateQuestionsArrayAtIndex = (idx, questionObj) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], ...questionObj };
    setQuestions(updated);
    return updated;
  };

  const goNext = () => {
    const currentQ = buildCurrentQuestionFromForm();
    const updated = updateQuestionsArrayAtIndex(currentIndex, currentQ);

    if (currentIndex < updated.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      const nextQ = updated[nextIndex] || {
        questionText: "",
        type: "text",
        options: ["", "", "", ""],
        correctAnswer: "",
      };

      reset({
        title: getValues("title") || "",
        level: getValues("level") || "easy",
        category: getValues("category") || "",
        questionText: nextQ.questionText || "",
        type: nextQ.type || "text",
        options: ensureFourOptions(nextQ.options),
        correctAnswer: nextQ.correctAnswer || "",
      });
    }
  };

  const goPrev = () => {
    const currentQ = buildCurrentQuestionFromForm();
    const updated = updateQuestionsArrayAtIndex(currentIndex, currentQ);

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);

      const prevQ = updated[prevIndex] || {
        questionText: "",
        type: "text",
        options: ["", "", "", ""],
        correctAnswer: "",
      };

      reset({
        title: getValues("title") || "",
        level: getValues("level") || "easy",
        category: getValues("category") || "",
        questionText: prevQ.questionText || "",
        type: prevQ.type || "text",
        options: ensureFourOptions(prevQ.options),
        correctAnswer: prevQ.correctAnswer || "",
      });
    }
  };

  // Save all updates (ensure last edit is captured)
  const onSubmit = async (formData) => {
    // update current question before submit
    const currentQ = buildCurrentQuestionFromForm();
    const updated = updateQuestionsArrayAtIndex(currentIndex, currentQ);

    try {
      await OrgAxios.put("/test/api/edit", {
        id: testId,
        title: formData.title,
        level: formData.level,
        category: formData.category,
        updatedQuestions: updated,
      });

      toast.success("Test updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving test:", error);
      toast.error("Something went wrong");
    }
  };

  if (!questions.length) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white font-Satoshi py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all">
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="text-right">
            <h1 className="text-4xl font-bold">Edit Test Set</h1>
            <p className="text-zinc-400">Update questions and configuration</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl p-6 lg:p-8">
          {/* Test Info */}
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-5">
              <BookOpen size={20} />
              Test Information
            </h2>

            <div className="grid lg:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-zinc-400">Test Title</label>
                <input
                  {...register("title")}
                  placeholder="Enter test title"
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Category</label>
                <input
                  {...register("category")}
                  placeholder="Category"
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">
                  Difficulty Level
                </label>

                <select
                  {...register("level")}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-zinc-400">Question Type</label>

                <select
                  {...register("type")}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500">
                  <option value="text">Text</option>
                  <option value="mcq">MCQ</option>
                  <option value="voice">Voice</option>
                </select>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <span className="font-medium">Question Progress</span>

              <span className="text-sky-400 font-semibold">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Dots */}
            <div className="flex flex-wrap gap-2 mt-4">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const currentQ = buildCurrentQuestionFromForm();

                    const updated = updateQuestionsArrayAtIndex(
                      currentIndex,
                      currentQ,
                    );

                    setCurrentIndex(idx);

                    const q = updated[idx];

                    reset({
                      title: getValues("title"),
                      level: getValues("level"),
                      category: getValues("category"),
                      questionText: q.questionText || "",
                      type: q.type || "text",
                      options: ensureFourOptions(q.options),
                      correctAnswer: q.correctAnswer || "",
                    });
                  }}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all
                ${
                  idx === currentIndex
                    ? "bg-sky-600 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}>
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-5">
              Question #{currentIndex + 1}
            </h3>

            <textarea
              {...register("questionText")}
              rows={4}
              placeholder="Enter your question..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 resize-none outline-none focus:border-sky-500"
            />

            {watchType === "mcq" && (
              <div className="mt-6">
                <h4 className="flex items-center gap-2 text-lg mb-4">
                  <Layers size={18} />
                  Options
                </h4>

                <div className="grid gap-3">
                  {ensureFourOptions(getValues("options")).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + idx)}
                      </div>

                      <input
                        {...register(`options.${idx}`)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="text-green-400 font-medium">
                    Correct Answer
                  </label>

                  <input
                    {...register("correctAnswer")}
                    placeholder="Correct Answer"
                    className="w-full mt-2 bg-green-950/40 border border-green-600/30 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>
              </div>
            )}

            {(watchType === "text" || watchType === "voice") && (
              <div className="mt-6">
                <label className="flex items-center gap-2 text-green-400 font-medium mb-2">
                  <CheckCircle size={18} />
                  Correct Answer
                </label>

                <textarea
                  {...register("correctAnswer")}
                  rows={6}
                  placeholder="Enter correct answer..."
                  className="w-full bg-green-950/40 border border-green-600/30 rounded-xl px-4 py-3 resize-none outline-none focus:border-green-500"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={goPrev}
              className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 transition">
              <ChevronLeft size={18} />
              Previous
            </button>

            <button
              type="button"
              disabled={currentIndex === questions.length - 1}
              onClick={goNext}
              className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 transition">
              Next
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Save */}
          <button
            type="submit"
            className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-[1.01] transition-all font-semibold text-lg">
            <Save size={20} />
            Save Test Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTest;
