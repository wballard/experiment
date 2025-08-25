# Character System Implementation Specification

> **⚠️ MANDATORY REFERENCE DOCUMENTS**  
> - [comprehensive-character-stats-complete.md](./comprehensive-character-stats-complete.md) - **113 APPROVED STATS ONLY**
> - [character-stat-system-redesign.md](./character-stat-system-redesign.md) - **Technical Architecture**
> 
> **🚫 NO DEVIATIONS WITHOUT EXPLICIT APPROVAL**

## 🔒 IMPLEMENTATION CONSTRAINTS

### **✅ ALLOWED STATS (113 ONLY - NO ADDITIONS)**

**Use ONLY these stats from comprehensive-character-stats-complete.md:**

#### **Primary Attributes (5 only)**
```javascript
vitality, precision, potency, alacrity, defense
// NO: vigor, focus, force, momentum, resonance, capacity
```

#### **Typed Systems (Use Arrays)**
```javascript
// ✅ CORRECT: Flexible typed arrays
damage_percent = [{ type: 'fire', value: 0.35 }]
weapon_type_damage_percent = [{ type: 'sniper', value: 0.20 }]

// ❌ WRONG: Individual hardcoded stats  
fire_damage_percent = 0.35
sniper_damage_percent = 0.20
```

#### **Equipment Slot System (11 slots only)**
```javascript
// ✅ APPROVED SLOTS (DO NOT ADD MORE)
primary, secondary, head, shoulders, chest, gloves, legs, back, trinket, catalyst, attachment
```

### **❌ ABSOLUTELY FORBIDDEN**

#### **Energy/Resource System**
```javascript
// ❌ DO NOT IMPLEMENT
max_energy, energy_regeneration, energy_efficiency, power_costs
// All abilities use cooldown system only
```

#### **Player Attribute Allocation**
```javascript
// ❌ DO NOT IMPLEMENT
allocateAttributePoints(), spendAttributePoints(), attributePointsRemaining
// Attributes come from equipment + skills ONLY
```

#### **Random New Stats**
```javascript
// ❌ DO NOT CREATE
luck, karma, reputation, faction_standing, crafting_skill
// Use only the approved 113 stats
```

#### **Extra Equipment Slots**
```javascript
// ❌ DO NOT ADD
rings, bracers, belt, boots, weapon_mod_1, weapon_mod_2
// Use only the approved 11 slots
```

---

## 🔧 REQUIRED IMPLEMENTATION PATTERNS

### **Equipment Modifier Structure**
```javascript
// ✅ MANDATORY STRUCTURE
{
    id: 1234,
    name: "Plasma Rifle MK-VII",
    slot: "primary", // Must be one of 11 approved slots
    power_cost: 45,
    
    // Attribute bonuses (affects primary attributes)
    main_modifiers: {
        potency: 25,     // +25 potency attribute
        precision: 15    // +15 precision attribute
    },
    
    // Typed modifiers (uses flexible arrays)
    extra_modifiers: [
        {
            name: 'damage_percent',
            value: 0.35,
            damageType: 'fire'  // Creates damage_percent[fire] entry
        },
        {
            name: 'weapon_type_damage_percent', 
            value: 0.20,
            weaponType: 'sniper' // Creates weapon_type_damage[sniper] entry
        }
    ]
}
```

### **Skill Modifier Integration**
```javascript
// ✅ USE EXISTING SYSTEM (skill-modifiers.js)
window.SkillModifiers.calculateSkillBonuses(purchasedSkills)

// ✅ APPROVED PATTERN
{
    name: 'damage_percent',
    value: 0.10,
    perLevel: true,
    damageType: 'fire'  // Integrates with typed system
}
```

### **Stat Calculation Formula (MANDATORY)**
```javascript
// ✅ REQUIRED FORMULA FOR ALL STATS
final_stat = base_value + equipment_bonus + skill_bonus

// ✅ TYPED MODIFIERS AGGREGATION
damage_percent = [
    { type: 'fire', value: equipment_fire + skill_fire },
    { type: 'ice', value: equipment_ice + skill_ice }
]
```

