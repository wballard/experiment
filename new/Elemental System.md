# COURIER - ELEMENTAL SYSTEM
**Primary Element Mechanics & Ice Elemental Tree**

---

## PRIMARY ELEMENT DAMAGE MODIFIERS

**"+X% Damage as Y Element"**: This takes whatever damage would have occurred and adds X% as element Y damage. For example, if a bullet hit from a gun (kinetic/physical) would have done 100 damage and the player had "+25% Damage as Ice" (from one or more items or skills) then the hit would do 100 physical damage and 25 ice damage.

**"+X Y Damage"**: This is a fixed addition to the damage of the attack as elemental damage type Y. If this were "+10 Ice Damage" and the hit did 100 (as the above example) it would also do 10 ice damage.

**"+X% Y Damage"**: This modifies existing damage of the matching elemental type. For example, "+100% Ice Damage" would result in a total of 50 ice damage in the first example and 20 ice damage in the second example.

### **Universal Rules**

**Resistances still work**: If the target had -100% resistance to the element they would take double the damage or if they had 50% resistance to the element they would take half the damage.

**Status effects build up** from this damage just as it does from any other source of elemental damage. 

---

## ❄️ ICE ELEMENTAL TREE - COMPLETE DESIGN

## **Overview**

The Ice tree focuses on crowd control through freeze buildup, defensive capabilities, and burst damage through shatter mechanics. All Ice damage applies Freeze buildup, with enemies becoming Frozen at 100% buildup.

## **Core Mechanic: Freeze Buildup**

* **All Ice damage** applies Freeze buildup (fixed amount per damage, can be accelerated with modifiers)  
* **At 100% Freeze**: Enemy becomes Frozen (immobilized) for 2 seconds base  
* **Frozen enemies** can be Shattered for massive damage  
* **Freeze decays** at 20% per second when not taking Ice damage  
* **Movement reduction**: 1% per 1% Freeze buildup (50% Freeze \= 50% slow)

## **Active Abilities: 4 Regular \+ 2 Ultimates**

---

## **Tier 1 Skills (0 Points Required)**

### **Frost Rounds (Active Ability)**

**Description**: Enhance your weapons with ice, adding frost damage and freeze buildup to all shots

* **Duration**: 10 seconds  
* **Cooldown**: 15 seconds  
* **Energy Cost**: 30  
* **Base Effect**: \+50 Ice damage per shot  
* **Freeze Buildup**: 3% per shot

**Ranks** (5 total):

1. Base ability  
2. \+75 Ice damage per shot, 4% freeze buildup  
3. \+100 Ice damage per shot, 5% freeze buildup, \+2s duration  
4. \+125 Ice damage per shot, 6% freeze buildup, \+4s duration  
5. \+150 Ice damage per shot, 8% freeze buildup, penetrating rounds

### **Ice Spike (Active Ability)**

**Description**: Launch a fast ice projectile that pierces enemies and leaves frozen ground

* **Cooldown**: 8 seconds  
* **Energy Cost**: 40  
* **Base Damage**: 300 Ice damage  
* **Freeze Buildup**: 30% to direct hits, 10% per second on frozen ground  
* **Ground Duration**: 5 seconds

**Ranks** (5 total):

1. Base ability  
2. \+100 damage, pierces 1 enemy  
3. \+200 damage, pierces 2 enemies, \+2s ground duration  
4. \+300 damage, pierces 3 enemies, wider trail  
5. \+400 damage, unlimited pierce, frozen ground spreads on enemy death

### **Frozen Resolve (Passive)**

**Description**: Gain Ice Resistance and reduce freeze buildup taken

* **Ranks** (5 total):  
  1. \+10% Ice Resistance  
  2. \+20% Ice Resistance, 20% freeze resistance  
  3. \+30% Ice Resistance, 40% freeze resistance  
  4. \+40% Ice Resistance, 60% freeze resistance  
  5. \+50% Ice Resistance, immune to freeze from enemies 5+ levels below

### **Flash Freeze (Passive)**

**Description**: Your critical strikes apply bonus freeze buildup

* **Proc Chance**: 100% on critical strikes  
* **Base Bonus**: \+10% freeze buildup on crits

**Ranks** (5 total):

1. \+10% freeze buildup on crits  
2. \+15% freeze buildup on crits  
3. \+20% freeze buildup on crits, crits slow freeze decay  
4. \+25% freeze buildup on crits, frozen duration \+0.5s  
5. \+30% freeze buildup on crits, critical kills spread freeze

---

## **Tier 2 Skills (5 Points Required)**

### **Cryo Shield (Active Ability)**

**Description**: Surround yourself with protective ice that damages and freezes attackers

* **Duration**: 8 seconds  
* **Cooldown**: 20 seconds  
* **Energy Cost**: 50  
* **Shield Health**: 200% of max health  
* **Damage Reflection**: 50 Ice damage to melee attackers  
* **Freeze Buildup**: 5% per hit taken

**Ranks** (5 total):

1. Base ability  
2. \+50% shield health, \+10 reflection damage  
3. \+100% shield health, \+20 reflection damage, 7% freeze per hit  
4. \+150% shield health, \+30 reflection damage, 10% freeze per hit  
5. \+200% shield health, \+50 reflection damage, explodes on expiry for AoE freeze

### **Blizzard (Active Ability)**

**Description**: Create a persistent ice storm that follows your crosshair

* **Duration**: 8 seconds  
* **Cooldown**: 25 seconds  
* **Energy Cost**: 60  
* **Radius**: 10 meters  
* **Damage**: 100 Ice damage per second  
* **Freeze Buildup**: 8% per second

**Ranks** (5 total):

1. Base ability  
2. \+25 damage per second, 10% freeze per second  
3. \+50 damage per second, 12% freeze per second, \+2m radius  
4. \+75 damage per second, 15% freeze per second, \+2s duration  
5. \+100 damage per second, 20% freeze per second, leaves frozen ground

### **Elemental Harmony (Passive)**

**Description**: Your mastery of Ice grants resistance to neighboring elements

* **Ranks** (3 total):  
  1. \+5% Earth and Electricity Resistance  
  2. \+10% Earth and Electricity Resistance, \+5% Ice Potency  
  3. \+15% Earth and Electricity Resistance, \+10% Ice Potency

### **Frost Conversion (Passive)**

**Description**: Convert physical damage to Ice and enhance freeze buildup

* **Conversion**: Affects all weapon damage  
* **Ranks** (3 total):  
  1. Convert 10% of physical damage to Ice, \+5% freeze buildup rate  
  2. Convert 20% of physical damage to Ice, \+10% freeze buildup rate  
  3. Convert 30% of physical damage to Ice, \+15% freeze buildup rate, all damage can freeze

### **Shatter Expert (Passive)**

**Description**: Enhance shatter damage and effects when breaking frozen enemies

* **Shatter Damage**: Based on enemy max health  
* **Explosion Radius**: 5 meters

**Ranks** (3 total):

1. \+25% shatter damage, spreads 25% freeze to nearby enemies  
2. \+50% shatter damage, spreads 50% freeze to nearby enemies  
3. \+75% shatter damage, spreads 75% freeze to nearby enemies, chain shatters possible

### **Glacial Empowerment (Passive)**

**Description**: Increases Ice damage and freeze buildup rate

* **Damage Increase**: Multiplicative bonus  
* **Ranks** (3 total):  
  1. \+15% Ice damage, \+10% freeze buildup rate  
  2. \+30% Ice damage, \+20% freeze buildup rate  
  3. \+45% Ice damage, \+30% freeze buildup rate

---

## **Tier 3 Skills (10 Points Required)**

### **Absolute Zero (Ultimate Ability)**

**Description**: Unleash a massive freeze nova, instantly applying heavy freeze to all nearby enemies

* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Radius**: 15 meters  
* **Instant Freeze Buildup**: 80%  
* **Damage**: 500 Ice damage  
* **Special**: You gain freeze immunity and \+50% movement speed for 3 seconds

### **Avalanche (Ultimate Ability)**

**Description**: Call down a devastating ice avalanche that rolls forward, growing larger

* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Initial Width**: 5 meters (grows to 15 meters)  
* **Range**: 30 meters  
* **Damage**: 300 Ice damage per hit (can hit multiple times)  
* **Freeze Buildup**: 25% per hit  
* **Special**: Frozen enemies take 3x damage and shatter

### **Permafrost Mastery (Combo Unlock)**

**Requirements**: 10 points in Earth tree **Description**: Unlock Earth \+ Ice combo effects

* **Permafrost**: Frozen enemies hit by Earth damage shatter for 200% damage  
* **Frozen Ground**: Earth abilities apply 25% freeze buildup  
* **Bonus**: \+10% Earth and Ice Potency when both elements are equipped

### **Superconductor Mastery (Combo Unlock)**

