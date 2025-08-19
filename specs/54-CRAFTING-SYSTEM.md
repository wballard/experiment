# CRAFTING SYSTEM
**Equipment Creation & Modification Platform**

---

## SYSTEM OVERVIEW

The Crafting System empowers players to create custom equipment, upgrade existing gear, and modify weapons to suit their specific playstyles. This system provides an alternative progression path that complements the loot and marketplace systems while offering deep customization options.

### Core Philosophy
- **Customization Over Power**: Crafting focuses on personalization rather than creating overpowered items
- **Resource Investment**: Meaningful material costs prevent trivial crafting
- **Skill-Based Progression**: Crafting expertise develops over time
- **Power Budget Compliance**: All crafted items respect the power budget system
- **Modification Focus**: Emphasis on modifying existing items rather than creating from scratch

---

## CRAFTING CATEGORIES

### Primary Crafting Types
```
CRAFTING STATION
├── WEAPON MODIFICATION
│   ├── Scopes & Optics
│   ├── Barrels & Suppressors
│   ├── Stocks & Grips
│   └── Magazine & Feed Systems
├── ARMOR ENHANCEMENT
│   ├── Plating & Reinforcement
│   ├── Electronic Systems
│   ├── Mobility Enhancements
│   └── Environmental Protection
├── AMMUNITION CRAFTING
│   ├── Specialized Rounds
│   ├── Elemental Ammunition
│   ├── Armor-Piercing Variants
│   └── Non-Lethal Options
└── CONSUMABLE CREATION
    ├── Temporary Buffs
    ├── Healing Items
    ├── Utility Tools
    └── Environmental Gear
```

### Crafting Specializations
```javascript
// Crafting skill trees
const craftingSpecializations = {
    weaponsmithing: {
        focus: 'Weapon modifications and upgrades',
        skills: ['precision-tuning', 'barrel-crafting', 'electronic-systems'],
        unlocks: ['custom-scopes', 'specialized-ammunition', 'weapon-variants']
    },
    armorcraft: {
        focus: 'Armor enhancement and protection systems',
        skills: ['plate-working', 'electronics-integration', 'mobility-systems'],
        unlocks: ['custom-plating', 'shield-systems', 'environmental-suits']
    },
    chemistry: {
        focus: 'Consumables and ammunition creation',
        skills: ['compound-mixing', 'elemental-infusion', 'stabilization'],
        unlocks: ['exotic-compounds', 'elemental-rounds', 'medical-supplies']
    }
};
```

---

## MATERIAL SYSTEM

### Resource Categories
```javascript
// Comprehensive material classification
const materialTypes = {
    metals: {
        common: ['steel', 'aluminum', 'copper'],
        uncommon: ['titanium', 'tungsten', 'chromium'],
        rare: ['progenitor-alloy', 'quantum-steel', 'void-metal'],
        sources: ['salvage', 'mining', 'mission-rewards']
    },
    electronics: {
        common: ['basic-circuits', 'standard-processors', 'simple-sensors'],
        uncommon: ['advanced-chips', 'quantum-processors', 'targeting-systems'],
        rare: ['ai-cores', 'progenitor-tech', 'temporal-circuits'],
        sources: ['technology-missions', 'facility-raids', 'tech-salvage']
    },
    chemicals: {
        common: ['basic-compounds', 'standard-propellants', 'simple-acids'],
        uncommon: ['exotic-compounds', 'elemental-essences', 'stabilizers'],
        rare: ['progenitor-chemicals', 'temporal-flux', 'void-catalysts'],
        sources: ['chemical-missions', 'environmental-extraction', 'laboratory-raids']
    }
};
```

### Material Acquisition
- **Mission Rewards**: Primary source of crafting materials
- **Salvage Operations**: Break down unwanted equipment for materials
- **Environmental Extraction**: Gather materials from mission environments
- **Marketplace Trading**: Purchase materials from other players
- **Faction Rewards**: Specialized materials from faction progression

### Material Quality System
```javascript
// Material quality affects crafting outcomes
const materialQuality = {
    standard: { successBonus: 0, qualityBonus: 0, costMultiplier: 1.0 },
    refined: { successBonus: 10, qualityBonus: 5, costMultiplier: 1.5 },
    purified: { successBonus: 20, qualityBonus: 15, costMultiplier: 2.5 },
    perfect: { successBonus: 35, qualityBonus: 30, costMultiplier: 5.0 }
};
```

