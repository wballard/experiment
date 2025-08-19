# COURIER - WEAPON SYSTEMS
**Archetypes, Modifications & Variants**

---

## WEAPON PHILOSOPHY

Courier's weapon system balances the immediate familiarity of real-world weapon archetypes with the depth and customization of futuristic modifications. Five core archetypes provide distinct tactical roles, while a comprehensive modification system allows players to create variants that blur the lines between categories.

**Core Principles**:
- **Base Archetypes**: Immutable core stats that define weapon identity
- **Modification Flexibility**: Transform weapons into different sub-types
- **Numerical Clarity**: All important stats displayed as exact numbers
- **Tactical Diversity**: Each archetype fills distinct combat roles

---

## BASE WEAPON ARCHETYPES (5 Total)

### **🔫 Hand Gun**
**Role**: Balanced sidearm, reliability, mobility

**Core Statistics** (Immutable):
- **Damage Per Shot**: 60-90
- **Fire Rate**: 180-300 RPM
- **Magazine Size**: 12-20 rounds
- **Reload Time**: 1.5-2.0 seconds (fast)
- **Effective Range**: 15-35 meters
- **Movement Penalty**: Minimal (best mobility)

**Tactical Identity**:
- Excellent weapon handling and swap speed
- Strong fallback option when primary is reloading
- Good balance of damage and fire rate
- Ideal for mobile, hit-and-run tactics

**Modification Potential**:
- **→ Machine Pistol**: Auto trigger + extended magazine
- **→ Precision Pistol**: Scope + precision barrel for accuracy

---

### **🏃 SMG (Submachine Gun)**
**Role**: Close-quarters volume of fire

**Core Statistics** (Immutable):
- **Damage Per Shot**: 25-40
- **Fire Rate**: 750-1000 RPM (highest)
- **Magazine Size**: 30-50 rounds
- **Reload Time**: 1.8-2.2 seconds (fast)
- **Effective Range**: 8-20 meters (shortest)
- **Movement Penalty**: Low (good mobility)

**Tactical Identity**:
- Overwhelming close-range damage through volume
- Excellent for aggressive, mobile playstyles
- Quick target acquisition and sustained fire
- Effective against multiple weak enemies

**Modification Potential**:
- **→ Personal Defense Weapon**: Compact mods for handling
- **→ Assault SMG**: Extended range modifications

---

### **💥 Shotgun**
**Role**: High-impact close-range devastation

**Core Statistics** (Immutable):
- **Damage Per Shot**: 15-25 × 8-12 pellets (120-300 total)
- **Fire Rate**: 60-120 RPM (lowest)
- **Magazine Size**: 4-8 rounds (smallest)
- **Reload Time**: 2.5-4.0 seconds (shell-by-shell)
- **Effective Range**: 3-12 meters (very short)
- **Movement Penalty**: High (poor mobility)

**Tactical Identity**:
- Devastating burst damage at point-blank range
- Excellent stopping power against single targets
- Multiple pellets increase critical hit probability
- High risk/reward positioning requirements

**Modification Potential**:
- **→ Combat Shotgun**: Auto trigger + extended magazine
- **→ Precision Shotgun**: Rifled barrel + choke (slug rounds)

---

### **⚔️ Assault Rifle**
**Role**: Versatile main weapon platform

**Core Statistics** (Immutable):
- **Damage Per Shot**: 45-70
- **Fire Rate**: 450-650 RPM
- **Magazine Size**: 30-40 rounds
- **Reload Time**: 2.2-2.8 seconds (medium)
- **Effective Range**: 25-60 meters
- **Movement Penalty**: Medium (balanced mobility)

**Tactical Identity**:
- Jack-of-all-trades weapon for any situation
- Good balance of damage, range, and capacity
- Reliable performance across all engagement distances
- Most modification-friendly archetype

