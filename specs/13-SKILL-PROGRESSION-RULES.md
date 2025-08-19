# SKILL PROGRESSION RULES

## Core Progression Mechanics

### 🔑 Primary Rule: Tier Gating
Players must invest exactly **5 skill points** in the current tier before gaining access to the next tier. This ensures balanced progression and prevents players from rushing to high-tier abilities without building proper foundations.

```javascript
// Tier Unlock Calculation
function isTierUnlocked(tierNumber) {
  if (tierNumber === 1) return true;
  const previousTierPoints = getTierInvestment(tierNumber - 1);
  return previousTierPoints >= 5;
}
```

### ⚡ Secondary Rule: Prerequisites
Some skills require specific prerequisite skills to be learned before they can be unlocked. These prerequisites must have at least 1 skill point invested, regardless of tier access.

**Example: Fan Hammer Skill**
- **Requirements**: Sniper Specialist AND Shotgun Specialist
- **Logic**: Player must have invested at least 1 point in both prerequisite skills, AND have 5 points total in Tier 2 to access Tier 3 where Fan Hammer resides.

### 📊 Skill Point Budget
- **Total Available**: 60 skill points (1 per level + 5 per 10 levels)
- **Class Skills**: Can invest all 60 points in class tree if desired
- **Elemental Skills**: Share the same 60-point budget
- **Flexibility**: Players choose how to split points between class and elemental trees

## Tier Progression Visualization

### Example: Player with 12 Invested Points

| TIER 1 | TIER 2 | TIER 3 | TIER 4 | TIER 5 | TIER 6 |
|--------|--------|--------|--------|--------|--------|
| 7/∞ points | 5/∞ points | 0/∞ points | 0/∞ points | 0/∞ points | 0/∞ points |
| ✓ UNLOCKED | ✓ UNLOCKED | ✓ AVAILABLE | ✗ LOCKED | ✗ LOCKED | ✗ LOCKED |

**Status**: Player has invested 7 points in Tier 1 and 5 points in Tier 2. Tier 3 is now available for investment, but Tiers 4-6 remain locked until 5 points are invested in Tier 3.

## Skill State System

### Skill States
- **🟢 AVAILABLE**: Tier is unlocked, prerequisites met, skill points available to invest
- **🟡 INVESTED**: Player has invested 1+ points, skill provides active benefits
- **⚫ LOCKED**: Tier not unlocked OR prerequisites not met
- **🔶 MAXED**: Skill has maximum points invested, no further investment possible

### Unlock Conditions

```javascript
// Skill Availability Check
function isSkillAvailable(skill) {
  // Check tier access
  if (!isTierUnlocked(skill.tier)) return false;
  
  // Check prerequisites
  for (let prereq of skill.prerequisites) {
    if (getInvestedPoints(prereq) < 1) return false;
  }
  
  // Check if maxed
  if (getInvestedPoints(skill) >= skill.maxPoints) return false;
  
  return true;
}
```

## Visual Connection System

### 🔗 Connection Line Rules
Connection lines are dynamically generated to show the relationship between skills. These visual indicators help players understand the skill tree structure and plan their builds.

#### When Lines Appear
- Only between skills with actual prerequisite relationships
- Not for general tier progression (no lines for tier gates)
- Lines connect prerequisite skills to dependent skills

#### Line States
- **⚫ Gray**: Prerequisite not met
- **🟢 Green**: Prerequisite met, target available
- **🟡 Gold**: Both skills have points invested

#### Example: Fan Hammer Connections
Fan Hammer requires both "Sniper Specialist" and "Shotgun Specialist". The skill tree shows:
- Two connection lines: Sniper Specialist → Fan Hammer, Shotgun Specialist → Fan Hammer
- Lines turn green when both prerequisites have 1+ points invested
- No connection lines show for tier progression requirements

## Implementation Examples

### Scenario 1: Early Game
- **Player Level**: 15
- **Available Points**: 15
- **Strategy**: Focus on single specialization
  - 5 points in Tier 1 (unlock Tier 2)
  - 5 points in Tier 2 (unlock Tier 3)
  - 5 points in Tier 3 (unlock Tier 4)
  - Can access first Elite skills at level 15

### Scenario 2: Mid Game
- **Player Level**: 35
- **Available Points**: 35
- **Strategy**: Hybrid specialization
  - Spread points across multiple paths
  - Max out key skills for build synergy
  - Access to Tier 5 Mastery skills
  - Begin working toward Ultimate abilities

### Scenario 3: End Game
- **Player Level**: 60
- **Available Points**: 60
- **Strategy**: Complete specialization
  - Access to all 6 tiers
  - Can max 1-2 Ultimate abilities
  - Choice: deep specialization vs. broad coverage
  - Legendary Capstone potentially accessible

## Skill Point Reallocation

### 💎 Respec System
Players can reallocate their skill points to experiment with different builds and adapt to new content or balance changes.

#### Full Reset
- Costs in-game currency
- Returns all 60 points to unallocated pool
- Player can rebuild from scratch
- Useful for major build changes

#### Partial Reset
- Reset individual skills or branches
- Lower cost than full reset
- Allows fine-tuning of builds
- Maintains overall progression