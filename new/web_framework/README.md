# Courier Web Framework

A unified Express.js application serving both static frontend files and backend API for the Courier game system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start in development mode (with hot reload)
npm run dev

# Start in production mode
npm start
```

The application will be available at: **http://localhost:3001**

## 📁 Project Structure

```
courier-web-framework/
├── server.js              # Unified Express.js server
├── database.js            # SQLite database operations
├── package.json           # Dependencies and scripts
├── .gitignore             # Git ignore rules
├── courier.db             # SQLite database file
│
├── assets/                # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript modules
│   └── images/           # Game assets
│
├── game/                 # Game interface pages
│   └── dashboard.html    # Main game dashboard
│
├── specs/                # Technical documentation
├── inventory.html        # Inventory management
├── weapon-detail.html    # Weapon modification interface
├── index.html           # Landing page
└── [other HTML pages]   # Various game interfaces
```

## 🔌 API Endpoints

All API endpoints are available under `/api`:

### Player Management
- `GET /api/player/:playerId` - Get player info
- `GET /api/player/:playerId/inventory` - Get player inventory
- `GET /api/player/:playerId/equipped` - Get equipped items

### Equipment Management
- `POST /api/player/:playerId/equip` - Equip an item
- `POST /api/player/:playerId/unequip` - Unequip an item

### Weapon Modification System
- `GET /api/player/:playerId/weapon/:weaponId/mods` - Get weapon mods
- `GET /api/player/:playerId/mods` - Get available mods
- `POST /api/player/:playerId/weapon/:weaponId/equip-mod` - Equip mod
- `POST /api/player/:playerId/weapon/:weaponId/unequip-mod` - Unequip mod
- `POST /api/player/:playerId/weapon/:weaponId/save-modified` - Save modified weapon

### Missions
- `POST /api/player/:playerId/complete-mission` - Complete mission and get rewards

### Utilities
- `GET /api/health` - Health check endpoint
- `DELETE /api/admin/cleanup-modified-weapons` - Admin cleanup utility

## 🔄 Development Features

### Hot Reload
- Nodemon watches for changes to `.js` files
- Automatically restarts server on backend changes
- Ignores static assets to prevent unnecessary restarts

### Static File Serving
- All HTML, CSS, JS, and image files served directly
- No build process required for frontend
- Relative API paths work seamlessly

### API Integration
- Frontend uses relative paths (`/api/*`) for API calls
- No CORS issues since everything runs on same origin
- Easy development and deployment

## 🎮 Key Pages

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/inventory.html` | Item management interface |
| `/weapon-detail.html?id=<weaponId>` | Weapon modification system |
| `/game/dashboard.html` | Main game dashboard |
| `/loadouts.html` | Character build management |
| `/skills.html` | Skill progression interface |

## 🛠️ Technologies

- **Backend**: Express.js, SQLite3, Node.js
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: SQLite with comprehensive game data
- **Development**: Nodemon for hot reload

## 📊 Features

### Weapon Modification System
- Two-tier mod categories (Attachment vs Catalyst)
- Power budget balancing
- Real-time stat previews
- Persistent weapon modifications

### Inventory Management
- Drag-and-drop item management
- Equipment slot system
- Item tooltips with detailed stats
- Rarity-based visual design

### Game Progression
- Mission completion system
- Reward generation
- Character equipment tracking

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode

### Database
- SQLite database with auto-initialization
- Test data loaded on startup
- Full schema for items, players, equipment, mods

## 🚀 Deployment

The application is ready for deployment as a single unified service:

1. Install dependencies: `npm install`
2. Set production environment: `NODE_ENV=production`
3. Start server: `npm start`

All static files and API endpoints are served from the same Express.js process.

## 📝 Development Notes

### Hot Reload Configuration
```json
"dev": "nodemon server.js --ignore 'assets/' --ignore 'public/' --ignore '*.html'"
```

### API Client Configuration
Frontend uses relative paths for seamless integration:
```javascript
constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
}
```

### Static File Serving
Express serves all files except server-specific ones:
```javascript
app.use(express.static(__dirname, {
    ignore: ['server.js', 'database.js', 'package.json', 'node_modules']
}));
```

## 🔄 Migration Notes

This unified structure replaces the previous split architecture:
- ✅ Frontend served on port 8000 (Python HTTP server)
- ✅ Backend API on port 3001 (Express.js)
- ✅ **Now**: Unified Express.js app on port 3001

### Benefits
- Simplified deployment (single service)
- No CORS configuration needed
- Easier development workflow
- Production-ready architecture

## 📋 Original Framework Components

### ✅ Completed Components

1. **Landing Page** (`index.html`)
   - Hero section with game overview
   - Feature showcase
   - Call-to-action buttons

2. **Authentication Pages** (`public/`)
   - Registration form with validation
   - Login form with remember me
   - Responsive authentication styling

3. **Game Dashboard** (`game/dashboard.html`)
   - Character overview with stats
   - Power budget visualization
   - Equipment grid display
   - Navigation system

4. **Skills System** (`skills.html`)
   - WoW-style skill trees
   - Interactive tooltips
   - Connection lines between tiers
   - Fire elemental tree implementation

5. **Inventory System** (`inventory.html`)
   - Item grid layout with drag-and-drop
   - Filtering system and search
   - Equipment slots and management
   - Weapon modification integration

6. **Weapon Modification System** (`weapon-detail.html`)
   - Two-tier mod categorization
   - Real-time stat previews
   - Power budget calculations
   - Persistent modifications

### Key Features

- **Modular Architecture**: Each page is a separate component
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Data-Driven Systems**: JSON-based item and skill databases
- **Professional UI**: Sci-fi themed design with consistent styling
- **Mobile Responsive**: Works across all device sizes