// Skill Calculator - Handles stat calculations and database updates
// Implements generalized skill bonus system

window.SkillCalculator = {
    
    /**
     * Calculate and update character stats from skills
     * @param {number} characterId - Character ID
     * @returns {Promise} Promise resolving to updated stats
     */
    async updateCharacterStats(characterId) {
        try {
            console.log('Updating character stats for character:', characterId);

            // 1. Get purchased skills for character
            const purchasedSkills = await this.getPurchasedSkills(characterId);
            console.log('Found purchased skills:', purchasedSkills.length);

            // 2. Calculate skill bonuses
            const skillBonuses = window.SkillModifiers.calculateSkillBonuses(purchasedSkills);
            console.log('Calculated skill bonuses:', skillBonuses);

            // 3. Apply stat caps
            const cappedBonuses = window.SkillModifiers.applyStatCaps(skillBonuses);
            console.log('Applied caps:', cappedBonuses);

            // 4. Update database with new skill bonuses
            await this.updateSkillBonusesInDatabase(characterId, cappedBonuses);

            // 5. Recalculate total stats (base + equipment + skills)
            const totalStats = await this.recalculateTotalStats(characterId);
            console.log('Recalculated total stats');

            return totalStats;
        } catch (error) {
            console.error('Error updating character stats:', error);
            throw error;
        }
    },

    /**
     * Get purchased skills for a character
     * @param {number} characterId - Character ID
     * @returns {Promise<Array>} Array of skill objects
     */
    async getPurchasedSkills(characterId) {
        const response = await fetch(`/api/character/${characterId}/skills`);
        if (!response.ok) throw new Error('Failed to fetch character skills');
        
        const skills = await response.json();
        return skills.filter(skill => skill.level > 0);
    },

    /**
     * Update skill bonuses in database
     * @param {number} characterId - Character ID  
     * @param {Object} bonuses - Calculated skill bonuses
     */
    async updateSkillBonusesInDatabase(characterId, bonuses) {
        const updates = [];

        // Process simple modifiers (single values)
        Object.keys(bonuses).forEach(statName => {
            if (!Array.isArray(bonuses[statName])) {
                updates.push({
                    stat_name: statName,
                    skill_bonus: bonuses[statName]
                });
            }
        });

        // Process typed modifiers (arrays) - serialize as JSON
        Object.keys(bonuses).forEach(statName => {
            if (Array.isArray(bonuses[statName])) {
                updates.push({
                    stat_name: statName,
                    skill_bonus_typed: JSON.stringify(bonuses[statName])
                });
            }
        });

        // Send batch update to server
        const response = await fetch(`/api/character/${characterId}/stats/skill-bonuses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates })
        });

        if (!response.ok) {
            throw new Error('Failed to update skill bonuses in database');
        }
    },

    /**
     * Recalculate total stats (base + equipment + skills)
     * @param {number} characterId - Character ID
     * @returns {Promise<Object>} Updated total stats
     */
    async recalculateTotalStats(characterId) {
        const response = await fetch(`/api/character/${characterId}/stats/recalculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Failed to recalculate total stats');
        }

        return await response.json();
    },

    /**
     * Get character stats with skill breakdown
     * @param {number} characterId - Character ID
     * @returns {Promise<Object>} Character stats with sources
     */
    async getCharacterStatsDetailed(characterId) {
        const response = await fetch(`/api/character/${characterId}/stats/detailed`);
        if (!response.ok) throw new Error('Failed to fetch detailed character stats');
        
        return await response.json();
    },

    /**
     * Calculate damage output for a character
     * @param {number} characterId - Character ID
     * @param {number} baseDamage - Base weapon damage
     * @returns {Promise<Object>} Damage breakdown by type
     */
    async calculateDamageOutput(characterId, baseDamage) {
        const stats = await this.getCharacterStatsDetailed(characterId);
        
        let damage = { physical: baseDamage };

        // Apply damage conversions
        if (stats.damage_conversion_percent) {
            const conversions = Array.isArray(stats.damage_conversion_percent) 
                ? stats.damage_conversion_percent 
                : JSON.parse(stats.damage_conversion_percent || '[]');
            
            conversions.forEach(conversion => {
                const convertedAmount = baseDamage * conversion.value;
                damage[conversion.type] = (damage[conversion.type] || 0) + convertedAmount;
            });
        }

        // Apply flat damage additions
        if (stats.damage_flat) {
            const flats = Array.isArray(stats.damage_flat)
                ? stats.damage_flat
                : JSON.parse(stats.damage_flat || '[]');
            
            flats.forEach(addition => {
                damage[addition.type] = (damage[addition.type] || 0) + addition.value;
            });
        }

        // Apply damage type multipliers
        if (stats.damage_percent) {
            const multipliers = Array.isArray(stats.damage_percent)
                ? stats.damage_percent
                : JSON.parse(stats.damage_percent || '[]');
            
            multipliers.forEach(multiplier => {
                if (damage[multiplier.type]) {
                    damage[multiplier.type] *= (1 + multiplier.value);
                }
            });
        }

        // Calculate total damage
        damage.total = Object.values(damage).reduce((sum, val) => sum + val, 0) - damage.physical;
        damage.total += damage.physical; // Add physical back once

        return damage;
    },

    /**
     * Calculate resistance mitigation for incoming damage
     * @param {number} characterId - Character ID
     * @param {Object} incomingDamage - Damage by type
     * @returns {Promise<Object>} Mitigated damage and resistances applied
     */
    async calculateDamageMitigation(characterId, incomingDamage) {
        const stats = await this.getCharacterStatsDetailed(characterId);
        const mitigated = { ...incomingDamage };
        const resistancesApplied = {};

        // Apply resistances
        if (stats.resistance_percent) {
            const resistances = Array.isArray(stats.resistance_percent)
                ? stats.resistance_percent
                : JSON.parse(stats.resistance_percent || '[]');

            resistances.forEach(resistance => {
                if (resistance.type === 'all_elemental') {
                    // Apply to all elemental damage types
                    ['fire', 'ice', 'electric', 'earth', 'nature'].forEach(element => {
                        if (mitigated[element]) {
                            const reduction = mitigated[element] * resistance.value;
                            mitigated[element] -= reduction;
                            resistancesApplied[element] = (resistancesApplied[element] || 0) + resistance.value;
                        }
                    });
                } else if (mitigated[resistance.type]) {
                    // Apply to specific damage type
                    const reduction = mitigated[resistance.type] * resistance.value;
                    mitigated[resistance.type] -= reduction;
                    resistancesApplied[resistance.type] = resistance.value;
                }
            });
        }

        // Apply general damage reduction
        if (stats.damage_reduction_percent) {
            const totalDamage = Object.values(mitigated).reduce((sum, val) => sum + val, 0);
            const reduction = totalDamage * stats.damage_reduction_percent;
            
            // Distribute reduction proportionally
            Object.keys(mitigated).forEach(type => {
                const proportion = mitigated[type] / totalDamage;
                mitigated[type] -= reduction * proportion;
            });
        }

        // Ensure no negative damage
        Object.keys(mitigated).forEach(type => {
            mitigated[type] = Math.max(0, mitigated[type]);
        });

        mitigated.total = Object.values(mitigated).reduce((sum, val) => sum + val, 0);

        return {
            mitigatedDamage: mitigated,
            resistancesApplied,
            totalReduction: incomingDamage.total - mitigated.total
        };
    },

    /**
     * Get skill contribution breakdown for a stat
     * @param {number} characterId - Character ID
     * @param {string} statName - Name of the stat
     * @returns {Promise<Array>} Array of contributing skills
     */
    async getSkillContributionBreakdown(characterId, statName) {
        const purchasedSkills = await this.getPurchasedSkills(characterId);
        const contributions = [];

        purchasedSkills.forEach(skill => {
            const modifiers = window.SkillModifiers.getSkillModifiers(skill.skill_id, skill.level);
            
            modifiers.forEach(modifier => {
                if (modifier.name === statName) {
                    contributions.push({
                        skillId: skill.skill_id,
                        skillLevel: skill.level,
                        contribution: modifier.value,
                        damageType: modifier.damageType,
                        statusType: modifier.statusType,
                        condition: modifier.condition
                    });
                }
            });
        });

        return contributions;
    },

    /**
     * Trigger stat recalculation when skills change
     * @param {number} characterId - Character ID
     * @param {string} skillId - Changed skill ID
     * @param {number} newLevel - New skill level
     */
    async onSkillChanged(characterId, skillId, newLevel) {
        console.log(`Skill ${skillId} changed to level ${newLevel} for character ${characterId}`);
        
        // Recalculate character stats
        await this.updateCharacterStats(characterId);
        
        // Emit event for UI updates
        window.dispatchEvent(new CustomEvent('skillStatsUpdated', {
            detail: { characterId, skillId, newLevel }
        }));
    }
};

console.log('SkillCalculator system loaded');