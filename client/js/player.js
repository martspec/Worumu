// Player Controller
import * as THREE from 'three';

export default class Player {
  constructor(scene, camera, input) {
    this.scene = scene;
    this.camera = camera;
    this.input = input;

    // Physics
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.speed = 0.15; // units per frame
    this.sprintSpeed = 0.25;
    this.jumpForce = 15;
    this.gravity = 0.3;

    // State
    this.isGrounded = false;
    this.isSprinting = false;
    this.health = 100;
    this.stamina = 100;
    this.hunger = 100;
    this.inventory = [];
    this.selectedItem = 0;

    // Create player model
    this.createModel();
  }

  createModel() {
    // Simple player capsule
    const geometry = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x2196F3 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  spawn(position) {
    this.position.copy(position);
    this.mesh.position.copy(this.position);
    console.log('👤 Player spawned at', position);
  }

  update(deltaTime) {
    // Handle input
    const direction = new THREE.Vector3();

    if (this.input.keys.w) direction.z -= 1;
    if (this.input.keys.s) direction.z += 1;
    if (this.input.keys.a) direction.x -= 1;
    if (this.input.keys.d) direction.x += 1;

    // Normalize direction
    if (direction.length() > 0) {
      direction.normalize();
      this.isSprinting = this.input.keys.shift && this.stamina > 0;
      const currentSpeed = this.isSprinting ? this.sprintSpeed : this.speed;
      
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
      this.velocity.x = direction.x * currentSpeed;
      this.velocity.z = direction.z * currentSpeed;
      
      // Decrease stamina while sprinting
      if (this.isSprinting) {
        this.stamina = Math.max(0, this.stamina - deltaTime * 0.5);
      } else {
        this.stamina = Math.min(100, this.stamina + deltaTime * 0.2);
      }
    } else {
      this.velocity.x *= 0.8;
      this.velocity.z *= 0.8;
      this.stamina = Math.min(100, this.stamina + deltaTime * 0.3);
    }

    // Apply gravity
    this.velocity.y -= this.gravity;
    this.isGrounded = this.position.y <= 0;
    if (this.isGrounded) {
      this.velocity.y = 0;
      this.position.y = 0;
    }

    // Jump
    if (this.input.keys[' '] && this.isGrounded) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
    }

    // Update position
    this.position.add(this.velocity);
    this.mesh.position.copy(this.position);

    // Update rotation from mouse
    this.rotation.order = 'YXZ';
    this.rotation.setFromVector3(new THREE.Vector3(-this.input.mouseY * 0.01, -this.input.mouseX * 0.01, 0));
    this.mesh.rotation.copy(this.rotation);
  }

  addItem(item) {
    this.inventory.push(item);
    console.log('📦 Added item:', item.name);
  }

  removeItem(index) {
    this.inventory.splice(index, 1);
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) {
      this.die();
    }
  }

  die() {
    console.log('💀 Player died!');
    // TODO: Respawn logic
  }
}
