import { useEffect, useRef, useState } from "react";
import Axios from "../Config/Axios";
import Navbar from "../Components/Navbar";
import Markdown from "markdown-to-jsx";

const Convergation = () => {
  const [aiReply, setAiReply] = useState("");
  const [lastUserQuestion, setLastUserQuestion] = useState("");
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  const myVoiceRef = useRef(null);
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);

  const initSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎙️ Listening...");
    };

    recognition.onresult = async (event) => {
      const voiceInput = event.results[0][0].transcript;
      setLastUserQuestion(voiceInput);
      setIsLoading(true);

      try {
        const res = await Axios.post("/ai/groq", {
          prompt: `You're a professional interviewer. Ask the candidate a thoughtful and relevant next question or respond to this: "${voiceInput}"`,
        });

        const reply = res.data.reply;
        setAiReply(reply);
        setQuestionCount((prev) => prev + 1);
      } catch (error) {
        console.error("❌ Error fetching AI reply:", error);
      } finally {
        setIsLoading(false);
      }
    };

    recognition.onerror = (e) => {
      console.error("❌ Speech recognition error:", e);
      try {
        recognition.abort();
      } catch (_) {}
    };

    recognition.onend = () => {
      console.log("🛑 Recognition ended");
    };

    recognitionRef.current = recognition;
  };

  const speakAndListen = (text) => {
    console.log("🧠 AI Speaking: " + text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = myVoiceRef.current;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    isSpeakingRef.current = true;

    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);

    utterance.onend = () => {
      isSpeakingRef.current = false;
      console.log("✅ Speech ended");

      setTimeout(() => {
        if (recognitionRef.current && !isLoading && isInterviewActive) {
          try {
            recognitionRef.current.abort();
            recognitionRef.current.start();
            console.log("🎙️ Restarted listening after speech");
          } catch (err) {
            console.warn("❌ Restart error:", err);
          }
        }
      }, 300);
    };

    // Fallback
    setTimeout(() => {
      if (isSpeakingRef.current) {
        console.warn("⚠️ Speech stuck — forcing stop");
        window.speechSynthesis.cancel();
        isSpeakingRef.current = false;

        try {
          recognitionRef.current.abort();
          recognitionRef.current.start();
        } catch (err) {
          console.warn("❌ Fallback restart error:", err);
        }
      }
    }, 10000);
  };

  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const selected = voices.find((v) => v.lang.includes("en")) || voices[0];
      if (selected) {
        myVoiceRef.current = selected;
        setVoicesLoaded(true);
      }
    }
  };

  const startInterview = () => {
    if (!voicesLoaded || !recognitionRef.current) return;

    setIsInterviewActive(true);
    try {
      recognitionRef.current.abort();
      recognitionRef.current.start();
      console.log("🟢 Interview started");
    } catch (err) {
      console.warn("❌ Start error:", err);
    }
  };

  const stopInterview = () => {
    setIsInterviewActive(false);
    window.speechSynthesis.cancel();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        console.log("🔴 Interview stopped");
      } catch (err) {
        console.warn("❌ Stop error:", err);
      }
    }
  };

  useEffect(() => {
    setVoice();
    window.speechSynthesis.onvoiceschanged = setVoice;
    initSpeechRecognition();

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (
      aiReply &&
      myVoiceRef.current &&
      voicesLoaded &&
      !isLoading &&
      isInterviewActive
    ) {
      speakAndListen(aiReply);
    }
  }, [aiReply]);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] font-Okomito text-white">
      <Navbar />
      <div className="flex flex-col items-center px-5 py-20 md:flex-row gap-y-5">
        <div className="flex flex-col items-center justify-center w-full gap-y-10">
          <h1 className="text-[#FFF] text-center text-4xl">
            AI Interviewer
          </h1>

          <div className="p-5 mt-20 bg-red-400 rounded-full w-fit text-9xl scale-200">
            🎙
          </div>
        </div>
        <div className="w-full px-10">
          <div className="flex gap-4 mt-25">
            <button
              onClick={startInterview}
              disabled={isInterviewActive}
              className="w-full px-5 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
              ▶️ Start Interview
            </button>
            <button
              onClick={stopInterview}
              disabled={!isInterviewActive}
              className="w-full px-5 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50">
              ⛔ End Interview
            </button>
          </div>

          <p className="mt-4 text-lg text-white">
            🧠 Question <span className="text-green-400">{questionCount}</span>
          </p>

          <div className="mt-10 space-y-4 text-center">
            {isLoading && (
              <p className="text-xl text-yellow-400">
                🔄 Interviewer is thinking...
              </p>
            )}
            {!isLoading && (
              <>
                {lastUserQuestion && (
                  <p className="text-xl text-green-400">
                    👤 You: {lastUserQuestion}
                  </p>
                )}
                {aiReply && (
                  <h6 className="text-2xl md:text-xl text-sky-300">
                    <Markdown>{aiReply}</Markdown>
                  </h6>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convergation;
