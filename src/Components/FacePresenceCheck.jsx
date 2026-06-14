import React, { memo, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AddingNumber } from "../Store/Reducers/CameraDetechtionReducer";

const FacePresenceCheck = ({ value }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [faceMissing, setFaceMissing] = useState(false);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const dispatch = useDispatch();
  const hasWarnedRef = useRef(false);
  const countRef = useRef(0);
  const myVoiceRef = useRef(null);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      myVoiceRef.current = voices[3] || voices[0];
    };
  }, []);

  useEffect(() => {
    const loadModelsAndStart = async () => {
      const MODEL_URL = "/models";
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          startDetectionLoop();
        };
      } catch (err) {
        console.error("Face API or camera error:", err);
      }
    };

    const startDetectionLoop = () => {
      intervalRef.current = setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2) return;
        try {
          const detection = await faceapi.detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions(),
          );
          if (!detection) {
            setFaceMissing(true);
            setCount((prev) => {
              countRef.current = prev + 1;
              return prev + 1;
            });
            dispatch(AddingNumber(1));
            if (!hasWarnedRef.current && countRef.current < 5) {
              const utterance = new SpeechSynthesisUtterance(
                "Face not detected. Please stay visible!",
              );
              utterance.lang = "en-US";
              utterance.voice =
                myVoiceRef.current || speechSynthesis.getVoices()[0];
              utterance.rate = 2;
              utterance.pitch = 1;
              window.speechSynthesis.speak(utterance);
              hasWarnedRef.current = true;
            }
          } else {
            setFaceMissing(false);
            hasWarnedRef.current = false;
          }
        } catch (err) {
          console.error("Detection error:", err);
        }
      }, 3000);
    };

    loadModelsAndStart();

    return () => {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
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

  useEffect(() => {
    if (count > 5 || value === false) {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (count > 5) navigate("/");
    }
  }, [count, navigate, value]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="object-cover w-full h-full -scale-x-[1]"
      />

      {/* Scan line overlay — always present, subtle */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.015) 3px, rgba(0,212,255,0.015) 4px)",
        }}
      />

      {/* Corner brackets */}
      {[
        "top-2 left-2",
        "top-2 right-2",
        "bottom-2 left-2",
        "bottom-2 right-2",
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 pointer-events-none`}>
          <div
            className="absolute inset-0"
            style={{
              borderTop: i < 2 ? "2px solid rgba(0,212,255,0.6)" : "none",
              borderBottom: i >= 2 ? "2px solid rgba(0,212,255,0.6)" : "none",
              borderLeft:
                i % 2 === 0 ? "2px solid rgba(0,212,255,0.6)" : "none",
              borderRight:
                i % 2 === 1 ? "2px solid rgba(0,212,255,0.6)" : "none",
            }}
          />
        </div>
      ))}

      {/* Face missing warning */}
      {faceMissing && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl"
          style={{
            background: "rgba(220,38,38,0.75)",
            backdropFilter: "blur(4px)",
          }}>
          <span className="text-3xl">🚨</span>
          <p className="text-sm font-bold text-white text-center px-4">
            Face not detected — please stay visible!
          </p>
        </div>
      )}

      {/* Status chip */}
      {!faceMissing && (
        <div
          className="absolute bottom-2.5 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest text-white"
          style={{
            background: "rgba(10,15,30,0.72)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}>
          <span
            className="w-1.5 h-1.5 rounded-full bg-green-400"
            style={{ boxShadow: "0 0 5px #4ade80" }}
          />
          FACE OK
        </div>
      )}
    </div>
  );
};

export default memo(FacePresenceCheck);
