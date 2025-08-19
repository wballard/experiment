# COURIER - TECHNICAL IMPLEMENTATION
**Core Formulas & System Integration**

---

## IMPLEMENTATION PHILOSOPHY

This document provides the technical foundation for implementing Courier's core systems. All formulas, validation rules, and integration points are designed to maintain game balance while providing clear, predictable behavior for both players and developers.

**Core Principles**:
- **Deterministic Systems**: Predictable outcomes from player choices
- **Scalable Formulas**: Systems that remain balanced across all content levels
- **Validation Gates**: Prevent exploits and maintain system integrity
- **Performance Optimization**: Efficient calculations for real-time gameplay

---

## POWER BUDGET SYSTEM IMPLEMENTATION

### Core Calculation Formula
```python
def calculate_total_power_budget(character_level, paragon_level):
    """
    Calculate character's total available power budget
    
    Args:
        character_level: Integer 1-60
        paragon_level: Integer 0+ (infinite)
    
    Returns:
        Integer representing total power budget
    """
    base_budget = 100
    level_budget = character_level * 20
    paragon_budget = paragon_level  # 1 per paragon level
    
    return base_budget + level_budget + paragon_budget

# Examples:
# Level 1, 0 Paragon: 100 + 20 + 0 = 120
# Level 60, 0 Paragon: 100 + 1200 + 0 = 1,300
# Level 60, 50 Paragon: 100 + 1200 + 50 = 1,350
```

### Item Power Cost Calculation
```python
def calculate_item_power_cost(item):
    """
    Calculate total power cost for an equipped item
    
    Args:
        item: Dictionary containing item stats and rarity
    
    Returns:
        Float representing adjusted power cost
    """
    base_power = 0
    
    # Attribute costs (1 power per point)
    for attribute in item.get('attributes', {}):
        base_power += item['attributes'][attribute]
    
    # Flat stat costs (varies by stat type)
    flat_costs = {
        'health': 0.1,      # 0.1 power per point
        'shield': 0.15,     # 0.15 power per point
        'armor': 0.2,       # 0.2 power per point
        'elemental_damage': 0.2  # 0.2 power per point
    }
    
    for stat in item.get('flat_stats', {}):
        cost_per_point = flat_costs.get(stat, 1.0)
        base_power += item['flat_stats'][stat] * cost_per_point
    
    # Percentage stat costs (5 power per 1%)
    for stat in item.get('percentage_stats', {}):
        base_power += item['percentage_stats'][stat] * 5
    
    # Special effect costs (fixed by effect)
    special_effects = {
        'life_on_kill': 25,
        'shield_on_kill': 20,
        'cooldown_on_crit': 50,
        'legendary_effect': 100
    }
    
    for effect in item.get('special_effects', []):
        base_power += special_effects.get(effect, 50)
    
    # Apply rarity efficiency multiplier
    rarity_multipliers = {
        'common': 1.3,      # 30% penalty
        'uncommon': 1.15,   # 15% penalty
        'rare': 1.0,        # Baseline
        'epic': 0.9,        # 10% discount
        'legendary': 0.8,   # 20% discount
        'mythic': 0.8,      # 20% discount
        'primal': 0.75      # 25% discount
    }
    
    rarity = item.get('rarity', 'common')
    multiplier = rarity_multipliers[rarity]
    
    return base_power * multiplier
```

### Power Budget Validation
```python
def validate_equipment_loadout(character):
    """
    Ensure character's equipped items don't exceed power budget
    
    Args:
        character: Character object with level and equipped items
    
    Returns:
        Tuple (is_valid: bool, used_power: float, available_power: int)
    """
    total_budget = calculate_total_power_budget(
        character.level, 
        character.paragon_level
    )
    
    used_power = 0
    for item in character.equipped_items:
        if item is not None:
            used_power += calculate_item_power_cost(item)
    
    is_valid = used_power <= total_budget
    
    return is_valid, used_power, total_budget

def enforce_power_budget(character, new_item, slot):
    """
    Check if equipping new item would violate power budget
    
    Args:
        character: Character object
        new_item: Item to potentially equip
        slot: Equipment slot for the item
    
    Returns:
        bool: True if item can be equipped, False otherwise
    """
    # Calculate power cost of new loadout
    temp_character = character.copy()
    temp_character.equipped_items[slot] = new_item
    
    is_valid, used_power, total_budget = validate_equipment_loadout(temp_character)
    
    return is_valid
```

---

## ELEMENTAL SYSTEM IMPLEMENTATION

