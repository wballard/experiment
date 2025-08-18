# AUTOMATED MISSION SYSTEM DESIGN SPECIFICATION
**Version 2.0**
=====================================

## TABLE OF CONTENTS
-----------------
1. System Overview
2. Mission Types & Categories
3. Mission Parameters
4. Mission Affix System
5. Success Calculation System
6. Reward Distribution Tables
7. Mission Generation
8. Example Mission Flows
9. Integration with Loot System


## 1. SYSTEM OVERVIEW
=====================

The Automated Mission System allows players to send their characters on timed missions that generate rewards based on character power, mission difficulty, and RNG. This system provides progression when players are offline or engaged in other activities.

### Core Concepts
----------------
- **Passive Progression**: Characters earn rewards while on missions
- **Risk vs Reward**: Higher difficulty means better rewards but lower success chance
- **Build Validation**: Missions test character builds without active play
- **Resource Sink**: Missions cost resources to attempt
- **Affix Variety**: Weekly rotating modifiers keep content fresh

### Required References
----------------------
- **Unified Item & Weapon Statistics System v2.0** - For character power calculation
- **Loot Generation & Implementation Guide v1.0** - For reward generation
- **Game Systems Design Document v2.0** - For level and power progression
- **Mission Affix System Design Specification v1.0** - For mission modifiers


## 2. MISSION TYPES & CATEGORIES
================================

### Mission Categories
--------------------

#### 1. **Patrol Missions** (Short Duration)
- Duration: 5-30 minutes
- Focus: Quick resource gathering
- Rewards: Crafting materials, common gear
- Success Rate: High (70-95%)

#### 2. **Strike Missions** (Medium Duration)
- Duration: 1-4 hours
- Focus: Targeted objectives
- Rewards: Rare gear, experience, currencies
- Success Rate: Moderate (50-80%)

#### 3. **Raid Missions** (Long Duration)
- Duration: 6-12 hours
- Focus: Major objectives
- Rewards: Epic+ gear, unique materials
- Success Rate: Low (30-70%)

#### 4. **Expedition Missions** (Very Long Duration)
- Duration: 24-72 hours
- Focus: Exploration and discovery
- Rewards: Legendary+ gear, exclusive items
- Success Rate: Variable (20-60%)

### Mission Types
----------------

**Combat Missions**
- Eliminate Target
- Clear Area
- Defend Position
- Assault Stronghold

**Stealth Missions**
- Infiltration
- Reconnaissance
- Sabotage
- Extraction

**Support Missions**
- Resource Gathering
- Escort
- Delivery
- Rescue

**Specialist Missions**
- Elemental (requires specific damage type)
- Precision (requires high crit/weakspot)
- Tank (requires high defense)
- Speed (requires movement/reload stats)


## 3. MISSION PARAMETERS
========================

### Base Mission Structure
-------------------------
```json
{
  "mission_id": "strike_eliminate_alpha",
  "name": "Eliminate Alpha Target",
  "category": "strike",
  "type": "combat_eliminate",
  "duration_minutes": 180,
  "level_requirement": 50,
  "power_recommendation": 1100,
  "tier": 8,
  
  "difficulty_modifiers": {
    "enemy_level": 52,
    "enemy_density": 1.2,
    "elite_chance": 0.15,
    "boss_count": 1
  },
  
  "active_affixes": [
    {
      "id": "volcanic",
      "category": "environmental",
      "power_modifier": 1.15
    },
    {
      "id": "teleporting",
      "category": "enemy_modifier",
      "power_modifier": 1.20
    }
  ],
  
  "stat_requirements": {
    "primary": ["weapon_damage", "crit_chance"],
    "secondary": ["health", "resistances"],
    "beneficial": ["movement_speed", "reload_speed"]
  },
  
  "element_bonus": ["fire", "lightning"],
  
  "costs": {
    "energy": 100,
    "credits": 5000,
    "consumables": ["ammo_synth", "shield_battery"]
  }
}
```

### Difficulty Tiers
------------------
Each mission has 5 difficulty tiers that scale rewards and requirements:

| Tier | Level Offset | Power Multi | Success Modifier | Reward Multi |
|------|--------------|-------------|------------------|--------------|
| Normal | +0 | 1.0x | +20% | 1.0x |
| Hard | +3 | 1.15x | +0% | 1.5x |
| Heroic | +5 | 1.3x | -10% | 2.0x |
| Legendary | +8 | 1.5x | -20% | 3.0x |
| Mythic | +10 | 1.8x | -30% | 5.0x |