**Requirements**: 10 points in Electricity tree **Description**: Unlock Ice \+ Electricity combo effects

* **Superconductor**: Electric chains gain \+2 jumps on enemies with 50%+ freeze  
* **Frost Spark**: Electric damage on frozen enemies creates frost explosion  
* **Bonus**: \+10% Electricity and Ice Potency when both elements are equipped

### **Icy Veins (Passive)**

**Description**: Gain attack speed based on freeze buildup applied recently

* **Duration**: 5 seconds  
* **Stack Limit**: 10 stacks  
* **Ranks** (3 total):  
  1. \+2% attack/reload speed per 10% freeze applied (max 20%)  
  2. \+3% attack/reload speed per 10% freeze applied (max 30%)  
  3. \+5% attack/reload speed per 10% freeze applied (max 50%), gain movement speed

---

## **Tier 4 Skills (15 Points Required)**

### **Cryogenic Master (Capstone Passive)**

**Description**: Become the ultimate master of Ice and Freeze

* **Effects**:  
  * \+100% Ice Potency  
  * \+50% Ice Resistance  
  * All Ice abilities ignore 50% of enemy Ice Resistance  
  * \+50% freeze buildup rate on all Ice damage  
  * Freeze decay reduced to 10% per second (from 20%)  
  * Frozen duration \+2 seconds  
  * Shatters deal 100% more damage and guarantee freeze nearby enemies  
  * Your freeze cannot be cleansed by enemies  
  * Applying freeze to already frozen enemies extends duration

---

## **Freeze Mechanics Details**

### **Freeze Buildup Sources**

* **Light attacks**: 10% base  
* **Heavy attacks**: 20% base  
* **Abilities**: Varied (25-50% typically)  
* **Damage over time**: 5% per tick  
* **Critical strikes**: 2x buildup with Flash Freeze

### **Freeze Thresholds & Effects**

* **0-24%**: Minor slow (up to 24% movement reduction)  
* **25-49%**: Moderate slow \+ 10% longer ability cooldowns  
* **50-74%**: Heavy slow \+ 20% longer cooldowns \+ frost visual  
* **75-99%**: Severe slow \+ 30% longer cooldowns \+ ice crystals forming  
* **100%**: FROZEN \- Complete immobilization for 2+ seconds

### **Shatter Mechanics**

* **Damage Required**: 20% of frozen enemy's max health  
* **Shatter Damage**: 300% of triggering damage as AoE  
* **Freeze Spread**: 50% to all enemies within 5m  
* **Can chain**: Shattering can freeze then shatter nearby enemies

---

## **Build Paths**

### **1\. Gunslinger Frost**

**Focus**: Weapon enhancement with Frost Rounds

* **Priority Skills**: Frost Rounds → Flash Freeze → Glacial Empowerment → Avalanche  
* **Playstyle**: Rapid fire freeze buildup with enhanced weapons  
* **Stat Priority**: Attack Speed \> Ice Damage \> Crit Chance  
* **Ultimate Choice**: Avalanche for ranged clear

### **2\. Shatter Burst**

**Focus**: Maximize freeze into shatter combos

* **Priority Skills**: Ice Spike → Shatter Expert → Absolute Zero → Cryogenic Master  
* **Playstyle**: Burst freeze enemies then detonate  
* **Stat Priority**: Ice Potency \> Freeze Buildup \> Crit Chance  
* **Ultimate Choice**: Absolute Zero for instant freeze setup

### **3\. Defensive Controller**

**Focus**: Tank build with area control

* **Priority Skills**: Cryo Shield → Blizzard → Frozen Resolve → Permafrost Mastery  
* **Playstyle**: Control space while being hard to kill  
* **Stat Priority**: Health \> Ice Resistance \> Cooldown Reduction  
* **Ultimate Choice**: Either works \- preference based

### **4\. Ability Spammer**

**Focus**: Constant ability usage with all 4 actives

* **Priority Skills**: All active abilities → Icy Veins → Superconductor  
* **Playstyle**: Rotate through abilities for constant freeze  
* **Stat Priority**: Cooldown Reduction \> Energy \> Ice Potency  
* **Ultimate Choice**: Absolute Zero for another instant ability

---

## **Synergies with Gear**

### **Recommended Legendary Effects**

* "Your freeze buildup cannot decay"  
* "Frozen enemies take \+X% freeze buildup (can exceed 100%)"  
* "Shattering an enemy resets all cooldowns"  
* "Gain 1% damage per 10% freeze on any enemy"

### **Recommended Mythic Perks**

* "All damage applies 10% freeze buildup"  
* "Enemies at 50%+ freeze take all damage as Ice"  
* "Your shatters instantly freeze all enemies on screen"

### **Stat Priorities**

1. **Primary**: Ice Potency, Freeze Buildup Rate  
2. **Secondary**: Crit Chance (for Flash Freeze), Attack Speed  
3. **Defensive**: Ice Resistance, Freeze Resistance  
4. **Utility**: Frozen Duration, Status Effect Power

---

## **PvP Considerations**

### **Adjustments vs Players**

* Freeze buildup capped at 50% from single ability  
* Frozen duration: 1 second (instead of 2\)  
* Freeze decay: 40% per second (instead of 20%)  
* Shatter damage capped at 30% of player max health  
* Players gain 2 second freeze immunity after being frozen

### **Strategies**

* Focus on repeated hits for buildup rather than one-shots  
* Use terrain to control freeze decay timing  
* Coordinate with teammates for shatter setups

# **Fire Elemental Tree \- Complete Design**

## **Overview**

The Fire tree focuses on damage over time through burn buildup, area denial, and explosive combos. All Fire damage applies Burn buildup, with enemies Igniting at 100% buildup for intense damage over time.

## **Fire's Unique Identity:**

1. **Burn Buildup Mechanic:**  
   * Persists longer than freeze (10% decay vs 20%)  
   * Creates damage vulnerability as it builds  
   * At 100% \= Ignite for massive DoT  
   * Spreads naturally through death and contact  
2. **4 Active Abilities:**  
   * **Incendiary Rounds** \- Higher damage than frost but less utility  
   * **Fireball** \- Classic explosive projectile  
   * **Flame Shield** \- Mobile damage aura  
   * **Meteor Strike** \- Area denial tool  
3. **2 Ultimate Choices:**  
   * **Phoenix Rising** \- Transformation for mobility/survival  
   * **Hellstorm** \- Vortex for grouping and destruction  
4. **Fire's Strengths:**  
   * Highest raw damage output  
   * Best area denial  
   * Chain reaction potential  
   * Self-healing through damage  
5. **Fire's Weaknesses:**  
   * Less crowd control than Ice  
   * Damage takes time (DoT focused)  
   * Can be dangerous to user in tight spaces  
   * Predictable spread patterns

## **Core Mechanic: Burn Buildup**

* **All Fire damage** applies Burn buildup (weapons: 4-10%, abilities: 10-40%)  
* **At 100% Burn**: Enemy Ignites for 4 seconds of intense DoT  
* **Burn buildup** persists longer than freeze (decays at 10% per second)  
* **Damage amplification**: 1% increased damage taken per 10% Burn buildup  
* **Spreads on death**: Burning enemies spread 50% of their burn to nearby foes

## **Active Abilities: 4 Regular \+ 2 Ultimates**

---

## **Tier 1 Skills (0 Points Required)**

### **Incendiary Rounds (Active Ability)**

**Description**: Infuse your weapons with fire, adding burn damage to all shots

* **Duration**: 12 seconds  
* **Cooldown**: 18 seconds  
* **Energy Cost**: 30  
* **Base Effect**: \+60 Fire damage per shot  
* **Burn Buildup**: 4% per shot

**Ranks** (5 total):

1. Base ability  
2. \+90 Fire damage per shot, 5% burn buildup  
3. \+120 Fire damage per shot, 6% burn buildup, \+3s duration  
4. \+150 Fire damage per shot, 7% burn buildup, \+5s duration  
5. \+180 Fire damage per shot, 10% burn buildup, shots pierce shields

### **Fireball (Active Ability)**

**Description**: Launch an explosive fireball that detonates on impact

* **Cooldown**: 6 seconds  
* **Energy Cost**: 35  
* **Base Damage**: 400 Fire damage  
* **Explosion Radius**: 5 meters  
* **Burn Buildup**: 40% to direct hit, 20% to explosion

**Ranks** (5 total):

1. Base ability  
2. \+100 damage, 50% burn on direct hit  
3. \+200 damage, 60% burn on direct hit, \+2m radius  
4. \+300 damage, 70% burn on direct hit, leaves fire pool  
5. \+400 damage, 80% burn on direct hit, splits into 3 on kill

### **Molten Core (Passive)**

**Description**: Gain Fire Resistance and chance to ignite attackers

