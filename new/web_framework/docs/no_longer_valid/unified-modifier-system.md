# Unified Modifier System - All Stats Modifiable by All Sources

## Core Principle

**Every character stat should be modifiable by:**
1. **Core Attributes** (player-allocated points)
2. **Skills** (passive bonuses from skill investments)
3. **Equipment Main Modifiers** (primary stat bonuses on items)
4. **Equipment Extra Modifiers** (secondary/tertiary stat bonuses on items)

## Complete Stat Registry

### **Base Formula for Every Stat:**
```
final_stat = base_value + attribute_bonus + skill_bonus + equipment_main_bonus + equipment_extra_bonus
```

### **Primary Attributes (Player-Allocated)**
```
vitality          = 20 + allocated_points     (affects health, shields, regen)
precision         = 20 + allocated_points     (affects crit, accuracy)  
potency          = 20 + allocated_points     (affects damage, status effects)
alacrity         = 20 + allocated_points     (affects speed, cooldowns)
capacity         = 20 + allocated_points     (affects energy, abilities)
defense          = 20 + allocated_points     (affects armor, resistances)
```

### **Health & Survivability**
```
health                    = 100 + (vitality × 5) + skill_bonus + equipment_bonus
shield_capacity          = 50 + (vitality × 2) + skill_bonus + equipment_bonus
health_regeneration      = 1.0 + (vitality × 0.1) + skill_bonus + equipment_bonus
damage_reduction_percent = 0 + (defense × 0.1) + skill_bonus + equipment_bonus
```

**Modifier Examples:**
- **Skills:** "Tough Skin +15% damage reduction", "Regeneration +5 health/sec"
- **Equipment Main:** "Heavy Armor: +25% damage reduction"  
- **Equipment Extra:** "+50 health", "+10% health regeneration"

### **Critical Strike System**
```
critical_chance_percent  = 5.0 + (precision × 0.5) + skill_bonus + equipment_bonus    [CAP: 50%]
critical_damage_percent  = 150.0 + (precision × 0.2) + skill_bonus + equipment_bonus
accuracy_percent         = 75.0 + (precision × 1.0) + skill_bonus + equipment_bonus
weak_spot_damage_percent = 200.0 + skill_bonus + equipment_bonus
```

**Modifier Examples:**
- **Skills:** "Dead Eye +5% crit chance per level", "Lucky Shot +25% crit damage"
- **Equipment Main:** "Sniper Scope: +15% critical chance"
- **Equipment Extra:** "+8% critical damage", "+12% accuracy"

### **Damage System**
```
all_damage_percent       = 0 + (potency × 0.8) + skill_bonus + equipment_bonus
weapon_damage_percent    = 0 + skill_bonus + equipment_bonus
ability_damage_percent   = 0 + (capacity × 0.5) + skill_bonus + equipment_bonus
melee_damage_percent     = 0 + skill_bonus + equipment_bonus
```

**Modifier Examples:**
- **Skills:** "Weapon Mastery +12% weapon damage", "Power Strike +20% melee damage"
- **Equipment Main:** "High-Caliber Rounds: +35% weapon damage"
- **Equipment Extra:** "+15% all damage", "+8% ability damage"

### **Elemental Damage (All Typed)**
```
fire_damage_percent      = 0 + skill_bonus + equipment_bonus
ice_damage_percent       = 0 + skill_bonus + equipment_bonus  
electric_damage_percent  = 0 + skill_bonus + equipment_bonus
nature_damage_percent    = 0 + skill_bonus + equipment_bonus
earth_damage_percent     = 0 + skill_bonus + equipment_bonus
```

**Modifier Examples:**
- **Skills:** "Fire Mastery +15% fire damage per level", "Lightning Rod +25% electric damage"
- **Equipment Main:** "Flame Enchanted: +40% fire damage"
- **Equipment Extra:** "+12% ice damage", "+8% nature damage"

