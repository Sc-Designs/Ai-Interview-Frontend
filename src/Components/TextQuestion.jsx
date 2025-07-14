const TextQuestion = ({ question, answer, onAnswerChange }) => {
  return (
    <div className="flex flex-col gap-y-5">
      <p className="text-xl">{question.questionText}</p>
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(question._id, e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-2 border text-lg border-[#A855F7] h-40 rounded outline-none resize-none"
      />
    </div>
  );
};
export default TextQuestion;
