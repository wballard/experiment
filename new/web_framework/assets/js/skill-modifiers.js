// Generalized Skill Modifier System
// Implements the design from skill_implementation_plan.md

window.SkillModifiers = {
    // Skill modifier definitions - maps skill IDs to their stat bonuses
    skillDefinitions: {
        // OUTLAW SKILLS
        'outlaw_dead_eye': {
            stats: [
                { name: 'critical_strike_chance_percent', value: 0.05, perLevel: true }
            ]
        },
        'outlaw_quick_hands': {
            stats: [
                { name: 'reload_speed_percent', value: 0.10, perLevel: true },
                { name: 'handling_percent', value: 0.05, perLevel: true }
            ]
        },
        'outlaw_steady_aim': {
            stats: [
                { name: 'spread_reduction_percent', value: 0.08, perLevel: true },
                { name: 'range_percent', value: 0.10, perLevel: true }
            ]
        },
        'outlaw_hair_trigger': {
            stats: [
                { name: 'fire_rate_percent', value: 0.07, perLevel: true },
                { name: 'recoil_reduction_percent', value: 0.05, perLevel: true }
            ]
        },

        // INFILTRATOR SKILLS
        'infiltrator_assassin_edge': {
            stats: [
                { name: 'critical_strike_chance_percent', value: 0.05, perLevel: true },
                { name: 'critical_strike_damage_percent', value: 0.15, perLevel: true }
            ]
        },
        'infiltrator_elusive': {
            stats: [
                { name: 'movement_speed_percent', value: 0.10, perLevel: false, maxLevel: 1 },
                { name: 'movement_speed_percent', value: 0.20, perLevel: false, minLevel: 2, condition: 'after_kill' }
            ]
        },
        'infiltrator_shadow_affinity': {
            stats: [
                { name: 'stealth_duration_percent', value: 0.10, perLevel: true },
                { name: 'detection_range_percent', value: -0.15, perLevel: true } // negative = harder to detect
            ]
        },

        // SENTINEL SKILLS
        'sentinel_shield_core': {
            stats: [
                { name: 'shield_capacity_percent', value: 0.15, perLevel: true }
            ]
        },
        'sentinel_natural_armor': {
            stats: [
                { name: 'damage_reduction_percent', value: 0.05, perLevel: true }
            ]
        },
        'sentinel_fortification': {
            stats: [
                { name: 'shield_regen_rate_percent', value: 0.10, perLevel: true },
                { name: 'shield_delay_reduction_percent', value: 0.10, perLevel: true } // 1 second = 0.10
            ]
        },

        // DOCTOR SKILLS
        'doctor_totem_fundamentals': {
            stats: [
                { name: 'totem_limit', value: 1, perLevel: true } // flat bonus
            ]
        },
        'doctor_field_medic': {
            stats: [
                { name: 'totem_radius_percent', value: 0.15, perLevel: true },
                { name: 'totem_power_percent', value: 0.10, perLevel: true }
            ]
        },
        'doctor_combat_training': {
            stats: [
                { name: 'weapon_damage_percent', value: 0.25, perLevel: false, condition: 'near_totems' }
            ]
        },

        // ELEMENTAL SKILLS (Generalized)
        'fire_combustion_mastery': {
            stats: [
                { 
                    name: 'damage_percent', 
                    value: 0.10, 
                    perLevel: true,
                    damageType: 'fire'
                }
            ]
        },
        'fire_heat_resistance': {
            stats: [
                { 
                    name: 'resistance_percent', 
                    value: 0.25, 
                    perLevel: true,
                    damageType: 'fire'
                }
            ]
        },
        'ice_cryogenic_mastery': {
            stats: [
                { 
                    name: 'damage_percent', 
                    value: 0.10, 
                    perLevel: true,
                    damageType: 'ice'
                },
                {
                    name: 'status_duration_percent',
                    value: 0.50,
                    perLevel: true,
                    statusType: 'freeze'
                }
            ]
        },
        'ice_cold_resistance': {
            stats: [
                { 
                    name: 'resistance_percent', 
                    value: 0.25, 
                    perLevel: true,
                    damageType: 'ice'
                },
                {
                    name: 'status_resistance_percent',
                    value: 1.0, // immunity at max level
                    perLevel: false,
                    minLevel: 2,
                    statusType: 'freeze'
                }
            ]
        },
        'electric_electrical_mastery': {
            stats: [
                { 
                    name: 'damage_percent', 
                    value: 0.10, 
                    perLevel: true,
                    damageType: 'electric'
                },
                {
                    name: 'chain_targets',
                    value: 1,
                    perLevel: true // 1-3 additional targets per level
                }
            ]
        },
        'electric_conductivity': {
            stats: [
                { 
                    name: 'resistance_percent', 
                    value: 0.25, 
                    perLevel: true,
                    damageType: 'electric'
                },
                {
                    name: 'energy_on_electric_damage',
                    value: 5,
                    perLevel: true
                }
            ]
        },
        'earth_geological_mastery': {
            stats: [
                { 
                    name: 'damage_percent', 
                    value: 0.15, 
                    perLevel: true,
                    damageType: 'earth'
                },
                {
                    name: 'damage_reduction_percent',
                    value: [0.20, 0.35, 0.50], // different per level
                    perLevel: false,
                    levelValues: true
                }
            ]
        },
        'nature_natural_mastery': {
            stats: [
                { 
                    name: 'damage_percent', 
                    value: 0.10, 
                    perLevel: true,
                    damageType: 'nature'
                },
                {
                    name: 'healing_effectiveness_percent',
                    value: [0.25, 0.50, 0.75], // 25%/50%/75% per level
                    perLevel: false,
                    levelValues: true
                }
            ]
        }
    },

    // Damage type mappings for generalized system
    damageTypes: ['physical', 'fire', 'ice', 'electric', 'earth', 'nature'],
    
    // Status effect mappings
    statusEffects: {
        'fire': 'burn',
        'ice': 'freeze', 
        'electric': 'shock',
        'earth': 'fracture',
        'nature': 'toxin'
    },

    /**
     * Get all modifiers for a specific skill at a given level
     * @param {string} skillId - The skill ID
     * @param {number} level - The skill level (1-based)
     * @returns {Array} Array of calculated modifier objects
     */
    getSkillModifiers(skillId, level) {
        const skillDef = this.skillDefinitions[skillId];
        if (!skillDef) return [];

        const modifiers = [];

        skillDef.stats.forEach(stat => {
            // Check level requirements
            if (stat.minLevel && level < stat.minLevel) return;
            if (stat.maxLevel && level > stat.maxLevel) return;

            let calculatedValue;

            if (stat.levelValues && Array.isArray(stat.value)) {
                // Use specific values per level
                calculatedValue = stat.value[level - 1] || 0;
            } else if (stat.perLevel) {
                // Multiply by level
                calculatedValue = stat.value * level;
            } else {
                // Fixed value
                calculatedValue = stat.value;
            }

            // Create modifier object
            const modifier = {
                name: stat.name,
                value: calculatedValue,
                condition: stat.condition || null,
                damageType: stat.damageType || null,
                statusType: stat.statusType || null
            };

            modifiers.push(modifier);
        });

        return modifiers;
    },

    /**
     * Calculate total skill bonuses for a character
     * @param {Array} purchasedSkills - Array of {skill_id, level} objects
     * @returns {Object} Aggregated bonuses by stat type
     */
    calculateSkillBonuses(purchasedSkills) {
        const aggregatedBonuses = {};

        purchasedSkills.forEach(skill => {
            const modifiers = this.getSkillModifiers(skill.skill_id, skill.level);

            modifiers.forEach(modifier => {
                if (modifier.damageType || modifier.statusType) {
                    // Handle typed modifiers (arrays)
                    if (!aggregatedBonuses[modifier.name]) {
                        aggregatedBonuses[modifier.name] = [];
                    }

                    // Find existing modifier of same type
                    const existingIndex = aggregatedBonuses[modifier.name].findIndex(
                        existing => (existing.type === modifier.damageType || existing.type === modifier.statusType)
                    );

                    const modifierType = modifier.damageType || modifier.statusType;
                    
                    if (existingIndex >= 0) {
                        // Add to existing
                        aggregatedBonuses[modifier.name][existingIndex].value += modifier.value;
                    } else {
                        // Create new entry
                        aggregatedBonuses[modifier.name].push({
                            type: modifierType,
                            value: modifier.value,
                            condition: modifier.condition
                        });
                    }
                } else {
                    // Handle simple modifiers (single values)
                    if (!aggregatedBonuses[modifier.name]) {
                        aggregatedBonuses[modifier.name] = 0;
                    }
                    aggregatedBonuses[modifier.name] += modifier.value;
                }
            });
        });

        return aggregatedBonuses;
    },

    /**
     * Apply stat caps and limits
     * @param {Object} bonuses - Calculated bonuses
     * @returns {Object} Capped bonuses
     */
    applyStatCaps(bonuses) {
        const capped = { ...bonuses };

        // Apply caps from unified-stat-system.md
        if (capped.critical_strike_chance_percent > 0.50) {
            capped.critical_strike_chance_percent = 0.50; // 50% cap
        }

        if (capped.shield_delay_reduction_percent > 0.50) {
            capped.shield_delay_reduction_percent = 0.50; // 50% cap
        }

        if (capped.shield_regen_rate_percent > 3.00) {
            capped.shield_regen_rate_percent = 3.00; // 300% cap
        }

        if (capped.movement_speed_percent > 0.30) {
            capped.movement_speed_percent = 0.30; // 30% soft cap
        }

        // Apply caps to typed modifiers
        if (capped.resistance_percent) {
            capped.resistance_percent.forEach(resistance => {
                if (resistance.type !== 'all_elemental' && resistance.value > 0.75) {
                    resistance.value = 0.75; // 75% per element cap
                }
            });
        }

        return capped;
    }
};

console.log('SkillModifiers system loaded with', Object.keys(window.SkillModifiers.skillDefinitions).length, 'skill definitions');