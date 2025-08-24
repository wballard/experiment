# COMPREHENSIVE CHARACTER STATS - Complete List

## All Character Stats That Should Be Modifiable by Skills, Attributes, and Equipment

This is the definitive list of ALL stats that need to be part of the unified modifier system.

**Sources Consolidated:**
- unified-modifier-system.md (all stats included)
- skill_implementation_plan.md (all modifier types)
- weapon-modification-system.md (weapon mechanics)  
- character-systems.html (attribute scaling)

**Key Corrections Applied:**
- NO player attribute allocation (attributes come from equipment + skills only)
- Uses typed modifier system for damage/resistance/status effects
- Includes all weapon mechanics (magazine, reload, ADS, recoil, etc.)
- Comprehensive 100+ stat coverage

---

## **Primary Attributes** (Equipment + Skills Only - No Player Allocation)
```javascript
vitality    = 0 + equipment_bonus + skill_bonus    // Health & Survivability  
precision   = 0 + equipment_bonus + skill_bonus    // Critical & Accuracy
potency     = 0 + equipment_bonus + skill_bonus    // Raw Damage & Status Effects
alacrity    = 0 + equipment_bonus + skill_bonus    // Speed & Agility
capacity    = 0 + equipment_bonus + skill_bonus    // Resources & Abilities
defense     = 0 + equipment_bonus + skill_bonus    // Defense & Resistances
```

---

## **Health & Survivability Stats**
```javascript
health                = 100 + (vitality * 5) + equipment + skills
health_percent        = 100 + equipment + skills    // Health multiplier
shield_capacity       = 50 + (vitality * 2) + equipment + skills
shield_capacity_percent = 100 + equipment + skills  // Shield multiplier
health_regeneration   = 1.0 + (vitality * 0.1) + equipment + skills
shield_regeneration   = 0.5 + equipment + skills
shield_delay_reduction_percent = 0 + equipment + skills  // Faster shield regen start
shield_regen_rate_percent = 100 + equipment + skills    // Shield regen speed
damage_reduction      = 0 + (defense * 0.1) + equipment + skills
armor                 = 0 + (defense * 1) + equipment + skills
```

---

## **Critical Strike & Accuracy System**
```javascript
critical_chance       = 5.0 + (precision * 0.5) + equipment + skills    [CAP: 50%]
critical_damage       = 150.0 + (precision * 0.2) + equipment + skills
accuracy              = 75.0 + (precision * 1.0) + equipment + skills
weak_spot_damage      = 200.0 + equipment + skills
headshot_damage       = 300.0 + equipment + skills
```

---

## **Damage System (Universal)**
```javascript
all_damage            = 0 + (potency * 0.8) + equipment + skills
weapon_damage         = 0 + equipment + skills
ability_damage        = 0 + (capacity * 0.5) + equipment + skills
melee_damage          = 0 + equipment + skills
armor_penetration     = 0 + equipment + skills
```

---

## **Weapon Mechanics (Core FPS Stats)**
```javascript
// Fire Rate & Attack Speed
fire_rate             = weapon_base_fire_rate * (1 + fire_rate_modifier)
fire_rate_modifier    = 0 + equipment + skills
attack_speed          = 100 + (alacrity * 0.4) + equipment + skills

// Ammunition System  
magazine_size         = weapon_base_magazine + equipment + skills
ammo_capacity         = weapon_base_ammo + equipment + skills
reload_speed          = weapon_base_reload * (1 + reload_speed_modifier)
reload_speed_modifier = 0 + equipment + skills

// Weapon Handling
ads_speed             = weapon_base_ads * (1 + ads_speed_modifier)
ads_speed_modifier    = 0 + equipment + skills
ads_movement_percent  = 100 + equipment + skills    // ADS movement penalty reduction
recoil_control        = 0 + equipment + skills
recoil_reduction_percent = 0 + equipment + skills   // Recoil reduction
weapon_stability      = weapon_base_stability + equipment + skills
weapon_sway           = weapon_base_sway + equipment + skills
handling_percent      = 100 + equipment + skills    // Weapon swap speed
spread_reduction_percent = 0 + equipment + skills   // Spread cone tightening

// Ballistics
projectile_velocity   = weapon_base_velocity + equipment + skills
weapon_range          = weapon_base_range + equipment + skills
range_percent         = 100 + equipment + skills    // Range multiplier
damage_falloff_start  = weapon_base_falloff + equipment + skills
spread_angle          = weapon_base_spread + equipment + skills
spread_recovery       = weapon_base_recovery + equipment + skills
```

