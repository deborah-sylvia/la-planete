import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;
    
    if (!cursor || !cursorRing) return;
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out'
      });
      
      gsap.to(cursorRing, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      });
    };
    
    const onMouseDown = () => {
      gsap.to([cursor, cursorRing], {
        scale: 0.8,
        duration: 0.2
      });
    };
    
    const onMouseUp = () => {
      gsap.to([cursor, cursorRing], {
        scale: 1,
        duration: 0.2
      });
    };
    
    const onMouseEnterInteractive = () => {
      setIsHovering(true);
      gsap.to(cursorRing, {
        scale: 1.5,
        opacity: 0.5,
        duration: 0.3
      });
    };
    
    const onMouseLeaveInteractive = () => {
      setIsHovering(false);
      gsap.to(cursorRing, {
        scale: 1,
        opacity: 1,
        duration: 0.3
      });
    };
    
    // Add event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    // Add listeners for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-interactive]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });
    
    return () => {
      // Clean up
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
      
      gsap.killTweensOf([cursor, cursorRing]);
    };
  }, []);
  
  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed w-3 h-3 bg-white rounded-full pointer-events-none z-50 transform -translate-x-1.5 -translate-y-1.5"
        style={{ mixBlendMode: 'difference' }}
      />
      <div 
        ref={cursorRingRef} 
        className="fixed w-8 h-8 border border-white rounded-full pointer-events-none z-50 transform -translate-x-4 -translate-y-4"
        style={{ 
          mixBlendMode: 'difference',
          opacity: isHovering ? 0.5 : 1
        }}
      />
    </>
  );
};