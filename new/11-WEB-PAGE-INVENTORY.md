# COURIER - WEB PAGE INVENTORY
**Complete Page Structure & Function Reference**

---

## PAGE INVENTORY OVERVIEW

This document provides a comprehensive inventory of all web pages required for the Courier web application, their primary functions, and direct references to the design documents they implement. Each page is organized by user flow and development priority.

**Reference Document Key**:
- **ES**: Executive Summary (01)
- **PO**: Player Onboarding (02)  
- **CS**: Character Systems (03)
- **EC**: Elemental Combat (04)
- **EI**: Equipment & Itemization (05)
- **WS**: Weapon Systems (06)
- **MC**: Mission Content (07)
- **PE**: Progression & Economy (08)
- **TI**: Technical Implementation (09)

---

## PUBLIC PAGES (Pre-Authentication)

### **1. Landing Page** (`/`)
**Primary Functions**:
- Game overview and value proposition presentation
- Account creation call-to-action
- Feature highlights and screenshots
- Community/social proof integration

**Design Document References**:
- **PO §19-34**: Account creation flow, design goal of 2-minute onboarding
- **ES §6-8**: Game identity and core innovation explanation
- **ES §37-46**: Game pillars and target experience

**Key UI Elements**:
- Hero section with game description
- "Play Now" prominent button
- Feature showcase (Power Budget System, elemental combat)
- Social proof (player counts, testimonials)

### **2. Registration Page** (`/register`)
**Primary Functions**:
- User account creation with email/password
- Email verification initiation
- Terms of service acceptance
- Immediate redirect to character creation

**Design Document References**:
- **PO §27-34**: Quick registration flow without extensive forms
- **PO §11-15**: Goal of immediate engagement within 2 minutes

**Key UI Elements**:
- Simple email/password form
- "Create Account" submission
- Email verification status
- Direct progression to character creation

### **3. Login Page** (`/login`)
**Primary Functions**:
- Existing user authentication
- Password recovery initiation
- "Remember me" functionality
- Redirect to character selection

**Design Document References**:
- **PO §186-190**: Multi-tab friendly, persistent game state

**Key UI Elements**:
- Email/password authentication form
- "Forgot Password" link
- Persistent login checkbox
- Social login options (optional)

---

## CHARACTER MANAGEMENT PAGES

### **4. Character Creation** (`/character/create`)
**Primary Functions**:
- Class selection with role descriptions
- Basic appearance customization
- Character naming with validation
- Tutorial mission launch preparation

**Design Document References**:
- **PO §38-63**: Simplified initial choices, no overwhelming options
- **CS §48-124**: 5 character classes with distinct identities
- **CS §125-139**: Starting equipment and attribute focus

**Key UI Elements**:
- 5-class selection grid with role descriptions
- Character appearance customization options
- Name input with uniqueness validation
- "Create Character" and immediate tutorial launch

### **5. Character Selection** (`/characters`)
**Primary Functions**:
- Display all player characters
- Character deletion management
- Quick character switching
- New character creation access

**Design Document References**:
- **CS §16-31**: Character progression from 1-60 + Paragon
- **PO §186-190**: Game state persistence across sessions

**Key UI Elements**:
- Character cards showing level, class, and last played
- "Play" buttons for each character
- "Create New Character" option
- Character management options (delete, rename)

---

## CORE GAMEPLAY PAGES

### **6. Game Dashboard** (`/game`)
**Primary Functions**:
- Central hub for all game activities
- Character overview and quick stats
- Active mission monitoring
- Navigation to all game systems

**Design Document References**:
- **ES §70-80**: Short-term and medium-term goal progression
- **MC §8-15**: Mission system as core gameplay loop
- **PO §141-166**: Hub interface with faction representatives

**Key UI Elements**:
- Character portrait with level and key stats
- Active mission progress bars
- Quick navigation to major systems
- Notification center for completed missions

### **7. Character Sheet** (`/game/character`)
**Primary Functions**:
- Complete character stat display with interactive tooltips
- Equipment visualization with 9 clickable slots
- Real-time power budget tracking and validation
- Character progression tracking

**Design Document References**:
- **CS §32-46**: 6 primary attributes with specific effects
- **CS §140-162**: Skill point allocation between trees
- **CS §163-202**: Progression milestones and elemental choices
- **EI §17-44**: Power budget system integration