### Time Modifiers
-----------------
Players can modify mission duration for different results:

| Speed | Duration | Success Modifier | Reward Modifier |
|-------|----------|------------------|-----------------|
| Rushed | 0.5x | -15% | 0.8x |
| Quick | 0.75x | -5% | 0.9x |
| Standard | 1.0x | 0% | 1.0x |
| Careful | 1.5x | +10% | 1.1x |
| Thorough | 2.0x | +20% | 1.3x |


## 4. MISSION AFFIX SYSTEM
==========================

Missions can have rotating modifiers that fundamentally change how players must approach them. These affixes add variety and challenge while increasing rewards.

### Affix Application by Tier
----------------------------
| Mission Tier | Number of Affixes | Power Modifier |
|--------------|-------------------|----------------|
| 1-2 | 0-1 | +0-15% |
| 3-5 | 1-2 | +15-35% |
| 6-10 | 2-3 | +35-60% |
| 11-15 | 3-4 | +60-90% |
| 16+ | 4-5 + Keystone | +90-150% |

### Affix Categories
-------------------

#### Environmental Affixes
Modify the mission environment:
- **Volcanic**: Periodic damage zones spawn (15-45% health based on tier)
- **Frozen Ground**: 30% movement penalty in icy areas
- **Toxic Fog**: Poison damage except in safe zones
- **Lightning Storm**: Random strikes with stun potential
- **Void Zones**: Enemies leave damaging pools on death

#### Enemy Modifier Affixes
Enhance enemy capabilities:
- **Fortified**: +30% enemy health and damage
- **Vampiric**: Enemies heal from damage dealt
- **Shielded**: All enemies spawn with regenerating shields
- **Teleporting**: Enemies can teleport to player position
- **Vengeful**: Enemy deaths buff nearby allies

#### Player Modifier Affixes
Restrict player capabilities:
- **Attrition**: -50% healing effectiveness
- **Suppression**: +3 seconds to all cooldowns
- **Drought**: No health drops, reduced ammo
- **Exposed**: -30% to all resistances
- **Unstable**: 20% chance for abilities to misfire

#### Reward Modifier Affixes
Positive effects that increase rewards:
- **Bountiful**: +30% item drop rate
- **Wealthy**: +50% currency drops
- **Experienced**: +40% XP gains
- **Volatile**: Enemies drop helpful/harmful orbs
- **Treasure Seeker**: Guaranteed special enemy spawn

### Weekly Rotation
------------------
Affixes rotate on a weekly schedule, with 4 different combinations cycling:

**Week 1 - Elemental Chaos**: Volcanic, Fortified, Exposed, Bountiful
**Week 2 - Tactical Test**: Void Zones, Teleporting, Suppression, Experienced
**Week 3 - Endurance Trial**: Toxic Fog, Vampiric, Attrition, Wealthy
**Week 4 - Chaos Theory**: Lightning Storm, Vengeful, Unstable, Volatile

### Affix Impact on Success
--------------------------
Each affix modifies the base success calculation:
- Environmental: -5% success chance, +10-15% power requirement
- Enemy Modifier: -7% success chance, +15-20% power requirement
- Player Modifier: -8% success chance, +20-25% power requirement
- Reward Modifier: +2% success chance, -5% power requirement

### Build Synergy with Affixes
-----------------------------
Characters can gain bonus success chance if their build counters specific affixes:
- High movement speed helps with Volcanic/Void Zones (+5%)
- Shield builds counter Attrition (+5%)
- Elemental resistance helps with Exposed (+5%)
- Maximum bonus: +10% success chance


## 5. SUCCESS CALCULATION SYSTEM
================================

### Power Score Calculation
--------------------------
Based on the **Unified System**, calculate character's effective power:

```python
def calculate_character_power(character, mission):
    # Base power from level and gear
    base_power = character.level * 20
    gear_power = sum(item.power_cost for item in character.equipped_items)
    
    # Attribute bonuses for mission type
    primary_attrs = 0
    for attr in mission.stat_requirements["primary"]:
        primary_attrs += character.get_attribute_value(attr) * 2
    
    secondary_attrs = 0
    for attr in mission.stat_requirements["secondary"]:
        secondary_attrs += character.get_attribute_value(attr) * 1
    
    # Element match bonus
    element_bonus = 1.0
    for element in character.get_damage_elements():
        if element in mission.element_bonus:
            element_bonus = 1.25
            break
    
    # Affix synergy bonus
    affix_bonus = calculate_affix_synergy(character, mission.active_affixes)
    
    total_power = (base_power + gear_power + primary_attrs + secondary_attrs) * element_bonus * affix_bonus
    return total_power
```

### Success Chance Formula
------------------------
```python
def calculate_success_chance(character_power, mission_power, mission_modifiers, affixes):
    # Base success from power ratio
    power_ratio = character_power / mission_power
    
    if power_ratio >= 1.5:
        base_success = 0.95  # Cap at 95%
    elif power_ratio >= 1.0:
        base_success = 0.7 + (power_ratio - 1.0) * 0.5
    elif power_ratio >= 0.8:
        base_success = 0.5 + (power_ratio - 0.8) * 1.0
    else:
        base_success = max(0.1, power_ratio * 0.625)
    
    # Apply modifiers
    final_success = base_success
    final_success += mission_modifiers["difficulty_modifier"]
    final_success += mission_modifiers["time_modifier"]
    
    # Apply affix penalties/bonuses
    for affix in affixes:
        final_success += AFFIX_SUCCESS_MODIFIERS[affix.category]
    
    # Build synergy can offset affix penalties
    final_success += calculate_build_affix_synergy(character, affixes) * 0.1
    
    return min(0.95, max(0.05, final_success))  # 5-95% range
```

### Outcome Determination
-----------------------
```python
def determine_mission_outcome(success_chance):
    roll = random.random()
    
    if roll < success_chance * 0.1:
        return "critical_success"  # 10% of successes are critical
    elif roll < success_chance:
        return "success"
    elif roll < success_chance + 0.1:
        return "partial_success"  # Narrow band for partial
    else:
        return "failure"
```


## 6. REWARD DISTRIBUTION TABLES
================================

### Base Reward Structure
------------------------
Rewards scale with mission category, outcome, and active affixes:

#### Affix Reward Multipliers
| Affix Count | XP Multi | Currency Multi | Drop Multi |
|-------------|----------|----------------|------------|
| 0 | 1.0x | 1.0x | 1.0x |
| 1 | 1.2x | 1.2x | 1.15x |
| 2 | 1.5x | 1.5x | 1.35x |
| 3 | 1.8x | 1.8x | 1.6x |
| 4 | 2.2x | 2.2x | 2.0x |
| 5+ | 2.7x | 2.7x | 2.5x |

*Note: Reward modifier affixes stack multiplicatively with these bonuses*

#### Patrol Missions (5-30 min)
| Outcome | XP | Credits | Materials | Gear Drops |
|---------|-----|---------|-----------|------------|
| Critical | 200% | 200% | 3-5 | 1-2 (rare+) |
| Success | 100% | 100% | 2-3 | 0-1 (common+) |
| Partial | 50% | 50% | 1-2 | 0 |
| Failure | 25% | 0% | 0-1 | 0 |

#### Strike Missions (1-4 hours)
| Outcome | XP | Credits | Materials | Gear Drops |
|---------|-----|---------|-----------|------------|
| Critical | 200% | 200% | 5-8 | 2-3 (epic+) |
| Success | 100% | 100% | 3-5 | 1-2 (rare+) |
| Partial | 50% | 50% | 2-3 | 0-1 (common+) |
| Failure | 25% | 0% | 1 | 0 |

#### Raid Missions (6-12 hours)
| Outcome | XP | Credits | Materials | Gear Drops |
|---------|-----|---------|-----------|------------|
| Critical | 200% | 200% | 8-12 | 3-4 (legendary+) |
| Success | 100% | 100% | 5-8 | 2-3 (epic+) |
| Partial | 50% | 50% | 3-5 | 1 (rare+) |
| Failure | 25% | 0% | 1-2 | 0 |

#### Expedition Missions (24-72 hours)
| Outcome | XP | Credits | Materials | Gear Drops |
|---------|-----|---------|-----------|------------|
| Critical | 200% | 250% | 15-20 | 4-5 (mythic chance) |
| Success | 100% | 100% | 10-15 | 3-4 (legendary+) |
| Partial | 50% | 50% | 5-8 | 1-2 (epic+) |
| Failure | 25% | 0% | 2-3 | 0 |

