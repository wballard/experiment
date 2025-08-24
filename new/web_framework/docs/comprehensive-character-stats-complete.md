# COMPREHENSIVE CHARACTER STATS - Complete List

> **🚨 IMPLEMENTATION ENFORCEMENT**  
> See [character-system-implementation-spec.md](./character-system-implementation-spec.md) for mandatory implementation constraints and code review checklist.

## All Character Stats That Should Be Modifiable by Skills, Attributes, and Equipment

This is the **DEFINITIVE LIST** of ALL 113 stats for the character system. **NO ADDITIONS OR MODIFICATIONS WITHOUT EXPLICIT APPROVAL.**

**Sources Consolidated:**
- unified-modifier-system.md (all stats included) - **NOW DEPRECATED**
- skill_implementation_plan.md (all modifier types)
- weapon-modification-system.md (weapon mechanics)  
- character-systems.html (attribute scaling)

**Key Design Principles:**
- **NO player attribute allocation** (attributes come from equipment + skills only)
- **Uses typed modifier system** for damage/resistance/status effects
- **All modifiers use +/- pattern** (can increase OR decrease stats for trade-offs)
- **9 equipment slots only** (no random additions)
- **Cooldown-based abilities** (no energy system)

---

## **System Design Benefits & Examples**

### **🔄 Bidirectional Modifier System (+/- Pattern)**
**All percentage stats start at 0 and can go positive OR negative, enabling meaningful trade-offs.**

**Examples:**
- **Light Armor**: "+15 movement speed, +20% slide speed, -25% dodge cooldown" (mobility build)
- **Heavy Armor**: "+50 defense, -10 movement speed, +15% dodge cooldown" (tank trade-off)
- **Heavy Barrel**: "+8 damage, +15 range, -10% fire rate" (accuracy vs speed trade-off)
- **Combat Stimulant**: "-25% all cooldowns, +15% ability range, -10% health regen" (power at a cost)

### **⚙️ Flexible Typed Systems**
**Arrays with type specification make it easy to add new categories without code changes.**

**Weapon Type Damage Examples:**
- Skill: "+15% sniper damage" → `{ name: 'weapon_type_damage_percent', value: 0.15, weaponType: 'sniper' }`
- Equipment: "+50 assault rifle damage" → `{ name: 'weapon_type_damage_flat', value: 50, weaponType: 'assault_rifle' }`
- Easy to add: `{ type: 'heavy_weapon', value: ... }` or `{ type: 'energy_weapon', value: ... }`

**Cooldown Reduction Examples:**
- Skill: "Tactical Expert: -15% grenade cooldown, -10% class ability cooldown"
- Equipment: "Heavy Focus: -30% ultimate cooldown, +20% ability cooldowns" (trade-off)
- Easy to add: `{ type: 'healing_ability', value: ... }` or `{ type: 'damage_ability', value: ... }`

### **🔧 Weapon Base + Modification Tracking**
**Clear separation between weapon base stats and applied modifications.**

**Magazine Size Example:**
- Base Weapon: "Assault Rifle" has `weapon_base_magazine = 30`
- Equipment Mod: "Extended Mag" gives `+5 magazine_size`
- Skill: "Ammo Expert" gives `+2 magazine_size`
- **Final Result**: `30 + 5 + 2 = 37 rounds`

**Fire Rate Example:**
- Base Weapon: "SMG" has `weapon_base_fire_rate = 800 RPM`
- Equipment Mod: "Hair Trigger" gives `+15% fire_rate_modifier`
- Skill: "Rapid Fire" gives `+10% fire_rate_modifier`
- Equipment Penalty: "Heavy Barrel" gives `-5% fire_rate_modifier`
- **Final Result**: `800 * (1 + 0.15 + 0.10 - 0.05) = 960 RPM`

### **🛡️ Shield Delay System**
**Comprehensive shield mechanics with time-to-start and modifiers.**

