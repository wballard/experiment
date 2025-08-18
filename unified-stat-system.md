# UNIFIED ITEM & WEAPON STATISTICS SYSTEM
**Version 2.0**
=====================================

## TABLE OF CONTENTS
-----------------
1. System Overview
2. Core Weapon Statistics
3. Weapon Modifiable Stats
4. Armor Statistics
5. Universal Stats
6. Stat Distribution by Item Type
7. Display Guidelines
8. Stat Stacking & Calculations


## 1. SYSTEM OVERVIEW
=====================

This document unifies weapon base statistics with the item stat system, defining how all stats work together in the game.

### Stat Categories
------------------
1. **Core Weapon Stats**: Immutable base properties intrinsic to each weapon
2. **Modifiers**: Stats that enhance core values, can appear on weapons, armor, or skills
3. **Defensive Stats**: Health, shields, resistances (primarily on armor)
4. **Universal Stats**: Attributes and resources on any item type

### Core Design Philosophy
-------------------------
- **Core stats** define weapon identity and cannot be changed
- **Modifiers** enhance core stats and can come from any source
- **No artificial restrictions** - offensive modifiers can appear on armor
- **Build diversity** through creative stat combinations across all gear

### Display Tiers
----------------
- **Visible Stats**: Show exact numerical values
- **Bar Chart Stats**: Display as 1-10 bars (SPECIAL)
- **Hidden Stats**: Backend only, never shown to players


## 2. CORE WEAPON STATISTICS
============================

These are intrinsic to each weapon and cannot be modified by affixes, only enhanced by percentage modifiers.

### Visible Core Stats (Show Exact Values)
-----------------------------------------
**Damage Per Shot**
- Type: Integer
- Base Range: 20-1500 (depends on weapon type)
- Display: "45" (exact number)

**Fire Rate (RPM)**
- Type: Integer  
- Base Range: 15-1200 RPM
- Display: "600 RPM"

**Magazine Size**
- Type: Integer
- Base Range: 1-150
- Display: "30"

**Max Range**
- Type: Float (meters)
- Base Range: 8-120m
- Display: "45m"

**DPS** (Calculated)
- Type: Float
- Formula: (Damage × Fire Rate) / 60
- Display: "450.5 DPS"

**Weakspot Multiplier**
- Type: Float
- Base Range: 1.5x-5.0x
- Display: "2.5x"

**Burst Fire Rate** (Burst weapons only)
- Type: Integer
- Display: "540 RPM (3-burst)"

### Bar Chart Core Stats (1-10 Display)
---------------------------------------
**Reload Time**
- Internal: 1.0-4.0 seconds
- Bar Display: 10 = fastest (1.0s), 1 = slowest (4.0s)

**Swap Speed**
- Internal: 200-800ms
- Bar Display: 10 = fastest, 1 = slowest

**ADS Speed**
- Internal: 200-400ms
- Bar Display: 10 = fastest, 1 = slowest

**Sprint to Fire**
- Internal: 100-300ms
- Bar Display: 10 = fastest, 1 = slowest

**Movement Modifier**
- Internal: 0.85-1.0 (85-100% speed)
- Bar Display: 10 = no penalty, 1 = heavy

**ADS Movement Speed**
- Internal: 0.4-0.7 (40-70% speed)
- Bar Display: 10 = fastest strafe, 1 = slowest

**Vertical Recoil**
- Internal: 0.5-3.0 degrees
- Bar Display: 10 = minimal, 1 = extreme

**Horizontal Recoil**
- Internal: 0.1-1.0 degrees
- Bar Display: 10 = minimal, 1 = extreme

### Hidden Core Stats
--------------------
- Bullets Per Shot: 1-12
- Shots Per Burst: 3-5
- Spread Min: 0.5-2.0°
- Spread Max: 2.0-8.0°
- Spread Heat per Shot: 5-20%
- Spread Heat Cooldown: 20-50%/sec
- ADS Spread Modifier: 0.3x-0.5x
- Hipfire Spread Modifier: 1.5x-3.0x


## 3. STAT MODIFIERS
====================

These modifiers can appear on weapons, armor, and skills to enhance core weapon performance and character abilities.

### Damage Modifiers
-------------------
Available on: Weapons (high values), Armor (moderate values), Skills
- **Weapon Damage %**: +2-10% (multiplies all weapon damage)
- **Critical Strike Chance %**: +1-5% (cap: 50%)
- **Critical Strike Damage %**: +5-25%
- **Weakspot Damage %**: +5-20% (multiplies base weakspot multiplier)
- **Armor Piercing**: +5-50

