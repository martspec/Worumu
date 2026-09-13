// Input Handler - Keyboard, Mouse & Touch

export default class Input {
  constructor() {
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    this.setupKeyboardInput();
    this.setupMouseInput();
    if (this.isMobile) {
      this.setupTouchInput();
    }
  }

  setupKeyboardInput() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  setupMouseInput() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX += e.movementX;
      this.mouseY += e.movementY;
    });

    document.addEventListener('click', () => {
      if (!document.pointerLockElement) {
        document.documentElement.requestPointerLock();
      }
    });
  }

  setupTouchInput() {
    const joystick = document.getElementById('joystick');
    if (!joystick) return;

    let isJoystickActive = false;
    let joystickStartX = 0;
    let joystickStartY = 0;

    joystick.addEventListener('touchstart', (e) => {
      isJoystickActive = true;
      const touch = e.touches[0];
      joystickStartX = touch.clientX;
      joystickStartY = touch.clientY;
    });

    joystick.addEventListener('touchmove', (e) => {
      if (!isJoystickActive) return;
      const touch = e.touches[0];
      const dx = touch.clientX - joystickStartX;
      const dy = touch.clientY - joystickStartY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 50;

      if (distance > 0) {
        const angle = Math.atan2(dy, dx);
        this.keys.w = Math.sin(angle) < -0.5;
        this.keys.s = Math.sin(angle) > 0.5;
        this.keys.a = Math.cos(angle) > 0.5;
        this.keys.d = Math.cos(angle) < -0.5;
      }
    });

    joystick.addEventListener('touchend', () => {
      isJoystickActive = false;
      this.keys.w = this.keys.s = this.keys.a = this.keys.d = false;
    });
  }
}
