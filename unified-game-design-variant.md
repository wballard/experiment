# COURIER - MASTER GAME DESIGN DOCUMENT
## Complete Systems Specification v2.0

---

# TABLE OF CONTENTS

**PART I: CORE SYSTEMS**
1. [Weapon Statistics System](#weapon-statistics-system)
2. [Complete Item Stats (44 Secondary Stats)](#complete-item-stats)
3. [Power Budget System](#power-budget-system)
4. [Character Classes & Attributes](#character-classes--attributes)

**PART II: ITEMIZATION**
5. [Equipment System](#equipment-system)
6. [Modification Systems](#modification-systems)
7. [Crafting & Enhancement](#crafting--enhancement)

**PART III: CONTENT SYSTEMS**
8. [50-Tier Dungeon System](#50-tier-dungeon-system)
9. [Elemental System](#elemental-system)
10. [Status Effects](#status-effects)

**PART IV: PROGRESSION**
11. [Skill Trees](#skill-trees)
12. [New Player Experience](#new-player-experience)
13. [Endgame Systems](#endgame-systems)

**PART V: WORLD & ECONOMY**
14. [Factions & Reputation](#factions--reputation)
15. [Currency & Trading](#currency--trading)
16. [Lore & Setting](#lore--setting)

---

# PART I: CORE SYSTEMS

## WEAPON STATISTICS SYSTEM

### Core Design Philosophy
- **Visible Complexity**: Players see key stats with exact numbers
- **Hidden Depth**: Complex mechanics operate behind the scenes
- **Clear Communication**: Stats grouped by function (damage, handling, mobility)

### Weapon Base Statistics (Immutable)

#### Visible Stats (Show Exact Numbers)
1. **Damage**: Base damage per shot/swing
   - Primary weapons: 15-120
   - Heavy weapons: 250-1500
   - Melee weapons: 80-300

2. **Fire Rate**: Rounds/attacks per minute
   - Full auto: 450-1000 RPM
   - Semi-auto: 110-260 RPM
   - Burst: 340-540 RPM

3. **Magazine Size**: Rounds per reload
   - Pistols: 6-15
   - Rifles: 20-45
   - LMGs: 50-200

4. **Reload Time**: Base reload duration
   - Fast: 1.5-2.2s
   - Medium: 2.3-3.0s
   - Slow: 3.1-4.0s

5. **Range**: Effective damage distance
   - Close: 8-15m
   - Medium: 20-50m
   - Long: 60-150m

6. **Accuracy**: Base spread angle
   - Precise: 0.5°-2°
   - Standard: 3°-7°
   - Spread: 8°-15°

7. **Penetration**: Armor piercing value (0-100)

#### Bar Chart Stats (1-10 Display)
**Handling Group:**
- Reload Speed (animation speed multiplier)
- Weapon Swap (transition time)
- ADS Speed (aim down sight speed)

**Mobility Group:**
- Movement Penalty (speed reduction when equipped)
- Sprint to Fire (delay after sprinting)

**Stability Group:**
- Stability (recoil control - inverted display)

#### Hidden Stats (Backend Only)
- Heat accumulation (0-100 per shot)
- Spread recovery rate (degrees/second)
- Damage falloff curves (start/end distances)
- Projectile velocity (m/s)
- Aim assist values (magnetism, friction)
- Flinch intensity multiplier
- Draw/holster frame data
- Sprint exit timing
- Bloom reset curves
- Recoil patterns (25+ directional values)

### Weapon Type Base Values

#### Assault Rifles
- **Damage**: 45-65
- **RPM**: 450-650
- **Magazine**: 30-40
- **Reload**: 2.5s
- **Range**: 35-50m
- **Movement**: 0.95x
- **Stability**: 7/10

#### Submachine Guns
- **Damage**: 20-35
- **RPM**: 750-1000
- **Magazine**: 25-50
- **Reload**: 2.0s
- **Range**: 15-25m
- **Movement**: 0.98x
- **Stability**: 5/10

#### Shotguns
- **Damage**: 15-25 × 10 pellets
- **RPM**: 60-180
- **Magazine**: 4-8
- **Reload**: 3.0s (shell-by-shell)
- **Range**: 8-15m
- **Movement**: 0.93x
- **Stability**: 4/10

#### Scout Rifles
- **Damage**: 65-85
- **RPM**: 180-260
- **Magazine**: 12-20
- **Reload**: 2.8s
- **Range**: 60-80m
- **Movement**: 0.94x
- **Stability**: 8/10

#### Hand Cannons
- **Damage**: 90-120
- **RPM**: 110-180
- **Magazine**: 6-12
- **Reload**: 2.2s
- **Range**: 30-40m
- **Movement**: 0.96x
- **Stability**: 6/10

#### Sniper Rifles
- **Damage**: 250-400
- **RPM**: 40-90
- **Magazine**: 3-6
- **Reload**: 3.5s
- **Range**: 100-150m
- **Movement**: 0.90x
- **Stability**: 6/10

---

## COMPLETE ITEM STATS

### All 44 Secondary Stats

#### Offensive Stats (Weapons + Select Armor)

**Damage Enhancement (Rarity 6-10)**
- Weapon Damage %: +1-15% (Power: 4 per 1%)
- Melee Damage %: +2-20% (Power: 3 per 1%)
- Ability Damage %: +2-25% (Power: 3 per 1%)
- Damage vs Elites %: +5-50% (Power: 2 per 1%)

**Critical Modifiers (Rarity 5-8)**
- Critical Chance: +1-10% (Power: 5 per 1%)
- Critical Damage: +10-100% (Power: 3 per 10%)

**Elemental Damage (Rarity 4-8)**
- Fire/Ice/Electric/Nature/Earth Damage:
  - Flat: +2-50 (Power: 0.2 per point)
  - Percent: +1-15% (Power: 4 per 1%)

**Elemental Potency (Rarity 5-9)**
- Fire/Ice/Electric/Nature/Earth Potency: +1-20%
  - Increases damage AND status effect buildup
  - Power Cost: 4 per 1%

**Status Effect Stats (Rarity 4-7)**
- Status Buildup Rate: +10-80% (Affects all status application)
- Status Effect Duration: +10-50% (Extends all applied statuses)
- Power Cost: 2 per 10%

**Combat Utility (Rarity 3-7)**
- Reload Speed: +5-30% (Power: 3 per 5%)
- Weapon Swap Speed: +10-50% (Power: 2 per 10%)
- Magazine Size: +1-15 (Power: 5 per round)
- Fire Rate: +2-15% (Power: 8 per 1%)
- Penetration: +1-20 (Power: 3 per point)

#### Defensive Stats (Armor Only)

**Core Defense (Rarity 1-8)**
- Armor: +10-200 (Power: 0.5 per point)
- Health: +20-500 (Power: 0.2 per point)
- Shield Capacity: +10-300 (Power: 0.3 per point)

**Percentage Defenses (Rarity 5-10)**
- Damage Reduction %: +1-10% (Power: 10 per 1%)
- Health %: +2-20% (Power: 5 per 1%)
- Shield %: +2-25% (Power: 4 per 1%)

**Resistances (Rarity 3-8)**
- Single Element Resist: +5-30% (Power: 3 per 5%)
- All Resistance: +2-10% (Power: 8 per 1%)

**Sustain Stats (Rarity 4-9)**
- Health Regen: +5-50/sec (Power: 1 per 5)
- Shield Recharge Rate: +10-100% (Power: 2 per 10%)
- Shield Delay Reduction: +10-50% (Power: 3 per 10%)
- Life on Kill: +10-100 (Power: 1 per 10)

#### Utility Stats (Both Weapon & Armor)

**Resource Management (Rarity 3-7)**
- Ammo Reserve: +10-100% (Power: 2 per 10%)
- Ability Cooldown: -5-25% (Power: 8 per 1%)
- Resource Generation: +5-30% (Power: 5 per 5%)

**Movement (Rarity 4-8)**
- Movement Speed: +2-10% (Power: 8 per 1%)
- Sprint Speed: +5-20% (Power: 5 per 5%)
- Dodge Distance: +10-50% (Power: 3 per 10%)

**Combat Flow (Rarity 5-9)**
- Anchoring: +5-50 (Reduces knockback, Power: 2 per 10)
- Tenacity: +5-30% (CC reduction, Power: 5 per 5%)
- Block: +5-30 (Flat damage blocked, Power: 3 per 5)

---

## POWER BUDGET SYSTEM

### Core Concept
Every item has a "Power Budget" that limits total stats:
- **Not a currency** - it's a design constraint
- **Higher rarity = better stat efficiency**, not just more stats
- **Creates meaningful choices** between many weak stats vs few strong stats

### Power Budget by Slot
- **Helmet**: 150 power
- **Chest**: 250 power (highest)
- **Shoulders**: 200 power
- **Gloves**: 150 power
- **Legs**: 200 power
- **Boots**: 150 power
- **Bracers**: 125 power (lowest)
- **Weapons**: 175 power

### Rarity Efficiency Multipliers
- **Common**: 0.75x efficiency
- **Uncommon**: 0.85x efficiency
- **Rare**: 1.0x efficiency (baseline)
- **Epic**: 1.15x efficiency
- **Legendary**: 1.25x efficiency
- **Mythic**: 1.3x efficiency
- **Primal**: 1.35x efficiency

### Example: Chest Armor (250 Power Budget)
**Rare Chest (1.0x efficiency):**
- Health: +250 (costs 50 power)
- Armor: +100 (costs 50 power)
- Fire Resist: +15% (costs 45 power)
- All Resist: +5% (costs 40 power)
- Health Regen: +30/sec (costs 30 power)
- Movement Speed: +4% (costs 32 power)
- **Total**: 247/250 power used

**Mythic Chest (1.3x efficiency):**
Same stats would only cost 190 power, leaving room for more!

---

## CHARACTER CLASSES & ATTRIBUTES

### Primary Attributes (SPECIAL System)
Players receive 5 attribute points per level (1-60 = 300 total points)

1. **Strength** - Melee damage, physical resistance
   - +2% melee damage per 10 points
   - +1% physical damage reduction per 20 points

2. **Precision** - Accuracy, critical chance
   - +0.5% critical chance per 10 points
   - +5% accuracy per 20 points

3. **Endurance** - Health, stamina
   - +10 health per point
   - +5% stamina regeneration per 20 points

4. **Capacity** - Resource pools, carrying capacity
   - +2% ability resource per 10 points
   - +5 inventory slots per 20 points

5. **Intellect** - Ability cooldowns, experience gain
   - -0.5% cooldown reduction per 10 points
   - +1% experience gain per 20 points

6. **Alacrity** - Attack speed, movement
   - +0.5% attack speed per 10 points
   - +0.25% movement speed per 20 points

7. **Luck** - Loot quality, rare events
   - +1% magic find per 10 points
   - +0.5% chance for bonus loot per 20 points

### The Five Classes

#### 1. SENTINEL (Tank/Support Hybrid)
**Starting Attributes:** STR 15, END 15, CAP 10
**Class Resource:** Aegis Energy (builds through damage taken)
**Playstyle:** Frontline defender with team support abilities

**Signature Abilities:**
- Shield Wall: Deploy energy barrier (absorbs 1000 damage)
- Rally Cry: Team-wide damage reduction (20% for 10s)
- Retribution: Reflect 50% damage for 5s
- Aegis Protocol: Become immovable, gain 90% DR for 3s

#### 2. TECHNOMANCER (Ranged DPS/Control)
**Starting Attributes:** INT 15, PRE 15, ALA 10
**Class Resource:** Tech Points (regenerates over time)
**Playstyle:** Gadget-based combat with deployables

**Signature Abilities:**
- Deploy Turret: Automated defense (200 DPS)
- Hack: Disable enemy weapons/shields
- Overclock: Double fire rate for 8s
- Singularity: Create gravity well (pulls enemies)

#### 3. INFILTRATOR (Stealth/Burst DPS)
**Starting Attributes:** PRE 15, ALA 15, LUK 10
**Class Resource:** Shadow Charges (build through kills)
**Playstyle:** Hit-and-run assassin

**Signature Abilities:**
- Cloak: Invisibility for 6s
- Shadow Strike: Teleport behind enemy (300% damage)
- Smoke Screen: Blind enemies in area
- Assassination Protocol: Next 3 attacks guaranteed crit

#### 4. VANGUARD (Aggressive Tank/Brawler)
**Starting Attributes:** STR 20, END 10, ALA 10
**Class Resource:** Rage (builds through dealing damage)
**Playstyle:** Aggressive melee combatant

**Signature Abilities:**
- Charge: Rush forward (100 damage + stun)
- Bloodlust: Lifesteal 50% for 10s
- Berserker: +100% melee damage, -50% damage taken
- Ground Slam: AoE knockup

#### 5. ENGINEER (Support/Specialist)
**Starting Attributes:** INT 15, CAP 15, END 10
**Class Resource:** Supply Points (limited per combat)
**Playstyle:** Battlefield support and area control

**Signature Abilities:**
- Deploy Dispenser: Heals and restocks ammo
- Fortify: Create cover anywhere
- EMP Blast: Disable shields in large area
- Orbital Strike: Call down satellite laser

---

# PART II: ITEMIZATION

## EQUIPMENT SYSTEM

### Weapon Categories

#### Primary Weapons (Main Slot)
- **Kinetic**: Physical damage, reliable
- **Energy**: Elemental damage, shield breaking
- **Hybrid**: Switches between modes

#### Heavy Weapons (Power Slot)
- **Explosive**: Rocket launchers, grenade launchers
- **Precision**: Sniper rifles, railguns
- **Sustained**: Machine guns, miniguns

#### Melee Weapons
- **Light**: Fast attacks, mobility
- **Heavy**: High damage, crowd control
- **Special**: Unique mechanics

### Armor Slots (8 Total)
1. **Helmet** - Vision modes, HUD enhancements
2. **Shoulders** - Ability modifications
3. **Chest** - Core defense, health
4. **Gloves** - Weapon handling, melee
5. **Legs** - Movement, dodging
6. **Boots** - Sprint, jumping
7. **Back** - Cloaks, jetpacks, shields
8. **Bracers** - Class-specific bonuses

### Rarity System

#### Drop Rates by Source
**Common Enemies:**
- Common: 60%
- Uncommon: 30%
- Rare: 9%
- Epic: 1%

**Elite Enemies:**
- Uncommon: 50%
- Rare: 35%
- Epic: 12%
- Legendary: 3%

**Bosses:**
- Rare: 40%
- Epic: 35%
- Legendary: 20%
- Exotic: 5%

**Tier 50 Dungeons:**
- Epic: 30%
- Legendary: 40%
- Exotic: 20%
- Mythic: 8%
- Primal: 2%

---

## MODIFICATION SYSTEMS

### Weapon Modifications (7 Slots)

#### 1. Optics (Changes ADS behavior)
- **Iron Sights**: No zoom, fastest ADS
- **Red Dot**: 1.5x zoom, quick acquisition
- **ACOG**: 4x zoom, reduced peripherals
- **Sniper Scope**: 8-12x zoom, glint visible
- **Smart Scope**: Highlights enemies

#### 2. Magazine (Ammo management)
- **Extended**: +50% capacity, -10% reload
- **Quick Mag**: -25% reload time
- **Armor Piercing**: +20 penetration
- **Elemental Rounds**: Converts damage type

#### 3. Underbarrel (Utility)
- **Grip**: +2 stability
- **Launcher**: Secondary explosive
- **Bayonet**: Melee damage bonus
- **Shield Projector**: Deployable cover

#### 4. Muzzle (Projectile behavior)
- **Suppressor**: -50% sound, -10% range
- **Compensator**: +3 stability
- **Flash Hider**: No muzzle flash
- **Choke**: Tighter spread (shotguns)

#### 5. Barrel (Core stats)
- **Long Barrel**: +20% range, -5% handling
- **Short Barrel**: +15% handling, -15% range
- **Heavy Barrel**: +15% damage, -10% fire rate
- **Fluted Barrel**: +10% reload speed

#### 6. Stock (Mobility)
- **Stable Stock**: +4 stability
- **Tactical Stock**: +20% ADS speed
- **No Stock**: +15% movement, -5 stability

#### 7. Trigger (Fire behavior)
- **Hair Trigger**: +10% fire rate
- **Match Trigger**: First shot +50% accuracy
- **Select Fire**: Toggle fire modes
- **Binary Trigger**: Fire on pull and release

### Armor Modifications (3 Slots Per Piece)

#### Slot 1: Defense Mods
- **Plating**: +50 armor
- **Dampener**: +10% kinetic resist
- **Deflector**: +10% energy resist
- **Reactive**: Gains DR when damaged

#### Slot 2: Utility Mods
- **Mobility**: +5% movement
- **Recovery**: +20 health regen
- **Capacity**: +20% ammo reserve
- **Efficiency**: -10% ability cooldown

#### Slot 3: Combat Mods
- **Rampage**: Stacking damage on kills
- **Surrounded**: Damage when outnumbered
- **Finisher**: Bonus damage to low HP
- **Momentum**: Speed boost on kills

---

## CRAFTING & ENHANCEMENT

### Crafting Stations

#### 1. Weapon Forge
- **Dismantle**: Break down for materials
- **Reforge**: Reroll one stat
- **Infuse**: Transfer power level
- **Masterwork**: Enhance all stats

#### 2. Armor Workshop
- **Transmog**: Change appearance
- **Reroll**: New random stats
- **Upgrade**: Increase rarity
- **Socket**: Add mod slots

#### 3. Mod Bench
- **Craft Mods**: Create from blueprints
- **Upgrade Mods**: Improve existing
- **Extract Mods**: Remove without destroying
- **Combine**: Merge similar mods

### Material Types

#### Common Materials
- **Scrap Metal**: Basic crafting
- **Electronic Parts**: Tech items
- **Fabric**: Armor crafting
- **Chemicals**: Consumables

#### Rare Materials
- **Nanites**: Advanced modifications
- **Exotic Matter**: Exotic crafting
- **Data Crystals**: Blueprint unlocks
- **Progenitor Fragments**: Highest tier

---

# PART III: CONTENT SYSTEMS

## 50-TIER DUNGEON SYSTEM

### Tier Scaling Formula
**Base Values × (1 + Tier × 0.15)**
- Tier 1: 100% (baseline)
- Tier 10: 250% difficulty
- Tier 25: 475% difficulty
- Tier 50: 850% difficulty

### Affix System (5 Active Per Run)

#### Environmental Affixes (Affect Arena)

**Snowfall** (Ice)
- Visibility reduced 30%
- Movement speed -15%
- Builds Freeze status over time
- Ice patches spawn randomly

**Volcanic** (Fire)
- Magma eruptions every 8-12s
- 200 damage per eruption
- Leaves burning ground (50 DPS)
- Heat builds, reducing healing

**Corrosive Atmosphere** (Nature)
- Armor degrades 2% per minute
- Toxin buildup over time
- Healing reduced 25%
- Ammo corrodes (jam chance)

**Tectonic** (Earth)
- Random earthquakes (knockdown)
- Cracks open (instant death)
- Cover crumbles over time
- Movement slowed near cracks

**Storm Surge** (Electric)
- Lightning strikes highest player
- Chain lightning between close players
- Shields overload (damage)
- Electronics malfunction

#### Combat Affixes (Affect Enemies)

**Brutal**
- +50% enemy melee damage
- Attacks cause bleed
- Increased lunge range

**Shielded**
- All enemies have overshields
- Shields regenerate out of combat
- Breaking shields causes explosion

**Unstable**
- Enemies explode on death
- Explosion damage scales with enemy HP
- Chain reactions possible

**Adaptive**
- Enemies gain resistance to damage type
- Stacks up to 90% reduction
- Resets on type switch

**Relentless**
- Enemies gain speed when damaged
- No flinch or stagger
- Increased aggression

#### Mechanical Affixes (Affect Gameplay)

**Attrition**
- No health regeneration
- Healing reduced 50%
- Health drains out of combat

**Darkness**
- Reduced visibility range
- Flashlights required
- Enemies have perfect vision

**Time Pressure**
- Timer on entire dungeon
- Bonus rewards for speed
- Failure if time expires

**Glass Cannon**
- +100% player damage
- +200% damage taken
- One-shot protection removed

**Restricted Loadout**
- Can only use specific weapon types
- Rotates each floor
- Bonus damage with restricted type

### Reward Scaling

#### Tier 1-10 (Introduction)
- XP: 100-500 per completion
- Credits: 1,000-5,000
- Drop Rate: +0-50% magic find
- Materials: Common only

#### Tier 11-25 (Progression)
- XP: 500-2,000 per completion
- Credits: 5,000-25,000
- Drop Rate: +50-150% magic find
- Materials: Common + Rare

#### Tier 26-40 (Endgame)
- XP: 2,000-5,000 per completion
- Credits: 25,000-100,000
- Drop Rate: +150-300% magic find
- Materials: Rare + Exotic

#### Tier 41-50 (Pinnacle)
- XP: 5,000-10,000 per completion
- Credits: 100,000-500,000
- Drop Rate: +300-500% magic find
- Materials: Exotic + Progenitor
- Exclusive: Mythic/Primal drops

---

## ELEMENTAL SYSTEM

### The Five Elements

#### Fire
- **Damage Type**: Damage over time
- **Status Effect**: Burn (10 DPS for 5s, stacks to 5)
- **Resistance Counter**: Ice shields
- **Combo with Nature**: Wildfire (spreads on death)
- **Combo with Electric**: Plasma (ignores shields)

#### Ice
- **Damage Type**: Slowing/control
- **Status Effect**: Freeze (immobilize at 100 stacks)
- **Resistance Counter**: Fire damage
- **Combo with Earth**: Permafrost (area slow)
- **Combo with Electric**: Superconductor (chain freeze)

#### Electric
- **Damage Type**: Shield breaking
- **Status Effect**: Shock (chain damage)
- **Resistance Counter**: Earth armor
- **Combo with Fire**: Plasma burn
- **Combo with Ice**: Brittle (crit vulnerable)

#### Nature
- **Damage Type**: Corruption/heal reduction
- **Status Effect**: Toxin (stacking poison)
- **Resistance Counter**: Fire cleanse
- **Combo with Earth**: Overgrowth (roots)
- **Combo with Fire**: Caustic cloud

#### Earth
- **Damage Type**: Physical/blunt
- **Status Effect**: Fracture (armor break)
- **Resistance Counter**: Nature erosion
- **Combo with Ice**: Shatter (execute)
- **Combo with Nature**: Petrify (stone)

### Elemental Skill Trees

Each element has dedicated skill tree (20 nodes):

#### Tier 1 (0 points) - Entry
- Basic elemental shot
- Resistance passive (+10%)
- Elemental melee
- Status chance (+5%)

#### Tier 2 (5 points) - Specialization
- Area effect ability
- Damage bonus (+15%)
- Status duration (+25%)
- Combo primer
- Defensive adaptation

#### Tier 3 (10 points) - Mastery
- Ultimate ability
- Elemental infusion (convert all damage)
- Combo detonator
- Status spreader
- Immunity phase

#### Tier 4 (15 points) - Pinnacle
- Elemental mastery (all abilities apply status)
- Transcendence (dual element mode)

---

## STATUS EFFECTS

### Application Mechanics

#### Buildup System
- Each hit applies buildup (0-100)
- At 100, status triggers
- Buildup decays if not refreshed
- Resistance reduces buildup rate

#### Status Types

**Damage Over Time**
- **Burn**: 10 DPS base, 5s duration
- **Toxin**: 5 DPS base, 10s duration, spreads
- **Bleed**: 15 DPS base, 3s duration

**Control Effects**
- **Freeze**: Immobilize at 100 stacks
- **Shock**: Stun for 1s + chain damage
- **Root**: Immobilize legs, can still shoot

**Debuffs**
- **Fracture**: -25% armor
- **Blind**: -90% accuracy
- **Weakness**: -30% damage

### Resistance System
- Base resistance: 0%
- Gear can add: +5-30% per element
- Stacks diminishing: 30%, 45%, 52%, 56%, 58%, 60% (cap)
- "All Resistance" adds to each element

---

# PART IV: PROGRESSION

## SKILL TREES

### Main Class Trees (60 Nodes Each)

#### Tree Structure
- **Core Path**: 20 nodes of class identity
- **Offensive Branch**: 20 nodes for damage
- **Defensive Branch**: 20 nodes for survival
- **Hybrid Nodes**: Connect branches

#### Node Types
1. **Minor Nodes**: +2% to stat
2. **Major Nodes**: +5% to stat or new mechanic
3. **Keystone Nodes**: Game-changing passives
4. **Ability Nodes**: New active abilities

### Shared Skill Pool
- Total Points: 300 (5 per level, max level 60)
- Can spend in any unlocked tree
- Respec cost: 10,000 credits per point

### Example Keystone Passives

**Sentinel Tree:**
- "Immovable Object": Immune to knockback, +50% mass
- "Reflective Plating": 25% damage reflection
- "Last Stand": Immortal for 3s when fatal damage taken (180s CD)

**Technomancer Tree:**
- "Ghost in the Machine": Deployables have +100% HP
- "Overclock Protocol": All abilities have 2 charges
- "Singularity Matrix": Enemies pulled together take +50% damage

---

## NEW PLAYER EXPERIENCE

### Tutorial Flow (First Hour)

#### 1. Cryosleep Awakening (5 min)
- Wake in medical bay
- Basic movement tutorial
- Environmental storytelling
- Meet first NPC (Dr. Reeves)

**First Combat** (10 min)
- Malfunction creates hostile drones
- Learn shooting mechanics
- Cover system introduction
- First loot drop

#### 2. Welcome to Paradise Station (15 min)
- Hub area introduction
- Meet faction representatives
- Inventory/equipment tutorial
- First merchant interaction

**Skill System Unlock** (10 min)
- Level 2 achieved
- First skill point allocation
- Ability tutorial
- Practice arena

#### 3. First Maze Run (20 min)
- Enter Tier 1 maze
- Environmental hazards
- Elite enemy encounter
- Extraction mechanics

**Mystery Introduction**
- Find Progenitor artifact
- Strange visions
- Dr. Reeves' concern
- Hook for main story

### Contextual Tutorials

#### Triggered by Actions:
- First death: Respawn explanation
- First rare drop: Rarity system
- First full inventory: Management tips
- First elite: Weak point targeting
- First status effect: Resistance explanation

---

## ENDGAME SYSTEMS

### Paragon Levels (Post-60)
- Infinite progression
- 1 paragon point per level
- Diminishing returns on stats
- Exclusive paragon tree

### Pinnacle Activities

#### 1. Raids (6-player)
- Multi-phase boss encounters
- Unique mechanics per raid
- Weekly lockouts
- Guaranteed exotic drops

#### 2. Nightmare Dungeons
- Tier 35+ with special modifiers
- Rotating weekly challenges
- Leaderboards
- Exclusive cosmetics

#### 3. PvP Arenas
- 4v4 competitive
- Ranked seasons
- Unique PvP mods
- Glory currency

### Seasonal Content
- 3-month seasons
- New story chapter
- Seasonal artifacts
- Battle pass progression
- Meta shifts

---

# PART V: WORLD & ECONOMY

## FACTIONS & REPUTATION

### The Four Factions

#### 1. DARKSPUR PROSPECTING
**Philosophy**: "Fortune Favors the Bold"
- Focus: Resource extraction, profit
- Benefits: Trading discounts, material finds
- Reputation Rewards: Exotic materials, wealth multipliers

#### 2. CARD (Colonial Armed Response Division)
**Philosophy**: "Order Through Strength"
- Focus: Military efficiency, security
- Benefits: Weapon modifications, combat bonuses
- Reputation Rewards: Military gear, damage boosts

#### 3. ASHEN COLLECTIVE
**Philosophy**: "Knowledge is Power"
- Focus: Progenitor research, technology
- Benefits: Crafting bonuses, tech unlocks
- Reputation Rewards: Blueprints, research data

#### 4. CAN (Citizen Advocacy Network)
**Philosophy**: "People First"
- Focus: Colony wellbeing, support
- Benefits: Healing improvements, team buffs
- Reputation Rewards: Support gear, revival bonuses

### Reputation System
- Levels: Neutral → Friendly → Honored → Revered → Exalted
- Points needed: 0 → 3,000 → 9,000 → 21,000 → 42,000
- Daily quests: 200-500 rep
- Weekly quests: 1,000-2,500 rep
- Faction events: 500-5,000 rep

---

## CURRENCY & TRADING

### Currency Types

#### 1. Credits (Common)
- Earned from all activities
- Used for repairs, basic items
- Trading medium between players

#### 2. Nanites (Uncommon)
- Earned from dismantling
- Used for crafting, modifications
- Cannot be traded

#### 3. Data Fragments (Rare)
- Earned from research activities
- Used for blueprint unlocks
- Limited weekly earning cap

#### 4. Exotic Components (Very Rare)
- Earned from high-tier content
- Used for exotic crafting
- Highly valuable in trading

#### 5. Progenitor Essence (Ultra Rare)
- Earned from Tier 40+ dungeons
- Used for pinnacle upgrades
- Account-bound

### Trading System

#### Player Market
- Auction house style
- 5% transaction tax
- Search filters extensive
- Price history tracked

#### Direct Trading
- Face-to-face trades
- No tax applied
- Inspection before trade
- Trade confirmation required

#### Trade Restrictions
- Account must be 7 days old
- Level 20 minimum
- Some items bind on pickup
- Exotic/Mythic/Primal untradeable

---

## LORE & SETTING

### The Colony of Orphan

#### Discovery
- Found 2157 by colony ship *Aspiration*
- No star system, rogue planet
- Artificial atmosphere detected
- Progenitor structures everywhere

#### The Labyrinth
- Extradimensional maze network
- Entrance portals planet-wide
- Interior defies physics
- Constantly reconfiguring

### The Progenitors

#### What We Know
- Abandoned Orphan ~10,000 years ago
- Technology beyond comprehension
- Created the Labyrinth
- Purpose unknown

#### Theories
- Testing facility for species
- Prison for something worse
- Ascension to higher dimension
- Still watching

### Key Locations

#### Paradise Station
- Main colony hub
- 500,000 residents
- Faction headquarters
- Central marketplace

#### The Spire
- Progenitor structure
- 2km tall crystal
- Maze entrance at base
- Strange energy readings

#### Desolation Zones
- Failed colony attempts
- High radiation
- Mutant creatures
- Best salvage

### The Mystery

#### The Signal
- Detected in Labyrinth depths
- Mathematical pattern
- Growing stronger
- Faction debate on response

#### The Touched
- Humans affected by Labyrinth
- Enhanced abilities
- Loss of humanity?
- Ashen studies them

#### The Door
- Found at Tier 50
- Never been opened
- Different for each group
- What's behind it?

---

# TECHNICAL SPECIFICATIONS

## Performance Targets
- 60 FPS at 1080p (Console)
- 144+ FPS at 1440p (PC High)
- Load times <5 seconds
- Seamless hub transitions

## Network Architecture
- Dedicated servers
- 60 tick rate minimum
- Regional matchmaking
- Rollback netcode

## Scalability
- 50 players per hub instance
- 4 players per maze instance
- 6 players for raids
- 100 player faction events

---

# CONCLUSION

This document represents the complete vision for Courier, a game that combines the best elements of modern ARPGs and looter shooters while introducing innovative systems like Power Budgets and the Progenitor mystery. The modular design allows for iterative development and seasonal expansion while maintaining a cohesive experience.

**Next Steps:**
1. Prototype core combat loop
2. Implement Power Budget system
3. Create Tier 1-10 content
4. Alpha test with focus groups
5. Iterate based on feedback

---

**Document Version:** 2.0
**Last Updated:** August 2025
**Total Systems:** 50+
**Estimated Dev Time:** 36 months with team of 150