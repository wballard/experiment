# Character Stat System Redesign Specification

> **📋 Reference Documents:**  
> - [comprehensive-character-stats-complete.md](./comprehensive-character-stats-complete.md) - **113 APPROVED STATS ONLY**  
> - [character-system-implementation-spec.md](./character-system-implementation-spec.md) - **MANDATORY IMPLEMENTATION RULES**

## Current State vs. Ideal State Analysis

### Character Stats

#### **Current Implementation** (Dashboard)
The dashboard currently uses 6 primary attributes + 2 secondary stats:

- **Primary Attributes:**
  - `vigor` - Health-related (250 + level*15 base)
  - `focus` - Mental/skills (300 + level*10 base) 
  - `force` - Physical strength (220 + level*12 base)
  - `momentum` - Speed/agility (180 + level*8 base)
  - `resonance` - Elemental affinity (200 + level*10 base)
  - `defense` - Defensive capability (150 + level*7 base)

- **Secondary Stats:**
  - `precision` - Mapped to accuracy 
  - `toughness` - Mapped to armor

**Problems:**
- Names don't match the official spec
- Scaling formulas are arbitrary 
- No equipment or skill-based attribute system
- Stats are calculated, not stored
- Inconsistent naming across codebase
- Uses hardcoded individual stats instead of flexible typed systems

#### **Specification Requirements** (From comprehensive-character-stats-complete.md)
The corrected system defines 5 primary attributes (no energy/capacity system):

- **Vitality** - Health & Survivability (+5 Health, +2 Shield, +0.1 Health Regen per point)
- **Precision** - Critical & Accuracy (+0.5% Crit, +1% Accuracy, +0.2% Crit Damage per point)
- **Potency** - Raw Damage & Status (+0.8% All Damage, +0.3% Status Chance, +0.1% Status Duration per point)
- **Alacrity** - Speed & Agility (+0.4% Attack Speed, +0.4% Move Speed, +0.2% Cooldown Reduction per point)
- **Defense** - Defense & Resistances (+0.2% All Resistance, +1 Armor, +0.1% Damage Reduction per point)

**Core System Requirements:**
- **NO player attribute allocation** - attributes come from equipment and skills only
- **Bidirectional +/- modifier system** - all percentage stats can increase or decrease
- **Flexible typed systems** - damage_percent[fire], weapon_type_damage[sniper], etc.
- **Cooldown-based abilities** - no energy/resource system

#### **Corrected System Architecture**

**Primary Attributes** (Equipment + Skills Only - NO Player Allocation):
```javascript
vitality    = 0 + equipment_bonus + skill_bonus    // Health & Survivability
precision   = 0 + equipment_bonus + skill_bonus    // Critical & Accuracy
potency     = 0 + equipment_bonus + skill_bonus    // Raw Damage & Status Effects
alacrity    = 0 + equipment_bonus + skill_bonus    // Speed & Agility
defense     = 0 + equipment_bonus + skill_bonus    // Defense & Resistances
```

**Flexible Typed Systems** (Examples from comprehensive document):
```javascript
// Flexible weapon damage system
weapon_type_damage_percent = [
    { type: 'sniper', value: 0 + equipment + skills },
    { type: 'shotgun', value: 0 + equipment + skills }
]

// Flexible elemental damage system  
damage_percent = [
    { type: 'fire', value: 0 + equipment + skills },
    { type: 'ice', value: 0 + equipment + skills }
]

// Flexible resistance system with status contribution
resistance_percent = [
    { type: 'fire', value: (defense * 0.2) + equipment + skills }
]
status_effect_resistance = [
    { type: 'burn', value: (resistance_percent[fire] * 0.5) + equipment + skills }
]
```

**Storage Requirements:**
- Calculate attributes from equipment + skill bonuses on-demand
- Store all 113 calculated stats in `character_stats` table for performance
- Use flexible typed modifier arrays for expandability

---

### Character Events System