* **Ranks** (5 total):  
  1. \+10% Fire Resistance  
  2. \+20% Fire Resistance, 20% chance to burn melee attackers  
  3. \+30% Fire Resistance, 40% chance to burn melee attackers  
  4. \+40% Fire Resistance, 60% chance to burn all attackers  
  5. \+50% Fire Resistance, guaranteed burn on attackers, reflect 25% fire damage

### **Pyromaniac (Passive)**

**Description**: Your kills on burning enemies trigger fiery explosions

* **Explosion Damage**: 50% of enemy max health as Fire  
* **Explosion Radius**: 3 meters

**Ranks** (5 total):

1. 20% chance for explosion  
2. 40% chance for explosion  
3. 60% chance for explosion, \+1m radius  
4. 80% chance for explosion, \+2m radius  
5. 100% chance for explosion, chains to other burning enemies

---

## **Tier 2 Skills (5 Points Required)**

### **Flame Shield (Active Ability)**

**Description**: Surround yourself with a rotating fire barrier that burns enemies

* **Duration**: 10 seconds  
* **Cooldown**: 22 seconds  
* **Energy Cost**: 45  
* **Damage**: 50 Fire damage per second to nearby enemies  
* **Burn Buildup**: 10% per second  
* **Damage Reduction**: 20% while active

**Ranks** (5 total):

1. Base ability  
2. \+15 damage per second, 25% damage reduction  
3. \+30 damage per second, 30% damage reduction, wider radius  
4. \+45 damage per second, 35% damage reduction, \+3s duration  
5. \+60 damage per second, 40% damage reduction, pulses fire waves

### **Meteor Strike (Active Ability)**

**Description**: Call down a meteor that creates a persistent fire field

* **Cooldown**: 30 seconds  
* **Energy Cost**: 70  
* **Impact Damage**: 800 Fire damage  
* **Field Duration**: 8 seconds  
* **Field Damage**: 100 Fire damage per second  
* **Burn Buildup**: 60% on impact, 15% per second in field

**Ranks** (5 total):

1. Base ability  
2. \+200 impact damage, 20% field burn per second  
3. \+400 impact damage, 25% field burn per second, \+2s field duration  
4. \+600 impact damage, 30% field burn per second, larger impact  
5. \+800 impact damage, 35% field burn per second, spawns fire tornadoes

### **Elemental Warding (Passive)**

**Description**: Your mastery of Fire grants resistance to neighboring elements

* **Ranks** (3 total):  
  1. \+5% Electricity and Nature Resistance  
  2. \+10% Electricity and Nature Resistance, \+5% Fire Potency  
  3. \+15% Electricity and Nature Resistance, \+10% Fire Potency

### **Searing Touch (Passive)**

**Description**: Convert physical damage to Fire and enhance burn buildup

* **Conversion**: Affects all damage sources  
* **Ranks** (3 total):  
  1. Convert 15% of physical damage to Fire, \+5% burn buildup rate  
  2. Convert 25% of physical damage to Fire, \+10% burn buildup rate  
  3. Convert 35% of physical damage to Fire, \+15% burn buildup rate, melee ignites

### **Combustion Expert (Passive)**

**Description**: Enhance damage to burning enemies and explosion effects

* **Damage Bonus**: Multiplicative against burning enemies  
* **Explosion Enhancement**: Increases all explosion damage

**Ranks** (3 total):

1. \+20% damage to burning enemies, \+25% explosion damage  
2. \+35% damage to burning enemies, \+50% explosion damage  
3. \+50% damage to burning enemies, \+75% explosion damage, explosions spread burn

### **Inferno Power (Passive)**

**Description**: Directly increases all Fire damage dealt

* **Damage Increase**: Multiplicative bonus  
* **Ranks** (3 total):  
  1. \+20% Fire damage  
  2. \+35% Fire damage, \+10% burn duration  
  3. \+50% Fire damage, \+20% burn duration, burn can't be cleansed

---

## **Tier 3 Skills (10 Points Required)**

### **Phoenix Rising (Ultimate Ability)**

**Description**: Transform into a phoenix, gaining flight and raining fire below

* **Duration**: 8 seconds  
* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Fire Rain Damage**: 200 Fire damage per second  
* **Burn Buildup**: 25% per second to enemies below  
* **Special**: 100% damage reduction while transformed, explode on landing

### **Hellstorm (Ultimate Ability)**

**Description**: Create a massive fire vortex that seeks enemies

* **Duration**: 10 seconds  
* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Vortex Damage**: 300 Fire damage per hit  
* **Pull Radius**: 15 meters  
* **Burn Buildup**: 20% per hit  
* **Special**: Vortex grows stronger with each enemy killed

### **Plasma Surge Mastery (Combo Unlock)**

**Requirements**: 10 points in Electricity tree **Description**: Unlock Fire \+ Electricity combo effects

* **Plasma Surge**: Shocked burning enemies create plasma explosions  
* **Superheated Lightning**: Electric abilities apply 20% burn buildup  
* **Bonus**: \+10% Fire and Electricity Potency when both elements are equipped

### **Wildfire Mastery (Combo Unlock)**

**Requirements**: 10 points in Nature tree **Description**: Unlock Fire \+ Nature combo effects

* **Wildfire**: Poison clouds can be ignited for massive damage  
* **Toxic Flames**: Fire damage applies poison to nearby enemies  
* **Bonus**: \+10% Fire and Nature Potency when both elements are equipped

### **Burning Blood (Passive)**

**Description**: Gain power as enemies burn around you

* **Stack Duration**: 10 seconds  
* **Max Stacks**: 20  
* **Ranks** (3 total):  
  1. \+2% damage per burning enemy nearby (max 20%)  
  2. \+3% damage per burning enemy nearby (max 30%), heal when enemies ignite  
  3. \+5% damage per burning enemy nearby (max 50%), speed boost per stack

---

## **Tier 4 Skills (15 Points Required)**

### **Pyroclasm Lord (Capstone Passive)**

**Description**: Become the ultimate master of Fire and destruction

* **Effects**:  
  * \+100% Fire Potency  
  * \+50% Fire Resistance  
  * All Fire abilities ignore 50% of enemy Fire Resistance  
  * Burn buildup decays 50% slower (5% per second)  
  * Ignited enemies take \+100% damage from all sources  
  * Your explosions are 100% larger  
  * Killing ignited enemies spreads full burn to all nearby  
  * Fire damage heals you for 10% of damage dealt  
  * Immune to your own fire damage

---

## **Burn Mechanics Details**

### **Burn Buildup Sources**

* **Light attacks**: 4-10% (with Incendiary Rounds)  
* **Heavy attacks**: 8-15% base  
* **Direct abilities**: 40-80% typically  
* **Area effects**: 10-20% per second  
* **Explosions**: 20-40% to area

### **Burn Thresholds & Effects**

* **0-24%**: Minor heat damage (2% health/sec)  
* **25-49%**: Moderate burn (4% health/sec) \+ damage vulnerability  
* **50-74%**: Severe burn (6% health/sec) \+ panic movement  
* **75-99%**: Critical burn (8% health/sec) \+ spread on contact  
* **100%**: IGNITED \- Intense DoT (15% health/sec) for 4 seconds

### **Explosion Mechanics**

* **Trigger**: Death while burning, abilities, or combustion effects  
* **Base Damage**: 50-100% of enemy max health  
* **Spread**: Transfers 50% burn buildup to nearby enemies  
* **Chain Potential**: Explosions can ignite then explode nearby enemies

---

## **Build Paths**

### **1\. Gunslinger Pyro**

**Focus**: Weapon enhancement with Incendiary Rounds

* **Priority Skills**: Incendiary Rounds → Pyromaniac → Inferno Power → Phoenix Rising  
* **Playstyle**: Sustained fire damage through enhanced weapons  
* **Stat Priority**: Attack Speed \> Fire Damage \> Magazine Size  
* **Ultimate Choice**: Phoenix Rising for mobility and area damage

### **2\. Explosion Maniac**

**Focus**: Maximum explosion chains and area devastation

* **Priority Skills**: Fireball → Combustion Expert → Hellstorm → Pyroclasm Lord  
* **Playstyle**: Create burn then detonate everything  
* **Stat Priority**: Fire Potency \> Area Damage \> Burn Buildup  
* **Ultimate Choice**: Hellstorm for grouping enemies

### **3\. Burnout Tank**

**Focus**: Defensive build with constant burn aura

* **Priority Skills**: Flame Shield → Molten Core → Elemental Warding → Wildfire Mastery  
* **Playstyle**: Tank in melee range while everything burns  
* **Stat Priority**: Health \> Fire Resistance \> Damage Reduction  
* **Ultimate Choice**: Phoenix Rising for escape/recovery

### **4\. Meteor Mage**

**Focus**: Area denial through persistent fire fields

