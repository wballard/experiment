# Courier Web Framework

This directory contains the modular web framework version of the Courier demo, broken down into functional pages and components as outlined in the Web Page Inventory document.

## Directory Structure

```
web_framework/
├── index.html                    # Landing page
├── public/                       # Public authentication pages
│   ├── register.html
│   └── login.html
├── game/                         # Main game pages
│   ├── dashboard.html           # Central game hub
│   ├── character/               # Character management
│   ├── inventory/               # Item management
│   │   └── inventory.html
│   ├── missions/                # Mission system
│   │   └── missions.html
│   ├── elements/                # Skills and elemental systems
│   │   └── skills.html
│   ├── equipment/               # Equipment optimization
│   ├── factions/                # Faction relations
│   ├── paragon/                 # End-game progression
│   ├── optimizer/               # Build optimization tools
│   ├── strategy/                # Weekly strategy guides
│   └── stats/                   # Performance analytics
├── community/                   # Social features
│   ├── builds/                  # Build sharing
│   └── leaderboards/            # Competitive rankings
├── support/                     # Help and utilities
│   ├── tutorial/                # Tutorial system
│   ├── settings/                # User preferences
│   └── help/                    # Documentation
└── assets/                      # Static resources
    ├── css/                     # Stylesheets
    │   ├── main.css            # Core styles
    │   ├── landing.css         # Landing page
    │   ├── auth.css            # Authentication
    │   ├── game.css            # Game dashboard
    │   ├── skills.css          # Skills system
    │   ├── inventory.css       # Inventory management
    │   └── missions.css        # Mission system
    ├── js/                      # JavaScript modules
    │   ├── main.js             # Core application
    │   ├── navigation.js       # Page routing
    │   ├── character.js        # Character system
    │   ├── inventory.js        # Inventory management
    │   ├── missions.js         # Mission system
    │   ├── skills.js           # Skills system
    │   └── auth.js             # Authentication
    ├── data/                    # JSON data files
    │   ├── items.json          # Item database
    │   ├── skills.json         # Skills database
    │   └── missions.json       # Mission database
    └── images/                  # Image assets
```

## Implementation Status

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

4. **Skills System** (`game/elements/skills.html`)
   - WoW-style skill trees
   - Interactive tooltips
   - Connection lines between tiers
   - Fire elemental tree implementation

5. **Core Framework** (`assets/js/`)
   - Modular navigation system
   - Component loading architecture
   - Global game state management
   - Utility functions

### 🚧 In Progress Components

1. **Inventory System** (`game/inventory/`)
   - Item grid layout structure
   - Filtering system placeholder
   - Action buttons framework

2. **Mission System** (`game/missions/`)
   - Mission categories interface
   - Weekly affixes display
   - Mission card grid structure

### 📋 Pending Implementation

1. **Character Management** (`game/character/`)
2. **Equipment Optimization** (`game/equipment/`)
3. **Community Features** (`community/`)
4. **Support Pages** (`support/`)

## Key Features

### Modular Architecture
- Each page is a separate component
- Dynamic loading of page content
- Reusable CSS and JavaScript modules

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced features load dynamically
- Mobile-responsive design

### Data-Driven Systems
- JSON-based item and skill databases
- Configurable game parameters
- Easy content updates

### Professional UI
- Sci-fi themed design
- Consistent color scheme and typography
- Interactive tooltips and animations

## Usage

1. **Development Server Required**: The framework uses fetch() for component loading, requiring a web server (not file:// protocol).

2. **Starting Point**: Open `index.html` for the landing page or `game/dashboard.html` for the game interface.

3. **Adding Components**: Create new HTML files in appropriate directories and register them in the navigation system.

4. **Styling**: Add component-specific CSS files in `assets/css/` and link them in component HTML.

5. **Data**: Update JSON files in `assets/data/` to modify game content.

## Development Workflow

1. **Page Structure**: Create HTML component in appropriate directory
2. **Styling**: Add CSS file for component-specific styles
3. **Functionality**: Add JavaScript module for interactive features
4. **Integration**: Register component in navigation system
5. **Testing**: Verify functionality and responsive design

This framework provides a solid foundation for expanding the Courier game into a full web application while maintaining clean separation of concerns and modular development practices.