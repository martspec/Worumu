// Main Game Class
import * as THREE from 'three';
import World from './world.js';
import Player from './player.js';
import Input from './input.js';
import UI from './ui.js';
import { CraftingSystem } from './crafting.js';
import { FarmingSystem } from './farming.js';

export default class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    this.scene.fog = new THREE.Fog(0x87CEEB, 500, 2000);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 50, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    document.getElementById('game-container').appendChild(this.renderer.domElement);

    // Lighting
    this.setupLighting();

    // Systems
    this.input = new Input();
    this.ui = new UI();
    this.world = new World(this.scene);
    this.player = new Player(this.scene, this.camera, this.input);
    this.crafting = new CraftingSystem();
    this.farming = new FarmingSystem();

    // Game state
    this.running = false;
    this.clock = new THREE.Clock();
    this.objects = [];

    window.game = this; // Global reference
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 150, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
  }

  async start() {
    console.log('⚙️ Initializing game systems...');
    
    try {
      // Generate world
      await this.world.generate();
      console.log('🌍 World generated');
      
      // Setup player
      this.player.spawn(this.world.getSpawnPoint());
      console.log('👤 Player spawned');
      
      // Setup UI
      this.ui.initialize(this.player);
      console.log('🎨 UI initialized');
      
      // Hide loading screen
      document.getElementById('loading').classList.add('hidden');
      
      // Start game loop
      this.running = true;
      this.animate();
      
      console.log('✅ WORUMU Ready!');
    } catch (error) {
      console.error('❌ Game initialization failed:', error);
    }
  }

  animate() {
    if (!this.running) return;
    
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    // Update systems
    this.player.update(deltaTime);
    this.world.update(this.player.position, deltaTime);
    this.ui.update(this.player, this.world);
    this.farming.update(deltaTime);
    
    // Update camera to follow player
    this.updateCamera();
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }

  updateCamera() {
    const offset = new THREE.Vector3(0, 20, -50);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.rotation.y);
    offset.add(this.player.position);
    
    this.camera.position.lerp(offset, 0.1);
    this.camera.lookAt(this.player.position.clone().add(new THREE.Vector3(0, 10, 0)));
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
