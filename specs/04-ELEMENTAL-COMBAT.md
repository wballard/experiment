# COURIER - ELEMENTAL COMBAT SYSTEM
**The Five Elements & Status Effects**

---

## ELEMENTAL PHILOSOPHY

The elemental system forms the tactical core of Courier's combat, where traditional gunplay meets strategic elemental effects. Five distinct elements each offer unique approaches to combat, with powerful status effects that fundamentally alter encounter dynamics.

**Core Principles**:
- All damage can be enhanced with elemental effects
- Status effects build up based on damage dealt relative to enemy health
- Each element has distinct tactical identity and counterplay
- Elemental combinations create powerful synergies

---

## THE FIVE ELEMENTS

### Element Wheel & Adjacency Rules

**🌍 Earth → ❄️ Ice → ⚡ Electricity → 🔥 Fire → 🌿 Nature → 🌍 Earth**

**Adjacent Element Restrictions**:
- **Level 20**: Choose any of the 5 elements
- **Level 40**: Choose second element (must be adjacent to first)
- **Valid Combinations**: Earth+Ice, Ice+Electricity, Electricity+Fire, Fire+Nature, Nature+Earth

**Design Intent**: Forces meaningful choices and prevents overpowered combinations while enabling powerful dual-element strategies.

---

## ELEMENT IDENTITIES

### 🔥 **Fire - Destruction & Area Control**
**Core Fantasy**: Pyromaniac who turns enemies into walking bombs
**Tactical Role**: Area denial through damage over time and explosive spread
**Key Mechanic**: Burn spreads between enemies and explodes on death

**Strategic Uses**:
- Clear tightly packed enemy groups
- Area denial in defensive scenarios  
- Sustained damage against high-health targets
- Chain reactions in crowded encounters

### ❄️ **Ice - Control & Burst Damage**
**Core Fantasy**: Tactical controller who freezes then shatters enemies
**Tactical Role**: Crowd control with massive burst damage opportunities
**Key Mechanic**: Frozen enemies become vulnerable to shatter combos

**Strategic Uses**:
- Lock down dangerous enemies temporarily
- Set up devastating burst damage combos
- Control enemy positioning and movement
- Defensive crowd control in emergencies

### ⚡ **Electricity - Chain Damage & Disruption**
**Core Fantasy**: Storm master whose attacks jump between enemies
**Tactical Role**: Multi-target instant damage with ability disruption
**Key Mechanic**: All electric damage chains to nearby targets

**Strategic Uses**:
- Efficient damage against grouped enemies
- Disrupt enemy abilities and coordination
- Shield breaking and energy denial
- Instant multi-target response

### 🌿 **Nature - Life Steal & Contagion**
**Core Fantasy**: Toxic vampire who drains life and spreads plague
**Tactical Role**: Sustain and support through damage over time
**Key Mechanic**: Provides life steal to entire team based on toxin effects

**Strategic Uses**:
- Team sustain in extended encounters
- Gradual weakening of powerful enemies
- Support role through healing provision
- Spreading effects for area control

### 🌍 **Earth - Universal Amplification & Defense**
**Core Fantasy**: Immovable fortress who makes everyone hit harder
**Tactical Role**: Damage amplification and defensive positioning
**Key Mechanic**: Fracture increases ALL damage types against enemies

**Strategic Uses**:
- Amplify team damage against priority targets
- Defensive bonuses and crowd control
- Universal damage support for any team composition
- Control through positioning effects

---

## STATUS BUILDUP SYSTEM

### Universal Formula
**Buildup Percentage = (Elemental Damage Dealt ÷ Enemy Maximum HP) × 100**

**Core Mechanics**:
- Calculation occurs AFTER all resistances and damage modifiers
- Each element tracks buildup independently on each enemy
- Weaker enemies reach status effects faster (tactical scaling)
- Buildup decays over time when not refreshed

**Design Benefits**:
- Gear progression remains meaningful (more damage = faster buildup)
- Tactical scaling (weak enemies affected quickly, bosses require sustained effort)
- Clear feedback loop between damage investment and status frequency

