# UI SPECIFICATIONS
**Visual Design System for Courier Game Documentation**

---

## CSS VERSIONING SYSTEM

### Version Control Strategy
The HTML specification files use a systematic CSS versioning approach:

- **v=12**: Base design system (Executive Summary, Character Systems)
- **v=13**: Enhanced elemental features (Elemental Combat, Skills)
- **v=22**: Advanced skill tree components (Class Skills, Progression Rules, Loadouts)

```html
<link rel="stylesheet" href="../assets/css/design-system.css?v=12">
<link rel="stylesheet" href="../assets/css/main.css?v=12">
<link rel="stylesheet" href="../assets/css/game.css?v=12">
```

---

## VISUAL DESIGN COMPONENTS

### Color Palette
```css
/* Primary Colors */
--primary-cyan: #00ff88;
--primary-orange: #ff6600;
--secondary-purple: #9955ff;

/* Background Hierarchy */
--bg-black: #000000;
--bg-dark: #111111;
--bg-medium: #1a1a1a;
--bg-light: #222222;

/* Text Colors */
--text-bright: #ffffff;
--text-normal: #cccccc;
--text-dim: #888888;

/* Borders */
--border-gray: #333333;
```

### Typography Scale
```css
/* Page Titles */
.page-title {
    font-size: 32px;
    font-weight: bold;
    color: var(--text-bright);
}

/* Card Titles */
.card-title {
    font-size: 24px;
    color: var(--primary-cyan);
}

/* Section Headers */
h3 {
    color: var(--primary-orange);
    font-size: 18px;
}
```

### Spacing System
```css
/* Consistent spacing variables */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

---

## LAYOUT COMPONENTS

### Card System
```css
.card {
    background: var(--bg-medium);
    border: 1px solid var(--border-gray);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.card-header {
    margin-bottom: var(--spacing-md);
}

.card-accent {
    height: 3px;
    background: linear-gradient(90deg, var(--primary-cyan), var(--primary-orange));
    margin-bottom: var(--spacing-lg);
}
```

### Grid Systems
```css
/* Responsive pillar grid */
.pillar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
}

/* Feature grid for smaller items */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-md);
}

/* Metrics grid for data display */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
}
```

---

## INTERACTIVE UI ELEMENTS

### Skill Slot Visualization
```css
.slot-visual {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
}

