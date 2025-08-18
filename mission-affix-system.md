# MISSION AFFIX SYSTEM DESIGN SPECIFICATION
**Version 1.0**
=====================================

## TABLE OF CONTENTS
-----------------
1. System Overview
2. Affix Categories
3. Environmental Affixes
4. Enemy Modifier Affixes
5. Player Modifier Affixes
6. Reward Modifier Affixes
7. Affix Scaling System
8. Weekly Rotation System
9. Integration with Mission System
10. Example Affix Combinations


## 1. SYSTEM OVERVIEW
=====================

The Mission Affix System adds rotating modifiers to missions that fundamentally change how players approach content. Inspired by WoW's Mythic+, Diablo 4's Nightmare Dungeons, and Path of Exile 2's mapping system, this creates endless variety from the same mission content.

### Core Design Principles
-------------------------
- **Readable Complexity**: Affixes should be immediately understandable
- **Build Diversity**: Different affixes favor different builds/strategies
- **Risk/Reward**: More affixes = better rewards but harder content
- **Weekly Variety**: Rotating affixes keep content fresh
- **Player Agency**: Choose which affixes to engage with

### Affix Application Rules
--------------------------
- **Tier 1-2 Missions**: 0-1 affixes
- **Tier 3-5 Missions**: 1-2 affixes  
- **Tier 6-10 Missions**: 2-3 affixes
- **Tier 11-15 Missions**: 3-4 affixes
- **Tier 16+**: 4-5 affixes + Keystone affix

### References from Other Games
-------------------------------
- **WoW Mythic+**: Weekly rotation, keystone levels, death penalties
- **Diablo 4**: Positive/negative balance, element-specific challenges
- **Path of Exile 2**: Craftable difficulty, reward scaling with modifiers


## 2. AFFIX CATEGORIES
======================

### Environmental Affixes
------------------------
Modify the battlefield itself, creating positional challenges.

### Enemy Modifier Affixes
--------------------------
Change how enemies behave, their stats, or add new mechanics.

### Player Modifier Affixes
---------------------------
Affect player capabilities, often creating build challenges.

### Reward Modifier Affixes
---------------------------
Positive affixes that increase rewards for tackling harder content.

### Keystone Affixes
--------------------
Major affixes that fundamentally change gameplay (Tier 16+ only).


## 3. ENVIRONMENTAL AFFIXES
============================

These affixes create hazards and modify the battlefield, forcing movement and positioning.

### **Volcanic**
- **Effect**: Every 5 seconds, 3-5 volcanic plumes spawn under players
- **Damage**: 15% of player health over 2 seconds
- **Counterplay**: Constant movement, positioning awareness
- **Favors**: Mobile builds, ranged combat

### **Frozen Ground**
- **Effect**: 30% of ground becomes icy, causing 20% movement penalty
- **Special**: Ice patches spread when players stand still
- **Counterplay**: Movement abilities, slide mechanics
- **Favors**: Momentum builds, slide-focused gameplay

### **Void Zones**
- **Effect**: Defeated enemies leave void pools for 30 seconds
- **Damage**: 5% health per second while standing in pools
- **Size**: Scales with enemy rank (elites leave larger pools)
- **Favors**: Ranged builds, careful positioning

### **Lightning Storm**
- **Effect**: Lightning strikes random locations every 2-3 seconds
- **Damage**: 25% health + 1 second stun
- **Warning**: 1.5 second visual telegraph
- **Favors**: High mobility, stun resistance

### **Toxic Fog**
- **Effect**: Map fills with poison fog except near "clean air" zones
- **Damage**: 2% health per second + 50% healing reduction
- **Clean Zones**: Rotate every 45 seconds
- **Favors**: High health regen, poison resistance builds

### **Gravitational Anomalies**
- **Effect**: Spinning gravity wells that pull players in
- **Mechanic**: 3-5 active at once, slow pull increasing over time
- **Damage**: 30% health if pulled to center
- **Favors**: High movement speed, dash abilities

### **Burning Ground**
- **Effect**: Enemies killed by fire damage leave burning patches
- **Duration**: 20 seconds
- **Damage**: 10% health per second + ignite buildup
- **Favors**: Non-fire builds, careful kill positioning

### **Temporal Rifts**
- **Effect**: Blue rifts slow projectiles and abilities by 50%
- **Coverage**: 20% of battlefield in shifting patterns
- **Additional**: Enemies in rifts gain 30% attack speed
- **Favors**: Hitscan weapons, melee builds


## 4. ENEMY MODIFIER AFFIXES
=============================

These affixes enhance enemy capabilities or add new mechanics to all enemies.

### **Fortified**
- **Effect**: +30% enemy health, +20% enemy damage
- **Special**: Non-boss enemies gain damage reduction
- **Note**: Similar to WoW's Fortified but less extreme
- **Challenge**: Longer time-to-kill, resource management