---

## **Movement & Mobility**
```javascript
movement_speed        = 100 + (alacrity * 0.4) + equipment + skills
sprint_speed          = 130 + equipment + skills
crouch_speed          = 60 + equipment + skills
jump_height           = 100 + equipment + skills
slide_distance        = 100 + equipment + skills
slide_speed_percent   = 100 + equipment + skills    // Slide speed multiplier
slide_duration_percent = 100 + equipment + skills   // Slide duration multiplier
dodge_distance        = 100 + equipment + skills
dodge_cooldown        = 100 - equipment - skills    [Reduction]
```

---

## **Energy & Resource System**
```javascript
max_energy            = 100 + (capacity * 3) + equipment + skills
energy_regeneration   = 2.0 + (capacity * 0.2) + equipment + skills
energy_efficiency     = 100 - equipment - skills    [Cost reduction]
cooldown_reduction    = 0 + (alacrity * 0.2) + equipment + skills
ability_range         = 100 + equipment + skills
ability_duration      = 100 + equipment + skills

// Specialized CDR (from unified-modifier-system.md)
ability_cdr_percent   = 0 + equipment + skills    // General ability CDR
ultimate_cdr_percent  = 0 + equipment + skills    // Ultimate CDR
grenade_cdr_percent   = 0 + equipment + skills    // Grenade CDR
class_ability_cdr_percent = 0 + equipment + skills // Class ability CDR
all_cdr_percent       = 0 + equipment + skills    // All cooldown reduction (rare)
```

---

## **Power Budget System** (Already Implemented)
```javascript
power_max             = 300 + (level - 1) * 50 + equipment_bonus
power_used            = sum_of_equipped_item_power_costs
power_available       = power_max - power_used
power_efficiency      = 100 - equipment - skills    [Cost reduction]
```

---

## **Typed Elemental Damage** (Flexible System)
```javascript
damage_percent = [
    { type: 'physical', value: base + (potency * 0.8) + equipment + skills },
    { type: 'fire', value: equipment + skills },
    { type: 'ice', value: equipment + skills },
    { type: 'electric', value: equipment + skills },
    { type: 'earth', value: equipment + skills },
    { type: 'nature', value: equipment + skills },
    { type: 'poison', value: equipment + skills },
    { type: 'void', value: equipment + skills },        // Future expansion
    { type: 'psychic', value: equipment + skills }      // Future expansion
]

damage_flat = [
    { type: 'fire', value: equipment + skills },
    { type: 'ice', value: equipment + skills },
    { type: 'electric', value: equipment + skills },
    // ... etc for all types
]
```

---

## **Typed Resistance System** (Flexible, All Capped at 75%)
```javascript
resistance_percent = [
    { type: 'physical', value: (defense * 0.2) + equipment + skills },
    { type: 'fire', value: (defense * 0.2) + equipment + skills },
    { type: 'ice', value: (defense * 0.2) + equipment + skills },
    { type: 'electric', value: (defense * 0.2) + equipment + skills },
    { type: 'earth', value: (defense * 0.2) + equipment + skills },
    { type: 'nature', value: (defense * 0.2) + equipment + skills },
    { type: 'poison', value: equipment + skills },
    { type: 'void', value: equipment + skills },         // Future expansion
    { type: 'psychic', value: equipment + skills }       // Future expansion
]
```

---

## **Typed Status Effect System** (Flexible)
```javascript
// Status effects you can inflict
status_effect_chance = [
    { type: 'burn', value: (potency * 0.3) + equipment + skills },
    { type: 'freeze', value: equipment + skills },
    { type: 'shock', value: equipment + skills },
    { type: 'poison', value: equipment + skills },
    { type: 'slow', value: equipment + skills },
    { type: 'stun', value: equipment + skills },
    { type: 'blind', value: equipment + skills },
    { type: 'weakness', value: equipment + skills },
    { type: 'fear', value: equipment + skills }          // Future expansion
]

// Status effects you resist
status_resistance = [
    { type: 'burn', value: equipment + skills },
    { type: 'freeze', value: equipment + skills },
    { type: 'shock', value: equipment + skills },
    { type: 'poison', value: equipment + skills },
    { type: 'slow', value: equipment + skills },
    { type: 'stun', value: equipment + skills },
    { type: 'blind', value: equipment + skills },
    { type: 'weakness', value: equipment + skills }
]

// Duration of effects you inflict
status_duration = [
    { type: 'burn', value: 100 + (potency * 0.1) + equipment + skills },
    { type: 'freeze', value: 100 + equipment + skills },
    { type: 'poison', value: 100 + equipment + skills },
    // ... etc for all status types
]
```