**Examples:**
- Item: "+50% shield regen rate, -25% shield delay" (faster shields)
- Item: "+100% health, +10% shield delay change" (more health but slower shield recovery)
- Skill: "Shield Expert: -50% shield delay, +25% shield regen rate"

### **🏃 Movement Trade-offs**
**Movement stats that can be enhanced or penalized for build diversity.**

**Examples:**
- Speed Build: "+20 sprint speed, +30% slide speed, +25 jump height"
- Stealth Build: "+15 crouch speed, -20% dodge cooldown, -10 movement speed"
- Tank Build: "-15 movement speed, +50 health, +25% damage reduction"

### **🎯 Ability System Without Energy**
**Pure cooldown-based system with flexible ability classification.**

**Examples:**
- Combat Focus: "-20% ability cooldowns, +15% ability range"
- Ultimate Specialist: "-40% ultimate cooldown, +25% ultimate ability range"
- Grenade Expert: "-30% grenade cooldown, +20% grenade ability duration"

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
health_percent        = 0 + equipment + skills      // Health multiplier (can be +/-)
shield_capacity       = 50 + (vitality * 2) + equipment + skills
shield_capacity_percent = 0 + equipment + skills    // Shield multiplier (can be +/-)
health_regeneration   = 1.0 + (vitality * 0.1) + equipment + skills
health_regen_rate_percent = 0 + equipment + skills  // Health regen speed modifier (can be +/-)
shield_regeneration   = 0.5 + equipment + skills
shield_delay          = 2.0 + equipment + skills    // Time before shield starts regenerating (seconds)
shield_delay_change_percent = 0 + equipment + skills // Shield delay modifier (can be +/-)
shield_regen_rate_percent = 0 + equipment + skills  // Shield regen speed modifier (can be +/-)
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
```

---

## **Damage System (Universal)**
```javascript
all_damage            = 0 + (potency * 0.8) + equipment + skills
weapon_damage         = 0 + equipment + skills
ability_damage        = 0 + (capacity * 0.5) + equipment + skills
melee_damage          = 0 + equipment + skills
armor_penetration     = 0 + equipment + skills

// Weapon Type-Specific Damage (Flexible Typed System)
weapon_type_damage_flat = [
    { type: 'sniper', value: 0 + equipment + skills },
    { type: 'shotgun', value: 0 + equipment + skills },
    { type: 'assault_rifle', value: 0 + equipment + skills },
    { type: 'smg', value: 0 + equipment + skills },
    { type: 'handgun', value: 0 + equipment + skills }
    // Easy to add: { type: 'heavy_weapon', value: 0 + equipment + skills }
]

weapon_type_damage_percent = [
    { type: 'sniper', value: 0 + equipment + skills },
    { type: 'shotgun', value: 0 + equipment + skills },
    { type: 'assault_rifle', value: 0 + equipment + skills },
    { type: 'smg', value: 0 + equipment + skills },
    { type: 'handgun', value: 0 + equipment + skills }
    // Easy to add: { type: 'heavy_weapon', value: 0 + equipment + skills }
]
```

---

## **Weapon Mechanics (Core FPS Stats)**
```javascript
// Fire Rate & Attack Speed
fire_rate             = weapon_base_fire_rate * (1 + fire_rate_modifier)
fire_rate_modifier    = 0 + equipment + skills      // Can be +/- (e.g., +15% or -10%)
attack_speed          = 100 + (alacrity * 0.4) + equipment + skills

// Ammunition System  
magazine_size         = weapon_base_magazine + equipment + skills    // Can be +/- (e.g., +5 rounds or -2 rounds)
ammo_capacity         = weapon_base_ammo + equipment + skills        // Can be +/- (e.g., +50 ammo or -20 ammo)
reload_speed          = weapon_base_reload * (1 + reload_speed_modifier)
reload_speed_modifier = 0 + equipment + skills      // Can be +/- (e.g., +25% faster or -15% slower)

