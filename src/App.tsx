import React, { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import { CustomCursor } from "./components/CustomCursor";
import { Scene } from "./components/Scene";
import { IntroOverlay } from "./components/IntroOverlay";
import { Navigation } from "./components/Navigation";
import { SoundToggle } from "./components/SoundToggle";
import { AudioManager } from "./utils/AudioManager";

function App() {
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Initialize audio
    AudioManager.init();

    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      AudioManager.cleanup();
    };
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newState = !prev;
      AudioManager.setMuted(!newState);

      if (newState) {
        AudioManager.playSound("ambient");
      }

      return newState;
    });
  };

  const handleIntroComplete = () => {
    setIntroComplete(true);
    if (soundEnabled) {
      AudioManager.playSound("transition");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-['Poppins']">
      {loading ? (
        <Loader />
      ) : (
        <>
          <CustomCursor />

          {!introComplete && <IntroOverlay onComplete={handleIntroComplete} />}

          <Scene isActive={introComplete} />

          <Navigation isVisible={introComplete} />

          <SoundToggle
            isEnabled={soundEnabled}
            onToggle={toggleSound}
            isVisible={introComplete}
          />
        </>
      )}
    </div>
  );
}

export default App;