#### **Current Implementation**
Only has basic database triggers:
- `update_power_on_level_up` - Updates power_max, skill points, last_played on level change

**Problems:**
- No unified event system
- No event tracking or history
- Limited reactive behavior 
- No event-driven stat recalculation
- Ad-hoc trigger approach doesn't scale

#### **Specification Requirements** 
Based on game logic, we need events for:
- Character progression (level up, paragon levels)
- Equipment changes (equip/unequip items)
- Skill changes (invest/respec skill points)
- Stat recalculation (when equipment/skills change attributes)

#### **Recommended Event System**

**Core Events:**
1. `levelup` - Character gains a level
2. `skillchange` - Skill point allocation changes  
3. `equipitem` - Item equipped to a slot
4. `unequipitem` - Item removed from a slot
5. `statrecalculation` - Equipment/skill changes affecting stats (replaces attributechange)
6. `paragonlevel` - Post-60 paragon progression (future)

**Event Processing Pipeline:**
```
Event Triggered → Validate Event → Update Database → Recalculate Stats → Notify Systems → Log Event
```

**Database Schema Addition:**
```sql
CREATE TABLE character_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    event_type TEXT NOT NULL, -- 'levelup', 'skillchange', 'equipitem', etc.
    event_data JSON NOT NULL, -- Event-specific data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters (id)
);
```

---

## Implementation Plan

### Phase 1: Database Schema Updates

1. **Add Attribute Calculation System**
```sql
-- Store calculated attributes from equipment + skills
INSERT OR REPLACE INTO character_stats (character_id, stat_name, total_value) VALUES 
(?, 'vitality', calculated_vitality),
(?, 'precision', calculated_precision),
(?, 'potency', calculated_potency),
(?, 'alacrity', calculated_alacrity), 
(?, 'capacity', calculated_capacity),
(?, 'defense', calculated_defense);
```

2. **Add Event System**
```sql
CREATE TABLE character_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSON NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters (id)
);

CREATE INDEX idx_character_events_character_id ON character_events(character_id);
CREATE INDEX idx_character_events_type ON character_events(event_type);
```

3. **Replace Level-up Trigger with Event-based System**
```sql
DROP TRIGGER update_power_on_level_up;

-- New trigger creates events instead of direct updates
CREATE TRIGGER character_level_change
AFTER UPDATE OF level ON characters
FOR EACH ROW
WHEN NEW.level != OLD.level
BEGIN
    INSERT INTO character_events (character_id, event_type, event_data)
    VALUES (NEW.id, 'levelup', json_object(
        'old_level', OLD.level,
        'new_level', NEW.level,
        'levels_gained', NEW.level - OLD.level
    ));
END;
```

### Phase 2: Backend Event Processing System

1. **Event Processor Class**
```javascript
class CharacterEventProcessor {
    async processEvent(characterId, eventType, eventData) {
        switch(eventType) {
            case 'levelup':
                await this.handleLevelUp(characterId, eventData);
                break;
            case 'skillchange':
                await this.handleSkillChange(characterId, eventData);
                break;
            case 'equipitem':
                await this.handleEquipItem(characterId, eventData);
                break;
            case 'unequipitem':
                await this.handleUnequipItem(characterId, eventData);
                break;
            case 'statrecalculation':
                await this.handleStatRecalculation(characterId, eventData);
                break;
        }
        await this.recalculateCharacterStats(characterId);
    }
}
```

