import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneRenderer } from "../three/SceneRenderer";
import { SceneManager } from "../three/SceneManager";
import { AudioManager } from "../utils/AudioManager";
import { ScrollSmoother } from "../utils/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger);

interface SceneProps {
  isActive: boolean;
}

export const Scene: React.FC<SceneProps> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SceneRenderer | null>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollSmootherRef = useRef<ScrollSmoother | null>(null);
  const [showToast, setShowToast] = useState(false);
  const previousSectionRef = useRef<number>(-1);

  useEffect(() => {
    if (!containerRef.current || !isActive || !scrollContainerRef.current)
      return;

    // Initialize scene components
    rendererRef.current = new SceneRenderer(containerRef.current);
    sceneManagerRef.current = new SceneManager(rendererRef.current);

    // Initialize scroll smoother
    const contentElement =
      scrollContainerRef.current.querySelector(".scroll-content");
    if (contentElement) {
      scrollSmootherRef.current = new ScrollSmoother(
        scrollContainerRef.current,
        contentElement as HTMLElement
      );
      scrollSmootherRef.current.init();

      // Add scroll listener for scene updates
      scrollSmootherRef.current.addScrollListener((progress) => {
        if (sceneManagerRef.current) {
          sceneManagerRef.current.updateScroll(progress);

          // Update active section with better precision
          const sections = document.querySelectorAll(".scroll-section");
          const totalSections = sections.length;
          const sectionProgress = progress * totalSections;
          const currentSection = Math.floor(sectionProgress);

          // Only proceed if we have a valid section and it's different from the previous one
          if (
            currentSection >= 0 &&
            currentSection < totalSections &&
            currentSection !== previousSectionRef.current
          ) {
            // Hide all sections first
            sections.forEach((section) => {
              const sectionElement = section as HTMLElement;
              section.classList.remove("active");
              sectionElement.style.opacity = "0";
              sectionElement.style.visibility = "hidden";
              sectionElement.style.pointerEvents = "none";
            });

            // Show only the current section
            const newSection = sections[currentSection] as HTMLElement;
            newSection.classList.add("active");
            newSection.style.opacity = "1";
            newSection.style.visibility = "visible";
            newSection.style.pointerEvents = "auto";

            // Show text for current section
            const sectionTexts = document.querySelectorAll(
              `.section-${currentSection + 1}-text`
            );
            sectionTexts.forEach((element) => {
              element.classList.add("opacity-100");
              element.classList.remove("translate-y-8");
            });

            // Update previous section reference
            previousSectionRef.current = currentSection;

            // Trigger sound effect only on actual section change
            AudioManager.playSound("sectionChange");
          }
        }
      });
    }

    // Create the main scene
    sceneManagerRef.current.initialize();

    // Start animation loop
    const animate = () => {
      if (rendererRef.current && sceneManagerRef.current) {
        sceneManagerRef.current.update();
        rendererRef.current.render();
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.resize();
      }

      if (sceneManagerRef.current) {
        sceneManagerRef.current.onResize();
      }

      if (scrollSmootherRef.current) {
        scrollSmootherRef.current.onResize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      // Clean up resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (sceneManagerRef.current) {
        sceneManagerRef.current.dispose();
      }

      if (scrollSmootherRef.current) {
        scrollSmootherRef.current.destroy();
      }
    };
  }, [isActive]);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("works.syl@gmail.com");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="relative w-full h-screen">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className={`fixed inset-0 transition-opacity duration-1000 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Vertical Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="relative h-[500vh] overflow-hidden"
      >
        {/* Scroll Content */}
        <div className="scroll-content fixed inset-0">
          <section className="scroll-section h-screen flex items-center justify-center absolute inset-0 transition-all duration-500">
            <div className="container mx-auto px-4 text-center pointer-events-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-1-text">
                Sylvia Deborah
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-1-text">
                Product Strategist & Designer (PSD) | Born 2002 | Female |
                Graduated Mid-2024
              </p>
            </div>
          </section>

          <section className="scroll-section h-screen flex items-center justify-center absolute inset-0 transition-all duration-500">
            <div className="container mx-auto px-4 text-center pointer-events-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-2-text">
                Product Analyst II
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-2-text">
                Currently at Pints AI | Based in Indonesia, Singapore | Open to
                remote opportunities
              </p>
            </div>
          </section>

          <section className="scroll-section h-screen flex items-center justify-center absolute inset-0 transition-all duration-500">
            <div className="container mx-auto px-4 text-center pointer-events-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-3-text">
                Product Designer by Day
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-3-text">
                Vibe coder at night 😎⚡️ | Creating meaningful digital
                experiences
              </p>
            </div>
          </section>

          <section className="scroll-section h-screen flex items-center justify-center absolute inset-0 transition-all duration-500">
            <div className="container mx-auto px-4 text-center pointer-events-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-4-text">
                Explore My Work
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-4-text">
                You can check out my history and previous works at my personal
                website.
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => {
                    if (scrollSmootherRef.current) {
                      scrollSmootherRef.current.scrollTo(0, 3);
                      if (sceneManagerRef.current) {
                        sceneManagerRef.current.restart();
                      }
                    }
                  }}
                  className="px-6 py-3 text-white border border-white bg-transparent rounded-full font-medium opacity-0 transform translate-y-8 transition-all duration-1000 delay-600 section-4-text hover:bg-opacity-80 transition-colors hover:bg-white hover:text-black"
                >
                  Start Over
                </button>
                <a
                  href="https://bit.ly/sylviadeborah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-white border border-white bg-transparent rounded-full font-medium opacity-0 transform translate-y-8 transition-all duration-1000 delay-600 section-4-text hover:bg-opacity-80 transition-colors hover:bg-white hover:text-black"
                >
                  Visit My Website
                </a>
              </div>
            </div>
          </section>

          <section className="scroll-section h-screen flex items-center justify-center absolute inset-0 transition-all duration-500">
            <div className="container mx-auto px-4 text-center pointer-events-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-5-text">
                Connect With Me
              </h2>
              <div className="flex justify-center items-center gap-8 mt-6 opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-5-text">
                <a
                  href="https://www.linkedin.com/in/sylviadeborah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://bit.ly/sylviadeborah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </a>
                <a
                  href="mailto:works.syl@gmail.com"
                  onClick={handleEmailClick}
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Overlay for better text visibility */}
      <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-none" />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white px-6 py-3 rounded-full z-50 pointer-events-none">
          Email copied to clipboard!
        </div>
      )}
    </div>
  );
};
