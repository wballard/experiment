### Display System for Players

**Visible Stats (Exact Numbers)**:
- Players see these precise numerical values for informed decision-making
1. **Damage**: Base damage per shot (varies by archetype)
2. **Fire Rate**: Rounds per minute based on fire mode
3. **Magazine Size**: Rounds per reload (modified by magazine mods)
4. **Reload Time**: Seconds to reload (modified by reload mods)
5. **Range**: Effective range in meters (modified by barrel/scope mods)
6. **Accuracy**: Base spread angle (modified by precision mods)
7. **Penetration**: Armor piercing value (modified by ammunition mods)

**Bar Chart Stats (1-10 Display)**:
- Simplified visual representation for quick comparison
- **Handling**: Weapon swap, ADS speed, general responsiveness
- **Mobility**: Movement penalty when equipped, sprint-to-fire delay
- **Stability**: Recoil control and sustained fire accuracy

**Hidden Stats (Backend Only)**:
- Complex mechanics that would overwhelm players but affect gameplay
- Heat accumulation per shot and cooling rates
- Damage falloff curves and range calculations
- Projectile velocity and travel time
- Recoil patterns and bloom recovery
- Animation frame data and timing windows
- Aim assist magnetism and flinch intensity

### Information Hierarchy Philosophy
- **Visible Stats**: Essential for tactical decisions and build planning
- **Bar Charts**: Quick visual comparison when evaluating multiple weapons
- **Hidden Stats**: Maintain gameplay depth without overwhelming new players# COURIER - COMPLETE GAME DESIGN SPECIFICATION
## Comprehensive Unified Design Document

---

# TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Core Character Systems](#core-character-systems)
3. [Combat & Elemental Systems](#combat--elemental-systems)
4. [Equipment & Itemization](#equipment--itemization)
5. [Weapon Systems](#weapon-systems)
6. [Progression & Advancement](#progression--advancement)
7. [Game World & Content](#game-world--content)
8. [Economy & Social Systems](#economy--social-systems)
9. [Player Experience](#player-experience)
10. [Narrative & Lore](#narrative--lore)
11. [Technical Implementation](#technical-implementation)

---

# EXECUTIVE SUMMARY

**Courier** is a sci-fi ARPG/looter shooter combining Diablo IV's depth, Path of Exile 2's skill trees, Destiny 2's shooting, and Call of Duty's weapon customization. Players explore extradimensional mazes created by alien "Progenitors" while managing competing faction interests on the mysterious colony world of Orphan.

## Core Innovation: Power Budget System
- Items consume "power budget" based on their stat efficiency
- Higher rarity = more stat efficiency, not just bigger numbers
- Creates meaningful choices between many weak items vs few strong items
- Prevents power creep while maintaining progression

## Game Pillars
- **Deep Character Customization**: 5 classes with dual elemental specializations
- **Hybrid Combat**: Seamless gunplay with space magic elemental effects
- **Rich Itemization**: Power budget system creates meaningful gear choices
- **Progressive Content**: 50-tier maze system with environmental challenges
- **Player-Driven Economy**: Multi-currency system with crafting and trading
- **Compelling Mystery**: Uncover the truth about the Progenitor experiments

---

# CORE CHARACTER SYSTEMS

## Equipment Slots & Layout

### Weapon Slots (2 equipped)
1. **Primary Weapon**: Any weapon archetype (main damage dealer)
2. **Secondary Weapon**: Any weapon archetype (backup or specialized tool)

**Five Base Weapon Archetypes**:
All weapon archetypes can be equipped in either Primary or Secondary slots, providing maximum flexibility for player builds and preferences.

- **Hand Gun**: Balanced sidearm with good handling and mobility
- **SMG**: High-volume close combat with rapid fire capability  
- **Shotgun**: High-impact close-range with devastating stopping power
- **Assault Rifle**: Versatile main weapon with balanced performance
- **Sniper Rifle**: Precision long-range with maximum damage potential

### Armor Slots (7 equipped)
1. **Head**: Helmets, neural interfaces, targeting systems
2. **Shoulders**: Pauldrons, sensor arrays, ammunition storage
3. **Chest**: Body armor, power cores, shield generators (highest power budget)
4. **Gloves**: Gauntlets, weapon interfaces, manipulation systems
5. **Legs**: Leg armor, boots, mobility enhancers, jump systems
6. **Back**: Cloaks, jetpacks, equipment packs
7. **Bracers** (Class Item): Class-specific utility items (lowest power budget)

## Primary Attributes (6 Total)

Each character gets 200 total attribute points to allocate:

### 1. **Vitality** - Health & Survivability
- +5 Health per point
- +2 Shield Capacity per point
- +0.1 Health Regeneration per point

### 2. **Precision** - Critical & Accuracy
- +0.5% Critical Chance per point (cap: 50%)
- +1% Accuracy per point
- +0.2% Critical Damage per point

### 3. **Potency** - Raw Damage & Status Effects
- +0.8% All Damage per point
- +0.3% Status Effect Chance per point
- +0.1% Status Effect Duration per point

### 4. **Alacrity** - Speed & Agility
- +0.4% Attack Speed per point
- +0.4% Movement Speed per point
- +0.2% Cooldown Reduction per point

### 5. **Capacity** - Resources & Abilities
- +3 Maximum Energy per point
- +0.5% Ability Damage per point
- +0.2% Energy Regeneration per point

### 6. **Fortitude** - Defense & Resistances
- +0.2% All Resistance per point (cap: 75%)
- +1 Armor per point
- +0.1% Damage Reduction per point
- **Note**: Stacks additively with gear-based elemental resistances

## Character Classes

### 1. Sentinel - Heavy Combat Tank
**Attribute Focus**: Vitality (60), Fortitude (50), Potency (40), others (50 combined)

**Core Identity**: Front-line fighter with energy shields and melee expertise
- Starting Health: 150 + (Vitality × 5)
- Starting Shields: 100 + (Vitality × 2)
- Unique: Shield Overcharge ability
- Signature Weapons: Power fists, energy blades, heavy armor
- **Elemental Access**: Can choose any 2 adjacent elements at levels 20 and 40

**Skill Tree Branches**:
- **Fortress**: Tank-focused, damage reduction, shield mastery
- **Berserker**: Melee DPS, life steal, rage mechanics  
- **Guardian**: Team support, shield sharing, ally protection

### 2. Technomancer - Tech Support Specialist
**Attribute Focus**: Capacity (60), Precision (40), Vitality (40), others (60 combined)

**Core Identity**: Technology-enhanced support with drone companions
- Starting Energy: 120 + (Capacity × 3)
- Starting Health: 100 + (Vitality × 5)
- Unique: Drone companion system
- Signature Weapons: Tech rifles, plasma weapons, utility gadgets
- **Elemental Access**: Can choose any 2 adjacent elements at levels 20 and 40
- **Elemental Synergy**: Drone attacks benefit from elemental infusion and mastery

**Skill Tree Branches**:
- **Engineer**: Drone mastery, turret deployment, area control
- **Hacker**: Electronic warfare, enemy disruption, tech overrides
- **Medic**: Healing drones, team support, revival systems

### 3. Infiltrator - Stealth Assassin
**Attribute Focus**: Alacrity (60), Precision (50), Potency (40), others (50 combined)

**Core Identity**: Fast, precise strikes from concealment
- Starting Movement Speed: 110% + (Alacrity × 0.4%)
- Starting Critical Chance: 5% + (Precision × 0.5%)
- Unique: Active camouflage system
- Signature Weapons: Sniper rifles, silenced weapons, energy blades
- **Elemental Access**: Can choose any 2 adjacent elements at levels 20 and 40
- **Stealth Interaction**: Elemental effects may reveal position (fire glow, electric sparks)

**Skill Tree Branches**:
- **Assassin**: Stealth mastery, critical strikes, execution abilities
- **Scout**: Movement skills, reconnaissance, environmental traversal
- **Hunter**: Trap setting, environmental kills, tracking abilities

### 4. Vanguard - Balanced Combatant
**Attribute Focus**: Balanced distribution (33-34 per attribute)

**Core Identity**: Adaptable fighter with versatile combat options
- Balanced starting stats across all areas
- Starting Adaptability Points: 10 (can temporarily boost any attribute)
- Unique: Stance system (Assault/Defense/Utility modes)
- Signature Weapons: Assault rifles, versatile melee weapons
- **Elemental Access**: Can choose any 2 adjacent elements at levels 20 and 40
- **Stance Integration**: Stances can modify elemental effect intensity

**Skill Tree Branches**:
- **Warrior**: Balanced combat, weapon mastery, tactical abilities
- **Leader**: Team buffs, command abilities, strategic bonuses
- **Survivor**: Adaptability, resource management, environmental resistance

### 5. Engineer - Ranged Control Specialist
**Attribute Focus**: Precision (60), Capacity (40), Alacrity (40), others (60 combined)

**Core Identity**: Long-range combat with environmental manipulation
- Starting Weapon Accuracy: 95% + (Precision × 1%)
- Starting Ability Damage: +10% + (Capacity × 0.5%)
- Unique: Deployable cover and barriers
- Signature Weapons: Sniper rifles, precision rifles, tech gadgets
- **Elemental Access**: Can choose any 2 adjacent elements at levels 20 and 40
- **Deployable Interaction**: Barriers can conduct/block elemental effects based on material

**Skill Tree Branches**:
- **Marksman**: Long-range mastery, penetration, precision bonuses
- **Demolition**: Explosive weapons, area denial, destruction
- **Constructor**: Deployable defenses, environmental modification, tactical positioning

## Derived Core Stats

### Health & Defense
- **Health Points**: Base + (Vitality × 5) + gear bonuses
- **Shield Capacity**: Base + (Vitality × 2) + gear bonuses  
- **Armor Rating**: (Fortitude × 1) + gear bonuses
- **Damage Reduction**: (Fortitude × 0.1%) + gear bonuses

### Offensive Stats
- **Critical Chance**: (Precision × 0.5%) + gear bonuses (cap: 50%)
- **Critical Damage**: Base 150% + (Precision × 0.2%) + gear bonuses
- **All Damage**: (Potency × 0.8%) + gear bonuses
- **Status Effect Chance**: (Potency × 0.3%) + gear bonuses

### Performance Stats  
- **Attack Speed**: (Alacrity × 0.4%) + gear bonuses
- **Movement Speed**: Base 100% + (Alacrity × 0.4%) + gear bonuses
- **Cooldown Reduction**: (Alacrity × 0.2%) + gear bonuses (cap: 40%)

### Resource Management
- **Maximum Energy**: Base + (Capacity × 3) + gear bonuses
- **Energy Regeneration**: Base + (Capacity × 0.2%) + gear bonuses
- **Ability Damage**: (Capacity × 0.5%) + gear bonuses

### Resistances
- **All Resistance**: (Fortitude × 0.2%) + gear bonuses (cap: 75%)
- **Elemental Resistances**: Gear-based (Fire, Ice, Electric, Nature, Earth)
- **Kinetic Resistance**: Gear-based (non-elemental damage)

## Skill Tree System

### Structure
- **1500+ Total Nodes**: Massive passive skill tree inspired by Path of Exile
- **Class Starting Areas**: Each class begins in different section of shared tree
- **Elemental Skill Trees**: Separate 4-tier progression trees for each of the 5 elements
- **Keystone Passives**: Major nodes that fundamentally alter playstyle
- **Ascendancy Classes**: Advanced specializations unlocked at level 30

### Elemental Skill Tree Integration
Each of the 5 elements has its own skill tree with 4 tiers:

**Tier 1 (0 Points Required)**: Entry-level abilities
- 2 Active abilities (basic elemental attacks and utility)
- 2 Passive abilities (stat bonuses and minor effects)

**Tier 2 (5 Points Required)**: Specialization abilities  
- 2 Active abilities (advanced elemental attacks)
- 5 Passive abilities (build-defining bonuses)

**Tier 3 (10 Points Required)**: Mastery abilities
- 2 Ultimate abilities (powerful end-game skills)
- **Elemental Infusion**: "Your abilities now deal [element] damage"
- 2 Combo unlocks (when combined with adjacent elements)
- 1 Passive ability (powerful effect)

**Tier 4 (15 Points Required)**: Capstone mastery
- **Elemental Mastery**: "Your abilities now apply [status effect]" (requires Elemental Infusion)
- 1 Ultimate passive (element-defining transformation)

### Elemental Unlock Progression
- **Level 20**: Choose first elemental specialization (any of the 5 elements)
- **Level 40**: Choose second elemental specialization (must be adjacent to first)
- **Tier 3 Investment**: Class abilities gain elemental damage types
- **Tier 4 Investment**: Class abilities apply elemental status effects (end-game power)

### Adjacent Element Wheel
**Earth → Ice → Electricity → Fire → Nature → Earth**

Valid dual-element combinations:
- Earth + Ice or Earth + Nature
- Ice + Earth or Ice + Electricity  
- Electricity + Ice or Electricity + Fire
- Fire + Electricity or Fire + Nature
- Nature + Fire or Nature + Earth

### Class Ability Modification Examples
**Dual Element End-Game Power:**
- **Sentinel with Fire + Nature**: Shield Bash deals fire + nature damage, applies burn + toxin buildup
- **Technomancer with Ice + Electricity**: Drone attacks deal ice + electric damage, apply freeze + shock buildup
- **Infiltrator with Earth + Ice**: Stealth Strike deals earth + ice damage, applies fracture + freeze buildup

### Skill Point Economy
- **Shared Point Pool**: All skill points can be spent in main class tree or elemental trees
- **Prerequisites**: Level 20 for first element, Level 40 for second element, adjacent elements only
- **Strategic Choices**: Players must balance elemental mastery vs. broad main tree progression

### Node Types
1. **Minor Nodes**: +5-10% to single stats
2. **Major Nodes**: +15-25% to multiple stats or new mechanics
3. **Keystone Nodes**: Powerful effects with meaningful trade-offs
4. **Ascendancy Nodes**: Class-specific powerful abilities
5. **Elemental Nodes**: Element-specific abilities and bonuses

### Respec System
- **Minor Respec**: Individual nodes using Data Fragments
- **Major Respec**: Entire branch using Exotic Components
- **Full Respec**: Complete reset using rare currencies
- **Ascendancy**: Permanent choice, cannot be changed
- **Elemental Respec**: Elemental choices can be reset, but must still follow adjacency rules

---

# COMBAT & ELEMENTAL SYSTEMS

## Core Elemental Philosophy

The elemental system forms the core of Courier's combat depth, where traditional gunplay meets space magic. Five distinct elements each offer unique tactical approaches, status effects, and build paths that fundamentally alter how players engage with encounters.

## The Five Elements

### 🔥 Fire - Destruction & Area Control
**Core Identity**: Explosive damage over time, area denial, chain reactions
**Fantasy**: Pyromaniac who turns enemies into walking bombs
**Key Mechanic**: Burn spreads and explodes on death

### ❄️ Ice - Control & Burst Damage  
**Core Identity**: Crowd control, shatter combos, precision strikes
**Fantasy**: Tactical controller who freezes then shatters enemies
**Key Mechanic**: Frozen enemies become vulnerable to massive shatter damage

### ⚡ Electricity - Chain Damage & Disruption
**Core Identity**: Multi-target instant damage, ability disruption, chain reactions
**Fantasy**: Storm master whose attacks jump between enemies
**Key Mechanic**: All electric damage chains to nearby targets

### 🌿 Nature - Life Steal & Contagion
**Core Identity**: Damage over time, team sustain, spreading effects
**Fantasy**: Toxic vampire who drains life and spreads plague
**Key Mechanic**: Provides life steal to entire team based on toxin buildup

### 🌍 Earth - Universal Amplification & Defense
**Core Identity**: Damage amplification, crowd control, survivability
**Fantasy**: Immovable fortress who makes everyone hit harder
**Key Mechanic**: Fracture increases ALL damage taken by enemies

## Status Buildup System

### Universal Buildup Formula
**Buildup Percentage = (Elemental Damage Dealt ÷ Enemy Maximum HP) × 100**

**Key Principles**:
- Damage-based scaling ensures gear progression remains meaningful
- Calculation occurs AFTER all resistances and damage modifiers
- Each element tracks buildup independently
- Weaker enemies reach status thresholds faster

### Buildup Thresholds & Effects

**Progressive Intensity (0-99%)**:
- 0-24%: Minor effects, visual indicators begin
- 25-49%: Moderate effects, clear visual progression  
- 50-74%: Strong effects, dramatic visual changes
- 75-99%: Severe effects, enemy behavior changes

**Triggered State (100%)**:
- Powerful signature effect unique to each element
- Duration varies by element (2-5 seconds)
- Grants immunity period after effect ends
- Often creates area effects or spreads to nearby enemies

### Status Decay Rates
- **Earth**: 5% per second (longest lasting)
- **Fire**: 10% per second
- **Electric**: 15% per second  
- **Nature**: 15% per second
- **Ice**: 20% per second (shortest lasting)

## Detailed Status Effects

### 🔥 Fire Status: BURN

**Building State: Heated (0-99%)**
- **DoT**: 0.1% max HP per second per 1% buildup (max 9.9% HP/s at 99%)
- **Fire Vulnerability**: +0.25% fire damage per 1% buildup (max +24.75% at 99%)
- **Healing Reduction**: -0.3% per 1% buildup (max -29.7% at 99%)
- **Visual**: Heat shimmer → smoke wisps → visible flames

**Triggered State: Ignited (100%)**
- **Duration**: 4 seconds
- **Effects**:
  - 15% max HP damage per second
  - Spreads 50% burn buildup to enemies within 5m
  - Creates fire trail while moving
  - Death explosion deals 50% enemy max HP as fire damage in 8m radius
- **Immunity**: 3 seconds after extinguished

### ❄️ Ice Status: FREEZE

**Building State: Chilled (0-99%)**
- **Movement Slow**: 0.5% per 1% buildup (max 49.5% at 99%)
- **Ice Vulnerability**: +0.3% ice damage per 1% buildup (max +29.7% at 99%)
- **Attack Speed**: -0.2% per 1% buildup (max -19.8% at 99%)
- **Visual**: Frost particles → ice crystals → heavy frost coating

**Triggered State: Frozen (100%)**
- **Duration**: 2 seconds
- **Effects**:
  - Complete immobilization
  - Becomes shatterable (damage equal to 20% max HP triggers shatter)
  - Shatter deals 300% of triggering damage as AoE
  - 50% freeze buildup spreads to nearby enemies on shatter
- **Immunity**: 2 seconds after thaw

### ⚡ Electricity Status: SHOCK

**Building State: Charged (0-99%)**
- **Chain Potential**: +0.2 chain targets per 10% buildup (max +1.8 at 99%)
- **Electric Vulnerability**: +0.4% electric damage per 1% buildup (max +39.6% at 99%)
- **Ability Disruption**: Random ability delays, increasing with buildup
- **Visual**: Static sparks → electrical arcs → constant lightning

**Triggered State: Overloaded (100%)**
- **Duration**: 3 seconds
- **Effects**:
  - All electric damage chains to 5 nearby enemies
  - Chains retain 100% damage (no falloff)
  - Disables enemy abilities completely
  - Creates persistent electric field (3m radius, damages enemies)
- **Immunity**: 2 seconds after discharge

### 🌿 Nature Status: TOXIN

**Building State: Poisoned (0-99%)**
- **DoT**: 0.08% max HP per second per 1% buildup (max 7.92% HP/s at 99%)
- **Nature Vulnerability**: +0.3% nature damage per 1% buildup (max +29.7% at 99%)
- **Life Steal Provision**: Allies heal for 0.5% of damage per 1% buildup (max 49.5% at 99%)
- **Visual**: Green tint → sickly pallor → visible decay

**Triggered State: Plagued (100%)**
- **Duration**: 5 seconds
- **Effects**:
  - 12% max HP damage per second
  - 100% life steal for all team damage against this enemy
  - Death spreads 75% toxin buildup to all enemies within 10m
  - Creates toxic cloud that damages enemies (6m radius, 8 second duration)
- **Immunity**: 4 seconds after cleansed

### 🌍 Earth Status: FRACTURE

**Building State: Cracked (0-99%)**
- **Damage Vulnerability**: +0.2% ALL damage per 1% buildup (max +19.8% at 99%)
- **Earth Vulnerability**: +0.35% earth damage per 1% buildup (max +34.65% at 99%)
- **Armor Reduction**: -0.5% per 1% buildup (max -49.5% at 99%)
- **Stagger Thresholds**: Mini-staggers at 25%, 50%, 75%
- **Visual**: Hairline cracks → visible fissures → crumbling exterior

**Triggered State: Shattered (100%)**
- **Duration**: 4 seconds
- **Effects**:
  - +40% ALL damage vulnerability
  - Cannot move more than 2m from impact location
  - Takes 5% max HP damage per second from internal fractures
  - Death creates earth spikes in 6m radius (200% earth damage)
- **Immunity**: 3 seconds after reformation

## Elemental Combinations

### Adjacent Element Combos (Requires 10 points in both trees)

**🌍 Earth + ❄️ Ice: PERMAFROST**
- Frozen enemies hit by earth damage shatter instantly for 400% damage
- Earth abilities create ice spikes that slow and damage enemies
- Creates frozen ground that enhances earth damage by 50%

**❄️ Ice + ⚡ Electricity: SUPERCONDUCTOR**  
- Frozen/slowed enemies take +100% chain lightning jumps
- Electric damage on frozen enemies creates "frost spark" AoE
- Combines slow and chain effects for battlefield control

**⚡ Electricity + 🔥 Fire: PLASMA SURGE**
- Shocked enemies that are burned create plasma explosions
- Combined damage creates lingering plasma fields (DoT + chain damage)
- Electric chains can ignite enemies they hit

**🔥 Fire + 🌿 Nature: WILDFIRE**
- Burning enemies spread enhanced poison when they die
- Poison clouds can be ignited for explosive AoE damage
- Creates expanding fire/poison zones

**🌿 Nature + 🌍 Earth: OVERGROWTH**
- Poisoned enemies hit by earth damage spawn damaging root networks
- Earth impacts on poisoned ground create toxic crystal formations
- Combines life steal with damage amplification

## DoT Stacking & Interaction Rules

### Same Element Stacking
- **Duration**: Refreshes to full
- **Intensity**: Updates to new buildup percentage
- **No Accumulation**: One instance per element type

### Cross-Element Stacking  
- **Independent Tracking**: Each element maintains separate buildup
- **Simultaneous Effects**: Multiple DoTs tick independently
- **Life Steal Synergy**: Nature's life steal applies to ALL damage including other element DoTs

### Example Multi-Element Scenario
```
Enemy Status:
- 60% Fire Buildup (6% HP/s burn DoT)
- 40% Nature Buildup (20% life steal for team)
- 80% Earth Buildup (+16% damage vulnerability)

Result:
- Fire DoT deals 6% HP/s, increased by earth vulnerability
- Team heals for 20% of ALL damage dealt to this enemy
- All other damage sources also benefit from earth vulnerability
```

## PvP Integration & Balance

### Elemental System PvP Adjustments

**Status Buildup vs Players**:
- **Formula**: Damage ÷ (Player Max HP × 2) = Buildup %
- **Effect**: Requires 200% of player's max HP in elemental damage for full buildup
- **Reasoning**: Prevents instant status application while maintaining elemental viability

**Status Effect Modifications**:
- **All Durations**: Reduced by 50% against players
- **DoT Damage**: Capped at 5% max HP per second
- **Buildup Caps**: Single abilities capped at 50-70% buildup
- **Immunity Periods**: Doubled duration after status effects end
- **Resistance Effectiveness**: +50% against player sources

**Specific PvP Status Changes**:

**Fire (Burn)**:
- Building DoT: Max 4.95% HP/s (instead of 9.9%)
- Triggered DoT: Max 7.5% HP/s (instead of 15%)
- Death explosion: 25% max HP (instead of 50%)
- Spread range: 3m (instead of 5m)

**Ice (Freeze)**:
- Triggered duration: 1 second (instead of 2)
- Shatter threshold: 30% max HP (instead of 20%)
- Shatter damage: 150% of triggering damage (instead of 300%)

**Electric (Shock)**:
- Chain targets: Max 2 (instead of 5)
- Ability disruption: 50% effect (instead of complete disable)
- Triggered duration: 1.5 seconds (instead of 3)

**Nature (Toxin)**:
- Building DoT: Max 3.96% HP/s (instead of 7.92%)
- Life steal provision: Max 25% (instead of 49.5%)
- Triggered DoT: 6% HP/s (instead of 12%)
- Spread range: 5m (instead of 10m)

**Earth (Fracture)**:
- Damage vulnerability: Max +10% (instead of +19.8%)
- Triggered vulnerability: +20% (instead of +40%)
- Movement restriction: 3m radius (instead of 2m)

---

# EQUIPMENT & ITEMIZATION

## Power Budget System

### Core Mechanics

The power budget system is Courier's primary innovation for preventing power creep while maintaining meaningful progression. Every item consumes "power budget" based on its stat efficiency, creating strategic choices about gear combinations.

### Rarity Efficiency Multipliers
- **Common**: 1.3× power cost (least efficient)
- **Uncommon**: 1.15× power cost
- **Rare**: 1.0× power cost (baseline)
- **Epic**: 0.9× power cost
- **Legendary**: 0.8× power cost
- **Mythic**: 0.8× power cost
- **Primal**: 0.75× power cost (most efficient)

### Power Budget by Level
**Base Formula**: 100 + (Level × 20) = Total Power Budget

Examples:
- Level 10: 300 total power
- Level 25: 600 total power  
- Level 50: 1,100 total power
- Level 75: 1,600 total power
- Level 100: 2,100 total power

### Strategic Implications

**The Primal Dilemma**: A level 50 player (1,100 power) finding a 400-power Primal weapon must decide: use 36% of total budget on one item for massive efficiency, or spread power across more items for versatility.

**Empty Slots Are Valid**: Sometimes 3 Primal items + 6 empty slots > 9 Common items

**Build Enabling**: Some builds literally require Primal efficiency to reach stat thresholds

## Item Quality Tiers

### Rarity System (7 Tiers)
1. **Common** (Gray)
   - 0-1 affixes, 60-70% stat efficiency
   - 1.3× power cost multiplier
   - Most frequently dropped

2. **Uncommon** (Green)
   - 1-2 affixes, 70-80% stat efficiency
   - 1.15× power cost multiplier
   - Common world drops

3. **Rare** (Blue)
   - 2-3 affixes, 75-85% stat efficiency
   - 1.0× power cost multiplier (baseline)
   - Standard endgame baseline

4. **Epic** (Purple)
   - 3-4 affixes, 80-90% stat efficiency
   - 0.9× power cost multiplier
   - Higher-tier content rewards

5. **Legendary** (Orange)
   - 4-5 affixes + unique effect, 85-95% stat efficiency
   - 0.8× power cost multiplier
   - Rare drops with build-defining effects

6. **Mythic** (Red)
   - 5-6 affixes + powerful effect, 90-95% stat efficiency
   - 0.8× power cost multiplier
   - Extremely rare, high-tier content only

7. **Primal** (Cyan)
   - 6 affixes + enhanced effect, always 100% perfect rolls
   - 0.75× power cost multiplier
   - Ultra-rare, perfect efficiency

### Item Level System
- **Item Levels 1-100**: Based on content source
- **Affix Tiers**: Higher item levels = higher affix value ranges
- **Gear Score**: Overall item power calculation for matchmaking

## Complete Item Statistics System

### All Secondary Stats (44 Total)

### Offensive Modifiers (Can appear on weapons + select armor)

**Damage Enhancement (Rarity 6-10)**
- Weapon Damage %: +1-15% (Power Cost: 4 per 1%)
- Melee Damage %: +2-20% (Power Cost: 3 per 1%)
- Ability Damage %: +2-25% (Power Cost: 3 per 1%)
- Damage vs Elites %: +5-50% (Power Cost: 2 per 1%)
- Damage vs Bosses %: +3-30% (Power Cost: 2 per 1%)

**Critical Stats (Rarity 7-9)**
- Critical Chance %: +1-12% (Cap: 50%, Power Cost: 5 per 1%)
- Critical Damage %: +5-80% (Power Cost: 3 per 1%)
- Critical vs Stunned %: +10-100% (Power Cost: 2 per 1%)

**Elemental Damage (Rarity 4-8)**
- Fire Damage: +2-50 flat OR +1-15% (Power Cost: 0.2 flat, 4 per 1%)
- Ice Damage: +2-50 flat OR +1-15% (Power Cost: 0.2 flat, 4 per 1%)
- Electric Damage: +2-50 flat OR +1-15% (Power Cost: 0.2 flat, 4 per 1%)
- Nature Damage: +2-50 flat OR +1-15% (Power Cost: 0.2 flat, 4 per 1%)
- Earth Damage: +2-50 flat OR +1-15% (Power Cost: 0.2 flat, 4 per 1%)

**Elemental Potency (Rarity 5-9)**
- Fire Potency: +1-20% (Increases fire damage & burn effectiveness)
- Ice Potency: +1-20% (Increases ice damage & freeze effectiveness)
- Electric Potency: +1-20% (Increases electric damage & shock effectiveness)
- Nature Potency: +1-20% (Increases nature damage & toxin effectiveness)
- Earth Potency: +1-20% (Increases earth damage & fracture effectiveness)

**Damage Conversion (Rarity 9-10)**
- X% Damage as Fire: +1-25% (Power Cost: 6 per 1%)
- X% Damage as Ice: +1-25% (Power Cost: 6 per 1%)
- X% Damage as Electric: +1-25% (Power Cost: 6 per 1%)
- X% Damage as Nature: +1-25% (Power Cost: 6 per 1%)
- X% Damage as Earth: +1-25% (Power Cost: 6 per 1%)

### Defensive Stats (Primarily armor)

**Health & Shields (Rarity 2-5)**
- Health: +20-200 flat (Power Cost: 0.1 per point)
- Health %: +3-25% (Power Cost: 2 per 1%)
- Shield Capacity: +15-150 (Power Cost: 0.15 per point)
- Shield %: +3-25% (Power Cost: 2 per 1%)
- Health Regeneration: +1-30/sec (Power Cost: 1 per point)
- Shield Regeneration Rate: +5-80% (Power Cost: 1.5 per 1%)
- Shield Delay Reduction: +10-50% (Power Cost: 2 per 1%)

**Armor & Resistances (Rarity 1-6)**
- Armor: +5-100 (Power Cost: 0.2 per point)
- Block: +1-30 (Power Cost: 1 per point)
- Fire Resistance: +2-20% (Power Cost: 1.5 per 1%)
- Ice Resistance: +2-20% (Power Cost: 1.5 per 1%)
- Electric Resistance: +2-20% (Power Cost: 1.5 per 1%)
- Nature Resistance: +2-20% (Power Cost: 1.5 per 1%)
- Earth Resistance: +2-20% (Power Cost: 1.5 per 1%)
- All Resistance: +1-12% (Power Cost: 3 per 1%)
- Kinetic Resistance: +2-20% (Non-elemental damage resistance)

### Utility & Performance (Universal)

**Cooldown Reduction (Rarity 5-9)**
- All CDR %: +1-15% (Cap: 40%, Power Cost: 6 per 1%)
- Movement CDR %: +2-25% (Power Cost: 3 per 1%)
- Utility CDR %: +2-25% (Power Cost: 3 per 1%)
- Ultimate CDR %: +1-20% (Power Cost: 4 per 1%)
- CDR on Kill: +1-10% for 5s (Power Cost: 5 per 1%)

**Weapon Performance (Rarity 3-7)**
- Magazine Size: +1-15 rounds (Power Cost: 2 per round)
- Reload Speed %: +5-40% (Power Cost: 2 per 1%)
- Weapon Swap Speed: +10-60% (Power Cost: 1.5 per 1%)
- Ammo Reserve %: +10-80% (Power Cost: 1 per 1%)
- Spread Reduction: +5-35% (Power Cost: 3 per 1%)

**Movement & Mobility (Rarity 3-6)**
- Movement Speed %: +2-15% (Power Cost: 4 per 1%)
- Sprint Speed %: +3-20% (Power Cost: 3 per 1%)
- Jump Height: +5-40% (Power Cost: 2 per 1%)
- Slide Distance: +10-60% (Power Cost: 1.5 per 1%)
- Anchoring: +3-30 (knockback resistance, Power Cost: 2 per point)

**Status Effect Stats (Rarity 4-7)**
- Status Buildup Rate: +10-80% (Affects all elemental status accumulation)
- Status Duration: +10-60% (Extends all status effect durations)
- Status Resistance: +5-40% (Reduces incoming status buildup)
- Fire Buildup Rate: +10-80% (Power Cost: 2 per 1%)
- Ice Buildup Rate: +10-80% (Power Cost: 2 per 1%)
- Electric Buildup Rate: +10-80% (Power Cost: 2 per 1%)
- Nature Buildup Rate: +10-80% (Power Cost: 2 per 1%)
- Earth Buildup Rate: +10-80% (Power Cost: 2 per 1%)

### Hidden Stats (Backend Only)
- Threat/Aggro Generation: +/-50%
- Magic Find: +1-25%
- Stability (Flinch Resistance): +10-100%

## Item Level Scaling
- **Level 1-20**: 100-300 base power budget
- **Level 21-40**: 300-600 base power budget  
- **Level 41-60**: 600-900 base power budget
- **Level 61-80**: 900-1200 base power budget
- **Level 81-100**: 1200-1500 base power budget

## Stat Distribution by Item Type

### Weapons (Offensive Focus)
**Primary Stats**: All weapon damage types, crit stats, elemental damage
**Secondary Stats**: Weapon performance, some utility
**Restricted**: Cannot roll health, armor, or resistances

### Armor Slot Specifics

**Head (150-200 power budget)**
- Primary: Health, resistances, utility
- Can Roll: CDR, weapon performance (limited)
- Cannot Roll: Movement speed, weapon damage %

**Shoulders (125-175 power budget)**
- Primary: Utility stats, ammo reserves
- Can Roll: Ability damage, status effects
- Cannot Roll: Movement speed, critical stats

**Chest (200-300 power budget, highest)**
- Primary: Health, shields, resistances
- Can Roll: Some offensive stats (limited)
- Cannot Roll: Weapon-specific performance

**Gloves (150-200 power budget)**
- Primary: Weapon performance, reload speed
- Can Roll: Critical stats, elemental damage
- Cannot Roll: Health %, resistances

**Legs (175-225 power budget)**
- Primary: Movement stats, health, footwear systems
- Can Roll: Resistances, utility, jump/sprint bonuses
- Unique Access: All movement speed types, jump height, slide distance
- Cannot Roll: Weapon damage, critical stats

**Back (150-200 power budget)**
- Primary: Utility, special effects
- Can Roll: Wide variety (jack-of-all-trades slot)
- Cannot Roll: Core weapon performance

**Bracers/Class Item (100-150 power budget, lowest)**
- Primary: Class-specific bonuses
- Can Roll: Utility stats, minor offensive
- Cannot Roll: Major defensive stats

## Set Items & Bonuses

### Set Categories
1. **Combat Sets** (2/4/6 pieces): Focused on damage dealing
2. **Survival Sets** (2/4/6 pieces): Defensive and survivability
3. **Utility Sets** (2/4/6 pieces): Movement and utility enhancements
4. **Elemental Sets** (2/4/6 pieces): Specific element mastery

### Example Set: "Progenitor's Legacy"
- **2-piece**: +15% Elemental Damage, +10% Status Effect Chance
- **4-piece**: Elemental kills create explosion of same type
- **6-piece**: Cycling through all 5 elements grants 30% damage for 10s

---

# WEAPON SYSTEMS

## Core Weapon Statistics (Immutable)

The five base weapon archetypes each have distinct immutable characteristics that define their core identity. These base stats can be enhanced through modifications but never fundamentally changed.

### Base Archetype Profiles

### **Hand Gun**
- **Default Fire Mode**: Single
- **Magazine Size**: Medium (12-20 rounds)
- **Reload Speed**: Fast (1.5-2.0s)
- **Ammo Reserve**: Medium (120-160 rounds)
- **Damage**: Medium (60-90 per shot)
- **Fire Rate**: Medium (180-300 RPM)
- **Range**: Short-Medium (15-35m)
- **Handling**: Excellent (9/10)
- **Mobility**: Best (10/10)

### **SMG (Submachine Gun)**
- **Default Fire Mode**: Auto
- **Magazine Size**: Large (30-50 rounds)
- **Reload Speed**: Fast (1.8-2.2s)
- **Ammo Reserve**: Large (300-400 rounds)
- **Damage**: Low (25-40 per shot)
- **Fire Rate**: High (750-1000 RPM)
- **Range**: Short (8-20m)
- **Handling**: Good (7/10)
- **Mobility**: Good (8/10)

### **Shotgun**
- **Default Fire Mode**: Single
- **Magazine Size**: Small (4-8 rounds)
- **Reload Speed**: Slow (2.5-4.0s)
- **Ammo Reserve**: Small (40-60 rounds)
- **Damage**: High (15-25 × 8-12 pellets)
- **Fire Rate**: Low (60-120 RPM)
- **Range**: Very Short (3-12m)
- **Handling**: Poor (4/10)
- **Mobility**: Poor (5/10)

### **Assault Rifle**
- **Default Fire Mode**: Auto
- **Magazine Size**: Large (30-40 rounds)
- **Reload Speed**: Medium (2.2-2.8s)
- **Ammo Reserve**: Large (240-320 rounds)
- **Damage**: Medium (45-70 per shot)
- **Fire Rate**: Medium (450-650 RPM)
- **Range**: Medium-Long (25-60m)
- **Handling**: Good (7/10)
- **Mobility**: Medium (6/10)

### **Sniper Rifle**
- **Default Fire Mode**: Single
- **Magazine Size**: Small (3-6 rounds)
- **Reload Speed**: Slow (3.0-4.5s)
- **Ammo Reserve**: Small (30-50 rounds)
- **Damage**: Very High (200-400 per shot)
- **Fire Rate**: Very Low (40-80 RPM)
- **Range**: Very Long (80-150m)
- **Handling**: Poor (3/10)
- **Mobility**: Poor (4/10)

### Modification-Driven Weapon Variants

Through the 7-slot modification system, base archetypes can be transformed to feel like entirely different weapon types:

**Hand Gun Transformations**:
- **→ Machine Pistol**: Auto trigger + extended mag + stock (Auto fire, Large mag, Medium reload)
- **→ Precision Pistol**: Scope + precision barrel + single fire (Enhanced range and accuracy)

**Assault Rifle Transformations**:
- **→ Marksman Rifle**: Scope + precision barrel + single fire trigger (Single fire, Medium mag, Enhanced range)
- **→ LMG-Style**: Extended mag + heavy barrel + bipod (Sustained fire platform)
- **→ Carbine**: Shortened barrel + lightweight stock (Improved mobility, reduced range)

**Sniper Rifle Transformations**:
- **→ Rail Gun**: Energy charging system + specialized barrel (Charge-up mechanics)
- **→ Anti-Material**: Heavy barrel + armor-piercing rounds (Enhanced penetration)

**SMG Transformations**:
- **→ Personal Defense Weapon**: Compact mods for improved handling
- **→ Assault SMG**: Extended range mods for medium-range effectiveness

**Shotgun Transformations**:
- **→ Combat Shotgun**: Auto trigger + extended mag (Rapid-fire capability)
- **→ Precision Shotgun**: Rifled barrel + specialized choke (Slug rounds, extended range)

### Display System for Players

**Visible Stats (Exact Numbers)**:
- Players see these precise numerical values for informed decision-making
1. **Damage**: Base damage per shot (varies by archetype)
2. **Fire Rate**: Rounds per minute based on fire mode
3. **Magazine Size**: Rounds per reload (modified by magazine mods)
4. **Reload Time**: Seconds to reload (modified by reload mods)
5. **Range**: Effective range in meters (modified by barrel/scope mods)
6. **Accuracy**: Base spread angle (modified by precision mods)
7. **Penetration**: Armor piercing value (modified by ammunition mods)

**Bar Chart Stats (1-10 Display)**:
- Simplified visual representation for quick comparison
- **Handling**: Weapon swap, ADS speed, general responsiveness
- **Mobility**: Movement penalty when equipped, sprint-to-fire delay
- **Stability**: Recoil control and sustained fire accuracy

**Hidden Stats (Backend Only)**:
- Complex mechanics that would overwhelm players but affect gameplay
- Heat accumulation per shot and cooling rates
- Damage falloff curves and range calculations
- Projectile velocity and travel time
- Recoil patterns and bloom recovery
- Animation frame data and timing windows
- Aim assist magnetism and flinch intensity

### Information Hierarchy Philosophy
- **Visible Stats**: Essential for tactical decisions and build planning
- **Bar Charts**: Quick visual comparison when evaluating multiple weapons
- **Hidden Stats**: Maintain gameplay depth without overwhelming new players

## Weapon Modification System

### Modification Slots (7 per weapon)

**1. Optics (Sights & Scopes)**
- **Red Dot Sight**: +10% ADS Speed, +5% Accuracy
- **Holographic Sight**: +15% Target Acquisition, +3% Crit Chance
- **Telescopic Scope**: +25% Range, +20% Damage vs Distant Targets
- **Thermal Scope**: See through smoke, +10% Damage vs Heat Signatures

**2. Magazine & Ammunition**
- **Extended Magazine**: +20-40% Magazine Size
- **Fast Reload Magazine**: +15-30% Reload Speed
- **Armor Piercing Rounds**: +15-25% Penetration
- **Elemental Ammunition**: Adds elemental damage type

**3. Underbarrel Attachments**
- **Foregrip**: +20% Stability, +10% ADS Movement Speed
- **Grenade Launcher**: Secondary explosive attack
- **Laser Sight**: +15% Hip Fire Accuracy
- **Bipod**: +40% Stability when prone/cover

**4. Muzzle Devices**
- **Suppressor**: -50% Audio Range, +10% Stealth Damage
- **Compensator**: +25% Stability, +15% Range
- **Flash Hider**: Reduced muzzle flash, +5% Stealth
- **Muzzle Brake**: +30% Recoil Control

**5. Barrel Modifications**
- **Extended Barrel**: +20% Range, +10% Damage
- **Shortened Barrel**: +15% Handling, -10% Range
- **Rifled Barrel**: +25% Accuracy, +5% Crit Chance
- **Smoothbore**: +20% Spread for shotguns

**6. Stock & Grip**
- **Adjustable Stock**: +15% ADS Speed, +10% Stability
- **Lightweight Stock**: +20% Movement Speed, -5% Stability
- **Heavy Stock**: +30% Stability, -10% Movement
- **Tactical Grip**: +25% Weapon Swap Speed

**7. Trigger Mechanism (Hidden Slot)**
- **Hair Trigger**: +15% Fire Rate, Single Shot Only
- **Binary Trigger**: Fires on pull AND release
- **Full Auto Conversion**: Changes fire mode
- **Burst Fire Module**: Converts to 3-round burst

### Power Budget for Weapons
All weapon archetypes follow the same power budget system:
- **Base Weapons**: 200 total power budget for modifications
- **Exotic Variants**: May have enhanced power budgets (250-300)
- **Modification Scaling**: More powerful modifications consume more power budget
- **Balanced Investment**: Players must choose between many small improvements or fewer major modifications

## Armor Modification System

### Modification Slots (3 per armor piece)

**Defensive Modules**
- **Ablative Plating**: +15-30 Armor, degrades over time
- **Energy Dispersal Grid**: +10-20% Energy Resistance
- **Reactive Armor**: Reflects 5-15% damage back to attackers
- **Adaptive Plating**: Resistance adapts to last damage type taken

**Utility Modules**
- **Servo Motors**: +10-25% Movement Speed (legs only)
- **Jump Jets**: +20-50% Jump Height (legs only)
- **Targeting Computer**: +5-15% Accuracy (helmet only)
- **Ammo Synthesizer**: +20-40% Ammo Reserve (chest only)

**Offensive Modules**
- **Weapon Interface**: +5-12% Reload Speed (gloves only)
- **Stabilization Gyro**: +10-20% Weapon Stability (shoulders only)
- **Power Amplifier**: +8-15% Ability Damage (back only)
- **Combat Stimulator**: +5-10% Attack Speed (bracers only)

### Enhancement System

**Enhancement Levels** (+1, +2, +3)
- **+1 Enhancement**: +25% to all stat bonuses, golden glow effect
- **+2 Enhancement**: +50% to all stat bonuses, bright golden aura
- **+3 Enhancement**: +75% to all stat bonuses, intense golden radiance

**Enhancement Materials**
- **+1**: Common Enhancement Cores + Credits
- **+2**: Rare Enhancement Cores + Nanites
- **+3**: Exotic Enhancement Cores + Exotic Components

**Enhancement Risks**
- **+1**: 100% success rate
- **+2**: 85% success rate, failure destroys enhancement materials
- **+3**: 60% success rate, failure can destroy the item

---

# PROGRESSION & ADVANCEMENT

## Character Level Progression

### Experience & Leveling
- **Level Cap**: 100 (expandable with content updates)
- **Experience Sources**: Combat, exploration, quest completion, maze discovery
- **Skill Points**: 1 per level + bonus points from certain milestones
- **Attribute Points**: 2 per level up to level 100 (400 total to spend)

### Major Progression Milestones

**Level 1-19: Foundation Building**
- Class skill development
- Basic weapon and armor familiarization
- Main passive tree exploration
- Learning core combat mechanics

**Level 20: First Elemental Awakening**
- Choose first elemental specialization (any of 5 elements)
- Unlock elemental skill trees
- Begin integrating elemental damage with class abilities
- Significant power spike and build identity begins

**Level 30: Ascendancy Selection**
- Choose advanced class specialization
- Unlock powerful passive keystones
- Access to ascendancy-specific skills
- Defines late-game build direction

**Level 40: Second Elemental Awakening**
- Choose second elemental specialization (adjacent to first)
- Unlock elemental combination potential
- Access to dual-element builds
- Major tactical depth expansion

**Level 50+: Mastery Focus**
- Tier 3 elemental investment (abilities gain elemental damage)
- High-tier maze content becomes accessible
- Power budget optimization becomes critical
- End-game build refinement

**Level 60+: True Mastery**
- Tier 4 elemental investment (abilities apply status effects)
- Dual-element status application (end-game power)
- Highest-tier content and challenges
- Perfect gear optimization required

## Skill Point Economy

### Point Sources
- **Base**: 1 skill point per level (100 total)
- **Milestone Bonuses**: +1 point at levels 25, 50, 75, 100 (4 total)
- **Quest Rewards**: Major faction storylines grant skill points (5-10 total)
- **Discovery Bonuses**: First completion of certain high-tier mazes (2-5 total)
- **Total Available**: ~110-120 skill points at max level

### Investment Strategies

**Focused Build (Deep Specialization)**
- Heavy investment in 1-2 main tree branches
- Full investment in both elemental trees
- Achieves maximum power in chosen specializations
- May lack versatility in some situations

**Hybrid Build (Broad Coverage)**
- Moderate investment across multiple tree branches
- Partial elemental investment for utility
- More adaptable to various content types
- May lack peak specialization power

**Examples of Point Distribution at Level 100**
```
Deep Fire/Nature Specialist:
- Main Tree: 50 points (focused branch)
- Fire Tree: 35 points (full mastery)
- Nature Tree: 35 points (full mastery)
- Total: 120 points

Hybrid Sentinel:
- Main Tree: 70 points (2-3 branches)
- Earth Tree: 25 points (tier 3 reached)
- Ice Tree: 25 points (tier 3 reached)
- Total: 120 points
```

## Equipment Progression

### Power Budget Growth
The power budget system creates natural progression gates while maintaining choice:

**Early Game (Levels 1-30)**
- 300-700 total power budget
- Common/Uncommon items dominate
- Simple stat stacking effective
- Few empty slots acceptable

**Mid Game (Levels 31-60)**
- 700-1300 total power budget
- Rare/Epic items become important
- Power efficiency starts mattering
- Strategic slot choices emerge

**Late Game (Levels 61-80)**
- 1300-1700 total power budget
- Legendary items highly valued
- Power optimization critical
- Empty slots may be optimal

**End Game (Levels 81-100)**
- 1700-2100 total power budget
- Primal items build-enabling
- Perfect optimization required
- Every choice has major impact

### Gear Progression Philosophy
- **No Item Invalidation**: Lower-tier items can remain useful if more power-efficient
- **Meaningful Choices**: Players constantly weigh power efficiency vs. total stats
- **Build Enabling**: Some builds literally require efficient items to function
- **Continuous Progression**: Even small upgrades can enable significant build changes

## Faction Reputation & Rewards

### Reputation Progression
Each faction has 6 reputation tiers with distinct rewards:

**Neutral (0 points)**: Basic access
**Friendly (1,000 points)**: Vendor access, basic blueprints
**Honored (5,000 points)**: Advanced gear, specialized modifications
**Revered (15,000 points)**: Legendary blueprints, exclusive weapons
**Exalted (35,000 points)**: Mythic gear access, unique class items
**Legendary (75,000 points)**: Primal conversion services, faction-specific abilities

### Reputation Sources
- **Main Faction Quests**: 500-2000 points per major storyline
- **Daily Missions**: 50-200 points per completion
- **Weekly Objectives**: 200-500 points per completion
- **Maze Discoveries**: 100-300 points for faction-relevant finds
- **Trade Contributions**: Small reputation for valuable donations

### Faction-Specific Rewards

**Darkspur Corporation**: Military-industrial focus
- Advanced weapon modifications
- Heavy armor blueprints
- Combat-focused skill bonuses
- Exclusive assault rifle and LMG variants

**CARD (Research Division)**: Scientific advancement
- Scanning and analysis equipment
- Energy weapon specializations
- Knowledge-based skill bonuses
- Exclusive tech rifles and energy armor

**Ashen Collective**: Mysterious alternatives
- Stealth-focused equipment
- Unique modification combinations
- Hidden skill tree nodes
- Exclusive infiltration gear

**CAN (Athletic Network)**: Competitive excellence
- Performance-optimized gear
- Movement-focused modifications
- Competition-based rewards
- Exclusive speed-runner equipment

---

# GAME WORLD & CONTENT

## Maze & Dungeon Systems

### Core Maze Structure
- **50 Progressive Tiers**: Each tier represents increasing difficulty and complexity
- **Procedural Generation**: Unique layouts for replayability while maintaining design consistency
- **Progenitor Signatures**: Each maze reflects the personality of its alien creator
- **Multiple Biomes**: Tech facilities, organic growths, crystal caves, reality-warped spaces

### Environmental Affix System

The affix system creates unique tactical challenges that scale with tier difficulty and interact with the elemental combat system.

#### Core Affix Categories

**Environmental Affixes with Elemental Integration:**

**1. Snowfall (Cryogenic Storm)**
- **Effect**: Constant freeze buildup (5-25 buildup/sec based on tier)
- **Intensity Scaling**: T1: 5 buildup/sec → T50: 25 buildup/sec
- **Elemental Interaction**: Ice resistance reduces buildup, fire damage provides temporary immunity
- **Strategic Consideration**: Ice builds may want to avoid this affix due to diminishing returns

**2. Volcanic (Magma Surge)**
- **Effect**: Ground erupts with fire damage periodically, applies burn buildup
- **Intensity Scaling**: T1: 100 damage/3s → T50: 800 damage/1s
- **Elemental Interaction**: Fire resistance reduces damage, ice abilities can temporarily cool eruption zones
- **Mechanics**: Warning circles appear 2s before eruption, applies 10-30% burn buildup

**3. Plagued (Bio-Weapon)**
- **Effect**: Monsters explode on death, applying Nature DOT
- **Intensity Scaling**: T1: 20 DOT/5s → T50: 150 DOT/8s
- **Elemental Interaction**: Nature resistance reduces DOT, earth abilities can contain spread
- **Strategic Synergy**: Nature builds benefit from additional poison sources

**4. Electromagnetic (Ion Storm)**
- **Effect**: Random ability disruption, applies electric buildup to players
- **Intensity Scaling**: T1: 10% chance → T50: 40% chance
- **Elemental Interaction**: Electric resistance reduces disruption chance and buildup
- **Mechanics**: Can silence abilities for 3-8s, affects HUD elements

**5. Acidic (Toxic Atmosphere)**
- **Effect**: Environmental acid pools, equipment degradation, enhanced nature effects
- **Intensity Scaling**: T1: -1% durability/min → T50: -5% durability/min
- **Elemental Interaction**: Enhanced by nature abilities, can be neutralized by earth barriers
- **Strategic Consideration**: Nature builds may enhance this environmental effect

**6. Damned (Spectral Echoes)**
- **Effect**: Monsters spawn vengeful ghosts on death
- **Intensity Scaling**: T1: 1 ghost/elite → T50: 3 ghosts/any enemy
- **Mechanics**: Ghosts chase for 15s, deal 80% of original's damage
- **No Elemental Interaction**: Pure mechanical challenge

**7. Overcharged (Energy Cascade)**
- **Effect**: Enemy attacks chain between targets with electric damage
- **Intensity Scaling**: T1: 2 chain targets → T50: 6 chain targets
- **Mechanics**: Lightning effect, 80% damage per chain, applies shock buildup

**8. Reinforced (Military Protocol)**
- **Effect**: Enemies coordinate attacks, use cover, enhanced tactical AI
- **Intensity Scaling**: T1: +20% tactics → T50: +100% tactics
- **Mechanics**: Enemies flank, use suppression, call for backup

**9. Unstable (Quantum Flux)**
- **Effect**: Enemies randomly teleport during combat
- **Intensity Scaling**: T1: 5% chance → T50: 25% chance
- **Mechanics**: Short-range teleport with disorientation effect

### Tier Progression System

**Tiers 1-10: Single Affix Introduction**
- One affix per maze
- Base intensity levels
- Tutorial for each mechanic
- Learn individual affix strategies

**Tiers 11-20: Dual Combinations**
- Two affixes simultaneously
- Moderate intensity increase
- Introduction to affix interactions
- Strategic adaptation required

**Tiers 21-30: Triple Complexity**
- Three affixes active
- High intensity scaling
- Advanced tactical requirements
- Build optimization important

**Tiers 31-40: Quadruple Challenge**
- Four affixes combined
- Expert-level coordination needed
- Significant gear requirements
- Team synergy critical

**Tiers 41-50: Master Level**
- All five affixes possible
- Maximum intensity
- Requires perfect builds and execution
- Ultimate endgame challenge

### Scaling Formulas

**Monster Health**: Base × (1 + (Tier × 0.08) + (Affix Count × 0.15))
**Monster Damage**: Base × (1 + (Tier × 0.06) + (Affix Count × 0.12))
**Affix Intensity**: Base × (1 + (Tier × 0.05))^1.2

### Reward Scaling
- **Base Rewards**: Item Level = Maze Tier + 10
- **Affix Bonus**: +5% loot quality per active affix
- **Perfect Run Bonus**: No deaths = +25% rewards
- **Speed Bonus**: Under par time = +15% rewards
- **Discovery Bonus**: First completion of tier/affix combination = +50% rewards

### Progenitor Maze Signatures

Each Progenitor creates mazes with distinct characteristics:

**Loki's Domains** (Trickster)
- Illusions, false paths, reward reversals
- Geometry that changes when not observed
- Hidden passages and secret areas
- Rewards creativity and lateral thinking

**Anubis Chambers** (Judge)
- Precision trials requiring exact execution
- Moral choice scenarios with consequences
- Balance and judgment themed challenges
- Tests leadership and decision-making

**Houtu's Realms** (Earth Mother)
- Endurance trials and resource management
- Slow, methodical progression required
- Environmental harmony themes
- Tests patience and cooperation

**[Additional Progenitors]** (To be revealed)
- **The Architect**: Logic puzzles and structural challenges
- **The Warmaster**: Combat trials and tactical scenarios
- **The Oracle**: Prediction and pattern recognition tests

---

# ECONOMY & SOCIAL SYSTEMS

## Currency System

### Primary Currencies

**1. Credits (Universal Currency)**
- **Sources**: Mission completion, item sales, daily rewards, maze clear bonuses
- **Uses**: Basic vendor purchases, repairs, ammunition, common crafting materials
- **Conversion**: 1 Credit = baseline economy unit
- **Storage**: No limit, account-wide
- **Daily Generation**: 1,000-5,000 based on activities

**2. Nanites (Crafting Materials)**
- **Sources**: Item dismantling, mining nodes, crafting missions, material gathering
- **Uses**: All crafting recipes, modifications, enhancements, blueprint research
- **Conversion**: 10 Credits = 1 Nanite
- **Storage**: 50,000 cap, per character
- **Strategic Value**: Primary currency for character progression

**3. Data Fragments (Knowledge Currency)**
- **Sources**: Scanning, research missions, first discoveries, CARD faction rewards
- **Uses**: Skill respecialization, blueprint unlocks, research progression
- **Conversion**: Cannot be directly purchased with other currencies
- **Storage**: 10,000 cap, account-wide
- **Scarcity**: Most limited currency, careful spending required

**4. Exotic Components (Premium Materials)**
- **Sources**: High-tier content, rare dismantling, special events, boss drops
- **Uses**: Legendary crafting, exotic upgrades, major modifications, primal conversions
- **Conversion**: 1000 Nanites = 1 Exotic Component (rare vendor, limited daily)
- **Storage**: 1,000 cap, account-wide
- **Gating**: Required for endgame progression

**5. Reputation Tokens (Faction-Specific)**
- **Sources**: Faction missions, daily/weekly objectives, faction-specific achievements
- **Uses**: Faction vendor items, exclusive blueprints, faction abilities
- **Types**: Darkspur Tokens, CARD Tokens, Ashen Tokens, CAN Tokens
- **Storage**: 5,000 per faction, per character
- **Non-Transferable**: Cannot trade between players

### Currency Flow & Economic Balance

**Major Sinks (Currency Removal)**
- Crafting attempts and enhancement risks
- Skill respecialization costs (scaling with frequency)
- Vendor purchases and equipment repairs
- Modification installations and removals
- Storage expansion and convenience features
- Cosmetic items and vanity purchases

**Major Faucets (Currency Generation)**
- Mission and maze completion rewards
- Item dismantling and material processing
- Daily/weekly objective completion
- Trading fees collected and redistributed
- Maze discovery bonuses and achievements

**Economic Balance Measures**
- **Progressive Costs**: Higher-tier operations require exponentially more currency
- **Failure Chances**: Enhancement and crafting risks create currency sinks
- **Time Gates**: Some operations have cooldowns to prevent rapid farming
- **Market Regulation**: Automated systems prevent extreme inflation/deflation

## Crafting & Enhancement Systems

### Crafting Stations

**1. Weapon Forge**
- **Function**: Create and modify weapons
- **Recipes**: 200+ weapon blueprints across all categories
- **Requirements**: Nanites, specific materials, blueprints, crafting level
- **Special Features**: Masterwork attempts for enhanced stats
- **Location**: Available in colony hub and some high-tier maze safe rooms

**2. Armor Workshop**
- **Function**: Craft and enhance armor pieces
- **Recipes**: 300+ armor blueprints across all slots and types
- **Requirements**: Nanites, textiles, technology components, blueprints
- **Special Features**: Set piece coordination and bonus optimization
- **Customization**: Visual appearance modifications available

**3. Technology Laboratory**
- **Function**: Produce modifications and components
- **Recipes**: All modification types, enhancement cores, utility items
- **Requirements**: Data Fragments, rare materials, research progression
- **Special Features**: Research new modification types and combinations
- **Innovation**: Combine existing mods to create custom variants

**4. Exotic Foundry**
- **Function**: Transform items to exotic quality, create unique items
- **Recipes**: Exotic conversion, legendary upgrade paths, custom legendaries
- **Requirements**: Exotic Components, perfect base items, rare catalysts
- **Special Features**: One-time transformations with permanent effects
- **Risk/Reward**: High cost but enables otherwise impossible builds

### Blueprint System
- **Discovery Methods**: Found in mazes, purchased from vendors, faction rewards, research
- **Categories**: Weapons, armor, modifications, consumables, utilities
- **Progression Tiers**: Basic → Advanced → Expert → Master → Legendary
- **Specialization Paths**: Some blueprints locked behind faction reputation or achievements
- **Research Trees**: Advanced blueprints require researching prerequisite blueprints

### Material Types & Sources

**Common Materials (Easy to Obtain)**
- **Scrap Metal**: Dismantled weapons and armor, maze debris
- **Synthetic Textiles**: Dismantled clothing and light armor
- **Basic Circuits**: Common electronic components, broken devices

**Uncommon Materials (Moderate Effort)**
- **Alloy Plates**: Refined metals from processing operations
- **Advanced Polymers**: Specialized synthetic materials from research
- **Processing Units**: Mid-tier electronic components from tech enemies

**Rare Materials (Significant Investment)**
- **Quantum Cores**: High-energy storage devices from elite enemies
- **Dark Matter**: Exotic energy source from high-tier mazes
- **Neural Mesh**: Advanced bio-tech components from boss encounters

**Exotic Materials (Extreme Rarity)**
- **Void Essence**: Progenitor-tech derived material from master-tier content
- **Stellar Fragments**: Crystallized energy from space-themed mazes
- **Temporal Crystals**: Time-dilated mineral formations from reality-warped areas

## Trading & Social Systems

### Marketplace Features

**Asynchronous Trading**
- **Listing System**: Items posted for 1-7 days with buyout prices
- **Bidding System**: Auction-style bidding for rare items
- **Automatic Transactions**: Completed when buyer meets seller's terms
- **Transaction Fees**: 5% marketplace fee on all sales
- **Buyer Protection**: 2-hour inspection period for high-value items

**Advanced Search & Filter System**
- **Item Type Filtering**: Weapons, armor, modifications, materials, blueprints
- **Stat Range Searches**: Min/max values for specific stats and combinations
- **Rarity and Quality**: Filter by tier, enhancement level, and perfection
- **Price Efficiency**: Sort by stat-per-credit ratios and power budget efficiency
- **Recent Activity**: Time-based filtering and price history tracking

**Currency Exchange Market**
- **Automated Exchange**: Real-time exchange rates based on supply/demand
- **Daily Conversion Limits**: Caps prevent market manipulation
- **Transaction Fees**: 2% fee on all currency conversions
- **Rate History**: Track currency value trends