* **Priority Skills**: Meteor Strike → Searing Touch → Burning Blood → Plasma Surge  
* **Playstyle**: Control zones with overlapping fire fields  
* **Stat Priority**: Cooldown Reduction \> Fire Damage \> Energy  
* **Ultimate Choice**: Hellstorm for zone control

---

## **Synergies with Gear**

### **Recommended Legendary Effects**

* "Incendiary Rounds spread to nearby enemies on crit"  
* "Meteor Strike calls down 3 meteors"  
* "Explosions have 50% chance to not consume burn"  
* "Gain damage reduction based on nearby burning enemies"

### **Recommended Mythic Perks**

* "All weapons have inherent burn buildup"  
* "Ignited enemies explode every second"  
* "Your fire damage increases based on total burn in area"

### **Stat Priorities**

1. **Primary**: Fire Potency, Burn Buildup Rate  
2. **Secondary**: Explosion Radius, DoT Duration  
3. **Defensive**: Fire Resistance, Health Regen  
4. **Utility**: Area Damage, Cooldown Reduction

---

## **PvP Considerations**

### **Adjustments vs Players**

* Burn buildup capped at 60% from single ability  
* Ignite duration: 2 seconds (instead of 4\)  
* Burn decay: 20% per second (instead of 10%)  
* Explosion damage capped at 40% of player max health  
* Players gain 3 second burn immunity after being ignited

### **Strategies**

* Layer multiple burn sources for sustained pressure  
* Use terrain to trap players in fire fields  
* Coordinate explosions with team for burst damage

# **Earth Elemental Tree \- Complete Design**

## **Overview**

The Earth tree focuses on defense, crowd control through physical force, and area fortification. All Earth damage applies Fracture buildup, weakening enemies and making them vulnerable to devastating shatters.

## **Earth's Unique Identity:**

1. **Fracture Buildup Mechanic:**  
   * Most persistent buildup (only 5% decay)  
   * Directly increases damage vulnerability  
   * At 100% \= Petrify (turned to stone)  
   * Focuses on physical disruption and stagger  
2. **4 Active Abilities:**  
   * **Stone Rounds** \- Highest damage boost with knockback  
   * **Boulder Toss** \- Physics-based projectile that grows  
   * **Earthen Armor** \- Ultimate defense ability  
   * **Earthquake** \- Massive area disruption  
3. **2 Ultimate Choices:**  
   * **Titan Form** \- Become an unstoppable giant  
   * **Meteor Shower** \- Reshape the battlefield  
4. **Earth's Strengths:**  
   * Best defensive capabilities  
   * Terrain manipulation  
   * Displacement and knockback  
   * Highest armor and resistance potential  
5. **Earth's Weaknesses:**  
   * Slower ability animations  
   * Less mobility (except Titan form)  
   * Predictable, ground-based attacks  
   * Can disrupt allies with terrain

## **Unique Mechanics:**

* **Terrain Changes**: Earth abilities leave lasting battlefield effects  
* **Knockback Synergy**: Fracture builds faster when enemies hit walls  
* **Defensive Scaling**: Gets tankier with more fractured enemies nearby  
* **Physical Focus**: Best against armored enemies

## **Core Mechanic: Fracture Buildup**

* **All Earth damage** applies Fracture buildup (weapons: 5-12%, abilities: 15-50%)  
* **At 100% Fracture**: Enemy becomes Petrified for 1.5 seconds  
* **Fractured enemies** take increased damage based on buildup (1% per 5% Fracture)  
* **Fracture is persistent** (decays at only 5% per second)  
* **Physical disruption**: Fracture buildup causes stagger and interrupts

## **Active Abilities: 4 Regular \+ 2 Ultimates**

---

## **Tier 1 Skills (0 Points Required)**

### **Stone Rounds (Active Ability)**

**Description**: Coat your bullets in dense earth, adding impact damage and knockback

* **Duration**: 15 seconds  
* **Cooldown**: 20 seconds  
* **Energy Cost**: 35  
* **Base Effect**: \+70 Earth damage per shot  
* **Fracture Buildup**: 5% per shot  
* **Special**: Shots have minor knockback

**Ranks** (5 total):

1. Base ability  
2. \+100 Earth damage per shot, 7% fracture buildup  
3. \+130 Earth damage per shot, 9% fracture buildup, \+3s duration  
4. \+160 Earth damage per shot, 11% fracture buildup, \+5s duration  
5. \+200 Earth damage per shot, 15% fracture buildup, shots penetrate armor

### **Boulder Toss (Active Ability)**

**Description**: Hurl a massive boulder that rolls forward, growing in size

* **Cooldown**: 10 seconds  
* **Energy Cost**: 45  
* **Base Damage**: 500 Earth damage  
* **Fracture Buildup**: 35% per hit  
* **Special**: Boulder grows larger with distance, can hit multiple times

**Ranks** (5 total):

1. Base ability  
2. \+150 damage, 40% fracture buildup  
3. \+300 damage, 45% fracture buildup, boulder bounces once  
4. \+450 damage, 50% fracture buildup, boulder seeks enemies  
5. \+600 damage, 60% fracture buildup, explodes into shrapnel on end

### **Mountain's Resolve (Passive)**

**Description**: Gain Earth Resistance and become immovable

* **Ranks** (5 total):  
  1. \+10% Earth Resistance  
  2. \+20% Earth Resistance, 25% knockback resistance  
  3. \+30% Earth Resistance, 50% knockback resistance, \+100 armor  
  4. \+40% Earth Resistance, 75% knockback resistance, \+200 armor  
  5. \+50% Earth Resistance, immune to displacement, \+300 armor

### **Seismic Sense (Passive)**

**Description**: Your Earth attacks cause tremors that reveal and damage enemies

* **Tremor Radius**: 10 meters  
* **Reveal Duration**: 3 seconds

**Ranks** (5 total):

1. Reveals enemies through walls on Earth ability use  
2. Tremors deal 50 damage to revealed enemies  
3. Tremors deal 100 damage and apply 10% fracture  
4. Tremors deal 150 damage and apply 15% fracture  
5. Tremors deal 200 damage, apply 20% fracture, and slow by 30%

---

## **Tier 2 Skills (5 Points Required)**

### **Earthen Armor (Active Ability)**

**Description**: Encase yourself in stone armor, gaining damage reduction and reflect

* **Duration**: 12 seconds  
* **Cooldown**: 25 seconds  
* **Energy Cost**: 50  
* **Damage Reduction**: 40%  
* **Damage Reflection**: 100 Earth damage to attackers  
* **Movement Speed**: \-20% while active

**Ranks** (5 total):

1. Base ability  
2. 50% damage reduction, 150 reflection damage  
3. 60% damage reduction, 200 reflection damage, \-10% movement penalty  
4. 70% damage reduction, 250 reflection damage, no movement penalty  
5. 80% damage reduction, 300 reflection damage, \+20% movement speed

### **Earthquake (Active Ability)**

**Description**: Create a devastating earthquake that fractures the ground

* **Duration**: 4 seconds  
* **Cooldown**: 35 seconds  
* **Energy Cost**: 80  
* **Radius**: 20 meters  
* **Damage**: 150 Earth damage per second  
* **Fracture Buildup**: 20% per second  
* **Special**: Enemies are slowed by 50% in area

**Ranks** (5 total):

1. Base ability  
2. \+50 damage per second, 25% fracture per second  
3. \+100 damage per second, 30% fracture per second, \+1s duration  
4. \+150 damage per second, 35% fracture per second, creates fissures  
5. \+200 damage per second, 40% fracture per second, knocks up enemies

### **Elemental Foundation (Passive)**

**Description**: Your mastery of Earth grants resistance to neighboring elements

* **Ranks** (3 total):  
  1. \+5% Nature and Ice Resistance  
  2. \+10% Nature and Ice Resistance, \+5% Earth Potency  
  3. \+15% Nature and Ice Resistance, \+10% Earth Potency

### **Crushing Force (Passive)**

**Description**: Convert physical damage to Earth and enhance fracture buildup

* **Conversion**: Affects all damage sources  
* **Ranks** (3 total):  
  1. Convert 20% of physical damage to Earth, \+10% fracture buildup rate  
  2. Convert 30% of physical damage to Earth, \+20% fracture buildup rate  
  3. Convert 40% of physical damage to Earth, \+30% fracture buildup rate, crits knockback

### **Shatterpoint (Passive)**

**Description**: Enhance damage to fractured enemies and petrification effects

* **Damage Scaling**: Based on fracture buildup  
* **Petrify Enhancement**: Extends duration and spread

**Ranks** (3 total):

1. \+30% damage to enemies above 50% fracture  
2. \+50% damage to enemies above 50% fracture, \+0.5s petrify duration  
3. \+70% damage to enemies above 50% fracture, \+1s petrify, spreads fracture