// Weapon Handling
ads_speed             = weapon_base_ads * (1 + ads_speed_modifier)
ads_speed_modifier    = 0 + equipment + skills      // Can be +/- (e.g., +30% faster ADS or -20% slower)
ads_movement_percent  = 0 + equipment + skills      // ADS movement penalty change (can be +/-)
recoil_control        = 0 + equipment + skills      // Can be +/- (e.g., +15 control or -5 control)
recoil_reduction_percent = 0 + equipment + skills   // Can be +/- (e.g., +20% less recoil or -10% more recoil)
weapon_stability      = weapon_base_stability + equipment + skills   // Can be +/- (e.g., +10 stability or -5 stability)
weapon_sway           = weapon_base_sway + equipment + skills         // Can be +/- (e.g., +5 more sway or -8 less sway)
handling_percent      = 0 + equipment + skills      // Weapon swap speed change (can be +/-)
spread_reduction_percent = 0 + equipment + skills   // Can be +/- (e.g., +15% tighter spread or -10% looser)

// Ballistics
projectile_velocity   = weapon_base_velocity + equipment + skills    // Can be +/- (e.g., +100 velocity or -50 velocity)
weapon_range          = weapon_base_range + equipment + skills       // Can be +/- (e.g., +20m range or -10m range)
range_percent         = 0 + equipment + skills      // Range multiplier change (can be +/-)
damage_falloff_start  = weapon_base_falloff + equipment + skills     // Can be +/- (e.g., +15m falloff start or -5m)
spread_angle          = weapon_base_spread + equipment + skills      // Can be +/- (e.g., +2° more spread or -1° less spread)
spread_recovery       = weapon_base_recovery + equipment + skills    // Can be +/- (e.g., +0.5 faster recovery or -0.2 slower)
```

---

## **Movement & Mobility**
```javascript
movement_speed        = 100 + (alacrity * 0.4) + equipment + skills
sprint_speed          = 130 + equipment + skills                    // Can be +/- (e.g., +20 speed or -10 speed)
crouch_speed          = 60 + equipment + skills                     // Can be +/- (e.g., +15 crouch speed or -5 speed)
jump_height           = 100 + equipment + skills                    // Can be +/- (e.g., +25 jump height or -10 height)
slide_distance        = 100 + equipment + skills                    // Can be +/- (e.g., +30 slide distance or -15 distance)
slide_speed_percent   = 0 + equipment + skills      // Slide speed change (can be +/-)
slide_duration_percent = 0 + equipment + skills     // Slide duration change (can be +/-)
dodge_distance        = 100 + equipment + skills                    // Can be +/- (e.g., +20 dodge distance or -10 distance)
dodge_cooldown_change_percent = 0 + equipment + skills // Dodge cooldown change (can be +/-)
```

---

## **Ability & Cooldown System**
```javascript
// General Ability Properties
ability_range         = 100 + equipment + skills              // Can be +/- (e.g., +20 range or -10 range)
ability_duration      = 100 + equipment + skills              // Can be +/- (e.g., +50% duration or -25% duration)
ability_range_percent = 0 + equipment + skills                // Range multiplier (can be +/-)
ability_duration_percent = 0 + equipment + skills             // Duration multiplier (can be +/-)

// Cooldown Reduction System (Flexible Typed System)
cooldown_reduction_percent = [
    { type: 'ability', value: 0 + (alacrity * 0.2) + equipment + skills },
    { type: 'ultimate', value: 0 + equipment + skills },
    { type: 'grenade', value: 0 + equipment + skills },
    { type: 'class_ability', value: 0 + equipment + skills },
    { type: 'movement_ability', value: 0 + equipment + skills },
    { type: 'all', value: 0 + equipment + skills }             // All cooldown reduction (rare)
    // Easy to add: { type: 'healing_ability', value: 0 + equipment + skills }
    // Easy to add: { type: 'damage_ability', value: 0 + equipment + skills }
]
```

---

## **Power Budget System** (Already Implemented)
```javascript
power_max             = 300 + (level - 1) * 50 + equipment_bonus
power_used            = sum_of_equipped_item_power_costs
power_available       = power_max - power_used
// Note: power_efficiency is handled by item rarity tiers, not character stats
```

---

## **Typed Elemental Damage** (Flexible System)
```javascript
damage_percent = [
    { type: 'physical', value: base + (potency * 0.8) + equipment + skills },
    { type: 'fire', value: 0 + equipment + skills },
    { type: 'ice', value: 0 + equipment + skills },
    { type: 'electric', value: 0 + equipment + skills },
    { type: 'earth', value: 0 + equipment + skills },
    { type: 'nature', value: 0 + equipment + skills }
]