2. **Stat Calculation Engine**
```javascript
class CharacterStatCalculator {
    async calculateAllStats(characterId) {
        const baseStats = await this.getBaseStats(characterId);
        const equipmentBonuses = await this.getEquipmentBonuses(characterId);
        const skillBonuses = await this.getSkillBonuses(characterId);
        
        // Calculate primary attributes first (no player allocation)
        const attributes = this.calculateAttributes(equipmentBonuses, skillBonuses);
        
        // Use comprehensive-character-stats-complete.md formulas
        return this.combineStatSources(baseStats, attributes, equipmentBonuses, skillBonuses);
    }
    
    calculateAttributes(equipmentBonuses, skillBonuses) {
        return {
            vitality: (equipmentBonuses.vitality || 0) + (skillBonuses.vitality || 0),
            precision: (equipmentBonuses.precision || 0) + (skillBonuses.precision || 0),
            potency: (equipmentBonuses.potency || 0) + (skillBonuses.potency || 0),
            alacrity: (equipmentBonuses.alacrity || 0) + (skillBonuses.alacrity || 0),
            defense: (equipmentBonuses.defense || 0) + (skillBonuses.defense || 0)
        };
    }
}
```

### Phase 3: Frontend Integration

1. **Update Dashboard to Use New System**
   - Replace hardcoded attribute calculations with API calls
   - Add attribute calculation system
   - Implement real-time stat updates via events

2. **Show Attribute Sources**  
   - Display which equipment and skills contribute to each attribute
   - Stat preview system
   - Respec functionality

3. **Event-driven UI Updates**
   - Listen for character events via WebSocket/polling
   - Update displays reactively when events occur
   - Show event history/notifications

### Phase 4: API Endpoints

1. **Character Stats API**
```
GET /api/characters/{id}/stats - Get all 113 calculated character stats
GET /api/characters/{id}/attributes - Get calculated attributes (equipment + skills)
GET /api/characters/{id}/events - Get character event history
POST /api/characters/{id}/events - Trigger character event
```

2. **Event Processing**
   - Background job processing for events
   - Real-time stat calculation updates
   - Event validation and conflict resolution

---

## Migration Strategy

### Step 1: Add New Tables (No Breaking Changes)
- Create `character_events` table
- Add equipment/skill-based attribute calculation system
- Keep existing system running

### Step 2: Implement Event System Backend
- Add event processing classes
- Add stat calculation engine  
- Add API endpoints
- Run in parallel with existing system

### Step 3: Frontend Migration
- Update dashboard to use new APIs
- Add attribute calculation display
- Maintain backward compatibility during transition

### Step 4: Replace Old System
- Remove old hardcoded calculations
- Remove old database triggers
- Switch to event-driven architecture
- Clean up deprecated code

---

## Benefits of This Approach

1. **Spec Compliance** - Matches official character system specification
2. **Event-Driven Architecture** - Reactive, scalable, debuggable
3. **Separation of Concerns** - Attributes (equipment + skills), derived stats (calculated), typed modifiers (flexible)
4. **Performance** - Calculated stats cached, only recalculated on events
5. **Flexibility** - Easy to add new event types and stat calculations
6. **Debuggability** - Event history shows exactly what happened when
7. **Real-time Updates** - UI can react immediately to character changes
8. **Future-Proof** - Extensible for paragon levels, new mechanics, etc.

This redesign transforms the character system from hardcoded calculations into an event-driven, flexible typed modifier system with 113 stats as defined in comprehensive-character-stats-complete.md.

## Key Implementation Changes

### **Remove Energy System**
- No `max_energy`, `energy_regeneration`, or `energy_efficiency` stats
- All abilities use cooldown-based system only
- Remove capacity attribute or repurpose for cooldown reduction

### **Implement Typed Modifier Systems**
- Replace individual stats with flexible arrays:
  - `fire_damage_percent` → `damage_percent[{ type: 'fire', value: X }]`
  - `sniper_damage` → `weapon_type_damage[{ type: 'sniper', value: X }]`
  - `burn_resistance` → `status_effect_resistance[{ type: 'burn', value: X }]`

### **Remove Player Allocation**
- No attribute point allocation interface
- Attributes calculated purely from equipment + skills
- All progression through equipment upgrades and skill investments

### **Bidirectional Modifier System**
- All percentage stats can be positive or negative for trade-offs
- Equipment can have penalties as well as bonuses
- Skills can have drawbacks for powerful effects