**Key UI Elements**:
- Interactive equipment slots with slot-specific icons (🗡️, ⛑️, 🛡️, etc.)
- Core stats panel with mouseover tooltips showing secondary stats
- Power budget meter with real-time updates
- 3D character model placeholder with class information

**Interactive Features**:
- **Equipment Slot Interaction**:
  - Equipped items show detailed tooltips on mouseover
  - Empty slots show available equipment popup on mouseover
  - Click empty slots to select and equip items directly
  - Visual feedback with hover effects and equipped state indicators

- **Stats Tooltip System**:
  - Mouseover any core stat (Vigor, Focus, Force, Momentum, Resonance, Defense)
  - Displays comprehensive tooltip with stat description and formula explanations
  - Shows 5 calculated secondary stats per attribute with current values
  - Professional tooltip styling with responsive positioning

**Equipment Management Integration**:
- Bi-directional synchronization with inventory page
- Real-time power budget calculations with rarity efficiency multipliers
- Visual slot state management (empty vs equipped)
- Instant equipment without navigating to inventory

### **8. Equipment Management** (`/game/equipment`)
**Primary Functions**:
- Equipment slot visualization (9 slots)
- Power budget tracking and validation
- Item comparison and optimization tools
- Equipment efficiency analysis

**Design Document References**:
- **EI §17-44**: Power budget system mechanics and formulas
- **EI §55-106**: Equipment slot structure and stat focuses
- **EI §107-138**: Rarity system and efficiency multipliers
- **EI §139-197**: Strategic itemization examples

**Key UI Elements**:
- 9-slot equipment visualization (2 weapons, 7 armor)
- Power budget meter with used/available display
- Item comparison modal with stat differences
- Equipment efficiency ratings and recommendations

### **9. Inventory** (`/game/inventory`)
**Primary Functions**:
- Item storage and organization with interactive tooltips
- Item enhancement and modification
- Item selling and resource conversion
- Equipment management with character sheet synchronization

**Design Document References**:
- **EI §198-223**: Item modification system and enhancement levels
- **WS §260-307**: Weapon modification system (7 slots)
- **PE §42-58**: Currency system for upgrades and modifications
- **EI §17-44**: Power budget validation and efficiency calculations

**Key UI Elements**:
- Interactive item grid with rarity-based border colors
- Advanced filtering system (All, Weapons, Armor, Legendary)
- Item actions panel with equip/enhance/modify/sell options
- Real-time power budget tracking

**Interactive Features**:
- **Item Tooltip System**:
  - Comprehensive mouseover tooltips for all items
  - Detailed stat breakdowns with calculated values
  - Power cost display with rarity efficiency multipliers
  - Item descriptions and type classifications

- **Equipment Integration**:
  - Direct equipping updates character sheet immediately
  - Visual selection highlighting with rarity-appropriate colors
  - Item type indicators (weapon/armor corner badges)
  - Seamless synchronization with character equipment slots

**Navigation Optimization**:
- Moved to second tab position (after Character) for improved workflow
- Enhanced user experience with Character → Inventory → Equipment flow
- JSON-based item database for maintainable data architecture
- Error handling for web server requirements and browser compatibility

---

## MISSION SYSTEM PAGES

### **10. Mission Selection** (`/game/missions`)
**Primary Functions**:
- Available mission display with difficulty tiers
- Success probability calculation and display
- Mission duration and reward preview
- Active affix explanation and impact

**Design Document References**:
- **MC §18-67**: 3 mission categories with time commitments
- **MC §68-179**: Mission affix system and weekly rotation
- **TI §61-88**: Mission success calculation formulas

**Key UI Elements**:
- Mission cards with type, duration, and difficulty
- Success probability prominently displayed
- Affix icons with tooltip explanations
- Reward preview based on success probability

### **11. Mission Launch** (`/game/missions/launch/:id`)
**Primary Functions**:
- Final equipment optimization before launch
- Mission parameter confirmation
- Success probability final calculation
- Mission timer initiation

**Design Document References**:
- **PO §90-112**: Mission launch interface and timer display
- **MC §180-232**: Affix scaling and interaction strategies
- **TI §45-60**: Power budget validation before mission start

**Key UI Elements**:
- Equipment loadout confirmation with power budget display
- Mission details summary with active affixes
- Final success probability calculation
- "Launch Mission" confirmation button