### Loot Generation Integration
------------------------------
Using the **Loot Generation Guide**, create appropriate rewards:

```python
def generate_mission_loot(mission, outcome, character):
    loot_context = {
        "item_level": mission.level_requirement,
        "drop_source": f"mission_{mission.category}",
        "player_level": character.level,
        "difficulty_bonus": DIFFICULTY_LOOT_BONUS[mission.difficulty],
        "magic_find": character.get_magic_find() * 0.5,  # Reduced for passive
        "smart_loot_profile": analyze_player_build(character),
        "affix_bonus": calculate_affix_loot_bonus(mission.active_affixes)
    }
    
    # Determine number of drops (modified by affixes)
    base_drop_count = OUTCOME_DROP_COUNT[mission.category][outcome]
    affix_multiplier = 1.0
    for affix in mission.active_affixes:
        if affix.category == "reward_modifier":
            affix_multiplier *= REWARD_AFFIX_MULTIPLIERS[affix.id]
    
    drop_count = int(base_drop_count * affix_multiplier)
    drops = []
    
    for _ in range(drop_count):
        # Higher rarity floor for better outcomes and more affixes
        min_rarity = determine_minimum_rarity(outcome, mission.category, len(mission.active_affixes))
        
        item = generate_item_with_minimum_rarity(loot_context, min_rarity)
        drops.append(item)
    
    return drops
```

### Special Rewards
-----------------
Certain missions can drop unique rewards:

**Expedition Exclusive**
- Primal Essence (crafting mythic items)
- Exotic Components
- Unique Cosmetics

**Raid Exclusive**
- Raid Tokens (vendor currency)
- Enhancement Cores
- Class-specific mods

**Element-Specific Missions**
- Elemental Cores (enhance elemental damage)
- Status Effect Amplifiers
- Resistance Infusions


## 7. MISSION GENERATION
========================

### Daily Mission Rotation
------------------------
```python
def generate_daily_missions(player_level, current_week):
    missions = []
    weekly_affixes = WEEKLY_AFFIX_ROTATION[current_week]
    
    # Guaranteed mission types
    missions.append(generate_patrol_mission(player_level, "combat", tier=1))
    missions.append(generate_patrol_mission(player_level, "support", tier=2))
    missions.append(generate_strike_mission(player_level, "combat", tier=5, weekly_affixes[:2]))
    
    # Level-gated missions with appropriate affixes
    if player_level >= 30:
        missions.append(generate_strike_mission(player_level, "specialist", tier=7, weekly_affixes[:3]))
    
    if player_level >= 50:
        missions.append(generate_raid_mission(player_level, tier=10, weekly_affixes))
    
    if player_level >= 70:
        missions.append(generate_expedition_mission(player_level, tier=15, weekly_affixes))
    
    # Random additional missions
    for _ in range(3):
        tier = min(player_level // 5, 20)
        missions.append(generate_random_mission(player_level, tier, weekly_affixes))
    
    return missions
```

### Dynamic Mission Properties
----------------------------
```python
def generate_strike_mission(player_level, mission_type, tier, affixes):
    base_mission = MISSION_TEMPLATES[f"strike_{mission_type}"]
    
    mission = base_mission.copy()
    mission["id"] = generate_unique_id()
    mission["tier"] = tier
    mission["level_requirement"] = player_level - random.randint(5, 10)
    mission["power_recommendation"] = calculate_recommended_power(mission["level_requirement"])
    
    # Apply affixes based on tier
    num_affixes = determine_affix_count(tier)
    mission["active_affixes"] = select_mission_affixes(affixes, num_affixes, mission_type)
    
    # Adjust power requirement for affixes
    total_power_modifier = 1.0
    for affix in mission["active_affixes"]:
        total_power_modifier *= affix["power_modifier"]
    
    mission["power_recommendation"] = int(mission["power_recommendation"] * total_power_modifier)
    
    # Randomize modifiers
    mission["enemy_density"] *= random.uniform(0.8, 1.2)
    mission["elite_chance"] *= random.uniform(0.8, 1.5)
    
    # Random element affinity
    mission["element_bonus"] = random.sample(ELEMENTS, k=random.randint(1, 2))
    
    # Special conditions (10% chance)
    if random.random() < 0.1:
        mission["special_condition"] = random.choice([
            "low_gravity",  # +movement speed
            "high_alert",   # +enemy awareness
            "ammunition_shortage",  # -ammo reserves
            "shields_down",  # no shield regen
        ])
    
    return mission
```