### **Tectonic Power (Passive)**

**Description**: Directly increases all Earth damage dealt

* **Damage Increase**: Multiplicative bonus  
* **Ranks** (3 total):  
  1. \+25% Earth damage  
  2. \+40% Earth damage, \+15% fracture buildup  
  3. \+55% Earth damage, \+30% fracture buildup, pierces defenses

---

## **Tier 3 Skills (10 Points Required)**

### **Titan Form (Ultimate Ability)**

**Description**: Transform into a stone titan, gaining massive size and power

* **Duration**: 10 seconds  
* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Size Increase**: 200%  
* **Health Bonus**: \+500%  
* **Melee Damage**: 1000 Earth damage per hit  
* **Special**: Immune to all crowd control, footsteps create tremors

### **Meteor Shower (Ultimate Ability)**

**Description**: Rain down earth meteors in a massive area

* **Duration**: 6 seconds  
* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Meteors**: 20 total (random targeting)  
* **Damage per Meteor**: 600 Earth damage  
* **Fracture Buildup**: 40% per hit  
* **Special**: Creates rough terrain that persists for 30 seconds

### **Permafrost Mastery (Combo Unlock)**

**Requirements**: 10 points in Ice tree **Description**: Unlock Earth \+ Ice combo effects

* **Permafrost**: Frozen enemies hit by Earth shatter for 300% damage  
* **Frozen Spikes**: Earth abilities create ice formations  
* **Bonus**: \+10% Earth and Ice Potency when both elements are equipped

### **Overgrowth Mastery (Combo Unlock)**

**Requirements**: 10 points in Nature tree **Description**: Unlock Earth \+ Nature combo effects

* **Overgrowth**: Earth impacts spawn entangling roots  
* **Living Stone**: Petrified enemies become poison bombs  
* **Bonus**: \+10% Earth and Nature Potency when both elements are equipped

### **Unstoppable Force (Passive)**

**Description**: Gain momentum as you deal Earth damage

* **Stack Duration**: 8 seconds  
* **Max Stacks**: 10  
* **Ranks** (3 total):  
  1. \+3% movement speed and damage per stack (max 30%)  
  2. \+4% movement speed and damage per stack (max 40%), CC immunity at max  
  3. \+5% movement speed and damage per stack (max 50%), reflects projectiles

---

## **Tier 4 Skills (15 Points Required)**

### **Earthquake God (Capstone Passive)**

**Description**: Become the ultimate master of Earth and stone

* **Effects**:  
  * \+100% Earth Potency  
  * \+50% Earth Resistance  
  * All Earth abilities ignore 50% of enemy Earth Resistance  
  * Fracture buildup never decays  
  * \+100% knockback and stagger strength  
  * Petrified enemies shatter if they take 10% max health damage  
  * Your Earth abilities create permanent terrain changes  
  * Gain 50 armor per fractured enemy nearby (max 500\)  
  * Immune to all displacement effects  
  * Landing from any height creates damaging shockwaves

---

## **Fracture Mechanics Details**

### **Fracture Buildup Sources**

* **Light attacks**: 5-15% (with Stone Rounds)  
* **Heavy attacks**: 10-20% base  
* **Direct abilities**: 35-60% typically  
* **Area effects**: 20-40% per second  
* **Knockback hits**: \+10% bonus fracture

### **Fracture Thresholds & Effects**

* **0-24%**: Minor cracks visible, 5% damage vulnerability  
* **25-49%**: Moderate fractures, 10% damage vulnerability, mini-staggers  
* **50-74%**: Severe fractures, 15% damage vulnerability, ability interrupts  
* **75-99%**: Critical fractures, 20% damage vulnerability, constant stagger  
* **100%**: PETRIFIED \- Turned to stone for 1.5 seconds, 50% damage vulnerability

### **Terrain Manipulation**

* **Boulder Toss**: Leaves rubble that slows movement  
* **Earthquake**: Creates fissures that block paths  
* **Meteor Shower**: Permanent rough terrain  
* **Titan Form**: Footprints become difficult terrain

---

## **Build Paths**

### **1\. Juggernaut**

**Focus**: Unstoppable tank with Earthen Armor and Titan Form

* **Priority Skills**: Earthen Armor → Mountain's Resolve → Unstoppable Force → Titan Form  
* **Playstyle**: Wade into combat, impossible to move or kill  
* **Stat Priority**: Health \> Armor \> Earth Resistance  
* **Ultimate Choice**: Titan Form for maximum tankiness

### **2\. Seismic Destroyer**

**Focus**: Area control through earthquakes and terrain

* **Priority Skills**: Earthquake → Seismic Sense → Tectonic Power → Meteor Shower  
* **Playstyle**: Reshape battlefield with persistent effects  
* **Stat Priority**: Cooldown Reduction \> Earth Damage \> Area Size  
* **Ultimate Choice**: Meteor Shower for zone denial

### **3\. Fracture Assassin**

**Focus**: Single target burst through fracture stacking

* **Priority Skills**: Boulder Toss → Shatterpoint → Crushing Force → Permafrost Mastery  
* **Playstyle**: Build fracture then shatter for massive damage  
* **Stat Priority**: Earth Potency \> Fracture Buildup \> Crit Damage  
* **Ultimate Choice**: Either works \- preference based

### **4\. Stone Gunner**

**Focus**: Enhanced weapons with Stone Rounds

* **Priority Skills**: Stone Rounds → Crushing Force → Overgrowth Mastery → Earthquake God  
* **Playstyle**: Sustained pressure with knockback control  
* **Stat Priority**: Attack Speed \> Stability \> Magazine Size  
* **Ultimate Choice**: Meteor Shower for ranged support

---

## **Synergies with Gear**

### **Recommended Legendary Effects**

* "Stone Rounds cause enemies to explode into shrapnel on death"  
* "Boulder Toss splits into 3 boulders"  
* "Gain 1% damage reduction per 10% fracture on any enemy"  
* "Earthquake follows you for duration"

### **Recommended Mythic Perks**

* "All damage has 25% chance to petrify for 0.5 seconds"  
* "Fractured enemies take Earth damage when moving"  
* "Your terrain effects heal allies standing in them"

### **Stat Priorities**

1. **Primary**: Earth Potency, Fracture Buildup Rate  
2. **Secondary**: Armor, Knockback Strength  
3. **Defensive**: Earth Resistance, Health  
4. **Utility**: Cooldown Reduction, Area of Effect

---

## **PvP Considerations**

### **Adjustments vs Players**

* Fracture buildup capped at 70% from single ability  
* Petrify duration: 0.75 seconds (instead of 1.5)  
* Knockback distance reduced by 50%  
* Terrain effects last 50% shorter duration  
* Players gain brief knockback immunity after being knocked back

### **Strategies**

* Use terrain to control engagement zones  
* Layer fracture sources for guaranteed petrifies  
* Coordinate with team to punish immobilized enemies

# **Nature Elemental Tree \- Complete Design**

## **Overview**

The Nature tree focuses on damage over time through toxin buildup, healing/life steal, and spreading effects. All Nature damage applies Toxin buildup, with enemies becoming Blighted at 100% buildup, spreading poison to everything nearby.

## **Nature's Unique Identity:**

1. **Toxin Buildup Mechanic:**  
   * Most contagious buildup (spreads on contact)  
   * Reduces enemy healing as it builds  
   * At 100% \= Blight (massive DoT and auto-spread)  
   * Life steal scales with enemy toxin levels  
2. **4 Active Abilities:**  
   * **Venom Rounds** \- Spreading poison shots  
   * **Poison Dart** \- Creates lingering clouds  
   * **Toxic Spores** \- Growing cloud that heals allies  
   * **Parasitic Growth** \- Jumping infection  
3. **2 Ultimate Choices:**  
   * **Plague Bearer** \- Become a mobile disease vector  
   * **Living Forest** \- Massive area control and team healing  
4. **Nature's Strengths:**  
   * Best spreading/contagion mechanics  
   * Dual damage/healing role  
   * Anti-healing capabilities  
   * Self-sustaining through life steal  
5. **Nature's Weaknesses:**  
   * Damage takes time to ramp up  
   * Requires enemy grouping for best effect  
   * Can be cleansed by some abilities  
   * Less burst potential

## **Unique Mechanics:**

* **Healing/Damage Duality**: Many abilities can help allies while harming enemies  
* **Contagion System**: Poison spreads automatically between close enemies  
* **Life Economy**: Damage dealt becomes healing received  
* **Anti-Heal**: Counters high-sustain enemies

## **Core Mechanic: Toxin Buildup**

* **All Nature damage** applies Toxin buildup (weapons: 3-8%, abilities: 15-45%)  
* **At 100% Toxin**: Enemy becomes Blighted for 6 seconds  
* **Toxin spreads**: 25% transfer on contact between enemies  
* **Healing reduction**: Enemies heal 2% less per 1% Toxin buildup  
* **Life steal**: You heal for 0.5% of Nature damage dealt per 10% enemy Toxin

