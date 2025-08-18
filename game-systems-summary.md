# Sci-Fi ARPG/Looter Shooter - Core Systems Summary

## Quick Reference Guide

### Character Basics

**Level Progression**
- **Levels 1-100**: Main progression path
- **Paragon Levels**: Post-100 infinite progression (+10 power per level)
- **Experience Scaling**: Exponential curve, ~150-200 hours to max
- **Per Level Gains**:
  - +1 to all attributes (base)
  - +20 power budget
  - 1-2 skill points (140 total at level 100)

**5 Classes Available**
1. **Titan** - Tank specialist (High Vitality/Fortitude)
2. **Psion** - Caster DPS (High Capacity/Potency)
3. **Ghost** - Stealth/Precision (High Precision/Alacrity)
4. **Assault** - Close combat (Balanced Potency/Vitality)
5. **Technician** - Support/Deployables (High Capacity/Fortitude)

### Core Attributes (6 Total)

1. **Vitality**
   - +20 Health per point
   - +5 Health Regen/sec per point
   - +0.2% Life Steal per point

2. **Precision**
   - +0.05% Crit Chance per point (50% cap)
   - +0.5% Crit Damage per point

3. **Potency**
   - +0.1% All Damage per point
   - +0.15% Status Effect Buildup per point

4. **Alacrity**
   - +0.1% Fire Rate per point
   - +0.1% Reload Speed per point
   - +0.05% Movement Speed per point (30% cap)

5. **Capacity**
   - +5 Max Energy per point
   - +1 Energy Regen/sec per point
   - +0.1% Cooldown Reduction per point (40% cap)

6. **Fortitude**
   - +0.05% All Resistances per point
   - +1 Armor per point
   - +2 Shield Capacity per point

**Attribute Scaling**
- Base from leveling: ~65 points per attribute
- From gear: 200-400+ in focused attributes
- Maximum possible: ~500 with perfect gear

### Complete Secondary Stats List

#### Health & Vitality Stats
1. **Max Health**
   - Flat bonus: +X Health
   - Percentage: +X% Maximum Health
   - Sources: Vitality, gear, skills
   - Typical Range: 1,000-15,000

2. **Health Regeneration**
   - Flat rate: +X Health per Second
   - Percentage: +X% Health Regen
   - Sources: Vitality, gear, buffs
   - Typical Range: 10-500/sec

3. **Life Steal**
   - Percentage: +X% Life Steal
   - Sources: Weapons only, Vitality
   - Special: 50% effectiveness vs bosses
   - Typical Range: 1-15%

4. **Life on Kill**
   - Flat amount: +X Health on Kill
   - Sources: Weapons exclusively
   - Note: Procs on killing blow only

#### Shield Stats
5. **Shield Capacity**
   - Flat bonus: +X Shield
   - Percentage: +X% Maximum Shield
   - Sources: Fortitude, helm/chest
   - Typical Range: 500-5,000

6. **Shield Recharge Delay**
   - Reduction: +X% Faster Shield Recharge Start
   - Base Delay: 3 seconds
   - Hard Cap: 50% reduction

7. **Shield Regeneration Rate**
   - Percentage: +X% Shield Regen Speed
   - Base Rate: 100 shield/sec
   - Hard Cap: 300% (3x base)

#### Damage Stats
8. **Weapon Damage %**
   - Percentage: +X% Weapon Damage
   - Sources: Weapons, Potency
   - Typical Range: 10-150% total

9. **Elemental Damage (Flat)**
   - Per Element: +X [Element] Damage
   - Sources: Weapons, skills
   - Typical Range: 50-500 per element

10. **Elemental Damage %**
    - Per Element: +X% [Element] Damage
    - Sources: Gear, skill trees
    - Typical Range: 10-200% per element

11. **Critical Strike Chance**
    - Percentage: X% Critical Strike Chance
    - Base: 5%
    - Hard Cap: 50%
    - Sources: Precision, weapons, helm

