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
    <div className="flex flex-col gap-5">
      <p className="text-base font-medium text-[#E8EDF5] leading-relaxed">
        {question.questionText}
      </p>

      {/* Mic button area */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative flex items-center justify-center">
          {/* Pulse rings when listening */}
          {isListening && (
            <>
              <div className="absolute w-28 h-28 rounded-full animate-ping opacity-20 bg-red-400" />
              <div
                className="absolute w-36 h-36 rounded-full animate-ping opacity-10 bg-red-400"
                style={{ animationDelay: "0.3s" }}
              />
            </>
          )}
          <button
            onClick={toggleListening}
            className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-200 active:scale-95 z-10"
            style={{
              background: isListening
                ? "rgba(239,68,68,0.15)"
                : "rgba(0,212,255,0.1)",
              border: isListening
                ? "2px solid rgba(239,68,68,0.6)"
                : "2px solid rgba(0,212,255,0.4)",
              boxShadow: isListening
                ? "0 0 24px rgba(239,68,68,0.25)"
                : "0 0 16px rgba(0,212,255,0.15)",
            }}>
            🎙
          </button>
        </div>

        <span
          className="text-[12px] font-semibold uppercase tracking-widest"
          style={{ color: isListening ? "#f87171" : "rgba(0,212,255,0.6)" }}>
          {isListening ? "Tap to stop" : "Tap to speak"}
        </span>

        {isListening && (
          <p className="text-xs text-amber-400/70 animate-pulse">Listening…</p>
        )}
      </div>

      {/* Transcription result */}
      {answer && (
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: "rgba(74,222,128,0.05)",
            border: "1px solid rgba(74,222,128,0.2)",
          }}>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-green-400/60 mb-1.5">
            Transcribed answer
          </p>
          <p className="text-sm text-[#E8EDF5]/80 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceQuestion;