### Buildup Thresholds

**Progressive Intensity (0-99%)**:
- **0-24%**: Minor effects, visual indicators
- **25-49%**: Moderate effects, clear progression
- **50-74%**: Strong effects, noticeable impact
- **75-99%**: Severe effects, major tactical changes

**Triggered State (100%)**:
- **Powerful Effect**: Unique to each element
- **Duration**: 2-5 seconds depending on element
- **Immunity Period**: Brief immunity after effect ends
- **Tactical Window**: Opportunity for follow-up actions

---

## DETAILED STATUS EFFECTS

### 🔥 **Fire Status: BURN**

**Building State: Heated (0-99%)**
- **DoT**: 0.1% max HP per second per 1% buildup
  - Example: 50% buildup = 5% max HP per second
- **Fire Vulnerability**: +0.25% fire damage per 1% buildup
  - Example: 60% buildup = +15% fire damage taken
- **Healing Reduction**: -0.3% per 1% buildup
  - Example: 40% buildup = -12% healing effectiveness

**Visual Progression**: Heat shimmer → smoke wisps → visible flames

**Triggered State: Ignited (100%)**
- **Duration**: 4 seconds
- **Intense DoT**: 15% max HP damage per second
- **Spread Mechanic**: 50% burn buildup to enemies within 5m
- **Death Explosion**: 50% enemy max HP as fire damage in 8m radius
- **Immunity**: 3 seconds after extinguished

**Tactical Considerations**:
- Excellent against grouped enemies due to spread mechanics
- High-health enemies become DoT factories
- Death explosions can chain react with other burning enemies

---

### ❄️ **Ice Status: FREEZE**

**Building State: Chilled (0-99%)**
- **Movement Slow**: 0.5% per 1% buildup
  - Example: 60% buildup = 30% movement speed reduction
- **Ice Vulnerability**: +0.3% ice damage per 1% buildup
  - Example: 50% buildup = +15% ice damage taken
- **Attack Speed**: -0.2% per 1% buildup
  - Example: 70% buildup = -14% attack speed

**Visual Progression**: Frost particles → ice crystals → heavy frost coating

**Triggered State: Frozen (100%)**
- **Duration**: 2 seconds
- **Complete Immobilization**: Cannot move or act
- **Shatterable**: Damage equal to 20% max HP triggers shatter
- **Shatter Damage**: 300% of triggering damage as AoE
- **Spread on Shatter**: 50% freeze buildup to nearby enemies
- **Immunity**: 2 seconds after thaw

**Tactical Considerations**:
- Ultimate crowd control for priority targets
- Shatter combos enable massive burst damage
- Requires coordination between freeze application and shatter trigger

---

### ⚡ **Electricity Status: SHOCK**

**Building State: Charged (0-99%)**
- **Chain Enhancement**: +0.2 chain targets per 10% buildup
  - Example: 50% buildup = +1 additional chain target
- **Electric Vulnerability**: +0.4% electric damage per 1% buildup
  - Example: 75% buildup = +30% electric damage taken
- **Ability Disruption**: Random delays increase with buildup

**Visual Progression**: Static sparks → electrical arcs → constant lightning

**Triggered State: Overloaded (100%)**
- **Duration**: 3 seconds
- **Enhanced Chains**: All electric damage chains to 5 nearby enemies
- **No Chain Falloff**: Chains retain 100% damage
- **Ability Shutdown**: Completely disables enemy abilities
- **Electric Field**: 3m radius field damages other enemies
- **Immunity**: 2 seconds after discharge

**Tactical Considerations**:
- Exceptional multi-target damage potential
- Ability disruption provides tactical control
- Chain damage scales with enemy density

---

### 🌿 **Nature Status: TOXIN**

**Building State: Poisoned (0-99%)**
- **DoT**: 0.08% max HP per second per 1% buildup
  - Example: 75% buildup = 6% max HP per second
- **Nature Vulnerability**: +0.3% nature damage per 1% buildup
  - Example: 60% buildup = +18% nature damage taken