12. **Critical Strike Damage**
    - Percentage: +X% Critical Strike Damage
    - Base: 150% (1.5x)
    - Sources: Precision, gloves
    - Typical Range: 150-500% total

13. **Weakspot Damage**
    - Percentage: +X% Weakspot Damage
    - Base: 150% (1.5x)
    - Note: Weakspots always crit
    - Sources: Helm, specific weapons

14. **Armor Piercing**
    - Flat value: +X Armor Piercing
    - Formula: X/(100+X) = % armor ignored
    - Example: 100 pierce = 50% armor ignored
    - Typical Range: 0-200

15. **Status Effect Power**
    - Percentage: +X% Status Effect Effectiveness
    - Effect: Faster buildup rates
    - Sources: Potency, gear

#### Defense Stats
16. **Armor**
    - Flat value: +X Armor
    - Formula: X/(1000+X) = % physical reduction
    - Sources: Fortitude, all armor pieces
    - Typical Range: 0-2,000

17. **Elemental Resistance** (Per Element)
    - Percentage: +X% [Element] Resistance
    - Base: 0%
    - Cap: 75% (90% with special gear)
    - Subject to difficulty penalties

18. **Block**
    - Flat reduction: +X Damage Blocked
    - Sources: Chest, shields
    - Applied after % reductions
    - Typical Range: 0-50

19. **Phasing**
    - Rating: +X Phasing
    - Formula: X/(100+X) = dodge chance
    - Example: 100 phasing = 50% dodge
    - Counter: Anchoring reduces effectiveness

#### Speed & Handling Stats
20. **Fire Rate %**
    - Percentage: +X% Fire Rate
    - Sources: Alacrity, weapons, gloves
    - Soft Cap: 100% (then 50% effectiveness)

21. **Reload Speed %**
    - Percentage: +X% Reload Speed
    - Sources: Alacrity, gloves
    - Note: Animation speed increase

22. **Movement Speed %**
    - Percentage: +X% Movement Speed
    - Base: 6.5 meters/sec
    - Hard Cap: 50% bonus
    - Sources: Alacrity, boots only

23. **Sprint Speed %**
    - Percentage: +X% Sprint Speed
    - Base: 9 meters/sec
    - Sources: Boots, abilities

24. **Slide Speed/Duration**
    - Percentage: +X% Slide Speed, +X% Duration
    - Sources: Boots exclusively
    - Cap: 200% speed, 400% duration

25. **Handling %**
    - Percentage: +X% Weapon Handling
    - Effects: Faster ADS, weapon swap
    - Sources: Helm, gloves

26. **Accuracy/Recoil Reduction**
    - Percentage: +X% Accuracy
    - Effect: Tighter spread patterns
    - Sources: Helm, weapon mods

#### Resource Stats
27. **Magazine Size**
    - Flat or %: +X or +X% Magazine Size
    - Sources: Gloves, weapon mods
    - Note: Rounded to nearest whole

28. **Ammo Reserve %**
    - Percentage: +X% Ammo Reserves
    - Sources: Shoulders, mods
    - Typical Range: 20-100% bonus

29. **Energy/Mana**
    - Flat: +X Maximum Energy
    - Regen: +X Energy per Second
    - Base: 100 energy, 10/sec regen
    - Sources: Capacity attribute

30. **Cooldown Reduction**
    - Percentage: +X% Cooldown Reduction
    - Sources: Capacity, helm, bracers
    - Hard Cap: 60% CDR
    - Note: Multiplicative stacking

#### Triggered Effect Stats
31. **Life on Headshot/Weakspot**
    - Flat: +X Health on Headshot
    - Sources: Weapons

32. **Shield on Kill**
    - Flat: +X Shield on Kill
    - Sources: Weapons, armor

33. **Cooldown on Kill**
    - Percentage: +X% Cooldown Refunded on Kill
    - Sources: Weapons, bracers
    - Cap: 25% per kill

