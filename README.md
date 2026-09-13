# WORUMU - 3D Multiplayer Open-World Game 🌍

**Realistická webová 3D hra s OpenStreetMap integrací, farmováním, craftingem a stavbou budov!**

## Features ✨

- 🌍 **OpenStreetMap Integration** - Reálné mapy z OSM dat
- 🎮 **Procedural Generation** - Nekonečný svět generovaný algoritmicky
- 👥 **Multiplayer** - Více hráčů na jednom serveru
- 🏗️ **Building System** - Stavba budov a struktur
- 🌾 **Farming** - Pěstování plodin a chov zvířat
- 🔨 **Crafting System** - Výroba předmětů z surovin
- ⛏️ **Resource Gathering** - Těžba, řezání stromů, sběr
- 📱 **Mobile Friendly** - Hratelné na mobilních zařízeních
- 🎨 **Realistic Graphics** - 3D grafika s Three.js

## Tech Stack 🛠️

- **Frontend:** Three.js, Webpack, Babel
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB (Mongoose)
- **Maps:** OpenStreetMap API
- **3D Rendering:** WebGL

## Installation 📦

```bash
# Clone repo
git clone https://github.com/martspec/Worumu.git
cd Worumu

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure 📁

```
Worumu/
├── public/
│   └── index.html           # Main HTML file
├── client/
│   ├── js/
│   │   ├── game.js         # Main game logic
│   │   ├── player.js       # Player controller
│   │   ├── world.js        # World generation
│   │   ├── crafting.js     # Crafting system
│   │   ├── farming.js      # Farming system
│   │   ├── ui.js           # UI/HUD
│   │   └── input.js        # Input handling (touch + keyboard)
│   ├── css/
│   │   └── style.css       # Styles
│   └── index.js            # Entry point
├── server/
│   ├── index.js            # Server entry
│   ├── socketHandler.js    # Socket.io events
│   ├── models/
│   │   ├── Player.js       # Player data model
│   │   ├── World.js        # World data model
│   │   └── Item.js         # Item/Resource model
│   ├── controllers/
│   │   ├── gameController.js
│   │   ├── playerController.js
│   │   └── worldController.js
│   └── utils/
│       ├── mapGenerator.js # OSM + Procedural gen
│       └── craftingRecipes.js
├── webpack.config.js       # Webpack config
└── README.md
```

## Configuration ⚙️

Vytvoř `.env` soubor:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/worumu
OSM_API_URL=https://overpass-api.de/api/interpreter
```

## How to Play 🎮

### Controls (Desktop)
- **WASD** - Pohyb
- **Mouse** - Otáčení kamery
- **E** - Interakce/Sběr
- **R** - Crafting menu
- **T** - Trading
- **B** - Building mode

### Controls (Mobile)
- **Left Joystick** - Pohyb
- **Tap** - Interakce
- **Swipe** - Otáčení kamery
- **On-screen buttons** - Akce (crafting, building, farming)

## Features Roadmap 🗺️

- [x] Project setup
- [ ] Basic 3D world rendering
- [ ] Player movement & camera
- [ ] OpenStreetMap integration
- [ ] Procedural terrain generation
- [ ] Resource gathering system
- [ ] Crafting system
- [ ] Farming system
- [ ] Building system
- [ ] Multiplayer sync
- [ ] NPC & Trading
- [ ] Inventory system
- [ ] Mobile touch controls
- [ ] Optimization & performance

## Contributing 🤝

Přispívej a vylepši hru! Forkni projekt a pošli PR.

## License 📄

MIT License - volně použitelné

## Author ✍️

**martspec** - https://github.com/martspec

---

**Staň se součástí vývoje WORUMU!** 🚀
