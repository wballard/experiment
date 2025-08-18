# LOOT GENERATION & IMPLEMENTATION GUIDE
**Version 1.0**
=====================================

## TABLE OF CONTENTS
-----------------
1. Overview
2. Loot Generation Pipeline
3. Affix Rolling System
4. Rarity-Based Item Generation
5. Smart Loot System
6. Implementation Examples
7. Testing & Balancing Guidelines


## 1. OVERVIEW
==============

This document provides implementation guidelines for the loot generation system based on the **Unified Item & Weapon Statistics System v2.0**. It covers the technical implementation of item generation, affix rolling, and smart loot mechanics.

### Required References
----------------------
- **Unified Item & Weapon Statistics System v2.0** - Core stat definitions and distributions
- **Game Systems Design Document v2.0** - Attribute system and progression
- **Itemization Design Specification v1.0** - Item structure and power budgets

### Core Generation Principles
-----------------------------
1. Items generate with appropriate stats for their type (weapons offensive, armor defensive)
2. Rarity determines both quality and stat efficiency
3. Smart loot biases drops toward player's current build
4. Every item should feel potentially useful


## 2. LOOT GENERATION PIPELINE
==============================

### Step 1: Determine Drop Context
---------------------------------
```python
def determine_loot_context(enemy, player, difficulty):
    context = {
        "item_level": enemy.level + random.randint(-5, 5),
        "drop_source": enemy.type,  # boss, elite, trash
        "player_level": player.level,
        "difficulty_bonus": DIFFICULTY_RARITY_BONUS[difficulty],
        "magic_find": player.get_magic_find(),
        "smart_loot_profile": analyze_player_build(player)
    }
    return context
```

### Step 2: Roll Item Type
-------------------------
Based on the **Unified System** slot distribution:

```python
WEAPON_DROP_CHANCE = 0.35  # 35% weapons, 65% armor

def roll_item_type(context):
    if random.random() < WEAPON_DROP_CHANCE:
        return roll_weapon_type(context)
    else:
        return roll_armor_slot(context)

def roll_armor_slot(context):
    # Equal weight for all armor slots
    slots = ["head", "shoulders", "back", "chest", 
             "gloves", "legs", "bracers"]
    return random.choice(slots)
```

### Step 3: Determine Rarity
---------------------------
```python
def roll_rarity(context):
    base_weights = {
        "common": 60,
        "uncommon": 25,
        "rare": 10,
        "epic": 4,
        "legendary": 0.9,
        "mythic": 0.09,
        "primal": 0.01
    }
    
    # Apply modifiers
    for rarity, weight in base_weights.items():
        base_weights[rarity] *= context["difficulty_bonus"]
        base_weights[rarity] *= (1 + context["magic_find"] / 100)
    
    return weighted_choice(base_weights)
```

### Step 4: Generate Base Item
-----------------------------
For weapons, use the **Core Weapon Statistics** from the Unified System:

```python
def generate_weapon_base(weapon_type, item_level, quality):
    # Reference Core Weapon Statistics table
    base_stats = WEAPON_BASE_STATS[weapon_type].copy()
    
    # Scale with item level
    scaling_factor = 1 + (item_level / 50)
    base_stats["damage"] *= scaling_factor
    
    # Apply quality within range
    for stat, value in base_stats.items():
        if hasattr(value, "min") and hasattr(value, "max"):
            range_size = value.max - value.min
            base_stats[stat] = value.min + (range_size * quality / 100)
    
    return base_stats
```


## 3. AFFIX ROLLING SYSTEM
==========================

### Rarity-Based Affix Count
---------------------------
From the **Unified System**:
- Common: 0-1 affixes
- Uncommon: 1-2 affixes
- Rare: 2-3 affixes
- Epic: 3-4 affixes
- Legendary: 4-5 affixes
- Mythic: 5-6 affixes
- Primal: 6 affixes (perfect rolls)

### Weighted Affix Selection
---------------------------
Using the rarity weights from the **Unified System Appendix**:

```python
def build_affix_pool(item_type, slot):
    pool = []
    
    # Reference the stat distribution table
    available_stats = get_available_stats_for_slot(slot)
    
    for stat in available_stats:
        weight = get_rarity_weight(stat.rarity)
        pool.append({
            "stat": stat,
            "weight": weight,
            "tier": calculate_tier(item_level)
        })
    
    return pool

def get_rarity_weight(rarity):
    # From Unified System
    weights = {
        1: 50, 2: 50,  # Very Common
        3: 30, 4: 30,  # Common
        5: 15, 6: 15,  # Uncommon
        7: 4, 8: 4,    # Rare
        9: 1, 10: 1    # Very Rare
    }
    return weights.get(rarity, 1)
```

### Smart Affix Conflicts
-----------------------
Prevent invalid combinations based on the **Unified System** rules:

```python
AFFIX_CONFLICTS = {
    "health_percent": ["shield_percent"],
    "movement_speed": ["sprint_speed", "slide_speed"],  # Only on legs
    "all_resistance": ["fire_resistance", "ice_resistance"],  # Don't double up
}

def is_valid_affix_combination(existing_affixes, new_affix):
    # Check slot restrictions
    if not is_valid_for_slot(new_affix, item.slot):
        return False
    
    # Check conflicts
    for existing in existing_affixes:
        if existing in AFFIX_CONFLICTS.get(new_affix, []):
            return False
    
    return True
```


## 4. RARITY-BASED ITEM GENERATION
==================================

### Quality Ranges by Rarity
--------------------------
From the **Unified System**:

```python
QUALITY_RANGES = {
    "common": (60, 70),
    "uncommon": (70, 80),
    "rare": (75, 85),
    "epic": (80, 90),
    "legendary": (85, 95),
    "mythic": (90, 100),
    "primal": (100, 100)  # Always perfect
}

def roll_stat_value(stat, rarity, item_level):
    min_val, max_val = get_stat_range(stat, item_level)
    quality_min, quality_max = QUALITY_RANGES[rarity]
    
    # Roll within quality range
    quality = random.uniform(quality_min, quality_max)
    value = min_val + (max_val - min_val) * quality / 100
    
    return round_appropriately(value, stat.type)
```

### Power Budget Validation
-------------------------
Ensure items don't exceed power budget from the **Unified System**:

```python
def calculate_item_power(item):
    total_power = 0
    
    # Attributes
    for attr in item.attributes:
        total_power += attr.value * 1  # 1 power per attribute point
    
    # Percentage stats
    for affix in item.affixes:
        if affix.type == "percentage":
            total_power += affix.value * 5  # 5 power per 1%
        elif affix.type == "flat":
            total_power += affix.value * FLAT_POWER_COSTS[affix.stat]
    
    # Apply rarity efficiency
    efficiency = RARITY_EFFICIENCY[item.rarity]
    total_power *= efficiency
    
    return total_power
```


## 5. SMART LOOT SYSTEM
=======================

### Build Analysis
-----------------
Detect player's build based on current gear and attributes:

```python
def analyze_player_build(player):
    profile = {
        "primary_attributes": [],
        "damage_types": [],
        "preferred_stats": []
    }
    
    # Find highest attributes
    attrs = player.get_total_attributes()
    sorted_attrs = sorted(attrs.items(), key=lambda x: x[1], reverse=True)
    profile["primary_attributes"] = [sorted_attrs[0][0], sorted_attrs[1][0]]
    
    # Detect damage types
    for item in player.equipped_items:
        for affix in item.affixes:
            if "elemental_damage" in affix.type:
                profile["damage_types"].append(affix.element)
    
    return profile
```

### Weighted Drop Generation
--------------------------
Bias drops toward useful stats:

```python
def apply_smart_loot(affix_pool, player_profile):
    for affix in affix_pool:
        # Boost primary attributes
        if affix.stat in player_profile["primary_attributes"]:
            affix.weight *= 1.5
        
        # Boost matching damage types
        if hasattr(affix, "element") and affix.element in player_profile["damage_types"]:
            affix.weight *= 1.3
        
        # Slightly reduce completely off-build stats
        if is_opposite_build_stat(affix, player_profile):
            affix.weight *= 0.7
    
    return affix_pool
```


## 6. IMPLEMENTATION EXAMPLES
=============================

