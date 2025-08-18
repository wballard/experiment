# Core Class Archetype System - Revised

## Overall Structure

### Skill Point Economy
- **60 Total Skill Points** available at max level
- **Hard Trade-offs Required**: Impossible to max multiple trees
- **1 Ultimate Active**: Only one ultimate can be equipped at a time
- **Unlock Schedule**:
  - Level 1: Class tree unlocked
  - Level 20: First elemental tree unlocked
  - Level 40: Second elemental tree unlocked

### Skill Tree Progression Rules
- **Tier Unlocking**: Requires 5 points in previous tier
- **Point Distribution**: Can allocate points across any unlocked tree
- **No Energy System**: All abilities use cooldown timers

### Class Tree Organization (5-6 Tiers)

#### Tier 1 - Initiation (Levels 1-10)
- **5-8 skill points available**
- Basic passives and class identity
- Core weapon interactions
- Required: 1 point minimum to unlock class

#### Tier 2 - Foundation (Levels 10-20)
- **8-10 skill points available**
- Enhanced passives and first active ability
- Weapon specialization choice
- Required: 5 points in Tier 1

#### Tier 3 - Specialization (Levels 20-30)
- **10-12 skill points available**
- Path selection (choose specialization direction)
- Second active ability
- Required: 5 points in Tier 2

#### Tier 4 - Advancement (Levels 30-40)
- **10-12 skill points available**
- Path-specific enhancements
- Third active ability
- Required: 5 points in Tier 3

#### Tier 5 - Mastery (Levels 40-50)
- **8-10 skill points available**
- Elite passives
- Aura selection (choose 1 of 2-3)
- Required: 5 points in Tier 4

#### Tier 6 - Transcendence (Levels 50-60)
- **5-8 skill points available**
- Ultimate ability
- Capstone passives
- Required: 5 points in Tier 5

### Elemental Tree Organization (4 Tiers)

#### Tier 1 - Elemental Foundation (Unlocks at Level 20)
- Basic elemental conversion and resistance
- Required: 1 point to unlock element

#### Tier 2 - Elemental Specialization (Requires 5 points in Tier 1)
- Active elemental abilities
- Enhanced elemental effects

#### Tier 3 - Elemental Mastery (Requires 5 points in Tier 2)
- Advanced combinations
- Elemental ultimate ability

#### Tier 4 - Elemental Transcendence (Requires 5 points in Tier 3)
- Capstone passive
- Maximum elemental power

### Core Ability Types

#### 1. Weapon Passives
- Each class has unique interactions with weapon archetypes
- Available weapons: Assault Rifle, Sniper Rifle, SMG, Shotgun, Handgun
- Passives modify weapon behavior based on class theme
- Can be enhanced by elemental conversions

#### 2. Class Passives
- Always-on effects that define playstyle
- Many include chance-based effects that scale with point investment
- Examples: 5/10/15/20/25% chance at ranks 1-5

#### 3. Active Abilities
- Distributed across tiers 2-4
- Cooldown-based (no energy cost)
- Can be ranked up for stronger effects or reduced cooldowns
- Limited active slots (to be defined in next prompt)

#### 4. Ultimate Abilities
- One powerful ability per tree (class or elemental)
- Only ONE ultimate can be equipped at a time
- Long cooldown (60-120 seconds base)
- Defines peak power fantasy

#### 5. Auras
- Unlocked in Tier 5 of class trees
- Passive team buffs in 15m radius
- Only one aura active at a time
- 10 second cooldown to switch

### Design Principles
1. **Meaningful Choices**: 60 points across 3 trees forces specialization
2. **Clear Progression**: Each tier requires investment before advancing
3. **Weapon Synergy**: Class and elemental effects can stack on weapons
4. **Build Diversity**: Many viable combinations within point limits
5. **Ultimate Exclusivity**: Only one ultimate ensures clear build identity

## Build Archetypes with 60 Points

### Pure Class Specialist (45-50 points in class)
- Can reach Tier 6 with some tier 5 investment
- Access to class ultimate and most abilities
- 10-15 points for basic elemental augmentation

### Dual Element Hybrid (20 class / 20 element 1 / 20 element 2)
- Tier 3-4 in class (no ultimate)
- Tier 2-3 in both elements
- Maximum versatility, no ultimate abilities

### Class + Element Focus (35 class / 25 element)
- Tier 5 in class (no ultimate)
- Tier 3 in element (possible elemental ultimate)
- Balanced power with one ultimate option

### Elemental Purist (15 class / 30 primary element / 15 secondary)
- Basic class abilities only
- Near-maximum investment in one element
- Access to elemental ultimate and transcendence

## Skill Point Distribution Examples

### Example: Level 60 Outlaw Build
- **Tier 1**: 5 points (unlock tier 2)
- **Tier 2**: 7 points (weapon mastery + passive)
- **Tier 3**: 8 points (path selection)
- **Tier 4**: 10 points (path abilities)
- **Tier 5**: 5 points (unlock tier 6)
- **Tier 6**: 5 points (ultimate)
- **Total Class**: 40 points
- **Fire Element**: 15 points (Tier 1-2)
- **Electric Element**: 5 points (Tier 1 only)

This creates hard choices - you can't have everything!

## Implementation Benefits
1. **Clear Progression Path**: Linear tier unlocking is easy to understand
2. **Reusable UI**: Same tree structure for all classes and elements
3. **Balanced Power Budget**: 60 points creates meaningful limitations
4. **Visual Clarity**: Progress through tiers is visually intuitive
5. **Build Identity**: One ultimate rule creates clear character definition