### **12. Active Missions** (`/game/missions/active`)
**Primary Functions**:
- Real-time mission progress monitoring
- Mission timer display and notifications
- Early mission cancellation options
- Mission completion notification handling

**Design Document References**:
- **PO §76-82**: Mission timer and completion notifications
- **MC §8-15**: Timer-based gameplay as core loop
- **PO §186-190**: Background operation when tab not active

**Key UI Elements**:
- Mission progress bars with time remaining
- Real-time countdown timers
- Mission status indicators (running, completing, failed)
- Notification badges for completed missions

### **13. Mission Results** (`/game/missions/results/:id`)
**Primary Functions**:
- Mission outcome presentation (critical/success/partial/failure)
- Reward distribution and collection
- Performance analysis and feedback
- Next mission recommendations

**Design Document References**:
- **MC §330-420**: Mission outcome determination and reward scaling
- **TI §89-110**: Mission outcome calculation and reward generation
- **MC §421-456**: Efficiency optimization based on results

**Key UI Elements**:
- Outcome announcement with visual celebration/consolation
- Reward collection interface with new items highlighted
- Performance breakdown showing what influenced success
- Recommended next missions based on current build

**Mission Success Modal** - ✅ IMPLEMENTED (v0.3.4):
- **Automatic Display**: Appears immediately after mission launch with celebration animation
- **Success Statistics**: Mission duration, efficiency rating, and performance letter grade
- **Comprehensive Rewards System**:
  - Currency rewards (Credits, XP, Reputation) with dynamic parsing
  - Random item drops based on mission reward ranges
  - Rarity-appropriate visual styling with border colors
  - Interactive tooltips on all reward items
- **Visual Polish**:
  - Animated slide-in modal with backdrop blur
  - "New Item" badges with pulsing animation on first reward
  - Glowing success title with professional sci-fi styling
- **Navigation Integration**:
  - "View Inventory" button for immediate gear management
  - "Continue" button returning to mission selection
  - Seamless state management across all systems

**Mission Failure System** - PENDING IMPLEMENTATION:
- **Failure Modal**: Alternative overlay for unsuccessful missions
- **Partial Rewards**: Reduced rewards based on failure type and progress
- **Failure Analysis**: Breakdown of factors contributing to mission failure
- **Retry Options**: Recommendations for equipment/strategy improvements
- **Visual Design**: Red/orange color scheme to contrast success green/cyan

**Outcome Variation System** - PENDING IMPLEMENTATION:
- **Critical Success**: Bonus rewards and special recognition (150% rewards)
- **Standard Success**: Normal reward distribution as currently implemented
- **Partial Success**: Reduced rewards (50-75% of normal) with completion
- **Mission Failure**: Minimal consolation rewards (10-25% of normal)
- **Critical Failure**: No rewards, potential equipment durability loss

---

## PROGRESSION PAGES

### **14. Elemental Specialization** (`/game/elements`)
**Primary Functions**:
- Elemental tree visualization and progression
- Element selection for levels 20 and 40
- Elemental combination explanation and preview
- Skill point allocation within elemental trees

**Design Document References**:
- **EC §25-50**: 5-element wheel and adjacency rules
- **EC §51-229**: Detailed elemental identities and status effects
- **CS §163-202**: Elemental unlock progression and restrictions

**Key UI Elements**:
- Element wheel showing adjacency relationships
- Elemental skill trees with point allocation
- Status effect visualization and explanation
- Element combination preview and synergy display

### **15. Faction Relations** (`/game/factions`)
**Primary Functions**:
- Faction reputation tracking and progress
- Faction vendor access and unique rewards
- Faction choice consequences and benefits
- Faction mission and storyline access

**Design Document References**:
- **PE §59-130**: 4 faction system with reputation progression
- **PE §131-153**: Faction benefits and exclusive rewards
- **PO §145-153**: Faction introduction and awareness building

**Key UI Elements**:
- 4-faction reputation bars with tier indicators
- Faction vendor interfaces with unique items
- Faction choice consequence explanations
- Faction mission tracking and storyline progress

### **16. Paragon Progression** (`/game/paragon`)
**Primary Functions**:
- Post-60 infinite progression tracking
- Paragon level power budget bonus display
- Long-term progression goal visualization
- Paragon milestone celebration

**Design Document References**:
- **CS §16-21**: Paragon levels with +1 power budget per level
- **PE §18-36**: Paragon system mechanics and strategic impact
- **CS §203-219**: End game progression goals