.slot-box {
    background: var(--bg-medium);
    border: 2px solid var(--border-gray);
    padding: var(--spacing-sm);
    text-align: center;
    border-radius: 4px;
    font-size: 12px;
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

### Tier Progression System
```css
.progression-visual {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--spacing-sm);
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

### Skill Connection Lines
```css
/* Visual states for skill prerequisites */
.connection-line.available {
    stroke: #00ff88; /* Green - prerequisite met */
    stroke-width: 2px;
}

.connection-line.locked {
    stroke: #404040; /* Gray - prerequisite not met */
    stroke-width: 1px;
    stroke-dasharray: 5,5;
}

.connection-line.invested {
    stroke: #ffad00; /* Gold - both skills have points */
    stroke-width: 3px;
}
```

### Hover Effects and Transitions
```css
/* Standard hover transition */
.nav-item, .doc-nav-bottom a, .toc a {
    transition: all 0.3s ease;
}

.nav-item:hover {
    color: var(--primary-cyan);
    background: var(--bg-light);
}

.card:hover {
    border-color: var(--primary-cyan);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 255, 136, 0.1);
}
```

---

## SPECIALIZED COMPONENTS

### Class and Build Cards
```css
.class-card {
    background: var(--bg-medium);
    border: 1px solid var(--border-gray);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
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

### Skill Examples and Workflows
```css
.skill-example {
    background: var(--bg-light);
    border-left: 3px solid var(--primary-cyan);
    padding: var(--spacing-md);
    margin: var(--spacing-sm) 0;
}

.workflow-step {
    background: var(--bg-dark);
    border-left: 3px solid var(--primary-cyan);
    padding: var(--spacing-md);
    margin: var(--spacing-sm) 0;
}
```

### Rule and Highlight Boxes
```css
.rule-card {
    background: var(--bg-dark);
    border: 1px solid var(--primary-orange);
    padding: var(--spacing-lg);
    margin: var(--spacing-md) 0;
}

.highlight-box {
    background: var(--bg-dark);
    border: 1px solid var(--primary-orange);
    padding: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
}

.example-card {
    background: var(--bg-light);
    border-left: 3px solid var(--primary-cyan);
    padding: var(--spacing-md);
    margin: var(--spacing-sm) 0;
}
```

---

## NAVIGATION COMPONENTS

### Breadcrumb System
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

### Document Navigation
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

### Table of Contents
```css
.toc {
    background: var(--bg-medium);
    border: 1px solid var(--border-gray);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
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

## CODE AND FORMULA DISPLAY

### Formula Boxes
```css
.formula-box {
    background: var(--bg-black);
    border: 1px solid var(--border-gray);
    padding: var(--spacing-md);
    font-family: var(--font-mono);
    font-size: 13px;
    margin: var(--spacing-sm) 0;
}

/* Syntax highlighting */
.formula-box .comment {
    color: var(--primary-cyan);
}

.formula-box .code {
    color: var(--text-bright);
}
```

### Rarity Color System
```css
/* Item rarity indicators */
.rarity-common { color: #cccccc; }
.rarity-uncommon { color: #00ff00; }
.rarity-rare { color: #0080ff; }
.rarity-epic { color: #8000ff; }
.rarity-legendary { color: #ff8000; }
.rarity-primal { color: #ff0080; }
.rarity-eternal { color: #ff0000; }
```

---

## RESPONSIVE DESIGN SPECIFICATIONS

### Breakpoint System
```css
/* Mobile First Approach */
@media (min-width: 768px) {
    .pillar-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .pillar-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1440px) {
    .pillar-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

### Mobile Navigation
```css
@media (max-width: 767px) {
    .nav-menu {
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-dark);
        border-top: 1px solid var(--border-gray);
    }
    
    .doc-nav-bottom {
        flex-direction: column;
        gap: var(--spacing-md);
    }
}
```

---

## ACCESSIBILITY SPECIFICATIONS

### Focus States
```css
.nav-item:focus,
.doc-nav-bottom a:focus,
.toc a:focus {
    outline: 2px solid var(--primary-cyan);
    outline-offset: 2px;
}
```

### High Contrast Support
```css
@media (prefers-contrast: high) {
    :root {
        --bg-medium: #000000;
        --bg-light: #111111;
        --border-gray: #ffffff;
        --text-normal: #ffffff;
    }
}
```

---

## PERFORMANCE CONSIDERATIONS

### CSS Optimization
- Use CSS custom properties for consistent theming
- Minimize repaints with transform-based animations
- Leverage CSS Grid for efficient layouts
- Use relative units for responsive scaling

### JavaScript Integration Points
```javascript
// Skill state management
function updateSkillState(skillId, state) {
    const element = document.getElementById(skillId);
    element.className = `skill-box ${state}`;
}

// Tier unlock visualization
function updateTierProgression(tierData) {
    tierData.forEach((tier, index) => {
        const tierBox = document.querySelector(`.tier-box:nth-child(${index + 1})`);
        tierBox.className = `tier-box ${tier.unlocked ? 'unlocked' : 'locked'}`;
    });
}
```

---

## IMPLEMENTATION GUIDELINES

### CSS Architecture
1. **Base Styles**: design-system.css for foundational elements
2. **Layout Styles**: main.css for page structure and components
3. **Game Styles**: game.css for game-specific UI elements

### Component Development
1. Follow BEM methodology for CSS class naming
2. Use CSS custom properties for themeable values
3. Implement mobile-first responsive design
4. Ensure keyboard accessibility for all interactive elements

### Version Management
1. Increment CSS version numbers for significant UI changes
2. Maintain backward compatibility within major versions
3. Document UI changes in changelog
4. Test across different screen sizes and devices