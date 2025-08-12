import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrgAxios from "../Config/orgAxios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";

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
    <div className="flex items-center justify-center w-full min-h-screen py-4 bg-black font-Satoshi">
      <button
        onClick={() => navigate(-1)}
        className="fixed px-6 py-1 text-white rounded top-2 left-2 bg-sky-500">
        ⇐ Back
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-2 border border-white/50 w-[90%] lg:w-[50vw] px-5 py-5 text-white rounded bg-zinc-900/60">
        <h2 className="mb-3 text-4xl">Edit Set</h2>

        {/* Test Info */}
        <input
          {...register("title")}
          className="px-2 py-1 border rounded outline-none border-white/50"
          placeholder="Set Title"
        />
        <div className="flex gap-x-5">
          <div className="w-full">
            <h1>Level of Set</h1>
            <select
              {...register("level")}
              className="w-full px-2 py-1 bg-black border rounded outline-none border-white/50">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="w-full">
            <h1>Type of Answer</h1>
            <select
              {...register("type")}
              className="w-full px-2 py-1 bg-black border rounded outline-none border-white/50">
              <option value="text">Text</option>
              <option value="mcq">MCQ</option>
              <option value="voice">Voice</option>
            </select>
          </div>
        </div>

        <h1>Category</h1>
        <input
          {...register("category")}
          className="px-2 py-1 border rounded outline-none border-white/50"
          placeholder="Category"
        />

        {/* Question Section */}
        <p>
          Question <span className="text-green-400">{currentIndex + 1}</span> /{" "}
          {questions.length}
        </p>

        <h1>Question</h1>
        <input
          {...register("questionText")}
          className="px-2 py-1 border rounded outline-none border-white/50"
          placeholder="Question text"
        />

        {watchType === "mcq" && (
          <div className="flex flex-col gap-y-2">
            <h4>Options</h4>
            {ensureFourOptions(getValues("options")).map((opt, idx) => (
              <input
                key={idx}
                {...register(`options.${idx}`)}
                placeholder={`Option ${idx + 1}`}
                className="px-2 py-1 border rounded outline-none border-white/50"
              />
            ))}

            <h1 className="mt-2">Answer</h1>
            <input
              {...register("correctAnswer")}
              className="px-2 py-1 bg-green-700 rounded outline-none"
              placeholder="Correct Answer"
            />
          </div>
        )}

        {(watchType === "text" || watchType === "voice") && (
          <>
            <h1>Answer</h1>
            <textarea
              {...register("correctAnswer")}
              className="h-40 px-2 py-1 bg-green-700 rounded outline-none resize-none"
              placeholder="Correct Answer"
            />
          </>
        )}

        {/* Navigation */}
        <div className="flex mt-3 gap-x-5">
          <button
            className="w-full py-1 rounded bg-sky-600"
            type="button"
            disabled={currentIndex === 0}
            onClick={goPrev}>
            Previous
          </button>
          <button
            className="w-full py-1 rounded bg-sky-600"
            type="button"
            disabled={currentIndex === questions.length - 1}
            onClick={goNext}>
            Next
          </button>
        </div>

        {/* Save */}
        <button className="py-1 mt-2 text-black bg-white rounded" type="submit">
          Save Test
        </button>
      </form>
    </div>
  );
};

export default EditTest;
