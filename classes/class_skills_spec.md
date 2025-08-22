# Skill Tree System Specification

## Visual Design (WoW Classic-inspired)
- Layout skills in a grid by tier (similar to WoWHead classic talent calculators)
- Each skill icon shows current rank in small box (e.g., "0/5", "3/3")
- Skills connected by lines showing prerequisites
- Grayed out appearance for locked skills/trees
- Full-color appearance for available/learned skills

## Icon Requirements
- Use proper game-style skill icons (not emojis)
- Icon sources:
  - Generate custom SVG icons for skills
  - Use icon libraries (Lucide, Font Awesome, etc.)
  - Create stylized skill art with gradients/effects
- Icons should match skill theme (frost crystals for ice, lightning bolts for electric, etc.)
- Consistent 64x64px base size with border styling

## Skill Mouseover Details
- Always visible on hover, even for locked skills/trees
- Display information:
  - Skill name and description
  - Current rank / Max rank
  - Effect per rank (damage, duration, etc.)
  - Next rank preview
  - Prerequisites (if any)
  - Required character level
  - Required points in tree

## Core Requirements

### File Sources
- Use files from `/Users/busey/Documents/CourierWeb/classes` directory
  - Exclude: `future-classes-overview`
- Use `specs/04-elemental-skills.md` for elemental skill definitions

### Tab Structure
- First tab: Character's starting class
- Following tabs: Elemental trees in order:
  1. Ice
  2. Electric
  3. Fire
  4. Nature
  5. Earth

### Skill Point System
- 1 skill point awarded per character level
- Maximum: 60 skill points at level 60
- Points can be allocated across any unlocked trees
- Available points display: "Available Points: X"
- When purchasing a skill:
  - Available points decrement immediately
  - Save to database: skill purchase + remaining points
  - Update character's skill allocation in real-time

### Tier Unlocking
- Tiers unlock based on points spent in each individual tree
- Tier 2: Unlocked after spending 5 points in that tree
- Must also meet any other prerequisites defined in source documents

### Elemental Tree Access
- All elemental trees start locked
- Display header button: "[unlock at level 20]"
- At level 20: Player chooses ONE elemental tree to unlock
- After first tree unlock, adjacent trees show "[unlock at level 40]"
- Adjacent tree relationships:
  - Ice → Earth, Electric
  - Electric → Ice, Fire  
  - Fire → Electric, Nature
  - Nature → Fire, Earth
  - Earth → Nature, Ice
- At level 40: Player chooses ONE adjacent elemental tree to unlock
- After level 40 selection: All remaining trees show "Unavailable"
- Total elemental trees per character: 2 maximum