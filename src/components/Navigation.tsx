import React, { useEffect, useState } from "react";
import gsap from "gsap";

interface NavigationProps {
  isVisible: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isVisible }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      gsap.to(".nav-container", {
        opacity: 0,
        duration: 0.3,
        ease: "power3.out",
      });
      return;
    }

    // Animation for nav appearance
    gsap.to(".nav-container", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power3.out",
    });

    // Update active section based on active class
    const updateActiveSection = () => {
      const activeSection = document.querySelector(".scroll-section.active");
      if (!activeSection) return;

      const sections = document.querySelectorAll(".scroll-section");
      const index = Array.from(sections).indexOf(activeSection);

      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index);
      }
    };

    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          updateActiveSection();
        }
      });
    });

    // Observe all sections
    const sections = document.querySelectorAll(".scroll-section");
    sections.forEach((section) => {
      observer.observe(section, { attributes: true });
    });

    // Initial check
    updateActiveSection();

    return () => {
      observer.disconnect();
    };
  }, [isVisible, activeIndex]);

  const sections = ["Begin", "Connect", "Moments", "Beyond", "Finale"];

  const handleClick = (index: number) => {
    const sections = document.querySelectorAll(".scroll-section");
    if (!sections[index]) return;

    // Remove active class from current section
    const currentActive = document.querySelector(".scroll-section.active");
    if (currentActive) {
      currentActive.classList.remove("active");
    }

    // Add active class to target section
    sections[index].classList.add("active");

    // Update the scroll position
    const scrollContainer = document.querySelector(".scroll-content");
    if (!scrollContainer) return;

    const containerHeight = scrollContainer.scrollHeight;
    const windowHeight = window.innerHeight;
    const targetPosition =
      (index / sections.length) * (containerHeight - windowHeight);

    gsap.to(scrollContainer, {
      y: -targetPosition,
      duration: 1.5,
      ease: "power3.inOut",
    });
  };

  return (
    <div className="nav-container fixed right-8 top-1/2 transform -translate-y-1/2 z-30">
      <div className="flex flex-col items-center space-y-6">
        {sections.map((section, index) => (
          <button
            key={section}
            className="group flex items-center cursor-pointer"
            onClick={() => handleClick(index)}
            data-interactive
          >
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 mr-2 ${
                activeIndex === index
                  ? "w-3 h-3 bg-white"
                  : "bg-white opacity-50"
              }`}
            />
            <span
              className={`text-sm transition-all duration-300 ${
                activeIndex === index
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-70"
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
