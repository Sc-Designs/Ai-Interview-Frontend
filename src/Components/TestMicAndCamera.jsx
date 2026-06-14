import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TestMicAndCamera = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const animFrameRef = useRef(null);
  const [micLevel, setMicLevel] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        streamRef.current = stream;
        setCameraReady(true);

        audioContextRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        dataArrayRef.current = new Uint8Array(
          analyserRef.current.frequencyBinCount,
        );

        const updateMicLevel = () => {
          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
          let sum = 0;
          for (let i = 0; i < dataArrayRef.current.length; i++) {
            const val = (dataArrayRef.current[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / dataArrayRef.current.length);
          setMicLevel(rms);
          animFrameRef.current = requestAnimationFrame(updateMicLevel);
        };

        updateMicLevel();
      } catch (error) {
        toast.info("Please enable your camera and microphone, then try again.");
        console.error("Camera/Microphone access denied:", error);
      }
    };

    getMedia();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      stopCamera();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const stopCamera = () => {
    const stream = streamRef.current;
    if (stream && typeof stream.getTracks === "function") {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const micPercent = Math.min(micLevel * 500, 100);

  const ringOpacity = Math.min(0.3 + micLevel * 8, 0.9);
  const ringScale = Math.min(1 + micLevel * 3, 1.12);
  const glowSize = 8 + micLevel * 120;
  const glowSpread = 4 + micLevel * 40;
  const glowAlpha = Math.min(0.1 + micLevel * 2, 1);

  const bars = Array.from({ length: 20 }, (_, i) => {
    const threshold = (i / 20) * 100;
    return threshold <= micPercent;
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0A0F1E] overflow-hidden font-sans">
      {/* Background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 my-6 px-7 py-6 rounded-2xl text-[#E8EDF5]"
        style={{
          background: "rgba(20, 25, 41, 0.88)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,212,255,0.15)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
        {/* Header row */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${cameraReady ? "bg-green-400 animate-pulse" : "bg-gray-500"}`}
            style={{ boxShadow: cameraReady ? "0 0 8px #4ade80" : "none" }}
          />
          <span className="flex-1 text-[11px] uppercase tracking-widest font-medium text-white/40">
            {cameraReady ? "Devices connected" : "Connecting…"}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-3 py-0.5 rounded-full"
            style={{
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.25)",
            }}>
            Pre-check
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EDF5] mb-1">
          Ready to begin?
        </h1>
        <p className="text-[13px] text-white/40 leading-relaxed mb-5">
          Confirm your camera and microphone are working before starting.
        </p>

        {/* Video wrapper */}
        <div className="relative mb-5">
          {/* Reactive ring */}
          <div
            className="absolute -inset-1 rounded-2xl pointer-events-none z-10 transition-all duration-75"
            style={{
              border: "1.5px solid rgba(0,212,255,0.85)",
              opacity: ringOpacity,
              transform: `scale(${ringScale})`,
            }}
          />
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-10 transition-all duration-75"
            style={{
              boxShadow: `0 0 ${glowSize}px ${glowSpread}px rgba(0,212,255,${glowAlpha})`,
            }}
          />
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full block rounded-xl object-cover aspect-video scale-x-[-1] bg-[#0d111e]"
          />
          {/* LIVE badge */}
          <div
            className="absolute bottom-2.5 left-3 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest text-white"
            style={{
              background: "rgba(10,15,30,0.72)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
              style={{ boxShadow: "0 0 5px #ef4444" }}
            />
            LIVE
          </div>
        </div>

        {/* Mic panel */}
        <div
          className="rounded-xl px-4 py-3 mb-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🎙</span>
            <span className="flex-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Microphone
            </span>
            <span className="text-[13px] font-bold tabular-nums text-cyan-400 min-w-[36px] text-right">
              {Math.round(micPercent)}%
            </span>
          </div>

          {/* Segmented bars */}
          <div className="flex items-end gap-[3px] h-9">
            {bars.map((active, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-colors duration-100"
                style={{
                  height: `${40 + Math.sin((i / 20) * Math.PI) * 60}%`,
                  minHeight: 4,
                  background: active
                    ? i < 12
                      ? "#00D4FF"
                      : i < 17
                        ? "#F59E0B"
                        : "#EF4444"
                    : "rgba(255,255,255,0.07)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Warning */}
        <div
          className="flex items-start gap-2.5 px-3 py-2.5 mb-5 rounded-r-lg"
          style={{
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.18)",
            borderLeft: "3px solid #F59E0B",
          }}>
          <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">⚠</span>
          <p className="text-[12.5px] text-white/55 leading-relaxed m-0">
            Voice responses are currently supported in{" "}
            <strong className="text-white/75 font-semibold">Chrome</strong>{" "}
            only.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            stopCamera();
            navigate(`/questions/${id}`);
          }}
          className="w-full py-3 rounded-xl text-[15px] font-bold tracking-wide text-cyan-400 bg-transparent transition-all duration-200 cursor-pointer outline-none hover:bg-cyan-400 hover:text-[#0A0F1E] hover:shadow-[0_0_28px_rgba(0,212,255,0.45)] active:scale-[0.98]"
          style={{ border: "1.5px solid #00D4FF" }}>
          Start Assessment →
        </button>
        <button
          onClick={() => {
            stopCamera();
            navigate(-1);
          }}
          className="w-full py-3 mt-2 rounded-xl text-[15px] font-bold tracking-wide text-cyan-400 bg-transparent transition-all duration-200 cursor-pointer outline-none hover:bg-cyan-400 hover:text-[#0A0F1E] hover:shadow-[0_0_28px_rgba(0,212,255,0.45)] active:scale-[0.98]"
          style={{ border: "1.5px solid #00D4FF" }}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default TestMicAndCamera;