### Elemental Damage Modifiers
-----------------------------
Available on: Any item type with varying values
- **"+X% Damage as [Element]"**: 
  - Weapons: +10-25%
  - Armor: +5-15% (commonly on Gloves, Chest, Bracers)
  - Skills: +10-30%
- **"+X [Element] Damage"**:
  - Weapons: +15-50
  - Armor: +5-25 (commonly on Gloves, Bracers)
  - Skills: +10-40
- **"+X% [Element] Damage"**:
  - Weapons: +20-50%
  - Armor: +10-30% (any armor piece)
  - Skills: +15-40%

### Weapon Performance Modifiers
-------------------------------
Available on: Any item type, but more common/higher on weapons
- **Fire Rate %**: +2-8% (multiplies base RPM)
- **Reload Speed %**: +5-15% (reduces reload time)
- **Magazine Size**: +1-5 flat OR +5-15%
- **Handling %**: +5-15% (reduces swap time)
- **ADS Speed %**: +5-20% (reduces ADS time)
- **ADS Movement %**: +10-30% (reduces ADS movement penalty)
- **Spread Reduction %**: +5-20% (tightens spread cone)
- **Recoil Reduction %**: +5-20% (reduces kick)
- **Range %**: +5-15% (extends effective range)

### Ammo & Combat Effects
------------------------
Available on: Weapons primarily, some unique armor pieces
- **Ammo Reserve %**: +10-30%
- **Ammo Return on Crit**: 1-3 bullets
- **Explosive Rounds**: 5-15% chance
- **Ricochet Rounds**: Bounces to 1-2 enemies
- **Life on Kill**: +10-50
- **Shield on Kill**: +10-30
- **Cooldown on Kill %**: +2-5%
- **Cooldown on Weakspot %**: +0.5-2%


## 4. DEFENSIVE STATISTICS
=========================

Primarily found on armor but some can appear on weapons for hybrid builds.

### Health & Vitality
--------------------
Available on: Armor primarily, rare weapon affixes
- **Health**: +20-200 (flat)
- **Health %**: +2-8%
- **Health Regen**: +5-25/sec
- **Damage Reduction %**: +1-5%

### Energy Shield Stats
----------------------
Available on: Armor primarily, some unique weapons
- **Shield Capacity**: +10-150
- **Shield Capacity %**: +2-10%
- **Shield Delay Reduction %**: +5-30% (cap: 50%)
- **Shield Regen Rate %**: +10-50% (cap: 300%)

### Resistance Stats
-------------------
Available on: Armor only
- **[Element] Resistance %**: +2-15% per element
- **All Elements Resistance %**: +1-5%
- **Status Effect Resistance %**: +5-20%

### Armor Stats
--------------
Available on: Armor only
- **Armor**: +5-50 (base defensive stat)

### Movement Stats
-----------------
Available on: Primarily legs, some unique items
- **Movement Speed %**: +2-8%
- **Sprint Speed %**: +3-10%
- **Slide Speed %**: +10-30% (cap: 200%)
- **Slide Duration %**: +10-40% (cap: 400%)

### Status Effect Modifiers
--------------------------
Available on: Armor only, focused on elemental builds
- **Status Effect Generation %**: +5-20% (builds status faster)
- **Status Effect Power %**: +10-30% (increases effect strength)
- **[Element] Status Generation %**: +10-25% (specific element buildup)
- **[Element] Status Power %**: +15-35% (specific element strength)
- **All Status Duration %**: +10-30% (extends effect duration)


## 5. UNIVERSAL STATS
====================

Can appear on both weapons and armor.

### Attributes
-------------
- **Vigor**: +5-100
- **Focus**: +5-100
- **Force**: +5-100
- **Momentum**: +5-100
- **Resonance**: +5-100
- **Bulwark**: +5-100

### Resource Management
----------------------
- **Ability Damage %**: +3-12%
- **Energy Max**: +10-50
- **Energy Regen**: +1-5/sec

### On-Kill/Hit Effects
----------------------
- **Life on Kill**: +10-50
- **Shield on Kill**: +10-30
- **Cooldown on Kill %**: +2-5% (instant cooldown reduction)
- **Cooldown on Weakspot %**: +0.5-2% (instant cooldown reduction)
- **Cooldown on Critical %**: +0.5-1.5% (instant cooldown reduction)


## 6. STAT DISTRIBUTION BY ITEM TYPE
====================================

### WEAPONS
----------
**Primary Weapons**
- All weapon-exclusive stats
- Higher elemental damage modifiers
- Moderate attributes
- No defensive stats