damage_flat = [
    { type: 'fire', value: 0 + equipment + skills },
    { type: 'ice', value: 0 + equipment + skills },
    { type: 'electric', value: 0 + equipment + skills },
    { type: 'earth', value: 0 + equipment + skills },
    { type: 'nature', value: 0 + equipment + skills }
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
    { type: 'nature', value: (defense * 0.2) + equipment + skills }
]
```

---

## **Typed Status Effect System** (Matches Elemental System)
**Status effects use elemental type names internally but have display names for UI:**
- `fire` → **"Burn"** (damage over time)
- `ice` → **"Freeze"** (movement/action slow)  
- `electric` → **"Shock"** (stun/paralysis)
- `earth` → **"Fracture"** (armor reduction)
- `nature` → **"Toxin"** (damage + debuff)
- `physical` → **"Bleed"** (damage over time)

```javascript
// Status effects you can inflict (chance %)
status_effect_chance = [
    { type: 'fire', value: (potency * 0.3) + equipment + skills },      // Display: "Burn"
    { type: 'ice', value: 0 + equipment + skills },                     // Display: "Freeze"
    { type: 'electric', value: 0 + equipment + skills },                // Display: "Shock"
    { type: 'earth', value: 0 + equipment + skills },                   // Display: "Fracture"
    { type: 'nature', value: 0 + equipment + skills },                  // Display: "Toxin"
    { type: 'physical', value: 0 + equipment + skills }                 // Display: "Bleed"
]

// Status effects you resist (incorporates 50% of elemental resistance)
// Formula: (Elemental Resistance × 0.5) + Equipment Bonuses + Skill Bonuses
status_effect_resistance = [
    { type: 'fire', value: (resistance_percent[fire] * 0.5) + equipment + skills },     // Display: "Burn Resistance" 
    { type: 'ice', value: (resistance_percent[ice] * 0.5) + equipment + skills },       // Display: "Freeze Resistance"
    { type: 'electric', value: (resistance_percent[electric] * 0.5) + equipment + skills }, // Display: "Shock Resistance"
    { type: 'earth', value: (resistance_percent[earth] * 0.5) + equipment + skills },   // Display: "Fracture Resistance"
    { type: 'nature', value: (resistance_percent[nature] * 0.5) + equipment + skills }, // Display: "Toxin Resistance"
    { type: 'physical', value: (resistance_percent[physical] * 0.5) + equipment + skills } // Display: "Bleed Resistance"
]

// EXAMPLE CALCULATION:
// Character has 50% fire resistance from defense + equipment
// Equipment: "Status Ward: +10% burn resistance" 
// Skill: "Fire Immunity: +15% burn resistance"
// Final Burn Resistance = (50% × 0.5) + 10% + 15% = 25% + 25% = 50% burn resistance
//
// This means:
// - 50% fire damage resistance (separate from status)
// - 50% burn status effect resistance
// - Balanced system where elemental builds get status benefits but need additional investment for full protection