---

## **Special Combat Modifiers**
```javascript
// Target-specific bonuses
damage_vs_elites      = 100 + equipment + skills
damage_vs_bosses      = 100 + equipment + skills
damage_vs_robots      = 100 + equipment + skills
damage_vs_organic     = 100 + equipment + skills

// Situational bonuses
first_shot_damage     = 100 + equipment + skills
last_shot_damage      = 100 + equipment + skills
low_health_damage     = 100 + equipment + skills
stealth_damage        = 100 + equipment + skills

// Combat effects (from unified-modifier-system.md)
ammo_return_on_crit   = 0 + equipment + skills    // Bullets returned on critical
explosive_rounds_chance = 0 + equipment + skills  // Chance for explosive rounds
ricochet_rounds       = 0 + equipment + skills    // Rounds bounce to enemies
life_on_kill          = 0 + equipment + skills    // Health restored on kill
shield_on_kill        = 0 + equipment + skills    // Shield restored on kill
cooldown_on_kill_percent = 0 + equipment + skills // CDR on kill
cooldown_on_weakspot_percent = 0 + equipment + skills // CDR on weakspot
cooldown_on_critical_percent = 0 + equipment + skills // CDR on critical

// Utility
experience_gain       = 100 + equipment + skills
loot_find_chance      = 0 + equipment + skills
ammo_find_chance      = 0 + equipment + skills
ammo_reserve_percent  = 100 + equipment + skills  // Total ammo capacity
```

---

## **Class-Specific Mechanics** (Future)
```javascript
// Infiltrator
stealth_duration      = base + equipment + skills
stealth_movement_speed = 100 + equipment + skills
detection_radius      = 100 - equipment - skills

// Sentinel  
shield_overcharge_duration = base + equipment + skills
shield_recharge_rate  = base + equipment + skills
threat_generation     = 100 + equipment + skills

// Technomancer
drone_health          = base + equipment + skills
drone_damage          = 100 + equipment + skills
tech_ability_range    = 100 + equipment + skills

// Engineer
deployable_health     = base + equipment + skills
barrier_strength      = base + equipment + skills
turret_damage         = 100 + equipment + skills

// Vanguard
stance_switch_speed   = base + equipment + skills
adaptability_bonus    = 0 + equipment + skills
```

---

## **Current Implementation Status**

### ✅ **Already Implemented (Partially)**
- Basic attributes (wrong names, wrong scaling)
- Typed damage system (skill-modifiers.js)
- Typed resistance system (skill-modifiers.js)  
- Power budget system (database + triggers)
- Basic weapon stats (items table)

### ❌ **Missing (Critical)**
- Attribute calculation from equipment + skills
- Weapon handling stats (ADS, recoil, spread, etc.)
- Movement and mobility stats  
- Status effect system
- Class-specific mechanics
- Real-time stat calculation engine

### ❌ **Display Issues**
- Dashboard shows hardcoded values instead of calculated stats
- No weapon mechanics displayed
- No status effect or class-specific stat display
- No typed system visualization (shows individual stats instead of arrays)

---

## **Implementation Priority**

### **Phase 1: Foundation**
1. **Attribute System** - Calculate 6 attributes from equipment + skills
2. **Weapon Mechanics** - Add all weapon handling stats
3. **Calculation Engine** - Real-time stat computation
4. **Database Schema** - Store calculated stats properly

### **Phase 2: Combat Systems**  
1. **Status Effect System** - Implement typed status effects
2. **Movement System** - Add mobility stats
3. **Special Modifiers** - Target-specific and situational bonuses
4. **Dashboard Integration** - Display calculated values

### **Phase 3: Advanced Features**
1. **Class Mechanics** - Class-specific stat systems
2. **Real-time Updates** - Live updates on equipment/skill changes
3. **Stat Breakdown** - Show source of each stat bonus
4. **Build Planning** - Preview changes before applying

This comprehensive list covers **all 100+ stats** that should be modifiable by the unified modifier system, creating a truly flexible character progression system where any equipment or skill can potentially affect any stat type.