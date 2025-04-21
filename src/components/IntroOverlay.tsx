import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { AnimatedText } from "./AnimatedText";

interface IntroOverlayProps {
  onComplete: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 100);
      },
    });
    timelineRef.current = timeline;

    // Intro animation sequence
    timeline
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 })
      // .to(".intro-text-1", { opacity: 1, duration: 0.8 }, "+=0.4")
      // .to(".intro-text-1", { opacity: 0, duration: 0.6 }, "+=2")
      // .to(".intro-text-2", { opacity: 1, duration: 0.8 }, "+=0.4")
      // .to(".intro-text-2", { opacity: 0, duration: 0.6 }, "+=2")
      .to(".intro-text-3", { opacity: 1, duration: 0.8 }, "+=0.4")
      .to(".intro-final", { opacity: 1, duration: 1.2 }, "+=2")
      .to(overlayRef.current, { opacity: 0, duration: 1 }, "+=1.5");

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center text-white"
    >
      <div className="container mx-auto px-4 text-center">
        {/* <div className="intro-text-1 opacity-0">
          <AnimatedText
            text="Welcome to Valentime"
            className="text-3xl md:text-5xl font-light mb-4"
            delay={0.5}
          />
        </div>
        
        <div className="intro-text-2 opacity-0">
          <AnimatedText
            text="An immersive journey through love and time"
            className="text-xl md:text-2xl font-light"
            delay={0.5}
          />
        </div> */}

        <div className="intro-text-3 opacity-0">
          <AnimatedText
            text="Scroll to explore"
            className="text-xl md:text-2xl font-light"
            delay={0.5}
          />
        </div>

        <div className="intro-final opacity-0 mt-12">
          <div className="inline-block animate-bounce">
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