**Key UI Elements**:
- Paragon level counter with next level progress
- Power budget increase visualization (+1 per level)
- Long-term progression milestone tracking
- Paragon achievement celebration interface

---

## OPTIMIZATION & ANALYSIS PAGES

### **17. Build Optimizer** (`/game/optimizer`)
**Primary Functions**:
- Automated equipment optimization for specific goals
- Power budget efficiency analysis
- Build comparison tools
- Saved build configurations

**Design Document References**:
- **EI §139-197**: Strategic itemization and build examples
- **EI §17-44**: Power budget optimization as core innovation
- **MC §233-257**: Build adaptation for weekly affixes

**Key UI Elements**:
- Optimization goal selection (damage, defense, efficiency)
- Automated equipment recommendations
- Build comparison side-by-side analysis
- Save/load build configuration system

### **18. Weekly Strategy** (`/game/strategy`)
**Primary Functions**:
- Current week's affix analysis and explanation
- Build recommendations for active affixes
- Success rate improvements through adaptation
- Community build sharing and ratings

**Design Document References**:
- **MC §258-336**: Weekly rotation system and affix impacts
- **MC §337-420**: Affix interaction and adaptation strategies
- **PO §194-196**: Build sharing through URL system

**Key UI Elements**:
- Current affix display with detailed explanations
- Recommended builds for current week
- Success rate comparison tools
- Community build gallery with ratings

### **19. Statistics & Analytics** (`/game/stats`)
**Primary Functions**:
- Personal performance tracking and trends
- Mission success rate analysis
- Character progression visualization
- Goal setting and achievement tracking

**Design Document References**:
- **PE §154-178**: Progression metric tracking across all systems
- **MC §457-479**: Success metrics and iteration points
- **ES §94-109**: Player engagement and retention metrics

**Key UI Elements**:
- Performance dashboard with key metrics
- Mission success rate trends over time
- Character progression visualization
- Achievement tracking and goal setting

---

## SOCIAL & COMMUNITY PAGES

### **20. Build Sharing** (`/community/builds`)
**Primary Functions**:
- Community build gallery and discovery
- Build rating and commenting system
- Build import/export functionality
- Featured builds and creator spotlights

**Design Document References**:
- **PO §194-196**: URL-based build sharing system
- **ES §94-109**: Community engagement as success metric
- **MC §457-479**: Community input integration

**Key UI Elements**:
- Build gallery with filtering and search
- Build detail pages with import options
- Rating and comment systems
- Featured build rotation and creator profiles

### **21. Leaderboards** (`/community/leaderboards`)
**Primary Functions**:
- Mission completion time rankings
- Success rate leaderboards
- Seasonal competitive events
- Player achievement showcases

**Design Document References**:
- **PE §154-178**: Competitive elements and achievement tracking
- **MC §457-479**: Leaderboard qualification through push content

**Key UI Elements**:
- Multiple leaderboard categories and filters
- Player profile integration with achievements
- Seasonal event tracking and rewards
- Community challenge participation

---

## SUPPORT & META PAGES

### **22. Tutorial Hub** (`/tutorial`)
**Primary Functions**:
- Complete tutorial mission replay access
- System explanation deep-dives
- New player guidance and tips
- Advanced strategy tutorials

**Design Document References**:
- **PO §65-166**: Complete tutorial progression system
- **PO §219-243**: Knowledge checks and complexity management
- **PO §244-272**: Retention hooks and progression guidance

**Key UI Elements**:
- Tutorial mission launcher with progress tracking
- System explanation videos and interactive guides
- Tip of the day and contextual help
- Advanced tutorial unlocks based on progression

### **23. Settings & Preferences** (`/settings`)
**Primary Functions**:
- Account management and security
- Notification preferences and controls
- Interface customization options
- Data export and account deletion

**Design Document References**:
- **PO §179-196**: Browser integration and preference persistence
- **Implementation Plan**: Security considerations and data protection

**Key UI Elements**:
- Account security and password management
- Notification toggles for missions and achievements
- Interface theme and layout options
- Privacy controls and data management

### **24. Help & Documentation** (`/help`)
**Primary Functions**:
- Comprehensive game system documentation
- FAQ and troubleshooting guides
- Contact support functionality
- Community resources and links

**Design Document References**:
- **All Documents**: Reference implementation for every game system
- **PO §273-305**: Success metrics and friction point analysis

