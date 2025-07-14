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
            new faceapi.TinyFaceDetectorOptions()
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
                "Face not detected. Please stay visible!"
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

  useEffect(() => {
    if (count > 5 || value === false) {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (count > 5) navigate("/");
    }
  }, [count, navigate, value]);

  return (
    <div className="relative w-full max-w-xl mx-auto overflow-hidden aspect-video rounded-xl">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="object-cover w-full h-full -scale-x-[1]"
      />

      {faceMissing && (
        <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-red-800/70">
          <p className="font-bold text-white text-md md:text-xl">
            🚨 Face not detected. Please stay visible!
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(FacePresenceCheck);