### **Raging**
- **Effect**: Enemies below 30% health gain 100% attack speed
- **Visual**: Red aura and increased size
- **Counterplay**: Burst damage to skip rage phase
- **Challenge**: Execute phase on every enemy

### **Vampiric**
- **Effect**: Enemies heal for 20% of damage dealt
- **Special**: Healing creates visible life drain effect
- **Counterplay**: Burst damage, healing reduction
- **Challenge**: Sustained DPS checks

### **Shielded**
- **Effect**: All enemies spawn with 50% health as shields
- **Shield Properties**: Regenerates if not damaged for 3 seconds
- **Counterplay**: Consistent damage, shield-breaking weapons
- **Favors**: Lightning damage, sustained fire

### **Vengeful**
- **Effect**: Enemy deaths empower nearby enemies
- **Buff**: +10% damage and speed per dead ally (stacks to 50%)
- **Range**: 20 meters
- **Counterplay**: Isolated kills, AoE damage

### **Teleporting**
- **Effect**: Enemies teleport to players after 3 seconds of combat
- **Cooldown**: 8 seconds per enemy
- **Visual**: Purple flash before teleport
- **Challenge**: Constant repositioning needed

### **Reflective**
- **Effect**: 15% of player damage reflected as matching element
- **Mitigation**: Matching resistance reduces reflection
- **Visual**: Mirror-like shimmer on enemies
- **Favors**: Mixed damage types, high resistance

### **Sanguine**
- **Effect**: Enemies leave healing pools on death
- **Heal Rate**: 5% per second for enemies in pool
- **Duration**: 20 seconds
- **Counterplay**: Pull enemies away, destroy pools


## 5. PLAYER MODIFIER AFFIXES
==============================

These affixes restrict or modify player capabilities, creating build challenges.

### **Attrition**
- **Effect**: -50% healing from all sources
- **Includes**: Potions, life steal, regeneration
- **Exception**: Shield regeneration unaffected
- **Favors**: Shield-focused builds, damage avoidance

### **Drought**
- **Effect**: No health drops, -75% ammo drops
- **Compensation**: +25% other loot to maintain rewards
- **Challenge**: Resource conservation vital
- **Favors**: Efficient builds, melee weapons

### **Suppression**
- **Effect**: +3 seconds to all ability cooldowns
- **Stacks**: With other CDR penalties
- **Challenge**: Ability rotation disruption
- **Favors**: Weapon-focused builds

### **Vulnerable**
- **Effect**: Critical strikes against players deal +50% damage
- **Additional**: Weakspot hits stun for 0.5 seconds
- **Challenge**: Positioning becomes critical
- **Favors**: High armor, damage reduction

### **Cursed**
- **Effect**: Random debuff every 30 seconds
- **Debuffs**: Slow, weakness, confusion, fragility
- **Duration**: 10 seconds each
- **Counterplay**: Cleanse abilities, debuff resistance

### **Exposed**
- **Effect**: -30% to all resistances
- **Stacks**: With difficulty penalties
- **Challenge**: Elemental damage becomes lethal
- **Requires**: Resistance gear optimization

### **Unstable**
- **Effect**: Abilities have 20% chance to misfire
- **Misfire**: 2 second cooldown, no effect
- **Affects**: All non-weapon abilities
- **Favors**: Weapon-focused gameplay

### **Bleeding**
- **Effect**: All damage causes bleed (2% health over 3 seconds)
- **Stacks**: Up to 10 times
- **Counterplay**: Bleed resistance, healing
- **Challenge**: Constant health pressure


## 6. REWARD MODIFIER AFFIXES
==============================

Positive affixes that increase rewards, inspired by Diablo 4's system.

### **Bountiful**
- **Effect**: +30% item drop rate
- **Special**: Guaranteed rare+ drop from elites
- **Stacks**: Multiplicatively with other bonuses
- **Value**: High for gear farming

### **Wealthy**
- **Effect**: +50% currency drops
- **Special**: Enemies occasionally explode in credits
- **Visual**: Golden sparkle on affected enemies
- **Value**: Best for resource farming

### **Experienced**
- **Effect**: +40% XP from all sources
- **Special**: Elite kills grant XP burst to party
- **Range**: 30 meters for burst
- **Value**: Ideal for leveling

### **Volatile**
- **Effect**: 20% chance for enemies to drop explosive orbs
- **Orb Effect**: Damage enemies or heal players
- **Choice**: Risk/reward on pickup
- **Value**: Speeds up clear time

### **Treasure Seeker**
- **Effect**: One guaranteed treasure goblin spawn
- **Goblin Type**: Random (loot, currency, materials)
- **Challenge**: Goblin tries to escape
- **Value**: Chance at rare rewards

### **Empowered**
- **Effect**: +25% to all player damage
- **Condition**: After 30 seconds in mission
- **Visual**: Growing power aura
- **Value**: Helps meet DPS checks


## 7. AFFIX SCALING SYSTEM
===========================

### Tier Scaling
---------------
Affixes become more punishing at higher tiers:

| Tier Range | Scaling Factor | Example: Volcanic Damage |
|------------|----------------|-------------------------|
| 1-5 | 1.0x | 15% health |
| 6-10 | 1.5x | 22% health |
| 11-15 | 2.0x | 30% health |
| 16-20 | 2.5x | 37% health |
| 21+ | 3.0x | 45% health |

### Affix Interaction Rules
--------------------------
1. **Stacking**: Same category affixes don't stack (max 1 environmental, etc.)
2. **Synergy**: Some affixes amplify others (Volcanic + Sanguine = dangerous)
3. **Conflicts**: System prevents impossible combinations
4. **Weighting**: Higher tiers favor harder affixes

### Power Budget per Affix
-------------------------
Each affix adds to mission power requirement:
- **Environmental**: +10-15% power requirement
- **Enemy Modifier**: +15-20% power requirement
- **Player Modifier**: +20-25% power requirement
- **Reward Modifier**: -5% power requirement (incentive)
- **Keystone**: +30% power requirement


## 8. WEEKLY ROTATION SYSTEM
=============================

### Rotation Schedule
--------------------
Inspired by WoW's Mythic+ system with our own twist:

**Week 1: Elemental Chaos**
- Volcanic
- Fortified
- Exposed
- Bountiful

**Week 2: Tactical Nightmare**
- Void Zones
- Teleporting
- Suppression
- Experienced

**Week 3: Endurance Test**
- Toxic Fog
- Vampiric
- Attrition
- Wealthy

**Week 4: Chaos Theory**
- Temporal Rifts
- Vengeful
- Unstable
- Volatile

### Seasonal Keystone Affixes
-----------------------------
One major affix active for entire season (3 months):

**Season 1 - "Convergence"**
- Elemental damage creates crossing beams between enemies
- Crossing beams explode for massive damage
- Forces spread positioning

**Season 2 - "Hivemind"**
- All enemies share 25% of damage taken
- Healing spreads similarly
- AoE becomes incredibly powerful

**Season 3 - "Cascade"**
- Every 10th enemy killed triggers screen-wide effect
- Effect based on killing blow element
- Rewards consistent pace

### Push Weeks
-------------
Every 4th week is "Push Week" with special rules:
- +100% rewards from affixed missions
- Leaderboards active for fastest clears
- Special cosmetic rewards for participation


## 9. INTEGRATION WITH MISSION SYSTEM
=====================================

### Mission Selection UI
-----------------------
```
═══════════════════════════════════════════
STRIKE MISSION: Eliminate Fallen Captain
Level 52 | Tier 8 | Duration: 3 hours
═══════════════════════════════════════════

ACTIVE AFFIXES (Week 2):
⚡ Void Zones - Enemies leave damaging pools
👹 Teleporting - Enemies blink to your location  
🚫 Suppression - +3s to ability cooldowns
✨ Experienced - +40% XP gained

POWER REQUIREMENT: 1,450 (+45% from affixes)
Your Power: 1,250 (86% - CHALLENGING)

Success Chance: 62%
Rewards: +65% from affixes
═══════════════════════════════════════════
```

### Affix Impact on Success
--------------------------
Each affix modifies base success calculation:
- Environmental: -5% success chance
- Enemy Modifier: -7% success chance
- Player Modifier: -8% success chance
- Reward Modifier: +2% success chance
- Build Match: Up to +10% if build counters affixes

### Crafting Affix Resistance
----------------------------
New consumables can provide affix resistance:
- **Stability Serum**: -50% knockback from Volcanic
- **Cleansing Salve**: Removes one stack of Bleeding
- **Grounding Boots**: Immune to one Gravitational pull
- **Temporal Anchor**: Reduces Temporal Rift slow by 50%

Limited uses encourage strategic planning.


## 10. EXAMPLE AFFIX COMBINATIONS
=================================

### Beginner Friendly (Tier 3)
-----------------------------
**Affixes**: Fortified + Bountiful
- Enemies are tougher but drop more loot
- Simple to understand, no complex mechanics
- Good for learning affix system

### Positioning Challenge (Tier 8)
---------------------------------
**Affixes**: Volcanic + Void Zones + Experienced
- Constant movement required
- Death pools limit safe spaces
- High XP rewards for mastery

### Build Check (Tier 12)
------------------------
**Affixes**: Shielded + Suppression + Drought + Wealthy
- Tests sustained damage without abilities
- Resource management critical
- Currency rewards for succeeding

### Nightmare Mode (Tier 18)
---------------------------
**Affixes**: Toxic Fog + Teleporting + Attrition + Vengeful + Volatile
- Multiple overlapping challenges
- Requires perfect play and build
- Massive rewards for completion

### Seasonal Special (Tier 20+)
------------------------------
**Affixes**: All weekly + Convergence (Keystone)
- Maximum possible difficulty
- Requires full team coordination
- Exclusive rewards and leaderboard placement

=====================================
**END OF SPECIFICATION**
Version 1.0
=====================================