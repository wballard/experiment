# Claude Code Project Guidelines

## Character System Implementation Rules

### 🚨 **MANDATORY CHARACTER SYSTEM CONSTRAINTS**

**Before making ANY changes to character stats, equipment, skills, or progression systems:**

#### **📋 Required Documents**
You MUST reference these documents and follow their constraints:

1. **[docs/comprehensive-character-stats-complete.md](./docs/comprehensive-character-stats-complete.md)**
   - Contains the **ONLY 113 approved stats**
   - **NO additions, modifications, or deviations allowed**
   - All stat definitions, formulas, and examples

2. **[docs/character-system-implementation-spec.md](./docs/character-system-implementation-spec.md)**
   - **Mandatory implementation patterns**
   - Code review checklist
   - Enforcement rules and constraints

3. **[docs/character-stat-system-redesign.md](./docs/character-stat-system-redesign.md)**
   - Technical architecture and migration strategy
   - Event system implementation

#### **🚫 ABSOLUTELY FORBIDDEN**

**Energy/Resource Systems:**
- Never implement `max_energy`, `energy_regeneration`, `energy_efficiency`
- All abilities use cooldown-based system only

**Player Attribute Allocation:**
- No `allocateAttributePoints()`, `spendAttributePoints()`, attribute allocation UI
- Attributes come from equipment + skills ONLY

**Random New Stats:**
- Do not create stats like `luck`, `karma`, `faction_standing`, `crafting_skill`
- Use ONLY the approved 113 stats from comprehensive document

**Extra Equipment Slots:**
- Do not add `rings`, `belt`, `boots`, `bracers`, `weapon_mod_1`, etc.
- Use ONLY the approved 11 slots: `primary, secondary, head, shoulders, chest, gloves, legs, back, trinket, catalyst, attachment`

**Individual Hardcoded Stats:**
- Never create `fire_damage_percent`, `sniper_damage_bonus`, `burn_resistance`
- Use typed arrays: `damage_percent[{type: 'fire', value: X}]`

#### **✅ REQUIRED PATTERNS**

**Equipment Structure:**
```javascript
{
    slot: "primary", // One of 9 approved slots only
    main_modifiers: {
        vitality: 25,    // Attribute bonuses
        potency: 15
    },
    extra_modifiers: [
        { name: 'damage_percent', value: 0.35, damageType: 'fire' },
        { name: 'weapon_type_damage_percent', value: 0.20, weaponType: 'sniper' }
    ]
}
```

**Stat Calculation:**
```javascript
final_stat = base_value + equipment_bonus + skill_bonus
// NO player allocation component
```

#### **🔍 Before Any Character System Code Changes**

**MANDATORY CHECKLIST:**
- [ ] Stat exists in the 113 approved stats
- [ ] No energy system references
- [ ] No player attribute allocation
- [ ] Uses typed arrays not individual stats
- [ ] Equipment uses 9 approved slots only
- [ ] Follows base + equipment + skills formula
- [ ] Integrates with existing skill-modifiers.js

#### **📞 When In Doubt**

If you are unsure about ANY character system implementation:

1. **Stop and ask the user** before proceeding
2. **Reference the three mandatory documents**
3. **Do not create new stats, slots, or systems**
4. **Follow the approved patterns exactly**

### Historical Context

Previous major refactors have introduced random stats, equipment slots, and systems that deviated from the approved design. This created inconsistencies and technical debt. These guidelines prevent future deviations and ensure consistent implementation.

---

## General Development Guidelines

- Follow existing code patterns and conventions
- Test changes thoroughly before committing
- Use TypeScript types where available
- Follow the established project structure