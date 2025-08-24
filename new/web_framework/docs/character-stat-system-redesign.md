# Character Stat System Redesign Specification

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
- No attribute point allocation system
- Stats are calculated, not stored
- Inconsistent naming across codebase

#### **Specification Requirements** (From Character Systems Spec)
The spec defines 6 primary attributes with specific names and effects:

- **Vitality** - Health & Survivability (+5 Health, +2 Shield, +0.1 Health Regen per point)
- **Precision** - Critical & Accuracy (+0.5% Crit, +1% Accuracy, +0.2% Crit Damage per point)
- **Potency** - Raw Damage & Status (+0.8% All Damage, +0.3% Status Chance, +0.1% Status Duration per point)
- **Alacrity** - Speed & Agility (+0.4% Attack Speed, +0.4% Move Speed, +0.2% Cooldown Reduction per point)
- **Capacity** - Resources & Abilities (+3 Max Energy, +0.5% Ability Damage, +0.2% Energy Regen per point)  
- **Defense** - Defense & Resistances (+0.2% All Resistance, +1 Armor, +0.1% Damage Reduction per point)

**Should Also Include:**
- 120 attribute points total at level 60 (2 per level)
- Player-allocated attribute distribution
- Base stats + attribute bonuses = final stats
- Clear separation between attributes (player-controlled) and derived stats

#### **Recommended Unified System**

**Primary Attributes** (Player-allocated, 2 points per level, 120 total at 60):
```
vitality: base=20 + allocated_points (affects health, shields, regen)
precision: base=20 + allocated_points (affects crit, accuracy) 
potency: base=20 + allocated_points (affects damage, status effects)
alacrity: base=20 + allocated_points (affects speed, cooldowns)
capacity: base=20 + allocated_points (affects energy, abilities)
defense: base=20 + allocated_points (affects armor, resistances)
```

**Derived Stats** (Calculated from attributes + equipment + skills):
```
health: base + (vitality * 5) + equipment_bonus + skill_bonus
armor: base + defense + equipment_bonus + skill_bonus  
critical_chance: base + (precision * 0.5%) + equipment_bonus + skill_bonus
damage_multiplier: 100% + (potency * 0.8%) + equipment_bonus + skill_bonus
attack_speed: 100% + (alacrity * 0.4%) + equipment_bonus + skill_bonus
max_energy: base + (capacity * 3) + equipment_bonus + skill_bonus
resistances: (defense * 0.2%) + equipment_bonus + skill_bonus
```

**Storage Requirements:**
- Store allocated attribute points in `character_stats` table
- Calculate derived stats on-demand in application layer
- Cache calculated stats for performance when needed

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
- Attribute changes (allocate attribute points)

#### **Recommended Event System**

**Core Events:**
1. `levelup` - Character gains a level
2. `skillchange` - Skill point allocation changes  
3. `equipitem` - Item equipped to a slot
4. `unequipitem` - Item removed from a slot
5. `attributechange` - Attribute point allocation changes (new)
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

1. **Add Attribute Storage**
```sql
-- Modify character_stats table to store allocated attribute points
INSERT OR REPLACE INTO character_stats (character_id, stat_name, total_value) VALUES 
(?, 'vitality_allocated', ?),
(?, 'precision_allocated', ?),
(?, 'potency_allocated', ?),
(?, 'alacrity_allocated', ?), 
(?, 'capacity_allocated', ?),
(?, 'defense_allocated', ?);
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
            case 'attributechange':
                await this.handleAttributeChange(characterId, eventData);
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
        const allocatedAttributes = await this.getAllocatedAttributes(characterId);
        const equipmentBonuses = await this.getEquipmentBonuses(characterId);
        const skillBonuses = await this.getSkillBonuses(characterId);
        
        return this.combineStatSources(baseStats, allocatedAttributes, equipmentBonuses, skillBonuses);
    }
}
```

### Phase 3: Frontend Integration

1. **Update Dashboard to Use New System**
   - Replace hardcoded attribute calculations with API calls
   - Add attribute allocation UI
   - Implement real-time stat updates via events

2. **Add Attribute Allocation Interface**  
   - Point distribution interface
   - Stat preview system
   - Respec functionality

3. **Event-driven UI Updates**
   - Listen for character events via WebSocket/polling
   - Update displays reactively when events occur
   - Show event history/notifications

### Phase 4: API Endpoints

1. **Character Stats API**
```
GET /api/characters/{id}/stats - Get calculated character stats
POST /api/characters/{id}/attributes - Allocate attribute points  
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
- Add attribute allocation columns to `character_stats`
- Keep existing system running

### Step 2: Implement Event System Backend
- Add event processing classes
- Add stat calculation engine  
- Add API endpoints
- Run in parallel with existing system

### Step 3: Frontend Migration
- Update dashboard to use new APIs
- Add attribute allocation interface
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
3. **Separation of Concerns** - Attributes (player), derived stats (calculated), equipment/skills (bonuses)
4. **Performance** - Calculated stats cached, only recalculated on events
5. **Flexibility** - Easy to add new event types and stat calculations
6. **Debuggability** - Event history shows exactly what happened when
7. **Real-time Updates** - UI can react immediately to character changes
8. **Future-Proof** - Extensible for paragon levels, new mechanics, etc.

This redesign transforms the character system from a collection of hardcoded calculations into a proper event-driven, specification-compliant character progression system.