import React, { useState, useRef, useEffect } from "react";

const VoiceQuestion = ({ question, answer, onAnswerChange }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      onAnswerChange(question._id, spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      const recognition = initRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return (
    <div className="flex flex-col gap-y-5">
      <p className="text-lg font-semibold">{question.questionText}</p>

      <div className="flex justify-center w-full">
        <button
          className={`duration-200 rounded-full text-9xl ${
            isListening ? "bg-red-500 animate-pulse" : "bg-sky-400"
          } w-fit active:scale-110`}
          onClick={toggleListening}>
          🎙
        </button>
      </div>

      <div className="text-center text-gray-700">
        {isListening && <p className="text-orange-600">Listening...</p>}
        {answer && (
          <div className="mt-2 text-left text-green-400">
            <p className="text-white">Transcribed Answer:</p>
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceQuestion;