### **Database Storage Pattern**
```sql
-- ✅ REQUIRED character_stats TABLE PATTERN
INSERT INTO character_stats (character_id, stat_name, stat_value, stat_type) VALUES
(1, 'vitality', 45, 'attribute'),
(1, 'health', 325, 'derived'),
(1, 'damage_percent', '{"type":"fire","value":0.35}', 'typed'),
(1, 'weapon_type_damage_percent', '{"type":"sniper","value":0.20}', 'typed');
```

---

## 🚨 MIGRATION REQUIREMENTS

### **Phase 1: Deprecate Old Stats**
```javascript
// ❌ REMOVE THESE (Dashboard currently uses)
vigor, focus, force, momentum, resonance, toughness

// ✅ REPLACE WITH (From comprehensive document)
vitality, precision, potency, alacrity, defense
```

### **Phase 2: Convert Individual Stats to Typed**
```javascript
// ❌ REMOVE individual stats
fire_damage_percent, ice_damage_percent, electric_damage_percent

// ✅ REPLACE with typed array
damage_percent = [
    { type: 'fire', value: X },
    { type: 'ice', value: Y }, 
    { type: 'electric', value: Z }
]
```

### **Phase 3: Implement Event System**
```javascript
// ✅ APPROVED EVENTS ONLY (No attribute allocation)
'levelup', 'skillchange', 'equipitem', 'unequipitem', 'statrecalculation', 'paragonlevel'
```

---

## 🔍 CODE REVIEW CHECKLIST

### **Before ANY Character System Changes:**

- [ ] **Stat is in approved 113 list** (comprehensive-character-stats-complete.md)
- [ ] **No energy system references** (max_energy, energy_regen, etc.)
- [ ] **No player attribute allocation** (allocatePoints, spendPoints, etc.)
- [ ] **Uses typed arrays** instead of individual stats
- [ ] **Equipment uses 9 approved slots only**
- [ ] **Uses bidirectional +/- modifiers**
- [ ] **Integrates with existing skill-modifiers.js**
- [ ] **Follows base + equipment + skills formula**

### **Red Flags (Immediate Rejection):**
- Adding new stats not in the 113
- Creating new equipment slots
- Implementing energy/resource systems
- Adding player attribute allocation
- Using individual stats instead of typed arrays
- Creating hardcoded damage/resistance calculations

---

## 💡 IMPLEMENTATION EXAMPLES

### **Dashboard Stat Display**
```javascript
// ✅ CORRECT: Read from typed system
const fireResistance = character.resistance_percent.find(r => r.type === 'fire')?.value || 0;

// ❌ WRONG: Hardcoded individual stat
const fireResistance = character.fire_resistance_percent;
```

### **Equipment Bonus Calculation**
```javascript
// ✅ CORRECT: Aggregate typed modifiers
function calculateEquipmentBonuses(equippedItems) {
    const bonuses = { damage_percent: [] };
    
    equippedItems.forEach(item => {
        item.extra_modifiers.forEach(mod => {
            if (mod.name === 'damage_percent') {
                bonuses.damage_percent.push({
                    type: mod.damageType,
                    value: mod.value
                });
            }
        });
    });
    
    return bonuses;
}
```

### **Stat Recalculation Trigger**
```javascript
// ✅ CORRECT: Event-driven recalculation
async function onEquipmentChange(characterId, eventData) {
    await CharacterEventProcessor.processEvent(characterId, 'equipitem', eventData);
    // Automatically recalculates ALL 113 stats
}
```

---

## 🎯 SUCCESS CRITERIA

**Implementation is complete when:**

1. **All 113 stats** from comprehensive document are calculated
2. **Zero hardcoded individual stats** remain
3. **No energy system** exists anywhere
4. **No player attribute allocation** in UI or backend
5. **All equipment uses 9 slots only**
6. **All modifiers use typed arrays**
7. **Event system handles all stat changes**
8. **Bidirectional +/- modifiers work**

This specification ensures consistent implementation aligned with the approved character system design.