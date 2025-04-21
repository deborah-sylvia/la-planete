import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { SceneRenderer } from './SceneRenderer';
import { createParticles } from './particles';
import { createSpatialObject } from './spatialObject';

export class SceneManager {
  private renderer: SceneRenderer;
  private controls: OrbitControls | null = null;
  private particles: THREE.Points | null = null;
  private spatialObjects: THREE.Object3D[] = [];
  private targetCameraPosition = new THREE.Vector3();
  private initialCameraPosition = new THREE.Vector3();
  
  constructor(renderer: SceneRenderer) {
    this.renderer = renderer;
    this.initialCameraPosition.set(0, 0, 5);
    this.renderer.camera.position.copy(this.initialCameraPosition);
  }
  
  public initialize(): void {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.renderer.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.renderer.scene.add(directionalLight);
    
    // Add particle system
    this.particles = createParticles(10000);
    this.renderer.scene.add(this.particles);
    
    // Add spatial objects for each section with z-axis spacing
    const objectPositions = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -20),
      new THREE.Vector3(0, 0, -40),
      new THREE.Vector3(0, 0, -60),
      new THREE.Vector3(0, 0, -80)
    ];
    
    objectPositions.forEach((position, index) => {
      const object = createSpatialObject(index);
      object.position.copy(position);
      this.spatialObjects.push(object);
      this.renderer.scene.add(object);
    });
  }
  
  public update(): void {
    // Update particles
    if (this.particles) {
      this.particles.rotation.y += 0.0005;
      
      // Update individual particle positions for floating effect
      const positions = (this.particles.geometry as THREE.BufferGeometry).attributes.position;
      const time = Date.now() * 0.0001;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        // Apply subtle sine wave movement
        positions.setY(i, y + Math.sin(time + x * 0.1) * 0.01);
        
        // Update position attribute
        positions.needsUpdate = true;
      }
    }
    
    // Update spatial objects
    this.spatialObjects.forEach((object, index) => {
      object.rotation.y += 0.001 * (index + 1);
      object.rotation.x += 0.0005 * (index + 1);
    });
    
    // Smoothly interpolate camera position
    this.renderer.camera.position.lerp(this.targetCameraPosition, 0.05);
  }
  
  public updateScroll(progress: number): void {
    // Calculate target camera position based on scroll progress
    const targetZ = this.initialCameraPosition.z - 80 * progress;
    
    this.targetCameraPosition.set(
      this.initialCameraPosition.x,
      this.initialCameraPosition.y,
      targetZ
    );
    
    // Update section visibility
    const activeIndex = Math.floor(progress * this.spatialObjects.length);
    if (activeIndex >= 0 && activeIndex < this.spatialObjects.length) {
      // Update active section text
      const sectionTexts = document.querySelectorAll(`.section-${activeIndex + 1}-text`);
      sectionTexts.forEach(element => {
        element.classList.add('opacity-100');
        element.classList.remove('translate-y-8');
      });
    }
  }
  
  public onResize(): void {
    // Update anything that needs to be adjusted on resize
  }
  
  public dispose(): void {
    // Dispose geometries and materials
    if (this.particles) {
      (this.particles.geometry as THREE.BufferGeometry).dispose();
      (this.particles.material as THREE.Material).dispose();
    }
    
    this.spatialObjects.forEach(object => {
      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    
    // Dispose controls
    if (this.controls) {
      this.controls.dispose();
    }
  }
}