### **Speed & Attack System**  
```
attack_speed_percent     = 0 + (alacrity × 0.4) + skill_bonus + equipment_bonus
movement_speed_percent   = 100 + (alacrity × 0.4) + skill_bonus + equipment_bonus
reload_speed_percent     = 100 + skill_bonus + equipment_bonus
fire_rate_percent        = 100 + skill_bonus + equipment_bonus
cooldown_reduction_percent = 0 + (alacrity × 0.2) + skill_bonus + equipment_bonus
```

**Modifier Examples:**
- **Skills:** "Quick Hands +15% reload speed", "Hair Trigger +20% fire rate"
- **Equipment Main:** "Lightweight Frame: +25% attack speed"
- **Equipment Extra:** "+10% movement speed", "+15% cooldown reduction"

### **Energy & Resource System**
```
max_energy               = 100 + (capacity × 3) + skill_bonus + equipment_bonus
energy_regeneration      = 2.0 + (capacity × 0.2) + skill_bonus + equipment_bonus
power_efficiency_percent = 100 + skill_bonus + equipment_bonus
```

**Modifier Examples:**
- **Skills:** "Energy Conduit +50 max energy", "Efficient Systems -10% power costs"
- **Equipment Main:** "Power Core: +100 max energy"
- **Equipment Extra:** "+25 max energy", "+15% energy regeneration"

### **All Resistances (Capped at 75%)**
```
fire_resistance_percent     = 0 + (defense × 0.2) + skill_bonus + equipment_bonus    [CAP: 75%]
ice_resistance_percent      = 0 + (defense × 0.2) + skill_bonus + equipment_bonus    [CAP: 75%]
electric_resistance_percent = 0 + (defense × 0.2) + skill_bonus + equipment_bonus    [CAP: 75%]
nature_resistance_percent   = 0 + (defense × 0.2) + skill_bonus + equipment_bonus    [CAP: 75%]
earth_resistance_percent    = 0 + (defense × 0.2) + skill_bonus + equipment_bonus    [CAP: 75%]
physical_resistance_percent = 0 + (defense × 0.2) + skill_bonus + equipment_bonus    [CAP: 75%]
```

**Modifier Examples:**
- **Skills:** "Heat Resistance +25% fire resistance", "Grounding +20% electric resistance"
- **Equipment Main:** "Insulated Armor: +30% electric resistance"  
- **Equipment Extra:** "+15% fire resistance", "+10% all resistances"

### **Status Effect System**
```
status_effect_chance_percent    = 0 + (potency × 0.3) + skill_bonus + equipment_bonus
status_effect_duration_percent  = 100 + (potency × 0.1) + skill_bonus + equipment_bonus
stun_resistance_percent         = 0 + skill_bonus + equipment_bonus
slow_resistance_percent         = 0 + skill_bonus + equipment_bonus  
poison_resistance_percent       = 0 + skill_bonus + equipment_bonus
burn_resistance_percent         = 0 + skill_bonus + equipment_bonus
freeze_resistance_percent       = 0 + skill_bonus + equipment_bonus
```

**Modifier Examples:**
- **Skills:** "Status Master +20% status chance", "Immunity +50% poison resistance"
- **Equipment Main:** "Venomous: +25% poison chance"
- **Equipment Extra:** "+15% stun resistance", "+10% status duration"

### **Weapon-Specific Stats**
```
weapon_range_percent        = 100 + skill_bonus + equipment_bonus
armor_penetration_percent   = 0 + skill_bonus + equipment_bonus
magazine_size_percent       = 100 + skill_bonus + equipment_bonus
ammo_efficiency_percent     = 100 + skill_bonus + equipment_bonus
```

**Modifier Examples:**
- **Skills:** "Marksman +25% weapon range", "Piercing Shot +15% armor penetration"  
- **Equipment Main:** "Extended Barrel: +40% range"
- **Equipment Extra:** "+20% magazine size", "+10% armor penetration"

---

## Implementation Architecture

