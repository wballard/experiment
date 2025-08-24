# Skill Implementation Plan

## Overview
This document outlines the design for making skills functional by having passive stat-modifying skills automatically apply their bonuses to character stats. The system should only apply bonuses for skills that have been purchased (ranks > 0) on the character.

## Current System Analysis

### Database Structure
- `character_stats` table has `skill_bonus` field ready for skill modifiers
- `character_skills` table tracks skill ranks per character  
- Skills are stored with descriptions containing stat modifiers (e.g., "+5% critical chance per point")

### Skill Categories Identified
1. **Basic Stat Modifiers** (Unconditional)
   - Critical chance/damage
   - Movement speed
   - Weapon damage (general)
   - Fire rate, reload speed, accuracy
   - Health/energy/stamina bonuses

2. **Elemental Modifiers**
   - Elemental damage bonuses (+10% fire damage)
   - Elemental resistance (+25% fire resistance)
   - Element-specific effects

3. **Weapon-Specific Modifiers**  
   - SMG-specific bonuses
   - Shotgun-specific bonuses
   - Handgun/Sniper/Assault rifle bonuses

4. **Conditional Modifiers** (Complex)
   - "While near totems"
   - "When standing still 3+ seconds"
   - "Against isolated enemies"

## Proposed Design

### Phase 1: Basic Stat Modifiers

#### Stat Naming Convention (Aligned with Unified Stat System)
```
// Core Combat Stats (from unified-stat-system.md)
weapon_damage_percent           // Weapon Damage % - multiplies all weapon damage
critical_strike_chance_percent  // Critical Strike Chance % - chance for critical hits  
critical_strike_damage_percent  // Critical Strike Damage % - bonus damage on crits
fire_rate_percent              // Fire Rate % - increases weapon fire rate
reload_speed_percent           // Reload Speed % - reduces reload time
movement_speed_percent         // Movement Speed % - increases base movement
handling_percent               // Handling % - reduces weapon swap time
ads_speed_percent              // ADS Speed % - reduces aim down sight time

// Generalized Damage Type System
// Supports: physical, fire, ice, electric, earth, nature (extensible)
// Uses pattern: {damage_type}_{modifier_type}_{value_type}

// TYPE 1: Damage Conversion - "+X% Damage as [DamageType]"
// Pattern: {damage_type}_conversion_percent
damage_conversion_percent      // Generic system, stored as: { type: 'fire', value: 0.25 }

// TYPE 2: Flat Damage Addition - "+X [DamageType] Damage"  
// Pattern: {damage_type}_damage_flat
damage_flat                    // Generic system, stored as: { type: 'fire', value: 15 }

// TYPE 3: Damage Type Multiplier - "+X% [DamageType] Damage"
// Pattern: {damage_type}_damage_percent  
damage_percent                 // Generic system, stored as: { type: 'fire', value: 0.50 }

// Generalized Resistance System
// Pattern: {damage_type}_resistance_percent
// Note: 'physical' resistance is effectively armor
resistance_percent             // Generic system, stored as: { type: 'fire', value: 0.15 }

// Defensive Stats
health                         // Health - flat health increase
shield_capacity               // Shield Capacity - flat shield increase
damage_reduction_percent      // Damage Reduction % - reduces all damage taken

// Class-specific Stats (Custom)
totem_limit                   // Doctor: Max active totems (+1 per level)
stealth_duration_percent      // Infiltrator: Stealth duration modifier
detection_range_percent       // Infiltrator: Detection range modifier (negative = harder to detect)
```

#### Value Storage Format
- Store percentage bonuses as decimal values (5% = 0.05)
- Store flat bonuses as absolute values
- Use positive values for bonuses, negative for penalties

### Comprehensive Modifier Types (from unified-stat-system.md)

#### Core Combat Modifiers
```javascript
// Basic weapon performance
weapon_damage_percent           // +2-10% - multiplies ALL weapon damage
critical_strike_chance_percent  // +1-5% - chance for critical hits (cap: 50%)
critical_strike_damage_percent  // +5-25% - bonus damage on crits
weakspot_damage_percent         // +5-20% - multiplies base weakspot multiplier
armor_piercing                  // +5-50 - flat armor penetration value

// Weapon handling
fire_rate_percent              // +2-8% - multiplies base RPM
reload_speed_percent           // +5-15% - reduces reload time
magazine_size                  // +1-5 flat OR +5-15% increase
handling_percent               // +5-15% - reduces swap time
ads_speed_percent              // +5-20% - reduces ADS time
ads_movement_percent           // +10-30% - reduces ADS movement penalty
spread_reduction_percent       // +5-20% - tightens spread cone
recoil_reduction_percent       // +5-20% - reduces weapon kick
range_percent                  // +5-15% - extends effective range
```

