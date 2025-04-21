import gsap from 'gsap';

export class ScrollSmoother {
  private scrollElement: HTMLElement;
  private content: HTMLElement;
  private contentHeight: number = 0;
  private scrollZ: number = 0;
  private targetScrollZ: number = 0;
  private rafId: number | null = null;
  private isActive: boolean = false;
  private scrollListeners: Array<(progress: number) => void> = [];
  private touchStartY: number = 0;
  private touchVelocity: number = 0;
  private lastTouchY: number = 0;
  private lastTouchTime: number = 0;
  private damping: number = 0.1;
  private touchDamping: number = 0.15;
  private velocityDamping: number = 0.95;
  
  constructor(scrollElement: HTMLElement, content: HTMLElement) {
    this.scrollElement = scrollElement;
    this.content = content;
    this.contentHeight = this.content.offsetHeight;
  }
  
  public init(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.contentHeight = this.scrollElement.scrollHeight;
    
    // Set initial styles
    this.content.style.willChange = 'transform';
    
    // Bind events
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd, { passive: false });
    window.addEventListener('resize', this.onResize);
    
    // Start animation loop
    this.animate();
  }
  
  public destroy(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    // Reset styles
    this.content.style.transform = '';
    this.content.style.willChange = '';
    
    // Remove event listeners
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('resize', this.onResize);
    
    // Cancel animation frame
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  public addScrollListener(callback: (progress: number) => void): void {
    this.scrollListeners.push(callback);
  }
  
  public removeScrollListener(callback: (progress: number) => void): void {
    this.scrollListeners = this.scrollListeners.filter(cb => cb !== callback);
  }
  
  public onResize = (): void => {
    this.contentHeight = this.scrollElement.scrollHeight;
  };
  
  public scrollTo(position: number, duration: number = 1.5): void {
    gsap.to(this, {
      targetScrollZ: position,
      scrollZ: position,
      duration: duration,
      ease: "power3.inOut",
      onUpdate: () => {
        this.content.style.transform = `translate3d(0, 0, ${-this.scrollZ}px)`;
      }
    });
  }
  
  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    
    // Update target scroll position with momentum
    const delta = e.deltaY;
    this.targetScrollZ = Math.max(
      0,
      Math.min(
        this.contentHeight - window.innerHeight,
        this.targetScrollZ + delta
      )
    );
    
    console.log('Wheel event:', {
      delta,
      targetScrollZ: this.targetScrollZ,
      contentHeight: this.contentHeight,
      windowHeight: window.innerHeight
    });
  };
  
  private onTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    
    this.touchStartY = e.touches[0].clientY;
    this.lastTouchY = this.touchStartY;
    this.lastTouchTime = Date.now();
    this.touchVelocity = 0;
  };
  
  private onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    
    const touchY = e.touches[0].clientY;
    const deltaY = this.lastTouchY - touchY;
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTouchTime;
    
    // Calculate velocity
    if (deltaTime > 0) {
      this.touchVelocity = deltaY / deltaTime;
    }
    
    this.targetScrollZ = Math.max(
      0,
      Math.min(
        this.contentHeight - window.innerHeight,
        this.targetScrollZ + deltaY
      )
    );
    
    this.lastTouchY = touchY;
    this.lastTouchTime = currentTime;
  };
  
  private onTouchEnd = (e: TouchEvent): void => {
    e.preventDefault();
    
    // Apply momentum based on final velocity
    const momentum = this.touchVelocity * 100;
    this.targetScrollZ = Math.max(
      0,
      Math.min(
        this.contentHeight - window.innerHeight,
        this.targetScrollZ + momentum
      )
    );
  };
  
  private animate = (): void => {
    if (!this.isActive) return;
    
    // Apply damping to smooth the scrolling
    const delta = this.targetScrollZ - this.scrollZ;
    this.scrollZ += delta * this.damping;
    
    // Apply velocity damping
    this.touchVelocity *= this.velocityDamping;
    
    // Apply transform with perspective for z-axis movement
    this.content.style.transform = `translate3d(0, 0, ${-this.scrollZ}px)`;
    
    // Calculate progress
    const progress = this.scrollZ / (this.contentHeight - window.innerHeight);
    
    console.log('Animation frame:', {
      scrollZ: this.scrollZ,
      progress,
      contentHeight: this.contentHeight,
      windowHeight: window.innerHeight
    });
    
    // Notify listeners
    this.scrollListeners.forEach(callback => callback(progress));
    
    // Continue animation loop
    this.rafId = requestAnimationFrame(this.animate);
  };
}