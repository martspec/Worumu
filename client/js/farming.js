// Farming System

export class FarmingSystem {
  constructor() {
    this.crops = [
      {
        id: 'wheat',
        name: '🌾 Pšenice',
        growthTime: 60, // seconds
        yield: { name: 'wheat', count: 5 },
        requiredWater: true
      },
      {
        id: 'carrot',
        name: '🥕 Mrkev',
        growthTime: 45,
        yield: { name: 'carrot', count: 3 },
        requiredWater: true
      },
      {
        id: 'potato',
        name: '🥔 Brambor',
        growthTime: 50,
        yield: { name: 'potato', count: 4 },
        requiredWater: true
      }
    ];

    this.plots = new Map(); // position => crop data
  }

  plantCrop(position, cropId) {
    const crop = this.crops.find(c => c.id === cropId);
    if (!crop) return null;

    this.plots.set(position, {
      cropId,
      plantedAt: Date.now(),
      watered: false,
      grown: false
    });

    console.log('🌱 Planted:', crop.name);
    return crop;
  }

  waterCrop(position) {
    const plot = this.plots.get(position);
    if (plot) {
      plot.watered = true;
      console.log('💧 Watered crop');
    }
  }

  harvestCrop(position) {
    const plot = this.plots.get(position);
    if (!plot) return null;

    const crop = this.crops.find(c => c.id === plot.cropId);
    const elapsedSeconds = (Date.now() - plot.plantedAt) / 1000;

    if (elapsedSeconds >= crop.growthTime && plot.watered) {
      this.plots.delete(position);
      console.log('🌾 Harvested:', crop.name);
      return crop.yield;
    }

    return null;
  }

  update(deltaTime) {
    // Update crop growth states
    for (const [pos, plot] of this.plots) {
      const crop = this.crops.find(c => c.id === plot.cropId);
      const elapsedSeconds = (Date.now() - plot.plantedAt) / 1000;
      
      if (elapsedSeconds >= crop.growthTime && plot.watered) {
        plot.grown = true;
      }
    }
  }

  getCrops() {
    return this.crops;
  }
}