#### Generalized Damage Type System
```javascript
// Supported damage types: physical, fire, ice, electric, earth, nature
// System is extensible - new damage types can be added easily

// TYPE 1: Damage Conversion "+X% Damage as [DamageType]"
// Converts base physical damage to specified damage type
// Example: 100 physical + "25% Damage as Fire" = 100 physical + 25 fire
damage_conversion_percent: [
  { type: 'fire', value: 0.25 },        // +25% damage as fire
  { type: 'ice', value: 0.15 }          // +15% damage as ice
]
// Value ranges: Weapons: +10-25%, Armor: +5-15%, Skills: +10-30%

// TYPE 2: Flat Damage Addition "+X [DamageType] Damage"
// Adds fixed damage of specified type to each attack
// Example: Any attack gains +15 fire damage
damage_flat: [
  { type: 'fire', value: 15 },          // +15 fire damage
  { type: 'electric', value: 8 }        // +8 electric damage  
]
// Value ranges: Weapons: +15-50, Armor: +5-25, Skills: +10-40

// TYPE 3: Damage Type Multiplier "+X% [DamageType] Damage"
// Multiplies existing damage of matching type
// Example: 25 existing fire damage × 100% Fire Damage = 50 fire damage  
damage_percent: [
  { type: 'fire', value: 1.00 },        // +100% fire damage (doubles it)
  { type: 'nature', value: 0.50 }       // +50% nature damage
]
// Value ranges: Weapons: +20-50%, Armor: +10-30%, Skills: +15-40%
```

#### Generalized Defensive System
```javascript
// Health & Survivability
health                         // +20-200 flat health
health_percent                 // +2-8% health multiplier  
health_regen                   // +5-25 HP/sec regeneration
damage_reduction_percent       // +1-5% damage reduction (all sources)

// Energy Shield System  
shield_capacity                // +10-150 flat shield increase
shield_capacity_percent        // +2-10% shield multiplier
shield_delay_reduction_percent // +5-30% faster shield regen start (cap: 50%)
shield_regen_rate_percent      // +10-50% faster shield regen (cap: 300%)

// Generalized Resistance System
// Supports all damage types: physical, fire, ice, electric, earth, nature
resistance_percent: [
  { type: 'physical', value: 0.15 },    // +15% physical resistance (armor equivalent)
  { type: 'fire', value: 0.25 },        // +25% fire resistance  
  { type: 'all_elemental', value: 0.05 } // +5% all elemental resistance
]
// Value ranges: +2-15% per element, +1-5% for all elemental

// Status Effect Resistances (generalized)
status_resistance_percent: [
  { type: 'burn', value: 0.30 },        // +30% burn resistance
  { type: 'freeze', value: 0.25 },      // +25% freeze resistance
  { type: 'shock', value: 0.20 },       // +20% shock resistance
  { type: 'all_status', value: 0.15 }   // +15% all status effects
]
```

#### Movement & Mobility
```javascript
movement_speed_percent         // +2-8% base movement speed
sprint_speed_percent           // +3-10% sprint speed  
slide_speed_percent            // +10-30% slide speed (cap: 200%)
slide_duration_percent         // +10-40% slide duration (cap: 400%)
```

