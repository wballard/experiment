# Unified Equipped Items Grid Component

## Overview

The `equipped-items-grid.js` component provides consistent equipped items display across all pages in the application. This eliminates code duplication and ensures uniform behavior.

## Usage

### Basic Usage

```html
<!-- Include CSS and JS -->
<link rel="stylesheet" href="assets/css/equipped-items-grid.css">
<script src="assets/js/equipped-items-grid.js"></script>

<!-- HTML structure -->
<div class="equipment-grid">
    <div class="equipment-slot" data-slot="head"></div>
    <div class="equipment-slot" data-slot="shoulders"></div>
    <div class="equipment-slot" data-slot="primary"></div>
    <div class="equipment-slot" data-slot="chest"></div>
    <div class="equipment-slot" data-slot="back"></div>
    <div class="equipment-slot" data-slot="secondary"></div>
    <div class="equipment-slot" data-slot="gloves"></div>
    <div class="equipment-slot" data-slot="legs"></div>
</div>
```

### JavaScript API

```javascript
// Auto-initialize (happens automatically if .equipment-grid exists)
// No code needed - component auto-loads on DOMContentLoaded

// Manual initialization
await window.EquippedItemsGrid.display('.equipment-grid', characterId);

// Refresh the grid
await window.EquippedItemsGrid.refresh('.equipment-grid', characterId);

// Character ID is optional - will auto-detect if not provided
await window.EquippedItemsGrid.display('.equipment-grid');
```

## Features

- **Automatic character detection**: If no character ID provided, uses active character or falls back to ID 3
- **Path handling**: Automatically fixes icon paths based on page location (root vs /game/ subfolder)
- **Tooltips**: Built-in tooltip support using CourierTooltips system
- **Click handling**: Automatic weapon detail page navigation for equipped weapons
- **Power calculation**: Updates power display elements if they exist on page
- **Responsive**: Mobile-friendly responsive design
- **Loading states**: Visual loading indicators
- **Rarity colors**: Consistent rarity-based border colors and hover effects

## Equipment Slots

Valid equipment slots (8 total):
- `head` - Head armor
- `shoulders` - Shoulder armor  
- `chest` - Chest armor
- `gloves` - Glove armor
- `legs` - Leg armor
- `back` - Back armor
- `primary` - Primary weapon (wide slot)
- `secondary` - Secondary weapon (wide slot)

## Pages Using This Component

- **Dashboard** (`/dashboard.html`) - Character overview with equipped items
- **Inventory** (`/inventory.html`) - Equipment management
- Any future pages that need equipped items display

## Benefits

1. **Consistency**: Same look/behavior everywhere
2. **Maintainability**: One place to fix bugs/add features
3. **Debugging**: No more hours spent debugging duplicate code
4. **Performance**: Cached/optimized single implementation

## Migration from Legacy Code

If you have existing equipment display code:

1. Include the CSS/JS files
2. Replace custom equipment loading with: `window.EquippedItemsGrid.display('.equipment-grid')`
3. Remove duplicate equipment rendering functions
4. Test tooltips and click functionality

## Error Handling

The component gracefully handles:
- Missing character data
- Invalid icon paths (uses fallback)
- Network errors
- Missing DOM elements
- Missing dependencies (tooltips, etc.)

All errors are logged to console with descriptive messages.