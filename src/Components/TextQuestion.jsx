const TextQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="flex flex-col gap-y-5">
      <p className="text-xl">{question.questionText}</p>
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(question._id, e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-2 text-lg border rounded outline-none resize-none h-60 border-white/50"
      />
    </div>
  );
};
export default TextQuestion;