34. **Life/Shield/Cooldown Steal %**
    - Percentage: +X% Damage Converted to Resource
    - Sources: Weapons only
    - Boss Modifier: 0.5x effectiveness
    - PvP Modifier: 0.3x effectiveness

#### Hidden Stats (Not Shown to Players)
35. **Threat/Aggro**
    - Multiplier affects enemy targeting
    - Tank abilities: +200%
    - DPS abilities: -50%

36. **Luck/Magic Find**
    - Improves drop quality
    - Sources: Hidden affixes, consumables

37. **Stability**
    - Reduces flinch when hit
    - Formula: X/(100+X) = flinch resistance
    - Sources: Heavy armor, skills

#### Elemental-Specific Stats
38. **Freeze Buildup Rate**
    - Percentage: +X% Freeze Buildup
    - Base varies by source (4-10% weapons, 20-60% abilities)

39. **Burn Buildup Rate**
    - Percentage: +X% Burn Buildup
    - Persists longer than freeze

40. **Toxin Buildup Rate**
    - Percentage: +X% Toxin Buildup
    - Most contagious, spreads on contact

41. **Charge Buildup Rate**
    - Percentage: +X% Charge Buildup
    - Disrupts shields as it builds

42. **Fracture Buildup Rate**
    - Percentage: +X% Fracture Buildup
    - Most persistent (5% decay vs 20% for freeze)

43. **Status Duration**
    - Percentage: +X% Status Effect Duration
    - Affects all elemental effects

44. **Status Resistance**
    - Percentage: +X% Reduced Status Duration
    - Sources: Boots, consumables
    - Cap: 75% reduction

### Equipment Slots (7 Armor + 2 Weapons)

**Armor Slots & Available Stats**

1. **Head** 
   - Focus: Precision, abilities, CDR
   - Available Stats: Armor, Shield, CDR, Crit Chance, Accuracy, Handling
   - Cannot Roll: Movement stats, life steal

2. **Shoulders**
   - Focus: Defense, utility, ammo
   - Available Stats: Armor, Ability Damage, Ammo Reserves, Elemental Damage %
   - Cannot Roll: Crit stats, movement stats

3. **Back**
   - Focus: Elemental resistances
   - Available Stats: Multiple Resistances (2-3 types), flexible secondary stats
   - Cannot Roll: Weapon-specific stats

4. **Chest**
   - Focus: Core defense
   - Available Stats: Highest Armor values, Health, All Resistances, Block
   - Cannot Roll: Offensive stats, speed stats

5. **Gloves**
   - Focus: Weapon handling
   - Available Stats: Reload Speed, Magazine Size, Crit Damage, Fire Rate
   - Cannot Roll: Movement stats, resistances

6. **Legs**
   - Focus: Movement and mobility
   - Available Stats: ALL Movement Speed bonuses, Status Resistance, Sprint/Slide
   - Cannot Roll: Weapon stats, crit stats

7. **Bracers** (Class Item)
   - Focus: Class-specific bonuses
   - Available Stats: Class Skill bonuses, Ability Stats, CDR, Energy
   - Cannot Roll: Generic weapon stats

**Weapon Slots & Exclusive Stats**
- **Weapon 1 & 2**: Primary/Secondary
- **Exclusive to Weapons**: 
  - Life Steal %
  - Life/Shield/Cooldown on Kill
  - Vampire effects (resource steal)
  - Flat elemental damage
  - Base weapon damage %

### Power Budget System

**Core Concept**: Total equipment strength is limited

**Formula**: Max Power = 100 + (Level × 20)
- Level 1: 120 Power
- Level 50: 1,100 Power
- Level 100: 2,100 Power

**Power Costs**
- Primary Attributes: 1 power per point
- Flat Health/Shield: 0.1 power per point
- Percentage Stats: 5 power per 1%
- Special Effects: 50-200 power each