#### Combat Effects & Utilities
```javascript
// Ammo & Combat Effects
ammo_reserve_percent           // +10-30% total ammo capacity
ammo_return_on_crit            // 1-3 bullets returned on critical
explosive_rounds_chance        // 5-15% chance for explosive rounds
ricochet_rounds                // Bounces to 1-2 enemies
life_on_kill                   // +10-50 health restored on kill
shield_on_kill                 // +10-30 shield restored on kill
cooldown_on_kill_percent       // +2-5% instant CDR on kill
cooldown_on_weakspot_percent   // +0.5-2% instant CDR on weakspot hit
cooldown_on_critical_percent   // +0.5-1.5% instant CDR on critical hit

// Generalized Status Effect System
// Status types: burn, freeze, shock, fracture, toxin (mapped to damage types)
// Each status has: buildup rate, trigger threshold, power, duration

status_buildup_rate_percent: [
  { type: 'burn', value: 0.25 },        // +25% faster burn buildup
  { type: 'freeze', value: 0.20 },      // +20% faster freeze buildup  
  { type: 'all_status', value: 0.15 }   // +15% faster all status buildup
]

status_power_percent: [
  { type: 'burn', value: 0.35 },        // +35% stronger burn effects
  { type: 'toxin', value: 0.30 },       // +30% stronger toxin effects
  { type: 'all_status', value: 0.20 }   // +20% stronger all status effects
]

status_duration_percent: [
  { type: 'freeze', value: 0.50 },      // +50% longer freeze duration
  { type: 'all_status', value: 0.25 }   // +25% longer all status duration
]

// Status trigger thresholds (advanced)
status_threshold_reduction_percent: [
  { type: 'burn', value: 0.20 },        // -20% buildup needed to trigger burn
  { type: 'all_status', value: 0.10 }   // -10% buildup needed for all status
]
```

#### Resource Management  
```javascript
ability_damage_percent         // +3-12% ability damage multiplier
energy_max                     // +10-50 flat energy increase
energy_regen                   // +1-5 energy per second
ability_cdr_percent            // +6% ability cooldown reduction
ultimate_cdr_percent           // +8% ultimate cooldown reduction  
grenade_cdr_percent            // +5% grenade cooldown reduction
class_ability_cdr_percent      // +5% class ability cooldown reduction
all_cdr_percent               // +3% all cooldown reduction (rare)
```

#### Skill Parser Implementation Examples
```javascript
// Parse skill descriptions to extract stat modifiers (aligned with unified stat system)
const skillModifiers = {
  // Basic combat stats
  'outlaw_dead_eye': {
    stats: [{ name: 'critical_strike_chance_percent', value: 0.05, perLevel: true }]
  },
  'infiltrator_assassin_edge': {
    stats: [
      { name: 'critical_strike_chance_percent', value: 0.05, perLevel: true },
      { name: 'critical_strike_damage_percent', value: 0.15, perLevel: true }
    ]
  },
  'outlaw_quick_hands': {
    stats: [
      { name: 'reload_speed_percent', value: 0.10, perLevel: true },
      { name: 'handling_percent', value: 0.05, perLevel: true } // weapon swap speed
    ]
  },

  // Elemental damage modifiers (TYPE 3: Multiplier) - Generalized
  'fire_combustion_mastery': {
    stats: [{ 
      name: 'damage_percent', 
      value: 0.10, 
      perLevel: true,
      damageType: 'fire'
    }]
  },
  'ice_cryogenic_mastery': {
    stats: [{ 
      name: 'damage_percent', 
      value: 0.10, 
      perLevel: true,
      damageType: 'ice'
    }]
  },

  // Elemental resistances - Generalized
  'fire_heat_resistance': {
    stats: [{ 
      name: 'resistance_percent', 
      value: 0.25, 
      perLevel: true,
      damageType: 'fire'
    }]
  },
  'ice_cold_resistance': {
    stats: [{ 
      name: 'resistance_percent', 
      value: 0.25, 
      perLevel: true,
      damageType: 'ice'
    }]
  },

  // Defensive stats
  'sentinel_shield_core': {
    stats: [{ name: 'shield_capacity_percent', value: 0.15, perLevel: true }]
  },
  'sentinel_natural_armor': {
    stats: [{ name: 'damage_reduction_percent', value: 0.05, perLevel: true }]
  },

  // Movement stats
  'infiltrator_elusive': {
    stats: [
      { name: 'movement_speed_percent', value: 0.10, perLevel: false, maxLevel: 1 },
      { name: 'movement_speed_percent', value: 0.20, perLevel: false, minLevel: 2, condition: 'after_kill' }
    ]
  },

  // Custom class stats (flat bonuses)
  'doctor_totem_fundamentals': {
    stats: [{ name: 'totem_limit', value: 1, perLevel: true }] // flat bonus, not percentage
  }
}
```

#### Generalized Calculation System