### Status Buildup Calculation
```python
def calculate_status_buildup(elemental_damage, enemy_max_hp, existing_buildup):
    """
    Calculate status effect buildup from elemental damage
    
    Args:
        elemental_damage: Float, damage dealt after all modifiers
        enemy_max_hp: Float, enemy's maximum health
        existing_buildup: Float, current buildup percentage (0-100)
    
    Returns:
        Float: New buildup percentage (capped at 100)
    """
    # Core formula: (Damage / Max HP) * 100
    buildup_increase = (elemental_damage / enemy_max_hp) * 100
    
    new_buildup = existing_buildup + buildup_increase
    
    # Cap at 100%
    return min(new_buildup, 100.0)

def apply_status_decay(current_buildup, element_type, time_delta):
    """
    Apply decay to status buildup over time
    
    Args:
        current_buildup: Float, current buildup percentage
        element_type: String, element name
        time_delta: Float, seconds since last update
    
    Returns:
        Float: New buildup after decay
    """
    decay_rates = {
        'earth': 5.0,       # 5% per second (slowest)
        'fire': 10.0,       # 10% per second
        'electric': 15.0,   # 15% per second
        'nature': 15.0,     # 15% per second
        'ice': 20.0         # 20% per second (fastest)
    }
    
    decay_per_second = decay_rates.get(element_type, 10.0)
    decay_amount = decay_per_second * time_delta
    
    new_buildup = current_buildup - decay_amount
    
    # Cannot go below 0%
    return max(new_buildup, 0.0)

def check_status_trigger(buildup_percentage):
    """
    Check if status effect should trigger
    
    Args:
        buildup_percentage: Float, current buildup
    
    Returns:
        bool: True if status should trigger (>=100%)
    """
    return buildup_percentage >= 100.0
```

### Elemental Damage Processing
```python
def process_elemental_damage(base_damage, character_modifiers, target):
    """
    Process all elemental damage calculations and applications
    
    Args:
        base_damage: Float, base weapon/ability damage
        character_modifiers: Dict, all character's elemental modifiers
        target: Enemy object receiving damage
    
    Returns:
        Dict: All damage types and status applications
    """
    damage_results = {
        'physical': base_damage,
        'elemental': {},
        'status_applications': {}
    }
    
    # Process "X% Damage as Element" conversions
    for element, percentage in character_modifiers.get('damage_as_element', {}).items():
        converted_damage = base_damage * (percentage / 100.0)
        damage_results['elemental'][element] = damage_results['elemental'].get(element, 0) + converted_damage
    
    # Process flat elemental damage additions
    for element, flat_damage in character_modifiers.get('flat_elemental', {}).items():
        damage_results['elemental'][element] = damage_results['elemental'].get(element, 0) + flat_damage
    
    # Apply elemental damage multipliers
    for element, multiplier in character_modifiers.get('elemental_multipliers', {}).items():
        if element in damage_results['elemental']:
            damage_results['elemental'][element] *= (1.0 + multiplier / 100.0)
    
    # Apply target resistances
    for element, damage in damage_results['elemental'].items():
        resistance = target.get_resistance(element)
        final_damage = damage * (1.0 - resistance / 100.0)
        damage_results['elemental'][element] = max(final_damage, 0)
        
        # Calculate status buildup for this element
        if final_damage > 0:
            current_buildup = target.get_status_buildup(element)
            new_buildup = calculate_status_buildup(
                final_damage, 
                target.max_health, 
                current_buildup
            )
            damage_results['status_applications'][element] = new_buildup
    
    return damage_results
```

---

## MISSION SUCCESS CALCULATION

