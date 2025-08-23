# 🎮 Courier Web Framework - Database Summary

**Generated:** August 23, 2025  
**Database:** courier.db (SQLite)  
**Framework Version:** Current Development Build

---

## 📊 Database Overview

The Courier Web Framework database contains a comprehensive character progression and inventory system with:
- **4 Players** registered
- **4 Characters** created
- **54 Skills** across 6 skill trees
- **37 Items** (weapons, armor, mods)
- **4 Character Classes** available

---

## 🏗️ Database Schema

### Core Tables
1. **players** - User accounts and authentication
2. **character_classes** - Available player classes
3. **characters** - Player-created characters
4. **skills** - Skill tree system (class + elemental)
5. **items** - Equipment, weapons, armor, and mods
6. **character_inventory** - Character item storage
7. **character_equipped** - Currently equipped items
8. **character_skills** - Character skill investments
9. **character_stats** - Character statistics
10. **character_composite_items** - Crafted/modified items
11. **character_weapon_mods** - Weapon modification system

---

## 👤 Character Classes

| Class ID | Name | Description | Health | Power | Shield | Crit Chance | Crit Damage |
|----------|------|-------------|--------|-------|--------|-------------|-------------|
| **operative** | Operative | Versatile soldier skilled in assault tactics | 100 | 300 | 50 | 5% | 1.5x |
| **specialist** | Specialist | Technical expert focused on gadgets and precision | 98 | 300 | 52 | 5% | 1.5x |
| **guardian** | Guardian | Defensive powerhouse with heavy armor | 102 | 300 | 48 | 4% | 1.4x |
| **outlaw** | Outlaw | Agile rogue specializing in speed and crits | 99 | 300 | 49 | 7% | 1.7x |

---

## 🌟 Skill Trees System

### 6 Skill Trees Available

| Tree | Type | Skills | Tiers | Description |
|------|------|--------|-------|-------------|
| 🤠 **Outlaw** | Class | 12 | 1-6 | Gunslinger abilities, critical hits, ultimates |
| 🔥 **Fire** | Elemental | 9 | 1-4 | Combustion, inferno, flame abilities |
| ❄️ **Ice** | Elemental | 8 | 1-4 | Frost, freeze, cryogenic abilities |
| ⚡ **Electric** | Elemental | 7 | 1-4 | Lightning, shock, storm abilities |
| 🌍 **Earth** | Elemental | 9 | 1-4 | Stone, earthquake, geological abilities |
| 🌿 **Nature** | Elemental | 9 | 1-4 | Growth, poison, nature abilities |

#### **Total Skills: 54**

### Skill Tree Structure

#### 🤠 Outlaw Class Tree (12 Skills)
- **Tier 1:** Dead Eye, Quick Hands, Lucky Charm
- **Tier 2:** Handgun Specialist, Sniper Specialist, Shotgun Specialist, Steady Aim, Hair Trigger, Gunslinger Focus
- **Tier 6:** High Noon, Dead Man's Hand, Perfect Shot

#### 🔥 Fire Elemental Tree (9 Skills - 4 Tiers)
- **Tier 1:** Combustion Mastery, Flame Weapon, Heat Resistance
- **Tier 2:** Fireball, Flame Wall, Burning Ground
- **Tier 3:** Phoenix Surge, Combination Mastery: Fire
- **Tier 4:** Pyroclasm Lord (Capstone)

#### ❄️ Ice Elemental Tree (8 Skills - 4 Tiers)
- **Tier 1:** Cryogenic Mastery, Frost Weapon, Cold Resistance
- **Tier 2:** Ice Shard, Ice Barrier, Frozen Zone
- **Tier 3:** Winter's Embrace
- **Tier 4:** Frost Sovereign (Capstone)

#### ⚡ Electric Elemental Tree (7 Skills - 4 Tiers)
- **Tier 1:** Voltage Mastery, Storm Weapon, Insulation
- **Tier 2:** Lightning Bolt, Tesla Field
- **Tier 3:** Thunderstorm
- **Tier 4:** Storm Lord (Capstone)

#### 🌍 Earth Elemental Tree (9 Skills - 4 Tiers)
- **Tier 1:** Stone Mastery, Rock Weapon, Mineral Skin
- **Tier 2:** Stone Wall, Earthquake, Boulder Throw
- **Tier 3:** Avalanche, Fortress
- **Tier 4:** Mountain Lord (Capstone)