// Duration of effects you inflict (% modifier)
status_duration = [
    { type: 'fire', value: 0 + (potency * 0.1) + equipment + skills },  // Display: "Burn Duration"
    { type: 'ice', value: 0 + equipment + skills },                     // Display: "Freeze Duration"
    { type: 'electric', value: 0 + equipment + skills },                // Display: "Shock Duration"
    { type: 'earth', value: 0 + equipment + skills },                   // Display: "Fracture Duration"
    { type: 'nature', value: 0 + equipment + skills },                  // Display: "Toxin Duration"
    { type: 'physical', value: 0 + equipment + skills }                 // Display: "Bleed Duration"
]
```

---

## **Special Combat Modifiers**
```javascript
// Target-specific bonuses (Flexible Typed System)
damage_vs_target_percent = [
    { type: 'elite', value: 0 + equipment + skills },
    { type: 'boss', value: 0 + equipment + skills },
    { type: 'robot', value: 0 + equipment + skills },
    { type: 'organic', value: 0 + equipment + skills }
    // Easy to add: { type: 'undead', value: 0 + equipment + skills }
    // Easy to add: { type: 'construct', value: 0 + equipment + skills }
]

// Situational bonuses
first_shot_damage_percent = 0 + equipment + skills      // Can be +/- (e.g., +50% first shot or -25% penalty)
last_shot_damage_percent  = 0 + equipment + skills      // Can be +/- (e.g., +75% last shot or -10% penalty)
low_health_damage_percent = 0 + equipment + skills      // Can be +/- (e.g., +100% when low health)
stealth_damage_percent    = 0 + equipment + skills      // Can be +/- (e.g., +200% stealth damage)

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
experience_gain_percent = 0 + equipment + skills        // Can be +/- (e.g., +25% XP or -10% penalty)
loot_find_chance      = 0 + equipment + skills          // Can be +/- (e.g., +15% loot chance)

// Ammo Find Chance (Typed by Weapon Type)
ammo_find_chance = [
    { type: 'sniper', value: 0 + equipment + skills },
    { type: 'shotgun', value: 0 + equipment + skills },
    { type: 'assault_rifle', value: 0 + equipment + skills },
    { type: 'smg', value: 0 + equipment + skills },
    { type: 'handgun', value: 0 + equipment + skills }
    // Easy to add: { type: 'heavy_weapon', value: 0 + equipment + skills }
]

// Ammo Reserve Capacity (Formula needs tuning)
ammo_reserve_capacity = weapon_base_ammo * (magazine_size / weapon_base_magazine) * (1 + ammo_reserve_modifier)
ammo_reserve_modifier = 0 + equipment + skills          // Can be +/- (e.g., +50% ammo capacity or -25% penalty)
```

---

## **Class Skill System** (Flexible Typed System)
```javascript
// Generalized class skill modifiers - can add any class skill type ad hoc
class_skill_modifier = [
    // Stealth Skills
    { skill: 'stealth', modifier: 'duration', value: 0 + equipment + skills },
    { skill: 'stealth', modifier: 'movement_speed', value: 0 + equipment + skills },
    { skill: 'stealth', modifier: 'detection_range', value: 0 + equipment + skills },
    
    // Shield Skills  
    { skill: 'shield', modifier: 'overcharge_duration', value: 0 + equipment + skills },
    { skill: 'shield', modifier: 'recharge_rate', value: 0 + equipment + skills },
    
    // Drone/Pet Skills
    { skill: 'drone', modifier: 'health', value: 0 + equipment + skills },
    { skill: 'drone', modifier: 'damage', value: 0 + equipment + skills },
    
    // Deployable Skills
    { skill: 'deployable', modifier: 'health', value: 0 + equipment + skills },
    { skill: 'deployable', modifier: 'damage', value: 0 + equipment + skills },
    
    // Stance Skills
    { skill: 'stance', modifier: 'switch_speed', value: 0 + equipment + skills },
    
    // Threat Skills
    { skill: 'threat', modifier: 'generation', value: 0 + equipment + skills },
    
    // Easy to add any new class skill:
    // { skill: 'healing', modifier: 'power', value: 0 + equipment + skills },
    // { skill: 'summoning', modifier: 'duration', value: 0 + equipment + skills },
    // { skill: 'teleport', modifier: 'range', value: 0 + equipment + skills }
]
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