---

## WEAPON MODIFICATION

### Modification Categories
```javascript
// Weapon modification system
const weaponModifications = {
    barrels: {
        types: ['extended', 'suppressed', 'heavy', 'precision'],
        effects: {
            extended: { range: +15, accuracy: +5, weight: +10 },
            suppressed: { stealth: +25, damage: -5, recoil: -10 },
            heavy: { damage: +10, recoil: +15, mobility: -5 },
            precision: { accuracy: +20, critChance: +8, fireRate: -10 }
        }
    },
    scopes: {
        types: ['reflex', 'holographic', 'telescopic', 'thermal'],
        effects: {
            reflex: { adsSpeed: +20, accuracy: +10, zoom: 1.5 },
            holographic: { accuracy: +15, targetAcquisition: +25, zoom: 2.0 },
            telescopic: { range: +30, accuracy: +25, zoom: 6.0 },
            thermal: { detection: +40, nightVision: true, zoom: 4.0 }
        }
    }
};
```

### Modification Process
1. **Select Base Weapon**: Choose weapon to modify
2. **Choose Modification Type**: Select barrel, scope, stock, etc.
3. **Material Selection**: Choose materials and quality level
4. **Crafting Execution**: Perform crafting with success/failure chance
5. **Quality Determination**: Result quality affects final stats
6. **Installation**: Apply modification to weapon

### Power Budget Integration
```javascript
// Modification power cost calculation
function calculateModificationCost(baseCost, modification, materialQuality) {
    let modificationCost = modification.powerCost || 0;
    let qualityMultiplier = materialQuality.costMultiplier || 1.0;
    let efficiencyBonus = materialQuality.qualityBonus || 0;
    
    return Math.floor((baseCost + modificationCost) * qualityMultiplier * (1 - efficiencyBonus/100));
}
```

---

## ARMOR ENHANCEMENT

### Enhancement Types
```javascript
// Armor enhancement system
const armorEnhancements = {
    plating: {
        ablative: { physicalResist: +15, durability: -20, weight: +5 },
        reactive: { explosiveResist: +30, repairCost: +50, special: 'explosive-response' },
        composite: { allResist: +8, weight: +10, powerCost: +15 },
        smart: { adaptiveResist: true, powerCost: +25, maintenance: +100 }
    },
    systems: {
        shields: { shieldCapacity: 500, rechargeRate: 50, powerCost: +30 },
        medical: { healthRegen: +5, poisonResist: +50, powerCost: +20 },
        mobility: { speed: +15, jumpHeight: +25, powerCost: +15 },
        stealth: { detection: -40, movementNoise: -60, powerCost: +35 }
    }
};
```

### Enhancement Installation
- **Compatibility Check**: Verify armor can support enhancement
- **Power Budget Validation**: Ensure enhancement fits within budget
- **Installation Process**: Multi-step crafting procedure
- **Testing Phase**: Validate enhancement functionality
- **Optimization**: Fine-tune enhancement parameters

### Modular Enhancement System
```javascript
// Modular armor enhancement slots
class ArmorEnhancementManager {
    constructor(armorPiece) {
        this.baseArmor = armorPiece;
        this.enhancementSlots = this.calculateSlots(armorPiece.rarity);
        this.installedEnhancements = [];
        this.powerCostMultiplier = 1.0;
    }
    
    installEnhancement(enhancement, slot) {
        if (!this.canInstallEnhancement(enhancement, slot)) {
            return { success: false, reason: this.getInstallationError(enhancement, slot) };
        }
        
        this.installedEnhancements[slot] = enhancement;
        this.updateArmorStats();
        
        return { success: true, newStats: this.calculateFinalStats() };
    }
}
```

---

## AMMUNITION CRAFTING

### Ammunition Types
```javascript
// Specialized ammunition crafting
const ammunitionTypes = {
    elemental: {
        fire: { effect: 'burn', duration: 5, damageBonus: 0.15 },
        ice: { effect: 'freeze', duration: 3, critBonus: 1.5 },
        electric: { effect: 'shock', chainTargets: 2, stunChance: 0.3 },
        earth: { effect: 'poison', stackingDamage: true, duration: 8 },
        nature: { effect: 'slow', speedReduction: 0.4, accuracyBonus: 1.2 }
    },
    specialized: {
        armorPiercing: { armorPenetration: +50, damage: -10, cost: 1.5 },
        explosive: { aoeRadius: 3, aoeDamage: 0.6, directDamage: -20 },
        tracer: { accuracy: +25, enemyDetection: +100, stealth: -50 },
        subsonic: { stealth: +30, damage: -15, range: -20 }
    }
};
```