### Affix Selection Logic
-----------------------
```python
def select_mission_affixes(weekly_pool, count, mission_type):
    selected = []
    categories_used = set()
    
    # Always include at least one reward modifier if available
    reward_affixes = [a for a in weekly_pool if a["category"] == "reward_modifier"]
    if reward_affixes and count > 0:
        selected.append(random.choice(reward_affixes))
        categories_used.add("reward_modifier")
        count -= 1
    
    # Fill remaining slots with challenge affixes
    challenge_affixes = [a for a in weekly_pool if a["category"] != "reward_modifier"]
    
    while count > 0 and challenge_affixes:
        affix = random.choice(challenge_affixes)
        
        # Avoid duplicate categories unless necessary
        if affix["category"] not in categories_used or len(challenge_affixes) <= count:
            selected.append(affix)
            categories_used.add(affix["category"])
            count -= 1
            
        challenge_affixes.remove(affix)
    
    return selected
```


## 8. EXAMPLE MISSION FLOWS
===========================

### Example 1: Strike Mission with Affixes
-----------------------------------------
```
Player: Level 55, Power 1250
Mission: "Eliminate Fallen Captain" (Strike, Level 52, Tier 8)
Active Affixes: Volcanic (Environmental), Teleporting (Enemy), Experienced (Reward)
Build: Fire-focused with high crit

1. Pre-Mission Check:
   - Base Power Requirement: 1100
   - Affix Power Modifier: 1.15 × 1.20 × 0.95 = 1.31
   - Adjusted Requirement: 1441
   - Character Power: 1250 < 1441 (87% of required)
   - Cost: 100 energy, 5000 credits ✓

2. Success Calculation:
   - Power Ratio: 1250/1441 = 0.87
   - Base Success: 58.4%
   - Environmental Affix: -5%
   - Enemy Affix: -7%
   - Reward Affix: +2%
   - Build Synergy (high mobility): +5%
   - Heroic Difficulty: -10%
   - Final Success: 43.4%

3. Mission Execution (3 hours):
   - Roll: 0.38 < 0.434 = SUCCESS

4. Rewards (with affix multipliers):
   - XP: 15,000 × 1.5 × 1.4 = 31,500
   - Credits: 25,000 × 1.5 = 37,500
   - Materials: 6x Weapon Parts, 4x Elemental Cores
   - Gear: 2x Epic items (increased from affixes)
```

### Example 2: High-Tier Expedition
----------------------------------
```
Player: Level 90, Power 2000
Mission: "Deep Space Anomaly" (Expedition, Level 85, Tier 18)
Active Affixes: Toxic Fog, Vampiric, Attrition, Vengeful, Volatile
Build: Balanced with all resistances

1. Pre-Mission Check:
   - Base Power Requirement: 1800
   - Affix Power Modifier: 1.15 × 1.20 × 1.25 × 1.18 × 0.95 = 1.93
   - Adjusted Requirement: 3474
   - Character Power: 2000 < 3474 (58% of required)
   - Duration: 48 hours (Careful mode = 1.5x)
   - Cost: 500 energy, 50000 credits, consumables ✓

2. Success Calculation:
   - Power Ratio: 2000/3474 = 0.58
   - Base Success: 23.75%
   - Environmental: -5%
   - Enemy Modifiers: -14% (2 affixes)
   - Player Modifier: -8%
   - Reward Modifier: +2%
   - Build Synergy (poison resist): +8%
   - Careful Time: +10%
   - Legendary Difficulty: -20%
   - Final Success: 21.75%

3. Mission Execution (48 hours):
   - Roll: 0.18 < 0.2175 = SUCCESS!

4. Rewards (massive affix bonuses):
   - XP: 100,000 × 2.7 = 270,000
   - Credits: 250,000 × 2.7 × 0.95 = 641,250
   - Materials: 25x Exotic Components, 20x Primal Essence
   - Gear: 5x Legendary+, 2x with guaranteed status effects
```