### **Modifier Source System**
```javascript
class ModifierSource {
    // Core attributes provide base scaling
    getAttributeModifiers(attributes) {
        return {
            health: attributes.vitality * 5,
            critical_chance_percent: attributes.precision * 0.5,
            all_damage_percent: attributes.potency * 0.8,
            attack_speed_percent: attributes.alacrity * 0.4,
            max_energy: attributes.capacity * 3,
            fire_resistance_percent: attributes.defense * 0.2
            // ... all attribute->stat mappings
        };
    }
    
    // Skills provide specific bonuses
    getSkillModifiers(purchasedSkills) {
        // Use existing skill-modifiers.js system
        return SkillModifiers.calculateSkillBonuses(purchasedSkills);
    }
    
    // Equipment provides main + extra modifiers  
    getEquipmentModifiers(equippedItems) {
        const modifiers = {};
        
        equippedItems.forEach(item => {
            // Main modifiers (primary item purpose)
            if (item.main_modifiers) {
                this.addModifiers(modifiers, item.main_modifiers);
            }
            
            // Extra modifiers (secondary bonuses)
            if (item.extra_modifiers) {
                this.addModifiers(modifiers, item.extra_modifiers);
            }
        });
        
        return modifiers;
    }
}
```

### **Stat Calculator Engine**
```javascript
class StatCalculator {
    calculateAllStats(characterId) {
        const attributes = this.getAttributeAllocation(characterId);
        const skills = this.getPurchasedSkills(characterId);  
        const equipment = this.getEquippedItems(characterId);
        
        const attributeModifiers = ModifierSource.getAttributeModifiers(attributes);
        const skillModifiers = ModifierSource.getSkillModifiers(skills);
        const equipmentModifiers = ModifierSource.getEquipmentModifiers(equipment);
        
        const finalStats = {};
        
        // For each stat in the registry
        STAT_REGISTRY.forEach(statDef => {
            finalStats[statDef.name] = this.calculateStat(
                statDef.name,
                statDef.base_value,
                attributeModifiers,
                skillModifiers, 
                equipmentModifiers,
                statDef.cap
            );
        });
        
        return finalStats;
    }
    
    calculateStat(statName, baseValue, ...modifierSources) {
        let total = baseValue;
        
        modifierSources.forEach(source => {
            if (source[statName]) {
                total += source[statName];
            }
        });
        
        // Apply cap if defined
        if (statDef.cap && total > statDef.cap) {
            total = statDef.cap;
        }
        
        return total;
    }
}
```

### **Equipment Modifier Examples**
```javascript
// Example weapon with main + extra modifiers
{
    id: 1234,
    name: "Plasma Rifle MK-VII",
    type: "weapon",
    power_cost: 45,
    main_modifiers: {
        // Primary purpose of this weapon
        weapon_damage_percent: 35,
        fire_damage_percent: 25
    },
    extra_modifiers: {
        // Secondary bonuses (random rolls)
        critical_chance_percent: 8,
        reload_speed_percent: 15,
        fire_resistance_percent: 10
    }
}

// Example armor with main + extra modifiers  
{
    id: 5678,
    name: "Reinforced Combat Vest",
    type: "armor", 
    slot: "chest",
    power_cost: 30,
    main_modifiers: {
        // Primary purpose of this armor
        health: 150,
        damage_reduction_percent: 20
    },
    extra_modifiers: {
        // Secondary bonuses
        movement_speed_percent: 5,
        stun_resistance_percent: 25,
        max_energy: 40
    }
}
```

---

## Benefits of Unified Modifier System

1. **Complete Flexibility** - Every stat can be influenced by every source
2. **Emergent Builds** - Unexpected combinations create unique playstyles  
3. **Meaningful Choices** - All equipment/skills/attributes have potential value
4. **Easy Expansion** - New stats/modifiers integrate seamlessly
5. **Clear Math** - Simple additive system (base + all bonuses)
6. **Balanced Scaling** - Caps prevent broken combinations
7. **Player Agency** - Every choice affects multiple stats in interesting ways

This creates a truly dynamic character system where your sniper rifle could have "+15% movement speed", your armor could boost "+10% critical damage", and your fire skills could provide "+25% reload speed" - enabling infinite build variety and meaningful itemization choices.