##### Data Storage Structure
```javascript
// Character stats stored as arrays of typed modifiers
character_stats = {
  character_id: 123,
  
  // Simple modifiers (single values)
  weapon_damage_percent: 0.15,           // +15% weapon damage
  critical_strike_chance_percent: 0.08,  // +8% crit chance
  
  // Typed modifiers (arrays with type specification)
  damage_conversion_percent: [
    { type: 'fire', value: 0.25 },       // +25% damage as fire
    { type: 'ice', value: 0.10 }         // +10% damage as ice
  ],
  
  resistance_percent: [
    { type: 'physical', value: 0.20 },   // +20% physical resistance (armor)
    { type: 'fire', value: 0.30 },       // +30% fire resistance
    { type: 'all_elemental', value: 0.05 } // +5% all elemental resistance
  ],
  
  status_buildup_rate_percent: [
    { type: 'burn', value: 0.25 },       // +25% faster burn buildup
    { type: 'all_status', value: 0.15 }  // +15% faster all status buildup
  ]
}
```

##### Calculation Functions
```javascript
// 1. Skill Bonus Calculator - aggregates bonuses from all purchased skills
function calculateSkillBonuses(characterId) {
  const purchasedSkills = getPurchasedSkills(characterId);
  const aggregatedBonuses = {};
  
  purchasedSkills.forEach(skill => {
    const modifiers = getSkillModifiers(skill.skill_id);
    const skillLevel = skill.level;
    
    modifiers.forEach(modifier => {
      const bonusValue = modifier.perLevel ? 
        modifier.value * skillLevel : modifier.value;
        
      if (modifier.damageType) {
        // Handle typed modifiers
        aggregateTypedBonus(aggregatedBonuses, modifier.name, {
          type: modifier.damageType,
          value: bonusValue
        });
      } else {
        // Handle simple modifiers
        aggregatedBonuses[modifier.name] = 
          (aggregatedBonuses[modifier.name] || 0) + bonusValue;
      }
    });
  });
  
  return aggregatedBonuses;
}

// 2. Stat Updater - updates character_stats with new skill bonuses
function updateCharacterStats(characterId, skillBonuses) {
  // Update simple modifiers
  Object.keys(skillBonuses).forEach(statName => {
    if (Array.isArray(skillBonuses[statName])) {
      // Handle typed modifiers
      updateTypedStat(characterId, statName, skillBonuses[statName]);
    } else {
      // Handle simple modifiers
      updateSingleStat(characterId, statName, skillBonuses[statName]);
    }
  });
  
  // Recalculate total values
  recalculateTotalStats(characterId);
}

// 3. Damage Calculation Engine
function calculateDamageOutput(baseDamage, characterStats) {
  let damage = { physical: baseDamage };
  
  // Apply damage conversions
  characterStats.damage_conversion_percent?.forEach(conversion => {
    const convertedAmount = baseDamage * conversion.value;
    damage[conversion.type] = (damage[conversion.type] || 0) + convertedAmount;
  });
  
  // Apply flat damage additions
  characterStats.damage_flat?.forEach(addition => {
    damage[addition.type] = (damage[addition.type] || 0) + addition.value;
  });
  
  // Apply damage type multipliers
  characterStats.damage_percent?.forEach(multiplier => {
    if (damage[multiplier.type]) {
      damage[multiplier.type] *= (1 + multiplier.value);
    }
  });
  
  return damage;
}
```

##### Benefits of Generalized System
1. **Extensible**: New damage types, status effects, or resistances can be added without code changes
2. **Consistent**: Same calculation logic applies to all damage/resistance types  
3. **Maintainable**: Single codebase handles all elemental interactions
4. **Flexible**: Supports complex modifier combinations and interactions
5. **Armor Integration**: Physical resistance treated same as elemental resistances

#### Database Operations
```sql
-- Update skill bonuses for a character
UPDATE character_stats 
SET skill_bonus = ?, total_value = base_value + equipment_bonus + ?, last_calculated = CURRENT_TIMESTAMP 
WHERE character_id = ? AND stat_name = ?

-- Insert new stat if it doesn't exist
INSERT OR REPLACE INTO character_stats (character_id, stat_name, skill_bonus, total_value)
VALUES (?, ?, ?, ?)
```

### Phase 2: Weapon-Specific Modifiers
- Add weapon type checking to conditionally apply bonuses
- Stats like `smg_damage`, `shotgun_accuracy` that only apply with specific weapons
- Integration with equipment system to determine active weapon

### Phase 3: Conditional Modifiers  
- Context-aware bonuses that require game state
- "While near totems", proximity-based bonuses
- Situational modifiers that activate based on conditions

## Implementation Steps

### Step 1: Create Skill Parser
- Build comprehensive skill modifier database
- Parse existing skill descriptions into structured data
- Handle per-level scaling and multi-stat skills

