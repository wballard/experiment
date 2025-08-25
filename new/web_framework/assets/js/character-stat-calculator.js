// Character Stat Calculator Engine
// Implements the 113-stat calculation system from comprehensive-character-stats-complete.md

window.CharacterStatCalculator = {
    
    // Base stat definitions with formulas
    baseStats: {
        // Primary Attributes (Equipment + Skills Only - NO Player Allocation)
        vitality: { base: 0, formula: 'equipment + skills' },
        precision: { base: 0, formula: 'equipment + skills' },
        potency: { base: 0, formula: 'equipment + skills' },
        alacrity: { base: 0, formula: 'equipment + skills' },
        capacity: { base: 0, formula: 'equipment + skills' },
        defense: { base: 0, formula: 'equipment + skills' },
        
        // Health & Survivability (Derived from attributes + bonuses)
        health: { base: 100, formula: 'base + (vitality * 5) + equipment + skills' },
        shield_capacity: { base: 50, formula: 'base + (vitality * 2) + equipment + skills' },
        health_regeneration_rate: { base: 1.0, formula: 'base + (vitality * 0.1) + equipment + skills' },
        health_regeneration_delay: { base: 5.0, formula: 'base + equipment + skills' },
        shield_regeneration_rate: { base: 0.5, formula: 'base + equipment + skills' },
        shield_delay: { base: 2.0, formula: 'base + equipment + skills' },
        shield_delay_change_percent: { base: 0, formula: '0 + equipment + skills', cap: 0.50 },
        damage_reduction_percent: { base: 0, formula: '0 + (defense * 0.1) + equipment + skills' },
        healing_effectiveness_percent: { base: 100, formula: 'base + equipment + skills' },
        shield_gate_percent: { base: 0, formula: '0 + equipment + skills' },
        recovery_speed_percent: { base: 100, formula: 'base + equipment + skills' },
        revival_speed_percent: { base: 100, formula: 'base + equipment + skills' },
        
        // Critical Strike & Accuracy (Derived)
        critical_strike_chance_percent: { base: 5.0, formula: 'base + (precision * 0.5) + equipment + skills', cap: 50 },
        critical_strike_damage_percent: { base: 150.0, formula: 'base + (precision * 0.2) + equipment + skills' },
        accuracy_percent: { base: 75.0, formula: 'base + (precision * 1.0) + equipment + skills' },
        weak_spot_damage_percent: { base: 200.0, formula: 'base + equipment + skills' },
        
        // Primary Weapon Base Stats (From Weapon Item)
        primary_weapon_damage_min: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_damage_max: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_base_magazine: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_base_reload_time: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_base_ads_time: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_base_fire_rate: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_base_range: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_base_recoil: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_base_spread: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_base_handling: { base: 0, formula: 'weapon_value_only' },
        primary_weapon_type: { base: '', formula: 'weapon_value_only' },
        
        // Secondary Weapon Base Stats (From Weapon Item)
        secondary_weapon_damage_min: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_damage_max: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_base_magazine: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_base_reload_time: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_base_ads_time: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_base_fire_rate: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_base_range: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_base_recoil: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_base_spread: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_base_handling: { base: 0, formula: 'weapon_value_only' },
        secondary_weapon_type: { base: '', formula: 'weapon_value_only' },
        // Universal Weapon Modifiers (Apply to All Weapons)
        magazine_size_change_percent: { base: 0, formula: '0 + equipment + skills' },
        reload_speed_percent: { base: 0, formula: '0 + equipment + skills' },
        ads_speed_percent: { base: 0, formula: '0 + equipment + skills' },
        fire_rate_percent: { base: 0, formula: '0 + equipment + skills' },
        range_percent: { base: 0, formula: '0 + equipment + skills' },
        recoil_reduction_percent: { base: 0, formula: '0 + equipment + skills' },
        spread_reduction_percent: { base: 0, formula: '0 + equipment + skills' },
        handling_percent: { base: 0, formula: '0 + equipment + skills' },
        armor_penetration_percent: { base: 0, formula: '0 + equipment + skills' },
        projectile_speed_percent: { base: 0, formula: '0 + equipment + skills' },
        projectile_count_bonus: { base: 0, formula: '0 + equipment + skills' },
        ricochet_chance_percent: { base: 0, formula: '0 + equipment + skills' },
        piercing_targets_bonus: { base: 0, formula: '0 + equipment + skills' },
        
        // Additional Weapon Mechanics (from comprehensive document)
        fire_rate_modifier: { base: 0, formula: '0 + equipment + skills' },
        attack_speed: { base: 100, formula: 'base + (alacrity * 0.4) + equipment + skills' },
        magazine_size: { base: 0, formula: 'weapon_value + equipment + skills' },
        ammo_capacity_modifier: { base: 0, formula: '0 + equipment + skills' },
        reload_speed_modifier: { base: 0, formula: '0 + equipment + skills' },
        ads_speed_modifier: { base: 0, formula: '0 + equipment + skills' },
        ads_movement_percent: { base: 0, formula: '0 + equipment + skills' },
        recoil_control: { base: 0, formula: '0 + equipment + skills' },
        weapon_stability: { base: 0, formula: 'weapon_value + equipment + skills' },
        weapon_sway: { base: 0, formula: 'weapon_value + equipment + skills' },
        projectile_velocity: { base: 0, formula: 'weapon_value + equipment + skills' },
        weapon_range: { base: 0, formula: 'weapon_value + equipment + skills' },
        damage_falloff_start: { base: 0, formula: 'weapon_value + equipment + skills' },
        spread_angle: { base: 0, formula: 'weapon_value + equipment + skills' },
        spread_recovery: { base: 0, formula: 'weapon_value + equipment + skills' },
        
        // Movement & Mobility (Derived)
        movement_speed: { base: 100, formula: 'base + (alacrity * 0.4) + equipment + skills' },
        movement_speed_percent: { base: 0, formula: '0 + (alacrity * 0.4) + equipment + skills', cap: 30 },
        sprint_speed: { base: 130, formula: 'base + equipment + skills' },
        sprint_speed_percent: { base: 0, formula: '0 + equipment + skills' },
        crouch_speed: { base: 60, formula: 'base + equipment + skills' },
        crouch_speed_percent: { base: 0, formula: '0 + equipment + skills' },
        jump_height: { base: 100, formula: 'base + equipment + skills' },
        jump_height_percent: { base: 0, formula: '0 + equipment + skills' },
        slide_distance: { base: 100, formula: 'base + equipment + skills' },
        slide_speed_percent: { base: 0, formula: '0 + equipment + skills' },
        slide_duration_percent: { base: 0, formula: '0 + equipment + skills' },
        dodge_distance: { base: 100, formula: 'base + equipment + skills' },
        dodge_distance_percent: { base: 0, formula: '0 + equipment + skills' },
        dodge_cooldown_change_percent: { base: 0, formula: '0 + equipment + skills' },
        dodge_cooldown_percent: { base: 0, formula: '0 + equipment + skills' },
        air_control_percent: { base: 0, formula: '0 + equipment + skills' },
        fall_damage_reduction_percent: { base: 0, formula: '0 + equipment + skills' },
        
        // Ability & Cooldown System (NO ENERGY)
        cooldown_reduction_percent: { base: 0, formula: '0 + (capacity * 0.2) + equipment + skills' },
        ability_damage_percent: { base: 0, formula: '0 + (capacity * 0.5) + equipment + skills' },
        ability_radius_percent: { base: 0, formula: '0 + equipment + skills' },
        ability_duration_percent: { base: 0, formula: '0 + equipment + skills' },
        ability_range_percent: { base: 0, formula: '0 + equipment + skills' },
        ultimate_charge_rate_percent: { base: 0, formula: '0 + equipment + skills' },
        ability_cost_reduction_percent: { base: 0, formula: '0 + equipment + skills' },
        combo_damage_percent: { base: 0, formula: '0 + equipment + skills' },
        
        // Power Budget System (Keep existing)
        power_max: { base: 300, formula: 'base + (level * 50) + equipment + skills' },
        power_efficiency_item_bonus: { base: 0, formula: '0 + item_rarity_bonus' }, // Item-only
        loadout_power_cost: { base: 0, formula: 'sum_of_equipped_item_costs' }
    },
    
    // Typed stats - these use JSON arrays for flexible typing
    typedStats: {
        damage_percent: { types: ['physical', 'fire', 'ice', 'electric', 'earth', 'nature'] },
        weapon_type_damage_flat: { types: ['sniper', 'assault_rifle', 'shotgun', 'smg', 'pistol', 'heavy'] },
        weapon_type_damage_percent: { types: ['sniper', 'assault_rifle', 'shotgun', 'smg', 'pistol', 'heavy'] },
        resistance_percent: { types: ['physical', 'fire', 'ice', 'electric', 'earth', 'nature'], cap: 75 },
        status_effect_chance: { types: ['burn', 'freeze', 'shock', 'fracture', 'toxin'] },
        status_effect_duration_percent: { types: ['burn', 'freeze', 'shock', 'fracture', 'toxin'] },
        status_effect_resistance: { types: ['burn', 'freeze', 'shock', 'fracture', 'toxin'] },
        damage_vs_target_percent: { types: ['boss', 'elite', 'armored', 'shielded', 'aerial'] },
        ammo_capacity: { types: ['sniper', 'assault_rifle', 'shotgun', 'smg', 'pistol', 'heavy'] },
        cooldown_reduction_typed: { types: ['grenade', 'utility', 'ultimate', 'class_ability'] },
        class_skill_modifier: { types: ['stealth', 'drone', 'shield', 'totem'] }
    },
    
    /**
     * Calculate all stats for a character
     * @param {number} characterId - Character ID
     * @param {Object} characterData - Character data with level, skills, equipment
     * @returns {Object} Calculated stats
     */
    async calculateAllStats(characterId, characterData) {
        const stats = {};
        
        // Get equipment bonuses
        const equipmentBonuses = await this.getEquipmentBonuses(characterData.equipment || []);
        
        // Get skill bonuses (use existing system)
        const skillBonuses = await this.getSkillBonuses(characterData.skills || []);
        
        // Calculate primary attributes first (no player allocation)
        const attributes = this.calculateAttributes(equipmentBonuses, skillBonuses);
        
        // Calculate all base stats
        for (const [statName, statDef] of Object.entries(this.baseStats)) {
            stats[statName] = this.calculateStat(
                statName, 
                statDef, 
                attributes, 
                equipmentBonuses, 
                skillBonuses, 
                characterData
            );
        }
        
        // Calculate typed stats
        const typedStats = this.calculateTypedStats(equipmentBonuses, skillBonuses, attributes);
        Object.assign(stats, typedStats);
        
        return stats;
    },
    
    /**
     * Calculate primary attributes from equipment + skills only
     */
    calculateAttributes(equipmentBonuses, skillBonuses) {
        return {
            vitality: (equipmentBonuses.vitality || 0) + (skillBonuses.vitality || 0),
            precision: (equipmentBonuses.precision || 0) + (skillBonuses.precision || 0),
            potency: (equipmentBonuses.potency || 0) + (skillBonuses.potency || 0),
            alacrity: (equipmentBonuses.alacrity || 0) + (skillBonuses.alacrity || 0),
            capacity: (equipmentBonuses.capacity || 0) + (skillBonuses.capacity || 0),
            defense: (equipmentBonuses.defense || 0) + (skillBonuses.defense || 0)
        };
    },
    
    /**
     * Calculate a single stat using its formula
     */
    calculateStat(statName, statDef, attributes, equipmentBonuses, skillBonuses, characterData) {
        let value = statDef.base;
        
        // Apply attribute scaling
        if (statDef.formula.includes('vitality')) {
            const multiplier = this.extractMultiplier(statDef.formula, 'vitality');
            value += attributes.vitality * multiplier;
        }
        if (statDef.formula.includes('precision')) {
            const multiplier = this.extractMultiplier(statDef.formula, 'precision');
            value += attributes.precision * multiplier;
        }
        if (statDef.formula.includes('potency')) {
            const multiplier = this.extractMultiplier(statDef.formula, 'potency');
            value += attributes.potency * multiplier;
        }
        if (statDef.formula.includes('alacrity')) {
            const multiplier = this.extractMultiplier(statDef.formula, 'alacrity');
            value += attributes.alacrity * multiplier;
        }
        if (statDef.formula.includes('capacity')) {
            const multiplier = this.extractMultiplier(statDef.formula, 'capacity');
            value += attributes.capacity * multiplier;
        }
        if (statDef.formula.includes('defense')) {
            const multiplier = this.extractMultiplier(statDef.formula, 'defense');
            value += attributes.defense * multiplier;
        }
        
        // Apply level scaling
        if (statDef.formula.includes('level')) {
            const multiplier = this.extractMultiplier(statDef.formula, 'level');
            value += (characterData.level || 1) * multiplier;
        }
        
        // Apply equipment bonuses
        value += equipmentBonuses[statName] || 0;
        
        // Apply skill bonuses
        value += skillBonuses[statName] || 0;
        
        // Apply caps
        if (statDef.cap && value > statDef.cap) {
            value = statDef.cap;
        }
        
        return value;
    },
    
    /**
     * Extract multiplier from formula string
     */
    extractMultiplier(formula, attribute) {
        const regex = new RegExp(`\\(${attribute} \\* ([0-9.]+)\\)`);
        const match = formula.match(regex);
        return match ? parseFloat(match[1]) : 0;
    },
    
    /**
     * Calculate typed stats with flexible arrays
     */
    calculateTypedStats(equipmentBonuses, skillBonuses, attributes) {
        const typedStats = {};
        
        for (const [statName, statDef] of Object.entries(this.typedStats)) {
            const statArray = [];
            
            for (const type of statDef.types) {
                let value = 0;
                
                // Add equipment bonuses for this type
                if (equipmentBonuses[statName] && Array.isArray(equipmentBonuses[statName])) {
                    const equipmentBonus = equipmentBonuses[statName].find(b => b.type === type);
                    if (equipmentBonus) {
                        value += equipmentBonus.value;
                    }
                }
                
                // Add skill bonuses for this type
                if (skillBonuses[statName] && Array.isArray(skillBonuses[statName])) {
                    const skillBonus = skillBonuses[statName].find(b => b.type === type);
                    if (skillBonus) {
                        value += skillBonus.value;
                    }
                }
                
                // Special case: status effect resistance gets 50% of elemental resistance
                if (statName === 'status_effect_resistance') {
                    const elementMap = { burn: 'fire', freeze: 'ice', shock: 'electric', fracture: 'earth', toxin: 'nature' };
                    const elementType = elementMap[type];
                    if (elementType && typedStats.resistance_percent) {
                        const elementResistance = typedStats.resistance_percent.find(r => r.type === elementType);
                        if (elementResistance) {
                            value += elementResistance.value * 0.5;
                        }
                    }
                }
                
                // Apply caps
                if (statDef.cap && value > statDef.cap) {
                    value = statDef.cap;
                }
                
                // Only include if value > 0
                if (value > 0) {
                    statArray.push({ type, value });
                }
            }
            
            typedStats[statName] = statArray;
        }
        
        return typedStats;
    },
    
    /**
     * Get equipment bonuses from equipped items
     */
    async getEquipmentBonuses(equippedItems) {
        const bonuses = {};
        
        for (const item of equippedItems) {
            // Process main modifiers (attribute bonuses)
            if (item.main_modifiers) {
                const mainMods = typeof item.main_modifiers === 'string' 
                    ? JSON.parse(item.main_modifiers) 
                    : item.main_modifiers;
                    
                for (const [stat, value] of Object.entries(mainMods)) {
                    bonuses[stat] = (bonuses[stat] || 0) + value;
                }
            }
            
            // Process extra modifiers (typed bonuses)
            if (item.extra_modifiers) {
                const extraMods = typeof item.extra_modifiers === 'string'
                    ? JSON.parse(item.extra_modifiers)
                    : item.extra_modifiers;
                    
                for (const mod of extraMods) {
                    if (mod.damageType || mod.weaponType || mod.statusType) {
                        // Handle typed modifiers
                        if (!bonuses[mod.name]) bonuses[mod.name] = [];
                        
                        const type = mod.damageType || mod.weaponType || mod.statusType;
                        const existing = bonuses[mod.name].find(b => b.type === type);
                        
                        if (existing) {
                            existing.value += mod.value;
                        } else {
                            bonuses[mod.name].push({ type, value: mod.value });
                        }
                    } else {
                        // Handle simple modifiers
                        bonuses[mod.name] = (bonuses[mod.name] || 0) + mod.value;
                    }
                }
            }
        }
        
        return bonuses;
    },
    
    /**
     * Get skill bonuses (integrate with existing skill system)
     */
    async getSkillBonuses(purchasedSkills) {
        if (window.SkillModifiers) {
            return window.SkillModifiers.calculateSkillBonuses(purchasedSkills);
        }
        return {};
    },
    
    /**
     * Store calculated stats in database
     */
    async saveCalculatedStats(characterId, calculatedStats) {
        try {
            const response = await fetch('/api/character-stats/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    characterId,
                    stats: calculatedStats
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save stats: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving calculated stats:', error);
            throw error;
        }
    }
};

console.log('CharacterStatCalculator loaded with 113-stat system');