### Example 3: Weekly Push Mission
---------------------------------
```
Player: Level 100, Power 2100
Mission: "Citadel Siege" (Raid, Level 95, Tier 20)
Week 4 Affixes + Seasonal Keystone "Convergence"
Build: Lightning specialist

1. Pre-Mission Check:
   - Base Power Requirement: 2000
   - Affix Power Modifier: 2.45 (all affixes)
   - Adjusted Requirement: 4900
   - Character Power: 2100 (43% of required)
   - Push Week Bonus: +100% rewards active

2. Success Calculation:
   - Power Ratio: 0.43
   - Base Success: 26.9%
   - Total Affix Penalties: -35%
   - Keystone Challenge: -15%
   - Build Synergy (convergence beams): +10%
   - Push Week Boost: +5%
   - Final Success: 8.1% (Minimum is 5%)

3. Mission Execution (8 hours):
   - Roll: 0.07 < 0.081 = SUCCESS!!!

4. Rewards (push week double rewards):
   - XP: 50,000 × 2.7 × 2.0 = 270,000
   - Credits: 125,000 × 2.7 × 2.0 = 675,000
   - Materials: Guaranteed Mythic crafting set
   - Gear: 1x Primal item, 3x Mythic
   - Special: Leaderboard placement cosmetic
```


## 9. INTEGRATION WITH LOOT SYSTEM
==================================

### Smart Loot for Missions
-------------------------
Mission rewards should complement the player's build and consider active affixes:

```python
def adjust_mission_loot_weights(base_weights, character, mission):
    adjusted = base_weights.copy()
    
    # Boost stats that helped mission success
    for stat in mission.stat_requirements["primary"]:
        if stat in adjusted:
            adjusted[stat] *= 1.5
    
    # Boost element if it matched
    character_elements = character.get_damage_elements()
    for element in mission.element_bonus:
        if element in character_elements:
            adjusted[f"{element}_damage"] *= 1.3
            adjusted[f"{element}_damage_percent"] *= 1.3
    
    # Affix-specific loot adjustments
    for affix in mission.active_affixes:
        if affix.id == "volcanic":
            adjusted["fire_resistance"] *= 1.4
            adjusted["movement_speed"] *= 1.3
        elif affix.id == "attrition":
            adjusted["shield_capacity"] *= 1.5
            adjusted["shield_regen"] *= 1.5
        elif affix.id == "exposed":
            adjusted["all_resistance"] *= 1.6
    
    # Slightly boost defensive stats for failed missions
    if mission.outcome == "failure":
        adjusted["health"] *= 1.2
        adjusted["resistances"] *= 1.2
    
    return adjusted
```

### Mission-Specific Loot Tables
-------------------------------
Certain missions and affix combinations guarantee specific stat types:

**Precision Missions**
- Guaranteed: One item with crit chance or weakspot damage
- Increased weight: ADS speed, reload speed

**Tank Missions**
- Guaranteed: One item with health% or resistances
- Increased weight: Shield stats, damage reduction

**Elemental Missions**
- Guaranteed: One item with matching element damage
- Increased weight: Status effect stats

**Affix-Specific Guarantees**
- Volcanic missions: Higher chance for movement items
- Attrition missions: Guaranteed shield-focused item
- Vengeful missions: Items with on-kill effects

### Progression Integration
-------------------------
Missions provide steady progression between active play:

```python
def calculate_mission_efficiency():
    """
    Missions should provide ~60% of active play efficiency
    to reward engagement without replacing it.
    Affixes can push this to 80-90% for skilled players.
    """
    
    active_play_per_hour = {
        "xp": 50000,
        "credits": 100000,
        "legendary_chance": 0.02
    }
    
    base_mission_per_hour = {
        "xp": 30000,  # 60% of active
        "credits": 60000,  # 60% of active
        "legendary_chance": 0.012  # 60% of active
    }
    
    # Max affix bonus can reach 90% efficiency
    max_affix_mission = {
        "xp": 45000,  # 90% with perfect setup
        "credits": 90000,
        "legendary_chance": 0.018
    }
    
    return base_mission_per_hour, max_affix_mission
```

### Weekly Leaderboards
----------------------
Push weeks feature competitive elements:
- Fastest clear times by tier
- Most affixes completed successfully
- Highest tier cleared
- Special rewards for top performers

=====================================
**END OF SPECIFICATION**
Version 2.0
=====================================