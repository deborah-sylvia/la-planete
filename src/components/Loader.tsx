import React, { useEffect, useState } from "react";
import { AnimatedText } from "./AnimatedText";
import gsap from "gsap";

export const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeline = gsap.timeline();

    // Animate loader in
    timeline.fromTo(
      ".loader-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );

    // Animate progress
    gsap.to(
      {},
      {
        duration: 2,
        onUpdate: () => {
          const newProgress = Math.min(
            100,
            Math.floor(timeline.progress() * 100) * 2.5
          );
          setProgress(newProgress);
        },
      }
    );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className="loader-container fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <AnimatedText
        text="Vibe Coding Project 1"
        className="text-4xl md:text-6xl font-bold mb-8 tracking-widest"
      />

      <div className="w-64 h-[2px] bg-gray-800 relative mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-sm opacity-60">{progress}% LOADED</div>
    </div>
  );
};
