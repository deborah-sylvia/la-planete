import * as THREE from 'three';

export function createSpatialObject(index: number): THREE.Object3D {
  // Create different objects for each section
  const group = new THREE.Group();
  
  switch (index) {
    case 0: // First section - Circular formation
      createCircularFormation(group);
      break;
    case 1: // Second section - Double helix
      createDoubleHelix(group);
      break;
    case 2: // Third section - Crystal formation
      createCrystalStructure(group);
      break;
    case 3: // Fourth section - Wave field
      createWaveField(group);
      break;
    case 4: // Fifth section - Sphere grid
      createSphereGrid(group);
      break;
    default:
      createDefaultObject(group);
  }
  
  return group;
}

function createCircularFormation(group: THREE.Group): void {
  const count = 20;
  const radius = 3;
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0x222222
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, 0);
    
    // Add connecting lines
    if (i > 0) {
      const points = [
        new THREE.Vector3(x, y, 0),
        new THREE.Vector3(
          Math.cos((i - 1) / count * Math.PI * 2) * radius,
          Math.sin((i - 1) / count * Math.PI * 2) * radius,
          0
        )
      ];
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);
    }
    
    group.add(sphere);
  }
}

function createDoubleHelix(group: THREE.Group): void {
  const count = 40;
  const radius = 2;
  const height = 8;
  
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 4;
    
    // First helix
    const x1 = Math.cos(angle) * radius;
    const y1 = t * height - height / 2;
    const z1 = Math.sin(angle) * radius;
    
    // Second helix (offset by 180 degrees)
    const x2 = Math.cos(angle + Math.PI) * radius;
    const y2 = t * height - height / 2;
    const z2 = Math.sin(angle + Math.PI) * radius;
    
    // Create spheres
    const geometry = new THREE.SphereGeometry(0.15, 12, 12);
    
    const material1 = new THREE.MeshStandardMaterial({ 
      color: 0xf5f5f5,
      emissive: 0x222222
    });
    
    const material2 = new THREE.MeshStandardMaterial({ 
      color: 0xe0e0e0,
      emissive: 0x111111
    });
    
    const sphere1 = new THREE.Mesh(geometry, material1);
    sphere1.position.set(x1, y1, z1);
    
    const sphere2 = new THREE.Mesh(geometry, material2);
    sphere2.position.set(x2, y2, z2);
    
    // Connect the helices periodically
    if (i % 5 === 0) {
      const connectorPoints = [
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x2, y2, z2)
      ];
      
      const connectorGeometry = new THREE.BufferGeometry().setFromPoints(connectorPoints);
      const connectorMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
      });
      
      const connector = new THREE.Line(connectorGeometry, connectorMaterial);
      group.add(connector);
    }
    
    group.add(sphere1);
    group.add(sphere2);
  }
}

function createCrystalStructure(group: THREE.Group): void {
  // Create central icosahedron
  const geometry = new THREE.IcosahedronGeometry(1.5, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.8
  });
  
  const icosahedron = new THREE.Mesh(geometry, material);
  group.add(icosahedron);
  
  // Create crystal spikes radiating from vertices
  const positions = geometry.getAttribute('position');
  
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    
    // Normalize to get direction
    const length = Math.sqrt(x * x + y * y + z * z);
    const nx = x / length;
    const ny = y / length;
    const nz = z / length;
    
    // Create spike geometry
    const spikeLength = 1 + Math.random() * 2;
    const spikeGeometry = new THREE.CylinderGeometry(0.05, 0.01, spikeLength, 4);
    const spikeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x222222,
      transparent: true,
      opacity: 0.6
    });
    
    const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
    
    // Position spike
    spike.position.set(
      x + nx * spikeLength / 2,
      y + ny * spikeLength / 2,
      z + nz * spikeLength / 2
    );
    
    // Orient spike
    spike.lookAt(0, 0, 0);
    spike.rotateX(Math.PI / 2);
    
    group.add(spike);
  }
}

function createWaveField(group: THREE.Group): void {
  const size = 10;
  const segments = 20;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  
  // Modify vertices to create wave pattern
  const positions = geometry.getAttribute('position');
  const amplitude = 0.5;
  
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    
    // Create wave pattern
    const z = amplitude * Math.sin(x * 2) * Math.cos(y * 2);
    positions.setZ(i, z);
  }
  
  // Need to update normals after changing positions
  geometry.computeVertexNormals();
  
  // Create material with wireframe
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  
  const waveMesh = new THREE.Mesh(geometry, material);
  group.add(waveMesh);
  
  // Add floating orbs above the wave
  const orbCount = 15;
  
  for (let i = 0; i < orbCount; i++) {
    const orbGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 16, 16);
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x222222,
      transparent: true,
      opacity: 0.7
    });
    
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    
    // Position randomly above the wave
    orb.position.set(
      (Math.random() - 0.5) * size,
      (Math.random() - 0.5) * size,
      amplitude * 2 + Math.random() * 2
    );
    
    group.add(orb);
  }
}

function createSphereGrid(group: THREE.Group): void {
  const size = 3;
  const count = 4;
  const spacing = size / (count - 1);
  
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      for (let z = 0; z < count; z++) {
        // Skip some positions randomly
        if (Math.random() > 0.7) continue;
        
        const posX = (x - (count - 1) / 2) * spacing;
        const posY = (y - (count - 1) / 2) * spacing;
        const posZ = (z - (count - 1) / 2) * spacing;
        
        // Create sphere
        const radius = 0.1 + 0.05 * (Math.sin(x + y + z) + 1);
        const geometry = new THREE.SphereGeometry(radius, 12, 12);
        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x222222,
          transparent: true,
          opacity: 0.8
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(posX, posY, posZ);
        
        group.add(sphere);
        
        // Add connecting lines to neighbors
        if (x > 0) {
          connectWithLine(
            group,
            new THREE.Vector3(posX, posY, posZ),
            new THREE.Vector3(posX - spacing, posY, posZ)
          );
        }
        
        if (y > 0) {
          connectWithLine(
            group,
            new THREE.Vector3(posX, posY, posZ),
            new THREE.Vector3(posX, posY - spacing, posZ)
          );
        }
        
        if (z > 0) {
          connectWithLine(
            group,
            new THREE.Vector3(posX, posY, posZ),
            new THREE.Vector3(posX, posY, posZ - spacing)
          );
        }
      }
    }
  }
}

function createDefaultObject(group: THREE.Group): void {
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.7
  });
  
  const torusKnot = new THREE.Mesh(geometry, material);
  group.add(torusKnot);
}

function connectWithLine(
  group: THREE.Group, 
  pointA: THREE.Vector3, 
  pointB: THREE.Vector3
): void {
  const points = [pointA, pointB];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.2
  });
  
  const line = new THREE.Line(lineGeometry, lineMaterial);
  group.add(line);
}