### Character Power Rating
```python
def calculate_character_power_rating(character, mission_requirements):
    """
    Calculate character's effective power for mission success
    
    Args:
        character: Character object with full loadout
        mission_requirements: Dict of mission stat requirements
    
    Returns:
        Float: Character's effective power rating
    """
    # Base power from level and gear
    base_power = character.level * 20
    
    # Gear power contribution
    gear_power = 0
    for item in character.equipped_items:
        if item is not None:
            gear_power += calculate_item_power_cost(item)
    
    # Attribute bonuses for mission-relevant stats
    primary_attrs = 0
    for attr in mission_requirements.get('primary_attributes', []):
        primary_attrs += character.get_attribute_value(attr) * 2
    
    secondary_attrs = 0
    for attr in mission_requirements.get('secondary_attributes', []):
        secondary_attrs += character.get_attribute_value(attr) * 1
    
    # Element match bonus
    element_bonus = 1.0
    character_elements = character.get_elemental_specializations()
    mission_elements = mission_requirements.get('favorable_elements', [])
    
    for element in character_elements:
        if element in mission_elements:
            element_bonus = 1.25
            break
    
    # Build synergy with mission affixes
    affix_synergy = calculate_affix_synergy(character, mission_requirements.get('active_affixes', []))
    
    total_power = (base_power + gear_power + primary_attrs + secondary_attrs) * element_bonus * affix_synergy
    
    return total_power

def calculate_affix_synergy(character, active_affixes):
    """
    Calculate bonus/penalty from character build vs active affixes
    
    Args:
        character: Character object
        active_affixes: List of active mission affixes
    
    Returns:
        Float: Multiplier (0.8-1.2 range)
    """
    synergy_bonus = 1.0
    
    affix_counters = {
        'volcanic': ['movement_speed', 'fire_resistance'],
        'frozen_ground': ['movement_speed', 'ice_resistance'],
        'attrition': ['shield_capacity', 'shield_regeneration'],
        'exposed': ['all_resistance', 'damage_reduction'],
        'suppression': ['cooldown_reduction', 'weapon_damage']
    }
    
    for affix in active_affixes:
        if affix['name'] in affix_counters:
            counter_stats = affix_counters[affix['name']]
            character_counter_power = 0
            
            for stat in counter_stats:
                character_counter_power += character.get_stat_value(stat)
            
            # Bonus for having counter stats (max +5% per affix)
            if character_counter_power > 50:  # Threshold for meaningful counter
                synergy_bonus *= 1.05
    
    return min(synergy_bonus, 1.2)  # Cap at 20% bonus
```

### Mission Success Probability
```python
def calculate_mission_success_probability(character_power, mission_power, modifiers):
    """
    Calculate probability of mission success
    
    Args:
        character_power: Float, character's effective power rating
        mission_power: Float, mission's required power rating
        modifiers: Dict, additional success modifiers
    
    Returns:
        Float: Success probability (0.05-0.95 range)
    """
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
    
    # Difficulty modifier
    final_success += modifiers.get('difficulty_modifier', 0)
    
    # Time modifier (careful vs rushed)
    final_success += modifiers.get('time_modifier', 0)
    
    # Affix penalties/bonuses
    for affix in modifiers.get('active_affixes', []):
        affix_modifier = get_affix_success_modifier(affix)
        final_success += affix_modifier
    
    # Build synergy bonus
    final_success += modifiers.get('build_synergy_bonus', 0)
    
    # Clamp to valid range
    return max(0.05, min(0.95, final_success))

def get_affix_success_modifier(affix):
    """
    Get success probability modifier for specific affix
    
    Args:
        affix: Dict containing affix information
    
    Returns:
        Float: Success modifier (-0.15 to +0.05 range)
    """
    affix_modifiers = {
        # Environmental affixes
        'volcanic': -0.05,
        'frozen_ground': -0.05,
        'toxic_fog': -0.05,
        'lightning_storm': -0.05,
        
        # Enemy modifier affixes
        'fortified': -0.07,
        'vampiric': -0.07,
        'shielded': -0.07,
        'teleporting': -0.07,
        
        # Player modifier affixes
        'attrition': -0.08,
        'suppression': -0.08,
        'drought': -0.08,
        'exposed': -0.08,
        
        # Reward modifier affixes (positive)
        'bountiful': 0.02,
        'wealthy': 0.02,
        'experienced': 0.02,
        'volatile': 0.02
    }
    
    return affix_modifiers.get(affix['name'], 0)
```

---

## ATTRIBUTE SYSTEM CALCULATIONS