## **Active Abilities: 4 Regular \+ 2 Ultimates**

---

## **Tier 1 Skills (0 Points Required)**

### **Venom Rounds (Active Ability)**

**Description**: Coat your ammunition in deadly toxins that spread between enemies

* **Duration**: 14 seconds  
* **Cooldown**: 18 seconds  
* **Energy Cost**: 30  
* **Base Effect**: \+40 Nature damage per shot  
* **Toxin Buildup**: 3% per shot  
* **Special**: 20% chance shots spread to nearby enemy

**Ranks** (5 total):

1. Base ability  
2. \+60 Nature damage per shot, 4% toxin buildup  
3. \+80 Nature damage per shot, 5% toxin buildup, \+3s duration  
4. \+100 Nature damage per shot, 6% toxin buildup, \+5s duration, 30% spread chance  
5. \+120 Nature damage per shot, 8% toxin buildup, guaranteed spread on crit

### **Poison Dart (Active Ability)**

**Description**: Fire a fast projectile that creates a poison cloud on impact

* **Cooldown**: 7 seconds  
* **Energy Cost**: 35  
* **Base Damage**: 250 Nature damage  
* **Cloud Duration**: 5 seconds  
* **Cloud Damage**: 50 Nature damage per second  
* **Toxin Buildup**: 30% direct hit, 10% per second in cloud

**Ranks** (5 total):

1. Base ability  
2. \+75 damage, 35% direct toxin buildup  
3. \+150 damage, 40% direct toxin buildup, \+2s cloud duration  
4. \+225 damage, 45% direct toxin buildup, cloud follows target  
5. \+300 damage, 50% direct toxin buildup, pierces and leaves trail

### **Natural Resistance (Passive)**

**Description**: Gain Nature Resistance and immunity to various toxins

* **Ranks** (5 total):  
  1. \+10% Nature Resistance  
  2. \+20% Nature Resistance, 30% poison duration reduction  
  3. \+30% Nature Resistance, 60% poison duration reduction  
  4. \+40% Nature Resistance, immune to poison effects  
  5. \+50% Nature Resistance, convert incoming poison to health

### **Toxic Proliferation (Passive)**

**Description**: Your poison effects spread more aggressively

* **Base Spread Range**: 5 meters  
* **Spread Chance**: On enemy death or every 2 seconds

**Ranks** (5 total):

1. 20% chance to spread on death  
2. 40% chance to spread on death, \+2m range  
3. 60% chance to spread on death, spreads every 2s  
4. 80% chance to spread on death, spreads every 1.5s  
5. 100% chance to spread on death, spreads every 1s, chains infinitely

---

## **Tier 2 Skills (5 Points Required)**

### **Toxic Spores (Active Ability)**

**Description**: Release a cloud of spores that seeks enemies and grows over time

* **Duration**: 10 seconds  
* **Cooldown**: 20 seconds  
* **Energy Cost**: 45  
* **Initial Radius**: 3 meters (grows to 10 meters)  
* **Damage**: 75 Nature damage per second  
* **Toxin Buildup**: 12% per second  
* **Special**: Heals allies for 50% of damage dealt

**Ranks** (5 total):

1. Base ability  
2. \+25 damage per second, 15% toxin per second  
3. \+50 damage per second, 18% toxin per second, faster growth  
4. \+75 damage per second, 21% toxin per second, \+3s duration  
5. \+100 damage per second, 25% toxin per second, spawns mini clouds

### **Parasitic Growth (Active Ability)**

**Description**: Infect target with parasites that jump to new hosts

* **Cooldown**: 25 seconds  
* **Energy Cost**: 60  
* **Initial Damage**: 100 Nature damage per second  
* **Duration**: 8 seconds per host  
* **Jump Range**: 10 meters  
* **Toxin Buildup**: 20% on application, 5% per second

**Ranks** (5 total):

1. Base ability, jumps to 1 enemy  
2. \+30 damage per second, jumps to 2 enemies  
3. \+60 damage per second, jumps to 3 enemies, heals you  
4. \+90 damage per second, jumps to 4 enemies, \+2s duration  
5. \+120 damage per second, unlimited jumps, explodes on death

### **Elemental Symbiosis (Passive)**

**Description**: Your mastery of Nature grants resistance to neighboring elements

* **Ranks** (3 total):  
  1. \+5% Fire and Earth Resistance  
  2. \+10% Fire and Earth Resistance, \+5% Nature Potency  
  3. \+15% Fire and Earth Resistance, \+10% Nature Potency

### **Venomous Touch (Passive)**

**Description**: Convert physical damage to Nature and enhance toxin buildup

* **Conversion**: Affects all damage sources  
* **Ranks** (3 total):  
  1. Convert 15% of physical damage to Nature, \+10% toxin buildup rate  
  2. Convert 25% of physical damage to Nature, \+20% toxin buildup rate  
  3. Convert 35% of physical damage to Nature, \+30% toxin buildup rate, melee leeches life

### **Blight Specialist (Passive)**

**Description**: Enhance damage to poisoned enemies and blight effects

* **Damage Scaling**: Based on toxin buildup  
* **Blight Enhancement**: Increases spread and damage

**Ranks** (3 total):

1. \+25% damage to enemies above 50% toxin, blight lasts \+2s  
2. \+40% damage to enemies above 50% toxin, blight spreads faster  
3. \+55% damage to enemies above 50% toxin, blight jumps on expiry

### **Nature's Wrath (Passive)**

**Description**: Directly increases all Nature damage dealt

* **Damage Increase**: Multiplicative bonus  
* **Ranks** (3 total):  
  1. \+20% Nature damage, \+10% life steal  
  2. \+35% Nature damage, \+20% life steal  
  3. \+50% Nature damage, \+30% life steal, heal allies nearby

---

## **Tier 3 Skills (10 Points Required)**

### **Plague Bearer (Ultimate Ability)**

**Description**: Become a walking plague, constantly emitting toxic waves

* **Duration**: 12 seconds  
* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Wave Frequency**: Every 0.5 seconds  
* **Wave Damage**: 150 Nature damage  
* **Toxin Buildup**: 15% per wave  
* **Special**: Gain 100% movement speed and leave toxic trail

### **Living Forest (Ultimate Ability)**

**Description**: Summon a forest that entangles enemies and drains their life

* **Duration**: 15 seconds  
* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Radius**: 25 meters  
* **Root Damage**: 100 Nature damage per second  
* **Life Drain**: 5% of enemy max health per second  
* **Special**: Allies in forest gain regeneration

### **Wildfire Mastery (Combo Unlock)**

**Requirements**: 10 points in Fire tree **Description**: Unlock Nature \+ Fire combo effects

* **Wildfire**: Burning poison creates toxic explosions  
* **Corrosive Flames**: Fire damage applies corrosion  
* **Bonus**: \+10% Nature and Fire Potency when both elements are equipped

### **Overgrowth Mastery (Combo Unlock)**

**Requirements**: 10 points in Earth tree **Description**: Unlock Nature \+ Earth combo effects

* **Overgrowth**: Earth impacts spawn toxic vines  
* **Living Stone**: Petrified enemies become poison bombs  
* **Bonus**: \+10% Nature and Earth Potency when both elements are equipped

### **Symbiotic Link (Passive)**

**Description**: Share health with poisoned enemies and allies

* **Link Range**: 20 meters  
* **Effect**: Damage to poisoned enemies heals nearby allies  
* **Ranks** (3 total):  
  1. 25% of poison damage becomes healing  
  2. 50% of poison damage becomes healing, links buff allies  
  3. 75% of poison damage becomes healing, resurrect allies on blight kill

---

## **Tier 4 Skills (15 Points Required)**

### **Plague God (Capstone Passive)**

**Description**: Become the ultimate master of toxins and life

* **Effects**:  
  * \+100% Nature Potency  
  * \+50% Nature Resistance  
  * All Nature abilities ignore 50% of enemy Nature Resistance  
  * Toxin buildup spreads on any damage, not just contact  
  * Blighted enemies explode into toxic clouds on death  
  * Your poisons can affect mechanical/robotic enemies  
  * Killing poisoned enemies creates healing orbs  
  * Resurrect with 50% health when killed (60s cooldown)  
  * Allied healing increased by 100%  
  * Immune to all debuffs while at full health

---

## **Toxin Mechanics Details**

### **Toxin Buildup Sources**

* **Light attacks**: 3-8% (with Venom Rounds)  
* **Heavy attacks**: 6-12% base  
* **Direct abilities**: 30-50% typically  
* **Cloud/Area effects**: 10-25% per second  
* **Spread contact**: 25% of source toxin level