**Rarity Efficiency** (Higher = Better)
- Common: ×1.3 cost (30% penalty)
- Uncommon: ×1.15 cost
- Rare: ×1.0 cost (baseline)
- Superior: ×0.9 cost
- Exotic: ×0.85 cost
- Legendary: ×0.8 cost
- Primal: ×0.75 cost (25% discount)

### Item Rarity System

1. **Common** (Gray)
   - 0-1 affixes
   - 60-70% stat efficiency
   - Power Cost: ×1.3 (30% penalty)

2. **Uncommon** (Green)
   - 1-2 affixes
   - 70-80% stat efficiency
   - Power Cost: ×1.15 (15% penalty)

3. **Rare** (Blue)
   - 2-3 affixes
   - 75-85% stat efficiency
   - Power Cost: ×1.0 (baseline)

4. **Superior** (Purple)
   - 3-4 affixes
   - 80-90% stat efficiency
   - Power Cost: ×0.9 (10% discount)

5. **Exotic** (Orange)
   - 4-5 affixes + unique effect
   - 85-95% stat efficiency
   - Power Cost: ×0.85 (15% discount)

6. **Legendary** (Red)
   - 5-6 affixes + powerful effect
   - 90-100% stat efficiency
   - Power Cost: ×0.8 (20% discount)

7. **Primal** (Cyan)
   - 6 affixes + enhanced effect
   - Always 100% perfect rolls
   - Power Cost: ×0.75 (25% discount)

### Stat Distribution on Items

**Primary Stat Allocation**
- Primary Attribute: 50-70% of power budget
- Secondary Attribute: 20-30% of power budget
- Tertiary Attribute: 10-20% of power budget (Epic+)

**Example Item Power Breakdown** (Level 50 Rare Chest, 200 Power Budget)
- +100 Vitality (100 power) - 50%
- +40 Fortitude (40 power) - 20%
- +300 Health (30 power) - 15%
- +10% Fire Resistance (30 power) - 15%

### Item Level Scaling

**Base Power Budget by Level**
- Level 1-10: 3-8 base budget
- Level 11-30: 8-32 base budget
- Level 31-60: 32-92 base budget
- Level 61-85: 92-177 base budget
- Level 86-100: 177-300 base budget

**Stat Ranges by Item Level**
- Attributes: 5-150 per stat
- Health/Shield: 50-500 flat
- Percentages: 5-30% per stat
- Resistances: 10-40% per element

### Elemental System Overview

**5 Elements** (Circle Order)
- Earth → Ice → Electricity → Fire → Nature → Earth
- Only neighboring elements can combine

**Elemental Combos**
- **Permafrost** (Earth + Ice): Instant shatter
- **Superconductor** (Ice + Electricity): Enhanced chains
- **Plasma Surge** (Electricity + Fire): Explosion on shocked burning
- **Wildfire** (Fire + Nature): Spreading toxic flames
- **Overgrowth** (Nature + Earth): Entangling roots

**Status Effects** (0-100% Buildup)
- **Ice → Frozen** (2s immobilize, 20% decay/sec)
- **Fire → Ignited** (4s DoT, 10% decay/sec)
- **Nature → Blighted** (6s spreading poison, 15% decay/sec)
- **Electricity → Overloaded** (2s explosion, 15% decay/sec)
- **Earth → Petrified** (1.5s stone, 5% decay/sec)

### Skill System Structure

**Active Abilities**
- 6 Slots Total:
  - 2 Basic (low cooldown)
  - 2 Core (main abilities)
  - 1 Defensive
  - 1 Ultimate
- Choose abilities from any 2 elemental trees
- Class-specific abilities available

**Passive Skill Tree**
- 500+ nodes shared by all classes
- Class-specific starting locations
- 140 skill points total at level 100
- Respec with Essence currency