**Key UI Elements**:
- Searchable documentation with system references
- FAQ organized by topic and player level
- Support ticket system integration
- Community forum and Discord links

---

## ERROR & UTILITY PAGES

### **25. 404 Not Found** (`/404`)
**Primary Functions**:
- Friendly error messaging for invalid URLs
- Navigation assistance back to main application
- Search functionality for intended content
- Recent page history for quick recovery

### **26. Maintenance Page** (`/maintenance`)
**Primary Functions**:
- Server maintenance notification and scheduling
- Estimated maintenance completion times
- Recent update information and patch notes
- Alternative activities during downtime

### **27. Offline Page** (`/offline`)
**Primary Functions**:
- Progressive Web App offline functionality
- Cached content access during network issues
- Network status monitoring and reconnection
- Limited offline functionality explanation

---

## PAGE HIERARCHY & NAVIGATION

### **Primary Navigation Structure**
```
Landing (/)
├── Register (/register)
├── Login (/login)
└── Game Dashboard (/game)
    ├── Character (/game/character)
    ├── Equipment (/game/equipment)
    ├── Inventory (/game/inventory)
    ├── Missions (/game/missions)
    │   ├── Launch (/game/missions/launch/:id)
    │   ├── Active (/game/missions/active)
    │   └── Results (/game/missions/results/:id)
    ├── Elements (/game/elements)
    ├── Factions (/game/factions)
    ├── Paragon (/game/paragon)
    ├── Optimizer (/game/optimizer)
    ├── Strategy (/game/strategy)
    └── Stats (/game/stats)
```

### **Secondary Navigation**
```
Community
├── Builds (/community/builds)
└── Leaderboards (/community/leaderboards)

Support
├── Tutorial (/tutorial)
├── Settings (/settings)
└── Help (/help)
```

### **Mobile-Responsive Considerations**
- **Collapsible Navigation**: Hamburger menu for mobile devices
- **Touch-Optimized**: All interactive elements sized for touch
- **Progressive Enhancement**: Core functionality works on all devices
- **Offline Support**: Key pages cached for offline access

---

## DEVELOPMENT PRIORITY

### **Phase 1 Pages** (MVP Core) - ✅ IMPLEMENTED
1. Landing Page, Registration, Login
2. Character Creation, Character Selection  
3. Game Dashboard
4. Basic Mission Selection and Launch
5. Equipment Management (simplified)

### **Phase 2 Pages** (Power Budget System) - ✅ IMPLEMENTED  
6. **Character Sheet with Interactive Features** (v0.3.3):
   - Equipment slot visualization with icons and tooltips
   - Empty slot popups showing available items
   - Core stats tooltips with secondary stat calculations
   - Real-time power budget integration
7. **Inventory with Enhancement** (v0.3.2):
   - JSON-based item database (23 items)
   - Interactive tooltips with stat breakdowns
   - Equipment synchronization with character sheet
   - Advanced filtering and selection systems
8. Build Optimizer (basic) - PENDING
9. Complete Equipment Management - PENDING

### **Phase 3 Pages** (Mission System) - ✅ PARTIALLY IMPLEMENTED
10. **Complete Mission Selection with affixes** (v0.3.4):
    - 3-category mission system (Patrol, Horde, Expedition)
    - 7 unique missions with comprehensive data
    - Weekly affix display and mission card integration
    - Interactive mission briefing system with objectives
11. **Mission Results with Success System** (v0.3.4):
    - Animated success modal with performance statistics
    - Dynamic reward generation and item drops
    - Interactive reward collection with tooltips
    - Navigation integration with inventory system
12. Active Missions monitoring - PENDING
13. Weekly Strategy page - PENDING

### **Phase 4 Pages** (Progression Systems)
14. Elemental Specialization
15. Faction Relations
16. Statistics & Analytics
17. Tutorial Hub

### **Phase 5 Pages** (Advanced & Social)
18. Paragon Progression
19. Build Sharing community
20. Leaderboards
21. Advanced optimization tools

### **Phase 6 Pages** (Polish & Support)
22. Settings and preferences
23. Help and documentation
24. Error pages and offline support

Each page directly implements specific portions of the design documents, ensuring that the web application fully realizes the vision of Courier's innovative Power Budget System and strategic depth while maintaining the accessibility and immediate engagement that defines the web version's appeal.

---

## DEMO IMPLEMENTATION STATUS

### **Current Demo Features** (v0.3.4)