### **Toxin Thresholds & Effects**

* **0-24%**: Minor nausea, vision blur, healing \-25%  
* **25-49%**: Moderate poison (3% health/sec), healing \-50%  
* **50-74%**: Severe poison (5% health/sec), healing \-75%  
* **75-99%**: Critical poison (7% health/sec), no healing, spreads on contact  
* **100%**: BLIGHTED \- Intense poison (10% health/sec), spreads to all nearby

### **Life Steal Mechanics**

* **Base Rate**: 5% of Nature damage as healing  
* **Scaling**: \+0.5% per 10% enemy toxin buildup  
* **Distribution**: Can overflow to nearby allies  
* **Special**: Killing blighted enemies creates healing burst

---

## **Build Paths**

### **1\. Plague Gunner**

**Focus**: Weapon enhancement with spreading toxins

* **Priority Skills**: Venom Rounds → Toxic Proliferation → Nature's Wrath → Plague Bearer  
* **Playstyle**: Infect one, watch it spread to all  
* **Stat Priority**: Attack Speed \> Toxin Buildup \> Life Steal  
* **Ultimate Choice**: Plague Bearer for aggressive spreading

### **2\. Toxic Controller**

**Focus**: Area denial through persistent poison clouds

* **Priority Skills**: Poison Dart → Toxic Spores → Living Forest → Plague God  
* **Playstyle**: Create overlapping poison zones  
* **Stat Priority**: Duration \> Area Size \> Nature Damage  
* **Ultimate Choice**: Living Forest for zone control

### **3\. Parasite Host**

**Focus**: Single target infection that jumps between enemies

* **Priority Skills**: Parasitic Growth → Blight Specialist → Symbiotic Link → Wildfire  
* **Playstyle**: Infect priority targets and watch it spread  
* **Stat Priority**: Nature Potency \> Cooldown Reduction \> Health  
* **Ultimate Choice**: Either works based on team needs

### **4\. Life Drain Support**

**Focus**: Healing allies while poisoning enemies

* **Priority Skills**: Natural Resistance → Nature's Wrath → Symbiotic Link → Overgrowth  
* **Playstyle**: Balance damage and healing for team  
* **Stat Priority**: Life Steal \> Nature Damage \> Healing Power  
* **Ultimate Choice**: Living Forest for team regeneration

---

## **Synergies with Gear**

### **Recommended Legendary Effects**

* "Venom Rounds pierce through enemies, leaving toxic trails"  
* "Poison clouds follow enemies instead of staying stationary"  
* "Gain movement speed for each poisoned enemy"  
* "Toxic explosions heal allies instead of damaging them"

### **Recommended Mythic Perks**

* "All damage has 30% chance to apply toxin"  
* "Enemies at max toxin become allied poison turrets"  
* "Your death creates a massive plague explosion"

### **Stat Priorities**

1. **Primary**: Nature Potency, Toxin Buildup Rate  
2. **Secondary**: Life Steal, Spread Range  
3. **Defensive**: Nature Resistance, Health Regen  
4. **Utility**: Duration, Healing Power

---

## **PvP Considerations**

### **Adjustments vs Players**

* Toxin buildup capped at 50% from single ability  
* Blight duration: 3 seconds (instead of 6\)  
* Life steal reduced by 50% vs players  
* Spread requires line of sight between players  
* Healing reduction capped at 75%

### **Strategies**

* Focus on area denial and forcing repositioning  
* Layer multiple toxin sources for guaranteed blight  
* Use life steal to win attrition battles

# **Electricity Elemental Tree \- Complete Design**

## **Overview**

The Electricity tree focuses on chain damage, energy disruption, and high-speed combat. All Electric damage applies Charge buildup, with enemies becoming Overloaded at 100% buildup, causing them to discharge electricity to everything nearby.

## **Electricity's Unique Identity:**

1. **Charge Buildup Mechanic:**  
   * Medium decay rate (standard)  
   * Disrupts shields and abilities as it builds  
   * At 100% \= Overload (electric explosion to all nearby)  
   * Creates chain reactions between charged enemies  
2. **4 Active Abilities:**  
   * **Arc Rounds** \- Chaining weapon shots  
   * **Lightning Bolt** \- Instant strike with chains  
   * **Tesla Field** \- Mobile damage aura  
   * **Thunderstrike** \- Big impact with terrain  
3. **2 Ultimate Choices:**  
   * **Lightning Form** \- Speed transformation for aggression  
   * **Ion Cannon** \- Channeled beam for control  
4. **Electricity's Strengths:**  
   * Best multi-target damage through chains  
   * Instant damage (no projectile travel)  
   * Shield/ability disruption  
   * Speed and mobility buffs  
5. **Electricity's Weaknesses:**  
   * Requires multiple enemies for best effect  
   * Less effective vs single targets  
   * Can be blocked by terrain  
   * Energy intensive

## **Unique Mechanics:**

* **Chain System**: Smart targeting that prioritizes optimal paths  
* **Shield Disruption**: Hard counter to shield-heavy enemies  
* **Speed Scaling**: Gets faster with more charged enemies  
* **Energy Economy**: Can reduce cooldowns through Energy Vampire

## **Core Mechanic: Charge Buildup**

* **All Electric damage** applies Charge buildup (weapons: 4-10%, abilities: 20-60%)  
* **At 100% Charge**: Enemy becomes Overloaded for 2 seconds  
* **Chain reaction**: Charged enemies link electricity between each other  
* **Shield disruption**: 2% shield damage per 1% Charge buildup  
* **Speed boost**: Gain 0.5% attack speed per enemy with 50%+ Charge (max 25%)

## **Active Abilities: 4 Regular \+ 2 Ultimates**

---

## **Tier 1 Skills (0 Points Required)**

### **Arc Rounds (Active Ability)**

**Description**: Charge your weapons with electricity, adding chain damage to shots

* **Duration**: 12 seconds  
* **Cooldown**: 16 seconds  
* **Energy Cost**: 30  
* **Base Effect**: \+55 Electric damage per shot  
* **Charge Buildup**: 4% per shot  
* **Chain**: Jumps to 1 enemy within 10m for 50% damage

**Ranks** (5 total):

1. Base ability  
2. \+80 Electric damage per shot, 5% charge buildup  
3. \+105 Electric damage per shot, 6% charge buildup, chains to 2 enemies  
4. \+130 Electric damage per shot, 8% charge buildup, chains to 3 enemies  
5. \+155 Electric damage per shot, 10% charge buildup, chains full damage

### **Lightning Bolt (Active Ability)**

**Description**: Instantly strike target with lightning that chains between enemies

* **Cooldown**: 5 seconds  
* **Energy Cost**: 40  
* **Base Damage**: 350 Electric damage  
* **Chain Jumps**: 3 (loses 20% damage per jump)  
* **Charge Buildup**: 40% primary target, 20% per chain  
* **Special**: Instant cast, no travel time

**Ranks** (5 total):

1. Base ability  
2. \+100 damage, chains to 4 enemies  
3. \+200 damage, chains to 5 enemies, 10% less damage loss  
4. \+300 damage, chains to 6 enemies, no damage loss  
5. \+400 damage, unlimited chains, gains damage per jump

### **Static Shield (Passive)**

**Description**: Gain Electric Resistance and discharge damage to attackers

* **Discharge Damage**: Based on your current shields  
* **Ranks** (5 total):  
  1. \+10% Electric Resistance  
  2. \+20% Electric Resistance, attackers take 50 electric damage  
  3. \+30% Electric Resistance, attackers take 100 damage \+ mini stun  
  4. \+40% Electric Resistance, attackers take 150 damage \+ chain to ally  
  5. \+50% Electric Resistance, discharge refreshes your shields

### **Chain Reaction (Passive)**

**Description**: Your electric attacks chain more aggressively

* **Base Chain Range**: 10 meters  
* **Chain Efficiency**: Damage retained per jump

**Ranks** (5 total):

1. \+2m chain range, chains retain 60% damage  
2. \+4m chain range, chains retain 70% damage  
3. \+6m chain range, chains retain 80% damage  
4. \+8m chain range, chains retain 90% damage  
5. \+10m chain range, chains retain 100% damage, can re-hit enemies

---

## **Tier 2 Skills (5 Points Required)**

### **Tesla Field (Active Ability)**

**Description**: Create an electric field around you that damages and chains

* **Duration**: 8 seconds  
* **Cooldown**: 22 seconds  
* **Energy Cost**: 50  
* **Field Radius**: 8 meters  
* **Damage**: 100 Electric damage per second  
* **Charge Buildup**: 15% per second  
* **Special**: Damage chains between enemies in field

**Ranks** (5 total):

1. Base ability  
2. \+30 damage per second, 18% charge per second  
3. \+60 damage per second, 21% charge per second, \+2m radius  
4. \+90 damage per second, 24% charge per second, \+2s duration  
5. \+120 damage per second, 30% charge per second, speeds up allies

