# Courier Web Framework - UI Specifications

*Comprehensive UI and Visual Design Documentation*

## Table of Contents

1. [CSS Versioning System](#css-versioning-system)
2. [Visual Design Components](#visual-design-components)
3. [Interactive UI Elements](#interactive-ui-elements)
4. [Layout Specifications](#layout-specifications)
5. [Technical UI Requirements](#technical-ui-requirements)
6. [Skill Tree Visual System](#skill-tree-visual-system)
7. [Loadout Management Interface](#loadout-management-interface)
8. [Equipment and Inventory Visualization](#equipment-and-inventory-visualization)

---

## CSS Versioning System

The Courier specifications interface uses a versioning system for CSS files to ensure proper cache invalidation and asset management.

### Version Control Pattern
```html
<link rel="stylesheet" href="../assets/css/design-system.css?v=12">
<link rel="stylesheet" href="../assets/css/main.css?v=12">
<link rel="stylesheet" href="../assets/css/game.css?v=12">
```

### Discovered Version Numbers
- **v=12**: Used in index.html, early specification documents (01-03)
- **v=13**: Used in elemental-system.html, equipment specifications
- **v=22**: Used in class-skills.html, progression rules, loadouts

### Version Strategy
- **v=12**: Base design system and main layout components
- **v=13**: Enhanced elemental and equipment visualization features
- **v=22**: Advanced skill tree components and interactive elements

---

## Visual Design Components

### CSS Custom Properties (Design Tokens)

```css
:root {
  /* Core Colors */
  --primary-cyan: #00E5FF;
  --primary-orange: #FF8A00;
  --secondary-purple: #8E24AA;
  
  /* Background System */
  --bg-black: #000000;
  --bg-dark: #1a1a1a;
  --bg-medium: #2a2a2a;
  --bg-light: #3a3a3a;
  
  /* Text Hierarchy */
  --text-bright: #ffffff;
  --text-normal: #cccccc;
  --text-dim: #888888;
  
  /* Border System */
  --border-gray: #444444;
  
  /* Spacing Scale */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-mono: 'Courier New', monospace;
}
```

### Card System Components

#### Base Card Structure
```css
.card {
  background: var(--bg-medium);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.card-title {
  color: var(--primary-cyan);
  font-size: 18px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-accent {
  height: 3px;
  background: linear-gradient(90deg, var(--primary-cyan), var(--primary-orange));
  margin-bottom: var(--spacing-lg);
}
```

#### Specialized Card Variants

##### Class Cards (Character Display)
```css
.class-card {
  background: var(--bg-medium);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-lg);
  transition: all 0.3s ease;
}

.class-card:hover {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}

.class-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.class-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-dark);
  border-radius: 8px;
}
```

##### Equipment Cards (Item Display)
```css
.equipment-card {
  background: var(--bg-medium);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-lg);
  transition: all 0.3s ease;
}

.equipment-card:hover {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}
```

##### Loadout Cards (Build Management)
```css
.loadout-card {
  background: var(--bg-medium);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) 0;
}
```

### Grid Layout Systems

#### Responsive Grid Patterns
```css
/* Standard Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-md) 0;
}

/* Content Grid (Documentation) */
.doc-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-xl) 0;
}

/* Attribute/Stats Grid */
.attribute-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

/* Milestone/Progress Grid */
.milestone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}
```

#### Specialized Grids

##### Tier Progression Grid
```css
.tier-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.tier-card {
  background: var(--bg-dark);
  padding: var(--spacing-md);
  border: 1px solid var(--border-gray);
  text-align: center;
}
```

##### Rarity System Grid
```css
.rarity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

/* Rarity Color System */
.rarity-common { border-color: #888; }
.rarity-uncommon { border-color: #4CAF50; }
.rarity-rare { border-color: #2196F3; }
.rarity-epic { border-color: #9C27B0; }
.rarity-legendary { border-color: #FF9800; }
.rarity-mythic { border-color: #F44336; }
.rarity-primal { border-color: var(--primary-cyan); }
```

### Highlight and Emphasis Components

#### Highlight Boxes
```css
.highlight-box {
  background: var(--bg-dark);
  border: 1px solid var(--primary-orange);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.highlight-box h3 {
  color: var(--primary-orange);
  margin-bottom: var(--spacing-md);
}
```

#### Rule Cards (Important Information)
```css
.rule-card {
  background: var(--bg-dark);
  border: 1px solid var(--primary-orange);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) 0;
}
```

#### Formula Boxes (Technical Specifications)
```css
.formula-box {
  background: var(--bg-dark);
  border: 1px solid var(--primary-cyan);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  font-family: var(--font-mono);
  text-align: center;
}

.formula-box h4 {
  color: var(--primary-cyan);
  margin-bottom: var(--spacing-md);
}
```

---

## Interactive UI Elements

### Navigation Components

#### Primary Navigation Bar
```css
.navbar {
  background: var(--bg-dark);
  border-bottom: 1px solid var(--border-gray);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.nav-username {
  color: var(--primary-cyan);
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
}

.nav-level {
  color: var(--text-dim);
  font-size: 11px;
  text-transform: uppercase;
}

.nav-menu {
  display: flex;
  gap: var(--spacing-md);
}

.nav-item {
  color: var(--text-normal);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid transparent;
  transition: all 0.3s ease;
  font-size: 12px;
  text-transform: uppercase;
}

.nav-item:hover {
  color: var(--primary-cyan);
  border-color: var(--primary-cyan);
}
```

#### Breadcrumb Navigation
```css
.breadcrumb {
  color: var(--text-dim);
  font-size: 12px;
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.breadcrumb a {
  color: var(--primary-cyan);
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--text-bright);
}
```

#### Document Navigation (Bottom)
```css
.doc-nav-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--bg-dark);
  border: 1px solid var(--border-gray);
}

.doc-nav-bottom a {
  color: var(--primary-cyan);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-gray);
  background: var(--bg-medium);
  transition: all 0.3s ease;
}

.doc-nav-bottom a:hover {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}
```

### Hover Effects and Transitions

#### Standard Hover Pattern
```css
.interactive-element {
  transition: all 0.3s ease;
}

.interactive-element:hover {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}
```

#### Card Hover States
```css
.doc-card {
  background: var(--bg-medium);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-lg);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.doc-card:hover {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}
```

### Table of Contents Component

```css
.toc {
  background: var(--bg-medium);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.toc h3 {
  color: var(--primary-cyan);
  margin-bottom: var(--spacing-md);
}

.toc ul {
  list-style: none;
  padding-left: 0;
}

.toc li {
  margin-bottom: var(--spacing-sm);
}

.toc a {
  color: var(--text-normal);
  text-decoration: none;
  font-size: 13px;
}

.toc a:hover {
  color: var(--primary-cyan);
}
```

---

## Layout Specifications

### Page Structure System

#### Standard Page Layout
```css
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.page-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.page-title {
  color: var(--primary-cyan);
  font-size: 32px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.content-section {
  margin-bottom: var(--spacing-xl);
}
```

#### Multi-Column Layouts

##### Two-Column Reading Layout
```css
.reading-order {
  background: var(--bg-dark);
  border: 1px solid var(--primary-orange);
  padding: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

.reading-order h3 {
  color: var(--primary-orange);
  margin-bottom: var(--spacing-md);
}

/* Grid within reading order */
.reading-order > div {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}
```

##### Three-Column Strategy Layout
```css
.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.strategy-card {
  background: var(--bg-medium);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-lg);
}
```

### Visual Hierarchy System

#### Typography Scale
```css
h1 { /* Page Titles */
  font-size: 32px;
  color: var(--primary-cyan);
  text-transform: uppercase;
  letter-spacing: 2px;
}

h2 { /* Section Titles */
  font-size: 24px;
  color: var(--primary-cyan);
  text-transform: uppercase;
  letter-spacing: 1px;
}

h3 { /* Subsection Titles */
  font-size: 18px;
  color: var(--primary-cyan);
}

h4 { /* Component Titles */
  font-size: 16px;
  color: var(--primary-orange);
}

h5 { /* Detail Titles */
  font-size: 14px;
  color: var(--primary-cyan);
}
```

#### Spacing System Application
- **Section Separation**: `var(--spacing-xl)` (32px)
- **Component Separation**: `var(--spacing-lg)` (24px)
- **Element Separation**: `var(--spacing-md)` (16px)
- **Small Spacing**: `var(--spacing-sm)` (8px)
- **Micro Spacing**: `var(--spacing-xs)` (4px)

### Responsive Design Patterns

#### Breakpoint Strategy
```css
/* Mobile-first approach with auto-fit grids */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

/* Large content grids */
.large-content-grid {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

/* Compact component grids */
.compact-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Small item grids */
.small-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

---

## Technical UI Requirements

### JavaScript Integration Points

#### Required Script Files
```html
<script src="../assets/js/main.js"></script>
<script src="../assets/js/navigation.js"></script>
```

#### Event Handling Patterns

##### Navigation State Management
- **Active Page Highlighting**: Navigation items should highlight current page
- **Breadcrumb Updates**: Dynamic breadcrumb generation based on page hierarchy
- **Hash Navigation**: Support for anchor links within long specification documents

##### Interactive Elements
- **Card Hover States**: Enhanced visual feedback on interactive cards
- **Modal Triggers**: Skill selection and loadout management modals
- **Form Validation**: Real-time validation for skill point allocation
- **State Persistence**: LocalStorage integration for user preferences

### Data Visualization Requirements

#### Progress Indicators
```css
.progress-bar {
  background: var(--bg-dark);
  border: 1px solid var(--border-gray);
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, var(--primary-cyan), var(--primary-orange));
  height: 100%;
  transition: width 0.3s ease;
}
```

#### Status Indicators
```css
.status-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
}

.status-available { background: #00ff88; }
.status-invested { background: #ffad00; }
.status-locked { background: #666; }
.status-maxed { background: #ff6600; }
```

### Animation and Transition Specifications

#### Standard Transitions
```css
.smooth-transition {
  transition: all 0.3s ease;
}

.slow-transition {
  transition: all 0.5s ease;
}

.fast-transition {
  transition: all 0.15s ease;
}
```

#### Hover Animations
```css
.scale-on-hover {
  transition: transform 0.3s ease;
}

.scale-on-hover:hover {
  transform: scale(1.02);
}

.glow-on-hover {
  transition: box-shadow 0.3s ease;
}

.glow-on-hover:hover {
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}
```

---

## Skill Tree Visual System

### Skill Slot Visualization

#### Slot States and Visual Representation
```css
.skill-slot {
  background: var(--bg-medium);
  border: 2px solid var(--border-gray);
  padding: var(--spacing-sm);
  text-align: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.skill-slot.filled {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}

.skill-slot.empty {
  border-style: dashed;
  opacity: 0.6;
}

.skill-slot.locked {
  border-color: var(--text-dim);
  opacity: 0.5;
  background: var(--bg-dark);
}

.skill-slot.available {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}
```

#### Tier Progression Boxes
```css
.tier-progression {
  background: var(--bg-dark);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
}

.tier-header {
  background: var(--bg-dark);
  padding: var(--spacing-sm);
  border: 1px solid var(--primary-orange);
  margin-bottom: var(--spacing-sm);
}

.tier-section {
  background: var(--bg-dark);
  border: 1px solid var(--primary-cyan);
  padding: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

.tier-section h3 {
  color: var(--primary-cyan);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  font-size: 20px;
  text-transform: uppercase;
}
```

#### Skill Item Cards
```css
.skill-item {
  background: var(--bg-dark);
  padding: var(--spacing-sm);
  border: 1px solid var(--border-gray);
  margin-bottom: var(--spacing-sm);
}

.skill-item h5 {
  color: var(--primary-cyan);
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 12px;
}

.skill-example {
  background: var(--bg-light);
  border-left: 3px solid var(--primary-cyan);
  padding: var(--spacing-md);
  margin: var(--spacing-sm) 0;
}

.skill-points {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-normal);
}
```

### Connection Line System

#### Visual Connection Rules
- **Connection lines appear only between skills with prerequisite relationships**
- **Lines do not show for general tier progression**
- **Lines connect prerequisite skills to dependent skills**

#### Line State Visualization
```css
.connection-line {
  stroke-width: 2px;
  transition: stroke 0.3s ease;
}

.connection-line.locked {
  stroke: #404040; /* Gray - prerequisite not met */
}

.connection-line.available {
  stroke: #00ff88; /* Green - prerequisite met, target available */
}

.connection-line.active {
  stroke: #ffad00; /* Gold - both skills have points invested */
}
```

### Tier Unlock States

#### Visual Tier Progression
```css
.progression-visual {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
}

.tier-box {
  background: var(--bg-medium);
  border: 2px solid var(--border-gray);
  padding: var(--spacing-sm);
  text-align: center;
  border-radius: 4px;
}

.tier-box.unlocked {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}

.tier-box.locked {
  border-color: var(--text-dim);
  opacity: 0.5;
}
```

---

## Loadout Management Interface

### Slot System Visualization

#### Slot Categories and Layout
```css
.slot-visual {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  margin: var(--spacing-sm) 0;
}

.slot-box {
  background: var(--bg-medium);
  border: 2px solid var(--border-gray);
  padding: var(--spacing-sm);
  text-align: center;
  border-radius: 4px;
  font-size: 12px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-filled {
  border-color: var(--primary-cyan);
  background: var(--bg-light);
}

.slot-empty {
  border-style: dashed;
  opacity: 0.6;
}
```

#### Ultimate Slot Styling
```css
.ultimate-slot {
  border-color: var(--primary-orange);
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-medium));
}

.ultimate-slot.filled {
  border-color: var(--primary-orange);
  background: linear-gradient(135deg, var(--bg-medium), var(--bg-light));
  box-shadow: 0 0 15px rgba(255, 138, 0, 0.3);
}
```

### Workflow Steps Visualization

```css
.workflow-step {
  background: var(--bg-dark);
  border-left: 3px solid var(--primary-cyan);
  padding: var(--spacing-md);
  margin: var(--spacing-sm) 0;
}

.workflow-step strong {
  color: var(--primary-cyan);
}
```

### Build Template Cards

```css
.build-example {
  background: var(--bg-light);
  border: 1px solid var(--border-gray);
  padding: var(--spacing-md);
  margin: var(--spacing-sm) 0;
}

.build-example h3 {
  color: var(--primary-orange);
  margin-bottom: var(--spacing-sm);
}

.build-example h4 {
  color: var(--primary-orange);
  margin-bottom: var(--spacing-sm);
}
```

---

## Equipment and Inventory Visualization

### Item Rarity Color System

#### Complete Rarity Palette
```css
.rarity-common { 
  border-color: #888; 
  color: #888;
}

.rarity-uncommon { 
  border-color: #4CAF50; 
  color: #4CAF50;
}

.rarity-rare { 
  border-color: #2196F3; 
  color: #2196F3;
}

.rarity-epic { 
  border-color: #9C27B0; 
  color: #9C27B0;
}

.rarity-legendary { 
  border-color: #FF9800; 
  color: #FF9800;
}

.rarity-mythic { 
  border-color: #F44336; 
  color: #F44336;
}

.rarity-primal { 
  border-color: var(--primary-cyan); 
  color: var(--primary-cyan);
}
```

### Enhancement Level Visualization

```css
.enhancement-levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.enhancement-item {
  background: var(--bg-dark);
  padding: var(--spacing-md);
  border: 2px solid #FFD700;
}

.enhancement-item h4 {
  color: #FFD700;
  margin-bottom: var(--spacing-sm);
}

/* Enhancement glow effects */
.enhancement-1 {
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.enhancement-2 {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.enhancement-3 {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
}
```

### Power Budget Visualization

```css
.power-budget-bar {
  background: var(--bg-dark);
  border: 1px solid var(--border-gray);
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  margin: var(--spacing-sm) 0;
}

.power-budget-fill {
  background: linear-gradient(90deg, var(--primary-cyan), var(--primary-orange));
  height: 100%;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-bright);
  font-size: 11px;
  font-weight: bold;
}

.power-budget-text {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-normal);
  text-align: center;
}
```

---

## Footer Component

### Standard Footer Layout
```css
footer {
  padding: 20px;
  text-align: center;
  font-size: 10px;
  color: #666;
  border-top: 1px solid #333;
  margin-top: 40px;
}

footer a {
  color: #666;
  text-decoration: none;
  border-bottom: 1px dotted #666;
}

footer a:hover {
  color: var(--primary-cyan);
}
```

### Footer Content Pattern
- **CHANGELOG** link
- **SPECS** link
- **RELATED** documentation links
- **LAST UPDATED** timestamp
- Document-specific context and navigation hints

---

## Implementation Guidelines

### CSS Organization
1. **Base Layer**: `design-system.css` - Core design tokens and base components
2. **Layout Layer**: `main.css` - Page layouts and grid systems
3. **Game Layer**: `game.css` - Game-specific components and interactions

### Performance Considerations
- **CSS Grid**: Used extensively for responsive layouts without media queries
- **Transitions**: Consistent 0.3s ease timing for most interactions
- **Hover States**: Lightweight border and background color changes
- **Image Assets**: Minimal use, relying on CSS-generated visual effects

### Accessibility Features
- **High Contrast**: Dark theme with bright accent colors
- **Typography Scale**: Clear hierarchy with adequate size differences
- **Focus States**: Inherits from hover states for keyboard navigation
- **Color Coding**: Always paired with text labels or patterns

### Browser Compatibility
- **CSS Grid**: Modern browser requirement (Chrome 57+, Firefox 52+, Safari 10.1+)
- **CSS Custom Properties**: Modern browser requirement
- **Flexbox**: Fallback support for older layout requirements

This comprehensive UI specification provides the complete foundation for implementing the Courier specifications interface, ensuring consistent visual design, interactive behavior, and technical implementation across all game system documentation and tools.