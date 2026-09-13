// UI Manager

export default class UI {
  constructor() {
    this.statsPanel = document.getElementById('stats');
    this.inventoryPanel = document.getElementById('inventory');
    this.hotbar = document.getElementById('hotbar');
    this.minimap = document.getElementById('minimap');
  }

  initialize(player) {
    this.player = player;
    this.updateHotbar();
  }

  update(player, world) {
    this.updateStats(player);
    this.updateInventory(player);
    this.updateMinimap(player, world);
  }

  updateStats(player) {
    this.statsPanel.innerHTML = `
      <div style="color: #ff4444;">❤️ Health: ${Math.round(player.health)}/100</div>
      <div style="color: #ffff44;">⚡ Stamina: ${Math.round(player.stamina)}/100</div>
      <div style="color: #ff8844;">🍖 Hunger: ${Math.round(player.hunger)}/100</div>
      <div style="color: #4488ff;">📍 Pos: ${Math.round(player.position.x)}, ${Math.round(player.position.y)}, ${Math.round(player.position.z)}</div>
    `;
  }

  updateInventory(player) {
    this.inventoryPanel.innerHTML = `
      <div style="margin-bottom: 10px;"><strong>📦 Inventář (${player.inventory.length}/64)</strong></div>
      ${player.inventory.map((item, i) => `
        <div style="padding: 5px; background: rgba(15,52,96,0.5); margin: 5px 0; border-radius: 4px;">
          ${item.name} x${item.count}
        </div>
      `).join('')}
    `;
  }

  updateHotbar() {
    this.hotbar.innerHTML = Array(8).fill(0).map((_, i) => `
      <div class="hotbar-slot ${i === this.player.selectedItem ? 'active' : ''}">🔧</div>
    `).join('');
  }

  updateMinimap(player, world) {
    // Simple minimap placeholder
    this.minimap.innerHTML = `<div style="text-align: center; padding: 50px 20px;">🗺️ Mapa</div>`;
  }
}
