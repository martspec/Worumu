// Crafting System

export class CraftingSystem {
  constructor() {
    this.recipes = [
      {
        id: 'wooden_planks',
        name: '🪵 Dřevěné prkna',
        ingredients: [{ name: 'wood', count: 2 }],
        output: { name: 'wooden_planks', count: 4 }
      },
      {
        id: 'wooden_pickaxe',
        name: '⛏️ Dřevěný Krumpáč',
        ingredients: [
          { name: 'wooden_planks', count: 3 },
          { name: 'stone', count: 2 }
        ],
        output: { name: 'wooden_pickaxe', count: 1 }
      },
      {
        id: 'stone_pickaxe',
        name: '⛏️ Kamenný Krumpáč',
        ingredients: [
          { name: 'stone', count: 5 },
          { name: 'wooden_planks', count: 2 }
        ],
        output: { name: 'stone_pickaxe', count: 1 }
      },
      {
        id: 'wooden_door',
        name: '🚪 Dřevěné Dveře',
        ingredients: [{ name: 'wooden_planks', count: 6 }],
        output: { name: 'wooden_door', count: 1 }
      },
      {
        id: 'chest',
        name: '📦 Truhla',
        ingredients: [{ name: 'wooden_planks', count: 8 }],
        output: { name: 'chest', count: 1 }
      }
    ];
  }

  craft(recipeId, playerInventory) {
    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe) return null;

    // Check ingredients
    for (const ingredient of recipe.ingredients) {
      const item = playerInventory.find(i => i.name === ingredient.name);
      if (!item || item.count < ingredient.count) {
        console.log('❌ Insufficient materials');
        return null;
      }
    }

    // Remove ingredients
    for (const ingredient of recipe.ingredients) {
      const item = playerInventory.find(i => i.name === ingredient.name);
      item.count -= ingredient.count;
      if (item.count === 0) {
        playerInventory.splice(playerInventory.indexOf(item), 1);
      }
    }

    // Add output
    const existingItem = playerInventory.find(i => i.name === recipe.output.name);
    if (existingItem) {
      existingItem.count += recipe.output.count;
    } else {
      playerInventory.push({ ...recipe.output });
    }

    console.log('✅ Crafted:', recipe.name);
    return recipe.output;
  }

  getRecipes() {
    return this.recipes;
  }
}
