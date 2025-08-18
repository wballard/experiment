# COURIER - UNREAL ENGINE 3D VERSION
**Real-Time Combat ARPG/Looter Shooter Reference**

---

## VERSION DISTINCTION

This document preserves the original design concept for Courier as a real-time 3D ARPG/looter shooter. This version would feature direct player control, real-time combat, and traditional shooter mechanics, while maintaining the same progression systems, power budget innovation, and strategic depth.

**Key Difference**: This version features real-time player-controlled combat instead of the web version's asynchronous timer-based statistical missions.

---

## GAME IDENTITY (3D VERSION)

**Courier** is a sci-fi ARPG/looter shooter that combines the depth of Diablo IV, the skill complexity of Path of Exile 2, the gunplay of Destiny 2, and the weapon customization of Call of Duty. Players explore procedural content with real-time combat while unraveling the mystery of the Progenitor experiments on the colony world of Orphan.

**Platform**: PC/Console with Unreal Engine 5
**Perspective**: Third-person or first-person (player choice)
**Combat**: Real-time action with elemental effects
**Progression**: Same power budget and character systems as web version

---

## REAL-TIME COMBAT EXPERIENCE

### **🎮 Moment-to-Moment Gameplay**
Players engage in satisfying gunplay enhanced by elemental effects, making tactical decisions about positioning, target priority, and ability usage while managing resources and cooldowns.

### **⚔️ Hybrid Combat System**
- **Seamless Gunplay** with 5 weapon archetypes and modification system
- **Elemental Integration** where all damage can be enhanced with elements
- **Status Effect System** with percentage-based buildup and powerful triggered effects
- **Tactical Depth** through positioning, timing, and elemental combinations

### **🌍 Real-Time Elemental Effects**

#### **🔥 Fire Status: BURN (Real-Time)**
**Building State: Heated (0-99%)**
- **Visual**: Heat shimmer → smoke wisps → visible flames
- **DoT**: 0.1% max HP per second per 1% buildup
- **Fire Vulnerability**: +0.25% fire damage per 1% buildup
- **Player sees**: Health bars decreasing, visual fire effects

**Triggered State: Ignited (100%)**
- **Duration**: 4 seconds
- **Visual**: Enemy fully engulfed in flames
- **Effect**: 15% max HP damage per second
- **Spread**: Flames jump to nearby enemies (player can see and exploit)
- **Death Explosion**: Massive fire blast that player can position around

#### **❄️ Ice Status: FREEZE (Real-Time)**
**Building State: Chilled (0-99%)**
- **Visual**: Frost particles → ice crystals → heavy frost coating
- **Movement**: Enemy visibly slows down
- **Player advantage**: Can reposition while enemy is slowed

**Triggered State: Frozen (100%)**
- **Visual**: Enemy completely encased in ice
- **Effect**: Enemy cannot move or attack
- **Shatter Opportunity**: Player can trigger massive damage with any attack
- **Tactical Window**: 2 seconds to position for optimal shatter damage

#### **⚡ Electricity Status: SHOCK (Real-Time)**
**Building State: Charged (0-99%)**
- **Visual**: Static sparks → electrical arcs → constant lightning
- **Chain Preview**: Players can see potential chain targets highlighted

**Triggered State: Overloaded (100%)**
- **Visual**: Intense electrical field around enemy
- **Effect**: All electric attacks from player chain to 5 nearby enemies
- **Tactical Play**: Player can position to maximize chain targets

#### **🌿 Nature Status: TOXIN (Real-Time)**
**Building State: Poisoned (0-99%)**
- **Visual**: Green tint → sickly pallor → visible decay
- **Life Steal**: Player visibly heals when damaging poisoned enemies

**Triggered State: Plagued (100%)**
- **Visual**: Toxic aura around enemy
- **Effect**: 100% life steal for all team damage
- **Tactical Advantage**: Priority target for team focus fire