### **Thunderstrike (Active Ability)**

**Description**: Call down a massive lightning strike that creates electric terrain

* **Cooldown**: 28 seconds  
* **Energy Cost**: 70  
* **Impact Damage**: 1000 Electric damage  
* **Terrain Duration**: 10 seconds  
* **Terrain Damage**: 50 Electric damage per second  
* **Charge Buildup**: 60% on impact, 10% per second in field

**Ranks** (5 total):

1. Base ability  
2. \+250 impact damage, 15% terrain charge per second  
3. \+500 impact damage, 20% terrain charge per second, larger area  
4. \+750 impact damage, 25% terrain charge per second, multiple strikes  
5. \+1000 impact damage, 30% terrain charge per second, terrain spreads

### **Elemental Conductivity (Passive)**

**Description**: Your mastery of Electricity grants resistance to neighboring elements

* **Ranks** (3 total):  
  1. \+5% Ice and Fire Resistance  
  2. \+10% Ice and Fire Resistance, \+5% Electric Potency  
  3. \+15% Ice and Fire Resistance, \+10% Electric Potency

### **Shocking Touch (Passive)**

**Description**: Convert physical damage to Electric and enhance charge buildup

* **Conversion**: Affects all damage sources  
* **Ranks** (3 total):  
  1. Convert 15% of physical damage to Electric, \+15% charge buildup rate  
  2. Convert 25% of physical damage to Electric, \+25% charge buildup rate  
  3. Convert 35% of physical damage to Electric, \+35% charge buildup rate, crits stun

### **Overload Specialist (Passive)**

**Description**: Enhance damage to charged enemies and overload effects

* **Damage Scaling**: Based on charge buildup  
* **Overload Enhancement**: Bigger explosions

**Ranks** (3 total):

1. \+30% damage to enemies above 50% charge, overload lasts \+1s  
2. \+45% damage to enemies above 50% charge, overload chains further  
3. \+60% damage to enemies above 50% charge, overload recharges abilities

### **Storm Power (Passive)**

**Description**: Directly increases all Electric damage dealt

* **Damage Increase**: Multiplicative bonus  
* **Ranks** (3 total):  
  1. \+25% Electric damage, \+10% chain range  
  2. \+40% Electric damage, \+20% chain range  
  3. \+55% Electric damage, \+30% chain range, chains pierce obstacles

---

## **Tier 3 Skills (10 Points Required)**

### **Lightning Form (Ultimate Ability)**

**Description**: Transform into living lightning, gaining extreme speed and chain attacks

* **Duration**: 8 seconds  
* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Movement Speed**: \+200%  
* **All attacks chain**: To 5 enemies  
* **Charge Buildup**: 20% per hit to all enemies  
* **Special**: Phase through enemies, leaving electric trails

### **Ion Cannon (Ultimate Ability)**

**Description**: Channel a devastating beam of electricity that pierces everything

* **Channel Duration**: 4 seconds  
* **Cooldown**: 90 seconds  
* **Energy Cost**: 100  
* **Damage**: 500 Electric damage per second  
* **Beam Width**: 5 meters  
* **Charge Buildup**: 25% per second  
* **Special**: Beam follows cursor, unlimited range

### **Superconductor Mastery (Combo Unlock)**

**Requirements**: 10 points in Ice tree **Description**: Unlock Electricity \+ Ice combo effects

* **Superconductor**: Chains gain \+100% jumps on frozen enemies  
* **Frost Lightning**: Electric damage can freeze  
* **Bonus**: \+10% Electric and Ice Potency when both elements are equipped

### **Plasma Surge Mastery (Combo Unlock)**

**Requirements**: 10 points in Fire tree **Description**: Unlock Electricity \+ Fire combo effects

* **Plasma Surge**: Shocked burning enemies create plasma fields  
* **Superheated Chains**: Lightning ignites enemies  
* **Bonus**: \+10% Electric and Fire Potency when both elements are equipped

### **Energy Vampire (Passive)**

**Description**: Drain energy from charged enemies to fuel your abilities

* **Drain Rate**: Per enemy with 50%+ charge nearby  
* **Effect Range**: 20 meters  
* **Ranks** (3 total):  
  1. \-2s to all cooldowns per charged enemy (max \-10s)  
  2. \-3s to all cooldowns per charged enemy (max \-15s), gain energy  
  3. \-4s to all cooldowns per charged enemy (max \-20s), instant reload

---

## **Tier 4 Skills (15 Points Required)**

### **Storm God (Capstone Passive)**

**Description**: Become the ultimate master of lightning and storms

* **Effects**:  
  * \+100% Electric Potency  
  * \+50% Electric Resistance  
  * All Electric abilities ignore 50% of enemy Electric Resistance  
  * Chain damage no longer diminishes with jumps  
  * Overloaded enemies create lightning storms  
  * Your movement generates damaging static fields  
  * Critical strikes have 100% chance to chain  
  * Gain 1% damage per active chain (no cap)  
  * Electric terrain heals your shields  
  * Immune to stuns and slows while shields are active

---

## **Charge Mechanics Details**

### **Charge Buildup Sources**

* **Light attacks**: 4-10% (with Arc Rounds)  
* **Heavy attacks**: 8-15% base  
* **Direct abilities**: 40-60% typically  
* **Chain hits**: 50% of source charge  
* **Field effects**: 10-30% per second

### **Charge Thresholds & Effects**

* **0-24%**: Minor sparks, shields take \+25% damage  
* **25-49%**: Moderate charge, shields take \+50% damage, mini stuns  
* **50-74%**: High charge, shields take \+75% damage, abilities disabled  
* **75-99%**: Critical charge, no shields, constant micro-stuns  
* **100%**: OVERLOADED \- Explodes electricity to all within 15m

### **Chain Lightning Mechanics**

* **Base Jumps**: 3-5 depending on ability  
* **Jump Range**: 10-20 meters (upgradeable)  
* **Smart Targeting**: Prioritizes highest health enemies  
* **Chain Memory**: Won't hit same enemy twice (unless upgraded)

---

## **Build Paths**

### **1\. Chain Gunner**

**Focus**: Weapon enhancement with maximum chains

* **Priority Skills**: Arc Rounds → Chain Reaction → Storm Power → Lightning Form  
* **Playstyle**: Every shot hits multiple enemies  
* **Stat Priority**: Attack Speed \> Chain Range \> Electric Damage  
* **Ultimate Choice**: Lightning Form for mobility

### **2\. Caster Storm**

**Focus**: Ability spam with energy vampire

* **Priority Skills**: Lightning Bolt → Energy Vampire → Overload Specialist → Ion Cannon  
* **Playstyle**: Constant ability rotation  
* **Stat Priority**: Cooldown Reduction \> Electric Potency \> Energy  
* **Ultimate Choice**: Ion Cannon for burst damage

### **3\. Tesla Tank**

**Focus**: Melee range electric field build

* **Priority Skills**: Tesla Field → Static Shield → Superconductor → Storm God  
* **Playstyle**: Walk into enemies while electrifying everything  
* **Stat Priority**: Health \> Shield Capacity \> Electric Resistance  
* **Ultimate Choice**: Lightning Form for aggressive engage

### **4\. Territory Control**

**Focus**: Electric terrain and area denial

* **Priority Skills**: Thunderstrike → Shocking Touch → Plasma Surge → Either Ultimate  
* **Playstyle**: Create overlapping electric zones  
* **Stat Priority**: Area Size \> Duration \> Electric Damage  
* **Ultimate Choice**: Ion Cannon for lane control

---

## **Synergies with Gear**

### **Recommended Legendary Effects**

* "Arc Rounds chain in a circle back to original target"  
* "Lightning Bolt strikes all enemies between you and target"  
* "Gain shield equal to electric damage dealt"  
* "Tesla Field moves with you at double size"

### **Recommended Mythic Perks**

* "All damage has 50% chance to chain"  
* "Overloaded enemies become lightning rods for 10 seconds"  
* "Your chains create persistent electric beams"

### **Stat Priorities**

1. **Primary**: Electric Potency, Chain Distance  
2. **Secondary**: Attack Speed, Shield Capacity  
3. **Defensive**: Electric Resistance, Shield Recharge  
4. **Utility**: Cooldown Reduction, Energy Regen

---

## **PvP Considerations**

### **Adjustments vs Players**

* Charge buildup capped at 60% from single ability  
* Overload duration: 1 second (instead of 2\)  
* Chain damage reduced by 30% vs players  
* Stun effects become slows in PvP  
* Shield disruption capped at 50%

### **Strategies**

* Use chains to hit enemies behind cover  
* Coordinate overloads for team burst windows  
* Control choke points with electric terrain

[image1]: <data:image/png;base64,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>