**Elemental Skill Trees**
- 5 trees (one per element)
- 4 tiers each:
  - Tier 1 (0 points): 2 actives, 2 passives
  - Tier 2 (5 points): 2 actives, 5 passives
  - Tier 3 (10 points): 2 ultimates, combo unlocks
  - Tier 4 (15 points): Capstone passive

### Currency System

1. **Credits** - Basic purchases, vendor items
2. **Components** - Crafting materials
3. **Essences** - Respec skills/attributes
4. **Cores** - High-tier upgrades
5. **Marks** - Faction vendors
6. **Platinum** - Premium (tradeable between players)

### Crafting Overview

**Two Systems**
1. **Instant Crafting**
   - Consumables, mods, conversions
   - No wait time

2. **Blueprint Crafting**
   - Weapons, armor, special items
   - Real-time construction (continues offline)
   - 5 minutes to 72 hours based on rarity
   - Rush with Platinum

**Modular Weapons**
- **Ranged**: Receiver + Barrel + Stock + Magazine
- **Melee**: Blade + Handle + Power Source
- Must enhance to unlock full potential (+20% stats)

### Trading & Marketplace

**Market Types**
- Global Auction House
- Direct player trading
- Clan trading (reduced fees)
- Services exchange

**Trade Methods**
- Instant Buyout (5% fee)
- Auction (8% fee)
- Dutch Auction (6% fee)
- Reverse Auction (4% fee)
- Barter (2% fee)

**Restrictions**
- Level 10 minimum
- Daily limits = character level
- Platinum trading at level 20
- 48-hour cooldown on new Platinum

### Resistance & Difficulty

**Resistance Caps**
- Base: 0%
- Soft Cap: 75%
- Hard Cap: 90%

**Difficulty Penalties** (To Player Resistances)
- Normal (1-30): 0%
- Elite (31-50): -30%
- Nightmare (51-70): -60%
- Torment (71-85): -90%
- Apocalypse (86+): -120%

### Quick Build Guidelines

**Stat Priority by Build**
- **Glass Cannon**: Precision > Potency > Crit
- **Tank**: Vitality > Fortitude > Resistances
- **Speed**: Alacrity > Fire Rate > Movement
- **Caster**: Capacity > Potency > CDR
- **Elemental**: Potency > Status Buildup > Element Damage

**Power Budget Tips**
- Prioritize higher rarity for efficiency
- Balance offensive and defensive stats
- Leave room for future upgrades
- Consider set bonuses in total power

### Endgame Activities

1. **Difficulty Tiers** - Increasing resistance penalties
2. **Endless Missions** - Push builds to limits
3. **Daily Challenges** - Rotating content
4. **Seasonal Events** - Limited-time rewards
5. **8-Player Raids** - Coordinated challenges
6. **Boss Hunts** - Personalized legendary enemies

### Key Progression Milestones

- **Level 5**: Second weapon slot
- **Level 10**: Trading unlocked
- **Level 20**: All equipment slots, Platinum trading
- **Level 30**: Elite difficulty
- **Level 50**: Nightmare difficulty
- **Level 70**: Torment difficulty
- **Level 85**: Apocalypse difficulty
- **Level 100**: Paragon levels begin

### PvP Adjustments

- Status buildup capped at 50-70% from single source
- Effect durations reduced by 50%
- Decay rates doubled
- Damage caps prevent one-shots
- Immunity periods after status effects

---

## Quick Start Checklist

1. **Choose Class** based on preferred playstyle
2. **Pick 2 Elements** to specialize in
3. **Understand Power Budget** - it limits total gear strength
4. **Focus Attributes** - pick 2-3 to prioritize
5. **Learn Status Effects** - each element works differently
6. **Use Marketplace** - trading is key to progression
7. **Plan Build Path** - 140 skill points need planning
8. **Manage Currencies** - each has specific uses
9. **Craft Wisely** - time-based crafting continues offline
10. **Join a Clan** - many benefits for group play