**Power Weapons**
- All weapon-exclusive stats
- Highest elemental damage values
- Lower ADS/movement modifiers
- Unique perks (Vorpal, etc.)

### ARMOR SLOTS
--------------
**Head**
- Focus: Precision & abilities
- Common Stats: Critical chance %, ADS speed %, **ability CDR %**, shield, single resistance
- Unique Perks: Targeting mods for weapon types

**Shoulders**
- Focus: Balanced offense/defense
- Common Stats: Weapon damage %, armor, health, ability damage, **grenade CDR %**, ammo reserves
- Unique Perks: Ammo finder mods

**Back**
- Focus: Resistance specialization
- Common Stats: Multiple resistances, highest "All Elements %", shield regen, **ultimate CDR %**
- Unique Perks: Seasonal mod slot

**Chest**
- Focus: Core survivability with offensive options
- Common Stats: Highest health/armor, damage reduction, elemental conversions, **all CDR %**
- Unique Perks: Highest stat budget overall

**Gloves**
- Focus: Weapon performance
- Common Stats: Reload speed %, weapon damage %, crit damage %, ADS speed %
- Unique Perks: Weapon loader mods

**Legs**
- Focus: Movement and positioning
- Common Stats: ALL movement bonuses, status resistance, **class ability CDR %**
- Unique Perks: Movement exclusive to this slot

**Bracers (Class Item)**
- Focus: Class identity and ability enhancement
- Common Stats: Highest attributes, ability damage %, **highest CDR values**, elemental damage
- Unique Perks: Class-specific abilities, cannot trade between classes


## 7. DISPLAY GUIDELINES
========================

### Weapon Card Layout
--------------------
```
[WEAPON NAME]
[Weapon Type] | [Ammo Type]

DAMAGE        [45]        RANGE    [45m]
FIRE RATE     [600 RPM]   MAG SIZE [30]

[=====-----] Reload Speed
[========--] Handling  
[===-------] Mobility
[======----] Stability

PERKS
+8% Weapon Damage
+15% Damage as Fire
+12% Reload Speed
```

### Bar Groupings
----------------
**Handling** (Average of):
- Reload Speed
- Swap Speed  
- ADS Speed

**Mobility** (Average of):
- Movement Modifier
- Sprint to Fire
- ADS Movement

**Stability** (Average of):
- Inverse Vertical Recoil
- Inverse Horizontal Recoil

### Bar Calculation Formula
--------------------------
```
Bars = 10 - ((Current - Best) / (Worst - Best) × 9)
```


## 8. STAT STACKING & CALCULATIONS
==================================

### Calculation Order
-------------------
1. Base weapon stats
2. Flat additions
3. Percentage modifiers
4. Caps applied

### Stacking Rules
----------------
**Additive Stacking**:
- Same stat from multiple sources
- Elemental resistances
- Flat damage additions

**Multiplicative Stacking**:
- Different damage multipliers
- Movement modifiers
- Conversion then multiplication

### Example Calculations
-----------------------
**Damage Calculation with Multiple Sources**:
```
Base Weapon Damage: 100
Weapon: +8% Weapon Damage, +20% Damage as Fire
Gloves: +5% Weapon Damage, +15 Fire Damage
Chest: +10% Damage as Lightning
Bracers: +30% Fire Damage

Step 1 - Weapon Damage: 100 × (1.08 × 1.05) = 113.4
Step 2 - Conversions: 
  - Fire: 113.4 × 0.20 = 22.68
  - Lightning: 113.4 × 0.10 = 11.34
Step 3 - Flat additions: 22.68 + 15 = 37.68 fire
Step 4 - Multipliers: 37.68 × 1.30 = 48.98 fire

Total: 113.4 physical + 48.98 fire + 11.34 lightning = 173.72
```

**Status Effect Calculation**:
```
Base Status Buildup per hit: 10 points (100 needed for proc)
Weapon: +20% Damage as Fire (creates fire buildup)
Shoulders: +15% Status Generation
Chest: +20% Fire Status Power
Bracers: +25% Fire Status Generation

Buildup per hit: 10 × 1.15 × 1.25 = 14.4 points (7 hits to proc)
Fire DoT damage: Base 50/sec × 1.20 = 60/sec
```

**CDR on Crit Build**:
```
Base Ability Cooldown: 30 seconds
Head: +6% Ability CDR, +1% CDR on Crit
Gloves: +50% Crit Damage, +2% CDR on Weakspot
Weapon: 30% base crit chance

Static CDR: 30 × 0.94 = 28.2 seconds
Each crit: Instant 0.3 second reduction (1% of base)
Each weakspot: Instant 0.6 second reduction (2% of base)
```