### Crafting Requirements
- **Base Components**: Standard ammunition as foundation
- **Elemental Essences**: For elemental ammunition variants
- **Specialized Materials**: For armor-piercing, explosive, etc.
- **Stabilizing Agents**: Prevent ammunition degradation
- **Quality Control**: Testing and validation procedures

### Batch Production
```javascript
// Efficient ammunition crafting
class AmmunitionCrafting {
    craftBatch(type, quantity, materialQuality) {
        const batchEfficiency = this.calculateBatchEfficiency(quantity);
        const qualityModifier = materialQuality.successBonus / 100;
        
        let successfulRounds = 0;
        let failedRounds = 0;
        
        for (let i = 0; i < quantity; i++) {
            const successChance = this.baseSuccessChance + qualityModifier + batchEfficiency;
            if (Math.random() < successChance) {
                successfulRounds++;
            } else {
                failedRounds++;
            }
        }
        
        return {
            successful: successfulRounds,
            failed: failedRounds,
            materialsConsumed: this.calculateMaterialConsumption(quantity, failedRounds),
            qualityDistribution: this.calculateQualityDistribution(successfulRounds, materialQuality)
        };
    }
}
```

---

## CONSUMABLE CREATION

### Consumable Categories
```javascript
// Consumable crafting system
const consumableTypes = {
    medical: {
        healthPack: { healAmount: 500, duration: 'instant', cooldown: 30 },
        regenBooster: { regenRate: +10, duration: 120, stackLimit: 1 },
        antidote: { poisonCure: true, poisonResist: +100, duration: 300 },
        stimpack: { allStats: +5, duration: 180, sideEffects: 'fatigue-after' }
    },
    tactical: {
        smokeGrenade: { concealment: true, radius: 5, duration: 45 },
        flashbang: { stunEffect: true, radius: 8, duration: 10 },
        deployableCover: { coverValue: 75, durability: 1000, deployment: 5 },
        hackingKit: { securityBypass: +50, uses: 3, specialist: 'technomancer' }
    },
    utility: {
        repairKit: { equipmentRepair: 25, uses: 5, weight: 2 },
        energyCell: { shieldRecharge: 200, duration: 'instant', cooldown: 60 },
        scannerUpgrade: { detectionRange: +50, duration: 600, batteryLife: 3 },
        environmentalSuit: { hazardResist: +90, duration: 1800, mobility: -10 }
    }
};
```

### Recipe System
```javascript
// Dynamic recipe discovery and creation
class RecipeManager {
    constructor() {
        this.knownRecipes = new Map();
        this.discoveredCombinations = new Set();
        this.experimentalRecipes = new Map();
    }
    
    discoverRecipe(materials, process) {
        const combination = this.hashCombination(materials, process);
        
        if (!this.discoveredCombinations.has(combination)) {
            const result = this.experimentWithCombination(materials, process);
            
            if (result.success) {
                this.knownRecipes.set(combination, result.recipe);
                this.discoveredCombinations.add(combination);
                return { discovered: true, recipe: result.recipe };
            }
        }
        
        return { discovered: false };
    }
}
```

---

## CRAFTING PROGRESSION

### Skill Development
```javascript
// Crafting skill progression system
const craftingProgression = {
    experience: {
        sources: ['successful-crafts', 'failed-attempts', 'recipe-discovery', 'teaching-others'],
        multipliers: { success: 1.0, failure: 0.3, discovery: 2.0, teaching: 0.5 }
    },
    skillLevels: {
        novice: { level: 1, unlocks: ['basic-recipes', 'material-identification'] },
        apprentice: { level: 25, unlocks: ['quality-control', 'batch-production'] },
        journeyman: { level: 50, unlocks: ['advanced-recipes', 'efficiency-bonuses'] },
        expert: { level: 75, unlocks: ['experimental-crafting', 'teaching-abilities'] },
        master: { level: 100, unlocks: ['legendary-recipes', 'innovation-research'] }
    }
};
```