#### **🌍 Earth Status: FRACTURE (Real-Time)**
**Building State: Cracked (0-99%)**
- **Visual**: Hairline cracks → visible fissures → crumbling exterior
- **Damage Numbers**: All damage numbers show increased values

**Triggered State: Shattered (100%)**
- **Visual**: Enemy looks broken and immobilized
- **Effect**: +40% damage from all sources (player sees bigger numbers)
- **Movement**: Enemy cannot move more than 2m (visible tether effect)

---

## REAL-TIME MISSION STRUCTURE

### **🏃 Patrol Missions (5-30 minutes)**
**Real-Time Experience**: 
- Enter procedural areas with specific objectives
- Fight through enemies using optimized builds
- Real-time elemental combos and status effects
- Immediate loot drops and feedback

**Example Patrol**: "Secure Outpost Alpha"
- Enter combat zone in real-time
- Clear enemies using elemental combinations
- See status effects build up and trigger visually
- Collect loot drops immediately
- Mission success based on player skill + character build

### **⚔️ Horde Missions (1-4 hours)**
**Real-Time Experience**:
- Survive escalating waves of enemies
- Manage resources and cooldowns actively
- Adapt to affix modifiers affecting the battlefield
- Real-time positioning and tactical decisions

**Example Horde**: "Defend Research Station"
- Waves of enemies attack player position
- Environmental affixes create dynamic challenges
- Player must actively dodge, position, and manage resources
- Success requires both character optimization AND player skill

### **🌌 Expedition Missions (6-24 hours)**
**Real-Time Experience**:
- Extended exploration with save/resume functionality
- Complex multi-stage objectives
- Boss encounters requiring mastery of elemental systems
- Real-time puzzle solving and environmental navigation

**Example Expedition**: "Deep Progenitor Facility"
- Hours of real-time exploration and combat
- Save progress at checkpoints
- Final boss requires perfect elemental timing and positioning
- Success demands both optimal build AND execution mastery

---

## ENVIRONMENTAL AFFIX IMPLEMENTATION (3D VERSION)

### **🌋 Volcanic Affix (Real-Time)**
**Player Experience**:
- See volcanic fissures appear with 2-second warning
- Must actively move to avoid damage zones
- Creates dynamic positioning challenges
- Rewards mobile builds and movement skills

**Visual Implementation**:
- Ground cracks appear before eruption
- Lava fountains with damage radius indicators
- Heat shimmer effects warn of danger zones
- Audio cues build tension before eruptions

### **❄️ Frozen Ground Affix (Real-Time)**
**Player Experience**:
- Ice patches visibly slow movement
- Must plan routes around frozen areas
- Ice spreads if player stands still too long
- Slide mechanics can turn hindrance into advantage

**Visual Implementation**:
- Clearly marked icy surfaces
- Sliding particle effects
- Footstep audio changes on ice
- Ice crystallization spreads visually

### **⚡ Lightning Storm Affix (Real-Time)**
**Player Experience**:
- Lightning targeting circles appear before strikes
- Must actively dodge incoming lightning
- Creates constant movement pressure
- Rewards high mobility builds

**Visual Implementation**:
- Storm clouds gather overhead
- Targeting reticles show strike zones
- Dramatic lightning effects with screen flash
- Thunder audio creates tension

---

## WEAPON SYSTEMS (3D VERSION)

### **Real-Time Weapon Feel**

#### **🔫 Hand Gun**
**3D Experience**:
- Responsive single-shot firing
- Clear recoil animation and audio
- Fast reload with satisfying shell ejection
- Precise aiming with minimal weapon sway

#### **🏃 SMG**
**3D Experience**:
- High rate of fire with manageable recoil
- Muzzle flash and shell casings
- Quick target acquisition
- Satisfying spray patterns

#### **💥 Shotgun**
**3D Experience**:
- Powerful kick with substantial recoil animation
- Spread pattern clearly visible
- Devastating close-range impact effects
- Shell-by-shell reload with tactical timing