**Movement Calculation with Weapon**:
```
Base Movement: 100%
Weapon Core Modifier: ×0.95 (SMG)
Legs: +6% Movement Speed
Chest: +3% Movement Speed
ADS Movement: ×0.6 (base for SMG)
Gloves: +20% ADS Movement

Walking: 100 × 0.95 × 1.06 × 1.03 = 103.7%
ADS: 100 × 0.95 × 1.06 × 1.03 × 0.6 × 1.20 = 74.7%
```

### Stat Caps
------------
- Critical Chance: 50%
- Cooldown Reduction (All Types): 40% hard cap
- Shield Delay Reduction: 50%
- Element Resistance: 75% per element
- Movement Speed Bonus: 30% (soft cap)

### CDR Stacking Example
-----------------------
```
Base Ability Cooldown: 60 seconds
Head: +6% Ability CDR
Chest: +3% All CDR
Bracers: +8% Ability CDR
Total CDR: 6% + 3% + 8% = 17%

Final Cooldown: 60 × (1 - 0.17) = 49.8 seconds
```


## APPENDIX: COMPLETE STAT REFERENCE
====================================

### Legend
- **W**: Can appear on Weapons
- **H**: Can appear on Head
- **S**: Can appear on Shoulders  
- **B**: Can appear on Back
- **C**: Can appear on Chest
- **G**: Can appear on Gloves
- **L**: Can appear on Legs
- **Br**: Can appear on Bracers (Class Item)
- **Rarity**: 1 (very common) to 10 (extremely rare) - internal weighting

### Offensive Stats
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Weapon Damage % | 10 | Increases all weapon damage | ✓ | - | ✓ | - | ✓ | ✓ | - | ✓ |
| Critical Strike Chance % | 6 | Chance for critical hits | ✓ | ✓ | - | - | - | - | - | - |
| Critical Strike Damage % | 5 | Bonus damage on critical hits | ✓ | - | - | - | - | ✓ | - | ✓ |
| Weakspot Damage % | 4 | Bonus damage to weak points | ✓ | - | - | - | - | ✓ | - | - |
| Armor Piercing | 3 | Reduces enemy armor effectiveness | ✓ | - | - | - | - | - | - | - |
| Fire Rate % | 7 | Increases weapon fire rate | ✓ | - | ✓ | - | - | - | - | - |
| Reload Speed % | 3 | Reduces reload time | ✓ | - | - | - | - | ✓ | - | - |
| Magazine Size | 4 | Flat magazine increase | ✓ | - | - | - | - | - | - | - |
| Magazine Size % | 5 | Percentage magazine increase | ✓ | - | - | - | - | - | - | - |
| Handling % | 3 | Reduces weapon swap time | ✓ | - | - | - | - | ✓ | - | - |
| ADS Speed % | 4 | Reduces aim down sight time | ✓ | ✓ | - | - | - | ✓ | - | - |
| ADS Movement % | 5 | Reduces movement penalty while ADS | ✓ | - | - | - | ✓ | ✓ | - | - |
| Spread Reduction % | 4 | Tightens weapon spread | ✓ | - | - | - | - | - | - | - |
| Recoil Reduction % | 3 | Reduces weapon kick | ✓ | - | - | - | - | - | - | - |
| Range % | 6 | Extends effective range | ✓ | - | - | - | - | - | - | - |

### Elemental Damage Modifiers
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| +X% Damage as [Element] | 8 | Converts damage to elemental | ✓ | - | - | - | ✓ | ✓ | - | ✓ |
| +X [Element] Damage | 4 | Flat elemental damage | ✓ | - | - | - | - | ✓ | - | ✓ |
| +X% [Element] Damage | 6 | Multiplies elemental damage | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Defensive Stats
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Armor | 2 | Base defense value | - | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Health | 3 | Flat health increase | 9 | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| Health % | 6 | Percentage health increase | 10 | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| Health Regen | 4 | Health per second | - | ✓ | ✓ | ✓ | ✓ | - | - | ✓ |
| Damage Reduction % | 9 | Reduces all damage taken | - | - | - | - | ✓ | - | - | - |

### Energy Shield Stats
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Shield Capacity | 3 | Flat shield increase | 9 | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| Shield Capacity % | 6 | Percentage shield increase | 10 | ✓ | - | ✓ | ✓ | - | - | ✓ |
| Shield Delay Reduction % | 5 | Faster shield regen start | - | ✓ | - | - | - | - | - | - |
| Shield Regen Rate % | 4 | Faster shield regeneration | - | - | - | ✓ | - | - | - | ✓ |