### Specialization Benefits
- **Reduced Material Costs**: Higher efficiency with specialized materials
- **Increased Success Rates**: Better chance of successful crafting
- **Quality Bonuses**: Higher chance of creating superior items
- **Unique Recipes**: Access to specialization-specific blueprints
- **Batch Efficiency**: Improved large-scale production capabilities

### Teaching & Learning
```javascript
// Knowledge transfer system
class CraftingEducation {
    teachRecipe(teacher, student, recipe) {
        if (!teacher.knowsRecipe(recipe) || teacher.skillLevel < this.getTeachingRequirement(recipe)) {
            return { success: false, reason: 'insufficient-teacher-knowledge' };
        }
        
        const learningSuccess = this.calculateLearningChance(teacher, student, recipe);
        
        if (Math.random() < learningSuccess) {
            student.learnRecipe(recipe);
            teacher.gainTeachingExperience(recipe.difficulty);
            return { success: true, experienceGained: recipe.difficulty * 0.5 };
        }
        
        return { success: false, reason: 'learning-failed' };
    }
}
```

---

## WORKSHOP MANAGEMENT

### Workshop Facilities
```javascript
// Crafting workshop system
const workshopFacilities = {
    basic: {
        maxProjects: 2,
        efficiency: 1.0,
        qualityBonus: 0,
        specializations: ['general-crafting']
    },
    advanced: {
        maxProjects: 4,
        efficiency: 1.2,
        qualityBonus: 5,
        specializations: ['weaponsmithing', 'armorcraft']
    },
    master: {
        maxProjects: 6,
        efficiency: 1.5,
        qualityBonus: 15,
        specializations: ['all'],
        unique: ['experimental-lab', 'quality-control-station']
    }
};
```

### Project Management
- **Queue System**: Multiple crafting projects in parallel
- **Time Management**: Different crafting times for various items
- **Resource Allocation**: Efficient material usage across projects
- **Quality Control**: Post-crafting inspection and improvement
- **Automation**: Advanced workshops support automated processes

### Workshop Upgrades
```javascript
// Workshop improvement system
class WorkshopUpgrades {
    upgradeWorkshop(currentLevel, upgradeType) {
        const requirements = this.getUpgradeRequirements(currentLevel, upgradeType);
        
        return {
            materialCost: requirements.materials,
            skillRequirements: requirements.skills,
            timeRequired: requirements.duration,
            benefits: this.calculateUpgradeBenefits(currentLevel, upgradeType)
        };
    }
    
    calculateUpgradeBenefits(currentLevel, upgradeType) {
        switch(upgradeType) {
            case 'efficiency':
                return { productionSpeed: +20, materialSavings: +10 };
            case 'quality':
                return { qualityBonus: +10, failureReduction: +15 };
            case 'capacity':
                return { maxProjects: +2, storageSpace: +50 };
            case 'specialization':
                return { specializationBonus: +25, uniqueRecipes: +5 };
        }
    }
}
```

---

## INTEGRATION SYSTEMS

### Power Budget Compliance
```javascript
// Ensure all crafted items comply with power budget
class CraftingPowerValidation {
    validateCraftedItem(item, characterLevel) {
        const maxAllowablePower = this.calculateMaxItemPower(characterLevel, item.slot);
        const itemPower = this.calculateItemPower(item);
        
        if (itemPower > maxAllowablePower) {
            return {
                valid: false,
                reason: 'exceeds-power-budget',
                maxAllowed: maxAllowablePower,
                itemPower: itemPower
            };
        }
        
        return { valid: true };
    }
}
```

### Marketplace Integration
- **Crafted Item Identification**: Mark items as player-crafted
- **Crafter Attribution**: Credit original creator in item descriptions
- **Custom Orders**: Commission system for specific items
- **Blueprint Trading**: Buy and sell crafting recipes

### Mission Integration
- **Crafting Missions**: Specialized missions for material gathering
- **Equipment Requirements**: Missions requiring specific crafted items
- **Field Crafting**: Limited crafting capabilities during missions
- **Emergency Repairs**: Quick field maintenance and modification

This crafting system provides deep customization options while maintaining balance with Courier's power budget system and integrating seamlessly with other game systems.