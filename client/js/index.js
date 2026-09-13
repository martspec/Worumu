// WORUMU - Client Entry Point

import Game from './game.js';

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('🎮 Starting WORUMU...');
  const game = new Game();
  game.start();
}

// Handle window resize
window.addEventListener('resize', () => {
  if (window.game) {
    window.game.resize();
  }
});

// Prevent default mobile behaviors
document.addEventListener('touchmove', (e) => {
  if (e.target.closest('.joystick') || e.target.closest('.action-btn')) {
    e.preventDefault();
  }
}, { passive: false });
