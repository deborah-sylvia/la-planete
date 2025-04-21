import React, { useEffect, useRef } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';
import gsap from 'gsap';

interface SoundToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  isVisible: boolean;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ 
  isEnabled, 
  onToggle,
  isVisible
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !isVisible) return;
    
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay: 0.5,
        ease: 'power3.out'
      }
    );
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 right-8 z-30 opacity-0"
    >
      <button
        onClick={onToggle}
        className="w-12 h-12 bg-white bg-opacity-10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-300"
        aria-label={isEnabled ? 'Disable sound' : 'Enable sound'}
        data-interactive
      >
        {isEnabled ? (
          <Volume2 className="w-5 h-5 text-white" />
        ) : (
          <VolumeX className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
};