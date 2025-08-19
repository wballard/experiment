# LOADOUTS & SKILL ASSIGNMENT

## Loadout System Overview

The Loadout System allows players to create, save, and quickly switch between different skill configurations. This system bridges the gap between skill investment (character progression) and skill deployment (active combat abilities), enabling players to experiment with different playstyles and optimize for specific content.

### Core Features

#### 🎯 Skill Assignment
Assign learned skills to specific action slots. Only skills with invested points can be assigned. Players can customize which abilities are actively available during combat.

#### 💾 Build Management
Save multiple loadout configurations for different scenarios. Switch between builds for boss fights, mob clearing, PvP, or support roles with a single click.

#### 🔄 Real-time Sync
Loadouts automatically reflect current skill investments. When you invest more points in a skill, all loadouts using that skill show the updated rank and effects.

#### 📋 Predefined Builds
Access optimized builds for common playstyles. These templates help new players understand skill synergies and provide starting points for custom builds.

## Skill Slot System

### Slot Categories

#### 🌅 Ultimate Slot (1)
Dedicated slot for ultimate abilities. Only Tier 6 skills can be assigned here.

#### ⚡ Active Slots (6)
Quick-access slots for combat abilities. Can assign any learned active skill.

#### 🛡️ Passive Display
All invested passive skills automatically apply. No assignment needed - shows current bonuses for reference.

### Assignment Rules

#### Eligibility Requirements
- Skill must have at least 1 invested point
- Ultimate skills require Tier 6 access
- No skill point cost for assignment/reassignment
- Can assign same skill to multiple slots if desired

#### Slot Limitations
- **Ultimate slot**: Only Tier 6 skills (High Noon, Dead Man's Hand, Perfect Shot)
- **Active slots**: Any non-passive skill with active component
- **Empty slots**: Remain functional - click to assign skills
- **Removal**: Right-click or long-press to remove assigned skills

#### Dynamic Updates
- Skill effects update based on current investment
- Cooldowns and damage scale with skill rank
- Invalid assignments removed if prerequisites lost
- Visual indicators show skill rank and effectiveness

## Predefined Loadout Templates

The system includes four optimized loadout templates that demonstrate effective skill combinations and provide starting points for players to customize their builds.

### 🎯 Boss Killer
- **Focus**: Single-target elimination
- **Ultimate**: High Noon
- **Key Skills**: Dead Eye, Sniper Specialist, Fan Hammer, Bullet Time
- **Strategy**: Precision shooting with time manipulation

### 🌪️ Mob Clear
- **Focus**: Area damage and crowd control
- **Ultimate**: Dead Man's Hand
- **Key Skills**: Shotgun Specialist, Explosive Rounds, Ricochet Roulette
- **Strategy**: AOE damage with explosive effects

### ⚔️ PvP Duelist
- **Focus**: Mobility and unpredictability
- **Ultimate**: Perfect Shot
- **Key Skills**: Lucky Charm, Vanish, Quick Draw, Lucky Streak
- **Strategy**: Hit-and-run with luck manipulation

### 🤝 Support
- **Focus**: Team utility and debuffs
- **Ultimate**: Varies by situation
- **Key Skills**: Mark Death, Steady Aim, Run & Gun
- **Strategy**: Enemy debuffing with consistent damage

## Player Workflow

### Creating a New Loadout
1. Navigate to Loadouts page
2. Click empty loadout slot or "Create New"
3. Assign skills to Ultimate and Active slots
4. Name and save the loadout configuration
5. Test and refine skill combinations

### Skill Assignment Process
1. **Select Slot**: Click on empty slot (+ icon)
2. **Choose Skill**: Modal shows available learned skills
3. **Confirm**: Click skill to assign to selected slot
4. **Verify**: Slot shows skill icon, name, and current rank
5. **Modify**: Click assigned slot to remove or reassign

### Switching Loadouts
1. **Browse**: Click loadout tabs to preview builds
2. **Compare**: View skill assignments and passive effects
3. **Activate**: Click "Activate Loadout" to apply
4. **Sync**: Current skill investments automatically update
5. **Deploy**: Use skills in combat with new configuration

## Technical Implementation

### Data Storage

#### LocalStorage Integration
Loadouts saved to browser localStorage for persistence across sessions. Skill investments sync between Skills page and Loadouts page automatically.

#### Data Structure
```javascript
// Loadout Object Structure
{
  name: "Boss Killer",
  ultimate: "high-noon",
  actives: ["fan-hammer", "bullet-time", null, null, null, null],
  timestamp: "2025-08-17T12:00:00Z"
}
```

### Skill Validation

#### Assignment Checks
- Verify skill has invested points before assignment
- Check slot type compatibility (Ultimate vs Active)
- Validate prerequisites are still met
- Remove invalid assignments when loading

#### Real-time Updates
- Monitor skill investment changes
- Update displayed effects and cooldowns
- Refresh passive skill calculations
- Maintain loadout validity

### User Interface

#### Visual Indicators
- Skill icons with rank indicators
- Empty slots with dashed borders and + icons
- Tooltip information on hover
- Color coding for different skill types

#### Modal System
- Skill selector popup for assignment
- Filter available skills by slot type
- Preview skill effects before assignment
- Cancel/confirm assignment actions

## System Integration

### 📊 Skills Page
Direct integration with skill tree investment. Changes in skill points immediately reflect in loadout system. Navigation links between pages for seamless workflow.

### ⚔️ Combat System
Active loadout determines available combat abilities. Skill cooldowns, damage, and effects pulled from current loadout configuration during gameplay.

### 👤 Character Sheet
Passive skill bonuses from loadout apply to character statistics. Equipment recommendations can factor in loadout requirements and synergies.

### 🎯 Build Planner
Future integration with build planning tools. Export/import loadout configurations. Sharing builds between players and theory-crafting community features.