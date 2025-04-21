import React, { useEffect, useRef } from "react";
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

          if (currentSection >= 0 && currentSection < totalSections) {
            const prevSection = document.querySelector(
              ".scroll-section.active"
            );
            const newSection = sections[currentSection];

            // Only update if the section actually changed
            if (prevSection !== newSection) {
              // Remove active class from previous section
              if (prevSection) {
                prevSection.classList.remove("active");
                // Hide text from previous section
                const prevSectionIndex =
                  Array.from(sections).indexOf(prevSection);
                const prevTexts = document.querySelectorAll(
                  `.section-${prevSectionIndex + 1}-text`
                );
                prevTexts.forEach((element) => {
                  element.classList.remove("opacity-100");
                  element.classList.add("translate-y-8");
                });
              }

              // Add active class to new section
              newSection.classList.add("active");

              // Show text for new section
              const sectionTexts = document.querySelectorAll(
                `.section-${currentSection + 1}-text`
              );
              sectionTexts.forEach((element) => {
                element.classList.add("opacity-100");
                element.classList.remove("translate-y-8");
              });

              // Trigger sound effect only on actual section change
              AudioManager.playSound("sectionChange");
            }
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
          <section className="scroll-section h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 text-center pointer-events-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-1-text">
                Begin Your Journey
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-1-text">
                Explore the interconnection of love and time through an
                immersive experience
              </p>
            </div>
          </section>

          <section className="scroll-section h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 text-center pointer-events-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-2-text">
                Eternal Connection
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-2-text">
                Discover how love transcends the boundaries of space and time
              </p>
            </div>
          </section>

          <section className="scroll-section h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 text-center pointer-events-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-3-text">
                Moments That Last
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-3-text">
                Every second becomes eternal in the presence of love
              </p>
            </div>
          </section>

          <section className="scroll-section h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 text-center pointer-events-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-4-text">
                Beyond Reality
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-4-text">
                Experience the dimensions where love creates its own universe
              </p>
            </div>
          </section>

          <section className="scroll-section h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 text-center pointer-events-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 transform translate-y-8 transition-all duration-1000 section-5-text">
                Valentime
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-1000 delay-300 section-5-text">
                Where love and time become one
              </p>
              <button className="mt-8 px-6 py-3 bg-white text-black rounded-full font-medium opacity-0 transform translate-y-8 transition-all duration-1000 delay-600 section-5-text hover:bg-opacity-80 transition-colors">
                Begin Again
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Overlay for better text visibility */}
      <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-none" />
    </div>
  );
};