### Derived Stat Calculation
```python
def calculate_derived_stats(character):
    """
    Calculate all derived stats from character attributes
    
    Args:
        character: Character object with allocated attributes
    
    Returns:
        Dict: All calculated derived stats
    """
    attrs = character.attributes
    derived = {}
    
    # Vitality effects
    derived['health'] = character.base_health + (attrs['vitality'] * 5)
    derived['shield_capacity'] = character.base_shield + (attrs['vitality'] * 2)
    derived['health_regen'] = character.base_health_regen + (attrs['vitality'] * 0.1)
    
    # Precision effects
    derived['critical_chance'] = min(50.0, attrs['precision'] * 0.5)  # 50% cap
    derived['accuracy'] = 100.0 + (attrs['precision'] * 1.0)
    derived['critical_damage'] = 150.0 + (attrs['precision'] * 0.2)  # Base 150%
    
    # Potency effects
    derived['all_damage'] = attrs['potency'] * 0.8
    derived['status_effect_chance'] = attrs['potency'] * 0.3
    derived['status_effect_duration'] = attrs['potency'] * 0.1
    
    # Alacrity effects
    derived['attack_speed'] = attrs['alacrity'] * 0.4
    derived['movement_speed'] = 100.0 + (attrs['alacrity'] * 0.4)
    derived['cooldown_reduction'] = min(40.0, attrs['alacrity'] * 0.2)  # 40% cap
    
    # Capacity effects
    derived['max_energy'] = character.base_energy + (attrs['capacity'] * 3)
    derived['ability_damage'] = attrs['capacity'] * 0.5
    derived['energy_regen'] = character.base_energy_regen + (attrs['capacity'] * 0.2)
    
    # Defense effects
    derived['all_resistance'] = min(75.0, attrs['defense'] * 0.2)  # 75% cap
    derived['armor'] = character.base_armor + (attrs['defense'] * 1)
    derived['damage_reduction'] = attrs['defense'] * 0.1
    
    return derived

def apply_gear_bonuses(derived_stats, equipped_items):
    """
    Apply gear bonuses to derived stats
    
    Args:
        derived_stats: Dict from calculate_derived_stats
        equipped_items: List of equipped items
    
    Returns:
        Dict: Final stats after gear bonuses
    """
    final_stats = derived_stats.copy()
    
    for item in equipped_items:
        if item is None:
            continue
            
        # Apply flat bonuses
        for stat, value in item.get('flat_bonuses', {}).items():
            final_stats[stat] = final_stats.get(stat, 0) + value
        
        # Apply percentage bonuses
        for stat, percentage in item.get('percentage_bonuses', {}).items():
            if stat in final_stats:
                final_stats[stat] *= (1.0 + percentage / 100.0)
    
    # Re-apply caps after gear bonuses
    final_stats['critical_chance'] = min(50.0, final_stats['critical_chance'])
    final_stats['cooldown_reduction'] = min(40.0, final_stats['cooldown_reduction'])
    final_stats['all_resistance'] = min(75.0, final_stats['all_resistance'])
    
    return final_stats
```

---

## PERFORMANCE OPTIMIZATION

### Caching Strategies
```python
class CharacterStatsCache:
    """
    Cache frequently calculated character stats to improve performance
    """
    def __init__(self):
        self.cache = {}
        self.cache_timeout = 1.0  # 1 second cache validity
    
    def get_cached_stats(self, character_id, character_hash):
        """
        Retrieve cached stats if valid
        
        Args:
            character_id: Unique character identifier
            character_hash: Hash of character's current state
        
        Returns:
            Dict or None: Cached stats if valid, None if cache miss
        """
        if character_id in self.cache:
            cached_data = self.cache[character_id]
            if (cached_data['hash'] == character_hash and 
                time.time() - cached_data['timestamp'] < self.cache_timeout):
                return cached_data['stats']
        
        return None
    
    def cache_stats(self, character_id, character_hash, stats):
        """
        Cache calculated stats for character
        """
        self.cache[character_id] = {
            'hash': character_hash,
            'stats': stats,
            'timestamp': time.time()
        }

def generate_character_hash(character):
    """
    Generate hash representing character's current state
    
    Args:
        character: Character object
    
    Returns:
        String: Hash of character state
    """
    import hashlib
    
    state_string = f"{character.level}_{character.paragon_level}_"
    state_string += f"{character.attributes}_"
    
    # Include equipped items
    for item in character.equipped_items:
        if item is not None:
            state_string += f"{item.id}_{item.enhancement_level}_"
    
    return hashlib.md5(state_string.encode()).hexdigest()
```

### Batch Processing
```python
def process_mission_rewards_batch(mission_results):
    """
    Process multiple mission completions efficiently
    
    Args:
        mission_results: List of mission completion data
    
    Returns:
        List: Processed reward distributions
    """
    reward_batches = []
    
    # Group by mission type for efficient processing
    mission_groups = {}
    for result in mission_results:
        mission_type = result['mission_type']
        if mission_type not in mission_groups:
            mission_groups[mission_type] = []
        mission_groups[mission_type].append(result)
    
    # Process each group with optimized algorithms
    for mission_type, results in mission_groups.items():
        rewards = process_mission_type_batch(mission_type, results)
        reward_batches.extend(rewards)
    
    return reward_batches
```

This technical implementation provides the foundation for all core systems while maintaining performance and scalability requirements for a modern ARPG/looter shooter.