### Resistance Stats
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| [Element] Resistance % | 3 | Reduces specific element damage | - | ✓ | ✓ | ✓ | ✓ | - | ✓ | - |
| All Elements Resistance % | 8 | Reduces all elemental damage | - | - | ✓ | ✓ | ✓ | - | - | - |
| Status Effect Resistance % | 5 | Reduces status effect duration | - | - | - | - | - | - | ✓ | - |

### Movement Stats
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Movement Speed % | 6 | Increases base movement | - | - | - | - | - | - | ✓ | - |
| Sprint Speed % | 5 | Increases sprint speed | - | - | - | - | - | - | ✓ | - |
| Slide Speed % | 4 | Increases slide speed | - | - | - | - | - | - | ✓ | - |
| Slide Duration % | 4 | Extends slide time | - | - | - | - | - | - | ✓ | - |

### Cooldown Reduction Stats
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Ability CDR % | 6 | Reduces ability cooldowns | - | ✓ | - | - | - | - | - | ✓ |
| Ultimate CDR % | 8 | Reduces ultimate cooldown | - | - | - | ✓ | - | - | - | ✓ |
| Grenade CDR % | 5 | Reduces grenade cooldown | - | - | ✓ | - | - | - | - | - |
| Class Ability CDR % | 5 | Reduces class ability cooldown | - | - | - | - | - | - | ✓ | ✓ |
| All CDR % | 9 | Reduces all cooldowns | - | - | - | - | ✓ | - | - | - |

### Status Effect Stats
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Status Generation % | 6 | Faster status buildup (all) | - | - | ✓ | - | - | - | - | - |
| [Element] Status Generation % | 5 | Faster specific status buildup | - | - | - | - | - | - | ✓ | - |
| Status Power % | 7 | Stronger status effects (all) | - | - | - | - | ✓ | - | - | - |
| [Element] Status Power % | 6 | Stronger specific status effects | - | - | - | - | - | - | - | ✓ |
| All Status Duration % | 7 | Extends status effect duration | - | - | - | ✓ | - | - | - | - |

### Resource & Utility Stats
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Ability Damage % | 7 | Increases ability damage | ✓ | - | ✓ | - | - | - | - | ✓ |
| Energy Max | 4 | Increases energy pool | - | ✓ | - | - | ✓ | - | - | ✓ |
| Energy Regen | 4 | Energy per second | - | ✓ | - | - | ✓ | - | - | ✓ |
| Ammo Reserve % | 3 | Increases ammo capacity | ✓ | - | ✓ | - | - | - | - | - |
| Ammo Return on Crit | 7 | Returns bullets on critical | ✓ | - | - | - | - | - | - | - |

### On-Kill/Hit Effects
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Life on Kill | 5 | Health restored on kill | ✓ | - | ✓ | - | ✓ | - | - | ✓ |
| Shield on Kill | 5 | Shield restored on kill | ✓ | - | ✓ | - | ✓ | - | - | ✓ |
| Cooldown on Kill % | 7 | Instant CDR on kill | ✓ | - | - | - | - | - | - | ✓ |
| Cooldown on Weakspot % | 8 | Instant CDR on weakspot hit | ✓ | - | - | - | - | ✓ | - | - |
| Cooldown on Critical % | 8 | Instant CDR on critical hit | ✓ | ✓ | - | - | - | - | - | - |

### Attributes
| Stat Name | Rarity | Description | W | H | S | B | C | G | L | Br |
|-----------|--------|-------------|---|---|---|---|---|---|---|-----|
| Vigor | 2 | Health, regen, damage reduction | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Focus | 2 | Crit chance, crit damage, weakspot | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Force | 2 | Weapon damage, elemental damage | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Momentum | 2 | Reload, handling, movement | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Resonance | 2 | Energy, CDR, ability damage | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Bulwark | 2 | Resistances, shield, armor | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Rarity Weighting System
--------------------------
The rarity value determines how often a stat appears in the loot pool:
- **1-2**: Very Common (50% weight) - Basic stats, attributes
- **3-4**: Common (30% weight) - Standard combat stats
- **5-6**: Uncommon (15% weight) - Specialized stats
- **7-8**: Rare (4% weight) - Powerful modifiers
- **9-10**: Very Rare (1% weight) - Build-defining stats

### Roll Probability Example
When generating an affix for a chest piece:
1. Build weighted pool of available stats
2. Armor (rarity 2): 50 weight
3. Health % (rarity 6): 15 weight  
4. Weapon Damage % (rarity 10): 1 weight
5. Total pool: 66 weight
6. Roll randomly with weights

=====================================
**END OF UNIFIED SYSTEM**
Version 2.0
=====================================