- **Life Steal Provision**: Allies heal for 0.5% of damage per 1% buildup
  - Example: 80% buildup = 40% life steal for team

**Visual Progression**: Green tint → sickly pallor → visible decay

**Triggered State: Plagued (100%)**
- **Duration**: 5 seconds
- **Intense DoT**: 12% max HP damage per second
- **Team Life Steal**: 100% of damage dealt heals team
- **Death Spread**: 75% toxin buildup to all enemies within 10m
- **Toxic Cloud**: 6m radius, 8 second duration, damages enemies
- **Immunity**: 4 seconds after cleansed

**Tactical Considerations**:
- Primary team sustain mechanism
- Excellent for prolonged encounters
- Spreading mechanics make it ideal for area control

---

### 🌍 **Earth Status: FRACTURE**

**Building State: Cracked (0-99%)**
- **Universal Vulnerability**: +0.2% ALL damage per 1% buildup
  - Example: 50% buildup = +10% damage from ANY source
- **Earth Vulnerability**: +0.35% earth damage per 1% buildup
  - Example: 60% buildup = +21% earth damage taken
- **Armor Reduction**: -0.5% per 1% buildup
  - Example: 40% buildup = -20% armor effectiveness
- **Stagger Events**: Mini-staggers at 25%, 50%, 75% buildup

**Visual Progression**: Hairline cracks → visible fissures → crumbling exterior

**Triggered State: Shattered (100%)**
- **Duration**: 4 seconds
- **Maximum Vulnerability**: +40% ALL damage taken
- **Movement Restriction**: Cannot move more than 2m from impact location
- **Internal Damage**: 5% max HP per second from structural damage
- **Death Spikes**: 6m radius earth spikes on death (200% earth damage)
- **Immunity**: 3 seconds after reformation

**Tactical Considerations**:
- Ultimate team damage amplifier
- Benefits any damage type, not just earth
- Positional control through movement restriction

---

## ELEMENTAL DAMAGE INTEGRATION

### Damage Modifier Types

**"+X% Damage as [Element]"**:
- Converts percentage of existing damage to elemental type
- Example: 100 physical damage + 25% as Fire = 100 physical + 25 fire
- Applies to all damage sources (weapons, abilities, etc.)

**"+X [Element] Damage"**:
- Flat elemental damage addition
- Example: +15 Fire Damage adds 15 fire damage to each hit
- Stacks with other flat damage bonuses

**"+X% [Element] Damage"**:
- Multiplies existing elemental damage of matching type
- Example: 50 fire damage + 100% Fire Damage = 100 fire damage
- Only affects damage already of that element type

### Multi-Element Interactions

**Independent Tracking**:
- Each element maintains separate buildup percentage
- Multiple status effects can be active simultaneously
- Cross-element synergies provide tactical depth

**Example Multi-Element Scenario**:
```
Enemy Status:
- 60% Fire Buildup (6% HP/s burn DoT)
- 40% Nature Buildup (20% life steal for team)  
- 80% Earth Buildup (+16% damage vulnerability)

Combined Effect:
- Fire DoT deals 6% HP/s, amplified by earth vulnerability
- Team heals for 20% of ALL damage dealt to this enemy
- All damage sources benefit from earth vulnerability
```

---

## TACTICAL APPLICATIONS

### Solo Play Strategies
- **Fire + Nature**: Self-sustain through burn DoT with life steal
- **Ice + Earth**: Freeze enemies then shatter for amplified damage
- **Electric + any**: Chain damage with universal vulnerability

### Team Compositions
- **Earth Support**: Provides damage amplification for entire team
- **Nature Sustain**: Keeps team healthy through life steal mechanics
- **Ice Control**: Crowd control specialist with setup potential

### Enemy Type Counters
- **Swarm Enemies**: Electric chains, Fire spread, Nature contagion
- **Heavy Enemies**: Earth vulnerability, sustained Fire/Nature DoT
- **Fast Enemies**: Ice slowing and freeze, Earth positioning control

The elemental system provides deep tactical options while remaining intuitive through clear visual feedback and consistent mechanical rules.