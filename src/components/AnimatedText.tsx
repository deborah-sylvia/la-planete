import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerAmount?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  staggerAmount = 0.03
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const chars = containerRef.current.querySelectorAll('.char');
    
    gsap.fromTo(
      chars,
      { 
        opacity: 0, 
        y: 20 
      },
      { 
        opacity: 1, 
        y: 0, 
        stagger: staggerAmount, 
        duration: duration, 
        delay: delay,
        ease: 'power3.out'
      }
    );
    
    return () => {
      gsap.killTweensOf(chars);
    };
  }, [text, delay, duration, staggerAmount]);
  
  return (
    <div className={className} ref={containerRef}>
      {text.split('').map((char, index) => (
        <span key={index} className="char inline-block">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};