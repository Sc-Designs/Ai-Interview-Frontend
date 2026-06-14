const MCQQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-medium text-[#E8EDF5] leading-relaxed">
        {question.questionText}
      </p>

      <div className="flex flex-col gap-2.5 mt-1">
        {question.options.map((opt, i) => {
          const isSelected = answer === opt;
          return (
            <label
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 group"
              style={{
                background: isSelected
                  ? "rgba(0,212,255,0.1)"
                  : "rgba(255,255,255,0.03)",
                border: isSelected
                  ? "1px solid rgba(0,212,255,0.4)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}>
              <input
                type="radio"
                name={`mcq-${question._id}`}
                value={opt}
                checked={isSelected}
                onChange={() => onAnswerChange(question._id, opt)}
                className="sr-only"
              />
              {/* Custom radio */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-150"
                style={{
                  border: isSelected
                    ? "2px solid #00D4FF"
                    : "2px solid rgba(255,255,255,0.2)",
                  background: isSelected ? "#00D4FF" : "transparent",
                }}>
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A0F1E]" />
                )}
              </div>
              <span
                className={`text-sm leading-snug transition-colors duration-150 ${
                  isSelected
                    ? "text-cyan-300 font-medium"
                    : "text-white/60 group-hover:text-white/80"
                }`}>
                {opt}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default MCQQuestion;
