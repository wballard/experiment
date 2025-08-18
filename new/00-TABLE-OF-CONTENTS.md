# COURIER - UNIFIED GAME DESIGN DOCUMENTS
**Master Table of Contents**

## Document Overview

This directory contains the unified and organized game design documents for Courier, a sci-fi ARPG/looter shooter. All conflicts between previous documents have been resolved and integrated into a coherent design.

---

## 📋 DOCUMENT INDEX

### **01-EXECUTIVE-SUMMARY.md**
High-level game overview, core innovations, and design pillars. Includes the Power Budget System concept and game identity.

### **02-PLAYER-ONBOARDING.md**
New player experience and web-based tutorial system:
- Web-first gameplay design and browser optimization
- Tutorial progression from character creation to first missions
- Progressive system introduction and complexity management
- Player retention strategies and success metrics

### **03-CHARACTER-SYSTEMS.md**
Complete character progression system including:
- Level progression (1-60 + Paragon)
- 6 Primary attributes and their effects
- 5 Character classes with starting bonuses
- Skill point allocation system

### **04-ELEMENTAL-SKILLS.md**
Comprehensive elemental skill trees and progression:
- 5 elemental skill trees with 30-45 points each
- Tier-based progression system (Foundation, Specialization, Mastery)
- Active abilities and passive bonuses for each element
- Combination mastery and adjacency synergies

### **Elemental System.md**
Primary elemental mechanics and Ice tree design:
- Damage modifier systems and calculation rules
- Complete Ice elemental tree with full skill progression
- Freeze buildup mechanics and shatter interactions
- Active abilities and ultimate skills for Ice specialization

### **05-ELEMENTAL-COMBAT.md**
The five-element system with status effects:
- Element wheel and adjacency rules
- Status buildup mechanics (percentage-based)
- Detailed status effects for each element
- Elemental combination possibilities

### **06-EQUIPMENT-ITEMIZATION.md**
Power Budget system and equipment structure:
- Power budget formula and rarity efficiency
- Equipment slots (2 weapons, 7 armor)
- Item rarity system (7 tiers)
- Strategic itemization choices

### **07-WEAPON-SYSTEMS.md**
Weapon archetypes and modification system:
- 5 base weapon archetypes with stats
- 7-slot modification system (to be refined)
- Weapon variant creation through mods
- Statistical display approach

### **08-MISSION-CONTENT.md**
Mission categories and affix system:
- 3 mission types (Patrol, Horde, Expedition)
- Weekly rotating affix system
- Environmental and combat modifiers
- Scaling difficulty and rewards

### **09-PROGRESSION-ECONOMY.md**
Character advancement and faction systems:
- Currency system (simplified for now)
- Faction reputation and rewards
- Long-term progression goals
- Economic balance principles

### **10-TECHNICAL-IMPLEMENTATION.md**
Core formulas and calculation methods:
- Power budget validation
- Mission success calculations
- Status effect processing
- System integration guidelines

---

## 🎯 KEY DESIGN DECISIONS RESOLVED

**Character Progression**: Level cap 60 with Paragon levels, 6 attributes, 60 skill points total

**Power Budget**: Formula-based equipment limitation system with rarity efficiency multipliers

**Elemental System**: 5 elements with adjacent-only dual selection, percentage-based status buildup

**Weapon System**: 5 archetypes with modification variants, 2-slot equipment

**Mission System**: 3 categories with weekly rotating affixes, removed Raid category

**Display Philosophy**: Numerical values only, eliminated bar chart stats

---

## 🔄 SYSTEMS REQUIRING FUTURE DEVELOPMENT

- **Class Skill Trees**: Detailed progression paths for each class
- **Weapon Modifications**: Refinement of 7-slot system
- **Currency & Economy**: Expansion from simplified base
- **Crafting Integration**: Power budget crafting mechanics
- **PvP Balance**: Status and damage adjustments
- **Endgame Content**: Post-60 activities and goals

---

## 📖 READING ORDER

For new team members or stakeholders:
1. **Executive Summary** - Understand the game vision
2. **Player Onboarding** - New player experience and web platform
3. **Character Systems** - Core progression mechanics  
4. **Elemental Skills** - Skill trees and progression paths
5. **Elemental System** - Damage mechanics and Ice tree design
6. **Elemental Combat** - Status effects and combinations
7. **Equipment & Itemization** - Gear progression innovation
8. **Remaining documents** - Based on development focus

For specific development teams:
- **Programming**: Technical Implementation + relevant systems
- **Design**: All documents with focus on affected systems
- **Art**: Character Systems, Weapon Systems for visual requirements
- **QA**: Mission Content, Technical Implementation for testing
- **UX/UI**: Player Onboarding for tutorial flow and web optimization

---

**Document Version**: 1.0 Unified  
**Last Updated**: Current Session  
**Status**: Conflicts Resolved, Ready for Development