**Modification Potential**:
- **→ Marksman Rifle**: Scope + precision barrel + single fire
- **→ LMG-Style**: Extended magazine + heavy barrel + bipod
- **→ Carbine**: Shortened barrel + lightweight stock

---

### **🎯 Sniper Rifle**
**Role**: Precision long-range elimination

**Core Statistics** (Immutable):
- **Damage Per Shot**: 200-400 (highest)
- **Fire Rate**: 40-80 RPM (very low)
- **Magazine Size**: 3-6 rounds (very small)
- **Reload Time**: 3.0-4.5 seconds (slow)
- **Effective Range**: 80-150 meters (longest)
- **Movement Penalty**: High (poor mobility)

**Tactical Identity**:
- Ultimate single-target elimination tool
- Requires positioning and timing mastery
- High weakspot damage multiplier potential
- Slow but devastating tactical option

**Modification Potential**:
- **→ Rail Gun**: Energy charging system + specialized barrel
- **→ Anti-Material**: Heavy barrel + armor-piercing systems

---

## WEAPON STATISTICS DISPLAY

### Visible Stats (Exact Numbers)
Players see precise values for tactical decision-making:

**1. Damage**
- Exact damage per shot/pellet
- Critical for DPS calculations
- Scales with weapon modifications

**2. Fire Rate**
- Rounds per minute (RPM)
- Essential for sustained damage planning
- Modified by fire rate enhancements

**3. Magazine Size**
- Exact round count per reload
- Critical for engagement planning
- Modified by magazine mods

**4. Reload Time**
- Exact seconds to reload
- Important for positioning timing
- Modified by reload speed bonuses

**5. Range**
- Effective range in meters
- Damage falloff begins after this distance
- Modified by barrel and scope mods

**6. Accuracy**
- Base spread angle in degrees
- Lower = more precise shots
- Modified by precision enhancements

**7. Penetration**
- Armor piercing value (0-100)
- Formula: X/(100+X) = % armor ignored
- Modified by ammunition types

### Hidden Stats (Backend Only)
Complex mechanics that maintain gameplay depth without overwhelming players:

- **Damage Falloff Curves**: Precise damage reduction over distance
- **Projectile Velocity**: Bullet travel time and ballistics
- **Recoil Patterns**: 25+ directional values for sustained fire
- **Spread Heat**: Accuracy degradation during sustained fire
- **Animation Timing**: Frame-perfect weapon handling data

---

## WEAPON MODIFICATION SYSTEM

### 7-Slot Architecture *(To be revisited)*

The modification system allows fundamental transformation of weapon behavior while maintaining archetype identity.

#### **1. Optics**
**Function**: Changes aiming and target acquisition
- **Iron Sights**: Fastest ADS, no zoom
- **Red Dot**: 1.5× zoom, quick acquisition
- **ACOG Scope**: 4× zoom, reduced peripheral vision
- **Sniper Scope**: 8-12× zoom, visible glint
- **Smart Scope**: Enemy highlighting technology

#### **2. Magazine & Ammunition**
**Function**: Capacity and damage type modification
- **Extended Magazine**: +20-40% capacity, slower reload
- **Quick Magazine**: -25% reload time
- **Armor Piercing**: +20 penetration value
- **Elemental Rounds**: Converts damage to elemental type

#### **3. Underbarrel**
**Function**: Utility and secondary capabilities
- **Foregrip**: +20% stability, improved ADS movement
- **Grenade Launcher**: Secondary explosive attack
- **Laser Sight**: +15% hip fire accuracy
- **Bipod**: +40% stability when deployed

#### **4. Muzzle**
**Function**: Projectile behavior and sound
- **Suppressor**: -50% audio range, +10% stealth damage
- **Compensator**: +25% stability, +15% range
- **Flash Hider**: Eliminates muzzle flash, +5% stealth
- **Muzzle Brake**: +30% recoil control

