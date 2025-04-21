import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface NavigationProps {
  isVisible: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isVisible }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Animation for nav appearance
    gsap.fromTo(
      '.nav-container',
      { opacity: 0, y: -20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay: 0.5,
        ease: 'power3.out'
      }
    );
    
    // Update active section on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const index = Math.floor(scrollPosition / windowHeight);
      
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, activeIndex]);
  
  const sections = [
    'Begin',
    'Connect',
    'Moments',
    'Beyond',
    'Finale'
  ];
  
  const handleClick = (index: number) => {
    const targetPosition = index * window.innerHeight;
    
    gsap.to(window, {
      scrollTo: targetPosition,
      duration: 1.5,
      ease: 'power3.inOut'
    });
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="nav-container fixed right-8 top-1/2 transform -translate-y-1/2 z-30 opacity-0">
      <div className="flex flex-col items-center space-y-6">
        {sections.map((section, index) => (
          <button
            key={section}
            className="group flex items-center"
            onClick={() => handleClick(index)}
            data-interactive
          >
            <span 
              className={`w-2 h-2 rounded-full transition-all duration-300 mr-2 ${
                activeIndex === index ? 'w-3 h-3 bg-white' : 'bg-white opacity-50'
              }`}
            />
            <span 
              className={`text-sm transition-all duration-300 ${
                activeIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
              }`}
            >
              {section}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};