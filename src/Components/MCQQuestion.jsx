const MCQQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="flex flex-col gap-y-5">
      <p className="text-xl">{question.questionText}</p>
      {question.options.map((opt, i) => (
        <label key={i} className="flex items-center my-1 text-lg gap-x-4">
          <input
            type="radio"
            name={`mcq-${question._id}`}
            value={opt}
            checked={answer === opt}
            onChange={() => onAnswerChange(question._id, opt)}
            className="w-5 h-5"
          />{" "}
          {opt}
        </label>
      ))}
    </div>
  );
};
export default MCQQuestion;