#### 🌿 Nature Elemental Tree (9 Skills - 4 Tiers)
- **Tier 1:** Growth Mastery, Thorn Weapon, Natural Resistance
- **Tier 2:** Poison Cloud, Entangle, Regeneration
- **Tier 3:** Nature's Wrath, Symbiosis
- **Tier 4:** Forest Guardian (Capstone)

---

## ⚔️ Items & Equipment System

### Item Distribution (37 Total Items)

| Category | Count | Description |
|----------|-------|-------------|
| **Weapons** | 11 | Primary combat equipment |
| **Armor** | 13 | Defensive gear |
| **Mods** | 13 | Enhancement components |

### Item Rarity Distribution

| Rarity | Count | Color | Description |
|--------|-------|-------|-------------|
| **Common** | 14 | Gray | Basic equipment |
| **Uncommon** | 3 | Green | Slightly enhanced |
| **Rare** | 7 | Blue | Notable improvements |
| **Epic** | 5 | Purple | Significant power |
| **Legendary** | 7 | Orange | Exceptional gear |
| **Exotic** | 1 | Yellow | Unique/special |

### Weapon Types
- Pistols, SMGs, Assault Rifles
- Shotguns, Sniper Rifles
- Various damage ranges and properties

### Armor Types
- Helmets, Chests, Legs, Boots
- Different protection levels
- Class-specific bonuses

### Modification System
- **13 Mod Types** available
- Weapon enhancement system
- Composite item crafting

---

## 👥 Player Characters

### Registered Players: 4
### Active Characters: 4

| ID | Name | Class | Level | Experience | Skill Points | Status |
|----|------|-------|-------|------------|--------------|--------|
| 1 | loki | Outlaw | 1 | 0/1000 | 1 available | Active |
| 2 | loki | Outlaw | 1 | 0/1000 | 1 available | Active |
| 3 | Loki | Guardian | 2 | 100/1100 | 2 available | Active |
| 4 | Test Outlaw | Outlaw | 1 | 0/1000 | 1 available | Active |

---

## 🎯 Game Progression Features

### Character Development
- **Level-based progression** (1-60+)
- **Skill point allocation** system
- **Paragon levels** for endgame
- **Multi-character support** per player

### Inventory Management
- **Equipment slots** (weapons, armor)
- **Modification system** for gear enhancement
- **Item rarity tiers** with increasing power
- **Storage system** for items

### Skill Progression
- **Tier-locked advancement** requiring prerequisites
- **Class-specific skills** for specialization
- **Elemental mastery** trees for all classes
- **Ultimate abilities** at higher tiers

---

## 🔧 Technical Implementation

### Database Engine
- **SQLite 3** for portability and performance
- **Foreign key constraints** ensuring data integrity
- **Auto-incrementing IDs** for primary keys
- **Timestamp tracking** for creation/modification

### Character System Architecture
- **Player → Character hierarchy** (1:many relationship)
- **Class-based character creation** with unique stats
- **Skill investment tracking** per character
- **Equipment state management** per character

### API Integration
- **RESTful endpoints** for all data access
- **Authentication-protected** character data
- **Real-time skill tree** loading
- **Dynamic inventory** management

---

## 📈 Current Development Status

### ✅ Completed Systems
- **User authentication** and character management
- **Complete skill trees** (54 skills across 6 trees)
- **Item database** with 37+ items
- **Equipment/inventory system**
- **Character progression tracking**

### 🔄 Active Features
- **Web-based character management**
- **Skill point investment** interface
- **Real-time character updates**
- **Multi-character support** per account

---

## 🎮 Game Design Notes

### Skill System Philosophy
- **Class identity** maintained through unique class trees
- **Elemental versatility** available to all classes
- **Meaningful choices** through tier prerequisites
- **Capstone abilities** for mastery rewards

### Progression Balance
- **60 skill points** available at max level
- **4-tier elemental trees** for depth
- **Multiple build paths** per class
- **Respec capability** for experimentation

### Equipment Philosophy
- **Rarity-based power scaling**
- **Modification system** for customization
- **Class synergies** through appropriate gear
- **Meaningful upgrades** through progression

---

*This database summary represents the current state of the Courier Web Framework development build as of August 23, 2025.*