#### **⚔️ Assault Rifle**
**3D Experience**:
- Balanced full-auto fire
- Controllable recoil with skill ceiling
- Versatile engagement ranges
- Modular attachment system visible on weapon

#### **🎯 Sniper Rifle**
**3D Experience**:
- Satisfying scope mechanics
- Bullet travel time and drop
- Massive impact effects on hit
- Breathing mechanics for precision

### **Weapon Modification Visual System**
**Real-Time Feedback**:
- All modifications visually represented on weapon
- Stat changes immediately felt in handling
- Attachment swapping in real-time
- Visual customization reflects tactical choices

---

## MULTIPLAYER INTEGRATION

### **Cooperative Gameplay**
**2-4 Player Teams**:
- Real-time coordination for elemental combos
- Shared loot with smart distribution
- Team-based status effect synergies
- Voice chat integration for tactical coordination

**Elemental Teamwork Examples**:
- One player applies earth fracture, team focuses fire for amplified damage
- Ice player freezes priority targets for team shatter combos
- Nature player provides team life steal while others deal damage

### **Competitive Elements**
**Leaderboards**:
- Fastest mission completion times
- Highest difficulty completed
- Most efficient builds (success rate metrics)
- Seasonal competitive events

---

## PLATFORM-SPECIFIC FEATURES

### **PC Implementation**
- **High framerate**: 144Hz+ support
- **Mod support**: Community weapon modifications
- **Advanced graphics**: Ray tracing, DLSS support
- **Precision controls**: Mouse and keyboard optimization

### **Console Implementation**
- **Controller optimization**: Haptic feedback for weapon feel
- **Couch co-op**: Local multiplayer support
- **HDR support**: Enhanced visual effects
- **Achievement integration**: Platform-specific rewards

---

## DEVELOPMENT CONSIDERATIONS (3D VERSION)

### **Technical Requirements**
- **Unreal Engine 5**: Nanite and Lumen for visual fidelity
- **Dedicated servers**: For multiplayer stability
- **Cross-platform play**: PC and console compatibility
- **Regular content updates**: New missions and affixes

### **Content Pipeline**
- **Procedural generation**: For mission variety
- **Modular assets**: Efficient content creation
- **Localization support**: Multiple language markets
- **Accessibility features**: Visual and audio accommodations

---

## RELATIONSHIP TO WEB VERSION

### **Shared Systems**
Both versions use identical:
- **Power Budget System**: Same formulas and constraints
- **Character Progression**: Levels, attributes, classes
- **Elemental System**: Same status effects and combinations
- **Mission Affix System**: Same weekly rotations and effects
- **Equipment System**: Same rarity tiers and power costs

### **Key Differences**
**3D Version**:
- Real-time player skill affects outcomes
- Visual spectacle and immediate feedback
- Multiplayer coordination opportunities
- Platform-specific features and performance requirements

**Web Version**:
- Statistical outcomes based purely on character optimization
- Accessible on any device with browser
- Asynchronous gameplay fits any schedule
- Focus on strategic planning over execution

### **Potential Integration**
- **Shared account progression**: Characters could transfer between versions
- **Companion gameplay**: Use web version to optimize builds for 3D play
- **Cross-promotion**: Success in one version benefits the other

---

## CONCLUSION

This 3D version represents the "full vision" of Courier as an action-oriented ARPG/looter shooter, while the web version distills the strategic essence into an accessible format. Both versions validate the core innovation of the Power Budget System and could potentially coexist to serve different player preferences and contexts.

The 3D version would appeal to players who want:
- Real-time action and skill expression
- Visual spectacle and immediate feedback
- Multiplayer coordination and competition
- Platform-specific features and performance

While maintaining all the strategic depth, character progression innovation, and elemental complexity that defines the Courier experience.

=====================================
**END OF 3D VERSION REFERENCE**
Preserved for Future Development
=====================================