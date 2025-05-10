import { Howl } from 'howler';

interface SoundCollection {
  [key: string]: Howl;
}

export class AudioManager {
  private static sounds: SoundCollection = {};
  private static muted: boolean = true;
  
  public static init(): void {
    // Create sounds
    this.sounds = {
      ambient: new Howl({
        src: ['/assets/audio/ambient.mp3'],
        loop: true,
        volume: 0.2,
        autoplay: false,
        preload: true
      }),
      transition: new Howl({
        src: ['/assets/audio/transition.wav'],
        volume: 0.5,
        autoplay: false,
        preload: true
      }),
      sectionChange: new Howl({
        src: ['/assets/audio/section-change.wav'],
        volume: 0.3,
        autoplay: false,
        preload: true
      }),
      hover: new Howl({
        src: ['/assets/audio/hover.wav'],
        volume: 0.2,
        autoplay: false,
        preload: true
      })
    };
    
    // Set up interactive element sound effects
    this.setupInteractiveSounds();
  }
  
  public static playSound(id: string): void {
    if (this.muted || !this.sounds[id]) return;
    
    this.sounds[id].play();
  }
  
  public static stopSound(id: string): void {
    if (!this.sounds[id]) return;
    
    this.sounds[id].stop();
  }
  
  public static setMuted(muted: boolean): void {
    this.muted = muted;
    
    // Mute/unmute all sounds
    Object.keys(this.sounds).forEach(key => {
      this.sounds[key].mute(muted);
    });
    
    // Stop ambient sound if muted
    if (muted) {
      this.stopSound('ambient');
    } else {
      this.playSound('ambient');
    }
  }
  
  public static cleanup(): void {
    // Unload all sounds
    Object.keys(this.sounds).forEach(key => {
      this.sounds[key].unload();
    });
    
    this.sounds = {};
  }
  
  private static setupInteractiveSounds(): void {
    // Add hover sound to interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.hasAttribute('data-interactive')
      ) {
        this.playSound('hover');
      }
    });
  }
}