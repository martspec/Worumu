// World Generation with Procedural Generation
import * as THREE from 'three';
import { SimplexNoise } from 'simplex-noise';

export default class World {
  constructor(scene) {
    this.scene = scene;
    this.chunkSize = 100;
    this.chunks = new Map();
    this.noise = new SimplexNoise();
    this.scale = 0.05;
    this.maxHeight = 50;
  }

  async generate() {
    console.log('🌍 Generating world...');
    
    // Generate initial chunks around spawn point
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        this.generateChunk(x, z);
      }
    }
    
    console.log('✅ World generation complete');
  }

  generateChunk(chunkX, chunkZ) {
    const key = `${chunkX},${chunkZ}`;
    if (this.chunks.has(key)) return;

    const chunk = new THREE.Group();
    const baseX = chunkX * this.chunkSize;
    const baseZ = chunkZ * this.chunkSize;

    // Create terrain using Perlin noise
    const geometry = new THREE.PlaneGeometry(this.chunkSize, this.chunkSize, 50, 50);
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i] + baseX;
      const z = positions[i + 2] + baseZ;
      const height = this.noise.noise2D(x * this.scale, z * this.scale) * this.maxHeight;
      positions[i + 1] = height;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Create terrain material
    const material = new THREE.MeshStandardMaterial({
      color: 0x228B22, // Forest green
      roughness: 0.8,
      metalness: 0.1
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.castShadow = true;
    terrain.receiveShadow = true;
    terrain.position.set(baseX, 0, baseZ);
    chunk.add(terrain);

    // Add trees randomly
    this.generateTrees(chunk, baseX, baseZ);

    // Add rocks
    this.generateRocks(chunk, baseX, baseZ);

    chunk.position.set(baseX, 0, baseZ);
    this.scene.add(chunk);
    this.chunks.set(key, chunk);
  }

  generateTrees(chunk, baseX, baseZ) {
    for (let i = 0; i < 20; i++) {
      const x = baseX + Math.random() * this.chunkSize;
      const z = baseZ + Math.random() * this.chunkSize;
      const height = this.noise.noise2D(x * this.scale, z * this.scale) * this.maxHeight;

      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 10, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, height + 5, z);
      trunk.castShadow = true;
      chunk.add(trunk);

      // Foliage
      const foliageGeometry = new THREE.SphereGeometry(5, 8, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.set(x, height + 15, z);
      foliage.castShadow = true;
      chunk.add(foliage);
    }
  }

  generateRocks(chunk, baseX, baseZ) {
    for (let i = 0; i < 15; i++) {
      const x = baseX + Math.random() * this.chunkSize;
      const z = baseZ + Math.random() * this.chunkSize;
      const height = this.noise.noise2D(x * this.scale, z * this.scale) * this.maxHeight;
      const scale = 0.5 + Math.random() * 1.5;

      const rockGeometry = new THREE.DodecahedronGeometry(scale, 2);
      const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(x, height + scale, z);
      rock.castShadow = true;
      rock.userData = { type: 'rock', harvestable: true, resource: 'stone' };
      chunk.add(rock);
    }
  }

  update(playerPosition, deltaTime) {
    // Load/unload chunks based on player position
    const chunkX = Math.floor(playerPosition.x / this.chunkSize);
    const chunkZ = Math.floor(playerPosition.z / this.chunkSize);

    // Load nearby chunks
    for (let x = chunkX - 2; x <= chunkX + 2; x++) {
      for (let z = chunkZ - 2; z <= chunkZ + 2; z++) {
        this.generateChunk(x, z);
      }
    }

    // Unload far chunks
    for (const [key, chunk] of this.chunks) {
      const [x, z] = key.split(',').map(Number);
      if (Math.abs(x - chunkX) > 3 || Math.abs(z - chunkZ) > 3) {
        this.scene.remove(chunk);
        this.chunks.delete(key);
      }
    }
  }

  getSpawnPoint() {
    return new THREE.Vector3(0, 50, 0);
  }
}
