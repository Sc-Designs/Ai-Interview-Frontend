const TextQuestion = ({ question, answer, onAnswerChange }) => {
  const wordCount = answer
    ? answer.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-medium text-[#E8EDF5] leading-relaxed">
        {question.questionText}
      </p>

      <div className="relative">
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(question._id, e.target.value)}
          placeholder="Type your answer here…"
          className="w-full p-4 text-sm text-[#E8EDF5] leading-relaxed rounded-xl resize-none outline-none transition-all duration-200 placeholder:text-white/20"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            minHeight: "200px",
            caretColor: "#00D4FF",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid rgba(0,212,255,0.4)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.06)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {/* Word count */}
        <span
          className="absolute bottom-3 right-3 text-[11px] tabular-nums"
          style={{
            color:
              wordCount > 0 ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.2)",
          }}>
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
      </div>
    </div>
  );
};

export default TextQuestion;
