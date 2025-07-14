import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TestMicAndCamera = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null); // ✅ Track the media stream
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const [micLevel, setMicLevel] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Assign stream to video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // ✅ Save the stream for cleanup
        streamRef.current = stream;

        // Audio setup
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        dataArrayRef.current = new Uint8Array(
          analyserRef.current.frequencyBinCount
        );

        // Mic level detection
        const updateMicLevel = () => {
          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

          let sum = 0;
          for (let i = 0; i < dataArrayRef.current.length; i++) {
            const val = (dataArrayRef.current[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / dataArrayRef.current.length);
          setMicLevel(rms);
          requestAnimationFrame(updateMicLevel);
        };

        updateMicLevel();
      } catch (error) {
        toast.info("Please turn on your camera and mic, then try again!");
        console.error("🚫 Camera/Microphone access denied:", error);
      }
    };

    getMedia();

    return () => {
      stopCamera();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const stopCamera = () => {
    const stream = streamRef.current;

    if (stream && typeof stream.getTracks === "function") {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    } else {
      console.warn("No active stream to stop");
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="px-4 bg-[#0A0A0A] w-full min-h-screen font-Okomito text-white flex items-center justify-center">
      <div className="bg-[#292524] px-4 py-5 rounded-2xl flex flex-col justify-center items-center">
        <h2 className="text-2xl">🎙️ Voice & Camera Test</h2>

        <div className="my-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="scale-x-[-1] w-full max-w-sm rounded-2xl"
          />
          <div className="mt-2 text-2xl text-center">Camera Preview</div>
        </div>

        <div className="w-full h-6 max-w-sm overflow-hidden bg-[#373433] rounded">
          <div
            style={{
              width: `${Math.min(micLevel * 100 * 5, 100)}%`,
              height: "100%",
              background: "linear-gradient(90deg, #22C55E, #EF4444)",
              transition: "width 0.1s ease",
            }}
          />
        </div>

        <div className="mt-2 text-2xl text-center">Mic Intensity</div>

        <button
          onClick={() => navigate(`/questions/${id}`)}
          className="px-4 py-2 mt-4 duration-200 bg-green-500 rounded cursor-pointer hover:bg-green-600">
          Let's Start the Test
        </button>
      </div>
    </div>
  );
};

export default TestMicAndCamera;