### Step 2: Character Stat Calculator
- Function to calculate skill bonuses for a character
- Query character's purchased skills and their levels  
- Apply appropriate modifiers and sum totals

### Step 3: Database Integration
- API endpoint to recalculate character stats
- Auto-recalculation when skills change
- Integration with existing character stats system

### Step 4: Dashboard Display
- Show skill bonuses in character stats
- Display source attribution (which skills contribute)
- Visual indicators for skill-modified stats

### Step 5: Testing & Validation
- Verify calculations match skill descriptions
- Test with multiple characters and skill combinations
- Performance testing for stat recalculation

## Skill Cataloging Status

### Phase 1 Skills Identified (Basic Stat Modifiers)
Based on database analysis, here are the passive stat-modifying skills ready for implementation:

#### Outlaw Skills
- `outlaw_dead_eye`: +5% critical strike chance per level (max 3 levels = 15%)
- `outlaw_quick_hands`: +10% reload speed, +5% handling per level (max 3 levels)  
- `outlaw_steady_aim`: +8% accuracy, +10% range per level (max 3 levels)
- `outlaw_hair_trigger`: +7% fire rate, -5% recoil per level (max 3 levels)

#### Infiltrator Skills  
- `infiltrator_assassin_edge`: +5% crit chance, +15% crit damage per level (max 3 levels)
- `infiltrator_elusive`: +10% movement speed while crouched (level 1), +20% movement speed after kill (level 2)
- `infiltrator_shadow_affinity`: +10% stealth duration, -15% detection range per level (max 3 levels)

#### Sentinel Skills
- `sentinel_shield_core`: +15% shield capacity per level (max 3 levels) 
- `sentinel_natural_armor`: +5% damage reduction per level (max 3 levels)
- `sentinel_fortification`: +10% shield recharge rate, -1s recharge delay per level (max 3 levels)

#### Doctor Skills
- `doctor_totem_fundamentals`: +1 active totem limit per level (max 3 levels, base 1 → max 4)
- `doctor_field_medic`: +15% totem effect radius, +10% effect power per level (max 3 levels)
- `doctor_combat_training`: +25% weapon damage while near totems (level 1)

#### Elemental Skills (All Classes)
- `fire_combustion_mastery`: +10% fire damage per level (max 3 levels)
- `fire_heat_resistance`: +25% fire resistance per level (max 2 levels) 
- `ice_cryogenic_mastery`: +10% ice damage per level (max 3 levels)
- `ice_cold_resistance`: +25% ice resistance per level (max 2 levels)
- `electric_electrical_mastery`: +10% electric damage per level (max 3 levels)  
- `electric_conductivity`: +25% electric resistance per level (max 2 levels)
- `earth_geological_mastery`: +15% earth damage, +20%/35%/50% damage reduction per level (max 3 levels)
- `nature_natural_mastery`: +10% nature damage, +25%/50%/75% healing effectiveness per level (max 3 levels)

**Total Phase 1 Skills**: ~20 skills covering all core stat types

## Questions for Clarification

1. **Implementation Priority**: Should we start with all Phase 1 skills, or begin with a subset like:
   - Just class skills first (outlaw, infiltrator, sentinel, doctor)?
   - Just elemental damage/resistance skills?
   - A mixed sample for testing?

2. **Calculation Timing**: When should we recalculate stats?
   - Every page load? (simple but potentially slower)
   - Only when skills change? (efficient but requires tracking)
   - On-demand via API call? (manual but predictable)

3. **Dashboard Integration**: How should skill bonuses appear on the dashboard?
   - Show in existing character stats with "(+X from skills)" notation?
   - Separate "Skill Bonuses" section?
   - Expandable details showing which skills contribute?

4. **Conditional Skills**: How should we handle skills with conditions like "while near totems"?
   - Skip them for Phase 1?
   - Implement as always-active for now?
   - Add context parameter to skill calculation system?

5. **Value Storage**: Should skill bonuses in the database be:
   - Stored as percentages (5.0 for 5%)?  
   - Stored as decimals (0.05 for 5%)?
   - **Recommendation**: Use decimals to match unified stat system calculations

## Success Criteria
- Skills with stat modifiers automatically affect character stats
- Dashboard shows updated stats with skill bonuses applied
- System handles skill rank changes in real-time
- Performance remains acceptable with full skill trees
- Easy to extend for new skills and stat types