**Mission System** - FULLY IMPLEMENTED:
- ✅ **Mission Selection Interface**: 3-column layout with categories, mission grid, and details panel
- ✅ **Mission Database**: 7 comprehensive missions across Patrol, Horde, and Expedition types
- ✅ **Interactive Mission Cards**: Hover effects, difficulty color-coding, and affix display
- ✅ **Mission Briefing System**: Detailed objectives, success rates, and launch functionality
- ✅ **Mission Success Modal**: Animated reward presentation with item drops and statistics
- ✅ **Dynamic Reward Generation**: Random item selection from database with rarity styling
- ✅ **Navigation Integration**: Seamless flow between mission completion and inventory management
- ✅ **Professional UI Design**: Sci-fi aesthetic matching the overall game theme

**Character Sheet Page** - FULLY IMPLEMENTED:
- ✅ Interactive equipment slots with visual icons
- ✅ Mouseover tooltips for equipped items
- ✅ Empty slot popups showing available equipment
- ✅ Click-to-equip functionality from empty slots
- ✅ Core stats tooltips with secondary stat calculations
- ✅ Real-time power budget tracking and updates
- ✅ Professional sci-fi styling with hover effects

**Inventory Page** - FULLY IMPLEMENTED:
- ✅ JSON-based item database (8 weapons, 15 armor)
- ✅ Interactive item tooltips with comprehensive stat information
- ✅ Advanced filtering system (All, Weapons, Armor, Legendary)
- ✅ Equipment synchronization with character sheet
- ✅ Rarity-based visual design with appropriate border colors
- ✅ Item management actions (equip, enhance, modify, sell)
- ✅ Power budget validation and efficiency calculations

**Technical Architecture**:
- ✅ Asynchronous JSON item loading with error handling
- ✅ Cross-page equipment state synchronization
- ✅ Multiple tooltip systems (items, stats, empty slots)
- ✅ Mission system with success modal and reward generation
- ✅ Dynamic item database integration with fallback systems
- ✅ Responsive design with mobile compatibility
- ✅ Web server requirement with proper error messaging

**User Experience Enhancements**:
- ✅ Navigation optimization (Inventory moved to 2nd tab)
- ✅ Tooltip positioning that avoids screen edges
- ✅ Visual feedback for all interactive elements
- ✅ Comprehensive changelog system with version tracking
- ✅ Professional game aesthetics with consistent theming

The demo successfully demonstrates the core Power Budget System mechanics, asynchronous mission system, and comprehensive reward loops, providing a compelling preview of the strategic depth and accessibility that defines Courier's web-first design approach.

---

## MISSION SYSTEM IMPLEMENTATION DETAILS

### **Mission Success System** (v0.3.4)

**Reward Generation Algorithm**:
- **Currency Parsing**: Dynamically extracts Credits and XP from mission reward strings
- **Item Drop Logic**: Uses mission item count ranges (e.g., "2-3" → random 2 or 3 items)
- **Random Selection**: Pulls items from complete 23-item database with equal probability
- **Rarity Distribution**: Natural distribution based on database composition

**Visual Reward Presentation**:
- **Animated Modal**: 0.5s slide-in animation with professional backdrop blur
- **Success Celebration**: Glowing green title with cyan mission name display
- **Performance Statistics**: Duration, efficiency percentage, and letter grade rating
- **Interactive Item Cards**: Hover tooltips showing complete item statistics

**Reward Item Features**:
- **Rarity-Based Styling**: Border colors matching inventory system (common to primal)
- **New Item Indication**: Animated "!" badge on first reward with pulsing effect
- **Tooltip Integration**: Full item stat display using existing tooltip system
- **Visual Hierarchy**: Large item icons with clear name and type display

**Navigation Flow**:
- **Mission Launch**: Automatic item database loading if needed
- **Success Display**: Immediate reward presentation with detailed breakdown
- **Inventory Integration**: Direct navigation to inventory with reward collection
- **Seamless Return**: Continue button returning to mission selection interface

**Future Enhancement Roadmap**:
- **Mission Failure States**: Red-themed modal for unsuccessful missions
- **Partial Success Variants**: Graduated reward scaling based on performance
- **Critical Success Bonuses**: Enhanced rewards for exceptional performance
- **Failure Analysis Tools**: Detailed breakdown of contributing failure factors
- **Equipment Recommendations**: Post-failure suggestions for build improvements