#### **5. Barrel**
**Function**: Core performance characteristics
- **Extended Barrel**: +20% range, +10% damage, -5% handling
- **Shortened Barrel**: +15% handling, -15% range
- **Heavy Barrel**: +15% damage, -10% fire rate
- **Rifled Barrel**: +25% accuracy, +5% critical chance

#### **6. Stock & Grip**
**Function**: Handling and mobility
- **Adjustable Stock**: +15% ADS speed, +10% stability
- **Lightweight Stock**: +20% movement, -5% stability
- **Heavy Stock**: +30% stability, -10% movement
- **Tactical Grip**: +25% weapon swap speed

#### **7. Trigger Mechanism**
**Function**: Fire behavior modification
- **Hair Trigger**: +15% fire rate, single shot only
- **Binary Trigger**: Fires on pull AND release
- **Full Auto Conversion**: Changes fire mode entirely
- **Burst Fire**: Converts to 3-round burst mode

---

## ARCHETYPE TRANSFORMATION EXAMPLES

### Hand Gun → Machine Pistol
**Modifications**: Auto trigger + extended magazine + foregrip
**Result**: 
- Fire Mode: Auto (from single)
- Magazine: 30 rounds (from 15)
- Stability: Improved for sustained fire
- **New Identity**: Close-range automatic sidearm

### Assault Rifle → Marksman Rifle
**Modifications**: Sniper scope + precision barrel + single fire trigger
**Result**:
- Fire Mode: Single (from auto)
- Range: 60-80m (from 45m)
- Accuracy: Dramatically improved
- **New Identity**: Long-range precision platform

### Sniper Rifle → Rail Gun
**Modifications**: Energy charging system + specialized barrel + enhanced scope
**Result**:
- Charge Mechanic: Hold to charge for massive damage
- Penetration: Shoots through multiple enemies
- Energy Consumption: Requires energy per shot
- **New Identity**: Sci-fi piercing weapon

### Shotgun → Combat Shotgun
**Modifications**: Auto trigger + extended magazine + tactical stock
**Result**:
- Fire Mode: Auto (from single)
- Magazine: 12 rounds (from 6)
- Handling: Improved for rapid fire
- **New Identity**: Sustained close-range devastation

---

## WEAPON BALANCE PHILOSOPHY

### Power Budget Integration
All weapons follow the same power budget rules:
- **Base Weapons**: 175 power budget for modifications
- **Exotic Variants**: May have 200-250 power budget
- **Modification Scaling**: More powerful mods cost more budget
- **Trade-offs Required**: Cannot max every modification

### Archetype Preservation
Modifications enhance but don't eliminate core weaknesses:
- **Sniper rifles** remain slow and unwieldy
- **SMGs** maintain limited range effectiveness
- **Shotguns** keep close-range focus
- **Balance maintained** through power budget limits

### Progression Scaling
- **Early Game**: Basic modifications, simple improvements
- **Mid Game**: Access to archetype-changing modifications
- **Late Game**: Perfect modification combinations within budget
- **End Game**: Exotic modifications with unique mechanics

---

## TACTICAL APPLICATIONS

### Engagement Distance Optimization
**Close Range (0-15m)**: SMG, Shotgun dominate
**Medium Range (15-50m)**: Assault Rifle, Hand Gun excel
**Long Range (50m+)**: Sniper Rifle, modified Assault Rifle

### Situational Adaptability
**High Mobility**: Hand Gun, SMG, modified light weapons
**Area Control**: Shotgun, explosive underbarrel mods
**Precision Elimination**: Sniper Rifle, marksman variants
**Sustained Combat**: Assault Rifle, LMG variants

### Elemental Integration
All weapon types can be enhanced with elemental modifications:
- **Elemental Ammunition**: Converts damage type
- **Elemental Scopes**: Highlight elemental weaknesses
- **Reactive Barrels**: Generate elemental effects on impact

The weapon system provides clear archetypes with endless customization potential, ensuring players can find their perfect tool for any tactical situation while maintaining game balance through the power budget system.