### Example: Generating a Legendary Assault Rifle
-----------------------------------------------
```python
def generate_legendary_assault_rifle(level=50):
    # Step 1: Base weapon
    weapon = {
        "type": "assault_rifle",
        "level": level,
        "rarity": "legendary",
        "quality": random.uniform(85, 95)
    }
    
    # Step 2: Core stats from Unified System
    weapon["damage"] = 55 * (1 + level/50) * (weapon["quality"]/100)
    weapon["fire_rate"] = 600
    weapon["magazine"] = 30
    weapon["range"] = 45
    
    # Step 3: Roll 4-5 affixes
    affix_count = random.randint(4, 5)
    affix_pool = build_affix_pool("weapon", "assault_rifle")
    
    weapon["affixes"] = []
    for i in range(affix_count):
        affix = weighted_choice(affix_pool)
        value = roll_stat_value(affix, "legendary", level)
        weapon["affixes"].append({
            "stat": affix.name,
            "value": value
        })
        
        # Remove to prevent duplicates
        affix_pool.remove(affix)
    
    # Step 4: Add legendary effect
    weapon["effect"] = random.choice(ASSAULT_RIFLE_LEGENDARY_EFFECTS)
    
    return weapon
```

### Example: Generating Smart Loot Gloves
----------------------------------------
```python
def generate_smart_gloves(player, level=50):
    profile = analyze_player_build(player)
    
    gloves = {
        "slot": "gloves",
        "level": level,
        "rarity": roll_rarity({"magic_find": player.magic_find})
    }
    
    # Build affix pool with smart weights
    pool = build_affix_pool("armor", "gloves")
    pool = apply_smart_loot(pool, profile)
    
    # Gloves focus on weapon performance
    # Boost weapon-related stats
    for affix in pool:
        if affix.stat in ["reload_speed", "weapon_damage", "crit_damage"]:
            affix.weight *= 1.2
    
    # Generate affixes...
    # (rest of generation)
```


## 7. TESTING & BALANCING GUIDELINES
====================================

### Drop Rate Validation
-----------------------
Test that actual drop rates match design targets:

```python
def validate_drop_rates(num_simulations=10000):
    results = defaultdict(int)
    
    for _ in range(num_simulations):
        item = generate_random_item(level=50)
        results[item.rarity] += 1
    
    print("Drop Rate Analysis:")
    for rarity, count in results.items():
        actual = (count / num_simulations) * 100
        expected = BASE_DROP_RATES[rarity]
        print(f"{rarity}: {actual:.2f}% (expected {expected}%)")
```

### Stat Distribution Analysis
----------------------------
Ensure stats appear at expected frequencies:

```python
def analyze_stat_distribution(num_items=1000):
    stat_counts = defaultdict(int)
    
    for _ in range(num_items):
        chest = generate_item("armor", "chest", level=50)
        for affix in chest.affixes:
            stat_counts[affix.stat] += 1
    
    # Compare to expected based on rarity weights
    print("Stat Frequency Analysis (Chest):")
    for stat, count in sorted(stat_counts.items(), key=lambda x: x[1], reverse=True):
        frequency = (count / num_items) * 100
        expected_weight = get_rarity_weight(STAT_RARITIES[stat])
        print(f"{stat}: {frequency:.1f}% (weight {expected_weight})")
```

### Power Budget Verification
---------------------------
Ensure items stay within power limits:

```python
def verify_power_budgets(num_tests=1000):
    violations = 0
    
    for level in [20, 50, 80, 100]:
        for _ in range(num_tests // 4):
            item = generate_random_item(level=level)
            power = calculate_item_power(item)
            max_power = 100 + (level * 20)
            
            if power > max_power:
                violations += 1
                print(f"Power violation: {item.name} - {power}/{max_power}")
    
    print(f"Total violations: {violations}/{num_tests} ({violations/num_tests*100:.1f}%)")
```

### Build Diversity Testing
-------------------------
Ensure different builds can find appropriate gear:

```python
def test_build_diversity():
    builds = [
        {"primary": ["focus", "force"], "elements": ["fire"]},
        {"primary": ["vigor", "bulwark"], "elements": []},
        {"primary": ["momentum", "resonance"], "elements": ["ice", "lightning"]}
    ]
    
    for build in builds:
        player = create_test_player(build)
        relevant_items = 0
        
        for _ in range(100):
            item = generate_smart_item(player)
            if is_relevant_to_build(item, build):
                relevant_items += 1
        
        print(f"Build {build['primary']}: {relevant_items}% relevant items")
```

=====================================
**END OF GUIDE**
Version 1.0
=====================================